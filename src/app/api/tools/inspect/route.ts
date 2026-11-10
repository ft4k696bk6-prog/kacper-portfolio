import { NextRequest, NextResponse } from "next/server";
import { lookup, resolveTxt } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { request as httpRequest } from "node:http";
import { connect as tlsConnect } from "node:tls";
import { isIP } from "node:net";

export const runtime = "nodejs";
export const maxDuration = 45;
const MAX_HTML = 900_000;
const visits = new Map<string,{hits:number; expires:number}>();
const deepVisits = new Map<string,{hits:number; expires:number}>();
function fullAuditAllowed(req:NextRequest) {
  const ip=req.headers.get("x-real-ip")||req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"anonymous";
  const now=Date.now();
  if(deepVisits.size>1200)for(const [key,value] of deepVisits)if(value.expires<now)deepVisits.delete(key);
  const current=deepVisits.get(ip);
  if(!current||current.expires<now){deepVisits.set(ip,{hits:1,expires:now+300_000});return true;}
  current.hits++;
  return current.hits<=3;
}

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
      method:"GET",
      // Node 22/24 calls custom lookup with all:true when autoSelectFamily is enabled.
      // Returning a plain IP in that mode causes ERR_INVALID_IP_ADDRESS: undefined.
      lookup:(_h,options,cb)=>{
        if(options.all) return cb(null,[{address:ip,family:4}]);
        return cb(null,ip,4);
      },
      headers:{"User-Agent":"bernecki.dev-toolbox/1.0","Accept":"text/html,text/plain,application/xml,text/xml;q=0.8,*/*;q=0.2"},
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

type AuditSeverity="critical"|"warning"|"info";
type AuditCategory="SEO"|"Wydajność"|"Dostępność"|"Bezpieczeństwo"|"Analityka"|"Indeksowanie"|"Domena";
type AuditIssue={id:string;severity:AuditSeverity;category:AuditCategory;title:string;detail:string;fix:string;page?:string};
type ScannedPage={url:string;status:number;ttfb:number;sizeKb:number;html:ReturnType<typeof inspectHtml>};
const MAX_CRAWLED_PAGES=7;

