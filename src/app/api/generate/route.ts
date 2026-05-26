import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { buildPrompt, STICKER_STYLES } from "@/lib/sticker-styles";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_WINDOW_SECONDS = RATE_LIMIT_WINDOW / 1000;
const RATE_LIMIT_MAX = 12;

function isLocallyRateLimited(ip: string): boolean {
  const now = Date.now();

  // Clean up expired entries
  for (const [key, val] of rateLimitMap) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }

  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

async function isSharedRateLimited(ip: string): Promise<boolean> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return isLocallyRateLimited(ip);
  }

  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 24);
  const windowId = Math.floor(Date.now() / RATE_LIMIT_WINDOW);
  const key = `generate:${windowId}:${ipHash}`;

  const response = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, RATE_LIMIT_WINDOW_SECONDS * 2],
    ]),
  });

  if (!response.ok) {
    throw new Error(`Rate limit store failed (${response.status})`);
  }

  const result = await response.json();
  const count = Array.isArray(result) ? result[0]?.result : undefined;
  if (typeof count !== "number") {
    throw new Error("Rate limit store returned an invalid response");
  }

  return count > RATE_LIMIT_MAX;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  try {
    if (!(await isSharedRateLimited(ip))) {
      return handleGenerationRequest(request);
    }
  } catch {
    return NextResponse.json(
      { error: "Rate limit check failed. Please try again later." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { error: "Too many requests. Please wait a moment." },
    { status: 429 },
  );
}

async function handleGenerationRequest(request: NextRequest) {
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
      { error: "Request body must be a JSON object with 'prompt' (string), 'style' (string), 'seed' (number)" },
      { status: 400 },
    );
  }

  const { prompt, style, seed } = body as Record<string, unknown>;

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

  if (typeof seed !== "undefined" && (typeof seed !== "number" || !Number.isFinite(seed))) {
    return NextResponse.json(
      { error: "'seed' must be a finite number when provided" },
      { status: 400 },
    );
  }

  const seedNum = typeof seed === "number" ? Math.floor(seed) : Math.floor(Math.random() * 999999);

  const fullPrompt = buildPrompt(promptStr, styleStr);
  const encodedPrompt = encodeURIComponent(fullPrompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seedNum}`;

  return NextResponse.json({ url, seed: seedNum });
}
