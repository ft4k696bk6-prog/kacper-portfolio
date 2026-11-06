"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { realizations } from "@/content/realizations";

export function Projects() {
 const {t}=useLanguage(); const [active,setActive]=useState(""); const [filter,setFilter]=useState("Wszystko");
 const items = [
 ...t.projects.items.map(p=>({title:p.title,description:p.description,image:p.image.src,href:p.caseStudyUrl,category:/CRM|BeatMarket/.test(p.title)?"CRM i aplikacje":/Berni|Unreal|Portfolio/.test(p.title)?"Autorskie i eksperymenty":"Strony",demo:p.demoUrl})),
 ...realizations.map(p=>({title:p.title,description:p.summary,image:p.logo,href:"/realizacje/"+p.slug,category:p.category,demo:""}))
 ];
 const filtered=items.filter(p=>filter==="Wszystko"||p.category===filter);
 return <section id="projects" className="border-y border-white/10 bg-[var(--brand-black)] px-5 py-20 md:px-8">
 <div className="mx-auto max-w-7xl"><p className="brand-eyebrow text-xs uppercase tracking-widest">Realizacje i współprace</p><h2 className="mt-4 text-4xl md:text-5xl">Od marki do narzędzi.</h2><p className="mt-4 max-w-2xl leading-7 text-white/70">Strony, własne aplikacje i marketing. Osobno pokazuję różne zakresy pracy dla tej samej firmy.</p>
 <div className="my-8 flex flex-wrap gap-3" aria-label="Kategorie realizacji">{["Wszystko","Strony","CRM i aplikacje","Marketing","Autorskie i eksperymenty"].map(c=><button type="button" key={c} aria-pressed={filter===c} className={(filter===c?"brand-action":"brand-outline")+" rounded-lg px-4 py-2 text-sm"} onClick={()=>{setFilter(c);setActive("");}}>{c}</button>)}</div>
 {Array.from({length:Math.ceil(filtered.length/5)},(_,row)=><div className="project-accordion project-shelf mt-4" key={filter+row}>{filtered.slice(row*5,row*5+5).map((p,i)=>{const selected=active===p.href||(!active&&row===0&&i===0);return <article key={p.href} className="project-book" data-active={selected}>
 {p.image&&<Image src={p.image} alt={p.title} width={1200} height={750} sizes="(min-width:768px) 600px, 90vw" className="project-book-image"/>}
 <button type="button" className="project-book-toggle" aria-label={"Rozwiń: "+p.title} aria-expanded={selected} onClick={()=>setActive(p.href)} onMouseEnter={()=>{if(matchMedia("(hover:hover)").matches)setActive(p.href);}}/>
 <span className="project-book-spine" aria-hidden="true">{p.title}</span>
 <div className="project-book-content" aria-hidden={!selected}><p className="text-xs text-[var(--brand-gold)]">{p.category}</p><h3 className="project-book-logo">{p.title}</h3><p>{p.description}</p><div className="project-book-links"><Link href={p.href} tabIndex={selected?0:-1}>Zakres i rezultaty ↗</Link>{p.demo&&<a href={p.demo} tabIndex={selected?0:-1} target="_blank" rel="noopener noreferrer">Live ↗</a>}</div></div>
 </article>})}</div>)}
 </div></section>;
}
