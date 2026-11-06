import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pl } from "@/i18n/pl";

export const metadata: Metadata = {
  title: "Realizacje — strony internetowe i aplikacje",
  description:
    "Zobacz projekty Kacpra Berneckiego: Motomizer, StarCars, BeatMarket i B-CRM. Prawdziwe widoki, opis funkcji i linki do działających stron.",
  alternates: { canonical: "https://bernecki.dev/case-studies" },
};

export default function CaseStudiesIndex() {
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://bernecki.dev/case-studies#collection",
    name: "Realizacje — strony internetowe, CRM i aplikacje",
    url: "https://bernecki.dev/case-studies",
    inLanguage: "pl-PL",
    about: ["tworzenie stron internetowych", "CRM", "aplikacje webowe"],
    author: { "@id": "https://bernecki.dev/#person" },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: pl.projects.items.length,
      itemListElement: pl.projects.items.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: p.title,
        url: "https://bernecki.dev" + p.caseStudyUrl,
      })),
    },
  };
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-32 md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd).replace(/</g, "\\u003c") }} />
      <p className="text-xs uppercase tracking-[0.24em] text-[#c2f970]">
        Realizacje
      </p>
      <h1 className="mt-5 text-4xl tracking-tight md:text-6xl">
        Od potrzeby do działającego projektu.
      </h1>
      <p className="mt-6 max-w-2xl leading-8 text-zinc-400">
        Strony firmowe, produktowe i aplikacje. Sprawdź, co robią, jak powstały
        i które rozwiązania mogą przydać się w Twojej firmie.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {pl.projects.items.map((p) => (
          <Link
            key={p.title}
            href={p.caseStudyUrl}
            className="overflow-hidden rounded-2xl border border-white/10 transition hover:border-[#c2f970]/50"
          >
            <Image
              src={p.image.src}
              alt={p.image.alt}
              width={1440}
              height={900}
              sizes="(min-width: 768px) 45vw, 95vw"
              className="aspect-[16/10] h-auto w-full object-cover object-top"
            />
            <div className="p-6">
              <h2 className="text-2xl text-[#e1f4c9]">{p.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                {p.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/#contact"
        className="mt-12 inline-flex rounded-xl bg-[#c2f970] px-6 py-4 text-black"
      >
        Porozmawiajmy o Twoim projekcie →
      </Link>
    </main>
  );
}
