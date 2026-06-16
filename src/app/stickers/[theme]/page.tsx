import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StickerGenerator from "@/components/StickerGenerator";
import StickerMarquee from "@/components/StickerMarquee";
import { STICKER_THEMES, getThemeBySlug } from "@/lib/sticker-themes";

interface PageProps {
  params: Promise<{ theme: string }>;
}

// 静态预生成每个主题页
export async function generateStaticParams() {
  return STICKER_THEMES.map((t) => ({ theme: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { theme } = await params;
  const t = getThemeBySlug(theme);
  if (!t) return { title: "Theme Not Found" };
  const canonical = `https://stickersit.com/stickers/${t.slug}`;
  return {
    title: `${t.h1} | StickerAI`,
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical },
    openGraph: {
      title: t.h1,
      description: t.description,
      url: canonical,
      siteName: "StickerAI",
      type: "website",
    },
  };
}

export default async function ThemePage({ params }: PageProps) {
  const { theme } = await params;
  const t = getThemeBySlug(theme);
  if (!t) notFound();
  const canonical = `https://stickersit.com/stickers/${t.slug}`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stickersit.com" },
      { "@type": "ListItem", position: 2, name: "Stickers", item: "https://stickersit.com/stickers" },
      { "@type": "ListItem", position: 3, name: t.name, item: canonical },
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
        <Link href="/stickers" className="hover:text-violet-500">
          Stickers
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">{t.name}</span>
      </nav>

      {/* Hero */}
      <section className="text-center mb-8">
        <p className="text-4xl mb-2">{t.emoji}</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          {t.h1}
        </h1>
        <p className="text-gray-500 text-sm">{t.intro}</p>
        <p className="text-green-600 font-semibold text-sm mt-1">
          Free &bull; No sign up &bull; No app download
        </p>
      </section>

      {/* Generator — 主题预填，不显示首页 Inspiration Flow */}
      <StickerGenerator promptSuffix={t.promptSuffix} showGallery={false} />

      {/* 该主题贴纸 marquee */}
      <StickerMarquee
        stickers={t.stickers.map((s) => ({
          src: `/examples/${s.file}`,
          alt: `AI generated ${t.name.toLowerCase()} sticker: ${s.caption}`,
          label: s.caption,
        }))}
        title={`${t.name} Sticker Examples`}
        subtitle={`Real ${t.name.toLowerCase()} stickers made with our AI generator`}
      />

      {/* FAQ */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          {t.name} Sticker FAQ
        </h2>
        <div className="space-y-3">
          {t.faq.map((item) => (
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
      <section className="py-10 text-center">
        <Link
          href="/stickers"
          className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl text-base active:scale-95 transition-transform"
        >
          🎨 All Sticker Themes
        </Link>
      </section>
    </main>
  );
}
