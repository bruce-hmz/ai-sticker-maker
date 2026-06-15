export interface WorldCupTeam {
  slug: string;
  name: string;
  flagEmoji: string;
  colors: string; // prompt 用：球队代表色
  jerseyDesc: string; // prompt 用：球衣描述
  stickerFile?: string; // 关联贴纸图（public/examples/world-cup/）
  promptIdeas: string[]; // 推荐贴纸 prompt
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
    stickerFile: "brazil-world-cup-sticker.png",
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
    stickerFile: "argentina-world-cup-sticker.png",
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
    stickerFile: "france-world-cup-sticker.png",
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
    stickerFile: "germany-world-cup-sticker.png",
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
    stickerFile: "england-world-cup-sticker.png",
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
    stickerFile: "usa-world-cup-sticker.png",
    promptIdeas: [
      "a cartoon football with USA stars and stripes flag",
      "a chibi football player in USA jersey",
      "a cute eagle with USA flag colors",
    ],
  },
  {
    slug: "mexico",
    name: "Mexico",
    flagEmoji: "🇲🇽",
    colors: "green, white and red",
    jerseyDesc: "green jersey",
    stickerFile: "mexico-world-cup-sticker.png",
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
    stickerFile: "japan-world-cup-sticker.png",
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
