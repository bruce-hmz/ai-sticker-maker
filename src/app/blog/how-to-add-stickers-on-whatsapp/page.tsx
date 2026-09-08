import type { Metadata } from "next";
import Link from "next/link";
import StickerGenerator from "@/components/StickerGenerator";
import AdSenseUnit from "@/components/AdSenseUnit";
import { relatedPosts } from "@/lib/blog-posts";

const SITE = "https://stickersit.com";
const PATH = "/blog/how-to-add-stickers-on-whatsapp";
const TITLE = "How to Add Stickers on WhatsApp (From Any Source)";
const DESCRIPTION =
  "Four ways to add stickers to WhatsApp in 2026 — from a photo with the built-in maker, from a pack app, from a shared pack link, or from a downloaded PNG. Plus how to find them and fix packs that won't show.";
const PUBLISHED = "2026-07-06";

export const metadata: Metadata = {
  title: `${TITLE} | StickerSit`,
  description: DESCRIPTION,
  keywords: [
    "how to add stickers on whatsapp",
    "how to add stickers to whatsapp",
    "add sticker to whatsapp",
    "import whatsapp stickers",
    "whatsapp sticker pack not showing",
    "where are my whatsapp stickers",
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
    q: "Where do I find my stickers in WhatsApp?",
    a: "Open any chat, tap the emoji/sticker face icon next to the text field, then switch to the sticker tab (the square smiley). Your installed packs appear in a row at the bottom — swipe left and right to switch between packs, and scroll up and down inside a pack to see its stickers.",
  },
  {
    q: "Why is my sticker pack not showing up?",
    a: "The pack may still be installing — close and reopen the sticker tray. If it still does not appear, the pack app did not add it successfully: open the pack app, confirm WhatsApp is selected as the target, and tap Add to WhatsApp again. On Android, also check that WhatsApp has the permissions the pack app needs.",
  },
  {
    q: "How do I add a sticker pack a friend sent me?",
    a: "When someone sends a sticker from a pack you do not have, tap and hold the sticker and choose 'Add sticker' to save just that one, or look for an 'Add pack' option to install the whole pack. You can also tap a shared pack link to open it and confirm the install.",
  },
  {
    q: "Can I add an animated sticker to WhatsApp?",
    a: "Yes. WhatsApp supports animated stickers in APNG or animated WebP format. The easiest route is a sticker maker app that exports animated stickers and adds them directly to WhatsApp, or an animated sticker pack you install from a shared link.",
  },
  {
    q: "How do I add a PNG I downloaded to WhatsApp?",
    a: "Install a sticker pack app (Sticker Maker on iPhone, Personal Stickers for WhatsApp on Android), create a new pack, and import the PNG. The app resizes it to 512×512, converts it to WebP, and adds the pack to WhatsApp. From there it appears in your sticker tray.",
  },
  {
    q: "Can I add stickers to WhatsApp Web?",
    a: "You can use and send installed stickers on WhatsApp Web, and WhatsApp Web has a built-in sticker maker that turns an attached photo into a sticker. Managing whole packs — installing, reordering, deleting — is easier on the phone app, where most pack tools live.",
  },
];

