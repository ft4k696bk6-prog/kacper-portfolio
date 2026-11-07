"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageMetadataSync() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();

  useEffect(() => {
    const englishGuide = pathname.startsWith("/en/guides");
    const servicePage = [
      "/tworzenie-stron-internetowych",
      "/crm-i-aplikacje-webowe",
      "/marketing-i-reklamy",
    ].includes(pathname) || pathname.startsWith("/poradniki") || pathname.startsWith("/realizacje") || pathname === "/case-studies/re-energy-meta-ads" || pathname === "/reklamy-meta-ads-dla-firm";
    document.documentElement.lang = englishGuide ? "en" : (servicePage || pathname === "/case-studies" ? "pl" : lang);
    if (englishGuide || servicePage || pathname === "/case-studies" || pathname === "/choose")
      return;

    const caseStudySlug = pathname.match(/^\/case-studies\/([^/]+)/)?.[1];
    const caseStudy = caseStudySlug
      ? t.caseStudies.items.find((item) => item.slug === caseStudySlug)
      : null;

    document.title = caseStudy
      ? `${caseStudy.title} | Kacper Bernecki`
      : t.meta.homeTitle;

    const descriptionContent = caseStudy
      ? caseStudy.summary
      : t.meta.homeDescription;
    const description =
      document.querySelector<HTMLMetaElement>('meta[name="description"]') ||
      document.head.appendChild(document.createElement("meta"));
    description.name = "description";
    description.content = descriptionContent;
  }, [lang, pathname, t]);

  return null;
}
