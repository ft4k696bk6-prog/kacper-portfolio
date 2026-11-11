import type { BerniLivingMood } from "./berni-face-state";
export type BerniTransitionName =
 | "dive" | "tuck" | "drop" | "boomerang" | "swoop-left" | "swoop-right"
 | "orbit-left" | "orbit-right" | "micro-tornado" | "blur-twist"
 | "spiral" | "pearl" | "zoom-pop" | "whiplash" | "side-arc"
 | "roll-in" | "flip-peek" | "bounce-swirl";
export type TransitionChoice = { name: BerniTransitionName; duration: number; strength: "medium" | "large" };
export type TransitionMemory = { previous: BerniTransitionName[]; used: Partial<Record<BerniTransitionName,number>>; lastBigAt:number };
export type TransitionFrame = { x:number;y:number;rotate:number;scaleX:number;scaleY:number;blur:number;opacity:number };
const definitions: {name:BerniTransitionName;strength:"medium"|"large";ms:number;cooldown:number}[]=[
 ["dive","medium",550,7000],["tuck","medium",510,9000],["drop","medium",600,7000],
 ["boomerang","medium",650,8500],["swoop-left","medium",600,7500],["swoop-right","medium",610,7500],
 ["orbit-left","large",740,18000],["orbit-right","large",720,18000],["micro-tornado","large",780,19000],
 ["blur-twist","medium",590,9500],["spiral","large",790,22000],["pearl","medium",540,9000],
 ["zoom-pop","medium",610,10500],["whiplash","medium",560,10000],["side-arc","medium",690,11000],
 ["roll-in","large",790,19000],["flip-peek","large",720,18000],["bounce-swirl","large",800,20000],
].map(([name,strength,ms,cooldown])=>({name:name as BerniTransitionName,strength:strength as "medium"|"large",ms:ms as number,cooldown:cooldown as number}));
const big=new Set<BerniLivingMood>(["surprised","excited","grabbed","sleeping"]);
const meaningful=new Set<BerniLivingMood>(["happy","worried","typing"]);
export function transitionLevel(a:BerniLivingMood,b:BerniLivingMood): "none"|"medium"|"large" {
 if(a===b)return "none";
 if(big.has(a)||big.has(b))return "large";
 if(meaningful.has(a)||meaningful.has(b))return "medium";
 return "none"; // blinking, looking and ordinary thinking have no flashy transitions
}
export function emptyTransitionMemory():TransitionMemory{return {previous:[],used:{},lastBigAt:-Infinity};}
export function chooseBerniTransition(a:BerniLivingMood,b:BerniLivingMood,now:number,mem:TransitionMemory,rng=Math.random):TransitionChoice|null {
 const level=transitionLevel(a,b); if(level==="none")return null;
 const recent=new Set(mem.previous.slice(-5));
 const allowed=definitions.filter(d=>level==="large"||d.strength==="medium");
 const usable=allowed.filter(d=>!recent.has(d.name));
 let pool=usable.filter(d=>now-(mem.used[d.name]??-Infinity)>d.cooldown
   &&(d.strength!=="large"||now-mem.lastBigAt>1300));
 // Even under frantic clicking, a large change must NEVER hard-swap an entire
 // face in plain sight. Gracefully relax cooldowns while still avoiding the
 // five most recent effects; cooldowns are strict whenever sufficient choices exist.
 if(!pool.length)pool=usable.filter(d=>d.strength==="medium"||now-mem.lastBigAt>450);
 if(!pool.length)pool=usable;
 if(!pool.length)pool=allowed.slice().sort((u,v)=>(mem.used[u.name]??-Infinity)-(mem.used[v.name]??-Infinity)).slice(0,3);
 if(!pool.length)return null;
 const i=Math.min(pool.length-1,Math.floor(Math.max(0,Math.min(.999999,rng()))*pool.length));
 const item=pool[i];mem.previous.push(item.name);
 if(mem.previous.length>8)mem.previous.shift();
 mem.used[item.name]=now;if(item.strength==="large")mem.lastBigAt=now;
 return {name:item.name,duration:item.ms,strength:item.strength};
}
export function berniTransitionFrame(name:BerniTransitionName,progress:number):TransitionFrame {
 const p=Math.min(1,Math.max(0,progress)),a=Math.sin(Math.PI*p);
 let x=0,y=0,r=0,s=1-.55*a,squeeze=1;
 switch(name){
 case "dive":y=.60*a;s=1-.72*a;break;
 case "tuck":y=.26*a;r=-.20*a;s=1-.70*a;break;
 case "drop":y=.73*a;r=.15*a;s=1-.62*a;break;
 case "boomerang":x=.46*a;y=-.28*a;r=-.4*a;break;
 case "swoop-left":x=-.67*a;y=.20*a;r=-.28*a;break;
 case "swoop-right":x=.67*a;y=.20*a;r=.28*a;break;
 case "orbit-left":x=-.37*a;y=-.44*a;r=-2.2*a;break;
 case "orbit-right":x=.37*a;y=-.44*a;r=2.2*a;break;
 case "micro-tornado":r=5.1*a;y=.21*a;s=1-.76*a;break;
 case "blur-twist":r=-.65*a;y=-.13*a;s=1-.65*a;break;
 case "spiral":r=4.6*a;x=.33*a;y=.25*a;s=1-.79*a;break;
 case "pearl":s=1-.88*a;y=-.08*a;break;
 case "zoom-pop":s=1+.31*a;r=.12*a;break;
 case "whiplash":x=-.43*a;r=.65*a;squeeze=1-.25*a;break;
 case "side-arc":x=.34*a;y=-.44*a;r=.68*a;break;
 case "roll-in":x=-.58*a;r=3.2*a;s=1-.65*a;break;
 case "flip-peek":squeeze=1-.94*a;y=.18*a;break;
 case "bounce-swirl":y=.50*a;x=.19*a;r=-3.1*a;s=1-.70*a;break;
 }
 // Full-face swap only at p=.5, when the outgoing frame is fully hidden.
 return {x,y,rotate:r,scaleX:s*squeeze,scaleY:s,blur:2.2*a,opacity:Math.pow(Math.abs(2*p-1),.8)};
}