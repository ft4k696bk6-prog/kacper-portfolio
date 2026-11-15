import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cennik stron WWW, CRM, reklam i automatyzacji | bernecki.dev",
  description: "Orientacyjne ceny netto: strony internetowe, dedykowany CRM, automatyzacja procesów, Google Ads, Meta Ads i TikTok Ads. Sprawdź zakres i wyślij brief.",
  alternates: { canonical: "https://bernecki.dev/cennik" },
};

const offers = [
  { name: "Landing page sprzedażowy", price: "od 1 900 zł", unit: "jednorazowo", text: "Jedna oferta, responsywny projekt, formularz i podstawy pomiaru.", link: "/tworzenie-stron-internetowych", notes: ["Strona przygotowana pod konkretną kampanię", "Testy formularza i wersji mobilnej", "Domena, hosting, płatne narzędzia osobno"] },
  { name: "Strona firmowa", price: "od 3 900 zł", unit: "jednorazowo", text: "Oferta usług, realizacje, kontakt i techniczne przygotowanie pod SEO.", link: "/tworzenie-stron-internetowych", notes: ["Indywidualny zakres podstron", "Podstawowe metadane i indeksowanie", "Treści, integracje i wersje językowe według zakresu"] },
  { name: "CRM na zamówienie – pierwszy moduł", price: "od 12 000 zł", unit: "projekt", text: "Leady, statusy, zadania i role dla jednego uzgodnionego procesu.", link: "/crm-dla-firm-handlowych", notes: ["Analiza procesu i uprawnień", "MVP z testami i przekazaniem", "Dodatkowe integracje i utrzymanie według wyceny"] },
  { name: "CRM wielomodułowy / aplikacja", price: "od 25 000 zł", unit: "projekt", text: "Rozbudowane role, workflow, raporty, pliki i integracje z systemami.", link: "/crm-i-aplikacje-webowe", notes: ["Etapowanie i osobny kosztorys", "Migracja i integracje po audycie", "Wsparcie powdrożeniowe do uzgodnienia"] },
  { name: "Automatyzacja procesu", price: "od 1 500 zł", unit: "wdrożenie", text: "Przykład: formularz lub reklama → CRM → przydział → powiadomienie.", link: "/automatyzacja-leadow-i-sprzedazy", notes: ["Mapowanie jednej ścieżki", "Obsługa błędów i testy", "Koszty API i abonamentów oddzielnie"] },
  { name: "Audyt kampanii i analityki", price: "od 590 zł", unit: "jednorazowo", text: "Weryfikacja celu, zdarzeń, struktury, budżetów i strat w lejku.", link: "/reklamy-online", notes: ["Lista błędów i priorytetów", "Rekomendacje testów", "Dostępy tylko w zakresie uzgodnionym"] },
  { name: "Start kampanii reklamowej", price: "od 990 zł", unit: "konfiguracja / kanał", text: "Google, Meta, TikTok lub YouTube: struktura, reklamy i podstawowy pomiar.", link: "/reklamy-online", notes: ["Jedna platforma i ustalony cel", "Materiały i landing według zakresu", "Budżet mediowy płacony osobno"] },
  { name: "Stała obsługa reklam", price: "od 1 190 zł", unit: "miesięcznie / kanał", text: "Optymalizacja, testy odbiorców i kreacji, raport jakości leadów.", link: "/reklamy-online", notes: ["Jedna platforma i uzgodniona liczba kampanii", "Wymagany pomiar konwersji", "Wydatki na reklamy nie są wliczone"] },
] as const;
const steps = [
  ["01", "Wysyłasz cel", "Opisujesz usługę, branżę, budżet i to, co dziś nie działa."],
  ["02", "Ustalamy zakres", "Sprawdzamy, czy rozwiązanie gotowe nie wystarczy i jakie integracje są potrzebne."],
  ["03", "Otrzymujesz wycenę", "Dostajesz zakres, cenę, etapy, koszty zewnętrzne i sposób odbioru."],
];
export default function PricingPage() {
  const url = "https://bernecki.dev/cennik";
  const data = {"@context":"https://schema.org","@type":"WebPage",url,name:"Orientacyjny cennik usług – bernecki.dev",description:"Zakresy i przykładowe ceny netto usług cyfrowych."};
  return <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data)}} />
    <div className="mx-auto max-w-6xl">
      <nav className="text-sm text-white/60"><Link href="/">Start</Link> / Cennik</nav>
      <p className="mt-12 text-sm uppercase tracking-[0.2em] text-white/65">Przejrzyste widełki • Bez ukrytego budżetu reklamowego</p>
      <h1 className="mt-5 max-w-5xl text-4xl leading-tight md:text-6xl">Ile kosztuje strona, CRM, reklamy lub automatyzacja?</h1>
      <p className="mt-7 max-w-4xl text-lg leading-8 text-white/75">Poniżej podaję orientacyjne ceny początkowe netto za najprostszy sensowny zakres. To nie jest automatyczny kosztorys ani gwarancja przyjęcia każdego projektu w tej cenie. Po krótkiej analizie otrzymasz indywidualną ofertę z zakresem, etapami i kosztami utrzymania.</p>
      <div className="mt-8 flex flex-wrap gap-4"><Link href="/kontakt" className="brand-action rounded-xl px-6 py-3 font-semibold text-black">Poproś o konkretną wycenę</Link><Link href="/case-studies" className="rounded-xl border border-white/25 px-6 py-3">Zobacz realizacje</Link></div>
      <section className="mt-16 grid gap-5 sm:grid-cols-2" aria-label="Orientacyjny cennik">
        {offers.map(o=><article key={o.name} className="surface-card rounded-2xl border border-white/20 p-6 md:p-8">
          <h2 className="text-2xl font-semibold">{o.name}</h2>
          <p className="mt-4 text-3xl font-semibold text-white">{o.price} <span className="text-sm font-normal text-white/60">netto · {o.unit}</span></p>
          <p className="mt-4 leading-7 text-white/75">{o.text}</p>
          <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-white/65">{o.notes.map(n=><li key={n}>{n}</li>)}</ul>
          <div className="mt-7 flex flex-wrap gap-4"><Link href={o.link} className="underline underline-offset-4">Zobacz zakres usługi</Link><Link href="/kontakt" className="font-semibold underline underline-offset-4">Zapytaj o wycenę</Link></div>
        </article>)}
      </section>
      <section className="mt-20 rounded-2xl border border-white/20 bg-white/[0.035] p-7 md:p-10">
        <h2 className="text-3xl font-semibold">Za co płacisz w reklamach?</h2>
        <p className="mt-5 leading-8 text-white/75">Są dwie oddzielne kwoty: wynagrodzenie za przygotowanie i prowadzenie kampanii oraz budżet mediowy pobierany przez platformę. Dodatkowe kreacje, filmy, landing page, integracje i narzędzia mogą wymagać osobnej wyceny. Nie obiecuję konkretnej liczby klientów ani stałej ceny leada bez danych z Twojej branży.</p>
        <Link href="/reklamy-online" className="mt-5 inline-block underline underline-offset-4">Wybierz platformę reklamową i strategię</Link>
      </section>
      <section className="mt-20">
        <h2 className="text-3xl">Jak wygląda współpraca?</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">{steps.map(([n,t,d])=><div key={n} className="rounded-xl border border-white/15 p-6"><p className="text-sm text-white/55">{n}</p><h3 className="mt-3 text-xl">{t}</h3><p className="mt-3 leading-7 text-white/70">{d}</p></div>)}</div>
      </section>
      <section className="mt-20 border-t border-white/15 pt-14">
        <h2 className="text-3xl">Co warto przeczytać przed wyceną?</h2>
        <div className="mt-5 flex flex-col gap-4">
          <Link href="/poradniki/crm-na-zamowienie-czy-gotowy" className="underline underline-offset-4">CRM na zamówienie czy gotowy system?</Link>
          <Link href="/poradniki/ile-kosztuje-strona-internetowa" className="underline underline-offset-4">Co wpływa na cenę strony internetowej?</Link>
          <Link href="/poradniki/reklamy-samodzielnie-czy-agencja" className="underline underline-offset-4">Reklamy samodzielnie czy zlecić specjaliście?</Link>
        </div>
      </section>
      <div className="mt-16 rounded-2xl border border-white/25 p-8">
        <h2 className="text-2xl">Masz budżet, ale nie wiesz, co wdrożyć jako pierwsze?</h2>
        <p className="mt-3 text-white/70">Wyślij opis problemu. Powiem, czy wystarczy prostsze rozwiązanie, czy warto budować własny system i który kanał reklamowy przetestować.</p>
        <Link href="/kontakt" className="brand-action mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-black">Opisz swój projekt</Link>
      </div>
    </div>
  </main>;
}