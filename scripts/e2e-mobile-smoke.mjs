import { chromium } from "playwright";
import { execSync } from "node:child_process";
const BASE = process.env.E2E_BASE ?? "https://ai-sticker-maker-aqjvk7fr9-bruce-hmzs-projects.vercel.app";
const CHROME = execSync("ls -d /Users/bruce/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google\\ Chrome\\ for\\ Testing.app/Contents/MacOS/Google\\ Chrome\\ for\\ Testing 2>/dev/null | tail -1").toString().trim();
const browser = await chromium.launch({ executablePath: CHROME || undefined, headless: true });
const phone = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  isMobile: true, hasTouch: true,
});
const page = await phone.newPage();
await page.goto(BASE, { waitUntil: "networkidle" });
const hero = await page.textContent("h1");
console.log("hero:", hero?.trim().slice(0, 50));
const ctaVisible = await page.locator("text=Upload a Photo").first().isVisible();
console.log("hero CTA visible on mobile:", ctaVisible);
const studioVisible = await page.locator("#pack-studio").isVisible();
console.log("pack studio visible:", studioVisible);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 4);
console.log("horizontal overflow:", overflow);
await page.locator('#pack-studio input[type="file"]').setInputFiles("/tmp/test-cat.jpg");
await page.waitForSelector("text=Create My Sticker Pack", { timeout: 15000 });
console.log("mobile upload + preview: PASS");
await page.screenshot({ path: "/tmp/mobile-preview.png" });
await browser.close();
console.log("MOBILE SMOKE: PASS");
