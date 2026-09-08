// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import sharp from "sharp";
import { resetProviderCacheForTests } from "@/lib/providers";

const VALID_DATA_URL = `data:image/jpeg;base64,${"A".repeat(32)}`;

// Real tiny JPEG generated with sharp so route validation passes.
let VALID_JPEG_DATA_URL = "";
let REAL_JPEG = new Uint8Array();
beforeEach(async () => {
  const jpeg = await sharp({
    create: { width: 64, height: 64, channels: 3, background: "#ff6600" },
  })
    .jpeg()
    .toBuffer();
  REAL_JPEG = new Uint8Array(jpeg);
  VALID_JPEG_DATA_URL = `data:image/jpeg;base64,${jpeg.toString("base64")}`;
});

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/pack/sticker", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const POST = async (body: unknown) => {
  const { POST: handler } = await import("./route");
  return handler(makeRequest(body) as never);
};

beforeEach(() => {
  resetProviderCacheForTests();
  process.env.SENSENOVA_API_KEY = "test-key";
});

afterEach(() => {
  resetProviderCacheForTests();
  delete process.env.SENSENOVA_API_KEY;
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("POST /api/pack/sticker", () => {
  it("503 with an explicit error when no reference-capable provider exists", async () => {
    delete process.env.SENSENOVA_API_KEY;
    resetProviderCacheForTests();
    const res = await POST({ reaction: "love", referenceImage: VALID_DATA_URL });
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toContain("unavailable");
    // Explicit failure — never a silent text-only substitute.
    expect(res.headers.get("content-type")).toContain("application/json");
  });

  it("400 for an unknown reaction", async () => {
    const res = await POST({ reaction: "dancing", referenceImage: VALID_DATA_URL });
    expect(res.status).toBe(400);
  });

  it("400 when referenceImage is not a data URL (e.g. external URL)", async () => {
    const res = await POST({ reaction: "love", referenceImage: "https://example.com/cat.jpg" });
    expect(res.status).toBe(400);
  });

  it("400 when the data URL does not decode as a real image", async () => {
    const res = await POST({ reaction: "love", referenceImage: "data:image/jpeg;base64,Zm9vYmFy" });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("valid image");
  });

  it("413 when the body is too large", async () => {
    const request = new NextRequest("http://localhost/api/pack/sticker", {
      method: "POST",
      headers: { "Content-Type": "application/json", "content-length": String(9 * 1024 * 1024) },
      body: JSON.stringify({ reaction: "love", referenceImage: VALID_DATA_URL }),
    });
    const { POST: handler } = await import("./route");
    const res = await handler(request as never);
    expect(res.status).toBe(413);
  });

  it("200 with a PNG body on successful reference generation", async () => {
    const calls: { url: string; body?: unknown }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL, init?: RequestInit) => {
        const u = String(url);
        calls.push({ url: u, body: init?.body ? JSON.parse(String(init.body)) : undefined });
        if (u.endsWith("/images/edits")) {
          return new Response(JSON.stringify({ data: [{ url: "https://cdn.test/img.png" }] }), {
            status: 200,
          });
        }
        return new Response(REAL_JPEG, {
          status: 200,
          headers: { "content-type": "image/png" },
        });
      }),
    );

    const res = await POST({ reaction: "love", referenceImage: VALID_JPEG_DATA_URL });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/png");
    expect(res.headers.get("x-sticker-reaction")).toBe("love");

    // Provider contract: u1.5-lite edits with image_url object array.
    const edit = calls.find((c) => c.url.endsWith("/images/edits"));
    const editBody = edit?.body as Record<string, unknown> | undefined;
    expect(editBody).toMatchObject({
      model: "sensenova-u1.5-lite",
      images: [{ image_url: VALID_JPEG_DATA_URL }],
      response_format: "url",
    });
    const prompt = editBody?.prompt as string;
    expect(prompt).toContain("[IDENTITY LOCK]");
    expect(prompt).toContain("heart-shaped eyes");

    // Response never echoes the reference image.
    const blob = await res.text();
    expect(blob).not.toContain(VALID_JPEG_DATA_URL);
  });

  it("propagates 429 from the provider (single-sticker retryable failure)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ error: "rate" }), { status: 429 })),
    );
    const res = await POST({ reaction: "love", referenceImage: VALID_JPEG_DATA_URL });
    expect(res.status).toBe(429);
  });
});
