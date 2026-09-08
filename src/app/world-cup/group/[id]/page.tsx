import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WORLD_CUP_GROUPS, getGroupById } from "@/lib/world-cup-groups";
import { getTeamBySlug } from "@/lib/world-cup-teams";
import GroupScores from "./GroupScores";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return WORLD_CUP_GROUPS.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const g = getGroupById(id);
  if (!g) return { title: "Group Not Found" };
  const teamNames = g.teamSlugs.map((s) => getTeamBySlug(s)?.name).filter(Boolean).join(", ");
  const canonical = `https://stickersit.com/world-cup/group/${g.id}`;
  return {
    title: `World Cup 2026 ${g.name} (${teamNames}) | StickerSit`,
    description: `${g.name} at the 2026 World Cup: ${teamNames}. Make custom stickers for every team in ${g.name}.`,
    alternates: { canonical },
    openGraph: {
      title: `World Cup 2026 ${g.name}`,
      description: `${g.name}: ${teamNames}. Make custom stickers for each team.`,
      url: canonical,
      siteName: "StickerSit",
      type: "website",
    },
  };
}

export default async function GroupPage({ params }: PageProps) {
  const { id } = await params;
  const g = getGroupById(id);
  if (!g) notFound();
  const others = WORLD_CUP_GROUPS.filter((x) => x.id !== g.id);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/world-cup" className="hover:text-violet-500">World Cup</Link>
        <span className="mx-1">/</span>
        <Link href="/world-cup/groups" className="hover:text-violet-500">Groups</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">{g.name}</span>
      </nav>

      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{g.name} — World Cup 2026</h1>
        <p className="text-gray-500 text-sm">4 teams. Make a sticker for each.</p>
      </section>

      {/* 该组 4 队 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {g.teamSlugs.map((slug) => {
          const t = getTeamBySlug(slug);
          if (!t) return null;
          return (
            <Link
              key={slug}
              href={`/world-cup/teams/${slug}`}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <span className="text-4xl block mb-2">{t.flagEmoji}</span>
              <span className="font-bold block">{t.name}</span>
              <span className="text-xs text-gray-400">{t.colors}</span>
            </Link>
          );
        })}
      </div>

      {/* 赛程与比分（client fetch，浏览器实时拉 openfootball） */}
      <GroupScores
        groupName={g.name}
        teams={g.teamSlugs
          .map((slug) => {
            const t = getTeamBySlug(slug);
            return t ? { name: t.name, slug } : null;
          })
          .filter((x): x is { name: string; slug: string } => x !== null)}
      />

      {/* 其他组 */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-center mb-4">Other Groups</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {others.map((o) => (
            <Link
              key={o.id}
              href={`/world-cup/group/${o.id}`}
              className="bg-white rounded-lg p-3 shadow-sm text-center text-xs font-bold text-gray-700 hover:text-violet-600 transition-colors uppercase"
            >
              {o.name.replace("Group ", "")}
            </Link>
          ))}
        </div>
      </section>

      <div className="text-center pt-4">
        <Link
          href="/world-cup/groups"
          className="text-sm text-violet-600 font-semibold hover:text-violet-800"
        >
          ← All Groups
        </Link>
      </div>
    </main>
  );
}
