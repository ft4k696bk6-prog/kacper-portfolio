import { describe, expect, it } from "vitest";
import { renderSignatureScene, type SignatureMotion } from "./signature-scenes";
import type { SignatureFields } from "./everyday-utils";

const fields:SignatureFields={
 name:"Jan Kowalski",role:"Założyciel",company:"ACME Studio",
 email:"jan@example.pl",phone:"+48 555 666 777",website:"acme.pl",
 accent:"#898989",language:"pl",layout:"side"
};
const variants:SignatureMotion[]=["geometry","slices","cinematic","reveal","slide","pulse"];

function trace(motion:SignatureMotion,progress:number){
 const calls:string[]=[];
 const context=new Proxy({} as CanvasRenderingContext2D,{
  get:(target,key)=>{
   const actual=Reflect.get(target,key);
   return actual??((...args:unknown[])=>{calls.push(String(key)+"("+args.map(String).join(",")+")");});
  },
  set:(target,key,value)=>{
   calls.push(String(key)+"="+String(value));
   return Reflect.set(target,key,value);
  }
 });
 renderSignatureScene(context,fields,motion,progress,{logo:null,photo:null});
 return calls.join("\n");
}
describe("Email signature animation presets",()=>{
 it("renders SIX visually distinct completed card layouts, rather than two with trivial offsets",()=>{
  const outputs=variants.map(id=>trace(id,1));
  expect(new Set(outputs).size).toBe(6);
  outputs.forEach(output=>{
   expect(output).toContain("fillRect(");
   expect(output).toContain("Jan Kowalski");
  });
  expect(trace("geometry",1)).toContain("clip(");
  expect(trace("slices",1)).toContain("#13151b");
  expect(trace("cinematic",1)).toContain("#f2eee7");
  expect(trace("reveal",1)).toContain("#f4f4f4");
  expect(trace("slide",1)).toContain("#20232a");
  expect(trace("pulse",1)).toContain("#0c101d");
 });
 it.each(variants)("animates %s with genuinely different intermediate and final frames",motion=>{
  const entering=trace(motion,.19),final=trace(motion,1);
  expect(entering).not.toBe(final);
  expect(final).toContain("fillText(");
 });
});
