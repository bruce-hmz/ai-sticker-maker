import type { Metadata } from "next";
import Link from "next/link";
import StickerGenerator from "@/components/StickerGenerator";
import AdSenseUnit from "@/components/AdSenseUnit";
import { relatedPosts } from "@/lib/blog-posts";

const SITE = "https://stickersit.com";
const PATH = "/blog/how-to-make-telegram-stickers";
const TITLE = "How to Make Telegram Stickers (Sizes, Packs, and the @Stickers Bot)";
const DESCRIPTION =
  "How to make custom Telegram stickers in 2026 — the exact size and format requirements, the @Stickers bot step-by-step flow, animated TGS stickers, and how to share your pack.";
const PUBLISHED = "2026-07-06";

export const metadata: Metadata = {
  title: `${TITLE} | StickerSit`,
  description: DESCRIPTION,
  keywords: [
    "how to make telegram stickers",
    "telegram sticker size",
    "telegram sticker maker",
    "telegram stickers bot",
    "create telegram sticker pack",
    "telegram sticker format",
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

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "What is the Telegram sticker size?",
    a: "Telegram stickers are 512×512 pixels, with at least one side exactly 512. Static stickers are PNG with a transparent background and should be 512 KB or smaller. Animated stickers use the TGS format, up to 64 KB, 30 frames per second, and a maximum of about 10 seconds.",
  },
  {
    q: "How do I make a Telegram sticker pack?",
    a: "Open the @Stickers bot in Telegram, send /newpack, follow the prompts to name the pack, then send each 512×512 PNG and pick an emoji for it. When you have added at least one sticker, send /publish, choose a short name for the link, and the bot gives you a t.me/addstickings link to share.",
  },
  {
    q: "Does each Telegram sticker need an emoji?",
    a: "Yes. The @Stickers bot asks you to assign at least one emoji to every sticker when you upload it. The emoji is how Telegram matches a sticker to what you type, so pick one that represents the sticker's mood or subject. You can add several emojis per sticker.",
  },
  {
    q: "Can I make animated Telegram stickers?",
    a: "Yes. Telegram uses the TGS format (a compressed Lottie animation) for animated stickers: 512×512, up to 64 KB, 30 fps, roughly 10 seconds max. TGS files need a dedicated animation tool that exports Lottie and converts to TGS, so animated Telegram stickers are more involved than static ones.",
  },
  {
    q: "How do I share a Telegram sticker pack?",
    a: "After you /publish the pack in the @Stickers bot, it gives you a t.me/addstickers/YourPackName link. Send that link to anyone, or post it in a group; tapping it opens the pack and an Add Stickers button installs it instantly.",
  },
  {
    q: "Can I use the same sticker for Telegram and WhatsApp?",
    a: "Both use 512×512 pixels with a transparent background, so a single transparent PNG works for both. Telegram wants PNG (and TGS for animated); WhatsApp wants WebP. PNGs you make here can go to the @Stickers bot directly and to WhatsApp through a pack app.",
  },
];

