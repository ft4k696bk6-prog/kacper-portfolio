import type { SignatureFields } from "./everyday-utils";

/**
 * Browser-only GIF writer. The first frame is a complete fallback for older
 * Outlook clients that only render one frame; subsequent frames play the reveal.
 * Everything is generated locally, with no tracking or external image service.
 */
export type SignatureMotion="reveal"|"slide"|"pulse";

const WIDTH=520, HEIGHT=178;
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const mix=(a:number,b:number,t:number)=>a+(b-a)*clamp(t);

function palette(accent:string):Uint8Array {
 const out=new Uint8Array(768);
 for(let i=0;i<224;i++){const g=Math.round(i*255/223);out[i*3]=g;out[i*3+1]=g;out[i*3+2]=g;}
 const parts=/^#[\da-f]{6}$/i.test(accent)?accent.slice(1):"888888";
 const rgb=[0,2,4].map(i=>parseInt(parts.slice(i,i+2),16));
 for(let i=0;i<32;i++){
  const t=i/31, base=i<16?mix(0,1,t*2):mix(1,0.15,(t-0.5)*2);
  for(let c=0;c<3;c++)out[(224+i)*3+c]=Math.round(mix(255,rgb[c],base));
 }
 return out;
}
function indexColors(rgba:Uint8ClampedArray, colors:Uint8Array):Uint8Array {
 const result=new Uint8Array(rgba.length/4);
 for(let i=0;i<result.length;i++){
  const x=i*4, r=rgba[x],g=rgba[x+1],b=rgba[x+2];
  const shade=Math.max(0,Math.min(223,Math.round((r*0.299+g*0.587+b*0.114)*223/255)));
  let best=shade;
  const grey=colors[shade*3];
  let distance=(r-grey)**2+(g-grey)**2+(b-grey)**2;
  for(let k=224;k<256;k++){
   const p=k*3,d=(r-colors[p])**2+(g-colors[p+1])**2+(b-colors[p+2])**2;
   if(d<distance){best=k;distance=d;}
  }
  result[i]=best;
 }
 return result;
}
/** An intentionally simple GIF LZW stream that clears before the 9-bit table fills. */
function encodeLzw(pixels:Uint8Array):Uint8Array {
 const codes:number[]=[256];
 let count=0;
 for(let i=0;i<pixels.length;i++){
  if(count===200){codes.push(256);count=0;}
  codes.push(pixels[i]);count++;
 }
 codes.push(257);
 const bytes:number[]=[];
 let bits=0,acc=0;
 for(const code of codes){
  acc|=code<<bits;bits+=9;
  while(bits>=8){bytes.push(acc&255);acc>>>=8;bits-=8;}
 }
 if(bits)bytes.push(acc&255);
 return Uint8Array.from(bytes);
}
function writeShort(a:number[],n:number){a.push(n&255,(n>>8)&255);}
function writeText(a:number[],s:string){for(let i=0;i<s.length;i++)a.push(s.charCodeAt(i));}

async function imageFrom(source?:string):Promise<HTMLImageElement|null>{
 if(!source)return null;
 return new Promise(resolve=>{
  const image=new Image();
  image.crossOrigin="anonymous";
  image.onload=()=>resolve(image);
  image.onerror=()=>resolve(null);
  image.src=source;
 });
}

