import type { Metadata } from "next";
import Link from "next/link";
import { serviceCities } from "@/lib/service-cities";

const url = "https://bernecki.dev/google-ads-dla-firm";

export const metadata: Metadata = {
  title: { absolute: "Google Ads dla firm – reklamy w Google, audyt i kampanie | Bernecki" },
  description: "Kampanie Google Ads dla firm: reklamy w wyszukiwarce, dobór słów i wykluczeń, pomiar konwersji, landing page i CRM. Obsługa zdalna w całej Polsce, również Rzeszów, Lublin i Warszawa.",
  alternates: { canonical: url },
  openGraph: {
    title: "Google Ads dla firm – reklamy w Google i audyt kampanii",
    description: "Reklamy w Google oparte na intencji zakupu i jakości leadów. Przejrzysty plan działań, pomiar konwersji oraz audyt istniejących kampanii.",
    url, locale: "pl_PL", type: "website",
  },
};

const steps = [
  {
    title: "1. Rozpoznanie biznesu i celu",
    description: "Ustalamy, co oznacza wartościowy klient, na jakich obszarach działa firma, jaki ma budżet i które usługi warto promować w pierwszej kolejności.",
  },
  {
    title: "2. Słowa kluczowe i struktura",
    description: "Dobieramy zapytania z intencją zakupu i grupujemy reklamy według usług. Sprawdzamy zapytania wykluczające i ustawienia lokalizacji, żeby nie płacić za przypadkowe kliknięcia.",
  },
  {
    title: "3. Reklama i landing page",
    description: "Dopasowujemy komunikaty do realnej oferty, projektujemy przejrzystą ścieżkę do formularza lub telefonu i wykonujemy testy na urządzeniach mobilnych.",
  },
  {
    title: "4. Pomiar i kontrola jakości leadów",
    description: "Konfigurujemy pomiar wartościowych działań zgodnie z dostępnymi zgodami i narzędziami. Jeżeli firma ma CRM, można zweryfikować, które zapytania przechodzą do ofert i sprzedaży.",
  },
  {
    title: "5. Optymalizacja i raport",
    description: "Porównujemy koszt pozyskania wartościowego kontaktu, zachowanie odbiorców i skuteczność poszczególnych usług. Zmiany wprowadzamy na podstawie danych, nie obietnic ROAS.",
  },
];

const services = [
  { title: "Kampanie Search", copy: "Reklamy tekstowe w wynikach wyszukiwania, gdy odbiorca aktywnie szuka określonej usługi.", link: "/oferta/google-ads/rzeszow" },
  { title: "Audyt konta Google Ads", copy: "Analiza wydatków, konwersji, słów kluczowych, lokalizacji i strony docelowej.", link: "/oferta/audyt-google-ads/warszawa" },
  { title: "Landing page pod reklamy", copy: "Strony docelowe z wyraźną ofertą, formularzem i kontrolą zdarzeń konwersji.", link: "/tworzenie-stron-internetowych" },
  { title: "Google Ads + CRM", copy: "Integracja raportowania kampanii z obsługą leadów i informacją zwrotną o jakości kontaktów.", link: "/crm-i-aplikacje-webowe" },
];

