"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,ChevronDown,Gamepad2,Globe2,Search,Sparkles} from "lucide-react";
import {visibleToolboxItems,visibleEnglishToolboxItems} from "@/lib/toolbox-visibility";
import {englishToolPath} from "@/lib/toolbox-en";

const everyday=[
 {id:"text",pl:"Porządkowanie tekstu",en:"Text cleaner",plDesc:"Usuwanie duplikatów, ukrytych znaków i formatowanie.",enDesc:"Remove duplicates, hidden characters and tidy text."},
 {id:"percentage",pl:"Kalkulator procentów",en:"Percentage calculator",plDesc:"Rabaty, podwyżki i różnice procentowe.",enDesc:"Discounts, increases and percentage differences."},
 {id:"password",pl:"Generator haseł",en:"Password generator",plDesc:"Silne losowe hasła, tworzone na urządzeniu.",enDesc:"Strong random passwords generated on your device."},
 {id:"image",pl:"Konwerter zdjęć",en:"Image converter",plDesc:"JPG, PNG, WebP i kompresja obrazów.",enDesc:"JPG, PNG, WebP and image compression."},
 {id:"random",pl:"Losowanie",en:"Random picker",plDesc:"Wylosuj zwycięzcę lub jedną z opcji.",enDesc:"Randomly select a winner or an option."},
 {id:"signature",pl:"Generator stopki e-mail",en:"Email signature maker",plDesc:"Stopka HTML z podglądem i kopiowaniem.",enDesc:"HTML signature with preview and rich copy."}
] as const;
const everydayHref=(id:string,en:boolean)=>(en?"/en/tools/everyday":"/narzedzia/codzienne")+"#"+id;
const card="group flex min-h-[158px] flex-col justify-between rounded-2xl border border-white/15 bg-[#111] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/45 hover:bg-[#191919] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function ToolboxHub({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [query,setQuery]=useState("");
 const [sector,setSector]=useState("all");
 const tools=en?visibleEnglishToolboxItems:visibleToolboxItems;
 const categories=useMemo(()=>[...new Set(tools.map(t=>t.category))],[tools]);
 const term=query.trim().toLocaleLowerCase(en?"en":"pl");
 const everydayResults=everyday.filter(item=>(en?item.en+" "+item.enDesc:item.pl+" "+item.plDesc).toLocaleLowerCase().includes(term));
 const businessResults=tools.filter(t=>(sector==="all"||t.category===sector)&&(t.title+" "+t.description+" "+t.category).toLocaleLowerCase().includes(term));
 const featuredVisible=!term||(en?"free comprehensive website audit seo ssl dns analytics":"darmowy kompleksowy audyt strony www seo ssl dns analityka").includes(term);
 const auditHref=en?englishToolPath("audyt-strony"):"/narzedzia/audyt-strony";
 const gamesHref=en?"/en/games":"/minigry";
 return <div className="mt-10">
  {featuredVisible&&<Link href={auditHref} className="group block overflow-hidden rounded-[1.6rem] border border-white/30 bg-[radial-gradient(ellipse_at_90%_10%,#373737_0%,#191919_42%,#0e0e0e_90%)] p-6 transition-all hover:border-white/65 sm:p-9">
   <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
    <div className="max-w-2xl">
     <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.18em] text-white/55"><Sparkles size={15}/>{en?"START HERE • ALL-IN-ONE":"ZACZNIJ TUTAJ • WSZYSTKO W JEDNYM"}</p>
     <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{en?"Comprehensive website audit":"Kompleksowy audyt strony WWW"}</h2>
     <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">{en?"Enter your website address to check SEO, indexability, images, SSL, DNS and analytics. Get a clear report with recommended fixes.":"Wpisz adres witryny. Sprawdzisz SEO, indeksowanie, obrazy, SSL, DNS i analitykę, a następnie otrzymasz czytelny raport z zaleceniami."}</p>
    </div>
    <span className="brand-action inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">{en?"Run free audit":"Przeanalizuj stronę"}<ArrowUpRight size={18}/></span>
   </div>
   <div className="mt-7 flex flex-wrap gap-2">{["SEO","SSL / DNS",en?"Indexing":"Indeksowanie",en?"Analytics":"Analityka"].map(t=><span key={t} className="rounded-full border border-white/15 bg-white/[.04] px-3 py-1.5 text-xs text-white/60">{t}</span>)}</div>
  </Link>}
  <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
   <div><p className="text-[11px] uppercase tracking-[.2em] text-white/45">{en?"TOOLS LIBRARY":"KATALOG NARZĘDZI"}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{en?"Find the right tool":"Wybierz narzędzie"}</h2><p className="mt-2 text-sm text-white/55">{en?"Practical utilities and business tools — no account required.":"Praktyczne narzędzia do codziennych zadań, stron i marketingu. Bez rejestracji."}</p></div>
   <Link href={gamesHref} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 bg-white/[.045] px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/60 hover:bg-white/10"><Gamepad2 size={19}/>{en?"Mini-games":"Minigry"}<ArrowUpRight size={15}/></Link>
  </div>
  <label className="relative mt-6 block max-w-2xl">
   <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50"/>
   <span className="sr-only">{en?"Search tools":"Szukaj narzędzi"}</span>
   <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={en?"Search: SEO, Meta Ads, image converter…":"Szukaj: SEO, Meta Ads, konwerter zdjęć…"} className="min-h-12 w-full rounded-xl border border-white/20 bg-[#101010] py-3 pl-12 pr-4 text-base text-white outline-none placeholder:text-white/40 focus:border-white/60"/>
  </label>
  <div className="mt-9 space-y-11">
   {everydayResults.length>0&&<section>
    <div className="mb-5"><p className="text-[10px] uppercase tracking-[.2em] text-white/45">{en?"QUICK UTILITIES":"NA CO DZIEŃ"}</p><h3 className="mt-2 text-xl font-semibold">{en?"Everyday tools":"Narzędzia codzienne"}</h3></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{everydayResults.map(item=><Link key={item.id} href={everydayHref(item.id,en)} className={card}><div><p className="text-[10px] uppercase tracking-[.16em] text-white/45">{en?"UTILITY":"NARZĘDZIE"}</p><h4 className="mt-4 text-lg font-semibold">{en?item.en:item.pl}</h4><p className="mt-2 text-sm leading-6 text-white/60">{en?item.enDesc:item.plDesc}</p></div><span className="mt-4 inline-flex items-center gap-2 text-sm">{en?"Open":"Otwórz"}<ArrowUpRight size={16}/></span></Link>)}</div>
   </section>}
   <section>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
     <div><p className="text-[10px] uppercase tracking-[.2em] text-white/45">{en?"BUSINESS & DEVELOPMENT":"DLA FIRM I PROGRAMISTÓW"}</p><h3 className="mt-2 text-xl font-semibold">{en?"Business and technical tools":"Narzędzia biznesowe i techniczne"}</h3></div>
     <label className="text-xs text-white/60">{en?"Topic":"Temat"}<select value={sector} onChange={e=>setSector(e.target.value)} className="ml-3 min-h-11 max-w-full rounded-xl border border-white/20 bg-[#111] px-3 text-sm text-white outline-none focus:border-white/60"><option value="all">{en?"All topics":"Wszystkie obszary"}</option>{categories.map(cat=><option key={cat} value={cat}>{cat}</option>)}</select></label>
    </div>
    {businessResults.length?categories.filter(cat=>sector==="all"||cat===sector).map(cat=>{
     const list=businessResults.filter(item=>item.category===cat);
     if(!list.length)return null;
     return <details key={cat+"-"+term+"-"+sector} open={Boolean(term)||sector!=="all"||cat===categories[0]} className="group/section mb-3 rounded-2xl border border-white/15 bg-[#121212] p-4 sm:p-5">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden"><h4 className="text-sm font-semibold text-white/80">{cat}</h4><span className="text-xs text-white/40">{list.length}</span><span className="flex-1"/><ChevronDown size={18} className="text-white/50 transition-transform group-open/section:rotate-180"/></summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map(t=><Link key={t.slug} href={en?englishToolPath(t.slug):"/narzedzia/"+t.slug} className={card}><div><p className="text-[10px] uppercase tracking-[.16em] text-white/45">{cat}</p><h5 className="mt-4 text-lg font-semibold leading-7">{t.title}</h5><p className="mt-2 text-sm leading-6 text-white/60">{t.description}</p></div><span className="mt-4 inline-flex items-center gap-2 text-sm">{en?"Use for free":"Uruchom za darmo"}<ArrowUpRight size={16}/></span></Link>)}</div>
     </details>;
    }):<p className="rounded-xl border border-white/15 p-6 text-sm text-white/60">{en?"No matching tools. Try another term.":"Nie znaleziono narzędzi. Zmień frazę lub temat."}</p>}
   </section>
  </div>
  {!featuredVisible&&<Link href={auditHref} className="mt-9 inline-flex items-center gap-2 text-sm text-white/70 underline underline-offset-4"><Globe2 size={16}/>{en?"Back to the comprehensive website audit":"Przejdź do kompleksowego audytu strony"}<ArrowRight size={15}/></Link>}
 </div>;
}
