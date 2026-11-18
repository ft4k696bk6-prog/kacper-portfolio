import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocalOffer } from "@/lib/local-offers";
import { commercialServiceDetails, commercialServiceSlugs } from "@/content/commercial-services";

type Props = { params: Promise<{ usluga: string }> };
const base = "https://bernecki.dev";

const startupScopes: Record<string, { intro: string; scope: string[]; check: string[]; result: string }> = {
  "mvp-dla-startupow": {
    intro: "Zamieniam pomysł na możliwy do przetestowania produkt: od ustalenia najważniejszej funkcji po pierwsze wdrożenie aplikacji.",
    scope: [
      "Rozmowa o odbiorcy, modelu przychodów i największej niewiadomej",
      "Wybór jednej ścieżki użytkownika do pierwszej wersji",
      "Makieta kluczowych ekranów, model danych i podział funkcji",
      "Budowa aplikacji, logowania i podstawowego panelu administracyjnego",
      "Testy z użytkownikami i plan następnych iteracji",
    ],
    check: [
      "Kto ma użyć pierwszej wersji i za co zapłacić?",
      "Której funkcji nie można pominąć w teście?",
      "Ile kosztuje dalsze utrzymanie produktu?",
    ],
    result: "Pierwsza używalna wersja produktu, której zakres można rozwijać na podstawie informacji zwrotnej.",
  },
  "aplikacje-saas": {
    intro: "Projektuję narzędzia SaaS z kontami firm, uprawnieniami i funkcją produktu, za którą można pobierać opłatę.",
    scope: [
      "Model organizacji, subskrypcji i dostępu do danych",
      "Autoryzacja, role użytkowników i izolacja danych firm",
      "Wdrożenie kluczowej funkcji i panelu klienta",
      "Integracja płatności po uzgodnieniu operatora i zasad rozliczeń",
      "Testy uprawnień, limitów oraz obsługi błędów",
    ],
    check: [
      "Kto płaci i z czego wynika wartość abonamentu?",
      "Czy dane klientów są od siebie odizolowane?",
      "Czy wersja pierwsza poradzi sobie bez kosztownych modułów?",
    ],
    result: "Podstawa platformy subskrypcyjnej z ustalonym zakresem i ścieżką rozbudowy.",
  },
};

