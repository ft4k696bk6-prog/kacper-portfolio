import { ChoosePortfolio } from "@/components/ChoosePortfolio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wybierz portfolio",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://bernecki.dev/choose" },
};

export default function ChoosePortfolioPage() {
  return <ChoosePortfolio />;
}
