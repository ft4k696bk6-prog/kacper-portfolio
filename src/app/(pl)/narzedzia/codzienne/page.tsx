import type { Metadata } from "next";
import Link from "next/link";
import { EverydayPlayground } from "@/components/EverydayPlayground";
export const metadata:Metadata={
 title:"Darmowe narzędzia codzienne, zdjęcia i gry | bernecki.dev",
 description:"6 darmowych narzędzi codziennych i 10 gier online: 2048, Snake, Memory, Saper, kółko i krzyżyk i inne. Na telefon i komputer, bez logowania.",
 alternates:{canonical:"https://bernecki.dev/narzedzia/codzienne",languages:{"pl-PL":"https://bernecki.dev/narzedzia/codzienne",en:"https://bernecki.dev/en/tools/everyday"}},
 openGraph:{title:"Darmowe narzędzia codzienne i gry",description:"6 praktycznych narzędzi i 10 gier w przeglądarce — bez rejestracji.",url:"https://bernecki.dev/narzedzia/codzienne",type:"website"}
};
export default function EverydayPage(){
 return <main className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <nav className="text-xs text-white/60" aria-label="Ścieżka strony"><Link href="/" className="underline underline-offset-4">Start</Link><span className="mx-2">/</span><Link href="/narzedzia" className="underline underline-offset-4">Narzędzia</Link><span className="mx-2">/</span>Codzienne i zabawa</nav>
  <header className="mt-12 max-w-4xl"><p className="page-eyebrow">DARMOWE / BEZ KONTA / PL + EN</p>
   <h1 className="mt-6">Narzędzia codzienne i 10 gier online.</h1>
   <p className="page-intro mt-6 max-w-3xl text-base md:text-lg">Dwie oddzielne sekcje: 6 praktycznych narzędzi oraz 10 minigier, w tym Snake, 2048, Memory, Saper i kółko i krzyżyk. Wybierz pozycję z katalogu, zagraj na telefonie lub komputerze. Bez instalacji i bez logowania.</p>
  </header>
  <EverydayPlayground lang="pl"/>
 </main>;
}
