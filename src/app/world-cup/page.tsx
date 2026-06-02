import type { Metadata } from "next";
import StickerGenerator from "@/components/StickerGenerator";
import AdSenseUnit from "@/components/AdSenseUnit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free World Cup 2026 Sticker Maker for WhatsApp & Telegram | StickerAI",
  description:
    "Create custom FIFA World Cup 2026 stickers for WhatsApp, Telegram, iMessage. Free AI sticker maker — generate football, trophy, team stickers instantly. No app, no sign up.",
  keywords: [
    "World Cup stickers",
    "World Cup 2026 stickers",
    "FIFA World Cup WhatsApp stickers",
    "football sticker maker",
    "soccer sticker maker",
    "World Cup sticker generator",
    "WhatsApp World Cup stickers",
    "Telegram football stickers",
    "free World Cup sticker maker",
  ],
  openGraph: {
    title: "Free World Cup 2026 Sticker Maker for WhatsApp & Telegram",
    description:
      "Create custom World Cup stickers with AI. Free, instant, no sign up. Works with WhatsApp, Telegram, iMessage.",
    type: "website",
    url: "https://stickersit.com/world-cup",
    siteName: "StickerAI",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "StickerAI - Free World Cup 2026 Sticker Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free World Cup 2026 Sticker Maker for WhatsApp & Telegram",
    description:
      "Create custom World Cup stickers with AI. Free, instant, no sign up.",
    images: ["/thumbnail.png"],
  },
  alternates: {
    canonical: "https://stickersit.com/world-cup",
  },
};

const WORLD_CUP_FAQ = [
  {
    q: "How to make World Cup stickers for WhatsApp?",
    a: "Just type your World Cup sticker idea (e.g. 'a cute football with Brazil flag colors'), pick a style like Kawaii or Chibi, and click Generate. Download the PNG and add it to WhatsApp with any sticker pack app.",
  },
  {
    q: "Are these World Cup stickers free?",
    a: "Yes, completely free. No sign up, no app download, no hidden fees. Generate unlimited World Cup 2026 stickers for your chats.",
  },
  {
    q: "Can I make stickers for my favorite World Cup team?",
    a: "Absolutely! Describe your team's colors, flag, or mascot in the prompt. For example: 'a chibi football player wearing Argentina jersey celebrating a goal'.",
  },
  {
    q: "What sticker styles work best for World Cup themes?",
    a: "Chibi and Cartoon styles are great for fun player stickers. 3D Rendered works well for trophies and footballs. Pixel Art gives a retro gaming vibe perfect for match-day excitement.",
  },
  {
    q: "Can I share World Cup stickers on Telegram and Discord?",
    a: "Yes! Download as PNG and they work with Telegram (@Stickers bot), Discord (server upload), iMessage, and any platform that supports custom stickers.",
  },
];

export default function WorldCupPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: WORLD_CUP_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://stickersit.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "World Cup 2026 Stickers",
        item: "https://stickersit.com/world-cup",
      },
    ],
  };

  return (
    <main id="top" className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">World Cup 2026 Stickers</span>
      </nav>

      {/* Hero */}
      <section className="text-center mb-8">
        <p className="text-green-600 text-sm tracking-widest mb-3 font-semibold uppercase">
          ⚽ World Cup 2026
        </p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          Free World Cup 2026
          <br />
          Sticker Maker
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          Create custom FIFA World Cup stickers for WhatsApp, Telegram &amp; more.
        </p>
        <p className="text-green-600 font-semibold text-sm">
          Free &bull; No sign up &bull; No app download
        </p>
      </section>

      {/* Generator */}
      <StickerGenerator promptSuffix="World Cup 2026 FIFA football soccer theme" />

      {/* How It Works */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-3">
          How to Make World Cup Stickers
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          From idea to WhatsApp sticker in 30 seconds
        </p>
        <div className="grid gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start">
            <span className="bg-green-100 text-green-600 font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Describe your World Cup sticker
              </h3>
              <p className="text-sm text-gray-500">
                Try &ldquo;a chibi football player scoring a winning goal&rdquo;
                or &ldquo;a cute football with France flag colors&rdquo;.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start">
            <span className="bg-green-100 text-green-600 font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Pick a style &amp; generate
              </h3>
              <p className="text-sm text-gray-500">
                Chibi for cute players, Cartoon for bold celebrations, 3D for
                trophy stickers. AI generates your sticker in ~30 seconds.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm flex gap-4 items-start">
            <span className="bg-green-100 text-green-600 font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <h3 className="font-semibold text-sm mb-1">
                Download &amp; share in chats
              </h3>
              <p className="text-sm text-gray-500">
                Download as PNG, then add to WhatsApp sticker packs, Telegram,
                iMessage, or Discord. Share the World Cup excitement!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticker Ideas */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-3">
          World Cup Sticker Ideas
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Copy these prompts and generate your own versions
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              prompt: "a chibi football player celebrating a goal with confetti",
              style: "Chibi",
              emoji: "🎉",
            },
            {
              prompt: "a 3D golden World Cup trophy with sparkles",
              style: "3D Rendered",
              emoji: "🏆",
            },
            {
              prompt: "a cute kawaii football wearing a tiny crown",
              style: "Cute Kawaii",
              emoji: "⚽",
            },
            {
              prompt: "a cartoon football fan with face paint waving a flag",
              style: "Cartoon",
              emoji: "🇧🇷",
            },
            {
              prompt: "a pixel art football stadium at night with bright lights",
              style: "Pixel Art",
              emoji: "🏟️",
            },
            {
              prompt: "a retro vintage football with 70s colors",
              style: "Retro",
              emoji: "📻",
            },
            {
              prompt: "a hand-drawn referee blowing a whistle",
              style: "Hand-drawn",
              emoji: "✏️",
            },
            {
              prompt: "a minimalist football with clean single line",
              style: "Minimalist",
              emoji: "◻️",
            },
          ].map((idea) => (
            <div
              key={idea.prompt}
              className="bg-white rounded-xl p-4 shadow-sm text-center"
            >
              <span className="text-3xl block mb-2">{idea.emoji}</span>
              <p className="text-xs text-gray-600 font-medium mb-1">
                {idea.style}
              </p>
              <p className="text-xs text-gray-400">{idea.prompt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ad Unit */}
      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          World Cup Sticker FAQ
        </h2>
        <div className="space-y-3">
          {WORLD_CUP_FAQ.map((item) => (
            <details key={item.q} className="bg-white rounded-2xl p-5 shadow-sm group">
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

      {/* CTA */}
      <section className="py-12 text-center">
        <h2 className="text-xl font-bold mb-3">
          Ready to create your World Cup stickers?
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Free, no sign up, works on any device
        </p>
        <a
          href="#top"
          className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl text-base active:scale-95 transition-transform"
        >
          ⚽ Create World Cup Sticker
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-xs text-gray-300 border-t border-gray-100 mt-8">
        <p className="text-sm font-semibold text-gray-400 mb-1">StickerAI</p>
        <p>
          Free World Cup 2026 Sticker Maker for WhatsApp, Telegram &amp; More
        </p>
        <p className="mt-2">
          <Link href="/" className="text-violet-400 hover:text-violet-600">
            ← Back to StickerAI Home
          </Link>
        </p>
      </footer>
    </main>
  );
}
