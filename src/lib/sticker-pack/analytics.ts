"use client";

// Pack analytics — full P1 conversion funnel.
// Never include image payloads, base64, data URLs, filenames, or any user
// photo content — reaction ids, durations, statuses, and coarse buckets only.

export type PackAnalyticsEvent =
  // Landing
  | "sticker_pack_view"
  // Upload
  | "photo_upload_clicked"
  | "photo_uploaded"
  // Generate
  | "pack_generation_started"
  // Progressive value
  | "pack_first_sticker_ready"
  | "pack_three_stickers_ready"
  | "pack_completed"
  // Abandonment
  | "pack_abandoned"
  // Downloads
  | "first_sticker_downloaded"
  | "single_sticker_downloaded"
  | "pack_downloaded"
  // Iteration
  | "single_sticker_regenerated"
  // Per-sticker generation outcome
  | "sticker_generation_completed"
  // Background removal
  | "background_model_loaded"
  | "background_removal_completed"
  | "background_removal_failed"
  // Provider reliability (client-observed statuses only)
  | "provider_429"
  | "provider_5xx"
  | "provider_timeout"
  | "sticker_generation_failed"
  | "sticker_retry"
  // WTP research probes (docs/review-2026-09-16.md §4 — research only, no paywall)
  | "wtp_probe_viewed"
  | "wtp_probe_clicked";

// Parameter names below are matched EXACTLY by the GA4 custom definitions in
// docs/ga4-custom-definitions.md — rename only together with that file and the
// GA4 registrations.
export interface PackEventPayload {
  reaction?: string;
  durationMs?: number;
  success?: boolean;
  packId?: string;
  completed?: number;
  total?: number;
  reason?: string;
  // Landing context
  landingPage?: string;
  deviceClass?: "mobile" | "tablet" | "desktop";
  viewportClass?: "<640" | "640-1023" | "1024-1279" | ">=1280";
  referrerCategory?: string;
  // Upload buckets (coarse, non-identifying)
  fileType?: string;
  fileSizeBucket?: "<1MB" | "1-5MB" | "5-10MB";
  imageDimensionBucket?: "<512" | "512-1023" | "1024-2047" | ">=2048";
  // Funnel timings
  packType?: string;
  stickerCount?: number;
  timeToFirstStickerMs?: number;
  generationDurationMs?: number;
  elapsedMs?: number;
  totalDurationMs?: number;
  successCount?: number;
  failedCount?: number;
  completedCount?: number;
  packStatus?: string;
  elapsedSinceGenerationStartMs?: number;
  // Background removal perf
  modelLoadMs?: number;
  removalMs?: number;
  cached?: boolean;
  // WTP research probes
  probeType?: "use_case" | "pricing_door";
  pricePoint?: string; // free | 1.99 | 4.99 | 9.99_plus
  option?: string; // use_case answer: personal_chat | print_physical | resell | client_work | other
}

/** Fields that must never appear in analytics (privacy guard). */
const FORBIDDEN_KEYS = new Set([
  "image",
  "imageData",
  "dataUrl",
  "base64",
  "url",
  "blobUrl",
  "referenceImage",
  "payload",
  "filename",
  "fileName",
  "exif",
]);

export function trackPackEvent(
  event: PackAnalyticsEvent,
  payload: PackEventPayload = {},
) {
  if (typeof window === "undefined") return;
  dispatch(event, payload, false);
}

/**
 * Fire-and-forget on page unload: gtag.js forwards via navigator.sendBeacon
 * when the page is going away. No complex async allowed here.
 */
export function trackPackEventBeacon(
  event: PackAnalyticsEvent,
  payload: PackEventPayload = {},
) {
  if (typeof window === "undefined") return;
  dispatch(event, payload, true);
}

function dispatch(
  event: PackAnalyticsEvent,
  payload: PackEventPayload,
  beacon: boolean,
) {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (FORBIDDEN_KEYS.has(key)) continue; // defense in depth — never send image data
    if (typeof value === "string" && (value.startsWith("data:") || value.startsWith("blob:"))) continue;
    safe[key] = value;
  }
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    const params = { ...safe };
    if (beacon) params.transport_type = "beacon";
    gtag("event", event, params);
  }
}

// --- Context helpers ---

export function landingContext(): Pick<
  PackEventPayload,
  "landingPage" | "deviceClass" | "viewportClass" | "referrerCategory"
> {
  if (typeof window === "undefined") return {};
  const w = window.innerWidth;
  const viewportClass: PackEventPayload["viewportClass"] =
    w < 640 ? "<640" : w < 1024 ? "640-1023" : w < 1280 ? "1024-1279" : ">=1280";
  const deviceClass: PackEventPayload["deviceClass"] =
    typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches
      ? w < 768
        ? "mobile"
        : "tablet"
      : "desktop";
  let referrerCategory: string | undefined;
  try {
    const ref = document.referrer;
    if (ref) {
      referrerCategory =
        ref.includes("google.") || ref.includes("bing.com")
          ? "search"
          : ref.includes(location.hostname)
            ? "internal"
            : ref.includes("t.co") || ref.includes("facebook.") || ref.includes("reddit.")
              ? "social"
              : "other";
    } else {
      referrerCategory = "direct";
    }
  } catch {
    /* referrer unavailable */
  }
  return {
    landingPage: location.pathname,
    deviceClass,
    viewportClass,
    referrerCategory,
  };
}

export function fileSizeBucket(bytes: number): PackEventPayload["fileSizeBucket"] {
  if (bytes < 1024 * 1024) return "<1MB";
  if (bytes < 5 * 1024 * 1024) return "1-5MB";
  return "5-10MB";
}

export function dimensionBucket(
  width: number,
  height: number,
): PackEventPayload["imageDimensionBucket"] {
  const max = Math.max(width, height);
  if (max < 512) return "<512";
  if (max < 1024) return "512-1023";
  if (max < 2048) return "1024-2047";
  return ">=2048";
}

/** Extract an HTTP status code embedded by the API client: "... (429)". */
export function providerStatusFromError(message: string | undefined): number | null {
  const m = /\((\d{3})\)\s*$/.exec(message ?? "");
  return m ? Number(m[1]) : null;
}
