import {escapeHtml} from "./everyday-utils";

export type SignatureTheme="minimal"|"executive"|"silver"|"card"|"border"|"dark";
export type ProSignature={
 name:string;job:string;company:string;email:string;phone:string;web:string;address:string;linkedin:string;
 logoUrl:string;color:string;theme:SignatureTheme;bolt:boolean;disclaimer:string
};
export const signatureDefaults:ProSignature={
 name:"",job:"",company:"",email:"",phone:"",web:"",address:"",linkedin:"",
 logoUrl:"",color:"#b7b7b7",theme:"silver",bolt:false,disclaimer:""
};
export function safeHttps(input:string):string{
 const value=input.trim();if(!value)return "";
 try{const uri=new URL(/^https?:\/\//i.test(value)?value:"https://"+value);
  return uri.protocol==="https:"?uri.toString():"";
 }catch{return "";}
}
export function advancedSignatureHtml(s:ProSignature):string{
 const esc=escapeHtml;
 const accent=/^#[0-9a-fA-F]{6}$/.test(s.color)?s.color:"#b7b7b7";
 const theme=s.theme;
 const dark=theme==="dark";
 const fg=dark?"#f5f5f5":"#171717",sub=dark?"#c1c1c1":"#555555",bg=dark?"#171717":"#ffffff";
 const divider=theme==="executive"||theme==="border"?"border-left:4px solid "+accent+";":"";
 const background=theme==="card"||dark?"background:"+bg+";padding:16px;border-radius:8px;":"";
 const weight=theme==="executive"?"800":"700";
 const info:string[]=[];
 if(s.job)info.push(esc(s.job));
 if(s.company)info.push(esc(s.company));
 const name=esc(s.name||"Your name");
 const links:string[]=[];
 const email=s.email.trim();
 if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))links.push('<a href="mailto:'+esc(encodeURI(email))+'" style="color:'+sub+';text-decoration:none;">'+esc(email)+'</a>');
 if(/^[+\d() -]{5,25}$/.test(s.phone.trim()))links.push('<a href="tel:'+esc(s.phone.replace(/[^\d+]/g,""))+'" style="color:'+sub+';text-decoration:none;">'+esc(s.phone.trim())+'</a>');
 const url=safeHttps(s.web);if(url)links.push('<a href="'+esc(url)+'" style="color:'+accent+';text-decoration:none;">'+esc(s.web.trim())+'</a>');
 const social=safeHttps(s.linkedin);if(social)links.push('<a href="'+esc(social)+'" style="color:'+accent+';text-decoration:none;">LinkedIn</a>');
 const logo=safeHttps(s.logoUrl);
 const bolthtml=s.bolt?'<img src="https://bernecki.dev/images/berni-lightning.gif" alt="" width="42" height="42" style="display:block;width:42px;height:42px;border:0;" />':"";
 const media=logo?'<img src="'+esc(logo)+'" alt="'+esc(s.company||"Company logo")+'" width="72" style="display:block;max-width:72px;height:auto;border:0;" />':bolthtml;
 const lhs=media?'<td width="82" valign="middle" style="padding:0 12px 0 0;">'+media+'</td>':"";
 const desc=s.disclaimer.trim()?'<tr><td colspan="2" style="padding:12px 0 0;color:'+sub+';font-size:10px;line-height:1.5;">'+esc(s.disclaimer.slice(0,350))+'</td></tr>':"";
 return '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;max-width:560px;'+background+'font-family:Arial,Helvetica,sans-serif;color:'+fg+';">'+
 '<tr>'+lhs+'<td valign="middle" style="padding:7px 12px;'+divider+'">'+
 '<div style="font-size:17px;line-height:1.3;font-weight:'+weight+';color:'+fg+';">'+name+'</div>'+
 (info.length?'<div style="font-size:12px;line-height:1.65;color:'+sub+';margin-top:3px;">'+info.join(" · ")+'</div>':"")+
 (links.length?'<div style="font-size:12px;line-height:1.9;margin-top:10px;">'+links.join("&nbsp;&nbsp;|&nbsp;&nbsp;")+'</div>':"")+
 (s.address?'<div style="font-size:11px;color:'+sub+';margin-top:4px;">'+esc(s.address)+'</div>':"")+
 '</td></tr>'+desc+'</table>';
}
