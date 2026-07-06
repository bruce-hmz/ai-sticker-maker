import type { Metadata } from "next";
import Link from "next/link";
import StickerGenerator from "@/components/StickerGenerator";
import StickerMarquee from "@/components/StickerMarquee";
import AdSenseUnit from "@/components/AdSenseUnit";
import { relatedPosts } from "@/lib/blog-posts";

const SITE = "https://stickersit.com";
const PATH = "/blog/whatsapp-sticker-ideas";
const TITLE = "50+ WhatsApp Sticker Ideas (With Prompts You Can Copy)";
const DESCRIPTION =
  "50+ WhatsApp sticker ideas with copy-ready prompts, grouped by animals, reactions, food, characters, seasons, and work chat — plus the prompt formula that makes them look great.";
const PUBLISHED = "2026-07-06";

export const metadata: Metadata = {
  title: `${TITLE} | StickerAI`,
  description: DESCRIPTION,
  keywords: [
    "whatsapp sticker ideas",
    "sticker prompts",
    "ai sticker prompts",
    "cute sticker ideas",
    "sticker pack ideas",
    "whatsapp sticker inspiration",
  ],
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}${PATH}`,
    siteName: "StickerAI",
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

const IDEA_GROUPS: { heading: string; prompts: string[] }[] = [
  {
    heading: "Animals",
    prompts: [
      "a sleepy orange cat hugging a pillow",
      "a happy shiba inu wagging its tail",
      "a chibi panda munching bamboo",
      "a kawaii fox wearing a flower crown",
      "a chubby hamster holding a tiny heart",
      "a smug cat wearing sunglasses",
      "a bouncing rabbit with oversized ears",
      "a tiny dinosaur roaring cutely",
      "a penguin sliding on its belly",
      "an axolotl waving hello",
    ],
  },
  {
    heading: "Reactions & emotions",
    prompts: [
      "a facepalm cat",
      "a laughing dog with tears of joy",
      "a star-struck face with sparkles",
      "a yawning sleepy bear",
      "an angry red tomato",
      "a thumbs-up cactus",
      "a shocked coffee cup",
      "a smug pug",
      "a crying dumpling",
      "a love-struck bee with heart eyes",
    ],
  },
  {
    heading: "Food",
    prompts: [
      "a coffee cup with heart eyes",
      "a happy ramen bowl steaming",
      "a smiling avocado",
      "a cute donut covered in sprinkles",
      "a sleepy pizza slice",
      "a blushing strawberry",
      "a tiny taco throwing a party",
      "a dumpling giving a warm hug",
    ],
  },
  {
    heading: "Characters",
    prompts: [
      "a chibi astronaut floating in space",
      "a kawaii knight with a tiny sword",
      "a wizard cat casting a sparkly spell",
      "a friendly robot waving hello",
      "a mermaid holding a starfish",
      "a ninja cookie mid-jump",
      "a fairy with glittering wings",
      "a pirate puppy with a tiny hat",
    ],
  },
  {
    heading: "Seasonal & special",
    prompts: [
      "a birthday cat in a party hat with confetti",
      "a Christmas tree with a smiling star",
      "a grinning Halloween pumpkin",
      "a soccer ball with a hype face",
      "a New Year champagne glass cheering",
      "a Valentine love letter bursting with hearts",
      "a summer watermelon wearing sunglasses",
      "a graduation owl holding a diploma",
    ],
  },
  {
    heading: "Work & chat",
    prompts: [
      "a coffee-fueled owl typing fast",
      "a cat shaking its head saying no",
      "a cat with a lightbulb idea",
      "a panic hamster running on a wheel",
      "a slow snail saying be right back",
      "a thumbs-up frog",
      "a confused dog with a question mark",
      "a raccoon going in for a high-five",
    ],
  },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "How do I turn these ideas into WhatsApp stickers?",
    a: "Copy a prompt into an AI sticker generator, pick a style, generate, and download the PNG. Then load it into a sticker pack app (Sticker Maker on iPhone, Personal Stickers for WhatsApp on Android) and add the pack to WhatsApp. Our how-to-make-stickers-for-whatsapp guide walks through the full flow.",
  },
  {
    q: "Which art style should I pick?",
    a: "Cute Kawaii and Chibi are the most popular for reaction and animal stickers — big eyes and rounded shapes read well at small sizes. Pixel Art suits retro gaming vibes, 3D Rendered gives a polished look, and Cartoon works for bold expressive faces. Pick one style and keep it across a whole pack for consistency.",
  },
  {
    q: "What makes a good sticker prompt?",
    a: "Name a subject, add an expression or pose, then one or two details. 'A sleepy orange cat hugging a pillow' beats 'cat'. Concrete nouns and visible actions give the AI something specific to render; abstract words like 'cool' or 'nice' are too vague.",
  },
  {
    q: "How many stickers should I make for a pack?",
    a: "A pack needs at least 3 and holds up to 30. Aim for 6 to 12 stickers that share one theme and one art style — for example a full set of reactions (happy, angry, sleepy, shocked) or a themed animal collection. See our sticker pack guide for the rules.",
  },
  {
    q: "Can I edit these prompts?",
    a: "Yes — they are starting points. Swap the animal, change the expression, add a color or accessory, or combine two ideas. Small edits produce very different stickers, so experiment and keep the versions you like.",
  },
];

export default function WhatsAppStickerIdeasPage() {
  const related = relatedPosts("whatsapp-sticker-ideas", 3);
  const totalIdeas = IDEA_GROUPS.reduce((n, g) => n + g.prompts.length, 0);

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
    author: { "@type": "Organization", name: "StickerAI", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "StickerAI",
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

  const showcase = [
    { src: "/examples/cute-kawaii-cat.png", alt: "kawaii cat sticker", label: "Kawaii Cat" },
    { src: "/examples/chibi-dog.png", alt: "chibi dog sticker", label: "Chibi Dog" },
    { src: "/examples/anime-girl-big-eyes.png", alt: "anime girl sticker", label: "Anime Girl" },
    { src: "/examples/emoji-laughing.png", alt: "laughing emoji sticker", label: "Laughing" },
    { src: "/examples/cyberpunk-ramen.png", alt: "cyberpunk ramen sticker", label: "Cyber Ramen" },
    { src: "/examples/crystal-dragon.png", alt: "crystal dragon sticker", label: "Crystal Dragon" },
  ];

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
        <span className="text-gray-600">Sticker Ideas</span>
      </nav>

      <section className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">WhatsApp</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          {totalIdeas}+ WhatsApp Sticker Ideas
        </h1>
        <p className="text-gray-500 text-sm mb-3">
          Copy-ready prompts for animals, reactions, food, characters, seasons,
          and work chat — plus the formula behind a prompt that produces great
          stickers.
        </p>
        <p className="text-xs text-gray-400">Updated {PUBLISHED} · 6 min read · by StickerAI</p>
      </section>

      <p className="text-sm text-gray-700 leading-relaxed mb-6">
        The hardest part of making a sticker is often thinking of what to make.
        This page gives you {totalIdeas}+ specific ideas, each written as a
        ready-to-paste prompt. Copy one into the generator below, pick a style,
        and you have a sticker in seconds. Mix, edit, and combine them — the
        prompts are starting points, not fixed recipes.
      </p>

      <StickerMarquee
        stickers={showcase}
        title="Stickers made from prompts like these"
        subtitle="Real AI-generated examples from our gallery"
      />

      {/* Prompt formula */}
      <section className="py-8">
        <h2 className="text-xl font-bold mb-3">The prompt formula</h2>
        <div className="bg-blue-50 rounded-2xl p-5 text-sm text-blue-700 mb-3">
          <strong>Subject + expression/pose + one or two details (+ color or mood)</strong>
        </div>
        <p className="text-sm text-gray-600">
          &ldquo;A sleepy orange cat hugging a pillow&rdquo; works because it has a subject
          (cat), an expression (sleepy), and details (orange, hugging a pillow).
          Concrete, visual words beat abstract ones — &ldquo;cozy&rdquo; is fine as a mood
          hint, but the cat, the pillow, and the action are what the AI actually
          draws.
        </p>
      </section>

      {/* Idea groups */}
      {IDEA_GROUPS.map((group) => (
        <section key={group.heading} className="py-6">
          <h2 className="text-lg font-bold mb-4">{group.heading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {group.prompts.map((p) => (
              <div
                key={p}
                className="bg-white rounded-lg p-3 border border-gray-100 text-sm text-gray-600"
              >
                {p}
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Try it */}
      <section className="py-8 space-y-4">
        <h2 className="text-xl font-bold">Try any prompt now</h2>
        <p className="text-sm text-gray-600">
          Paste an idea above into the generator, or write your own. Generate the
          same prompt in a couple of styles to see which you like best.
        </p>
        <StickerGenerator showGallery={false} />
      </section>

      <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_CONTENT ?? ""} />

      {/* FAQ */}
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">Sticker ideas FAQ</h2>
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
        <h2 className="text-lg font-bold mb-2">Ready to make your own?</h2>
        <p className="text-sm text-gray-500 mb-5">Free, no sign up — turn any idea into a sticker.</p>
        <Link href="/" className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform">
          Start Creating Stickers
        </Link>
      </section>
    </main>
  );
}
