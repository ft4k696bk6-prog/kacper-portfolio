import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = serviceMetadata(
  "CRM i aplikacje webowe dla firm",
  "Kacper Bernecki buduje CRM-y, dashboardy, panele administracyjne i aplikacje webowe dopasowane do procesów małych firm.",
  "crm-i-aplikacje-webowe",
);

export default function BusinessAppsPage() {
  return <ServiceLandingPage kind="apps" />;
}
