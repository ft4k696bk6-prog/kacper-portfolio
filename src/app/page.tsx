import type { Metadata } from "next";
import { ChoosePortfolio } from "@/components/ChoosePortfolio";

export const metadata: Metadata = {
  title: "Kacper Bernecki — Portfolio",
  description:
    "Choose between Kacper Bernecki's static business web app portfolio and interactive MacBook portfolio.",
  alternates: {
    canonical: "https://kacper-portfolio.vercel.app",
  },
};

export default function Home() {
  return <ChoosePortfolio />;
}
