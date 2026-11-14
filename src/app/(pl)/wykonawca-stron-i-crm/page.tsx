import type { Metadata } from "next";
import Link from "next/link";

const url = "https://bernecki.dev/wykonawca-stron-i-crm";

export const metadata: Metadata = {
  title: "Wykonawca strony internetowej i CRM na zamówienie | bernecki.dev",
  description: "Szukasz firmy lub wykonawcy strony internetowej, CRM albo aplikacji dla swojej firmy? Zobacz działające realizacje Kacpra Berneckiego, zakres współpracy i sposób wyceny.",
  alternates: { canonical: url },
  openGraph: {
    title: "Kto zrobi stronę internetową lub CRM? | bernecki.dev",
    description: "Strony firmowe, dedykowane CRM i automatyzacje. Przykłady wdrożeń, proces współpracy i kontakt z wykonawcą.",
    url,
    type: "website",
    locale: "pl_PL"
  }
};

const questions = [
  {
    q: "Szukam kogoś, kto zrobi mi stronę internetową. Od czego zacząć?",
    a: "Napisz, czym zajmuje się firma, jakie ma usługi i co klient ma zrobić na stronie: zadzwonić, wysłać formularz, zarezerwować termin czy kupić produkt. Na tej podstawie proponuję zakres i wycenę."
  },
  {
    q: "Czy realizujesz strony dla firm z Lublina, Rzeszowa i Warszawy?",
    a: "Tak. Obsługuję firmy z całej Polski, w tym z Lublina, Rzeszowa i Warszawy. Projekty mogą być realizowane zdalnie. Nie deklaruję osobnych biur w tych miastach."
  },
  {
    q: "Potrzebuję CRM na zamówienie. Czy zawsze trzeba pisać go od zera?",
    a: "Nie. Najpierw sprawdzam, czy gotowy CRM wystarczy. Dedykowany system ma sens, gdy procesy, uprawnienia, rozliczenia albo integracje są trudne do obsłużenia gotowym narzędziem."
  },
  {
    q: "Czy zobaczę działające projekty przed zamówieniem?",
    a: "Tak. Publicznie pokazuję m.in. StarCars, stronę Re-Energy System oraz opis wdrożenia B-CRM. Można również omówić funkcje systemu na przykładzie demonstracyjnym."
  },
  {
    q: "Czy po uruchomieniu zapewniasz wsparcie?",
    a: "Zakres utrzymania, poprawek, dostępu do kodu i dalszego rozwoju ustalamy w ofercie przed rozpoczęciem projektu."
  }
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": url + "#webpage",
      url,
      name: "Wykonawca stron internetowych i CRM na zamówienie",
      description: "Usługi wykonania stron i dedykowanych systemów CRM dla firm z całej Polski",
      inLanguage: "pl-PL",
      isPartOf: { "@id": "https://bernecki.dev/#website" },
      about: { "@id": "https://bernecki.dev/#person" }
    },
    {
      "@type": "Service",
      serviceType: "Tworzenie stron internetowych i CRM na zamówienie",
      provider: { "@id": "https://bernecki.dev/#person" },
      areaServed: { "@type": "Country", name: "Polska" },
      url
    },
    {
      "@type": "FAQPage",
      mainEntity: questions.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a }
      }))
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Strona główna", item: "https://bernecki.dev/" },
        { "@type": "ListItem", position: 2, name: "Wykonawca stron i CRM", item: url }
      ]
    }
  ]
};

const projects = [
  {
    name: "B-CRM — system dla zespołu handlowego",
    text: "Leady, zadania, przypomnienia, kalendarz, uprawnienia i procesy sprzedaży. Projekt pokazuje, jak dedykowany CRM może wspierać rzeczywistą pracę zespołu.",
    link: "/case-studies/b-crm",
    label: "Zobacz case study CRM"
  },
  {
    name: "StarCars — strona firmy importującej auta",
    text: "Prezentacja usługi, kalkulator orientacyjnych kosztów importu, realizacje i ścieżka kontaktu dla potencjalnego klienta.",
    link: "/case-studies/starcars",
    label: "Zobacz stronę StarCars"
  },
  {
    name: "Re-Energy System — strona i proces sprzedaży",
    text: "Strona firmy OZE oraz osobne wdrożenie CRM do obsługi zapytań i pracy handlowców.",
    link: "/realizacje/reenergy-crm",
    label: "Zobacz realizację"
  }
];

