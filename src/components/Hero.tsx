"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { lang } = useLanguage();
  const pl = lang === "pl";
  return (
    <section id="home" className="hero-studio">
      <div className="hero-shell mx-auto max-w-7xl">
        <p className="hero-kicker">KACPER BERNECKI <span aria-hidden="true">/</span> {pl ? "NIEZALEŻNY TWÓRCA" : "INDEPENDENT CREATOR"}</p>
        <div className="hero-layout">
          <div className="hero-copy">
            <h1 className="hero-headline">{pl ? "Twoja firma." : "Your business."}<br/><span>{pl ? "Lepsza strona." : "A better website."}</span></h1>
            <p className="hero-lead">{pl ? "Projektuję i tworzę rozwiązania, które pracują dla Twojej firmy." : "I design and build digital tools that work for your business."}</p>
            <div className="hero-services" aria-label={pl ? "Zakres usług" : "Services"}>
              <span>{pl ? "Strony internetowe" : "Websites"}</span>
              <span>{pl ? "CRM i aplikacje" : "CRM & apps"}</span>
              <span>{pl ? "Marketing" : "Marketing"}</span>
            </div>
            <div className="hero-actions">
              <Link href="#projects" className="glass-action studio-cta">{pl ? "Zobacz moje projekty" : "Explore my work"} <ArrowDownRight size={19}/></Link>
              <Link href="#contact" className="hero-text-link">{pl ? "Porozmawiajmy" : "Let's talk"} <ArrowUpRight size={18}/></Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-photo-frame">
              <Image src="/images/profile-3-cutout.png" alt="Kacper Bernecki" width={1024} height={1280} priority sizes="(min-width: 1024px) 40vw, 78vw" className="hero-portrait" />
            </div>
            <span className="hero-signature" aria-hidden="true">KACPER BERNECKI</span>
          </div>
        </div>
      </div>
      <div className="hero-fade" aria-hidden="true" />
    </section>
  );
}
