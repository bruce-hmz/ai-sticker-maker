import type { Metadata } from "next";
import Link from "next/link";
import { WORLD_CUP_GROUPS } from "@/lib/world-cup-groups";
import { getTeamBySlug } from "@/lib/world-cup-teams";

export const metadata: Metadata = {
  title: "World Cup 2026 Groups — All 12 Groups | StickerAI",
  description:
    "Browse all 12 World Cup 2026 groups and 48 teams. Click any team to make its custom World Cup sticker for WhatsApp & Telegram.",
  alternates: { canonical: "https://stickersit.com/world-cup/groups" },
  openGraph: {
    title: "World Cup 2026 Groups — All 12 Groups",
    description: "Browse all 12 World Cup 2026 groups and 48 teams.",
    url: "https://stickersit.com/world-cup/groups",
    siteName: "StickerAI",
    type: "website",
  },
};

export default function GroupsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/world-cup" className="hover:text-violet-500">World Cup</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Groups</span>
      </nav>

      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">World Cup 2026 Groups</h1>
        <p className="text-gray-500 text-sm">
          All 12 groups, 48 teams. Click any team to make its sticker.
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {WORLD_CUP_GROUPS.map((g) => (
          <div key={g.id} className="bg-white rounded-2xl p-5 shadow-sm">
            <Link
              href={`/world-cup/group/${g.id}`}
              className="font-bold mb-3 block hover:text-violet-600 transition-colors"
            >
              {g.name} →
            </Link>
            <div className="space-y-1.5">
              {g.teamSlugs.map((slug) => {
                const t = getTeamBySlug(slug);
                if (!t) return null;
                return (
                  <Link
                    key={slug}
                    href={`/world-cup/teams/${slug}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-violet-600 transition-colors"
                  >
                    <span>{t.flagEmoji}</span>
                    <span>{t.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/world-cup/knockout"
          className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl text-base active:scale-95 transition-transform"
        >
          🏆 Knockout Stage
        </Link>
      </div>
    </main>
  );
}
