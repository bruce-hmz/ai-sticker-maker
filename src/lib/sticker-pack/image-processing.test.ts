import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BackgroundRemovalError,
  canvasHasAlpha,
  zipStickerPack,
} from "./image-processing";
import { trackPackEvent } from "./analytics";

// Minimal fake 2D context — only what canvasHasAlpha uses.
function fakeCtx(alphaPattern: number[], width = 4, height = 4) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    data[p * 4] = 255;
    data[p * 4 + 1] = 128;
    data[p * 4 + 2] = 0;
    data[p * 4 + 3] = alphaPattern[p % alphaPattern.length];
  }
  return {
    canvas: { width, height },
    getImageData: (x: number, y: number, w: number, h: number) => ({ data, width: w, height: h }),
  } as unknown as CanvasRenderingContext2D;
}

describe("background removal", () => {
  it("successful removal: canvas with transparent pixels reports alpha", () => {
    // half the pixels fully transparent, rest opaque
    expect(canvasHasAlpha(fakeCtx([0, 255]))).toBe(true);
  });

  it("partial alpha (anti-aliased edges) counts as transparent", () => {
    expect(canvasHasAlpha(fakeCtx([128, 255]))).toBe(true);
  });

  it("failed removal: fully opaque canvas reports NO alpha (not a transparent PNG)", () => {
    expect(canvasHasAlpha(fakeCtx([255, 255, 255, 255]))).toBe(false);
  });

  it("cleanup network failure is surfaced as BackgroundRemovalError, not a crash", async () => {
    const { removeStickerBackground } = await import("./image-processing");
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    vi.stubGlobal("fetch", fetchMock);
    await expect(removeStickerBackground("data:image/png;base64,AAA")).rejects.toBeInstanceOf(
      BackgroundRemovalError,
    );
    vi.unstubAllGlobals();
  });
});

describe("download packaging", () => {
  // 1x1 transparent PNG (real bytes with an alpha channel).
  const TRANSPARENT_1PX_PNG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

  it("ZIP contains one transparent PNG per reaction with stickersit- filenames", async () => {
    const { unzipSync } = await import("fflate");
    const blob = await zipStickerPack([
      { reaction: "laughing", dataUrl: TRANSPARENT_1PX_PNG },
      { reaction: "love", dataUrl: TRANSPARENT_1PX_PNG },
    ]);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const entries = unzipSync(bytes);
    expect(Object.keys(entries).sort()).toEqual([
      "stickersit-laughing.png",
      "stickersit-love.png",
      "stickersit-pack-info.txt",
    ]);
    // PNG signature intact (alpha-carrying source bytes round-trip exactly).
    const png = entries["stickersit-laughing.png"];
    expect([...png.slice(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
    expect(png.length).toBeGreaterThan(20);
  });

  it("zip is a real ZIP (PK header)", async () => {
    const blob = await zipStickerPack([{ reaction: "sleepy", dataUrl: TRANSPARENT_1PX_PNG }]);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect(bytes[0]).toBe(0x50); // P
    expect(bytes[1]).toBe(0x4b); // K
  });
});

describe("analytics privacy guard", () => {
  beforeEach(() => {
    (globalThis as { gtag?: unknown }).gtag = undefined;
  });
  afterEach(() => {
    delete (globalThis as { gtag?: unknown }).gtag;
  });

  it("never forwards image payloads, data URLs, or forbidden keys", () => {
    const calls: unknown[][] = [];
    (globalThis as { gtag?: unknown }).gtag = (...args: unknown[]) => calls.push(args);
    trackPackEvent("photo_uploaded", {
      reaction: "love",
      image: "data:image/png;base64,SECRET",
      dataUrl: "data:image/jpeg;base64,SECRET",
      base64: "SECRET",
      url: "https://evil.example/photo.jpg",
      referenceImage: "data:image/webp;base64,SECRET",
      durationMs: 1234,
    } as never);
    expect(calls).toHaveLength(1);
    const payload = calls[0][2] as Record<string, unknown>;
    expect(payload).toEqual({ reaction: "love", durationMs: 1234 });
    expect(JSON.stringify(payload)).not.toContain("SECRET");
    expect(JSON.stringify(payload)).not.toContain("data:");
  });

  it("drops any value that looks like a data URL even under an allowed key", () => {
    const calls: unknown[][] = [];
    (globalThis as { gtag?: unknown }).gtag = (...args: unknown[]) => calls.push(args);
    trackPackEvent("sticker_generation_completed", { reason: "data:image/png;base64,XYZ" });
    const payload = calls[0][2] as Record<string, unknown>;
    expect(payload).toEqual({});
  });

  it("pack route source never logs request payloads (source-scan guard)", async () => {
    const { readFile } = await import("node:fs/promises");
    const source = await readFile("src/app/api/pack/sticker/route.ts", "utf8");
    expect(source).not.toMatch(/console\.(log|info|debug|warn|error)/);
    // The validated reference image is never echoed into any response.
    expect(source).not.toMatch(/referenceImage\s*\}/);
    expect(source).not.toMatch(/referenceImage[^)]*\)\s*\}/);
  });
});
