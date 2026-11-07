"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";

export function Hero() {
  const { lang } = useLanguage();
  return <ParallaxComponent
    title={lang === "pl" ? "Strony. Aplikacje. Marketing." : "Websites. Apps. Marketing."}
    portraitAlt={lang === "pl" ? "Kacper Bernecki, stojący bokiem z dłońmi w kieszeniach" : "Kacper Bernecki standing with his hands in his pockets"}
  />;
}
