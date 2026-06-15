import type { ReactNode } from "react";

interface MarqueeSticker {
  src: string;
  alt: string;
  label: string;
}

// CSS 滤镜变体 — 把少量贴纸扩展成足够 marquee 循环的视觉条目（复用 ExampleGallery 思路）
const VARIANTS = [
  { filter: "", tag: "" },
  { filter: "hue-rotate(90deg) saturate(1.5)", tag: "NEON" },
  { filter: "hue-rotate(180deg) brightness(1.1) saturate(0.8)", tag: "ICY" },
  { filter: "sepia(1) saturate(3) hue-rotate(-30deg) brightness(0.9)", tag: "GOLDEN" },
] as const;

function expandWithVariants(stickers: MarqueeSticker[]) {
  return stickers.flatMap((s) =>
    VARIANTS.map((v) => ({ ...s, filter: v.filter, tag: v.tag }))
  );
}

interface StickerMarqueeProps {
  stickers: MarqueeSticker[];
  title?: string;
  subtitle?: string;
}

/**
 * 双流反向滚动的贴纸轮播（纯 CSS 动画，server component）。
 * 用于各主题页：球队页传该队贴纸、world-cup/es 页传世界杯贴纸。
 * 少量贴纸经 CSS 变体扩展后分双流、各自重复一遍实现无缝循环。
 */
export default function StickerMarquee({
  stickers,
  title,
  subtitle,
}: StickerMarqueeProps) {
  if (stickers.length === 0) return null;

  const expanded = expandWithVariants(stickers);
  const half = Math.ceil(expanded.length / 2);
  const stream1 = [...expanded.slice(0, half), ...expanded.slice(0, half)];
  const stream2 = [...expanded.slice(half), ...expanded.slice(half)];

  const renderItem = (item: (typeof expanded)[number], key: string): ReactNode => (
    <div
      key={key}
      className="group relative mx-3 w-36 sm:w-40 flex-none bg-white rounded-xl overflow-hidden shadow-sm"
    >
      <div className="aspect-square p-4 bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          style={item.filter ? { filter: item.filter } : undefined}
          loading="lazy"
          className="w-full h-full object-contain transition-transform group-hover:scale-110"
        />
        {item.tag && (
          <div className="absolute top-1.5 left-1.5 bg-black/80 text-white text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
            {item.tag}
          </div>
        )}
      </div>
      <div className="px-3 py-2 border-t border-gray-100 bg-white">
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tight truncate text-center">
          {item.label}
        </p>
      </div>
    </div>
  );

  return (
    <section className="py-12 overflow-hidden">
      {(title || subtitle) && (
        <div className="text-center mb-8 px-4">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
          )}
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
      )}
      <div className="space-y-4">
        <div className="relative flex">
          <div className="flex animate-marquee-slow whitespace-nowrap">
            {stream1.map((item, idx) => renderItem(item, `s1-${idx}`))}
          </div>
        </div>
        <div className="relative flex">
          <div className="flex animate-marquee-reverse-slow whitespace-nowrap">
            {stream2.map((item, idx) => renderItem(item, `s2-${idx}`))}
          </div>
        </div>
      </div>
    </section>
  );
}
