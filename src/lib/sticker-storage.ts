import { put } from "@vercel/blob";

// --- Types ---

export interface StickerMetadata {
  id: string;
  prompt: string;
  style: string;
  seed: number;
  imageUrl: string;
  createdAt: string;
}

export interface StickerListResult {
  stickers: StickerMetadata[];
  hasMore: boolean;
  total: number;
}

// --- Helpers ---

function getKvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

function generateId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `s_${ts}${rand}`;
}

async function kvPipeline(commands: string[][]): Promise<unknown[]> {
  const config = getKvConfig();
  if (!config) throw new Error("KV not configured");

  const res = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });

  if (!res.ok) {
    throw new Error(`KV pipeline failed (${res.status})`);
  }

  const result = await res.json();
  if (!Array.isArray(result)) {
    throw new Error("KV pipeline returned invalid response");
  }
  return result;
}

async function kvGet(key: string): Promise<string | null> {
  const config = getKvConfig();
  if (!config) throw new Error("KV not configured");

  const res = await fetch(`${config.url}/get/${key}`, {
    headers: { Authorization: `Bearer ${config.token}` },
  });
  if (!res.ok) throw new Error(`KV GET failed (${res.status})`);

  const data = await res.json();
  return data?.result ?? null;
}

/** Check if storage (Blob + KV) is fully configured */
export function isStorageConfigured(): boolean {
  return !!(process.env.BLOB_READ_WRITE_TOKEN && getKvConfig());
}

// --- Core Operations ---

export async function saveSticker(
  prompt: string,
  style: string,
  seed: number,
  imageBuffer: Buffer,
): Promise<StickerMetadata> {
  const id = generateId();
  const createdAt = new Date().toISOString();

  // Upload image to Vercel Blob (public access)
  const { url: imageUrl } = await put(`stickers/${id}.png`, imageBuffer, {
    access: "public",
    contentType: "image/png",
    addRandomSuffix: false,
  });

  const metadata: StickerMetadata = {
    id,
    prompt,
    style,
    seed,
    imageUrl,
    createdAt,
  };

  // Save metadata + indexes to KV via pipeline
  const timestamp = Date.now();
  await kvPipeline([
    ["SET", `sticker:${id}`, JSON.stringify(metadata)],
    ["ZADD", "stickers:all", String(timestamp), id],
    ["ZADD", `stickers:style:${style}`, String(timestamp), id],
  ]);

  return metadata;
}

export async function getSticker(
  id: string,
): Promise<StickerMetadata | null> {
  const raw = await kvGet(`sticker:${id}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StickerMetadata;
  } catch {
    return null;
  }
}

export async function listStickers(options: {
  page: number;
  limit: number;
  style?: string;
}): Promise<StickerListResult> {
  const { page, limit, style } = options;
  const config = getKvConfig();
  if (!config) {
    return { stickers: [], hasMore: false, total: 0 };
  }

  const sortKey = style ? `stickers:style:${style}` : "stickers:all";
  const start = (page - 1) * limit;
  const stop = start + limit; // inclusive for ZREVRANGE, but we ask for stop to check hasMore

  // Fetch IDs (newest first) — fetch one extra to detect hasMore
  const rangeRes = await fetch(
    `${config.url}/zrevrange/${sortKey}/${start}/${stop}?_token=${config.token}`,
  );
  if (!rangeRes.ok) {
    throw new Error(`KV ZREVRANGE failed (${rangeRes.status})`);
  }
  const rangeData = await rangeRes.json();
  const ids: string[] = rangeData?.result ?? [];

  if (ids.length === 0) {
    return { stickers: [], hasMore: false, total: 0 };
  }

  const hasMore = ids.length > limit;
  const visibleIds = ids.slice(0, limit);

  // Batch fetch metadata via pipeline
  const metas = await kvPipeline(
    visibleIds.map((id: string) => ["GET", `sticker:${id}`]),
  );

  const stickers = metas
    .map((item: unknown) => {
      const raw = (item as { result?: string })?.result;
      if (!raw) return null;
      try {
        return JSON.parse(raw) as StickerMetadata;
      } catch {
        return null;
      }
    })
    .filter((s): s is StickerMetadata => s !== null);

  // Get total count
  const countRes = await fetch(
    `${config.url}/zcard/${sortKey}?_token=${config.token}`,
  );
  const countData = await countRes.json();
  const total = (countData?.result as number) ?? 0;

  return { stickers, hasMore, total };
}

export async function getRelatedStickers(
  sticker: StickerMetadata,
  limit: number,
): Promise<StickerMetadata[]> {
  const config = getKvConfig();
  if (!config) return [];

  // Fetch from same style, get extra to account for filtering self
  const styleKey = `stickers:style:${sticker.style}`;
  const res = await fetch(
    `${config.url}/zrevrange/${styleKey}/0/${limit}?_token=${config.token}`,
  );
  if (!res.ok) return [];

  const data = await res.json();
  const ids: string[] = (data?.result ?? []).filter(
    (id: string) => id !== sticker.id,
  );

  if (ids.length === 0) return [];

  const metas = await kvPipeline(
    ids.slice(0, limit).map((id: string) => ["GET", `sticker:${id}`]),
  );

  return metas
    .map((item: unknown) => {
      const raw = (item as { result?: string })?.result;
      if (!raw) return null;
      try {
        return JSON.parse(raw) as StickerMetadata;
      } catch {
        return null;
      }
    })
    .filter((s): s is StickerMetadata => s !== null);
}
