// 检测贴纸背景：采样图像最外边缘像素，分类为 TRANSPARENT(透明) / DARK(黑底,需重生) / LIGHT(白底,OK)
import sharp from "sharp";
import fs from "fs";
import path from "path";

const dir = path.resolve("public/examples/world-cup");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png")).sort();

console.log(`检测 ${files.length} 张贴纸背景（采样最外边缘）...\n`);
const dark = [];
for (const file of files) {
  const buf = fs.readFileSync(path.join(dir, file));
  const { data, info } = await sharp(buf)
    .resize(64, 64, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width,
    h = info.height,
    ch = info.channels;
  let transparent = 0,
    darkPx = 0,
    lightPx = 0,
    total = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (x > 1 && x < w - 2 && y > 1 && y < h - 2) continue; // 只采样最外2像素边缘
      const idx = (y * w + x) * ch;
      const a = data[idx + 3];
      if (a < 128) {
        transparent++;
        total++;
        continue;
      }
      const lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      if (lum < 60) darkPx++;
      else lightPx++;
      total++;
    }
  }
  const tRatio = transparent / total;
  const dRatio = darkPx / total;
  const tag =
    tRatio > 0.5 ? "TRANSPARENT" : dRatio > 0.4 ? "DARK⚠️ " : "LIGHT✓  ";
  if (tag.startsWith("DARK")) dark.push(file);
  console.log(
    `${tag} transparent=${(tRatio * 100).toFixed(0).padStart(3)}% dark=${(dRatio * 100).toFixed(0).padStart(3)}%  ${file}`
  );
}
console.log(
  `\n黑底需重生 (${dark.length}): ${dark.length ? dark.join(", ") : "无"}`
);
