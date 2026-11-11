export type PercentMode = "increase" | "decrease" | "part" | "difference";
export type SignatureLayout = "side" | "stacked" | "compact";
export type SignatureSocial = "facebook" | "linkedin" | "instagram" | "youtube" | "tiktok" | "x" | "github" | "whatsapp" | "calendar";
export type SignatureFields = { name: string; role: string; company: string; email: string; phone: string; website: string; accent: string; logo?: string; photo?: string; photoFocusX?: number; photoFocusY?: number; logoWidth?: number; layout?: SignatureLayout; language?: "pl" | "en"; socials?: Partial<Record<SignatureSocial,string>>; animationUrl?: string; animationStyle?: "geometry"|"slices"|"cinematic"|"reveal"|"slide"|"pulse" };

export function parseNumber(value: string): number {
  const compact=value.trim().replace(/\s/g,"").replace(/,/g,".");
  if (!compact || !/^-?\d+(?:\.\d+)?$/.test(compact)) return NaN;
  return Number(compact);
}

export function percentage(base: number, rate: number, mode: PercentMode): number {
  if (!Number.isFinite(base)||!Number.isFinite(rate)) return NaN;
  if(mode==="increase")return base*(1+rate/100);
  if(mode==="decrease")return base*(1-rate/100);
  if(mode==="part")return base*rate/100;
  if(base===0)return NaN;
  return (rate-base)/Math.abs(base)*100;
}

export function cleanText(input: string): string {
  return input.replace(/\r\n?/g,"\n").replace(/[\u200B-\u200D\uFEFF\u2060]/g,"")
   .split("\n").map(line=>line.replace(/[ \t\u00a0]+/g," ").trim()).join("\n").replace(/\n{3,}/g,"\n\n").trim();
}

export function dedupeLines(input: string): string {
  const seen=new Set<string>();
  return input.split(/\r?\n/).filter(line=>{const k=line.trim().toLocaleLowerCase();if(!k||seen.has(k))return false;seen.add(k);return true;}).join("\n");
}

export function randomIndex(max: number): number {
  if (!Number.isInteger(max)||max<1||max>65536) throw new Error("Invalid range");
  const limit=Math.floor(0x100000000/max)*max;
  const data=new Uint32Array(1);
  do {crypto.getRandomValues(data);} while(data[0]>=limit);
  return data[0]%max;
}

export function password(length:number, groups:string[]): string {
  if(!Number.isInteger(length)||length<8||length>64||!groups.length||groups.some(g=>!g)||groups.length>length)throw new Error("Invalid settings");
  const alphabet=groups.join("");
  const result=groups.map(g=>g[randomIndex(g.length)]);
  while(result.length<length)result.push(alphabet[randomIndex(alphabet.length)]);
  for(let i=result.length-1;i>0;i--){const j=randomIndex(i+1);[result[i],result[j]]=[result[j],result[i]];}
  return result.join("");
}

export function pickRandom(lines:string):string {
 const values=lines.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 return values.length?values[randomIndex(values.length)]:"";
}

export function escapeHtml(value:string):string {
 return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}


export const SIGNATURE_SOCIALS:{id:SignatureSocial;name:string;short:string}[]=[
 {id:"facebook",name:"Facebook",short:"f"},
 {id:"linkedin",name:"LinkedIn",short:"in"},
 {id:"instagram",name:"Instagram",short:"ig"},
 {id:"youtube",name:"YouTube",short:"YT"},
 {id:"tiktok",name:"TikTok",short:"TT"},
 {id:"x",name:"X / Twitter",short:"X"},
 {id:"github",name:"GitHub",short:"GH"},
 {id:"whatsapp",name:"WhatsApp",short:"WA"},
 {id:"calendar",name:"Kalendarz / Booking",short:"↗"}
];
/** Public rasterized icons (PNG) for compatibility with Gmail, Outlook and Apple Mail. */
export function signatureSocialIconUrl(id:SignatureSocial):string {
 return "https://bernecki.dev/api/signature-icon/"+id;
}

