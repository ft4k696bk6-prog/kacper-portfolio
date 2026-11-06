"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { lang } = useLanguage();
  const pl = lang === "pl";
  return <section id="home" className="hero-studio px-5 pb-14 pt-32 md:px-8 lg:pb-20 lg:pt-40">
    <div className="relative mx-auto max-w-7xl">
      <div className="mb-10 flex items-center justify-between border-b border-white/15 pb-5 text-[11px] uppercase tracking-[0.18em] text-white/70">
        <span>Kacper Bernecki / {pl ? "Niezależny twórca" : "Independent developer"}</span>
        <span className="hidden sm:block">Design · Development · Marketing</span>
      </div>
      <div className="hero-layout grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <div className="hero-copy">
          <h1 className="hero-headline">{pl ? "Twoja firma." : "Your business."}<br/><span className="hero-headline-accent">{pl ? "Lepsza strona." : "A better website."}</span></h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/70 md:mt-8 md:text-lg md:leading-8">{pl ? "Projektuję i tworzę strony internetowe, CRM-y i aplikacje. Łączę dobry design z technologią i marketingiem, żeby Twoja firma mogła zrobić kolejny krok." : "I design and build websites, CRMs and apps. Bringing design, technology and marketing together to help your business take its next step."}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 md:mt-9 md:gap-5">
            <Link href="#projects" className="glass-action studio-cta">{pl ? "Zobacz moje projekty" : "Explore my work"}<ArrowDownRight size={21}/></Link>
            <Link href="#contact" className="inline-flex items-center gap-3 py-4 text-sm text-white transition hover:text-white">{pl ? "Porozmawiajmy" : "Let’s talk"}<ArrowUpRight size={18}/></Link>
          </div>
          <p className="mt-6 text-xs tracking-wide text-white/70 md:mt-9">{pl ? "Od pomysłu do wdrożenia. Bezpośrednio ze mną." : "From idea to launch. Working directly with me."}</p>
        </div>
        <div className="hero-visual relative mx-auto w-full max-w-[420px]">
          <div className="hero-photo-frame relative aspect-[4/5]">
            <Image src="/images/profile-3-cutout.png" alt="Kacper Bernecki" width={1024} height={1280} priority sizes="(min-width: 1024px) 32vw, 90vw" className="hero-portrait h-full w-full object-contain object-bottom"/>
          </div>
          <div className="hero-mobile-editorial" aria-hidden="true"><span>DESIGN.</span><span>CODE.</span><span className="hero-editorial-accent">IMPACT.</span></div>
          <div className="hero-identity flex items-center justify-between gap-4 border-t border-white/15 pt-5"><div><p className="text-sm font-medium">Kacper Bernecki</p><p className="mt-1 text-xs text-white/70">{pl ? "Design, kod i dbałość o szczegóły." : "Design, code and attention to detail."}</p></div><ArrowUpRight size={20} className="text-white/70" aria-hidden="true"/></div>
        </div>
      </div>
    </div>
  </section>;
}
