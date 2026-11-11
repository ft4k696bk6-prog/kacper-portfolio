"use client";
import { useEffect,useRef,useState } from "react";
import type { BerniMood,BerniWeather } from "@/lib/berni-reactions";
import { getBerniTemperatureMood } from "@/lib/berni-reactions";
import styles from "./BerniRendered3D.module.css";

// Real animated Quaternius Robot GLB (CC0); not an image pretending to be 3D.
// The model is same-origin from /api/berni-model.  A single WebGL viewer
// supplies snapshots for all small chat avatars to avoid multiple GPU contexts.
const SCRIPT="https://ajax.googleapis.com/ajax/libs/model-viewer/4.4.0/model-viewer.min.js";
const SNAPSHOT_EVENT="berni-quaternius-snapshot";
let viewerScript:Promise<void>|null=null;
let portrait:string|null=null;
type Pbr={baseColorFactor?:number[];setBaseColorFactor?:(color:string)=>void;setMetallicFactor?:(x:number)=>void;setRoughnessFactor?:(x:number)=>void};
type Viewer=HTMLElement & {model?:{materials?:Array<{name?:string;pbrMetallicRoughness?:Pbr}>};availableAnimations?:string[];animationName?:string;play?:(o?:{repetitions?:number})=>void;pause?:()=>void;toDataURL?:()=>Promise<string>|string};
const clips:Record<BerniMood,string>={
 idle:"Robot_Idle",curious:"Robot_Yes",thinking:"Robot_Standing",
 happy:"Robot_Wave",excited:"Robot_Dance",sleeping:"Robot_Sitting",
 typing:"Robot_Punch",working:"Robot_Punch",listening:"Robot_Yes",
 surprised:"Robot_Jump",worried:"Robot_No",grabbed:"Robot_Jump"
};
function loadViewer():Promise<void>{
 if(customElements.get("model-viewer"))return Promise.resolve();
 if(viewerScript)return viewerScript;
 viewerScript=new Promise<void>((resolve,reject)=>{
  const script=document.createElement("script");
  script.type="module";script.src=SCRIPT;
  script.onload=()=>{customElements.whenDefined("model-viewer").then(()=>resolve(),reject)};
  script.onerror=()=>reject(Error("3D runtime blocked"));
  document.head.appendChild(script);
 });
 return viewerScript;
}
function recolor(viewer:Viewer){
 for(const material of viewer.model?.materials??[]){
  const p=material.pbrMetallicRoughness;if(!p)continue;
  const c=p.baseColorFactor??[.5,.5,.5,1];
  const dark=/eye|black|visor|screen|dark|face/i.test(material.name??"") || (.2126*c[0]+.7152*c[1]+.0722*c[2])<.3;
  p.setBaseColorFactor?.(dark?"#202833":"#BFC8D2");
  p.setMetallicFactor?.(dark?.3:.72);
  p.setRoughnessFactor?.(dark?.5:.32);
 }
}
function animate(viewer:Viewer,mood:BerniMood){
 if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden){viewer.pause?.();return;}
 const available=viewer.availableAnimations??[];
 const requested=clips[mood];
 viewer.animationName=available.includes(requested)?requested:available.includes("Robot_Idle")?"Robot_Idle":available[0]??requested;
 viewer.play?.({repetitions:Infinity});
}
export function BerniRendered3D({mood,weather,lang,compact=false}:{mood:BerniMood;weather?:BerniWeather|null;lang:"pl"|"en";compact?:boolean}){
 const host=useRef<HTMLSpanElement>(null);
 const model=useRef<Viewer|null>(null);
 const currentMood=useRef(mood);
 const [snapshot,setSnapshot]=useState<string|null>(()=>portrait);
 const [failed,setFailed]=useState(false);
 useEffect(()=>{currentMood.current=mood;if(model.current)animate(model.current,mood)},[mood]);
 useEffect(()=>{
  if(!compact)return;
  const update=()=>setSnapshot(portrait);
  window.addEventListener(SNAPSHOT_EVENT,update);
  return()=>window.removeEventListener(SNAPSHOT_EVENT,update);
 },[compact]);
 useEffect(()=>{
  if(compact)return; // Only the main companion gets WebGL, chat miniatures use snapshot.
  let alive=true;let viewer:Viewer|null=null;
  const node=host.current;if(!node)return;
  void loadViewer().then(()=>{
   if(!alive)return;
   const el=document.createElement("model-viewer") as Viewer;
   viewer=el;model.current=el;el.className=styles.model;
   el.setAttribute("src","/api/berni-model");
   el.setAttribute("loading","eager");
   el.setAttribute("animation-name","Robot_Idle");
   el.setAttribute("camera-orbit","0deg 75deg 120%");
   el.setAttribute("field-of-view","29deg");
   el.setAttribute("shadow-intensity",".65");
   el.setAttribute("environment-image","neutral");
   el.setAttribute("exposure","1.12");
   el.setAttribute("interaction-prompt","none");
   el.setAttribute("aria-hidden","true");
   el.addEventListener("load",()=>{
    if(!alive)return;
    recolor(el);animate(el,currentMood.current);
    if(!portrait && el.toDataURL){
     window.setTimeout(()=>{
      if(!alive||!el.toDataURL)return;
      void Promise.resolve(el.toDataURL()).then((data)=>{
       if(!alive||!data.startsWith("data:image/"))return;
       portrait=data;window.dispatchEvent(new Event(SNAPSHOT_EVENT));
      }).catch(()=>{});
     },800);
    }
   });
   el.addEventListener("error",()=>{if(alive)setFailed(true)});
   node.appendChild(el);
  }).catch(()=>{if(alive)setFailed(true)});
  const visibility=()=>{if(model.current)animate(model.current,currentMood.current)};
  document.addEventListener("visibilitychange",visibility);
  return()=>{alive=false;document.removeEventListener("visibilitychange",visibility);viewer?.remove();model.current=null};
 },[compact]);
 const typing=mood==="typing"||mood==="working";
 return <span ref={host} role="img"
   aria-label={lang==="pl"?"Berni, animowany robot Quaternius 3D":"Berni, animated Quaternius 3D robot"}
   data-testid="berni-quaternius-3d" data-mood={mood}
   data-thermal={weather?getBerniTemperatureMood(weather.temperature):"normal"}
   data-compact={compact?"true":"false"} className={styles.stage}>
   {compact&&snapshot?<img src={snapshot} alt="" className={styles.portrait}/>:null}
   {(failed||compact&&!snapshot)?<span className={styles.placeholder} aria-hidden="true"><span>B</span></span>:null}
   {typing&&!compact&&!failed?<span data-testid="berni-active-keyboard" className={styles.keyboard}><span className={styles.keys}/></span>:null}
   {mood==="sleeping"&&!compact?<span className={styles.sleep}>z<span>z</span></span>:null}
 </span>;
}
