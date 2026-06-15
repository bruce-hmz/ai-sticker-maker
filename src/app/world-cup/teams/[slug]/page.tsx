import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StickerGenerator from "@/components/StickerGenerator";
import StickerMarquee from "@/components/StickerMarquee";
import { WORLD_CUP_TEAMS, getTeamBySlug } from "@/lib/world-cup-teams";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Programmatic SEO：为每支球队预生成独立静态页，抓 "{team} World Cup sticker" 长尾
export async function generateStaticParams() {
  return WORLD_CUP_TEAMS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return { title: "Team Not Found" };

  const title = `${team.name} World Cup 2026 Stickers | StickerAI`;
  const desc = `Create free ${team.name} World Cup 2026 stickers for WhatsApp & Telegram. AI ${team.name} sticker maker — ${team.colors} team themes, instant, no sign up.`;
  const canonical = `https://stickersit.com/world-cup/teams/${team.slug}`;

  return {
    title,
    description: desc,
    alternates: {
      canonical,
      languages: {
        en: canonical,
      },
    },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      siteName: "StickerAI",
      type: "website",
      images:
        team.stickers.length > 0
          ? [
              {
                url: `/examples/world-cup/${team.stickers[0].file}`,
                width: 512,
                height: 512,
                alt: `${team.name} World Cup sticker`,
              },
            ]
          : undefined,
    },
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  const others = WORLD_CUP_TEAMS.filter((t) => t.slug !== team.slug);
  const canonical = `https://stickersit.com/world-cup/teams/${team.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stickersit.com" },
      { "@type": "ListItem", position: 2, name: "World Cup 2026", item: "https://stickersit.com/world-cup" },
      { "@type": "ListItem", position: 3, name: `${team.name} Stickers`, item: canonical },
    ],
  };

  return (
    <main id="top" className="max-w-2xl mx-auto px-4 py-8">
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
        <Link href="/world-cup" className="hover:text-violet-500">
          World Cup
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">{team.name}</span>
      </nav>

      {/* Hero */}
      <section className="text-center mb-8">
        <p className="text-4xl mb-2">{team.flagEmoji}</p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          {team.name} World Cup 2026
          <br />
          Sticker Maker
        </h1>
        <p className="text-gray-500 text-sm">
          Create custom {team.name} stickers ({team.colors}) for WhatsApp,
          Telegram &amp; more.
        </p>
        <p className="text-green-600 font-semibold text-sm mt-1">
          Free &bull; No sign up &bull; No app download
        </p>
      </section>

      {/* Generator — 球队主题预填 */}
      <StickerGenerator
        promptSuffix={`${team.name} ${team.jerseyDesc} ${team.colors} World Cup football soccer theme`}
        showGallery={false}
      />

      {/* 该队贴纸 marquee — 主题强相关轮播 */}
      <StickerMarquee
        stickers={team.stickers.map((s) => ({
          src: `/examples/world-cup/${s.file}`,
          alt: `AI generated ${team.name} ${s.caption} World Cup 2026 sticker`,
          label: `${team.flagEmoji} ${s.caption}`,
        }))}
        title={`${team.name} Sticker Gallery`}
        subtitle={`Real ${team.name} stickers made with our generator`}
      />

      {/* Prompt Ideas */}
      <section className="py-10">
        <h2 className="text-2xl font-bold text-center mb-3">
          {team.name} Sticker Ideas
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Try these prompts in the generator above
        </p>
        <div className="grid grid-cols-1 gap-3">
          {team.promptIdeas.map((idea) => (
            <div
              key={idea}
              className="bg-white rounded-xl p-4 shadow-sm text-sm text-gray-600"
            >
              <span className="mr-2">{team.flagEmoji}</span>
              {idea}
            </div>
          ))}
        </div>
      </section>

      {/* 其他球队内链 — 分散单页权重 + 互链 */}
      <section className="py-10">
        <h2 className="text-2xl font-bold text-center mb-3">
          Other World Cup Teams
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {others.map((t) => (
            <Link
              key={t.slug}
              href={`/world-cup/teams/${t.slug}`}
              className="bg-white rounded-xl p-4 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <span className="text-3xl block mb-1">{t.flagEmoji}</span>
              <span className="text-xs font-medium text-gray-700">{t.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 text-center">
        <Link
          href="/world-cup"
          className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl text-base active:scale-95 transition-transform"
        >
          ⚽ All World Cup Stickers
        </Link>
      </section>
    </main>
  );
}
