import type { Metadata } from "next";
import Link from "next/link";

const canonical="https://bernecki.dev/en/case-studies/re-energy-meta-ads";
export const metadata:Metadata={
 title:"Re-Energy System: Meta Ads Lead Generation Case Study | Kacper Bernecki",
 description:"Two years of Meta Ads campaigns for Re-Energy System: PLN 90,837 in advertising spend, 2,331 leads from selected campaigns at PLN 29.79 each, and PLN 6 million in company turnover.",
 alternates:{canonical,languages:{en:canonical,"pl-PL":"https://bernecki.dev/case-studies/re-energy-meta-ads"}},
 openGraph:{title:"Re-Energy System — Meta Ads case study",description:"Lead generation and sales operations for a renewable energy company.",url:canonical,type:"article",locale:"en_US",alternateLocale:["pl_PL"]}
};
const numbers=[
 {value:"~2 years",label:"Meta Ads campaigns",detail:"Consistent flow of customer enquiries and recruitment campaigns."},
 {value:"PLN 90,837",label:"Advertising spend",detail:"Total Meta Ads campaign spend during the collaboration."},
 {value:"PLN 6 million",label:"Company turnover",detail:"Scale of Re-Energy System's business during the collaboration."}
];
const selected=[
 {value:"2,331",label:"Contacts acquired",detail:"Combined results of 17 lead generation campaigns."},
 {value:"PLN 29.79",label:"Average cost per contact",detail:"Weighted average cost for an acquired lead."},
 {value:"~PLN 69,400",label:"Spend across these campaigns",detail:"Campaign spending included in the lead generation comparison."}
];
const stages=[
 {title:"A clear offer and business goal",description:"Campaign messaging focuses on the customer's needs: electricity costs, solar power, energy storage and backup power."},
 {title:"Ad creatives tailored to the audience",description:"Different offers, formats and messages help reach people genuinely interested in renewable energy systems."},
 {title:"Lead forms and qualification",description:"Forms help collect enquiries while identifying the service and location relevant to each customer."},
 {title:"From enquiry to the sales team",description:"CRM workflows organize assignments, callbacks and the next steps after a customer submits a form."},
 {title:"Ongoing campaign optimization",description:"I compare cost per lead with contact quality and the results achieved later in the sales process."}
];
export default function ReEnergyMetaAdsEnglish(){
 const schema={"@context":"https://schema.org","@type":"Article","@id":canonical+"#article",
  headline:"Re-Energy System: Meta Ads lead generation supporting sales",
  description:"Lead generation and CRM-connected advertising for a renewable energy company.",
  mainEntityOfPage:canonical,inLanguage:"en",isAccessibleForFree:true,
  author:{"@type":"Person","@id":"https://bernecki.dev/#person",name:"Kacper Bernecki"},
  about:["Meta Ads","lead generation","renewable energy","CRM"]};
 return <main lang="en" className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-36 text-white md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
  <div className="mx-auto max-w-6xl">
   <nav aria-label="Breadcrumb" className="text-sm text-white/65"><Link href="/">Kacper Bernecki</Link> / <Link href="/en/case-studies">Case studies</Link> / Re-Energy System</nav>
   <header className="mt-12">
    <p className="text-xs uppercase tracking-[0.2em] text-white/65">Case study · Meta Ads · Renewable energy</p>
    <h1 className="mt-5 max-w-5xl text-4xl leading-tight md:text-6xl">Re-Energy System: advertising that supports the sales process.</h1>
    <p className="mt-7 max-w-3xl text-lg leading-8 text-white/80">For around two years, Meta Ads campaigns have been the source of new customer enquiries for Re-Energy System. The goal is not simply reach or clicks — it is a reliable flow of relevant contacts for the sales team.</p>
   </header>
   <section aria-label="Business results" className="mt-12 grid gap-4 md:grid-cols-3">{numbers.map(item=><article key={item.label} className="surface-card rounded-2xl border border-white/20 bg-white/[0.04] p-6">
    <p className="text-3xl font-semibold md:text-4xl">{item.value}</p><h2 className="mt-4 font-semibold">{item.label}</h2><p className="mt-2 text-sm leading-6 text-white/65">{item.detail}</p>
   </article>)}</section>
   <section className="surface-card mt-20 rounded-2xl border border-white/20 bg-white/[0.035] p-6 md:p-10">
    <p className="text-xs uppercase tracking-[0.2em] text-white/65">Meta Ads lead generation results</p>
    <h2 className="mt-4 max-w-4xl text-3xl md:text-4xl">2,331 contacts acquired at an average cost of PLN 29.79.</h2>
    <p className="mt-5 max-w-3xl leading-8 text-white/75">The comparison covers 17 campaigns focused on customer enquiries. It separates lead generation from recruitment and brand awareness activities.</p>
    <div className="mt-8 grid gap-4 md:grid-cols-3">{selected.map(item=><article key={item.label} className="surface-card rounded-xl border border-white/15 bg-black/20 p-5">
      <p className="text-3xl font-semibold md:text-4xl">{item.value}</p><h3 className="mt-4 font-semibold">{item.label}</h3><p className="mt-2 text-sm leading-6 text-white/65">{item.detail}</p>
    </article>)}</div>
   </section>
   <section className="mt-20 grid gap-8 border-t border-white/15 pt-14 md:grid-cols-[1fr_1.6fr]">
    <div><p className="text-xs uppercase tracking-[0.2em] text-white/60">The challenge</p><h2 className="mt-4 text-3xl">Where do new sales conversations come from?</h2></div>
    <div className="space-y-5 leading-8 text-white/75"><p>Re-Energy System provides photovoltaic installations, energy storage and related solutions for households and businesses. Customers need clear information and a quick follow-up after submitting an enquiry.</p>
    <p>The campaigns create opportunities for the sales team. Connecting them to a CRM helps ensure new contacts are received, assigned and followed up.</p></div>
   </section>
   <section className="mt-20">
    <p className="text-xs uppercase tracking-[0.2em] text-white/60">The approach</p><h2 className="mt-4 text-3xl">From advertising to a qualified enquiry.</h2>
    <div className="mt-8 grid gap-4 md:grid-cols-2">{stages.map((stage,i)=><article key={stage.title} className="surface-card rounded-xl border border-white/15 p-6">
     <span className="text-sm text-white/55">{String(i+1).padStart(2,"0")}</span><h3 className="mt-4 text-xl font-medium">{stage.title}</h3><p className="mt-4 leading-7 text-white/70">{stage.description}</p>
    </article>)}</div>
   </section>
   <section className="mt-20 grid gap-8 border-t border-white/15 pt-14 md:grid-cols-[1fr_1.6fr]">
    <div><p className="text-xs uppercase tracking-[0.2em] text-white/60">Key takeaway</p><h2 className="mt-4 text-3xl">The full process matters, not just the click.</h2></div>
    <div className="space-y-5 leading-8 text-white/75"><p>A low-cost form submission is useful, but customer contact quality, follow-up speed and the outcome of the sales conversation matter just as much.</p><p>Campaigns, forms and the CRM should support one consistent customer journey.</p></div>
   </section>
   <aside className="surface-card mt-20 rounded-2xl border border-white/25 bg-white/[0.04] p-7 md:p-10">
    <p className="text-xs uppercase tracking-[0.2em] text-white/60">Your business</p>
    <h2 className="mt-4 text-3xl">Want to acquire customers through Meta Ads?</h2>
    <p className="mt-4 max-w-2xl leading-8 text-white/75">I can connect advertising, lead forms, your website and CRM into a practical process. We start with your offer, audience and the way you measure success.</p>
    <div className="mt-6 flex flex-wrap gap-4"><Link href="/en/meta-ads" className="brand-outline rounded-lg px-5 py-3">Explore Meta Ads services</Link><Link href="/#contact" className="brand-action rounded-lg px-5 py-3 text-black">Get in touch</Link></div>
   </aside>
   <p className="mt-12 text-sm"><Link href="/case-studies/re-energy-meta-ads" className="underline underline-offset-4">Read the Polish version</Link></p>
  </div>
 </main>;
}
