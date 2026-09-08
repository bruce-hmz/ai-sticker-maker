import type { Metadata } from "next";
import Link from "next/link";
import StickerGenerator from "@/components/StickerGenerator";
import AdSenseUnit from "@/components/AdSenseUnit";
import { relatedPosts } from "@/lib/blog-posts";

const SITE = "https://stickersit.com";
const PATH = "/blog/how-to-make-stickers-for-whatsapp";
const TITLE = "How to Make Stickers for WhatsApp (Complete 2026 Guide)";
const DESCRIPTION =
  "Five free ways to make WhatsApp stickers in 2026 — an AI web tool, WhatsApp's built-in maker, iPhone, Android, and sticker pack apps. Sizes, formats, and step-by-step instructions.";
const PUBLISHED = "2026-07-06";

export const metadata: Metadata = {
  title: `${TITLE} | StickerSit`,
  description: DESCRIPTION,
  keywords: [
    "how to make stickers for whatsapp",
    "how to make custom whatsapp stickers",
    "make whatsapp stickers online",
    "whatsapp sticker maker free",
    "create whatsapp stickers without app",
    "whatsapp sticker size",
    "whatsapp sticker pack",
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
    q: "What is the correct WhatsApp sticker size?",
    a: "Each sticker in a pack must be exactly 512×512 pixels. Static stickers use the WebP format and should stay under 100 KB; animated stickers (APNG or animated WebP) can be up to 500 KB and run at up to 10–16 frames per second. A pack also needs a 96×96 tray icon. Casual users rarely need to hit these numbers by hand — sticker maker apps accept ordinary PNG or JPG photos and resize and convert them automatically.",
  },
  {
    q: "Can I make WhatsApp stickers without downloading an app?",
    a: "Yes. A web tool like StickerSit runs in your browser, so on a phone or computer you can type a description, generate a sticker, and download the PNG — no install, no sign up. You then move that PNG into WhatsApp using either WhatsApp's built-in sticker maker or a one-time pack tool.",
  },
  {
    q: "How many stickers do I need for a pack?",
    a: "A WhatsApp sticker pack needs at least 3 stickers and can hold up to 30. For a themed pack that feels complete, aim for 6–12 stickers that share one art style. Name the pack something memorable so friends can find it after you share it.",
  },
  {
    q: "Does WhatsApp support animated stickers?",
    a: "Yes. WhatsApp supports animated stickers in APNG or animated WebP format, up to about 10–16 fps and 500 KB per sticker. The easiest path is a sticker maker app that exports animated WebP; some AI tools can also generate short looping stickers you then convert.",
  },
  {
    q: "Why do my stickers look blurry?",
    a: "Almost always a size or format issue. Source images smaller than 512×512 get upscaled and look soft, and highly compressed JPGs lose detail before they even reach WhatsApp. Start from a square image that is at least 512×512, keep PNG or WebP rather than re-saving as JPG, and let a sticker maker crop to a square rather than stretching.",
  },
  {
    q: "Are these methods free?",
    a: "All five methods in this guide are free. WhatsApp's built-in maker and the iPhone cutout feature are part of the operating system. Sticker maker apps like Sticker Maker (iOS) and Personal Stickers for WhatsApp (Android) are free to install, and StickerSit is free with no sign up.",
  },
];

