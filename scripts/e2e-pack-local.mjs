/* Local browser e2e for the Sticker Pack P0 flow.
 * Upload → generate (real SenseNova) → bg removal → grid → ZIP download.
 * Run: node scripts/e2e-pack-local.mjs
 */
import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";
import { unzipSync } from "fflate";

const BASE = process.env.E2E_BASE ?? "http://localhost:3000";
const PHOTO = process.env.E2E_PHOTO ?? "/tmp/test-cat.jpg";
const CHROME = execSync(
  "ls -d /Users/bruce/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Google\\ Chrome\\ for\\ Testing.app/Contents/MacOS/Google\\ Chrome\\ for\\ Testing 2>/dev/null | tail -1",
).toString().trim();

const results = { steps: [], errors: [] };
const mark = (name, ok, detail = "") => {
  results.steps.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

const browser = await chromium.launch({ executablePath: CHROME || undefined, headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => consoleErrors.push(String(err)));

try {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  const h1 = await page.textContent("h1");
  mark("hero is photo-first", /Turn One Photo Into a/i.test(h1 ?? ""), `h1="${h1?.trim()}"`);

  const noWorldCup = !(await page.locator("text=World Cup 2026 Lab").count());
  mark("World Cup promo removed from homepage", noWorldCup);

  const packStudioVisible = await page.locator("#pack-studio").isVisible();
  mark("pack studio present", packStudioVisible);
  const textStudioVisible = await page.locator("#text-studio").isVisible();
  mark("text generator kept (secondary)", textStudioVisible);

  // Upload the reference photo
  const fileInput = page.locator('#pack-studio input[type="file"]');
  await fileInput.setInputFiles(PHOTO);
  await page.waitForSelector("text=Create My Sticker Pack", { timeout: 20_000 });
  mark("photo upload + preview", true);

  // Generate — real generation, up to ~6×35s + cleanup
  const t0 = Date.now();
  await page.click("text=Create My Sticker Pack");
  await page.waitForSelector("text=Creating your sticker pack", { timeout: 30_000 });
  mark("generation started with real progress", true);

  let sawProgressText = false;
  try {
    // "0 of 6" while the first sticker draws is already real progress evidence.
    await page.waitForSelector("text=/[0-5] of 6 stickers ready/", { timeout: 60_000 });
    sawProgressText = true;
  } catch {
    // pack may have gone too fast to catch mid-state; not fatal
  }
  mark("intermediate progress visible (n of 6)", sawProgressText);

  // Progressive first-value UX: banner appears as soon as sticker #1 lands.
  let sawFirstStickerBanner = false;
  try {
    await page.waitForSelector("text=Your first sticker is ready", { timeout: 90_000 });
    sawFirstStickerBanner = true;
  } catch {
    /* banner may have been missed if run was fast — not fatal */
  }
  mark("first-sticker banner (progressive value)", sawFirstStickerBanner);

  await page.waitForSelector("text=Your sticker pack is ready", { timeout: 6 * 60 * 1000 });
  const genSeconds = Math.round((Date.now() - t0) / 1000);
  mark("all 6 stickers completed", true, `${genSeconds}s total`);

  // Transparent PNGs in the grid?
  const alphaProbe = await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll("#pack-studio img[src^='data:image/png']"));
    let transparentCount = 0;
    for (const img of imgs) {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let partial = 0, opaque = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) partial++;
        else if (data[i] < 255) { partial++; opaque++; break; }
      }
      if (partial > 0) transparentCount++;
    }
    return { gridPngs: imgs.length, transparentCount };
  });
  mark("grid shows 6 PNG stickers", alphaProbe.gridPngs === 6, `pngs=${alphaProbe.gridPngs}`);
  mark("downloaded-grid PNGs have real alpha", alphaProbe.transparentCount === 6, `transparent=${alphaProbe.transparentCount}`);

  // Download pack ZIP
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 60_000 }),
    page.locator('#pack-studio button:has-text("Download Pack")').click(),
  ]);
  const zipPath = "/tmp/e2e-pack.zip";
  await download.saveAs(zipPath);
  const nameOk = download.suggestedFilename();
  mark("ZIP filename", nameOk === "stickersit-reaction-pack.zip", nameOk);

  const entries = unzipSync(new Uint8Array(readFileSync(zipPath)));
  const pngNames = Object.keys(entries).filter((k) => k.endsWith(".png")).sort();
  const webpNames = Object.keys(entries).filter((k) => k.endsWith(".webp")).sort();
  mark("ZIP contains 6 transparent PNGs", pngNames.length === 6, pngNames.join(","));
  mark("ZIP includes WhatsApp/Telegram WebP copies", webpNames.length === 6, `${webpNames.length} webp`);

  // Verify alpha on the first PNG inside the ZIP via canvas-free check (IHDR color type)
  const ihdr = (bytes) => {
    // PNG: 8-byte sig + 4 len + "IHDR" + width(4) + height(4) + bitdepth + colortype
    return bytes[8 + 4 + 4 + 4 + 4 + 1]; // colortype: 6 = RGBA, 3 = palette(+tRNS), 2 = RGB
  };
  const colorTypes = pngNames.map((n) => ihdr(entries[n]));
  mark("ZIP PNGs are RGBA/alpha-capable", colorTypes.every((t) => t === 6 || t === 3), `colortypes=${colorTypes}`);

  // Single sticker download (scope to the studio to avoid matching page copy)
  const [dl2] = await Promise.all([
    page.waitForEvent("download", { timeout: 30_000 }),
    page.locator('#pack-studio button:has-text("Download")').nth(0).click(),
  ]);
  mark("single sticker PNG download", dl2.suggestedFilename().startsWith("stickersit-"), dl2.suggestedFilename());

  await page.screenshot({ path: "/tmp/e2e-final-grid.png", fullPage: false });

  const realErrors = consoleErrors.filter(
    (e) =>
      !/favicon|net::ERR_ABORTED|Download the React DevTools|adtrafficquality|Framing|Refused to frame|postMessage/i.test(
        e,
      ),
  );
  mark("no console/CSP errors", realErrors.length === 0, realErrors.slice(0, 3).join(" | ").slice(0, 300));
} catch (error) {
  mark("e2e flow", false, String(error).slice(0, 300));
  await page.screenshot({ path: "/tmp/e2e-failure.png" }).catch(() => {});
} finally {
  writeFileSync("/tmp/e2e-results.json", JSON.stringify(results, null, 2));
  await browser.close();
}

const failed = results.steps.filter((s) => !s.ok).length;
console.log(`\n${failed === 0 ? "E2E: ALL PASS" : `E2E: ${failed} FAILED`}`);
process.exit(failed === 0 ? 0 : 1);
