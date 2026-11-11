import {describe,expect,it} from "vitest";
import {berniTransitionFrame,chooseBerniTransition,emptyTransitionMemory,transitionLevel,type BerniTransitionName} from "./berni-transition";
const effects:BerniTransitionName[]=[
 "dive","tuck","drop","boomerang","swoop-left","swoop-right","orbit-left",
 "orbit-right","micro-tornado","blur-twist","spiral","pearl","zoom-pop",
 "whiplash","side-arc","roll-in","flip-peek","bounce-swirl",
];
describe("Berni cinematic animation selection",()=>{
 it("has 18 unique transitions with complete frames",()=>{
  expect(new Set(effects).size).toBe(18);
  for(const name of effects){
   const start=berniTransitionFrame(name,0),middle=berniTransitionFrame(name,.5),end=berniTransitionFrame(name,1);
   expect(start.opacity).toBe(1);expect(end.opacity).toBe(1);
   expect(middle.opacity).toBe(0); // never expose pixel-misaligned swapped textures
   expect(middle.scaleX).toBeGreaterThan(0);
   expect(middle.scaleY).toBeGreaterThan(0);
   expect(Number.isFinite(middle.rotate)).toBe(true);
   expect(Number.isFinite(middle.blur)).toBe(true);
  }
 });
 it("does not use cinematic effects for blinking, gaze changes or the same expression",()=>{
  const mem=emptyTransitionMemory();
  for(const mood of ["curious","thinking","listening","working"] as const)
   expect(chooseBerniTransition("idle",mood,1000,mem,()=>0)).toBeNull();
  expect(transitionLevel("idle","idle")).toBe("none");
  expect(chooseBerniTransition("idle","idle",1000,mem)).toBeNull();
 });
 it("gives major reactions plenty of different transitions without repeating recent effects",()=>{
  const mem=emptyTransitionMemory(), seen:string[]=[];
  for(let k=0;k<14;k++){
   const next=chooseBerniTransition("idle","excited",100000+26000*k,mem,()=>.37);
   expect(next).not.toBeNull();
   const name=next!.name;
   expect(seen.slice(-5)).not.toContain(name);
   seen.push(name);
  }
  expect(new Set(seen).size).toBeGreaterThanOrEqual(6);
 });
 it("never exposes instant full-face swaps during rapid mixed mood switching",()=>{
   const mem=emptyTransitionMemory();
   for(let i=0;i<30;i++){
     const a=i%2===0?"idle":"happy";
     const b=i%2===0?"surprised":"typing";
     const chosen=chooseBerniTransition(a,b,100000+i*190,mem,()=>.92);
     expect(chosen,"No transition for a large facial change").not.toBeNull();
     const center=berniTransitionFrame(chosen!.name,.5);
     expect(center.opacity).toBe(0);
   }
 });
 it("uses medium effects for mouth changes and longer cooldowns for impressive spins",()=>{
  expect(transitionLevel("idle","happy")).toBe("medium");
  expect(transitionLevel("typing","thinking")).toBe("medium");
  expect(transitionLevel("idle","surprised")).toBe("large");
  const mem=emptyTransitionMemory();
  const first=chooseBerniTransition("idle","excited",100000,mem,()=>.9);
  expect(first).not.toBeNull();
  const second=chooseBerniTransition("idle","excited",101000,mem,()=>.9);
  expect(second?.name).not.toBe(first?.name);
 });
});