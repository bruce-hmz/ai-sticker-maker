# GA4 Custom Definitions 注册清单（9/16 复盘前置）

**状态：参数清单已于 2026-09-11 对照 `src/lib/sticker-pack/analytics.ts` 核对完毕；注册需在 GA4 Admin 手动完成（需要 Google 账号权限，代码侧无法代办）。注册后通常 24–48 小时才能在报表中使用——9/11–12 完成，9/13 前后生效，赶在 9/16 之前。**

操作路径：GA4 Admin → 数据显示（Data display）→ 自定义定义（Custom definitions）→ 创建自定义维度 / 创建自定义指标。**参数名必须与代码逐字一致**（GA4 精确匹配，无大小写/下划线容错）。

---

## 必注 — event-scoped 自定义维度（9/16 直接按这些字段拆）

| 参数名（照抄，区分大小写） | 显示名建议 | 基数 | 用途（对应 review-2026-09-16.md） |
|---|---|---|---|
| `probeType` | WTP Probe Type | 2 | §4 两探针分开口径（use_case / pricing_door） |
| `pricePoint` | WTP Price Point | 4 | §4 价格敏感度曲线（free / 1.99 / 4.99 / 9.99_plus） |
| `option` | WTP Use Case | 5 | §3 consumer / creator 分层 |
| `landingPage` | Landing Page (custom) | 2 | §2 漏斗按落地页拆（携带范围见下方核对说明） |
| `completedCount` | Completed Stickers | 7 | §2 放弃点分布 0–5 |
| `packType` | Pack Type | 2 | §3.1 reaction-resume 是 consumer 信号 |
| `deviceClass` | Device Class | 3 | §2 按 mobile / tablet / desktop 拆 |
| `reaction` | Reaction | 6 | per-reaction 重生成率、provider 错误分布（14 天指标，现在注册不亏） |

## 可选 — 一并注册（低成本，上传/性能诊断用）

`viewportClass`、`fileType`、`fileSizeBucket`、`imageDimensionBucket`、`packStatus`

## 必注 — event-scoped 自定义指标（单位选 Milliseconds）

| 参数名 | 用途 |
|---|---|
| `timeToFirstStickerMs` | TTFV（P50/P75/P95） |
| `elapsedSinceGenerationStartMs` | 生成开始 → 下载的时延 |
| `generationDurationMs` | 单张生成耗时 |
| `durationMs` | 单贴纸生成耗时（sticker_generation_completed） |
| `totalDurationMs` | 整包墙钟时间 |
| `elapsedMs` | 3/6 中点、放弃耗时 |
| `removalMs` / `modelLoadMs` | 背景去除性能（首次 vs 缓存） |

## 明确不注册（高基数 / 冗余）

- `packId`（每包唯一，高基数 → `(other)` 聚合风险，Google 官方明确警告）
- `stickerCount`（恒为 6，无信息量）
- `success` / `completed` / `total`（与 completedCount 冗余）
- `cached`（布尔）、任何时间戳类字段

---

## 核对说明（2026-09-11，对照代码）

1. **landingPage 携带范围**：`sticker_pack_view` / `photo_upload_clicked` / `photo_uploaded` / `pack_generation_started` 均携带；`first_sticker_downloaded` / `single_sticker_downloaded` / `pack_downloaded` **未携带**。按落地页拆下载率时，用 GA4 自动附加到每个事件的内置 **Page location** 维度，或 Explore 里用 **Landing page + session** 做细分即可——冻结期内不改代码。
2. **一个参数只能注册一种**（维度或指标）。`completedCount` 选维度：放弃点分布需要按值分组，而不是求和。
3. 标准媒体资源额度为 50 个 event-scoped 维度 + 50 个指标，本清单远未超限。
4. 参数名清单以 `src/lib/sticker-pack/analytics.ts` 的 `PackEventPayload` 为唯一事实来源；如日后重命名字段，同步更新本文件与 GA4 注册项。

## 注册后自检（9/13 前后花 2 分钟）

- [ ] Explore 的维度选择器里能搜到上表显示名，且能拖入行/列
- [ ] 实时报告或 DebugView 里触发一次 `wtp_probe_viewed`（或等自然流量），确认维度值能拆出
