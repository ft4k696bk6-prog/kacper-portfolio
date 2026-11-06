"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Projects() {
  const {lang,t}=useLanguage();
  const [active,setActive]=useState(0);
  const items=[...t.projects.items.slice(1,4),t.projects.items[0]];
  return <section id="projects" className="border-y border-white/10 bg-[var(--brand-black)] px-5 py-16 md:px-8 md:py-20">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="brand-eyebrow text-xs uppercase tracking-[.24em]">{t.projects.title}</p>
          <h2 className="mt-4 text-4xl tracking-tight md:text-5xl">{t.projects.subtitle}</h2>
          <p className="mt-3 text-sm text-white/60">{lang==="pl" ? "Wybierz projekt. Kliknij, aby poznać szczegóły." : "Select a project to explore it."}</p>
        </div>
        <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-white hover:text-[var(--brand-gold)]">{lang==="pl"?"Wszystkie realizacje":"All case studies"}<ArrowUpRight size={16}/></Link>
      </div>
      <div className="project-accordion mt-9" aria-label={lang==="pl"?"Wybór realizacji":"Project showcase"}>
        {items.map((project,index)=><article key={project.title} className="project-book" data-active={index===active}>
          <Image src={project.image.src} alt={project.image.alt} width={1100} height={800} sizes="(min-width: 768px) 55vw, 80vw" className="project-book-image" />
          <button type="button" className="project-book-toggle" aria-expanded={index===active} aria-label={lang==="pl"? "Rozwiń: "+project.title : "Expand: "+project.title} onClick={()=>setActive(index)} onMouseEnter={()=>setActive(index)} />
          <span className="project-book-spine" aria-hidden="true">{project.title}</span>
          <div className="project-book-content" aria-hidden={index!==active}>
            <h3 className="project-book-logo">{project.title === "StarCars" ? <Image src="/images/brands/starcars.svg" alt="StarCars" width={160} height={48} className="h-10 w-auto max-w-[170px] object-contain" /> : project.title}</h3>
            <p>{project.description}</p>
            <div className="project-book-links">
              <Link href={project.caseStudyUrl} tabIndex={index===active?0:-1}>{lang==="pl"?"Zobacz projekt":"Case study"}<ArrowUpRight size={15}/></Link>
              {project.demoUrl&&<a href={project.demoUrl} target="_blank" rel="noopener noreferrer" tabIndex={index===active?0:-1}>Live<ExternalLink size={14}/></a>}
            </div>
          </div>
        </article>)}
      </div>
      <details className="mt-6 rounded-xl border border-white/10 bg-black p-5">
        <summary className="text-sm text-white">{lang==="pl"?"Wszystkie projekty, szczegóły techniczne i eksperymenty":"All projects, technical details and experiments"}</summary>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {t.projects.items.map((project)=><Link href={project.caseStudyUrl} key={project.title} className="group flex items-center gap-3 rounded-md border border-white/10 p-3 transition-colors hover:border-[var(--brand-gold)]">
            <Image src={project.image.src} alt="" width={90} height={70} className="h-14 w-20 rounded object-cover" />
            <div><h3 className="text-sm text-white">{project.title}</h3><p className="mt-1 text-xs text-white/60">{project.technologies.slice(0,3).join(" · ")}</p></div>
            <ArrowUpRight className="ml-auto shrink-0 text-[var(--brand-gold)]" size={15}/>
          </Link>)}
        </div>
      </details>
    </div>
  </section>;
}
