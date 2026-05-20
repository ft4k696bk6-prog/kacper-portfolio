import type { Metadata } from "next";
import { StaticPortfolio } from "@/components/StaticPortfolio";

export const metadata: Metadata = {
  title: "Static portfolio",
  description:
    "Kacper Bernecki's static business web app portfolio with projects, case studies, stack, contact and booking.",
  alternates: {
    canonical: "https://kacper-portfolio.vercel.app/static",
  },
};

export default function StaticPortfolioPage() {
  return <StaticPortfolio />;
}

