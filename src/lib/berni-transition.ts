import type { BerniLivingMood } from "./berni-face-state";

export type BerniTransitionName =
 | "dive" | "tuck" | "drop" | "boomerang" | "swoop-left" | "swoop-right"
 | "orbit-left" | "orbit-right" | "micro-tornado" | "blur-twist"
 | "spiral" | "pearl" | "zoom-pop" | "whiplash" | "side-arc"
 | "roll-in" | "flip-peek" | "bounce-swirl";

export type TransitionChoice = {
 name:BerniTransitionName; duration:number; strength:"small"|"medium"|"large";
};
export type TransitionMemory = {
 previous:BerniTransitionName[];
 used:Partial<Record<BerniTransitionName,number>>;
 lastBigAt:number;
};

export type TransitionFrame = {
 phase:"exit"|"hidden"|"enter";
 visible:boolean;
 x:number;y:number;rotate:number;scaleX:number;scaleY:number;
 blur:number;opacity:number;
 accent:"dust"|"spin"|"speed"|"spark"|"none";
};

// Coordinates are measured in whole portraits, not tiny CSS pixel nudges.
// Exit poses end fully beyond the crop (or vanish to a point), and the new
// character enters only after the empty interval.
type PoseTransform={x:number;y:number;spin:number;sx:number;sy:number};
type Definition={
 name:BerniTransitionName;
 strength:"small"|"medium"|"large";
 ms:number; cooldown:number;
 out:PoseTransform; enter:PoseTransform;
 accent:TransitionFrame["accent"];
};
const profile=(name:BerniTransitionName,strength:Definition["strength"],ms:number,cooldown:number,
 out:PoseTransform,enter:PoseTransform,accent:Definition["accent"]):Definition=>({
 name,strength,ms,cooldown,out,enter,accent
});
const effects:Definition[]=[
 profile("dive","medium",680,6500,{x:0,y:1.4,spin:-.1,sx:.82,sy:.66},{x:0,y:1.45,spin:.1,sx:.75,sy:.8},"dust"),
 profile("tuck","small",410,5200,{x:0,y:.28,spin:-.3,sx:.08,sy:.15},{x:0,y:-.22,spin:.2,sx:.06,sy:.25},"spark"),
 profile("drop","medium",720,7400,{x:.08,y:1.7,spin:0,sx:.95,sy:.68},{x:-.07,y:-1.55,spin:0,sx:1,sy:1.25},"dust"),
 profile("boomerang","medium",710,7500,{x:1.32,y:-.72,spin:1.6,sx:.75,sy:.75},{x:-1.30,y:.55,spin:-1.4,sx:.8,sy:.8},"speed"),
 profile("swoop-left","medium",650,7500,{x:-1.65,y:.14,spin:-.7,sx:1.05,sy:.75},{x:1.65,y:-.13,spin:.65,sx:1.08,sy:.8},"speed"),
 profile("swoop-right","medium",650,7500,{x:1.65,y:-.15,spin:.68,sx:1.1,sy:.75},{x:-1.65,y:.17,spin:-.75,sx:1.1,sy:.8},"speed"),
 profile("orbit-left","large",850,14000,{x:-1.35,y:-1.1,spin:-5.8,sx:.4,sy:.4},{x:1.28,y:.95,spin:5.2,sx:.46,sy:.46},"spin"),
 profile("orbit-right","large",850,14000,{x:1.35,y:-1.1,spin:5.8,sx:.4,sy:.4},{x:-1.26,y:.9,spin:-5.2,sx:.45,sy:.45},"spin"),
 profile("micro-tornado","large",930,17500,{x:0,y:.58,spin:9.4,sx:.02,sy:.05},{x:0,y:.62,spin:-8.8,sx:.02,sy:.08},"spin"),
 profile("blur-twist","medium",590,8000,{x:-.4,y:.12,spin:-2.9,sx:.06,sy:.08},{x:.4,y:-.12,spin:2.5,sx:.06,sy:.08},"spark"),
 profile("spiral","large",950,16000,{x:.26,y:-.26,spin:11,sx:.01,sy:.01},{x:-.18,y:.20,spin:-10,sx:.01,sy:.01},"spin"),
 profile("pearl","small",430,5000,{x:0,y:-.06,spin:0,sx:.01,sy:.01},{x:0,y:.1,spin:0,sx:.01,sy:.01},"spark"),
 profile("zoom-pop","small",520,6000,{x:0,y:0,spin:.15,sx:2.4,sy:2.4},{x:0,y:0,spin:-.12,sx:.05,sy:.05},"spark"),
 profile("whiplash","medium",550,8000,{x:1.8,y:.02,spin:.4,sx:1.55,sy:.56},{x:-1.8,y:.03,spin:-.4,sx:1.5,sy:.55},"speed"),
 profile("side-arc","medium",760,9500,{x:-1.36,y:-.92,spin:-2.1,sx:.64,sy:.64},{x:1.42,y:-.92,spin:2.0,sx:.64,sy:.64},"speed"),
 profile("roll-in","large",850,17000,{x:-1.38,y:.88,spin:-6.1,sx:.92,sy:.92},{x:1.38,y:-.84,spin:6.3,sx:.92,sy:.92},"spin"),
 profile("flip-peek","small",480,6200,{x:0,y:.02,spin:.13,sx:.008,sy:1},{x:0,y:0,spin:-.13,sx:.008,sy:1},"spark"),
 profile("bounce-swirl","large",970,15000,{x:.45,y:1.34,spin:5.0,sx:.24,sy:.20},{x:-.44,y:-1.38,spin:-5.2,sx:.24,sy:.2},"dust"),
];
const big=new Set<BerniLivingMood>(["excited","surprised","grabbed","sleeping"]);
const medium=new Set<BerniLivingMood>(["happy","worried","typing"]);
export function transitionLevel(a:BerniLivingMood,b:BerniLivingMood):"none"|"small"|"medium"|"large"{
 if(a===b)return "none";
 if(big.has(a)||big.has(b))return "large";
 if(medium.has(a)||medium.has(b))return "medium";
 return "small";
}
export function emptyTransitionMemory():TransitionMemory{return {previous:[],used:{},lastBigAt:-Infinity};}
export function chooseBerniTransition(a:BerniLivingMood,b:BerniLivingMood,now:number,mem:TransitionMemory,rng=Math.random):TransitionChoice|null{
 const level=transitionLevel(a,b);if(level==="none")return null;
 const grades=level==="small"?["small"]:level==="medium"?["medium","small"]:["large","medium"];
 const eligible=effects.filter(f=>grades.includes(f.strength));
 const recent=new Set(mem.previous.slice(-5));
 let pool=eligible.filter(e=>!recent.has(e.name)&&now-(mem.used[e.name]??-Infinity)>e.cooldown
   &&(e.strength!=="large"||now-mem.lastBigAt>1200));
 if(!pool.length)pool=eligible.filter(e=>!recent.has(e.name));
 if(!pool.length)pool=eligible.slice().sort((u,v)=>(mem.used[u.name]??-Infinity)-(mem.used[v.name]??-Infinity)).slice(0,2);
 const item=pool[Math.min(pool.length-1,Math.floor(Math.max(0,Math.min(.99999,rng()))*pool.length))];
 if(!item)return null;
 mem.previous.push(item.name);if(mem.previous.length>8)mem.previous.shift();
 mem.used[item.name]=now;if(item.strength==="large")mem.lastBigAt=now;
 return{name:item.name,duration:item.ms,strength:item.strength};
}
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(x:number)=>{const p=clamp(x);return p*p*(3-2*p);};
const outEase=(x:number)=>Math.pow(clamp(x),2.4);
const elastic=(x:number)=>{const p=clamp(x);return p===0?0:p===1?1:1+2.6*Math.pow(p-1,3)+1.6*Math.pow(p-1,2);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;

export function berniTransitionFrame(name:BerniTransitionName,progress:number):TransitionFrame {
 const def=effects.find(x=>x.name===name);if(!def)throw Error("Unknown Berni effect "+name);
 const p=clamp(progress);
 // REAL empty interval. There is never one frame with both characters,
 // and no stationary portrait hiding underneath the canvas.
 const EXIT_END=.43, ENTER_START=.58;
 if(p>=EXIT_END&&p<=ENTER_START){
   return{phase:"hidden",visible:false,x:0,y:0,rotate:0,scaleX:1,scaleY:1,blur:0,opacity:0,accent:def.accent};
 }
 const exit=p<EXIT_END;
 const u=exit?outEase(p/EXIT_END):elastic((p-ENTER_START)/(1-ENTER_START));
 const target=exit?def.out:def.enter;
 const k=exit?u:1-u;
 const scaleX=mix(1,target.sx,k),scaleY=mix(1,target.sy,k);
 const opacity=exit?1-smooth((p/EXIT_END-.67)/.33):smooth(((p-ENTER_START)/(1-ENTER_START))/.33);
 return{
   phase:exit?"exit":"enter",visible:opacity>.005,
   x:target.x*k,y:target.y*k,rotate:target.spin*k,
   scaleX:Math.max(.002,scaleX),scaleY:Math.max(.002,scaleY),
   blur:exit?6*u:6*(1-clamp((p-ENTER_START)/(1-ENTER_START))),
   opacity,accent:def.accent
 };
}
