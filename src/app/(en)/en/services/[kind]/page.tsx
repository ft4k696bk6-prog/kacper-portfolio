import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { englishServices, type EnglishServiceSlug } from "@/content/english-business";

type Props={params:Promise<{kind:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(englishServices).map(kind=>({kind}));}
function getService(slug:string){return Object.prototype.hasOwnProperty.call(englishServices,slug)?englishServices[slug as EnglishServiceSlug]:undefined;}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {kind}=await params;const service=getService(kind);if(!service)notFound();
 const url=`https://bernecki.dev/en/services/${kind}`;
 return {title:service.title,description:service.intro.slice(0,160),
  alternates:{canonical:url,languages:{en:url,"pl-PL":`https://bernecki.dev${service.original}`}},
  openGraph:{title:service.title,description:service.intro,url,locale:"en_US",type:"website"}};
}
export default async function EnglishServicesPage({params}:Props){
 const {kind}=await params;const service=getService(kind);if(!service)notFound();
 const url=`https://bernecki.dev/en/services/${kind}`;
 const structuredData={"@context":"https://schema.org","@type":"Service",name:service.label,description:service.intro,url,
  provider:{"@id":"https://bernecki.dev/#person"},areaServed:"PL"};
 return <main lang="en" className="site-page editorial-page mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/>
  <nav aria-label="Breadcrumb" className="text-sm text-white/65"><Link href="/">Kacper Bernecki</Link> / {service.label}</nav>
  <header className="mt-12 max-w-4xl">
   <p className="text-xs uppercase tracking-[0.2em] text-white/65">{service.eyebrow}</p>
   <h1 className="mt-5 text-4xl leading-tight text-white md:text-6xl">{service.heading}</h1>
   <p className="mt-7 text-lg leading-8 text-white/75">{service.intro}</p>
   <div className="mt-8 flex flex-wrap gap-4">
    <Link href="/#contact" className="brand-action rounded-lg px-6 py-3 text-black">Discuss your project</Link>
    <Link href="/en/case-studies" className="brand-outline rounded-lg px-6 py-3 text-white">Explore case studies</Link>
   </div>
  </header>
  <section className="mt-20">
   <h2 className="text-3xl">What I can build for you</h2>
   <div className="mt-8 grid gap-4 md:grid-cols-2">{service.points.map(point=><article key={point.title} className="surface-card rounded-2xl border border-white/15 p-7">
    <h3 className="text-xl">{point.title}</h3><p className="mt-4 leading-7 text-white/70">{point.body}</p>
   </article>)}</div>
  </section>
  <section className="mt-16 border-t border-white/15 pt-12">
   <h2 className="text-2xl">Project scope</h2><p className="mt-4 max-w-3xl leading-8 text-white/75">{service.scope}</p>
   {kind==="marketing"&&<p className="mt-5 leading-7 text-white/75">See the <Link className="underline underline-offset-4" href="/en/case-studies/re-energy-meta-ads">Re-Energy System Meta Ads case study</Link> for campaign results.</p>}
   {kind==="crm"&&<p className="mt-5 leading-7 text-white/75">Explore the <Link href="/case-studies/b-crm" className="underline underline-offset-4">B-CRM demonstration</Link> and its lead management features.</p>}
  </section>
  <div className="mt-16 flex flex-wrap items-center gap-5">
   <Link href="/#contact" className="brand-action rounded-lg px-6 py-4 text-black">Book a conversation</Link>
   <Link href={service.original} className="text-sm text-white/75 underline underline-offset-4">Read in Polish</Link>
  </div>
 </main>;
}
