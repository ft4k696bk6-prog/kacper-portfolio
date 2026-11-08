"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ClipboardList, Boxes, MonitorSmartphone, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const content={
  pl:{
    eyebrow:"ROZWÓJ BIZNESU · OD POMYSŁU DO WDROŻENIA",
    title:"Pomysł to początek. Pomogę go uruchomić.",
    intro:"Pomagam poukładać nowe przedsięwzięcia i rozwijać istniejące firmy. Od modelu biznesowego, produktu i dostawców po stronę, CRM, marketing i pierwsze procesy sprzedażowe. Ustalamy, co ma sens, ile kosztuje i jak wdrożyć to etapami.",
    cta:"Porozmawiajmy o projekcie",other:"Zobacz realizacje",scope:"W czym mogę realnie pomóc",
    cards:[
      {title:"Pomysł, strategia i start",text:"Analiza oferty, klienta, modelu działania, kosztów i kolejności decyzji. Pomoc organizacyjna przy przygotowaniu działalności.",Icon:ClipboardList},
      {title:"Produkt, dostawcy i import",text:"Poszukiwanie producentów, porównanie ofert, próbki, kalkulacja dostawy i koordynacja zaopatrzenia. Kwestie celne i zgodność produktu wymagają odrębnej weryfikacji.",Icon:Boxes},
      {title:"Strona, sklep i systemy",text:"Witryny, sklepy, CRM, automatyzacja i integracje dopasowane do tego, jak naprawdę działa Twój biznes.",Icon:MonitorSmartphone},
      {title:"Marketing i sprzedaż",text:"Oferta, kampanie, pozyskiwanie zapytań, pomiar konwersji i poprawa procesów sprzedaży w oparciu o wyniki.",Icon:ChartNoAxesCombined}
    ],
    processTitle:"Nie sprzedaję jednej recepty każdej firmie.",
    process:[
      ["01","Sprawdzamy pomysł","Rozmawiamy o kliencie, rynku, budżecie i ryzykach. Weryfikujemy, czy warto inwestować."],
      ["02","Układamy plan","Dzielimy projekt na etapy, wskazujemy priorytety oraz zadania wymagające specjalistycznej oceny."],
      ["03","Wdrażamy i mierzymy","Przygotowujemy ofertę, zaplecze techniczne, proces sprzedaży i sprawdzamy rezultaty."]
    ],
    examples:"Doświadczenie w praktyce",
    examplesIntro:"Moje doświadczenie obejmuje przedsięwzięcia usługowe, produkty, systemy i marketing. Zobacz przykłady konkretnych projektów.",
    legalTitle:"Jasny zakres odpowiedzialności",
    legalText:"Zajmuję się wsparciem biznesowym, organizacyjnym i wdrożeniowym oraz przekazuję ogólną wiedzę edukacyjną. Nie działam jako doradca podatkowy, kancelaria prawna ani biuro rachunkowe. Nie świadczę zawodowo zastrzeżonych czynności doradztwa podatkowego, w tym indywidualnych porad dotyczących zobowiązań podatkowych i celnych, nie reprezentuję w takich sprawach ani nie sporządzam rozliczeń podatkowych w imieniu klientów. Gdy projekt wymaga indywidualnej oceny podatkowej, prawnej, celnej lub zgodności produktu, decyzję i odpowiednią usługę powinien zapewnić uprawniony specjalista. Zakres każdej współpracy ustalamy przed jej rozpoczęciem.",
    law:"Ustawa o doradztwie podatkowym — Dz.U. 2026 poz. 1274",
    guides:"Materiały dla przedsiębiorców",
    guidesText:"Przykłady liczbowe i konkretne pytania, z którymi spotykają się osoby prowadzące lub zakładające biznes.",
    finalTitle:"Masz produkt lub pomysł na firmę?",
    finalText:"Napisz, co chcesz uruchomić, co już masz i jaki budżet rozważasz. Ustalimy pierwszą sensowną decyzję."
  },
  en:{
    eyebrow:"BUSINESS DEVELOPMENT · FROM IDEA TO EXECUTION",
    title:"An idea is just the start. I can help you launch it.",
    intro:"I help structure new ventures and grow existing businesses: business model, products and suppliers, websites, CRM, marketing and sales workflows. We establish what makes sense, what it costs and how to execute it in stages.",
    cta:"Discuss your project",other:"View projects",scope:"Where I can make a practical difference",
    cards:[
      {title:"Idea, strategy and setup",text:"Review the offer, customer, business model, costs and decision order. Practical organizational support for getting started.",Icon:ClipboardList},
      {title:"Product, suppliers and imports",text:"Research suppliers, compare quotes, organize samples, estimate landed costs and coordinate sourcing. Customs and product compliance require separate verification.",Icon:Boxes},
      {title:"Websites, shops and systems",text:"Websites, shops, CRM systems, automation and integrations fitted to how the business actually works.",Icon:MonitorSmartphone},
      {title:"Marketing and sales",text:"Offers, campaigns, lead generation, conversion analytics and better sales processes measured against results.",Icon:ChartNoAxesCombined}
    ],
    processTitle:"No single formula fits every business.",
    process:[
      ["01","Validate the idea","Review the customer, market, budget and risks before committing resources."],
      ["02","Plan in stages","Prioritize work and identify decisions that need specialist advice."],
      ["03","Implement and measure","Launch the offer, tools and sales workflow, then check the results."]
    ],
    examples:"Experience in practice",
    examplesIntro:"My work spans service businesses, products, software and marketing. Explore examples of real projects.",
    legalTitle:"Clear scope of responsibility",
    legalText:"I provide operational, organizational and implementation support as well as general educational information. I do not act as a licensed tax adviser, law firm or accountancy practice. I do not professionally perform restricted tax-advisory activities, including personalized opinions on tax and customs obligations, representation in such matters, or preparing tax returns on behalf of clients. Whenever a project needs individual tax, legal, customs or product-compliance assessment, the relevant work must be handled by an appropriately authorized specialist. We agree the scope before engagement.",
    law:"Polish Tax Advisory Act — consolidated text, 2026 item 1274",
    guides:"Practical guides for founders",
    guidesText:"Numerical examples and common questions faced by founders and business owners.",
    finalTitle:"Have a product or business idea?",
    finalText:"Tell me what you want to build, what you already have and your likely budget. We can identify the right first step."
  }
} as const;

