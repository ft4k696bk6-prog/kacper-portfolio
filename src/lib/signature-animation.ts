import type { SignatureFields } from "./everyday-utils";
import { loadSignatureSceneAssets, renderSignatureScene } from "./signature-scenes";
import type { SignatureMotion } from "./signature-scenes";
export type { SignatureMotion } from "./signature-scenes";

/**
 * Browser-only GIF writer. The first frame is a complete fallback for older
 * Outlook clients that only render one frame; subsequent frames play the reveal.
 * Everything is generated locally, with no tracking or external image service.
 */

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
 const assets=await loadSignatureSceneAssets(fields);
 if((fields.logo&&!assets.logo)||(fields.photo&&!assets.photo))throw new Error("Nie można wczytać grafiki do GIF. Wgraj obraz lokalnie albo użyj serwera pozwalającego na CORS.");
 const colors=palette(fields.accent);
 const frames:{indices:Uint8Array;delay:number}[]=[];
 // Complete fallback first: Outlook versions without GIF playback show useful content.
 const steps=24;
 const stages=[{p:1,d:40},{p:0,d:150},...Array.from({length:steps},(_,i)=>({p:(i+1)/steps,d:88})),{p:1,d:2200}];
 for(const stage of stages){
  renderSignatureScene(ctx,fields,motion,stage.p,assets);
  let pixels:Uint8ClampedArray;
  try{pixels=ctx.getImageData(0,0,WIDTH,HEIGHT).data;}
  catch{throw new Error("The image server blocks cross-origin GIF export. Upload images locally instead.");}
  frames.push({indices:indexColors(pixels,colors),delay:stage.d});
 }
 return assemble(frames,colors,loop);
}
