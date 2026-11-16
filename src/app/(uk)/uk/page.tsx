import type {Metadata} from "next";
import {UkrainianLanding} from "@/components/UkrainianLanding";
import {ukSalesPages,ukAlternates} from "@/content/uk-sales";
const page=ukSalesPages[0];
export const metadata:Metadata={title:page.title,description:page.description,alternates:{canonical:"https://bernecki.dev/uk",languages:ukAlternates(page)},openGraph:{title:page.title,description:page.description,url:"https://bernecki.dev/uk",locale:"uk_UA"}};
export default function HomeUk(){return <UkrainianLanding page={page}/>;}
