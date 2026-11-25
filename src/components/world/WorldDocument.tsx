import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { classicPaths, copy, worldPaths, type WorldLocale } from "./content";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--world-font" });
const origin = "https://bernecki.dev";
const openGraphLocales = { pl: "pl_PL", en: "en_US", uk: "uk_UA" } as const;
const alternates = { "pl-PL": worldPaths.pl, en: worldPaths.en, "uk-UA": worldPaths.uk };

export function worldMetadata(locale: WorldLocale): Metadata {
  return {
    metadataBase: new URL(origin),
    title: `Bernecki World — ${copy[locale].explore}`,
    description: copy[locale].description,
    alternates: { canonical: worldPaths[locale], languages: alternates },
    icons: { icon: "/favicon.svg", apple: "/apple-icon" },
    openGraph: {
      title: "Bernecki World",
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter(value => value !== openGraphLocales[locale]),
      description: copy[locale].description,
      type: "website",
      url: worldPaths[locale],
      images: [{ url: "/images/world/social.webp", width: 1200, height: 630, alt: copy[locale].scene }],
    },
    twitter: { card: "summary_large_image", images: ["/images/world/social.webp"] },
  };
}

export function WorldDocument({ locale, children }: { locale: WorldLocale; children: ReactNode }) {
  return <html lang={locale} className={geist.variable}>
    <body style={{ margin: 0, background: "#0b101b" }}>
      {children}
    </body>
  </html>;
}

export function WorldStructuredData({ locale }: { locale: WorldLocale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bernecki World",
    url: origin + worldPaths[locale],
    description: copy[locale].description,
    inLanguage: locale,
    isPartOf: { "@id": `${origin}/#website` },
    about: { "@type": "Person", name: "Kacper Bernecki", url: origin + classicPaths[locale] },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
