export interface StickerStyle {
  id: string;
  name: string;
  emoji: string;
  image: string;
  promptPrefix: string;
  desc: string;
}

export const STICKER_STYLES: StickerStyle[] = [
  {
    id: "cute-kawaii",
    name: "Cute Kawaii",
    emoji: "🌸",
    image: "/examples/cute-kawaii-cat.png",
    desc: "Pastel, adorable, soft",
    promptPrefix:
      "cute kawaii sticker illustration, pastel colors, round shapes, adorable, soft shading, chibi-like, white background, die-cut sticker edges",
  },
  {
    id: "chibi",
    name: "Chibi",
    emoji: "🎀",
    image: "/examples/chibi-dog.png",
    desc: "Big head, cute body",
    promptPrefix:
      "chibi style sticker, big head small body, simple cute design, bold outlines, flat colors, white background, die-cut sticker edges",
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    emoji: "🎮",
    image: "/examples/pixel-art-rocket.png",
    desc: "16-bit retro gaming",
    promptPrefix:
      "pixel art sticker, 16-bit retro game style, clean pixels, vibrant colors, white background, die-cut sticker edges",
  },
  {
    id: "cartoon",
    name: "Cartoon",
    emoji: "🎨",
    image: "/examples/cartoon-coffee.png",
    desc: "Bold, colorful, fun",
    promptPrefix:
      "cartoon sticker, bold outlines, bright flat colors, expressive, comic book style, white background, die-cut sticker edges",
  },
  {
    id: "hand-drawn",
    name: "Hand-drawn",
    emoji: "✏️",
    image: "/examples/hand-drawn-cat.png",
    desc: "Sketch, doodle style",
    promptPrefix:
      "hand-drawn doodle sticker, sketch style, pencil lines, simple cute, minimal color, white background, die-cut sticker edges",
  },
  {
    id: "3d-rendered",
    name: "3D Rendered",
    emoji: "✨",
    image: "/examples/3d-avocado.png",
    desc: "Pixar-like quality",
    promptPrefix:
      "3D rendered sticker, Pixar-like quality, soft volumetric lighting, vibrant saturated colors, smooth surfaces, white background, die-cut sticker edges",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    emoji: "◻️",
    image: "/examples/minimalist-star.png",
    desc: "Clean, modern, simple",
    promptPrefix:
      "minimalist sticker, simple clean design, single color line art, elegant, modern, white background, die-cut sticker edges",
  },
  {
    id: "retro",
    name: "Retro/Vintage",
    emoji: "📻",
    image: "/examples/retro-camera.png",
    desc: "Vintage, nostalgic vibes",
    promptPrefix:
      "retro vintage sticker, 70s 80s aesthetic, warm muted colors, textured, nostalgic, white background, die-cut sticker edges",
  },
];

const DEFAULT_STYLE_ID = STICKER_STYLES[0].id;
const STICKER_STYLE_IDS = new Set(STICKER_STYLES.map((style) => style.id));

export function resolveStickerStyleId(styleId: string | null | undefined): string {
  if (!styleId) return DEFAULT_STYLE_ID;
  return STICKER_STYLE_IDS.has(styleId) ? styleId : DEFAULT_STYLE_ID;
}

const PROMPT_BLOCKLIST = /\b(ignore\s+(previous|prior|above|all)\s*(instructions?|prompts?|rules?)|disregard|override|new\s+instruction|system\s*prompt|you\s+are|act\s+as|pretend|forget)\b/gi;

export function buildPrompt(userPrompt: string, styleId: string): string {
  const resolvedStyleId = resolveStickerStyleId(styleId);
  const style = STICKER_STYLES.find((s) => s.id === resolvedStyleId) ?? STICKER_STYLES[0];
  const prefix = style.promptPrefix;
  const cleaned = userPrompt.replace(PROMPT_BLOCKLIST, "").replace(/,(\s*,)+/g, ",").trim();
  return `${prefix}, ${cleaned}, NO text, NO words, NO letters on the sticker`;
}
