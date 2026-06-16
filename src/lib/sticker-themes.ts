export interface StickerTheme {
  slug: string;
  name: string;
  emoji: string;
  promptSuffix: string; // StickerGenerator 预填
  h1: string;
  description: string; // meta description（SEO）
  intro: string; // 页面副标题
  keywords: string[];
  stickers: { file: string; caption: string }[]; // 该主题贴纸（复用 examples/）
  faq: { q: string; a: string }[];
}

// 5 个非世界杯主题页 — 对冲世界杯后流量断崖，抓通用 sticker 长尾
// 复用现有 examples/ 素材，无需新生成
export const STICKER_THEMES: StickerTheme[] = [
  {
    slug: "cute-animals",
    name: "Cute Animal",
    emoji: "🐾",
    promptSuffix: "cute animal kawaii pet, adorable",
    h1: "Cute Animal Sticker Maker",
    description:
      "Make cute animal stickers free — cats, dogs, foxes and kawaii pets. AI cute animal sticker maker for WhatsApp, Telegram and iMessage. No sign up, instant PNG download.",
    intro:
      "Turn your favorite animal into an adorable sticker. Cats, dogs, foxes and kawaii pets — pick a style and generate.",
    keywords: ["cute animal stickers", "kawaii pet sticker", "cute cat sticker maker", "animal sticker maker"],
    stickers: [
      { file: "cute-kawaii-cat.png", caption: "Kawaii Cat" },
      { file: "chibi-dog.png", caption: "Chibi Dog" },
      { file: "hand-drawn-cat.png", caption: "Sketch Cat" },
      { file: "crystal-fox.png", caption: "Crystal Fox" },
    ],
    faq: [
      {
        q: "How to make a cute animal sticker?",
        a: "Type your animal idea — like \"a kawaii orange cat sleeping\" or \"a chibi shiba inu\" — pick a style such as Cute Kawaii or Chibi, and click Generate. In about 30 seconds you get a die-cut PNG sticker of your animal, ready for WhatsApp, Telegram or iMessage. Free and no sign up.",
      },
      {
        q: "What animals work best as cute stickers?",
        a: "Cats, dogs, foxes, rabbits and pandas are fan favorites. The Cute Kawaii style makes any animal adorable with round shapes and pastel colors; Chibi gives a big-head small-body look. Try the same animal in multiple styles and keep your favorite.",
      },
    ],
  },
  {
    slug: "cyberpunk",
    name: "Cyberpunk",
    emoji: "🤖",
    promptSuffix: "cyberpunk neon futuristic sci-fi, glowing lights",
    h1: "Cyberpunk Sticker Maker",
    description:
      "Create cyberpunk stickers free — neon, holographic, futuristic sci-fi designs. AI cyberpunk sticker generator for WhatsApp & Telegram. No sign up, instant download.",
    intro:
      "Neon glow, holographic chrome and dystopian vibes. Generate futuristic cyberpunk stickers for your chats.",
    keywords: ["cyberpunk stickers", "neon sticker maker", "cyberpunk sticker generator", "futuristic stickers"],
    stickers: [
      { file: "cyberpunk-ramen.png", caption: "Cyber Ramen" },
      { file: "cyberpunk-ramen-v2.png", caption: "Neon Ramen" },
      { file: "neon-jellyfish.png", caption: "Neon Jellyfish" },
      { file: "holographic-jellyfish.png", caption: "Holographic Jellyfish" },
    ],
    faq: [
      {
        q: "How to make a cyberpunk sticker?",
        a: "Describe your cyberpunk idea — for example \"a neon ramen bowl in a rainy future city\" or \"a holographic jellyfish\" — and the AI renders it with glowing neon and sci-fi detail. Download the PNG and add it to WhatsApp or Telegram. Free, instant, no sign up.",
      },
      {
        q: "What style is best for cyberpunk stickers?",
        a: "3D Rendered gives the most cinematic cyberpunk look with volumetric neon lighting. Cartoon works for bold, graphic cyberpunk designs. Add keywords like \"neon\", \"holographic\", \"glowing\" and \"futuristic\" to your prompt for stronger results.",
      },
    ],
  },
  {
    slug: "fantasy",
    name: "Fantasy",
    emoji: "🐉",
    promptSuffix: "fantasy magical mythical creature, crystal magic",
    h1: "Fantasy Sticker Maker",
    description:
      "Make fantasy stickers free — dragons, crystal creatures, mythical beasts. AI fantasy sticker maker for WhatsApp & Telegram. Dragons, unicorns, whales and more. No sign up.",
    intro:
      "Dragons, crystal foxes and galactic whales. Bring mythical and magical creatures to life as stickers.",
    keywords: ["fantasy stickers", "dragon sticker maker", "fantasy creature sticker", "mythical stickers"],
    stickers: [
      { file: "crystal-dragon.png", caption: "Crystal Dragon" },
      { file: "crystal-fox.png", caption: "Crystal Fox" },
      { file: "galactic-whale.png", caption: "Galactic Whale" },
    ],
    faq: [
      {
        q: "How to make a fantasy dragon sticker?",
        a: "Describe your dragon — \"a crystal dragon with shimmering blue scales\" or \"a cute chibi fire dragon\" — pick a style like 3D Rendered or Chibi, and generate. You get a die-cut PNG dragon sticker in seconds, free and no sign up.",
      },
      {
        q: "What fantasy creatures can I make?",
        a: "Dragons, unicorns, phoenixes, crystal wolves, galactic whales — anything you can describe. The more vivid your description (colors, elements, mood), the more magical the result. 3D Rendered and Cute Kawaii are the most popular styles for fantasy creatures.",
      },
    ],
  },
  {
    slug: "steampunk",
    name: "Steampunk",
    emoji: "⚙️",
    promptSuffix: "steampunk vintage brass gears clockwork mechanical",
    h1: "Steampunk Sticker Maker",
    description:
      "Create steampunk stickers free — brass gears, vintage clockwork, mechanical designs. AI steampunk sticker maker for WhatsApp & Telegram. No sign up, instant PNG.",
    intro:
      "Brass gears, vintage clockwork and Victorian mechanics. Generate intricate steampunk stickers.",
    keywords: ["steampunk stickers", "steampunk sticker maker", "vintage gear sticker", "clockwork stickers"],
    stickers: [
      { file: "steampunk-heart.png", caption: "Steampunk Heart" },
      { file: "steampunk-owl.png", caption: "Steampunk Owl" },
      { file: "retro-camera.png", caption: "Retro Camera" },
    ],
    faq: [
      {
        q: "How to make a steampunk sticker?",
        a: "Describe your steampunk idea — \"a mechanical owl with brass gears\" or \"a clockwork heart\" — pick a style (3D Rendered gives the richest metallic detail), and generate. Free, instant, no sign up. Works on WhatsApp and Telegram.",
      },
      {
        q: "What makes a good steampunk sticker?",
        a: "Brass and copper tones, visible gears and cogs, Victorian detailing, and warm vintage lighting. Add words like \"brass\", \"clockwork\", \"gears\" and \"vintage\" to your prompt. 3D Rendered and Retro styles capture the steampunk aesthetic best.",
      },
    ],
  },
  {
    slug: "space-galaxy",
    name: "Space & Galaxy",
    emoji: "🌌",
    promptSuffix: "space galaxy cosmic stars planet astronaut, nebula",
    h1: "Space & Galaxy Sticker Maker",
    description:
      "Make space stickers free — galaxies, stars, rockets, astronauts and cosmic creatures. AI space sticker maker for WhatsApp & Telegram. No sign up, instant download.",
    intro:
      "Galaxies, stars, rockets and cosmic creatures. Generate out-of-this-world space stickers.",
    keywords: ["space stickers", "galaxy sticker maker", "astronaut sticker", "cosmic stickers"],
    stickers: [
      { file: "galactic-whale.png", caption: "Galactic Whale" },
      { file: "pixel-art-rocket.png", caption: "Pixel Rocket" },
      { file: "minimalist-star.png", caption: "Minimalist Star" },
      { file: "neon-jellyfish.png", caption: "Neon Jellyfish" },
    ],
    faq: [
      {
        q: "How to make a space sticker?",
        a: "Describe your space idea — \"a cute astronaut floating among stars\" or \"a galactic whale swimming through a nebula\" — pick a style, and generate. You get a die-cut PNG space sticker in seconds. Free, no sign up, works on WhatsApp and Telegram.",
      },
      {
        q: "What space themes are popular?",
        a: "Astronauts, rockets, planets, galaxies and cosmic animals are all popular. Pixel Art gives a retro arcade space vibe, 3D Rendered gives realistic cosmic lighting, and Cute Kawaii turns space objects into adorable characters.",
      },
    ],
  },
];

export function getThemeBySlug(slug: string): StickerTheme | undefined {
  return STICKER_THEMES.find((t) => t.slug === slug);
}
