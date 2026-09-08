import type { Metadata } from "next";
import Link from "next/link";
import StickerGenerator from "@/components/StickerGenerator";
import AdSenseUnit from "@/components/AdSenseUnit";
import { relatedPosts } from "@/lib/blog-posts";

const SITE = "https://stickersit.com";
const PATH = "/blog/how-to-create-a-whatsapp-sticker-pack";
const TITLE = "How to Create a WhatsApp Sticker Pack (Custom & Shareable)";
const DESCRIPTION =
  "Step-by-step guide to creating a custom WhatsApp sticker pack in 2026 — pack rules (3–30 stickers, 512×512, tray icon), the iOS and Android creation flow, how to share a pack, animated packs, and troubleshooting.";
const PUBLISHED = "2026-07-06";

export const metadata: Metadata = {
  title: `${TITLE} | StickerSit`,
  description: DESCRIPTION,
  keywords: [
    "how to create a whatsapp sticker pack",
    "create whatsapp sticker pack",
    "make a whatsapp sticker pack",
    "share whatsapp sticker pack",
    "whatsapp sticker pack rules",
    "custom whatsapp stickers",
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
    q: "How many stickers can a WhatsApp pack hold?",
    a: "A pack needs at least 3 stickers and can hold up to 30. For a themed pack that feels complete rather than thin, aim for 6 to 12 stickers that share one art style. Fewer than 3 and WhatsApp will not accept it as a pack.",
  },
  {
    q: "What are the rules for a WhatsApp sticker pack?",
    a: "Every sticker must be 512×512 pixels in WebP under 100 KB (or APNG / animated WebP under about 500 KB for animated), with a transparent background. The pack needs a 96×96 PNG tray icon under 50 KB, a name, and between 3 and 30 stickers. A consistent art style across the pack makes it look intentional.",
  },
  {
    q: "How do I share a WhatsApp sticker pack?",
    a: "Open any chat, open the sticker tray, find your pack, then tap the share icon (or tap and hold a sticker and choose the share option). Send the pack link into a chat; the recipient taps it and confirms to install the whole pack on their device.",
  },
  {
    q: "Can I make an animated WhatsApp sticker pack?",
    a: "Yes. Use a sticker maker app that exports animated stickers (APNG or animated WebP, under about 500 KB each, around 10–16 fps) and add them to a pack the same way as static stickers. Keep loops seamless so the motion does not visibly jump.",
  },
  {
    q: "How do I keep a pack looking consistent?",
    a: "Lock one art style across every sticker — for example all Kawaii or all 3D Rendered — and reuse the same color palette. If you use an AI tool, keep the style setting the same and only change the subject or expression between stickers.",
  },
  {
    q: "Can other people install a pack I make?",
    a: "Yes. Once a pack is added to your WhatsApp, you can share it inside any chat. Friends tap the shared pack link and confirm to install it on their own device, so your custom pack can spread through a group or friend circle.",
  },
];

