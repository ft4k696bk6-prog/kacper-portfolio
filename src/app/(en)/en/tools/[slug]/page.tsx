import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ShieldCheck, MoveRight } from "lucide-react";
import { englishToolboxItems, englishToolForSlug, englishToolPath } from "@/lib/toolbox-en";
import { visibleEnglishToolboxItems } from "@/lib/toolbox-visibility";
import { EnglishToolRunner } from "@/components/EnglishToolRunner";
import { EnglishFullWebsiteAuditRunner } from "@/components/EnglishFullWebsiteAuditRunner";
import { VatCalculator } from "@/components/VatCalculator";
import { PdfEditor } from "@/components/PdfEditor";

type Params={params:Promise<{slug:string}>};
const site="https://bernecki.dev";
export function generateStaticParams(){return englishToolboxItems.map(t=>({slug:t.englishSlug}));}
export async function generateMetadata({params}:Params):Promise<Metadata>{
 const {slug}=await params;const tool=englishToolForSlug(slug);if(!tool)return {};
 const url=site+"/en/tools/"+slug;
 return {
  title:tool.title+" | bernecki.dev",
  description:tool.description+" Free online with no registration, no login and no credit card required.",
  alternates:{canonical:url,languages:{en:url,"pl-PL":site+"/narzedzia/"+tool.slug}},
  openGraph:{title:tool.title+" | bernecki.dev",description:tool.description,url,type:"website",locale:"en_US"}
 };
}
export default async function EnglishToolPage({params}:Params){
 const {slug}=await params,tool=englishToolForSlug(slug);if(!tool)notFound();
 const related=visibleEnglishToolboxItems.filter(t=>t.category===tool.category&&t.slug!==tool.slug).slice(0,3);
 const isFull=tool.slug==="audyt-strony";
 const service=tool.category==="Advertising & marketing"?"/en/services/marketing":tool.category==="CRM & sales"?"/en/services/crm":"/en/services/websites";
 const faqQuestion=isFull?"Does this audit check every page on my website?":"Can I use this tool without an account?";
 const faqAnswer=isFull?"No. It scans a sample of up to seven publicly accessible pages and performs selected technical checks. It is not a full site crawl, Core Web Vitals test or Google indexation report.":"Yes. This tool is available without signing up. Its results depend on the data you enter and the limitations described on this page.";
 const url=site+"/en/tools/"+slug;
 const jsonLd={"@context":"https://schema.org","@graph":[
  {"@type":"WebApplication",name:tool.title,url,description:tool.description,applicationCategory:"BusinessApplication",operatingSystem:"Web",inLanguage:"en",offers:{"@type":"Offer",price:"0",priceCurrency:"PLN"}},
  {"@type":"FAQPage",mainEntity:[{"@type":"Question",name:faqQuestion,acceptedAnswer:{"@type":"Answer",text:faqAnswer}}]},
  {"@type":"BreadcrumbList",itemListElement:[
   {"@type":"ListItem",position:1,name:"Home",item:site},
   {"@type":"ListItem",position:2,name:"Free tools",item:site+"/en/tools"},
   {"@type":"ListItem",position:3,name:tool.title,item:url}
  ]}
 ]};
 return <main lang="en" className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/>
  <nav className="flex flex-wrap items-center gap-2 text-xs text-white/60" aria-label="Breadcrumbs">
   <Link href="/" className="hover:text-white">Home</Link><span>/</span><Link href="/en/tools" className="hover:text-white">Free tools</Link><span>/</span><span className="text-white/85">{tool.title}</span>
  </nav>
  <header className="mb-10 mt-12"><p className="page-eyebrow">{tool.category} <span className="mx-2">/</span> FREE ONLINE TOOL</p>
   <h1 className="mt-5 max-w-5xl">{tool.title}</h1><p className="page-intro mt-6 max-w-3xl text-base md:text-lg">{tool.description}</p>
   <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/60"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2"><ShieldCheck size={14}/> No sign-up</span><span className="rounded-full border border-white/15 px-3 py-2">Results immediately</span><span className="rounded-full border border-white/15 px-3 py-2">No credit card required</span></div>
  </header>
  {isFull?<EnglishFullWebsiteAuditRunner/>:tool.mode==="vat"?<VatCalculator lang="en"/>:tool.mode==="pdf"?<PdfEditor lang="en"/>:<EnglishToolRunner mode={tool.mode} slug={tool.slug}/>}
  {!isFull&&(["Website & SEO","AI & search"].includes(tool.category))&&<Link href={englishToolPath("audyt-strony")} className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/20 bg-[#141414] p-5 transition-colors hover:border-white/50">
   <div><span className="text-xs font-medium text-white/50">One check instead of many</span><h2 className="mt-2 text-base font-medium">Run a combined audit for SEO, images, SSL, DNS and more.</h2></div><span className="inline-flex items-center gap-2 text-sm">Free website audit <ArrowUpRight size={16}/></span>
  </Link>}
  <section className="mt-14 grid gap-6 border-t border-white/15 pt-12 md:grid-cols-2">
   <article className="rounded-xl border border-white/15 bg-[#111111] p-6"><p className="page-eyebrow">How it works</p><h2 className="mt-4 text-2xl font-medium">What does this tool check?</h2>
    <p className="mt-4 text-sm leading-7 text-white/70">{tool.description}</p>
    <p className="mt-4 text-sm leading-7 text-white/60">Use the result as an initial technical check or calculation. Check your inputs and broader context before taking business decisions.</p>
   </article>
   <article className="rounded-xl border border-white/15 bg-[#111111] p-6"><p className="page-eyebrow">Important to know</p><h2 className="mt-4 text-2xl font-medium">{faqQuestion}</h2><p className="mt-4 text-sm leading-7 text-white/70">{faqAnswer}</p></article>
  </section>
  <section className="mt-14 rounded-xl border border-white/20 p-7 md:flex md:items-center md:justify-between md:gap-8">
   <div><p className="page-eyebrow">Turn results into action</p><h2 className="mt-3 text-2xl font-medium">Need help fixing it?</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">I can help implement a website, marketing or CRM improvement. The tools are free whether or not we work together.</p></div>
   <Link href="/kontakt" className="brand-action mt-5 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-6 text-sm md:mt-0">Talk about your project <ArrowUpRight size={17}/></Link>
  </section>
  {related.length>0&&<section className="mt-16"><div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-2xl font-medium">Related free tools</h2><Link href="/en/tools" className="inline-flex items-center gap-2 text-sm text-white/75 underline underline-offset-4">Browse all tools <MoveRight size={16}/></Link></div>
   <div className="mt-6 grid gap-3 md:grid-cols-3">{related.map(t=><Link key={t.slug} href={englishToolPath(t.slug)} className="rounded-xl border border-white/15 bg-[#111111] p-5 transition hover:border-white/50"><h3 className="font-medium">{t.title}</h3><p className="mt-3 text-sm leading-6 text-white/60">{t.description}</p><span className="mt-5 inline-flex items-center gap-2 text-xs text-white/75">Open <ArrowUpRight size={14}/></span></Link>)}</div>
  </section>}
  <Link href="/en/tools" className="mt-10 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowLeft size={16}/>Back to free tools</Link>
  <div className="sr-only"><Link href={service}>Related services</Link></div>
 </main>;
}
