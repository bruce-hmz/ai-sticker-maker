import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Sticker Maker" },
      { href: "/stickers", label: "Browse Stickers" },
      { href: "/world-cup", label: "World Cup 2026" },
      { href: "/how-to-make-a-sticker-on-iphone", label: "iPhone Stickers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

const linkCls = "text-gray-400 hover:text-violet-500 transition-colors";
const eyebrowCls = "text-[10px] font-black uppercase tracking-tight text-gray-400 mb-3";

export default function SiteFooter() {
  const guides = BLOG_POSTS.slice(0, 4);
  return (
    <footer className="border-t border-gray-100 bg-gray-50 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-sm font-bold text-black mb-1">StickerSit</p>
            <p className="text-xs text-gray-400">
              Free AI Sticker Maker for WhatsApp, Telegram &amp; iMessage.
            </p>
          </div>
          <nav aria-label="Guides">
            <p className={eyebrowCls}>Guides</p>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className={linkCls}>
                  All Guides
                </Link>
              </li>
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={g.path} className={linkCls}>
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className={eyebrowCls}>{c.title}</p>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} StickerSit. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://x.com/YangDada3983"
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              𝕏 @YangDada3983
            </a>
            <a
              href="https://fantasynamegenerator.net"
              target="_blank"
              rel="noopener noreferrer"
              className={linkCls}
            >
              Fantasy Name Generator
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
