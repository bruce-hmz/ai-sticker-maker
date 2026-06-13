"use client";

interface StickerExample {
  src: string;
  prompt: string;
  style: string;
  label: string;
  variant?: "original" | "neon" | "icy" | "gothic" | "golden";
}

const BASE_ASSETS: StickerExample[] = [
  { src: "/promo/pinterest-3d-donut.png", prompt: "a glazed donut with neon glowing sprinkles", style: "3d-rendered", label: "3D Engine" },
  { src: "/promo/pinterest-chibi-panda.png", prompt: "a cute panda wearing a high-tech space suit", style: "chibi", label: "Chibi Engine" },
  { src: "/promo/pinterest-cute-cat.png", prompt: "a majestic white cat with galaxy eyes", style: "cute-kawaii", label: "Kawaii Engine" },
  { src: "/promo/pinterest-cartoon-dog.png", prompt: "a funny bulldog wearing retro sunglasses", style: "cartoon", label: "Cartoon Engine" },
  { src: "/promo/pinterest-3d-planet.png", prompt: "a cute Saturn-like planet with translucent rings", style: "3d-rendered", label: "3D Engine" },
  { src: "/promo/pinterest-chibi-rocket.png", prompt: "a tiny rocket ship with heart-shaped smoke", style: "chibi", label: "Chibi Engine" },
  { src: "/promo/pinterest-cute-coffee.png", prompt: "a happy coffee cup with a warm steam face", style: "cute-kawaii", label: "Kawaii Engine" },
  { src: "/promo/pinterest-handdrawn-moon.png", prompt: "a crescent moon with delicate pencil shading", style: "hand-drawn", label: "Sketch Engine" },
  { src: "/promo/pinterest-retro-phone.png", prompt: "a retro 80s rotary telephone in neon pink", style: "retro", label: "Retro Engine" },
  { src: "/examples/3d-avocado.png", prompt: "a smiling avocado with 3D volumetric lighting", style: "3d-rendered", label: "3D Engine" },
  { src: "/examples/pixel-art-rocket.png", prompt: "a 16-bit retro arcade rocket with clean pixels", style: "pixel-art", label: "Pixel Engine" },
  { src: "/examples/cartoon-coffee.png", prompt: "a bold cartoon coffee cup with expressive eyes", style: "cartoon", label: "Cartoon Engine" },
  { src: "/examples/hand-drawn-cat.png", prompt: "a sleepy minimalist cat on a fluffy cloud", style: "hand-drawn", label: "Sketch Engine" },
  { src: "/examples/chibi-dog.png", prompt: "a cute chibi puppy holding a love heart", style: "chibi", label: "Chibi Engine" },
  { src: "/examples/retro-camera.png", prompt: "a vintage film camera with metallic sheen", style: "retro", label: "Retro Engine" },
  { src: "/examples/minimalist-star.png", prompt: "an elegant minimalist star with glowing edges", style: "minimalist", label: "Logic Engine" },
  { src: "/examples/cute-kawaii-cat.png", prompt: "a soft pastel kawaii cat with rounded shapes", style: "cute-kawaii", label: "Kawaii Engine" },
];

// Generate visual variants to expand variety
const VARIANTS: Record<string, { filter: string; suffix: string; prefix: string }> = {
  original: { filter: "", suffix: "", prefix: "" },
  neon: { filter: "hue-rotate(90deg) saturate(1.5)", suffix: " in synthwave style", prefix: "NEON " },
  icy: { filter: "hue-rotate(180deg) brightness(1.1) saturate(0.8)", suffix: " with frozen crystal texture", prefix: "ICY " },
  golden: { filter: "sepia(1) saturate(3) hue-rotate(-30deg) brightness(0.9)", suffix: " made of solid gold", prefix: "GOLDEN " },
  gothic: { filter: "grayscale(1) contrast(1.2) brightness(0.8)", suffix: " in dark gothic noir style", prefix: "GOTHIC " },
};

export default function ExampleGallery({ onUsePrompt }: { onUsePrompt: (prompt: string, style: string) => void }) {
  // Build 40+ unique visual entries
  const expandedExamples: StickerExample[] = [];
  BASE_ASSETS.forEach((base, i) => {
    const variantKeys = Object.keys(VARIANTS) as (keyof typeof VARIANTS)[];
    const variantKey = variantKeys[i % variantKeys.length];
    const v = VARIANTS[variantKey];
    
    expandedExamples.push({
      ...base,
      prompt: `${v.prefix}${base.prompt}${v.suffix}`,
      variant: variantKey as "original" | "neon" | "icy" | "gothic" | "golden",
    });
  });

  // Split into two streams and repeat for infinite loop
  const stream1 = [...expandedExamples.slice(0, 10), ...expandedExamples.slice(0, 10)];
  const stream2 = [...expandedExamples.slice(10), ...expandedExamples.slice(10)];

  return (
    <section className="py-24 border-t-2 border-black/5 overflow-hidden">
      <div className="text-center mb-16">
        <div className="inline-block border-2 border-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          Visual Database
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Inspiration Flow</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          High-fidelity output from our 40+ laboratory variants
        </p>
      </div>

      <div className="space-y-12">
        {/* Row 1: Left */}
        <div className="relative flex">
          <div className="flex animate-marquee-slow whitespace-nowrap">
            {stream1.map((ex, idx) => (
              <button
                key={`s1-${idx}`}
                onClick={() => onUsePrompt(ex.prompt, ex.style)}
                className="group relative mx-4 w-52 flex-none bg-white die-cut-static rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
              >
                <div className="aspect-square p-6 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ex.src}
                    style={{ filter: VARIANTS[ex.variant || "original"].filter }}
                    alt={ex.prompt}
                    className="w-full h-full object-contain transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                  {ex.variant !== "original" && (
                    <div className="absolute top-2 left-2 bg-black text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
                      {ex.variant}
                    </div>
                  )}
                </div>
                <div className="p-4 border-t-2 border-black/5 bg-white text-left">
                  <p className="text-[9px] font-black text-black uppercase tracking-tight truncate mb-1">
                    {ex.prompt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-accent font-black uppercase tracking-widest">{ex.label}</span>
                    <span className="text-[8px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">FORK</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Right */}
        <div className="relative flex">
          <div className="flex animate-marquee-reverse-slow whitespace-nowrap">
            {stream2.map((ex, idx) => (
              <button
                key={`s2-${idx}`}
                onClick={() => onUsePrompt(ex.prompt, ex.style)}
                className="group relative mx-4 w-52 flex-none bg-white die-cut-static rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
              >
                <div className="aspect-square p-6 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ex.src}
                    style={{ filter: VARIANTS[ex.variant || "original"].filter }}
                    alt={ex.prompt}
                    className="w-full h-full object-contain transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                  {ex.variant !== "original" && (
                    <div className="absolute top-2 left-2 bg-black text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
                      {ex.variant}
                    </div>
                  )}
                </div>
                <div className="p-4 border-t-2 border-black/5 bg-white text-left">
                  <p className="text-[9px] font-black text-black uppercase tracking-tight truncate mb-1">
                    {ex.prompt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-accent font-black uppercase tracking-widest">{ex.label}</span>
                    <span className="text-[8px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">FORK</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.4em] mt-16">
        Click any unit to load the seed configuration
      </p>
    </section>
  );
}
