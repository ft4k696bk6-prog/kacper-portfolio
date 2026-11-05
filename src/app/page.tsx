import type { Metadata } from "next";
import { StaticPortfolio } from "@/components/StaticPortfolio";

export const metadata: Metadata = {
  title: "Kacper Bernecki — Frontend / Web App Developer",
  description:
    "Kacper Bernecki builds business web applications in React, TypeScript, Next.js and Supabase: CRMs, dashboards, forms and workflow tools.",
};

export default function Home() {
  return <StaticPortfolio />;
}
