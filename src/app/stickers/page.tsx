import type { Metadata } from "next";
import Link from "next/link";
import { listStickers } from "@/lib/sticker-storage";
import { STICKER_STYLES } from "@/lib/sticker-styles";
import { STICKER_THEMES } from "@/lib/sticker-themes";

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
      <nav className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
        <Link href="/" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-black">Catalog</span>
      </nav>

      <div className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black mb-2">The Catalog</h1>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          {total > 0 ? `${total} verified creations` : "Lab is currently empty"}
        </p>
      </div>

      {/* 主题快捷入口 */}
      <section className="mb-12">
        <h2 className="text-sm font-black uppercase tracking-tight text-black mb-4">
          Quick Themes
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {STICKER_THEMES.map((t) => (
            <Link
              key={t.slug}
              href={`/stickers/${t.slug}`}
              className="bg-white rounded-lg p-4 border-2 border-gray-100 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-center"
            >
              <span className="text-2xl block mb-1">{t.emoji}</span>
              <span className="text-[10px] font-black uppercase tracking-tight text-gray-700">
                {t.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Style Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          href="/stickers"
          className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            !activeStyle
              ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
          }`}
        >
          All Units
        </Link>
        {STICKER_STYLES.map((s) => (
          <Link
            key={s.id}
            href={styleLink(s.id)}
            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
              activeStyle === s.id
                ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
            }`}
          >
            {s.emoji} {s.name}
          </Link>
        ))}
      </div>

      {/* Sticker Grid */}
      {stickers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-16">
          {stickers.map((sticker) => (
            <div
              key={sticker.id}
              className="group relative bg-white rounded-lg overflow-hidden die-cut-static"
            >
              <Link href={`/sticker/${sticker.id}`} className="block">
                <div className="aspect-square p-4 bg-gray-50">
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
                <div className="p-3 border-t-2 border-black/5">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight truncate">
                    {sticker.prompt}
                  </p>
                </div>
              </Link>
              
              {/* Try prompt overlay/action */}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-white translate-y-full group-hover:translate-y-0 transition-transform border-t-2 border-black">
                <Link
                  href={`/?prompt=${encodeURIComponent(sticker.prompt)}&style=${sticker.style}#generator`}
                  className="block w-full text-center bg-black text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-sm hover:bg-accent transition-colors"
                >
                  Fork Prompt
                </Link>
              </div>
            </div>
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
