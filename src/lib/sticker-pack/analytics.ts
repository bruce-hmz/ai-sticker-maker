"use client";

// Pack analytics events. Never include image payloads, base64, data URLs,
// or any user photo content — reaction ids, durations, and outcomes only.

export type PackAnalyticsEvent =
  | "sticker_pack_view"
  | "photo_upload_clicked"
  | "photo_uploaded"
  | "pack_generation_started"
  | "sticker_generation_completed"
  | "sticker_generation_failed"
  | "background_removal_completed"
  | "background_removal_failed"
  | "pack_completed"
  | "single_sticker_regenerated"
  | "single_sticker_downloaded"
  | "pack_downloaded";

export interface PackEventPayload {
  reaction?: string;
  durationMs?: number;
  success?: boolean;
  packId?: string;
  completed?: number;
  total?: number;
  reason?: string;
}

/** Fields that must never appear in analytics (privacy guard). */
const FORBIDDEN_KEYS = new Set(["image", "imageData", "dataUrl", "base64", "url", "referenceImage", "payload"]);

export function trackPackEvent(event: PackAnalyticsEvent, payload: PackEventPayload = {}) {
  if (typeof window === "undefined") return;
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN_KEYS.has(key)) continue; // defense in depth — never send image data
    if (typeof value === "string" && value.startsWith("data:")) continue;
    safe[key] = value;
  }
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    gtag("event", event, safe);
  }
}
