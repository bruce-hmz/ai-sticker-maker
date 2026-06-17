// 世界杯赛程与比分 — 来源 openfootball/worldcup.json（开放数据，1小时缓存）
export interface WorldCupMatch {
  round: string;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  score?: { ft: [number, number]; ht?: [number, number] };
  group?: string;
  ground?: string;
}

const DATA_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export async function getWorldCupMatches(): Promise<WorldCupMatch[]> {
  try {
    const res = await fetch(DATA_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.matches ?? [];
  } catch {
    return [];
  }
}

export async function getGroupMatches(groupName: string): Promise<WorldCupMatch[]> {
  const all = await getWorldCupMatches();
  return all.filter((m) => m.group === groupName).sort((a, b) => a.date.localeCompare(b.date));
}
