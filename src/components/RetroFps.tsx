"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUp,Crosshair,RotateCcw} from "lucide-react";
import type {ReactNode} from "react";

const level=[
 "111111111111",
 "100000010001",
 "101110010001",
 "100010000001",
 "100010111101",
 "100000000001",
 "101101010101",
 "100001000001",
 "100000001001",
 "111111111111"
];
const W=480,H=270,FOV=Math.PI/2.8,RAYS=160,STEP=W/RAYS;
type Enemy={x:number;y:number;alive:boolean};
type World={x:number;y:number;angle:number;hp:number;kills:number;enemies:Enemy[];running:boolean;lastHit:number;lastShot:number;won:boolean};
const fresh=():World=>({x:1.5,y:1.5,angle:0,hp:100,kills:0,enemies:[{x:5.5,y:1.5,alive:true},{x:8.5,y:5.5,alive:true},{x:3.5,y:8.5,alive:true}],running:false,lastHit:0,lastShot:0,won:false});
const wall=(x:number,y:number)=>level[Math.floor(y)]?.[Math.floor(x)]!=="0";
const pass=(x:number,y:number)=>!wall(x-.2,y-.2)&&!wall(x+.2,y-.2)&&!wall(x-.2,y+.2)&&!wall(x+.2,y+.2);
const angleDiff=(a:number,b:number)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
const lineClear=(x:number,y:number,toX:number,toY:number)=>{
 const dist=Math.hypot(toX-x,toY-y),steps=Math.max(1,Math.ceil(dist/.07));
 for(let i=1;i<steps;i++)if(wall(x+(toX-x)*i/steps,y+(toY-y)*i/steps))return false;
 return true;
};
const hudButton="flex min-h-12 min-w-12 touch-none select-none items-center justify-center rounded-xl border border-white/25 bg-white/10 px-3 text-sm font-semibold active:bg-white/30";

