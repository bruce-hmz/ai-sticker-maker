import type { Metadata } from "next";
import StickerGenerator from "@/components/StickerGenerator";
import AdSenseUnit from "@/components/AdSenseUnit";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Make a Sticker on iPhone (3 Free Methods) | StickerAI",
  description:
    "Learn how to make stickers on iPhone — use iOS built-in cutout, AI text-to-sticker, or sticker maker apps. Create custom WhatsApp, iMessage, and Telegram stickers free.",
  keywords: [
    "how to make a sticker on iphone",
    "how to make stickers on iphone",
    "make stickers iphone",
    "iphone sticker maker",
    "create stickers on iphone",
    "custom stickers iphone free",
    "ios sticker maker",
    "imessage sticker maker",
    "whatsapp stickers iphone",
  ],
  openGraph: {
    title: "How to Make a Sticker on iPhone (3 Free Methods)",
    description:
      "Make custom stickers on your iPhone — use iOS built-in, AI generator, or apps. Free, no sign up needed.",
    type: "website",
    url: "https://stickersit.com/how-to-make-a-sticker-on-iphone",
    siteName: "StickerAI",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "How to Make a Sticker on iPhone - StickerAI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Make a Sticker on iPhone (3 Free Methods)",
    description:
      "Make custom stickers on your iPhone — use iOS built-in, AI generator, or apps. Free, no sign up needed.",
    images: ["/thumbnail.png"],
  },
  alternates: {
    canonical: "https://stickersit.com/how-to-make-a-sticker-on-iphone",
  },
};

const FAQ_ITEMS = [
  {
    q: "Can I make stickers on my iPhone without downloading an app?",
    a: "Yes. You have two options that work without installing anything. Option 1: Use iOS 17+'s built-in feature — open Photos, touch and hold a subject, tap \"Add Sticker,\" and it appears in your Messages sticker tray. You can also add effects (Outline, Comic, Puffy, Shiny) and create animated stickers from Live Photos. Option 2: Visit stickersit.com in Safari or Chrome on your iPhone, type a description of the sticker you want (like \"a cute cat wearing sunglasses\"), pick a style, and tap Generate. Your custom AI sticker is ready in about 30 seconds — no app download, no sign up, no cost. Download the PNG and use it in WhatsApp, iMessage, Telegram, or any messaging app.",
  },
  {
    q: "What is the difference between iOS built-in stickers and StickerAI?",
    a: "iOS 17+ lets you \"lift\" subjects from your existing photos and turn them into stickers. This is great for turning your pet or a real object into a sticker, but you need a photo of the thing first. StickerAI works differently — you type a text description (\"a kawaii dinosaur eating pizza\") and the AI generates an original sticker from scratch. You don't need any photo or source image. StickerAI also offers 8 artistic styles (Kawaii, Chibi, Pixel Art, Cartoon, Hand-drawn, 3D Rendered, Minimalist, Retro) that iOS built-in cutouts don't provide. Think of it this way: iOS cutouts are for real photos you already have; StickerAI is for creative stickers from your imagination.",
  },
  {
    q: "How do I add custom stickers to iMessage on iPhone?",
    a: "There are three ways. Method 1: If you're using iOS 17 or later, touch and hold a subject in any photo, tap \"Add Sticker,\" and it's instantly available in your Messages sticker drawer. Method 2: Generate stickers on stickersit.com, download the PNG files, then open the free \"Sticker Maker Studio\" app from the App Store to import them into iMessage. Method 3: Download a third-party sticker keyboard app like \"Sticker Maker\" from the App Store, import your PNG stickers, and they'll appear when you tap the App Store icon next to the text input in Messages. All three methods produce stickers you can use in any iMessage conversation.",
  },
  {
    q: "What size should iPhone stickers be?",
    a: "For iMessage stickers, Apple recommends 300×300 pixels minimum, but 618×618 pixels is optimal for Retina displays. For WhatsApp, the ideal size is 512×512 pixels in WebP or PNG format. StickerAI generates stickers at 512×512 pixels by default, which works great on WhatsApp, Telegram, and Discord. For iMessage, you can use these same 512×512 PNG files — they look sharp on all iPhone models. If you're using the iOS built-in cutout feature, the sticker is automatically sized correctly for Messages.",
  },
  {
    q: "Can I use AI-generated stickers in WhatsApp on my iPhone?",
    a: "Yes! Here's how: generate your stickers on stickersit.com using Safari on your iPhone, download the PNG files to your Camera Roll, then open WhatsApp and go to any chat. Tap the sticker icon (square smiley face) next to the text input, tap \"+\" or \"Add,\" and select your downloaded PNGs. They'll appear in your WhatsApp sticker tray. For organized collections, download a free sticker pack app like \"Personal Stickers for WhatsApp\" from the App Store — it lets you group your AI stickers into named packs of 3-12 stickers that you can share with friends.",
  },
  {
    q: "Which iPhone models support custom stickers?",
    a: "All iPhone models support custom stickers via StickerAI or third-party apps — you just need a web browser (Safari or Chrome) to visit stickersit.com and download PNG files. The iOS 17 built-in \"lift subject from photo\" sticker feature requires an iPhone XS, XR, or newer with iOS 17 or later installed. The A12 Bionic chip or later is needed for the on-device subject detection. However, you don't need iOS 17 to use StickerAI — it works on any iPhone that can run a modern web browser, including older models. The downloaded PNG stickers are compatible with any messaging app on any iPhone.",
  },
  {
    q: "Can I make animated stickers on my iPhone?",
    a: "Yes, with iOS 17+ you can turn Live Photos into animated stickers. Open Photos, find a Live Photo (look for the \"Live\" badge), touch and hold the subject, tap \"Add Sticker,\" then hold the sticker and choose \"Add Effect.\" Toggle the \"Live\" switch on and your sticker will animate when tapped in Messages. Note that animated stickers only work in iMessage — WhatsApp and Telegram require static PNG files. For those platforms, use StickerAI to generate creative static stickers instead.",
  },
  {
    q: "Do iPhone stickers sync to my iPad and Mac?",
    a: "Yes. Stickers created using the iOS built-in cutout feature sync automatically to all devices sharing the same Apple ID via iCloud — including iPad and Mac. This means a sticker you create on your iPhone will appear in Messages on your iPad and Mac. However, stickers downloaded from StickerAI (PNG files) are saved to your Camera Roll and do not auto-sync as stickers — you'll need to add them to each device separately using a sticker pack app or the iOS cutout method.",
  },
];

