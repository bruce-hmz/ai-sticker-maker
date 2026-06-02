import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-6xl mb-4">🏷️</p>
      <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8">
        This sticker got lost! Let&apos;s get you back to creating.
      </p>
      <Link
        href="/"
        className="inline-block bg-violet-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-violet-600 transition-colors"
      >
        Make Stickers
      </Link>
    </main>
  );
}
