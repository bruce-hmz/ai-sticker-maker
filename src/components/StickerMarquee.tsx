import type { ReactNode } from "react";

interface MarqueeSticker {
  src: string;
  alt: string;
  label: string;
}

interface StickerMarqueeProps {
  stickers: MarqueeSticker[];
  title?: string;
  subtitle?: string;
}

/**
 * 贴纸轮播（纯 CSS marquee，server component）。
 * 只显示真实贴纸，无滤镜变体重复。图少(<6)用单流，图多(≥6)用双流反向。
 */
export default function StickerMarquee({
  stickers,
  title,
  subtitle,
}: StickerMarqueeProps) {
  if (stickers.length === 0) return null;

  const renderItem = (item: MarqueeSticker, key: string): ReactNode => (
    <div
      key={key}
      className="group relative mx-3 w-36 sm:w-40 flex-none bg-white rounded-xl overflow-hidden shadow-sm"
    >
      <div className="aspect-square p-4 bg-gray-50 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          className="w-full h-full object-contain transition-transform group-hover:scale-110"
        />
      </div>
      <div className="px-3 py-2 border-t border-gray-100 bg-white">
        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-tight truncate text-center">
          {item.label}
        </p>
      </div>
    </div>
  );

  const header =
    title || subtitle ? (
      <div className="text-center mb-8 px-4">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
        )}
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
    ) : null;

  // 图少：单流，重复 3 次填充循环长度（相邻都是不同图，无同图并排）
  if (stickers.length < 6) {
    const stream = [...stickers, ...stickers, ...stickers];
    return (
      <section className="py-12 overflow-hidden">
        {header}
        <div className="relative flex">
          <div className="flex animate-marquee-slow whitespace-nowrap">
            {stream.map((item, idx) => renderItem(item, `s-${idx}`))}
          </div>
        </div>
      </section>
    );
  }

  // 图多：双流反向，每流重复一遍实现无缝循环
  const half = Math.ceil(stickers.length / 2);
  const stream1 = [...stickers.slice(0, half), ...stickers.slice(0, half)];
  const stream2 = [...stickers.slice(half), ...stickers.slice(half)];

  return (
    <section className="py-12 overflow-hidden">
      {header}
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
