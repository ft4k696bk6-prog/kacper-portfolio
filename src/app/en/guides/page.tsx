import type { Metadata } from "next";
import Link from "next/link";
import { listEnglishGuides, englishCategoryCounts,englishGuideCategory,englishCategory } from "@/lib/guide-i18n";

type Props={searchParams:Promise<{q?:string;page?:string}>};
const root="https://bernecki.dev/en/guides";
const parsePage=(v?:string)=>{const n=Number(v??1);return Number.isSafeInteger(n)&&n>0?n:1};
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{
 const params=await searchParams;const {page}=listEnglishGuides({query:params.q,page:parsePage(params.page)});
 const url=root+(page>1&& !params.q?`?page=${page}`:"");
 return {title:"Troubleshooting guides: Next.js, Supabase, SEO and CRM | Kacper Bernecki",
 description:"English technical guides with exact symptoms, diagnostic steps, solutions, verification and source documentation.",
 alternates:{canonical:url,languages:{en:url,"pl-PL":"https://bernecki.dev/poradniki"}},robots:params.q?{index:false,follow:true}:{index:true,follow:true}};
}
export default async function EnglishGuideCatalog({searchParams}:Props){
 const params=await searchParams;const query=(params.q??"").trim().slice(0,100);
 const {items,total,page,pages}=listEnglishGuides({query,page:parsePage(params.page)});
 const categories=englishCategoryCounts().filter(c=>c.count>0);
 const start=Math.max(1,Math.min(pages-4,page-2));
 const pageNumbers=[...new Set([1,...Array.from({length:Math.min(5,pages)},(_,i)=>start+i),pages])].filter(x=>x>0&&x<=pages).sort((a,b)=>a-b);
 const pageUrl=(n:number)=>{const q=new URLSearchParams();if(query)q.set("q",query);if(n>1)q.set("page",String(n));return "/en/guides"+(q.size?"?"+q:"")};
 return <main lang="en" className="site-page editorial-page mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
  <nav className="text-sm text-white/65" aria-label="Breadcrumb"><Link href="/" className="underline underline-offset-4">Kacper Bernecki</Link> / Guides</nav>
  <header className="mt-10">
   <p className="page-eyebrow">Technical knowledge base · practical solutions</p>
   <h1 className="mt-5 max-w-5xl text-4xl leading-tight md:text-6xl">Not working? Find the cause and fix it.</h1>
   <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">Explore practical troubleshooting guides for Next.js, React, TypeScript, Supabase, PostgreSQL, WordPress, Meta Ads, CRM systems and APIs. Each guide covers a specific issue, diagnostic steps, a practical fix and a way to verify the result.</p>
   <form role="search" action="/en/guides" method="get" className="mt-8 flex max-w-3xl flex-wrap gap-3">
    <label htmlFor="english-guide-search" className="sr-only">Search technical guides</label>
    <input id="english-guide-search" name="q" type="search" defaultValue={query} maxLength={100} placeholder="e.g. React hooks, RLS, sitemap..." className="min-w-0 flex-1 rounded-xl border border-white/25 bg-[var(--brand-black)] px-5 py-4 text-white placeholder:text-white/55"/>
    <button type="submit" className="brand-action rounded-xl px-6 py-4 text-black">Search</button>
   </form>
  </header>
  <section className="mt-14" aria-labelledby="english-categories">
   <div className="flex flex-wrap items-end justify-between gap-3">
    <h2 id="english-categories" className="text-2xl md:text-3xl">Browse by topic</h2>
    <span className="text-sm text-white/60">{total} English guides{query?" matching your search":""}</span>
   </div>
   <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {categories.map(category=><Link key={category.slug} href={`/en/guides/topics/${category.slug}`} className="surface-card rounded-xl border border-white/15 p-5 transition-colors hover:border-white/50">
     <div className="flex items-start justify-between gap-3"><h3 className="text-lg text-white">{category.label}</h3><span className="text-sm text-white/60">{category.count}</span></div>
     <p className="mt-2 text-sm leading-6 text-white/65">{category.description}</p>
    </Link>)}
   </div>
  </section>
  <section className="mt-14" aria-labelledby="english-all-guides">
   <h2 id="english-all-guides" className="text-2xl md:text-3xl">{query?`Results for “${query}”`:"All English troubleshooting guides"}</h2>
   {items.length===0?<p className="mt-6 text-white/70">No guides match your search. Try another technical term or choose a topic above.</p>:
   <div className="mt-7 grid gap-4 md:grid-cols-2">
    {items.map(g=><Link key={g.slug} href={`/en/guides/${g.slug}`} className="surface-card block rounded-2xl border border-white/15 bg-[var(--brand-black)] p-6 transition-colors hover:border-white/50">
     <span className="text-xs text-white/60">{englishCategory(englishGuideCategory(g))?.label}</span>
     <h3 className="mt-3 text-xl leading-snug text-white">{g.title}</h3>
     <p className="mt-3 leading-7 text-white/65">{g.description}</p>
     <span className="mt-5 inline-block text-sm font-medium text-white underline underline-offset-4">Read the solution</span>
    </Link>)}
   </div>}
   {pages>1&&<nav className="mt-9 flex flex-wrap items-center justify-between gap-4 text-sm" aria-label="Result pages">
    {page>1?<Link href={pageUrl(page-1)} className="underline underline-offset-4">Previous</Link>:<span/>}
    <div className="flex flex-wrap items-center justify-center gap-2">
     {pageNumbers.map(n=><Link key={n} href={pageUrl(n)} aria-current={n===page?"page":undefined} className={`rounded-lg border px-3 py-2 ${n===page?"border-white/70 bg-white/15":"border-white/20 hover:border-white/60"}`}>{n}</Link>)}
    </div>
    {page<pages?<Link href={pageUrl(page+1)} className="underline underline-offset-4">Next</Link>:<span/>}
   </nav>}
  </section>
  <p className="mt-14 border-t border-white/20 pt-6 text-sm"><Link href="/poradniki" className="underline underline-offset-4">Switch to Polish guides</Link></p>
 </main>;
}
