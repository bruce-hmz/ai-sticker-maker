"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  resolveStickerStyleId,
  STICKER_STYLES,
  type StickerStyle,
} from "@/lib/sticker-styles";
import ExampleGallery from "./ExampleGallery";
import WorldCupPrompts from "./WorldCupPrompts";
import ThemePromptPacks from "./ThemePromptPacks";
import AdSenseUnit from "./AdSenseUnit";

interface GeneratedSticker {
  id: string;
  image: string;
  prompt: string;
  style: string;
  seed: number;
  persisted?: boolean; // true if saved to Blob + KV
}

const MAX_STICKERS = 20;

function revokeStickerImages(stickers: GeneratedSticker[]) {
  stickers.forEach((sticker) => {
    if (sticker.image.startsWith("blob:")) {
      URL.revokeObjectURL(sticker.image);
    }
  });
}

export default function StickerGenerator({
  initialPrompt = "",
  initialStyle,
  promptSuffix,
  showGallery = true,
}: {
  initialPrompt?: string;
  initialStyle?: string;
  promptSuffix?: string;
  showGallery?: boolean;
} = {}) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [selectedStyle, setSelectedStyle] = useState(resolveStickerStyleId(initialStyle));
  const [stickers, setStickers] = useState<GeneratedSticker[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const stickersRef = useRef<GeneratedSticker[]>([]);

  useEffect(() => {
    stickersRef.current = stickers;
  }, [stickers]);

  useEffect(() => {
    return () => revokeStickerImages(stickersRef.current);
  }, []);

  const addGeneratedSticker = (sticker: GeneratedSticker) => {
    setStickers((prev) => {
      const next = [sticker, ...prev];
      const visibleStickers = next.slice(0, MAX_STICKERS);
      revokeStickerImages(next.slice(MAX_STICKERS));
      return visibleStickers;
    });
  };

  const generateStickers = async () => {
    if (!prompt.trim() || generating) return;

    const promptToGenerate = promptSuffix ? `${prompt}, ${promptSuffix}` : prompt;
    const styleToGenerate = selectedStyle;

    setGenerating(true);
    setError("");

    try {
      // API returns image binary directly (proxied from SenseNova CDN)
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToGenerate, style: styleToGenerate }),
        signal: AbortSignal.timeout(120_000),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || `API error (${res.status})`);
      }

      const contentType = res.headers.get("content-type") ?? "";
      let sticker: GeneratedSticker;

      if (contentType.includes("application/json")) {
        // New path: server persisted the sticker, returns JSON
        const data = await res.json();
        sticker = {
          id: data.id,
          image: data.imageUrl,
          prompt: data.prompt,
          style: data.style,
          seed: data.seed,
          persisted: true,
        };
      } else {
        // Legacy path: server returns raw PNG binary
        const seed = res.headers.get("X-Sticker-Seed") || String(Date.now());
        const blob = await res.blob();
        sticker = {
          id: `sticker-${Date.now()}`,
          image: URL.createObjectURL(blob),
          prompt: promptToGenerate,
          style: styleToGenerate,
          seed: Number(seed),
          persisted: false,
        };
      }

      addGeneratedSticker(sticker);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadSticker = async (sticker: GeneratedSticker) => {
    try {
      const res = await fetch(sticker.image);
      if (!res.ok) throw new Error(`Download failed (${res.status})`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sticker-${sticker.seed}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    }
  };

  const clearStickers = () => {
    setStickers((prev) => {
      revokeStickerImages(prev);
      return [];
    });
  };

  const applyExample = (prompt: string, style: string) => {
    setPrompt(prompt);
    setSelectedStyle(style);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Prompt Input */}
      <div className="bg-white die-cut-static rounded-xl p-6 mb-8">
        <label htmlFor="sticker-prompt" className="block text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">
          Step 1: Describe your sticker
        </label>
        <textarea
          id="sticker-prompt"
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. a happy cat with a birthday hat, a coffee cup saying good morning, a cute dinosaur..."
          rows={2}
          className="w-full border-2 border-black rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none mb-6 font-medium"
        />

        {/* Style Selector */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">
            Step 2: Choose a style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STICKER_STYLES.map((style: StickerStyle) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`flex flex-col text-left overflow-hidden rounded-lg border-2 transition-all ${
                  selectedStyle === style.id
                    ? "border-black ring-2 ring-black bg-accent/5"
                    : "border-gray-100 hover:border-black/20"
                }`}
              >
                <div className="aspect-square w-full relative bg-gray-50 border-b-2 border-transparent group-hover:border-black/10 transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedStyle === style.id && (
                    <div className="absolute top-2 right-2 bg-black text-white p-1 rounded-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs">{style.emoji}</span>
                    <span className="font-bold text-[11px] sm:text-xs text-black truncate uppercase tracking-tight">
                      {style.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-tight line-clamp-1 font-medium italic">
                    {style.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateStickers}
          disabled={!prompt.trim() || generating}
          className="w-full bg-accent text-white font-black py-4 rounded-lg text-lg uppercase tracking-tighter die-cut disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
        >
          {generating
            ? "Creating..."
            : "Generate Sticker"}
        </button>

        {error && (
          <p className="text-red-500 text-xs font-bold mt-4 text-center border-t-2 border-red-50/50 pt-3">{error}</p>
        )}
      </div>

      {/* Theme Prompt Packs */}
      <ThemePromptPacks onUsePrompt={applyExample} />

      {/* Sticker Gallery */}
      {stickers.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Your Creations</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sticker Lab Output</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearStickers}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Reset Lab
              </button>
              <button
                onClick={() => stickers.forEach(downloadSticker)}
                className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
              >
                Export All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="group relative bg-white rounded-lg overflow-hidden die-cut-static cursor-pointer"
                onClick={() => downloadSticker(sticker)}
              >
                <div className="aspect-square p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sticker.image}
                    alt={`AI generated sticker: ${sticker.prompt}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-all text-white text-[10px] font-black uppercase tracking-widest bg-black px-4 py-2 rounded-sm -rotate-2">
                    Download
                  </span>
                </div>
                {sticker.persisted && (
                  <Link
                    href={`/sticker/${sticker.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white text-[8px] font-bold bg-black px-2 py-1 rounded-sm"
                  >
                    SHARE
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Post-Generation Pack Nudge */}
          <div className="mt-12 bg-white die-cut-static rounded-xl p-6 border-accent/20">
            <h3 className="text-sm font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
              <span>Complete the set</span>
              <span className="text-[8px] bg-accent text-white px-2 py-0.5 rounded-sm font-bold tracking-widest">
                MULTIPACK
              </span>
            </h3>
            <p className="text-xs text-gray-500 mb-6 font-medium leading-relaxed">
              Stickers are better in packs. Try these variations in <span className="text-black font-bold uppercase tracking-tight underline decoration-accent decoration-2">{STICKER_STYLES.find(s => s.id === selectedStyle)?.name}</span>:
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Happy", prompt: `a happy ${prompt.replace(/^(a|an)\s+/, "")}` },
                { label: "Angry", prompt: `an angry ${prompt.replace(/^(a|an)\s+/, "")}` },
                { label: "Cool", prompt: `a cool ${prompt.replace(/^(a|an)\s+/, "")} with sunglasses` },
              ].map((nudge, idx) => (
                <button
                  key={idx}
                  onClick={() => applyExample(nudge.prompt, selectedStyle)}
                  className="px-4 py-2 bg-gray-50 border-2 border-black text-black rounded-lg text-xs font-bold uppercase tracking-tight hover:bg-accent hover:text-white transition-all transform hover:-translate-y-1"
                >
                  {nudge.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* World Cup 2026 Quick Prompts */}
      <WorldCupPrompts onUsePrompt={applyExample} />

      {/* Example Gallery */}
      {showGallery && <ExampleGallery onUsePrompt={applyExample} />}
    </div>
  );
}
