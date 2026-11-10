import type { Metadata } from "next";
import Link from "next/link";
import { EverydayPlayground } from "@/components/EverydayPlayground";
export const metadata:Metadata={
 title:"Darmowe narzędzia codzienne, zdjęcia i gry | bernecki.dev",
 description:"Darmowy konwerter zdjęć, generator haseł i stopek e-mail, kalkulator procentów, narzędzia tekstowe oraz gry dla dzieci. Bez logowania.",
 alternates:{canonical:"https://bernecki.dev/narzedzia/codzienne",languages:{"pl-PL":"https://bernecki.dev/narzedzia/codzienne",en:"https://bernecki.dev/en/tools/everyday"}},
 openGraph:{title:"Darmowe narzędzia codzienne i gry",description:"Osiem prostych narzędzi oraz zabaw w przeglądarce — bez rejestracji.",url:"https://bernecki.dev/narzedzia/codzienne",type:"website"}
};
export default function EverydayPage(){
 return <main className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <nav className="text-xs text-white/60" aria-label="Ścieżka strony"><Link href="/" className="underline underline-offset-4">Start</Link><span className="mx-2">/</span><Link href="/narzedzia" className="underline underline-offset-4">Narzędzia</Link><span className="mx-2">/</span>Codzienne i zabawa</nav>
  <header className="mt-12 max-w-4xl"><p className="page-eyebrow">DARMOWE / BEZ KONTA / PL + EN</p>
   <h1 className="mt-6">Narzędzia do codziennych spraw. I trochę zabawy.</h1>
   <p className="page-intro mt-6 max-w-3xl text-base md:text-lg">Konwertuj zdjęcia, uporządkuj tekst, policz procenty, wygeneruj hasło lub stopkę e-mail. A jeśli masz ochotę, sprawdź refleks albo uruchom grę klawiaturową dla dzieci. Bez rejestracji i bez przesyłania plików na serwer.</p>
  </header>
  <EverydayPlayground lang="pl"/>
 </main>;
}
