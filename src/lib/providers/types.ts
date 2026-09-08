// Provider-agnostic image generation contract.
// P0 scope: a primary provider plus an optional fallback — nothing fancier.

export interface TextToImageOptions {
  prompt: string;
  /** Provider-specific size hint; adapters map or ignore it. */
  size?: string;
  timeoutMs?: number;
}

export interface ImageReferenceOptions {
  prompt: string;
  /** Reference images as data URLs or public https URLs. */
  referenceImages: string[];
  timeoutMs?: number;
}

export interface GeneratedImage {
  buffer: Buffer;
  contentType: string;
}

export interface ImageProvider {
  readonly id: string;
  readonly model: string;
  /** Text → image. */
  generateFromText(options: TextToImageOptions): Promise<GeneratedImage>;
  /** Reference image(s) + prompt → derived image (photo → sticker pack path). */
  generateFromImage(options: ImageReferenceOptions): Promise<GeneratedImage>;
  /** Prompt-driven edit of an input image. Same wire call as generateFromImage for both current providers. */
  editImage(options: ImageReferenceOptions): Promise<GeneratedImage>;
  supportsImageReference(): boolean;
  supportsTransparentOutput(): boolean;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ProviderError";
  }
}
