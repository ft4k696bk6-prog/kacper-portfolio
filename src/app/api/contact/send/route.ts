import { NextRequest, NextResponse } from "next/server";
const EDGE_URL="https://ymbemfwhggxvbdyishxt.supabase.co/functions/v1/portfolio-contact";

function validOrigin(request:NextRequest){
 const o=request.headers.get("origin");
 if(!o)return true; // GET from browsers can omit Origin.
 try{
  const u=new URL(o);
  const hostname=request.nextUrl.hostname;
  return u.protocol==="https:"&&u.hostname===hostname;
 }catch{return false}
}
async function forward(request:NextRequest,method:"GET"|"POST",body?:string){
 if(!validOrigin(request))return NextResponse.json({ok:false,error:"forbidden"},{status:403});
 try{
  const upstream=await fetch(EDGE_URL,{
   method,cache:"no-store",signal:AbortSignal.timeout(18000),
   headers:{
    "content-type":"application/json",
    "origin":"https://bernecki.dev",
    "x-forwarded-for":request.headers.get("x-vercel-forwarded-for")||
      request.headers.get("x-forwarded-for")||"unknown"
   },
   ...(body?{body}:{})
  });
  const data=await upstream.json().catch(()=>({ok:false,error:"invalid_response"}));
  return NextResponse.json(data,{status:upstream.status,headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({ok:false,error:"temporarily_unavailable"},{status:503})}
}
export async function GET(request:NextRequest){
 if(request.nextUrl.searchParams.get("challenge")!=="1")return NextResponse.json({ok:false},{status:404});
 return forward(request,"GET");
}
export async function POST(request:NextRequest){
 const type=request.headers.get("content-type")||"";
 if(!type.toLowerCase().startsWith("application/json"))return NextResponse.json({ok:false,error:"content_type"},{status:415});
 if(Number(request.headers.get("content-length"))>11000)return NextResponse.json({ok:false,error:"too_large"},{status:413});
 const body=await request.text();
 if(body.length>11000)return NextResponse.json({ok:false,error:"too_large"},{status:413});
 return forward(request,"POST",body);
}
