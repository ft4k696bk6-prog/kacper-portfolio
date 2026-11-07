import type { Metadata } from "next";
import { StaticPortfolio } from "@/components/StaticPortfolio";

export const metadata: Metadata = {
  title: { absolute: "Rozwój biznesu, strony, CRM i marketing | Kacper Bernecki" },
  description:
    "Od pomysłu do działającego biznesu. Sourcing produktów, strony, CRM, marketing i sprzedaż — praktyczne wdrożenia z Kacprem Berneckim.",
};

export default function Home() {
  return <StaticPortfolio />;
}
