import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { seasonalBerniAccessory } from "./berni-seasonal";
const fox=readFileSync("src/components/BerniFoxHead.tsx","utf8");
const css=readFileSync("src/components/BerniFoxHead.module.css","utf8");
const chat=readFileSync("src/components/AIMascotAssistant.tsx","utf8");

describe("Berni fox head",()=>{
 it("uses real separated facial parts, not a static illustration",()=>{
  for(const part of ["earLeft","earRight","eyes","pupils","brows","head","fringe","headset","accessory"])expect(fox).toContain("styles."+part);
  expect(fox).not.toMatch(/<image\s|\.gif|\.png|\.glb/);
 });
 it("supports moods and optional props without glasses obstructing normal eyes",()=>{
  for(const mood of ["thinking","sleeping","surprised","happy","worried","typing"])expect(fox).toContain(mood);
  for(const item of ["santa","elf","alien","glasses","crown","cap"])expect(fox).toContain('"'+item+'"');
  expect(fox).toContain('accessory = "none"');
 });
 it("uses date-based seasonal styling",()=>{
  expect(seasonalBerniAccessory(new Date(2026,10,11))).toBe("none");
  expect(seasonalBerniAccessory(new Date(2026,11,6))).toBe("santa");
  expect(seasonalBerniAccessory(new Date(2026,11,4))).toBe("elf");
  expect(seasonalBerniAccessory(new Date(2027,0,2))).toBe("santa");
  expect(seasonalBerniAccessory(new Date(2027,0,7))).toBe("none");
 });
 it("reacts to actual AI chat states, preserves existing chat buttons",()=>{
  expect(chat).toContain('data-testid="ai-chat-bubble"');
  expect(chat).toContain("detectBerniReaction(lastMessage.content)");
  expect(chat).toContain('loading ? "thinking"');
  expect(chat).toContain('error ? "worried"');
  expect(chat).toContain('onClick={() => openChat()}');
 });
 it("respects reduced-motion and has complete keyframes",()=>{
  const definitions=new Set([...css.matchAll(/@keyframes\s+([a-zA-Z][\w-]*)/g)].map(m=>m[1]));
  const references=[...css.matchAll(/\banimation:\s*([a-zA-Z][\w-]*)/g)].map(m=>m[1]).filter(x=>x!=="none");
  for(const name of references)expect(definitions.has(name)).toBe(true);
  expect(css).toContain("prefers-reduced-motion:reduce");
 });
});
