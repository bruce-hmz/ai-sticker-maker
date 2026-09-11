"use client";

// WTP research probe state (docs/review-2026-09-16.md §4). Research
// instrumentation only — never a paywall, never blocks generation or download.
// Each probe shows at most once per browser session: wtp_probe_viewed fires
// exactly once, and an answer or dismiss retires the probe for the session.

export type WtpProbeType = "use_case" | "pricing_door";

/** Answers to the post-download use-case survey. */
export const USE_CASE_OPTIONS = [
  "personal_chat",
  "print_physical",
  "resell",
  "client_work",
  "other",
] as const;
export type UseCaseOption = (typeof USE_CASE_OPTIONS)[number];

/** Price anchors offered by the 6/6 pricing card ("what would you pay"). */
export const PRICE_POINTS = ["free", "1.99", "4.99", "9.99_plus"] as const;
export type PricePoint = (typeof PRICE_POINTS)[number];

const FLAGS = {
  "use_case.viewed": "stickersit.wtp.use_case.viewed",
  "use_case.retired": "stickersit.wtp.use_case.retired",
  "pricing_door.viewed": "stickersit.wtp.pricing_door.viewed",
  "pricing_door.retired": "stickersit.wtp.pricing_door.retired",
} as const;

function flagKey(probeType: WtpProbeType, kind: "viewed" | "retired"): string {
  return FLAGS[`${probeType}.${kind}`];
}

function hasFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function setFlag(key: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // Best-effort — a quota error just means the card may re-show next visit.
  }
}

/** True exactly once per session per probe — use to fire wtp_probe_viewed. */
export function claimProbeView(probeType: WtpProbeType): boolean {
  const key = flagKey(probeType, "viewed");
  if (hasFlag(key)) return false;
  setFlag(key);
  return true;
}

/** A retired probe (answered or dismissed) must not show again this session. */
export function isProbeRetired(probeType: WtpProbeType): boolean {
  return hasFlag(flagKey(probeType, "retired"));
}

export function retireProbe(probeType: WtpProbeType) {
  setFlag(flagKey(probeType, "retired"));
}
