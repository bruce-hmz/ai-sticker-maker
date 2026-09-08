import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getReferenceProvider, ProviderError } from "@/lib/providers";
import { buildPackPrompt } from "@/lib/sticker-pack/prompt";
import { getReaction } from "@/lib/sticker-pack/types";

// One sticker per request (~22-30s). The client serializes the six reactions.
export const maxDuration = 60;

const MAX_BODY_BYTES = 8 * 1024 * 1024;
const DATA_URL_PREFIX_RE = /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/;

interface PackStickerRequest {
  referenceImage?: unknown;
  reaction?: unknown;
}

export async function POST(request: NextRequest) {
  // Reference generation never falls back to a text-only provider: a
  // text-only "success" loses the uploaded character's identity.
  const provider = getReferenceProvider();
  if (!provider) {
    return NextResponse.json(
      { error: "Reference image generation is unavailable right now. Please try again later." },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Reference image is too large." }, { status: 413 });
  }

  let body: PackStickerRequest;
  try {
    body = (await request.json()) as PackStickerRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { referenceImage, reaction } = body;

  if (typeof reaction !== "string" || !getReaction(reaction)) {
    return NextResponse.json(
      { error: "'reaction' must be one of: laughing, crying, angry, shocked, love, sleepy" },
      { status: 400 },
    );
  }

  if (
    typeof referenceImage !== "string" ||
    referenceImage.length > 7 * 1024 * 1024 ||
    !DATA_URL_PREFIX_RE.test(referenceImage)
  ) {
    return NextResponse.json(
      { error: "'referenceImage' must be a base64 JPEG/PNG/WebP data URL under 7 MB." },
      { status: 400 },
    );
  }

  // Verify the payload decodes as a real image before spending a generation.
  try {
    const raw = Buffer.from(referenceImage.split(",")[1], "base64");
    await sharp(raw).metadata();
  } catch {
    return NextResponse.json({ error: "'referenceImage' is not a valid image." }, { status: 400 });
  }

  const prompt = buildPackPrompt(getReaction(reaction)!);

  try {
    const generated = await provider.generateFromImage({
      prompt,
      referenceImages: [referenceImage],
      timeoutMs: 55_000,
    });

    const png = await sharp(generated.buffer)
      .resize(512, 512, { fit: "inside" })
      .png({ quality: 90 })
      .toBuffer();

    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "X-Sticker-Reaction": reaction,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const status = error instanceof ProviderError ? error.status : 504;
    // No payload details in errors — responses carry ids/statuses only.
    return NextResponse.json(
      { error: status === 504 ? "Sticker generation timed out. Please retry." : "Sticker generation failed. Please retry." },
      { status },
    );
  }
}
