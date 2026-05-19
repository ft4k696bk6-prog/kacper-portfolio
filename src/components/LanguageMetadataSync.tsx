"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageMetadataSync() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;

    const caseStudySlug = pathname.match(/^\/case-studies\/([^/]+)/)?.[1];
    const caseStudy = caseStudySlug
      ? t.caseStudies.items.find((item) => item.slug === caseStudySlug)
      : null;

    document.title = caseStudy
      ? `${caseStudy.title} | Kacper Bernecki`
      : t.meta.homeTitle;

    const descriptionContent = caseStudy ? caseStudy.summary : t.meta.homeDescription;
    const description =
      document.querySelector<HTMLMetaElement>('meta[name="description"]') ||
      document.head.appendChild(document.createElement("meta"));
    description.name = "description";
    description.content = descriptionContent;
  }, [lang, pathname, t]);

  return null;
}
