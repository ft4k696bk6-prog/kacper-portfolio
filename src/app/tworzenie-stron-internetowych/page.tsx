import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = serviceMetadata(
  "Tworzenie stron internetowych dla małych firm",
  "Kacper Bernecki tworzy szybkie i dopracowane strony internetowe, landing page oraz strony usługowe dla małych firm i produktów.",
  "tworzenie-stron-internetowych",
);

export default function WebsitesPage() {
  return <ServiceLandingPage kind="websites" />;
}
