export interface WorldCupTeam {
  slug: string;
  name: string;
  flagEmoji: string;
  colors: string; // prompt 用：球队代表色
  jerseyDesc: string; // prompt 用：球衣描述
  stickers: { file: string; caption: string }[]; // 该队主题贴纸（球队页 marquee，每队7张）
  star?: { file: string; name: string }; // 当家球星卡通（仅 AI 高还原度球队）
  promptIdeas: string[];
}

// 8 个热门球队，覆盖 GSC 高需求市场（南美/欧洲/北美/亚洲）
// slug 用作 URL：/world-cup/teams/{slug}
export const WORLD_CUP_TEAMS: WorldCupTeam[] = [
  {
    slug: "brazil",
    name: "Brazil",
    flagEmoji: "🇧🇷",
    colors: "yellow, green and blue",
    jerseyDesc: "yellow and green jersey",
    stickers: [
      { file: "brazil-world-cup-sticker.png", caption: "Football" },
      { file: "brazil-player-sticker.png", caption: "Player" },
      { file: "brazil-mascot-sticker.png", caption: "Toucan" },
      { file: "brazil-fan-sticker.png", caption: "Fan" },
      { file: "brazil-jersey-sticker.png", caption: "Jersey" },
      { file: "brazil-flag-sticker.png", caption: "Flag" },
      { file: "brazil-champion-sticker.png", caption: "Champion" },
    ],
    star: { file: "star-brazil-sticker.png", name: "Neymar" },
    promptIdeas: [
      "a chibi football player in Brazil yellow jersey celebrating a goal",
      "a cute football wearing Brazil flag as a cape",
      "a kawaii toucan with Brazil flag colors",
    ],
  },
  {
    slug: "argentina",
    name: "Argentina",
    flagEmoji: "🇦🇷",
    colors: "sky blue and white",
    jerseyDesc: "blue and white striped jersey",
    stickers: [
      { file: "argentina-world-cup-sticker.png", caption: "Jersey" },
      { file: "argentina-player-sticker.png", caption: "Player" },
      { file: "argentina-mascot-sticker.png", caption: "Jaguar" },
      { file: "argentina-fan-sticker.png", caption: "Fan" },
      { file: "argentina-jersey-sticker.png", caption: "Jersey" },
      { file: "argentina-flag-sticker.png", caption: "Flag" },
      { file: "argentina-champion-sticker.png", caption: "Champion" },
    ],
    star: { file: "star-argentina-sticker.png", name: "Messi" },
    promptIdeas: [
      "a chibi football player in Argentina blue-white striped jersey",
      "a cute football with Argentina sun emblem from flag",
      "a cartoon fan waving Argentina flag",
    ],
  },
  {
    slug: "france",
    name: "France",
    flagEmoji: "🇫🇷",
    colors: "blue, white and red",
    jerseyDesc: "blue jersey",
    stickers: [
      { file: "france-world-cup-sticker.png", caption: "Football" },
      { file: "france-player-sticker.png", caption: "Player" },
      { file: "france-mascot-sticker.png", caption: "Rooster" },
      { file: "france-fan-sticker.png", caption: "Fan" },
      { file: "france-jersey-sticker.png", caption: "Jersey" },
      { file: "france-flag-sticker.png", caption: "Flag" },
      { file: "france-champion-sticker.png", caption: "Champion" },
    ],
    star: { file: "star-france-sticker.png", name: "Mbappé" },
    promptIdeas: [
      "a chibi football player in France blue jersey",
      "a cute football wearing France tricolor flag as a cape",
      "a cartoon rooster with France flag colors",
    ],
  },
  {
    slug: "germany",
    name: "Germany",
    flagEmoji: "🇩🇪",
    colors: "black, red and gold",
    jerseyDesc: "white jersey",
    stickers: [
      { file: "germany-world-cup-sticker.png", caption: "Jersey" },
      { file: "germany-player-sticker.png", caption: "Player" },
      { file: "germany-mascot-sticker.png", caption: "Eagle" },
      { file: "germany-fan-sticker.png", caption: "Fan" },
      { file: "germany-jersey-sticker.png", caption: "Jersey" },
      { file: "germany-flag-sticker.png", caption: "Flag" },
      { file: "germany-champion-sticker.png", caption: "Champion" },
    ],
    promptIdeas: [
      "a chibi football player in Germany white jersey",
      "a cute football with Germany black-red-gold colors",
      "a cartoon eagle wearing Germany colors",
    ],
  },
  {
    slug: "england",
    name: "England",
    flagEmoji: "🦁",
    colors: "red and white",
    jerseyDesc: "white jersey",
    stickers: [
      { file: "england-world-cup-sticker.png", caption: "Football" },
      { file: "england-player-sticker.png", caption: "Player" },
      { file: "england-mascot-sticker.png", caption: "Lion" },
      { file: "england-fan-sticker.png", caption: "Fan" },
      { file: "england-jersey-sticker.png", caption: "Jersey" },
      { file: "england-flag-sticker.png", caption: "Flag" },
      { file: "england-champion-sticker.png", caption: "Champion" },
    ],
    star: { file: "star-england-sticker.png", name: "Bellingham" },
    promptIdeas: [
      "a chibi football player in England white jersey",
      "a cute football with England Saint George red cross flag",
      "a cartoon lion wearing England flag colors",
    ],
  },
  {
    slug: "usa",
    name: "USA",
    flagEmoji: "🇺🇸",
    colors: "red, white and blue",
    jerseyDesc: "red and white striped jersey",
    stickers: [
      { file: "usa-world-cup-sticker.png", caption: "Football" },
      { file: "usa-player-sticker.png", caption: "Player" },
      { file: "usa-mascot-sticker.png", caption: "Dog" },
      { file: "usa-fan-sticker.png", caption: "Fan" },
      { file: "usa-jersey-sticker.png", caption: "Jersey" },
      { file: "usa-flag-sticker.png", caption: "Flag" },
      { file: "usa-champion-sticker.png", caption: "Champion" },
    ],
    promptIdeas: [
      "a cartoon football with USA stars and stripes flag",
      "a chibi football player in USA jersey",
      "a cute puppy with USA flag colors",
    ],
  },
  {
    slug: "mexico",
    name: "Mexico",
    flagEmoji: "🇲🇽",
    colors: "green, white and red",
    jerseyDesc: "green jersey",
    stickers: [
      { file: "mexico-world-cup-sticker.png", caption: "Football" },
      { file: "mexico-player-sticker.png", caption: "Player" },
      { file: "mexico-mascot-sticker.png", caption: "Chihuahua" },
      { file: "mexico-fan-sticker.png", caption: "Fan" },
      { file: "mexico-jersey-sticker.png", caption: "Jersey" },
      { file: "mexico-flag-sticker.png", caption: "Flag" },
      { file: "mexico-champion-sticker.png", caption: "Champion" },
    ],
    star: { file: "star-mexico-sticker.png", name: "Chicharito" },
    promptIdeas: [
      "a pixel art football with Mexico flag colors",
      "a chibi football player in Mexico green jersey",
      "a cute soccer ball with Mexico eagle emblem",
    ],
  },
  {
    slug: "japan",
    name: "Japan",
    flagEmoji: "🇯🇵",
    colors: "red and white",
    jerseyDesc: "blue jersey",
    stickers: [
      { file: "japan-world-cup-sticker.png", caption: "Samurai" },
      { file: "japan-player-sticker.png", caption: "Player" },
      { file: "japan-mascot-sticker.png", caption: "Crane" },
      { file: "japan-fan-sticker.png", caption: "Fan" },
      { file: "japan-jersey-sticker.png", caption: "Jersey" },
      { file: "japan-flag-sticker.png", caption: "Flag" },
      { file: "japan-champion-sticker.png", caption: "Champion" },
    ],
    promptIdeas: [
      "a kawaii samurai football player with Japan rising sun",
      "a chibi football player in Japan blue jersey",
      "a cute football with Japan red circle flag",
    ],
  },
];

export function getTeamBySlug(slug: string): WorldCupTeam | undefined {
  return WORLD_CUP_TEAMS.find((t) => t.slug === slug);
}

// 各国代表贴纸汇总（球员 + 吉祥物）— 用于 world-cup / es 页轮播，体现"各个国家"
export function getAllTeamShowcaseStickers(): { src: string; alt: string; label: string }[] {
  return WORLD_CUP_TEAMS.flatMap((t) => {
    const player = t.stickers.find((s) => s.caption === "Player");
    const mascot = t.stickers.find((s) => s.file.endsWith("-mascot-sticker.png"));
    return [player, mascot]
      .filter((s): s is { file: string; caption: string } => Boolean(s))
      .map((s) => ({
        src: `/examples/world-cup/${s.file}`,
        alt: `AI generated ${t.name} ${s.caption} World Cup sticker`,
        label: `${t.flagEmoji} ${t.name}`,
      }));
  });
}
