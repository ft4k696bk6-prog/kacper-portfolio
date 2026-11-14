import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = {
  ...serviceMetadata(
  "Wykonawca stron internetowych dla firm | bernecki.dev",
  "Szukasz firmy do zrobienia strony internetowej? Kacper Bernecki projektuje i wdraża strony usługowe, firmowe i landing page. Zobacz realizacje i zapytaj o wycenę.",
  "tworzenie-stron-internetowych",
),
  alternates: {canonical:"https://bernecki.dev/tworzenie-stron-internetowych",languages:{"pl-PL":"https://bernecki.dev/tworzenie-stron-internetowych",en:"https://bernecki.dev/en/services/websites"}}
};

export default function WebsitesPage() {
  return <ServiceLandingPage kind="websites" />;
}
