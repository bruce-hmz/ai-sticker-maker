export type BlogCategory = "WhatsApp" | "iPhone" | "Android" | "Telegram" | "AI";

export interface BlogPost {
  /** 稳定 id，例如 "whatsapp-sticker-size" */
  slug: string;
  /** 站点绝对路径；旧文用其已收录 URL，例如 "/how-to-make-a-sticker-on-iphone" */
  path: string;
  /** 标题（不带 " | StickerSit" 后缀） */
  title: string;
  description: string;
  category: BlogCategory;
  /** ISO 日期，喂 Article schema + sitemap lastModified */
  publishedAt: string;
  keywords: string[];
}

// 唯一的真源：/blog 索引、footer Guides 列、sitemap、各篇 Related Guides 都从这里读。
// 新增文章时加一条；path 必须以 "/" 开头，slug/path 必须唯一（见 blog-posts.test.ts）。
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-make-stickers-for-whatsapp",
    path: "/blog/how-to-make-stickers-for-whatsapp",
    title: "How to Make Stickers for WhatsApp (Complete 2026 Guide)",
    description:
      "Five free ways to make WhatsApp stickers in 2026 — AI web tool, WhatsApp Web built-in maker, iPhone, Android, and sticker pack apps. Sizes, formats, and step-by-step instructions.",
    category: "WhatsApp",
    publishedAt: "2026-07-06",
    keywords: [
      "how to make stickers for whatsapp",
      "how to make custom whatsapp stickers",
      "make whatsapp stickers online",
      "whatsapp sticker maker free",
      "create whatsapp stickers without app",
    ],
  },
  {
    slug: "whatsapp-sticker-size",
    path: "/blog/whatsapp-sticker-size",
    title: "WhatsApp Sticker Size & Format Explained (512×512 and More)",
    description:
      "The exact WhatsApp sticker size, format, file-size limit, and tray icon specs for 2026 — plus a comparison table for Telegram, iMessage, and Discord and how to resize to 512×512.",
    category: "WhatsApp",
    publishedAt: "2026-07-06",
    keywords: [
      "whatsapp sticker size",
      "whatsapp sticker format",
      "whatsapp sticker dimensions",
      "whatsapp sticker webp",
      "512x512 sticker",
    ],
  },
  {
    slug: "how-to-add-stickers-on-whatsapp",
    path: "/blog/how-to-add-stickers-on-whatsapp",
    title: "How to Add Stickers on WhatsApp (From Any Source)",
    description:
      "Four ways to add stickers to WhatsApp — from a photo, a pack app, a shared pack link, or a downloaded PNG — plus where to find them and how to fix packs that won't show.",
    category: "WhatsApp",
    publishedAt: "2026-07-06",
    keywords: [
      "how to add stickers on whatsapp",
      "add stickers to whatsapp",
      "import whatsapp stickers",
      "whatsapp sticker pack not showing",
    ],
  },
  {
    slug: "how-to-create-a-whatsapp-sticker-pack",
    path: "/blog/how-to-create-a-whatsapp-sticker-pack",
    title: "How to Create a WhatsApp Sticker Pack (Custom & Shareable)",
    description:
      "Step-by-step guide to creating a custom WhatsApp sticker pack — pack rules (3–30 stickers, 512×512, tray icon), the iOS and Android flow, sharing, and troubleshooting.",
    category: "WhatsApp",
    publishedAt: "2026-07-06",
    keywords: [
      "how to create a whatsapp sticker pack",
      "create whatsapp sticker pack",
      "share whatsapp sticker pack",
      "whatsapp sticker pack rules",
    ],
  },
  {
    slug: "ai-sticker-generator-how-it-works",
    path: "/blog/ai-sticker-generator-how-it-works",
    title: "AI Sticker Generators: How They Work (2026)",
    description:
      "A plain-language explainer of how AI sticker generators turn text into images — diffusion models, prompts, art styles, transparent die-cut output, and tips for better results.",
    category: "AI",
    publishedAt: "2026-07-06",
    keywords: [
      "ai sticker generator how it works",
      "how ai stickers are made",
      "text to sticker ai",
      "ai image generation explained",
    ],
  },
  {
    slug: "whatsapp-sticker-ideas",
    path: "/blog/whatsapp-sticker-ideas",
    title: "50+ WhatsApp Sticker Ideas (With Prompts You Can Copy)",
    description:
      "50+ WhatsApp sticker ideas with copy-ready prompts, grouped by animals, reactions, food, characters, seasons, and work chat — plus the prompt formula behind them.",
    category: "WhatsApp",
    publishedAt: "2026-07-06",
    keywords: [
      "whatsapp sticker ideas",
      "sticker prompts",
      "ai sticker prompts",
      "cute sticker ideas",
      "sticker pack ideas",
    ],
  },
  {
    slug: "how-to-make-stickers-on-android",
    path: "/blog/how-to-make-stickers-on-android",
    title: "How to Make Stickers on Android (3 Free Methods)",
    description:
      "Three free ways to make WhatsApp stickers on Android — an AI web tool, sticker maker apps, and WhatsApp's built-in maker. Sizes, steps, and troubleshooting.",
    category: "Android",
    publishedAt: "2026-07-06",
    keywords: [
      "how to make stickers on android",
      "android sticker maker",
      "sticker maker android",
      "personal stickers for whatsapp",
    ],
  },
  {
    slug: "how-to-make-telegram-stickers",
    path: "/blog/how-to-make-telegram-stickers",
    title: "How to Make Telegram Stickers (Sizes, Packs, and the @Stickers Bot)",
    description:
      "How to make custom Telegram stickers — the exact size and format, the @Stickers bot step-by-step flow, animated TGS stickers, and how to share a pack.",
    category: "Telegram",
    publishedAt: "2026-07-06",
    keywords: [
      "how to make telegram stickers",
      "telegram sticker size",
      "telegram stickers bot",
      "create telegram sticker pack",
    ],
  },
  {
    slug: "how-to-make-a-sticker-on-iphone",
    path: "/how-to-make-a-sticker-on-iphone",
    title: "How to Make a Sticker on iPhone (3 Free Methods)",
    description:
      "Make custom stickers on your iPhone — use iOS 17 built-in cutout, an AI text-to-sticker generator, or sticker maker apps. Free, no sign up needed.",
    category: "iPhone",
    publishedAt: "2026-06-07",
    keywords: [
      "how to make a sticker on iphone",
      "how to make stickers on iphone",
      "iphone sticker maker",
      "imessage sticker maker",
    ],
  },
];

/** 按 publishedAt 倒序的副本（索引页用）。 */
export function postsByNewest(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** 取相关文章：同 category 优先，排除自身，最多 n 条。 */
export function relatedPosts(currentSlug: string, n = 3): BlogPost[] {
  const self = BLOG_POSTS.find((p) => p.slug === currentSlug);
  const category = self?.category;
  const others = BLOG_POSTS.filter((p) => p.slug !== currentSlug);
  const sameCategory = category
    ? others.filter((p) => p.category === category)
    : [];
  const rest = others.filter((p) => p.category !== category);
  return [...sameCategory, ...rest].slice(0, n);
}
