import type { Metadata } from "next";
import Link from "next/link";
const canonical="https://bernecki.dev/en/meta-ads";
export const metadata:Metadata={
 title:"Meta Ads for Businesses: Facebook, Instagram and Leads | Kacper Bernecki",
 description:"Meta Ads campaigns for businesses: creative, lead forms, contact qualification and CRM follow-up. See the Re-Energy System case study.",
 alternates:{canonical,languages:{en:canonical,"pl-PL":"https://bernecki.dev/reklamy-meta-ads-dla-firm"}},
 openGraph:{title:"Meta Ads and lead generation | Kacper Bernecki",description:"Facebook and Instagram advertising connected to lead forms and CRM.",url:canonical,type:"website",locale:"en_US"}
};
const stages=[
 {title:"1. Review your offer and goals",body:"We define the target customer, service area and what a useful enquiry means for your business."},
 {title:"2. Create ads and messaging",body:"I prepare copy and creative that clearly present your service and explain what happens after someone submits a form."},
 {title:"3. Build lead forms and landing pages",body:"We choose Meta instant forms, dedicated landing pages or both, with qualification questions where they add value."},
 {title:"4. Send enquiries to your team",body:"Leads can be routed to your CRM, assigned to a team member and tracked through follow-ups."},
 {title:"5. Measure and improve",body:"I compare cost per lead with contact quality, follow-up speed, quotations and sales outcomes when that data is available."}
];
export default function MetaAdsEnglish(){
 const schema={"@context":"https://schema.org","@type":"Service",serviceType:"Meta Ads lead generation",
 name:"Facebook and Instagram advertising for businesses",url:canonical,provider:{"@id":"https://bernecki.dev/#person"},areaServed:"PL"};
 return <main lang="en" className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-36 text-white md:px-8">
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
 <div className="mx-auto max-w-6xl">
  <nav className="text-sm text-white/65"><Link href="/">Kacper Bernecki</Link> / <Link href="/en/services/marketing">Marketing</Link> / Meta Ads</nav>
  <header className="mt-12 max-w-4xl">
   <p className="text-xs uppercase tracking-[0.2em] text-white/65">Facebook Ads · Instagram Ads · Lead generation</p>
   <h1 className="mt-5 text-4xl leading-tight md:text-6xl">Meta Ads designed to generate enquiries, not just impressions.</h1>
   <p className="mt-7 text-lg leading-8 text-white/75">I plan and manage campaigns that connect advertising to lead forms, landing pages and customer follow-up. The aim is a clear process from the first enquiry to a conversation with your sales team.</p>
   <div className="mt-8 flex flex-wrap gap-3"><Link href="/#contact" className="brand-action rounded-lg px-5 py-3 text-black">Discuss your campaign</Link><Link href="/en/case-studies/re-energy-meta-ads" className="brand-outline rounded-lg px-5 py-3">Re-Energy System results</Link></div>
  </header>
  <section className="mt-20">
   <h2 className="text-3xl">How I approach campaigns</h2>
   <div className="mt-8 grid gap-4 md:grid-cols-2">{stages.map(stage=><article key={stage.title} className="surface-card rounded-xl border border-white/15 p-6">
    <h3 className="text-xl">{stage.title}</h3><p className="mt-4 leading-7 text-white/70">{stage.body}</p>
   </article>)}</div>
  </section>
  <section className="mt-20 grid gap-10 border-t border-white/15 pt-14 md:grid-cols-2">
   <div><h2 className="text-3xl">What else matters beyond cost per lead?</h2><p className="mt-5 leading-8 text-white/75">A cheap lead that never answers the phone may cost more in practice than a better-qualified enquiry. Campaign performance should connect to what happens next.</p></div>
   <ul className="space-y-4 text-white/80"><li>Cost per lead (CPL)</li><li>Percentage of valid, reachable contacts</li><li>Sales conversations and quotations</li><li>Customer acquisition cost (CAC), where sales data is available</li><li>Time between form submission and the first response</li></ul>
  </section>
  <section className="surface-card mt-20 rounded-2xl border border-white/20 bg-white/[0.04] p-7 md:p-10">
   <p className="text-xs uppercase tracking-[0.2em] text-white/60">Renewable energy case study</p>
   <h2 className="mt-4 text-3xl">Re-Energy System: two years of Meta Ads lead generation.</h2>
   <p className="mt-5 max-w-3xl leading-8 text-white/75">PLN 90,837 in advertising spend, PLN 6 million in company turnover, and 2,331 contacts acquired across 17 lead generation campaigns at an average cost of PLN 29.79 each.</p>
   <Link href="/en/case-studies/re-energy-meta-ads" className="mt-6 inline-block underline underline-offset-4">See the full case study</Link>
  </section>
  <div className="mt-16 flex flex-wrap gap-5"><Link href="/#contact" className="brand-action rounded-lg px-6 py-4 text-black">Book a conversation</Link><Link href="/reklamy-meta-ads-dla-firm" className="py-4 underline underline-offset-4">Polish version</Link></div>
 </div></main>;
}
