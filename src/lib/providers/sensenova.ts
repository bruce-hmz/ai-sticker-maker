// SenseNova (SenseTime) adapter.
// - Text-to-image: sensenova-u1-fast on POST /v1/images/generations
// - Reference-image edits: sensenova-u1.5-lite on POST /v1/images/edits
//   (u1-fast rejects /edits with 400; u1.5-lite requires images as
//   [{ image_url }] objects — plain strings or `image` fields are refused)

import {
  GeneratedImage,
  ImageProvider,
  ImageReferenceOptions,
  ProviderError,
  TextToImageOptions,
} from "./types";

const SENSENOVA_BASE_URL = "https://token.sensenova.cn/v1";
const TEXT_MODEL = "sensenova-u1-fast";
const EDIT_MODEL = "sensenova-u1.5-lite";
// Only sizes from the API's allowlist; 2048x2048 is the square option.
const TEXT_IMAGE_SIZE = "2048x2048";

export class SenseNovaAdapter implements ImageProvider {
  readonly id = "sensenova";
  readonly model = TEXT_MODEL;
  readonly editModel = EDIT_MODEL;

  constructor(private readonly apiKey: string) {}

  supportsImageReference(): boolean {
    return true;
  }

  // SenseNova returns opaque PNGs with a solid background — never an alpha channel.
  supportsTransparentOutput(): boolean {
    return false;
  }

  async generateFromText(options: TextToImageOptions): Promise<GeneratedImage> {
    const url = await this.requestImageUrl("/images/generations", {
      model: TEXT_MODEL,
      prompt: options.prompt,
      size: TEXT_IMAGE_SIZE,
      n: 1,
    }, options.timeoutMs);
    return this.download(url, options.timeoutMs);
  }

  async generateFromImage(options: ImageReferenceOptions): Promise<GeneratedImage> {
    if (options.referenceImages.length === 0) {
      throw new ProviderError("At least one reference image is required", 400);
    }
    const url = await this.requestImageUrl("/images/edits", {
      model: EDIT_MODEL,
      images: options.referenceImages.map((image) => ({ image_url: image })),
      prompt: options.prompt,
      n: 1,
      size: "auto",
      watermark: false,
      prompt_extend: true,
      response_format: "url",
    }, options.timeoutMs);
    return this.download(url, options.timeoutMs);
  }

  editImage(options: ImageReferenceOptions): Promise<GeneratedImage> {
    return this.generateFromImage(options);
  }

  private async requestImageUrl(
    path: string,
    body: Record<string, unknown>,
    timeoutMs?: number,
  ): Promise<string> {
    let response: Response;
    try {
      response = await fetch(`${SENSENOVA_BASE_URL}${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs ?? 60_000),
      });
    } catch (error) {
      throw new ProviderError("Image provider request failed", 504, error);
    }

    if (!response.ok) {
      // 401/403 = bad key, 400 = rejected params; caller surfaces a generic message.
      throw new ProviderError(
        `Image provider rejected the request (${response.status})`,
        response.status === 401 || response.status === 403 ? 502 : 502,
      );
    }

    const data = (await response.json().catch(() => null)) as {
      data?: { url?: string }[];
    } | null;
    const imageUrl = data?.data?.[0]?.url;
    if (!imageUrl) {
      throw new ProviderError("Image provider returned no image", 502);
    }
    return imageUrl;
  }

  private async download(url: string, timeoutMs?: number): Promise<GeneratedImage> {
    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs ?? 30_000) });
    } catch (error) {
      throw new ProviderError("Failed to download generated image", 504, error);
    }
    if (!response.ok) {
      throw new ProviderError("Failed to download generated image", 502);
    }
    return {
      buffer: Buffer.from(await response.arrayBuffer()),
      contentType: response.headers.get("content-type") ?? "image/png",
    };
  }
}
