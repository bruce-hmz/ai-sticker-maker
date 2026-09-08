import { describe, expect, it, vi } from "vitest";
import { isRetryablePackError, runSerialQueue } from "./schedule";
import { REACTION_IDS, REACTIONS, createPack, getReaction } from "./types";
import { buildPackPrompt } from "./prompt";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("pack model", () => {
  it("creates a pack with exactly the 6 P0 reactions, all queued", () => {
    const pack = createPack();
    expect(pack.stickers).toHaveLength(6);
    expect(pack.stickers.map((s) => s.reaction)).toEqual([...REACTION_IDS]);
    expect(pack.stickers.every((s) => s.status === "queued")).toBe(true);
    expect(pack.packId).toMatch(/^pack_/);
  });

  it("reactions cover laughing, crying, angry, shocked, love, sleepy", () => {
    expect(REACTIONS.map((r) => r.id)).toEqual([
      "laughing",
      "crying",
      "angry",
      "shocked",
      "love",
      "sleepy",
    ]);
    expect(getReaction("love")?.modifier).toContain("heart");
    expect(getReaction("nope")).toBeUndefined();
  });

  it("prompt template shares the identity lock and only swaps the reaction", () => {
    const prompts = REACTIONS.map((r) => buildPackPrompt(r));
    for (const p of prompts) {
      expect(p).toContain("[IDENTITY LOCK]");
      expect(p).toContain("[STICKER STYLE]");
      expect(p).toContain("[CONSTRAINTS]");
      expect(p).toContain("Do not change the identity");
    }
    // Everything except the [REACTION] block must be identical across the pack.
    const strip = (p: string) => p.replace(/\[REACTION\][\s\S]*?(?=\[CONSTRAINTS\])/, "");
    const unique = new Set(prompts.map(strip));
    expect(unique.size).toBe(1);
    // And each prompt carries its own reaction modifier.
    expect(buildPackPrompt(getReaction("sleepy")!)).toContain("Zzz");
    expect(buildPackPrompt(getReaction("laughing")!)).toContain("laughing joyfully");
  });
});

describe("serial queue (concurrency = 1)", () => {
  it("runs 6 tasks strictly serially — never more than one in flight", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    const order: string[] = [];

    const tasks = REACTION_IDS.map((id) => ({
      id,
      run: async () => {
        inFlight++;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await delay(5);
        order.push(id);
        inFlight--;
        return id.toUpperCase();
      },
    }));

    const result = await runSerialQueue(tasks);
    expect(maxInFlight).toBe(1);
    expect(order).toEqual([...REACTION_IDS]);
    expect(result.succeeded).toHaveLength(6);
    expect(result.failed).toHaveLength(0);
    expect(result.succeeded.map((s) => s.value)).toEqual(
      REACTION_IDS.map((id) => id.toUpperCase()),
    );
  });

  it("supports partial failure: one bad sticker does not sink the pack", async () => {
    const tasks = REACTION_IDS.map((id) => ({
      id,
      run: async () => {
        if (id === "angry") throw new Error("Sticker generation failed. Please retry. (502)");
        return id;
      },
    }));
    const result = await runSerialQueue(tasks, { retries: 0 });
    expect(result.succeeded).toHaveLength(5);
    expect(result.failed.map((f) => f.id)).toEqual(["angry"]);
  });

  it("total provider failure: every task fails, queue still completes", async () => {
    const tasks = REACTION_IDS.map((id) => ({
      id,
      run: async () => {
        throw new Error("Sticker request failed (503)");
      },
    }));
    const result = await runSerialQueue(tasks, { retries: 0 });
    expect(result.succeeded).toHaveLength(0);
    expect(result.failed).toHaveLength(6);
  });

  it("retries retryable failures (429) then succeeds", async () => {
    let attempts = 0;
    const task = {
      id: "laughing",
      run: async () => {
        attempts++;
        if (attempts === 1) throw new Error("Too many requests (429)");
        return "ok";
      },
    };
    const result = await runSerialQueue([task], { retries: 2, retryDelayMs: 1 });
    expect(attempts).toBe(2);
    expect(result.succeeded[0]?.value).toBe("ok");
  });

  it("does NOT retry non-retryable failures (400)", async () => {
    let attempts = 0;
    const task = {
      id: "laughing",
      run: async () => {
        attempts++;
        throw new Error("bad request (400)");
      },
    };
    const result = await runSerialQueue([task], { retries: 3, retryDelayMs: 1 });
    expect(attempts).toBe(1);
    expect(result.failed).toHaveLength(1);
  });

  it("stops scheduling between tasks when cancelled", async () => {
    const ran: string[] = [];
    const tasks = REACTION_IDS.map((id) => ({
      id,
      run: async () => {
        ran.push(id);
        return id;
      },
    }));
    const result = await runSerialQueue(tasks, {
      retries: 0,
      shouldStop: () => ran.length >= 2,
    });
    expect(ran).toEqual(["laughing", "crying"]);
    expect(result.succeeded).toHaveLength(2);
  });

  it("retryability classification", () => {
    expect(isRetryablePackError(new Error("Too many requests (429)"))).toBe(true);
    expect(isRetryablePackError(new Error("Sticker request failed (network)"))).toBe(true);
    expect(isRetryablePackError(new Error("Sticker generation failed (502)"))).toBe(true);
    expect(isRetryablePackError(new Error("'reaction' must be one of… (400)"))).toBe(false);
    expect(isRetryablePackError("not an error")).toBe(false);
  });
});

describe("regenerate-one semantics", () => {
  it("a single-reaction queue run touches only that reaction's task", async () => {
    const calls: string[] = [];
    const reaction = getReaction("angry")!;
    const result = await runSerialQueue(
      [{ id: reaction.id, run: async () => { calls.push(reaction.id); return "regenerated"; } }],
      { retries: 0 },
    );
    expect(calls).toEqual(["angry"]);
    expect(result.succeeded[0]?.value).toBe("regenerated");
  });
});
