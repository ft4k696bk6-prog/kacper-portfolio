"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, LayoutGrid, Globe, Megaphone, Workflow, Bot, Code2 } from "lucide-react";
import { toolboxCategories, toolboxItems } from "@/lib/toolbox";

const icons: Record<string,typeof LayoutGrid>={
 "Wszystkie":LayoutGrid,"WWW i SEO":Globe,"Reklamy i marketing":Megaphone,
 "CRM i sprzedaż":Workflow,"AI i wyszukiwarki":Bot,"Dla programistów":Code2
};
export function FreeToolsDirectory(){
 const [q,setQ]=useState("");
 const [cat,setCat]=useState("Wszystkie");
 const listed=useMemo(()=>toolboxItems.filter(t=>
  (cat==="Wszystkie"||t.category===cat)&&
  (t.title+" "+t.description+" "+t.category).toLocaleLowerCase("pl").includes(q.toLocaleLowerCase("pl").trim())
 ),[q,cat]);
 return <div className="mt-10">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
   <label className="relative block w-full max-w-xl">
    <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50"/>
    <span className="sr-only">Wyszukaj darmowe narzędzie</span>
    <input type="search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Szukaj: audyt SEO, Meta Ads, ROAS..." className="w-full rounded-xl border border-white/20 bg-[#121212] py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/60"/>
   </label>
   <span className="text-sm text-white/50">{listed.length} z {toolboxItems.length} narzędzi</span>
  </div>
  <div className="mt-6 flex flex-wrap gap-2" aria-label="Kategorie narzędzi">
   {toolboxCategories.map(category=>{
    const Icon=icons[category];
    return <button type="button" key={category} aria-pressed={cat===category} onClick={()=>setCat(category)}
      className={"inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors "+(cat===category?"border-white/70 bg-[#dedede] text-black":"border-white/20 bg-[#101010] text-white/70 hover:border-white/50")}>
      <Icon size={15}/>{category}
    </button>;
   })}
  </div>
  {listed.length===0?<p className="mt-12 rounded-xl border border-white/15 p-7 text-white/70">Nie znaleziono narzędzia. Spróbuj innej frazy lub kategorii.</p>:
  <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
   {listed.map((tool,i)=><Link key={tool.slug} href={"/narzedzia/"+tool.slug} className="group relative flex min-h-52 flex-col justify-between rounded-2xl border border-white/15 bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-[#191919]">
    <div>
     <div className="flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[.16em] text-white/45">{tool.category}</span><span className="text-[11px] font-mono text-white/35">{String(i+1).padStart(2,"0")}</span></div>
     <h2 className="mt-5 text-xl font-medium leading-snug tracking-tight text-white">{tool.title}</h2>
     <p className="mt-3 text-sm leading-6 text-white/60">{tool.description}</p>
    </div>
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white">Otwórz narzędzie <ArrowUpRight size={16}/></span>
   </Link>)}
  </div>}
 </div>;
}