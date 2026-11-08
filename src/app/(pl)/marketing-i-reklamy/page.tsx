import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = {
  ...serviceMetadata(
  "Meta Ads i marketing dla firm — pozyskiwanie leadów",
  "Pozyskiwanie leadów przez Meta Ads, kampanie Facebook i Instagram, strony ofertowe i CRM. Zobacz case study kampanii Re-Energy System i poznaj proces współpracy.",
  "marketing-i-reklamy",
),
  alternates: {canonical:"https://bernecki.dev/marketing-i-reklamy",languages:{"pl-PL":"https://bernecki.dev/marketing-i-reklamy",en:"https://bernecki.dev/en/services/marketing"}}
};

export default function MarketingPage() {
  return <ServiceLandingPage kind="marketing" />;
}
