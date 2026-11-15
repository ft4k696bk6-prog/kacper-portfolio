import type { Metadata } from "next";
import Link from "next/link";
import { LeadContactForm } from "@/components/LeadContactForm";

const origin="https://bernecki.dev";
export const metadata:Metadata={
 title:"How to Get More Customers: Google Ads, Meta Ads & CRM",
 description:"Customer acquisition for service businesses: Google and Facebook ads, landing pages, CRM, lead tracking and clear service pricing. Request a proposal.",
 alternates:{canonical:origin+"/en/customer-acquisition",languages:{"pl-PL":origin+"/pozyskiwanie-klientow",en:origin+"/en/customer-acquisition"}},
};
const services=[
 ["Google Ads – reach people searching for a service","Target buying-intent search terms and locations, then measure completed enquiries rather than clicks.","/en/advertising"],
 ["Facebook and Instagram – present your offer to potential customers","Test clear messages, creative formats and audiences. Measure which contacts are likely to buy.","/en/meta-ads"],
 ["A landing page that turns interest into enquiries","Make the offer, proof of work, scope and contact options obvious on mobile.","/en/services/websites"],
 ["CRM and automation – stop losing leads","Assign enquiries to the right person, track follow-up calls and identify which campaigns turn into sales.","/en/services/crm"]
] as const;
const cases=[
 ["People visit my site but don't enquire","Review the offer, forms, mobile experience and whether the ad matches the page."],
 ["My ads generate cheap but unqualified leads","Examine audience assumptions, messages, qualifying questions and the sales follow-up."],
 ["My business is invisible when customers search Google","Check key service pages, indexing and whether a focused search campaign makes sense."],
 ["The team cannot keep up with phone calls","Connect enquiries with a simple CRM, reminders and clear ownership."]
] as const;
const faqs=[
 ["Should I use Google Ads or Facebook Ads?","Google Ads can reach people actively searching for a service. Facebook and Instagram can introduce an offer to people who haven't searched for it yet. The right choice depends on your service, market and budget."],
 ["Do I need a website?","Not always. Some campaigns can use native lead forms, but a focused website can explain your services, display real work and attract organic search visits."],
 ["How much does ad management cost?","Indicative prices start at PLN 990 net for setup and PLN 1,190 net per month for management of one channel. Your media budget is separate."],
 ["Can you guarantee customers?","No. Results depend on the offer, competition, budget and lead handling. I can plan a measurable test and report on qualified enquiries."],
 ["Can you connect advertising to a CRM?","Yes, where the platforms provide suitable integrations and permissions. The exact scope and safe handling of customer data are agreed beforehand."]
] as const;
export default function CustomerAcquisition(){
 return <main lang="en" className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40"><div className="mx-auto max-w-6xl">
  <nav className="text-sm text-white/60"><Link href="/">Home</Link> / Customer acquisition</nav>
  <p className="mt-12 text-xs uppercase tracking-widest text-white/60">Advertising · Websites · CRM</p>
  <h1 className="mt-4 max-w-5xl text-4xl leading-tight md:text-6xl">Need more customers? Let's improve your ads, website and follow-up.</h1>
  <p className="mt-7 max-w-4xl text-lg leading-8 text-white/75">I help service businesses attract useful enquiries through Google, Facebook and Instagram, then follow up without losing leads. The goal isn't a large click count: it is reaching the right people and converting qualified enquiries into paying customers.</p>
  <div className="mt-8 flex flex-wrap gap-3"><Link href="#quote" className="brand-action rounded-xl px-6 py-4 font-semibold text-black">Describe your business</Link><Link href="/en/packages" className="rounded-xl border border-white/25 px-6 py-4">Compare prices and packages</Link><Link href="/en/case-studies/re-energy-meta-ads" className="rounded-xl border border-white/25 px-6 py-4">Campaign example</Link></div>
  <section className="mt-20"><h2 className="text-3xl font-semibold">Four parts that should work together</h2><div className="mt-7 grid gap-5 sm:grid-cols-2">{services.map(([title,description,href])=><article key={title} className="rounded-2xl border border-white/20 p-7"><h3 className="text-2xl">{title}</h3><p className="mt-4 leading-8 text-white/70">{description}</p><Link href={href} className="mt-6 inline-block underline underline-offset-4">Explore this service</Link></article>)}</div></section>
  <section className="mt-20 rounded-2xl border border-white/20 p-7 md:p-10"><h2 className="text-3xl">What's stopping your business from getting more customers?</h2><div className="mt-7 grid gap-5 md:grid-cols-2">{cases.map(([title,description])=><div key={title} className="rounded-xl border border-white/15 p-5"><h3 className="text-xl">{title}</h3><p className="mt-3 leading-7 text-white/70">{description}</p></div>)}</div></section>
  <section className="mt-20"><h2 className="text-3xl">What might a first project cost?</h2><p className="mt-5 max-w-4xl leading-8 text-white/75">An advertising audit starts at PLN 590 net, setup for one ad channel at PLN 990 net, and a landing page plus ad package at PLN 4,900 net. These are indicative prices for a basic scope. Money spent on the ads themselves is separate.</p>
   <div className="mt-6 flex flex-wrap gap-6"><Link href="/en/packages" className="underline underline-offset-4">Service packages</Link><Link href="/en/pricing" className="underline underline-offset-4">Individual prices</Link><Link href="/en/contact" className="underline underline-offset-4">Request a quote</Link></div></section>
  <section className="mt-20"><h2 className="text-3xl">Read before investing in advertising</h2><div className="mt-7 grid gap-3 md:grid-cols-2">{[
   ["How to get customers for a local service business","jak-zdobyc-klientow-dla-firmy-uslugowej"],
   ["Google Ads or SEO?","google-ads-czy-pozycjonowanie-strony-seo"],
   ["What does a new customer from ads cost?","ile-kosztuje-pozyskanie-klienta-z-reklamy"],
   ["How to choose Facebook and Instagram ad audiences","targetowanie-posrednie-meta-ads-pomysly"],
   ["Ads for construction businesses","reklama-firmy-budowlanej-facebook-czy-google"],
   ["Advertising for renewable energy companies","reklamy-oze-facebook-google-jak-zdobyc-leady"],
   ["Advertising for law firms","reklama-kancelarii-prawnej-google-facebook"],
   ["Advertising for US car importers","reklama-importu-aut-z-usa-jak-znalezc-klientow"],
  ].map(([label,slug])=><Link key={slug} href={"/en/guides/"+slug} className="rounded-xl border border-white/20 p-5 hover:border-white/60">{label}</Link>)}</div></section>
  <section className="mt-20"><h2 className="text-3xl">Frequently asked questions</h2><div className="mt-7 divide-y divide-white/15">{faqs.map(([q,a])=><div key={q} className="py-6"><h3 className="text-xl">{q}</h3><p className="mt-3 max-w-4xl leading-8 text-white/70">{a}</p></div>)}</div></section>
  <section id="quote" className="mt-20 scroll-mt-28"><h2 className="text-3xl">Tell me about your business</h2><p className="mb-6 mt-4 max-w-3xl leading-7 text-white/70">Describe your industry, location, advertising budget and the current bottleneck. You don't need to know which platform to choose.</p><div className="max-w-3xl"><LeadContactForm initialService="Pozyskiwanie klientów" english/></div></section>
  </div></main>;
}