const examples=[
  {image:"/images/projects/reenergy-website-live.jpg",name:"Re-Energy System",href:"/case-studies/re-energy-meta-ads",detail:"Strona · marketing · CRM"},
  {image:"/images/projects/starcars-live-current.jpg",name:"StarCars",href:"/case-studies/starcars",detail:"Oferta · import · kalkulacja"},
  {image:"/images/projects/isto-live-nov08.jpg",name:"Isto Kebab",href:"/realizacje/isto-kebab-strona",detail:"Strona · menu · zamówienia"},
  {image:"/images/projects/motomizer-live.jpg",name:"Motomizer",href:"/case-studies/motomizer",detail:"Produkt · marka · e-commerce"}
];
const guides=[
  {slug:"zwrot-vat-8-23-przyklad-50000",pl:"Zwrot VAT 8% i 23% na przykładzie 50 000 zł",en:"8% vs 23% VAT refund: PLN 50,000"},
  {slug:"kiedy-vat-8-budownictwo-oze-klimatyzacja-fryzjer",pl:"Kiedy usługa może mieć 8% VAT?",en:"When can services use 8% VAT?"},
  {slug:"fryzjerka-pkd-2025-vat-ryczalt-koszty",pl:"Salon fryzjerski: podatki, koszty i marża",en:"Hair salon: tax, costs and margin"},
  {slug:"barber-pkd-2025-vat-8-ryczalt-koszty",pl:"Barber: PKD, VAT i ryczałt",en:"Barbershop: VAT and lump-sum tax"},
  {slug:"wykonczeniowka-pkd-2025-55-ryczalt-vat-8",pl:"Wykończeniówka: 5,5% ryczałtu i VAT 8%",en:"Renovation: 5.5% income tax, 8% VAT"},
  {slug:"studio-tatuazu-pkd-9699-vat-ryczalt-koszty",pl:"Studio tatuażu: PKD i koszty",en:"Tattoo studio: codes and costs"},
  {slug:"spolka-zoo-cit-9-19-dywidenda-przyklad",pl:"Spółka z o.o.: CIT 9% i dywidenda",en:"Limited company: CIT and dividend"},
  {slug:"czy-oplaca-sie-vat-czynny-w-2026",pl:"Czy opłaca się być VAT-owcem?",en:"Is VAT registration worth it?"},
  {slug:"od-pomyslu-do-firmy-pierwsze-kroki",pl:"Od pomysłu do firmy — pierwsze kroki",en:"From idea to business — first steps"}
];

