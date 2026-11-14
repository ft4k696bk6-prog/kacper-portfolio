import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = {
  ...serviceMetadata(
  "CRM na zamówienie i aplikacje dla firm | bernecki.dev",
  "Szukasz wykonawcy CRM dla firmy? Kacper Bernecki tworzy dedykowane CRM, panele i aplikacje webowe. Zobacz wdrożenie B-CRM i omów potrzeby.",
  "crm-i-aplikacje-webowe",
),
  alternates: {canonical:"https://bernecki.dev/crm-i-aplikacje-webowe",languages:{"pl-PL":"https://bernecki.dev/crm-i-aplikacje-webowe",en:"https://bernecki.dev/en/services/crm"}}
};

export default function BusinessAppsPage() {
  return <ServiceLandingPage kind="apps" />;
}
