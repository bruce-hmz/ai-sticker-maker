// 生成 anime + emoji 主题贴纸素材（用于 /stickers/anime, /stickers/emoji 主题页）
// anime 用泛 anime 风格（大眼睛/彩色头发/Q版），避开真实动漫角色版权
import fs from "fs";
import path from "path";
import sharp from "sharp";

const envText = fs.readFileSync(".env.local", "utf8");
const API_KEY = envText.match(/^SENSENOVA_API_KEY=(.+)$/m)?.[1]?.trim();
const API_URL = "https://token.sensenova.cn/v1/images/generations";

const STYLE_PREFIX = {
  "cute-kawaii":
    "cute kawaii sticker illustration, pastel colors, round shapes, adorable, soft shading, chibi-like, white background, die-cut sticker edges",
  chibi:
    "chibi style sticker, big head small body, simple cute design, bold outlines, flat colors, white background, die-cut sticker edges",
  cartoon:
    "cartoon sticker, bold outlines, bright flat colors, expressive, comic book style, white background, die-cut sticker edges",
};

const ASSETS = [
  // anime (6) — 泛 anime 风格，避开真实动漫角色版权
  { file: "anime-girl-big-eyes.png", style: "cute-kawaii", subject: "a cute anime girl with big sparkly blue eyes and long pink hair, smiling happily, manga style" },
  { file: "anime-boy-chibi.png", style: "chibi", subject: "a chibi anime boy with spiky black hair and big expressive eyes, manga style" },
  { file: "anime-princess.png", style: "chibi", subject: "a chibi anime princess wearing a crown and a pretty dress, big eyes, manga style" },
  { file: "anime-magical-girl.png", style: "cute-kawaii", subject: "an anime magical girl with flowing colorful hair and sparkles, manga style" },
  { file: "anime-warrior-chibi.png", style: "chibi", subject: "a chibi anime warrior hero holding a sword, determined big eyes, manga style" },
  { file: "anime-idol-star.png", style: "cartoon", subject: "a cute anime idol singer holding a microphone, star shaped eyes, manga style" },
  // emoji (6) — 表情贴纸
  { file: "emoji-laughing.png", style: "cute-kawaii", subject: "a cute laughing emoji face with tears of joy and a big open smile" },
  { file: "emoji-heart-eyes.png", style: "cute-kawaii", subject: "a kawaii emoji face with big red heart eyes, in love expression" },
  { file: "emoji-cool-sunglasses.png", style: "cartoon", subject: "a cool emoji face wearing sunglasses, confident smile" },
  { file: "emoji-sad-puppy.png", style: "cute-kawaii", subject: "a cute sad emoji with big teary puppy eyes, pouty lips" },
  { file: "emoji-wink-tongue.png", style: "cartoon", subject: "a playful winking emoji face with tongue out, cheeky" },
  { file: "emoji-star-struck.png", style: "cute-kawaii", subject: "a star struck emoji face with stars for eyes, amazed expression" },
];

function buildPrompt(subject, style) {
  return `${STYLE_PREFIX[style]}, ${subject}, isolated on a clean solid pure white background, NO black background, NO dark background, NO text, NO words, NO letters on the sticker`;
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
  const url = data?.data?.[0]?.url;
  if (!url) throw new Error("no image url");
  const imgRes = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  const raw = Buffer.from(await imgRes.arrayBuffer());
  const out = await sharp(raw).resize(512, 512, { fit: "inside" }).png({ quality: 90 }).toBuffer();
  const OUT_DIR = path.resolve("public/examples");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, asset.file), out);
  return out.length;
}

const arg = process.argv[2] ?? "all";
let targets;
if (arg === "all") targets = ASSETS;
else if (arg.includes(",")) targets = arg.split(",").map((i) => ASSETS[parseInt(i, 10)]).filter(Boolean);
else if (/^\d+-\d+$/.test(arg)) { const [s, e] = arg.split("-").map(Number); targets = ASSETS.slice(s, e + 1); }
else targets = [ASSETS[parseInt(arg, 10)]];

console.log(`生成 ${targets.length} 张 → public/examples/`);
const queue = [...targets];
await Promise.all([0, 1, 2].map(async () => {
  while (queue.length) {
    const a = queue.shift();
    if (!a) break;
    try {
      const n = await genOne(a);
      console.log(`✓ ${a.file} (${(n / 1024).toFixed(0)}KB)`);
    } catch (e) {
      console.error(`✗ ${a.file}: ${e.message}`);
    }
  }
}));
