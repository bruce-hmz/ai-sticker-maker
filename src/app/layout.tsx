import type { Metadata } from "next";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://stickersit.com"),
  title:
    "AI Sticker Pack Maker — Turn a Photo Into 6 Stickers | StickerSit",
  description:
    "Upload one photo and get a consistent pack of 6 reaction stickers with transparent backgrounds — free, no sign up, no app. Or create custom AI stickers from text for WhatsApp, Telegram, and iMessage.",
  keywords: [
    "AI sticker maker",
    "sticker pack maker",
    "photo to sticker",
    "WhatsApp sticker maker",
    "sticker maker online",
    "whatsapp sticker maker online without app",
    "free AI sticker generator",
    "telegram sticker maker",
    "custom stickers online",
  ],
  openGraph: {
    title: "AI Sticker Pack Maker — Turn a Photo Into 6 Stickers",
    description:
      "Upload a photo and turn it into 6 consistent reaction stickers. Free, no sign up, no app.",
    type: "website",
    url: "https://stickersit.com",
    siteName: "StickerSit",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "StickerSit - AI Sticker Pack Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Sticker Pack Maker — Turn a Photo Into 6 Stickers",
    description:
      "Upload a photo and turn it into 6 consistent reaction stickers. Free, no sign up, no app.",
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
      <head></head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
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
      </body>
    </html>
  );
}
