import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceCity, serviceCities } from "@/lib/service-cities";
import { seoTitle } from "@/lib/seo";

type PageProps = { params: Promise<{ miasto: string }> };
const base = "https://bernecki.dev";

const services = [
  {
    name: "Strony internetowe i landing page",
    slug: "strony-internetowe",
    href: "/tworzenie-stron-internetowych",
    copy: "Strony firmowe, strony usługowe i landing page z czytelną ofertą, formularzem kontaktowym, poprawnym działaniem na telefonie oraz podstawami technicznego SEO.",
    question: "Czy obecna strona wyjaśnia usługę i prowadzi klienta do kontaktu?",
  },
  {
    name: "CRM i aplikacje webowe",
    slug: "crm",
    href: "/crm-i-aplikacje-webowe",
    copy: "Indywidualne systemy do obsługi leadów, klientów, statusów, zadań i kalendarzy. Zakres zależy od procesu sprzedaży, uprawnień użytkowników i niezbędnych integracji.",
    question: "Czy leady, telefony i zadania są w jednym miejscu?",
  },
  {
    name: "Marketing internetowy i reklamy",
    slug: "marketing",
    href: "/marketing-i-reklamy",
    copy: "Strategia pozyskiwania zapytań, kampanie reklamowe oraz poprawa skuteczności strony. Pomiar opiera się na realnych kontaktach i kosztach, nie wyłącznie na odsłonach.",
    question: "Które kampanie faktycznie generują wartościowe zapytania?",
  },
  {
    name: "Automatyzacje i AI dla firm",
    slug: "ai",
    href: "/wdrozenia-ai-dla-firm",
    copy: "Asystenci AI, formularze, powiadomienia, przekazywanie danych do CRM i automatyzacja powtarzalnych czynności — z kontrolą kosztów, bezpieczeństwa i dostępu.",
    question: "Które powtarzalne czynności można bezpiecznie zautomatyzować?",
  },
  {
    name: "Rozwój biznesu i procesów sprzedaży",
    slug: "biznes",
    href: "/rozwoj-biznesu",
    copy: "Porządkowanie ścieżki klienta, oferty, sposobu kontaktu i obsługi zapytań. Celem jest działający proces, a nie samo wdrożenie kolejnego narzędzia.",
    question: "Gdzie firma traci szanse sprzedażowe pomiędzy reklamą a ofertą?",
  },
] as const;

