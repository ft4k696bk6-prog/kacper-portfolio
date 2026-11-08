"use client";

import { HomeStudio } from "@/components/HomeStudio";
import { useLanguage } from "@/contexts/LanguageContext";
import { homepageCopy } from "@/content/homepage-copy";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://bernecki.dev/#website",
      url: "https://bernecki.dev/",
      name: "Kacper Bernecki — rozwój biznesu, AI i technologia",
      description:
        "Rozwój biznesu, sourcing produktów, integracje AI, strony internetowe, aplikacje CRM i marketing realizowane bezpośrednio z Kacprem Berneckim.",
      inLanguage: ["pl-PL", "en-US"],
      publisher: { "@id": "https://bernecki.dev/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://bernecki.dev/#person",
      name: "Kacper Bernecki",
      url: "https://bernecki.dev/",
      jobTitle: "Business and Web App Developer",
      description:
        "Polish entrepreneur supporting practical business development, AI integrations, sourcing, websites, CRM systems and marketing.",
      address: { "@type": "PostalAddress", addressCountry: "PL" },
      sameAs: [
        "https://github.com/ft4k696bk6-prog",
        "https://www.linkedin.com/in/kacper-bernecki/",
      ],
      image: "https://bernecki.dev/images/profile-3-cutout.png",
      knowsAbout: [
        "Business development",
        "Product sourcing",
        "Website development",
        "CRM systems",
        "Business web applications",
        "AI API integrations",
        "Business process automation",
        "React",
        "TypeScript",
        "Next.js",
        "Supabase",
        "PostgreSQL",
        "Digital marketing websites",
      ],
      knowsLanguage: ["pl-PL", "en-US"],
    },
    {
      "@type": "Service",
      "@id": "https://bernecki.dev/#service",
      name: "Kacper Bernecki — rozwój biznesu, strony i systemy",
      url: "https://bernecki.dev/",
      provider: { "@id": "https://bernecki.dev/#person" },
      areaServed: "PL",
      serviceType: [
        "Business development",
        "Product sourcing",
        "Website development",
        "CRM development",
        "Business web application development",
        "Landing page development",
        "AI integration and process automation",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Usługi Kacpra Berneckiego",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Zewnętrzny dyrektor marketingu, sprzedaży i operacji", url: "https://bernecki.dev/zewnetrzny-dyrektor" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Rozwój biznesu i koordynacja wdrożeń", url: "https://bernecki.dev/rozwoj-biznesu" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wdrożenia AI i automatyzacja procesów", url: "https://bernecki.dev/wdrozenia-ai-dla-firm" } },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Tworzenie stron internetowych",
              url: "https://bernecki.dev/tworzenie-stron-internetowych",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "CRM i aplikacje webowe",
              url: "https://bernecki.dev/crm-i-aplikacje-webowe",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Marketing i reklamy",
              url: "https://bernecki.dev/marketing-i-reklamy",
            },
          },
        ],
      },
    },
  ],
};

export function StaticPortfolio() {
  const { lang } = useLanguage();
  const faqJsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: homepageCopy[lang].faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}/>
    <HomeStudio/>
  </>;
}
