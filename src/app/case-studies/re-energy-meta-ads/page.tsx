import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://bernecki.dev/case-studies/re-energy-meta-ads";
export const metadata: Metadata = {
  title: "Re-Energy System — case study Meta Ads i pozyskiwania leadów",
  description: "Jak kampanie Meta Ads wspierają sprzedaż firmy OZE. Około 2 lata działań, około 90 tys. zł budżetu reklamowego i wielomilionowy obrót firmy według jej właściciela.",
  alternates: { canonical },
  openGraph: { title: "Re-Energy System | Case study Meta Ads — Kacper Bernecki", description: "Praktyczne podejście do pozyskiwania kontaktów dla branży OZE. Dane biznesowe deklarowane przez właściciela firmy.", url: canonical, type: "article", locale: "pl_PL" },
};

const steps = [
  { title: "Cel biznesowy: regularny dopływ zapytań", body: "Kampania nie miała wyłącznie generować zasięgu. Jej zadaniem było dostarczanie kontaktów do osób zainteresowanych fotowoltaiką, magazynami energii i innymi rozwiązaniami OZE." },
  { title: "Oferta dopasowana do odbiorcy", body: "Komunikaty reklamowe odnoszą się do realnych problemów klienta: kosztów energii, opłacalności magazynu, autokonsumpcji i bezpieczeństwa zasilania. Oferta oraz treść formularza mają tłumaczyć, czego dotyczy kontakt." },
  { title: "Formularze i kwalifikowanie leadów", body: "Ważna jest nie tylko cena wypełnienia formularza, ale też możliwość kontaktu, lokalizacja, rodzaj instalacji i dopasowanie do procesu sprzedaży. Słaby jakościowo lead może być droższy niż kontakt z wyższą ceną zakupu." },
  { title: "Przekazywanie zapytań do CRM i handlowców", body: "Rozwiązania wspierające pracę handlowców pozwalają porządkować nowe zgłoszenia, przydziały, terminy kontaktu i kolejne etapy obsługi. Działania marketingowe oraz proces sprzedaży powinny być rozpatrywane razem." },
  { title: "Iteracje na podstawie efektów", body: "Kreacje, formularze, grupy odbiorców i miejsca emisji wymagają regularnej oceny. Priorytetem jest jakość kontaktów oraz sprzedaż, a nie sam licznik pozyskanych leadów." },
];
const numbers = [
  { value: "ok. 2 lata", title: "Okres pozyskiwania leadów", detail: "Czas podany przez właściciela firmy." },
  { value: "ok. 90 tys. zł", title: "Łączne wydatki reklamowe", detail: "Szacunkowa kwota przekazana przez właściciela." },
  { value: "wiele mln zł", title: "Obrót przedsiębiorstwa", detail: "Deklarowany obrót firmy, nie przychód przypisany reklamom." },
];
const articleSchema = {
  "@context": "https://schema.org", "@type": "Article", "@id": canonical + "#article",
  headline: "Re-Energy System — pozyskiwanie leadów przez kampanie Meta Ads",
  description: "Case study współpracy w zakresie reklamy i procesu pozyskiwania leadów dla branży odnawialnych źródeł energii.",
  mainEntityOfPage: canonical, inLanguage: "pl-PL",
  author: { "@type": "Person", "@id": "https://bernecki.dev/#person", name: "Kacper Bernecki" },
  about: ["Meta Ads", "lead generation", "OZE", "pozyskiwanie klientów"],
};
export default function ReEnergyMetaAdsCaseStudy() {
  return <main className="min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema)}} />
    <div className="mx-auto max-w-6xl">
      <nav aria-label="Ścieżka strony" className="flex flex-wrap gap-2 text-sm text-white/65"><Link href="/">Portfolio</Link><span>/</span><Link href="/case-studies">Case studies</Link><span>/</span><span>Re-Energy System</span></nav>
      <p className="mt-12 text-xs uppercase tracking-[0.22em] text-white/65">Case study · Meta Ads · Branża OZE</p>
      <h1 className="mt-5 max-w-5xl text-4xl leading-tight md:text-6xl">Re-Energy System: marketing, który zasila proces sprzedaży.</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-white/80">Od około dwóch lat kampanie reklamowe stanowią jedyne źródło pozyskiwania leadów dla Re-Energy System. To nie jest projekt oparty na samym zwiększaniu zasięgu — chodzi o systematyczne dostarczanie zapytań do handlowców.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-3">{numbers.map(item=><div key={item.title} className="rounded-2xl border border-white/20 bg-white/[0.04] p-6"><p className="text-3xl font-semibold text-white md:text-4xl">{item.value}</p><h2 className="mt-4 font-semibold text-white">{item.title}</h2><p className="mt-2 text-sm leading-6 text-white/60">{item.detail}</p></div>)}</div>
      <p className="mt-5 max-w-5xl text-sm leading-7 text-white/60">Źródło liczb: informacje przekazane przez właściciela Re-Energy System; brak niezależnego audytu panelu Meta Ads i danych finansowych. Obrót przedsiębiorstwa nie jest tożsamy z przychodem wygenerowanym przez reklamy. Bez danych o liczbie leadów, ich kwalifikacji i zamkniętych transakcjach nie wyliczamy CPL, CAC ani ROAS.</p>
      <section className="mt-20 grid gap-8 border-t border-white/15 pt-14 md:grid-cols-[1fr_1.6fr]"><div><p className="text-xs uppercase tracking-[0.2em] text-white/60">Wyzwanie</p><h2 className="mt-4 text-3xl">Skąd mają brać się nowe rozmowy sprzedażowe?</h2></div><div className="space-y-5 text-base leading-8 text-white/75"><p>Re-Energy System działa w sektorze fotowoltaiki, magazynów energii i rozwiązań dla gospodarstw domowych oraz firm. Proces sprzedaży wymaga dotarcia do odpowiedniej osoby, wyjaśnienia oferty i szybkiego kontaktu po wysłaniu zgłoszenia.</p><p>Według informacji właściciela kampanie Meta Ads są jedynym źródłem leadów firmy od około dwóch lat. Niski koszt pozyskania kontaktu ocenia on jako jeden z atutów działań; nie publikujemy dokładnej wartości bez potwierdzenia raportami.</p></div></section>
      <section className="mt-20"><p className="text-xs uppercase tracking-[0.2em] text-white/60">Podejście do kampanii</p><h2 className="mt-4 text-3xl">Od reklamy do obsłużonego leada.</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{steps.map((step,i)=><article key={step.title} className="rounded-xl border border-white/15 p-6"><span className="text-sm text-white/55">{String(i+1).padStart(2,"0")}</span><h3 className="mt-4 text-xl font-medium">{step.title}</h3><p className="mt-4 leading-7 text-white/70">{step.body}</p></article>)}</div></section>
      <section className="mt-20 grid gap-8 border-t border-white/15 pt-14 md:grid-cols-[1fr_1.6fr]"><div><p className="text-xs uppercase tracking-[0.2em] text-white/60">Wnioski</p><h2 className="mt-4 text-3xl">Liczy się cały proces, nie samo kliknięcie.</h2></div><div className="space-y-5 leading-8 text-white/75"><p>W branży OZE sam tani formularz nie wystarcza. Warto oceniać kontaktowalność, zainteresowanie konkretną usługą, szybkość oddzwonienia oraz wynik dalszej rozmowy handlowej.</p><p>Ten przykład pokazuje model pozyskiwania zapytań w oparciu o płatne kampanie, ale nie stanowi gwarancji podobnych wyników dla innej firmy. Rezultaty zależą również od oferty, rynku, sezonowości i zespołu sprzedaży.</p></div></section>
      <aside className="mt-20 rounded-2xl border border-white/25 bg-white/[0.04] p-7 md:p-10"><p className="text-xs uppercase tracking-[0.2em] text-white/60">Twój projekt</p><h2 className="mt-4 text-3xl">Chcesz pozyskiwać klientów przez Meta Ads?</h2><p className="mt-4 max-w-2xl leading-8 text-white/75">Możemy połączyć reklamy, formularze, stronę ofertową i obsługę leadów. Zaczynamy od ustalenia produktu, lokalizacji, budżetu i sposobu mierzenia wyniku.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/marketing-i-reklamy" className="rounded-lg border border-white/40 px-5 py-3">Usługi marketingowe →</Link><Link href="/reklamy-meta-ads-dla-firm" className="rounded-lg border border-white/40 px-5 py-3">Jak wygląda współpraca →</Link><Link href="/#contact" className="rounded-lg bg-white px-5 py-3 text-black">Porozmawiajmy →</Link></div></aside>
    </div>
  </main>;
}
