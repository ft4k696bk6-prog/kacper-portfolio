"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/** Next.js supplies page-specific metadata; only the homepage changes language in place. */
export function LanguageMetadataSync() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = pathname === "/" ? lang : pathname.startsWith("/en/") ? "en" : "pl";
    if (pathname !== "/") return;
    document.title = t.meta.homeTitle;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = t.meta.homeDescription;
  }, [lang, pathname, t]);
  return null;
}
