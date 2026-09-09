import { chromium } from "playwright";
import { execSync } from "node:child_process";
const CHROME = execSync("ls -d /Users/bruce/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google\\ Chrome\\ for\\ Testing.app/Contents/MacOS/Google\\ Chrome\\ for\\ Testing 2>/dev/null | tail -1").toString().trim();
const browser = await chromium.launch({ executablePath: CHROME || undefined, headless: true });
const page = await browser.newPage();
const logs = [];
page.on("console", (m) => { const t = m.text(); if (!/favicon|AdSense|google\.com|Framing|postMessage/i.test(t)) logs.push(`[${m.type()}] ${t.slice(0,300)}`); });
page.on("pageerror", (e) => logs.push(`[pageerror] ${String(e).slice(0,400)}`));
page.on("response", (r) => { if (r.url().includes("/api/pack")) logs.push(`[api] ${r.status()} ${r.url().slice(-30)} ${r.request().timing()?.responseEnd ?? ''}`); });
await page.goto("https://stickersit.com", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await page.locator('#pack-studio input[type="file"]').setInputFiles("/tmp/test-cat.jpg");
await page.waitForSelector("text=Create My Sticker Pack", { timeout: 20_000 });
console.log("upload → preview OK, clicking generate");
await page.click("text=Create My Sticker Pack");
for (let i = 0; i < 36; i++) {
  await page.waitForTimeout(10_000);
  const t = await page.evaluate(() => document.querySelector("#pack-studio")?.innerText ?? "");
  const failed = (t.match(/Generation failed/g) || []).length;
  const ready = t.match(/(\d) of 6/) ? Number(t.match(/(\d) of 6/)[1]) : 0;
  const drawing = (t.match(/Drawing/g) || []).length;
  console.log(`t=${(i+1)*10}s ready=${ready} drawing=${drawing} failed=${failed}`);
  if (failed > 0 || ready >= 2) break;
}
await page.screenshot({ path: "/tmp/user-repro2.png" });
console.log("--- console/api ---");
console.log(logs.slice(0, 30).join("\n"));
await browser.close();
