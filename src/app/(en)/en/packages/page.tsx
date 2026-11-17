import type { Metadata } from "next";
import Link from "next/link";

const root="https://bernecki.dev";
export const metadata:Metadata={
 title:"Business Website, CRM & Ads Packages | bernecki.dev",
 description:"Compare website, Google and Meta Ads, CRM, automation and business growth packages. Clear deliverables, starting prices and separate advertising budgets.",
 alternates:{canonical:root+"/en/packages",languages:{"pl-PL":root+"/pakiety",en:root+"/en/packages"}},
};
const packages=[
 {name:"Business website",price:"PLN 3,900",period:"one-off",forWhom:"For businesses that need a credible website and a way to receive enquiries.",items:["Business website with services and contact","Mobile-friendly presentation","Contact form and basic SEO","Contact submission tests"],extra:"Domain, hosting, extra content and integrations are separate.",service:"/en/services/websites"},
 {name:"Your first ad campaign",price:"PLN 990",period:"setup",forWhom:"For businesses testing Google, Facebook or Instagram advertising.",items:["Select one platform and goal","Choose audiences or search keywords","Configure a basic campaign","Check enquiry tracking"],extra:"Advertising spend is separate. Monthly management starts at PLN 1,190 net.",service:"/en/advertising"},
 {name:"Landing page + ads",price:"PLN 4,900",period:"starter package",forWhom:"For businesses promoting one offer and wanting to collect sales enquiries.",items:["Landing page for one service","Enquiry form and basic tracking","One ad-platform setup","First month of basic campaign management"],extra:"Media spend, additional videos and subsequent months are separate.",service:"/en/advertising"},
 {name:"CRM for a sales team",price:"PLN 12,000",period:"first version",forWhom:"For companies losing customer details, calls or follow-up dates.",items:["Contact and enquiry list","Permissions and lead assignment","Sales stages, tasks and reminders","First module tested and delivered"],extra:"Advanced integrations, migrations and extra modules are quoted separately.",service:"/en/services/crm"},
 {name:"Lead-handling automation",price:"PLN 2,500",period:"implementation",forWhom:"For teams manually copying forms or forgetting follow-up calls.",items:["Review one customer journey","Connect forms with tasks or CRM","Enquiry notifications and reminders","Error-handling tests"],extra:"Third-party subscriptions and additional integrations are separate.",service:"/en/services/automation"},
] as const;
const growth=[
 {id:"audyt",name:"Business audit and action plan",price:"PLN 3,900",period:"one-off",description:"Review enquiries, website, advertising, customer handling and priority actions for 30 days."},
 {id:"partner",name:"Growth partner",price:"PLN 7,900",period:"monthly",description:"Ongoing guidance on advertising, SEO, sales and the quality of enquiries."},
 {id:"dyrektor",name:"Strategic and operational partner",price:"PLN 12,900",period:"monthly",description:"Broader support for the business owner across marketing, CRM, sales and implementation."}
] as const;
export default function EnglishPackages(){
 return <main lang="en" className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40"><div className="mx-auto max-w-6xl">
  <nav className="text-sm text-white/60"><Link href="/">Home</Link> / Pricing / Packages</nav>
  <p className="mt-12 text-xs uppercase tracking-widest text-white/60">Clear scope and starting prices</p>
  <h1 className="mt-4 max-w-5xl text-4xl leading-tight md:text-6xl">Service packages for websites, advertising, CRM and business growth</h1>
  <p className="mt-7 max-w-4xl text-lg leading-8 text-white/75">Choose the result you need. Each package has a defined starting scope and indicative net price in PLN. Need only one service? Use the individual price list.</p>
  <nav aria-label="Choose pricing format" className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
   <Link href="/en/packages" aria-current="page" className="rounded-xl border border-white/70 bg-white/15 p-5 font-semibold">Packages – bundled services</Link>
   <Link href="/en/pricing" className="rounded-xl border border-white/25 p-5 font-semibold hover:border-white/60">Individual service prices</Link>
  </nav>
  <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Service packages">{packages.map(p=><article key={p.name} className="surface-card flex flex-col rounded-2xl border border-white/20 p-7 md:p-9">
   <h2 className="text-2xl font-semibold">{p.name}</h2><p className="mt-3 text-3xl font-semibold">from {p.price} <span className="text-sm font-normal text-white/60">net · {p.period}</span></p>
   <p className="mt-5 leading-7 text-white/80">{p.forWhom}</p><h3 className="mt-7 text-sm font-semibold">What’s included?</h3>
   <ul className="mt-3 list-disc space-y-3 pl-5 leading-7 text-white/75">{p.items.map(i=><li key={i}>{i}</li>)}</ul>
   <p className="mt-7 text-sm leading-6 text-white/55">{p.extra}</p>
   <div className="mt-auto flex flex-wrap gap-4 pt-7"><Link href="/en/contact" className="brand-action rounded-lg px-5 py-3 font-semibold text-black">Ask about this package</Link><Link href={p.service} className="rounded-lg border border-white/25 px-5 py-3">Service details</Link></div>
  </article>)}</section>
  <section className="mt-20" aria-labelledby="growth-packages"><h2 id="growth-packages" className="text-3xl">Business growth and advisory packages</h2>
   <p className="mt-4 max-w-4xl leading-8 text-white/70">For businesses that need more than a single website or campaign: help setting priorities, improving sales and coordinating implementation.</p>
   <div className="mt-8 grid gap-5 md:grid-cols-3">{growth.map(p=><article key={p.id} className="flex flex-col rounded-2xl border border-white/20 p-7">
    <h3 className="text-2xl">{p.name}</h3><p className="mt-3 text-2xl font-semibold">from {p.price} <span className="text-sm font-normal text-white/60">net · {p.period}</span></p>
    <p className="mt-5 leading-7 text-white/70">{p.description}</p><div className="mt-auto pt-7"><Link href="/en/contact" className="brand-action block rounded-lg px-5 py-3 text-center font-semibold text-black">Discuss this package</Link><Link href="/en/business" className="mt-4 block text-center underline underline-offset-4">Full scope</Link></div>
   </article>)}</div>
  </section>
  <section className="mt-16 rounded-2xl border border-white/20 p-7 md:p-10"><h2 className="text-3xl">What’s charged separately?</h2>
   <p className="mt-5 leading-8 text-white/75">Starting prices exclude tax. Final quotes depend on the agreed scope. Advertising spend is paid to the platform separately, and domains, hosting, additional features, creative production or third-party tools can add costs.</p>
   <div className="mt-7 flex flex-wrap gap-6"><Link href="/en/pricing" className="underline underline-offset-4">Individual service prices</Link><Link href="/en/case-studies" className="underline underline-offset-4">View completed work</Link><Link href="/en/contact" className="underline underline-offset-4">Request a tailored quote</Link></div>
  </section>
 </div></main>;
}