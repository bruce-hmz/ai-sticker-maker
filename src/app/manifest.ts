import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StickerSit - Free AI WhatsApp Sticker Maker",
    short_name: "StickerSit",
    description:
      "Create custom AI stickers for WhatsApp, Telegram, and iMessage. Free online sticker maker.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#8b5cf6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
