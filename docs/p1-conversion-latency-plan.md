# P1 — Conversion + Latency Validation Plan

**Status: deployed, DATA_COLLECTION_STARTED (2026-09-09).**
This document defines the funnel, thresholds, latency findings, provider constraints, and the 7/14-day observation plan. No user data exists yet — nothing below the instrumentation line is a *result*; all thresholds are decision rules to apply once data arrives.

---

## 1. Funnel definition

```
Landing (sticker_pack_view)
→ Upload click (photo_upload_clicked)         [Upload CTR]
→ Uploaded (photo_uploaded)
→ Generate start (pack_generation_started)    [Upload → Generate]
→ First sticker ready (pack_first_sticker_ready)  [TTFV — time to first value]
→ Third sticker ready (pack_three_stickers_ready) [midpoint retention]
→ Full pack (pack_completed)
→ Any download (first_sticker_downloaded)     [download intent]
→ Pack download (pack_downloaded)             [pack-level intent]
```

Abandonment: `pack_abandoned` fires via `pagehide` + `transport_type=beacon` when a started pack is left incomplete (reload / close / navigate). Tab-switch alone (visibilitychange) is NOT abandonment — generation continues in background tabs (verified, see §6).

## 2. Event inventory (GA4)

| Event | Key attributes (never images/URLs) |
|---|---|
| sticker_pack_view | landingPage (/ or /pet-sticker-maker), deviceClass, viewportClass, referrerCategory |
| photo_upload_clicked | landingPage |
| photo_uploaded | fileType, fileSizeBucket (<1MB/1-5/5-10), imageDimensionBucket (<512/512-1023/1024-2047/>=2048) |
| pack_generation_started | packType (reaction / reaction-resume), stickerCount, landingPage |
| pack_first_sticker_ready | **timeToFirstStickerMs**, reaction, generationDurationMs |
| pack_three_stickers_ready | elapsedMs |
| pack_completed | totalDurationMs, successCount, failedCount |
| pack_abandoned | completedCount, elapsedMs, packStatus |
| first_sticker_downloaded | reaction, completedCount, elapsedSinceGenerationStartMs |
| single_sticker_downloaded | reaction, completedCount, elapsedSinceGenerationStartMs |
| pack_downloaded | completedCount, elapsedSinceGenerationStartMs |
| single_sticker_regenerated | reaction |
| sticker_generation_completed / _failed | reaction, durationMs |
| provider_429 / provider_5xx / provider_timeout | reaction |
| sticker_retry | reaction |
| background_removal_completed / _failed | reaction, removalMs, reason |
| background_model_loaded | modelLoadMs, cached |

Privacy guard: forbidden-key blacklist + `data:`/`blob:` prefix stripping on every event (unit-tested). Filenames, EXIF, file content never leave the browser.

## 3. Success thresholds (decision rules — not business logic)

**Strong signals (any one → invest):**
- Generate Start → Full Pack Completion ≥ 50%
- Full Pack Completion → Pack Download ≥ 25%
- Generate Start → Any Download ≥ 30%

**Latency problem:** retention good after first sticker, but heavy abandonment between 3/6 → 6/6.

**Product-value problem:** high 6/6 completion, low download rate → optimize quality/composition/download UX, NOT speed.

**Freeze:** after reasonable traffic, upload/generate/download all persistently weak.

## 4. Latency changes shipped this round

| Metric | Before (P0) | After (P1) |
|---|---|---|
| Time to First Sticker (perceived) | ~30s gen + up to 54MB model download + ~7s removal | ~30s gen, model preloaded during it (upload-time prefetch); first sticker usable immediately via banner |
| Background model load | on-demand at first sticker (up to minutes on slow CDN) | prefetch at photo upload (4-parallel, force-cache) |
| First sticker value moment | after full grid render | immediate banner "Your first sticker is ready" + Download |
| Reaction order | laughing, crying, angry, shocked, love, sleepy | laughing, love, shocked, angry, crying, sleepy (strongest visual payoff first) |
| Full pack wall time | 208–280s serial | unchanged (SenseNova concurrency = 1, see §5) — honesty over fake speed |
| Per-sticker state visibility | Drawing… (blended) | queued / Drawing… / **Removing background…** / ready / failed |
| Refresh mid-generation | everything lost | completed stickers restored from sessionStorage; Resume re-generates only missing ones (photo re-upload required — we never store it) |

## 5. SenseNova concurrency findings

