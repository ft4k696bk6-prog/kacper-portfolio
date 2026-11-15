import type { Metadata } from "next";
import Link from "next/link";
import { LeadContactForm } from "@/components/LeadContactForm";

export const metadata: Metadata = {
 title:"Jak zdobywać klientów dla firmy? Google Ads, Facebook i CRM",
 description:"Pomoc w pozyskiwaniu klientów: reklamy Google, Facebook, Instagram, TikTok, strony pod kampanie i CRM. Cennik, przykłady realizacji i bezpłatna wstępna rozmowa.",
 alternates:{canonical:"https://bernecki.dev/pozyskiwanie-klientow"}
};
const options=[
 {title:"Reklamy Google – gdy klient sam szuka usługi",description:"Kampanie na konkretne zapytania i miejscowości. Sprawdzamy, które słowa dają wartościowe telefony i formularze.",link:"/google-ads-dla-firm",label:"Google Ads dla firm"},
 {title:"Facebook i Instagram – pokaż ofertę właściwym osobom",description:"Przygotowuję reklamy, grupy odbiorców i formularze. Liczy się jakość osób, które naprawdę chcą kupić.",link:"/reklamy-meta-ads-dla-firm",label:"Reklamy na Facebooku"},
 {title:"Strona do reklamy – żeby klient miał gdzie zapytać",description:"Jedna oferta, realizacje, prosta wycena i kontakt. Bez kierowania reklamy na nieczytelną stronę główną.",link:"/tworzenie-stron-internetowych",label:"Strona internetowa"},
 {title:"CRM i automatyzacja – żeby nie zgubić zapytań",description:"Leady z reklam trafiają do odpowiedniej osoby. Zadania i przypomnienia pilnują telefonów i kolejnych rozmów.",link:"/crm-dla-firm-handlowych",label:"CRM dla firmy"}
];
const situations=[
 ["Mam dużo wejść, ale nikt nie pyta o wycenę","Sprawdzę ofertę, stronę, formularz i czy reklama obiecuje to samo, co strona."],
 ["Reklamy dają tanie kontakty, ale nikt nie kupuje","Sprawdzimy treść reklamy, jakość osób, które wysłały formularz, i dalszą obsługę przez firmę."],
 ["Klienci szukają usług w Google, a mojej firmy nie widać","Sprawdzimy stronę usługową, widoczność w Google i możliwość sensownego testu reklam Search."],
 ["Handlowcy nie nadążają z telefonami","Połączymy zapytania z przypomnieniami, prostą listą zadań lub CRM."]
];
const questions=[
 ["Co lepsze dla małej firmy: Google czy Facebook?","Google częściej łapie osoby, które aktywnie wpisują nazwę usługi. Facebook i Instagram pozwalają pokazać usługę również ludziom, którzy jeszcze jej nie szukają. Dobór zależy od branży, ceny usługi i budżetu."],
 ["Czy muszę mieć własną stronę internetową?","Nie w każdej kampanii. Można korzystać z formularza na platformie reklamowej, ale dobrze przygotowana strona pomaga wyjaśnić ofertę, pokazać realizacje i zbierać zapytania z Google."],
 ["Ile kosztuje prowadzenie reklam?","Orientacyjny koszt uruchomienia jednej platformy zaczyna się u mnie od 990 zł netto, a stała obsługa od 1 190 zł netto miesięcznie. Budżet reklamowy płacisz osobno."],
 ["Czy gwarantujesz klientów?","Nie. Wynik zależy od oferty, konkurencji, budżetu i sposobu obsługi zapytań. Ustalamy mierzalny test i sprawdzamy prawdziwe zapytania, a nie same wyświetlenia."],
 ["Czy możesz połączyć reklamy z CRM?","Tak, o ile istniejące konta i systemy udostępniają odpowiednie integracje i uprawnienia. Wspólnie ustalamy zakres i sposób bezpiecznego przekazywania danych."]
];
export default function CustomerAcquisitionPage(){
 const url="https://bernecki.dev/pozyskiwanie-klientow";
 const schema={"@context":"https://schema.org","@type":"Service",name:"Pomoc w zdobywaniu klientów przez internet",provider:{"@id":"https://bernecki.dev/#person"},url,areaServed:{"@type":"Country",name:"Polska"}};
 return <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
  <div className="mx-auto max-w-6xl">
   <nav className="text-sm text-white/60"><Link href="/">Start</Link> / <Link href="/marketing-i-reklamy">Marketing</Link> / Pozyskiwanie klientów</nav>
   <p className="mt-12 text-xs uppercase tracking-widest text-white/60">Reklamy • Strony internetowe • CRM</p>
   <h1 className="mt-4 max-w-5xl text-4xl leading-tight md:text-6xl">Chcesz więcej klientów? Uporządkujmy reklamę, stronę i kontakt.</h1>
   <p className="mt-7 max-w-4xl text-lg leading-8 text-white/75">Pomagam firmom pozyskiwać wartościowe zapytania przez Google, Facebook i Instagram, a następnie nie gubić ich w obsłudze. Nie sprzedaję samej liczby kliknięć: sprawdzamy, czy zgłoszenie jest od właściwej osoby i czy firma potrafi je obsłużyć.</p>
   <div className="mt-8 flex flex-wrap gap-3"><Link href="#wycena" className="brand-action rounded-xl px-6 py-4 font-semibold text-black">Opisz swoją firmę</Link><Link href="/#cennik" className="rounded-xl border border-white/25 px-6 py-4">Zobacz pakiety i ceny</Link><Link href="/case-studies/re-energy-meta-ads" className="rounded-xl border border-white/25 px-6 py-4">Przykład kampanii</Link></div>
   <section className="mt-20" aria-labelledby="acquisition-ways"><h2 id="acquisition-ways" className="text-3xl font-semibold">Cztery elementy, które powinny działać razem</h2><div className="mt-7 grid gap-5 sm:grid-cols-2">{options.map(o=><article key={o.title} className="rounded-2xl border border-white/20 p-7"><h3 className="text-2xl">{o.title}</h3><p className="mt-4 leading-8 text-white/70">{o.description}</p><Link href={o.link} className="mt-6 inline-block underline underline-offset-4">{o.label}</Link></article>)}</div></section>
   <section className="mt-20 rounded-2xl border border-white/20 bg-white/[0.035] p-7 md:p-10"><h2 className="text-3xl">Co dziś nie działa w Twojej firmie?</h2><div className="mt-7 grid gap-5 md:grid-cols-2">{situations.map(([h,d])=><div key={h} className="rounded-xl border border-white/15 p-5"><h3 className="text-xl">{h}</h3><p className="mt-3 leading-7 text-white/70">{d}</p></div>)}</div></section>
   <section className="mt-20"><h2 className="text-3xl">Ile kosztuje rozpoczęcie współpracy?</h2><p className="mt-5 max-w-4xl leading-8 text-white/75">Możesz zacząć od audytu reklam od 590 zł netto, konfiguracji jednej kampanii od 990 zł netto lub pakietu strony z reklamami od 4 900 zł netto. To orientacyjne ceny dla podstawowego zakresu. Pieniądze na emisję reklam płacisz osobno.</p><div className="mt-6 flex flex-wrap gap-6"><Link href="/pakiety" className="underline underline-offset-4">Porównaj pakiety</Link><Link href="/cennik" className="underline underline-offset-4">Cennik pojedynczych usług</Link><Link href="/kontakt" className="underline underline-offset-4">Wyceń mój przypadek</Link></div></section>
   <section className="mt-20" aria-labelledby="acquisition-guides"><h2 id="acquisition-guides" className="text-3xl">Sprawdź, co ma sens dla Twojej firmy</h2><div className="mt-7 grid gap-3 md:grid-cols-2">
    {[
      ["Jak zdobywać klientów dla firmy usługowej?","/poradniki/jak-zdobyc-klientow-dla-firmy-uslugowej"],
      ["Google Ads czy pozycjonowanie strony?","/poradniki/google-ads-czy-pozycjonowanie-strony-seo"],
      ["Ile kosztuje pozyskanie klienta z reklamy?","/poradniki/ile-kosztuje-pozyskanie-klienta-z-reklamy"],
      ["Jaka grupa odbiorców reklamy na Facebooku?","/poradniki/targetowanie-posrednie-meta-ads-pomysly"],
      ["Reklama firmy budowlanej: Google czy Facebook?","/poradniki/reklama-firmy-budowlanej-facebook-czy-google"],
      ["Reklamy OZE: pozyskiwanie zapytań","/poradniki/reklamy-oze-facebook-google-jak-zdobyc-leady"],
      ["Reklama kancelarii prawnej – od czego zacząć?","/poradniki/reklama-kancelarii-prawnej-google-facebook"],
      ["Jak reklamować firmę importującą auta z USA?","/poradniki/reklama-importu-aut-z-usa-jak-znalezc-klientow"]
    ].map(([label,href])=><Link key={href} href={href} className="rounded-xl border border-white/20 p-5 hover:border-white/60">{label}</Link>)}
   </div></section>
   <section className="mt-20"><h2 className="text-3xl">Najczęstsze pytania</h2><div className="mt-7 divide-y divide-white/15">{questions.map(([q,a])=><div key={q} className="py-6"><h3 className="text-xl">{q}</h3><p className="mt-3 max-w-4xl leading-8 text-white/70">{a}</p></div>)}</div></section>
   <section id="wycena" className="mt-20 scroll-mt-28">
    <h2 className="text-3xl font-semibold">Napisz, czego potrzebujesz. Formularz jest tutaj.</h2>
    <p className="mt-4 mb-6 max-w-3xl leading-7 text-white/70">Nie musisz wiedzieć, która reklama będzie najlepsza. Napisz, czym się zajmujesz, gdzie działasz i jaki masz budżet. Sprawdzimy sensowny pierwszy krok.</p>
    <div className="max-w-3xl"><LeadContactForm initialService="Pozyskiwanie klientów"/></div>
   </section>
   <section className="mt-20 rounded-2xl border border-white/25 p-8"><h2 className="text-3xl">Chcesz sprawdzić, skąd mogą przyjść Twoi klienci?</h2><p className="mt-4 max-w-3xl leading-8 text-white/70">Napisz, co sprzedajesz, gdzie działasz, ile możesz przeznaczyć na reklamy i jak dziś obsługujesz telefony lub formularze. Wskażę, od czego rozsądnie zacząć i czego nie warto kupować.</p><Link href="/kontakt" className="brand-action mt-6 inline-block rounded-xl px-6 py-3 font-semibold text-black">Zapytaj o pozyskiwanie klientów</Link></section>
  </div>
 </main>;
}