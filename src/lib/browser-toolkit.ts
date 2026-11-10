"use client";

/* eslint-disable @typescript-eslint/no-explicit-any -- version-pinned browser UMD libraries expose dynamic runtime APIs */
type ExtName = "pdf" | "pdfjs" | "qr" | "ocr";
const libraries:Record<ExtName,{url:string;integrity:string;name:string}>={
 pdf:{url:"https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js",integrity:"sha384-weMABwrltA6jWR8DDe9Jp5blk+tZQh7ugpCsF3JwSA53WZM9/14PjS5LAJNHNjAI",name:"PDFLib"},
 pdfjs:{url:"https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js",integrity:"sha384-/1qUCSGwTur9vjf/z9lmu/eCUYbpOTgSjmpbMQZ1/CtX2v/WcAIKqRv+U1DUCG6e",name:"pdfjsLib"},
 qr:{url:"https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js",integrity:"sha384-8FWZA6BGMXhsfO+BLtrJK0We6gg5o1JyO8xQm6peWDEUs17ACA5ziE/NIAkl9z2k",name:"qrcode"},
 ocr:{url:"https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js",integrity:"sha384-GJqSu7vueQ9qN0E9yLPb3Wtpd7OrgK8KmYzC8T1IysG1bcvxvIO4qtYR/D3A991F",name:"Tesseract"}
};
const pending=new Map<ExtName,Promise<any>>();
export async function browserLibrary(key:ExtName):Promise<any>{
 if(typeof window==="undefined")throw Error("Browser required");
 const spec=libraries[key];
 const obj=(window as any)[spec.name];
 if(obj)return obj;
 const existing=pending.get(key);if(existing)return existing;
 const promise=new Promise<any>((resolve,reject)=>{
  const script=document.createElement("script");script.src=spec.url;script.integrity=spec.integrity;script.crossOrigin="anonymous";script.async=true;
  const timeout=window.setTimeout(()=>{script.remove();reject(Error("Library download timed out."));},25000);
  script.onload=()=>{window.clearTimeout(timeout);const value=(window as any)[spec.name];value?resolve(value):reject(Error("Library did not initialize."));};
  script.onerror=()=>{window.clearTimeout(timeout);script.remove();reject(Error("Unable to download library. Check your network or ad blocker."));};
  document.head.appendChild(script);
 });
 pending.set(key,promise);try{return await promise;}catch(e){pending.delete(key);throw e;}
}

export function saveBlob(data:Blob,filename:string){
 const url=URL.createObjectURL(data);const a=document.createElement("a");a.href=url;a.download=filename;a.click();
 window.setTimeout(()=>URL.revokeObjectURL(url),10000);
}

export function parsePageSelection(selection:string,max:number):number[]{
 if(!Number.isInteger(max)||max<1)throw Error("Empty PDF");
 if(!selection.trim())return Array.from({length:max},(_,i)=>i);
 const list:number[]=[];
 for(const part of selection.split(",")){
  const match=part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
  if(!match)throw Error("Use page numbers, e.g. 1,3-5");
  const first=Number(match[1]),last=match[2]?Number(match[2]):first;
  if(first<1||last>max||last<first||last-first>200)throw Error("Page range out of bounds");
  for(let n=first;n<=last;n++)list.push(n-1);
 }
 if(list.length>200)throw Error("Maximum 200 selected pages");
 return list;
}

export function makeWifiQrPayload(ssid:string,password:string,type:"WPA"|"WEP"|"nopass"="WPA"):string{
 const esc=(s:string)=>s.replace(/([\\;,:"])/g,"\\$1");
 if(!ssid.trim())throw Error("SSID is required");
 return "WIFI:T:"+type+";S:"+esc(ssid)+";P:"+(type==="nopass"?"":esc(password))+";;";
}