- **Empirical (our tests, 2026-09-08):** 2nd concurrent request on the same key → immediate `429` (0.4s). Back-to-back serial → stable (3× 200, 22–26s). Effective concurrency = **1**.
- **Official docs:** SenseNova publishes no public QPS/concurrency numbers ([Token Plan page](https://www.sensenova.cn/token-plan): free tier 60,000 积分/5h 限时放量; Lite/Pro tiers announced). Concrete limits are console-visible only (requires account login) or via business contact.
- **Scope (key vs account):** unconfirmed. Industry convention (DeepSeek: account-level; Aliyun Bailian: 主账号合并计算) strongly suggests account-level — i.e. multiple keys would share the quota.
- **Decision:** NO key rotation (forbidden without official confirmation). Concurrency=2/3 testing NOT run — cannot legally raise concurrency today. Upgrade path: SenseNova console/business channel for tier upgrade, then re-test per plan §18.
- **Consequence:** fallback-provider screening executed (§6).

## 6. Secondary provider screening (desk research — NOT tested, no keys)

Triggered by §5: SenseNova concurrency cannot be raised right now.

| Candidate | Reference-image support | Documented strengths | Blocker |
|---|---|---|---|
| **qwen-image-edit (Aliyun Bailian)** — SECONDARY CANDIDATE | Native multi-image input/output editing API | Precise identity/instruction editing, China-accessible, OpenAI-compatible options | No key in hand |
| **SeedEdit / Seedream 4.x (Volcengine Ark)** — SECONDARY CANDIDATE | Reference-image editing, strong identity preservation | High quality, China-accessible, per-image pricing | No key in hand |
| Pollinations paid tier (nanobanana2/seedream/gpt-image) | Yes (max_ref 3–14) | OpenAI-compatible endpoint | Paid key; free tier drops reference images (P0 finding) — REJECTED as free fallback |

**Verdict: PRIMARY = SenseNova (unchanged). SECONDARY CANDIDATES = qwen-image-edit, SeedEdit (pending key). REJECTED = Pollinations free tier for reference work.**
Per the no-mixed-model policy: a pack is bound to ONE provider; provider switch only at pack start, never mid-pack.

## 7. Background removal performance

- Model: isnet_quint8, **self-hosted /bgr/ (54MB)**, `Cache-Control: immutable, 1y`.
- Compression: chunks served via Vercel edge (brotli/gzip where effective on binary — verified content-encoding on live assets during deploy).
- Preload: `prefetchBackgroundModel()` fires at photo upload (4 parallel fetches, force-cache) → first generation's 27–44s dead time covers the model download. `background_model_load_ms` + first-run vs cached tracked.
- Not replaced with a paid server API — awaiting real `background_model_loaded` distribution first.

## 8. Session / abandonment behavior (as shipped)

- **Refresh mid-pack:** completed stickers return from sessionStorage (derived stickers only — never the reference photo). Missing reactions show a Resume flow requiring photo re-upload; only missing reactions regenerate; completed ones never re-billed.
- **Leave during generation:** native browser beforeunload prompt (only while generating AND incomplete — no permanent interception).
- **Abandon beacon:** pagehide + transport_type=beacon.
- **Background tab:** generation queue is await-chained (no polling timers); fetch + WASM continue when hidden (only retry sleep timers may throttle — acceptable; verified in hidden-tab e2e).
- **New pack / Start over:** session cleared.

## 9. WhatsApp / Telegram format research (no fake features)

- WhatsApp stickers: 512×512 **WebP**, ≤100KB static (≤512KB animated); import requires a sticker-pack app or WhatsApp Sticker Studio — browsers cannot silently install. UI therefore says **Download for WhatsApp**, never "Add to WhatsApp".
- Telegram stickers: 512×512 PNG or WebP, ≤512KB, via @Stickers bot.
- Shipped: ZIP now includes **both PNG (universal) and WebP (WhatsApp/Telegram)** per sticker, feature-detected (Safari without WebP encode → PNG-only ZIP, no latency penalty).

## 10. Pet landing page

- URL: https://stickersit.com/pet-sticker-maker — same StickerPackStudio (landingId=/pet-sticker-maker for per-landing funnel comparison), unique title/H1/meta/canonical/OG, FAQPage + WebApplication schema, sitemap entry, internal links both ways. Example pack reuses the real cat pipeline output.

## 11. Observation plan (7 / 14 days)

Metrics to pull from GA4 (per landingPage, per deviceClass):

- 7-day: Upload CTR, Upload→Generate, TTFV P50/P75/P95, completion rate, abandonment by completedCount (0/1/2/3/4/5), any-download rate, pack-download rate, provider error rates (429/5xx/timeout), background model load first-run vs cached.
- 14-day: same + regenerate rate per reaction (quality signal per reaction), homepage vs pet page comparison (if pet page earns impressions), repeat-visit packs (session resume usage via packType=reaction-resume).

Decision rules: §3. Explicit non-goals remain: no 9/12 packs, no couple, no accounts, no storage.
