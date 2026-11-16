import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {UkrainianLanding} from "@/components/UkrainianLanding";
import {ukSalesPages,ukPath,ukAlternates} from "@/content/uk-sales";
export function generateStaticParams(){return ukSalesPages.filter(page=>page.slug).map(page=>({slug:page.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const page=ukSalesPages.find(page=>page.slug===slug);
 if(!page)return {robots:{index:false,follow:false}};
 return {title:page.title,description:page.description,alternates:{canonical:"https://bernecki.dev"+ukPath(page),languages:ukAlternates(page)},openGraph:{title:page.title,description:page.description,url:"https://bernecki.dev"+ukPath(page),locale:"uk_UA"}};
}
export default async function UkrainianService({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const page=ukSalesPages.find(page=>page.slug===slug);
 if(!page)notFound();return <UkrainianLanding page={page}/>;
}
