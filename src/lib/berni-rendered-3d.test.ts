import { describe,expect,it } from "vitest";
import { readFileSync } from "node:fs";
const pet=readFileSync("src/components/BerniCompanion.tsx","utf8");
const model=readFileSync("src/components/BerniRendered3D.tsx","utf8");
const css=readFileSync("src/components/BerniRendered3D.module.css","utf8");
const assistant=readFileSync("src/components/AIMascotAssistant.tsx","utf8");
const route=readFileSync("src/app/api/berni-model/route.ts","utf8");
const config=readFileSync("next.config.ts","utf8");
describe("Berni actual Quaternius GLB",()=>{
 it("uses a true skinned animated model, not a flat image",()=>{
  expect(model).toContain('document.createElement("model-viewer")');
  expect(model).toContain('el.setAttribute("src","/api/berni-model")');
  expect(route).toContain("raysan5/raylib/master/examples/models/resources/models/gltf/robot.glb");
  expect(route).toContain("model/gltf-binary");
  expect(model).not.toContain("berni-3d.svg");
 });
 it("recolors it silver and graphite, not blue or yellow",()=>{
  expect(model).toContain("#202833");
  expect(model).toContain("#BFC8D2");
  expect(model).toContain("setMetallicFactor");
  expect(css).toContain("grayscale(1)");
  expect(config).toContain("https://ajax.googleapis.com");
 });
 it("limits GPU instances and respects reduced motion",()=>{
  expect(model).toContain("if(compact)return; // Only the main companion gets WebGL");
  expect(model).toContain("toDataURL");
  expect(model).toContain("prefers-reduced-motion: reduce");
 });
 it("supports reaction clips with typing only during AI output",()=>{
  for(const clip of ["Robot_Idle","Robot_Wave","Robot_Dance","Robot_Sitting","Robot_Punch","Robot_Yes","Robot_No"]) expect(model).toContain(clip);
  expect(model).toContain('data-testid="berni-active-keyboard"');
  expect(pet).toContain('(loading || nudgeWriting) ? "typing"');
  expect(pet).not.toContain('input.trim() ? "typing"');
  expect(assistant).toContain("BerniRendered3D");
 });
});
