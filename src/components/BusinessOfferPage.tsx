import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, ChevronRight } from "lucide-react";
import { businessOffers, type BusinessOfferKey } from "@/content/business-offers";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ContactReveal } from "@/components/ContactReveal";
import { BusinessOfferCta } from "@/components/BusinessOfferCta";
import { pl } from "@/i18n/pl";

const origin="https://bernecki.dev";

export function BusinessOfferPage({kind}:{kind:BusinessOfferKey}){
  const offer=businessOffers[kind];
  const canonical=origin+"/"+offer.slug;
  const pricingFactors = kind==="crm" ? [
    "Liczba użytkowników, ról, zespołów i zakres uprawnień.",
    "Import dotychczasowych danych, integracje z reklamami, pocztą i formularzami.",
    "Proces ofertowania, umowy, raporty i etapy realizacji."
  ] : [
    "Liczba źródeł leadów i wykorzystywanych narzędzi.",
    "Zakres integracji CRM, formularzy, reklam i automatycznych powiadomień.",
    "Konfiguracja pomiaru, audyt procesu oraz dalsza optymalizacja."
  ];
  const relatedGuides = kind==="crm" ? [
    ["CRM: skąd biorą się zduplikowane leady?", "crm-duplikaty-leadow-webhook"],
    ["Pusta lista po logowaniu — zasady RLS", "supabase-rls-pusta-lista-po-logowaniu"],
  ] : [
    ["Co zrobić, gdy tanie leady nie odbierają?", "tani-lead-meta-nie-odbiera-telefonu"],
    ["Pixel i Conversions API liczą podwójnie", "meta-duplikaty-pixel-conversions-api"],
    ["Strona i marketing lokalnej firmy", "reklama-lokalnej-firmy-strona-i-social-media"],
  ];
  const schema={
    "@context":"https://schema.org",
    "@graph":[
      {"@type":"Service","@id":canonical+"#service",name:offer.schemaService,serviceType:offer.schemaService,
       description:offer.metaDescription,url:canonical,areaServed:{"@type":"Country",name:"Poland"},
       provider:{"@type":"Person","@id":origin+"/#person",name:"Kacper Bernecki",url:origin}},
      {"@type":"FAQPage","@id":canonical+"#faq",
       mainEntity:offer.faq.map(item=>({"@type":"Question",name:item.q,acceptedAnswer:{"@type":"Answer",text:item.a}}))},
      {"@type":"BreadcrumbList",itemListElement:[
        {"@type":"ListItem",position:1,name:"Portfolio",item:origin},
        {"@type":"ListItem",position:2,name:offer.schemaService,item:canonical}
      ]}
    ]
  };
  return <main className="site-page min-h-screen bg-[var(--brand-black)] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
      <nav aria-label="Ścieżka strony" className="flex flex-wrap items-center gap-2 text-sm text-white/60">
        <Link href="/" className="hover:text-white">Portfolio</Link><ChevronRight className="h-4 w-4" aria-hidden="true"/>
        <span className="text-white/80">{offer.schemaService}</span>
      </nav>
      <section className="grid gap-12 border-b border-white/10 pb-20 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{offer.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{offer.heading}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75">{offer.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <BusinessOfferCta offer={kind} label={offer.cta} placement="hero" href={kind==="crm"?"/kontakt?usluga=CRM%20i%20aplikacja":"/kontakt?usluga=Marketing%20i%20reklamy"}/>
            <BusinessOfferCta offer={kind} label="Zobacz wdrożenie" placement="hero" href="#realizacja" secondary/>
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-white/55">{offer.audience}</p>
        </div>
        <Link href={offer.proof.href} className="group block overflow-hidden rounded-2xl border border-white/15 bg-white/5 transition hover:border-white/40">
          <Image src={offer.proof.img} alt={offer.proof.alt} width={1000} height={640}
            sizes="(min-width: 1024px) 44vw, 100vw" className="h-auto w-full object-cover"/>
          <div className="flex items-center justify-between gap-4 border-t border-white/10 p-5 text-sm text-white/85">
            <span>Rzeczywisty projekt · {kind==="crm"?"B-CRM":"Re-Energy System"}</span>
            <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-1" aria-hidden="true"/>
          </div>
        </Link>
      </section>
      <section aria-labelledby="problemy" className="py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Kiedy to rozwiązanie ma sens</p>
        <h2 id="problemy" className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">To są problemy, które warto uporządkować.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">{offer.challenges.map((item,i)=>
          <article key={item.title} className="rounded-xl border border-white/15 bg-white/[0.035] p-6">
            <span className="text-sm tabular-nums text-white/45">0{i+1}</span>
            <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
            <p className="mt-3 leading-7 text-white/70">{item.body}</p>
          </article>)}</div>
      </section>
      <section className="grid gap-10 border-y border-white/10 py-20 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Zakres współpracy</p>
          <h2 className="mt-4 text-3xl font-semibold">Co może obejmować wdrożenie?</h2>
          <p className="mt-5 text-sm leading-7 text-white/65">Konkretny zakres ustalamy po analizie procesu i istniejących narzędzi. Nie sprzedaję niepotrzebnych modułów.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">{offer.deliverables.map(item=>
          <div key={item} className="flex items-start gap-3 rounded-lg border border-white/10 p-5">
            <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden="true"/><p className="leading-7 text-white/80">{item}</p>
          </div>)}</div>
      </section>
      <section id="realizacja" className="scroll-mt-24 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Przykład z praktyki</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div><h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{offer.proof.title}</h2>
            <p className="mt-6 leading-8 text-white/75">{offer.proof.body}</p>
            <div className="mt-7 flex flex-wrap gap-5 text-sm">
              <Link className="inline-flex items-center gap-2 underline underline-offset-4" href={offer.proof.href}>{offer.proof.label}<ArrowRight className="h-4 w-4"/></Link>
              <Link className="inline-flex items-center gap-2 underline underline-offset-4" href={offer.proof.additionalHref}>{offer.proof.additionalLabel}<ArrowRight className="h-4 w-4"/></Link>
            </div>
          </div>
          <Image src={offer.proof.img} alt={offer.proof.alt} width={1100} height={700}
            sizes="(min-width: 1024px) 55vw, 100vw" className="h-auto w-full rounded-xl border border-white/15 object-cover"/>
        </div>
      </section>
      <section className="border-y border-white/10 py-20">
        <h2 className="text-3xl font-semibold tracking-tight">Jak wygląda współpraca?</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">{offer.steps.map((step,i)=>
          <div key={step.title} className="rounded-xl border border-white/15 bg-white/[0.025] p-6">
            <span className="text-sm text-white/45">Etap {i+1}</span>
            <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
            <p className="mt-3 leading-7 text-white/70">{step.body}</p>
          </div>)}</div>
      </section>
      <section className="border-y border-white/10 py-16">
        <h2 className="text-3xl font-semibold tracking-tight">Co wpływa na koszt wdrożenia?</h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-3">{pricingFactors.map(factor=><li key={factor} className="rounded-lg border border-white/15 p-5 leading-7 text-white/75">{factor}</li>)}</ul>
        <Link href="/materialy/brief-crm" className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-sm text-white">
          Checklista do rozmowy o CRM i leadach <ArrowRight className="h-4 w-4"/>
        </Link>
        <h3 className="mt-10 text-xl font-semibold">Poradniki związane z usługą</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{relatedGuides.map(([label,slug])=><Link key={slug} href={`/poradniki/${slug}`} className="rounded-lg border border-white/15 p-4 text-sm leading-6 text-white/75 hover:border-white/40">{label}<ArrowRight className="ml-2 inline h-4 w-4"/></Link>)}</div>
      </section>
      <section className="grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr]">
        <h2 className="text-3xl font-semibold tracking-tight">Najczęstsze pytania</h2>
        <div className="space-y-3">{offer.faq.map(faq=>
          <details key={faq.q} className="group rounded-lg border border-white/15 p-5">
            <summary className="cursor-pointer list-none font-medium marker:hidden">{faq.q}</summary>
            <p className="mt-4 leading-7 text-white/70">{faq.a}</p>
          </details>)}</div>
      </section>
      <section id="konsultacja" className="scroll-mt-24 rounded-2xl border border-white/20 bg-white/[0.035] p-6 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Porozmawiajmy</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Najpierw sprawdźmy, co ma sens.</h2>
            <p className="mt-5 leading-8 text-white/75">Opisz, jak dziś wygląda proces w Twojej firmie. Ustalimy problem, priorytety i możliwy zakres współpracy. Bez obietnic wyniku przed poznaniem danych.</p>
            <div className="mt-8"><ContactReveal plain copy={{...pl.contact.reveal,phoneButton:"Pokaż telefon",emailButton:"Pokaż adres e-mail"}}/></div>
            <Link href={offer.relatedHref} className="mt-10 inline-flex items-center gap-2 text-sm text-white/75 underline underline-offset-4">
              Zobacz także: {offer.relatedLabel} <ArrowRight className="h-4 w-4" aria-hidden="true"/>
            </Link>
          </div>
          <div>
            <div className="mb-4 flex items-center gap-3 text-sm text-white/80"><CheckCircle2 className="h-5 w-5" aria-hidden="true"/> Wybierz termin rozmowy</div>
            <BookingCalendar copy={pl.contact.booking} locale="pl-PL" emptyMessage="Nie ma teraz dostępnych terminów lub nie udało się ich pobrać. Napisz lub zadzwoń — ustalimy termin bezpośrednio."/>
          </div>
        </div>
      </section>
    </div>
  </main>;
}
