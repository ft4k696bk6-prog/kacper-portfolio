import type { Metadata } from "next";
import { BusinessDevelopment } from "@/components/BusinessDevelopment";

export const metadata:Metadata={
  title:"Rozwój biznesu, produkty, import i wdrożenia | Kacper Bernecki",
  description:"Pomoc w uruchamianiu i rozwijaniu przedsięwzięć: plan, dostawcy, produkty, import, strony, sklepy, CRM, marketing i sprzedaż. Praktyczne wsparcie biznesowe.",
  alternates:{canonical:"https://bernecki.dev/rozwoj-biznesu",languages:{"pl-PL":"https://bernecki.dev/rozwoj-biznesu",en:"https://bernecki.dev/en/business"}},
  openGraph:{
    title:"Od pomysłu do działającego biznesu | Kacper Bernecki",
    description:"Strategia, sourcing, produkty, systemy, marketing i sprzedaż. Praktyczna pomoc w uruchamianiu i rozwoju firm.",
    url:"https://bernecki.dev/rozwoj-biznesu",
    type:"website"
  }
};

export default function BusinessDevelopmentPage(){
  return <BusinessDevelopment/>;
}
