// Recolour inconsistent amber irises in generated poses. The original PNGs
// remain untouched in Git; this runs only as part of the preview build.
// Only warm pixels in the eye area are affected (never fur or headphone logos).
import {readFileSync,writeFileSync,readdirSync} from "node:fs";
import {inflateSync,deflateSync} from "node:zlib";
const root="public/images/berni/generated";
const crcTable=new Uint32Array(256);
for(let i=0;i<256;i++){let n=i;for(let j=0;j<8;j++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;crcTable[i]=n>>>0;}
function crc32(b){let c=0xffffffff;for(const v of b)c=(c>>>8)^crcTable[(c^v)&255];return(c^0xffffffff)>>>0;}
function chunk(t,data){const a=Buffer.from(t),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(data.length);c.writeUInt32BE(crc32(Buffer.concat([a,data])));return Buffer.concat([n,a,data,c]);}
function decode(buffer){
 if(buffer.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw Error("Expected PNG");
 let at=8,w=0,h=0,depth=0,type=0,interlace=0;
 const blocks=[];
 while(at+12<=buffer.length){
   const len=buffer.readUInt32BE(at),tag=buffer.toString("ascii",at+4,at+8),v=buffer.subarray(at+8,at+8+len);
   if(tag==="IHDR"){w=v.readUInt32BE(0);h=v.readUInt32BE(4);depth=v[8];type=v[9];interlace=v[12];}
   if(tag==="IDAT")blocks.push(v);
   at+=12+len;if(tag==="IEND")break;
 }
 if(depth!==8||type!==6||interlace!==0)throw Error("Berni iris script requires non-interlaced RGBA PNG");
 const raw=inflateSync(Buffer.concat(blocks)),pixels=Buffer.alloc(w*h*4),stride=w*4;
 let o=0;
 for(let y=0;y<h;y++){
   const filter=raw[o++];
   for(let x=0;x<stride;x++){
     const i=y*stride+x,a=x>=4?pixels[i-4]:0,b=y?pixels[i-stride]:0,c=y&&x>=4?pixels[i-stride-4]:0;
     let pred=0;
     if(filter===1)pred=a;
     else if(filter===2)pred=b;
     else if(filter===3)pred=(a+b)>>1;
     else if(filter===4){const q=a+b-c,da=Math.abs(q-a),db=Math.abs(q-b),dc=Math.abs(q-c);pred=da<=db&&da<=dc?a:db<=dc?b:c;}
     else if(filter!==0)throw Error("Unknown PNG filter "+filter);
     pixels[i]=(raw[o++]+pred)&255;
   }
 }
 return{w,h,pixels};
}
function encode(w,h,pixels){
 const info=Buffer.alloc(13);info.writeUInt32BE(w);info.writeUInt32BE(h,4);info[8]=8;info[9]=6;
 const stride=w*4,raw=Buffer.alloc((stride+1)*h);
 for(let y=0;y<h;y++)pixels.copy(raw,y*(stride+1)+1,y*stride,(y+1)*stride);
 return Buffer.concat([Buffer.from("89504e470d0a1a0a","hex"),chunk("IHDR",info),chunk("IDAT",deflateSync(raw,{level:8})),chunk("IEND",Buffer.alloc(0))]);
}
let corrected=0, pixelsFixed=0;
for(const file of readdirSync(root).filter(p=>p.endsWith(".png"))){
 const path=root+"/"+file;
 const {w,h,pixels}=decode(readFileSync(path));
 let count=0;
 for(let y=Math.round(h*245/640);y<Math.round(h*385/640);y++){
  for(let x=Math.round(w*264/640);x<Math.round(w*535/640);x++){
   const i=(y*w+x)*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];
   if(pixels[i+3]<120||r<115||g<75||r-g<12||g-b<13)continue;
   // Protect fur highlights and convert only genuinely amber chroma.
   const strength=Math.min(1,(r-g-10)/38,(g-b-10)/36);
   if(strength<.14)continue;
   const lum=.299*r+.587*g+.114*b;
   const blend=.9*strength;
   pixels[i]=Math.round(r*(1-blend)+lum*.79*blend);
   pixels[i+1]=Math.round(g*(1-blend)+lum*1.00*blend);
   pixels[i+2]=Math.round(b*(1-blend)+Math.min(255,lum*1.19+8)*blend);
   count++;
  }
 }
 if(count){
   writeFileSync(path,encode(w,h,pixels));corrected++;pixelsFixed+=count;
 }
}
console.log("Berni: iris colour normalized",corrected,"poses,",pixelsFixed,"pixels");
