import {describe,it,expect} from "vitest";
import {advancedSignatureHtml,safeHttps,signatureDefaults} from "./signature-pro";

describe("advanced email signatures",()=>{
 it("blocks unsafe links and script markup",()=>{
  const a=advancedSignatureHtml({...signatureDefaults,name:"<img src=x onerror=alert(1)>",logoUrl:"javascript:alert(1)",web:"data:text/html,x",linkedin:"http://example.com"});
  expect(a).not.toContain("<img src=x");
  expect(a).not.toContain("javascript:");
  expect(a).not.toContain("data:text");
  expect(a).toContain("&lt;img");
  expect(safeHttps("https://example.com")).toContain("https://example.com/");
 });
 it("has genuine hosted GIF only on opt-in",()=>{
  const a=advancedSignatureHtml({...signatureDefaults,bolt:true,theme:"dark"});
  expect(a).toContain("berni-lightning.gif");expect(a).toContain("background:#171717");
  expect(advancedSignatureHtml(signatureDefaults)).not.toContain("berni-lightning.gif");
 });
 it("provides responsive table and email links",()=>{
  const a=advancedSignatureHtml({...signatureDefaults,email:"a@example.com",phone:"+48 123 234 345",web:"example.org",company:"Berni"});
  expect(a).toContain("max-width:560px");expect(a).toContain("mailto:a@example.com");expect(a).toContain('href="https://example.org/"');
 });
});
