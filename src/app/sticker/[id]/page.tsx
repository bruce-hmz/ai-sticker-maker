import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSticker, getRelatedStickers } from "@/lib/sticker-storage";
import { STICKER_STYLES } from "@/lib/sticker-styles";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sticker = await getSticker(id);
  if (!sticker) return { title: "Sticker Not Found" };

  const styleName =
    STICKER_STYLES.find((s) => s.id === sticker.style)?.name ?? sticker.style;

  return {
    title: `AI Sticker: "${sticker.prompt}" | StickerAI`,
    description: `AI-generated ${styleName} sticker of "${sticker.prompt}". Make your own free sticker at StickerAI.`,
    alternates: {
      canonical: `https://stickersit.com/sticker/${sticker.id}`,
    },
    openGraph: {
      title: `AI Sticker: "${sticker.prompt}"`,
      description: `AI-generated ${styleName} sticker — make your own free at StickerAI`,
      url: `https://stickersit.com/sticker/${sticker.id}`,
      siteName: "StickerAI",
      type: "website",
      images: [
        {
          url: sticker.imageUrl,
          width: 512,
          height: 512,
          alt: `AI sticker of ${sticker.prompt}`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `AI Sticker: "${sticker.prompt}"`,
      description: `AI-generated ${styleName} sticker — make your own free at StickerAI`,
      images: [sticker.imageUrl],
    },
  };
}

export default async function StickerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const sticker = await getSticker(id);

  if (!sticker) notFound();

  const styleName =
    STICKER_STYLES.find((s) => s.id === sticker.style)?.name ?? sticker.style;
  const styleEmoji =
    STICKER_STYLES.find((s) => s.id === sticker.style)?.emoji ?? "🎨";

  const related = await getRelatedStickers(sticker, 4);

  const tryUrl = `/?prompt=${encodeURIComponent(sticker.prompt)}&style=${sticker.style}#generator`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      contentUrl: sticker.imageUrl,
      name: `AI sticker of ${sticker.prompt}`,
      description: `AI-generated ${styleName} style sticker`,
      uploadDate: sticker.createdAt,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://stickersit.com" },
        { "@type": "ListItem", position: 2, name: "Stickers", item: "https://stickersit.com/stickers" },
        { "@type": "ListItem", position: 3, name: sticker.prompt.slice(0, 50) },
      ],
    },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <span className="mx-1.5">›</span>
        <Link href="/stickers" className="hover:text-violet-500">Stickers</Link>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600">{sticker.prompt.slice(0, 40)}{sticker.prompt.length > 40 ? "..." : ""}</span>
      </nav>

      {/* Sticker Image */}
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center mb-6">
        <div className="inline-block max-w-sm mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sticker.imageUrl}
            alt={`AI generated sticker: ${sticker.prompt}`}
            width={512}
            height={512}
            className="w-full rounded-xl"
          />
        </div>

        <h1 className="text-xl font-bold mt-4 mb-1">
          &ldquo;{sticker.prompt}&rdquo;
        </h1>
        <p className="text-gray-500 text-sm">
          {styleEmoji} {styleName} style
        </p>

        <div className="flex gap-3 justify-center mt-5">
          <a
            href={sticker.imageUrl}
            download={`sticker-${sticker.id}.png`}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm active:scale-95 transition-transform"
          >
            Download PNG
          </a>
          <Link
            href={tryUrl}
            className="border border-violet-500 text-violet-600 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-violet-50 transition-colors"
          >
            Try this prompt
          </Link>
        </div>
      </div>

      {/* Related Stickers */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3">
            More {styleName} stickers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((s) => (
              <Link
                key={s.id}
                href={`/sticker/${s.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="aspect-square p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.imageUrl}
                    alt={s.prompt}
                    width={512}
                    height={512}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-500 px-2 pb-2 truncate">
                  {s.prompt}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
