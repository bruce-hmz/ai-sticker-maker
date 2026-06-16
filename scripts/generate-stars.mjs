// 为每国生成当家球星卡通贴纸，强调标志性特征以提升 AI 还原度
// 之后批量检测还原度，只保留能一眼认出(>=6/10)的
import fs from "fs";
import path from "path";
import sharp from "sharp";

const envText = fs.readFileSync(".env.local", "utf8");
const API_KEY = envText.match(/^SENSENOVA_API_KEY=(.+)$/m)?.[1]?.trim();
const API_URL = "https://token.sensenova.cn/v1/images/generations";

const STARS = [
  { team: "brazil", name: "Neymar", prompt: "cartoon sticker of Brazilian football star Neymar Jr, smiling confidently, iconic short spiky mohawk hairstyle, wearing yellow and green Brazil jersey, die-cut sticker edges, isolated on pure white background, NO text" },
  { team: "argentina", name: "Messi", prompt: "cartoon sticker of Argentine football legend Lionel Messi, short brown hair, distinctive full beard, stocky build, calm focused eyes, wearing blue and white striped Argentina jersey, die-cut sticker edges, isolated on pure white background, NO text" },
  { team: "france", name: "Mbappe", prompt: "cartoon sticker of French football star Kylian Mbappe, big bright smile, short dark hair, young, wearing blue France jersey, die-cut sticker edges, isolated on pure white background, NO text" },
  { team: "germany", name: "Musiala", prompt: "cartoon sticker of German football star Jamal Musiala, young, short curly dark hair, friendly smile, wearing white Germany jersey, die-cut sticker edges, isolated on pure white background, NO text" },
  { team: "england", name: "Bellingham", prompt: "cartoon sticker of English football star Jude Bellingham, short faded haircut, confident calm expression, wearing white England jersey, die-cut sticker edges, isolated on pure white background, NO text" },
  { team: "usa", name: "Pulisic", prompt: "cartoon sticker of American football star Christian Pulisic, short brown hair, friendly smile, wearing red white USA jersey, die-cut sticker edges, isolated on pure white background, NO text" },
  { team: "mexico", name: "Chicharito", prompt: "cartoon sticker of Mexican football star Javier Hernandez Chicharito, short dark hair, friendly warm smile, wearing green Mexico jersey, die-cut sticker edges, isolated on pure white background, NO text" },
  { team: "japan", name: "Mitoma", prompt: "cartoon sticker of Japanese football star Kaoru Mitoma, short black hair, calm focused expression, wearing blue Japan jersey, die-cut sticker edges, isolated on pure white background, NO text" },
];

async function gen(star) {
  const file = `star-${star.team}-sticker.png`;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "sensenova-u1-fast", prompt: star.prompt, size: "2048x2048", n: 1 }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) { console.error(`✗ ${star.name}: API ${res.status}: ${(await res.text()).slice(0, 100)}`); return; }
    const data = await res.json();
    const url = data?.data?.[0]?.url;
    if (!url) { console.error(`✗ ${star.name}: no url`); return; }
    const imgRes = await fetch(url, { signal: AbortSignal.timeout(30000) });
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const out = await sharp(buf).resize(512, 512, { fit: "inside" }).png().toBuffer();
    fs.writeFileSync(path.join("public/examples/world-cup", file), out);
    console.log(`✓ ${star.name} → ${file}`);
  } catch (e) { console.error(`✗ ${star.name}: ${e.message}`); }
}

const filterTeam = process.argv[2];
const targets = filterTeam ? STARS.filter((s) => s.team === filterTeam) : STARS;
const queue = [...targets];
await Promise.all([0, 1, 2].map(async () => {
  while (queue.length) { const s = queue.shift(); if (!s) break; await gen(s); }
}));
console.log("完成");