export default function WebsiteCrmContractorPage() {
  return (
    <main className="relative z-10 min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-white/55">Kacper Bernecki · strony WWW · CRM · aplikacje dla firm</p>
        <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Szukasz wykonawcy strony internetowej albo CRM na zamówienie?
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">
          Projektuję i wdrażam strony, aplikacje biznesowe i systemy CRM. Nie musisz znać technologii — opowiedz, jaki problem ma rozwiązać strona lub program, a dobierzemy zakres do potrzeb i budżetu.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/kontakt" className="rounded-full bg-white px-7 py-4 font-semibold text-black">Zapytaj o wycenę</Link>
          <Link href="/case-studies" className="rounded-full border border-white/30 px-7 py-4 font-semibold text-white hover:bg-white/10">Zobacz realizacje</Link>
        </div>

        <section className="mt-20" aria-labelledby="offer-heading">
          <h2 id="offer-heading" className="text-2xl font-semibold md:text-3xl">Co mogę dla Ciebie wykonać?</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              ["Strona internetowa firmy", "Nowoczesna strona usługowa z ofertą, formularzem, działaniem na telefonie i przygotowaniem pod wyszukiwarki.", "/tworzenie-stron-internetowych"],
              ["CRM dla firmy na zamówienie", "Kontakty, leady, zadania, statusy sprzedaży, role handlowców, integracje i raporty dostosowane do Twojego procesu.", "/crm-i-aplikacje-webowe"],
              ["Automatyzacje i aplikacje", "Połączenie narzędzi i danych, panele do obsługi zleceń, formularze, powiadomienia oraz procesy AI tam, gdzie to uzasadnione.", "/wdrozenia-ai-dla-firm"]
            ].map(([title, text, href]) => (
              <article key={href} className="rounded-2xl border border-white/15 bg-white/[0.04] p-7">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="mt-4 leading-7 text-white/70">{text}</p>
                <Link href={href} className="mt-6 inline-block font-semibold underline underline-offset-4">Zakres usługi</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-white/15 pt-14" aria-labelledby="evidence-heading">
          <h2 id="evidence-heading" className="text-2xl font-semibold md:text-3xl">Sprawdź projekty przed podjęciem decyzji</h2>
          <p className="mt-4 max-w-3xl leading-7 text-white/65">Zamiast pustych deklaracji „najlepsza firma” pokazuję konkretne funkcje i publicznie dostępne przykłady pracy.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {projects.map(project => (
              <article key={project.name} className="rounded-2xl border border-white/15 p-7">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="mt-3 leading-7 text-white/70">{project.text}</p>
                <Link href={project.link} className="mt-5 inline-block underline underline-offset-4">{project.label}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 border-t border-white/15 pt-14" aria-labelledby="steps-heading">
          <h2 id="steps-heading" className="text-2xl font-semibold">Jak wygląda współpraca?</h2>
          <ol className="mt-7 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Krótki opis potrzeb", "Wystarczy wiedzieć, dla kogo będzie strona lub system i co ma ułatwić."],
              ["02", "Propozycja rozwiązania", "Ustalamy zakres, priorytety, koszt i sposób odbioru."],
              ["03", "Wdrożenie i testy", "Możesz oceniać kolejne etapy i zgłaszać uwagi."],
              ["04", "Uruchomienie", "Przekazanie uzgodnionych dostępów i zasad dalszego wsparcia."]
            ].map(([num, title, text]) => <li key={num} className="rounded-2xl bg-white/[0.04] p-6"><span className="text-sm text-white/45">{num}</span><h3 className="mt-2 text-lg font-semibold">{title}</h3><p className="mt-2 leading-7 text-white/65">{text}</p></li>)}
          </ol>
        </section>

        <section className="mt-20 border-t border-white/15 pt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold">Pytania przed wyborem wykonawcy</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {questions.map(({ q, a }) => <article key={q} className="border-b border-white/15 pb-5"><h3 className="text-lg font-semibold">{q}</h3><p className="mt-3 leading-7 text-white/70">{a}</p></article>)}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-white/20 bg-white/[0.05] p-8 md:p-12">
          <h2 className="text-3xl font-semibold">Opisz, czego potrzebuje Twoja firma</h2>
          <p className="mt-4 max-w-2xl leading-8 text-white/75">W wiadomości wystarczą 3 rzeczy: cel, najważniejsze funkcje i orientacyjny budżet. Odpowiem, czy sensowniej wybrać gotowe narzędzie, czy zbudować własne.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/kontakt" className="rounded-full bg-white px-7 py-4 font-semibold text-black">Kontakt i wycena</Link>
            <Link href="/uslugi" className="rounded-full border border-white/25 px-7 py-4 font-semibold">Wszystkie usługi</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
