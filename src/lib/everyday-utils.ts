export type PercentMode = "increase" | "decrease" | "part" | "difference";
export type SignatureLayout = "side" | "stacked" | "compact";
export type SignatureFields = { name: string; role: string; company: string; email: string; phone: string; website: string; accent: string; logo?: string; logoWidth?: number; layout?: SignatureLayout; language?: "pl" | "en" };

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

export function signatureHtml(s:SignatureFields):string {
 const name=escapeHtml(s.name.trim())||(s.language==="en"?"Your name":"Imię i nazwisko");
 const role=escapeHtml(s.role.trim()),company=escapeHtml(s.company.trim());
 const email=escapeHtml(s.email.trim()),phone=escapeHtml(s.phone.trim()),website=escapeHtml(s.website.trim());
 const accent=/^#[0-9a-fA-F]{6}$/.test(s.accent)?s.accent:"#b7b7b7";
 const lineColor="#d9d9d9", muted="#555555";
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
 const details='<div style="font-size:11px;line-height:17px;letter-spacing:0.5px;color:'+muted+'">'+
  [role,company].filter(Boolean).join(" &nbsp;·&nbsp; ")+'</div>';
 const contacts=links.length?'<div style="padding-top:9px;font-size:12px;line-height:20px;color:#505050">'+links.join(' &nbsp;<span style="color:#a0a0a0">·</span>&nbsp; ')+'</div>':"";
 const content='<div style="font-size:17px;line-height:23px;font-weight:700;color:#171717">'+name+'</div>'+
  (role||company?'<div style="padding-top:3px">'+details+'</div>':"")+contacts;
 const layout=s.layout||"side";
 const base='role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#171717"';
 if(layout==="stacked"){
  return '<table '+base+'><tbody><tr><td style="padding:0 0 13px 0">'+(logo?logo:'<span style="font-size:12px;font-weight:700;letter-spacing:1px;color:'+accent+'">'+company+'</span>')+
   '</td></tr><tr><td style="border-top:3px solid '+accent+';padding:13px 2px 0 0">'+content+'</td></tr></tbody></table>';
 }
 if(layout==="compact"){
  return '<table '+base+'><tbody><tr><td style="vertical-align:middle;padding:4px 20px 4px 0;border-bottom:2px solid '+accent+'">'+content+
   '</td>'+(logo?'<td style="vertical-align:middle;padding:4px 0 4px 14px;border-bottom:2px solid '+accent+'">'+logo+'</td>':"")+'</tr></tbody></table>';
 }
 return '<table '+base+'><tbody><tr>'+(logo?'<td style="vertical-align:middle;padding:5px 17px 5px 0">'+logo+'</td>':"")+
  '<td style="vertical-align:middle;border-left:3px solid '+accent+';padding:7px 0 7px 16px">'+content+'</td></tr></tbody></table>';
}
