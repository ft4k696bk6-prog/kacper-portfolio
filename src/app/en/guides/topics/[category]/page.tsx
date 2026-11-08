import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guideCategories } from "@/lib/guide-directory";
import { englishCategory, englishCategoryCounts, listEnglishGuides } from "@/lib/guide-i18n";
type Props={params:Promise<{category:string}>;searchParams:Promise<{page?:string}>};
export const dynamicParams=true;
export const revalidate=86400;
export function generateStaticParams(){return englishCategoryCounts().filter(c=>c.count>0).map(c=>({category:c.slug}))}
const parsePage=(raw?:string)=>{const n=Number(raw??1);return Number.isSafeInteger(n)&&n>0?n:1};
export async function generateMetadata({params,searchParams}:Props):Promise<Metadata>{
 const [{category},query]=await Promise.all([params,searchParams]);
 const entry=englishCategory(category);
 if(!entry||!guideCategories.some(x=>x.slug===category))notFound();
 const {total,page}=listEnglishGuides({category,page:parsePage(query.page)});
 if(!total)notFound();
 const url=`https://bernecki.dev/en/guides/topics/${category}${page>1?`?page=${page}`:""}`;
 return {title:{absolute:`${entry.label} — troubleshooting and solutions | Kacper Bernecki`},description:entry.description,
  alternates:{canonical:url,...(page===1?{languages:{en:url,"pl-PL":`https://bernecki.dev/poradniki/tematy/${category}`}}:{})},
  openGraph:{url,title:entry.label,description:entry.description,type:"website",locale:"en_US"},
  robots:{index:true,follow:true}};
}
export default async function EnglishCategoryPage({params,searchParams}:Props){
 const [{category},query]=await Promise.all([params,searchParams]);
 const entry=englishCategory(category);
 if(!entry)notFound();
 const {items,total,page,pages}=listEnglishGuides({category,page:parsePage(query.page)});
 if(!total)notFound();
 const start=Math.max(1,Math.min(pages-4,page-2));
 const numbers=[...new Set([1,...Array.from({length:Math.min(5,pages)},(_,i)=>start+i),pages])].filter(x=>x>0&&x<=pages).sort((a,b)=>a-b);
 const url=(n:number)=>`/en/guides/topics/${category}${n>1?`?page=${n}`:""}`;
 return <main lang="en" className="site-page editorial-page mx-auto max-w-5xl px-5 pb-24 pt-36 md:px-8">
  <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-white/65"><Link href="/" className="underline underline-offset-4">Kacper Bernecki</Link><span>/</span>
   <Link href="/en/guides" className="underline underline-offset-4">Guides</Link><span>/</span><span>{entry.label}</span></nav>
  <header className="mt-10">
   <p className="page-eyebrow">Troubleshooting guides by topic</p>
   <h1 className="mt-5 text-4xl leading-tight md:text-5xl">{entry.label}</h1>
   <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">{entry.description}</p>
   <p className="mt-4 text-sm text-white/65">{total} English guides in this category</p>
  </header>
  <section aria-label="English articles" className="mt-10 grid gap-4 sm:grid-cols-2">
   {items.map(g=><Link key={g.slug} href={`/en/guides/${g.slug}`} className="surface-card rounded-2xl border border-white/15 p-6 transition-colors hover:border-white/50">
    <h2 className="text-xl text-white">{g.title}</h2><p className="mt-3 leading-7 text-white/70">{g.description}</p>
    <span className="mt-5 inline-block text-sm underline underline-offset-4">Read the solution</span>
   </Link>)}
  </section>
  {pages>1&&<nav aria-label="Category pages" className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm">
   {page>1?<Link href={url(page-1)} className="underline underline-offset-4">Previous</Link>:<span/>}
   <div className="flex flex-wrap items-center gap-2">{numbers.map(n=><Link key={n} href={url(n)} aria-current={page===n?"page":undefined} className={`rounded-lg border px-3 py-2 ${page===n?"border-white/70 bg-white/15":"border-white/20"}`}>{n}</Link>)}</div>
   {page<pages?<Link href={url(page+1)} className="underline underline-offset-4">Next</Link>:<span/>}
  </nav>}
  <div className="mt-12"><Link href="/en/guides" className="underline underline-offset-4">All English guides</Link></div>
 </main>;
}
