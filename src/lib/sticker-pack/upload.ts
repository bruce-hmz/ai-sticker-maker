// Client-side photo validation + normalization for the pack reference image.
// Shared by the uploader and tests; DOM-dependent pieces are injectable.

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10 MB original file
export const MIN_DIMENSION = 100;
export const MAX_DIMENSION = 12000;
/** Reference images are downscaled to this before upload — plenty for identity. */
export const REFERENCE_MAX_EDGE = 1024;

export const ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export type UploadValidationError =
  | "empty"
  | "unsupported-type"
  | "too-large"
  | "too-small"
  | "too-wide"
  | "not-an-image";

export function validateUploadMeta(file: {
  type: string;
  size: number;
}): UploadValidationError | null {
  if (!file.size) return "empty";
  if (!ACCEPTED_MIME_TYPES.includes(file.type.toLowerCase() as (typeof ACCEPTED_MIME_TYPES)[number])) {
    return "unsupported-type";
  }
  if (file.size > MAX_UPLOAD_BYTES) return "too-large";
  return null;
}

export function validateDimensions(width: number, height: number): UploadValidationError | null {
  if (width < MIN_DIMENSION || height < MIN_DIMENSION) return "too-small";
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) return "too-wide";
  return null;
}

export const UPLOAD_ERROR_MESSAGES: Record<UploadValidationError, string> = {
  empty: "The selected file is empty.",
  "unsupported-type": "Please upload a JPG, PNG, or WebP image.",
  "too-large": "Image is too large. Please use one under 10 MB.",
  "too-small": "Image is too small. Please use one at least 100×100 pixels.",
  "too-wide": "Image dimensions are unusual. Please use a normal photo.",
  "not-an-image": "That file could not be read as an image.",
};

interface DecodeImage {
  (src: string): Promise<{ width: number; height: number }>;
}

/**
 * Validate + downscale a user photo and return a JPEG data URL (EXIF-free —
 * canvas re-encoding drops metadata) suitable for the reference-image API.
 * `onDimensions` reports the decoded source dimensions for analytics buckets.
 */
export async function prepareReferenceImage(
  file: File,
  decodeImage: DecodeImage = defaultDecodeImage,
  onDimensions?: (width: number, height: number) => void,
): Promise<{ dataUrl: string; error?: never } | { dataUrl?: never; error: UploadValidationError }> {
  const metaError = validateUploadMeta(file);
  if (metaError) return { error: metaError };

  const objectUrl = URL.createObjectURL(file);
  try {
    let dims: { width: number; height: number };
    try {
      dims = await decodeImage(objectUrl);
    } catch {
      return { error: "not-an-image" };
    }
    onDimensions?.(dims.width, dims.height);

    const dimError = validateDimensions(dims.width, dims.height);
    if (dimError) return { error: dimError };

    const scale = Math.min(
      1,
      REFERENCE_MAX_EDGE / Math.max(dims.width, dims.height),
    );
    const targetWidth = Math.round(dims.width * scale);
    const targetHeight = Math.round(dims.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { error: "not-an-image" };
    const img = await loadHtmlImage(objectUrl);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    // JPEG re-encode: strips EXIF (incl. GPS), keeps payload small.
    const dataUrl = canvas.toDataURL("image/jpeg", 0.87);
    if (dataUrl.length < 100) return { error: "not-an-image" };
    return { dataUrl };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode failed"));
    img.src = src;
  });
}

function defaultDecodeImage(src: string) {
  return loadHtmlImage(src).then((img) => ({
    width: img.naturalWidth,
    height: img.naturalHeight,
  }));
}