export default function HowToMakeStickerOnIphonePage() {
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
        name: "How to Make a Sticker on iPhone",
        item: "https://stickersit.com/how-to-make-a-sticker-on-iphone",
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

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Make a Sticker on iPhone",
    description:
      "Three methods to create custom stickers on iPhone: use iOS built-in photo cutout, generate with AI, or use a sticker maker app.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Open StickerAI on your iPhone",
        text: "Open Safari or Chrome on your iPhone and visit stickersit.com. No app download or sign up needed.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Describe your sticker idea",
        text: "Type a description like \"a cute cat wearing sunglasses\" or \"a kawaii dinosaur eating pizza.\" The more specific, the better the result.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Pick a style and generate",
        text: "Choose from 8 styles (Kawaii, Chibi, Pixel Art, etc.) and tap Generate. AI creates your sticker in about 30 seconds.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Download and add to your chats",
        text: "Download the PNG to your iPhone. Add it to WhatsApp, iMessage, Telegram, or any messaging app.",
      },
    ],
  };

  return (
    <main id="top" className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">How to Make a Sticker on iPhone</span>
      </nav>

      {/* Hero */}
      <section className="text-center mb-8">
        <p className="text-violet-500 text-sm tracking-widest mb-3 font-semibold">
          📱 iPhone Sticker Guide
        </p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          How to Make a Sticker
          <br />
          on iPhone
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          3 free methods to create custom stickers on any iPhone
        </p>
        <p className="text-violet-600 font-semibold text-sm">
          Works with WhatsApp, iMessage, Telegram &amp; Discord
        </p>
      </section>

      {/* Method 1: iOS Built-in */}
      <section className="py-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
            1
          </span>
          <h2 className="text-lg font-bold">Use iOS Built-in Sticker Features (iOS 17+)</h2>
        </div>
        <p className="text-sm text-gray-600">
          If your iPhone runs iOS 17 or later, Apple includes several built-in
          ways to create and use stickers — no extra app needed. Here&apos;s
          everything you can do.
        </p>

        {/* 1a. Basic Cutout */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Turn a Photo Subject into a Sticker</h3>
          <p className="text-sm text-gray-600 mb-4">
            The fastest way to make a sticker on iPhone. Works with any photo
            that has a clear subject — your pet, a flower, a coffee cup, a
            friend.
          </p>
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex gap-3 items-start">
              <span className="text-gray-300 shrink-0">Step 1</span>
              <p>Open the <strong className="text-gray-700">Photos</strong> app and find a photo with a clear subject</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gray-300 shrink-0">Step 2</span>
              <p>Touch and hold the subject until a white glow appears around it</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gray-300 shrink-0">Step 3</span>
              <p>Tap <strong className="text-gray-700">&ldquo;Add Sticker&rdquo;</strong> — it saves to your Messages sticker drawer instantly</p>
            </div>
          </div>
        </div>

        {/* 1b. Add Effects */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Add Effects to Your Stickers</h3>
          <p className="text-sm text-gray-600 mb-4">
            iOS lets you apply visual effects to any sticker you&apos;ve created.
            Open Messages, tap <strong>&ldquo;+&rdquo;</strong> →
            <strong> Stickers</strong>, then touch and hold your sticker and
            tap <strong>&ldquo;Add Effect&rdquo;</strong>.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-700">Outline</p>
              <p className="text-xs">Adds a white border around your sticker</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-700">Comic</p>
              <p className="text-xs">Adds a halftone comic-book style</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-700">Puffy</p>
              <p className="text-xs">Gives a puffy, inflated 3D look</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-700">Shiny</p>
              <p className="text-xs">Adds a glossy, reflective shine</p>
            </div>
          </div>
        </div>

        {/* 1c. Live Photo Animated Stickers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Make Animated Stickers from Live Photos</h3>
          <p className="text-sm text-gray-600 mb-4">
            If you have a Live Photo, you can turn it into an animated sticker
            that plays a short video clip when you tap it in Messages.
          </p>
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex gap-3 items-start">
              <span className="text-gray-300 shrink-0">Step 1</span>
              <p>Open <strong className="text-gray-700">Photos</strong> and find a Live Photo (look for the &ldquo;Live&rdquo; badge)</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gray-300 shrink-0">Step 2</span>
              <p>Touch and hold the subject until the animated ripple appears, then release</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gray-300 shrink-0">Step 3</span>
              <p>Tap <strong className="text-gray-700">&ldquo;Add Sticker&rdquo;</strong>, then hold the sticker and tap <strong className="text-gray-700">&ldquo;Add Effect&rdquo;</strong></p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gray-300 shrink-0">Step 4</span>
              <p>Toggle the <strong className="text-gray-700">&ldquo;Live&rdquo;</strong> switch ON — your sticker now animates when tapped</p>
            </div>
          </div>
        </div>

        {/* 1d. Use in Other Apps + Sync */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-sm mb-3">Use Stickers in Other Apps &amp; Sync Across Devices</h3>
          <p className="text-sm text-gray-600 mb-3">
            Your iOS stickers aren&apos;t limited to Messages. You can use them
            in Photos, Notes, Mail, and any app that supports Markup:
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <p>Open an image or document → tap <strong className="text-gray-700">Edit</strong> → tap the <strong className="text-gray-700">Markup</strong> icon (pen) → tap <strong className="text-gray-700">&ldquo;+&rdquo;</strong> → <strong className="text-gray-700">&ldquo;Add Sticker&rdquo;</strong>. Drag to position and pinch to resize.</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-xs text-green-700">
            <strong>iCloud Sync:</strong> Stickers you create on your iPhone automatically sync to your iPad and Mac via iCloud — as long as they share the same Apple ID.
          </div>
        </div>

        {/* Limitation callout */}
        <div className="bg-amber-50 rounded-2xl p-4 text-xs text-amber-700">
          <strong>Limitation of iOS built-in stickers:</strong> They only work with existing photos. You can&apos;t create original sticker designs from your imagination — you need a photo of the thing first. Requires iPhone XS/XR or newer with iOS 17+. For creative stickers from text descriptions, see Method 2 below.
        </div>
      </section>

      {/* Method 2: StickerAI (Hero Method) */}
      <section className="py-4">
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-violet-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-violet-100 text-violet-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              2
            </span>
            <h2 className="text-lg font-bold">
              Generate Original Stickers with AI ✨
              <span className="ml-2 text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full align-middle">
                Recommended
              </span>
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Use StickerAI to create stickers from your imagination — no photo
            needed. Type a description, pick a style, and get a unique AI-generated
            sticker in 30 seconds. Free, no app download, no sign up. Works on any
            iPhone right in Safari.
          </p>
        </div>

        {/* Interactive Tool */}
        <div className="mt-6">
          <StickerGenerator />
        </div>
      </section>

      {/* Method 3: Sticker Maker Apps */}
      <section className="py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gray-100 text-gray-600 font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
              3
            </span>
            <h2 className="text-lg font-bold">Use a Sticker Maker App</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Several free apps on the App Store let you create stickers from photos
            or drawings. These are good for assembling sticker packs from images you
            already have.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>
              <strong className="text-gray-700">Sticker Maker Studio</strong> — Free app for importing PNG images
              into iMessage stickers. Simple and reliable for iPhone users.
            </p>
            <p>
              <strong className="text-gray-700">Sticker.ly</strong> — Large community sticker app. Create and share
              sticker packs for WhatsApp and Telegram. Has a built-in cutout tool.
            </p>
            <p>
              <strong className="text-gray-700">Personal Stickers for WhatsApp</strong> — Import PNG photos directly
              into WhatsApp sticker packs. Free with no watermarks.
            </p>
          </div>
          <div className="mt-4 bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
            <strong>Tip:</strong> Combine methods! Use StickerAI to generate creative stickers from text, then import the downloaded PNGs into any of these apps to organize them into themed sticker packs.
          </div>
        </div>
      </section>

      {/* iPhone Sticker Ideas */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-3">
          iPhone Sticker Ideas to Try
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Type these prompts into the generator above and pick your favorite style
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { prompt: "a cute cat wearing sunglasses on a beach", style: "Cute Kawaii", emoji: "😎" },
            { prompt: "a chibi astronaut floating in space", style: "Chibi", emoji: "🚀" },
            { prompt: "a happy avocado giving a thumbs up", style: "Cartoon", emoji: "🥑" },
            { prompt: "a pixel art game controller with hearts", style: "Pixel Art", emoji: "🎮" },
            { prompt: "a sleepy bulldog hugging a tiny pillow", style: "3D Rendered", emoji: "🐶" },
            { prompt: "a minimalist coffee cup with steam", style: "Minimalist", emoji: "☕" },
            { prompt: "a hand-drawn pizza slice waving hello", style: "Hand-drawn", emoji: "🍕" },
            { prompt: "a retro boombox playing music notes", style: "Retro", emoji: "📻" },
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
          iPhone Sticker FAQ
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

      {/* CTA */}
      <section className="py-12 text-center">
        <h2 className="text-xl font-bold mb-3">
          Ready to create your iPhone stickers?
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Free &bull; No sign up &bull; Works in Safari on any iPhone
        </p>
        <a
          href="#top"
          className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl text-base active:scale-95 transition-transform"
        >
          ✨ Create Sticker Now
        </a>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-xs text-gray-300 border-t border-gray-100 mt-8">
        <p className="text-sm font-semibold text-gray-400 mb-1">StickerAI</p>
        <p className="mb-3">
          Free AI Sticker Maker for iPhone, WhatsApp, Telegram &amp; More
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link href="/" className="text-gray-400 hover:text-violet-500 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-gray-400 hover:text-violet-500 transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-violet-500 transition-colors">
            Contact
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-violet-500 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-violet-500 transition-colors">
            Terms
          </Link>
          <a
            href="https://x.com/YangDada3983"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-violet-500 transition-colors"
          >
            𝕏 @YangDada3983
          </a>
          <a
            href="https://fantasynamegenerator.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-violet-500 transition-colors"
          >
            Fantasy Name Generator
          </a>
        </div>
      </footer>
    </main>
  );
}
