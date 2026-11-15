import type {Metadata} from "next";
import {StaticPortfolio} from "@/components/StaticPortfolio";

const site="https://bernecki.dev";
export const metadata:Metadata={
 title:{absolute:"Business Websites, Custom CRM, Google & Meta Ads | bernecki.dev"},
 description:"I build business websites and custom CRM, manage Google, Facebook and Instagram advertising, and automate customer enquiries. Explore real projects and clear prices.",
 alternates:{canonical:site+"/en",languages:{"pl-PL":site+"/",en:site+"/en"}},
 openGraph:{title:"Websites, CRM and advertising for your business | bernecki.dev",description:"Custom websites, CRM and paid advertising for businesses, with practical automation and clear pricing.",url:site+"/en",locale:"en_US",type:"website"}
};
export default function EnglishHome(){return <StaticPortfolio/>;}
