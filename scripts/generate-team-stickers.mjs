// 为 8 个热门新队生成 4 张主题贴纸（world-cup/player/mascot/flag）
import fs from "fs";
import path from "path";
import sharp from "sharp";

const envText = fs.readFileSync(".env.local", "utf8");
const API_KEY = envText.match(/^SENSENOVA_API_KEY=(.+)$/m)?.[1]?.trim();
const API_URL = "https://token.sensenova.cn/v1/images/generations";

const STYLE_PREFIX = {
  chibi:
    "chibi style sticker, big head small body, simple cute design, bold outlines, flat colors, white background, die-cut sticker edges",
  "cute-kawaii":
    "cute kawaii sticker illustration, pastel colors, round shapes, adorable, soft shading, chibi-like, white background, die-cut sticker edges",
};

const HOT_TEAMS = [
  { slug: "portugal", name: "Portugal", jersey: "red jersey", flag: "Portugal red and green flag", mascotPrompt: "a cute Portuguese Barcelos rooster" },
  { slug: "netherlands", name: "Netherlands", jersey: "orange jersey", flag: "Netherlands orange flag", mascotPrompt: "a cute brave Dutch lion" },
  { slug: "spain", name: "Spain", jersey: "red jersey", flag: "Spain red and yellow flag", mascotPrompt: "a cute Spanish fighting bull" },
  { slug: "belgium", name: "Belgium", jersey: "red jersey", flag: "Belgium black yellow red flag", mascotPrompt: "a cute Belgian lion" },
  { slug: "croatia", name: "Croatia", jersey: "red and white checkered jersey", flag: "Croatia red white blue flag", mascotPrompt: "a cute pine marten animal" },
  { slug: "colombia", name: "Colombia", jersey: "yellow jersey", flag: "Colombia yellow blue red flag", mascotPrompt: "a cute Andean condor bird" },
  { slug: "morocco", name: "Morocco", jersey: "red jersey", flag: "Morocco red and green flag", mascotPrompt: "a cute Atlas mountain lion" },
  { slug: "uruguay", name: "Uruguay", jersey: "sky blue jersey", flag: "Uruguay blue and white flag", mascotPrompt: "a cute capybara animal" },
];

const THEMES = [
  { suffix: "world-cup", style: "chibi", tmpl: (t) => `a cute football wearing ${t.name} flag colors as a cape` },
  { suffix: "player", style: "chibi", tmpl: (t) => `a chibi football player in ${t.jersey}, happy smiling face, simple flat design` },
  { suffix: "mascot", style: "cute-kawaii", tmpl: (t) => t.mascotPrompt },
  { suffix: "flag", style: "cute-kawaii", tmpl: (t) => `a cute ${t.flag}, simple flat design, bright` },
];

function buildPrompt(subject, style) {
  return `${STYLE_PREFIX[style]}, ${subject}, isolated on a clean solid pure white background, NO black background, NO dark background, NO text, NO words, NO letters on the sticker`;
}

const ASSETS = HOT_TEAMS.flatMap((t) =>
  THEMES.map((th) => ({
    file: `${t.slug}-${th.suffix}-sticker.png`,
    style: th.style,
    prompt: buildPrompt(th.tmpl(t), th.style),
    team: t.slug,
  }))
);

async function genOne(asset) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "sensenova-u1-fast", prompt: asset.prompt, size: "2048x2048", n: 1 }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 150)}`);
    const data = await res.json();
    const url = data?.data?.[0]?.url;
    if (!url) throw new Error("no url");
    const imgRes = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    const raw = Buffer.from(await imgRes.arrayBuffer());
    const out = await sharp(raw).resize(512, 512, { fit: "inside" }).png({ quality: 90 }).toBuffer();
    const OUT_DIR = path.resolve("public/examples/world-cup");
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, asset.file), out);
    return true;
  } catch (e) {
    console.error(`✗ ${asset.file}: ${e.message}`);
    return false;
  }
}

const arg = process.argv[2] ?? "all";
let targets = ASSETS;
if (arg !== "all") {
  if (arg.includes(",")) targets = arg.split(",").map((i) => ASSETS[parseInt(i, 10)]).filter(Boolean);
  else if (/^\d+-\d+$/.test(arg)) { const [s, e] = arg.split("-").map(Number); targets = ASSETS.slice(s, e + 1); }
  else targets = [ASSETS[parseInt(arg, 10)]];
}

console.log(`生成 ${targets.length} 张 → public/examples/world-cup/`);
const queue = [...targets];
await Promise.all([0, 1, 2, 3].map(async () => {
  while (queue.length) {
    const a = queue.shift();
    if (!a) break;
    const ok = await genOne(a);
    if (ok) console.log(`✓ ${a.file}`);
  }
}));
