import StickerGenerator from "@/components/StickerGenerator";
import Link from "next/link";
import StartCreatingButton from "@/components/StartCreatingButton";
import AdSenseUnit from "@/components/AdSenseUnit";
import { resolveStickerStyleId, STICKER_STYLES } from "@/lib/sticker-styles";
import { listStickers } from "@/lib/sticker-storage";
import { STICKER_THEMES } from "@/lib/sticker-themes";

const FAQ_ITEMS = [
  {
    q: "Can I make WhatsApp stickers without downloading an app?",
    a: "Yes! StickerAI at stickersit.com is a free web-based tool that works right in your browser — no app download, no installation, and no sign-up needed. Simply visit stickersit.com on any device (iPhone, Android phone, iPad, or computer), type your sticker idea in the text box — for example \"a cute cat wearing sunglasses\" — pick one of 8 artistic styles like Kawaii, Chibi, or Pixel Art, and click Generate. Your custom stickers are created by AI in about 30 seconds and can be downloaded as PNG files directly to your device. Unlike sticker maker apps from the App Store or Google Play, StickerAI requires zero installation and works across all platforms. You can generate unlimited stickers without ever creating an account or entering your email address.",
  },
  {
    q: "How do I add AI stickers to WhatsApp?",
    a: "Adding stickers from StickerAI to WhatsApp is simple and takes under a minute. First, generate your stickers on stickersit.com and download them as PNG images to your phone or computer. On your phone, open WhatsApp and go to any chat. Tap the sticker icon (the square smiley face next to the text input), then tap the \"+\" or \"Add\" button. Select the downloaded PNG files and they will appear in your sticker tray. For the best quality, each sticker should be 512x512 pixels — StickerAI generates them at this optimal size by default. You can also create themed packs of 3 to 12 stickers and import them all at once using third-party sticker pack tools like \"Sticker Maker\" (iOS) or \"Personal Stickers for WhatsApp\" (Android), which let you organize your AI-generated stickers into named collections.",
  },
  {
    q: "Is this AI sticker maker really free?",
    a: "Yes, StickerAI at stickersit.com is completely free with no sign-up, no email required, no credit card needed, and no watermarks on your downloaded stickers. Unlike many sticker maker apps that charge $2-5 for premium styles, limit you to 3 free stickers per day, or add visible watermarks to free downloads, StickerAI generates unlimited stickers at absolutely no cost. You can use all 8 styles — Cute Kawaii, Chibi, Pixel Art, Cartoon, Hand-drawn, 3D Rendered, Minimalist, and Retro/Vintage — without any daily limits, monthly caps, or hidden fees. The tool is supported by non-intrusive advertising, so there are no costs passed on to users. Whether you create 1 sticker or 100 stickers, the price is always $0. No premium tier exists because the entire feature set is free for everyone.",
  },
  {
    q: "What sticker styles are available?",
    a: "StickerAI offers 8 distinct artistic styles, each producing a completely different visual result from the same text prompt. Cute Kawaii creates pastel-colored, adorable stickers with soft shading and rounded shapes — perfect for sweet and gentle expressions. Chibi style gives characters oversized heads and small bodies in a Japanese anime-inspired look. Pixel Art renders your idea in 16-bit retro gaming aesthetics with visible pixels and nostalgic color palettes. Cartoon style produces bold, colorful illustrations with thick outlines — similar to Western animation. Hand-drawn creates a pencil sketch, doodle-style appearance with visible line work. 3D Rendered generates Pixar-quality three-dimensional stickers with realistic lighting and depth. Minimalist strips everything down to clean lines and simple shapes for a modern, elegant look. Retro/Vintage applies aged textures, faded colors, and nostalgic vibes reminiscent of 1970s-80s design. Try the same prompt across multiple styles to discover which artistic treatment best matches your vision.",
  },
  {
    q: "Can I use these stickers for Telegram and iMessage too?",
    a: "Yes! Stickers downloaded from stickersit.com as PNG files work with every major messaging platform that supports custom stickers. For Telegram, open the app and search for the @Stickers bot. Send it your PNG files one by one, give your pack a name and a short title, and it will create a shareable sticker pack that anyone on Telegram can install. For iMessage on iPhone, download a free app called \"Sticker Maker Studio\" from the App Store, import your PNG stickers, and they will appear in your iMessage sticker drawer. For Discord, go to your Server Settings, navigate to Stickers, and upload your PNG files — Discord recommends 320x320 pixels for the best display quality. Because StickerAI exports in the universal PNG format, your stickers are compatible with any messaging app that allows custom sticker imports, including Signal, LINE, and Viber.",
  },
  {
    q: "How do I create a full WhatsApp sticker pack?",
    a: "A great WhatsApp sticker pack needs at least 3 stickers, but we recommend 6-12 for a themed collection that feels complete. The key is consistency: use the same artistic style for all stickers in a pack, and keep the subjects related. For example, create a \"Moods\" pack with \"an excited cat jumping\", \"a sleepy cat napping\", and \"a grumpy cat with crossed arms\" — all in Kawaii style. Generate each sticker individually on stickersit.com, download them as PNG files, and then import them all at once using a sticker pack app like \"Sticker Maker\" (iOS) or \"Personal Stickers for WhatsApp\" (Android). Pro tip: name your pack something memorable and share it with friends via WhatsApp's built-in sticker sharing feature. For seasonal packs (Christmas, birthdays, World Cup), browse our themed pages at stickersit.com for pre-made prompt ideas.",
  },
  {
    q: "What makes a good sticker prompt?",
    a: "The secret to great AI stickers is being specific and descriptive with your prompt. Instead of a vague word like \"cat\", write a full sentence: \"a happy orange tabby cat wearing a birthday party hat with colorful confetti falling around it\". The best prompts include four elements: a subject (who or what), an emotion or expression (happy, surprised, sleepy), accessories or details (sunglasses, crown, cape), and an action or pose (dancing, hugging, waving). Examples of strong prompts: \"a sleepy bulldog wearing a tiny nightcap hugging a pillow\", \"a cute avocado with tiny arms giving a thumbs up\", or \"a chibi astronaut floating in space with stars\". Avoid abstract concepts like \"freedom\" or \"love\" — AI generates better results with concrete, visual descriptions. The more vivid details you provide, the closer the result will match what you imagine. Experiment with different styles for the same prompt to see how Kawaii, Pixel Art, or 3D Rendered change the mood.",
  },
  {
    q: "Do I own the stickers I create?",
    a: "Stickers generated by StickerAI at stickersit.com are created using AI image generation technology. For personal, non-commercial use — sharing with friends on WhatsApp, posting in Telegram groups, using in Discord servers, or sending via iMessage — you are completely free to use, download, and share your stickers without any restrictions. For commercial purposes such as selling stickers on Redbubble or Etsy, using them for business branding, printing on merchandise (T-shirts, mugs, phone cases), or including them in a commercial product, the ownership situation depends on the AI model's terms of service and varies by country and jurisdiction. As a general rule, AI-generated images may not qualify for full copyright protection in many countries. We recommend checking the latest terms of the underlying AI model at pollinations.ai for the most current commercial use guidelines. Personal use is always free and unrestricted.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-white rounded-2xl p-5 shadow-sm group">
      <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center">
        {q}
        <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2">
          ▾
        </span>
      </summary>
      <p className="text-sm text-gray-500 mt-3">{a}</p>
    </details>
  );
}

