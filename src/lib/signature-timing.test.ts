import {describe,expect,it} from "vitest";
import {signatureGifStages,signatureProgressAt,SIGNATURE_LOOP_MS,SIGNATURE_TIMING} from "./signature-timing";
import {renderSignatureScene} from "./signature-scenes";
import type {SignatureFields} from "./everyday-utils";

const fields:SignatureFields={
 name:"Jan Kowalski",role:"CEO",company:"Test Studio",
 email:"jan@example.com",phone:"+48 500 600 700",website:"example.com",
 accent:"#787878",photoFocusX:50,photoFocusY:42
};
function getDrawImageArgs(f:SignatureFields):number[][]{
 const draws:number[][]=[];
 const fake=new Proxy({} as CanvasRenderingContext2D,{
  get:(target,k)=>Reflect.get(target,k)??((...args:unknown[])=>{
   if(k==="drawImage")draws.push(args.slice(1).map(Number));
  }),
  set:(target,k,v)=>Reflect.set(target,k,v)
 });
 renderSignatureScene(fake,f,"geometry",1,{
  logo:null,photo:{naturalWidth:360,naturalHeight:640} as HTMLImageElement
 });
 return draws;
}
describe("User video reference: reveal/hold/reverse and unclipped portrait",()=>{
 it("keeps a completed fallback as the first GIF frame",()=>{
  for(const loop of [false,true]){
   const stages=signatureGifStages(loop);
   expect(stages[0].p).toBe(1);
   expect(stages[0].delay).toBeGreaterThan(20);
   expect(stages[1].p).toBe(0);
   expect(stages.some(s=>s.p>0&&s.p<1)).toBe(true);
  }
 });
 it("holds the complete reference composition, then reverses only when looping",()=>{
  const {introMs,forwardMs,holdMs,reverseMs}=SIGNATURE_TIMING;
  const end=introMs+forwardMs;
  expect(signatureProgressAt(end+holdMs/2,true)).toBe(1);
  expect(signatureProgressAt(end+holdMs+reverseMs/2,true)).toBeCloseTo(.5,3);
  expect(signatureProgressAt(SIGNATURE_LOOP_MS-1,true)).toBe(0);
  expect(signatureProgressAt(SIGNATURE_LOOP_MS,true)).toBe(0);
  expect(signatureProgressAt(end+holdMs+reverseMs+200,false)).toBe(1);
  const loopStages=signatureGifStages(true),singleStages=signatureGifStages(false);
  expect(loopStages.length).toBeGreaterThan(singleStages.length);
  expect(loopStages.at(-1)?.p).toBe(0);
  expect(singleStages.at(-1)?.p).toBe(1);
 });
 it("repositions the photo across all diagonal shards without changing their geometry",()=>{
  const left=getDrawImageArgs({...fields,photoFocusX:0,photoFocusY:0});
  const right=getDrawImageArgs({...fields,photoFocusX:100,photoFocusY:100});
  expect(left.length).toBe(3);
  expect(right.length).toBe(3);
  expect(left[0][0]).not.toBe(right[0][0]);
  expect(left[0][1]).toBe(right[0][1]);
  for(let i=0;i<3;i++){
   expect(left[i][2]).toBe(right[i][2]);
   expect(left[i][3]).toBe(right[i][3]);
  }
 });
});
