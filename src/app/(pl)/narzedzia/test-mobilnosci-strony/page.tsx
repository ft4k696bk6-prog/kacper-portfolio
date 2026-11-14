import type { Metadata } from "next";
import Link from "next/link";
import { FullWebsiteAuditRunner } from "@/components/FullWebsiteAuditRunner";

export const metadata:Metadata={
  title:"Test strony na telefonie — bezpłatnie | bernecki.dev",
  description:"Przetestuj meta viewport, HTML i SEO strony mobilnej. Sprawdź 8 punktów kontrolnych dla iPhone i Androida. Bez rejestracji. To nie Lighthouse.",
  alternates:{canonical:"https://bernecki.dev/narzedzia/test-mobilnosci-strony"},
  openGraph:{title:"Test strony mobilnej i darmowy audyt HTML",description:"Sprawdź viewport, SEO i praktyczną checklistę dla iPhone oraz Androida.",url:"https://bernecki.dev/narzedzia/test-mobilnosci-strony",type:"website"}
};
const checks=[
  ["Bez poziomego przewijania","Zweryfikuj ekran o szerokości 320–430 px i większy tablet."],
  ["Bez niechcianego powiększania przy formularzu","Na iPhonie dotknij wszystkich pól; ekran nie powinien nieoczekiwanie przybliżać treści."],
  ["Czytelne menu i kontakt","Otwórz i zamknij nawigację, sprawdź telefon i CTA jedną ręką."],
  ["Formularz naprawdę działa","Wyślij testowe zapytanie i potwierdź dostarczenie, nie tylko kliknięcie przycisku."],
  ["Okna i czat nie zasłaniają strony","Sprawdź zamykanie kliknięciem poza oknem, przewijanie oraz klawiaturę mobilną."],
  ["Właściwe typy klawiatury","Pole telefonu powinno wywoływać klawiaturę numeryczną, e-mail — odpowiedni układ."],
  ["Brak zasłoniętych elementów","Porównaj widok po obrocie ekranu oraz z widoczną klawiaturą."],
  ["Wydajność i dostępność","Porównaj Lighthouse i PageSpeed Insights, również na realnym telefonie."]
];
export default function MobileFriendlyPage(){
  const url="https://bernecki.dev/narzedzia/test-mobilnosci-strony";
  const schema={"@context":"https://schema.org","@graph":[
    {"@type":"WebPage",name:"Darmowy test strony mobilnej",url,inLanguage:"pl-PL",isAccessibleForFree:true,description:"Wstępny audyt techniczny i ręczna checklista funkcjonalności mobilnej."},
    {"@type":"BreadcrumbList",itemListElement:[
      {"@type":"ListItem",position:1,name:"Start",item:"https://bernecki.dev/"},
      {"@type":"ListItem",position:2,name:"Darmowe narzędzia",item:"https://bernecki.dev/narzedzia"},
      {"@type":"ListItem",position:3,name:"Test mobilności",item:url}
    ]}
  ]};
  return <main className="site-page mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <nav className="text-xs text-white/60"><Link href="/">Start</Link> / <Link href="/narzedzia">Darmowe narzędzia</Link> / Test strony mobilnej</nav>
    <header className="mb-10 mt-12 max-w-4xl">
      <p className="page-eyebrow">DARMOWE NARZĘDZIE / BEZ REJESTRACJI</p>
      <h1 className="mt-5">Test strony na telefonie — co działa, a co wymaga poprawy?</h1>
      <p className="page-intro mt-6 text-base md:text-lg">Wykonaj bezpłatną kontrolę HTML i meta viewport swojej witryny oraz skorzystaj z praktycznej checklisty dla iPhone i Androida. Bez konta i karty kredytowej.</p>
      <p className="mt-4 text-sm leading-7 text-white/65">To wstępny audyt techniczny, a nie emulacja rzeczywistego urządzenia. Nie wykryje wszystkich błędów CSS i dotyku ani nie mierzy Core Web Vitals. Dlatego poniżej znajdują się także narzędzia Google i lista testów ręcznych.</p>
    </header>
    <FullWebsiteAuditRunner/>
    <section className="mt-16">
      <h2 className="text-3xl">8 testów, które warto przejść na prawdziwym telefonie</h2>
      <div className="mt-7 grid gap-3 md:grid-cols-2">{checks.map(([title,description],i)=>
        <article key={title} className="rounded-xl border border-white/15 bg-[#111] p-6"><p className="text-xs text-white/45">{String(i+1).padStart(2,"0")}</p><h3 className="mt-3 text-lg font-medium">{title}</h3><p className="mt-2 text-sm leading-7 text-white/65">{description}</p></article>
      )}</div>
    </section>
    <section className="mt-16 rounded-2xl border border-white/20 p-7">
      <h2 className="text-2xl">Stary Google Mobile-Friendly Test został wycofany</h2>
      <p className="mt-4 leading-8 text-white/75">Google zakończył działanie narzędzia w grudniu 2023 r. Do dokładniejszych pomiarów wykorzystaj <a className="underline underline-offset-4" href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">Google PageSpeed Insights</a> oraz Lighthouse w Chrome. Zobacz też <Link className="underline underline-offset-4" href="/poradniki/google-mobile-friendly-test-nie-dziala-jak-sprawdzic-strone-mobilna">poradnik o wycofanym teście Google i jego zamiennikach</Link>.</p>
    </section>
  </main>;
}
