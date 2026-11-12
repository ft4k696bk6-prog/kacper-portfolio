import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
 BERNI_REACTIONS, BERNI_GROUPS, detectBerniReaction, berniReactionCount, getBerniReaction,
} from "./berni-reaction-model";
const avatar=readFileSync("src/components/BerniLiveAvatar.tsx","utf8");
const assistant=readFileSync("src/components/AIMascotAssistant.tsx","utf8");
const css=readFileSync("src/components/BerniLiveAvatar.module.css","utf8");
const importer=readFileSync("scripts/fetch-berni-preview-gifs.mjs","utf8");

describe("Berni legacy assets disconnected from the production chat",()=>{
 it("maps 48 unique reactions: 11 GIFs, 20 emotions and 17 gestures",()=>{
  expect(BERNI_REACTIONS).toHaveLength(48);
  expect(new Set(BERNI_REACTIONS.map(r=>r.id)).size).toBe(48);
  expect(BERNI_GROUPS).toHaveLength(3);
  expect(berniReactionCount("klipy")).toBe(11);
  expect(berniReactionCount("mimika")).toBe(20);
  expect(berniReactionCount("gesty")).toBe(17);
 });
 it("keeps legacy asset integrity but does not render it in the actual chat",()=>{
  for(const reaction of BERNI_REACTIONS.filter(r=>r.clip)){
    expect(importer).toContain(`"name":"${reaction.clip}"`);
  }
  expect(avatar).toContain("BerniPremiumPortrait");
  expect(avatar).toContain("/images/berni/clips/");
  expect(assistant).not.toContain("<BerniLiveAvatar");
  expect(assistant).toContain("data-testid=\"ai-chat-bubble\"");
  expect(assistant).not.toContain("setMascotReaction");
  expect(assistant).toContain('"/api/ai-consultant"');
  expect(assistant).not.toContain("BERNI_REACTIONS.filter");
  expect(assistant).not.toContain('data-testid="berni-choose-reaction"');
 });
 it("reacts differently to context and text",()=>{
  const examples=[
   ["Cześć Berni","motion-greet"],["Haha xd","clip-smiech"],
   ["Błąd, nie działa","face-angry"],["Czas na SEO","motion-scan"],
   ["Udało się","motion-celebrate"],["Mrugnij","clip-mruganie"],
   ["Zatańcz","motion-dance"],["Naprawdę? Wow!","clip-zaskoczenie"],
  ];
  for(const [text,id] of examples) expect(detectBerniReaction(text)).toBe(id);
  expect(getBerniReaction("invalid").id).toBe("face-neutral");
 });
 it("uses 17 separate motion classes and respects reduced motion",()=>{
  for(const r of BERNI_REACTIONS.filter(r=>r.group==="gesty")){
   expect(css).toContain("."+r.motion+"{animation:");
  }
  expect(css).toContain("prefers-reduced-motion:reduce");
  expect(avatar).toContain("transitionEnabled={false}");
 });
});