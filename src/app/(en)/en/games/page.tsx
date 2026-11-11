import type {Metadata} from "next";
import Link from "next/link";
import {Gamepad2} from "lucide-react";
import {EverydayPlayground} from "@/components/EverydayPlayground";
export const metadata:Metadata={
 title:"12 Free Browser Mini-Games | bernecki.dev",
 description:"Play 12 browser mini-games including a Pac-Man-style maze, Doom-style Retro FPS, Snake, 2048 and more on mobile or desktop.",
 alternates:{canonical:"https://bernecki.dev/en/games",languages:{en:"https://bernecki.dev/en/games","pl-PL":"https://bernecki.dev/minigry"}}
};
export default function GamesEnglishPage(){
 return <main lang="en" className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <nav className="text-xs text-white/55"><Link href="/" className="underline underline-offset-4">Home</Link><span className="mx-2">/</span><Link href="/en/tools" className="underline underline-offset-4">Tools</Link><span className="mx-2">/</span>Mini-games</nav>
  <header className="mt-12 max-w-4xl"><p className="page-eyebrow inline-flex items-center gap-2"><Gamepad2 size={16}/>MINI-GAMES / EXTRA</p><h1 className="mt-5">Browser mini-games.</h1><p className="page-intro mt-5 max-w-3xl">12 games for a short break. Pick a game by its preview and play without downloads or registration.</p><Link href="/en/tools" className="mt-6 inline-flex items-center gap-2 text-sm text-white/75 underline underline-offset-4">← Back to free tools</Link></header>
  <EverydayPlayground lang="en" mode="games"/>
 </main>;
}
