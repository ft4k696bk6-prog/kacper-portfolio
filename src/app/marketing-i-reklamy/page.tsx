import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = serviceMetadata(
  "Marketing, reklamy i prowadzenie social mediów",
  "Reklamy, marketing i social media dla małych firm. Kacper Bernecki: współprace z Jalapeno Kebab, StarCars i Re-energy System, strony kampanii i pomiar zapytań.",
  "marketing-i-reklamy",
);

export default function MarketingPage() {
  return <ServiceLandingPage kind="marketing" />;
}
