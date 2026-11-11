"use client";
import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {ArrowRight,ArrowUpRight,ChevronDown,Gamepad2,Search,Sparkles,Wrench} from "lucide-react";
import {ARCADE_GAMES} from "@/lib/arcade-logic";
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
const card="group flex min-h-[194px] flex-col justify-between rounded-2xl border border-white/15 bg-[#121212] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-[#1b1b1b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:p-6";

export function ToolboxHub({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const [main,setMain]=useState<"tools"|"games">("tools");
 const [query,setQuery]=useState("");
 const [sector,setSector]=useState("all");
 useEffect(()=>{
  const value=new URLSearchParams(window.location.search).get("category");
  if(value==="games")setMain("games");
 },[]);
 const tools=en?visibleEnglishToolboxItems:visibleToolboxItems;
 const categories=useMemo(()=>[...new Set(tools.map(t=>t.category))],[tools]);
 const term=query.trim().toLocaleLowerCase(en?"en":"pl");
 const gameResults=ARCADE_GAMES.filter(g=>(en?g.en+" "+g.enDesc:g.pl+" "+g.plDesc).toLocaleLowerCase(en?"en":"pl").includes(term));
 const utilityResults=everyday.filter(x=>(en?x.en+" "+x.enDesc:x.pl+" "+x.plDesc).toLocaleLowerCase(en?"en":"pl").includes(term));
 const businessResults=tools.filter(t=>(sector==="all"||t.category===sector)&&
  (t.title+" "+t.description+" "+t.category).toLocaleLowerCase(en?"en":"pl").includes(term));
 const featuredVisible=!term|| (en?"free comprehensive website audit seo ssl dns analytics":"darmowy kompleksowy audyt strony www seo ssl dns analityka").includes(term);
 const pick=(next:"tools"|"games")=>{
  setMain(next);setQuery("");setSector("all");
  window.history.replaceState(null,"",window.location.pathname+(next==="games"?"?category=games":""));
 };
 return <div className="mt-10">
  <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label={en?"Main categories":"Kategorie główne"}>
   <button type="button" aria-pressed={main==="games"} onClick={()=>pick("games")} className={"group flex min-h-40 items-start gap-4 rounded-2xl border p-5 text-left transition-colors sm:p-7 "+(main==="games"?"border-white/65 bg-[#292929]":"border-white/15 bg-[#121212] hover:border-white/45")}>
    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10"><Gamepad2 size={25}/></span>
    <span className="min-w-0 flex-1"><span className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/50">01 / {en?"PLAY":"ROZRYWKA"}</span><span className="mt-2 block text-xl font-semibold tracking-tight sm:text-2xl">{en?"Games & entertainment":"Gry i rozrywka"}</span><span className="mt-2 block text-sm leading-6 text-white/60">{en?"10 playable mini-games, touch and keyboard friendly.":"10 minigier na telefon i komputer. Bez instalacji."}</span></span>
    <ArrowRight className="mt-2 shrink-0 transition-transform group-hover:translate-x-1" size={19}/>
   </button>
   <button type="button" aria-pressed={main==="tools"} onClick={()=>pick("tools")} className={"group flex min-h-40 items-start gap-4 rounded-2xl border p-5 text-left transition-colors sm:p-7 "+(main==="tools"?"border-white/65 bg-[#292929]":"border-white/15 bg-[#121212] hover:border-white/45")}>
    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10"><Wrench size={25}/></span>
    <span className="min-w-0 flex-1"><span className="text-[10px] font-semibold uppercase tracking-[.18em] text-white/50">02 / {en?"PRODUCTIVITY":"PRAKTYCZNE"}</span><span className="mt-2 block text-xl font-semibold tracking-tight sm:text-2xl">{en?"Tools":"Narzędzia"}</span><span className="mt-2 block text-sm leading-6 text-white/60">{en?"Website audits, marketing calculators and everyday utilities.":"Audyt WWW, kalkulatory i praktyczne narzędzia na co dzień."}</span></span>
    <ArrowRight className="mt-2 shrink-0 transition-transform group-hover:translate-x-1" size={19}/>
   </button>
  </div>
  <div className="mt-9 flex flex-wrap items-end justify-between gap-4">
   <div><p className="text-[10px] uppercase tracking-[.2em] text-white/45">{main==="games"?"01 / ARCADE":"02 / TOOLBOX"}</p><h2 className="mt-2 text-2xl font-medium md:text-3xl">{main==="games"?(en?"Choose a game":"Wybierz grę"):(en?"Choose a tool":"Wybierz narzędzie")}</h2><p className="mt-2 text-sm text-white/55">{main==="games"?(en?"Play instantly — no downloads, no account.":"Uruchom jednym kliknięciem. Bez pobierania i bez konta."):(en?"Organized by purpose — no duplicate audit tiles.":"Posegregowane według zastosowania, bez duplikowania audytów.")}</p></div>
   <span className="rounded-full border border-white/20 px-4 py-2 text-xs text-white/65">{main==="games"?(en?"10 games":"10 gier"):(en?"40 tools":"40 narzędzi")}</span>
  </div>
  <label className="relative mt-6 block max-w-2xl">
   <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50"/>
   <span className="sr-only">{en?"Search":"Szukaj"}</span>
   <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={main==="games"?(en?"Search: Snake, Memory, 2048...":"Szukaj: Snake, Memory, 2048..."):(en?"Search: SEO, Meta Ads, converter...":"Szukaj: SEO, Meta Ads, konwerter...")} className="min-h-12 w-full rounded-xl border border-white/20 bg-[#101010] py-3 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-white/60"/>
  </label>
  {main==="games"&&<section aria-label={en?"Arcade games":"Gry i rozrywka"} className="mt-6">
   {gameResults.length?<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{gameResults.map((g,i)=><Link key={g.id} href={everydayHref(g.id,en)} className={card}>
    <div><div className="flex items-center justify-between"><Gamepad2 size={22} strokeWidth={1.5} className="text-white/80"/><span className="text-xs tabular-nums text-white/35">{String(i+1).padStart(2,"0")} / 10</span></div><h3 className="mt-5 text-xl font-semibold">{en?g.en:g.pl}</h3><p className="mt-3 text-sm leading-6 text-white/60">{en?g.enDesc:g.plDesc}</p></div>
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">{en?"Play now":"Zagraj"}<ArrowUpRight size={16}/></span>
   </Link>)}</div>:<p className="rounded-xl border border-white/15 p-7 text-sm text-white/65">{en?"No games matched. Try another name.":"Brak gier dla tej frazy. Spróbuj innej."}</p>}
  </section>}
  {main==="tools"&&<div className="mt-6 space-y-12">
   {featuredVisible&&<Link href={en?englishToolPath("audyt-strony"):"/narzedzia/audyt-strony"} className="group flex flex-col justify-between gap-5 rounded-2xl border border-white/35 bg-gradient-to-br from-[#303030] via-[#202020] to-[#101010] p-6 transition-colors hover:border-white/75 sm:flex-row sm:items-center sm:p-8">
    <div className="max-w-2xl"><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-white/65"><Sparkles size={14}/>{en?"FEATURED / ALL IN ONE":"POLECANE / WSZYSTKO W JEDNYM"}</p><h3 className="mt-3 text-2xl font-semibold tracking-tight">{en?"Comprehensive website audit":"Kompleksowy audyt strony WWW"}</h3><p className="mt-3 text-sm leading-7 text-white/65">{en?"SEO, SSL, DNS, images and analytics in one report. Check a sample of up to seven subpages.":"SEO, SSL, DNS, obrazy i analityka w jednym raporcie. Sprawdź próbkę do 7 podstron."}</p></div>
    <span className="brand-action inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold">{en?"Start audit":"Uruchom audyt"}<ArrowUpRight size={17}/></span>
   </Link>}
   {utilityResults.length>0&&<section>
    <div className="mb-5"><p className="text-[10px] uppercase tracking-[.2em] text-white/45">{en?"EVERYDAY":"NA CO DZIEŃ"}</p><h3 className="mt-2 text-xl font-semibold">{en?"Everyday utilities":"Narzędzia codzienne"}</h3><p className="mt-2 text-sm text-white/60">{en?"Fast helpers for images, text, passwords and more.":"Szybkie funkcje do zdjęć, tekstu, haseł i innych codziennych spraw."}</p></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{utilityResults.map(item=><Link key={item.id} href={everydayHref(item.id,en)} className={card}><div><p className="text-[10px] uppercase tracking-[.16em] text-white/45">{en?"EVERYDAY TOOL":"NARZĘDZIE CODZIENNE"}</p><h4 className="mt-5 text-xl font-medium">{en?item.en:item.pl}</h4><p className="mt-3 text-sm leading-6 text-white/60">{en?item.enDesc:item.plDesc}</p></div><span className="mt-5 inline-flex items-center gap-2 text-sm">{en?"Open tool":"Otwórz narzędzie"}<ArrowUpRight size={16}/></span></Link>)}</div>
   </section>}
   <section>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
     <div><p className="text-[10px] uppercase tracking-[.2em] text-white/45">{en?"FOR BUSINESS & DEVELOPMENT":"DLA FIRM I PROGRAMISTÓW"}</p><h3 className="mt-2 text-xl font-semibold">{en?"Business and technical tools":"Narzędzia biznesowe i techniczne"}</h3></div>
     <label className="text-xs text-white/60">{en?"Topic":"Temat"}<select value={sector} onChange={e=>setSector(e.target.value)} className="ml-3 min-h-11 max-w-full rounded-xl border border-white/20 bg-[#111] px-3 text-sm text-white outline-none focus:border-white/60"><option value="all">{en?"All topics":"Wszystkie obszary"}</option>{categories.map(cat=><option key={cat} value={cat}>{cat}</option>)}</select></label>
    </div>
    {businessResults.length?categories.filter(cat=>sector==="all"||cat===sector).map(cat=>{
     const list=businessResults.filter(item=>item.category===cat);
     if(!list.length)return null;
     return <details key={cat+"-"+term+"-"+sector} open={Boolean(term)||sector!=="all"||cat===categories[0]} className="group/section mb-3 rounded-2xl border border-white/15 bg-[#121212] p-4 sm:p-5">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-3 [&::-webkit-details-marker]:hidden"><h4 className="text-sm font-semibold text-white/80">{cat}</h4><span className="text-xs text-white/40">{list.length}</span><span className="flex-1"/><ChevronDown size={18} className="text-white/50 transition-transform group-open/section:rotate-180"/></summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map(t=><Link key={t.slug} href={en?englishToolPath(t.slug):"/narzedzia/"+t.slug} className={card}><div><p className="text-[10px] uppercase tracking-[.16em] text-white/45">{cat}</p><h5 className="mt-5 text-lg font-semibold leading-7">{t.title}</h5><p className="mt-3 text-sm leading-6 text-white/60">{t.description}</p></div><span className="mt-5 inline-flex items-center gap-2 text-sm">{en?"Use for free":"Uruchom za darmo"}<ArrowUpRight size={16}/></span></Link>)}</div>
     </details>;
    }):<p className="rounded-xl border border-white/15 p-6 text-sm text-white/60">{en?"No matching tools. Clear the search or change the topic.":"Nie znaleziono narzędzi. Zmień frazę lub temat."}</p>}
   </section>
  </div>}
  <p className="mt-10 flex items-center gap-2 border-t border-white/10 pt-6 text-xs text-white/50">{en?"Games and tools open in your browser without an account.":"Gry i narzędzia działają w przeglądarce, bez zakładania konta."}<ArrowRight size={13}/></p>
 </div>;
}
