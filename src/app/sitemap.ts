import type { MetadataRoute } from "next";
import { listStickers } from "@/lib/sticker-storage";
import { WORLD_CUP_TEAMS } from "@/lib/world-cup-teams";
import { STICKER_THEMES } from "@/lib/sticker-themes";
import { WORLD_CUP_GROUPS } from "@/lib/world-cup-groups";
import { BLOG_POSTS } from "@/lib/blog-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://stickersit.com",
      lastModified: "2026-06-03",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://stickersit.com/world-cup",
      lastModified: "2026-06-15",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://stickersit.com/world-cup/groups",
      lastModified: "2026-06-17",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://stickersit.com/world-cup/knockout",
      lastModified: "2026-06-17",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://stickersit.com/es/mundial",
      lastModified: "2026-06-15",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://stickersit.com/how-to-make-a-sticker-on-iphone",
      lastModified: "2026-06-07",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://stickersit.com/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://stickersit.com/stickers",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://stickersit.com/about",
      lastModified: "2026-06-03",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://stickersit.com/contact",
      lastModified: "2026-06-03",
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: "https://stickersit.com/terms",
      lastModified: "2026-06-03",
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: "https://stickersit.com/privacy",
      lastModified: "2026-06-03",
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // 球队子主题页 (programmatic SEO)
  const teamPages: MetadataRoute.Sitemap = WORLD_CUP_TEAMS.map((t) => ({
    url: `https://stickersit.com/world-cup/teams/${t.slug}`,
    lastModified: "2026-06-15",
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 通用主题页 (programmatic SEO，对冲世界杯后断崖)
  const themePages: MetadataRoute.Sitemap = STICKER_THEMES.map((t) => ({
    url: `https://stickersit.com/stickers/${t.slug}`,
    lastModified: "2026-06-16",
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 世界杯分组页 (programmatic SEO)
  const groupPages: MetadataRoute.Sitemap = WORLD_CUP_GROUPS.map((g) => ({
    url: `https://stickersit.com/world-cup/group/${g.id}`,
    lastModified: "2026-06-17",
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 博客文章页（元数据驱动）
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.filter(
    (p) => p.path !== "/how-to-make-a-sticker-on-iphone", // 已在 staticPages 中
  ).map((p) => ({
    url: `https://stickersit.com${p.path}`,
    lastModified: p.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic sticker detail pages
  try {
    const { stickers } = await listStickers({ page: 1, limit: 1000 });
    const stickerPages: MetadataRoute.Sitemap = stickers.map((s) => ({
      url: `https://stickersit.com/sticker/${s.id}`,
      lastModified: new Date(s.createdAt),
      changeFrequency: "never" as const,
      priority: 0.6,
    }));
    return [...staticPages, ...teamPages, ...themePages, ...groupPages, ...blogPages, ...stickerPages];
  } catch {
    // If KV not configured, return static pages only
    return [...staticPages, ...teamPages, ...themePages, ...groupPages, ...blogPages];
  }
}
