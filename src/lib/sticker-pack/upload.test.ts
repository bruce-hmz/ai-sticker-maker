import { describe, expect, it } from "vitest";
import {
  MAX_UPLOAD_BYTES,
  validateUploadMeta,
  validateDimensions,
} from "./upload";

describe("upload validation", () => {
  it("accepts a valid JPG", () => {
    expect(validateUploadMeta({ type: "image/jpeg", size: 500_000 })).toBeNull();
  });

  it("accepts a valid PNG (case-insensitive mime)", () => {
    expect(validateUploadMeta({ type: "image/PNG", size: 500_000 })).toBeNull();
  });

  it("accepts a valid WebP", () => {
    expect(validateUploadMeta({ type: "image/webp", size: 500_000 })).toBeNull();
  });

  it("rejects invalid MIME (gif)", () => {
    expect(validateUploadMeta({ type: "image/gif", size: 500_000 })).toBe("unsupported-type");
  });

  it("rejects non-image mime", () => {
    expect(validateUploadMeta({ type: "application/pdf", size: 500_000 })).toBe("unsupported-type");
  });

  it("rejects oversized image", () => {
    expect(
      validateUploadMeta({ type: "image/jpeg", size: MAX_UPLOAD_BYTES + 1 }),
    ).toBe("too-large");
  });

  it("rejects empty file", () => {
    expect(validateUploadMeta({ type: "image/jpeg", size: 0 })).toBe("empty");
  });

  it("rejects too-small dimensions", () => {
    expect(validateDimensions(64, 64)).toBe("too-small");
  });

  it("rejects absurdly large dimensions", () => {
    expect(validateDimensions(20000, 20000)).toBe("too-wide");
  });

  it("accepts normal photo dimensions", () => {
    expect(validateDimensions(1080, 1440)).toBeNull();
  });
});
