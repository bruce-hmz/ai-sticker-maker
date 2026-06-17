"use client";
import { useEffect, useState } from "react";

interface Match {
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: { ft: [number, number] };
  group?: string;
}

interface Team {
  name: string;
  slug: string;
}

interface Row {
  name: string;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
}

// 从已赛 matches 计算积分榜
function calcStandings(matches: Match[]): Row[] {
  const teams: Record<string, Row> = {};
  for (const m of matches) {
    if (!m.score) continue;
    const [s1, s2] = m.score.ft;
    const a = (teams[m.team1] ??= { name: m.team1, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
    const b = (teams[m.team2] ??= { name: m.team2, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
    a.p++;
    b.p++;
    a.gf += s1;
    a.ga += s2;
    b.gf += s2;
    b.ga += s1;
    if (s1 > s2) {
      a.w++;
      a.pts += 3;
      b.l++;
    } else if (s1 < s2) {
      b.w++;
      b.pts += 3;
      a.l++;
    } else {
      a.d++;
      a.pts++;
      b.d++;
      b.pts++;
    }
  }
  return Object.values(teams).sort(
    (x, y) => y.pts - x.pts || y.gf - y.ga - (x.gf - x.ga) || y.gf - x.gf
  );
}

// 客户端 fetch（绕过 build/server fetch 超时）
export default function GroupScores({
  groupName,
  teams,
}: {
  groupName: string;
  teams: Team[];
}) {
  const [matches, setMatches] = useState<Match[] | null>(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
    )
      .then((r) => r.json())
      .then((d) => {
        const all: Match[] = d.matches || [];
        setMatches(
          all
            .filter((m) => m.group === groupName)
            .sort((a, b) => a.date.localeCompare(b.date))
        );
      })
      .catch(() => setMatches([]));
  }, [groupName]);

  if (!matches)
    return <p className="text-xs text-gray-400 text-center py-4">Loading…</p>;
  if (matches.length === 0) return null;

  const standings = calcStandings(matches);
  const slugFor = (name: string) => teams.find((t) => t.name === name)?.slug;
  const hasResults = matches.some((m) => m.score);

  return (
    <>
      {/* 积分榜 */}
      {hasResults && (
        <section className="py-8">
          <h2 className="text-xl font-bold text-center mb-4">Standings</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Team</th>
                  <th className="p-1">P</th>
                  <th className="p-1">W</th>
                  <th className="p-1">D</th>
                  <th className="p-1">L</th>
                  <th className="p-1">GF:GA</th>
                  <th className="p-1">Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((t, i) => {
                  const slug = slugFor(t.name);
                  return (
                    <tr key={t.name} className="border-t border-gray-100">
                      <td className="p-2 text-gray-400">{i + 1}</td>
                      <td className="p-2 font-medium">
                        {slug ? (
                          <a
                            href={`/world-cup/teams/${slug}`}
                            className="hover:text-violet-600"
                          >
                            {t.name}
                          </a>
                        ) : (
                          t.name
                        )}
                      </td>
                      <td className="p-1 text-center">{t.p}</td>
                      <td className="p-1 text-center">{t.w}</td>
                      <td className="p-1 text-center">{t.d}</td>
                      <td className="p-1 text-center">{t.l}</td>
                      <td className="p-1 text-center text-gray-500">
                        {t.gf}:{t.ga}
                      </td>
                      <td className="p-1 text-center font-bold">{t.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 赛程与比分（未来比赛显示具体时间） */}
      <section className="py-8">
        <h2 className="text-xl font-bold text-center mb-4">
          Matches &amp; Scores
        </h2>
        <div className="space-y-2">
          {matches.map((m, i) => {
            const played = Boolean(m.score);
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between text-sm"
              >
                <div className="w-24 shrink-0">
                  <div className="text-[10px] text-gray-400">{m.date}</div>
                  {!played && m.time && (
                    <div className="text-[9px] text-violet-500 font-medium">
                      {m.time}
                    </div>
                  )}
                </div>
                <span className="flex-1 text-right pr-2 font-medium truncate">
                  {m.team1}
                </span>
                <span className="font-bold px-2 shrink-0">
                  {played
                    ? `${m.score!.ft[0]} - ${m.score!.ft[1]}`
                    : "vs"}
                </span>
                <span className="flex-1 pl-2 font-medium truncate">
                  {m.team2}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-300 text-center mt-3">
          Scores update hourly · data by openfootball
        </p>
      </section>
    </>
  );
}
