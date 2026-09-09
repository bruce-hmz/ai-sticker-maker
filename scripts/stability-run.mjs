/* P1 stability gate: 10 single-sticker smokes + 3 full packs via real API.
 * Serial (SenseNova concurrency = 1). Run: node scripts/stability-run.mjs */
import { readFileSync } from "node:fs";

const BASE = process.env.E2E_BASE ?? "http://localhost:3000";
const REF = `data:image/jpeg;base64,${readFileSync("/tmp/test-cat.jpg").toString("base64")}`;
const REACTIONS = ["laughing", "love", "shocked", "angry", "crying", "sleepy"];

const results = { singles: [], packs: [] };

async function one(reaction) {
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE}/api/pack/sticker`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction, referenceImage: REF }),
      signal: AbortSignal.timeout(90_000),
    });
    const ms = Date.now() - t0;
    const ok = res.ok;
    const ct = res.headers.get("content-type") ?? "";
    if (ok && ct.includes("image/")) await res.arrayBuffer();
    return { ok, status: res.status, ms };
  } catch (e) {
    return { ok: false, status: `err:${String(e).slice(0, 40)}`, ms: Date.now() - t0 };
  }
}

for (let i = 1; i <= 10; i++) {
  const r = await one(REACTIONS[i % REACTIONS.length]);
  results.singles.push(r);
  console.log(`single ${i}/10: ${r.ok ? "OK" : "FAIL"} ${r.status} ${r.ms}ms`);
}

for (let p = 1; p <= 3; p++) {
  const t0 = Date.now();
  const pack = [];
  for (const r of REACTIONS) pack.push(await one(r));
  const success = pack.filter((x) => x.ok).length;
  const totalMs = Date.now() - t0;
  results.packs.push({ success, totalMs });
  console.log(`pack ${p}/3: ${success}/6 in ${(totalMs / 1000).toFixed(0)}s`);
}

const s = results.singles;
const okS = s.filter((x) => x.ok).length;
const lat = s.filter((x) => x.ok).map((x) => x.ms).sort((a, b) => a - b);
const p = (q) => lat[Math.floor((lat.length - 1) * q)];
console.log("\n=== SUMMARY ===");
console.log(`singles: ${okS}/10 ok | P50 ${p(0.5)}ms P95 ${p(0.95)}ms | 429: ${s.filter(x=>x.status===429).length} 5xx: ${s.filter(x=>typeof x.status==='number'&&x.status>=500).length}`);
console.log(`packs: ${results.packs.map(x => `${x.success}/6 ${Math.round(x.totalMs/1000)}s`).join(" | ")}`);
