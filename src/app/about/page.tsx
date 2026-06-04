import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | StickerAI",
  description:
    "StickerAI is a free AI-powered sticker maker for WhatsApp, Telegram, iMessage, and Discord. No app download, no sign up required.",
  alternates: { canonical: "https://stickersit.com/about" },
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About StickerAI</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-3">What is StickerAI?</h2>
          <p>
            StickerAI (stickersit.com) is a free, browser-based AI sticker generator. Type a description,
            pick an art style, and get custom stickers ready for WhatsApp, Telegram, iMessage, or Discord
            — in about 30 seconds, with no app download and no account required.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Why we built it</h2>
          <p>
            Making custom chat stickers used to require downloading an app, signing up, and navigating
            complicated tools. We wanted to remove all that friction. StickerAI lets anyone create a
            unique sticker from a simple text description, right in the browser, completely free.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">What you can create</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Cute Kawaii stickers in soft pastel styles</li>
            <li>Chibi characters with big heads and tiny bodies</li>
            <li>Retro Pixel Art in 16-bit style</li>
            <li>Bold Cartoon stickers with vivid colors</li>
            <li>Hand-drawn sketch and doodle styles</li>
            <li>3D Rendered Pixar-quality stickers</li>
            <li>Clean Minimalist designs</li>
            <li>Retro / Vintage nostalgic styles</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Our commitment</h2>
          <p>
            StickerAI will always have a free tier. We believe creative tools should be accessible
            to everyone. We respect your privacy — we do not store the stickers you generate or require
            any personal information to use the service.
          </p>
          <p className="mt-2">
            For details on how we handle data, see our{" "}
            <Link href="/privacy" className="text-violet-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Contact</h2>
          <p>
            Questions, feedback, or partnership inquiries? Reach us at{" "}
            <a href="mailto:hello@stickersit.com" className="text-violet-600 hover:underline">
              hello@stickersit.com
            </a>
            {" "}or on{" "}
            <a
              href="https://x.com/YangDada3983"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:underline"
            >
              𝕏 @YangDada3983
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <Link href="/privacy" className="hover:text-violet-500">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-violet-500">Terms</Link>
        <Link href="/contact" className="hover:text-violet-500">Contact</Link>
      </div>
    </main>
  );
}
