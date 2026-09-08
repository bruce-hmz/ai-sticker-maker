import type { Metadata } from "next";
import Link from "next/link";
import StickerGenerator from "@/components/StickerGenerator";
import AdSenseUnit from "@/components/AdSenseUnit";
import { relatedPosts } from "@/lib/blog-posts";

const SITE = "https://stickersit.com";
const PATH = "/blog/how-to-make-stickers-on-android";
const TITLE = "How to Make Stickers on Android (3 Free Methods)";
const DESCRIPTION =
  "Three free ways to make WhatsApp stickers on Android in 2026 — an AI web tool, sticker maker apps (Sticker Maker, Personal Stickers for WhatsApp), and WhatsApp's built-in maker. Sizes, steps, and troubleshooting.";
const PUBLISHED = "2026-07-06";

export const metadata: Metadata = {
  title: `${TITLE} | StickerSit`,
  description: DESCRIPTION,
  keywords: [
    "how to make stickers on android",
    "make whatsapp stickers android",
    "android sticker maker",
    "sticker maker android",
    "personal stickers for whatsapp",
    "create stickers android free",
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
    q: "What is the best free sticker maker for Android?",
    a: "Two are consistently the best and both are free. Sticker Maker is the easiest — it removes backgrounds and crops for you from any photo. Personal Stickers for WhatsApp is lighter and more manual, ideal when you already have transparent PNG images (for example from an AI generator) and just want to bundle them into a pack.",
  },
  {
    q: "Can I make WhatsApp stickers on Android without an app?",
    a: "Yes. A browser-based AI generator like StickerSit works on Android with no install and no sign up — describe a sticker, download the PNG, then move it into WhatsApp using either WhatsApp's built-in maker or a one-time pack app.",
  },
  {
    q: "What size do Android WhatsApp stickers need to be?",
    a: "Each sticker must be 512×512 pixels in WebP under 100 KB, with a transparent background, and the pack needs a 96×96 tray icon. Sticker maker apps handle this resize and conversion automatically, so you can work from ordinary photos. See our sticker size guide for the full specs.",
  },
  {
    q: "Why will my pack not add to WhatsApp?",
    a: "The pack app needs permission to talk to WhatsApp. Re-grant permissions in Android settings if the add silently fails, make sure WhatsApp is selected as the target in the pack app, and tap Add to WhatsApp again. Also check the pack has at least 3 stickers — WhatsApp rejects smaller packs.",
  },
  {
    q: "How do I make animated stickers on Android?",
    a: "Use a sticker maker app that exports animated stickers (APNG or animated WebP, under about 500 KB each). Create the pack the same way as static stickers. Keep the animation short and the loop seamless so it does not visibly jump when it restarts.",
  },
  {
    q: "Can I make stickers from photos already on my phone?",
    a: "Yes. Open Sticker Maker, create a pack, pick a photo from your gallery, and the app removes the background and crops to a square. WhatsApp's built-in maker (attachment icon then Sticker) does the same thing directly inside a chat.",
  },
];