function draw(ctx:CanvasRenderingContext2D,g:World){
 ctx.fillStyle="#1b2534";ctx.fillRect(0,0,W,H/2);
 ctx.fillStyle="#272522";ctx.fillRect(0,H/2,W,H/2);
 const depth=new Float32Array(RAYS);
 for(let i=0;i<RAYS;i++){
  const ray=g.angle-FOV/2+(i+.5)/RAYS*FOV,dx=Math.cos(ray),dy=Math.sin(ray);
  let d=.05,xx=g.x,yy=g.y;
  while(d<18){xx=g.x+dx*d;yy=g.y+dy*d;if(wall(xx,yy))break;d+=.04;}
  const fixed=Math.max(.08,d*Math.cos(ray-g.angle));
  depth[i]=fixed;
  const height=Math.min(H*2,H/fixed*.75),top=(H-height)/2;
  const brightness=Math.max(36,Math.round(160/(1+fixed*.19)));
  const edge=Math.abs((xx%1)-.5)>.46||Math.abs((yy%1)-.5)>.46;
  const shade=edge?brightness*.81:brightness;
  ctx.fillStyle="rgb("+Math.round(shade*.86)+","+Math.round(shade*.9)+","+Math.round(shade)+")";
  ctx.fillRect(i*STEP,top,STEP+1,height);
  ctx.fillStyle="rgba(0,0,0,.075)";
  for(let line=1;line<4;line++)ctx.fillRect(i*STEP,top+height*line/4,STEP+1,1);
 }
 const sorted=g.enemies.filter(e=>e.alive).map(e=>({...e,distance:Math.hypot(e.x-g.x,e.y-g.y)})).sort((a,b)=>b.distance-a.distance);
 for(const e of sorted){
  const relative=angleDiff(Math.atan2(e.y-g.y,e.x-g.x),g.angle);
  if(Math.abs(relative)>FOV*.63||e.distance<.22)continue;
  const center=W/2+(relative/FOV)*W,headSize=Math.min(H,H/(e.distance*.95));
  const zIndex=Math.max(0,Math.min(RAYS-1,Math.floor(center/STEP)));
  if(e.distance>=depth[zIndex]+.2)continue;
  const y=H/2-headSize*.45;
  ctx.fillStyle="#cf4f41";
  ctx.fillRect(center-headSize*.26,y+headSize*.35,headSize*.52,headSize*.60);
  ctx.fillStyle="#f77861";
  ctx.fillRect(center-headSize*.25,y,headSize*.5,headSize*.48);
  ctx.fillStyle="#1b0909";
  ctx.fillRect(center-headSize*.15,y+headSize*.19,headSize*.1,Math.max(2,headSize*.06));
  ctx.fillRect(center+headSize*.05,y+headSize*.19,headSize*.1,Math.max(2,headSize*.06));
 }
 ctx.strokeStyle="#f1f1f1";ctx.lineWidth=2;
 ctx.beginPath();ctx.moveTo(W/2-11,H/2);ctx.lineTo(W/2-4,H/2);ctx.moveTo(W/2+4,H/2);ctx.lineTo(W/2+11,H/2);ctx.moveTo(W/2,H/2-11);ctx.lineTo(W/2,H/2-4);ctx.moveTo(W/2,H/2+4);ctx.lineTo(W/2,H/2+11);ctx.stroke();
 // Mini-map keeps mobile navigation understandable without occupying the play area.
 ctx.fillStyle="rgba(0,0,0,.67)";ctx.fillRect(W-113,10,103,91);
 const scale=7;
 for(let y=0;y<level.length;y++)for(let x=0;x<level[0].length;x++){if(level[y][x]==="1"){ctx.fillStyle="#a8b0bd";ctx.fillRect(W-103+x*scale,18+y*scale,scale-1,scale-1);}}
 ctx.fillStyle="#f9d65c";ctx.beginPath();ctx.arc(W-103+g.x*scale,18+g.y*scale,3,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#f87171";for(const mob of g.enemies)if(mob.alive){ctx.beginPath();ctx.arc(W-103+mob.x*scale,18+mob.y*scale,2.6,0,Math.PI*2);ctx.fill();}
}

export function RetroFps({lang}:{lang:"pl"|"en"}){
 const en=lang==="en";
 const canvas=useRef<HTMLCanvasElement>(null);
 const game=useRef<World>(fresh());
 const held=useRef<Set<string>>(new Set());
 const shootRef=useRef<()=>void>(()=>{});
 const [hud,setHud]=useState({hp:100,kills:0});
 const [status,setStatus]=useState<"ready"|"playing"|"win"|"lost">("ready");
 const begin=useCallback(()=>{game.current=fresh();game.current.running=true;held.current.clear();setHud({hp:100,kills:0});setStatus("playing");},[]);
 const shoot=useCallback(()=>{
  const g=game.current,now=performance.now();
  if(!g.running||now-g.lastShot<250)return;
  g.lastShot=now;
  const hits=g.enemies.filter(e=>e.alive).map(e=>({enemy:e,distance:Math.hypot(e.x-g.x,e.y-g.y),angle:Math.abs(angleDiff(Math.atan2(e.y-g.y,e.x-g.x),g.angle))}))
   .filter(o=>o.distance<12&&o.angle<Math.max(.105,.26/o.distance)&&lineClear(g.x,g.y,o.enemy.x,o.enemy.y)).sort((a,b)=>a.distance-b.distance);
  if(hits.length){hits[0].enemy.alive=false;g.kills+=1;setHud({hp:g.hp,kills:g.kills});if(g.kills===g.enemies.length){g.won=true;g.running=false;setStatus("win");}}
 },[]);
 shootRef.current=shoot;
 useEffect(()=>{
  const onDown=(e:KeyboardEvent)=>{
   if(["INPUT","TEXTAREA","SELECT"].includes((e.target as HTMLElement)?.tagName))return;
   const key=e.key.toLowerCase();
   if(["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"," "].includes(key)){e.preventDefault();held.current.add(key);}
   if(key===" "&&!e.repeat)shootRef.current();
  };
  const onUp=(e:KeyboardEvent)=>held.current.delete(e.key.toLowerCase());
  const clear=()=>held.current.clear();
  window.addEventListener("keydown",onDown);window.addEventListener("keyup",onUp);window.addEventListener("blur",clear);
  return()=>{window.removeEventListener("keydown",onDown);window.removeEventListener("keyup",onUp);window.removeEventListener("blur",clear);};
 },[]);
 useEffect(()=>{
  const ctx=canvas.current?.getContext("2d");
  if(!ctx)return;
  let raf=0,previous=0;
  const loop=(now:number)=>{
   const g=game.current,dt=Math.min(.05,(now-previous)/1000||.016);
   previous=now;
   if(g.running){
    const controls=held.current;
    const turn=(controls.has("arrowright")||controls.has("d")?1:0)-(controls.has("arrowleft")||controls.has("a")?1:0);
    g.angle+=turn*dt*2.1;
    const forward=(controls.has("arrowup")||controls.has("w")?1:0)-(controls.has("arrowdown")||controls.has("s")?1:0);
    if(forward){
     const vx=Math.cos(g.angle)*forward*dt*2.4,vy=Math.sin(g.angle)*forward*dt*2.4;
     if(pass(g.x+vx,g.y))g.x+=vx;
     if(pass(g.x,g.y+vy))g.y+=vy;
    }
    for(const e of g.enemies){
     if(!e.alive)continue;
     const dist=Math.hypot(g.x-e.x,g.y-e.y);
     if(dist>.7&&dist<6&&lineClear(e.x,e.y,g.x,g.y)){
      const dx=(g.x-e.x)/dist*dt*.34,dy=(g.y-e.y)/dist*dt*.34;
      if(pass(e.x+dx,e.y))e.x+=dx;
      if(pass(e.x,e.y+dy))e.y+=dy;
     }
     if(dist<.78&&now-g.lastHit>1200){
      g.lastHit=now;g.hp=Math.max(0,g.hp-20);setHud({hp:g.hp,kills:g.kills});
      if(g.hp===0){g.running=false;setStatus("lost");}
     }
    }
   }
   draw(ctx,g);
   raf=window.requestAnimationFrame(loop);
  };
  raf=window.requestAnimationFrame(loop);
  return()=>window.cancelAnimationFrame(raf);
 },[]);
 const hold=(key:string,label:string,icon:ReactNode)=><button type="button" aria-label={label} className={hudButton}
  onPointerDown={e=>{e.preventDefault();held.current.add(key);e.currentTarget.setPointerCapture(e.pointerId);}}
  onPointerUp={()=>held.current.delete(key)} onPointerCancel={()=>held.current.delete(key)} onLostPointerCapture={()=>held.current.delete(key)}>{icon}</button>;
 return <section className="rounded-2xl border border-white/15 bg-[#111] p-4 sm:p-6">
  <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/45">{en?"ORIGINAL RETRO FIRST-PERSON GAME":"AUTORSKA GRA RETRO FPP"}</p>
  <h2 className="mt-2 text-2xl font-semibold">{en?"Retro FPS — Doom-style":"Retro FPS — w stylu Dooma"}</h2>
  <p className="mt-2 text-sm leading-6 text-white/60">{en?"Explore a 3D maze and eliminate three opponents. This is a lightweight original ray-casting game, not the original Doom.":"Przejdź przez trójwymiarowy labirynt i pokonaj trzech przeciwników. Lekka autorska gra 3D inspirowana klasycznymi FPS-ami, nie oryginalny Doom."}</p>
  <div className="my-4 flex flex-wrap items-center justify-between gap-3 text-sm">
   <div>{en?"Health":"Zdrowie"}: <strong>{hud.hp}%</strong> <span className="mx-2 text-white/25">|</span> {en?"Targets":"Cele"}: <strong>{hud.kills}/3</strong></div>
   <button type="button" className="flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4" onClick={begin}><RotateCcw size={16}/>{status==="ready"?(en?"Start":"Start"):(en?"Restart":"Od nowa")}</button>
  </div>
  <div className="relative mx-auto max-w-[860px] overflow-hidden rounded-xl border border-white/20 bg-black">
   <canvas ref={canvas} width={W} height={H} onPointerDown={shoot} aria-label={en?"3D retro shooter game view":"Widok gry strzelanki 3D"} className="block aspect-[16/9] w-full touch-none"/>
   {status!=="playing"&&<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 p-4 text-center"><p className="rounded-xl bg-black/75 px-5 py-3 text-lg font-semibold">{status==="ready"?(en?"Press Start to play":"Naciśnij Start, aby zagrać"):status==="win"?(en?"Victory! All targets eliminated.":"Wygrana! Wszystkie cele pokonane."):(en?"Game over. Try again.":"Koniec gry. Spróbuj ponownie.")}</p></div>}
  </div>
  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
   <div className="flex items-center gap-2">
    {hold("arrowleft",en?"Turn left":"Obrót w lewo",<ArrowLeft size={21}/>)}
    <div className="flex flex-col gap-1">
     {hold("arrowup",en?"Forward":"Naprzód",<ArrowUp size={21}/>)}
     {hold("arrowdown",en?"Back":"Wstecz",<ArrowDown size={21}/>)}
    </div>
    {hold("arrowright",en?"Turn right":"Obrót w prawo",<ArrowRight size={21}/>)}
   </div>
   <button type="button" disabled={status!=="playing"} onPointerDown={e=>{e.preventDefault();shoot();}} className="flex min-h-16 min-w-32 touch-none items-center justify-center gap-2 rounded-2xl border border-rose-400/60 bg-rose-900/35 px-5 text-sm font-bold text-white active:bg-rose-800/70 disabled:opacity-40"><Crosshair size={23}/>{en?"FIRE":"STRZAŁ"}</button>
  </div>
  <p className="mt-4 text-xs leading-6 text-white/50">{en?"Phone: hold movement buttons and tap FIRE. Desktop: arrows or WASD to move/turn, Space to shoot.":"Telefon: przytrzymuj przyciski ruchu i dotykaj STRZAŁ. Komputer: strzałki lub WASD, spacja — strzał."}</p>
 </section>;
}
