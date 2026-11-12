import type { Metadata } from "next";
import { StaticPortfolio } from "@/components/StaticPortfolio";

export const metadata: Metadata = {
  title: { absolute: "Kacper Bernecki — Strony WWW, CRM i automatyzacje AI" },
  description:
    "Tworzę strony internetowe, systemy CRM i aplikacje oraz pomagam firmom pozyskiwać klientów przez Meta Ads. Realizacje StarCars, B-CRM i Re-Energy System.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://bernecki.dev/#person",
      name: "Kacper Bernecki",
      url: "https://bernecki.dev/",
      knowsAbout: ["tworzenie stron internetowych", "CRM", "aplikacje webowe", "marketing internetowy", "automatyzacja AI"],
      sameAs: [
        "https://www.linkedin.com/in/kacper-bernecki",
        "https://github.com/ft4k696bk6-prog"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://bernecki.dev/#organization",
      name: "bernecki.dev",
      url: "https://bernecki.dev/",
      description: "Strony internetowe, aplikacje CRM, marketing i automatyzacje dla firm.",
      founder: { "@id": "https://bernecki.dev/#person" },
      logo: "https://bernecki.dev/favicon.svg"
    },
    {
      "@type": "WebSite",
      "@id": "https://bernecki.dev/#website",
      url: "https://bernecki.dev/",
      name: "Kacper Bernecki — Strony WWW, CRM i automatyzacje AI",
      inLanguage: ["pl-PL", "en-US"],
      publisher: { "@id": "https://bernecki.dev/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://bernecki.dev/#webpage",
      url: "https://bernecki.dev/",
      name: "Strony internetowe, CRM i marketing dla firm",
      inLanguage: "pl-PL",
      isPartOf: { "@id": "https://bernecki.dev/#website" },
      about: { "@id": "https://bernecki.dev/#person" }
    },
    ...[
      ["Tworzenie stron internetowych", "/tworzenie-stron-internetowych"],
      ["CRM i aplikacje webowe", "/crm-i-aplikacje-webowe"],
      ["Marketing i reklamy", "/marketing-i-reklamy"],
      ["Wdrożenia AI dla firm", "/wdrozenia-ai-dla-firm"]
    ].map(([name, path]) => ({
      "@type": "Service",
      name,
      url: "https://bernecki.dev" + path,
      provider: { "@id": "https://bernecki.dev/#person" },
      areaServed: { "@type": "Country", name: "Polska" }
    }))
  ]
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <StaticPortfolio />
    </>
  );
}
