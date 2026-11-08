import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronRight } from "lucide-react";

const url="https://bernecki.dev/zewnetrzny-dyrektor";
export const metadata:Metadata={
 title:"Zewnętrzny dyrektor marketingu, sprzedaży i operacji | Kacper Bernecki",
 description:"Zewnętrzne wsparcie właściciela firmy: audyt utraconych szans sprzedaży, marketing, CRM, procesy i nadzór nad wdrożeniem. Pakiety od 3900 zł netto i współpraca miesięczna.",
 alternates:{canonical:url},
 openGraph:{title:"Zewnętrzny dyrektor marketingu, sprzedaży i operacji",description:"Jedna osoba do diagnozy problemów i koordynowania działań marketingowych, sprzedażowych i operacyjnych.",url,type:"website"}
};
const packages=[
 {id:"audyt",name:"Audyt i plan działania",price:"3 900 zł",period:"jednorazowo",summary:"Na początek: gdzie firma traci szanse i co poprawić najpierw.",points:["Przegląd pozyskiwania zapytań, strony, reklam i obsługi kontaktów","Mapa wąskich gardeł i kosztów w procesie sprzedaży","Lista priorytetów z planem na najbliższe 30 dni"],hint:"Wdrożenie zmian jest wyceniane oddzielnie."},
 {id:"partner",name:"Partner ds. wzrostu",price:"7 900 zł",period:"miesięcznie",summary:"Stała opieka nad marketingiem i procesem pozyskiwania klientów.",points:["Regularna analiza wyników, kosztów i jakości leadów","Kierunek dla reklam, strony, SEO i komunikacji","Koordynacja wybranych zmian z zespołem i wykonawcami"],hint:"Zakres operacyjny i liczba kanałów są ustalane indywidualnie."},
 {id:"dyrektor",name:"Dyrektor na wynajęcie",price:"12 900 zł",period:"miesięcznie, od",summary:"Szersze wsparcie właściciela: marketing, sprzedaż i operacje.",points:["Przegląd lejka sprzedaży, CRM, raportów i odpowiedzialności w zespole","Ustalenie KPI, priorytetów i rytmu kontroli wyników","Nadzór nad wdrożeniami, automatyzacjami i wykonawcami"],hint:"Nie oznacza przejęcia formalnej funkcji członka zarządu ani odpowiedzialności pracodawcy."},
] as const;
const areas=[
 {title:"Marketing i pozyskiwanie klientów",body:"Kampanie, SEO, widoczność, strony i analiza, które źródła naprawdę prowadzą do rozmów i transakcji."},
 {title:"Proces sprzedaży i CRM",body:"Kiedy kontakt przepada? Kto oddzwania? Co pokazują statusy, oferta, czas reakcji i raportowanie?"},
 {title:"Operacje i koszty",body:"Powtarzalna praca, chaos między ludźmi, błędne decyzje narzędziowe i zadania, które można uprościć lub zautomatyzować."},
] as const;
const faq=[
 ["Czy muszę zamawiać cały pakiet?","Nie. Możemy zacząć od jednorazowego audytu albo od jednego ustalonego obszaru. Pakiety są orientacyjnym punktem wyjścia."],
 ["Czy wykonujesz wszystko sam?","Biorę odpowiedzialność za ustalony zakres i koordynację. Prace specjalistyczne mogą realizować współpracownicy lub dotychczasowy zespół klienta."],
 ["Czy gwarantujesz wzrost sprzedaży?","Nie obiecuję wyniku przed wglądem w dane. Ustalamy mierniki, sprawdzamy hipotezy i rozliczamy uzgodniony zakres pracy."],
 ["Czy budżet reklamowy i wdrożenia są w cenie?","Nie. Budżety mediowe, płatne narzędzia i większe wdrożenia są wyceniane oraz zatwierdzane osobno."],
 ["Czy możesz zarządzać formalnie firmą?","Oferta obejmuje zewnętrzne wsparcie doradczo-operacyjne i koordynację, a nie pełnienie funkcji organu spółki. Sprawy prawne, podatkowe i księgowe wymagają właściwych specjalistów."],
] as const;
const schema={"@context":"https://schema.org","@graph":[
 {"@type":"Service","@id":url+"#service",name:"Zewnętrzny dyrektor marketingu, sprzedaży i operacji",description:"Stałe wsparcie właścicieli firm w marketingu, procesie sprzedaży, CRM i usprawnieniach operacyjnych.",serviceType:"Fractional marketing, sales and operations leadership",url,provider:{"@id":"https://bernecki.dev/#person"},areaServed:{"@type":"Country",name:"Polska"}},
 {"@type":"FAQPage",mainEntity:faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))},
 {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Portfolio",item:"https://bernecki.dev/"},{"@type":"ListItem",position:2,name:"Zewnętrzny dyrektor",item:url}]}
]};
export default function FractionalDirectorPage(){
 return <main className="site-page min-h-screen bg-[var(--brand-black)] text-white">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
  <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
   <nav aria-label="Ścieżka strony" className="flex flex-wrap items-center gap-2 text-sm text-white/60"><Link href="/" className="hover:text-white">Portfolio</Link><ChevronRight size={15}/><span className="text-white/80">Zewnętrzny dyrektor</span></nav>
   <header className="max-w-4xl border-b border-white/10 pb-16 pt-14">
    <p className="text-xs font-semibold uppercase tracking-[.2em] text-white/60">Dla właścicieli działających firm</p>
    <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Zewnętrzny dyrektor marketingu, sprzedaży i operacji.</h1>
    <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">Masz działający biznes, ale nie chcesz sam pilnować reklam, strony, CRM, handlowców i kolejnych wykonawców? Sprawdzę, gdzie uciekają pieniądze i szanse sprzedażowe, ustalę priorytety i pomogę doprowadzić zmiany do końca.</p>
    <p className="mt-5 max-w-3xl text-sm leading-7 text-white/55">Współpracujesz ze mną bezpośrednio. To zewnętrzna funkcja doradczo-wdrożeniowa, a nie kolejna agencja od pojedynczych zadań.</p>
    <div className="mt-8 flex flex-wrap gap-3">
     <Link href="#pakiety" className="brand-action inline-flex min-h-12 items-center gap-2 rounded-lg px-6 py-3 font-semibold text-black">Sprawdź pakiety <ArrowRight size={18}/></Link>
     <Link href="/kontakt?usluga=Rozw%C3%B3j%20biznesu#kalendarz" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold">Umów rozmowę <ArrowUpRight size={17}/></Link>
    </div>
   </header>
   <section className="py-16">
    <p className="text-xs uppercase tracking-[.18em] text-white/60">Co sprawdzam</p>
    <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Najpierw szukam problemu, nie kolejnego narzędzia.</h2>
    <div className="mt-8 grid gap-4 md:grid-cols-3">{areas.map(({title,body},i)=><article key={title} className="rounded-xl border border-white/15 bg-white/[.025] p-6"><p className="text-sm text-white/50">0{i+1}</p><h3 className="mt-4 text-xl font-semibold">{title}</h3><p className="mt-3 leading-7 text-white/70">{body}</p></article>)}</div>
   </section>
   <section className="border-y border-white/10 py-16">
    <h2 className="text-3xl font-semibold">Nie tylko strategia. Również wykonanie.</h2>
    <p className="mt-5 max-w-3xl leading-8 text-white/70">Mogę zaprojektować zmianę, przygotować wymagania, wdrożyć część techniczną, koordynować wykonawców i kontrolować efekt. Zakres ustalamy przed współpracą — nie sprzedaję obietnicy, że jeden człowiek zrobi wszystko sam.</p>
    <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/80">{["Audyt procesu","Plan i priorytety","CRM i automatyzacje","Marketing i reklamy","Raportowanie i kontrola"].map(item=><span key={item} className="inline-flex items-center gap-2"><Check size={17}/>{item}</span>)}</div>
   </section>
   <section id="pakiety" className="scroll-mt-24 py-20">
    <p className="text-xs uppercase tracking-[.18em] text-white/60">Warianty współpracy</p>
    <h2 className="mt-3 text-3xl font-semibold md:text-4xl">Wiesz, od jakiego budżetu zaczynamy.</h2>
    <p className="mt-5 max-w-3xl leading-7 text-white/70">Ceny orientacyjne netto. Ostateczna wycena zależy od liczby marek, ludzi, kanałów, dostępu do danych i czasu potrzebnego na nadzór. Budżety reklamowe, narzędzia i duże wdrożenia są rozliczane osobno.</p>
    <div className="mt-9 grid gap-4 lg:grid-cols-3">{packages.map((p,i)=><article key={p.id} className={`flex flex-col rounded-2xl border p-6 ${i===2?"border-white/40 bg-white/[.065]":"border-white/15 bg-white/[.025]"}`}>
     <p className="text-sm font-semibold text-white/80">{p.name}</p><div className="mt-6"><p className="text-3xl font-semibold tracking-tight">od {p.price}</p><p className="mt-1 text-xs text-white/60">{p.period} · netto</p></div>
     <p className="mt-5 min-h-20 text-sm leading-7 text-white/75">{p.summary}</p>
     <ul className="mt-5 flex-1 space-y-4 border-t border-white/10 pt-6">{p.points.map(point=><li key={point} className="flex items-start gap-3 text-sm leading-6 text-white/80"><Check className="mt-1 h-4 w-4 shrink-0"/>{point}</li>)}</ul>
     <p className="mt-6 text-xs leading-5 text-white/50">{p.hint}</p>
     <div className="mt-6 flex flex-col gap-2">
      <Link href={`/kontakt?usluga=Rozw%C3%B3j%20biznesu&pakiet=${p.id}`} className="brand-action inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-black">Zapytaj o ten wariant <ArrowUpRight size={16}/></Link>
      <Link href={`/kontakt?usluga=Rozw%C3%B3j%20biznesu&pakiet=${p.id}#kalendarz`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm text-white/85">Umów rozmowę o pakiecie <ArrowRight size={16}/></Link>
     </div>
    </article>)}</div>
   </section>
   <section className="border-t border-white/10 py-16">
    <p className="text-xs uppercase tracking-[.18em] text-white/60">Przykłady z praktyki</p>
    <h2 className="mt-3 text-3xl font-semibold">Pracuję z realnymi firmami i systemami.</h2>
    <p className="mt-4 max-w-3xl leading-7 text-white/70">Prowadzę własne przedsięwzięcia i znam odpowiedzialność za pozyskanie klienta, koszty oraz obsługę leadów. Zobacz wybrane realizacje — bez obiecywania, że identyczny wynik powtórzy się w każdej branży.</p>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
     <Link href="/case-studies/re-energy-meta-ads" className="rounded-xl border border-white/15 p-6 hover:border-white/50"><h3 className="font-semibold">Re-Energy System</h3><p className="mt-3 text-sm leading-6 text-white/70">Kampanie Meta Ads połączone z pozyskiwaniem leadów i procesem sprzedaży.</p><span className="mt-5 inline-flex items-center gap-2 text-sm underline underline-offset-4">Zobacz case study <ArrowRight size={15}/></span></Link>
     <Link href="/case-studies/b-crm" className="rounded-xl border border-white/15 p-6 hover:border-white/50"><h3 className="font-semibold">B-CRM</h3><p className="mt-3 text-sm leading-6 text-white/70">System zarządzania kontaktami i kolejnymi etapami pracy zespołu.</p><span className="mt-5 inline-flex items-center gap-2 text-sm underline underline-offset-4">Zobacz realizację <ArrowRight size={15}/></span></Link>
     <Link href="/case-studies/isto-kebab" className="rounded-xl border border-white/15 p-6 hover:border-white/50"><h3 className="font-semibold">Isto Kebab</h3><p className="mt-3 text-sm leading-6 text-white/70">Strona i doświadczenie klienta połączone z procesem zamawiania.</p><span className="mt-5 inline-flex items-center gap-2 text-sm underline underline-offset-4">Zobacz realizację <ArrowRight size={15}/></span></Link>
    </div>
   </section>
   <section className="border-y border-white/10 py-16"><h2 className="text-3xl font-semibold">Pytania przed rozmową</h2><div className="mt-8 space-y-3">{faq.map(([q,a])=><details key={q} className="rounded-lg border border-white/15 p-5"><summary className="cursor-pointer font-medium">{q}</summary><p className="mt-4 text-sm leading-7 text-white/70">{a}</p></details>)}</div></section>
   <section className="mt-16 rounded-2xl border border-white/25 bg-white/[.04] p-7 md:p-10">
    <h2 className="max-w-3xl text-3xl font-semibold">Opowiedz, jak dziś działa Twoja firma.</h2>
    <p className="mt-4 max-w-3xl leading-7 text-white/70">Wystarczy kilka zdań o biznesie i największym problemie. Zdecydujemy, czy sens ma audyt, stałe wsparcie, czy pojedyncze wdrożenie.</p>
    <div className="mt-7 flex flex-wrap gap-3"><Link href="/kontakt?usluga=Rozw%C3%B3j%20biznesu" className="brand-action inline-flex min-h-12 items-center gap-2 rounded-lg px-6 py-3 font-semibold text-black">Wyślij zapytanie <ArrowUpRight size={18}/></Link><Link href="/kontakt?usluga=Rozw%C3%B3j%20biznesu#kalendarz" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/25 px-6 py-3 text-sm">Wybierz termin rozmowy <ArrowRight size={17}/></Link></div>
   </section>
  </div>
 </main>;
}