export default function HowToMakeTelegramStickersPage() {
  const related = relatedPosts("how-to-make-telegram-stickers", 3);

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

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: TITLE,
    description: DESCRIPTION,
    step: [
      { "@type": "HowToStep", position: 1, name: "Prepare a 512×512 PNG", text: "Create or export each sticker as a 512×512 PNG with a transparent background, 512 KB or smaller." },
      { "@type": "HowToStep", position: 2, name: "Open the @Stickers bot", text: "In Telegram, search for the @Stickers bot and start it, then send /newpack." },
      { "@type": "HowToStep", position: 3, name: "Upload and assign emojis", text: "Send each PNG, pick an emoji for it, and repeat for every sticker." },
      { "@type": "HowToStep", position: 4, name: "Publish and share", text: "Send /publish, choose a short name for the link, and share the t.me/addstickers link." },
    ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/blog" className="hover:text-violet-500">Guides</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Telegram Stickers</span>
      </nav>

      <section className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">Telegram</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          How to Make Telegram Stickers
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          The exact Telegram sticker size and format, the @Stickers bot flow from
          start to finish, animated TGS stickers, and how to share a pack so
          anyone can install it.
        </p>
        <p className="text-xs text-gray-400">Updated {PUBLISHED} · 7 min read · by StickerSit</p>
      </section>

      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        Telegram has one of the cleanest sticker systems of any chat app: a
        single size, a single built-in bot, and a share link that installs a
        pack in one tap. The whole process happens inside Telegram itself. This
        guide covers the size and format requirements, walks through the
        @Stickers bot step by step, and ends with animated stickers and sharing.
      </p>

      {/* Requirements */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Telegram sticker requirements</h2>
        <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700 mb-4">
          <p className="font-semibold mb-1">Static stickers</p>
          <p><strong>512 × 512 px</strong> (one side exactly 512) · <strong>PNG</strong> · transparent background · <strong>≤ 512 KB</strong>.</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700 mb-4">
          <p className="font-semibold mb-1">Animated stickers</p>
          <p><strong>TGS format</strong> · 512 × 512 px · <strong>≤ 64 KB</strong> · 30 fps · max ~10 seconds.</p>
        </div>
        <p className="text-sm text-gray-600">
          Note the format difference from WhatsApp: Telegram static stickers use{" "}
          <strong>PNG</strong>, not WebP. The 512×512 size and transparent
          background are shared, so a single transparent PNG works for both
          apps.
        </p>
      </section>

      {/* Make the PNG */}
      <section className="py-6 space-y-4">
        <h2 className="text-xl font-bold">Step 1 — Make a 512×512 PNG</h2>
        <p className="text-sm text-gray-600">
          Generate a sticker with a transparent background and download it as a
          PNG. A specific prompt produces a better result than a single word:
        </p>
        <StickerGenerator showGallery={false} />
        <p className="text-sm text-gray-600">
          Save each PNG to your device. Keep one art style across the set so the
          pack feels cohesive.
        </p>
      </section>

      {/* @Stickers bot */}
      <section className="py-6 space-y-4">
        <h2 className="text-xl font-bold">Step 2 — The @Stickers bot flow</h2>
        <p className="text-sm text-gray-600">
          Telegram&rsquo;s official @Stickers bot builds and publishes packs right
          inside the app. The whole flow is a conversation with the bot.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p><strong>1.</strong> In Telegram, search for <strong>@Stickers</strong> and start the bot. Send <code>/newpack</code>.</p>
          <p><strong>2.</strong> The bot asks for a <strong>name</strong> for your pack — type one and send.</p>
          <p><strong>3.</strong> Send your first <strong>512×512 PNG</strong> as an image (not a file is fine too, but image keeps transparency).</p>
          <p><strong>4.</strong> Pick an <strong>emoji</strong> that represents the sticker and send it. The emoji is how Telegram matches stickers to typing.</p>
          <p><strong>5.</strong> Repeat steps 3–4 for each sticker.</p>
          <p><strong>6.</strong> When you have added at least one sticker, send <code>/publish</code>.</p>
          <p><strong>7.</strong> Choose a <strong>short name</strong> for the pack link (this becomes part of the t.me/addstickers/… URL).</p>
          <p><strong>8.</strong> The bot sends you a <strong>t.me/addstickers/YourPackName</strong> link. That is your shareable pack.</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700">
          <strong>Tip:</strong> Pick a unique short name — common words are
          already taken. Something specific like <em>my_office_cat</em> is more
          likely to be available than <em>cats</em>.
        </div>
      </section>

      {/* Sharing */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Step 3 — Share the pack</h2>
        <p className="text-sm text-gray-600">
          Send the t.me/addstickers link into any chat or post it in a group.
          Anyone who taps it sees the pack preview and an Add Stickers button
          that installs every sticker at once. You can also share a pack you
          already use by opening a sticker, tapping the three dots, and choosing
          the share option.
        </p>
      </section>

      {/* Animated */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Animated Telegram stickers</h2>
        <p className="text-sm text-gray-600 mb-3">
          Animated Telegram stickers use the <strong>TGS</strong> format, a
          compressed Lottie animation: 512×512, up to 64 KB, 30 fps, about 10
          seconds max. Because TGS is a vector format, you cannot export it from
          a normal video — you need an animation tool that outputs Lottie and a
          TGS converter. The @Stickers bot uploads animated stickers with the{" "}
          <code>/newanimated</code> command instead of <code>/newpack</code>.
        </p>
        <div className="bg-amber-50 rounded-lg p-4 text-sm text-amber-700">
          <strong>Heads up:</strong> animated Telegram stickers are noticeably
          more work than static ones. If you are just starting, make a static PNG
          pack first — it covers the vast majority of uses.
        </div>
      </section>

      {/* Cross-platform */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Use the same PNG for WhatsApp too</h2>
        <p className="text-sm text-gray-600">
          Because the 512×512 transparent PNG is also what WhatsApp expects (just
          wrapped in WebP), you can reuse every sticker. Send the PNG straight to
          the @Stickers bot for Telegram, and for WhatsApp bundle it with a pack
          app that does the WebP conversion. See our{" "}
          <Link href="/blog/whatsapp-sticker-size" className="text-violet-600 hover:underline">sticker size guide</Link>{" "}
          for the cross-app specs.
        </p>
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Telegram sticker FAQ</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="bg-white rounded-2xl p-5 shadow-sm group">
              <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center">
                {item.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2">▾</span>
              </summary>
              <p className="text-sm text-gray-500 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-8 border-t border-gray-100 pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-4">Related Guides</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((post) => (
              <Link key={post.slug} href={post.path} className="bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all block">
                <p className="text-[10px] font-black uppercase tracking-tight text-violet-600 mb-1">{post.category}</p>
                <p className="text-sm font-bold text-black">{post.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10 text-center py-8 border-t border-gray-100">
        <h2 className="text-lg font-bold mb-2">Make a sticker for Telegram</h2>
        <p className="text-sm text-gray-500 mb-5">Free, no sign up — exports a transparent 512×512 PNG.</p>
        <Link href="/" className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform">
          Start Creating Stickers
        </Link>
      </section>
    </main>
  );
}
