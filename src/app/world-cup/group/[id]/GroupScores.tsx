"use client";
import { useEffect, useState } from "react";

interface Match {
  date: string;
  team1: string;
  team2: string;
  score?: { ft: [number, number] };
  group?: string;
}

// 客户端 fetch 比分（绕过 build/server fetch 超时，浏览器运行时直接拉 openfootball）
export default function GroupScores({ groupName }: { groupName: string }) {
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

  if (!matches) {
    return (
      <p className="text-xs text-gray-400 text-center py-4">Loading scores…</p>
    );
  }
  if (matches.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold text-center mb-4">Matches &amp; Scores</h2>
      <div className="space-y-2">
        {matches.map((m, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between text-sm"
          >
            <span className="text-[10px] text-gray-400 w-20 shrink-0">{m.date}</span>
            <span className="flex-1 text-right pr-2 font-medium truncate">{m.team1}</span>
            <span className="font-bold px-2 shrink-0">
              {m.score ? `${m.score.ft[0]} - ${m.score.ft[1]}` : "vs"}
            </span>
            <span className="flex-1 pl-2 font-medium truncate">{m.team2}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-300 text-center mt-3">
        Scores update hourly · data by openfootball
      </p>
    </section>
  );
}
