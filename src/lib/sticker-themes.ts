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
      "Turn your favorite animal into an adorable die-cut sticker. Cats, dogs, foxes, rabbits and kawaii pets — describe the look you want, pick an art style, and generate a transparent PNG ready for WhatsApp, Telegram or iMessage in seconds.",
    keywords: ["cute animal stickers", "kawaii pet sticker", "cute cat sticker maker", "animal sticker maker"],
    stickers: [
      { file: "cute-kawaii-cat.png", caption: "Kawaii Cat" },
      { file: "chibi-dog.png", caption: "Chibi Dog" },
      { file: "hand-drawn-cat.png", caption: "Sketch Cat" },
      { file: "crystal-fox.png", caption: "Crystal Fox" },
    ],
    faq: [
      {
        q: "How do I make a cute animal sticker?",
        a: "Type a specific animal idea — for example \"a kawaii orange tabby cat sleeping in a teacup\" or \"a chubby chibi shiba inu\" — then choose a style like Cute Kawaii or Chibi and click Generate. In about 30 seconds you get a die-cut PNG with a transparent background, ready to drop into WhatsApp, Telegram or iMessage. It is free and needs no sign up.",
      },
      {
        q: "What animals work best as cute stickers?",
        a: "Cats, dogs, foxes, rabbits, pandas and capybaras are the consistent favorites. Round, soft-bodied animals read as cuter at small sticker sizes, so styles like Cute Kawaii and Chibi (big head, tiny body) flatter almost any species. For something different, try less obvious animals — a kawaii axolotl, frog or quokka stands out in a chat.",
      },
      {
        q: "Which art style makes animals look cutest?",
        a: "Cute Kawaii is the safest choice: pastel colors, rounded shapes and big sparkling eyes. Chibi exaggerates the head-to-body ratio for a toylike look. 3D Rendered gives a polished Pixar-style pet, while Hand-drawn adds a warm sketchbook feel. Generate the same prompt in two or three styles and keep the one that matches your mood.",
      },
      {
        q: "How do I write a prompt that gets a good result?",
        a: "Name the animal, add an expression or pose, then one or two props. \"A happy corgi wearing a scarf and holding a coffee cup\" beats just \"corgi\". Include colors and mood (sleepy, excited, cosy) and avoid abstract words like \"cute\" alone — concrete details give the AI something specific to render.",
      },
      {
        q: "Can I make a sticker of my own pet?",
        a: "You cannot upload a photo directly here, but you can describe your pet in detail — breed, fur color, markings, expression and a signature pose — and the AI will generate a stylized version in that likeness. For an exact likeness from a photo, pair the result with a sticker maker app that supports photo cutout.",
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
      "Neon glow, holographic chrome and dystopian sci-fi vibes. Describe a futuristic scene or object and the AI renders it with glowing neon, reflective surfaces and cinematic lighting — a die-cut PNG ready for WhatsApp and Telegram.",
    keywords: ["cyberpunk stickers", "neon sticker maker", "cyberpunk sticker generator", "futuristic stickers"],
    stickers: [
      { file: "cyberpunk-ramen.png", caption: "Cyber Ramen" },
      { file: "cyberpunk-ramen-v2.png", caption: "Neon Ramen" },
      { file: "neon-jellyfish.png", caption: "Neon Jellyfish" },
      { file: "holographic-jellyfish.png", caption: "Holographic Jellyfish" },
    ],
    faq: [
      {
        q: "How do I make a cyberpunk sticker?",
        a: "Describe a futuristic idea — \"a neon ramen sign in a rainy night market\" or \"a holographic jellyfish floating over a city\" — and the AI renders it with glowing neon and sci-fi detail. Download the transparent PNG and add it to WhatsApp or Telegram. Free, instant, no sign up.",
      },
      {
        q: "Which art style is best for cyberpunk?",
        a: "3D Rendered gives the most cinematic result with volumetric neon lighting and reflective chrome. Cartoon works for bold, graphic posters, and Pixel Art turns cyberpunk into retro-arcade art. For holographic and metallic surfaces, 3D Rendered reads the most convincing at sticker size.",
      },
      {
        q: "What keywords make cyberpunk prompts pop?",
        a: "Lighting words do the heavy lifting: \"neon\", \"holographic\", \"glowing\", \"chrome\", \"reflections\" and \"rain-soaked streets\". Add a color pair like \"magenta and cyan\" and a vibe word like \"dystopian\" or \"retrofuturistic\". Naming a familiar object (ramen, helmet, cassette, visor) gives the AI something concrete to render.",
      },
      {
        q: "What subjects make good cyberpunk stickers?",
        a: "Everyday objects reimagined with tech work best: a neon ramen bowl, a holographic jellyfish, a robotic owl, a cybernetic cat, a cassette tape with glowing tape. Small, single-subject images read clearly as stickers, so keep the focus on one object rather than a busy cityscape.",
      },
      {
        q: "Will the neon glow show up well at sticker size?",
        a: "Yes, as long as the subject is bold and the background is removed. The die-cut export drops the background automatically so the glowing subject stays crisp. If a result looks muddy, add \"dark background\" and \"bright neon outline\" to the prompt to push more contrast.",
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
      "Dragons, crystal foxes, unicorns and galactic whales. Describe a mythical creature and the AI brings it to life with magical elements and rich detail — a die-cut PNG sticker for WhatsApp, Telegram and iMessage, free with no sign up.",
    keywords: ["fantasy stickers", "dragon sticker maker", "fantasy creature sticker", "mythical stickers"],
    stickers: [
      { file: "crystal-dragon.png", caption: "Crystal Dragon" },
      { file: "crystal-fox.png", caption: "Crystal Fox" },
      { file: "galactic-whale.png", caption: "Galactic Whale" },
    ],
    faq: [
      {
        q: "How do I make a fantasy dragon sticker?",
        a: "Describe your dragon in detail — \"a crystal dragon with shimmering blue scales and gold horns\" or \"a tiny chibi fire dragon roasting a marshmallow\" — choose a style like 3D Rendered or Chibi, and generate. You get a transparent die-cut PNG in seconds, free and no sign up.",
      },
      {
        q: "What fantasy creatures can I make?",
        a: "Anything you can describe: dragons, unicorns, phoenixes, griffins, crystal wolves, galactic whales, forest spirits. The more vivid your description — colors, elements, mood, pose — the more magical the result. Pair a real animal with a magical element (a \"crystal fox\", a \"galactic whale\") for results that feel original.",
      },
      {
        q: "Which style suits fantasy best?",
        a: "3D Rendered gives the most dramatic, collectible look with realistic lighting on scales and crystals. Cute Kawaii softens fierce creatures into adorable companions, and Chibi turns them into toylike figures. For an illustrated storybook feel, try Hand-drawn. Fantasy is one of the few themes where every style produces something usable.",
      },
      {
        q: "How do I make my fantasy sticker feel unique?",
        a: "Combine two elements that do not usually go together — a dragon made of stained glass, a unicorn with a galaxy mane, a phoenix made of autumn leaves. Add a specific color palette and a pose (sleeping, roaring, flying). Avoid generic phrases like \"epic dragon\"; specific materials and actions produce far more distinctive stickers.",
      },
      {
        q: "Are fantasy stickers good for chat reactions?",
        a: "Yes — expressive creatures work well as reactions. A roaring dragon for hype, a sleeping crystal fox for cosy, a galactic whale for awe. Because the export is die-cut, the creature sits cleanly on top of any chat bubble without a background box.",
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
      "Brass gears, vintage clockwork and Victorian mechanics. Describe a steampunk object or creature and the AI renders it with warm brass tones, visible cogs and intricate mechanical detail — a die-cut PNG sticker ready for WhatsApp and Telegram.",
    keywords: ["steampunk stickers", "steampunk sticker maker", "vintage gear sticker", "clockwork stickers"],
    stickers: [
      { file: "steampunk-heart.png", caption: "Steampunk Heart" },
      { file: "steampunk-owl.png", caption: "Steampunk Owl" },
      { file: "retro-camera.png", caption: "Retro Camera" },
    ],
    faq: [
      {
        q: "How do I make a steampunk sticker?",
        a: "Describe your idea — \"a mechanical owl with brass gears and copper feathers\" or \"a clockwork heart with a winding key\" — then pick a style. 3D Rendered gives the richest metallic detail, while Retro adds an aged vintage feel. Generate, download the transparent PNG, and add it to WhatsApp or Telegram. Free, instant, no sign up.",
      },
      {
        q: "What makes a steampunk sticker look right?",
        a: "Brass and copper tones, visible gears and cogs, rivets, leather straps, and warm Victorian lighting. Add words like \"brass\", \"clockwork\", \"gears\", \"copper\" and \"vintage\" to your prompt. A clear single subject reads better at sticker size than a complex machine.",
      },
      {
        q: "Which style is best for steampunk?",
        a: "3D Rendered captures metallic reflections and the physical weight of brass best. Retro leans into sepia and aged textures for a vintage-postcard look, and Cartoon gives a bold illustrated feel. Hand-drawn also works for a sketchbook take on mechanical designs.",
      },
      {
        q: "What subjects make good steampunk stickers?",
        a: "Animals reimagined as machines are the classics: a clockwork owl, a steam-powered cat, a mechanical heart. Everyday objects work too — a brass camera, a geared key, a vintage compass. Keep one focal subject so the gears and detail stay legible at small sizes.",
      },
      {
        q: "How is steampunk different from cyberpunk here?",
        a: "Steampunk is analog and Victorian — brass, steam, gears, warm tones. Cyberpunk is digital and futuristic — neon, chrome, holograms, cool blues and magentas. If your first result looks too modern, add \"Victorian\", \"brass\" and \"clockwork\"; if it looks too old, switch to the cyberpunk theme instead.",
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
      "Galaxies, stars, rockets, astronauts and cosmic creatures. Describe an out-of-this-world idea and the AI renders it with nebula colors, glowing stars and deep-space lighting — a die-cut PNG sticker for WhatsApp, Telegram and iMessage, free with no sign up.",
    keywords: ["space stickers", "galaxy sticker maker", "astronaut sticker", "cosmic stickers"],
    stickers: [
      { file: "galactic-whale.png", caption: "Galactic Whale" },
      { file: "pixel-art-rocket.png", caption: "Pixel Rocket" },
      { file: "minimalist-star.png", caption: "Minimalist Star" },
      { file: "neon-jellyfish.png", caption: "Neon Jellyfish" },
    ],
    faq: [
      {
        q: "How do I make a space sticker?",
        a: "Describe your idea — \"a cute astronaut floating among glowing stars\" or \"a galactic whale swimming through a purple nebula\" — pick a style, and generate. You get a transparent die-cut PNG in seconds. Free, no sign up, works on WhatsApp, Telegram and iMessage.",
      },
      {
        q: "What space subjects are most popular?",
        a: "Astronauts (especially cute or animal astronauts), rockets, planets, moons and cosmic animals like galactic whales or starry cats. Single bold subjects read best at sticker size, so focus on one character or object rather than a full galaxy scene.",
      },
      {
        q: "Which style suits space stickers?",
        a: "3D Rendered gives realistic cosmic lighting and planet textures. Pixel Art turns space into retro arcade art, which pairs perfectly with rockets. Cute Kawaii transforms space objects into adorable characters, and Minimalist delivers clean stars and planets with elegant lines.",
      },
      {
        q: "How do I get vivid nebula colors?",
        a: "Name specific colors and a light source: \"a nebula in magenta, teal and gold\", \"a planet glowing with bioluminescent blue\". Adding \"glowing\", \"bioluminescent\" or \"iridescent\" pushes richer color. A dark implied background plus a bright subject keeps the colors vivid once the background is removed.",
      },
      {
        q: "Do space stickers work as chat reactions?",
        a: "Very well — cosmic imagery is naturally expressive. A star-struck face, a galaxy brain, an astronaut drifting, or a shooting star all map cleanly onto common reactions. The die-cut export means the subject floats on the chat without a background box.",
      },
    ],
  },
  {
    slug: "anime",
    name: "Anime",
    emoji: "🎌",
    promptSuffix: "anime manga style, big expressive eyes, colorful hair",
    h1: "Anime Sticker Maker",
    description:
      "Make anime stickers free — manga girls, chibi heroes, magical characters. AI anime sticker maker for WhatsApp & Telegram. Big eyes, colorful hair, instant PNG. No sign up.",
    intro:
      "Big sparkly eyes, colorful hair and expressive manga vibes. Describe an original anime-style character — hair, eyes, outfit, mood — and the AI renders them as a die-cut sticker PNG for WhatsApp, Telegram and iMessage, free with no sign up.",
    keywords: ["anime stickers", "anime sticker maker", "manga sticker", "chibi anime sticker"],
    stickers: [
      { file: "anime-girl-big-eyes.png", caption: "Anime Girl" },
      { file: "anime-boy-chibi.png", caption: "Chibi Boy" },
      { file: "anime-princess.png", caption: "Princess" },
      { file: "anime-magical-girl.png", caption: "Magical Girl" },
      { file: "anime-warrior-chibi.png", caption: "Warrior" },
      { file: "anime-idol-star.png", caption: "Idol" },
    ],
    faq: [
      {
        q: "How do I make an anime sticker?",
        a: "Describe your character in detail — \"a cute anime girl with big blue eyes, long pink hair and a school uniform\" or \"a chibi anime warrior holding a tiny sword\" — pick a style such as Cute Kawaii or Chibi, and click Generate. In about 30 seconds you get a die-cut PNG anime sticker for WhatsApp, Telegram or iMessage. Free and no sign up.",
      },
      {
        q: "Can I make any anime character?",
        a: "You can make an original anime-style character by describing the look — hair color and style, eye shape, outfit, expression and mood. To evoke a familiar archetype without copying a copyrighted character, describe its features (for example \"spiky blonde hair, blue eyes, orange outfit\") rather than naming the character. The AI produces an original sticker in that style.",
      },
      {
        q: "Which style is best for anime stickers?",
        a: "Cute Kawaii and Chibi are the most popular — big eyes, simplified faces and exaggerated expressions read perfectly at sticker size. 3D Rendered gives a cel-shaded studio look, and Cartoon leans into bold outlines. For reaction stickers, Chibi expressions (happy, angry, star-struck) work especially well.",
      },
      {
        q: "How do I write a prompt for a good anime face?",
        a: "Specify hair (color, length, style), eye color and shape, an expression, and one outfit or accessory. \"A cheerful anime girl with twin-tails, green eyes and a strawberry hairclip, winking\" gives the AI concrete details. Add a mood word (cheerful, sleepy, smug) so the expression lands clearly.",
      },
      {
        q: "Are anime stickers good for packs?",
        a: "Yes — anime characters are ideal for themed packs. Keep one art style across the whole pack and vary the expression or character, for example a \"moods\" pack with happy, angry, sleepy and shocked versions of the same character. Consistent style across 6 to 12 stickers makes a pack feel intentional.",
      },
    ],
  },
  {
    slug: "emoji",
    name: "Emoji",
    emoji: "😎",
    promptSuffix: "emoji face, expressive emotion, sticker",
    h1: "Emoji Sticker Maker",
    description:
      "Make custom emoji stickers free — laughing, heart eyes, cool, sad faces. AI emoji sticker generator for WhatsApp & Telegram. Express any emotion, instant PNG. No sign up.",
    intro:
      "Express any emotion with a custom emoji sticker. Describe the face and feeling — laughing, heart-eyes, cool, star-struck — and the AI renders an expressive die-cut PNG for WhatsApp, Telegram and iMessage, free with no sign up.",
    keywords: ["emoji stickers", "emoji sticker maker", "emoji face sticker", "custom emoji sticker"],
    stickers: [
      { file: "emoji-laughing.png", caption: "Laughing" },
      { file: "emoji-heart-eyes.png", caption: "Heart Eyes" },
      { file: "emoji-cool-sunglasses.png", caption: "Cool" },
      { file: "emoji-sad-puppy.png", caption: "Sad Puppy" },
      { file: "emoji-wink-tongue.png", caption: "Wink" },
      { file: "emoji-star-struck.png", caption: "Star Struck" },
    ],
    faq: [
      {
        q: "How do I make a custom emoji sticker?",
        a: "Describe the emotion and the face — \"a laughing emoji with tears of joy streaming down its cheeks\" or \"a cool emoji wearing sunglasses and a smirk\" — pick a style, and generate. You get a transparent die-cut PNG in seconds. Free, no sign up, works on WhatsApp, Telegram and iMessage.",
      },
      {
        q: "What emotions can I make?",
        a: "Any of them: laughing, crying, love (heart eyes), cool, angry, surprised, sleepy, winking, star-struck, shy, deadpan. The clearer the expression and the feature that conveys it (tears, hearts, sparkles, sweat drop), the better the result reads at sticker size.",
      },
      {
        q: "Which style suits emoji stickers?",
        a: "Cute Kawaii gives soft, adorable pastel faces. Cartoon delivers bold, highly readable expressions with thick outlines — usually the best for reaction stickers. 3D Rendered adds glossy dimension, and Hand-drawn gives a doodled, personal feel. For a reaction pack, pick one style and stick with it.",
      },
      {
        q: "How do I make an emoji pack that covers every reaction?",
        a: "Plan a set of 6 to 12 expressions that map to everyday chat moments: hype, agreement, laughter, confusion, love, facepalm, sleepy, shock. Keep one art style and one face shape across the set so the pack feels unified, then generate each expression individually and bundle them with a sticker maker app.",
      },
      {
        q: "Can I make an emoji of a character or animal?",
        a: "Yes — combine an emotion with a subject, like \"a smug cat face\", \"a star-struck panda\" or \"a crying cactus\". Anthropomorphized objects and animals with a clear expression make distinctive stickers that stand out from the standard yellow emoji everyone already has.",
      },
    ],
  },
];

export function getThemeBySlug(slug: string): StickerTheme | undefined {
  return STICKER_THEMES.find((t) => t.slug === slug);
}
