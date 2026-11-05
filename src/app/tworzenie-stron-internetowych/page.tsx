import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Tworzenie stron internetowych dla małych firm",
  description:
    "Kacper Bernecki tworzy szybkie i dopracowane strony internetowe, landing page oraz strony usługowe dla małych firm i produktów.",
  alternates: { canonical: "https://bernecki.dev/tworzenie-stron-internetowych" },
};

export default function WebsitesPage() {
  return <ServiceLandingPage kind="websites" />;
}
