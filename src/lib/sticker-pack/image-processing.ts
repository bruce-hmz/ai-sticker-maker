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

// Session-level flags for first-run vs cached performance tracking.
let modelEverLoaded = false;
// Active prefetch handle — generation requests can abort it to free bandwidth
// on constrained links (flaky VPN/proxy) where 54MB of parallel downloads
// starve the 28s generation POST.
let activePrefetch: AbortController | null = null;

export function abortPrefetchBackgroundModel() {
  activePrefetch?.abort();
  activePrefetch = null;
}

/** Coarse link-quality gate — skip the 54MB warm-up where it would hurt. */
function linkTooSlowForPrefetch(): boolean {
  try {
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (!conn) return false;
    if (conn.saveData) return true;
    return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
  } catch {
    return false;
  }
}

/**
 * Warm the browser HTTP cache with the background-removal model (~54MB)
 * while the first SenseNova generation is in flight (27–44s of dead time).
 * Fire-and-forget: failures here never block generation — the real
 * removeBackground call will re-fetch what it needs. Two parallel streams
 * (not more) so it can't starve the generation POST on constrained links.
 */
export async function prefetchBackgroundModel(
  onProgress?: (loadedBytes: number) => void,
): Promise<void> {
  if (linkTooSlowForPrefetch()) return;
  abortPrefetchBackgroundModel();
  const controller = new AbortController();
  activePrefetch = controller;
  try {
    const base = new URL(BGR_PUBLIC_PATH, window.location.origin).toString();
    const metaRes = await fetch(`${base}resources.json`, {
      cache: "force-cache",
      signal: controller.signal,
    });
    if (!metaRes.ok) return;
    const meta = (await metaRes.json()) as Record<
      string,
      { chunks: { name: string; offsets: [number, number] }[] }
    >;
    const chunkNames = Object.values(meta).flatMap((entry) =>
      entry.chunks.map((c) => c.name),
    );
    let loaded = 0;
    const QUEUE = 2; // deliberately low — generation POST has priority
    let cursor = 0;
    await Promise.all(
      Array.from({ length: QUEUE }, async () => {
        while (cursor < chunkNames.length) {
          const name = chunkNames[cursor++];
          try {
            const res = await fetch(`${base}${name}`, {
              cache: "force-cache",
              signal: controller.signal,
            });
            const blob = await res.blob();
            loaded += blob.size;
            onProgress?.(loaded);
          } catch {
            /* individual chunk failures are fine — real call re-fetches */
          }
        }
      }),
    );
  } catch {
    /* aborted or best-effort failure — fine */
  } finally {
    if (activePrefetch === controller) activePrefetch = null;
  }
}

export async function removeStickerBackground(
  sourceDataUrl: string,
  onProgress?: (ratio: number) => void,
): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  try {
    const source = decodeDataUrl(sourceDataUrl);
    const t0 = performance.now();
    const out = await removeBackground(source, {
      // imgly resolves chunk URLs via new URL(name, publicPath) — needs absolute.
      publicPath: new URL(BGR_PUBLIC_PATH, window.location.origin).toString(),
      model: "isnet_quint8",
      progress: (key: string, current: number, total: number) => {
        if (key === "compute" && total > 0) onProgress?.(current / total);
      },
      output: { format: "image/png" },
    });
    const elapsed = performance.now() - t0;
    if (typeof window !== "undefined") {
      // Expose for the pipeline to report as background_model_loaded /
      // background_removal_completed with first-run vs cached distinction.
      window.dispatchEvent(
        new CustomEvent("stickersit:bg-removal-done", {
          detail: { elapsedMs: elapsed, firstRun: !modelEverLoaded },
        }),
      );
      modelEverLoaded = true;
    }
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

/** ZIP a completed pack: stickersit-laughing.png … stickersit-reaction-pack.zip
 *  WhatsApp/Telegram want WebP — when the browser can encode it, include a
 *  .webp copy next to every PNG (PNGs always stay for universal use). */
export async function zipStickerPack(
  stickers: { reaction: ReactionId; dataUrl: string }[],
): Promise<Blob> {
  const { zipSync, strToU8 } = await import("fflate");
  const files: Record<string, Uint8Array> = {};
  const webpSupported = await canvasSupportsWebp();
  for (const sticker of stickers) {
    const base64 = sticker.dataUrl.split(",")[1];
    files[`stickersit-${sticker.reaction}.png`] = Uint8Array.from(atob(base64), (c) =>
      c.charCodeAt(0),
    );
    if (webpSupported) {
      const webpBlob = await dataUrlToWebp(sticker.dataUrl);
      if (webpBlob) {
        files[`stickersit-${sticker.reaction}.webp`] = new Uint8Array(
          await webpBlob.arrayBuffer(),
        );
      }
    }
  }
  files["stickersit-pack-info.txt"] = strToU8(
    "StickerSit Reaction Pack — 6 transparent stickers, 512x512.\nPNG: universal. WebP: WhatsApp/Telegram sticker format.\nGenerated at stickersit.com\n",
  );
  return new Blob([zipSync(files) as BlobPart], { type: "application/zip" });
}

async function canvasSupportsWebp(): Promise<boolean> {
  try {
    // Synchronous capability probe (jsdom lacks a real toBlob — never hang on it).
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

async function dataUrlToWebp(dataUrl: string): Promise<Blob | null> {
  try {
    const img = await loadHtmlImage(dataUrl);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.9),
    );
  } catch {
    return null;
  }
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
