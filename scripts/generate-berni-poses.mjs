import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { inflateSync, deflateSync } from "node:zlib";
const root="public/images/berni", out=root+"/poses";
const crc=new Uint32Array(256);
for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;crc[i]=c>>>0;}
function checksum(b){let c=0xffffffff;for(const v of b)c=(c>>>8)^crc[(c^v)&255];return (c^0xffffffff)>>>0;}
function chunk(t,b){const h=Buffer.from(t),n=Buffer.alloc(4),c=Buffer.alloc(4);n.writeUInt32BE(b.length);c.writeUInt32BE(checksum(Buffer.concat([h,b])));return Buffer.concat([n,h,b,c]);}
function decode(b){
 if(b.subarray(0,8).toString("hex")!=="89504e470d0a1a0a")throw Error("PNG required");
 let o=8,w=0,h=0,type=0,depth=0;const ids=[];
 while(o+12<=b.length){const n=b.readUInt32BE(o),t=b.toString("ascii",o+4,o+8),v=b.subarray(o+8,o+8+n);if(t==="IHDR"){w=v.readUInt32BE(0);h=v.readUInt32BE(4);depth=v[8];type=v[9];}if(t==="IDAT")ids.push(v);o+=n+12;if(t==="IEND")break;}
 if(depth!==8||type!==6)throw Error("Source Berni must be RGBA PNG");
 const raw=inflateSync(Buffer.concat(ids)),p=new Uint8Array(w*h*4),stride=w*4;let o2=0;
 for(let y=0;y<h;y++){const f=raw[o2++];for(let x=0;x<stride;x++){const k=y*stride+x,a=x>=4?p[k-4]:0,u=y?p[k-stride]:0,c=y&&x>=4?p[k-stride-4]:0;let pr=0;
  if(f===1)pr=a;else if(f===2)pr=u;else if(f===3)pr=(a+u)>>1;else if(f===4){const q=a+u-c,aa=Math.abs(q-a),bb=Math.abs(q-u),cc=Math.abs(q-c);pr=aa<=bb&&aa<=cc?a:bb<=cc?u:c;}else if(f!==0)throw Error("Bad PNG filter");
  p[k]=(raw[o2++]+pr)&255;
 }}
 return {w,h,p};
}
function encode(w,h,p){const info=Buffer.alloc(13);info.writeUInt32BE(w);info.writeUInt32BE(h,4);info[8]=8;info[9]=6;const stride=w*4,raw=Buffer.alloc((stride+1)*h);
 for(let y=0;y<h;y++)Buffer.from(p.buffer,p.byteOffset+y*stride,stride).copy(raw,y*(stride+1)+1);
 return Buffer.concat([Buffer.from("89504e470d0a1a0a","hex"),chunk("IHDR",info),chunk("IDAT",deflateSync(raw,{level:8})),chunk("IEND",Buffer.alloc(0))]);
}
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const gauss=(x,y,cx,cy,sx,sy)=>Math.exp(-.5*(((x-cx)/sx)**2+((y-cy)/sy)**2));
const smooth=n=>{const z=clamp(n,0,1);return z*z*(3-2*z);};
function sample(p,w,h,x,y,c){x=clamp(x,0,w-1);y=clamp(y,0,h-1);const a=Math.floor(x),b=Math.floor(y),u=x-a,v=y-b,x1=Math.min(w-1,a+1),y1=Math.min(h-1,b+1);
 return p[(b*w+a)*4+c]*(1-u)*(1-v)+p[(b*w+x1)*4+c]*u*(1-v)+p[(y1*w+a)*4+c]*(1-u)*v+p[(y1*w+x1)*4+c]*u*v;}
const moods={
 idle:[0,0,0,0,0,0],curious:[.8,-.25,.23,0,.2,.22],thinking:[-.68,-.35,-.08,0,-.1,-.08],
 happy:[.13,-.04,.78,.22,.15,.05],excited:[.30,-.18,1,.49,.45,.32],
 sleeping:[0,0,.1,0,-.08,-.15],typing:[.2,.40,.28,.55,.02,0],
 listening:[.66,-.04,.2,.08,.13,.08],surprised:[.10,-.28,-.02,.28,.8,.65],
 worried:[-.25,.38,-.28,.05,-.65,-.2],working:[-.58,.23,.08,.16,-.05,-.12],
 grabbed:[.30,-.18,.02,.3,.6,.35]
};
const depths={happy:4,excited:9,typing:5,surprised:3,grabbed:5,listening:1};
const {w,h,p:source}=decode(readFileSync(root+"/berni-fox-head.png"));
if(w!==h)throw Error("Berni source must be square");
const factor=w/640,clean=Uint8Array.from(source);
for(let y=Math.round(373*factor);y<Math.round(416*factor);y++)for(let x=Math.round(530*factor);x<Math.round(571*factor);x++){
 const xx=x/factor, yy=y/factor, r=((xx-550)/17.9)**2+((yy-394)/20.9)**2,a=smooth((1.12-r)/.30),i=(y*w+x)*4,t=clamp((yy-371)/49,0,1);
 if(!a)continue;
 for(let c=0;c<3;c++){const color=sample(source,w,h,x,370*factor,c)*(1-t)+sample(source,w,h,x,421*factor,c)*t;clean[i+c]=Math.round(clean[i+c]*(1-a)+color*a);}
}
mkdirSync(out,{recursive:true});
for(const [name,[gx,gy,smile,mouth,brow,wide]] of Object.entries(moods)){
 const p=new Uint8Array(source.length);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
 const xx=x/factor,yy=y/factor,near=gauss(xx,yy,337,320,38,29),far=gauss(xx,yy,464,350,19,25);
 let dx=9*gx*near+4*gx*far,dy=7*gy*near+4*gy*far;
 dx+=wide*((xx-337)*.085*near+(xx-464)*.06*far);
 dy+=wide*((yy-321)*.17*near+(yy-348)*.14*far);
 dy+=smile*(-5.5*gauss(xx,yy,365,400,27,28)-6.5*gauss(xx,yy,458,434,24,22)+2.8*gauss(xx,yy,412,414,43,20));
 dx+=smile*(2*gauss(xx,yy,360,404,30,28)-3*gauss(xx,yy,461,435,25,20));
 dy+=mouth*5*gauss(xx,yy,420,427,52,20)+brow*(-4.6*gauss(xx,yy,336,270,52,19)-2.1*gauss(xx,yy,469,303,19,16));
 dx-=mouth*2.4*gauss(xx,yy,432,426,46,25);
 const i=(y*w+x)*4;for(let c=0;c<4;c++)p[i+c]=Math.round(sample(clean,w,h,x-dx*factor,y-dy*factor,c));
 const d=depths[name]||0,t=(xx-368)/90;
 if(d&&t>=0&&t<=1){const top=401+32*(1-(1-t)**3)-7*t**4,bot=top+d*Math.sin(Math.PI*t)**.55,a=smooth((yy-top+.6)/1.2)*smooth((bot-yy+.6)/1.2);
 if(a>0){const tint=[17+Math.max(0,yy-432)*.48,12+Math.max(0,yy-432)*.23,19+Math.max(0,yy-432)*.34];for(let c=0;c<3;c++)p[i+c]=Math.round(p[i+c]*(1-a)+tint[c]*a);}
 }
 }
 writeFileSync(out+"/"+name+".png",encode(w,h,p));
}
console.log("Berni master portraits generated:",Object.keys(moods).length);
