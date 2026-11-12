import type { Metadata } from "next";
import Link from "next/link";
import { serviceCities } from "@/lib/service-cities";

export const metadata: Metadata = {
  title: "Strony internetowe, CRM, marketing i AI — obsługa firm w całej Polsce",
  description: "Usługi tworzenia stron internetowych, CRM, aplikacji, marketingu i automatyzacji AI dla firm z całej Polski. Przegląd obsługiwanych miast i sposobu współpracy.",
  alternates: { canonical: "https://bernecki.dev/uslugi" },
};

const offers = [
  ["Strony internetowe", "/tworzenie-stron-internetowych"],
  ["CRM i aplikacje webowe", "/crm-i-aplikacje-webowe"],
  ["Marketing i reklamy", "/marketing-i-reklamy"],
  ["Google Ads – reklamy w Google", "/google-ads-dla-firm"],
  ["AI i automatyzacje", "/wdrozenia-ai-dla-firm"],
  ["Rozwój biznesu", "/rozwoj-biznesu"],
  ["Partner w rozwoju biznesu", "/partner-w-rozwoju-biznesu"],
] as const;

const servicesSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://bernecki.dev/uslugi#webpage",
      url: "https://bernecki.dev/uslugi",
      name: "Usługi IT, CRM, strony internetowe i marketing dla firm",
      inLanguage: "pl-PL",
      isPartOf: { "@id": "https://bernecki.dev/#website" },
      about: { "@id": "https://bernecki.dev/#person" },
    },
    {
      "@type": "ItemList",
      name: "Usługi Kacpra Berneckiego dla firm w Polsce",
      itemListElement: offers.map(([name, href], index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
        url: "https://bernecki.dev" + href,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: "https://bernecki.dev/" },
        { "@type": "ListItem", position: 2, name: "Usługi", item: "https://bernecki.dev/uslugi" },
      ],
    },
  ],
};

export default function ServicesIndex() {
  return (
    <main className="relative z-10 min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-white/60">Obsługa zdalna firm w całej Polsce</p>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Strony, CRM, marketing i AI — usługi dla firm w Polsce</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70">Współpracuję z przedsiębiorcami niezależnie od miejsca prowadzenia działalności. Projekt i konsultacje mogą odbywać się zdalnie. Nie deklaruję fizycznych biur w podanych miastach.</p>
        <h2 className="mt-14 text-2xl font-semibold">Zakres usług</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {offers.map(([name, href]) => <Link key={href} className="rounded-full border border-white/25 px-5 py-3 hover:bg-white/10" href={href}>{name}</Link>)}
        </div>
        <section className="mt-16 border-t border-white/10 pt-12" aria-labelledby="cases-heading">
          <h2 id="cases-heading" className="text-2xl font-semibold">Zobacz, jak wyglądają rzeczywiste wdrożenia</h2>
          <p className="mt-3 max-w-3xl leading-7 text-white/65">Przykłady działających produktów i kampanii pomagają ocenić doświadczenie lepiej niż sama lista oferowanych technologii.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-xl font-semibold">B-CRM</h3>
              <p className="mt-3 leading-7 text-white/65">System obsługi leadów, zadań, kalendarza i procesów sprzedaży, zaprojektowany dla zespołu handlowego.</p>
              <Link href="/b-crm-case-study" className="mt-5 inline-block underline underline-offset-4">Poznaj B-CRM</Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-xl font-semibold">Re-Energy System — reklamy</h3>
              <p className="mt-3 leading-7 text-white/65">Case study kampanii Meta Ads i pozyskiwania kontaktów dla firmy z branży odnawialnych źródeł energii.</p>
              <Link href="/case-studies/re-energy-meta-ads" className="mt-5 inline-block underline underline-offset-4">Zobacz case study</Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-xl font-semibold">Strony i produkty cyfrowe</h3>
              <p className="mt-3 leading-7 text-white/65">Przykłady stron internetowych i aplikacji: od prezentacji oferty przez formularze po narzędzia użytkowe.</p>
              <Link href="/case-studies" className="mt-5 inline-block underline underline-offset-4">Przegląd realizacji</Link>
            </article>
          </div>
        </section>
        <section className="mt-16 border-t border-white/10 pt-12" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold">Jak wygląda współpraca na odległość?</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <div><h3 className="text-lg font-semibold">Czy firma musi być z mojego miasta?</h3><p className="mt-2 leading-7 text-white/65">Nie. Ustalenia, projektowanie, wdrożenie i odbiór mogą odbywać się zdalnie. Wymagania i sposób kontaktu uzgadniamy przed rozpoczęciem prac.</p></div>
            <div><h3 className="text-lg font-semibold">Czy można połączyć kilka usług?</h3><p className="mt-2 leading-7 text-white/65">Tak. Strona internetowa może zbierać leady, CRM porządkować ich obsługę, a kampanie reklamowe generować zapytania. Zakres ustalamy pod proces firmy.</p></div>
            <div><h3 className="text-lg font-semibold">Czy wdrażasz gotowy CRM?</h3><p className="mt-2 leading-7 text-white/65">Możliwy jest rozwój indywidualnego rozwiązania, integracja istniejących narzędzi lub przebudowa procesu. Wybór zależy od potrzeb i budżetu.</p></div>
            <div><h3 className="text-lg font-semibold">Jak ustalana jest cena?</h3><p className="mt-2 leading-7 text-white/65">Po poznaniu celu, zakresu funkcji, liczby użytkowników i potrzebnych integracji. Nie podaję jednej ceny dla wszystkich projektów.</p></div>
          </div>
        </section>
        <section className="mt-14 rounded-3xl border border-white/15 bg-white/[0.04] p-7 md:p-9" aria-labelledby="google-ads-heading">
          <h2 id="google-ads-heading" className="text-2xl font-semibold">Google Ads, reklamy w Google i audyt kampanii</h2>
          <p className="mt-4 max-w-3xl leading-7 text-white/65">
            Pomagam uporządkować wyszukiwane frazy, wykluczenia, pomiar konwersji oraz połączenie kampanii
            z formularzami i CRM. Kampanie dla firm z całej Polski — w tym Rzeszowa, Lublina i Warszawy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/google-ads-dla-firm" className="rounded-full bg-white px-6 py-3 font-semibold text-black">
              Oferta Google Ads
            </Link>
            <Link href="/narzedzia/kalkulator-budzetu-google-ads" className="rounded-full border border-white/25 px-6 py-3 text-white">
              Darmowy kalkulator budżetu reklam
            </Link>
          </div>
        </section>

        <h2 className="mt-14 text-2xl font-semibold">Miasta, dla których przygotowano informacje o ofercie</h2>
        <p className="mt-3 text-white/65">Wybierz miasto i sprawdź zakres współpracy, etapy realizacji oraz dostępne usługi.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {serviceCities.map(city => <Link key={city.slug} href={`/uslugi/${city.slug}`} className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-5 font-medium hover:border-white/35 hover:bg-white/[0.08]">{city.name} <span aria-hidden="true">↗</span></Link>)}
        </div>
        <Link href="/kontakt" className="mt-14 inline-block rounded-full bg-white px-7 py-4 font-semibold text-black">Omów projekt i wycenę</Link>
      </div>
    </main>
  );
}
