import type { Metadata } from "next";
import Link from "next/link";
import StickerGenerator from "@/components/StickerGenerator";
import AdSenseUnit from "@/components/AdSenseUnit";
import { relatedPosts } from "@/lib/blog-posts";

const SITE = "https://stickersit.com";
const PATH = "/blog/ai-sticker-generator-how-it-works";
const TITLE = "AI Sticker Generators: How They Work (2026)";
const DESCRIPTION =
  "A plain-language explainer of how AI sticker generators turn text into images — diffusion models, prompts, art styles, transparent die-cut output, and tips for better results.";
const PUBLISHED = "2026-07-06";

export const metadata: Metadata = {
  title: `${TITLE} | StickerSit`,
  description: DESCRIPTION,
  keywords: [
    "ai sticker generator how it works",
    "how ai stickers are made",
    "ai image generation explained",
    "text to sticker ai",
    "diffusion model stickers",
    "how does ai sticker maker work",
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
    q: "How does an AI sticker generator actually work?",
    a: "It uses a diffusion model — an AI trained on millions of image-text pairs. You give it a text prompt, which a text encoder turns into a mathematical guide. The model starts from random visual noise and, step by step, refines it into an image that matches your description. A background-removal pass then cuts out the subject so you get a clean die-cut sticker on a transparent background.",
  },
  {
    q: "Do AI-generated stickers belong to me?",
    a: "For personal use — sharing in chats, sending to friends — you are free to use them. For commercial use (selling on Redbubble or Etsy, printing on merchandise, business branding), the rules depend on the underlying model's terms and your country, since AI images may not qualify for full copyright protection everywhere. Check the model provider's current terms for commercial use.",
  },
  {
    q: "Why did the AI ignore part of my prompt?",
    a: "Models weigh the start of a prompt more heavily and can drop details from long, cluttered ones. Put the subject and the most important detail first, keep the prompt to one or two sentences, and generate a few variations — the model rarely interprets a prompt the same way twice.",
  },
  {
    q: "Why are AI stickers square and 512×512?",
    a: "Because that is the size chat apps expect. The generator produces a square image at a resolution that maps cleanly to WhatsApp, Telegram, and iMessage requirements, so the sticker looks sharp in the app without extra resizing.",
  },
  {
    q: "Are AI stickers free to generate?",
    a: "Many web-based generators, including StickerSit, are free with no sign up. The compute is paid for through ads rather than subscriptions. There may be fair-use limits to keep the service available to everyone.",
  },
  {
    q: "Can AI make animated stickers?",
    a: "Image diffusion produces still images by default. Animated stickers are usually made either by an additional motion model or by exporting a short looping video and converting it to APNG or animated WebP. The result still needs to meet the app's size and frame-rate limits.",
  },
];

