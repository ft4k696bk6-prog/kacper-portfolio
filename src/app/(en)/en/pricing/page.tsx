import type { Metadata } from "next";
import Link from "next/link";

const base="https://bernecki.dev";
export const metadata:Metadata={
 title:"Website, CRM and Ads Pricing | bernecki.dev",
 description:"Transparent starting prices for business websites, custom CRM, Google and Meta Ads, automation and ad audits. See individual services and bundled packages.",
 alternates:{canonical:base+"/en/pricing",languages:{"pl-PL":base+"/cennik",en:base+"/en/pricing"}},
 openGraph:{url:base+"/en/pricing",locale:"en_US",title:"Service pricing | bernecki.dev"},
};
const offers=[
 {name:"Sales landing page",price:"PLN 1,900",unit:"one-off",description:"A single-offer page with contact form, mobile design and basic measurement.",href:"/en/services/websites",points:["Conversion-focused layout","Mobile and form tests","Hosting, domain and paid integrations quoted separately"]},
 {name:"Business website",price:"PLN 3,900",unit:"one-off",description:"Company website with service pages, projects, contact and technical SEO basics.",href:"/en/services/websites",points:["Scope of pages agreed upfront","Metadata and search-engine discoverability","Content, integrations and extra languages quoted separately"]},
 {name:"Custom CRM – first working module",price:"PLN 12,000",unit:"project",description:"Customer enquiries, sales stages, tasks and permissions for one agreed workflow.",href:"/en/services/crm",points:["Workflow review","Working initial version and tests","Advanced integrations and maintenance quoted separately"]},
 {name:"Multi-module CRM / web app",price:"PLN 25,000",unit:"project",description:"A broader application with workflows, permissions, reports, documents and integrations.",href:"/en/services/crm",points:["Delivery in phases","Migration and integration review","Support scope agreed individually"]},
 {name:"Business process automation",price:"PLN 1,500",unit:"implementation",description:"For example: lead form → CRM → assigned person → notification.",href:"/en/services/automation",points:["One workflow mapped and implemented","Failure handling and testing","API and third-party subscriptions excluded"]},
 {name:"Advertising and analytics audit",price:"PLN 590",unit:"one-off",description:"Campaign objectives, tracking, targeting, budgets and gaps in lead handling.",href:"/en/advertising",points:["Prioritised issue list","Recommended experiments","Account permissions agreed beforehand"]},
 {name:"Advertising campaign setup",price:"PLN 990",unit:"one-off per platform",description:"Set up Google, Meta, TikTok or YouTube Ads for a clearly defined goal.",href:"/en/advertising",points:["One platform and agreed objective","Basic creative and conversion setup","Advertising spend billed separately"]},
 {name:"Ongoing ad management",price:"PLN 1,190",unit:"monthly per platform",description:"Regular improvements, creative tests and lead-quality reporting.",href:"/en/advertising",points:["One platform and agreed campaigns","Conversion tracking required","Media spend not included"]},
] as const;
export default function EnglishPricing(){
 return <main lang="en" className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40"><div className="mx-auto max-w-6xl">
  <nav className="text-sm text-white/65"><Link href="/">Home</Link> / Pricing</nav>
  <p className="mt-12 text-xs uppercase tracking-widest text-white/55">Clear starting prices · No hidden advertising spend</p>
  <h1 className="mt-5 max-w-5xl text-4xl leading-tight md:text-6xl">How much does a website, CRM, ad campaign or automation cost?</h1>
  <p className="mt-7 max-w-4xl text-lg leading-8 text-white/75">These are indicative starting prices in PLN excluding tax for the simplest practical scope. They are not fixed quotations. After a short review, I can provide a tailored proposal with deliverables, stages and external costs.</p>
  <nav aria-label="Choose pricing format" className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
   <Link href="/en/packages" className="rounded-xl border border-white/25 p-5 font-semibold hover:border-white/60">Packages – bundled services</Link>
   <Link href="/en/pricing" aria-current="page" className="rounded-xl border border-white/70 bg-white/15 p-5 font-semibold">Individual service pricing</Link>
  </nav>
  <div className="mt-8 flex flex-wrap gap-4"><Link href="/en/contact" className="brand-action rounded-xl px-6 py-3 font-semibold text-black">Request a quote</Link><Link href="/en/case-studies" className="rounded-xl border border-white/25 px-6 py-3">View completed work</Link></div>
  <section className="mt-16 grid gap-5 sm:grid-cols-2" aria-label="Service price list">{offers.map(item=><article key={item.name} className="surface-card rounded-2xl border border-white/20 p-6 md:p-8">
   <h2 className="text-2xl font-semibold">{item.name}</h2><p className="mt-4 text-3xl font-semibold">from {item.price} <span className="text-sm font-normal text-white/60">net · {item.unit}</span></p>
   <p className="mt-4 leading-7 text-white/75">{item.description}</p>
   <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-white/65">{item.points.map(point=><li key={point}>{point}</li>)}</ul>
   <div className="mt-7 flex flex-wrap gap-4"><Link href={item.href} className="underline underline-offset-4">Explore service</Link><Link href="/en/contact" className="font-semibold underline underline-offset-4">Ask for pricing</Link></div>
  </article>)}</section>
  <section className="mt-20 rounded-2xl border border-white/20 p-7 md:p-10">
   <h2 className="text-3xl">What do you pay for in advertising?</h2>
   <p className="mt-5 leading-8 text-white/75">Campaign work and advertising spend are separate charges. Google, Meta or another platform collects the media budget. Videos, landing pages, third-party tools and integrations may be quoted separately. No guaranteed lead volume is implied by these starting prices.</p>
   <div className="mt-6 flex flex-wrap gap-6"><Link href="/en/advertising" className="underline underline-offset-4">Compare advertising channels</Link><Link href="/en/packages" className="underline underline-offset-4">Explore bundled packages</Link></div>
  </section>
  <section className="mt-20"><h2 className="text-3xl">How we work together</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{[
   ["01","Describe your goal","Tell me your industry, budget, current tools and what isn’t working."],
   ["02","Agree on scope","We decide whether an off-the-shelf option is sufficient and which integrations matter."],
   ["03","Get a quote","You receive a scope, price, delivery stages and ongoing cost assumptions."]
  ].map(([n,t,d])=><div key={n} className="rounded-xl border border-white/15 p-6"><p className="text-white/55">{n}</p><h3 className="mt-3 text-xl">{t}</h3><p className="mt-3 leading-7 text-white/70">{d}</p></div>)}</div></section>
  <section className="mt-20 rounded-2xl border border-white/25 p-8"><h2 className="text-3xl">Not sure which service to start with?</h2><p className="mt-4 leading-8 text-white/75">Describe the problem and your budget. I’ll help you compare a smaller ready-made solution against a custom build or a paid advertising test.</p><Link href="/en/contact" className="brand-action mt-7 inline-block rounded-xl px-6 py-3 font-semibold text-black">Tell me about your project</Link></section>
 </div></main>;
}