export default function HowToAddStickersOnWhatsAppPage() {
  const related = relatedPosts("how-to-add-stickers-on-whatsapp", 3);

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
        name: "Open the sticker tray",
        text: "In any WhatsApp chat, tap the sticker face icon next to the text field to open the sticker tray.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Pick an adding method",
        text: "Use the built-in maker from a photo, a pack app, a shared pack link, or import a downloaded PNG.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Confirm and find it",
        text: "Confirm the add prompt, then find the new pack by swiping through the pack row at the bottom of the tray.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/blog" className="hover:text-violet-500">Guides</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Add Stickers to WhatsApp</span>
      </nav>

      <section className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">WhatsApp</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          How to Add Stickers on WhatsApp
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          Four ways to get stickers into WhatsApp — from a photo, from a pack
          app, from a shared pack link, or from a downloaded PNG — plus where to
          find them and how to fix packs that will not show.
        </p>
        <p className="text-xs text-gray-400">Updated {PUBLISHED} · 6 min read · by StickerSit</p>
      </section>

      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        Making a sticker and adding it to WhatsApp are two different steps, and
        the adding part is where most people get stuck. The good news is that
        WhatsApp now accepts stickers from several sources, so whatever you have
        — a photo, a pack link from a friend, or a downloaded PNG — there is a
        straightforward way to load it into your sticker tray. This guide walks
        through each method and ends with troubleshooting for the most common
        problem: a pack that will not appear.
      </p>

      {/* Where to find stickers */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">First: where your stickers live</h2>
        <p className="text-sm text-gray-600">
          In any chat, tap the <strong>sticker face icon</strong> next to the
          text field, then switch to the sticker tab. Your installed packs sit
          in a row at the bottom — swipe left and right to move between packs,
          and scroll up and down inside a pack. Everything below adds new
          stickers into this tray.
        </p>
      </section>

      {/* Method 1: built-in */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-violet-100 text-violet-700 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</span>
          <h2 className="text-lg font-bold">Add a sticker from a photo (built-in)</h2>
        </div>
        <p className="text-sm text-gray-600">
          WhatsApp&rsquo;s built-in maker turns any photo into a sticker without
          an extra app. It is the fastest path when you already have a clear
          photo.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
            <li>In a chat, tap the attachment (clip) icon.</li>
            <li>Choose <strong>Sticker</strong>, then select a photo.</li>
            <li>WhatsApp removes the background automatically; adjust the crop if needed.</li>
            <li>Send it. It saves to your tray for reuse.</li>
          </ol>
        </div>
      </section>

      {/* Method 2: pack app */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</span>
          <h2 className="text-lg font-bold">Add stickers through a pack app</h2>
        </div>
        <p className="text-sm text-gray-600">
          A pack app is the reliable way to add several stickers at once,
          especially from PNGs you generated or downloaded.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3 text-sm text-gray-600">
          <p>
            <strong>iPhone — Sticker Maker:</strong> create a new pack, add your
            images, tap <strong>Add to WhatsApp</strong>, and confirm the prompt.
            The pack appears in your tray immediately.
          </p>
          <p>
            <strong>Android — Personal Stickers for WhatsApp:</strong> create a
            pack, select your transparent PNG images, and tap{" "}
            <strong>Add to WhatsApp</strong>. Pairs perfectly with AI-generated
            PNGs.
          </p>
        </div>
        <p className="text-sm text-gray-600">
          Both apps handle the 512×512 resize and WebP conversion for you — see
          our <Link href="/blog/whatsapp-sticker-size" className="text-violet-600 hover:underline">sticker size guide</Link> for the exact specs.
        </p>
      </section>

      {/* Method 3: shared pack */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</span>
          <h2 className="text-lg font-bold">Add a pack a friend sent you</h2>
        </div>
        <p className="text-sm text-gray-600">
          When a friend sends a sticker from a pack you do not have, you can
          grab just that sticker or the whole pack.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p>
            <strong>Single sticker:</strong> tap and hold the sticker in the
            chat, then choose <strong>Add sticker</strong>.
          </p>
          <p>
            <strong>Whole pack:</strong> tap and hold a sticker and look for{" "}
            <strong>Add pack</strong>, or open a shared pack link and confirm the
            install.
          </p>
        </div>
      </section>

      {/* Method 4: downloaded PNG */}
      <section className="py-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">4</span>
          <h2 className="text-lg font-bold">Add a downloaded PNG or AI sticker</h2>
        </div>
        <p className="text-sm text-gray-600">
          Generated a sticker online or downloaded one? Save the PNG to your
          device, then import it through a pack app as in Method 2. You can make
          one here and download it now:
        </p>
        <StickerGenerator showGallery={false} />
        <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700">
          <strong>Tip:</strong> The export is already a transparent die-cut PNG,
          so it imports into a pack app with no extra editing. Download it, then
          use Method 2 to load it into WhatsApp.
        </div>
      </section>

      {/* Animated */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Adding animated stickers</h2>
        <p className="text-sm text-gray-600">
          WhatsApp supports animated stickers in APNG or animated WebP. The
          simplest route is a sticker maker app that exports animated stickers
          straight to WhatsApp, or an animated pack installed from a shared
          link. Keep animated stickers under about 500 KB and roughly 10–16 fps
          for smooth playback.
        </p>
      </section>

      {/* Troubleshooting */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Troubleshooting: pack not showing</h2>
        <div className="space-y-3 text-sm">
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Close and reopen the tray.</strong> Packs sometimes need a
            moment to install. Fully close the sticker tray and reopen it.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Re-add from the pack app.</strong> Open the pack app, make
            sure WhatsApp is the selected target, and tap Add to WhatsApp again.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Update WhatsApp.</strong> Older versions occasionally fail to
            register new packs. Update to the latest version from your app store.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Check permissions (Android).</strong> The pack app needs
            permission to talk to WhatsApp. Re-grant permissions in system
            settings if the add silently fails.
          </div>
        </div>
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Adding stickers FAQ</h2>
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
        <h2 className="text-lg font-bold mb-2">Make a sticker, then add it</h2>
        <p className="text-sm text-gray-500 mb-5">Free, no sign up, exports a clean transparent PNG.</p>
        <Link href="/" className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform">
          Start Creating Stickers
        </Link>
      </section>
    </main>
  );
}
