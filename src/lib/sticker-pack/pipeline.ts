"use client";

// Pack pipeline client pieces: one API call per sticker + local post-processing.
// Kept out of the React component so the orchestration is unit-testable.

import type { ReactionId } from "./types";
import {
  BackgroundRemovalError,
  ProcessedSticker,
  processStickerImage,
} from "./image-processing";

export interface StickerOutcome {
  reaction: ReactionId;
  /** Solid-background generation output (data URL) — kept for cleanup retry. */
  originalUrl: string;
  processed?: ProcessedSticker;
  cleanupError?: string;
}

/** POST /api/pack/sticker — throws Error("... (429)") style messages so the
 *  serial queue can decide retryability. */
export async function requestStickerGeneration(
  reaction: ReactionId,
  referenceImage: string,
  timeoutMs = 100_000,
): Promise<Blob> {
  let response: Response;
  try {
    response = await fetch("/api/pack/sticker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction, referenceImage }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    throw new Error(`Sticker request failed (network)`);
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ? `${body.error} (${response.status})` : `Sticker request failed (${response.status})`);
  }
  return response.blob();
}

/**
 * Generate one sticker and run background cleanup. A cleanup failure does NOT
 * fail the sticker — the solid original stays usable (retry cleanup / download
 * original) per the partial-success policy.
 */
export async function generateAndProcessSticker(
  reaction: ReactionId,
  referenceImage: string,
): Promise<StickerOutcome> {
  const blob = await requestStickerGeneration(reaction, referenceImage);
  const originalUrl = await blobToDataUrl(blob);

  try {
    const processed = await processStickerImage(originalUrl);
    return { reaction, originalUrl, processed };
  } catch (error) {
    if (!(error instanceof BackgroundRemovalError)) throw error;
    return { reaction, originalUrl, cleanupError: error.message };
  }
}

export async function retryCleanupOnly(originalUrl: string): Promise<ProcessedSticker> {
  return processStickerImage(originalUrl);
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read sticker blob"));
    reader.readAsDataURL(blob);
  });
}
