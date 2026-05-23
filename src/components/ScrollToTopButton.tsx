"use client";

export default function ScrollToTopButton() {
  return (
    <a
      href="#"
      className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full active:scale-95 transition-transform"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      Start Creating Stickers
    </a>
  );
}
