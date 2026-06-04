import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | StickerAI",
  description:
    "Get in touch with the StickerAI team. Questions, feedback, or partnership inquiries welcome.",
  alternates: { canonical: "https://stickersit.com/contact" },
};

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold mb-3">Get in touch</h2>
          <p>
            We&apos;d love to hear from you — whether it&apos;s a bug report, feature request, or just
            feedback on the stickers you&apos;ve made.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Email</h2>
          <p>
            For general inquiries, support, or partnership requests:
          </p>
          <a
            href="mailto:hello@stickersit.com"
            className="inline-block mt-2 text-violet-600 hover:underline font-medium"
          >
            hello@stickersit.com
          </a>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Social</h2>
          <p>You can also reach us on X (Twitter):</p>
          <a
            href="https://x.com/YangDada3983"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-violet-600 hover:underline font-medium"
          >
            𝕏 @YangDada3983
          </a>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">Response time</h2>
          <p>We typically respond within 1–3 business days.</p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4 text-xs text-gray-400">
        <Link href="/" className="hover:text-violet-500">Home</Link>
        <Link href="/about" className="hover:text-violet-500">About</Link>
        <Link href="/privacy" className="hover:text-violet-500">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-violet-500">Terms</Link>
      </div>
    </main>
  );
}
