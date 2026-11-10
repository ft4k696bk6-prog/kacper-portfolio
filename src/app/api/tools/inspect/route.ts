import { NextRequest, NextResponse } from "next/server";
import { lookup, resolveTxt } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";
import { connect as tlsConnect } from "node:tls";
import { isIP } from "node:net";

export const runtime = "nodejs";
export const maxDuration = 20;
const MAX_HTML = 900_000;
const visits = new Map<string,{hits:number; expires:number}>();

function limited(req:NextRequest) {
  const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  const now=Date.now();
  if(visits.size>1500) for(const [key,v] of visits) if(v.expires<now) visits.delete(key);
  const entry=visits.get(ip);
  if(!entry||entry.expires<now){visits.set(ip,{hits:1,expires:now+60_000});return false;}
  entry.hits++; return entry.hits>12;
}
function publicIP(address:string) {
  const v=address.split(".").map(Number);
  if(v.length!==4||v.some(n=>!Number.isInteger(n)||n<0||n>255))return false;
  const [a,b,c]=v;
  if(a===0||a===10||a===127||a>=224||a===169&&b===254||a===100&&b>=64&&b<=127||
  a===172&&b>=16&&b<=31||a===192&&(b===168||b===0||b===88&&c===99)||
  a===198&&(b===18||b===19||b===51&&c===100)||a===203&&b===0&&c===113||
  a===192&&b===0&&c===2)return false;
  return true;
}
function parseTarget(value:string) {
  const raw=value.trim();
  if(!raw||raw.length>2048||/[\r\n\\]/.test(raw))throw new Error("Podaj poprawny adres strony.");
  const url=new URL(/^https?:\/\//i.test(raw)?raw:"https://"+raw);
  const host=url.hostname.toLowerCase().replace(/\.$/,"");
  if(!["http:","https:"].includes(url.protocol)||url.username||url.password||!host||host.length>253||
     isIP(host)!==0||!host.includes(".")||!/^([a-z0-9-]+\.)+[a-z0-9-]{2,}$/i.test(host)||
     /\.(localhost|local|internal|test|invalid|example)$/i.test(host)||!["","80","443"].includes(url.port)) {
    throw new Error("Można sprawdzać tylko publiczne domeny HTTP/HTTPS bez niestandardowych portów.");
  }
  return url;
}
async function safeAddress(host:string){
  const found=await lookup(host,{family:4,all:true,verbatim:true});
  if(!found.length||found.some(v=>!publicIP(v.address)))throw new Error("Domena nie wskazuje na dozwolony publiczny adres IP.");
  return found[0].address;
}
type RedirectInfo={from:string;to:string;status:number};
type HttpHeaders=Record<string,string>;
async function fetchPublic(url:URL,redirects=0,chain:RedirectInfo[]=[]):Promise<{status:number;url:string;body:string;bytes:number;ttfb:number; contentType:string; redirects:RedirectInfo[];headers:HttpHeaders}>{
  if(redirects>3)throw new Error("Zbyt wiele przekierowań.");
  const ip=await safeAddress(url.hostname);
  const started=Date.now();
  const response=await new Promise<{status:number;location:string;body:string;bytes:number;ttfb:number;contentType:string;headers:HttpHeaders}>((resolve,reject)=>{
    const req=(url.protocol==="https:"?httpsRequest:httpRequest)(url,{
      method:"GET",lookup:(_h,_o,cb)=>cb(null,ip,4),headers:{"User-Agent":"bernecki.dev-toolbox/1.0","Accept":"text/html,text/plain,application/xml,text/xml;q=0.8,*/*;q=0.2"},
      timeout:8000
    },res=>{
      const status=res.statusCode||0;
      const type=String(res.headers["content-type"]||"");
      const location=String(res.headers.location||"");
      const ttfb=Date.now()-started;
      const headers:HttpHeaders={};
      for(const name of ["content-security-policy","strict-transport-security","x-content-type-options","referrer-policy","permissions-policy","x-frame-options","cache-control","server","content-type"]){
        const value=res.headers[name];
        if(value)headers[name]=Array.isArray(value)?value.join(", "):value;
      }
      if(status>=300&&status<400&&location){res.resume();return resolve({status,location,body:"",bytes:0,ttfb,contentType:type,headers});}
      if(!/text\/html|text\/plain|xml|application\/xhtml\+xml/i.test(type)&&type) {
        res.resume();return reject(new Error("Podany adres nie zwraca dokumentu HTML ani tekstu."));
      }
      const chunks:Buffer[]=[];let total=0;let ended=false;
      res.on("data",(chunk:Buffer)=>{
        total+=chunk.length;
        if(total>MAX_HTML){ended=true;req.destroy(new Error("Dokument jest zbyt duży do szybkiego testu (limit 900 kB)."));return;}
        chunks.push(chunk);
      });
      res.on("end",()=>{if(!ended)resolve({status,location,body:Buffer.concat(chunks).toString("utf8"),bytes:total,ttfb,contentType:type,headers});});
      res.on("error",reject);
    });
    req.on("timeout",()=>req.destroy(new Error("Serwer nie odpowiedział w ciągu 8 sekund.")));
    req.on("error",reject);
    req.end();
  });
  if(response.location){
    const redirect=parseTarget(new URL(response.location,url).toString());
    return fetchPublic(redirect,redirects+1,[...chain,{from:url.toString(),to:redirect.toString(),status:response.status}]);
  }
  return {status:response.status,url:url.toString(),body:response.body,bytes:response.bytes,ttfb:response.ttfb,contentType:response.contentType,headers:response.headers,redirects:chain};
}
function clean(s:string){return s.replace(/<[^>]*>/g," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/\s+/g," ").trim().slice(0,280);}
function attribute(tag:string,name:string){
  const re=new RegExp("(?:\\s|<)"+name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))","i");
  const m=tag.match(re);return m?(m[1]??m[2]??m[3]??""):"";
}
function inspectHtml(html:string){
  const title=clean(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||"");
  const tags=html.match(/<meta\b[^>]*>/gi)||[];
  const links=html.match(/<link\b[^>]*>/gi)||[];
  const meta=(name:string)=>clean(tags.map(tag=>({key:attribute(tag,"name")||attribute(tag,"property"),value:attribute(tag,"content")})).find(v=>v.key.toLowerCase()===name.toLowerCase())?.value||"");
  const headings=(html.match(/<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>/gi)||[]).slice(0,70).map(v=>({level:Number(v[2]),text:clean(v.replace(/<h[1-6]\b[^>]*>|<\/h[1-6]>/gi,""))}));
  const canonical=links.find(v=>attribute(v,"rel").toLowerCase().split(/\s+/).includes("canonical"));
  const lang=attribute(html.match(/<html\b[^>]*>/i)?.[0]||"","lang");
  const images=html.match(/<img\b[^>]*>/gi)||[];
  return {
    title,description:meta("description"),robots:meta("robots"),canonical:canonical?attribute(canonical,"href"):"",
    lang,headings,og:{title:meta("og:title"),description:meta("og:description"),image:meta("og:image"),type:meta("og:type")},
    twitter:meta("twitter:card"),jsonLdCount:(html.match(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/gi)||[]).length,
    imageCount:images.length,imagesMissingAlt:images.filter(v=>!/(?:\s|<)alt\s*=/i.test(v)).length,
    linkCount:(html.match(/<a\b[^>]*href\s*=/gi)||[]).length, hasViewport:tags.some(v=>attribute(v,"name").toLowerCase()==="viewport"),
    tracking:{
      metaPixel:/fbevents\.js|fbq\s*\(/i.test(html),
      gtm:/googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{5,}/i.test(html),
      ga4:/googletagmanager\.com\/gtag\/js|G-[A-Z0-9]{7,}/i.test(html)
    }
  };
}
async function checkTls(hostname:string){
  const ip=await safeAddress(hostname);
  return new Promise((resolve,reject)=>{
    const sock=tlsConnect({host:ip,port:443,servername:hostname,rejectUnauthorized:false,timeout:7000},()=>{
      const cert=sock.getPeerCertificate();
      const result={authorized:sock.authorized,authorizationError:String(sock.authorizationError||""),subject:cert.subject?.CN||"",issuer:cert.issuer?.O||cert.issuer?.CN||"",validFrom:cert.valid_from||"",validTo:cert.valid_to||"",protocol:sock.getProtocol()||"",daysRemaining:cert.valid_to?Math.floor((Date.parse(cert.valid_to)-Date.now())/86400000):null};
      sock.end();resolve(result);
    });
    sock.on("timeout",()=>sock.destroy(new Error("Połączenie TLS przekroczyło limit czasu.")));
    sock.on("error",reject);
  });
}
async function checkDns(domain:string){
  const query=async(name:string)=>{try{return (await resolveTxt(name)).map(parts=>parts.join("")).slice(0,40);}catch{return [] as string[];}};
  const [root,dmarc]=await Promise.all([query(domain),query("_dmarc."+domain)]);
  return {spf:root.filter(v=>v.toLowerCase().startsWith("v=spf1")),dmarc:dmarc.filter(v=>v.toUpperCase().startsWith("V=DMARC1")),txtCount:root.length,notes:[
    ...(!root.some(v=>v.toLowerCase().startsWith("v=spf1"))?["Brak rekordu SPF."]:[]),
    ...(root.filter(v=>v.toLowerCase().startsWith("v=spf1")).length>1?["Wykryto więcej niż jeden rekord SPF."]:[]),
    ...(!dmarc.some(v=>v.toUpperCase().startsWith("V=DMARC1"))?["Brak rekordu DMARC."]:[])
  ]};
}
export async function POST(req:NextRequest){
  if(limited(req))return NextResponse.json({error:"Limit 12 analiz na minutę. Spróbuj ponownie później."},{status:429});
  try{
    const body=await req.json() as {url?:unknown;mode?:unknown};
    if(typeof body.url!=="string"||!["site","seo","meta","headings","og","ai","tls","dns","ttfb","redirects","headers","pixel","gtm","images"].includes(String(body.mode)))throw new Error("Nieprawidłowe dane.");
    const url=parseTarget(body.url);
    if(body.mode==="tls")return NextResponse.json({host:url.hostname,tls:await checkTls(url.hostname)});
    if(body.mode==="dns")return NextResponse.json({host:url.hostname,dns:await checkDns(url.hostname)});
    const page=await fetchPublic(url);
    const report={...page,body:undefined,html:inspectHtml(page.body)};
    if(body.mode!=="ai")return NextResponse.json(report);
    let robots="";
    try {robots=(await fetchPublic(new URL("/robots.txt",page.url))).body.slice(0,45000);}catch {robots="";}
    return NextResponse.json({...report,robots,robotsAvailable:Boolean(robots)});
  }catch(error){
    const message=error instanceof Error?error.message:"Nie udało się sprawdzić strony.";
    return NextResponse.json({error:message},{status:400});
  }
}
