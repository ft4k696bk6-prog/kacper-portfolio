import { NextResponse } from "next/server";
export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(){
 if(process.env.VERCEL_ENV!=="preview")return NextResponse.json({error:"Not found"},{status:404});
 const url="https://s0.wp.com/mshots/v1/https%3A%2F%2Fbernecki.dev?vpw=1440&vph=1050&w=1200&requeue=true";
 try{
  const response=await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(19000)});
  if(!response.ok)return NextResponse.json({error:"screenshot_status",status:response.status},{status:502});
  const type=response.headers.get("content-type")||"";
  const bytes=Buffer.from(await response.arrayBuffer());
  if(!type.startsWith("image/")||bytes.length<10000||bytes.length>3000000)return NextResponse.json({error:"invalid_capture",type,bytes:bytes.length},{status:502});
  return NextResponse.json({type,bytes:bytes.length,base64:bytes.toString("base64")},{headers:{"Cache-Control":"no-store"}});
 }catch(error){return NextResponse.json({error:"capture_failed",kind:error instanceof Error?error.name:"unknown"},{status:502})}
}