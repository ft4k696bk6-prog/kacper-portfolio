import type { Metadata } from "next";
import { BusinessDevelopment } from "@/components/BusinessDevelopment";

export const metadata: Metadata={
  title:"Business Development, Product Sourcing and Technology | Kacper Bernecki",
  description:"Practical business planning, supplier research, product sourcing, websites, CRM, marketing and sales implementation with Kacper Bernecki.",
  alternates:{canonical:"https://bernecki.dev/en/business",languages:{"pl-PL":"https://bernecki.dev/rozwoj-biznesu",en:"https://bernecki.dev/en/business"}},
  openGraph:{title:"From Idea to Working Business | Kacper Bernecki",description:"Business planning, supplier sourcing, websites, CRM and marketing implementation.",type:"website",url:"https://bernecki.dev/en/business",locale:"en_US"}
};

export default function EnglishBusinessPage(){
  return <BusinessDevelopment/>;
}
