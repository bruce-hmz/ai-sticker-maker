// Provider factory: primary + optional fallback, resolved from env.
// SENSENOVA_API_KEY is the production key; POLLINATIONS_API_KEY is optional.

import { PollinationsAdapter } from "./pollinations";
import { SenseNovaAdapter } from "./sensenova";
import { ImageProvider } from "./types";

export { PollinationsAdapter } from "./pollinations";
export { SenseNovaAdapter } from "./sensenova";
export * from "./types";

export interface ImageProviderRegistry {
  primary: ImageProvider;
  fallback: ImageProvider | null;
  /** First provider that can derive images from a reference photo. */
  referenceCapable: ImageProvider | null;
}

let cached: ImageProviderRegistry | null = null;

export function getImageProviders(): ImageProviderRegistry {
  if (cached) return cached;

  const sensenova = process.env.SENSENOVA_API_KEY
    ? new SenseNovaAdapter(process.env.SENSENOVA_API_KEY)
    : null;
  const pollinations = new PollinationsAdapter(process.env.POLLINATIONS_API_KEY);

  const primary: ImageProvider | null = sensenova ?? pollinations;
  // The other provider, when it is actually usable, serves as fallback.
  const fallback: ImageProvider | null = primary === sensenova ? pollinations : sensenova;

  const referenceCapable = [primary, fallback].find(
    (provider): provider is ImageProvider =>
      provider !== null && provider.supportsImageReference(),
  ) ?? null;

  cached = { primary, fallback: primary ? fallback : null, referenceCapable };
  return cached;
}

/**
 * Provider for reference-image generation (photo → sticker pack).
 *
 * Unlike text generation, this MUST NOT fall back to a text-only provider:
 * a text-only "success" would silently produce a different character and
 * lose the uploaded subject's identity. Callers receive null instead and
 * must fail explicitly when no reference-capable provider is configured.
 */
export function getReferenceProvider(): ImageProvider | null {
  return getImageProviders().referenceCapable;
}

/** Test-only: forget the cached registry so env changes take effect. */
export function resetProviderCacheForTests() {
  cached = null;
}
