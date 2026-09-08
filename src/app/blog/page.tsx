import type { Metadata } from "next";
import Link from "next/link";
import { postsByNewest } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Sticker Guides & Tutorials | StickerSit",
  description:
    "In-depth guides on making stickers for WhatsApp, iPhone, Android, and Telegram — sticker sizes and formats, sticker packs, prompt tips, and how AI sticker generators work.",
  alternates: { canonical: "https://stickersit.com/blog" },
  openGraph: {
    title: "Sticker Guides & Tutorials | StickerSit",
    description:
      "In-depth guides on making stickers for WhatsApp, iPhone, Android, and Telegram.",
    url: "https://stickersit.com/blog",
    siteName: "StickerSit",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sticker Guides & Tutorials | StickerSit",
    description:
      "In-depth guides on making stickers for WhatsApp, iPhone, Android, and Telegram.",
  },
};

const SITE = "https://stickersit.com";

export default function BlogIndexPage() {
  const posts = postsByNewest();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}/blog` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "StickerSit Guides & Tutorials",
    description:
      "In-depth guides on making stickers for WhatsApp, iPhone, Android, and Telegram.",
    url: `${SITE}/blog`,
    hasPart: posts.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: `${SITE}${p.path}`,
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Guides</span>
      </nav>

      <section className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-3">
          Guides &amp; Tutorials
        </p>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-3">
          Sticker Guides
        </h1>
        <p className="text-sm text-gray-500 max-w-xl">
          Step-by-step guides for making stickers for WhatsApp, iPhone, Android,
          and Telegram — covering sizes and formats, sticker packs, prompt tips,
          and how AI sticker generators work.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.path}
            className="bg-white rounded-lg p-5 border-2 border-gray-100 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all block"
          >
            <p className="text-[10px] font-black uppercase tracking-tight text-violet-600 mb-2">
              {post.category}
            </p>
            <h2 className="text-base font-bold text-black mb-2">{post.title}</h2>
            <p className="text-sm text-gray-500 line-clamp-3">{post.description}</p>
            <p className="text-xs text-gray-400 mt-3">Read guide →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
