import type {Metadata} from "next";
import Link from "next/link";
import {LeadContactForm} from "@/components/LeadContactForm";
import {BookingCalendar} from "@/components/BookingCalendar";
import {ContactReveal} from "@/components/ContactReveal";
import {en} from "@/i18n/en";
const site="https://bernecki.dev";
export const metadata:Metadata={title:"Contact & Get a Quote | bernecki.dev",description:"Request a quote for a website, CRM, Google Ads, Meta Ads or business automation. Describe your project in English and get in touch.",alternates:{canonical:site+"/en/contact",languages:{"pl-PL":site+"/kontakt",en:site+"/en/contact"}}};
export default async function EnglishContact({searchParams}:{searchParams:Promise<{service?:string}>}) {
 const params=await searchParams;
 return <main lang="en" className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40"><div className="mx-auto max-w-6xl">
 <nav className="text-sm text-white/65"><Link href="/">Home</Link> / Contact</nav>
 <p className="mt-12 text-xs uppercase tracking-widest text-white/55">Project enquiry</p>
 <h1 className="mt-4 max-w-4xl text-4xl font-semibold md:text-6xl">Tell me what you want to build or improve.</h1>
 <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">Websites, custom CRM, Google Ads, Facebook and Instagram campaigns or automation – a few sentences are enough to start. I’ll review your requirements and discuss the next practical step.</p>
 <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr]">
   <LeadContactForm english initialService={params.service||""}/>
   <div className="space-y-7">
    <div id="booking" className="scroll-mt-24 rounded-2xl border border-white/15 p-6"><h2 className="text-xl font-semibold">Prefer a call?</h2><p className="mt-3 mb-5 text-sm leading-7 text-white/65">Choose an available time to discuss your project.</p><BookingCalendar copy={en.contact.booking} locale="en-US" emptyMessage="No slots available at the moment. Please use the contact form or email instead."/></div>
    <div className="rounded-2xl border border-white/15 p-6"><h2 className="text-xl font-semibold">Direct contact</h2><ContactReveal plain copy={en.contact.reveal}/></div>
    <Link href="/en/case-studies" className="inline-block underline underline-offset-4">View completed projects</Link>
   </div>
 </div>
 </div></main>;
}