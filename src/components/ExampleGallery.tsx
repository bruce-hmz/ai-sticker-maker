"use client";

const EXAMPLES = [
  { src: "/promo/pinterest-3d-donut.png", prompt: "a glazed donut with neon glowing sprinkles, soft 3D lighting", style: "3d-rendered", label: "3D Engine" },
  { src: "/promo/pinterest-chibi-panda.png", prompt: "a cute panda wearing a high-tech space suit, eating bamboo", style: "chibi", label: "Chibi Engine" },
  { src: "/promo/pinterest-cute-cat.png", prompt: "a majestic white cat with galaxy eyes, wearing a tiny crown", style: "cute-kawaii", label: "Kawaii Engine" },
  { src: "/promo/pinterest-cartoon-dog.png", prompt: "a funny bulldog wearing oversized retro sunglasses", style: "cartoon", label: "Cartoon Engine" },
  { src: "/promo/pinterest-3d-planet.png", prompt: "a cute Saturn-like planet with translucent rings, Pixar quality", style: "3d-rendered", label: "3D Engine" },
  { src: "/promo/pinterest-chibi-rocket.png", prompt: "a tiny rocket ship blasting off with heart-shaped smoke", style: "chibi", label: "Chibi Engine" },
  { src: "/promo/pinterest-cute-coffee.png", prompt: "a happy coffee cup with a warm steam face, soft pastel vibe", style: "cute-kawaii", label: "Kawaii Engine" },
  { src: "/promo/pinterest-handdrawn-moon.png", prompt: "a crescent moon with delicate pencil shading and tiny stars", style: "hand-drawn", label: "Sketch Engine" },
  { src: "/promo/pinterest-retro-phone.png", prompt: "a retro 80s rotary telephone in vibrant neon pink", style: "retro", label: "Retro Engine" },
  // Diversify with existing local examples but with "upgraded" prompts
  { src: "/examples/3d-avocado.png", prompt: "a smiling avocado with 3D volumetric lighting and tiny arms", style: "3d-rendered", label: "3D Engine" },
  { src: "/examples/pixel-art-rocket.png", prompt: "a 16-bit retro arcade rocket with clean pixel shading", style: "pixel-art", label: "Pixel Engine" },
  { src: "/examples/cartoon-coffee.png", prompt: "a bold cartoon coffee cup with expressive eyes and thick outlines", style: "cartoon", label: "Cartoon Engine" },
  { src: "/examples/hand-drawn-cat.png", prompt: "a sleepy minimalist cat napping on a fluffy cloud, hand-drawn", style: "hand-drawn", label: "Sketch Engine" },
  { src: "/examples/chibi-dog.png", prompt: "a cute chibi puppy with big puppy eyes holding a love heart", style: "chibi", label: "Chibi Engine" },
  { src: "/examples/retro-camera.png", prompt: "a vintage film camera with weathered textures and metallic sheen", style: "retro", label: "Retro Engine" },
  { src: "/examples/minimalist-star.png", prompt: "an elegant minimalist star with glowing holographic edges", style: "minimalist", label: "Logic Engine" },
];

export default function ExampleGallery({ onUsePrompt }: { onUsePrompt: (prompt: string, style: string) => void }) {
  // Duplicate for seamless infinite loop
  const marqueeItems = [...EXAMPLES, ...EXAMPLES];

  return (
    <section className="py-24 border-t-2 border-black/5 overflow-hidden">
      <div className="text-center mb-16">
        <div className="inline-block border-2 border-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          Discovery Stream
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Inspiration Flow</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          Top-tier output from our specialized engines
        </p>
      </div>

      <div className="relative flex">
        {/* First Row: Moving Left */}
        <div className="flex animate-marquee-slow whitespace-nowrap mb-8">
          {marqueeItems.map((ex, idx) => (
            <button
              key={`stream1-${ex.src}-${idx}`}
              onClick={() => onUsePrompt(ex.prompt, ex.style)}
              className="group relative mx-4 w-48 flex-none bg-white die-cut-static rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-105"
            >
              <div className="aspect-square p-6 bg-gray-50 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ex.src}
                  alt={`AI Output: ${ex.prompt}`}
                  className="w-full h-full object-contain transition-transform group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-4 border-t-2 border-black/5 bg-white text-left">
                <p className="text-[10px] font-black text-black uppercase tracking-tight truncate mb-1">
                  {ex.prompt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-accent font-black uppercase tracking-widest">{ex.label}</span>
                  <span className="text-[8px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">FORK</span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/5 transition-colors" />
            </button>
          ))}
        </div>
      </div>
      
      <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.4em] mt-12">
        Click any unit to re-run in the lab
      </p>
    </section>
  );
}
