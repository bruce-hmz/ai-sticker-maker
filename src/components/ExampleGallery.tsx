"use client";

const EXAMPLES = [
  { src: "/examples/cute-kawaii-cat.png", prompt: "a happy cat wearing sunglasses", style: "cute-kawaii", label: "Cute Kawaii" },
  { src: "/examples/chibi-dog.png", prompt: "a cute dog holding a love heart", style: "chibi", label: "Chibi" },
  { src: "/examples/pixel-art-rocket.png", prompt: "a rocket ship blasting off", style: "pixel-art", label: "Pixel Art" },
  { src: "/examples/cartoon-coffee.png", prompt: "a happy coffee cup with heart eyes", style: "cartoon", label: "Cartoon" },
  { src: "/examples/hand-drawn-cat.png", prompt: "a sleepy cat napping", style: "hand-drawn", label: "Hand-drawn" },
  { src: "/examples/3d-avocado.png", prompt: "a smiling avocado with tiny arms", style: "3d-rendered", label: "3D Rendered" },
  { src: "/examples/minimalist-star.png", prompt: "a simple star shape", style: "minimalist", label: "Minimalist" },
  { src: "/examples/retro-camera.png", prompt: "a vintage camera", style: "retro", label: "Retro" },
];

export default function ExampleGallery({ onUsePrompt }: { onUsePrompt: (prompt: string, style: string) => void }) {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold text-center mb-3">
        AI Sticker Examples
      </h2>
      <p className="text-gray-400 text-center text-sm mb-8">
        Click any sticker to generate your own version
      </p>
      <div className="grid grid-cols-4 gap-3">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.src}
            onClick={() => onUsePrompt(ex.prompt, ex.style)}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer border border-gray-100 text-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ex.src}
              alt={`AI ${ex.label} sticker example: ${ex.prompt}`}
              className="w-full aspect-square object-contain p-2"
              loading="lazy"
            />
            <div className="px-2 pb-2">
              <p className="text-xs text-gray-500 truncate">{ex.prompt}</p>
              <p className="text-[10px] text-violet-500 font-medium">{ex.label}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
