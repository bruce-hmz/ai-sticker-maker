import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://stickersit.com",
      lastModified: "2026-06-02",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://stickersit.com/world-cup",
      lastModified: "2026-06-02",
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