export default function HowToCreateAWhatsAppStickerPackPage() {
  const related = relatedPosts("how-to-create-a-whatsapp-sticker-pack", 3);

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
      { "@type": "HowToStep", position: 1, name: "Plan the theme", text: "Pick one theme and one art style so the pack feels cohesive — for example a 'moods' pack of a cat in different expressions." },
      { "@type": "HowToStep", position: 2, name: "Make 3–30 stickers", text: "Generate or prepare each sticker as a 512×512 transparent PNG, keeping the style and palette consistent." },
      { "@type": "HowToStep", position: 3, name: "Bundle in a pack app", text: "Use Sticker Maker (iOS) or Personal Stickers for WhatsApp (Android) to bundle the stickers, add a tray icon and name, and add the pack to WhatsApp." },
      { "@type": "HowToStep", position: 4, name: "Share", text: "Open the sticker tray, find the pack, and share it into a chat so others can install it." },
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
        <span className="text-gray-600">Create a Sticker Pack</span>
      </nav>

      <section className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">WhatsApp</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          How to Create a WhatsApp Sticker Pack
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          A complete walkthrough for turning a set of ideas into a custom,
          shareable WhatsApp sticker pack — the pack rules, the iOS and Android
          creation flow, how to share it, and how to fix common issues.
        </p>
        <p className="text-xs text-gray-400">Updated {PUBLISHED} · 7 min read · by StickerSit</p>
      </section>

      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        A single sticker is fun, but a themed pack is what makes friends actually
        install your creations. The good news: anyone can build a WhatsApp
        sticker pack in a few minutes from a phone, no desktop software required.
        This guide covers the official pack rules, walks through the creation
        flow on iPhone and Android, and ends with sharing and troubleshooting.
      </p>

      {/* Rules */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">The pack rules</h2>
        <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700 mb-4">
          <p className="font-semibold mb-1">Official requirements</p>
          <p>
            <strong>3 to 30</strong> stickers per pack · each exactly{" "}
            <strong>512 × 512 px</strong> · <strong>WebP</strong> (static) or{" "}
            <strong>APNG / animated WebP</strong> (animated) · static ≤ 100 KB,
            animated ≤ 500 KB · a <strong>96 × 96</strong> PNG tray icon · a pack
            name.
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Do not let the specs intimidate you — sticker maker apps enforce all of
          them automatically. The rules matter most if you ever publish through
          a sticker provider. For personal packs shared with friends, the app
          does the resizing and conversion. Full specs are in our{" "}
          <Link href="/blog/whatsapp-sticker-size" className="text-violet-600 hover:underline">
            sticker size guide
          </Link>
          .
        </p>
      </section>

      {/* Plan */}
      <section className="py-6 space-y-4">
        <h2 className="text-xl font-bold">Step 1 — Plan a cohesive theme</h2>
        <p className="text-sm text-gray-600">
          The best packs feel like a set, not a random folder. Pick one theme
          and one art style before you make anything. A few proven concepts:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <p className="font-bold text-black mb-1">Moods</p>
            <p className="text-gray-500">One character in happy, angry, sleepy, shocked poses.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <p className="font-bold text-black mb-1">Seasonal</p>
            <p className="text-gray-500">Birthday, holiday, or World Cup stickers in one style.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <p className="font-bold text-black mb-1">Pets</p>
            <p className="text-gray-500">Your pet stylized in a consistent art style.</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <p className="font-bold text-black mb-1">Reactions</p>
            <p className="text-gray-500">Thumbs up, facepalm, heart-eyes, laughing — a full set.</p>
          </div>
        </div>
      </section>

      {/* Make */}
      <section className="py-6 space-y-4">
        <h2 className="text-xl font-bold">Step 2 — Make 3 to 30 stickers</h2>
        <p className="text-sm text-gray-600">
          Generate each sticker as a 512×512 transparent PNG, keeping the same
          art style across the set. You can make them here — keep the style
          dropdown fixed and only change the subject or expression:
        </p>
        <StickerGenerator showGallery={false} />
        <p className="text-sm text-gray-600">
          Aim for 6 to 12 stickers. That is enough to cover a range of reactions
          or subjects without the pack feeling thin or bloated. Download each
          PNG to your device.
        </p>
      </section>

      {/* Bundle iOS */}
      <section className="py-6 space-y-4">
        <h2 className="text-xl font-bold">Step 3 — Bundle the pack</h2>
        <p className="text-sm text-gray-600 mb-2">On iPhone (Sticker Maker):</p>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p><strong>1.</strong> Open Sticker Maker and tap to create a new pack.</p>
          <p><strong>2.</strong> Add each downloaded PNG. The app crops, resizes to 512×512, and converts to WebP.</p>
          <p><strong>3.</strong> Set a pack name and choose or upload a tray icon.</p>
          <p><strong>4.</strong> Tap <strong>Add to WhatsApp</strong> and confirm the prompt.</p>
        </div>
        <p className="text-sm text-gray-600 mb-2 mt-3">On Android (Personal Stickers for WhatsApp):</p>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p><strong>1.</strong> Open the app and create a new pack.</p>
          <p><strong>2.</strong> Select your transparent PNG images.</p>
          <p><strong>3.</strong> Name the pack and tap <strong>Add to WhatsApp</strong>.</p>
        </div>
      </section>

      {/* Share */}
      <section className="py-6 space-y-4">
        <h2 className="text-xl font-bold">Step 4 — Share the pack</h2>
        <p className="text-sm text-gray-600">
          Once the pack is in your tray, share it so others can install the
          whole set at once. Open any chat, open the sticker tray, swipe to your
          pack, and tap the share icon — or tap and hold a sticker and choose
          the share option. Send the pack link into a chat; recipients tap it and
          confirm to install.
        </p>
        <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700">
          <strong>Tip:</strong> Give the pack a memorable name. People find
          packs by name in their tray, so something specific like &ldquo;Office
          Cat Moods&rdquo; beats &ldquo;Stickers 1&rdquo;.
        </div>
      </section>

      {/* Animated packs */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Animated sticker packs</h2>
        <p className="text-sm text-gray-600">
          The flow is the same for animated stickers, which use APNG or animated
          WebP (under about 500 KB each, around 10–16 fps). Use a sticker maker
          app that exports animated stickers and add them to the pack the same
          way. Keep the loop seamless so the motion does not visibly restart.
        </p>
      </section>

      {/* Troubleshooting */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Troubleshooting</h2>
        <div className="space-y-3 text-sm">
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Pack has fewer than 3 stickers.</strong> WhatsApp will not
            accept it. Add at least three before tapping Add to WhatsApp.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Stickers look blurry.</strong> The source images were under
            512×512. Regenerate or re-export at 512×512 or larger and rebuild the
            pack.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>White box around stickers.</strong> The background was not
            removed. Use transparent PNGs — AI tools and the built-in maker both
            output transparent die-cuts.
          </div>
        </div>
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Sticker pack FAQ</h2>
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
        <h2 className="text-lg font-bold mb-2">Ready to build your pack?</h2>
        <p className="text-sm text-gray-500 mb-5">Generate the stickers first — free, no sign up.</p>
        <Link href="/" className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform">
          Start Creating Stickers
        </Link>
      </section>
    </main>
  );
}
