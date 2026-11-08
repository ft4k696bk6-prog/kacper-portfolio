import type { Metadata } from "next";
import Link from "next/link";
const url = "https://bernecki.dev/reklamy-meta-ads-dla-firm";
export const metadata: Metadata = {
  title: "Reklamy Meta Ads dla firm — Facebook, Instagram i leady",
  description: "Prowadzenie kampanii Meta Ads z celem pozyskiwania klientów: oferta, reklamy, formularze leadowe, mierzenie jakości zapytań i obsługa w CRM. Case study OZE.",
  alternates: { canonical:url, languages:{"pl-PL":url,en:"https://bernecki.dev/en/meta-ads"} },
  openGraph: { title: "Kampanie Meta Ads i pozyskiwanie leadów — Kacper Bernecki", description: "Reklamy Facebook i Instagram dla firm. Zobacz proces i case study z branży OZE.", url, type: "website", locale: "pl_PL" },
};
const stages = [
  {h:"1. Analiza oferty i celu",d:"Ustalamy, kto jest klientem, w jakich regionach działa firma i czym jest wartościowe zapytanie. Inaczej prowadzi się kampanię dla usług lokalnych, a inaczej dla zespołu handlowców obsługującego kilka województw."},
  {h:"2. Kreacje i komunikat",d:"Przygotowuję warianty treści oraz grafik odpowiadające na konkretne potrzeby klientów. Reklama ma jasno wskazywać, jaka usługa jest oferowana i co stanie się po wysłaniu formularza."},
  {h:"3. Formularz i strona docelowa",d:"Projektuję drogę od reklamy do zgłoszenia: formularz w Meta, landing page lub połączenie obu. Ograniczam przypadkowe zgłoszenia przez sensowne pytania kwalifikujące."},
  {h:"4. Przekazanie leada do sprzedaży",d:"Dbam o to, aby kontakt nie utknął w panelu reklamowym. Może trafić do CRM, odpowiedniej osoby i kolejki kontaktu, z czytelnym źródłem oraz statusem."},
  {h:"5. Pomiar i optymalizacja",d:"Porównuję koszt pozyskania kontaktu z jego przydatnością. Do rzetelnego pomiaru potrzebne są również dane o tym, ile osób odebrało telefon, otrzymało ofertę i zawarło umowę."},
];
export default function MetaAdsServicePage() {
  return <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@type":"Service","@id":url+"#service","name":"Prowadzenie kampanii Meta Ads i pozyskiwanie leadów","serviceType":"Lead generation / Meta Ads","provider":{"@id":"https://bernecki.dev/#person"},"areaServed":"PL","url":url})}} />
    <div className="mx-auto max-w-6xl">
      <nav className="text-sm text-white/60"><Link href="/">Portfolio</Link> / <Link href="/marketing-i-reklamy">Marketing</Link> / Meta Ads</nav>
      <p className="mt-12 text-xs uppercase tracking-[0.2em] text-white/65">Facebook Ads · Instagram Ads · Lead generation</p>
      <h1 className="mt-5 max-w-4xl text-4xl leading-tight md:text-6xl">Reklamy Meta Ads, które mają przynosić zapytania, nie tylko wyświetlenia.</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">Projektuję i prowadzę kampanie dla firm, łącząc reklamę z formularzem, stroną ofertową oraz dalszą obsługą kontaktów. Ważny jest cały proces pozyskiwania klientów, a nie pojedynczy wskaźnik z panelu reklamowego.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link href="/#contact" className="rounded-lg brand-action px-5 py-3 text-black">Zapytaj o współpracę →</Link><Link href="/case-studies/re-energy-meta-ads" className="rounded-lg brand-outline px-5 py-3 text-white">Case study Re-Energy System →</Link></div>
      <section className="mt-20"><h2 className="text-3xl">Jak wygląda współpraca?</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{stages.map(s=><article key={s.h} className="surface-card rounded-xl border border-white/15 p-6"><h3 className="text-xl">{s.h}</h3><p className="mt-4 leading-7 text-white/70">{s.d}</p></article>)}</div></section>
      <section className="mt-20 grid gap-10 border-t border-white/15 pt-14 md:grid-cols-2"><div><h2 className="text-3xl">Co warto mierzyć poza kosztem leada?</h2><p className="mt-5 leading-8 text-white/75">Tani kontakt, który nigdy nie odpowiada na telefon, nie jest dobrym wynikiem. Współpraca ma sens, kiedy firma widzi postęp kontaktów w procesie sprzedaży.</p></div><ul className="space-y-4 text-white/80"><li>— Koszt pozyskania zgłoszenia (CPL)</li><li>— Odsetek kontaktów poprawnych i kontaktowalnych</li><li>— Liczba rozmów i przygotowanych ofert</li><li>— Koszt pozyskania klienta (CAC), o ile dane sprzedażowe pozwalają go policzyć</li><li>— Czas od wysłania formularza do pierwszego kontaktu</li></ul></section>
      <section className="surface-card mt-20 rounded-2xl border border-white/20 bg-white/[0.04] p-7 md:p-10"><p className="text-xs uppercase tracking-[0.2em] text-white/60">Przykład z branży OZE</p><h2 className="mt-4 text-3xl">Re-Energy System: około 2 lata kampanii jako jedynego źródła leadów.</h2><p className="mt-5 max-w-3xl leading-8 text-white/75">Re-Energy System: 90 837 zł budżetu reklamowego, 6 mln zł obrotu firmy i 2 331 pozyskanych kontaktów w 17 kampaniach leadowych, ze średnim kosztem 29,79 zł. Kampanie połączyłem z formularzami i procesem obsługi zgłoszeń przez handlowców.</p><Link href="/case-studies/re-energy-meta-ads" className="mt-6 inline-block underline underline-offset-4">Zobacz pełne case study →</Link></section>
      <section className="mt-20"><h2 className="text-3xl">Najczęstsze pytania</h2><div className="mt-6 space-y-4">{[["Czy potrzebuję strony internetowej?","Niekoniecznie. Kampanie mogą korzystać z formularza Meta, ale strona może lepiej wyjaśnić ofertę i wesprzeć pomiar."],["Czy gwarantujesz konkretną liczbę leadów?","Nie. Wolumen i cena zależą od branży, lokalizacji, oferty i budżetu. Ustalamy cele i kontrolujemy wyniki."],["Czy zajmujesz się też CRM?","Tak. Mogę połączyć pozyskiwanie zgłoszeń z ich organizacją i obsługą w systemie CRM."]].map(([q,a])=><div key={q} className="surface-card rounded-lg border border-white/15 p-6"><h3 className="text-lg">{q}</h3><p className="mt-3 leading-7 text-white/70">{a}</p></div>)}</div></section>
      <div className="mt-14"><Link href="/#contact" className="inline-block rounded-lg brand-action px-6 py-4 text-black">Porozmawiajmy o Twojej kampanii →</Link></div>
    </div>
  </main>;
}