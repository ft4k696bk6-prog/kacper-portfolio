import type { Metadata } from "next";
import Link from "next/link";
import { EverydayPlayground } from "@/components/EverydayPlayground";
export const metadata:Metadata={
 title:"Free Everyday Tools, Image Converter & Kids Games | bernecki.dev",
 description:"Six everyday utilities and ten browser games, including Snake, 2048, Memory, Minesweeper and tic-tac-toe. Free on mobile and desktop.",
 alternates:{canonical:"https://bernecki.dev/en/tools/everyday",languages:{en:"https://bernecki.dev/en/tools/everyday","pl-PL":"https://bernecki.dev/narzedzia/codzienne"}},
 openGraph:{title:"Free everyday utilities and games",description:"Six utilities and ten playable browser games. No account needed.",url:"https://bernecki.dev/en/tools/everyday",locale:"en_US",type:"website"}
};
export default function EverydayEnglishPage(){
 return <main lang="en" className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <nav className="text-xs text-white/60" aria-label="Breadcrumbs"><Link href="/" className="underline underline-offset-4">Home</Link><span className="mx-2">/</span><Link href="/en/tools" className="underline underline-offset-4">Tools</Link><span className="mx-2">/</span>Everyday and play</nav>
  <header className="mt-12 max-w-4xl"><p className="page-eyebrow">FREE / NO ACCOUNT / PL + EN</p>
   <h1 className="mt-6">Everyday tools and 10 browser games.</h1>
   <p className="page-intro mt-6 max-w-3xl text-base md:text-lg">Two separate sections: six useful tools and ten mini-games, including Snake, 2048, Memory, Minesweeper and tic-tac-toe. Play on mobile or desktop without downloading anything or creating an account.</p>
  </header>
  <EverydayPlayground lang="en"/>
 </main>;
}
