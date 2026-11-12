import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BERNI_REACTIONS, BERNI_GROUPS, berniReactionCount, detectBerniReaction, getBerniReaction } from "./berni-reaction-model";

const ui = readFileSync("src/components/BerniReactionLab.tsx", "utf8");
const preview = readFileSync("src/app/(pl)/berni-preview/page.tsx", "utf8");
const css = readFileSync("src/components/BerniReactionLab.module.css", "utf8");

describe("Berni reaction lab", () => {
  it("has 48 genuinely selectable behaviours with unique stable IDs", () => {
    expect(BERNI_REACTIONS.length).toBe(48);
    expect(new Set(BERNI_REACTIONS.map(r => r.id)).size).toBe(48);
    expect(berniReactionCount("klipy")).toBe(11);
    expect(berniReactionCount("mimika")).toBe(20);
    expect(berniReactionCount("gesty")).toBe(17);
    expect(BERNI_GROUPS.map(g => g.id)).toEqual(["klipy","mimika","gesty"]);
  });
  it("maps all eleven original GIF clips to the active mascot", () => {
    const expected = ["smiech","usmiech","mruganie","ekscytacja","zaskoczenie",...Array.from({length:6},(_,i)=>"wariant-"+String(i+1).padStart(2,"0"))];
    expect(BERNI_REACTIONS.filter(r => r.group === "klipy").map(r => r.clip).sort()).toEqual(expected.sort());
    expect(ui).toContain('className={styles.mainArt}');
    expect(ui).toContain('getBerniReaction(activeId)');
    expect(ui).toContain("src={src}");
    expect(ui).toContain('data-testid="berni-active-reaction"');
  });
  it("actually reacts to tap, text entry and automatic situations", () => {
    for(const [text,id] of [
      ["Cześć Berni", "motion-greet"],
      ["Dzięki, super robota", "motion-bow"],
      ["Haha xd", "clip-smiech"],
      ["Nic nie działa! Mam błąd!", "face-angry"],
      ["Zrób coś z SEO", "motion-scan"],
      ["Udało się!", "motion-celebrate"],
      ["Chce mi się spać", "motion-sleep"],
      ["Kręci mnie ta muzyka, zatańcz!", "motion-dance"],
      ["Mrugnij", "clip-mruganie"],
    ] as const) expect(detectBerniReaction(text)).toBe(id);
    expect(ui).toContain('data-testid="berni-tap-reaction"');
    expect(ui).toContain('data-testid="berni-reaction-input"');
    expect(ui).toContain("setInterval");
    expect(preview).toContain("<BerniReactionLab />");
  });
  it("has distinct visual animations and respects reduced motion", () => {
    const motions = BERNI_REACTIONS.filter(r=>r.group==="gesty").map(r=>r.motion);
    expect(new Set(motions).size).toBe(17);
    for(const motion of motions){
      expect(css).toContain("."+motion+"{animation:");
    }
    expect(css).toContain("@media(prefers-reduced-motion:reduce)");
    expect(getBerniReaction("invalid").id).toBe("face-neutral");
  });
});