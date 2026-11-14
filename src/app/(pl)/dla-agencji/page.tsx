import type { Metadata } from "next";
import Link from "next/link";

const url = "https://bernecki.dev/dla-agencji";
export const metadata: Metadata = {
  title: "Podwykonawca stron WWW, CRM i aplikacji dla agencji | bernecki.dev",
  description: "Szukasz wykonawcy stron internetowych, CRM lub aplikacji webowych do projektu klienta? Współpraca projektowa i white-label z Kacprem Berneckim. Przykłady realizacji i kontakt.",
  alternates: { canonical: url },
  openGraph: { title: "Współpraca z agencjami: web development, CRM i automatyzacje", url, type: "website", locale: "pl_PL" }
};
const capabilities = [
  ["Strony i landing page", "Wdrożenia stron firmowych, rozbudowa istniejących witryn, responsywność i integracja formularzy."],
  ["CRM i panele biznesowe", "Leady, uprawnienia, obieg zadań, dashboardy, raportowanie oraz integracje API."],
  ["Frontend i integracje", "React, Next.js, TypeScript, interfejsy aplikacji i połączenia z usługami zewnętrznymi."],
  ["Automatyzacje", "Integracja formularzy, poczty, CRM i procesów sprzedaży; AI tam, gdzie ma jasne zastosowanie."]
];
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": url + "#webpage", url, name: "Podwykonawca stron WWW i CRM dla agencji", inLanguage: "pl-PL", isPartOf: { "@id": "https://bernecki.dev/#website" } },
    { "@type": "Service", name: "Podwykonawstwo web development i CRM dla agencji", serviceType: "Web development B2B", provider: { "@id": "https://bernecki.dev/#person" }, areaServed: { "@type": "Country", name: "Polska" }, url }
  ]
};
export default function ForAgenciesPage() {
  return (
    <main className="relative z-10 min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-28 text-white md:px-8 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-white/60">Współpraca B2B · Polska i zdalnie</p>
        <h1 className="mt-6 max-w-5xl text-4xl font-semibold leading-tight md:text-6xl">Szukasz podwykonawcy stron, CRM lub aplikacji dla swojej agencji?</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">Jestem otwarty na współpracę projektową z agencjami marketingowymi, studiami projektowymi i software house’ami. Mogę realizować techniczną część projektu lub wybrany moduł w zespole. Model white-label i NDA ustalamy przed rozpoczęciem prac.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="mailto:kacper@bernecki.dev?subject=Wspolpraca%20B2B%20-%20bernecki.dev" className="rounded-full bg-white px-7 py-4 font-semibold text-black">Napisz o współpracy</a>
          <Link href="/case-studies" className="rounded-full border border-white/25 px-7 py-4 font-semibold">Zobacz realizacje</Link>
        </div>

        <section className="mt-20 border-t border-white/15 pt-14">
          <h2 className="text-2xl font-semibold">W czym mogę odciążyć Twój zespół?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {capabilities.map(([title, text]) => <article key={title} className="rounded-2xl border border-white/15 bg-white/[0.04] p-7"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-white/70">{text}</p></article>)}
          </div>
        </section>

        <section className="mt-20 border-t border-white/15 pt-14">
          <h2 className="text-2xl font-semibold">Przykłady pracy do oceny</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Link className="rounded-xl border border-white/15 p-6 hover:bg-white/10" href="/case-studies/b-crm"><span className="block text-lg font-semibold">B-CRM</span><span className="mt-2 block text-white/70">CRM, role, leady, zadania i kalendarz</span></Link>
            <Link className="rounded-xl border border-white/15 p-6 hover:bg-white/10" href="/case-studies/starcars"><span className="block text-lg font-semibold">StarCars</span><span className="mt-2 block text-white/70">Strona usługowa, kalkulator i kontakt</span></Link>
            <Link className="rounded-xl border border-white/15 p-6 hover:bg-white/10" href="/realizacje/isto-kebab-strona"><span className="block text-lg font-semibold">Isto Kebab</span><span className="mt-2 block text-white/70">Strona restauracji i obsługa zamówień</span></Link>
          </div>
        </section>

        <section className="mt-20 border-t border-white/15 pt-14">
          <h2 className="text-2xl font-semibold">Jak proponuję zacząć?</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            <li className="rounded-xl bg-white/[0.04] p-6"><strong>1. Brief</strong><p className="mt-2 leading-7 text-white/70">Opis projektu, termin, wymagane technologie i zakres odpowiedzialności.</p></li>
            <li className="rounded-xl bg-white/[0.04] p-6"><strong>2. Zakres i warunki</strong><p className="mt-2 leading-7 text-white/70">Wycena, terminy, sposób komunikacji, dostęp do repozytorium, NDA i zasady współpracy.</p></li>
            <li className="rounded-xl bg-white/[0.04] p-6"><strong>3. Pilotaż</strong><p className="mt-2 leading-7 text-white/70">Możemy zacząć od małego, płatnego zakresu, żeby sprawdzić współpracę przed większym wdrożeniem.</p></li>
          </ol>
        </section>

        <section className="mt-20 rounded-3xl border border-white/20 bg-white/[0.05] p-8 md:p-12">
          <h2 className="text-3xl font-semibold">Masz projekt, którego nie chcesz realizować wewnętrznie?</h2>
          <p className="mt-4 max-w-2xl leading-8 text-white/75">Prześlij zakres lub link do briefu. Odpowiem, czy moje kompetencje pasują i jaki model rozliczenia ma sens. Bez deklarowania wolnych terminów, zanim ustalimy rzeczywisty zakres.</p>
          <a href="mailto:kacper@bernecki.dev?subject=Zapytanie%20partnerskie%20-%20web%20development" className="mt-7 inline-block rounded-full bg-white px-7 py-4 font-semibold text-black">kacper@bernecki.dev</a>
        </section>
      </div>
    </main>
  );
}
