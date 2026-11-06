"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { lang } = useLanguage();
  const pl = lang === "pl";
  return <section id="home" className="hero-studio px-5 pb-14 pt-32 md:px-8 lg:pb-20 lg:pt-40">
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 flex items-center justify-between border-b border-white/15 pb-5 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
        <span>Kacper Bernecki / {pl ? "Niezależny twórca" : "Independent developer"}</span>
        <span className="hidden sm:block">Design · Development · Marketing</span>
      </div>
      <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <div>
          <h1 className="hero-headline">{pl ? "Twoja firma." : "Your business."}<br/><span className="text-[#c2f970]">{pl ? "Lepsza strona." : "A better website."}</span></h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-zinc-400">{pl ? "Projektuję i tworzę strony internetowe, CRM-y i aplikacje. Łączę dobry design z technologią i marketingiem, żeby Twoja firma mogła zrobić kolejny krok." : "I design and build websites, CRMs and apps. Bringing design, technology and marketing together to help your business take its next step."}</p>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link href="#projects" className="studio-cta">{pl ? "Zobacz moje projekty" : "Explore my work"}<ArrowDownRight size={21}/></Link>
            <Link href="#contact" className="inline-flex items-center gap-3 py-4 text-sm text-zinc-200 transition hover:text-[#c2f970]">{pl ? "Porozmawiajmy" : "Let’s talk"}<ArrowUpRight size={18}/></Link>
          </div>
          <p className="mt-9 text-xs tracking-wide text-zinc-500">{pl ? "Od pomysłu do wdrożenia. Bezpośrednio ze mną." : "From idea to launch. Working directly with me."}</p>
        </div>
        <div className="portrait-editorial relative mx-auto w-full max-w-[400px] lg:rotate-[2deg]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[4px] bg-[#d6dcd1]">
            <span className="absolute left-5 top-5 z-10 font-mono text-xs text-[#323b30]">KB / 01</span>
            <Image src="/images/profile-2-cutout.png" alt="Kacper Bernecki" width={1122} height={1402} priority sizes="(min-width: 1024px) 32vw, 90vw" className="absolute inset-0 h-full w-full scale-[1.12] object-cover object-top"/>
            <div className="absolute bottom-5 right-5 rounded-full bg-[#c2f970] p-4 text-[#111]" aria-hidden="true"><ArrowUpRight size={27}/></div>
          </div>
          <div className="flex items-center justify-between rounded-b-[4px] bg-[#eceee7] px-5 py-5 text-[#161b15]"><div><p className="font-medium">Kacper Bernecki</p><p className="mt-1 text-xs text-[#596052]">{pl ? "Design, kod i dbałość o szczegóły." : "Design, code and attention to detail."}</p></div><span className="font-mono text-xs">↗</span></div>
        </div>
      </div>
    </div>
  </section>;
}
