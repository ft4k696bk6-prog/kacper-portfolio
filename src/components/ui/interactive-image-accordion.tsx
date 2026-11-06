"use client";
import { useRef } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";

export type AccordionProject = {
 title:string; description:string; image:string; imageAlt?:string;
 href:string; category:string; demo?:string; mark:ReactNode;
};

/** Adapted from the supplied 21st.dev interaction, with touch and keyboard support. */
export function InteractiveImageAccordion({items,active,onSelect}:{items:AccordionProject[];active:string;onSelect:(href:string)=>void}) {
 const ref=useRef<HTMLDivElement>(null);
 const select=(href:string,button:HTMLButtonElement)=>{
  onSelect(href);
  if(matchMedia("(pointer:coarse)").matches)requestAnimationFrame(()=>button.closest("article")?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth",block:"nearest",inline:"center"}));
 };
 return <div ref={ref} className="project-accordion image-books mt-4">{items.map(p=>{
 const selected=active===p.href;
 return <article key={p.href} className="project-book" data-active={selected}>
 <Image src={p.image} alt="" aria-hidden="true" width={1440} height={1000} sizes="(min-width:768px) 700px, 85vw" className="project-book-atmosphere"/>
 <Image src={p.image} alt={p.imageAlt||p.title} width={1440} height={1000} sizes="(min-width:768px) 700px, 85vw" className="project-book-image"/>
 <button type="button" className="project-book-toggle" aria-label={"Rozwiń: "+p.title} aria-expanded={selected} onClick={e=>select(p.href,e.currentTarget)} onMouseEnter={e=>{if(matchMedia("(hover:hover)").matches)select(p.href,e.currentTarget);}} onFocus={()=>onSelect(p.href)}/>
 <span className="project-brand-spine" aria-hidden="true">{p.mark}</span>
 <div className="project-book-content" aria-hidden={!selected}>
 <div className="project-active-brand" aria-hidden="true">{p.mark}</div>
 <p className="text-xs text-[var(--brand-gold)]">{p.category}</p><h3 className="project-book-logo">{p.title}</h3><p>{p.description}</p>
 <div className="project-book-links"><Link href={p.href} tabIndex={selected?0:-1}>Zakres i rezultaty <ArrowUpRight size={14}/></Link>{p.demo&&<a href={p.demo} target="_blank" rel="noopener noreferrer" tabIndex={selected?0:-1}>Live <ExternalLink size={13}/></a>}</div>
 </div></article>;
 })}</div>;
}
