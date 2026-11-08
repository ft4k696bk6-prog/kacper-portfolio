import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, BrainCircuit, ChartNoAxesCombined, FileText, ShieldCheck, Workflow } from "lucide-react";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ContactReveal } from "@/components/ContactReveal";
import { pl } from "@/i18n/pl";
import { aiGuides } from "@/content/aiGuides";

const canonical="https://bernecki.dev/wdrozenia-ai-dla-firm";
export const metadata:Metadata={
 title:"Wdrożenia AI dla firm — automatyzacja, chatboty, asystenci i analiza danych",
 description:"Wdrażanie AI w procesach biznesowych: chatboty na bazie wiedzy firmy, automatyzacja leadów, asystenci pracowników, analiza danych i integracje API. Audyt i pilotaż przed pełnym wdrożeniem.",
 keywords:["wdrożenia AI dla firm","automatyzacja AI w firmie","chatbot AI dla firmy","asystent AI do obsługi klienta","AI w CRM","analiza sprzedaży i marż AI","integracje modeli AI API"],
 alternates:{canonical},
 openGraph:{title:"AI w Twojej firmie — od problemu do działającego wdrożenia",description:"Chatboty, asystenci, automatyzacje i analiza danych. Zacznij od jednego procesu i sprawdź jego realną wartość.",url:canonical,type:"website",locale:"pl_PL"}
};
const uses=[
 {icon:Bot,title:"Obsługa klienta i baza wiedzy",text:"Asystent odpowiadający na pytania na podstawie zaakceptowanych dokumentów, FAQ i zasad firmy. Z możliwością przekazania sprawy człowiekowi."},
 {icon:Workflow,title:"Leady, oferty i zamówienia",text:"Kategoryzacja zgłoszeń, podsumowania rozmów, propozycje odpowiedzi i przekazywanie danych do CRM. Wrażliwe operacje wymagają zatwierdzenia."},
 {icon:FileText,title:"Dokumenty i praca zespołu",text:"Wyszukiwanie informacji w instrukcjach, robocze podsumowania i porządkowanie dokumentów przy ograniczonym dostępie do danych."},
 {icon:ChartNoAxesCombined,title:"Analiza sprzedaży i marż",text:"Łączenie danych z ERP lub bazy, obliczenia marż i rotacji oraz wskazywanie odchyleń. Liczby wylicza system analityczny, a AI pomaga je interpretować."}
];
const scope=[
 "Audyt jednego procesu: koszt obecnej pracy, jakość danych, ryzyko i proponowany wynik.",
 "Mały pilotaż na danych testowych lub odpowiednio przygotowanej próbce.",
 "Integracje przez API, webhooks lub kontrolowany import — po sprawdzeniu możliwości systemów.",
 "Uprawnienia, ograniczenie kosztów zapytań, logi błędów i ręczne zatwierdzanie ważnych działań.",
 "Testy jakości odpowiedzi, przypadków błędnych, pomiar czasu i ocena dalszej opłacalności."
];
const faq=[
 ["Czy AI może samo wystawiać faktury, zmieniać ceny i składać zamówienia?","Technicznie część działań można zautomatyzować, lecz nie zaczynam od niekontrolowanych zapisów w systemie. Dla operacji finansowych i magazynowych wdrażam uprawnienia, reguły i zatwierdzanie przez człowieka."],
 ["Czy trzeba zmieniać CRM, ERP lub stronę?","Niekoniecznie. Najpierw oceniam obecne narzędzia i dostępne API. Niekiedy wystarczy osobny moduł lub integracja; niektóre systemy wymagają większego projektu."],
 ["Co z danymi klientów i RODO?","Przed połączeniem danych ustalamy ich zakres, role dostępu, dostawców i zasady przechowywania. Nie wysyłamy całej bazy klientów do przypadkowego modelu bez podstawy i zabezpieczeń."],
 ["Czy gwarantujesz oszczędności lub bezbłędne odpowiedzi AI?","Nie. Ustalamy miary sukcesu, testujemy na rzeczywistych scenariuszach i podejmujemy decyzję o wdrożeniu na podstawie wyniku pilotażu."],
 ["Ile kosztuje AI w firmie?","Koszt zależy od integracji, liczby użytkowników, zakresu danych, testów i użycia modeli API. Najpierw ustalam zakres audytu i pilotażu, a następnie wyceniam rozwinięcie."],
];
const jsonLd={"@context":"https://schema.org","@graph":[
 {"@type":"Service","@id":canonical+"#service",name:"Wdrożenia AI i automatyzacja procesów biznesowych",description:metadata.description,url:canonical,serviceType:"Integracje AI, chatboty, automatyzacja i analiza danych",areaServed:{"@type":"Country",name:"Poland"},provider:{"@type":"Person","@id":"https://bernecki.dev/#person"}},
 {"@type":"FAQPage",mainEntity:faq.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))},
 {"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Portfolio",item:"https://bernecki.dev"},{"@type":"ListItem",position:2,name:"Wdrożenia AI dla firm",item:canonical}]}
]};
export default function AIPage(){return <main className="site-page min-h-screen bg-[var(--brand-black)] text-white">
 <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,"\\u003c")}}/>
 <div className="mx-auto max-w-6xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
  <nav aria-label="Ścieżka strony" className="flex gap-2 text-sm text-white/60"><Link href="/">Portfolio</Link><span>/</span><span>Wdrożenia AI dla firm</span></nav>
  <header className="grid gap-10 border-b border-white/15 pb-20 pt-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
   <div>
    <p className="text-xs uppercase tracking-[.2em] text-white/55">AI · automatyzacja · dane</p>
    <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Sztuczna inteligencja, która rozwiązuje konkretny problem w firmie.</h1>
    <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75">Projektuję i integruję rozwiązania AI z procesami firm: obsługą klientów, CRM, dokumentami i analizą danych. Najpierw sprawdzamy, gdzie AI ma sens i ile może kosztować — potem budujemy mały, mierzalny pilotaż.</p>
    <div className="mt-9 flex flex-wrap gap-3"><a href="#rozmowa" className="brand-action rounded-lg px-6 py-3.5 font-medium text-black">Omów proces w firmie</a><a href="#zastosowania" className="rounded-lg border border-white/20 px-6 py-3.5 hover:border-white/50">Zobacz zastosowania</a></div>
   </div>
   <div className="rounded-2xl border border-white/15 bg-white/[.035] p-8">
    <BrainCircuit className="h-9 w-9" aria-hidden="true"/><h2 className="mt-6 text-2xl">Najpierw problem. Potem model.</h2>
    <p className="mt-4 leading-8 text-white/70">Nie każda firma potrzebuje chatbota. Czasem wystarczą reguły, zwykła integracja albo lepszy raport. AI dokładamy tam, gdzie wnosi dodatkową wartość.</p>
    <p className="mt-5 text-sm text-white/50">Pilotaż → pomiar → decyzja o dalszym wdrożeniu</p>
   </div>
  </header>
  <section id="zastosowania" className="scroll-mt-28 border-b border-white/15 py-20">
   <p className="text-xs uppercase tracking-[.2em] text-white/55">Możliwe zastosowania</p>
   <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Co możemy usprawnić?</h2>
   <div className="mt-9 grid gap-4 md:grid-cols-2">{uses.map(u=><article key={u.title} className="rounded-xl border border-white/15 bg-white/[.025] p-7"><u.icon className="h-7 w-7" aria-hidden="true"/><h3 className="mt-5 text-xl font-medium">{u.title}</h3><p className="mt-4 leading-7 text-white/70">{u.text}</p></article>)}</div>
  </section>
  <section className="grid gap-12 border-b border-white/15 py-20 lg:grid-cols-[.85fr_1.15fr]">
   <div><p className="text-xs uppercase tracking-[.2em] text-white/55">Jak pracuję</p><h2 className="mt-4 text-3xl font-semibold md:text-4xl">Najpierw audyt, potem pilotaż.</h2><p className="mt-6 leading-8 text-white/70">Nie obiecuję autonomicznego systemu sterującego całą firmą. Zaczynam od jednego procesu i jasnych kryteriów sukcesu.</p></div>
   <div className="space-y-4">{scope.map((line,i)=><div key={line} className="flex gap-4 rounded-xl border border-white/10 p-5"><span className="text-sm tabular-nums text-white/45">{String(i+1).padStart(2,"0")}</span><p className="leading-7 text-white/80">{line}</p></div>)}</div>
  </section>
  <section className="grid gap-10 border-b border-white/15 py-20 lg:grid-cols-[.8fr_1.2fr]">
   <div><p className="text-xs uppercase tracking-[.2em] text-white/55">Projekt własny</p><h2 className="mt-4 text-3xl font-semibold">B-Code — integracje kilku modeli AI</h2><p className="mt-6 leading-8 text-white/75">Przy B-Code pracuję nad autorskim narzędziem wykorzystującym API różnych modeli, podział zadań na role i przekazywanie kontekstu. To doświadczenie z integracją modeli, a nie dowód wdrożenia AI na dużą skalę w cudzej firmie.</p><Link href="/realizacje/b-code" className="mt-7 inline-flex items-center gap-2 underline underline-offset-4">Zobacz B-Code <ArrowRight className="h-4 w-4"/></Link></div>
   <div className="overflow-hidden rounded-xl border border-white/15 bg-[#121212]"><Image src="/images/projects/b-code-editorial.jpg" alt="Wizualizacja projektu narzędzia B-Code" width={1100} height={680} sizes="(min-width:1024px) 55vw, 100vw" className="h-auto w-full"/><p className="p-4 text-xs text-white/60">Materiał prezentacyjny projektu B-Code.</p></div>
  </section>
  <section className="border-b border-white/15 py-20"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs uppercase tracking-[.2em] text-white/55">Wiedza bez marketingowego szumu</p><h2 className="mt-4 text-3xl font-semibold md:text-4xl">Jak działa AI, API i bezpieczna automatyzacja?</h2></div><Link href="/poradniki/tematy/ai-w-firmie" className="inline-flex items-center gap-2 underline underline-offset-4">Wszystkie poradniki AI <ArrowRight className="h-4 w-4"/></Link></div><div className="mt-8 grid gap-3 md:grid-cols-2">{aiGuides.slice(0,6).map(guide=><Link key={guide.slug} href={"/poradniki/"+guide.slug} className="flex items-center justify-between gap-5 rounded-lg border border-white/15 p-5 transition hover:border-white/50"><span>{guide.title}</span><ArrowRight className="h-4 w-4 shrink-0"/></Link>)}</div></section>
  <section className="border-b border-white/15 py-20"><div className="flex items-center gap-3"><ShieldCheck className="h-7 w-7"/><h2 className="text-3xl font-semibold">Bezpieczeństwo i odpowiedzialność</h2></div><p className="mt-6 max-w-4xl leading-8 text-white/75">Dane firmowe udostępniamy tylko w niezbędnym zakresie, z kontrolą uprawnień i zatwierdzaniem ważnych działań. Odpowiedzi modeli mogą być błędne, a integracje mogą wymagać oceny prawnej i zgodności z RODO. Nie świadczę usług prawnych ani audytu zgodności regulacyjnej — w tym zakresie współpracę należy uzgodnić z odpowiednim specjalistą.</p></section>
  <section className="grid gap-10 py-20 lg:grid-cols-[.75fr_1.25fr]"><h2 className="text-3xl font-semibold">Pytania przed wdrożeniem</h2><div className="space-y-3">{faq.map(([question,answer])=><details key={question} className="rounded-lg border border-white/15 p-5"><summary className="cursor-pointer font-medium">{question}</summary><p className="mt-4 leading-7 text-white/70">{answer}</p></details>)}</div></section>
  <section id="rozmowa" className="scroll-mt-28 rounded-2xl border border-white/20 bg-white/[.035] p-6 md:p-10">
   <div className="grid gap-10 lg:grid-cols-2"><div><h2 className="text-3xl font-semibold">Jaki proces chcesz usprawnić?</h2><p className="mt-5 leading-8 text-white/75">Napisz, z jakich narzędzi korzystasz, jak wygląda obecna praca i czego oczekujesz. Ustalimy, czy AI jest tu właściwym rozwiązaniem, czy lepsza będzie zwykła automatyzacja.</p><div className="mt-8"><ContactReveal plain copy={{...pl.contact.reveal,phoneButton:"Pokaż telefon",emailButton:"Pokaż adres e-mail"}}/></div><Link href="/rozwoj-biznesu" className="mt-8 inline-flex items-center gap-2 text-sm underline underline-offset-4">Zobacz również rozwój biznesu <ArrowRight className="h-4 w-4"/></Link></div><div><h3 className="mb-4 font-medium">Umów rozmowę o procesie</h3><BookingCalendar copy={pl.contact.booking} locale="pl-PL" emptyMessage="Brak dostępnych terminów lub nie udało się ich pobrać. Skorzystaj z e-maila lub telefonu."/></div></div>
  </section>
 </div>
 </main>}
