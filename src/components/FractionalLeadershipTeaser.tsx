import Link from "next/link";
import { ArrowUpRight, ChartNoAxesCombined, ClipboardCheck, Workflow } from "lucide-react";

export function FractionalLeadershipTeaser({english=false}:{english?:boolean}){
 return <section aria-labelledby="leadership-intro" className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
  <div className="rounded-2xl border border-white/20 bg-white/[0.035] p-6 md:p-9">
   <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/60">{english?"For business owners":"Dla właścicieli firm"}</p>
   <h2 id="leadership-intro" className="mt-4 max-w-4xl text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl">{english?"One partner for your marketing, sales and operations.":"Zewnętrzny dyrektor marketingu, sprzedaży i operacji."}</h2>
   <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 md:text-base">{english?"I review where money is leaking, prioritize changes and help teams execute them — from advertising and customer acquisition to CRM and everyday processes. A practical external partner, not another disconnected agency.":"Sprawdzę, gdzie firma traci pieniądze, zapytania i czas. Ułożę priorytety oraz dopilnuję wdrożenia zmian — od reklam i pozyskiwania klientów po CRM i procesy w zespole. Jeden partner zamiast kilku nieskoordynowanych wykonawców."}</p>
   <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/70 md:text-sm">
    <span className="inline-flex items-center gap-2"><ChartNoAxesCombined size={17}/>{english?"Marketing and performance":"Marketing i wyniki"}</span>
    <span className="inline-flex items-center gap-2"><Workflow size={17}/>{english?"CRM and sales processes":"CRM i sprzedaż"}</span>
    <span className="inline-flex items-center gap-2"><ClipboardCheck size={17}/>{english?"Operational improvements":"Usprawnienia operacyjne"}</span>
   </div>
   <div className="mt-7 flex flex-wrap gap-3">
    <Link href="/zewnetrzny-dyrektor" className="brand-action inline-flex min-h-12 items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-black">{english?"Explore the partnership":"Zobacz zakres i pakiety"}<ArrowUpRight size={17}/></Link>
    <Link href="/kontakt?usluga=Rozw%C3%B3j%20biznesu" className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm text-white">{english?"Discuss your business":"Porozmawiajmy o Twojej firmie"}<ArrowUpRight size={17}/></Link>
   </div>
  </div>
 </section>;
}
