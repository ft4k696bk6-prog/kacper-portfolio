export type PercentMode = "increase" | "decrease" | "part" | "difference";
export type SignatureFields = { name: string; role: string; company: string; email: string; phone: string; website: string; accent: string };

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
 const name=escapeHtml(s.name.trim()),role=escapeHtml(s.role.trim()),company=escapeHtml(s.company.trim());
 const email=escapeHtml(s.email.trim()),phone=escapeHtml(s.phone.trim()),website=escapeHtml(s.website.trim());
 const accent=/^#[0-9a-fA-F]{6}$/.test(s.accent)?s.accent:"#b7b7b7";
 const links:string[]=[];
 if(email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim())) links.push('<a href="mailto:'+encodeURI(s.email.trim())+'" style="color:#555555;text-decoration:none">'+email+'</a>');
 if(phone&&/^[+()\d\s-]+$/.test(s.phone.trim())) links.push('<a href="tel:'+s.phone.replace(/[^+\d]/g,"")+'" style="color:#555555;text-decoration:none">'+phone+'</a>');
 if(website){try{const u=new URL(s.website.startsWith("http")?s.website:"https://"+s.website);if(["https:","http:"].includes(u.protocol)) links.push('<a href="'+escapeHtml(u.href)+'" style="color:#555555;text-decoration:none">'+website+'</a>');}catch{/* Ignore invalid links */}}
 return '<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#171717"><tr>'+
 '<td style="border-left:3px solid '+accent+';padding:7px 16px">'+
 '<div style="font-size:17px;font-weight:700;line-height:1.35">'+(name||"Your name")+'</div>'+
 (role||company?'<div style="margin-top:3px;color:#505050">'+[role,company].filter(Boolean).join(" · ")+'</div>':"")+
 (links.length?'<div style="margin-top:11px;line-height:1.8">'+links.join(" &nbsp;|&nbsp; ")+'</div>':"")+
 '</td></tr></table>';
}
