import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { BERNI_POSES, BERNI_POSE_LABELS, BERNI_MOOD_POSE, berniPoseUrl } from "./berni-poses";

const portrait = readFileSync("src/components/BerniPremiumPortrait.tsx", "utf8");
const engine = readFileSync("src/components/BerniLivingFace.tsx", "utf8");
const chat = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");
const preview = readFileSync("src/app/(pl)/berni-preview/page.tsx", "utf8");
const transitions = readFileSync("src/lib/berni-transition.ts", "utf8");

describe("Berni: 20 genuine complete portraits", () => {
  it("has twenty separate transparent PNG images that exist and are not copies", () => {
    expect(BERNI_POSES).toHaveLength(20);
    const sizes = [];
    for (const pose of BERNI_POSES) {
      const path = "public" + berniPoseUrl(pose);
      expect(existsSync(path)).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect(bytes[25]).toBe(6); // PNG RGBA, not opaque JPEG
      expect(BERNI_POSE_LABELS[pose].length).toBeGreaterThanOrEqual(3);
      sizes.push(statSync(path).size);
    }
    expect(new Set(sizes).size).toBeGreaterThanOrEqual(18);
  });
  it("maps chat moods to real emotions, not tiny facial overlays", () => {
    expect(BERNI_MOOD_POSE.idle).toBe("neutral");
    expect(BERNI_MOOD_POSE.curious).toBe("curious");
    expect(BERNI_MOOD_POSE.surprised).toBe("surprised");
    expect(BERNI_MOOD_POSE.worried).toBe("worried");
    expect(BERNI_MOOD_POSE.sleeping).toBe("sleeping");
    expect(engine).toContain("berniPoseUrl(p)");
    expect(engine).not.toContain("drawExpression");
    expect(engine).not.toContain("morphPupils");
    expect(engine).not.toContain("texture2D");
    expect(engine).not.toContain("putImageData");
  });
  it("hides the static fallback during all cinematic transitions", () => {
    expect(portrait).toContain('visibility: canvasReady ? "hidden" : "visible"');
    expect(portrait).toContain('src="/images/berni/generated/neutral.png"');
    expect(portrait).toContain("onReady={handleReady}");
    expect(engine).toContain("if (frame && !frame.visible) return;");
    expect(engine).toContain("ctx!.clearRect(0, 0, pixels, pixels)");
    expect(engine).toContain('frame.phase === "exit" ? transition.from : transition.to');
    expect(transitions).toContain('phase:"hidden",visible:false');
    expect(transitions).toContain("ENTER_START=.58");
    expect(transitions).toContain("EXIT_END=.43");
  });
  it("animates mouth and blinking within one stable picture without changing the entire head", () => {
    expect(engine).toContain("drawBerniMouth");
    expect(engine).toContain("drawBerniBlink");
    expect(engine).toContain("berniMouthOpenness");
    expect(engine).not.toContain('const speech = ["talk-small"');
    expect(engine).not.toContain('portraits.get("sleeping") ?? picture');
  });
  it("supports manual inspection of all twenty expressions and eighteen effects", () => {
    expect(preview).toContain("BERNI_POSES.map");
    expect(preview).toContain("BERNI_POSE_LABELS[pose]");
    expect(preview).toContain("berniPoseUrl(item)");
    expect(preview).toContain("size={320}");
    expect(preview).toContain("size={56}");
    expect(preview).toContain("blinkToken={blinkToken}");
    expect(preview).toContain("setTransitionToken(t => t + 1)");
    expect(preview).toContain("18 filmowych przejść");
    expect(preview).toContain("Przetestuj żywą mimikę");
    expect(preview).toContain("transitionPreset={transitionPreset}");
  });
  it("keeps interaction, zoom handling and chat backend intact", () => {
    expect(chat).toContain("<BerniPremiumPortrait");
    expect(chat).toContain('data-testid="ai-chat-bubble"');
    expect(chat).toContain('"/api/ai-consultant"');
    expect(chat).toContain('"/api/booking"');
    expect(chat).toContain("detectBerniReaction(lastMessage.content)");
    expect(chat).toContain("bubbleViewport.scale");
    expect(chat).toContain("window.visualViewport");
    expect(engine).toContain('window.addEventListener("pointerdown", tap');
    expect(engine).toContain("IntersectionObserver");
    expect(engine).toContain("prefers-reduced-motion: reduce");
  });
});
