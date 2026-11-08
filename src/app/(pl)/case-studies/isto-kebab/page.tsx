import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const url="https://bernecki.dev/case-studies/isto-kebab";
export const metadata: Metadata = {
 title:"Isto Kebab — strona restauracji, menu i zamówienia | Case study",
 description:"Zobacz realizację strony Isto Kebab: mobilne menu, prezentacja produktów, wybór wariantów i proces składania zamówień. Rzeczywisty zrzut ekranu.",
 alternates:{canonical:url},
 openGraph:{title:"Isto Kebab — strona i zamówienia",description:"Wdrożenie witryny restauracji i interaktywnego menu.",url,type:"article",locale:"pl_PL",images:[{url:"/images/projects/isto-live-nov08.jpg",alt:"Zrzut rzeczywistej witryny Isto Kebab"}]},
};
const features=[
 "Responsywna strona restauracji z jasną prezentacją menu i oferty",
 "Wybór pozycji oraz wariantów produktów w interaktywnym interfejsie",
 "Proces składania zamówienia połączony z osobną logiką operacyjną",
 "Informacje potrzebne do podjęcia decyzji i kontaktu z lokalem",
];
const schema={"@context":"https://schema.org","@type":"Article","@id":url+"#project",mainEntityOfPage:url,headline:"Isto Kebab — strona i zamówienia",name:"Isto Kebab — strona i zamówienia",url,author:{"@id":"https://bernecki.dev/#person"},image:"https://bernecki.dev/images/projects/isto-live-nov08.jpg",description:"Wdrożenie strony restauracji, menu i procesu zamawiania.",inLanguage:"pl-PL"};
export default function IstoCaseStudy(){
 return <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
  <article className="mx-auto max-w-5xl">
   <Link href="/case-studies" className="text-sm text-white/65 underline">← Wszystkie realizacje</Link>
   <p className="mt-10 text-xs uppercase tracking-[.2em] text-white/55">Studium przypadku · Strona internetowa i proces zamówień</p>
   <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">Isto Kebab — strona, menu i zamówienia</h1>
   <p className="mt-7 max-w-3xl text-lg leading-8 text-white/75">Przygotowanie witryny gastronomicznej, która pokazuje produkty i umożliwia przejście od przeglądania oferty do składania zamówienia.</p>
   <div className="mt-8 flex flex-wrap gap-3"><a href="https://isto.bernecki.dev" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white px-5 py-3 font-semibold text-black">Otwórz działającą stronę</a><Link href="/tworzenie-stron-internetowych" className="rounded-lg border border-white/25 px-5 py-3 text-white">Zobacz ofertę stron</Link></div>
   <figure className="mt-12 overflow-hidden rounded-xl border border-white/15 bg-[#101010]">
    <Image src="/images/projects/isto-live-nov08.jpg" alt="Rzeczywisty zrzut strony Isto Kebab z listopada 2026" width={1200} height={784} sizes="(max-width: 768px) 100vw, 1000px" className="h-auto w-full"/>
    <figcaption className="p-4 text-xs leading-6 text-white/60">Zrzut rzeczywistej strony — nie wizualizacja generowana przez AI.</figcaption>
   </figure>
   <div className="mt-12 grid gap-5 md:grid-cols-2">
    <section className="rounded-xl border border-white/15 p-7"><h2 className="text-2xl font-semibold">Problem</h2><p className="mt-4 leading-8 text-white/75">Klient restauracji powinien szybko sprawdzić ofertę, warianty pozycji oraz sposób złożenia zamówienia. Sama statyczna lista dań nie prowadzi przez cały proces.</p></section>
    <section className="rounded-xl border border-white/15 p-7"><h2 className="text-2xl font-semibold">Zakres wykonania</h2><p className="mt-4 leading-8 text-white/75">Koncepcja wizualna, responsywna prezentacja menu i interfejs zamawiania. Osobny moduł obsługuje logikę zamówień i proces operacyjny.</p></section>
   </div>
   <section className="mt-9 rounded-xl border border-white/15 p-7"><h2 className="text-2xl font-semibold">Najważniejsze funkcje</h2><ul className="mt-5 grid gap-4 sm:grid-cols-2">{features.map(f=><li key={f} className="flex gap-3 leading-7 text-white/75"><span aria-hidden="true">✓</span><span>{f}</span></li>)}</ul></section>
   <section className="mt-9 rounded-xl border border-white/15 p-7"><h2 className="text-2xl font-semibold">Co pokazuje realizacja?</h2><p className="mt-4 leading-8 text-white/75">Połączenie strony ofertowej z procesem zamawiania, a nie tylko przygotowanie statycznej wizytówki. W opisie nie przypisuję projektowi niepotwierdzonych wzrostów sprzedaży ani oszczędności.</p></section>
   <div className="mt-12 rounded-xl border border-white/20 bg-white/[.04] p-8"><h2 className="text-2xl font-semibold">Potrzebujesz strony z interaktywną ofertą?</h2><p className="mt-3 leading-7 text-white/70">Prześlij krótki opis firmy i funkcji, które mają działać. Zakres i wycenę ustalimy po rozmowie.</p><Link href="/kontakt?usluga=Strona%20internetowa%20lub%20sklep" className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black">Zapytaj o wycenę</Link></div>
  </article>
 </main>;
}
