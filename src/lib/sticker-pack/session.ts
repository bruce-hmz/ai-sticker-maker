"use client";

// Session-resume state. Persists ONLY derived sticker results (data URLs of
// finished stickers + statuses) — never the user's reference photo. On refresh
// the finished stickers come back; remaining reactions require a re-upload to
// continue. Best-effort: quota errors are swallowed, resume is a bonus not a
// contract.

import { REACTIONS, type PackStickerStatus, type ReactionId } from "./types";

const STORAGE_KEY = "stickersit.pack.session.v1";

export interface SessionSticker {
  reaction: ReactionId;
  status: PackStickerStatus;
  imageUrl?: string;
  originalUrl?: string;
  cleanupError?: string;
}

export interface PackSessionState {
  packId: string;
  startedAt: number;
  stickers: SessionSticker[];
  savedAt: number;
}

export function savePackSession(session: PackSessionState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Quota exceeded (large packs) — resume simply won't be available.
  }
}

export function loadPackSession(): PackSessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PackSessionState;
    if (!parsed?.packId || !Array.isArray(parsed.stickers)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPackSession() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasCompletableWork(session: PackSessionState): boolean {
  return session.stickers.some((s) => s.status !== "completed");
}

export function completedCount(session: PackSessionState): number {
  return session.stickers.filter((s) => s.status === "completed").length;
}

/** Reactions that still need generation after a restore. */
export function missingReactions(session: PackSessionState): ReactionId[] {
  return REACTIONS.filter(
    (r) => session.stickers.find((s) => s.reaction === r.id)?.status !== "completed",
  ).map((r) => r.id);
}
