import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { LeadContactForm } from "@/components/LeadContactForm";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ContactReveal } from "@/components/ContactReveal";
import { pl } from "@/i18n/pl";

export const metadata:Metadata={
 title:"Kontakt i wycena projektu",
 description:"Opisz projekt strony, sklepu, CRM, wdrożenia AI, marketingu lub rozwoju biznesu. Wyślij zapytanie lub umów rozmowę.",
 alternates:{canonical:"https://bernecki.dev/kontakt"},
};
export default async function ContactPage({searchParams}:{searchParams:Promise<{usluga?:string}>}){
 const query=await searchParams;
 return <main className="site-page min-h-screen bg-[var(--brand-black)] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
  <div className="mx-auto max-w-6xl">
   <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowLeft size={16}/> Portfolio</Link>
   <p className="mt-10 text-xs uppercase tracking-[.2em] text-white/55">Kontakt i współpraca</p>
   <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">Porozmawiajmy o Twoim projekcie.</h1>
   <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">Strona, CRM, AI, marketing albo pomysł na biznes? Opisz, czego potrzebujesz. Sprawdzimy zakres i możliwy następny krok — bez presji na duże wdrożenie.</p>
   <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr]">
    <LeadContactForm initialService={query.usluga||""}/>
    <div className="space-y-7">
     <div className="rounded-2xl border border-white/15 bg-white/[.025] p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold"><CalendarDays size={21}/> Wolisz rozmowę?</h2>
      <p className="mb-5 mt-3 text-sm leading-7 text-white/65">Wybierz wolny termin. Opowiesz o potrzebie, ustalimy, czy to zakres moich usług.</p>
      <BookingCalendar copy={pl.contact.booking} locale="pl-PL" emptyMessage="Nie ma teraz wolnych terminów. Możesz skorzystać z formularza lub kontaktu e-mail."/>
     </div>
     <div className="rounded-2xl border border-white/15 p-6">
      <h2 className="text-xl font-semibold">Kontakt bez formularza</h2>
      <ContactReveal plain copy={{...pl.contact.reveal,phoneButton:"Pokaż numer",emailButton:"Pokaż adres e-mail"}}/>
     </div>
     <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-white/80 underline underline-offset-4">Zobacz realizacje <ArrowRight size={16}/></Link>
    </div>
   </div>
  </div>
 </main>;
}
