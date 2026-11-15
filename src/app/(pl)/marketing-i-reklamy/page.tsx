import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = {
  ...serviceMetadata(
  "Marketing i reklamy dla firm: Google, Meta, TikTok, CRM",
  "Kampanie Google Ads, Facebook, Instagram, TikTok i YouTube. Reklama, landing page, CRM i mierzenie jakości leadów. Sprawdź cennik i realizacje.",
  "marketing-i-reklamy",
),
  alternates: {canonical:"https://bernecki.dev/marketing-i-reklamy",languages:{"pl-PL":"https://bernecki.dev/marketing-i-reklamy",en:"https://bernecki.dev/en/services/marketing"}}
};

export default function MarketingPage() {
  return <ServiceLandingPage kind="marketing" />;
}
