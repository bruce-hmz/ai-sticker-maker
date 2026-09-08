import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import sharp from "sharp";
import { buildPrompt, STICKER_STYLES } from "@/lib/sticker-styles";
import { isStorageConfigured, saveSticker } from "@/lib/sticker-storage";
import { getImageProviders, ProviderError } from "@/lib/providers";

// SenseNova image generation takes ~25-30s
export const maxDuration = 60;

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_WINDOW_SECONDS = RATE_LIMIT_WINDOW / 1000;
const RATE_LIMIT_MAX = 12;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function isLocallyRateLimited(ip: string, count = 1): boolean {
  const now = Date.now();

  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }

  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count, resetAt: now + RATE_LIMIT_WINDOW });
    return count > RATE_LIMIT_MAX;
  }

  entry.count += count;
  return entry.count > RATE_LIMIT_MAX;
}

async function isSharedRateLimited(ip: string, count = 1): Promise<boolean> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return isLocallyRateLimited(ip, count);
  }

  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 24);
  const windowId = Math.floor(Date.now() / RATE_LIMIT_WINDOW);
  const key = `generate:${windowId}:${ipHash}`;

  const pipeline: [string, ...unknown[]][] = [
    ["INCRBY", key, count],
    ["EXPIRE", key, RATE_LIMIT_WINDOW_SECONDS * 2],
  ];

  const response = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pipeline),
  });

  if (!response.ok) {
    throw new Error(`Rate limit store failed (${response.status})`);
  }

  const result = await response.json();
  const totalCount = Array.isArray(result) ? result[0]?.result : undefined;
  if (typeof totalCount !== "number") {
    throw new Error("Rate limit store returned an invalid response");
  }

  return totalCount > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const { primary, fallback } = getImageProviders();
  if (!primary) {
    return NextResponse.json(
      { error: "Service unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Request body must be a JSON object with 'prompt' (string), 'style' (string)" },
      { status: 400 },
    );
  }

  const { prompt, style } = body as Record<string, unknown>;

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json(
      { error: "'prompt' must be a non-empty string" },
      { status: 400 },
    );
  }
  const promptStr = prompt.trim().slice(0, 500);

  const styleStr = typeof style === "string" && STICKER_STYLES.some((s) => s.id === style)
    ? style
    : undefined;
  if (!styleStr) {
    const valid = STICKER_STYLES.map((s) => s.id).join(", ");
    return NextResponse.json(
      { error: `'style' must be one of: ${valid}` },
      { status: 400 },
    );
  }

  try {
    if (await isSharedRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Rate limit check failed. Please try again later." },
      { status: 503 },
    );
  }

  const fullPrompt = buildPrompt(promptStr, styleStr);

  // Resize provider output to 512x512 for stickers
  const renderSticker = async (buffer: Buffer): Promise<Buffer> =>
    sharp(buffer).resize(512, 512, { fit: "inside" }).png({ quality: 90 }).toBuffer();

  try {
    let generated;
    try {
      generated = await primary.generateFromText({ prompt: fullPrompt, timeoutMs: 60_000 });
    } catch (error) {
      // A 400 means the provider rejected our payload — retrying elsewhere won't help.
      const isClientRejection = error instanceof ProviderError && error.status === 400;
      if (!fallback || isClientRejection) throw error;
      generated = await fallback.generateFromText({ prompt: fullPrompt, timeoutMs: 60_000 });
    }

    const resizedBuffer = await renderSticker(generated.buffer);

    const seed = Date.now();

    // Persist to Blob + KV if storage is configured
    if (isStorageConfigured()) {
      const metadata = await saveSticker(
        promptStr,
        styleStr,
        seed,
        resizedBuffer,
      );
      return NextResponse.json({
        id: metadata.id,
        imageUrl: metadata.imageUrl,
        prompt: metadata.prompt,
        style: metadata.style,
        seed: metadata.seed,
      });
    }

    // Fallback: return raw PNG binary (no persistence)
    return new NextResponse(new Uint8Array(resizedBuffer), {
      headers: {
        "Content-Type": "image/png",
        "X-Sticker-Seed": String(seed),
      },
    });
  } catch (error) {
    const status = error instanceof ProviderError ? error.status : 504;
    const message =
      status === 504
        ? "Image generation timed out. Please try again."
        : "Image generation failed. Please try again.";
    return NextResponse.json({ error: message }, { status });
  }
}
