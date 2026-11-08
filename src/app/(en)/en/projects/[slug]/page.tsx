import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { englishRealizations, type EnglishRealizationSlug } from "@/content/english-business";
import { realizations } from "@/content/realizations";

type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(englishRealizations).map(slug=>({slug}));}
function getProject(slug:string){return Object.prototype.hasOwnProperty.call(englishRealizations,slug)?englishRealizations[slug as EnglishRealizationSlug]:undefined;}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const item=getProject(slug);if(!item)notFound();
 const url=`https://bernecki.dev/en/projects/${slug}`;
 return {title:`${item.title} | Kacper Bernecki`,description:item.summary,
  alternates:{canonical:url,languages:{en:url,"pl-PL":`https://bernecki.dev/realizacje/${slug}`}},
  openGraph:{title:item.title,description:item.summary,url,locale:"en_US",type:"article"}};
}
export default async function EnglishRealizationPage({params}:Props){
 const {slug}=await params;const item=getProject(slug);if(!item)notFound();
 const original=realizations.find(x=>x.slug===slug);
 if(!original)notFound();
 const url=`https://bernecki.dev/en/projects/${slug}`;
 const schema={"@context":"https://schema.org","@type":"Article",headline:item.title,description:item.summary,
  inLanguage:"en",mainEntityOfPage:url,author:{"@type":"Person","@id":"https://bernecki.dev/#person",name:"Kacper Bernecki"}};
 return <main lang="en" className="site-page editorial-page mx-auto max-w-4xl px-5 pb-24 pt-36 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
  <nav className="text-sm text-white/70" aria-label="Breadcrumb"><Link href="/en/case-studies">All case studies</Link> / {item.category}</nav>
  <p className="mt-12 text-sm uppercase tracking-[0.2em] text-white/60">{item.category}</p>
  <h1 className="mt-5 text-4xl leading-tight md:text-5xl">{item.title}</h1>
  <p className="mt-7 text-xl leading-8 text-white/85">{item.summary}</p>
  {item.details.map((paragraph,i)=><p key={i} className="mt-7 leading-8 text-white/75">{paragraph}</p>)}
  <div className="mt-12 flex flex-wrap gap-5">
   <Link href="/en/case-studies" className="brand-outline rounded-lg px-5 py-3">More projects</Link>
   <Link href={`/realizacje/${slug}`} className="py-3 text-white underline underline-offset-4">Polish version</Link>
   <Link href="/#contact" className="brand-action rounded-lg px-5 py-3 text-black">Get in touch</Link>
  </div>
 </main>;
}
