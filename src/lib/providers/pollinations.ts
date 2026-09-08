// Pollinations adapter — text-to-image only.
// The anonymous tier serves the `sana` model via GET image.pollinations.ai and
// silently ignores reference images (verified 2026-09-08), so this adapter
// reports no image-reference support. Reference-capable models (nanobanana,
// seedream, gpt-image, kontext) live on gen.pollinations.ai behind a paid key
// (POLLINATIONS_API_KEY); if that key exists we call the OpenAI-compatible
// /v1/images/edits endpoint, otherwise reference calls throw.

import {
  GeneratedImage,
  ImageProvider,
  ImageReferenceOptions,
  ProviderError,
  TextToImageOptions,
} from "./types";

const LEGACY_BASE_URL = "https://image.pollinations.ai/prompt";
const GEN_BASE_URL = "https://gen.pollinations.ai/v1";

export class PollinationsAdapter implements ImageProvider {
  readonly id = "pollinations";
  readonly model = "sana";

  constructor(private readonly apiKey?: string) {}

  supportsImageReference(): boolean {
    // Reference-capable models need the paid key.
    return Boolean(this.apiKey);
  }

  supportsTransparentOutput(): boolean {
    // `transparent=true` is ignored on the free tier (JPEG, no alpha).
    return false;
  }

  async generateFromText(options: TextToImageOptions): Promise<GeneratedImage> {
    const seed = Math.floor(Math.random() * 999_999);
    const params = new URLSearchParams({
      width: "512",
      height: "512",
      nologo: "true",
      seed: String(seed),
    });
    if (this.apiKey) params.set("token", this.apiKey);

    const promptUrl = `${LEGACY_BASE_URL}/${encodeURIComponent(options.prompt)}?${params}`;
    let response: Response;
    try {
      response = await fetch(promptUrl, {
        signal: AbortSignal.timeout(options.timeoutMs ?? 60_000),
      });
    } catch (error) {
      throw new ProviderError("Image provider request failed", 504, error);
    }
    if (!response.ok) {
      throw new ProviderError(
        `Image provider rejected the request (${response.status})`,
        response.status === 429 ? 429 : 502,
      );
    }
    return {
      buffer: Buffer.from(await response.arrayBuffer()),
      contentType: response.headers.get("content-type") ?? "image/jpeg",
    };
  }

  async generateFromImage(options: ImageReferenceOptions): Promise<GeneratedImage> {
    if (!this.apiKey) {
      throw new ProviderError(
        "Pollinations image reference requires POLLINATIONS_API_KEY",
        501,
      );
    }
    const first = options.referenceImages[0];
    if (!first) {
      throw new ProviderError("At least one reference image is required", 400);
    }
    let response: Response;
    try {
      response = await fetch(`${GEN_BASE_URL}/images/edits`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "google/gemini-3.1-flash-image", image: first, prompt: options.prompt }),
        signal: AbortSignal.timeout(options.timeoutMs ?? 90_000),
      });
    } catch (error) {
      throw new ProviderError("Image provider request failed", 504, error);
    }
    if (!response.ok) {
      throw new ProviderError(
        `Image provider rejected the request (${response.status})`,
        502,
      );
    }
    const payload = (await response.json().catch(() => null)) as {
      data?: { url?: string; b64_json?: string }[];
    } | null;
    const b64 = payload?.data?.[0]?.b64_json;
    if (b64) {
      return { buffer: Buffer.from(b64, "base64"), contentType: "image/png" };
    }
    const url = payload?.data?.[0]?.url;
    if (!url) {
      throw new ProviderError("Image provider returned no image", 502);
    }
    const imageResponse = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!imageResponse.ok) {
      throw new ProviderError("Failed to download generated image", 502);
    }
    return {
      buffer: Buffer.from(await imageResponse.arrayBuffer()),
      contentType: imageResponse.headers.get("content-type") ?? "image/png",
    };
  }

  editImage(options: ImageReferenceOptions): Promise<GeneratedImage> {
    return this.generateFromImage(options);
  }
}
