"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, Globe, Megaphone, Bot, Code2, Workflow, LayoutGrid } from "lucide-react";
import { englishToolPath } from "@/lib/toolbox-en";
import { visibleEnglishToolboxItems } from "@/lib/toolbox-visibility";

const filters=["All","Website & SEO","Advertising & marketing","CRM & sales","AI & search","Developer tools"];
const icons:Record<string,typeof Globe>={"All":LayoutGrid,"Website & SEO":Globe,"Advertising & marketing":Megaphone,"CRM & sales":Workflow,"AI & search":Bot,"Developer tools":Code2};
export function EnglishToolsDirectory() {
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("All");
 const found=useMemo(()=>visibleEnglishToolboxItems.filter(t=>(category==="All"||t.category===category)&&
  (t.title+" "+t.description+" "+t.category).toLowerCase().includes(query.toLowerCase().trim())),[query,category]);
 return <div className="mt-10">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
   <label className="relative block w-full max-w-xl">
    <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18}/>
    <span className="sr-only">Search free tools</span>
    <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search: SEO audit, Meta Ads, ROAS..." className="w-full rounded-xl border border-white/20 bg-[#121212] py-4 pl-12 pr-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/60"/>
   </label>
   <span className="text-sm text-white/50">Showing {found.length} of {visibleEnglishToolboxItems.length} additional tools</span>
  </div>
  <Link href={englishToolPath("audyt-strony")} className="group mt-7 flex flex-col gap-5 rounded-2xl border border-white/30 bg-gradient-to-br from-[#252525] to-[#101010] p-6 transition-colors hover:border-white/60 md:flex-row md:items-center md:justify-between md:p-8">
   <div className="max-w-2xl">
    <p className="text-[10px] uppercase tracking-[.2em] text-white/55">Featured · all-in-one tool</p>
    <h2 className="mt-3 text-2xl font-medium leading-tight tracking-tight md:text-3xl">Free comprehensive website audit</h2>
    <p className="mt-3 text-sm leading-7 text-white/65">Enter one URL. Check on-page SEO, indexability, images, SSL, DNS and marketing tags on a sample of up to seven pages.</p>
   </div>
   <span className="brand-action inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium">Audit my website <ArrowUpRight size={17}/></span>
  </Link>
  <div className="mt-6 flex flex-wrap gap-2" aria-label="Tool categories">
   {filters.map(c=>{const Icon=icons[c];return <button key={c} type="button" aria-pressed={category===c} onClick={()=>setCategory(c)} className={"inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors "+(category===c?"border-white/70 bg-[#dedede] text-black":"border-white/20 bg-[#101010] text-white/70 hover:border-white/50")}><Icon size={15}/>{c}</button>;})}
  </div>
  {found.length===0?<p className="mt-8 rounded-xl border border-white/15 p-7 text-white/60">No tools matched that search. Try another term.</p>:<div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
   {found.map((tool,i)=><Link href={englishToolPath(tool.slug)} key={tool.slug} className="group relative flex min-h-52 flex-col justify-between rounded-2xl border border-white/15 bg-[#111111] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-[#191919]">
    <div><div className="flex items-center justify-between gap-3"><span className="text-[10px] uppercase tracking-[.16em] text-white/45">{tool.category}</span><span className="text-[11px] font-mono text-white/35">{String(i+1).padStart(2,"0")}</span></div>
     <h2 className="mt-5 text-xl font-medium leading-snug tracking-tight text-white">{tool.title}</h2>
     <p className="mt-3 text-sm leading-6 text-white/60">{tool.description}</p>
    </div><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/80 group-hover:text-white">Use for free <ArrowUpRight size={16}/></span>
   </Link>)}
  </div>}
 </div>;
}