export default function HowToMakeStickersOnAndroidPage() {
  const related = relatedPosts("how-to-make-stickers-on-android", 3);

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
      { "@type": "HowToStep", position: 1, name: "Create the sticker image", text: "Generate with an AI tool, cut a subject from a photo, or draw one. Aim for a square image at least 512×512 with a transparent background." },
      { "@type": "HowToStep", position: 2, name: "Get it to 512×512 WebP", text: "Use Sticker Maker or Personal Stickers for WhatsApp to resize and convert automatically." },
      { "@type": "HowToStep", position: 3, name: "Add to WhatsApp", text: "Bundle into a pack of 3 or more, then tap Add to WhatsApp from the pack app." },
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
        <span className="text-gray-600">Android Stickers</span>
      </nav>

      <section className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">Android</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          How to Make Stickers on Android
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          Three free ways to make WhatsApp stickers on an Android phone — an AI
          web tool, sticker maker apps, and WhatsApp&rsquo;s built-in maker — with the
          exact steps, sizes, and troubleshooting.
        </p>
        <p className="text-xs text-gray-400">Updated {PUBLISHED} · 6 min read · by StickerSit</p>
      </section>

      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        Android does not have a system-level sticker cutter the way iPhones do,
        but a couple of free apps fill that gap completely. Whether you start
        from a text idea, a photo, or a downloaded PNG, one of these three
        methods will get you a WhatsApp sticker on Android in a minute or two.
        (On an iPhone instead? See our{" "}
        <Link href="/how-to-make-a-sticker-on-iphone" className="text-violet-600 hover:underline">
          iPhone sticker guide
        </Link>
        .)
      </p>

      {/* Method 1: AI */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-violet-100 text-violet-700 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</span>
          <h2 className="text-lg font-bold">Generate a sticker with AI (no app)</h2>
        </div>
        <p className="text-sm text-gray-600">
          The fastest route from nothing to a sticker is a browser-based AI
          generator. It runs on Android with no install and no sign up — you
          describe the sticker, pick a style, and download a transparent PNG.
        </p>
        <StickerGenerator showGallery={false} />
        <p className="text-sm text-gray-600">
          Be specific: &ldquo;a happy corgi wearing a scarf and holding a coffee cup&rdquo;
          beats &ldquo;corgi&rdquo;. Once you download the PNG, use Method 2 to load it into
          WhatsApp.
        </p>
      </section>

      {/* Method 2: Sticker Maker */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</span>
          <h2 className="text-lg font-bold">Use Sticker Maker (from a photo)</h2>
        </div>
        <p className="text-sm text-gray-600">
          Sticker Maker is the easiest path when you already have a photo. It
          removes the background, crops to a square, and handles the 512×512
          WebP conversion automatically.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p><strong>1.</strong> Install Sticker Maker from Google Play and open it.</p>
          <p><strong>2.</strong> Create a new pack and give it a name.</p>
          <p><strong>3.</strong> Tap to add a sticker and pick a photo from your gallery.</p>
          <p><strong>4.</strong> Adjust the automatic cutout and crop if needed, then save.</p>
          <p><strong>5.</strong> Tap <strong>Add to WhatsApp</strong> and confirm the prompt.</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700">
          <strong>Tip:</strong> Photos with a clear subject and a simple
          background produce the cleanest cutouts.
        </div>
      </section>

      {/* Method 3: Personal Stickers */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</span>
          <h2 className="text-lg font-bold">Use Personal Stickers for WhatsApp (from PNGs)</h2>
        </div>
        <p className="text-sm text-gray-600">
          Personal Stickers for WhatsApp is lighter and more manual — it bundles
          existing transparent PNG images into a pack. It pairs perfectly with
          AI-generated PNGs from Method 1.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p><strong>1.</strong> Install Personal Stickers for WhatsApp from Google Play.</p>
          <p><strong>2.</strong> Create a new pack and name it.</p>
          <p><strong>3.</strong> Select one or more transparent PNG images from your gallery or downloads.</p>
          <p><strong>4.</strong> Tap <strong>Add to WhatsApp</strong> and confirm.</p>
        </div>
      </section>

      {/* Built-in */}
      <section className="py-6 space-y-4">
        <h2 className="text-xl font-bold">Bonus: WhatsApp&rsquo;s built-in maker</h2>
        <p className="text-sm text-gray-600">
          WhatsApp itself can turn a photo into a sticker without any extra app.
          In any chat, tap the attachment (clip) icon, choose{" "}
          <strong>Sticker</strong>, pick a photo, and WhatsApp removes the
          background. The result saves straight to your sticker tray.
        </p>
        <p className="text-sm text-gray-600">
          This is the simplest method but offers no styling or effects — just a
          clean cutout. For a fuller walkthrough of adding stickers, see our{" "}
          <Link href="/blog/how-to-add-stickers-on-whatsapp" className="text-violet-600 hover:underline">
            add stickers guide
          </Link>
          .
        </p>
      </section>

      {/* Specs */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">The size to remember</h2>
        <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700">
          <strong>512 × 512 px</strong> · WebP · ≤ 100 KB · transparent
          background · tray icon 96 × 96.
        </div>
        <p className="text-sm text-gray-600 mt-3">
          The apps above hit these numbers for you. If you ever prepare files by
          hand, the full spec is in our{" "}
          <Link href="/blog/whatsapp-sticker-size" className="text-violet-600 hover:underline">sticker size guide</Link>.
        </p>
      </section>

      {/* Troubleshooting */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Troubleshooting</h2>
        <div className="space-y-3 text-sm">
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Pack will not add.</strong> Check that the pack app has
            permission to access WhatsApp, and that the pack has at least 3
            stickers. Re-tap Add to WhatsApp after granting permissions.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>White box around the sticker.</strong> The background was not
            removed. Use transparent PNGs (AI tools output these) or let Sticker
            Maker cut the subject out.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Blurry stickers.</strong> The source was under 512×512.
            Start from a larger image and let the app downscale.
          </div>
        </div>
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Android sticker FAQ</h2>
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
        <h2 className="text-lg font-bold mb-2">Make a sticker on your Android phone</h2>
        <p className="text-sm text-gray-500 mb-5">Free, no app install, no sign up.</p>
        <Link href="/" className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform">
          Start Creating Stickers
        </Link>
      </section>
    </main>
  );
}