export function signatureSafeLink(input:string):string {
 try {
  const raw=input.trim();
  if(!raw||/\s/.test(raw)||raw.length>1800)return "";
  const url=new URL(/^https?:\/\//i.test(raw)?raw:"https://"+raw);
  return url.protocol==="https:"&&!url.username&&!url.password&&url.hostname.includes(".")?url.href:"";
 }catch{return "";}
}

export function signatureHtml(s:SignatureFields):string {
 const name=escapeHtml(s.name.trim())||(s.language==="en"?"Your name":"Imię i nazwisko");
 const role=escapeHtml(s.role.trim()),company=escapeHtml(s.company.trim());
 const email=escapeHtml(s.email.trim()),phone=escapeHtml(s.phone.trim()),website=escapeHtml(s.website.trim());
 const accent=/^#[0-9a-fA-F]{6}$/.test(s.accent)?s.accent:"#b7b7b7";
 const muted="#555555";
 const links:string[]=[];
 if(email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) {
  links.push('<a href="mailto:'+escapeHtml("mailto:"+s.email.trim()).replace(/^mailto:/,"")+'" style="color:#505050;text-decoration:none">'+email+'</a>');
 }
 if(phone&&/^[+()\d\s-]+$/.test(s.phone.trim())) {
  links.push('<a href="tel:'+escapeHtml(s.phone.replace(/[^\d+]/g,""))+'" style="color:#505050;text-decoration:none">'+phone+'</a>');
 }
 if(website){try{
  const raw=s.website.trim(),url=new URL(/^https?:\/\//i.test(raw)?raw:"https://"+raw);
  if(["https:","http:"].includes(url.protocol)&&!url.username&&!url.password)links.push('<a href="'+escapeHtml(url.href)+'" style="color:#505050;text-decoration:none">'+website+'</a>');
 }catch{/* Ignore invalid URLs */}}
 let logoSrc="";
 const rawLogo=(s.logo||"").trim();
 if(/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i.test(rawLogo)&&rawLogo.length<=500000){
  logoSrc=rawLogo;
 }else if(rawLogo){try{
  const url=new URL(rawLogo);
  if(url.protocol==="https:"&&!url.username&&!url.password&&url.href.length<=2000)logoSrc=url.href;
 }catch{/* Unsupported logo URL */}}
 const logoWidth=Math.max(60,Math.min(180,Math.round(Number(s.logoWidth)||110)));
 const logo=logoSrc?'<img src="'+escapeHtml(logoSrc)+'" width="'+logoWidth+'" alt="'+escapeHtml(s.company.trim()||"Logo")+'" style="display:block;width:'+logoWidth+'px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none" />':"";
 const socialAnchors=SIGNATURE_SOCIALS.flatMap(item=>{
  const url=signatureSafeLink(s.socials?.[item.id]||"");
  return url?['<td style="padding:9px 7px 0 0"><a href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer" title="'+escapeHtml(item.name)+'" style="display:inline-block;padding:5px;background:#fff;border:1px solid #dedede;border-radius:5px;text-decoration:none"><img src="'+signatureSocialIconUrl(item.id)+'" width="22" height="22" alt="'+escapeHtml(item.name)+'" style="display:block;width:22px;height:22px;border:0;outline:none" /></a></td>']:[];
 });
 const socialRow=socialAnchors.length?'<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tbody><tr>'+socialAnchors.join("")+'</tr></tbody></table>':"";
 const details='<div style="font-size:11px;line-height:17px;letter-spacing:0.5px;color:'+muted+'">'+
  [role,company].filter(Boolean).join(" &nbsp;·&nbsp; ")+'</div>';
 const contacts=links.length?'<div style="padding-top:9px;font-size:12px;line-height:20px;color:#505050">'+links.join(' &nbsp;<span style="color:#a0a0a0">·</span>&nbsp; ')+'</div>':"";
 const content='<div style="font-size:17px;line-height:23px;font-weight:700;color:#171717">'+name+'</div>'+
  (role||company?'<div style="padding-top:3px">'+details+'</div>':"")+contacts+socialRow;
 const layout=s.layout||"side";
 const base='role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#171717"';
 const animation=(s.animationUrl||"").trim();
 const animationSrc=signatureSafeLink(animation)||
  (/^data:image\/gif;base64,[A-Za-z0-9+/=]+$/i.test(animation)&&animation.length<7000000?animation:"");
 if(animationSrc){
  const alt=[s.name,s.role,s.company,s.email].filter(Boolean).join(" · ");
  const premium=["geometry","slices","cinematic"].includes(s.animationStyle||"");
  if(premium){
   const valid=SIGNATURE_SOCIALS.flatMap(item=>{
    const href=signatureSafeLink(s.socials?.[item.id]||"");
    return href?[{item,href}]:[];
   });
   const rail=valid.slice(0,6).map(({item,href})=>
    '<tr><td align="center" style="padding:0 0 6px"><a href="'+escapeHtml(href)+'" title="'+escapeHtml(item.name)+'" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:5px;border:1px solid #e2e0e4;border-radius:5px;background:#fff;text-decoration:none"><img src="'+signatureSocialIconUrl(item.id)+'" width="22" height="22" alt="'+escapeHtml(item.name)+'" style="display:block;width:22px;height:22px;border:0;outline:none"/></a></td></tr>'
   ).join("");
   const leftover=valid.slice(6).map(({item,href})=>
    '<a href="'+escapeHtml(href)+'" title="'+escapeHtml(item.name)+'" style="display:inline-block;margin:4px 8px 0 0;padding:5px;background:#fff;border:1px solid #e2e0e4;border-radius:5px;text-decoration:none"><img src="'+signatureSocialIconUrl(item.id)+'" width="22" height="22" alt="'+escapeHtml(item.name)+'" style="display:block;width:22px;height:22px;border:0;outline:none"/></a>'
   ).join("");
   return '<table '+base+' width="578" style="border:1px solid #dedbe1;border-collapse:separate;border-spacing:0;border-radius:9px;background:#fff;font-family:Arial,Helvetica,sans-serif"><tbody><tr>'+
    '<td width="56" valign="middle" style="width:56px;padding:12px 6px;background:#faf9fb;border-right:1px solid #e5e3e8"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tbody>'+
    '<tr><td align="center" style="padding:0 0 13px;font-size:16px;font-weight:700;color:'+accent+'">'+escapeHtml((s.company.trim()||s.name.trim()||"B").slice(0,1).toUpperCase())+'</td></tr>'+
    rail+'</tbody></table></td>'+
    '<td width="520" valign="middle" style="padding:0;background:#fff">'+
    '<img src="'+escapeHtml(animationSrc)+'" alt="'+escapeHtml(alt)+'" width="520" height="208" style="display:block;width:520px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none"/></td></tr>'+
    ((links.length||leftover)?'<tr><td colspan="2" style="border-top:1px solid #e9e8eb;padding:8px 12px;font-size:11px;line-height:20px;color:#555">'+links.join(' &nbsp;·&nbsp; ')+(leftover?'<div>'+leftover+'</div>':"")+'</td></tr>':"")+
    '</tbody></table>';
  }
  return '<table '+base+'><tbody><tr><td><img src="'+escapeHtml(animationSrc)+'" width="520" alt="'+escapeHtml(alt)+'" style="display:block;width:520px;max-width:100%;height:auto;border:0" /></td></tr>'+
   (links.length?'<tr><td style="padding-top:8px;font-size:11px;line-height:19px">'+links.join(' &nbsp;·&nbsp; ')+'</td></tr>':"")+
   (socialRow?'<tr><td>'+socialRow+'</td></tr>':"")+'</tbody></table>';
 }
 if(layout==="stacked"){
  const brand=logo||'<span style="font-size:14px;font-weight:700;letter-spacing:1px;color:#191919">'+(company||"BRAND")+'</span>';
  return '<table '+base+'><tbody><tr><td style="padding:16px 20px 18px;background-color:#fafafa;border:1px solid #dedede;border-radius:7px">'+
   '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tbody>'+
   '<tr><td style="padding:0 0 13px">'+brand+'</td></tr>'+
   '<tr><td style="border-top:3px solid '+accent+';padding:14px 0 0">'+content+'</td></tr>'+
   '</tbody></table></td></tr></tbody></table>';
 }
 if(layout==="compact"){
  return '<table '+base+'><tbody>'+
   (company?'<tr><td colspan="2" style="padding:0 0 10px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:'+accent+'">'+company+'</td></tr>':"")+
   '<tr><td style="vertical-align:middle;padding:6px 22px 12px 0;border-bottom:2px solid '+accent+'">'+content+
   '</td>'+(logo?'<td style="vertical-align:middle;padding:6px 0 12px 14px;border-bottom:2px solid '+accent+'">'+logo+'</td>':"")+'</tr>'+
   '</tbody></table>';
 }
 return '<table '+base+'><tbody><tr>'+(logo?'<td style="vertical-align:middle;padding:5px 17px 5px 0">'+logo+'</td>':"")+
  '<td style="vertical-align:middle;border-left:3px solid '+accent+';padding:7px 0 7px 16px">'+content+'</td></tr></tbody></table>';
}
