import type { Metadata } from "next";
import Link from "next/link";
import { FreeToolsDirectory } from "@/components/FreeToolsDirectory";
import { toolboxItems } from "@/lib/toolbox";
import { visibleToolboxItems } from "@/lib/toolbox-visibility";
export const metadata: Metadata={
 title:"Darmowe narzędzia oraz 10 gier online | bernecki.dev",
 description:"Dwie przejrzyste kategorie: gry i rozrywka oraz narzędzia. 10 darmowych gier, audyt WWW, SEO, Meta Ads, kalkulatory i konwertery. Bez rejestracji.",
 alternates:{canonical:"https://bernecki.dev/narzedzia",languages:{"pl-PL":"https://bernecki.dev/narzedzia",en:"https://bernecki.dev/en/tools"}},
 openGraph:{title:"Darmowe narzędzia dla firm i programistów | bernecki.dev",description:"Sprawdź stronę internetową, SEO, reklamy i koszty sprzedaży. Darmowe narzędzia online bez rejestracji.",url:"https://bernecki.dev/narzedzia",type:"website"}
};
export default function FreeToolsPage(){
 const jsonLd={"@context":"https://schema.org","@type":"CollectionPage",name:"Darmowe narzędzia online – bernecki.dev",url:"https://bernecki.dev/narzedzia",inLanguage:"pl-PL",
 mainEntity:{"@type":"ItemList",itemListElement:[toolboxItems[0],...visibleToolboxItems].map((t,i)=>({"@type":"ListItem",position:i+1,name:t.title,url:"https://bernecki.dev/narzedzia/"+t.slug}))}};
 return <main className="site-page mx-auto max-w-7xl px-5 pb-24 pt-36 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/>
  <nav className="text-xs text-white/50" aria-label="Ścieżka strony"><Link href="/" className="underline underline-offset-4">Strona główna</Link><span className="mx-2">/</span>Narzędzia</nav>
  <header className="mt-12 max-w-4xl">
   <p className="page-eyebrow">GRY I ROZRYWKA / NARZĘDZIA / ZA DARMO</p>
   <h1 className="mt-6">Darmowe narzędzia i gry online.</h1>
   <p className="page-intro mt-6 max-w-3xl text-base md:text-lg">Wybierz jedną z dwóch kategorii: gry i rozrywka albo narzędzia. Zagraj w 10 minigier na telefonie i komputerze albo skorzystaj z audytu WWW, kalkulatorów, konwerterów i narzędzi do reklamy. Bez logowania, instalowania i zbędnego przeklikiwania.</p>
  </header>
  <FreeToolsDirectory/>
  <section className="mt-16 grid gap-6 rounded-2xl border border-white/15 bg-[#111111] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-9">
   <div><p className="page-eyebrow">Potrzebujesz wdrożenia?</p><h2 className="mt-3 text-2xl font-medium">Wykryłeś problem? Mogę go naprawić.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">Zajmuję się stronami internetowymi, kampaniami Meta Ads, CRM i automatyzacją. Same testery są darmowe — możesz z nich korzystać bez zamawiania usług.</p></div>
   <Link href="/kontakt" className="brand-action inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm">Porozmawiaj o rozwiązaniu</Link>
  </section>
  <section className="mt-14 max-w-3xl space-y-4">
   <h2 className="text-2xl">Co obejmują darmowe testy?</h2>
   <p className="text-sm leading-7 text-white/65">Audyt HTML wykrywa wybrane problemy widoczne w publicznym kodzie strony. Nie zastępuje Search Console, pomiaru Core Web Vitals ani profesjonalnego audytu bezpieczeństwa. Kalkulatory prezentują wyniki zgodne z podanymi założeniami. Raporty reklam CSV i tokeny JWT analizowane są lokalnie w przeglądarce.</p>
   <p className="text-sm leading-7 text-white/65">Jeśli chcesz poznać szczegóły działań, zobacz też <Link href="/poradniki" className="underline underline-offset-4">poradniki techniczne</Link>, <Link href="/marketing-i-reklamy" className="underline underline-offset-4">ofertę marketingową</Link> i <Link href="/crm-i-aplikacje-webowe" className="underline underline-offset-4">rozwiązania CRM dla firm</Link>.</p>
  </section>
 </main>;
}