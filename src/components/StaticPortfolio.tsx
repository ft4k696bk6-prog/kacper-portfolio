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
      name: "Kacper Bernecki — strony internetowe, CRM i aplikacje webowe",
      description:
        "Strony internetowe, CRM-y i aplikacje webowe tworzone bezpośrednio przez Kacpra Berneckiego.",
      inLanguage: ["pl-PL", "en-US"],
      publisher: { "@id": "https://bernecki.dev/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://bernecki.dev/#person",
      name: "Kacper Bernecki",
      url: "https://bernecki.dev/",
      jobTitle: "Frontend / Web App Developer",
      description:
        "Independent Polish developer building websites, CRM systems and practical business web apps.",
      address: { "@type": "PostalAddress", addressCountry: "PL" },
      sameAs: [
        "https://github.com/ft4k696bk6-prog",
        "https://www.linkedin.com/in/kacper-bernecki/",
      ],
      image: "https://bernecki.dev/images/profile-3-cutout.png",
      knowsAbout: [
        "Website development",
        "CRM systems",
        "Business web applications",
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
      name: "Kacper Bernecki — strony internetowe, CRM i web app",
      url: "https://bernecki.dev/",
      provider: { "@id": "https://bernecki.dev/#person" },
      areaServed: "PL",
      serviceType: [
        "Website development",
        "CRM development",
        "Business web application development",
        "Landing page development",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Usługi Kacpra Berneckiego",
        itemListElement: [
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
