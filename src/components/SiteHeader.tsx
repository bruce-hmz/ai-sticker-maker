import Link from "next/link";

const NAV = [
  { href: "/blog", label: "Guides" },
  { href: "/stickers", label: "Gallery" },
  { href: "/world-cup", label: "World Cup" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-bold text-black hover:text-violet-600 transition-colors whitespace-nowrap"
        >
          StickerSit
        </Link>
        <nav aria-label="Main" className="overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-x-4 sm:gap-x-6 whitespace-nowrap">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs sm:text-sm text-gray-500 hover:text-violet-600 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
