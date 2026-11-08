import type {Metadata} from "next";
import {BlogIndex} from "@/components/BlogIndex";
export const metadata:Metadata={
 title:"Blog o biznesie, marketingu, CRM i SEO | Kacper Bernecki",
 description:"Artykuły o prowadzeniu marketingu, wdrażaniu CRM, stronach internetowych i SEO. Konkretne przykłady oraz linki do instrukcji i realizacji.",
 alternates:{canonical:"https://bernecki.dev/blog",languages:{"pl-PL":"https://bernecki.dev/blog",en:"https://bernecki.dev/en/blog"}},
 openGraph:{title:"Blog — Kacper Bernecki",description:"Marketing, CRM, SEO i strony internetowe — praktyczne artykuły i realizacje.",url:"https://bernecki.dev/blog",locale:"pl_PL",type:"website"}
};
export default function Page(){return <BlogIndex lang="pl"/>;}