function rounded(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
 ctx.beginPath();ctx.roundRect(x,y,w,h,r);
}
function reveal(p:number,start:number,end:number){return clamp((p-start)/(end-start));}
function label(ctx:CanvasRenderingContext2D,txt:string,x:number,y:number,maxWidth:number,font:string,color:string,alpha:number){
 if(!txt||alpha<=0)return;
 ctx.save();ctx.globalAlpha=clamp(alpha);ctx.font=font;ctx.fillStyle=color;ctx.fillText(txt.slice(0,80),x,y,maxWidth);ctx.restore();
}
function paint(ctx:CanvasRenderingContext2D,fields:SignatureFields,motion:SignatureMotion,
 progress:number,logo:HTMLImageElement|null,photo:HTMLImageElement|null){
 const p=clamp(progress),accent=/^#[0-9a-f]{6}$/i.test(fields.accent)?fields.accent:"#777777";
 ctx.clearRect(0,0,WIDTH,HEIGHT);
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,WIDTH,HEIGHT);
 const enter=(start:number,end:number)=>reveal(p,start,end);
 const brand=enter(0,0.35),detail=enter(0.20,0.72),person=enter(0.36,0.84),links=enter(0.63,1);
 ctx.save();
 ctx.strokeStyle="#e4e4e4";ctx.lineWidth=1;
 rounded(ctx,1,1,WIDTH-2,HEIGHT-2,10);ctx.stroke();
 ctx.fillStyle="#f8f8f8";rounded(ctx,10,10,500,158,7);ctx.fill();
 ctx.globalAlpha=brand;
 ctx.fillStyle=accent;rounded(ctx,24,24,5,130,3);ctx.fill();
 ctx.restore();
 const offset=motion==="slide"?(1-brand)*-22:0;
 ctx.save();ctx.globalAlpha=brand;ctx.translate(offset,0);
 if(logo){
  const ratio=Math.min(99/logo.naturalWidth,57/logo.naturalHeight);
  ctx.drawImage(logo,46,34,logo.naturalWidth*ratio,logo.naturalHeight*ratio);
 }else{
  ctx.fillStyle="#212121";rounded(ctx,44,32,66,54,9);ctx.fill();
  label(ctx,(fields.company||fields.name||"B").slice(0,2).toUpperCase(),60,66,43,"bold 21px Arial","#ffffff",1);
 }
 ctx.restore();
 const x=155;
 label(ctx,fields.name||"Imię i nazwisko",x,54,220,"bold 22px Arial","#171717",detail);
 label(ctx,fields.role||"",x,76,220,"13px Arial","#505050",detail);
 label(ctx,fields.company||"",x,95,220,"bold 12px Arial",accent,detail);
 label(ctx,fields.email||"",x,120,220,"12px Arial","#505050",links);
 label(ctx,fields.website||fields.phone||"",x,138,220,"12px Arial","#505050",links);
 ctx.save();ctx.globalAlpha=person;
 rounded(ctx,399,20,98,115,12);ctx.clip();
 ctx.fillStyle="#e9e9e9";ctx.fillRect(399,20,98,115);
 if(photo){
  const ratio=Math.max(98/photo.naturalWidth,115/photo.naturalHeight);
  const w=photo.naturalWidth*ratio,h=photo.naturalHeight*ratio;
  ctx.drawImage(photo,399+(98-w)/2,20+(115-h)/2,w,h);
 }else{
  ctx.fillStyle="#cecece";ctx.beginPath();ctx.arc(448,62,24,0,Math.PI*2);ctx.fill();
  rounded(ctx,408,95,80,65,35);ctx.fill();
 }
 ctx.restore();
 ctx.save();ctx.globalAlpha=links;
 ctx.fillStyle=accent;rounded(ctx,400,145,98,4,2);ctx.fill();
 if(motion==="pulse"&&p<0.99){
  ctx.fillStyle="#eeeeee";rounded(ctx,44,149,Math.round(300*p),2,1);ctx.fill();
 }
 ctx.restore();
}
function assemble(frames:{indices:Uint8Array;delay:number}[],colors:Uint8Array):Blob {
 const bytes:number[]=[];
 writeText(bytes,"GIF89a");writeShort(bytes,WIDTH);writeShort(bytes,HEIGHT);
 bytes.push(0xf7,0,0,...colors);
 bytes.push(0x21,0xff,11);writeText(bytes,"NETSCAPE2.0");bytes.push(3,1,0,0,0);
 for(const frame of frames){
  const delay=Math.max(2,Math.round(frame.delay/10));
  bytes.push(0x21,0xf9,4,0);writeShort(bytes,delay);bytes.push(0,0);
  bytes.push(0x2c);writeShort(bytes,0);writeShort(bytes,0);writeShort(bytes,WIDTH);writeShort(bytes,HEIGHT);bytes.push(0);
  bytes.push(8);
  const data=encodeLzw(frame.indices);
  for(let offset=0;offset<data.length;offset+=255){
   const chunk=data.subarray(offset,offset+255);bytes.push(chunk.length,...chunk);
  }
  bytes.push(0);
 }
 bytes.push(0x3b);
 return new Blob([new Uint8Array(bytes)],{type:"image/gif"});
}

export async function makeSignatureGif(fields:SignatureFields,motion:SignatureMotion):Promise<Blob>{
 if(typeof document==="undefined")throw new Error("GIF export requires a browser");
 const canvas=document.createElement("canvas");canvas.width=WIDTH;canvas.height=HEIGHT;
 const ctx=canvas.getContext("2d",{willReadFrequently:true});
 if(!ctx)throw new Error("Canvas is not available");
 const [logo,photo]=await Promise.all([imageFrom(fields.logo),imageFrom(fields.photo)]);
 if((fields.logo&&!logo)||(fields.photo&&!photo))throw new Error("Nie można wczytać grafiki do GIF. Wgraj obraz lokalnie albo użyj serwera pozwalającego na CORS.");
 const colors=palette(fields.accent);
 const frames:{indices:Uint8Array;delay:number}[]=[];
 // Complete fallback first: Outlook versions without GIF playback show useful content.
 const stages=[{p:1,d:30},{p:0,d:160},...Array.from({length:11},(_,i)=>({p:(i+1)/11,d:95})),{p:1,d:1650}];
 for(const stage of stages){
  paint(ctx,fields,motion,stage.p,logo,photo);
  let pixels:Uint8ClampedArray;
  try{pixels=ctx.getImageData(0,0,WIDTH,HEIGHT).data;}
  catch{throw new Error("The image server blocks cross-origin GIF export. Upload images locally instead.");}
  frames.push({indices:indexColors(pixels,colors),delay:stage.d});
 }
 return assemble(frames,colors);
}
