import type { Metadata } from "next";
import Link from "next/link";
import StickerPackStudio from "@/components/StickerPackStudio";

export const metadata: Metadata = {
  title: "Pet Sticker Maker — Turn Your Pet Photo Into a Sticker Pack | StickerSit",
  description:
    "Upload a photo of your cat or dog and create six consistent reaction stickers. Free AI pet sticker maker — transparent PNGs, ZIP download, no sign up.",
  alternates: { canonical: "https://stickersit.com/pet-sticker-maker" },
  openGraph: {
    title: "Pet Sticker Maker — Turn Your Pet Photo Into a Sticker Pack",
    description:
      "Upload a photo of your cat or dog and create six consistent reaction stickers. Free, no sign up.",
    type: "website",
    url: "https://stickersit.com/pet-sticker-maker",
    siteName: "StickerSit",
    images: [{ url: "/thumbnail.png", width: 1200, height: 630, alt: "StickerSit Pet Sticker Maker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pet Sticker Maker — Turn Your Pet Photo Into a Sticker Pack",
    description:
      "Upload a photo of your cat or dog and create six consistent reaction stickers. Free, no sign up.",
    images: ["/thumbnail.png"],
  },
};

const PET_FAQ = [
  {
    q: "What kind of pet photos work best?",
    a: "A clear, well-lit photo where your pet's face and markings are fully visible — fur patterns, colors, and any distinctive features like ear shapes or patches. One pet per photo gives the most consistent pack; multi-pet photos can work but the AI may shift which animal it focuses on between stickers.",
  },
  {
    q: "Will all six stickers look like MY pet?",
    a: "The generator locks onto your pet's identity from the reference photo — fur color, tabby patterns, patches, and proportions — and keeps those constant while changing only the expression. Reactions like laughing, love, and shocked keep the same animal across the whole pack.",
  },
  {
    q: "Are the stickers transparent PNGs?",
    a: "Yes. Every sticker is a 512×512 transparent PNG (with a WebP copy for WhatsApp and Telegram in the ZIP). Backgrounds are removed automatically, so they sit cleanly on any chat bubble.",
  },
  {
    q: "Do you store my pet's photo?",
    a: "No. Your photo is used only to generate the stickers and is never saved to a database or shown to other users. Refresh the page and it's gone.",
  },
];

export default function PetStickerMakerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PET_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "StickerSit Pet Sticker Maker",
    url: "https://stickersit.com/pet-sticker-maker",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      <section className="text-center mb-8">
        <div className="inline-block bg-black text-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] mb-5">
          Free AI Pet Sticker Maker
        </div>
        <h1 className="text-3xl md:text-4xl font-black leading-[1.05] mb-4 tracking-tighter">
          Turn Your Pet Photo Into a <span className="text-accent">Sticker Pack</span>
        </h1>
        <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
          Upload a photo of your cat or dog and create six consistent reaction stickers.
        </p>
      </section>

      <StickerPackStudio
        landingId="/pet-sticker-maker"
        uploadTitle="Upload Your Pet Photo"
        uploadHint="A clear photo of your cat, dog, or any pet — face and markings visible works best. JPG, PNG or WebP, up to 10 MB."
        uploadCta="Upload Pet Photo"
      />

      <section className="py-14">
        <h2 className="text-2xl font-bold text-center mb-3">Same Pet, Six Reactions</h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          One orange tabby became this whole pack — yours can too
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <figure className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/examples/pack/reference.jpg"
              alt="Reference photo of an orange tabby cat"
              width={400}
              height={400}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-black/10 shadow-sm"
              loading="lazy"
            />
            <figcaption className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
              1 Pet Photo
            </figcaption>
          </figure>
          <span className="text-2xl font-black text-gray-300">→</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { src: "/examples/pack/laughing.png", alt: "Laughing cat sticker" },
              { src: "/examples/pack/love.png", alt: "In-love cat sticker" },
              { src: "/examples/pack/shocked.png", alt: "Shocked cat sticker" },
              { src: "/examples/pack/angry.png", alt: "Angry cat sticker" },
              { src: "/examples/pack/crying.png", alt: "Crying cat sticker" },
              { src: "/examples/pack/sleepy.png", alt: "Sleepy cat sticker" },
            ].map((item) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={item.src}
                src={item.src}
                alt={item.alt}
                width={512}
                height={512}
                className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-xl object-cover bg-white shadow-sm border border-black/5"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 border-t-2 border-black/5">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              n: "01",
              t: "Upload a Pet Photo",
              d: "Pick a clear shot of your cat or dog — markings and face visible.",
            },
            {
              n: "02",
              t: "Generate the Pack",
              d: "Six reaction stickers with the background removed automatically.",
            },
            {
              n: "03",
              t: "Download & Share",
              d: "Transparent PNGs (plus WebP for WhatsApp/Telegram) in one ZIP.",
            },
          ].map((s) => (
            <div key={s.n} className="bg-white rounded-xl p-5 shadow-sm text-center">
              <span className="bg-black text-white font-black text-sm w-9 h-9 rounded-lg inline-flex items-center justify-center mb-3">
                {s.n}
              </span>
              <h3 className="font-bold text-sm mb-1.5">{s.t}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 border-t-2 border-black/5">
        <h2 className="text-2xl font-bold text-center mb-6">Why Pets Make the Best Sticker Packs</h2>
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto text-sm text-gray-600">
          <p>
            <strong className="text-gray-800">Distinctive markings travel well.</strong> A tabby&apos;s
            stripes, a tuxedo cat&apos;s white chest, a husky&apos;s mask — identity features the AI locks
            onto and preserves across every sticker in the pack.
          </p>
          <p>
            <strong className="text-gray-800">Pets are conversation glue.</strong> Group chats already
            revolve around pet photos; a reaction pack of <em>your own</em> animal lands better than any
            generic meme sticker ever could.
          </p>
        </div>
      </section>

      <section className="py-10 border-t-2 border-black/5">
        <h2 className="text-2xl font-bold text-center mb-8">Pet Sticker FAQ</h2>
        <div className="space-y-3 max-w-2xl mx-auto">
          {PET_FAQ.map((item) => (
            <details key={item.q} className="bg-white rounded-2xl p-5 shadow-sm">
              <summary className="font-semibold text-sm cursor-pointer">{item.q}</summary>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="py-10 text-center border-t-2 border-black/5">
        <p className="text-sm text-gray-500 mb-4">
          Want stickers of people, characters, or anything else?
        </p>
        <Link
          href="/"
          className="text-violet-600 font-bold text-sm underline underline-offset-4 hover:text-violet-700"
        >
          Try the main Sticker Pack Maker →
        </Link>
      </section>
    </main>
  );
}
