// Identity-locked prompt template for reaction packs.
// All six stickers share the same BASE (identity lock + sticker style);
// each sticker appends only its REACTION modifier. This is the main lever
// for character consistency across the pack.

import type { ReactionSpec } from "./types";

const IDENTITY_LOCK = [
  "Preserve the exact same subject from the reference image.",
  "Maintain facial identity, face proportions, hair or fur pattern and color,",
  "eye color, clothing, accessories, and the number of subjects.",
  "The result must be recognizably the same individual character as the reference photo.",
].join(" ");

const STICKER_STYLE = [
  "Transform into a polished cute chat sticker.",
  "Centered composition with a clear silhouette.",
  "Expressive pose, head and upper body visible.",
  "Chibi-friendly proportions are welcome but the face must stay recognizable.",
  "Simple flat pastel single-color background.",
  "Strong sticker-like visual, clean edges, high contrast subject.",
  "No random objects, no scene, no extra characters.",
].join(" ");

const NEGATIVE_CONSTRAINTS = [
  "Do not change the identity.",
  "Do not add another subject.",
  "Do not change fur pattern, hairstyle, or hair color.",
  "Do not change clothing or accessories.",
  "No text, no watermark, no logo.",
  "No duplicate limbs, no deformed face, no cropped face.",
].join(" ");

export function buildPackPrompt(reaction: ReactionSpec): string {
  return [
    `[IDENTITY LOCK] ${IDENTITY_LOCK}`,
    `[STICKER STYLE] ${STICKER_STYLE}`,
    `[REACTION] The character is ${reaction.modifier}.`,
    `[CONSTRAINTS] ${NEGATIVE_CONSTRAINTS}`,
  ].join("\n");
}
