import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema=z.object({
 name:z.string().trim().min(2).max(90),
 email:z.string().trim().email().max(160),
 company:z.string().trim().max(100).optional().default(""),
 service:z.string().trim().max(100),
 message:z.string().trim().min(12).max(3000),
 website:z.string().trim().max(200).optional().default(""),
 turnstileToken:z.string().trim().max(3000).optional().default("")
});
const hits=new Map<string,{count:number,until:number}>();
function rateLimited(req:NextRequest){
 const ip=req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()||
   req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown";
 const now=Date.now();
 for(const [k,v] of hits){if(v.until<now)hits.delete(k)}
 if(hits.size>3000&&!hits.has(ip))return true;
 const v=hits.get(ip);const entry=!v||v.until<now?{count:1,until:now+60*60*1000}:{count:v.count+1,until:v.until};
 hits.set(ip,entry);
 return entry.count>3;
}
async function checkHuman(token:string){
 const secret=process.env.TURNSTILE_SECRET_KEY?.trim();
 if(!secret||!token)return false;
 const body=new FormData();body.append("secret",secret);body.append("response",token);
 try{
  const res=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body,signal:AbortSignal.timeout(6000)});
  const json=(await res.json()) as {success?:boolean};
  return Boolean(res.ok&&json.success);
 }catch{return false}
}
const esc=(v:string)=>v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]??c));

export async function POST(req:NextRequest){
 if(Number(req.headers.get("content-length"))>12000)return NextResponse.json({message:"Too large"},{status:413});
 if(rateLimited(req))return NextResponse.json({message:"Too many requests"},{status:429});
 const parsed=schema.safeParse(await req.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({message:"Invalid form"},{status:400});
 const d=parsed.data;
 if(d.website)return NextResponse.json({ok:true});
 const apiKey=process.env.RESEND_API_KEY?.trim();
 // Fail closed if provider or bot protection isn't configured; client offers honest mailto fallback.
 if(!apiKey||!process.env.TURNSTILE_SECRET_KEY?.trim()||!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim()){
  return NextResponse.json({message:"Email delivery not configured"},{status:503});
 }
 if(!(await checkHuman(d.turnstileToken)))return NextResponse.json({message:"Bot verification failed"},{status:403});
 const from=process.env.CONTACT_EMAIL_FROM?.trim()||"Portfolio <kontakt@bernecki.dev>";
 const to=process.env.CONTACT_EMAIL_TO?.trim()||"kacper@bernecki.dev";
 try{
  const result=await fetch("https://api.resend.com/emails",{
   method:"POST",signal:AbortSignal.timeout(9000),
   headers:{"Authorization":`Bearer ${apiKey}`,"Content-Type":"application/json"},
   body:JSON.stringify({
    from,to:[to],reply_to:d.email,
    subject:"Nowe zapytanie z bernecki.dev — "+d.service,
    html:"<h2>Nowe zapytanie z portfolio</h2>"+
      "<p><b>Imię:</b> "+esc(d.name)+"</p>"+
      "<p><b>E-mail:</b> "+esc(d.email)+"</p>"+
      "<p><b>Firma:</b> "+esc(d.company||"—")+"</p>"+
      "<p><b>Usługa:</b> "+esc(d.service)+"</p>"+
      "<p><b>Wiadomość:</b><br>"+esc(d.message).replace(/\n/g,"<br>")+"</p>",
    text:`Imię: ${d.name}\nEmail: ${d.email}\nFirma: ${d.company}\nUsługa: ${d.service}\n\n${d.message}`
   })
  });
  if(!result.ok)return NextResponse.json({message:"Delivery failed"},{status:502});
  return NextResponse.json({ok:true},{headers:{"Cache-Control":"no-store"}});
 }catch{
  return NextResponse.json({message:"Delivery failed"},{status:502});
 }
}
