import type { Metadata } from "next";
import { StaticPortfolio } from "@/components/StaticPortfolio";

export const metadata: Metadata = {
  title: { absolute: "Strony internetowe, CRM i aplikacje webowe | Kacper Bernecki" },
  description:
    "Strony internetowe, landing page i CRM-y dla firm. Kacper Bernecki — bezpośredni kontakt, dopracowany wygląd i wycena dopasowana do zakresu.",
};

export default function Home() {
  return <StaticPortfolio />;
}
