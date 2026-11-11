"use client";
import { useEffect, useRef, useState } from "react";
import { type BerniLivingMood } from "@/lib/berni-face-state";
import { berniTransitionFrame, chooseBerniTransition, emptyTransitionMemory, type TransitionChoice } from "@/lib/berni-transition";
export type { BerniLivingMood } from "@/lib/berni-face-state";

const ROOT="/images/berni/poses/";
const CLOSED="/images/berni/eyelids-closed.jpg";
const POSES: BerniLivingMood[]=["idle","curious","thinking","happy","excited","sleeping","typing","listening","surprised","worried","working","grabbed"];
const imagePromises=new Map<string,Promise<HTMLImageElement>>();
function getPortrait(src:string):Promise<HTMLImageElement>{
 const cached=imagePromises.get(src);if(cached)return cached;
 const promise=new Promise<HTMLImageElement>((resolve,reject)=>{
  const img=new window.Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(src));img.src=src;
 });
 imagePromises.set(src,promise);return promise;
}
function bounded(n:number,a=-1,b=1){return Math.max(a,Math.min(b,n));}

type InternalTransition={from:BerniLivingMood;to:BerniLivingMood;choice:TransitionChoice;start:number};
type Controller={mood:BerniLivingMood;blinkToken:number;reactionToken:number};
export function BerniLivingFace({mood,size,blinkToken=0,reactionToken=0}:Controller & {size:number}){
 const ref=useRef<HTMLCanvasElement>(null);
 const input=useRef<Controller>({mood,blinkToken,reactionToken});
 const [ready,setReady]=useState(false);

 useEffect(()=>{
  const previous=input.current;
  const hasChange=mood!==previous.mood;
  const forceBlink=blinkToken!==previous.blinkToken && blinkToken>0;
  const replay=reactionToken!==previous.reactionToken;
  input.current={mood,blinkToken,reactionToken};
  const node=ref.current;
  if(hasChange)node?.dispatchEvent(new Event("berni-state-change"));
  if(forceBlink)node?.dispatchEvent(new Event("berni-blink-now"));
  if(replay)node?.dispatchEvent(new Event("berni-reaction-replay"));
 },[mood,blinkToken,reactionToken]);

 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext("2d",{alpha:true});
  if(!canvas||!ctx)return;
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const dimension=Math.min(640,Math.max(112,Math.round(size*Math.min(2,window.devicePixelRatio||1))));
  canvas.width=dimension;canvas.height=dimension;
  const working=document.createElement("canvas");working.width=640;working.height=640;
  const wctx=working.getContext("2d",{willReadFrequently:true});
  if(!wctx)return;
  const portraits=new Map<BerniLivingMood,HTMLImageElement>();
  const textureData=new Map<BerniLivingMood,Uint8ClampedArray>();
  const history=emptyTransitionMemory();
  let active=true,visible=true,raf=0,lastPaint=0,lastTick=0;
  let showing:BerniLivingMood="idle",effect:InternalTransition|null=null;
  let lids:HTMLImageElement|null=null;
  let lastBlink=-10000, nextBlink=performance.now()+2300+Math.random()*1800;
  let gazeX=0,gazeY=0,lookX=0,lookY=0,touchUntil=0,replayAt=0;
  let observer:IntersectionObserver|null=null;

  function requestPose(next:BerniLivingMood){
   if(portraits.has(next))return Promise.resolve(portraits.get(next)!);
   return getPortrait(ROOT+next+".png").then(img=>{if(active)portraits.set(next,img);return img;});
  }
  function onChange(){
   const next=input.current.mood;
   if(!portraits.has(next)){
    void requestPose(next).then(()=>{if(active)onChange();}).catch(()=>{});
    return;
   }
   const now=performance.now();
   const previous=effect?(now-effect.start>effect.choice.duration/2?effect.to:effect.from):showing;
   if(next===previous && !effect)return;
   const selected=reduced.matches?null:chooseBerniTransition(previous,next,now,history);
   showing=previous;
   effect=selected?{from:previous,to:next,choice:selected,start:now}:null;
   if(!selected)showing=next;
  }
  function onBlink(){lastBlink=performance.now();nextBlink=lastBlink+4300+Math.random()*3200;}
  function onReplay(){replayAt=performance.now();}

  function setLook(clientX:number,clientY:number,ttl:number){
   const rect=canvas!.getBoundingClientRect();
   const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
   // The gaze is limited to the irises. No full head rotation on tap.
   lookX=bounded((clientX-cx)/Math.max(130,window.innerWidth*.48));
   lookY=bounded((clientY-cy)/Math.max(160,window.innerHeight*.48));
   touchUntil=ttl;
  }
  function onPointerMove(event:PointerEvent){
   if(!window.matchMedia("(hover: hover) and (pointer: fine)").matches)return;
   setLook(event.clientX,event.clientY,performance.now()+1550);
  }
  function onPointerDown(event:PointerEvent){
   setLook(event.clientX,event.clientY,performance.now()+1350);
  }

  function drawClosedEye(near:boolean,amount:number){
   if(!lids||amount<=.001)return;
   wctx!.save();
   wctx!.beginPath();
   if(near){
    wctx!.moveTo(262,320);
    wctx!.bezierCurveTo(283,286,344,271,376,304);
    wctx!.bezierCurveTo(388,316,389,349,387,367);
    wctx!.bezierCurveTo(340,359,290,349,262,320);
   }else{
    wctx!.moveTo(436,348);
    wctx!.bezierCurveTo(439,320,459,308,478,326);
    wctx!.bezierCurveTo(490,337,493,371,486,381);
    wctx!.bezierCurveTo(461,378,447,363,436,348);
   }
   wctx!.closePath();wctx!.clip();
   const top=near?282:311,bottom=near?370:382,left=near?259:434,right=near?391:493;
   const edge=top+(bottom-top)*Math.min(1,amount);
   wctx!.beginPath();wctx!.rect(left,top,right-left,Math.max(0,edge-top));wctx!.clip();
   wctx!.drawImage(lids,0,0,640,640);
   wctx!.restore();
  }
  function rasterFor(pose:BerniLivingMood,img:HTMLImageElement){
   const cached=textureData.get(pose);if(cached)return cached;
   const el=document.createElement("canvas");el.width=640;el.height=640;
   const ec=el.getContext("2d",{willReadFrequently:true});
   if(!ec)return null;
   ec.drawImage(img,0,0,640,640);
   const data=ec.getImageData(0,0,640,640).data;
   textureData.set(pose,data);return data;
  }
  function morphPupils(pose:BerniLivingMood,img:HTMLImageElement){
   if(Math.abs(gazeX)<.018&&Math.abs(gazeY)<.018)return;
   const source=rasterFor(pose,img);if(!source)return;
   // In-place raster displacement; eye whites, fur and highlights come from
   // the SAME full-frame portrait. No overlapping SVG mouths / pupil stickers.
   const eyes=[
    {x:274,y:285,w:116,h:84,cx:337,cy:323,rx:57,ry:39,sx:6.8,sy:5.2},
    {x:435,y:316,w:58,h:72,cx:462,cy:348,rx:28,ry:33,sx:3.5,sy:3.2},
   ];
   for(const e of eyes){
    const region=wctx!.createImageData(e.w,e.h);
    for(let yy=0;yy<e.h;yy++)for(let xx=0;xx<e.w;xx++){
     const px=e.x+xx,py=e.y+yy;
     const ellipse=((px-e.cx)/e.rx)**2+((py-e.cy)/e.ry)**2;
     const strength=Math.pow(Math.max(0,1-ellipse),2.6);
     const sx=bounded(px-gazeX*e.sx*strength,0,639),sy=bounded(py-gazeY*e.sy*strength,0,639);
     const x0=Math.floor(sx),y0=Math.floor(sy),x1=Math.min(639,x0+1),y1=Math.min(639,y0+1);
     const u=sx-x0,v=sy-y0,i=(yy*e.w+xx)*4;
     for(let c=0;c<4;c++){
      const a=source[(y0*640+x0)*4+c],b=source[(y0*640+x1)*4+c],d=source[(y1*640+x0)*4+c],f=source[(y1*640+x1)*4+c];
      region.data[i+c]=a*(1-u)*(1-v)+b*u*(1-v)+d*(1-u)*v+f*u*v;
     }
    }
    wctx!.putImageData(region,e.x,e.y);
   }
  }
  function render(now:number){
   raf=0;
   if(!active||!visible||document.hidden)return;
   raf=requestAnimationFrame(render);
   const interval=size<=72?36:25;
   if(now-lastPaint<interval&&!reduced.matches)return;
   const dt=Math.min(64,Math.max(0,now-(lastTick||now)));
   lastTick=now;lastPaint=now;
   let currentMood=showing;
   let anim:ReturnType<typeof berniTransitionFrame>|null=null;
   if(effect){
    const p=bounded((now-effect.start)/effect.choice.duration,0,1);
    currentMood=p<.5?effect.from:effect.to;
    if(p>=1){showing=effect.to;effect=null;currentMood=showing;}
    else anim=berniTransitionFrame(effect.choice.name,p);
   }
   const sprite=portraits.get(currentMood)||portraits.get("idle");
   if(!sprite)return;
   const lookActive=now<touchUntil&&!reduced.matches;
   const targetX=lookActive?lookX:0,targetY=lookActive?lookY:0;
   const alpha=1-Math.exp(-dt/150);
   gazeX+=(targetX-gazeX)*alpha;gazeY+=(targetY-gazeY)*alpha;
   wctx!.clearRect(0,0,640,640);
   wctx!.drawImage(sprite,0,0,640,640);
   if(!reduced.matches)morphPupils(currentMood,sprite);
   if(now>=nextBlink&&currentMood!=="sleeping"&&!reduced.matches){
    lastBlink=now;nextBlink=now+3800+Math.random()*3300;
   }
   const pulse=(now-lastBlink)/285;
   const blink=currentMood==="sleeping"?1:(!reduced.matches&&pulse>=0&&pulse<=1?Math.pow(Math.sin(Math.PI*pulse),1.6):0);
   drawClosedEye(true,blink);drawClosedEye(false,blink);
   const ratio=dimension/640;
   ctx!.clearRect(0,0,dimension,dimension);
   ctx!.save();ctx!.translate(dimension/2,dimension/2);
   const phase=now/1000;
   const bounce=currentMood==="excited"?3*Math.sin(phase*7):
     currentMood==="typing"?1.3*Math.sin(phase*8):
     currentMood==="sleeping"?1.5*Math.sin(phase*1.2):1.2*Math.sin(phase*1.5);
   const replayPulse=Math.max(0,1-(now-replayAt)/420);
   const tilt=currentMood==="thinking"?-.035:currentMood==="curious"?.035:
     currentMood==="worried"?-.038:currentMood==="surprised"?.025:currentMood==="excited"?.018:0;
   if(!reduced.matches){ctx!.translate(0,(bounce-replayPulse*5)*ratio);ctx!.rotate(tilt+Math.sin(phase*.8)*.012);}
   if(anim&&!reduced.matches){
    ctx!.translate(anim.x*dimension,anim.y*dimension);
    ctx!.rotate(anim.rotate);
    ctx!.scale(anim.scaleX,anim.scaleY);
    ctx!.globalAlpha=anim.opacity;
    if("filter" in ctx)ctx!.filter="blur("+Math.min(4,anim.blur*dimension/320).toFixed(1)+"px)";
   }
   ctx!.drawImage(working,-dimension/2,-dimension/2,dimension,dimension);
   ctx!.restore();
  }
  function ensureLoop(){if(active&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(render);}
  function changedVisibility(){ensureLoop();}
  canvas.addEventListener("berni-state-change",onChange);
  canvas.addEventListener("berni-blink-now",onBlink);
  canvas.addEventListener("berni-reaction-replay",onReplay);
  window.addEventListener("pointermove",onPointerMove,{passive:true});
  window.addEventListener("pointerdown",onPointerDown,{passive:true});
  document.addEventListener("visibilitychange",changedVisibility);
  if("IntersectionObserver" in window){
   observer=new IntersectionObserver(entries=>{
    visible=!!entries[0]?.isIntersecting;
    if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}
    if(visible)ensureLoop();
   });
   observer.observe(canvas);
  }
  void getPortrait(CLOSED).then(img=>{if(active)lids=img;}).catch(()=>{});
  void requestPose("idle").then(()=>{
   if(!active)return;
   setReady(true);
   if(input.current.mood!=="idle")onChange();
   ensureLoop();
   // Decode only after the idle pose is visible. All three portrait instances
   // reuse one shared image cache, so iPhone network requests are deduplicated.
   for(const next of POSES){if(next!=="idle")void requestPose(next).catch(()=>{});}
  }).catch(()=>{});
  return()=>{
   active=false;if(raf)cancelAnimationFrame(raf);
   observer?.disconnect();
   canvas.removeEventListener("berni-state-change",onChange);
   canvas.removeEventListener("berni-blink-now",onBlink);
   canvas.removeEventListener("berni-reaction-replay",onReplay);
   window.removeEventListener("pointermove",onPointerMove);
   window.removeEventListener("pointerdown",onPointerDown);
   document.removeEventListener("visibilitychange",changedVisibility);
  };
 },[size]);

 return <canvas ref={ref} data-testid="berni-continuous-face" data-ready={ready?"true":"false"}
  aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full"
  style={{opacity:ready?1:0,transition:"opacity 160ms ease-out"}}/>;
}
