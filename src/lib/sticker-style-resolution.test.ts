import { describe, expect, it } from "vitest";
import { resolveStickerStyleId } from "./sticker-styles";

describe("resolveStickerStyleId", () => {
  it("keeps known style ids", () => {
    expect(resolveStickerStyleId("retro")).toBe("retro");
  });

  it("falls back to the default style for missing or unknown ids", () => {
    expect(resolveStickerStyleId(undefined)).toBe("cute-kawaii");
    expect(resolveStickerStyleId(null)).toBe("cute-kawaii");
    expect(resolveStickerStyleId("not-a-style")).toBe("cute-kawaii");
  });
});