function gatherInternalLinks(html:string,pageUrl:string,hostname:string):string[]{
  const candidates:string[]=[];
  for(const match of html.matchAll(/<a\b[^>]*>/gi)){
    const href=attribute(match[0],"href");
    if(!href||href.startsWith("#")||/^(mailto|tel|javascript|data):/i.test(href))continue;
    try{
      const target=new URL(href,pageUrl);
      if(!["https:","http:"].includes(target.protocol)||target.hostname!==hostname||target.port||target.username||target.password)continue;
      target.hash="";target.search="";
      if(/\.(?:pdf|xml|json|jpg|jpeg|png|webp|gif|svg|webm|mp4|zip|css|js|txt|ico|woff2?)$/i.test(target.pathname))continue;
      candidates.push(target.href);
      if(candidates.length>=90)break;
    }catch{}
  }
  return [...new Set(candidates)];
}
function sitemapLocations(xml:string,hostname:string):string[]{
  const all:string[]=[];
  if(!/<(?:urlset|sitemapindex)(?:\s|>)/i.test(xml))return all;
  for(const match of xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)){
    if(all.length>=250)break;
    const decoded=match[1].replace(/&amp;/gi,"&").replace(/&#38;/g,"&").trim();
    try{
      const target=new URL(decoded);
      if(target.hostname!==hostname||!["https:","http:"].includes(target.protocol)||target.port||target.username||target.password)continue;
      target.hash="";target.search="";
      if(/\.(?:xml|gz|pdf|jpg|png|zip|js|css)$/i.test(target.pathname))continue;
      all.push(target.href);
    }catch{}
  }
  return [...new Set(all)];
}
function issueList(pages:ScannedPage[], extras:{
  tls?:{authorized:boolean;daysRemaining:number|null;authorizationError?:string};
  dns?:{spf:string[];dmarc:string[]};
  robots:boolean;sitemap:boolean;
}):AuditIssue[]{
  const out:AuditIssue[]=[];
  const append=(severity:AuditSeverity,category:AuditCategory,id:string,title:string,detail:string,fix:string,page?:string)=>{
    out.push({severity,category,id,title,detail,fix,page});
  };
  for(const page of pages){
    const h=page.html;
    const tag=page.url;
    if(page.status>=400)append("critical","Dostępność","http-"+tag,"Błąd odpowiedzi HTTP",`Serwer zwrócił status ${page.status}.`,"Sprawdź, czy podstrona istnieje i nie blokuje żądania.",tag);
    if(!h.title)append("critical","SEO","title-"+tag,"Brakuje znacznika title","W kodzie HTML nie znaleziono tytułu podstrony.","Dodaj unikalny, opisowy <title>.",tag);
    else if(h.title.length>70)append("warning","SEO","titlelength-"+tag,"Długi tytuł strony",`Title ma ${h.title.length} znaków.`,"Rozważ krótszy tytuł zachowujący główny temat podstrony.",tag);
    if(!h.description)append("warning","SEO","desc-"+tag,"Brakuje meta description","Nie wykryto opisu strony.","Dodaj unikalny opis zgodny z treścią podstrony.",tag);
    if(!h.headings.some(x=>x.level===1))append("warning","SEO","h1-"+tag,"Brakuje H1","W pobranym HTML nie znaleziono nagłówka H1.","Uzupełnij czytelny nagłówek główny.",tag);
    if(h.headings.filter(x=>x.level===1).length>1)append("info","SEO","h1multi-"+tag,"Wiele nagłówków H1",`Wykryto ${h.headings.filter(x=>x.level===1).length} nagłówki H1.`,"Sprawdź, czy hierarchia nagłówków jest logiczna.",tag);
    if(!h.canonical)append("warning","Indeksowanie","canonical-"+tag,"Brak canonical","Nie wykryto linku canonical.","Wskaż kanoniczny adres, jeśli jest to uzasadnione strukturą witryny.",tag);
    if(/\bnoindex\b/i.test(h.robots))append("critical","Indeksowanie","noindex-"+tag,"Dyrektywa noindex",`Meta robots zawiera: ${h.robots}.`,"Jeśli podstrona ma być indeksowana, zweryfikuj dyrektywę i ustawienia CMS.",tag);
    if(!h.lang)append("warning","Dostępność","lang-"+tag,"Brak języka dokumentu","Tag HTML nie zawiera atrybutu lang.","Dodaj właściwy język, np. lang=\"pl\".",tag);
    if(!h.hasViewport)append("warning","Dostępność","viewport-"+tag,"Brak viewport","Brak meta viewport w HTML.","Dodaj poprawny viewport na urządzenia mobilne.",tag);
    if(h.imagesMissingAlt>0)append("warning","Dostępność","alt-"+tag,"Obrazy bez atrybutu alt",`Wykryto ${h.imagesMissingAlt} obrazów bez alt na ${h.imageCount} elementów img.`,"Dodaj opisy do obrazów informacyjnych lub pusty alt do dekoracyjnych.",tag);
    if(page.ttfb>800)append("warning","Wydajność","ttfb-"+tag,"Wysoki TTFB pojedynczego żądania",`Czas pierwszej odpowiedzi wyniósł ${page.ttfb} ms.`,"Sprawdź cache, backend i czas odpowiedzi serwera; potwierdź wynik powtarzanym testem.",tag);
  }
  const first=pages[0]?.html;
  if(first&&!first.og.image)append("warning","SEO","og-image","Brak og:image na stronie startowej","Nie wykryto grafiki Open Graph.","Dodaj obraz do udostępniania linku.");
  if(first&&!first.tracking.gtm&&!first.tracking.ga4)append("info","Analityka","tags","Nie wykryto GTM ani GA4 w HTML","Tagi doładowywane przez JavaScript lub zgody mogą nie być widoczne.","Sprawdź instalację analityki w trybie testowym przeglądarki.");
  if(!extras.robots)append("info","Indeksowanie","robots","Nie potwierdzono robots.txt","Nie udało się pobrać publicznego robots.txt ze statusem 2xx.","Sprawdź ścieżkę /robots.txt i reguły dla crawlerów.");
  if(!extras.sitemap)append("warning","Indeksowanie","sitemap","Nie znaleziono poprawnej mapy sitemap.xml","Nie wykryto mapy pod adresem /sitemap.xml.","Sprawdź czy mapa istnieje i zgłoś ją w Search Console.");
  if(extras.tls){
    if(!extras.tls.authorized)append("critical","Bezpieczeństwo","tls","Nieprawidłowa weryfikacja certyfikatu TLS",extras.tls.authorizationError||"Certyfikat nie został zweryfikowany.","Sprawdź konfigurację certyfikatu i łańcuch zaufania.");
    else if(typeof extras.tls.daysRemaining==="number"&&extras.tls.daysRemaining<21)append("warning","Bezpieczeństwo","tls-expiring","Certyfikat wkrótce wygaśnie",`Pozostało ${extras.tls.daysRemaining} dni.`,"Skonfiguruj automatyczne odnawianie certyfikatu.");
  }
  if(extras.dns){
    if(!extras.dns.spf.length)append("warning","Domena","spf","Nie wykryto SPF","Brak publicznego rekordu SPF dla domeny.","Sprawdź ustawienia poczty i opublikuj prawidłowy SPF.");
    if(!extras.dns.dmarc.length)append("warning","Domena","dmarc","Nie wykryto DMARC","Brak publicznego rekordu DMARC.","Skonfiguruj DMARC zgodnie z dostawcą poczty.");
  }
  const names=new Map<string,string>();
  for(const p of pages){
    if(p.html.title){
      const other=names.get(p.html.title.toLowerCase().trim());
      if(other&&other!==p.url)append("warning","SEO","duplicate-title-"+p.url,"Powtarzający się title",`Ten sam title występuje też na ${other}.`,"Zadbaj o unikalny tytuł każdej podstrony.",p.url);
      else names.set(p.html.title.toLowerCase().trim(),p.url);
    }
  }
  return out.slice(0,110);
}
async function completeAudit(url:URL){
  const initial=await fetchPublic(url);
  if(initial.status>=400)throw new Error(`Podany adres zwrócił HTTP ${initial.status}. Nie można rozpocząć pełnego audytu.`);
  if(!/<html\b/i.test(initial.body))throw new Error("Adres nie zwrócił dokumentu HTML.");
  const final=new URL(initial.url);
  const root=final.origin;
  const hostname=final.hostname;
  const [robotsR,sitemapR,tlsR,dnsR]=await Promise.allSettled([
    fetchPublic(new URL("/robots.txt",root)),
    fetchPublic(new URL("/sitemap.xml",root)),
    checkTls(hostname),
    checkDns(hostname)
  ]);
  const robots=robotsR.status==="fulfilled"&&robotsR.value.status>=200&&robotsR.value.status<300&&
    /(?:user-agent|disallow|allow):/i.test(robotsR.value.body)?robotsR.value.body.slice(0,50000):"";
  const sitemap=sitemapR.status==="fulfilled"&&sitemapR.value.status>=200&&sitemapR.value.status<300&&
    /<(?:urlset|sitemapindex)(?:\s|>)/i.test(sitemapR.value.body)?sitemapR.value.body:"";
  // We do not bypass an explicit site-wide User-agent:* Disallow:/.
  const generalRules=robots.match(/(?:^|\n)\s*User-agent:\s*\*[\s\S]*?(?=\n\s*User-agent:|$)/i)?.[0]||"";
  const disallowAll=/^\s*Disallow:\s*\/\s*(?:#.*)?$/im.test(generalRules);
  const links=gatherInternalLinks(initial.body,initial.url,hostname);
  // Prefer a broad sample from different site sections, not the first 6 sitemap entries.
  const pool=[new URL("/",root).href,...links,...sitemapLocations(sitemap,hostname)]
    .filter((value,index,array)=>array.indexOf(value)===index&&value!==initial.url);
  const robotsRules=generalRules.split(/\r?\n/).map(v=>v.split("#")[0].trim());
  const allowedByRobots=(candidate:string)=>{
    const path=new URL(candidate).pathname;
    const rules=robotsRules.map(v=>v.match(/^(allow|disallow):\s*(.*)$/i)).filter(Boolean)
      .map(m=>({isAllow:m![1].toLowerCase()==="allow",path:m![2]}))
      .filter(m=>m.path&&path.startsWith(m.path));
    rules.sort((a,b)=>b.path.length-a.path.length||Number(b.isAllow)-Number(a.isAllow));
    return !rules.length||rules[0].isAllow;
  };
  const candidates:string[]=[];const sections=new Set<string>();
  for(const candidate of pool){
    if(!allowedByRobots(candidate))continue;
    const group=new URL(candidate).pathname.split("/").filter(Boolean)[0]||"/";
    if(!sections.has(group)){sections.add(group);candidates.push(candidate);}
    if(candidates.length>=MAX_CRAWLED_PAGES-1)break;
  }
  if(candidates.length<MAX_CRAWLED_PAGES-1)for(const candidate of pool){
    if(candidates.length>=MAX_CRAWLED_PAGES-1)break;
    if(!candidates.includes(candidate)&&allowedByRobots(candidate))candidates.push(candidate);
  }
  const pageData:ScannedPage[]=[{
    url:initial.url,status:initial.status,ttfb:initial.ttfb,sizeKb:Math.round(initial.bytes/1024*10)/10,
    html:inspectHtml(initial.body)
  }];
  const failed:{url:string;reason:string}[]=[];
  if(!disallowAll){
    // Small batches avoid placing excessive concurrent load on analyzed websites.
    for(let i=0;i<candidates.length;i+=3){
      const done=await Promise.allSettled(candidates.slice(i,i+3).map(u=>fetchPublic(new URL(u))));
      done.forEach((out,j)=>{
        const target=candidates[i+j];
        if(out.status==="fulfilled"){
          const response=out.value;
          if(new URL(response.url).hostname!==hostname){failed.push({url:target,reason:"Przekierowano poza badaną domenę."});return;}
          if(!/<html\b/i.test(response.body)){failed.push({url:target,reason:"Nie zwrócono HTML."});return;}
          pageData.push({url:response.url,status:response.status,ttfb:response.ttfb,
            sizeKb:Math.round(response.bytes/1024*10)/10,html:inspectHtml(response.body)});
        }else{failed.push({url:target,reason:out.reason instanceof Error?out.reason.message:"Błąd pobierania"});}
      });
    }
  }
  const tls=tlsR.status==="fulfilled"?tlsR.value as {authorized:boolean;daysRemaining:number|null;authorizationError?:string;validTo:string;issuer:string;protocol:string}:null;
  const dns=dnsR.status==="fulfilled"?dnsR.value:null;
  const issues=issueList(pageData,{tls:tls||undefined,dns:dns||undefined,robots:Boolean(robots),sitemap:Boolean(sitemap)});
  const main=pageData[0].html;
  return {
    requestedUrl:url.toString(),url:initial.url,host:hostname,analyzedAt:new Date().toISOString(),
    pages:pageData,failedPages:failed,requestedPageLimit:MAX_CRAWLED_PAGES,
    issues,summary:{
      critical:issues.filter(v=>v.severity==="critical").length,
      warning:issues.filter(v=>v.severity==="warning").length,
      info:issues.filter(v=>v.severity==="info").length,
      scanned:pageData.length,foundPages:candidates.length+1,
      totalImages:pageData.reduce((a,p)=>a+p.html.imageCount,0),
      imagesMissingAlt:pageData.reduce((a,p)=>a+p.html.imagesMissingAlt,0),
      meanTTFB:Math.round(pageData.reduce((a,p)=>a+p.ttfb,0)/pageData.length)
    },
    technical:{
      robots:{present:Boolean(robots),url:root+"/robots.txt",sample:robots.slice(0,1800),crawlingRestricted:disallowAll},
      sitemap:{present:Boolean(sitemap),url:root+"/sitemap.xml",discoveredUrls:sitemapLocations(sitemap,hostname).length,
        isIndex:/<sitemapindex(?:\s|>)/i.test(sitemap)},
      securityHeaders:initial.headers,
      redirects:initial.redirects,
      tls, dns,
      tags:{metaPixel:main.tracking.metaPixel,gtm:main.tracking.gtm,ga4:main.tracking.ga4}
    },
    limitations:[
      "Automatycznie sprawdzono maksymalnie 7 publicznych podstron tej samej domeny; nie jest to kompletny crawl witryny.",
      "Audyt opiera się na HTML zwracanym przez serwer, nie wykonuje JavaScriptu w przeglądarce.",
      "TTFB to pojedynczy pomiar serwerowy, nie wynik Google PageSpeed ani Core Web Vitals.",
      "Nie sprawdzono pozycji SEO, indeksacji w Google, polityki cookies, faktycznej poprawności Pixel/CAPI ani wszystkich kryteriów WCAG."
    ]
  };
}

export async function POST(req:NextRequest){
  if(limited(req))return NextResponse.json({error:"Limit 12 analiz na minutę. Spróbuj ponownie później."},{status:429});
  try{
    const body=await req.json() as {url?:unknown;mode?:unknown};
    if(typeof body.url!=="string"||!["site","seo","meta","headings","og","ai","tls","dns","ttfb","redirects","headers","pixel","gtm","images","full"].includes(String(body.mode)))throw new Error("Nieprawidłowe dane.");
    const url=parseTarget(body.url);
    if(body.mode==="full"){
      if(!fullAuditAllowed(req))return NextResponse.json({error:"Limit pełnych audytów: 3 na 5 minut. Spróbuj ponownie później."},{status:429});
      const result=await completeAudit(url);
      return NextResponse.json(result,{headers:{"cache-control":"no-store"}});
    }
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
