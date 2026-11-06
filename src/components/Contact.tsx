"use client";
import Image from "next/image";
import { Github, Linkedin, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ContactReveal } from "@/components/ContactReveal";

export function Contact() {
  const {lang,t}=useLanguage();
  return <section id="contact" className="relative overflow-hidden border-t border-white/10 bg-[var(--brand-black)] px-5 pb-9 pt-14 md:px-8 md:pt-20">
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto max-w-3xl text-center">
        <p className="brand-eyebrow text-xs uppercase tracking-[.25em]">{t.nav.contact}</p>
        <h2 className="mt-4 text-4xl leading-tight md:text-5xl">{t.contact.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70">{t.contact.description}</p>
      </div>
      <div className="mx-auto mt-9 max-w-3xl">
        <BookingCalendar copy={t.contact.booking} locale={lang==="pl"?"pl-PL":"en-US"}/>
      </div>
      <div className="contact-hands">
        <Image src="/images/portfolio-choice-portrait.png" alt={t.hero.imageAlt} width={886} height={1002} sizes="(min-width:768px) 650px, 100vw" />
        <div className="contact-hand-actions"><ContactReveal copy={t.contact.reveal}/></div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-white/65">
        <span className="inline-flex items-center gap-1"><MapPin size={14}/>{t.contact.location}</span>
        <a className="inline-flex items-center gap-1 hover:text-white" href={t.contact.github} target="_blank" rel="noopener noreferrer"><Github size={14}/>{t.contact.githubCta}</a>
        <a className="inline-flex items-center gap-1 hover:text-white" href={t.contact.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={14}/>{t.contact.linkedinCta}</a>
      </div>
      <p className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">{t.contact.copyright}</p>
    </div>
  </section>;
}
