"use client";

// Browser-side sticker post-processing:
//   SenseNova PNG (solid background)
//     → imgly background removal (runs locally in the browser — photo never
//       leaves the device for cleanup)
//     → real white outline drawn as pixels (not CSS)
//     → 512×512 RGBA PNG + ZIP packaging via fflate
//
// The module is dynamically imported so the heavy code stays out of the
// initial page bundle.

import type { ReactionId } from "./types";

export interface ProcessedSticker {
  blob: Blob;
  dataUrl: string;
  hasAlpha: boolean;
}

export class BackgroundRemovalError extends Error {
  constructor(message = "Background cleanup failed") {
    super(message);
    this.name = "BackgroundRemovalError";
  }
}

/** Verify a canvas actually contains transparent pixels (alpha 1–254). */
export function canvasHasAlpha(ctx: CanvasRenderingContext2D): boolean {
  const { data } = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  let transparentPixels = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 0 && data[i] < 255) return true;
    if (data[i] === 0) transparentPixels++;
  }
  // A fully opaque image with a "removed" background would be all-255 alpha.
  return transparentPixels > data.length / 4 / 100; // >1% fully transparent px
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new BackgroundRemovalError("Could not read generated sticker"));
    img.src = src;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new BackgroundRemovalError("Could not encode sticker"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Decode a base64 data URL to a Blob WITHOUT fetch() — Chromium blocks
 * fetch("data:...") under connect-src CSPs that don't list `data:`.
 */
export function decodeDataUrl(dataUrl: string): Blob {
  const match = /^data:([^;,]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!match) throw new BackgroundRemovalError("Invalid sticker data");
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: match[1] });
}

/**
 * Remove the background of a generated sticker PNG. Downloads the WASM model
 * once per session from staticimgly.com; everything runs in the browser.
 */
/**
 * Remove the background of a generated sticker PNG. The WASM model is
 * self-hosted under /bgr/ (same-origin, immutable-cached) — the default
 * staticimgly.com CDN is too slow/unreliable for runtime downloads. Model is
 * quint8 (~42MB): 4× smaller than fp16 with mask quality that stays good
 * behind the sticker outline. Everything runs in the browser.
 */
export const BGR_PUBLIC_PATH = "/bgr/";

export async function removeStickerBackground(
  sourceDataUrl: string,
  onProgress?: (ratio: number) => void,
): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  try {
    const source = decodeDataUrl(sourceDataUrl);
    const out = await removeBackground(source, {
      // imgly resolves chunk URLs via new URL(name, publicPath) — needs absolute.
      publicPath: new URL(BGR_PUBLIC_PATH, window.location.origin).toString(),
      model: "isnet_quint8",
      progress: (key: string, current: number, total: number) => {
        if (key === "compute" && total > 0) onProgress?.(current / total);
      },
      output: { format: "image/png" },
    });
    return out;
  } catch (error) {
    // Message only — never the image payload. Helps diagnose model/WASM issues.
    console.warn(
      "[bg-removal]",
      error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    );
    throw new BackgroundRemovalError(
      error instanceof Error && /fetch|network|load/i.test(error.message)
        ? "Could not load the background cleanup model. Check your connection and retry."
        : undefined,
    );
  }
}

/**
 * Draw a real white outline around the sticker silhouette (image pixels,
 * not CSS), returning a 512×512 RGBA PNG blob.
 */
export async function applyStickerOutline(
  transparentBlob: Blob,
  outlineWidth = 12,
): Promise<ProcessedSticker> {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new BackgroundRemovalError("Canvas unavailable");

  const url = URL.createObjectURL(transparentBlob);
  let img: HTMLImageElement;
  try {
    img = await loadHtmlImage(url);
  } finally {
    URL.revokeObjectURL(url);
  }

  // Fit the sticker inside, leaving room for the outline.
  const inset = outlineWidth + 6;
  const scale = Math.min((size - inset * 2) / img.width, (size - inset * 2) / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;

  // Stamp the image repeatedly with a white shadow to build a solid outline.
  ctx.shadowColor = "#ffffff";
  ctx.shadowBlur = outlineWidth * 0.7;
  for (let i = 0; i < 6; i++) ctx.drawImage(img, x, y, w, h);
  ctx.shadowBlur = 0;
  ctx.drawImage(img, x, y, w, h);

  const hasAlpha = canvasHasAlpha(ctx);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new BackgroundRemovalError("Could not encode sticker");
  return { blob, dataUrl: await blobToDataUrl(blob), hasAlpha };
}

/** Full pipeline for one generated sticker: cleanup → outline → RGBA PNG. */
export async function processStickerImage(
  generatedDataUrl: string,
  onProgress?: (ratio: number) => void,
): Promise<ProcessedSticker> {
  const removed = await removeStickerBackground(generatedDataUrl, onProgress);
  return applyStickerOutline(removed);
}

/** ZIP a completed pack: stickersit-laughing.png … stickersit-reaction-pack.zip */
export async function zipStickerPack(
  stickers: { reaction: ReactionId; dataUrl: string }[],
): Promise<Blob> {
  const { zipSync, strToU8 } = await import("fflate");
  const files: Record<string, Uint8Array> = {};
  for (const sticker of stickers) {
    const base64 = sticker.dataUrl.split(",")[1];
    files[`stickersit-${sticker.reaction}.png`] = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }
  files["stickersit-pack-info.txt"] = strToU8(
    "StickerSit Reaction Pack — 6 transparent PNG stickers, 512x512.\nGenerated at stickersit.com\n",
  );
  return new Blob([zipSync(files) as BlobPart], { type: "application/zip" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  if (dataUrl.startsWith("data:")) return decodeDataUrl(dataUrl);
  return (await fetch(dataUrl)).blob();
}
