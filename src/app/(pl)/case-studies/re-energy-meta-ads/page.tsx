import type { Metadata } from "next";
import Link from "next/link";

const canonical = "https://bernecki.dev/case-studies/re-energy-meta-ads";
export const metadata: Metadata = {
  title: { absolute: "Re-Energy System – wyniki Meta Ads | Kacper Bernecki" },
  description: "Około 2 lata kampanii Meta Ads dla firmy OZE: 90 837 zł budżetu reklamowego, 2 331 pozyskanych kontaktów w wybranych kampaniach i 6 mln zł obrotu firmy.",
  alternates: { canonical, languages:{"pl-PL":canonical,en:"https://bernecki.dev/en/case-studies/re-energy-meta-ads"} },
  openGraph: { title: "Re-Energy System | Case study Meta Ads — Kacper Bernecki", description: "Pozyskiwanie kontaktów dla firmy OZE: kampanie Meta Ads, formularze, obsługa leadów i wyniki Re-Energy System.", url: canonical, type: "article", locale: "pl_PL" },
};

const steps = [
  { title: "Cel biznesowy: regularny dopływ zapytań", body: "Kampania nie miała wyłącznie generować zasięgu. Jej zadaniem było dostarczanie kontaktów do osób zainteresowanych fotowoltaiką, magazynami energii i innymi rozwiązaniami OZE." },
  { title: "Oferta dopasowana do odbiorcy", body: "Komunikaty reklamowe odnoszą się do realnych problemów klienta: kosztów energii, opłacalności magazynu, autokonsumpcji i bezpieczeństwa zasilania. Oferta oraz treść formularza mają tłumaczyć, czego dotyczy kontakt." },
  { title: "Formularze i kwalifikowanie leadów", body: "Ważna jest nie tylko cena wypełnienia formularza, ale też możliwość kontaktu, lokalizacja, rodzaj instalacji i dopasowanie do procesu sprzedaży. Słaby jakościowo lead może być droższy niż kontakt z wyższą ceną zakupu." },
  { title: "Przekazywanie zapytań do CRM i handlowców", body: "Rozwiązania wspierające pracę handlowców pozwalają porządkować nowe zgłoszenia, przydziały, terminy kontaktu i kolejne etapy obsługi. Działania marketingowe oraz proces sprzedaży powinny być rozpatrywane razem." },
  { title: "Iteracje na podstawie efektów", body: "Kreacje, formularze, grupy odbiorców i miejsca emisji wymagają regularnej oceny. Priorytetem jest jakość kontaktów oraz sprzedaż, a nie sam licznik pozyskanych leadów." },
];
const numbers = [
  { value: "ok. 2 lata", title: "Kampanie Meta Ads", detail: "Stałe pozyskiwanie zapytań i wsparcie rekrutacji." },
  { value: "90 837 zł", title: "Budżet reklamowy", detail: "Łączne wydatki na kampanie pozyskiwania kontaktów." },
  { value: "6 mln zł", title: "Obrót firmy", detail: "Skala działalności Re-Energy System w okresie współpracy." },
];
const screenshotMetrics = [
  { value: "2 331", title: "Pozyskane kontakty", detail: "Łączny wynik 17 kampanii nastawionych na zapytania." },
  { value: "29,79 zł", title: "Średni koszt kontaktu", detail: "Średni koszt pozyskania zgłoszenia z kampanii." },
  { value: "ok. 69,4 tys. zł", title: "Budżet 17 kampanii", detail: "Wydatki na kampanie uwzględnione w zestawieniu kontaktów." },
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
  return <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(articleSchema)}} />
    <div className="mx-auto max-w-6xl">
      <nav aria-label="Ścieżka strony" className="flex flex-wrap gap-2 text-sm text-white/65"><Link href="/">Portfolio</Link><span>/</span><Link href="/case-studies">Case studies</Link><span>/</span><span>Re-Energy System</span></nav>
      <p className="mt-12 text-xs uppercase tracking-[0.22em] text-white/65">Case study · Meta Ads · Branża OZE</p>
      <h1 className="mt-5 max-w-5xl text-4xl leading-tight md:text-6xl">Re-Energy System: marketing, który zasila proces sprzedaży.</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-white/80">Od około dwóch lat kampanie reklamowe stanowią jedyne źródło pozyskiwania leadów dla Re-Energy System. To nie jest projekt oparty na samym zwiększaniu zasięgu — chodzi o systematyczne dostarczanie zapytań do handlowców.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-3">{numbers.map(item=><div key={item.title} className="surface-card rounded-2xl border border-white/20 bg-white/[0.04] p-6"><p className="text-3xl font-semibold text-white md:text-4xl">{item.value}</p><h2 className="mt-4 font-semibold text-white">{item.title}</h2><p className="mt-2 text-sm leading-6 text-white/60">{item.detail}</p></div>)}</div>
      <section aria-labelledby="meta-ads-wyniki" className="surface-card mt-20 rounded-2xl border border-white/20 bg-white/[0.035] p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-white/65">Wyniki kampanii Meta Ads</p>
        <h2 id="meta-ads-wyniki" className="mt-4 max-w-4xl text-3xl md:text-4xl">2 331 kontaktów przy średnim koszcie około 29,79 zł.</h2>
        <p className="mt-5 max-w-3xl leading-8 text-white/75">17 kampanii skoncentrowanych na pozyskiwaniu kontaktów. Poniżej łączne wyniki i średni koszt pojedynczego zgłoszenia.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{screenshotMetrics.map(item => <div key={item.title} className="surface-card rounded-xl border border-white/15 bg-black/20 p-5"><p className="text-3xl font-semibold md:text-4xl">{item.value}</p><h3 className="mt-4 font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{item.detail}</p></div>)}</div>
        <p className="mt-5 text-sm leading-7 text-white/60">W zestawieniu ujęto kampanie leadowe, bez kampanii rekrutacyjnych i wizerunkowych. Średni koszt dotyczy pozyskanego kontaktu z formularza reklamowego.</p>
      </section>
      <section className="mt-20 grid gap-8 border-t border-white/15 pt-14 md:grid-cols-[1fr_1.6fr]"><div><p className="text-xs uppercase tracking-[0.2em] text-white/60">Wyzwanie</p><h2 className="mt-4 text-3xl">Skąd mają brać się nowe rozmowy sprzedażowe?</h2></div><div className="space-y-5 text-base leading-8 text-white/75"><p>Re-Energy System działa w sektorze fotowoltaiki, magazynów energii i rozwiązań dla gospodarstw domowych oraz firm. Proces sprzedaży wymaga dotarcia do odpowiedniej osoby, wyjaśnienia oferty i szybkiego kontaktu po wysłaniu zgłoszenia.</p><p>Przez około dwa lata kampanie Meta Ads stanowiły źródło nowych zapytań dla zespołu handlowego. Połączenie reklam, formularzy i CRM usprawnia drogę od zgłoszenia do rozmowy z klientem.</p></div></section>
      <section className="mt-20"><p className="text-xs uppercase tracking-[0.2em] text-white/60">Podejście do kampanii</p><h2 className="mt-4 text-3xl">Od reklamy do obsłużonego leada.</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{steps.map((step,i)=><article key={step.title} className="surface-card rounded-xl border border-white/15 p-6"><span className="text-sm text-white/55">{String(i+1).padStart(2,"0")}</span><h3 className="mt-4 text-xl font-medium">{step.title}</h3><p className="mt-4 leading-7 text-white/70">{step.body}</p></article>)}</div></section>
      <section className="mt-20 grid gap-8 border-t border-white/15 pt-14 md:grid-cols-[1fr_1.6fr]"><div><p className="text-xs uppercase tracking-[0.2em] text-white/60">Wnioski</p><h2 className="mt-4 text-3xl">Liczy się cały proces, nie samo kliknięcie.</h2></div><div className="space-y-5 leading-8 text-white/75"><p>W branży OZE sam tani formularz nie wystarcza. Warto oceniać kontaktowalność, zainteresowanie konkretną usługą, szybkość oddzwonienia oraz wynik dalszej rozmowy handlowej.</p><p>Model kampanii dopasowuję do oferty, rynku i zespołu sprzedaży. Sam koszt kontaktu to punkt wyjścia — liczy się także jakość zgłoszenia i dalsza obsługa.</p></div></section>
      <section className="mt-16">
        <h2 className="text-2xl md:text-3xl">Praktyczne materiały powiązane z kampanią</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            ["/poradniki/ile-kosztuje-lead-z-facebook-ads", "Ile kosztuje lead z Facebook Ads i jak liczyć CPL?"],
            ["/poradniki/facebook-lead-ads-integracja-z-crm", "Jak przekazać formularze Meta Ads do CRM?"],
            ["/poradniki/reklamy-oze-magazyny-energii", "Jak pozyskiwać zapytania na magazyny energii?"],
            ["/poradniki/formularz-meta-ads-czy-landing-page", "Formularz Meta czy landing page — co wybrać?"],
          ].map(([href,label])=><Link key={href} href={href} className="surface-card rounded-xl border border-white/15 p-5 leading-7 text-white/85 transition hover:border-white/50">{label} →</Link>)}
        </div>
      </section>
      <aside className="surface-card mt-20 rounded-2xl border border-white/25 bg-white/[0.04] p-7 md:p-10"><p className="text-xs uppercase tracking-[0.2em] text-white/60">Twój projekt</p><h2 className="mt-4 text-3xl">Chcesz pozyskiwać klientów przez Meta Ads?</h2><p className="mt-4 max-w-2xl leading-8 text-white/75">Możemy połączyć reklamy, formularze, stronę ofertową i obsługę leadów. Zaczynamy od ustalenia produktu, lokalizacji, budżetu i sposobu mierzenia wyniku.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/marketing-i-reklamy" className="rounded-lg brand-outline px-5 py-3">Usługi marketingowe →</Link><Link href="/reklamy-meta-ads-dla-firm" className="rounded-lg brand-outline px-5 py-3">Jak wygląda współpraca →</Link><Link href="/#contact" className="rounded-lg brand-action px-5 py-3 text-black">Porozmawiajmy →</Link></div></aside>
    </div>
  </main>;
}
