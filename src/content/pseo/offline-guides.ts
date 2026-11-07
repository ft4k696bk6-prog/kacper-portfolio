import nextReact from "./offline/nextjs-react.json";
import supabase from "./offline/supabase-postgres.json";
import vercelGithub from "./offline/vercel-github.json";
import seoWordpress from "./offline/seo-wordpress.json";
import metaMailApi from "./offline/meta-mail-api.json";

/**
 * Deterministic programmatic SEO.
 * All problem details are editorially defined in versioned files.
 * No OpenRouter or other LLM API is used at build time or at request time.
 */
export const offlineCases = [
  ...nextReact,
  ...supabase,
  ...vercelGithub,
  ...seoWordpress,
  ...metaMailApi
];

const services: Record<string, readonly [string, string]> = {
  "nextjs-react": ["/crm-i-aplikacje-webowe", "Aplikacje internetowe"],
  "supabase-bazy": ["/crm-i-aplikacje-webowe", "CRM i bazy danych"],
  "vercel-hosting": ["/tworzenie-stron-internetowych", "Strony i wdrożenia"],
  automatyzacje: ["/crm-i-aplikacje-webowe", "Integracje i automatyzacje"],
  "seo-google": ["/tworzenie-stron-internetowych", "SEO i strony internetowe"],
  wordpress: ["/tworzenie-stron-internetowych", "Strony internetowe"],
  "meta-ads": ["/marketing-i-reklamy", "Marketing i reklamy"],
  "domeny-poczta": ["/tworzenie-stron-internetowych", "Domeny i poczta"],
  "formularze-api": ["/crm-i-aplikacje-webowe", "Formularze i API"]
};

export const offlineGuides = offlineCases.map((caseFile) => {
  const [service, serviceLabel] = services[caseFile.category] ?? ["/crm-i-aplikacje-webowe", "Aplikacje internetowe"];
  return {
    slug: caseFile.slug,
    title: caseFile.title,
    description: caseFile.symptom,
    intro: `${caseFile.symptom} ${caseFile.cause}`,
    service,
    serviceLabel,
    category: caseFile.category,
    offlinePseo: true as const,
    sections: [
      {
        title: "Objaw i możliwa przyczyna",
        paragraphs: [caseFile.symptom, caseFile.cause]
      },
      {
        title: "Jak ustalić źródło błędu",
        paragraphs: [...caseFile.inspect]
      },
      {
        title: "Co zrobić krok po kroku",
        paragraphs: caseFile.fix.map((step, index) => `${index + 1}. ${step}`)
      },
      {
        title: "Jak sprawdzić wynik",
        paragraphs: [caseFile.verify]
      },
      {
        title: "Czego nie robić",
        paragraphs: [caseFile.warning]
      }
    ],
    sources: [{ label: "Oficjalna dokumentacja dotycząca problemu", url: caseFile.source }]
  };
});
