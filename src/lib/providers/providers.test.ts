import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SenseNovaAdapter } from "./sensenova";
import { PollinationsAdapter } from "./pollinations";
import { ProviderError } from "./types";

const PNG_BUFFER = Buffer.from("fake-png-bytes");

function mockFetchSequence(handlers: ((url: string, init?: RequestInit) => Response)[]) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fn = vi.fn(async (url: string | URL, init?: RequestInit) => {
    const u = String(url);
    calls.push({ url: u, init });
    const handler = handlers[Math.min(calls.length - 1, handlers.length - 1)];
    return handler(u, init);
  });
  vi.stubGlobal("fetch", fn);
  return { calls, fn };
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const imageResponse = () =>
  new Response(new Uint8Array(PNG_BUFFER), { status: 200, headers: { "Content-Type": "image/png" } });

describe("SenseNovaAdapter", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("generates from text via /images/generations with u1-fast and downloads the CDN url", async () => {
    const { calls } = mockFetchSequence([
      () => jsonResponse({ data: [{ url: "https://cdn.example.com/img.png" }] }),
      () => imageResponse(),
    ]);

    const adapter = new SenseNovaAdapter("test-key");
    const result = await adapter.generateFromText({ prompt: "a cat" });

    expect(result.buffer.equals(PNG_BUFFER)).toBe(true);

    const gen = calls[0];
    expect(gen.url).toBe("https://token.sensenova.cn/v1/images/generations");
    expect((gen.init?.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    const body = JSON.parse(String(gen.init?.body));
    expect(body.model).toBe("sensenova-u1-fast");
    expect(body.size).toBe("2048x2048");
    expect(calls[1].url).toBe("https://cdn.example.com/img.png");
  });

  it("edits with reference images via /images/edits using u1.5-lite and image_url objects", async () => {
    const { calls } = mockFetchSequence([
      () => jsonResponse({ data: [{ url: "https://cdn.example.com/edit.png" }] }),
      () => imageResponse(),
    ]);

    const adapter = new SenseNovaAdapter("test-key");
    await adapter.editImage({ prompt: "make it laugh", referenceImages: ["data:image/png;base64,AAA"] });

    const body = JSON.parse(String(calls[0].init?.body));
    expect(calls[0].url).toBe("https://token.sensenova.cn/v1/images/edits");
    expect(body.model).toBe("sensenova-u1.5-lite");
    expect(body.images).toEqual([{ image_url: "data:image/png;base64,AAA" }]);
    expect(body.response_format).toBe("url");
  });

  it("maps provider 401 to a ProviderError 502", async () => {
    mockFetchSequence([() => jsonResponse({ error: { message: "Forbidden" } }, 401)]);
    const adapter = new SenseNovaAdapter("bad-key");
    await expect(adapter.generateFromText({ prompt: "x" })).rejects.toMatchObject({
      name: "ProviderError",
      status: 502,
    });
  });

  it("rejects reference generation with no images", async () => {
    const adapter = new SenseNovaAdapter("k");
    await expect(adapter.generateFromImage({ prompt: "x", referenceImages: [] })).rejects.toBeInstanceOf(
      ProviderError,
    );
  });

  it("reports reference support but no transparent output", () => {
    const adapter = new SenseNovaAdapter("k");
    expect(adapter.supportsImageReference()).toBe(true);
    expect(adapter.supportsTransparentOutput()).toBe(false);
  });
});

describe("PollinationsAdapter", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("generates from text via the legacy prompt URL without a key", async () => {
    const { calls } = mockFetchSequence([() => imageResponse()]);
    const adapter = new PollinationsAdapter(undefined);
    const result = await adapter.generateFromText({ prompt: "a cat" });

    expect(result.buffer.equals(PNG_BUFFER)).toBe(true);
    expect(calls[0].url).toContain("https://image.pollinations.ai/prompt/a%20cat?");
    expect(calls[0].url).toContain("nologo=true");
  });

  it("throws 501 for reference images without an API key", async () => {
    const adapter = new PollinationsAdapter(undefined);
    expect(adapter.supportsImageReference()).toBe(false);
    await expect(
      adapter.generateFromImage({ prompt: "x", referenceImages: ["data:image/png;base64,AAA"] }),
    ).rejects.toMatchObject({ name: "ProviderError", status: 501 });
  });
});
