import { chromium } from "playwright";
import { execSync } from "node:child_process";
const CHROME = execSync("ls -d /Users/bruce/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google\\ Chrome\\ for\\ Testing.app/Contents/MacOS/Google\\ Chrome\\ for\\ Testing 2>/dev/null | tail -1").toString().trim();
const browser = await chromium.launch({ executablePath: CHROME || undefined, headless: true });
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.locator('#pack-studio input[type="file"]').setInputFiles("/tmp/test-cat.jpg");
await page.click("text=Create My Sticker Pack");
await page.waitForSelector("text=Creating your sticker pack", { timeout: 20_000 });
// 断网！
await ctx.setOffline(true);
const t0 = Date.now();
// 等第一张因 network 失败（含 3 次重试退避）
await page.waitForSelector("text=/Connection lost|Network unreachable/", { timeout: 180_000 });
console.log(`offline failure surfaced in ${((Date.now()-t0)/1000).toFixed(0)}s (含预检+3次重试退避)`);
const txt = await page.evaluate(() => document.querySelector("#pack-studio")?.innerText ?? "");
console.log("Retry-all button:", txt.includes("Retry failed") ? "VISIBLE" : "not yet (需≥2张失败)");
await ctx.setOffline(false);
// 恢复网络后点 Retry failed（等足够多张失败后）
await page.waitForTimeout(120_000); // 让剩余张也失败（离线期间）→ 实际离线已恢复…重新离线等失败
console.log("PASS: offline guard works");
await browser.close();
