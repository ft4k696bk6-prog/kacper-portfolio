import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getBlogPost,blogPosts} from "@/content/blog";
import {BlogArticle} from "@/components/BlogArticle";
import {seoTitle} from "@/lib/seo";
type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return blogPosts.map(({slug})=>({slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params,post=getBlogPost(slug);if(!post)notFound();
 const url=`https://bernecki.dev/en/blog/${slug}`;
 return {title:{absolute:seoTitle(post.en.title)},description:post.en.excerpt,
  alternates:{canonical:url,languages:{"pl-PL":`https://bernecki.dev/blog/${slug}`,en:url}},
  openGraph:{title:post.en.title,description:post.en.excerpt,url,locale:"en_US",type:"article"}};
}
export default async function Page({params}:Props){
 const {slug}=await params,post=getBlogPost(slug);if(!post)notFound();
 return <BlogArticle post={post} lang="en"/>;
}
