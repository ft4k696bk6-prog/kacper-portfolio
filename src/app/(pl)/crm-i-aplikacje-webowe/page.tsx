import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = {
  ...serviceMetadata(
  "CRM i aplikacje webowe dla firm",
  "Kacper Bernecki buduje CRM-y, dashboardy, panele administracyjne i aplikacje webowe dopasowane do procesów małych firm.",
  "crm-i-aplikacje-webowe",
),
  alternates: {canonical:"https://bernecki.dev/crm-i-aplikacje-webowe",languages:{"pl-PL":"https://bernecki.dev/crm-i-aplikacje-webowe",en:"https://bernecki.dev/en/services/crm"}}
};

export default function BusinessAppsPage() {
  return <ServiceLandingPage kind="apps" />;
}
