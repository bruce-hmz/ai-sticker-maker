// Sticker Pack P0 shared types — client orchestrates, server renders one sticker per call.

export type PackStickerStatus =
  | "queued"
  | "generating"
  | "processing"
  | "completed"
  | "failed";

export const REACTION_IDS = [
  "laughing",
  "crying",
  "angry",
  "shocked",
  "love",
  "sleepy",
] as const;

export type ReactionId = (typeof REACTION_IDS)[number];

export interface ReactionSpec {
  id: ReactionId;
  label: string;
  emoji: string;
  /** Reaction modifier appended to the shared identity-locked base prompt. */
  modifier: string;
}

export const REACTIONS: ReactionSpec[] = [
  {
    id: "laughing",
    label: "Laughing",
    emoji: "😂",
    modifier:
      "laughing joyfully with eyes squeezed shut, mouth wide open in a big grin, cheeks raised, energetic bouncy pose",
  },
  {
    id: "crying",
    label: "Crying",
    emoji: "😢",
    modifier:
      "crying dramatically with big glossy teardrops streaming down, trembling downturned mouth, sad drooping posture",
  },
  {
    id: "angry",
    label: "Angry",
    emoji: "😠",
    modifier:
      "angry and annoyed with furrowed brows, puffed cheeks, gritted teeth, small red anger mark, fists clenched",
  },
  {
    id: "shocked",
    label: "Shocked",
    emoji: "😲",
    modifier:
      "shocked and stunned with wide open eyes, dropped jaw, fur or hair standing up, a bold exclamation mark beside the head",
  },
  {
    id: "love",
    label: "Love",
    emoji: "😍",
    modifier:
      "deeply in love with sparkling heart-shaped eyes, gentle happy smile, small floating hearts around the head",
  },
  {
    id: "sleepy",
    label: "Sleepy",
    emoji: "😴",
    modifier:
      "sleepy and dozing with half-closed drooping eyes, relaxed body, small floating Zzz letters above the head",
  },
];

export function getReaction(id: string): ReactionSpec | undefined {
  return REACTIONS.find((reaction) => reaction.id === id);
}

export interface PackSticker {
  id: string;
  reaction: ReactionId;
  status: PackStickerStatus;
  /** Opaque PNG data URL once post-processing finished (transparent background). */
  imageUrl?: string;
  /** Solid-background generation output, kept as fallback when cleanup fails. */
  originalUrl?: string;
  /** Set when generation succeeded but background cleanup failed. */
  cleanupError?: string;
  error?: string;
  /** ms from request start to completed/failed, for analytics. */
  durationMs?: number;
}

export interface PackState {
  packId: string;
  stickers: PackSticker[];
}

export function createPack(): PackState {
  return {
    packId: `pack_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    stickers: REACTIONS.map((reaction) => ({
      id: `${reaction.id}_${Math.random().toString(36).slice(2, 8)}`,
      reaction: reaction.id,
      status: "queued" as PackStickerStatus,
    })),
  };
}