export default function HowToMakeWhatsAppStickersPage() {
  const related = relatedPosts("how-to-make-stickers-for-whatsapp", 3);

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
      {
        "@type": "HowToStep",
        position: 1,
        name: "Create or pick your sticker image",
        text: "Generate a sticker with an AI tool, cut a subject out of a photo, or draw one. Aim for a square image at least 512×512 pixels with a transparent background.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Get it to 512×512 WebP",
        text: "Use a sticker maker app or web tool to crop to a square, resize to 512×512, and export as PNG or WebP under the file-size limit.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Add it to WhatsApp",
        text: "Use WhatsApp's built-in sticker maker, or import the file into a sticker pack app and add the pack to WhatsApp from there.",
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
        <span className="text-gray-600">WhatsApp Stickers</span>
      </nav>

      <section className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">
          WhatsApp
        </p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          How to Make Stickers for WhatsApp
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          Five free ways to turn an idea, a photo, or a doodle into a WhatsApp
          sticker in 2026 — including sizes, formats, and the exact steps for
          each method.
        </p>
        <p className="text-xs text-gray-400">
          Updated {PUBLISHED} · 7 min read · by StickerSit
        </p>
      </section>

      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        WhatsApp stickers are more flexible than emoji and faster than GIFs, but
        the catch has always been making your own. The good news in 2026 is that
        you no longer need desktop software or a single niche app. Depending on
        what you start from — a text idea, a photo, or an existing image — one
        of these five methods will get you a sticker in under a minute. This
        guide covers each method, the exact WhatsApp sticker size and format
        requirements, and how to bundle stickers into a shareable pack.
      </p>

      {/* WhatsApp sticker requirements */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">
          WhatsApp sticker size &amp; format, at a glance
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Every method below ends with the same target. If you hit these
          numbers, WhatsApp will accept the sticker; if you miss them, a sticker
          maker app will usually fix it for you automatically.
        </p>
        <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700 mb-4">
          <p className="font-semibold mb-1">Official pack requirements</p>
          <p>
            Each sticker must be exactly <strong>512 × 512 pixels</strong>, in{" "}
            <strong>WebP</strong> (static) or <strong>APNG / animated WebP</strong>{" "}
            (animated). Static stickers should be under 100 KB, animated under
            500 KB. A pack needs a <strong>96 × 96</strong> tray icon and
            contains <strong>3 to 30</strong> stickers.
          </p>
        </div>
        <p className="text-sm text-gray-600">
          For quick personal use you can ignore most of this: sticker maker apps
          accept ordinary photos and PNGs and handle the resize and conversion
          for you. The specs matter most when you are publishing a pack through
          a sticker provider.
        </p>
      </section>

      {/* Method 1: StickerSit */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-violet-100 text-violet-700 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="text-lg font-bold">
            Generate a sticker from text (no app needed)
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          If you have an idea but no image, an AI sticker maker is the fastest
          route. You describe what you want, pick an art style, and download a
          finished sticker — directly in the browser, on phone or desktop. Try
          it right here:
        </p>

        <StickerGenerator showGallery={false} />

        <p className="text-sm text-gray-600">
          A good prompt is specific. Instead of &ldquo;cat&rdquo;, write{" "}
          <em>&ldquo;a happy orange cat wearing sunglasses and a party hat&rdquo;</em>.
          Include a subject, an expression, and one or two details. Generate the
          same prompt in two or three styles (Kawaii, Chibi, 3D Rendered) to see
          which you like best, then download the PNG.
        </p>
        <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700">
          <strong>Tip:</strong> Because the export is already a clean die-cut
          image on a transparent background, you can drop it straight into a
          sticker pack app with no extra editing.
        </div>
      </section>

      {/* Method 2: WhatsApp built-in */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            2
          </span>
          <h2 className="text-lg font-bold">
            Use WhatsApp&rsquo;s built-in sticker maker
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          WhatsApp can turn a photo into a sticker without leaving the chat.
          This is the simplest method if you already have a clear photo of a
          pet, a friend, or an object.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
            <li>Open any chat and tap the attachment (clip) icon.</li>
            <li>Choose <strong>Sticker</strong>, then pick a photo from your library.</li>
            <li>
              WhatsApp automatically detects the subject and removes the
              background. Adjust the crop if needed.
            </li>
            <li>Send it. The sticker is now saved in your sticker tray to reuse.</li>
          </ol>
        </div>
        <p className="text-sm text-gray-600">
          This works on both iPhone and Android in current WhatsApp versions.
          The downside is limited control — there is no styling, text, or
          artistic effects, just a clean cutout of whatever was in the photo.
        </p>
      </section>

      {/* Method 3: iPhone */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            3
          </span>
          <h2 className="text-lg font-bold">Make stickers on an iPhone</h2>
        </div>
        <p className="text-sm text-gray-600">
          On iOS 17 and later, Apple added a native sticker cutout that works
          system-wide. Long-press a subject in any photo in the Photos app, tap{" "}
          <strong>Add Sticker</strong>, and it lands in your Messages sticker
          drawer. You can add effects (Outline, Comic, Puffy, Shiny), turn Live
          Photos into animated stickers, and the whole tray syncs to iPad and
          Mac through iCloud.
        </p>
        <p className="text-sm text-gray-600">
          To move an iOS sticker into WhatsApp, save it as an image first, then
          use WhatsApp&rsquo;s built-in maker (Method 2) or a pack app. For the
          full walkthrough, see our dedicated{" "}
          <Link
            href="/how-to-make-a-sticker-on-iphone"
            className="text-violet-600 hover:underline"
          >
            how to make a sticker on iPhone
          </Link>{" "}
          guide.
        </p>
      </section>

      {/* Method 4: Android */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            4
          </span>
          <h2 className="text-lg font-bold">Make stickers on Android</h2>
        </div>
        <p className="text-sm text-gray-600">
          Android does not have a system-level sticker cutout, so a small helper
          app does the job. The two most popular are both free:
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3 text-sm text-gray-600">
          <p>
            <strong>Sticker Maker</strong> — open the app, create a new pack,
            pick a photo, and it removes the background and crops to a square.
            Tap <strong>Add to WhatsApp</strong>, confirm, and the pack appears
            in WhatsApp&rsquo;s sticker tray.
          </p>
          <p>
            <strong>Personal Stickers for WhatsApp</strong> — lighter and more
            manual: you load existing PNG images with transparent backgrounds
            and it bundles them into a pack. Pairs well with AI-generated PNGs
            from Method 1.
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Both apps handle the 512×512 resize and WebP conversion automatically,
          so you can work from ordinary photos.
        </p>
      </section>

      {/* Method 5: pack apps / from existing images */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            5
          </span>
          <h2 className="text-lg font-bold">
            Bundle images into a shareable pack
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          Once you have a few stickers, a pack makes them easy to share. A pack
          is just a named collection of 3 to 30 stickers that other people can
          install from a link inside WhatsApp.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p>
            <strong>1.</strong> Gather 3 to 30 images. Keep one art style across
            the whole pack so it feels consistent.
          </p>
          <p>
            <strong>2.</strong> Open a sticker maker app (Sticker Maker on iOS,
            Personal Stickers on Android) and create a new pack.
          </p>
          <p>
            <strong>3.</strong> Add each image, give the pack a name and a tray
            icon, then tap <strong>Add to WhatsApp</strong>.
          </p>
          <p>
            <strong>4.</strong> Inside any WhatsApp chat, open the sticker tray,
            tap the share icon on the pack, and send it to a friend to install.
          </p>
        </div>
      </section>

      {/* Which method to pick */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Which method should you use?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <p className="font-bold text-black mb-1">You have an idea, no image</p>
            <p className="text-gray-500">
              Method 1 — AI text-to-sticker. Fastest from nothing.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <p className="font-bold text-black mb-1">You have a clear photo</p>
            <p className="text-gray-500">
              Method 2 (built-in) or Method 3/4 (iPhone/Android apps).
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <p className="font-bold text-black mb-1">You want effects or styles</p>
            <p className="text-gray-500">
              Method 1 (art styles) or iOS effects in Method 3.
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100">
            <p className="font-bold text-black mb-1">You want to share a set</p>
            <p className="text-gray-500">
              Method 5 — bundle into a pack and share the link.
            </p>
          </div>
        </div>
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">
          WhatsApp sticker FAQ
        </h2>
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

      {/* CTA */}
      <section className="mt-10 text-center py-8 border-t border-gray-100">
        <h2 className="text-lg font-bold mb-2">Ready to make your first sticker?</h2>
        <p className="text-sm text-gray-500 mb-5">
          Free, no sign up, no app download.
        </p>
        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform"
        >
          Start Creating Stickers
        </Link>
      </section>
    </main>
  );
}
