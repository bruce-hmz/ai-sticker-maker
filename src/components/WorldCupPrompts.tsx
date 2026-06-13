"use client";

const WORLD_CUP_PROMPTS = [
  { prompt: "a football with wings and a golden halo", style: "3d-rendered", emoji: "⚽", label: "Holy Ball" },
  { prompt: "a cute chibi football player scoring a goal with confetti", style: "chibi", emoji: "🏟️", label: "Goal!" },
  { prompt: "a cartoon World Cup trophy with sparkles", style: "cartoon", emoji: "🏆", label: "Trophy" },
  { prompt: "a kawaii football wearing a tiny crown", style: "cute-kawaii", emoji: "👑", label: "King" },
  { prompt: "a happy football fan with face paint waving a flag", style: "cartoon", emoji: "🇧🇷", label: "Super Fan" },
  { prompt: "a pixel art football stadium with lights at night", style: "pixel-art", emoji: "🎮", label: "Stadium" },
  { prompt: "a retro vintage football boot with stars", style: "retro", emoji: "📻", label: "Vintage" },
  { prompt: "a 3D golden trophy with number 2026", style: "3d-rendered", emoji: "✨", label: "2026" },
];

export default function WorldCupPrompts({
  onUsePrompt,
}: {
  onUsePrompt: (prompt: string, style: string) => void;
}) {
  return (
    <section className="py-12 border-t-2 border-black/5">
      <div className="bg-white die-cut-static rounded-xl p-8 border-green-500/20">
        <div className="text-center mb-8">
          <p className="text-green-600 text-[10px] tracking-[0.3em] mb-2 font-black uppercase">
            ⚽ Limited Edition
          </p>
          <h2 className="text-2xl font-black mb-1 uppercase tracking-tighter">
            WC 2026 Expansion
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Specialized tournament presets
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {WORLD_CUP_PROMPTS.map((item) => (
            <button
              key={item.label}
              onClick={() => onUsePrompt(item.prompt, item.style)}
              className="group bg-white rounded-lg p-4 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(34,197,94,0.5)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] text-center"
            >
              <span className="text-3xl block mb-2">{item.emoji}</span>
              <p className="text-[10px] font-black uppercase tracking-tight">
                {item.label}
              </p>
            </button>
          ))}
        </div>
        <p className="text-[9px] text-gray-400 text-center mt-6 font-bold uppercase tracking-widest italic">
          &ldquo;Standard lab protocols apply for tournament output&rdquo;
        </p>
      </div>
    </section>
  );
}