interface PageProps {
  searchParams: Promise<{ prompt?: string; style?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialPrompt = params.prompt?.trim() ?? "";
  const initialStyle = resolveStickerStyleId(params.style);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://stickersit.com/#organization",
    name: "StickerAI",
    url: "https://stickersit.com",
    logo: "https://stickersit.com/thumbnail.png",
    description:
      "Free AI-powered sticker maker for WhatsApp, Telegram, iMessage, and Discord.",
    sameAs: ["https://x.com/YangDada3983"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://stickersit.com/#website",
    url: "https://stickersit.com",
    name: "StickerAI",
    description: "Free AI WhatsApp Sticker Maker Online",
    publisher: { "@id": "https://stickersit.com/#organization" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": "https://stickersit.com/#webapplication",
    name: "StickerAI",
    url: "https://stickersit.com",
    description:
      "Free AI-powered sticker maker for WhatsApp, Telegram, and iMessage. Create custom stickers online without downloading an app.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    author: { "@id": "https://stickersit.com/#organization" },
    screenshot: "https://stickersit.com/thumbnail.png",
    featureList:
      "AI-powered sticker generation, 8 artistic styles (Kawaii, Chibi, Pixel Art, Cartoon, Hand-drawn, 3D Rendered, Minimalist, Retro), WhatsApp/Telegram/iMessage/Discord export, no sign-up required, unlimited free usage",
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Make WhatsApp Stickers Online Without App",
    description:
      "Create custom AI stickers for WhatsApp without downloading any app. Free and no sign-up required.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Type your sticker idea",
        text: "Describe what you want — 'a happy cat wearing sunglasses' or 'cute coffee cup with heart eyes'. The more specific, the better!",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Pick a style & generate",
        text: "Choose from 8 styles (Kawaii, Chibi, Pixel Art, etc.) and click Generate. AI creates 4 unique sticker variations.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download & add to WhatsApp",
        text: "Download as PNG, then add your custom stickers with your preferred sticker pack tool. It's that easy!",
      },
    ],
  };