const questions = [
  ["Czy Google Ads jest odpowiedni dla każdej firmy?", "Nie. Kampanie wymagają realnego popytu na usługę, budżetu i działającej ścieżki kontaktu. Gdy oferta jest niejasna lub marża nie pozwala na opłacenie pozyskania klienta, najpierw warto naprawić podstawy."],
  ["Czy można reklamować się tylko w jednym mieście?", "Tak, obszar emisji może odpowiadać faktycznemu zasięgowi obsługi firmy. Ustawienia lokalizacji trzeba jednak regularnie sprawdzać w raporcie."],
  ["Czy prowadzisz reklamy w Google Rzeszów, Lublin i Warszawa?", "Tak, oferta obejmuje współpracę zdalną z firmami z tych miast i całej Polski. Nie oznacza to fizycznego biura w każdym mieście ani gwarancji wyniku kampanii."],
  ["Czy otrzymam gwarancję pierwszego miejsca lub konkretnego ROAS?", "Nie. Wyniki zależą m.in. od konkurencji, ofert, budżetu, strony docelowej, sezonowości i obsługi zgłoszeń. Możliwe jest natomiast rzetelne mierzenie i poprawianie działania kampanii."],
  ["Co jest ważniejsze: CPC czy koszt pozyskania klienta?", "CPC pokazuje koszt kliknięcia. Przy lead generation istotniejszy jest koszt wartościowego leada, a docelowo koszt klienta, przychód lub marża ze sprzedaży."],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage", "@id": url + "#webpage", url,
      name: "Google Ads dla firm – reklamy w Google i audyt kampanii",
      inLanguage: "pl-PL", isPartOf: { "@id": "https://bernecki.dev/#website" },
    },
    {
      "@type": "Service", "@id": url + "#service", name: "Obsługa i audyt Google Ads dla firm",
      serviceType: "Prowadzenie kampanii Google Ads i audyt kampanii reklamowych",
      description: "Analiza, planowanie i optymalizacja kampanii Google Ads z pomiarem wartościowych zapytań.",
      provider: { "@type": "Person", name: "Kacper Bernecki", url: "https://bernecki.dev" },
      areaServed: { "@type": "Country", name: "Polska" },
    },
    {
      "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: "https://bernecki.dev/" },
        { "@type": "ListItem", position: 2, name: "Usługi", item: "https://bernecki.dev/uslugi" },
        { "@type": "ListItem", position: 3, name: "Google Ads", item: url },
      ],
    },
  ],
};

