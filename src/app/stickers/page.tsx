import type { Metadata } from "next";
import Link from "next/link";
import { listStickers } from "@/lib/sticker-storage";
import { STICKER_STYLES } from "@/lib/sticker-styles";

export const metadata: Metadata = {
  title: "Browse AI Stickers Gallery | StickerAI",
  description:
    "Browse AI-generated stickers in multiple styles — cute kawaii, chibi, pixel art, cartoon, and more. Download free for WhatsApp, Telegram, iMessage.",
  alternates: { canonical: "https://stickersit.com/stickers" },
  openGraph: {
    title: "Browse AI Stickers Gallery | StickerAI",
    description:
      "Browse thousands of AI-generated stickers. Filter by style, download for free.",
    url: "https://stickersit.com/stickers",
    siteName: "StickerAI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Browse AI Stickers Gallery | StickerAI",
    description:
      "Browse thousands of AI-generated stickers. Filter by style, download for free.",
  },
};

const PER_PAGE = 20;

interface PageProps {
  searchParams: Promise<{ page?: string; style?: string }>;
}

export default async function StickersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const activeStyle = params.style || "";

  const { stickers, hasMore, total } = await listStickers({
    page,
    limit: PER_PAGE,
    style: activeStyle || undefined,
  });

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "AI Stickers Gallery",
      description: "Browse AI-generated stickers in multiple styles",
      url: "https://stickersit.com/stickers",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://stickersit.com" },
        { "@type": "ListItem", position: 2, name: "Stickers" },
      ],
    },
  ];

  function styleLink(styleId: string): string {
    const base = "/stickers";
    if (!styleId) return base;
    return `${base}?style=${styleId}`;
  }

  function pageLink(p: number): string {
    const base = "/stickers";
    const params = new URLSearchParams();
    if (activeStyle) params.set("style", activeStyle);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">Stickers</span>
      </nav>

      <h1 className="text-2xl font-bold mb-2">Browse AI Stickers</h1>
      <p className="text-gray-500 text-sm mb-6">
        {total > 0 ? `${total} stickers created and counting` : "No stickers yet — be the first to create one!"}
      </p>

      {/* Style Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/stickers"
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !activeStyle
              ? "bg-violet-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </Link>
        {STICKER_STYLES.map((s) => (
          <Link
            key={s.id}
            href={styleLink(s.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeStyle === s.id
                ? "bg-violet-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s.emoji} {s.name}
          </Link>
        ))}
      </div>

      {/* Sticker Grid */}
      {stickers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {stickers.map((sticker) => (
            <Link
              key={sticker.id}
              href={`/sticker/${sticker.id}`}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="aspect-square p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sticker.imageUrl}
                  alt={sticker.prompt}
                  width={512}
                  height={512}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-gray-500 px-2 pb-2 truncate">
                {sticker.prompt}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-3">No stickers found</p>
          <Link
            href="/#generator"
            className="text-violet-500 font-semibold hover:text-violet-700"
          >
            Create the first one →
          </Link>
        </div>
      )}

      {/* Pagination */}
      {(page > 1 || hasMore) && (
        <div className="flex justify-center items-center gap-4">
          {page > 1 && (
            <Link
              href={pageLink(page - 1)}
              className="text-sm text-violet-600 font-semibold hover:text-violet-800"
            >
              ← Previous
            </Link>
          )}
          <span className="text-sm text-gray-400">Page {page}</span>
          {hasMore && (
            <Link
              href={pageLink(page + 1)}
              className="text-sm text-violet-600 font-semibold hover:text-violet-800"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
