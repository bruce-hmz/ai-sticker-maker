"use client";

const EXAMPLES = [
  { src: "/promo/pinterest-3d-donut.png", prompt: "a glazed donut with colorful sprinkles", style: "3d-rendered", label: "3D" },
  { src: "/promo/pinterest-chibi-panda.png", prompt: "a cute panda eating bamboo", style: "chibi", label: "Chibi" },
  { src: "/promo/pinterest-cute-cat.png", prompt: "a kawaii white cat with big eyes", style: "cute-kawaii", label: "Kawaii" },
  { src: "/promo/pinterest-cartoon-dog.png", prompt: "a funny cartoon bulldog", style: "cartoon", label: "Cartoon" },
  { src: "/promo/pinterest-3d-planet.png", prompt: "a cute Saturn-like planet with rings", style: "3d-rendered", label: "3D" },
  { src: "/promo/pinterest-chibi-rocket.png", prompt: "a tiny chibi space rocket", style: "chibi", label: "Chibi" },
  { src: "/promo/pinterest-cute-coffee.png", prompt: "a happy coffee cup with a face", style: "cute-kawaii", label: "Kawaii" },
  { src: "/promo/pinterest-handdrawn-moon.png", prompt: "a hand-drawn crescent moon with stars", style: "hand-drawn", label: "Sketch" },
  { src: "/promo/pinterest-retro-phone.png", prompt: "a retro 80s rotary telephone", style: "retro", label: "Retro" },
  // Add original examples to increase variety
  { src: "/examples/3d-avocado.png", prompt: "a smiling avocado with tiny arms", style: "3d-rendered", label: "3D" },
  { src: "/examples/pixel-art-rocket.png", prompt: "a 16-bit pixel art space rocket", style: "pixel-art", label: "Pixel" },
  { src: "/examples/cartoon-coffee.png", prompt: "a happy coffee cup with heart eyes", style: "cartoon", label: "Cartoon" },
];

export default function ExampleGallery({ onUsePrompt }: { onUsePrompt: (prompt: string, style: string) => void }) {
  // Duplicate list for infinite loop effect
  const marqueeItems = [...EXAMPLES, ...EXAMPLES];

  return (
    <section className="py-20 border-t-2 border-black/5 overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Inspiration Stream</h2>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
          Hover to pause • Click to fork
        </p>
      </div>

      <div className="relative flex">
        <div className="flex animate-marquee-slow whitespace-nowrap">
          {marqueeItems.map((ex, idx) => (
            <button
              key={`${ex.src}-${idx}`}
              onClick={() => onUsePrompt(ex.prompt, ex.style)}
              className="group relative mx-3 w-40 flex-none bg-white die-cut-static rounded-lg overflow-hidden cursor-pointer"
            >
              <div className="aspect-square p-4 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ex.src}
                  alt={`AI ${ex.label} sticker: ${ex.prompt}`}
                  className="w-full h-full object-contain transition-transform group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-3 border-t-2 border-black/5 bg-white text-left">
                <p className="text-[9px] font-black text-black uppercase tracking-tight truncate mb-0.5">
                  {ex.prompt}
                </p>
                <p className="text-[8px] text-accent font-bold uppercase tracking-widest">{ex.label} Engine</p>
              </div>
              
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-black text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm -rotate-2">
                  USE THIS
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
