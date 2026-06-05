import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { buildPrompt, STICKER_STYLES } from "@/lib/sticker-styles";

// SenseNova image generation takes ~25-30s; default Vercel function timeout is 10s
export const maxDuration = 60;

const SENSENOVA_API_URL = "https://token.sensenova.cn/v1/images/generations";
const SENSENOVA_MODEL = "sensenova-u1-fast";
const SENSENOVA_IMAGE_SIZE = "2048x2048";

const RATE_LIMIT_WINDOW = parseInt(
  process.env.SENSENOVA_RATE_LIMIT_WINDOW || "3600000",
  10,
);
const RATE_LIMIT_WINDOW_SECONDS = RATE_LIMIT_WINDOW / 1000;
const RATE_LIMIT_MAX = parseInt(
  process.env.SENSENOVA_RATE_LIMIT_MAX || "10",
  10,
);

const fallbackLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function isLocallyRateLimited(ip: string): boolean {
  const now = Date.now();

  for (const [key, val] of fallbackLimitMap) {
    if (now > val.resetAt) fallbackLimitMap.delete(key);
  }

  const entry = fallbackLimitMap.get(ip);
  if (!entry) {
    fallbackLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count += 1;
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
  const key = `fallback:${windowId}:${ipHash}`;

  const pipeline: [string, ...unknown[]][] = [
    ["INCRBY", key, 1],
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

async function callSenseNovaApi(prompt: string): Promise<Response> {
  const apiKey = process.env.SENSENOVA_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Fallback service unavailable" },
      { status: 503 },
    );
  }

  const payload = {
    model: SENSENOVA_MODEL,
    prompt,
    size: SENSENOVA_IMAGE_SIZE,
    n: 1,
  };

  const apiResponse = await fetch(SENSENOVA_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60_000),
  });

  if (!apiResponse.ok) {
    const errorText = await apiResponse.text().catch(() => "Unknown error");
    return NextResponse.json(
      { error: `Image generation failed: ${errorText}` },
      { status: 502 },
    );
  }

  const data = await apiResponse.json();
  const imageUrl = data?.data?.[0]?.url;
  const b64Image = data?.data?.[0]?.b64_json;

  if (b64Image) {
    const imageBuffer = Buffer.from(b64Image, "base64");
    return new NextResponse(imageBuffer, {
      headers: { "Content-Type": "image/png" },
    });
  }

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image generation returned no image" },
      { status: 502 },
    );
  }

  const imageResponse = await fetch(imageUrl, {
    signal: AbortSignal.timeout(30_000),
  });
  if (!imageResponse.ok) {
    return NextResponse.json(
      { error: "Failed to download generated image" },
      { status: 502 },
    );
  }

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  return new NextResponse(imageBuffer, {
    headers: { "Content-Type": imageResponse.headers.get("Content-Type") || "image/png" },
  });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    if (await isSharedRateLimited(ip)) {
      return NextResponse.json(
        { error: "Fallback limit reached. Please wait." },
        { status: 429 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Rate limit check failed. Please try again later." },
      { status: 503 },
    );
  }

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

  const fullPrompt = buildPrompt(promptStr, styleStr);
  return callSenseNovaApi(fullPrompt);
}
