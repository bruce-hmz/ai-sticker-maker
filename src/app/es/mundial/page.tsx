import type { Metadata } from "next";
import Link from "next/link";
import StickerGenerator from "@/components/StickerGenerator";
import StickerMarquee from "@/components/StickerMarquee";
import { getAllTeamShowcaseStickers } from "@/lib/world-cup-teams";

// 西语独立页 — 承接 GSC 已排名第1的 "figuritas del mundial"，激活西语市场(墨/南美)
export const metadata: Metadata = {
  title: "Creador de Figuritas del Mundial 2026 para WhatsApp | StickerAI",
  description:
    "Crea figuritas del Mundial 2026 gratis para WhatsApp, Telegram y iMessage. Creador de stickers de fútbol con IA — genera stickers de tu selección al instante. Sin app, sin registro.",
  alternates: {
    canonical: "https://stickersit.com/es/mundial",
    languages: {
      en: "https://stickersit.com/world-cup",
      es: "https://stickersit.com/es/mundial",
      "x-default": "https://stickersit.com/world-cup",
    },
  },
  openGraph: {
    title: "Creador de Figuritas del Mundial 2026 para WhatsApp",
    description:
      "Crea figuritas del Mundial 2026 con IA. Gratis, al instante, sin registro.",
    type: "website",
    url: "https://stickersit.com/es/mundial",
    siteName: "StickerAI",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "StickerAI - Creador de Figuritas del Mundial 2026",
      },
    ],
  },
};

const FIGURITAS_FAQ = [
  {
    q: "¿Cómo hacer figuritas del Mundial para WhatsApp?",
    a: "Crear figuritas del Mundial 2026 para WhatsApp es fácil con StickerAI en stickersit.com/es/mundial. Visita la página en tu teléfono, escribe tu idea en la caja de texto — por ejemplo, \"un jugador chibi celebrando un gol con los colores de tu selección\" — elige un estilo y haz clic en Generar. La IA crea tu figurita en unos 30 segundos. Descarga el PNG y añádelo a tu pack de stickers de WhatsApp. Es gratis, sin registro y sin descargar ninguna app.",
  },
  {
    q: "¿Las figuritas del Mundial son gratis?",
    a: "Sí, todas las figuritas del Mundial 2026 creadas en StickerAI son completamente gratis. Sin registro, sin descargas, sin marcas de agua. Puedes generar stickers ilimitados de cada selección y cada partido del Mundial sin pagar nada.",
  },
  {
    q: "¿Puedo hacer stickers de mi selección favorita?",
    a: "¡Por supuesto! StickerAI puede crear stickers de cualquiera de las selecciones del Mundial 2026. Simplemente describe los colores de la bandera y el diseño de la camiseta de tu país en el prompt. Por ejemplo: \"un jugador chibi con la camiseta amarilla y verde de Brasil\" o \"un balón con los colores de la bandera de Argentina\".",
  },
];

export default function MundialPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es",
    mainEntity: FIGURITAS_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://stickersit.com" },
      { "@type": "ListItem", position: 2, name: "Mundial 2026", item: "https://stickersit.com/es/mundial" },
    ],
  };

  return (
    <main id="top" className="max-w-2xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-violet-500">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="text-gray-600">Mundial 2026</span>
      </nav>

      {/* Hero */}
      <section className="text-center mb-8">
        <p className="text-green-600 text-sm tracking-widest mb-3 font-semibold uppercase">
          ⚽ Mundial 2026
        </p>
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          Creador de Figuritas
          <br />
          del Mundial 2026
        </h1>
        <p className="text-gray-500 text-sm mb-1">
          Crea figuritas del Mundial para WhatsApp, Telegram y más con IA.
        </p>
        <p className="text-green-600 font-semibold text-sm">
          Gratis &bull; Sin registro &bull; Sin app
        </p>
      </section>

      {/* Generator */}
      <StickerGenerator promptSuffix="Mundial 2026 fútbol soccer tema, colores de la selección" showGallery={false} />

      {/* WhatsApp 出口 */}
      <section className="bg-green-50 border border-green-200 rounded-2xl p-6 my-8">
        <h2 className="text-lg font-bold mb-2">
          💬 Añade tus figuritas del Mundial a WhatsApp
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          Después de generar, convierte tu PNG en un pack de stickers de WhatsApp
          en tres pasos:
        </p>
        <ol className="text-sm text-gray-600 space-y-1.5 list-decimal list-inside">
          <li>
            Toca <span className="font-medium">Descargar</span> en tu figurita
            generada.
          </li>
          <li>
            Abre una app gratuita de stickers de WhatsApp e importa el PNG.
          </li>
          <li>
            Añade el pack a WhatsApp y usa tus figuritas del Mundial en
            cualquier chat.
          </li>
        </ol>
      </section>

      {/* Ejemplos — marquee 轮播 */}
      <StickerMarquee
        stickers={getAllTeamShowcaseStickers()}
        title="Ejemplos de Figuritas del Mundial"
        subtitle="Figuritas reales hechas con nuestro creador con IA"
      />

      {/* FAQ */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Preguntas Frecuentes
        </h2>
        <div className="space-y-3">
          {FIGURITAS_FAQ.map((item) => (
            <details
              key={item.q}
              className="bg-white rounded-2xl p-5 shadow-sm group"
            >
              <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center">
                {item.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2">
                  ▾
                </span>
              </summary>
              <p className="text-sm text-gray-500 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 text-center">
        <h2 className="text-xl font-bold mb-3">
          ¿Listo para crear tus figuritas del Mundial?
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Gratis, sin registro, funciona en cualquier dispositivo
        </p>
        <a
          href="#top"
          className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl text-base active:scale-95 transition-transform"
        >
          ⚽ Crear Figurita del Mundial
        </a>
      </section>
    </main>
  );
}