  // Fetch latest stickers for social proof
  let latestStickers: { id: string; prompt: string; imageUrl: string; style: string }[] = [];
  try {
    const result = await listStickers({ page: 1, limit: 6 });
    latestStickers = result.stickers.map((s) => ({
      id: s.id,
      prompt: s.prompt,
      imageUrl: s.imageUrl,
      style: s.style,
    }));
  } catch {
    // KV not configured — skip latest stickers
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-block bg-black text-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] mb-6">
          Free AI Sticker Maker
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-[0.9] mb-6 uppercase tracking-tighter">
          AI Sticker
          <br />
          <span className="text-accent">Maker</span>
        </h1>
        <p className="text-gray-500 text-sm mb-2 font-bold uppercase tracking-widest">
          Free AI sticker maker for WhatsApp, Telegram &amp; more.
        </p>
        <p className="text-black font-black text-xs uppercase border-y-2 border-black inline-block py-1 tracking-tight">
          WhatsApp • Telegram • iMessage • Discord
        </p>
        <div className="mt-8">
          <Link href="/stickers" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-accent transition-colors">
            Enter the Gallery →
          </Link>
        </div>
      </section>

      {/* Interactive Tool */}
      <StickerGenerator
        key={`${initialStyle}:${initialPrompt}`}
        initialPrompt={initialPrompt}
        initialStyle={initialStyle}
      />

      {/* Latest Stickers — social proof */}
      {latestStickers.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-sm font-black uppercase tracking-tighter text-black">Recent Output</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Live from the Lab</p>
            </div>
            <Link href="/stickers" className="text-[10px] text-accent font-black uppercase tracking-widest hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {latestStickers.map((s) => (
              <Link
                key={s.id}
                href={`/sticker/${s.id}`}
                className="bg-white rounded-lg overflow-hidden die-cut-static"
              >
                <div className="aspect-square p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.imageUrl}
                    alt={s.prompt}
                    width={512}
                    height={512}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* World Cup 2026 Banner */}
      <Link href="/world-cup" className="block mb-12">
        <div className="bg-black rounded-xl p-6 die-cut-static text-white text-center group">
          <p className="text-[10px] tracking-[0.3em] mb-2 font-black uppercase text-accent">
            ⚽ Limited Edition
          </p>
          <p className="text-2xl font-black mb-1 uppercase tracking-tighter">
            World Cup 2026 Lab
          </p>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
            Start the tournament →
          </p>
        </div>
      </Link>

