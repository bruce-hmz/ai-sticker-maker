import type { Metadata } from "next";
import Link from "next/link";
import AdSenseUnit from "@/components/AdSenseUnit";
import { relatedPosts } from "@/lib/blog-posts";

const SITE = "https://stickersit.com";
const PATH = "/blog/whatsapp-sticker-size";
const TITLE = "WhatsApp Sticker Size & Format Explained (512×512 and More)";
const DESCRIPTION =
  "The exact WhatsApp sticker size, format, file-size limit, and tray icon specs for 2026 — plus a comparison table for Telegram, iMessage, and Discord and how to resize any image to 512×512.";
const PUBLISHED = "2026-07-06";

export const metadata: Metadata = {
  title: `${TITLE} | StickerSit`,
  description: DESCRIPTION,
  keywords: [
    "whatsapp sticker size",
    "whatsapp sticker dimensions",
    "whatsapp sticker format",
    "whatsapp sticker webp",
    "whatsapp sticker file size",
    "512x512 sticker",
    "whatsapp sticker tray icon size",
  ],
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}${PATH}`,
    siteName: "StickerSit",
    type: "article",
    images: [{ url: "/thumbnail.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/thumbnail.png"],
  },
};

const PLATFORMS = [
  {
    name: "WhatsApp (static)",
    size: "512 × 512 px",
    format: "WebP",
    limit: "≤ 100 KB",
    note: "Transparent background. Exact 512².",
  },
  {
    name: "WhatsApp (animated)",
    size: "512 × 512 px",
    format: "APNG / animated WebP",
    limit: "≤ 500 KB",
    note: "10–16 fps, keep loops seamless.",
  },
  {
    name: "Telegram",
    size: "512 × 512 px (one side 512)",
    format: "PNG",
    limit: "≤ 512 KB",
    note: "Transparent PNG; animated uses TGS.",
  },
  {
    name: "iMessage",
    size: "Multiple (small/medium/large)",
    format: "PNG / APNG",
    limit: "≤ 500 KB each",
    note: "Source up to 2064×2064.",
  },
  {
    name: "Discord",
    size: "320 × 320 px",
    format: "PNG / APNG",
    limit: "≤ 512 KB",
    note: "Animated max 5 seconds.",
  },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What is the exact WhatsApp sticker size?",
    a: "Each sticker must be exactly 512 × 512 pixels. Static stickers use the WebP format and should be 100 KB or smaller; animated stickers use APNG or animated WebP and can be up to about 500 KB. The pack also needs a 96 × 96 pixel tray icon in PNG format.",
  },
  {
    q: "Why does WhatsApp use 512×512?",
    a: "512×512 is large enough to look sharp on modern phone screens and when zoomed, but small enough to keep packs lightweight and fast to send. The square shape and the transparent WebP format also let stickers sit cleanly on top of chat bubbles without a visible background box.",
  },
  {
    q: "Can I use PNG instead of WebP for WhatsApp stickers?",
    a: "For an official pack submitted through a sticker provider, WebP is required. In practice, sticker maker apps accept ordinary PNG and JPG photos and convert them to WebP for you, so you rarely need to do the conversion yourself. If you are adding a single sticker through WhatsApp's built-in maker, you can work with a PNG directly.",
  },
  {
    q: "What happens if my sticker is the wrong size?",
    a: "Images that are not 512×512 get stretched or cropped, which causes blur, distortion, or cut-off subjects. Images smaller than 512×512 are upscaled and look soft. Sticker maker apps fix this automatically by cropping to a square and resizing; if you are preparing files by hand, start from a square image at 512×512 or larger.",
  },
  {
    q: "What is the WhatsApp sticker file-size limit?",
    a: "Static stickers should be at most 100 KB each, and animated stickers at most about 500 KB each. The tray icon should be 50 KB or smaller. Larger files may be rejected or automatically compressed, which can introduce artifacts.",
  },
  {
    q: "How do I make an image transparent for a sticker?",
    a: "Remove the background so only the subject remains, then export as PNG or WebP with transparency. AI sticker tools output transparent die-cut images automatically. From a photo, a sticker maker app or iOS 17's built-in cutout removes the background for you.",
  },
];

export default function WhatsAppStickerSizePage() {
  const related = relatedPosts("whatsapp-sticker-size", 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: TITLE, item: `${SITE}${PATH}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    author: { "@type": "Organization", name: "StickerSit", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "StickerSit",
      logo: { "@type": "ImageObject", url: `${SITE}/thumbnail.png` },
    },
    mainEntityOfPage: `${SITE}${PATH}`,
    image: `${SITE}/thumbnail.png`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">
          Home
        </Link>
        <span className="mx-1">/</span>
        <Link href="/blog" className="hover:text-violet-500">
          Guides
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">WhatsApp Sticker Size</span>
      </nav>

      <section className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">
          WhatsApp
        </p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          WhatsApp Sticker Size &amp; Format Explained
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          The exact WhatsApp sticker dimensions, format, and file-size limits
          for 2026 — plus a comparison table for Telegram, iMessage, and Discord,
          and how to resize any image to 512×512.
        </p>
        <p className="text-xs text-gray-400">
          Updated {PUBLISHED} · 6 min read · by StickerSit
        </p>
      </section>

      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        Getting the WhatsApp sticker size right is the single biggest difference
        between a sticker that looks crisp and one that looks blurry or
        distorted. The rules are strict but simple: one square dimension, one
        format, and a tight file-size budget. This guide lays out the exact
        numbers for static and animated WhatsApp stickers, explains the tray
        icon, compares the requirements across the other major chat apps, and
        shows you how to resize any image to the correct 512×512 pixels.
      </p>

      {/* Static specs */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Static WhatsApp sticker specs</h2>
        <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700 mb-4">
          <p>
            <strong>512 × 512 pixels</strong> · <strong>WebP</strong> ·{" "}
            <strong>≤ 100 KB</strong> · transparent background
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Every static sticker in a WhatsApp pack must be a square exactly 512
          pixels wide and 512 pixels tall, saved in WebP format with a
          transparent background, kept under 100 KB. WebP is required because it
          produces small, clean files with full alpha transparency — exactly
          what a die-cut sticker needs to float on a chat bubble without a white
          box around it.
        </p>
      </section>

      {/* Animated specs */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Animated WhatsApp sticker specs</h2>
        <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700 mb-4">
          <p>
            <strong>512 × 512 pixels</strong> · <strong>APNG or animated WebP</strong>{" "}
            · <strong>≤ 500 KB</strong> · 10–16 fps
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Animated stickers share the same 512×512 canvas but can move. WhatsApp
          accepts APNG and animated WebP at roughly 10 to 16 frames per second,
          with each file staying under about 500 KB. Keep the loop seamless so
          the animation does not visibly jump when it restarts, and keep the
          duration short — a few seconds is usually plenty for a reaction.
        </p>
      </section>

      {/* Tray icon */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">The tray icon (96 × 96)</h2>
        <p className="text-sm text-gray-600">
          Each pack also needs a tray icon — the small thumbnail that represents
          the pack in WhatsApp&rsquo;s sticker picker. It must be{" "}
          <strong>96 × 96 pixels</strong>, in PNG format, and ideally under 50
          KB. Think of it as the pack&rsquo;s app icon: simple, bold, and
          recognizable at a tiny size. A single emoji-style face or one strong
          symbol works better than a detailed illustration.
        </p>
      </section>

      {/* Why 512 */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Why 512×512?</h2>
        <p className="text-sm text-gray-600">
          512×512 is the sweet spot. It is sharp enough to look clean on modern
          phone screens and when a sticker is tapped to fill the view, but small
          enough that a pack of 30 stickers stays lightweight and instant to
          send. The square shape also means a sticker works equally well as a
          quick reaction or a full-size image, with no orientation to worry
          about.
        </p>
      </section>

      {/* Comparison table */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Sticker sizes across chat apps</h2>
        <p className="text-sm text-gray-600 mb-4">
          Each platform has its own requirements. If you make stickers for more
          than one app, design at the largest size you need (usually 512×512)
          and downscale.
        </p>
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
          <table className="w-full text-xs sm:text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-3 font-semibold">Platform</th>
                <th className="py-2 pr-3 font-semibold">Size</th>
                <th className="py-2 pr-3 font-semibold">Format</th>
                <th className="py-2 font-semibold">Limit</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORMS.map((p) => (
                <tr key={p.name} className="border-b border-gray-100 align-top">
                  <td className="py-2 pr-3 font-medium text-gray-700">{p.name}</td>
                  <td className="py-2 pr-3 text-gray-600">{p.size}</td>
                  <td className="py-2 pr-3 text-gray-600">{p.format}</td>
                  <td className="py-2 text-gray-600">{p.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Note: iMessage renders stickers at small, medium, and large sizes
          automatically from a single source image; Discord stickers are smaller
          at 320×320.
        </p>
      </section>

      {/* How to resize */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">How to resize an image to 512×512</h2>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p>
            <strong>1.</strong> Start from an image that is at least 512 pixels
            on its longest side so it does not need upscaling.
          </p>
          <p>
            <strong>2.</strong> Crop it to a square centered on the subject.
            Most sticker maker apps do this automatically; by hand, use any
            image editor with a square crop.
          </p>
          <p>
            <strong>3.</strong> Resize the square to exactly 512×512.
          </p>
          <p>
            <strong>4.</strong> Export as PNG or WebP with transparency. If the
            result is over 100 KB, reduce colors or simplify the design.
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700 mt-4">
          <strong>Tip:</strong> AI sticker tools like StickerSit export at the
          right size with the background already removed, so you can skip
          straight to step 4. <Link href="/" className="underline">Open the sticker maker</Link>.
        </div>
      </section>

      {/* Common mistakes */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Common sizing mistakes</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Too small.</strong> Source images under 512×512 get
            upscaled and look soft. Always start larger and downscale.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Wrong aspect ratio.</strong> A non-square image stretched to
            512×512 distorts the subject. Crop to a square first, never stretch.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Leftover background.</strong> A white or colored box around
            the subject usually means the background was not removed. Export with
            transparency instead.
          </div>
        </div>
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">WhatsApp sticker size FAQ</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="bg-white rounded-2xl p-5 shadow-sm group"
            >
              <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center">
                {item.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2">
                  ▾
                </span>
              </summary>
              <p className="text-sm text-gray-500 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related Guides */}
      {related.length > 0 && (
        <section className="mt-8 border-t border-gray-100 pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-4">
            Related Guides
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((post) => (
              <Link
                key={post.slug}
                href={post.path}
                className="bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all block"
              >
                <p className="text-[10px] font-black uppercase tracking-tight text-violet-600 mb-1">
                  {post.category}
                </p>
                <p className="text-sm font-bold text-black">{post.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 text-center py-8 border-t border-gray-100">
        <h2 className="text-lg font-bold mb-2">Want stickers sized perfectly?</h2>
        <p className="text-sm text-gray-500 mb-5">
          StickerSit exports at 512×512 with a transparent background, ready to go.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform"
        >
          Make a Sticker
        </Link>
      </section>
    </main>
  );
}
