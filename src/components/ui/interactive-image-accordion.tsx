"use client";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Plus } from "lucide-react";

export type AccordionProject = {
 title:string; description:string; image:string; imageAlt?:string;
 href:string; category:string; demo?:string; mark:ReactNode; logoOnly?:boolean;
 editorial?: { heading:string; detail:string };
};

/** Adapted from the supplied 21st.dev interaction, with touch and keyboard support. */
export function InteractiveImageAccordion({items,active,onSelect,locale="pl"}:{items:AccordionProject[];active:string;onSelect:(href:string)=>void;locale?:"pl"|"en"}) {
 const ref=useRef<HTMLDivElement>(null);
 const drag=useRef<{x:number;scroll:number}|null>(null);
 const dragged=useRef(false);
 const revealTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 useEffect(()=>()=>clearTimeout(revealTimer.current),[]);
 const select=(href:string,button:HTMLButtonElement,reveal=true)=>{
  onSelect(href);
  clearTimeout(revealTimer.current);
  if(reveal){
   const article=button.closest("article");
   const reduced=matchMedia("(prefers-reduced-motion:reduce)").matches;
   // Reveal after expansion; scrolling to the collapsed width cuts off the cover.
   revealTimer.current=setTimeout(()=>article?.scrollIntoView({behavior:reduced?"instant":"smooth",block:"nearest",inline:"center"}),reduced?0:600);
  }
 };
 return <><div className="book-controls"><p className="book-browse-hint">{locale==="pl"?"Przesuń i wybierz projekt":"Swipe to explore projects"}</p><button type="button" aria-label={locale==="pl"?"Poprzednie projekty":"Previous projects"} onClick={()=>ref.current?.scrollBy({left:-400,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}><ArrowLeft size={18}/></button><button type="button" aria-label={locale==="pl"?"Kolejne projekty":"Next projects"} onClick={()=>ref.current?.scrollBy({left:400,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}><ArrowRight size={18}/></button></div><div ref={ref} className="project-accordion image-books mt-4" onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button===0){drag.current={x:e.clientX,scroll:e.currentTarget.scrollLeft};dragged.current=false;}}} onPointerMove={e=>{if(!drag.current)return;if(Math.abs(e.clientX-drag.current.x)>5){dragged.current=true;e.currentTarget.setPointerCapture(e.pointerId);}if(dragged.current){e.preventDefault();e.currentTarget.scrollLeft=drag.current.scroll-(e.clientX-drag.current.x);}}} onPointerUp={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}} onPointerLeave={e=>{if(!e.currentTarget.hasPointerCapture(e.pointerId))drag.current=null;}} onClickCapture={e=>{if(dragged.current){e.preventDefault();e.stopPropagation();dragged.current=false;}}}>{items.map(p=>{
 const selected=active===p.href;
 return <article key={p.href} className="project-book" data-active={selected}>
 <div className="project-book-preview">{p.editorial ? <div className="editorial-cover"><span>{p.category}</span><strong>{p.editorial.heading}</strong><p>{p.editorial.detail}</p></div> : <Image src={p.image} alt={p.imageAlt||p.title} draggable={false} width={1440} height={1000} sizes="(min-width:768px) 580px, 85vw" className="project-book-image"/>}</div>
 <button type="button" className="project-book-toggle" aria-label={(locale==="pl"?"Rozwiń: ":"Expand: ")+p.title} aria-expanded={selected} onClick={e=>select(p.href,e.currentTarget)} onMouseEnter={e=>{if(!drag.current&&matchMedia("(hover:hover)").matches)select(p.href,e.currentTarget,false);}} onFocus={e=>{if(!drag.current)select(p.href,e.currentTarget);}}><span className="book-expand-symbol" aria-hidden="true"><Plus size={20}/></span></button>
 <div className="book-identity" aria-hidden="true"><span className="book-identity-mark">{p.mark}</span><span className={"book-identity-title"+(p.logoOnly?" brand-only":"")}>{p.title}</span></div>
 <div className="project-book-content" aria-hidden={!selected}>
 <p className="book-category">{p.category}</p><h3 className="book-project-title">{p.title}</h3><p>{p.description}</p>
 <div className="project-book-links"><Link href={p.href} tabIndex={selected?0:-1}>{locale==="pl"?"Zobacz realizację":"View project"} <ArrowUpRight size={14}/></Link>{p.href==="/case-studies/b-crm"?<Link href="/#contact" tabIndex={selected?0:-1}>{locale==="pl"?"Umów demo":"Book a demo"} <ArrowUpRight size={13}/></Link>:p.demo&&<a href={p.demo} target="_blank" rel="noopener noreferrer" tabIndex={selected?0:-1}>Live <ExternalLink size={13}/></a>}</div>
 </div></article>;
 })}</div></>;
}
