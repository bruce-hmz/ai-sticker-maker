import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getImageProviders,
  getReferenceProvider,
  resetProviderCacheForTests,
} from "./index";
import { PollinationsAdapter } from "./pollinations";
import { SenseNovaAdapter } from "./sensenova";

beforeEach(() => {
  resetProviderCacheForTests();
});

afterEach(() => {
  resetProviderCacheForTests();
  delete process.env.SENSENOVA_API_KEY;
  delete process.env.POLLINATIONS_API_KEY;
  vi.restoreAllMocks();
});

describe("reference-generation fallback policy", () => {
  it("returns SenseNova as the reference provider when its key is configured", () => {
    process.env.SENSENOVA_API_KEY = "test-key";
    const provider = getReferenceProvider();
    expect(provider).toBeInstanceOf(SenseNovaAdapter);
    expect(provider?.supportsImageReference()).toBe(true);
  });

  it("never falls back to a text-only provider: no SenseNova key + no Pollinations key → null", () => {
    // Only Pollinations (free tier, text-only) is usable — must NOT be returned.
    const provider = getReferenceProvider();
    expect(provider).toBeNull();
  });

  it("a keyed Pollinations adapter IS reference-capable (paid tier)", () => {
    process.env.POLLINATIONS_API_KEY = "poll-test";
    const provider = getReferenceProvider();
    expect(provider).toBeInstanceOf(PollinationsAdapter);
    expect(provider?.supportsImageReference()).toBe(true);
  });

  it("text generation still keeps a fallback chain while reference does not", () => {
    process.env.SENSENOVA_API_KEY = "test-key";
    const { primary, fallback } = getImageProviders();
    expect(primary).toBeInstanceOf(SenseNovaAdapter);
    // Text route may fall back to Pollinations free tier…
    expect(fallback).toBeInstanceOf(PollinationsAdapter);
    // …but reference resolution stays on the identity-preserving provider only.
    expect(getReferenceProvider()).toBeInstanceOf(SenseNovaAdapter);
  });
});
