import Link from "next/link";
import { ArrowRight, Check, Code2, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

type ServiceLandingPageProps = {
  kind: "websites" | "apps";
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
} as const;

export function ServiceLandingPage({ kind }: ServiceLandingPageProps) {
  const page = content[kind];
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
        "@type": "ProfessionalService",
        "@id": `https://bernecki.dev/${kind}#service`,
        name: page.serviceName,
        provider: { "@id": "https://bernecki.dev/#person" },
        areaServed: "PL",
        serviceType: page.serviceName,
        description: page.serviceDescription,
        url: `https://bernecki.dev/${kind}`,
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
    <main className="min-h-screen bg-[#070707] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36 md:px-8 md:pb-28 md:pt-44">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(215,180,106,0.18),transparent_34%),radial-gradient(circle_at_82%_25%,rgba(34,83,67,0.2),transparent_34%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-[#f5dfae] hover:text-white">
            <span className="grid h-8 w-8 place-items-center rounded-md border border-[#d7b46a]/40 bg-[#d7b46a]/10 text-xs">KB</span>
            Kacper Bernecki
          </Link>
          <p className="mb-5 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#d7b46a]">
            <Sparkles className="h-4 w-4" />
            {page.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl leading-tight sm:text-6xl">{page.heading}</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300">{page.intro}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d7b46a] px-6 py-3 text-black transition hover:-translate-y-0.5">
              Porozmawiajmy o projekcie <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={page.proofHref} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-6 py-3 text-zinc-200 transition hover:border-[#d7b46a]/60 hover:text-[#f5dfae]">
              {page.proof} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-24">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#d7b46a]">Co mogę zrobić</p>
          <h2 className="mt-4 text-3xl">Konkretny zakres, jasna rozmowa, porządne wykonanie.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {page.bullets.map((bullet) => (
            <div key={bullet} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4 text-zinc-200">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#d7b46a]" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.18em] text-[#d7b46a]">Dlaczego ze mną</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              [MessageCircle, "Bezpośredni kontakt", "Rozmawiasz z wykonawcą, nie z handlowcem przekazującym brief dalej."],
              [Code2, "Technologia użyteczna", "Dobieram stack do problemu i buduję rozwiązania, które można później rozwijać."],
              [ShieldCheck, "Skrupulatność", "Pilnuję szczegółów, stanów błędów, responsywności, formularzy i rzeczy, które często są pomijane."],
            ].map(([Icon, title, description]) => (
              <div key={title as string} className="rounded-2xl border border-white/10 bg-[#0b0b0b] p-6">
                <Icon className="h-6 w-6 text-[#d7b46a]" />
                <h3 className="mt-5 text-xl">{title as string}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{description as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-sm uppercase tracking-[0.18em] text-[#d7b46a]">Najczęstsze pytania</p>
        <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] px-5">
          {faq.map((item) => (
            <div key={item.question} className="py-6">
              <h2 className="text-lg text-white">{item.question}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{item.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/#contact" className="inline-flex items-center gap-2 rounded-md bg-[#d7b46a] px-6 py-3 text-black transition hover:-translate-y-0.5">
            Opisz, czego potrzebujesz <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
