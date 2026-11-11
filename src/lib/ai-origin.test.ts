import {describe,it,expect} from "vitest";
import {aiScore,imageFileAllowed,inspectGeneratorMarkers} from "./ai-origin";
describe("AI provenance and classifier display",()=>{
 it("never manufactures likelihood without a real classifier output",()=>{
  expect(aiScore([])).toBeNull();
  expect(aiScore([{label:"Unknown",score:0.97}])).toBeNull();
  expect(aiScore([{label:"Fake",score:0.97}])).toBe(97);
  expect(aiScore([{label:"Real",score:0.91}])).toBeCloseTo(9);
  expect(aiScore([{label:"Fake",score:5}])).toBeNull();
 });
 it("metadata evidence is separate from model prediction",()=>{
  const bytes=new TextEncoder().encode("C2PA ComfyUI Adobe XMP");
  expect(inspectGeneratorMarkers(bytes.buffer)).toContain("C2PA");
  expect(inspectGeneratorMarkers(new Uint8Array([1,2,3]).buffer)).toHaveLength(0);
 });
 it("limits uploads to supported formats and sizes",()=>{
  expect(imageFileAllowed({size:200,type:"image/png"})).toBe(true);
  expect(imageFileAllowed({size:20e6,type:"image/png"})).toBe(false);
  expect(imageFileAllowed({size:100,type:"image/svg+xml"})).toBe(false);
 });
});
