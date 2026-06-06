import { NextRequest, NextResponse } from "next/server";

const AGENTS_MD = `# StickerAI Agent Card
> Free AI WhatsApp Sticker Maker Online — no app download, no sign up required

## About
StickerAI (stickersit.com) is a free, browser-based AI sticker maker that generates custom stickers for WhatsApp, Telegram, iMessage, and Discord. Users type a text prompt describing their sticker idea, choose from 8 artistic styles, and download generated stickers as PNG files. No sign-up, no app download, no payment.

## Capabilities
- Text-to-sticker AI generation
- 8 styles: Cute Kawaii, Chibi, Pixel Art, Cartoon, Hand-drawn, 3D Rendered, Minimalist, Retro/Vintage
- Export as PNG (512x512)
- No sign-up required

## Pages
- [Homepage](https://stickersit.com) — AI Sticker Maker tool
- [How to Make a Sticker on iPhone](https://stickersit.com/how-to-make-a-sticker-on-iphone) — complete guide
- [World Cup 2026 Sticker Maker](https://stickersit.com/world-cup)

## Pricing
Free. No premium tiers. No watermarks.

## Contact
- Email: yang2big@gmail.com
- X: https://x.com/YangDada3983
`;

export function proxy(request: NextRequest) {
  // Redirect www to bare domain
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.replace("www.", "");
    return NextResponse.redirect(url, 308);
  }

  // Markdown content negotiation for AI agents
  if (request.nextUrl.pathname === "/") {
    const accept = request.headers.get("accept") ?? "";
    if (accept.includes("text/markdown") && !accept.includes("text/html")) {
      return new NextResponse(AGENTS_MD, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
        },
      });
    }
  }

  return NextResponse.next();
}
