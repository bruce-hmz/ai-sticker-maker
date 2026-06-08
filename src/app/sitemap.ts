import type { MetadataRoute } from "next";
import { listStickers } from "@/lib/sticker-storage";

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
      lastModified: "2026-06-03",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://stickersit.com/how-to-make-a-sticker-on-iphone",
      lastModified: "2026-06-07",
      changeFrequency: "monthly",
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

  // Dynamic sticker detail pages
  try {
    const { stickers } = await listStickers({ page: 1, limit: 1000 });
    const stickerPages: MetadataRoute.Sitemap = stickers.map((s) => ({
      url: `https://stickersit.com/sticker/${s.id}`,
      lastModified: new Date(s.createdAt),
      changeFrequency: "never" as const,
      priority: 0.6,
    }));
    return [...staticPages, ...stickerPages];
  } catch {
    // If KV not configured, return static pages only
    return staticPages;
  }
}
