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
