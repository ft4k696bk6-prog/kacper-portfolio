import type {Metadata} from "next";
import Link from "next/link";
const site="https://bernecki.dev";
export const metadata:Metadata={title:"Business Process Automation and CRM Integrations | bernecki.dev",description:"Automate lead forms, CRM assignments, follow-up reminders and sales workflows. Practical integrations, costs and deployment.",alternates:{canonical:site+"/en/services/automation",languages:{"pl-PL":site+"/automatyzacja-leadow-i-sprzedazy",en:site+"/en/services/automation"}}};
const workflows=[
 ["Lead forms to CRM","Receive an enquiry from your website or advertising platform, check duplicates and assign it to the right person."],
 ["Follow-up reminders","Create tasks and alerts when a lead hasn't been contacted within the agreed time."],
 ["Documents and quotes","Help your team prepare consistent offers, handover documents and next steps without copying data manually."],
 ["AI where useful","Use AI for tasks such as categorising messages or summarising notes, with appropriate review and privacy safeguards."]
] as const;
export default function AutomationService(){
 return <main lang="en" className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40"><div className="mx-auto max-w-6xl">
  <nav className="text-sm text-white/60"><Link href="/">Home</Link> / <Link href="/en/services/crm">CRM</Link> / Automation</nav>
  <p className="mt-12 text-xs uppercase tracking-widest text-white/55">CRM · Forms · Integrations · Notifications</p>
  <h1 className="mt-4 max-w-5xl text-4xl leading-tight md:text-6xl">Automate repetitive business tasks – without losing customer enquiries.</h1>
  <p className="mt-7 max-w-4xl text-lg leading-8 text-white/75">I connect forms, advertising platforms, customer systems and internal tasks. The aim is to spend less time copying information and more time speaking with customers. We start with one useful process, test failures and add complexity only when justified.</p>
  <div className="mt-8 flex flex-wrap gap-4"><Link href="/en/contact" className="brand-action rounded-xl px-6 py-4 font-semibold text-black">Discuss a workflow</Link><Link href="/en/pricing" className="rounded-xl border border-white/25 px-6 py-4">See starting prices</Link></div>
  <section className="mt-20"><h2 className="text-3xl">What can be automated?</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{workflows.map(([title,description])=><article key={title} className="rounded-2xl border border-white/20 p-7"><h3 className="text-2xl">{title}</h3><p className="mt-4 leading-8 text-white/70">{description}</p></article>)}</div></section>
  <section className="mt-20 rounded-2xl border border-white/20 p-8"><h2 className="text-3xl">How much does it cost?</h2><p className="mt-5 leading-8 text-white/75">One simple automation starts at PLN 1,500 net. A starter package with workflow review, form handover and notifications starts at PLN 2,500 net. External subscriptions, complex APIs and ongoing support are separate. These are indicative prices, not binding quotations.</p><div className="mt-6 flex flex-wrap gap-6"><Link href="/en/packages" className="underline underline-offset-4">Packages</Link><Link href="/en/pricing" className="underline underline-offset-4">Individual pricing</Link></div></section>
  <section className="mt-20"><h2 className="text-3xl">A practical approach</h2><p className="mt-5 max-w-4xl leading-8 text-white/75">We map the current process, choose an initial version, test normal cases, duplicates and API failures, and only then connect it to production. Access rights, data minimisation and useful error logs are part of the design.</p><Link href="/en/contact" className="brand-action mt-7 inline-block rounded-xl px-6 py-3 font-semibold text-black">Get a workflow quote</Link></section>
 </div></main>;
}