/* P1 QA: (1) background-tab generation keeps running; (2) mobile viewports 375/430
 * through full pack. Run: node scripts/e2e-hidden-tab-and-mobile.mjs */
import { chromium } from "playwright";
import { execSync } from "node:child_process";

const BASE = process.env.E2E_BASE ?? "http://localhost:3000";
const PHOTO = process.env.E2E_PHOTO ?? "/tmp/test-cat.jpg";
const CHROME = execSync("ls -d /Users/bruce/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google\\ Chrome\\ for\\ Testing.app/Contents/MacOS/Google\\ Chrome\\ for\\ Testing 2>/dev/null | tail -1").toString().trim();
const browser = await chromium.launch({ executablePath: CHROME || undefined, headless: true });
let failed = 0;
const mark = (name, ok, detail = "") => { failed += ok ? 0 : 1; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`); };

// --- 1. Hidden-tab test ---
{
  const ctx = await browser.newContext();
  const pageA = await ctx.newPage();
  const pageB = await ctx.newPage(); // decoy tab
  await pageA.goto(BASE, { waitUntil: "domcontentloaded" });
  await pageB.goto(BASE, { waitUntil: "domcontentloaded" });
  await pageA.locator('#pack-studio input[type="file"]').setInputFiles(PHOTO);
  await pageA.click("text=Create My Sticker Pack");
  await pageA.waitForSelector("text=Creating your sticker pack", { timeout: 30_000 });
  await pageB.bringToFront(); // A is now hidden
  await pageA.waitForSelector("text=/6 of 6 stickers ready|Your sticker pack is ready/", { timeout: 6 * 60_000 });
  const pngs = await pageA.evaluate(() => document.querySelectorAll("#pack-studio img[src^='data:image/png']").length);
  mark("hidden tab: full pack completes in background", pngs === 6, `pngs=${pngs}`);
  await ctx.close();
}

// --- 2. Mobile viewports through full pack ---
for (const width of [375, 430]) {
  const ctx = await browser.newContext({
    viewport: { width, height: 812 },
    isMobile: true, hasTouch: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 4);
  mark(`mobile ${width}: no horizontal overflow`, !overflow);
  await page.locator('#pack-studio input[type="file"]').setInputFiles(PHOTO);
  await page.waitForSelector("text=Create My Sticker Pack", { timeout: 20_000 });
  await page.click("text=Create My Sticker Pack");
  try {
    await page.waitForSelector("text=Your first sticker is ready", { timeout: 90_000 });
    mark(`mobile ${width}: first-sticker banner`, true);
  } catch {
    mark(`mobile ${width}: first-sticker banner`, false, "banner not seen");
  }
  await page.waitForSelector("text=/6 of 6 stickers ready|Your sticker pack is ready/", { timeout: 6 * 60_000 });
  const dl = page.locator('#pack-studio button:has-text("Download")').nth(0);
  await dl.click({ timeout: 20_000 });
  mark(`mobile ${width}: per-sticker download tappable`, true);
  await page.screenshot({ path: `/tmp/e2e-mobile-${width}.png` });
  await ctx.close();
}

await browser.close();
console.log(failed === 0 ? "\nP1 QA: ALL PASS" : `\nP1 QA: ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
