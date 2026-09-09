import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("session resume state", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("round-trips a pack session and reports completed/missing reactions", async () => {
    const session = await import("./session");
    session.savePackSession({
      packId: "pack_x",
      startedAt: 1000,
      savedAt: 2000,
      stickers: [
        { reaction: "laughing", status: "completed", imageUrl: "data:image/png;base64,AAA" },
        { reaction: "love", status: "failed" },
        { reaction: "shocked", status: "queued" },
        { reaction: "angry", status: "queued" },
        { reaction: "crying", status: "queued" },
        { reaction: "sleepy", status: "queued" },
      ],
    });
    const loaded = session.loadPackSession();
    expect(loaded?.packId).toBe("pack_x");
    expect(loaded?.stickers).toHaveLength(6);
    expect(session.completedCount(loaded!)).toBe(1);
    expect(session.hasCompletableWork(loaded!)).toBe(true);
    expect(session.missingReactions(loaded!)).toEqual([
      "love",
      "shocked",
      "angry",
      "crying",
      "sleepy",
    ]);
  });

  it("a fully completed session has no missing work", async () => {
    const session = await import("./session");
    session.savePackSession({
      packId: "pack_done",
      startedAt: 1,
      savedAt: 2,
      stickers: [
        "laughing",
        "love",
        "shocked",
        "angry",
        "crying",
        "sleepy",
      ].map((r) => ({ reaction: r as never, status: "completed" as const })),
    });
    const loaded = session.loadPackSession()!;
    expect(session.missingReactions(loaded)).toEqual([]);
    expect(session.hasCompletableWork(loaded)).toBe(false);
  });

  it("quota errors are swallowed (resume is best-effort, never crashes)", async () => {
    const session = await import("./session");
    const orig = sessionStorage.setItem;
    sessionStorage.setItem = vi.fn(() => {
      throw new DOMException("QuotaExceededError");
    });
    expect(() =>
      session.savePackSession({
        packId: "p",
        startedAt: 1,
        savedAt: 2,
        stickers: [],
      }),
    ).not.toThrow();
    sessionStorage.setItem = orig;
  });

  it("clearPackSession removes state; load returns null when empty", async () => {
    const session = await import("./session");
    session.savePackSession({
      packId: "p",
      startedAt: 1,
      savedAt: 2,
      stickers: [],
    });
    session.clearPackSession();
    expect(session.loadPackSession()).toBeNull();
  });
});

describe("analytics P1 additions", () => {
  beforeEach(() => {
    (globalThis as { gtag?: unknown }).gtag = undefined;
  });
  afterEach(() => {
    delete (globalThis as { gtag?: unknown }).gtag;
  });

  it("beacon events carry transport_type=beacon", async () => {
    const { trackPackEventBeacon } = await import("./analytics");
    const calls: unknown[][] = [];
    (globalThis as { gtag?: unknown }).gtag = (...args: unknown[]) => calls.push(args);
    trackPackEventBeacon("pack_abandoned", { completedCount: 2, elapsedMs: 90000 });
    const payload = calls[0][2] as Record<string, unknown>;
    expect(payload.transport_type).toBe("beacon");
    expect(payload.completedCount).toBe(2);
  });

  it("forbidden keys still stripped in beacon path (data URLs, filenames)", async () => {
    const { trackPackEventBeacon } = await import("./analytics");
    const calls: unknown[][] = [];
    (globalThis as { gtag?: unknown }).gtag = (...args: unknown[]) => calls.push(args);
    trackPackEventBeacon("photo_uploaded", {
      filename: "selfie.jpg",
      url: "blob:https://x/1",
      fileType: "image/jpeg",
    } as never);
    const payload = calls[0][2] as Record<string, unknown>;
    expect(payload).toEqual({ fileType: "image/jpeg", transport_type: "beacon" });
  });

  it("upload buckets classify size and dimensions", async () => {
    const { fileSizeBucket, dimensionBucket, providerStatusFromError } = await import("./analytics");
    expect(fileSizeBucket(500_000)).toBe("<1MB");
    expect(fileSizeBucket(3 * 1024 * 1024)).toBe("1-5MB");
    expect(fileSizeBucket(8 * 1024 * 1024)).toBe("5-10MB");
    expect(dimensionBucket(400, 300)).toBe("<512");
    expect(dimensionBucket(1080, 1440)).toBe("1024-2047");
    expect(dimensionBucket(4096, 100)).toBe(">=2048");
    expect(providerStatusFromError("Too many requests (429)")).toBe(429);
    expect(providerStatusFromError("no status here")).toBeNull();
  });

  it("landingContext classifies device/viewport/referrer coarsely", async () => {
    const { landingContext } = await import("./analytics");
    const ctx = landingContext();
    expect(["mobile", "tablet", "desktop"]).toContain(ctx.deviceClass);
    expect(["<640", "640-1023", "1024-1279", ">=1280"]).toContain(ctx.viewportClass);
  });
});

describe("queue error callbacks (provider instrumentation)", () => {
  it("onTaskError reports willRetry=true then false for a persistent failure", async () => {
    const { runSerialQueue } = await import("./schedule");
    const seen: Array<[string, number, boolean]> = [];
    let attempts = 0;
    await runSerialQueue(
      [
        {
          id: "love",
          run: async () => {
            attempts++;
            throw new Error("Too many requests (429)");
          },
        },
      ],
      {
        retries: 1,
        retryDelayMs: 1,
        onTaskError: (id, _err, attempt, willRetry) => seen.push([id, attempt, willRetry]),
      },
    );
    expect(seen).toEqual([
      ["love", 1, true],
      ["love", 2, false],
    ]);
    expect(attempts).toBe(2);
  });
});
