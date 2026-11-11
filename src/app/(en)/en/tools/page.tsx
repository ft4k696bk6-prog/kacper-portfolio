import type { Metadata } from "next";
import Link from "next/link";
import { EnglishToolsDirectory } from "@/components/EnglishToolsDirectory";
import { englishToolboxItems } from "@/lib/toolbox-en";
import { visibleEnglishToolboxItems } from "@/lib/toolbox-visibility";

const root="https://bernecki.dev/en/tools";
export const metadata:Metadata={
 title:"Free Online Tools and 10 Browser Games | bernecki.dev",
 description:"Two clear categories: games and entertainment, and tools. Play 10 free games or use website audits, marketing calculators and image utilities. No account needed.",
 alternates:{canonical:root,languages:{en:root,"pl-PL":"https://bernecki.dev/narzedzia"}},
 openGraph:{title:"Free website, marketing and developer tools",description:"Free online tools. Check your website, ads and business metrics with no sign-up.",url:root,locale:"en_US",type:"website"}
};
export default function EnglishToolsPage(){
 const data={"@context":"https://schema.org","@type":"CollectionPage",name:"Free online tools — bernecki.dev",url:root,inLanguage:"en",
 mainEntity:{"@type":"ItemList",itemListElement:[englishToolboxItems[0],...visibleEnglishToolboxItems].map((t,i)=>({"@type":"ListItem",position:i+1,name:t.title,url:root+"/"+t.englishSlug}))}};
 return <main lang="en" className="site-page mx-auto max-w-7xl px-5 pb-24 pt-36 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,"\\u003c")}}/>
  <nav className="text-xs text-white/50" aria-label="Breadcrumbs"><Link href="/" className="underline underline-offset-4">Home</Link><span className="mx-2">/</span>Free tools</nav>
  <header className="mt-12 max-w-4xl"><p className="page-eyebrow">GAMES & ENTERTAINMENT / TOOLS / FREE</p>
   <h1 className="mt-6">Free online tools and games.</h1>
   <p className="page-intro mt-6 max-w-3xl text-base md:text-lg">Choose one of two categories: Games & entertainment or Tools. Play ten mini-games on your phone or computer, or use the website audit, calculators, converters and advertising helpers. No account, downloads or unnecessary navigation.</p>
  </header>
  <EnglishToolsDirectory/>
  <section className="mt-16 grid gap-6 rounded-2xl border border-white/15 bg-[#111111] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-9">
   <div><p className="page-eyebrow">Need help implementing the fixes?</p><h2 className="mt-3 text-2xl font-medium">Found an issue? I can help solve it.</h2>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">I build websites, CRM systems, marketing campaigns and automation. The tools are free whether or not you decide to work with me.</p></div>
   <Link href="/kontakt" className="brand-action inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm">Discuss your project</Link>
  </section>
  <section className="mt-14 max-w-3xl space-y-4"><h2 className="text-2xl">What do the checks cover?</h2>
   <p className="text-sm leading-7 text-white/65">Public website tests inspect selected parts of server-returned HTML, not the complete website or Google Search Console. They do not replace Core Web Vitals, full accessibility testing or security audits. Calculators use your assumptions. CSV imports and JWT decoding are performed locally in your browser.</p>
   <p className="text-sm leading-7 text-white/65">You can also explore my <Link href="/en/guides" className="underline underline-offset-4">technical guides</Link>, <Link href="/en/services/marketing" className="underline underline-offset-4">marketing services</Link> and <Link href="/en/services/crm" className="underline underline-offset-4">CRM solutions</Link>.</p>
  </section>
 </main>;
}