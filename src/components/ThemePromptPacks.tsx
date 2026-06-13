"use client";

import { useState } from "react";

interface PromptChip {
  label: string;
  prompt: string;
  style: string;
}

interface ThemePack {
  title: string;
  emoji: string;
  prompts: PromptChip[];
}

const THEME_PACKS: ThemePack[] = [
  {
    title: "Everyday Reactions",
    emoji: "😊",
    prompts: [
      { label: "No! (Cat)", prompt: "a cute cat saying no with crossed arms", style: "cartoon" },
      { label: "Coffee Needed", prompt: "a sleepy dog holding a coffee mug", style: "chibi" },
      { label: "Thumbs Up", prompt: "a tiny ghost giving a thumbs up", style: "cute-kawaii" },
      { label: "Facepalm", prompt: "a cute panda doing a facepalm", style: "cartoon" },
      { label: "Idea!", prompt: "a lightbulb with a cute face shining bright", style: "pixel-art" },
    ],
  },
  {
    title: "Birthday",
    emoji: "🎂",
    prompts: [
      { label: "Happy Cake", prompt: "a happy cake with candles and confetti", style: "3d-rendered" },
      { label: "Kawaii Balloon", prompt: "a kawaii birthday balloon with a smile", style: "cute-kawaii" },
      { label: "Party Hat", prompt: "a retro party hat with sparkles", style: "retro" },
      { label: "Gift Box", prompt: "a cute gift box jumping with joy", style: "chibi" },
    ],
  },
  {
    title: "Love",
    emoji: "❤️",
    prompts: [
      { label: "Hugging Hearts", prompt: "two cute hearts hugging each other", style: "cute-kawaii" },
      { label: "Love Letter", prompt: "a chibi bear holding a love letter", style: "chibi" },
      { label: "Heart Wings", prompt: "a minimalist heart with tiny wings", style: "minimalist" },
      { label: "Cat Love", prompt: "a hand-drawn cat making a heart with its tail", style: "hand-drawn" },
    ],
  },
  {
    title: "Work Chat",
    emoji: "💻",
    prompts: [
      { label: "Tired Laptop", prompt: "a tired laptop with sleepy eyes", style: "cartoon" },
      { label: "Focus Mode", prompt: "a pixel art coffee cup saying focus", style: "pixel-art" },
      { label: "Checklist", prompt: "a hand-drawn checklist with sparkles", style: "hand-drawn" },
      { label: "Deadlines", prompt: "a cute clock running fast with a panicked face", style: "chibi" },
    ],
  },
  {
    title: "World Cup",
    emoji: "⚽",
    prompts: [
      { label: "Goool!", prompt: "a cute soccer ball flying into the net with fire trail", style: "cartoon" },
      { label: "Fan Cat", prompt: "a kawaii cat wearing a jersey and face paint", style: "cute-kawaii" },
      { label: "Golden Cup", prompt: "a shiny 3D trophy with sparkles and confetti", style: "3d-rendered" },
      { label: "Referee Red Card", prompt: "a chibi referee showing a red card", style: "chibi" },
    ],
  },
];

export default function ThemePromptPacks({
  onUsePrompt,
}: {
  onUsePrompt: (prompt: string, style: string) => void;
}) {
  const [activeTheme, setActiveTheme] = useState(THEME_PACKS[0].title);

  const currentPack = THEME_PACKS.find((p) => p.title === activeTheme) || THEME_PACKS[0];

  return (
    <div className="bg-white die-cut-static rounded-xl p-6 mb-8">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-gray-500">
        <span>Prompt Presets</span>
        <span className="text-[8px] bg-black text-white px-2 py-0.5 rounded-sm tracking-[0.2em] font-black">
          CATALOG
        </span>
      </h3>

      {/* Theme Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar -mx-1 px-1 mb-2">
        {THEME_PACKS.map((pack) => (
          <button
            key={pack.title}
            onClick={() => setActiveTheme(pack.title)}
            className={`flex-none px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all whitespace-nowrap ${
              activeTheme === pack.title
                ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
            }`}
          >
            {pack.emoji} {pack.title}
          </button>
        ))}
      </div>

      {/* Prompt Chips */}
      <div className="flex flex-wrap gap-3">
        {currentPack.prompts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onUsePrompt(chip.prompt, chip.style)}
            className="px-4 py-2 rounded-lg border-2 border-black bg-white hover:bg-accent hover:text-white transition-all text-xs font-bold uppercase tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
