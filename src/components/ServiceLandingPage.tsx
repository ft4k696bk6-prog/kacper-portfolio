import Link from "next/link";
import { guides } from "@/content/guides";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Code2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type ServiceLandingPageProps = {
  kind: "websites" | "apps" | "marketing";
};

const content = {
  websites: {
    title: "Strony internetowe dla małych firm — Kacper Bernecki",
    eyebrow: "Strony, landing page i strony usługowe",
    heading: "Dobra strona internetowa bez korporacyjnego narzutu.",
    intro:
      "Pomagam małym firmom i osobom z konkretnym pomysłem uruchomić szybką, estetyczną i skuteczną stronę internetową. Pracuję bez zbędnych warstw pośrednich: rozmawiasz bezpośrednio z osobą, która projektuje i buduje stronę.",
    bullets: [
      "strony firmowe i usługowe",
      "landing page pod kampanię lub konkretną ofertę",
      "strony produktów i marek",
      "formularze kontaktowe, analityka i integracje",
      "responsywny interfejs dopracowany na telefonie i desktopie",
    ],
    proof: "Zobacz Motomizer, StarCars i BeatMarket w projektach.",
    proofHref: "/#projects",
    serviceName: "Tworzenie stron internetowych",
    serviceDescription:
      "Projektowanie i budowa szybkich, responsywnych stron internetowych dla małych firm, usług i produktów.",
  },
  apps: {
    title: "CRM i aplikacje webowe dla firm — Kacper Bernecki",
    eyebrow: "CRM, dashboardy i narzędzia wewnętrzne",
    heading: "Aplikacja webowa dopasowana do Twojego procesu, nie odwrotnie.",
    intro:
      "Buduję praktyczne web appy dla firm, które wyrosły już z arkuszy, ręcznego przekazywania leadów albo kilku niespójnych narzędzi. Od CRM-u i panelu administracyjnego po formularze, role użytkowników i integracje API.",
    bullets: [
      "CRM-y i lead management",
      "dashboardy i panele administracyjne",
      "formularze, kalkulatory i workflow",
      "logowanie, role i uprawnienia",
      "integracje API, Supabase, PostgreSQL i deploy na Vercel",
    ],
    proof: "Najlepszy przykład: B-CRM DEMO i jego case study.",
    proofHref: "/case-studies/b-crm",
    serviceName: "Tworzenie CRM i aplikacji webowych",
    serviceDescription:
      "Projektowanie i budowa CRM-ów, dashboardów, paneli administracyjnych i aplikacji webowych dla procesów biznesowych.",
  },
  marketing: {
    title: "Marketing, reklamy i social media — Kacper Bernecki",
    eyebrow: "Marketing, reklamy i prowadzenie social mediów",
    heading: "Reklama ma prowadzić do działania, nie tylko do ładnej strony.",
    intro:
      "Pomagam firmom połączyć reklamy, social media i stronę w spójną komunikację. Zakres może obejmować prowadzenie profili, przygotowanie treści, obsługę reklam oraz landing page z pomiarem zapytań. Ustalamy go pod Twoją ofertę, odbiorców i budżet.",
    bullets: [
      "prowadzenie social mediów i przygotowanie komunikacji marki",
      "obsługa reklam z ustalonym celem i budżetem",
      "landing page pod Google Ads, Meta Ads i kampanie lokalne",
      "strony ofertowe z jasnym CTA i formularzem",
      "formularze leadowe, newslettery i przekazywanie zapytań",
      "analityka, zdarzenia i podstawowe śledzenie konwersji",
      "szybkie poprawki i iteracje na podstawie danych",
    ],
    proof: "Re-Energy System: case study kampanii Meta Ads i pozyskiwania leadów.",
    proofHref: "/case-studies/re-energy-meta-ads",
    serviceName: "Marketing, reklamy i prowadzenie social mediów",
    serviceDescription:
      "Prowadzenie social mediów, marketing, obsługa reklam oraz budowa stron kampanii i przepływów zapytań.",
  },
} as const;

