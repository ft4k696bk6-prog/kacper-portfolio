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
 const url=`https://bernecki.dev/blog/${slug}`;
 return {title:{absolute:seoTitle(post.pl.title)},description:post.pl.excerpt,
  alternates:{canonical:url,languages:{"pl-PL":url,en:`https://bernecki.dev/en/blog/${slug}`}},
  openGraph:{title:post.pl.title,description:post.pl.excerpt,url,locale:"pl_PL",type:"article"}};
}
export default async function Page({params}:Props){
 const {slug}=await params,post=getBlogPost(slug);if(!post)notFound();
 return <BlogArticle post={post} lang="pl"/>;
}
