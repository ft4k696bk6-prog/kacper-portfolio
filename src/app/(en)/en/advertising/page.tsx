import type { Metadata } from "next";
import Link from "next/link";

const base="https://bernecki.dev";
export const metadata:Metadata={
 title:"Google, Meta, TikTok, YouTube and LinkedIn Advertising",
 description:"Compare Google, Meta, TikTok, YouTube and LinkedIn ads, test budgets, lead tracking and CRM integrations. See campaign services and pricing.",
 alternates:{canonical:base+"/en/advertising",languages:{"pl-PL":base+"/reklamy-online",en:base+"/en/advertising"}},
};
const channels=[
 {name:"Google Ads",when:"People actively search for a service or supplier.",how:"Start with Search campaigns, specific keywords, negative keywords and verified lead conversions.",budget:"Illustrative test: PLN 1,500–4,000 per month in media spend for a focused local service; competitive markets may require more.",offer:"/en/advertising",guide:"jak-ustawic-google-ads-dla-firmy-uslugowej"},
 {name:"Facebook and Instagram (Meta Ads)",when:"You need to show an offer, explain benefits and reach people before they search.",how:"Test distinct messages and creative formats. Connect lead forms to a CRM and assess lead quality, not just cheap enquiries.",budget:"Illustrative test: PLN 1,000–3,000 per month for a limited market. Actual requirements depend on the service.",offer:"/en/meta-ads",guide:"jak-ustawic-meta-ads-krok-po-kroku"},
 {name:"TikTok Ads",when:"Short videos can demonstrate the product or service to an active audience.",how:"Prepare several videos, track meaningful actions and verify the available campaign objectives and account minimums.",budget:"Check current account- and campaign-level minimums in TikTok Ads Manager. Video production is quoted separately.",offer:"/en/advertising",guide:"tiktok-ads-dla-firm-jak-zaczac"},
 {name:"YouTube Ads",when:"Customers need a demonstration or explanation before making a decision.",how:"Show the problem and benefit early in the video. Link to a relevant landing page and measure real enquiries.",budget:"Illustrative test: PLN 1,500–4,000 per month excluding video production and management.",offer:"/en/advertising",guide:"youtube-ads-dla-firm-budzet-i-ustawienia"},
 {name:"LinkedIn Ads",when:"You know the B2B decision-maker, industry and potential contract value.",how:"Target relevant professional contexts and track qualified sales conversations through a CRM.",budget:"Often requires a higher tolerance for cost per click. Plan the budget from customer value rather than a universal minimum.",offer:"/en/advertising",guide:"linkedin-ads-kiedy-maja-sens-dla-b2b"},
] as const;
const guides=[
 ["Which CRM should a small business choose?","jaki-crm-wybrac-dla-malej-firmy"],
 ["What Facebook ad audience should I select?","targetowanie-posrednie-meta-ads-pomysly"],
 ["What should a Google Ads budget be?","budzet-google-ads-dla-firmy"],
 ["How much should I spend on Meta Ads?","ile-wydac-na-facebook-instagram-ads"],
 ["Should I manage ads myself or hire someone?","reklamy-samodzielnie-czy-agencja"],
 ["Where should a company start with automation?","automatyzacja-procesow-w-firmie-od-czego-zaczac"],
] as const;
export default function EnglishAdvertising(){
 return <main lang="en" className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40"><div className="mx-auto max-w-6xl">
  <nav className="text-sm text-white/60"><Link href="/">Home</Link> / <Link href="/en/services/marketing">Marketing</Link> / Advertising</nav>
  <p className="mt-12 text-xs uppercase tracking-widest text-white/55">Strategy · Paid campaigns · CRM · Sales tracking</p>
  <h1 className="mt-4 max-w-5xl text-4xl leading-tight md:text-6xl">Google, Facebook, Instagram, TikTok and YouTube Ads – focus on customers, not clicks.</h1>
  <p className="mt-7 max-w-4xl text-lg leading-8 text-white/75">I help businesses choose the right channel, build an offer, set up advertising and connect enquiries to their CRM. You don’t need to advertise everywhere at once: start with a channel that matches your customers and budget.</p>
  <div className="mt-8 flex flex-wrap gap-4"><Link href="/en/customer-acquisition" className="brand-action rounded-xl px-6 py-3 font-semibold text-black">Get more customer enquiries</Link><Link href="/en/pricing" className="rounded-xl border border-white/25 px-6 py-3">View prices</Link><Link href="/en/case-studies/re-energy-meta-ads" className="rounded-xl border border-white/25 px-6 py-3">Campaign example</Link></div>
  <section className="mt-20"><h2 className="text-3xl">Which advertising platform is right for your business?</h2><p className="mt-4 max-w-4xl leading-7 text-white/70">These are illustrative planning budgets, not verified market CPC figures, platform minimums or promises of results. Ad management fees and media spend are separate.</p>
   <div className="mt-8 grid gap-5 md:grid-cols-2">{channels.map(c=><article key={c.name} className="surface-card rounded-2xl border border-white/15 p-7">
    <h3 className="text-2xl">{c.name}</h3><p className="mt-4 leading-7 text-white/80"><strong>When it makes sense:</strong> {c.when}</p>
    <p className="mt-4 leading-7 text-white/70"><strong>First actions:</strong> {c.how}</p>
    <p className="mt-4 leading-7 text-white/70"><strong>Budget:</strong> {c.budget}</p>
    <div className="mt-7 flex flex-wrap gap-4"><Link href={c.offer} className="underline underline-offset-4">Service</Link><Link href={"/en/guides/"+c.guide} className="underline underline-offset-4">How-to guide</Link></div>
   </article>)}</div>
  </section>
  <section className="mt-20 rounded-2xl border border-white/20 p-7 md:p-10"><p className="text-xs uppercase tracking-widest text-white/55">Don’t copy a competitor’s audience settings</p><h2 className="mt-4 text-3xl">Who should see your Facebook ad?</h2>
   <p className="mt-5 leading-8 text-white/75">For example, a law firm handling property-related matters might test messages that resonate with people interested in home improvement, gardens or maintaining a property. Interest in lawn mowers does not prove home ownership or a legal problem. It is a testable marketing assumption, not a fact about a person.</p>
   <p className="mt-4 leading-8 text-white/75">Compare broad and specific groups, check which targeting options are actually available and evaluate qualified calls and sales in your CRM. Follow platform rules, particularly for regulated or sensitive services.</p>
   <Link href="/en/guides/targetowanie-posrednie-meta-ads-pomysly" className="mt-6 inline-block underline underline-offset-4">How to choose Facebook ad audiences</Link>
  </section>
  <section className="mt-20"><h2 className="text-3xl">How campaign success is measured</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{[
   ["Click","Someone shows interest; it isn’t yet a customer."],
   ["Qualified enquiry","A relevant contact reaches the team, with permission and enough information to follow up."],
   ["Sale","Your CRM shows which enquiries eventually result in a purchase or contract."]
  ].map(([t,d])=><div key={t} className="rounded-xl border border-white/15 p-6"><h3 className="text-xl">{t}</h3><p className="mt-3 leading-7 text-white/70">{d}</p></div>)}</div></section>
  <section className="mt-20"><h2 className="text-3xl">Practical guides before you start spending</h2><div className="mt-7 grid gap-3 md:grid-cols-2">{guides.map(([t,slug])=><Link key={slug} href={"/en/guides/"+slug} className="rounded-xl border border-white/20 p-5 hover:border-white/60">{t}</Link>)}</div></section>
  <section className="mt-20 rounded-2xl border border-white/25 p-8"><h2 className="text-3xl">Let’s decide where your advertising money should go.</h2><p className="mt-4 leading-8 text-white/70">Tell me your industry, service area, average customer value, monthly advertising budget and existing channels. We can plan the first experiment and the cost of managing it.</p><Link href="/en/contact" className="brand-action mt-7 inline-block rounded-xl px-6 py-3 font-semibold text-black">Discuss an advertising plan</Link></section>
 </div></main>;
}