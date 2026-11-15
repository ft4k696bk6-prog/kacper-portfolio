import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pakiety: strony, reklamy, CRM i rozwój firmy – cennik",
  description: "Porównaj pakiety: strona firmowa, reklamy Facebook i Google, strona z reklamami, CRM i automatyzacja. Ceny netto od i jasny zakres.",
  alternates: {canonical:"https://bernecki.dev/pakiety",languages:{"pl-PL":"https://bernecki.dev/pakiety",en:"https://bernecki.dev/en/packages"}}
};
const packages = [
  {name:"Strona na start",price:"od 3 900 zł",period:"jednorazowo",who:"Firma potrzebuje profesjonalnej strony i możliwości pozyskania zapytań.",items:["Strona firmowa z ofertą i kontaktem","Wygląd dopasowany do telefonu","Formularz kontaktowy i podstawy SEO","Test wysyłki zapytań"],extra:"Domena, hosting, dodatkowe treści i integracje osobno.",href:"/tworzenie-stron-internetowych"},
  {name:"Pierwsza kampania reklamowa",price:"od 990 zł",period:"uruchomienie",who:"Chcesz sprawdzić reklamy Google, Facebook lub Instagram.",items:["Wybór jednej platformy i celu","Ustalenie odbiorców lub słów wpisywanych w Google","Przygotowanie podstawowej kampanii","Sprawdzenie, czy zapytania docierają"],extra:"Pieniądze na reklamy płacisz osobno. Dalsze prowadzenie od 1 190 zł netto/mies.",href:"/reklamy-online"},
  {name:"Strona + reklamy",price:"od 4 900 zł",period:"pakiet startowy",who:"Chcesz od razu promować jedną usługę i zbierać zapytania.",items:["Strona docelowa pod jedną ofertę","Formularz i podstawowy pomiar zgłoszeń","Konfiguracja reklam na jednej platformie","Pierwszy miesiąc podstawowej obsługi"],extra:"Budżet na emisję, dodatkowe filmy i kolejne miesiące osobno.",href:"/reklamy-online"},
  {name:"CRM dla zespołu",price:"od 12 000 zł",period:"pierwsza wersja",who:"W firmie giną kontakty, telefony lub informacje o klientach.",items:["Lista klientów i zgłoszeń","Przypisywanie spraw i uprawnienia","Statusy, zadania i terminy kontaktu","Testy i przekazanie pierwszego modułu"],extra:"Większe integracje, import danych i dodatkowe funkcje osobno.",href:"/crm-dla-firm-handlowych"},
  {name:"Automatyzacja zapytań",price:"od 2 500 zł",period:"wdrożenie",who:"Pracownicy ręcznie przepisują zgłoszenia lub zapominają o oddzwonieniu.",items:["Analiza jednego procesu","Przekazanie zgłoszeń z formularza do systemu","Powiadomienia i przypomnienia","Sprawdzenie działania oraz błędów"],extra:"Zewnętrzne abonamenty i dodatkowe systemy osobno.",href:"/automatyzacja-leadow-i-sprzedazy"}
] as const;