export default function GoogleAdsServicePage() {
  return (
    <main className="relative z-10 min-h-screen bg-[var(--brand-black)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pt-36">
        <nav className="mb-8 text-sm text-white/60" aria-label="Ścieżka nawigacji">
          <Link href="/">Start</Link> / <Link href="/uslugi">Usługi</Link> / Google Ads
        </nav>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">Google Search · Audyt · Pomiar konwersji · Cała Polska</p>
        <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">
          Google Ads dla firm. Reklamy w Google, które mierzymy dalej niż kliknięcie.
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-white/70">
          Prowadzenie reklam w wyszukiwarce Google i analiza istniejących kampanii.
          Dobór słów, wykluczeń, lokalizacji i stron docelowych łączę z pomiarem
          zapytań oraz ich dalszej obsługi. Współpracuję z firmami z całej Polski.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/kontakt" className="rounded-full bg-white px-7 py-4 font-semibold text-black hover:bg-white/85">Zapytaj o Google Ads</Link>
          <Link href="/narzedzia/kalkulator-budzetu-google-ads" className="rounded-full border border-white/25 px-7 py-4 font-medium hover:border-white/60">Darmowy kalkulator budżetu</Link>
        </div>
        <p className="mt-7 max-w-4xl text-sm leading-6 text-white/50">
          Wycena jest indywidualna. Budżet reklamowy Google i koszt obsługi to dwie różne pozycje.
          Wyniki kampanii nie są gwarantowane, a konkretne estymacje wymagają danych o branży i konwersjach.
        </p>
      </section>

      <section className="border-y border-white/10 bg-white/[0.035] px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold">Zakres obsługi reklam Google</h2>
          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className="rounded-2xl border border-white/10 bg-black/20 p-7">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 leading-7 text-white/65">{service.copy}</p>
                <Link href={service.link} className="mt-6 inline-block font-medium underline underline-offset-4">Sprawdź szczegóły</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-3xl font-semibold">Jak wygląda uruchomienie i optymalizacja?</h2>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {steps.map((step) => (
            <article key={step.title} className="rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-4 leading-7 text-white/65">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.035] px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold">Reklamy w Google – wybierz miasto</h2>
          <p className="mt-4 max-w-3xl leading-7 text-white/65">
            Kampanie można kierować na firmy działające w konkretnym mieście, okolicy lub w całej Polsce.
            Każdy poniższy adres przedstawia przykładowe scenariusze i kwestie do ustalenia dla danej lokalizacji.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {serviceCities.map(city => (
              <Link key={city.slug} href={"/oferta/google-ads/" + city.slug}
                className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-4 transition hover:border-white/40 hover:bg-white/[0.07]">
                <span className="font-semibold">Reklamy w Google – {city.name}</span>
                <span className="mt-1 block text-sm text-white/50">Google Ads / {city.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-3xl font-semibold">Google Ads a Meta Ads: co wybrać?</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 p-7">
            <h3 className="text-xl font-semibold">Google Ads</h3>
            <p className="mt-3 leading-7 text-white/65">
              Często dobry punkt startowy, gdy klient sam wpisuje konkretny problem lub nazwę usługi w wyszukiwarkę.
              Ważne są słowa kluczowe, strony docelowe i koszt wartościowego zapytania.
            </p>
          </article>
          <article className="rounded-2xl border border-white/10 p-7">
            <h3 className="text-xl font-semibold">Meta Ads</h3>
            <p className="mt-3 leading-7 text-white/65">
              Pomaga dotrzeć do potencjalnych odbiorców zanim aktywnie szukają usługi.
              Ważny jest komunikat, materiał kreatywny, formularz i szybkość obsługi leadów.
            </p>
            <Link className="mt-5 inline-block underline underline-offset-4" href="/reklamy-meta-ads-dla-firm">Oferta Meta Ads</Link>
          </article>
        </div>
        <p className="mt-6 leading-7 text-white/65">
          Kanały można łączyć, ale dopiero po ustaleniu marży, budżetu i możliwości obsługi zapytań.
          Nie ma jednej skutecznej proporcji wydatków dla wszystkich firm.
        </p>
      </section>

      <section className="border-y border-white/10 bg-white/[0.035] px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold">Poradniki Google Ads</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["Google Ads nie działa — diagnoza", "/poradniki/google-ads-nie-dziala-co-sprawdzic"],
              ["Google Ads ma kliknięcia, ale nie ma konwersji", "/poradniki/google-ads-brak-konwersji"],
              ["Ile kosztuje reklama w Google?", "/poradniki/ile-kosztuje-reklama-google-ads"],
              ["Google Ads czy Meta Ads?", "/poradniki/google-ads-czy-meta-ads"],
              ["Jak dobrać słowa kluczowe w Google Ads?", "/poradniki/jak-dobrac-slowa-kluczowe-google-ads"],
              ["Wykluczające słowa kluczowe — jak je ustawić?", "/poradniki/wykluczajace-slowa-kluczowe-google-ads"],
            ].map(([label, href]) => (
              <Link className="rounded-xl border border-white/10 px-5 py-4 text-white/75 hover:border-white/40 hover:text-white"
                href={href} key={href}>{label}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-3xl font-semibold">Najczęstsze pytania</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {questions.map(([question, answer]) => (
            <article key={question} className="rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold">{question}</h3>
              <p className="mt-4 leading-7 text-white/65">{answer}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 rounded-3xl bg-white p-8 text-black md:p-12">
          <h2 className="text-3xl font-semibold">Chcesz przeanalizować konto lub uruchomić reklamy?</h2>
          <p className="mt-4 max-w-3xl leading-8 text-black/70">
            Napisz, jaką usługę oferujesz, w jakim regionie i co obecnie dzieje się z kampaniami.
            Pomogę uporządkować zakres audytu i kolejne kroki.
          </p>
          <Link href="/kontakt" className="mt-7 inline-block rounded-full bg-black px-7 py-4 font-semibold text-white">Kontakt i wycena</Link>
        </div>
      </section>
    </main>
  );
}
