export interface WorldCupGroup {
  id: string; // "a" - "l"
  name: string; // "Group A"
  teamSlugs: string[]; // 4 队 slug（对应 world-cup-teams.ts）
}

// 2026 世界杯 12 组分组（官方分组）
export const WORLD_CUP_GROUPS: WorldCupGroup[] = [
  { id: "a", name: "Group A", teamSlugs: ["mexico", "south-africa", "south-korea", "czech-republic"] },
  { id: "b", name: "Group B", teamSlugs: ["canada", "bosnia", "qatar", "switzerland"] },
  { id: "c", name: "Group C", teamSlugs: ["brazil", "morocco", "haiti", "scotland"] },
  { id: "d", name: "Group D", teamSlugs: ["usa", "paraguay", "australia", "turkey"] },
  { id: "e", name: "Group E", teamSlugs: ["germany", "curacao", "ivory-coast", "ecuador"] },
  { id: "f", name: "Group F", teamSlugs: ["netherlands", "japan", "sweden", "tunisia"] },
  { id: "g", name: "Group G", teamSlugs: ["belgium", "egypt", "iran", "new-zealand"] },
  { id: "h", name: "Group H", teamSlugs: ["spain", "uruguay", "saudi-arabia", "cape-verde"] },
  { id: "i", name: "Group I", teamSlugs: ["france", "senegal", "norway", "iraq"] },
  { id: "j", name: "Group J", teamSlugs: ["argentina", "algeria", "austria", "jordan"] },
  { id: "k", name: "Group K", teamSlugs: ["portugal", "dr-congo", "uzbekistan", "colombia"] },
  { id: "l", name: "Group L", teamSlugs: ["england", "croatia", "ghana", "panama"] },
];

export function getGroupById(id: string): WorldCupGroup | undefined {
  return WORLD_CUP_GROUPS.find((g) => g.id === id.toLowerCase());
}
