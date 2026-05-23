import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, STICKER_STYLES } from "@/lib/sticker-styles";

export const maxDuration = 60;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 12;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { prompt, style, seed } = body as Record<string, unknown>;
  const promptStr = typeof prompt === "string" ? prompt.trim().slice(0, 500) : "";
  const rawStyle = typeof style === "string" ? style : "cute-kawaii";
  const styleStr = STICKER_STYLES.some((s) => s.id === rawStyle) ? rawStyle : "cute-kawaii";
  const seedNum = typeof seed === "number" ? Math.floor(seed) : Math.floor(Math.random() * 999999);

  if (!promptStr) {
    return NextResponse.json(
      { error: "Prompt is required" },
      { status: 400 },
    );
  }

  const fullPrompt = buildPrompt(promptStr, styleStr);
  const encodedPrompt = encodeURIComponent(fullPrompt);

  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seedNum}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "image/*" },
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 502 },
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");

    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
      seed: seedNum,
    });
  } catch {
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 502 },
    );
  }
}
