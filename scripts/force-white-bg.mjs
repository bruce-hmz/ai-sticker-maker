// 强制白底：把纯黑背景像素(亮度<阈值)转透明再填白，保留亮色主体与深灰细节
import sharp from "sharp";
import fs from "fs";

const THRESHOLD = 40; // 亮度低于此值视为背景(纯黑)；主体深灰通常 >40

async function forceWhiteBg(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width,
    h = info.height,
    ch = info.channels;
  let changed = 0;
  for (let i = 0; i < w * h; i++) {
    const idx = i * ch;
    const lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    if (lum < THRESHOLD) {
      data[idx + 3] = 0; // 透明
      changed++;
    }
  }
  await sharp(Buffer.from(data), {
    raw: { width: w, height: h, channels: ch },
  })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(file);
  return changed;
}

const files = process.argv.slice(2);
for (const f of files) {
  const p = `public/examples/world-cup/${f}`;
  if (!fs.existsSync(p)) {
    console.log(`跳过(不存在): ${f}`);
    continue;
  }
  const n = await forceWhiteBg(p);
  console.log(`✓ ${f} (透明化 ${n} 像素后填白)`);
}
