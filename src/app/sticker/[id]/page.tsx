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
    <main className="max-w-2xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
        <Link href="/" className="hover:text-black">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/stickers" className="hover:text-black">Catalog</Link>
        <span className="mx-2">/</span>
        <span className="text-black">Unit {sticker.id.slice(0, 8)}</span>
      </nav>

      {/* Sticker Image */}
      <div className="bg-white die-cut-static rounded-xl p-8 text-center mb-12">
        <div className="inline-block max-w-sm mx-auto bg-gray-50 p-6 rounded-lg border-2 border-dashed border-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sticker.imageUrl}
            alt={`AI generated sticker: ${sticker.prompt}`}
            width={512}
            height={512}
            className="w-full h-auto"
          />
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">
            &ldquo;{sticker.prompt}&rdquo;
          </h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Processed by {styleEmoji} <span className="text-black">{styleName}</span> Engine
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <a
            href={sticker.imageUrl}
            download={`sticker-${sticker.id}.png`}
            className="bg-black text-white font-black px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest die-cut"
          >
            Export PNG
          </a>
          <Link
            href={tryUrl}
            className="bg-white text-black border-2 border-black font-black px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
          >
            Fork Prompt
          </Link>
        </div>
      </div>

      {/* Related Stickers */}
      {related.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-sm font-black uppercase tracking-tighter">Related Units</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">More from {styleName} Engine</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((s) => (
              <div
                key={s.id}
                className="group relative bg-white rounded-lg overflow-hidden die-cut-static"
              >
                <Link href={`/sticker/${s.id}`} className="block">
                  <div className="aspect-square p-3 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.imageUrl}
                      alt={s.prompt}
                      width={512}
                      height={512}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>

                {/* Try prompt action */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-white translate-y-full group-hover:translate-y-0 transition-transform border-t-2 border-black">
                  <Link
                    href={`/?prompt=${encodeURIComponent(s.prompt)}&style=${s.style}#generator`}
                    className="block w-full text-center bg-black text-white text-[8px] font-black uppercase tracking-widest py-1.5 rounded-sm hover:bg-accent transition-colors"
                  >
                    Fork
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
