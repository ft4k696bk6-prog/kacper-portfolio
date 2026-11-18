import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = {
  ...serviceMetadata(
  "CRM na zamówienie – system dla handlowców i firm",
  "Dedykowany CRM dla firmy: leady, kalendarz, role, oferty PDF i integracje Meta Lead Ads. Zobacz wdrożenie B-CRM oraz omów zakres i wycenę.",
  "crm-i-aplikacje-webowe",
),
  alternates: {canonical:"https://bernecki.dev/crm-i-aplikacje-webowe",languages:{"pl-PL":"https://bernecki.dev/crm-i-aplikacje-webowe",en:"https://bernecki.dev/en/services/crm"}}
};

export default function BusinessAppsPage() {
  return <ServiceLandingPage kind="apps" />;
}
