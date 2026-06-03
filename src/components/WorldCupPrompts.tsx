"use client";

const WORLD_CUP_PROMPTS = [
  { prompt: "a football with wings and a golden halo", style: "3d-rendered", emoji: "⚽", label: "Holy Football" },
  { prompt: "a cute chibi football player scoring a goal with confetti", style: "chibi", emoji: "🏟️", label: "Goal!" },
  { prompt: "a cartoon World Cup trophy with sparkles", style: "cartoon", emoji: "🏆", label: "Trophy" },
  { prompt: "a kawaii football wearing a tiny crown", style: "cute-kawaii", emoji: "👑", label: "King Football" },
  { prompt: "a happy football fan with face paint waving a flag", style: "cartoon", emoji: "🇧🇷", label: "Fan" },
  { prompt: "a pixel art football stadium with lights at night", style: "pixel-art", emoji: "🎮", label: "Stadium" },
  { prompt: "a retro vintage football boot with stars", style: "retro", emoji: "📻", label: "Retro Boot" },
  { prompt: "a 3D golden trophy with number 2026", style: "3d-rendered", emoji: "✨", label: "2026 Trophy" },
  { prompt: "a hand-drawn referee blowing a whistle", style: "hand-drawn", emoji: "✏️", label: "Referee" },
  { prompt: "a minimalist football with clean lines", style: "minimalist", emoji: "◻️", label: "Clean Ball" },
  { prompt: "a cute football with Brazil flag colors smiling", style: "cute-kawaii", emoji: "🇧🇷", label: "Brazil" },
  { prompt: "a cartoon football player celebrating with arms raised", style: "cartoon", emoji: "🎉", label: "Celebrate" },
];

export default function WorldCupPrompts({
  onUsePrompt,
}: {
  onUsePrompt: (prompt: string, style: string) => void;
}) {
  return (
    <section className="py-8 mb-4">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <div className="text-center mb-5">
          <p className="text-green-600 text-xs tracking-widest mb-1 font-semibold uppercase">
            ⚽ World Cup 2026
          </p>
          <h2 className="text-xl font-bold mb-1">
            World Cup Sticker Maker
          </h2>
          <p className="text-gray-500 text-sm">
            Create custom World Cup stickers for WhatsApp &amp; Telegram — free, instant
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {WORLD_CUP_PROMPTS.map((item) => (
            <button
              key={item.label}
              onClick={() => onUsePrompt(item.prompt, item.style)}
              className="group bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer border border-green-100 hover:border-green-300 text-center"
            >
              <span className="text-2xl block mb-1">{item.emoji}</span>
              <p className="text-xs font-medium text-gray-700 group-hover:text-green-700">
                {item.label}
              </p>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          Click any sticker idea to start creating — customize the prompt however you like!
        </p>
      </div>
    </section>
  );
}
