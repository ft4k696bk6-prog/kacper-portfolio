import type { SignatureFields } from "./everyday-utils";

/**
 * Browser-only GIF writer. The first frame is a complete fallback for older
 * Outlook clients that only render one frame; subsequent frames play the reveal.
 * Everything is generated locally, with no tracking or external image service.
 */
export type SignatureMotion="geometry"|"slices"|"cinematic"|"reveal"|"slide"|"pulse";

const WIDTH=520, HEIGHT=208;
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

function ease(t:number){const v=clamp(t);return 1-Math.pow(1-v,3);}
function polygon(ctx:CanvasRenderingContext2D,points:Array<[number,number]>){
 ctx.beginPath();
 points.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
 ctx.closePath();
}
function coverPhoto(ctx:CanvasRenderingContext2D,photo:HTMLImageElement|null,x:number,y:number,w:number,h:number){
 if(photo){
  const scale=Math.max(w/photo.naturalWidth,h/photo.naturalHeight);
  const sw=photo.naturalWidth*scale,sh=photo.naturalHeight*scale;
  ctx.drawImage(photo,x+(w-sw)/2,y+(h-sh)/2,sw,sh);
 }else{
  ctx.fillStyle="#e6e6e8";ctx.fillRect(x,y,w,h);
  ctx.fillStyle="#aeafb4";ctx.beginPath();ctx.arc(x+w/2,y+h*.36,w*.23,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(x+w/2,y+h*1.02,w*.42,h*.42,0,0,Math.PI*2);ctx.fill();
 }
}
function paintGeometry(ctx:CanvasRenderingContext2D,fields:SignatureFields,motion:SignatureMotion,
 progress:number,logo:HTMLImageElement|null,photo:HTMLImageElement|null){
 const p=clamp(progress),accent=/^#[0-9a-f]{6}$/i.test(fields.accent)?fields.accent:"#6f6f79";
 const visible=(a:number,b:number)=>ease((p-a)/(b-a));
 const layout=visible(.02,.22),brand=visible(.13,.39),text=visible(.26,.53),detail=visible(.39,.7);
 const slices=visible(.28,.88),finish=visible(.74,.98);
 ctx.clearRect(0,0,WIDTH,HEIGHT);
 ctx.fillStyle="#ffffff";ctx.fillRect(0,0,WIDTH,HEIGHT);
 // The mail-safe linked navigation bar is an HTML table outside this moving graphic.
 // The GIF begins with an entirely clean field and draws itself into place.
 ctx.fillStyle="#fbfafc";ctx.fillRect(0,0,WIDTH,HEIGHT);
 ctx.save();
 ctx.globalAlpha=layout;
 ctx.strokeStyle="#e8e5eb";ctx.lineWidth=1;
 ctx.beginPath();ctx.moveTo(0,16);ctx.lineTo(500,16);ctx.stroke();
 ctx.restore();
 // Accent geometry is unique to the user's company, not copied artwork.
 ctx.save();ctx.globalAlpha=brand*.13;
 ctx.fillStyle=accent;
 polygon(ctx,[[322,0],[390,0],[288,208],[222,208]]);ctx.fill();
 ctx.restore();
 // Logo + company wordmark enter before the personal details.
 ctx.save();
 ctx.globalAlpha=brand;
 if(motion==="cinematic")ctx.translate((1-brand)*-18,0);
 if(logo){
  const scale=Math.min(165/logo.naturalWidth,49/logo.naturalHeight);
  ctx.drawImage(logo,27,29,logo.naturalWidth*scale,logo.naturalHeight*scale);
 }else{
  label(ctx,(fields.company||"YOUR BRAND").toUpperCase(),27,58,285,"bold 25px Arial","#1c1b20",1);
 }
 ctx.restore();
 // Headline, title and contact are staggered separately, leaving breathing room.
 const mx=motion==="slices"?(1-text)*10:0;
 ctx.save();ctx.translate(mx,0);
 label(ctx,fields.name||(fields.language==="en"?"Your Name":"Imię i nazwisko"),27,108,308,"bold 24px Arial","#151417",text);
 label(ctx,fields.role||(fields.language==="en"?"Position":"Stanowisko"),27,128,305,"13px Arial","#62616a",visible(.32,.60));
 label(ctx,fields.company||"",27,150,280,"bold 12px Arial",accent,visible(.39,.66));
 label(ctx,fields.email||"",27,171,298,"12px Arial","#56545d",detail);
 label(ctx,fields.website||fields.phone||"",27,188,298,"12px Arial","#56545d",finish);
 ctx.restore();
 // Build the portrait from interlocking diagonal windows. Each piece moves on
 // its own curve, with angled cuts and a separate top facet to match the reference.
 const shapes:Array<{poly:Array<[number,number]>,begin:number,end:number,shift:number}>= [
  {poly:[[398,39],[453,39],[378,196],[328,196]],begin:.3,end:.59,shift:62},
  {poly:[[456,21],[502,21],[420,196],[380,196]],begin:.46,end:.77,shift:65},
  {poly:[[503,53],[522,53],[467,178],[444,178]],begin:.59,end:.91,shift:50}
 ];
 for(const sh of shapes){
  const t=visible(sh.begin,sh.end);
  if(t<=0)continue;
  ctx.save();
  ctx.globalAlpha=t;
  const ofs=(1-t)*sh.shift;
  polygon(ctx,sh.poly.map(([x,y])=>[x+ofs,y]));ctx.clip();
  coverPhoto(ctx,photo,327+ofs,13,200,193);
  ctx.restore();
 }
 // A clean diagonal metallic plate gives a deliberate 3D-layered look.
 ctx.save();ctx.globalAlpha=slices*.88;ctx.fillStyle=accent;
 polygon(ctx,[[442,15],[480,15],[412,194],[386,194]]);ctx.fill();
 ctx.restore();
 // Restore a slim center photo slice above the metallic plate.
 if(photo&&p>.58){
  const t=visible(.58,.88);
  ctx.save();ctx.globalAlpha=t;
  polygon(ctx,[[425+(1-t)*28,60],[447+(1-t)*28,60],[399+(1-t)*28,181],[379+(1-t)*28,181]]);ctx.clip();
  coverPhoto(ctx,photo,325+(1-t)*28,15,200,194);ctx.restore();
 }
 // Only the selected "cinematic" preset has a small glossy sweep.
 if(motion==="cinematic"&&p>.57&&p<.98){
  ctx.save();ctx.globalAlpha=.17;
  const shift=260+visible(.58,.97)*245;
  const grad=ctx.createLinearGradient(shift-60,0,shift+35,0);
  grad.addColorStop(0,"rgba(255,255,255,0)");grad.addColorStop(.5,"#ffffff");grad.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=grad;polygon(ctx,[[shift-20,5],[shift+18,5],[shift-46,203],[shift-83,203]]);ctx.fill();ctx.restore();
 }
 // Fine divider comes in last: no gratuitous looping glints.
 ctx.save();ctx.globalAlpha=finish;ctx.fillStyle=accent;ctx.fillRect(27,197,275*finish,2);ctx.restore();
}

function paint(ctx:CanvasRenderingContext2D,fields:SignatureFields,motion:SignatureMotion,
 progress:number,logo:HTMLImageElement|null,photo:HTMLImageElement|null){
 if(motion==="geometry"||motion==="slices"||motion==="cinematic"){paintGeometry(ctx,fields,motion,progress,logo,photo);return;}
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
function assemble(frames:{indices:Uint8Array;delay:number}[],colors:Uint8Array,loop:boolean):Blob {
 const bytes:number[]=[];
 writeText(bytes,"GIF89a");writeShort(bytes,WIDTH);writeShort(bytes,HEIGHT);
 bytes.push(0xf7,0,0,...colors);
 if(loop){bytes.push(0x21,0xff,11);writeText(bytes,"NETSCAPE2.0");bytes.push(3,1,0,0,0);}
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

export async function makeSignatureGif(fields:SignatureFields,motion:SignatureMotion,loop=false):Promise<Blob>{
 if(typeof document==="undefined")throw new Error("GIF export requires a browser");
 const canvas=document.createElement("canvas");canvas.width=WIDTH;canvas.height=HEIGHT;
 const ctx=canvas.getContext("2d",{willReadFrequently:true});
 if(!ctx)throw new Error("Canvas is not available");
 const [logo,photo]=await Promise.all([imageFrom(fields.logo),imageFrom(fields.photo)]);
 if((fields.logo&&!logo)||(fields.photo&&!photo))throw new Error("Nie można wczytać grafiki do GIF. Wgraj obraz lokalnie albo użyj serwera pozwalającego na CORS.");
 const colors=palette(fields.accent);
 const frames:{indices:Uint8Array;delay:number}[]=[];
 // Complete fallback first: Outlook versions without GIF playback show useful content.
 const premium=motion==="geometry"||motion==="slices"||motion==="cinematic";
 const steps=premium?21:11;
 const stages=[{p:1,d:50},{p:0,d:180},...Array.from({length:steps},(_,i)=>({p:(i+1)/steps,d:premium?95:95})),{p:1,d:premium?2600:1650}];
 for(const stage of stages){
  paint(ctx,fields,motion,stage.p,logo,photo);
  let pixels:Uint8ClampedArray;
  try{pixels=ctx.getImageData(0,0,WIDTH,HEIGHT).data;}
  catch{throw new Error("The image server blocks cross-origin GIF export. Upload images locally instead.");}
  frames.push({indices:indexColors(pixels,colors),delay:stage.d});
 }
 return assemble(frames,colors,loop);
}
