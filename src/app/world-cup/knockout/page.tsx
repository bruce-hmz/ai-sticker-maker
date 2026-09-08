import type { Metadata } from "next";
import Link from "next/link";
import { WORLD_CUP_GROUPS } from "@/lib/world-cup-groups";
import { getTeamBySlug } from "@/lib/world-cup-teams";

export const metadata: Metadata = {
  title: "World Cup 2026 Knockout Stage — Round of 32 | StickerSit",
  description:
    "World Cup 2026 knockout stage format: Round of 32, Round of 16, quarterfinals, semifinals and final. Browse groups and make stickers for every team.",
  alternates: { canonical: "https://stickersit.com/world-cup/knockout" },
  openGraph: {
    title: "World Cup 2026 Knockout Stage",
    description: "Round of 32 to the final. Browse groups and make team stickers.",
    url: "https://stickersit.com/world-cup/knockout",
    siteName: "StickerSit",
    type: "website",
  },
};

const ROUNDS = [
  { name: "Round of 32", desc: "Top 2 from each group (24 teams) + 8 best third-placed teams", teams: 32 },
  { name: "Round of 16", desc: "16 winners from the Round of 32", teams: 16 },
  { name: "Quarterfinals", desc: "8 winners from the Round of 16", teams: 8 },
  { name: "Semifinals", desc: "4 quarterfinal winners", teams: 4 },
  { name: "Final", desc: "2 semifinal winners — World Cup champion", teams: 2 },
];

export default function KnockoutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/world-cup" className="hover:text-violet-500">World Cup</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Knockout</span>
      </nav>

      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">World Cup 2026 Knockout Stage</h1>
        <p className="text-gray-500 text-sm">
          From the Round of 32 to the final — make stickers for every team still in it.
        </p>
      </section>

      {/* 轮次说明 */}
      <section className="mb-10">
        <div className="grid gap-3">
          {ROUNDS.map((r, i) => (
            <div
              key={r.name}
              className="bg-white rounded-2xl p-5 shadow-sm flex gap-4 items-center"
            >
              <span className="bg-green-100 text-green-600 font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-sm">{r.name}</h3>
                <p className="text-xs text-gray-500">{r.desc}</p>
              </div>
              <span className="ml-auto text-2xl font-black text-gray-200">{r.teams}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 12 组入口（看哪队出线）*/}
      <section className="py-8">
        <h2 className="text-2xl font-bold text-center mb-3">Who Advances? — Groups</h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Top 2 from each group reach the Round of 32
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
          {WORLD_CUP_GROUPS.map((g) => (
            <Link
              key={g.id}
              href={`/world-cup/group/${g.id}`}
              className="bg-white rounded-lg p-3 shadow-sm text-center text-xs font-bold text-gray-700 hover:text-violet-600 transition-colors uppercase"
            >
              {g.name.replace("Group ", "")}
            </Link>
          ))}
        </div>
      </section>

      {/* 热门队快捷 */}
      <section className="py-6">
        <h2 className="text-xl font-bold text-center mb-4">Knockout Favorites</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {["brazil", "argentina", "france", "england", "spain", "germany", "portugal", "netherlands"].map((slug) => {
            const t = getTeamBySlug(slug);
            if (!t) return null;
            return (
              <Link
                key={slug}
                href={`/world-cup/teams/${slug}`}
                className="bg-white rounded-lg p-3 shadow-sm text-center hover:shadow-md transition-shadow"
              >
                <span className="text-2xl block mb-1">{t.flagEmoji}</span>
                <span className="text-[10px] font-bold text-gray-700">{t.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="text-center pt-4">
        <Link
          href="/world-cup/groups"
          className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl text-base active:scale-95 transition-transform"
        >
          ⚽ All Groups & Teams
        </Link>
      </div>
    </main>
  );
}
