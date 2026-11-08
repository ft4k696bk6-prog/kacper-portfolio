import type { Metadata } from "next";
import { StaticPortfolio } from "@/components/StaticPortfolio";

export const metadata: Metadata = {
  title: { absolute: "Rozwój biznesu, AI, CRM i marketing | Kacper Bernecki" },
  description:
    "Od pomysłu do działającego biznesu. Sourcing produktów, analiza kosztów, wdrożenia AI, strony, CRM, marketing i sprzedaż — praktyczne wsparcie z Kacprem Berneckim.",
};

export default function Home() {
  return <StaticPortfolio />;
}
