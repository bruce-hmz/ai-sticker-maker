import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
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
}