function getOffer(slug: string) {
  const offer = getLocalOffer(slug);
  if (offer) return offer;
  return startupScopes[slug] ?? null;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return commercialServiceSlugs.map((usluga) => ({ usluga }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { usluga } = await params;
  const service = commercialServiceDetails[usluga];
  const offer = getOffer(usluga);
  if (!service || !offer) return {};
  const url = `${base}/oferta/${usluga}`;
  const withBrand = service.title + " | Bernecki.dev";
  const seoTitle = withBrand.length <= 60
    ? withBrand
    : service.title.length <= 60
      ? service.title
      : service.title.slice(0, 60).replace(/\\s+\\S*$/, "").replace(/[\\s–—-]+$/, "");
  return {
    title: { absolute: seoTitle },
    description: `${offer.intro} ${service.decision}`.slice(0, 158),
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      url,
      title: service.title,
      description: offer.intro,
    },
  };
}

export default async function ServiceHubPage({ params }: Props) {
  const { usluga } = await params;
  const service = commercialServiceDetails[usluga];
  const offer = getOffer(usluga);
  if (!service || !offer) notFound();
  const url = `${base}/oferta/${usluga}`;
  const nearby = commercialServiceSlugs.filter((slug) => slug !== usluga && commercialServiceDetails[slug].category === service.category).slice(0, 3);
  const other = nearby.length > 0 ? nearby : commercialServiceSlugs.filter((slug) => slug !== usluga).slice(0, 3);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url + "#webpage",
        url,
        name: service.title,
        inLanguage: "pl-PL",
        isPartOf: { "@id": base + "/#website" },
      },
      {
        "@type": "Service",
        "@id": url + "#service",
        name: service.title,
        serviceType: service.category,
        description: offer.intro,
        provider: { "@type": "Person", "@id": base + "/#person" },
        areaServed: { "@type": "Country", name: "Polska" },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Start", item: base },
          { "@type": "ListItem", position: 2, name: "Usługi", item: base + "/uslugi" },
          { "@type": "ListItem", position: 3, name: service.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="site-page min-h-screen bg-[var(--brand-black)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-8 md:pt-36">
        <nav aria-label="Ścieżka nawigacji" className="text-sm text-white/60">
          <Link href="/" className="underline underline-offset-4">Start</Link> /{" "}
          <Link href="/uslugi" className="underline underline-offset-4">Usługi</Link> / <span>{service.title}</span>
        </nav>
        <header className="mt-12 border-b border-white/15 pb-16">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/55">{service.category} · oferta dla firm</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">{service.title}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">{offer.intro}</p>
          <p className="mt-5 max-w-3xl leading-8 text-white/70">{service.problem}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href={`/kontakt?usluga=${encodeURIComponent(service.title)}`} className="brand-action inline-flex items-center rounded-lg px-6 py-4 font-semibold text-black">
              Omów projekt i wycenę
            </Link>
            <Link href={service.proofUrl} className="inline-flex items-center rounded-lg border border-white/25 px-6 py-4 hover:border-white/60">
              Zobacz powiązany projekt lub materiał
            </Link>
          </div>
        </header>

        <section className="grid gap-10 border-b border-white/15 py-16 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[.16em] text-white/55">Praktyczne zastosowanie</p>
            <h2 className="mt-3 text-3xl font-semibold">Jak może wyglądać wdrożenie?</h2>
          </div>
          <div>
            <p className="leading-8 text-white/80">{service.scenario}</p>
            <p className="mt-6 rounded-xl border border-white/15 bg-white/[.035] p-6 leading-7 text-white/75">{service.decision}</p>
          </div>
        </section>

        <section className="border-b border-white/15 py-16">
          <h2 className="text-3xl font-semibold">Co obejmuje współpraca?</h2>
          <p className="mt-4 max-w-3xl leading-7 text-white/60">Dobieramy zakres do obecnych narzędzi i budżetu. Przed wdrożeniem ustalamy odpowiedzialność za materiały, dane i testy.</p>
          <ol className="mt-9 grid gap-4 md:grid-cols-2">
            {offer.scope.map((step, i) => (
              <li key={step} className="rounded-2xl border border-white/15 bg-white/[.03] p-6">
                <span className="text-sm tabular-nums text-white/45">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 leading-7 text-white/80">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-12 border-b border-white/15 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Co ustalić przed wyceną?</h2>
            <ul className="mt-6 list-disc space-y-4 pl-5 leading-8 text-white/75">
              {offer.check.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Jaki jest oczekiwany efekt?</h2>
            <p className="mt-6 leading-8 text-white/75">{offer.result}</p>
            <h3 className="mt-8 text-lg font-semibold">Granice i ryzyka</h3>
            <p className="mt-3 leading-8 text-white/70">{service.caution}</p>
          </div>
        </section>

        <section className="grid gap-6 border-b border-white/15 py-16 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[.16em] text-white/55">Realizacje i kontekst</p>
            <h2 className="mt-4 text-2xl font-semibold">Sprawdź przykład i zakres mojego doświadczenia</h2>
            <p className="mt-4 max-w-2xl leading-7 text-white/70">Przykład pokazuje powiązane doświadczenie lub sposób pracy. Nie oznacza automatycznie, że wskazana funkcja została już wdrożona w tym projekcie.</p>
          </div>
          <Link href={service.proofUrl} className="inline-flex items-center rounded-lg border border-white/25 px-6 py-4 underline underline-offset-4 hover:border-white/60">
            {service.proofLabel}
          </Link>
        </section>

        <nav aria-label="Powiązane usługi" className="py-16">
          <h2 className="text-2xl font-semibold">Powiązane usługi</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {other.map((slug) => (
              <Link key={slug} href={`/oferta/${slug}`} className="rounded-xl border border-white/15 p-5 hover:border-white/50">
                {commercialServiceDetails[slug].title}
              </Link>
            ))}
          </div>
          <Link href="/uslugi" className="mt-8 inline-block underline underline-offset-4">Wszystkie usługi dla firm</Link>
        </nav>

        <section className="rounded-3xl bg-white p-8 text-black md:p-12">
          <h2 className="max-w-2xl text-3xl font-semibold">Opisz problem. Dobierzemy odpowiedni zakres.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-black/70">Nie potrzebujesz gotowej specyfikacji. Wystarczy cel, obecne rozwiązanie i oczekiwany rezultat. W odpowiedzi możemy ustalić następne kroki oraz orientacyjny zakres.</p>
          <Link href={`/kontakt?usluga=${encodeURIComponent(service.title)}`} className="mt-7 inline-flex rounded-lg bg-black px-6 py-4 font-semibold text-white">Zapytaj o realizację</Link>
        </section>
      </div>
    </main>
  );
}
