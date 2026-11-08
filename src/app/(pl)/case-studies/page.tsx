import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pl } from "@/i18n/pl";
import { realizations } from "@/content/realizations";

export const metadata: Metadata = {
  title: "Realizacje — strony internetowe i aplikacje",
  description:
    "Realizacje Kacpra Berneckiego: B-CRM, Motomizer, StarCars, BeatMarket i case study kampanii Meta Ads Re-Energy System. Projekty, proces i wyniki.",
  alternates: { canonical:"https://bernecki.dev/case-studies",languages:{"pl-PL":"https://bernecki.dev/case-studies",en:"https://bernecki.dev/en/case-studies"} },
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
      numberOfItems: pl.projects.items.length + 1 + realizations.length,
      itemListElement: [...realizations.map(p=>({title:p.title,caseStudyUrl:`/realizacje/${p.slug}`})),{title:"Re-Energy System — Meta Ads", caseStudyUrl:"/case-studies/re-energy-meta-ads"}, ...pl.projects.items].map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: p.title,
        url: "https://bernecki.dev" + p.caseStudyUrl,
      })),
    },
  };
  return (
    <main className="site-page mx-auto min-h-screen max-w-7xl px-5 py-32 md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd).replace(/</g, "\\u003c") }} />
      <p className="text-xs uppercase tracking-[0.24em] text-white">
        Realizacje
      </p>
      <h1 className="mt-5 text-4xl tracking-tight md:text-6xl">
        Od potrzeby do działającego projektu.
      </h1>
      <p className="mt-6 max-w-2xl leading-8 text-white/70">
        Strony firmowe, produktowe i aplikacje. Sprawdź, co robią, jak powstały
        i które rozwiązania mogą przydać się w Twojej firmie.
      </p>
      <Link href="/case-studies/re-energy-meta-ads" className="surface-card mt-12 block rounded-2xl border border-white/25 bg-white/[0.04] p-7 transition hover:border-white/60 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/65">Nowe case study · Meta Ads / OZE</p>
        <h2 className="mt-3 text-3xl text-white md:text-4xl">Re-Energy System — kampanie leadowe napędzające sprzedaż</h2>
        <p className="mt-4 max-w-3xl leading-8 text-white/75">Przez około 2 lata kampanie Meta Ads wspierały pozyskiwanie klientów dla Re-Energy System. W 17 kampaniach leadowych pozyskano 2 331 kontaktów przy średnim koszcie 29,79 zł. Zobacz, jak połączyłem reklamy z obsługą zapytań.</p>
        <span className="mt-6 inline-block text-sm text-white underline underline-offset-4">Przeczytaj case study →</span>
      </Link>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {realizations.map(p=><Link key={p.slug} href={`/realizacje/${p.slug}`} className="surface-card rounded-2xl border border-white/15 p-6"><p className="text-xs text-[var(--brand-accent)]">{p.category}</p><h2 className="mt-4 text-2xl">{p.title}</h2><p className="mt-4 leading-7 text-white/70">{p.summary}</p></Link>)}
        {pl.projects.items.map((p) => (
          <Link
            key={p.title}
            href={p.caseStudyUrl}
            className="surface-card overflow-hidden rounded-2xl border border-white/10 transition hover:border-[var(--brand-accent)]"
          >
            <Image
              src={p.image.src}
              alt={p.image.alt}
              width={1440}
              height={900}
              sizes="(min-width: 768px) 45vw, 95vw"
              className="aspect-[16/10] h-auto w-full object-contain object-top"
            />
            <div className="p-6">
              <h2 className="text-2xl text-white">{p.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {p.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/#contact"
        className="mt-12 inline-flex rounded-xl brand-action px-6 py-4 text-black"
      >
        Porozmawiajmy o Twoim projekcie →
      </Link>
    </main>
  );
}