      {/* Sticker Themes — SEO 内链 + 主题发现 */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-3">Sticker Themes</h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Pick a theme and start creating your own stickers
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {STICKER_THEMES.map((t) => (
            <Link
              key={t.slug}
              href={`/stickers/${t.slug}`}
              className="bg-white rounded-xl p-4 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <span className="text-3xl block mb-1">{t.emoji}</span>
              <span className="text-xs font-bold text-gray-700">{t.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How To Section */}
      <section className="py-16 border-t-2 border-black/5">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-center mb-4">
          The Process
        </h2>
        <p className="text-gray-400 text-center text-[10px] font-black uppercase tracking-[0.2em] mb-12">
          3 Steps to physical stickers
        </p>
        <div className="grid gap-6">
          <div className="bg-white die-cut-static rounded-xl p-8 flex gap-6 items-start">
            <span className="bg-black text-white font-black text-xl w-12 h-12 rounded-lg flex items-center justify-center shrink-0 -rotate-3">
              01
            </span>
            <div>
              <h3 className="font-black uppercase tracking-tight text-lg mb-2 text-black">
                Draft the Idea
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Describe your subject in detail. The Sticker Lab works best with specific prompts like &ldquo;a happy cat wearing sunglasses&rdquo;.
              </p>
            </div>
          </div>
          <div className="bg-white die-cut-static rounded-xl p-8 flex gap-6 items-start">
            <span className="bg-black text-white font-black text-xl w-12 h-12 rounded-lg flex items-center justify-center shrink-0 rotate-3">
              02
            </span>
            <div>
              <h3 className="font-black uppercase tracking-tight text-lg mb-2 text-black">
                Select Visual Engine
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Pick from 8 precision engines (Kawaii, Chibi, Pixel Art, etc.) to set the artistic DNA of your creation.
              </p>
            </div>
          </div>
          <div className="bg-white die-cut-static rounded-xl p-8 flex gap-6 items-start">
            <span className="bg-black text-white font-black text-xl w-12 h-12 rounded-lg flex items-center justify-center shrink-0 -rotate-2">
              03
            </span>
            <div>
              <h3 className="font-black uppercase tracking-tight text-lg mb-2 text-black">
                Export to World
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Download your high-res PNG and import it into WhatsApp, Telegram, or Discord. Instant digital presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Export Guide */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-3">
          Export AI Stickers for WhatsApp and Telegram
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Works everywhere you chat
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white die-cut-static rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-black uppercase tracking-tight text-sm mb-1">WhatsApp</h3>
            <p className="text-[10px] text-gray-500 font-medium">
              Download as PNG and import with a sticker pack tool.
            </p>
          </div>
          <div className="bg-white die-cut-static rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">✈️</div>
            <h3 className="font-black uppercase tracking-tight text-sm mb-1">Telegram</h3>
            <p className="text-[10px] text-gray-500 font-medium">
              Download as PNG. Use @Stickers bot to create a sticker pack.
            </p>
          </div>
          <div className="bg-white die-cut-static rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">🍎</div>
            <h3 className="font-black uppercase tracking-tight text-sm mb-1">iMessage</h3>
            <p className="text-[10px] text-gray-500 font-medium">
              Download as PNG. Use Sticker Maker Studio app to import.
            </p>
          </div>
          <div className="bg-white die-cut-static rounded-xl p-5 text-center">
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="font-black uppercase tracking-tight text-sm mb-1">Discord</h3>
            <p className="text-[10px] text-gray-500 font-medium">
              Upload PNG stickers to your server. 320x320 recommended.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Ad Unit - After FAQ */}
      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* CTA */}
      <section className="py-12 text-center">
        <h2 className="text-xl font-bold mb-3">
          Ready to create your stickers?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Free, no sign up, no app download
        </p>
        <StartCreatingButton />
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-xs text-gray-300 border-t border-gray-100 mt-8">
        <p className="text-sm font-semibold text-gray-400 mb-1">StickerAI</p>
        <p className="mb-3">Free AI Sticker Maker for WhatsApp, Telegram &amp; More</p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link href="/stickers" className="text-gray-400 hover:text-violet-500 transition-colors">Browse Stickers</Link>
          <Link href="/about" className="text-gray-400 hover:text-violet-500 transition-colors">About</Link>
          <Link href="/contact" className="text-gray-400 hover:text-violet-500 transition-colors">Contact</Link>
          <Link href="/privacy" className="text-gray-400 hover:text-violet-500 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-400 hover:text-violet-500 transition-colors">Terms</Link>
          <Link href="/how-to-make-a-sticker-on-iphone" className="text-gray-400 hover:text-violet-500 transition-colors">iPhone Stickers</Link>
          <a
            href="https://x.com/YangDada3983"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-violet-500 transition-colors"
          >
            𝕏 @YangDada3983
          </a>
        </div>
      </footer>
    </main>
  );
}