export default function AIStickerGeneratorHowItWorksPage() {
  const related = relatedPosts("ai-sticker-generator-how-it-works", 3);

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/blog" className="hover:text-violet-500">Guides</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">How AI Stickers Work</span>
      </nav>

      <section className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">AI</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          How AI Sticker Generators Work
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          A plain-language look at how a few words become a finished sticker —
          the diffusion model behind it, why prompts matter, how the styles and
          transparent die-cut output happen, and how to get better results.
        </p>
        <p className="text-xs text-gray-400">Updated {PUBLISHED} · 7 min read · by StickerSit</p>
      </section>

      <p className="text-sm text-gray-700 leading-relaxed mb-8">
        Type a sentence, tap a button, and thirty seconds later you have a
        sticker. It feels like magic, but the process behind an AI sticker
        generator is a specific, well-understood pipeline: a text encoder reads
        your prompt, a diffusion model turns noise into an image, a style
        controls the look, and a background-removal step cuts out the subject.
        Understanding each stage makes a real difference to the stickers you get
        — so let us walk through them.
      </p>

      {/* Diffusion */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">The core: a diffusion model</h2>
        <p className="text-sm text-gray-600 mb-3">
          Modern AI image tools are built on <strong>diffusion models</strong>.
          During training, a model looks at millions of images paired with text
          descriptions and learns how pixels correspond to words. It also learns
          to do something counterintuitive: add gradual noise to an image until
          it is pure static, then reverse the process.
        </p>
        <p className="text-sm text-gray-600">
          At generation time, the model starts from random noise and &ldquo;denoises&rdquo;
          it step by step, nudged by your prompt toward something that matches
          the description. After dozens of steps, recognizable shapes emerge
          from what started as static. The model is not searching a database of
          existing pictures — it is drawing something new from scratch, guided
          by the patterns it learned.
        </p>
      </section>

      {/* Prompt */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">How your prompt guides the image</h2>
        <p className="text-sm text-gray-600 mb-3">
          Before the model denoises anything, a <strong>text encoder</strong>{" "}
          converts your words into numbers the model can use as a guide. That
          guide is consulted at every step, so the wording of your prompt shapes
          the result more than anything else you control.
        </p>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-600 space-y-2">
          <p><strong>Weak:</strong> &ldquo;cat&rdquo; — too vague; the model picks a random cat.</p>
          <p><strong>Better:</strong> &ldquo;a happy orange cat wearing sunglasses and a party hat&rdquo; — a subject, an expression, and details.</p>
          <p><strong>Strong:</strong> add a color palette and mood (&ldquo;pastel colors, cosy vibe&rdquo;) and the result tightens further.</p>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Models weight the start of a prompt more heavily, so lead with the
          subject. Keep it to one or two sentences — long, cluttered prompts
          cause details to get dropped.
        </p>
      </section>

      {/* Try it */}
      <section className="py-6 space-y-4">
        <h2 className="text-xl font-bold">See it in real time</h2>
        <p className="text-sm text-gray-600">
          The clearest way to understand the prompt-to-image jump is to watch it
          happen. Try a specific prompt below, then change one word and generate
          again — you will see how directly the wording steers the result.
        </p>
        <StickerGenerator showGallery={false} />
      </section>

      {/* Styles */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Where the art styles come from</h2>
        <p className="text-sm text-gray-600 mb-3">
          A style (Kawaii, Chibi, Pixel Art, and so on) is a set of descriptive
          cues applied on top of your prompt — think of it as a consistent lens
          the model looks through. Choosing &ldquo;Pixel Art&rdquo; tells the model to favor
          blocky pixels and limited palettes; &ldquo;3D Rendered&rdquo; pushes it toward
          realistic lighting and materials.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100"><p className="font-bold text-black">Cute Kawaii / Chibi</p><p className="text-gray-500">Pastel, rounded, big eyes — adorable results.</p></div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100"><p className="font-bold text-black">Pixel Art / Retro</p><p className="text-gray-500">16-bit pixels and nostalgic palettes.</p></div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100"><p className="font-bold text-black">3D Rendered</p><p className="text-gray-500">Pixar-like lighting and materials.</p></div>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-100"><p className="font-bold text-black">Cartoon / Hand-drawn</p><p className="text-gray-500">Bold outlines or sketchy doodles.</p></div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Running the same prompt through several styles is the fastest way to
          find the look you want — the subject stays fixed while the aesthetic
          changes completely.
        </p>
      </section>

      {/* Die-cut */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">How the die-cut sticker happens</h2>
        <p className="text-sm text-gray-600">
          A raw AI image is a rectangle with a background. To turn it into a
          sticker, the generator runs <strong>background removal</strong> — a
          model trained to tell foreground from background erases everything
          that is not the subject, leaving a transparent PNG. That transparency
          is what lets the sticker sit cleanly on a chat bubble with no white
          box. The image is also sized to the sticker standard (see our{" "}
          <Link href="/blog/whatsapp-sticker-size" className="text-violet-600 hover:underline">sticker size guide</Link>).
        </p>
      </section>

      {/* Limitations */}
      <section className="py-6">
        <h2 className="text-xl font-bold mb-3">Limitations and tips</h2>
        <div className="space-y-3 text-sm">
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Text inside stickers.</strong> AI models are unreliable at
            spelling. If you need words on a sticker, add them afterwards with an
            image editor rather than relying on the prompt.
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-amber-700">
            <strong>Hands and small details.</strong> Fine structures like
            fingers can come out distorted. Simple, bold subjects read better as
            stickers anyway.
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-green-700">
            <strong>Iterate.</strong> Generate three or four variations of a
            prompt and keep the best. Small wording changes produce very
            different results, so treat the first attempt as a draft.
          </div>
        </div>
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">AI sticker generator FAQ</h2>
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
        <h2 className="text-lg font-bold mb-2">Try the AI sticker generator</h2>
        <p className="text-sm text-gray-500 mb-5">Free, no sign up — describe a sticker and watch it appear.</p>
        <Link href="/" className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform">
          Start Creating Stickers
        </Link>
      </section>
    </main>
  );
}
