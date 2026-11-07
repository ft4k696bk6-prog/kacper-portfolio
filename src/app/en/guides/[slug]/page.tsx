import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { guideScreenshots } from "@/content/guideScreenshots";
import { getRelatedGuides } from "@/lib/guide-directory";
import { getEnglishGuide, getEnglishGuides, englishGuideCategory, englishCategory, englishCategoryCounts } from "@/lib/guide-i18n";

type Props={params:Promise<{slug:string}>};
export const dynamicParams=true;
export const revalidate=86400;
export function generateStaticParams(){return getEnglishGuides().slice(0,100).map(g=>({slug:g.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const guide=getEnglishGuide(slug);
 if(!guide)notFound();
 const url=`https://bernecki.dev/en/guides/${slug}`;
 return {
  title:`${guide.title} | Kacper Bernecki`,description:guide.description,
  alternates:{canonical:url,languages:{"pl-PL":`https://bernecki.dev/poradniki/${slug}`,"en":url}},
  openGraph:{title:guide.title,description:guide.description,url,type:"article",locale:"en_US",alternateLocale:["pl_PL"],siteName:"Kacper Bernecki",images:[{url:"/opengraph-image",width:1200,height:630}]},
  robots:{index:true,follow:true}
 };
}
export default async function EnglishGuidePage({params}:Props){
 const {slug}=await params;
 const guide=getEnglishGuide(slug);
 if(!guide)notFound();
 const categorySlug=englishGuideCategory(guide);
 const category=englishCategory(categorySlug);
 const screenshot=guideScreenshots[slug]??[];
 const related=getRelatedGuides(slug,10).map(g=>getEnglishGuide(g.slug)).filter((g):g is NonNullable<typeof g>=>Boolean(g));
 const others=englishCategoryCounts().filter(c=>c.slug!==categorySlug&&c.count>0).sort((a,b)=>b.count-a.count).slice(0,5);
 const url=`https://bernecki.dev/en/guides/${slug}`;
 const jsonLd={"@context":"https://schema.org","@graph":[
  {"@type":"Article","@id":url+"#article",headline:guide.title,description:guide.description,inLanguage:"en",mainEntityOfPage:url,isAccessibleForFree:true,author:{"@type":"Organization",name:"bernecki.dev",url:"https://bernecki.dev"},image:screenshot.length?`https://bernecki.dev${screenshot[0].src}`:"https://bernecki.dev/opengraph-image"},
  {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Home",item:"https://bernecki.dev"},{"@type":"ListItem",position:2,name:"Guides",item:"https://bernecki.dev/en/guides"},{"@type":"ListItem",position:3,name:guide.title,item:url}]}
 ]};
 return <main lang="en" className="site-page editorial-page mx-auto max-w-4xl px-5 pb-24 pt-36 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/>
  <nav aria-label="Breadcrumb" className="page-breadcrumb flex flex-wrap gap-2 text-sm">
   <Link href="/">Kacper Bernecki</Link><span>/</span><Link href="/en/guides">Guides</Link><span>/</span>
   <Link href={`/en/guides/topics/${categorySlug}`}>{category?.label}</Link>
  </nav>
  <p className="mt-5 text-sm text-white/65">Category: <Link className="underline underline-offset-4" href={`/en/guides/topics/${categorySlug}`}>{category?.label}</Link></p>
  <article>
   <h1 className="mt-8 break-words text-4xl leading-tight md:text-5xl">{guide.title}</h1>
   <p className="mt-5 text-sm leading-6 text-white/65"><Link className="underline underline-offset-4" href={`/poradniki/${slug}`}>Read this guide in Polish</Link></p>
   <p className="surface-card mt-8 rounded-2xl border border-white/25 bg-[var(--brand-black)] p-6 text-lg leading-8 text-white">{guide.intro}</p>
   {screenshot.length>0&&<section className="mt-10" aria-label="Example error screen">
    <h2 className="text-2xl">Example error screen</h2>
    <p className="mt-3 text-white/70">A sample of the issue in the application interface. Use the diagnostic steps below to identify the cause.</p>
    <div className="mt-5 flex flex-wrap gap-5">{screenshot.map(shot=><figure key={shot.src} className="surface-card w-full max-w-xl overflow-hidden rounded-2xl border border-white/15">
     <a href={shot.src} target="_blank" rel="noopener noreferrer"><Image src={shot.src} alt="Example of an error message in the application interface" width={shot.width} height={shot.height} sizes="(max-width:640px) 100vw,540px" className="h-auto w-full object-contain"/></a>
     <figcaption className="px-5 py-4 text-sm text-white/70">Example error message.</figcaption>
    </figure>)}</div>
   </section>}
   <nav aria-label="Table of contents" className="surface-card my-10 rounded-xl border border-white/10 p-6"><h2 className="mb-4 text-lg">In this guide</h2>
    <ol className="list-inside list-decimal space-y-3">{guide.sections.map((section,i)=><li key={i}><a href={`#section-${i+1}`} className="underline underline-offset-4">{section.title}</a></li>)}</ol>
   </nav>
   {guide.sections.map((section,i)=><section key={i} id={`section-${i+1}`} className="mt-12 scroll-mt-28">
    <h2 className="text-2xl md:text-3xl">{section.title}</h2>
    {section.paragraphs.map((paragraph,j)=><p key={j} className="mt-5 leading-8 text-white">{paragraph}</p>)}
   </section>)}
   {guide.sources&&guide.sources.length>0&&<aside className="surface-card mt-12 rounded-xl border border-white/15 p-5">
    <h2 className="text-lg">Documentation and sources</h2>
    <ul className="mt-3 space-y-2">{guide.sources.map((source,i)=><li key={i}><a className="text-sm text-[var(--brand-accent)] underline underline-offset-4" href={source.url} target="_blank" rel="noopener noreferrer">{source.label==="Dokumentacja producenta lub oficjalny standard"?"Official vendor documentation or technical standard":source.label}</a></li>)}</ul>
   </aside>}
  </article>
  <aside className="surface-card mt-14 rounded-2xl border border-white/30 p-7">
   <h2 className="text-2xl">Need help with a similar project?</h2>
   <p className="mt-4 leading-7 text-white/70">Describe the problem, your current setup and the expected outcome. We can discuss a practical implementation.</p>
   <div className="mt-6 flex flex-wrap gap-5"><a href={`mailto:kacper@bernecki.dev?subject=${encodeURIComponent(guide.title)}`} className="rounded-lg brand-action px-5 py-3 text-black">Contact me</a><Link href={guide.service} className="py-3 text-white">{guide.serviceLabel} (PL) →</Link></div>
  </aside>
  <nav aria-label="Related English guides" className="mt-14">
   <h2 className="text-2xl">Related guides</h2>
   <div className="mt-6 grid gap-3 md:grid-cols-2">{related.map(item=><Link key={item.slug} href={`/en/guides/${item.slug}`} className="surface-card rounded-xl border border-white/15 p-4 transition-colors hover:border-white/50">
    <span className="text-xs text-white/60">{englishCategory(englishGuideCategory(item))?.label}</span>
    <h3 className="mt-2 font-medium leading-snug text-white">{item.title}</h3>
    <p className="mt-2 text-sm leading-6 text-white/65">{item.description}</p>
   </Link>)}</div>
  </nav>
  <nav aria-label="Other guide categories" className="mt-10 border-t border-white/20 pt-8">
   <h2 className="text-xl">Other topics</h2>
   <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
    {others.map(item=><Link key={item.slug} href={`/en/guides/topics/${item.slug}`} className="underline underline-offset-4">{item.label} ({item.count})</Link>)}
    <Link href="/en/guides" className="underline underline-offset-4">All English guides</Link>
   </div>
  </nav>
 </main>;
}