export default function PackagesPage() {
 return <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
  <div className="mx-auto max-w-6xl">
   <nav className="text-sm text-white/60"><Link href="/">Start</Link> / <Link href="/#cennik">Cennik</Link> / Pakiety</nav>
   <p className="mt-12 text-xs uppercase tracking-widest text-white/60">Przejrzyste ceny i zakres</p>
   <h1 className="mt-4 max-w-5xl text-4xl leading-tight md:text-6xl">Pakiety dla firm – strony, reklamy, CRM i rozwój biznesu</h1>
   <p className="mt-7 max-w-4xl text-lg leading-8 text-white/75">Wybierz to, co chcesz osiągnąć. Każdy pakiet zawiera najważniejsze elementy usługi oraz orientacyjną cenę początkową netto. Jeżeli potrzebujesz tylko jednej rzeczy, zobacz cennik pojedynczych usług.</p>
   <nav aria-label="Wybierz rodzaj cennika" className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
     <Link href="/pakiety" aria-current="page" className="rounded-xl border border-white/70 bg-white/15 p-5 font-semibold">Pakiety – usługi w zestawie</Link>
     <Link href="/cennik" className="rounded-xl border border-white/25 p-5 font-semibold hover:border-white/60">Cennik pojedynczych usług</Link>
   </nav>
   <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Pakiety współpracy">
    {packages.map(p=><article key={p.name} className="surface-card flex flex-col rounded-2xl border border-white/20 p-7 md:p-9">
      <h2 className="text-2xl font-semibold">{p.name}</h2>
      <p className="mt-3 text-3xl font-semibold">{p.price} <span className="text-sm font-normal text-white/60">netto · {p.period}</span></p>
      <p className="mt-5 leading-7 text-white/80">{p.who}</p>
      <p className="mt-7 text-sm font-semibold">W pakiecie:</p>
      <ul className="mt-3 list-disc space-y-3 pl-5 leading-7 text-white/75">{p.items.map(i=><li key={i}>{i}</li>)}</ul>
      <p className="mt-7 text-sm leading-6 text-white/55">{p.extra}</p>
      <div className="mt-auto flex flex-wrap gap-4 pt-7">
        <Link href={"/kontakt?usluga="+encodeURIComponent(p.name)} className="brand-action rounded-lg px-5 py-3 font-semibold text-black">Zapytaj o pakiet</Link>
        <Link href={p.href} className="rounded-lg border border-white/25 px-5 py-3 hover:border-white/60">Szczegóły usługi</Link>
      </div>
    </article>)}
   </section>

   <section className="mt-20" aria-labelledby="strategy-packages">
     <h2 id="strategy-packages" className="text-3xl font-semibold">Pakiety rozwoju biznesu</h2>
     <p className="mt-4 max-w-4xl leading-8 text-white/70">Jeśli potrzebujesz nie tylko strony lub reklam, ale też analizy sprzedaży, planu rozwoju i nadzoru nad działaniami firmy, są trzy dodatkowe warianty. To te same pakiety, które są opisane w ofercie współpracy biznesowej.</p>
     <div className="mt-8 grid gap-5 md:grid-cols-3">
       {[
         {id:"audyt",name:"Audyt i plan działania",price:"od 3 900 zł",period:"jednorazowo",desc:"Analiza strony, reklam i obsługi zapytań oraz plan priorytetów na 30 dni."},
         {id:"partner",name:"Partner ds. wzrostu",price:"od 7 900 zł",period:"miesięcznie",desc:"Stała analiza pozyskiwania klientów, reklam, SEO i procesu sprzedaży."},
         {id:"dyrektor",name:"Partner strategiczno-operacyjny",price:"od 12 900 zł",period:"miesięcznie",desc:"Szersze wsparcie właściciela: marketing, CRM, sprzedaż i nadzór nad zmianami."}
       ].map(p=><article key={p.id} className="flex flex-col rounded-2xl border border-white/20 p-7">
         <h3 className="text-2xl">{p.name}</h3>
         <p className="mt-3 text-2xl font-semibold">{p.price} <span className="text-sm font-normal text-white/60">netto · {p.period}</span></p>
         <p className="mt-5 leading-7 text-white/70">{p.desc}</p>
         <div className="mt-auto flex flex-col gap-4 pt-7">
           <Link href={"/kontakt?usluga=Rozw%C3%B3j%20biznesu&pakiet="+p.id} className="brand-action rounded-xl px-5 py-3 text-center font-semibold text-black">Zapytaj o pakiet</Link>
           <Link href="/partner-w-rozwoju-biznesu#pakiety" className="text-center underline underline-offset-4">Zobacz cały zakres</Link>
         </div>
       </article>)}
     </div>
   </section>
   <section className="mt-16 rounded-2xl border border-white/20 bg-white/[0.035] p-7 md:p-10">
    <h2 className="text-3xl">Co jest dodatkowo płatne?</h2>
    <p className="mt-5 max-w-4xl leading-8 text-white/75">Ceny to orientacyjne kwoty netto za podstawowy zakres. Ostateczna wycena zależy od liczby funkcji i integracji. Wydatki na same reklamy zawsze rozliczasz osobno z platformą. Domena, hosting, filmy i dodatkowe moduły mogą wymagać osobnej opłaty.</p>
    <div className="mt-7 flex flex-wrap gap-5"><Link href="/cennik" className="underline underline-offset-4">Cennik pojedynczych usług</Link><Link href="/case-studies" className="underline underline-offset-4">Zobacz realizacje</Link><Link href="/kontakt" className="underline underline-offset-4">Poproś o wycenę</Link></div>
   </section>
  </div>
 </main>;
}