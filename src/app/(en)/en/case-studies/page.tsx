import type { Metadata } from "next";
import Link from "next/link";
import { englishRealizations } from "@/content/english-business";
import { enCaseStudies } from "@/i18n/case-studies";
const canonical="https://bernecki.dev/en/case-studies";
export const metadata:Metadata={
 title:"Case Studies: Websites, CRM, Marketing and Apps | Kacper Bernecki",
 description:"Explore completed projects and case studies: business websites, B-CRM, StarCars, Motomizer, Re-Energy System advertising and web applications.",
 alternates:{canonical,languages:{en:canonical,"pl-PL":"https://bernecki.dev/case-studies"}},
 openGraph:{title:"Projects and case studies | Kacper Bernecki",url:canonical,type:"website",locale:"en_US"}
};
export default function EnglishCaseStudiesIndex(){
 const projects=Object.entries(englishRealizations);
 const structured={"@context":"https://schema.org","@type":"CollectionPage",name:"Projects and case studies",
  inLanguage:"en",url:canonical,mainEntity:{"@type":"ItemList",itemListElement:[
   {name:"Re-Energy System — Meta Ads",url:"https://bernecki.dev/en/case-studies/re-energy-meta-ads"},
   ...projects.map(([slug,item])=>({name:item.title,url:`https://bernecki.dev/en/projects/${slug}`})),
   ...enCaseStudies.items.map(item=>({name:item.title,url:`https://bernecki.dev/case-studies/${item.slug}`}))
  ].map((item,i)=>({"@type":"ListItem",position:i+1,...item}))}};
 return <main lang="en" className="site-page editorial-page mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,"\\u003c")}}/>
  <nav className="text-sm text-white/65" aria-label="Breadcrumb"><Link href="/">Kacper Bernecki</Link> / Case studies</nav>
  <header className="mt-12 max-w-4xl">
   <p className="text-xs uppercase tracking-[0.2em] text-white/60">Selected projects</p>
   <h1 className="mt-5 text-4xl leading-tight md:text-6xl">From an idea to a working solution.</h1>
   <p className="mt-6 text-lg leading-8 text-white/75">Websites, marketing campaigns, CRM systems and applications built around real business needs. Explore the work, the approach and the results.</p>
  </header>
  <Link href="/en/case-studies/re-energy-meta-ads" className="surface-card mt-12 block rounded-2xl border border-white/25 bg-white/[0.04] p-7 transition hover:border-white/60 md:p-10">
   <p className="text-xs uppercase tracking-[0.2em] text-white/60">Meta Ads · Renewable energy</p>
   <h2 className="mt-4 text-3xl">Re-Energy System — lead generation supporting sales</h2>
   <p className="mt-5 max-w-3xl leading-8 text-white/75">Two years of Meta Ads activity, PLN 90,837 in advertising spend, and 2,331 contacts acquired across 17 lead campaigns at an average of PLN 29.79 each.</p>
   <span className="mt-5 inline-block text-sm text-white underline underline-offset-4">Read the case study</span>
  </Link>
  <h2 className="mt-16 text-2xl">Marketing and business projects</h2>
  <div className="mt-6 grid gap-4 md:grid-cols-2">{projects.map(([slug,item])=><Link key={slug} href={`/en/projects/${slug}`} className="surface-card rounded-2xl border border-white/15 p-6 transition hover:border-white/50">
   <p className="text-xs text-white/60">{item.category}</p><h3 className="mt-3 text-xl">{item.title}</h3>
   <p className="mt-4 leading-7 text-white/70">{item.summary}</p>
  </Link>)}</div>
  <h2 className="mt-16 text-2xl">Applications and product case studies</h2>
  <div className="mt-6 grid gap-4 md:grid-cols-2">{enCaseStudies.items.map(item=><Link key={item.slug} href={`/case-studies/${item.slug}`} className="surface-card rounded-xl border border-white/15 p-6 transition hover:border-white/50">
   <h3 className="text-xl">{item.title}</h3><p className="mt-3 text-sm leading-7 text-white/70">{item.summary}</p>
  </Link>)}</div>
  <div className="mt-14 flex flex-wrap gap-5"><Link href="/#contact" className="brand-action rounded-lg px-6 py-4 text-black">Discuss your project</Link><Link href="/case-studies" className="py-4 underline underline-offset-4">Polish version</Link></div>
 </main>;
}
