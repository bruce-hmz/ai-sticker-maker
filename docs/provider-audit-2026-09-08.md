# Provider Audit — 2026-09-08

P0-0 强制审计：确认当前图片生成 Provider 真实状态，为 Sticker Pack（Photo → Character Identity → Multi-Expression Pack）改造提供决策依据。

---

## Verdict（结论）

```
CURRENT_PROVIDER:                       SENSENOVA
CURRENT_PRODUCTION_STATUS:              WORKING
SENSENOVA_STATUS:                       WORKING（且发现新能力：u1.5-lite 参考图编辑）
POLLINATIONS_STATUS:                    UNUSED-IN-PROD / FREE-TIER-TEXT-ONLY
RECOMMENDED_STICKER_PACK_PROVIDER:      SenseNova（sensenova-u1.5-lite via /v1/images/edits）
```

**REASON（实测数据支撑）：**

1. 生产真实调用成功：POST `https://stickersit.com/api/generate` → HTTP 200，`image/png` 512×512，15.8s，图片真实可访问（已视觉验证为合格贴纸）。
2. 生产站 CSP 含 `*.sensecoreapi-oss.cn`（SenseNova CDN 域名）且响应为二进制 PNG——部署的是 main 分支血统的 SenseNova 构建，不是 Pollinations 旧代码。
3. SenseNova `/v1/images/edits` + `sensenova-u1.5-lite` 支持**参考图编辑**（实测 200 / 22.6s，data-URL 或 https URL 均可传）——这是 Photo → Consistent Pack 的硬需求。
4. Benchmark（同一张橘猫参考图 × 6 表情）：SenseNova 6/6 成功、Identity 4.5/5、Expression 4.8/5（视觉模型盲评，"可作为一个一致的贴纸包"）；Pollinations 免费层只能文生图，6 张风格漂移（写实/无边框/chibi 混杂）、表情常缺失，不可作为 Pack Provider。
5. Pollinations 免费层限流 ~1 req/15s：连发 6 个请求即 403；12 张 Pack 需 3 分钟以上且失败率高（实测 5/6 + 1 次重试）。参考图模型（nanobanana2/seedream/gpt-image/kontext）全部在 `gen.pollinations.ai` 付费墙后（实测 401），且本地/生产均无 `POLLINATIONS_API_KEY`。

---

## 1. 代码审计

### 生成链路（main 分支 = 当前生产血统）

| 环节 | 位置 | 内容 |
|---|---|---|
| 入口 UI | `src/components/StickerGenerator.tsx` | POST `/api/generate` `{prompt, style}`，120s 超时，二进制或 JSON 双路径 |
| API route | `src/app/api/generate/route.ts` | 校验→限流→调 provider→sharp 缩放 512→Blob/KV 持久化或裸 PNG |
| Provider | （审计时）直接 fetch SenseNova，无 adapter、无 fallback → **已重构为 `src/lib/providers/`（本次提交）** |
| Endpoint | `https://token.sensenova.cn/v1/images/generations` | OpenAI 兼容 |
| Model | `sensenova-u1-fast` | `/v1/models` 确认仍存在 |
| Auth | `Bearer $SENSENOVA_API_KEY` | 实测：真 key 200，假 key 401 |
| Size | 2048×2048 | 512×512 非法（合法值：1664x2496 … 3072x864 等档位） |
| Timeout | 生成 60s + 下载 30s | 客户端 120s |
| Retry | 无 | fallback 本次新增（Pollinations 兜底文生图） |
| 响应解析 | `data.data[0].url` | 签名 URL（sensecoreapi-oss.cn，24h 过期），服务端下载后不外泄 |
| 后处理 | sharp `resize(512,512).png()` | **无 alpha**（输入无透明→输出无透明） |
| 限流 | 12 次/分/IP | Upstash 配置则共享，否则实例内存 |

### 历史演变（git）

- `35ed2b6` 初版：Pollinations 客户端直连
- `4689ff9` fix: 502 → 返回 Pollinations URL
- `7b75f04` **switch to SenseNova U1 Fast**（当前形态）
- 分叉分支 `fix/seo-audit-optimization`（2026-06-03）仍是 Pollinations URL 方案，**未部署**

