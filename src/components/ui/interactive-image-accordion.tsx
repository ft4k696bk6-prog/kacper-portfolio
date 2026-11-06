"use client";
import { useRef } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Plus } from "lucide-react";

export type AccordionProject = {
 title:string; description:string; image:string; imageAlt?:string;
 href:string; category:string; demo?:string; mark:ReactNode; logoOnly?:boolean;
};

/** Adapted from the supplied 21st.dev interaction, with touch and keyboard support. */
export function InteractiveImageAccordion({items,active,onSelect}:{items:AccordionProject[];active:string;onSelect:(href:string)=>void}) {
 const ref=useRef<HTMLDivElement>(null);
 const drag=useRef<{x:number;scroll:number}|null>(null);
 const dragged=useRef(false);
 const select=(href:string,button:HTMLButtonElement)=>{
  onSelect(href);
  if(matchMedia("(pointer:coarse)").matches){const article=button.closest("article");setTimeout(()=>article?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"instant":"smooth",block:"nearest",inline:"center"}),400);}
 };
 return <><div className="book-controls"><button type="button" aria-label="Poprzednie projekty" onClick={()=>ref.current?.scrollBy({left:-400,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}><ArrowLeft size={18}/></button><button type="button" aria-label="Kolejne projekty" onClick={()=>ref.current?.scrollBy({left:400,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}><ArrowRight size={18}/></button></div><div ref={ref} className="project-accordion image-books mt-4" onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button===0){drag.current={x:e.clientX,scroll:e.currentTarget.scrollLeft};dragged.current=false;}}} onPointerMove={e=>{if(!drag.current)return;if(Math.abs(e.clientX-drag.current.x)>5){dragged.current=true;e.currentTarget.setPointerCapture(e.pointerId);}if(dragged.current){e.preventDefault();e.currentTarget.scrollLeft=drag.current.scroll-(e.clientX-drag.current.x);}}} onPointerUp={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}} onPointerLeave={e=>{if(!e.currentTarget.hasPointerCapture(e.pointerId))drag.current=null;}} onClickCapture={e=>{if(dragged.current){e.preventDefault();e.stopPropagation();dragged.current=false;}}}>{items.map(p=>{
 const selected=active===p.href;
 return <article key={p.href} className="project-book" data-active={selected}>
 <Image src={p.image} alt={p.imageAlt||p.title} draggable={false} width={1440} height={1000} sizes="(min-width:768px) 700px, 85vw" className="project-book-image"/>
 <button type="button" className="project-book-toggle" aria-label={"Rozwiń: "+p.title} aria-expanded={selected} onClick={e=>select(p.href,e.currentTarget)} onMouseEnter={e=>{if(!drag.current&&matchMedia("(hover:hover)").matches)select(p.href,e.currentTarget);}} onFocus={()=>{if(!drag.current)onSelect(p.href);}}><span className="book-expand-symbol" aria-hidden="true"><Plus size={20}/></span></button>
 <div className="book-identity" aria-hidden="true"><span className="book-identity-mark">{p.mark}</span><span className={"book-identity-title"+(p.logoOnly?" brand-only":"")}>{p.title}</span></div>
 <div className="project-book-content" aria-hidden={!selected}>
 <p className="text-xs text-[var(--brand-gold)]">{p.category}</p><h3 className="sr-only">{p.title}</h3><p>{p.description}</p>
 <div className="project-book-links"><Link href={p.href} tabIndex={selected?0:-1}>Zakres i rezultaty <ArrowUpRight size={14}/></Link>{p.demo&&<a href={p.demo} target="_blank" rel="noopener noreferrer" tabIndex={selected?0:-1}>Live <ExternalLink size={13}/></a>}</div>
 </div></article>;
 })}</div></>;
}
