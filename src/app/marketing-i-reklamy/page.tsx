import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Landing page i strony pod marketing i reklamy",
  description:
    "Kacper Bernecki buduje landing page, strony kampanii, formularze i analitykę dla marketingu oraz reklam.",
  alternates: { canonical: "https://bernecki.dev/marketing-i-reklamy" },
};

export default function MarketingPage() {
  return <ServiceLandingPage kind="marketing" />;
}
