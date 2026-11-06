"use client";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { lang } = useLanguage();
  return <section id="home" className="hero-depth">
    <div className="hero-depth-stage">
      <h1 className="hero-depth-title"><span>{lang === "pl" ? "Twoja firma." : "Your business."}</span><span>{lang === "pl" ? "Moje doświadczenie." : "My experience."}</span></h1>
      <Image src="/images/profile-3-cutout.png" alt="Kacper Bernecki" width={1024} height={1280} priority sizes="(min-width:1024px) 540px, 94vw" className="hero-depth-portrait"/>
      <div className="hero-ground" aria-hidden="true"/>
    </div>
  </section>;
}