## 2. 环境变量审计

| 变量 | 代码需要 | 本地 .env.local | 生产（行为推断） |
|---|---|---|---|
| `SENSENOVA_API_KEY` | 是（provider 主 key） | EXISTS | **EXISTS**（生产生成成功） |
| `POLLINATIONS_API_KEY` | 否（可选 fallback key） | MISSING | MISSING |
| `UPSTASH_REDIS_REST_URL/TOKEN` | 可选（共享限流） | MISSING | MISSING（未观察到共享限流迹象） |
| `BLOB_READ_WRITE_TOKEN` | 可选（持久化） | EXISTS | **MISSING**（生产返回裸 PNG 二进制） |
| `KV_REST_API_URL/TOKEN` | 可选（元数据） | EXISTS | **MISSING**（同上） |
| `NEXT_PUBLIC_ADSENSE_ID` 等 | 展示用 | EXISTS | EXISTS（页面含 adsbygoogle） |

代码所需变量名与生产行为完全一致——`SENSENOVA_API_KEY` 这个名字在生产真实生效。

## 3. 生产 Smoke Test（真实请求）

```
POST https://stickersit.com/api/generate
{"prompt":"a happy orange cat wearing sunglasses","style":"cute-kawaii"}
→ HTTP 200 | 15.8s | content-type: image/png
→ PNG 512×512 8-bit colormap, hasAlpha: no, 30,268 bytes
→ 视觉验证：合格的贴纸（橘猫+墨镜+白边）
```

## 4. SenseNova 状态（全部实测）

| 检查项 | 结果 | 证据 |
|---|---|---|
| AUTH | **PASS** | 真 key 200 / 假 key 401 `{"code":16,"message":"Forbidden"}` |
| MODEL LIST | **PASS** | GET `/v1/models` → 8 个模型，含 `sensenova-u1-fast`、`sensenova-u1.5-lite`（另 6 个为 LLM） |
| GENERATION | **PASS** | `/v1/images/generations` 200，6.6s（直连） |
| EDITS（参考图） | **PASS** | `/v1/images/edits` 200，22.6–28.9s；**仅 u1.5-lite 支持**（u1-fast → 400 `invalid arguments`） |
| 响应结构 | 未变 | 两端点均返回 `data[0].url`（签名 URL，24h 有效），与现网代码解析兼容 |
| 透明背景 | **不支持** | 输出 PNG 无 alpha → 需独立 background-removal pipeline |
| mhapi.sensetime.com | 不再使用 | 仓库无引用；现行域名为 `token.sensenova.cn`（CN）/`token.sensenova.ai`（海外） |

**Edits 关键契约（踩坑记录，P0 必须遵守）：**

```jsonc
POST /v1/images/edits
{
  "model": "sensenova-u1.5-lite",        // 必须，u1-fast 会 400
  "images": [ { "image_url": "data:image/jpeg;base64,... | https://..." } ],  // 必须是对象数组
  "prompt": "...",
  "n": 1, "size": "auto", "watermark": false,
  "prompt_extend": true, "response_format": "url"
}
// images 传字符串数组 / image 字段 / multipart 均会 400 "invalid arguments"
```

## 5. Pollinations 状态（全部实测）

| 检查项 | 结果 |
|---|---|
| 免费文生图（`image.pollinations.ai`，model=sana） | WORKING，8.8–30.1s，确定性 seed |
| 免费层模型面 | **仅 sana**（`/models` → `["sana"]`），纯文生图 |
| `image=` 参考参数 | **静默忽略**：Exif manufacturer=sana，输出不保留参考身份（对照实验证实） |
| `transparent=true` | **无效**：返回 JPEG 无 alpha |
| 付费层 `gen.pollinations.ai/v1/images/edits` | **401 需 key**（enter.pollinations.ai）；386 模型含 nanobanana2(max_ref=14)/seedream/gpt-image-2(max_ref=16)/kontext 等，能力足够但无 key 未测 |
| 限流（匿名） | 连发 ~6 请求 → 403；16s 间隔稳定；观察到 1 次 500 |
| 成本 | 免费层 $0；付费层 pollen 积分制，未取得 key 未测 |

