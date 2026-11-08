import type {Metadata} from "next";
import {BlogIndex} from "@/components/BlogIndex";
export const metadata:Metadata={
 title:"Business, Marketing, CRM and SEO Blog | Kacper Bernecki",
 description:"Practical articles connecting marketing, sales, CRM, SEO and website design with detailed technical guides and real projects.",
 alternates:{canonical:"https://bernecki.dev/en/blog",languages:{"pl-PL":"https://bernecki.dev/blog",en:"https://bernecki.dev/en/blog"}},
 openGraph:{title:"Business and technology blog — Kacper Bernecki",description:"Practical articles on marketing, CRM, SEO and websites.",url:"https://bernecki.dev/en/blog",locale:"en_US",type:"website"}
};
export default function Page(){return <BlogIndex lang="en"/>;}
