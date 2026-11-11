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
 return <main className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <nav className="text-xs text-white/55"><Link href="/" className="underline underline-offset-4">Start</Link><span className="mx-2">/</span><Link href="/narzedzia" className="underline underline-offset-4">Narzędzia</Link><span className="mx-2">/</span>Minigry</nav>
  <header className="mt-12 max-w-4xl"><p className="page-eyebrow inline-flex items-center gap-2"><Gamepad2 size={16}/>MINIGRY / DODATEK</p><h1 className="mt-5">Darmowe minigry online.</h1><p className="page-intro mt-5 max-w-3xl">12 darmowych gier na chwilę przerwy. Graj w przeglądarce bez pobierania, bez rejestracji i bez karty kredytowej.</p><Link href="/narzedzia" className="mt-6 inline-flex items-center gap-2 text-sm text-white/75 underline underline-offset-4">← Wróć do darmowych narzędzi</Link></header>
  <EverydayPlayground lang="pl" mode="games"/>
 </main>;
}
