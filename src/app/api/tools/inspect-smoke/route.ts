import { NextRequest, NextResponse } from "next/server";
import { POST } from "../inspect/route";

export const runtime = "nodejs";
export const maxDuration = 45;

// Temporary preview-only smoke probe. Must be removed before merging.
export async function GET() {
  if(process.env.VERCEL_ENV==="production")return NextResponse.json({error:"Not available"},{status:404});
  const scenarios=[
    {mode:"site",url:"https://sagan.dev"},
    {mode:"seo",url:"https://bernecki.dev"},
    {mode:"redirects",url:"https://sagan.dev"},
    {mode:"tls",url:"https://sagan.dev"},
    {mode:"dns",url:"https://bernecki.dev"},
    {mode:"ai",url:"https://bernecki.dev"}
  ];
  const tests=[];
  for(const {mode,url} of scenarios){
    try{
      const req=new NextRequest("https://bernecki.dev/api/tools/inspect",{
        method:"POST",headers:{"content-type":"application/json","x-real-ip":"preview-toolbox-"+mode},
        body:JSON.stringify({mode,url})
      });
      const res=await POST(req);
      const json=await res.json();
      tests.push({mode,url,apiStatus:res.status,siteStatus:json.status,
        title:json.html?.title||null,redirects:json.redirects?.length??null,
        tlsAuthorized:json.tls?.authorized??null,spfCount:json.dns?.spf?.length??null,
        error:json.error||null});
    }catch(error){tests.push({mode,url,error:String(error)});}
  }
  return NextResponse.json({tests},{headers:{"cache-control":"no-store"}});
}
