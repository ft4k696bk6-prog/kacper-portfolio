"use client";
import { useState } from "react";
import Image from "next/image";
import { Code2, Gamepad2, Workflow, Globe, Film, Megaphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { realizations } from "@/content/realizations";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";

const realizationCovers: Record<string, { image: string; alt: string; href?: string }> = {
 "b-code": {image:"b-code-editorial.jpg",alt:"Ilustracja kodu — autorski projekt B-Code"},
 "reenergy-strona": {image:"reenergy-website-live.jpg",alt:"Zrzut działającej strony Re-energy System"},
 "reenergy-rozwoj-marki": {image:"reenergy-campaign-results.jpg",alt:"Case study Re-energy — budżet reklamowy i opis wyników",href:"/case-studies/re-energy-meta-ads"},
 "jalapeno-marketing": {image:"jalapeno-campaign-results.jpg",alt:"Opis kampanii i wyników marketingowych Jalapeno Kebab"},
 "starcars-filmy-social-media": {image:"starcars-social-case.jpg",alt:"Osobna realizacja StarCars — nagrania, montaż i social media"},
};

function ProjectMark({title,category}:{title:string;category:string}) {
 const logo=/Jalapeno/.test(title)?"/images/brands/jalapeno.jpg":/Re-energy/i.test(title)?"/images/brands/re-energy.png":/StarCars/.test(title)?"/images/brands/starcars.svg":/Gentlemen/.test(title)?"/images/brands/gentlemen.webp":null;
 if(logo)return <span className={"book-brand-logo "+(/Jalapeno/.test(title)?"book-jalapeno":"")}><Image src={logo} alt="" width={180} height={60}/></span>;
 if(/Motomizer/.test(title))return <span className="book-wordmark">MOTOMIZER</span>;
 const Icon=/Berni|Unreal/.test(title)?Gamepad2:/B-Code/.test(title)?Code2:/CRM/.test(title)?Workflow:/film/i.test(title)?Film:category==="Marketing"?Megaphone:Globe;
 return <Icon size={28} strokeWidth={1.4}/>;
}
export function Projects(){
 const {t}=useLanguage();const [active,setActive]=useState("");const [filter,setFilter]=useState("Wszystko");
 const items=[
 ...t.projects.items.map(p=>({title:p.title,description:p.description,image:p.caseStudyUrl==="/case-studies/starcars"?"/images/projects/starcars-live-current.jpg":p.image.src,href:p.caseStudyUrl,category:/CRM|BeatMarket/.test(p.title)?"CRM i aplikacje":/Berni|Unreal|Portfolio/.test(p.title)?"Autorskie i eksperymenty":"Strony",demo:p.demoUrl})),
 ...realizations.map(p=>{
   const cover=realizationCovers[p.slug];
   return {title:p.title,description:p.summary,image:"/images/projects/"+(cover?.image??p.slug+"-chapter.jpg"),imageAlt:cover?.alt??"Zrzut strony z opisem realizacji: "+p.title,href:cover?.href??"/realizacje/"+p.slug,category:p.category,demo:""};
 })
 ].map(p=>({...p,logoOnly:/Motomizer|StarCars|Jalapeno|Re-energy|Gentlemen/i.test(p.title),mark:<ProjectMark title={p.title} category={p.category}/>}));
 const filtered=items.filter(p=>filter==="Wszystko"||p.category===filter);
 return <section id="projects" className="border-y border-white/10 bg-[var(--brand-black)] px-5 py-20 md:px-8"><div className="mx-auto max-w-7xl"><p className="brand-eyebrow text-xs uppercase tracking-widest">Realizacje i współprace</p><h2 className="mt-4 text-4xl md:text-5xl">Od marki do narzędzi.</h2><p className="mt-4 max-w-2xl leading-7 text-white/70">Wybierz okładkę. Strony, aplikacje i działania marketingowe pokazuję osobno.</p>
 <div className="my-8 flex flex-wrap gap-3" aria-label="Kategorie realizacji">{["Wszystko","Strony","CRM i aplikacje","Marketing","Autorskie i eksperymenty"].map(c=><button key={c} type="button" aria-pressed={filter===c} className={(filter===c?"brand-action":"brand-outline")+" rounded-lg px-4 py-2 text-sm"} onClick={()=>{setFilter(c);setActive("");}}>{c}</button>)}</div>
 <InteractiveImageAccordion key={filter} items={filtered} active={active||filtered[0]?.href} onSelect={setActive}/>
 </div></section>;
}
