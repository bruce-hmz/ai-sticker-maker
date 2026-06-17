// 为剩余 32 队生成 4 张贴纸（world-cup/player/mascot/flag）
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
  { slug: "south-africa", name: "South Africa", jersey: "gold and green jersey", flag: "South Africa multicolor flag", mascotPrompt: "a cute springbok" },
  { slug: "south-korea", name: "South Korea", jersey: "red jersey", flag: "South Korea white and red flag", mascotPrompt: "a cute tiger" },
  { slug: "czech-republic", name: "Czech Republic", jersey: "red jersey", flag: "Czech Republic white red and blue flag", mascotPrompt: "a cute lion" },
  { slug: "canada", name: "Canada", jersey: "red jersey", flag: "Canada red and white flag", mascotPrompt: "a cute beaver" },
  { slug: "bosnia", name: "Bosnia", jersey: "white jersey", flag: "Bosnia blue yellow and white flag", mascotPrompt: "a cute fleur-de-lis flower" },
  { slug: "qatar", name: "Qatar", jersey: "maroon jersey", flag: "Qatar maroon and white flag", mascotPrompt: "a cute falcon" },
  { slug: "switzerland", name: "Switzerland", jersey: "red jersey", flag: "Switzerland red and white flag", mascotPrompt: "a cute cow" },
  { slug: "haiti", name: "Haiti", jersey: "blue jersey", flag: "Haiti blue and red flag", mascotPrompt: "a cute palm tree" },
  { slug: "scotland", name: "Scotland", jersey: "navy jersey", flag: "Scotland blue and white flag", mascotPrompt: "a cute thistle flower" },
  { slug: "paraguay", name: "Paraguay", jersey: "red and white striped jersey", flag: "Paraguay red white and blue flag", mascotPrompt: "a cute jaguar" },
  { slug: "australia", name: "Australia", jersey: "yellow jersey", flag: "Australia blue red and white flag", mascotPrompt: "a cute kangaroo" },
  { slug: "turkey", name: "Turkey", jersey: "red jersey", flag: "Turkey red and white flag", mascotPrompt: "a cute crescent moon" },
  { slug: "curacao", name: "Curaçao", jersey: "blue jersey", flag: "Curaçao blue and yellow flag", mascotPrompt: "a cute tropical fish" },
  { slug: "ivory-coast", name: "Ivory Coast", jersey: "orange jersey", flag: "Ivory Coast orange white and green flag", mascotPrompt: "a cute elephant" },
  { slug: "ecuador", name: "Ecuador", jersey: "yellow jersey", flag: "Ecuador yellow blue and red flag", mascotPrompt: "a cute condor" },
  { slug: "sweden", name: "Sweden", jersey: "yellow jersey", flag: "Sweden blue and yellow flag", mascotPrompt: "a cute viking" },
  { slug: "tunisia", name: "Tunisia", jersey: "red jersey", flag: "Tunisia red and white flag", mascotPrompt: "a cute camel" },
  { slug: "egypt", name: "Egypt", jersey: "red jersey", flag: "Egypt red white and black flag", mascotPrompt: "a cute pyramid" },
  { slug: "iran", name: "Iran", jersey: "white jersey", flag: "Iran green white and red flag", mascotPrompt: "a cute Persian cat" },
  { slug: "new-zealand", name: "New Zealand", jersey: "white jersey", flag: "New Zealand blue red and white flag", mascotPrompt: "a cute kiwi bird" },
  { slug: "saudi-arabia", name: "Saudi Arabia", jersey: "white jersey", flag: "Saudi Arabia green and white flag", mascotPrompt: "a cute falcon" },
  { slug: "cape-verde", name: "Cape Verde", jersey: "blue jersey", flag: "Cape Verde blue white and red flag", mascotPrompt: "a cute sea turtle" },
  { slug: "senegal", name: "Senegal", jersey: "white jersey", flag: "Senegal green yellow and red flag", mascotPrompt: "a cute baobab tree" },
  { slug: "norway", name: "Norway", jersey: "red jersey", flag: "Norway red white and blue flag", mascotPrompt: "a cute troll" },
  { slug: "iraq", name: "Iraq", jersey: "white jersey", flag: "Iraq red white and black flag", mascotPrompt: "a cute date palm tree" },
  { slug: "algeria", name: "Algeria", jersey: "green jersey", flag: "Algeria green white and red flag", mascotPrompt: "a cute desert fox" },
  { slug: "austria", name: "Austria", jersey: "red jersey", flag: "Austria red and white flag", mascotPrompt: "a cute slice of Sachertorte cake" },
  { slug: "jordan", name: "Jordan", jersey: "red jersey", flag: "Jordan black white green and red flag", mascotPrompt: "a cute Petra treasury building" },
  { slug: "dr-congo", name: "DR Congo", jersey: "blue jersey", flag: "DR Congo sky blue red and yellow flag", mascotPrompt: "a cute okapi animal" },
  { slug: "uzbekistan", name: "Uzbekistan", jersey: "white jersey", flag: "Uzbekistan blue white and green flag", mascotPrompt: "a cute snow leopard" },
  { slug: "ghana", name: "Ghana", jersey: "white jersey", flag: "Ghana red yellow and green flag", mascotPrompt: "a cute elephant" },
  { slug: "panama", name: "Panama", jersey: "red jersey", flag: "Panama blue red and white flag", mascotPrompt: "a cute toucan" },
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
  THEMES.map((th) => ({ file: `${t.slug}-${th.suffix}-sticker.png`, style: th.style, prompt: buildPrompt(th.tmpl(t), th.style) }))
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

console.log(`生成 ${targets.length} 张 → public/examples/world-cup/ (并发1 + 间隔3s，避免 rpm 限流)`);
const OUT_DIR = path.resolve("public/examples/world-cup");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const a of targets) {
  if (fs.existsSync(path.join(OUT_DIR, a.file))) {
    console.log(`skip ${a.file} (exists)`);
    continue;
  }
  const ok = await genOne(a);
  if (ok) console.log(`✓ ${a.file}`);
  await sleep(3000);
}
