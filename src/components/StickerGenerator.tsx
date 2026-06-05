"use client";

import { useEffect, useRef, useState } from "react";
import { STICKER_STYLES, type StickerStyle } from "@/lib/sticker-styles";
import ExampleGallery from "./ExampleGallery";
import WorldCupPrompts from "./WorldCupPrompts";
import AdSenseUnit from "./AdSenseUnit";

interface GeneratedSticker {
  id: string;
  image: string;
  prompt: string;
  style: string;
  seed: number;
}

const MAX_STICKERS = 20;

function revokeStickerImages(stickers: GeneratedSticker[]) {
  stickers.forEach((sticker) => {
    if (sticker.image.startsWith("blob:")) {
      URL.revokeObjectURL(sticker.image);
    }
  });
}

export default function StickerGenerator({ promptSuffix }: { promptSuffix?: string } = {}) {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("cute-kawaii");
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

      const seed = res.headers.get("X-Sticker-Seed") || String(Date.now());
      const blob = await res.blob();
      const sticker: GeneratedSticker = {
        id: `sticker-${Date.now()}`,
        image: URL.createObjectURL(blob),
        prompt: promptToGenerate,
        style: styleToGenerate,
        seed: Number(seed),
      };
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
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <label className="block text-sm font-semibold mb-2">
          Describe your sticker
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. a happy cat with a birthday hat, a coffee cup saying good morning, a cute dinosaur..."
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 transition-colors resize-none mb-4"
        />

        {/* Style Selector */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Choose a style
          </label>
          <div className="grid grid-cols-4 gap-2">
            {STICKER_STYLES.map((style: StickerStyle) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all text-xs ${
                  selectedStyle === style.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <span className="text-xl mb-1">{style.emoji}</span>
                <span className="font-medium text-gray-700">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateStickers}
          disabled={!prompt.trim() || generating}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3.5 rounded-xl text-base active:scale-95 transition-transform disabled:opacity-50"
        >
          {generating
            ? "Generating sticker..."
            : "Generate Sticker (Free)"}
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}
      </div>

      {/* Sticker Gallery */}
      {stickers.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Your Stickers</h2>
            <div className="flex gap-2">
              <button
                onClick={clearStickers}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Clear all
              </button>
              <button
                onClick={() => stickers.forEach(downloadSticker)}
                className="text-sm text-violet-600 font-semibold hover:text-violet-800"
              >
                Download all (PNG)
              </button>
            </div>
          </div>

          {/* Ad Unit - After sticker results */}
          <AdSenseUnit slot={process.env.NEXT_PUBLIC_AD_SLOT_RESULTS ?? ""} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                onClick={() => downloadSticker(sticker)}
              >
                <div className="aspect-square p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sticker.image}
                    alt={`AI generated sticker: ${sticker.prompt}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">
                    Download PNG
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            Click any sticker to download as PNG.
          </p>
        </div>
      )}

      {/* World Cup 2026 Quick Prompts */}
      <WorldCupPrompts onUsePrompt={applyExample} />

      {/* Example Gallery */}
      <ExampleGallery onUsePrompt={applyExample} />
    </div>
  );
}
