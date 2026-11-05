import type { Metadata } from "next";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "CRM i aplikacje webowe dla firm",
  description:
    "Kacper Bernecki buduje CRM-y, dashboardy, panele administracyjne i aplikacje webowe dopasowane do procesów małych firm.",
  alternates: { canonical: "https://bernecki.dev/crm-i-aplikacje-webowe" },
};

export default function BusinessAppsPage() {
  return <ServiceLandingPage kind="apps" />;
}
