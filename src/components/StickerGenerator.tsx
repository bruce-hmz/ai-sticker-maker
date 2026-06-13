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
}: {
  initialPrompt?: string;
  initialStyle?: string;
  promptSuffix?: string;
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
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <label htmlFor="sticker-prompt" className="block text-sm font-semibold mb-2">
          Describe your sticker
        </label>
        <textarea
          id="sticker-prompt"
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. a happy cat with a birthday hat, a coffee cup saying good morning, a cute dinosaur..."
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 transition-colors resize-none mb-4"
        />

        {/* Style Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-3">
            Choose a style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STICKER_STYLES.map((style: StickerStyle) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`flex flex-col text-left overflow-hidden rounded-xl border-2 transition-all ${
                  selectedStyle === style.id
                    ? "border-violet-500 ring-2 ring-violet-500/20"
                    : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <div className="aspect-square w-full relative bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={style.image}
                    alt={style.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedStyle === style.id && (
                    <div className="absolute top-2 right-2 bg-violet-500 text-white p-1 rounded-full">
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
                <div className="p-2 bg-white">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-xs">{style.emoji}</span>
                    <span className="font-bold text-[11px] sm:text-xs text-gray-900 truncate">
                      {style.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight line-clamp-1">
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

      {/* Theme Prompt Packs */}
      <ThemePromptPacks onUsePrompt={applyExample} />

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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">
                    Download PNG
                  </span>
                </div>
                {sticker.persisted && (
                  <Link
                    href={`/sticker/${sticker.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black/50 hover:bg-black/70 px-2 py-0.5 rounded-full"
                  >
                    Share
                  </Link>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-2 text-center">
            Click any sticker to download as PNG.
          </p>

          {/* Post-Generation Pack Nudge */}
          <div className="mt-8 bg-violet-50 rounded-2xl p-5 border border-violet-100">
            <h3 className="text-sm font-bold text-violet-900 mb-3 flex items-center gap-2">
              <span>Want a full WhatsApp pack?</span>
              <span className="text-[10px] bg-white text-violet-600 px-2 py-0.5 rounded-full border border-violet-100 uppercase font-bold">
                Idea
              </span>
            </h3>
            <p className="text-xs text-violet-700 mb-4 leading-relaxed">
              WhatsApp sticker packs look better with multiple variations. Try generating a few more in the <strong>{STICKER_STYLES.find(s => s.id === selectedStyle)?.name}</strong> style:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Make it happy", prompt: `a happy ${prompt.replace(/^(a|an)\s+/, "")}` },
                { label: "Make it angry", prompt: `an angry ${prompt.replace(/^(a|an)\s+/, "")}` },
                { label: "Make it cool", prompt: `a cool ${prompt.replace(/^(a|an)\s+/, "")} with sunglasses` },
              ].map((nudge, idx) => (
                <button
                  key={idx}
                  onClick={() => applyExample(nudge.prompt, selectedStyle)}
                  className="px-3 py-1.5 bg-white border border-violet-200 text-violet-700 rounded-lg text-xs font-medium hover:bg-violet-100 transition-colors shadow-sm"
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
      <ExampleGallery onUsePrompt={applyExample} />
    </div>
  );
}
