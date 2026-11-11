import type {Metadata} from "next";
import Link from "next/link";
import {Gamepad2} from "lucide-react";
import {EverydayPlayground} from "@/components/EverydayPlayground";
export const metadata:Metadata={
 title:"12 darmowych minigier online | bernecki.dev",
 description:"12 darmowych minigier online: Snake, 2048, Memory, Saper i więcej. Graj na telefonie i komputerze bez rejestracji, bez pobierania i bez karty kredytowej.",
 alternates:{canonical:"https://bernecki.dev/minigry",languages:{"pl-PL":"https://bernecki.dev/minigry",en:"https://bernecki.dev/en/games"}}
};
export default function GamesPage(){
 const jsonLd={"@context":"https://schema.org","@type":"WebApplication",name:"12 darmowych minigier online",url:"https://bernecki.dev/minigry",applicationCategory:"GameApplication",operatingSystem:"Web",isAccessibleForFree:true,offers:{"@type":"Offer",price:"0",priceCurrency:"PLN"}};
 return <main className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
  <nav className="text-xs text-white/55"><Link href="/" className="underline underline-offset-4">Start</Link><span className="mx-2">/</span><Link href="/narzedzia" className="underline underline-offset-4">Narzędzia</Link><span className="mx-2">/</span>Minigry</nav>
  <header className="mt-12 max-w-4xl"><p className="page-eyebrow inline-flex items-center gap-2"><Gamepad2 size={16}/>DARMOWE MINIGRY / DODATEK</p><h1 className="mt-5">Darmowe minigry online.</h1><p className="page-intro mt-5 max-w-3xl">12 darmowych gier na chwilę przerwy. Graj w przeglądarce bez pobierania, bez rejestracji i bez karty kredytowej.</p><Link href="/narzedzia" className="mt-6 inline-flex items-center gap-2 text-sm text-white/75 underline underline-offset-4">← Wróć do darmowych narzędzi</Link></header>
  <a href="#kids" className="mt-8 flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/[.06] p-5 transition hover:border-white/65">
   <span><span className="block text-xs uppercase tracking-[.14em] text-white/50">Gra dla dzieci · działa na telefonie</span><strong className="mt-2 block text-lg">Klawiaturowa Galaktyka</strong><span className="mt-1 block text-sm text-white/60">Dotykaj ekranu, poznawaj litery i wybierz pełny ekran.</span></span>
   <span className="shrink-0 rounded-lg border border-white/25 px-4 py-3 text-sm font-semibold">Graj</span>
  </a>
  <EverydayPlayground lang="pl" mode="games"/>
 </main>;
}
