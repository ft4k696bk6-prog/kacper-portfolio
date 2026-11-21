import { commercialServiceDetails } from "@/content/commercial-services";

export type CaseStudyRelatedService = {
  href: string;
  title: string;
  englishHref: string;
  englishTitle: string;
};

const englishServiceByCategory: Record<string, { href: string; title: string }> = {
  "Strony i sprzedaż": { href: "/en/services/websites", title: "Website development" },
  "Strony i e-commerce": { href: "/en/services/websites", title: "Website development" },
  "Strony i utrzymanie": { href: "/en/services/websites", title: "Website development" },
  "CRM i sprzedaż": { href: "/en/services/crm", title: "CRM and web applications" },
  "AI i CRM": { href: "/en/services/crm", title: "CRM and web applications" },
  "Aplikacje i oprogramowanie": { href: "/en/services/crm", title: "CRM and web applications" },
  "Automatyzacja": { href: "/en/services/automation", title: "Business automation" },
  "Integracje i automatyzacja": { href: "/en/services/automation", title: "Business automation" },
  "Startupy i MVP": { href: "/en/services/crm", title: "Custom web applications" },
};

export function getCaseStudyRelatedServices(slug: string): CaseStudyRelatedService[] {
  const proofUrl = `/case-studies/${slug}`;

  return Object.entries(commercialServiceDetails)
    .filter(([, service]) => service.proofUrl === proofUrl)
    .flatMap(([serviceSlug, service]) => {
      const englishService = englishServiceByCategory[service.category];
      if (!englishService) return [];

      return [{
        href: `/oferta/${serviceSlug}`,
        title: service.title,
        englishHref: englishService.href,
        englishTitle: englishService.title,
      }];
    })
    .slice(0, 4);
}
