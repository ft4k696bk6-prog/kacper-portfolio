import type {Metadata} from "next";
import Link from "next/link";
import {Gamepad2} from "lucide-react";
import {EverydayPlayground} from "@/components/EverydayPlayground";
export const metadata:Metadata={
 title:"12 Free Browser Mini-Games | bernecki.dev",
 description:"Play 12 free browser mini-games including a maze game, Retro FPS, Snake and 2048. No sign-up, no download, no credit card required.",
 alternates:{canonical:"https://bernecki.dev/en/games",languages:{en:"https://bernecki.dev/en/games","pl-PL":"https://bernecki.dev/minigry"}}
};
export default function GamesEnglishPage(){
 const jsonLd={"@context":"https://schema.org","@type":"WebApplication",name:"12 free browser mini-games",url:"https://bernecki.dev/en/games",applicationCategory:"GameApplication",operatingSystem:"Web",isAccessibleForFree:true,offers:{"@type":"Offer",price:"0",priceCurrency:"PLN"}};
 return <main lang="en" className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
  <nav className="text-xs text-white/55"><Link href="/" className="underline underline-offset-4">Home</Link><span className="mx-2">/</span><Link href="/en/tools" className="underline underline-offset-4">Tools</Link><span className="mx-2">/</span>Mini-games</nav>
  <header className="mt-12 max-w-4xl"><p className="page-eyebrow inline-flex items-center gap-2"><Gamepad2 size={16}/>FREE MINI-GAMES / EXTRA</p><h1 className="mt-5">Free browser mini-games.</h1><p className="page-intro mt-5 max-w-3xl">Play 12 free mini-games in your browser on desktop or mobile. No download, no registration, no login and no credit card required.</p><Link href="/en/tools" className="mt-6 inline-flex items-center gap-2 text-sm text-white/75 underline underline-offset-4">← Back to free tools</Link></header>
  <a href="#kids" className="mt-8 flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/[.06] p-5 transition hover:border-white/65">
   <span><span className="block text-xs uppercase tracking-[.14em] text-white/50">Kids’ game · available on mobile</span><strong className="mt-2 block text-lg">Keyboard Galaxy</strong><span className="mt-1 block text-sm text-white/60">Tap the screen, discover letters and try full-screen mode.</span></span>
   <span className="shrink-0 rounded-lg border border-white/25 px-4 py-3 text-sm font-semibold">Play</span>
  </a>
  <EverydayPlayground lang="en" mode="games"/>
 </main>;
}
