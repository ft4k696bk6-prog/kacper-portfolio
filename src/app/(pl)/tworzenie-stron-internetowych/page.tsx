import { serviceMetadata } from "@/lib/seo";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata = {
  ...serviceMetadata(
  "Tworzenie stron internetowych dla firm – cena i realizacje",
  "Tworzenie stron internetowych dla firm: landing page od 1900 zł netto, strony firmowe od 3900 zł netto. Zobacz StarCars, Isto Kebab i Motomizer oraz zapytaj o wycenę.",
  "tworzenie-stron-internetowych",
),
  alternates: {canonical:"https://bernecki.dev/tworzenie-stron-internetowych",languages:{"pl-PL":"https://bernecki.dev/tworzenie-stron-internetowych",en:"https://bernecki.dev/en/services/websites"}}
};

export default function WebsitesPage() {
  return <ServiceLandingPage kind="websites" />;
}
