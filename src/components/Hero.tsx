"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { lang } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const draw = () => {
      frame = 0;
      const progress = Math.max(0, Math.min(-el.getBoundingClientRect().top, el.offsetHeight));
      el.style.setProperty("--portrait-shift", media.matches ? "0px" : progress * .16 + "px");
      el.style.setProperty("--title-shift", media.matches ? "0px" : progress * .32 + "px");
    };
    const scroll = () => { if (!frame) frame = requestAnimationFrame(draw); };
    window.addEventListener("scroll", scroll, { passive: true });
    media.addEventListener("change", scroll); draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); media.removeEventListener("change", scroll); };
  }, []);
  return <section ref={ref} id="home" className="hero-depth">
    <div className="hero-depth-stage">
      <h1 className="hero-depth-title"><span>{lang === "pl" ? "Twoja firma." : "Your business."}</span><span>{lang === "pl" ? "Moje doświadczenie." : "My experience."}</span></h1>
      <Image src="/images/profile-3-cutout.png" alt="Kacper Bernecki" width={1024} height={1280} priority sizes="(min-width:1024px) 540px, 94vw" className="hero-depth-portrait"/>
    </div>
  </section>;
}