## 6–7. Provider Benchmark（同一参考图 × 6 表情）

参考图：橘色虎斑猫（白胸毛、额头 M 纹、绿色眼睛、灰底插画风）。
评分：视觉模型盲评（0–5）。

| Provider | Model | 模式 | Identity | Sticker Quality | Expression | Background | Reliability | Latency | Cost |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| SenseNova | u1.5-lite (edits+参考图) | image-ref | **4.5** | 4.3 | **4.8** | 4.5 | **6/6** | 27.2–28.9s (avg 28.3) | ¥0（Token Plan 公测，1500 req/5h 免费；此后积分制 1元=5000积分） |
| Pollinations | sana (免费层) | text-only | ~2.0 | ~2.5 | ~2.5 | ~3.0 | 5/6+1 重试 | 8.8–30.1s (avg 25.1) | $0 |

视觉盲评结论：SenseNova 组"可作为一个一致的贴纸包，同一只猫"；Pollinations 组风格漂移（写实特写/无边框满幅/chibi 混杂）、表情经常不可辨。

## 8. Provider 架构（本次已落地）

```
src/lib/providers/
  types.ts        ImageProvider 接口：generateFromText / generateFromImage / editImage
                  + supportsImageReference() / supportsTransparentOutput() + ProviderError
  sensenova.ts    u1-fast 文生图 + u1.5-lite 参考图编辑（契约见上）
  pollinations.ts 免费层文生图；有 POLLINATIONS_API_KEY 时走 gen.pollinations.ai edits
  index.ts        工厂：primary(SenseNova) + fallback(Pollinations) + referenceCapable
```

`/api/generate` 已接入：primary 失败（非 400）自动 fallback 到 Pollinations 文生图；行为对现有单贴纸流程完全兼容（21 个测试全绿，typecheck 干净）。

## 9–10. 保留/删除决策

- SenseNova：**保留并升级使用**（P0 的 reference-capable primary）。
- Pollinations：**保留为 fallback adapter**（免费文生图兜底），不作为 Pack Provider；未删旧代码，P0 不依赖其参考图能力。

## 11. P0 前置条件判定

✅ Provider 已知、API 已实测可用、参考图契约已验证 → **可以开始 Sticker Pack P0**。
- Pack 生成路径：`referenceCapable.generateFromImage()`（u1.5-lite edits）
- 透明背景：两家 provider 均不支持 → **必须做独立 background-removal pipeline**（P0 内置）
- 12 张 × ~28s 串行 ≈ 5.6 分钟 → 需要并行或分批 + 前端进度流（P0 设计约束）

## 12. 文案一致性（本次已修正）

生产站 Privacy Policy / FAQ / 首页宣称 "Pollinations.ai"，实际后端为 SenseNova —— **错误声明，已修正**：

- `src/app/privacy/page.tsx`：2 处 Pollinations.ai → SenseNova (SenseTime)；Last updated → Sep 8, 2026
- `src/app/page.tsx` FAQ：pollinations.ai 引用 → SenseNova by SenseTime (sensenova.cn)
- `src/app/layout.tsx`：移除对 image.pollinations.ai 的 preconnect（已无请求去该域）

待办提醒：生产 Vercel 项目在 firstdraft-work 账号下，需重新部署后文案修正才会上线；`BLOB_READ_WRITE_TOKEN`/`KV_*` 未配到生产导致贴纸不持久化，P0 的 Pack 功能依赖持久化，部署前必须补齐。

---

*审计方法：代码 grep + git 考古 + 生产真实 HTTP 调用 + SenseNova 直连 API 实测（auth/模型列表/生成/编辑/错误路径）+ Pollinations 免费层与付费层探测 + 双 provider 同图 benchmark 视觉盲评。所有测试均真实执行，未输出任何密钥。*