export function ServiceLandingPage({ kind }: ServiceLandingPageProps) {
  const page = content[kind];
  const slug = {
    websites: "tworzenie-stron-internetowych",
    apps: "crm-i-aplikacje-webowe",
    marketing: "marketing-i-reklamy",
  }[kind];
  const examples =
    kind === "apps"
      ? [
          { name: "B-CRM", slug: "b-crm", image: "bcrm-admin-dashboard.jpg" },
          {
            name: "BeatMarket",
            slug: "beatmarket",
            image: "beatmarket-live.jpg",
          },
        ]
      : [
          { name: "Motomizer", slug: "motomizer", image: "motomizer-live.jpg" },
          { name: "StarCars", slug: "starcars", image: "starcars-live.jpg" },
        ];
  const faq = [
    {
      question: "Czy pracuję bezpośrednio z klientem?",
      answer:
        "Tak. Nie jestem dużą agencją — kontaktujesz się bezpośrednio z osobą, która analizuje problem, buduje rozwiązanie i odpowiada za jakość wykonania.",
    },
    {
      question: "Czy można zacząć od małego zakresu?",
      answer:
        "Tak. Możemy zacząć od landing page, pierwszej wersji CRM-u albo konkretnego fragmentu procesu i rozwijać rozwiązanie etapami.",
    },
    {
      question: "Czy dostanę uczciwą wycenę?",
      answer:
        "Tak. Najpierw ustalamy cel, zakres i ryzyka, a potem dostajesz konkretną wycenę. Nie sprzedaję pakietu korporacyjnych dodatków, których nie potrzebujesz.",
    },
    {
      question: "Czy pracuję z klientami z całej Polski?",
      answer:
        "Tak. Pracuję zdalnie, a rozmowę i ustalenia możemy prowadzić online.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://bernecki.dev/${slug}#service`,
        name: page.serviceName,
        provider: {
          "@type": "Person",
          "@id": "https://bernecki.dev/#person",
          name: "Kacper Bernecki",
          url: "https://bernecki.dev",
        },
        areaServed: "PL",
        serviceType: page.serviceName,
        description: page.serviceDescription,
        url: `https://bernecki.dev/${slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <main className="site-page min-h-screen bg-[var(--brand-black)] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-sm text-white hover:text-white"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md brand-outline bg-[var(--brand-black)] text-xs">
              KB
            </span>
            Kacper Bernecki
          </Link>
          <p className="page-eyebrow mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {page.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">
            {page.heading}
          </h1>
          <p className="page-intro mt-7 max-w-3xl text-lg">
            {page.intro}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/#contact"
              className="brand-action glass-action inline-flex items-center justify-center gap-2 rounded-md  px-6 py-3 text-black transition hover:-translate-y-0.5"
            >
              Porozmawiajmy o projekcie <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={page.proofHref}
              className="glass-action inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-6 py-3 text-white transition hover:border-[var(--brand-accent)] hover:text-white"
            >
              {page.proof} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {kind === "marketing" && (
        <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <div className="surface-card rounded-2xl border border-white/20 bg-white/[0.035] p-6 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-white/65">Z praktyki · Re-Energy System</p>
            <h2 className="mt-4 max-w-3xl text-3xl text-white md:text-4xl">Kampanie, które przez około 2 lata są źródłem zapytań dla firmy OZE.</h2>
            <p className="mt-5 max-w-3xl leading-8 text-white/75">Z udostępnionych zrzutów Meta Ads wynika 2 331 kontaktów przy średnim koszcie około 29,79 zł w 17 wybranych kampaniach. Właściciel deklaruje około 90 tys. zł wydatków reklamowych w całym okresie i wielomilionowy obrót firmy. Nie są to statystyki zamkniętych sprzedaży ani ROAS.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/case-studies/re-energy-meta-ads" className="inline-flex items-center gap-2 rounded-lg brand-outline px-5 py-3 text-white">Zobacz pełne case study <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/reklamy-meta-ads-dla-firm" className="inline-flex items-center gap-2 px-5 py-3 text-white/80">Jak prowadzę kampanie Meta Ads <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      )}
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-24">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-white">
            Co mogę zrobić
          </p>
          <h2 className="mt-4 text-3xl">
            Konkretny zakres, jasna rozmowa, porządne wykonanie.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {page.bullets.map((bullet) => (
            <div
              key={bullet}
              className="surface-card flex gap-3 rounded-xl border border-white/10 bg-[var(--brand-black)] p-4 text-white"
            >
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-white" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--brand-black)] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.18em] text-white">
            Dlaczego ze mną
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [
                MessageCircle,
                "Bezpośredni kontakt",
                "Rozmawiasz z wykonawcą, nie z handlowcem przekazującym brief dalej.",
              ],
              [
                Code2,
                "Technologia użyteczna",
                "Dobieram stack do problemu i buduję rozwiązania, które można później rozwijać.",
              ],
              [
                ShieldCheck,
                "Skrupulatność",
                "Pilnuję szczegółów, stanów błędów, responsywności, formularzy i rzeczy, które często są pomijane.",
              ],
            ].map(([Icon, title, description]) => (
              <div
                key={title as string}
                className="surface-card rounded-2xl border border-white/10 bg-[var(--brand-black)] p-6"
              >
                <Icon className="h-6 w-6 text-white" />
                <h3 className="mt-5 text-xl">{title as string}</h3>
                <p className="mt-3 leading-7 text-white/70">
                  {description as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-3xl tracking-tight">
          Zobacz przykłady, zanim podejmiesz decyzję.
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {examples.map((example) => (
            <Link
              key={example.slug}
              href={`/case-studies/${example.slug}`}
              className="surface-card group overflow-hidden rounded-2xl border border-white/10 bg-[var(--brand-black)] transition hover:border-[var(--brand-accent)]"
            >
              <Image
                src={`/images/projects/${example.image}`}
                alt={`Projekt ${example.name} — rzeczywisty widok strony`}
                width={1440}
                height={900}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="h-auto w-full"
              />
              <p className="flex items-center justify-between p-5 text-white">
                {example.name}
                <ArrowRight className="h-4 w-4" />
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <h2 className="text-3xl">Przygotuj się do rozmowy</h2>
        {guides.filter(g => g.service === `/${slug}`).map(g => <Link key={g.slug} href={`/poradniki/${g.slug}`} className="surface-card mt-6 block rounded-xl border border-white/30 p-6">
          <h3 className="text-xl text-white">{g.title} →</h3><p className="mt-3 leading-7 text-white/70">{g.description}</p>
        </Link>)}
        {kind === "marketing" && <div className="mt-6 flex flex-wrap gap-3 text-sm"><Link href="/poradniki/ile-kosztuje-lead-z-facebook-ads" className="underline underline-offset-4">Koszt leada i CPL →</Link><Link href="/poradniki/facebook-lead-ads-integracja-z-crm" className="underline underline-offset-4">Leady Meta i CRM →</Link><Link href="/poradniki/reklamy-oze-magazyny-energii" className="underline underline-offset-4">Marketing OZE →</Link></div>}
        <p className="mt-6 leading-7 text-white/70">{kind === "marketing" ? "Budżet reklamowy i koszt obsługi ustalamy osobno. Przed startem uzgadniamy ofertę, kanały, materiały i sposób oceny zapytań." : "Do rozmowy przygotuj cel projektu, najważniejsze funkcje, dostępne materiały i oczekiwany termin. Zakres i wycenę ustalamy przed rozpoczęciem prac."}</p>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm uppercase tracking-[0.18em] text-white">
          Najczęstsze pytania
        </p>
        <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-[var(--brand-black)] px-5">
          {faq.map((item) => (
            <div key={item.question} className="py-6">
              <h2 className="text-lg text-white">{item.question}</h2>
              <p className="mt-3 leading-7 text-white/70">{item.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/#contact"
            className="brand-action glass-action inline-flex items-center gap-2 rounded-md  px-6 py-3 text-black transition hover:-translate-y-0.5"
          >
            Opisz, czego potrzebujesz <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
