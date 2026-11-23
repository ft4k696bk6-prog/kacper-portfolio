import type { Metadata } from "next";
import { DigitalBusinessCard } from "@/components/DigitalBusinessCard";

export const metadata: Metadata = {
  title: "Kacper Bernecki — wizytówka | IT i import aut",
  description: "Zapisz kontakt Kacpra Berneckiego. Strony WWW, CRM, AI, automatyzacje oraz import samochodów z USA i Kanady.",
  alternates: {
    canonical: "https://bernecki.dev/card",
    languages: {
      "pl-PL": "https://bernecki.dev/card",
      en: "https://bernecki.dev/en/card",
    },
  },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Kacper Bernecki — wizytówka",
    description: "IT • Strony WWW • CRM • AI • Import samochodów z USA i Kanady",
    url: "https://bernecki.dev/card",
    images: [{ url: "https://bernecki.dev/images/profile-3-cutout.png", alt: "Kacper Bernecki" }],
  },
};

export default function DigitalCardPage() {
  return <DigitalBusinessCard lang="pl" />;
}
