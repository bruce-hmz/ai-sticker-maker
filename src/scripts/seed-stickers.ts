/**
 * One-time seed script: uploads example + promo stickers to Blob + KV.
 * Run with: npx tsx src/scripts/seed-stickers.ts
 */
import { readFileSync } from "fs";
import { join } from "path";
import { put } from "@vercel/blob";

const SEED_STICKERS = [
  // Examples (public/examples/)
  { file: "cute-kawaii-cat.png", dir: "examples", prompt: "a cute cat with sparkling eyes", style: "cute-kawaii" },
  { file: "chibi-dog.png", dir: "examples", prompt: "a happy dog wagging its tail", style: "chibi" },
  { file: "pixel-art-rocket.png", dir: "examples", prompt: "a rocket ship blasting off", style: "pixel-art" },
  { file: "cartoon-coffee.png", dir: "examples", prompt: "a coffee cup saying good morning", style: "cartoon" },
  { file: "hand-drawn-cat.png", dir: "examples", prompt: "a sleepy cat curled up napping", style: "hand-drawn" },
  { file: "3d-avocado.png", dir: "examples", prompt: "a happy avocado giving a thumbs up", style: "3d-rendered" },
  { file: "minimalist-star.png", dir: "examples", prompt: "a shining star", style: "minimalist" },
  { file: "retro-camera.png", dir: "examples", prompt: "a vintage film camera", style: "retro" },
  // Promo (public/promo/)
  { file: "pinterest-cute-cat.png", dir: "promo", prompt: "a cute cat smiling", style: "cute-kawaii" },
  { file: "pinterest-cute-coffee.png", dir: "promo", prompt: "a kawaii coffee cup with heart eyes", style: "cute-kawaii" },
  { file: "pinterest-chibi-panda.png", dir: "promo", prompt: "a chibi panda eating bamboo", style: "chibi" },
  { file: "pinterest-chibi-rocket.png", dir: "promo", prompt: "a chibi astronaut riding a rocket", style: "chibi" },
  { file: "pinterest-cartoon-dog.png", dir: "promo", prompt: "a cartoon dog with a bone", style: "cartoon" },
  { file: "pinterest-3d-donut.png", dir: "promo", prompt: "a yummy 3D donut with sprinkles", style: "3d-rendered" },
  { file: "pinterest-3d-planet.png", dir: "promo", prompt: "a colorful planet in space", style: "3d-rendered" },
  { file: "pinterest-handdrawn-moon.png", dir: "promo", prompt: "a hand-drawn crescent moon with stars", style: "hand-drawn" },
  { file: "pinterest-retro-phone.png", dir: "promo", prompt: "a retro rotary telephone", style: "retro" },
];

function getKvConfig() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("KV_REST_API_URL and KV_REST_API_TOKEN must be set");
  return { url, token };
}

async function kvPipeline(commands: string[][]) {
  const { url, token } = getKvConfig();
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`KV pipeline failed (${res.status})`);
  return res.json();
}

async function seed() {
  for (const ex of SEED_STICKERS) {
    const filePath = join(process.cwd(), "public", ex.dir, ex.file);
    let buffer: Buffer;
    try {
      buffer = readFileSync(filePath);
    } catch {
      console.log(`  ⏭ ${ex.file} not found, skipping`);
      continue;
    }
    if (buffer.length === 0) {
      console.log(`  ⏭ ${ex.file} is empty, skipping`);
      continue;
    }

    const id = `seed_${ex.style}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
    const createdAt = new Date().toISOString();

    console.log(`Uploading ${ex.dir}/${ex.file} → ${id}...`);

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) throw new Error("BLOB_READ_WRITE_TOKEN not set");

    const { url: imageUrl } = await put(`stickers/${id}.png`, buffer, {
      access: "public",
      contentType: "image/png",
      addRandomSuffix: false,
      token,
    });

    const metadata = { id, prompt: ex.prompt, style: ex.style, seed: 0, imageUrl, createdAt };
    const timestamp = Date.now();

    await kvPipeline([
      ["SET", `sticker:${id}`, JSON.stringify(metadata)],
      ["ZADD", "stickers:all", String(timestamp), id],
      ["ZADD", `stickers:style:${ex.style}`, String(timestamp), id],
    ]);

    console.log(`  ✓ ${ex.prompt} → ${imageUrl}`);
  }

  console.log("\nDone! Seed stickers uploaded.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
