import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stickersit.com"),
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
    url: "https://stickersit.com",
    siteName: "StickerAI",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "StickerAI - Free AI WhatsApp Sticker Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI WhatsApp Sticker Maker Online - No App Needed",
    description:
      "Create custom AI stickers for WhatsApp and Telegram. Free, no sign up, no app download.",
    images: ["/thumbnail.png"],
  },
  alternates: {
    canonical: "https://stickersit.com",
  },
  other: {
    "google-adsense-account": "ca-pub-4350668459830736",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://image.pollinations.ai" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-83FLS7XP32"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-83FLS7XP32');
          `}
        </Script>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4350668459830736"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">{children}</body>
    </html>
  );
}
