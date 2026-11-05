import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = serviceMetadata(
  "Landing page i strony pod marketing i reklamy",
  "Kacper Bernecki buduje landing page, strony kampanii, formularze i analitykę dla marketingu oraz reklam.",
  "marketing-i-reklamy",
);

export default function MarketingPage() {
  return <ServiceLandingPage kind="marketing" />;
}