export function BusinessDevelopment(){
  const {lang}=useLanguage();
  const c=content[lang];
  return <main className="site-page bg-[#080808] text-white">
    <section className="relative isolate overflow-hidden px-5 pb-20 pt-36 md:px-8 md:pb-24 md:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_65%_at_83%_30%,rgba(255,255,255,.045),transparent_75%)]"/>
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[.2em] text-white/55">{c.eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.06] tracking-[-.05em] md:text-6xl lg:text-[66px]">{c.title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 md:text-lg">{c.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/#contact" className="brand-action inline-flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-black">{c.cta}<ArrowUpRight size={17}/></Link>
            <Link href="/#projects" className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-white hover:border-white/60">{c.other}<ArrowRight size={17}/></Link></div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-[#151515]">
          <Image src="/images/projects/bcrm-admin-dashboard.jpg" alt={lang==="pl"?"Rzeczywisty projekt panelu B-CRM":"B-CRM dashboard project"} fill sizes="(min-width:1024px) 38vw, 90vw" className="object-cover object-left-top opacity-90"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent"/>
          <p className="absolute bottom-6 left-6 right-6 text-sm text-white/90">B-CRM · {lang==="pl"?"system do obsługi sprzedaży":"sales workflow system"}</p>
        </div>
      </div>
    </section>
    <section className="border-t border-white/10 px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl">
      <h2 className="text-3xl font-medium tracking-tight md:text-5xl">{c.scope}</h2>
      <div className="mt-10 grid gap-4 md:grid-cols-2">{c.cards.map(card=><div key={card.title} className="rounded-2xl border border-white/15 bg-white/[.025] p-7">
        <card.Icon size={24} className="text-[#d6d6d6]"/><h3 className="mt-5 text-2xl">{card.title}</h3><p className="mt-4 max-w-xl leading-7 text-white/70">{card.text}</p>
      </div>)}</div>
    </div></section>
    <section className="border-t border-white/10 px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl">
      <h2 className="max-w-3xl text-3xl font-medium tracking-tight md:text-5xl">{c.processTitle}</h2>
      <div className="mt-10 grid gap-8 md:grid-cols-3">{c.process.map(([n,title,text])=><div key={n} className="border-t border-white/20 pt-6"><span className="text-sm text-[#d6d6d6]">{n}</span><h3 className="mt-5 text-xl">{title}</h3><p className="mt-3 leading-7 text-white/70">{text}</p></div>)}</div>
    </div></section>
    <section className="border-t border-white/10 px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl">
      <h2 className="text-3xl font-medium tracking-tight md:text-5xl">{c.examples}</h2><p className="mt-4 max-w-2xl leading-7 text-white/70">{c.examplesIntro}</p>
      <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{examples.map(item=><Link key={item.name} href={item.href} className="group overflow-hidden rounded-xl border border-white/15 bg-[#151515] hover:border-white/45">
        <div className="relative aspect-[16/10] overflow-hidden"><Image src={item.image} alt={item.name} fill sizes="(min-width:768px) 30vw, 90vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.035]"/></div>
        <div className="p-5"><h3 className="flex items-center justify-between text-xl">{item.name}<ArrowUpRight size={17}/></h3><p className="mt-2 text-sm text-white/65">{item.detail}</p></div></Link>)}</div>
    </div></section>
    <section className="border-t border-white/10 px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl">
      <div className="flex items-start gap-4"><ShieldCheck size={26} className="mt-1 shrink-0 text-[#d6d6d6]"/><div className="max-w-4xl">
        <h2 className="text-2xl font-medium md:text-3xl">{c.legalTitle}</h2><p className="mt-5 leading-8 text-white/75">{c.legalText}</p>
        <a href="https://eli.sejm.gov.pl/eli/DU/2026/1274/ogl" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-[#d6d6d6] underline underline-offset-4">{c.law}<ArrowUpRight size={14}/></a>
      </div></div>
    </div></section>
    <section className="border-t border-white/10 px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl">
      <h2 className="text-3xl font-medium tracking-tight md:text-5xl">{c.guides}</h2><p className="mt-4 max-w-3xl leading-7 text-white/70">{c.guidesText}</p>
      <div className="mt-8 grid gap-3 md:grid-cols-3">{guides.map(guide=><Link href={lang==="pl"?`/poradniki/${guide.slug}`:`/en/guides/${guide.slug}`} key={guide.slug} className="flex min-h-36 flex-col justify-between rounded-xl border border-white/15 bg-white/[.025] p-5 hover:border-white/45"><span className="leading-6">{guide[lang]}</span><ArrowUpRight size={18} className="mt-5 text-white/65"/></Link>)}</div>
    </div></section>
    <section className="border-t border-white/10 px-5 pb-24 pt-20 md:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
      <div><h2 className="text-3xl font-medium tracking-tight md:text-5xl">{c.finalTitle}</h2><p className="mt-4 max-w-2xl leading-7 text-white/70">{c.finalText}</p></div>
      <Link href="/#contact" className="brand-action inline-flex shrink-0 items-center gap-2 rounded-lg px-6 py-4 text-black">{c.cta}<ArrowUpRight size={18}/></Link>
    </div></section>
  </main>;
}
