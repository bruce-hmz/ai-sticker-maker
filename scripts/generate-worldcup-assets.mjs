// 一次性脚本：生成世界杯主题贴纸素材，用于 world-cup 页图片 SEO。
// 复用 src/lib/sticker-styles.ts 的 style prefix 与 buildPrompt 拼接逻辑。
// 用法:
//   node scripts/generate-worldcup-assets.mjs 0      # 只生成第 0 张(测试)
//   node scripts/generate-worldcup-assets.mjs all     # 生成全部(并发3)
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const envText = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const API_KEY = envText.match(/^SENSENOVA_API_KEY=(.+)$/m)?.[1]?.trim();
if (!API_KEY) {
  console.error("SENSENOVA_API_KEY 未在 .env.local 找到");
  process.exit(1);
}

const API_URL = "https://token.sensenova.cn/v1/images/generations";
const OUT_DIR = path.join(ROOT, "public/examples/world-cup");

// style prefix 复制自 src/lib/sticker-styles.ts
const STYLE_PREFIX = {
  "3d-rendered":
    "3D rendered sticker, Pixar-like quality, soft volumetric lighting, vibrant saturated colors, smooth surfaces, white background, die-cut sticker edges",
  chibi:
    "chibi style sticker, big head small body, simple cute design, bold outlines, flat colors, white background, die-cut sticker edges",
  "cute-kawaii":
    "cute kawaii sticker illustration, pastel colors, round shapes, adorable, soft shading, chibi-like, white background, die-cut sticker edges",
  cartoon:
    "cartoon sticker, bold outlines, bright flat colors, expressive, comic book style, white background, die-cut sticker edges",
  "pixel-art":
    "pixel art sticker, 16-bit retro game style, clean pixels, vibrant colors, white background, die-cut sticker edges",
};

// 文件名全部语义化命中 GSC 关键词；球队覆盖 GSC 高需求地区(南美/亚洲/北美)
const ASSETS = [
  { file: "world-cup-trophy-sticker.png", style: "3d-rendered", subject: "a golden FIFA World Cup trophy shining brightly, soccer champion prize, sparkles", alt: "AI generated golden World Cup trophy sticker" },
  { file: "brazil-world-cup-sticker.png", style: "chibi", subject: "a cute football wearing Brazil flag yellow green and blue as a cape, celebrating", alt: "AI generated Brazil World Cup sticker" },
  { file: "argentina-world-cup-sticker.png", style: "chibi", subject: "a chibi football player in Argentina blue and white striped jersey celebrating a goal", alt: "AI generated Argentina World Cup sticker" },
  { file: "japan-world-cup-sticker.png", style: "cute-kawaii", subject: "a kawaii samurai football player with Japan rising sun red and white background", alt: "AI generated Japan World Cup sticker" },
  { file: "usa-world-cup-sticker.png", style: "cartoon", subject: "a cartoon football with USA stars and stripes flag pattern, energetic motion lines", alt: "AI generated USA World Cup sticker" },
  { file: "mexico-world-cup-sticker.png", style: "pixel-art", subject: "a pixel art football with Mexico flag green white and red colors", alt: "AI generated Mexico World Cup sticker" },
  { file: "world-cup-football-sticker.png", style: "cute-kawaii", subject: "a cute classic black and white soccer football with a happy smiley face", alt: "AI generated cute World Cup football sticker" },
  { file: "world-cup-fan-celebration-sticker.png", style: "cartoon", subject: "a cartoon soccer fan celebrating a goal with face paint and scarf, cheering wildly", alt: "AI generated World Cup fan celebration sticker" },
  { file: "france-world-cup-sticker.png", style: "chibi", subject: "a cute football wearing France flag blue white and red as a cape, celebrating", alt: "AI generated France World Cup sticker" },
  { file: "germany-world-cup-sticker.png", style: "cartoon", subject: "a cartoon football player in Germany white jersey with black red and gold colors", alt: "AI generated Germany World Cup sticker" },
  { file: "england-world-cup-sticker.png", style: "chibi", subject: "a chibi football with England red and white Saint George cross flag pattern", alt: "AI generated England World Cup sticker" },
];

function buildPrompt(subject, style) {
  return `${STYLE_PREFIX[style]}, ${subject}, NO text, NO words, NO letters on the sticker`;
}

async function genOne(asset) {
  const prompt = buildPrompt(asset.subject, asset.style);
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "sensenova-u1-fast", prompt, size: "2048x2048", n: 1 }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const imageUrl = data?.data?.[0]?.url;
  if (!imageUrl) throw new Error("no image url in response");
  const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30_000) });
  if (!imgRes.ok) throw new Error(`download ${imgRes.status}`);
  const raw = Buffer.from(await imgRes.arrayBuffer());
  const out = await sharp(raw).resize(512, 512, { fit: "inside" }).png({ quality: 90 }).toBuffer();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, asset.file), out);
  return out.length;
}

// 简单并发池
async function runPool(items, worker, concurrency) {
  const queue = items.map((it) => ({ it, idx: items.indexOf(it) }));
  const results = [];
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (queue.length) {
        const job = queue.shift();
        if (!job) break;
        try {
          const size = await worker(job.it);
          console.log(`✓ [${ASSETS.indexOf(job.it)}] ${job.it.file} (${(size / 1024).toFixed(0)}KB)`);
          results.push({ file: job.it.file, ok: true });
        } catch (e) {
          console.error(`✗ [${ASSETS.indexOf(job.it)}] ${job.it.file}: ${e.message}`);
          results.push({ file: job.it.file, ok: false, error: e.message });
        }
      }
    })
  );
  return results;
}

const arg = process.argv[2] ?? "0";
let targets;
if (arg === "all") {
  targets = ASSETS;
} else if (arg.includes(",")) {
  targets = arg
    .split(",")
    .map((i) => parseInt(i, 10))
    .filter((i) => !Number.isNaN(i) && i >= 0 && i < ASSETS.length)
    .map((i) => ASSETS[i]);
  if (targets.length === 0) {
    console.error(`无有效索引，应为 0-${ASSETS.length - 1}、逗号分隔或 all`);
    process.exit(1);
  }
} else {
  const idx = parseInt(arg, 10);
  if (Number.isNaN(idx) || idx < 0 || idx >= ASSETS.length) {
    console.error(`参数应为 0-${ASSETS.length - 1} 或 all`);
    process.exit(1);
  }
  targets = [ASSETS[idx]];
}

console.log(`生成 ${targets.length} 张 → public/examples/world-cup/`);
const results = await runPool(targets, genOne, targets.length === 1 ? 1 : 3);
const ok = results.filter((r) => r.ok).length;
console.log(`\n完成 ${ok}/${results.length} 张`);
process.exit(ok === results.length ? 0 : 1);
