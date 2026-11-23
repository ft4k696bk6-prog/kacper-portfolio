import type { Metadata } from "next";
import { DigitalBusinessCard } from "@/components/DigitalBusinessCard";

export const metadata: Metadata = {
  title: "Kacper Bernecki — digital business card | IT & car imports",
  description: "Save Kacper Bernecki's contact information. Websites, CRM, AI automation and car imports from the US and Canada.",
  alternates: {
    canonical: "https://bernecki.dev/en/card",
    languages: {
      "pl-PL": "https://bernecki.dev/card",
      en: "https://bernecki.dev/en/card",
    },
  },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Kacper Bernecki — digital business card",
    description: "IT • Websites • CRM • AI • Car imports from the US and Canada",
    url: "https://bernecki.dev/en/card",
    images: [{ url: "https://bernecki.dev/images/profile-3-cutout.png", alt: "Kacper Bernecki" }],
  },
};

export default function EnglishDigitalCardPage() {
  return <DigitalBusinessCard lang="en" />;
}
