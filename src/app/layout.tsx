import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "Free AI WhatsApp Sticker Maker Online - No App Needed | StickerAI",
  description:
    "Create custom AI stickers for WhatsApp, Telegram, and iMessage. Free online sticker maker — no app download, no sign up. Generate cute, kawaii, chibi, and cartoon stickers instantly.",
  keywords: [
    "AI sticker maker",
    "WhatsApp sticker maker",
    "sticker maker online",
    "whatsapp sticker maker online without app",
    "free AI sticker generator",
    "telegram sticker maker",
    "custom stickers online",
  ],
  openGraph: {
    title: "Free AI WhatsApp Sticker Maker Online - No App Needed",
    description:
      "Create custom AI stickers for WhatsApp and Telegram. Free, no sign up, no app download.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