export function generateStaticParams() {
  return serviceCities.map(({ slug }) => ({ miasto: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { miasto } = await params;
  const city = getServiceCity(miasto);
  if (!city) return {};
  const title = `Strony, CRM, marketing i AI dla firm – ${city.name}`;
  const description = `Tworzenie stron internetowych, CRM, aplikacje, reklamy i automatyzacje AI dla firm ${city.from}. Obsługa zdalna w całej Polsce, zakres i wycena ustalane indywidualnie.`;
  const url = `${base}/uslugi/${city.slug}`;
  return {
    title: { absolute: seoTitle(title) },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, locale: "pl_PL", type: "website" },
  };
}

export default async function CityServicesPage({ params }: PageProps) {
  const { miasto } = await params;
  const city = getServiceCity(miasto);
  if (!city) notFound();
  const url = `${base}/uslugi/${city.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url + "#webpage",
        url,
        name: `Strony, CRM, marketing i AI dla firm – ${city.name}`,
        inLanguage: "pl-PL",
        isPartOf: { "@id": base + "/#website" },
        about: services.map((service) => ({ "@type": "Service", name: service.name })),
      },
      {
        "@type": "OfferCatalog",
        "@id": url + "#services",
        name: `Usługi cyfrowe dla firm – ${city.name}`,
        itemListElement: services.map((service) => ({
          "@type": "OfferCatalog",
          name: service.name,
          url: base + service.href,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "#breadcrumbs",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Strona główna", item: base },
          { "@type": "ListItem", position: 2, name: "Usługi dla firm", item: base + "/uslugi" },
          { "@type": "ListItem", position: 3, name: city.name, item: url },
        ],
      },
    ],
  };

  return (
    <main className="relative z-10 min-h-screen bg-[var(--brand-black)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="mx-auto max-w-6xl px-5 pb-14 pt-28 md:px-8 md:pt-36">
        <nav aria-label="Ścieżka nawigacji" className="mb-10 text-sm text-white/60">
          <Link href="/" className="hover:text-white">Start</Link> / <Link href="/uslugi" className="hover:text-white">Usługi</Link> / <span>{city.name}</span>
        </nav>
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-white/60">Współpraca zdalna · Cała Polska</p>
        <h1 className="max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">
          Strony internetowe, CRM, marketing i AI dla firm — {city.name}
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
          Pomagam przedsiębiorcom {city.from} rozwijać ofertę i sprzedaż z wykorzystaniem technologii.
          Projektuję strony, wdrażam systemy CRM, aplikacje, marketing i automatyzacje. 
          Współpracę można prowadzić zdalnie — nie deklaruję lokalnego biura w każdym z wymienionych miast.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/kontakt" className="rounded-full bg-white px-7 py-4 font-semibold text-black hover:bg-white/85">Porozmawiaj o projekcie</Link>
          <Link href="/case-studies" className="rounded-full border border-white/25 px-7 py-4 font-medium hover:border-white/60">Zobacz realizacje</Link>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.03] px-5 py-16 md:px-8" aria-labelledby="zakres">
        <div className="mx-auto max-w-6xl">
          <h2 id="zakres" className="text-3xl font-semibold md:text-4xl">W czym pomagam {city.adjective} firmom?</h2>
          <p className="mt-4 max-w-3xl leading-7 text-white/65">
            Oferta jest przeznaczona m.in. dla {city.regionalContext}. Każde wdrożenie zaczyna się od określenia celu i zakresu prac.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {services.map((service, index) => (
              <article key={service.slug} className="rounded-2xl border border-white/10 bg-white/[0.045] p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/45">0{index + 1} / Usługa</p>
                <h3 className="mt-4 text-2xl font-semibold">{service.name}</h3>
                <p className="mt-3 leading-7 text-white/70">{service.copy}</p>
                <p className="mt-5 border-l-2 border-white/20 pl-4 text-sm text-white/60">{service.question}</p>
                <Link className="mt-6 inline-block font-medium underline underline-offset-4" href={service.href}>
                  Poznaj zakres usługi
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-3xl font-semibold">Jak wygląda współpraca z firmą {city.from}?</h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          <li className="rounded-xl border border-white/10 p-6"><strong>01. Rozmowa</strong><p className="mt-3 leading-7 text-white/65">Ustalamy problem biznesowy, obecne narzędzia i oczekiwany rezultat.</p></li>
          <li className="rounded-xl border border-white/10 p-6"><strong>02. Zakres i wycena</strong><p className="mt-3 leading-7 text-white/65">Dopasowujemy funkcje, terminy i sposób rozliczenia do projektu.</p></li>
          <li className="rounded-xl border border-white/10 p-6"><strong>03. Wdrożenie</strong><p className="mt-3 leading-7 text-white/65">Pracujemy zdalnie, testujemy rozwiązanie i omawiamy dalszy rozwój.</p></li>
        </ol>
        <div className="mt-12 rounded-2xl bg-white p-8 text-black md:p-10">
          <h2 className="text-2xl font-semibold">Masz projekt {city.where}?</h2>
          <p className="mt-3 max-w-2xl leading-7 text-black/70">
            Opisz, czego potrzebujesz: strony, CRM, reklamy, AI czy połączenia kilku usług. 
            W odpowiedzi ustalimy zakres i następny krok. Nie podaję sztywnej ceny bez poznania wymagań.
          </p>
          <Link href="/kontakt" className="mt-6 inline-block rounded-full bg-black px-7 py-4 font-semibold text-white">
            Kontakt i wycena
          </Link>
        </div>
      </section>
      <nav aria-label="Pozostałe miasta" className="mx-auto max-w-6xl px-5 pb-16 md:px-8">
        <h2 className="mb-5 text-lg font-semibold">Współpraca także w innych miastach</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          {serviceCities.filter((item) => item.slug !== city.slug).map((item) => (
            <Link className="rounded-full border border-white/15 px-4 py-2 text-white/70 hover:text-white" href={`/uslugi/${item.slug}`} key={item.slug}>{item.name}</Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
