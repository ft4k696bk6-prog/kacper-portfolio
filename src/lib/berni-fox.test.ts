import {describe,expect,it} from "vitest";
import {existsSync,readFileSync} from "node:fs";
const portrait=readFileSync("src/components/BerniPremiumPortrait.tsx","utf8");
const engine=readFileSync("src/components/BerniLivingFace.tsx","utf8");
const css=readFileSync("src/components/BerniPremiumPortrait.module.css","utf8");
const chat=readFileSync("src/components/AIMascotAssistant.tsx","utf8");
const preview=readFileSync("src/app/(pl)/berni-preview/page.tsx","utf8");
const generator=readFileSync("scripts/generate-berni-poses.mjs","utf8");
const transitions=readFileSync("src/lib/berni-transition.ts","utf8");
describe("Berni full portrait masters, not drawing eyes or mouths over the head",()=>{
 it("pre-renders a consistent family from one approved source",()=>{
  expect(existsSync("public/images/berni/berni-fox-head.png")).toBe(true);
  expect(existsSync("public/images/berni/eyelids-closed.jpg")).toBe(true);
  expect(generator).toContain("Berni master portraits generated");
  expect(generator).toContain("rear");
  expect(generator).toContain("moods=");
  expect(portrait).toContain('src="/images/berni/poses/idle.png"');
  expect(portrait).toContain("BerniLivingFace");
  expect(engine).toContain('const ROOT="/images/berni/poses/"');
  expect(engine).not.toContain("drawExpression");
  expect(engine).not.toContain("FACE_ASSETS");
  expect(engine).not.toContain("FRAGMENT_SHADER");
 });
 it("keeps full-head motion and no face sticker overlay",()=>{
  expect(engine).toContain("wctx!.drawImage(sprite,0,0,640,640)");
  expect(engine).toContain("morphPupils");
  expect(engine).toContain("wctx!.putImageData(region");
  expect(engine).toContain("drawClosedEye(true,blink)");
  expect(engine).toContain("drawClosedEye(false,blink)");
  expect(engine).toContain("ctx!.drawImage(working");
  expect(engine).not.toContain("drawExpression");
 });
 it("supports the same behavior in large preview and small launcher",()=>{
  expect(preview).toContain("size={320}");
  expect(preview).toContain("size={56}");
  expect(preview).toContain("blinkToken={blinkToken}");
  expect(preview).toContain("setReactionToken(x => x + 1)");
  expect(engine).toContain("onReplay");
  expect(chat).toContain("<BerniPremiumPortrait");
  expect(chat).toContain("size={56}");
  expect(chat).toContain("size={36}");
  expect(chat).toContain('data-testid="ai-chat-bubble"');
 });
 it("replays reactions, does not hide behind a permanently closed eyelid",()=>{
  expect(engine).toContain("nextBlink=now+3800+Math.random()*3300");
  expect(engine).toContain('currentMood==="sleeping"?1');
  expect(engine).toContain("prefers-reduced-motion: reduce");
  expect(engine).toContain("IntersectionObserver");
  expect(engine).toContain("document.hidden");
  expect(css).toContain("prefers-reduced-motion:reduce");
 });
 it("uses cinematic transitions only where needed",()=>{
  expect(transitions).toContain("transitionLevel");
  expect(transitions).toContain("chooseBerniTransition");
  expect(transitions).toContain("Math.abs(2*p-1)");
  expect(transitions).toContain("micro-tornado");
  expect(transitions).toContain("bounce-swirl");
  expect(engine).toContain("p<.5?effect.from:effect.to");
  expect(engine).toContain("chooseBerniTransition(previous,next,now,history)");
  expect(engine).toContain("pointermove");
  expect(engine).toContain("pointerdown");
 });
 it("keeps chat actions, booking, and pinch zoom accessibility",()=>{
  expect(chat).toContain('"/api/ai-consultant"');
  expect(chat).toContain('"/api/booking"');
  expect(chat).toContain("detectBerniReaction(lastMessage.content)");
  expect(chat).toContain('setFoxReaction("typing")');
  expect(chat).toContain("bubbleViewport.scale");
  expect(chat).toContain("window.visualViewport");
  expect(chat).not.toContain("user-scalable=no");
 });
});