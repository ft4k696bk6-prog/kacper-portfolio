import { NextRequest, NextResponse } from "next/server";
import { POST } from "../inspect/route";
export const runtime = "nodejs";
export const maxDuration=60;
// Preview integration smoke only; delete this route before production.
export async function GET(req:NextRequest){
 if(process.env.VERCEL_ENV==="production")return NextResponse.json({error:"not found"},{status:404});
 const key=req.nextUrl.searchParams.get("case")||"sagan";
 const samples:Record<string,string>={sagan:"https://sagan.dev",bernecki:"https://bernecki.dev",blocked:"http://127.0.0.1",invalid:"https://localhost"};
 const target=samples[key];
 if(!target)return NextResponse.json({error:"invalid sample"},{status:400});
 const started=Date.now();
 const response=await POST(new NextRequest("https://bernecki.dev/api/tools/inspect",{
  method:"POST",headers:{"content-type":"application/json","x-real-ip":"auditor-preview-"+key},
  body:JSON.stringify({url:target,mode:"full"})
 }));
 const d=await response.json();
 return NextResponse.json({
  key,responseStatus:response.status,elapsedMs:Date.now()-started,error:d.error||null,
  finalUrl:d.url||null,pages:d.summary?.scanned||0,findings:d.issues?.length||0,
  categories:[...new Set((d.issues||[]).map((v:{category:string})=>v.category))],
  sitemap:d.technical?.sitemap?.present,
  robots:d.technical?.robots?.present,
  tls:d.technical?.tls?.authorized,
  dns:d.technical?.dns?.spf?.length,
  pageSamples:(d.pages||[]).slice(0,3).map((v:{url:string;status:number;html:{title:string}})=>({url:v.url,status:v.status,title:v.html.title}))
 },{headers:{"cache-control":"no-store"}});
}
