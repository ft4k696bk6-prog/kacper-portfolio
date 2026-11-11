import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

const portrait = readFileSync("src/components/BerniPremiumPortrait.tsx", "utf8");
const rig = readFileSync("src/components/BerniLivingFace.tsx", "utf8");
const css = readFileSync("src/components/BerniPremiumPortrait.module.css", "utf8");
const chat = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");
const preview = readFileSync("src/app/(pl)/berni-preview/page.tsx", "utf8");

describe("One-source, continuous animated Berni", () => {
  it("always renders the same approved neutral character", () => {
    expect(existsSync("public/images/berni/berni-fox-head.png")).toBe(true);
    expect(existsSync("public/images/berni/eyelids-closed.jpg")).toBe(true);
    expect(portrait).toContain('src="/images/berni/berni-fox-head.png"');
    expect(rig).toContain('const BASE = "/images/berni/berni-fox-head.png"');
    expect(portrait).toContain('from "next/image"');
    expect(portrait).toContain("<BerniLivingFace");
    expect(portrait).not.toContain("FACE_ASSETS");
    expect(portrait).not.toContain("AnimatePresence");
    expect(rig).not.toContain("/moods/");
  });
  it("places the continuous face rig in both the launcher and header", () => {
    expect(chat).toContain("<BerniPremiumPortrait");
    expect(chat).toContain("size={56}");
    expect(chat).toContain("size={36}");
    expect(chat).toContain('data-testid="ai-chat-bubble"');
  });
  it("preserves real AI reaction and booking/audit logic", () => {
    expect(chat).toContain("detectBerniReaction(lastMessage.content)");
    expect(chat).toContain('loading ? "thinking"');
    expect(chat).toContain('error ? "worried"');
    expect(chat).toContain('setFoxReaction("typing")');
    expect(chat).toContain('onClick={() => openChat()}');
    expect(chat).toContain('"/api/ai-consultant"');
    expect(chat).toContain('"/api/booking"');
  });
  it("smoothly deforms original eye and muzzle pixels rather than crossfading generated faces", () => {
    expect(rig).toContain('canvas?.getContext("2d"');
    expect(rig).toContain("ctx!.drawImage(base, 0, 0, 640, 640)");
    expect(rig).toContain("drawBlink(current.blink, true)");
    expect(rig).toContain("drawBlink(current.blink, false)");
    expect(rig).toContain("drawEyes(current.gazeX, current.gazeY)");
    expect(rig).toContain("function drawExpression(face: Face)");
    expect(rig).toContain("const depth = amount *");
    expect(rig).toContain('data-testid="berni-continuous-face"');
    expect(rig).toContain("requestAnimationFrame");
    expect(rig).toContain("Math.exp(-dt / tau)");
    expect(rig).toContain("timeSinceBlink");
    expect(rig).toContain("Math.sin(now / 170)");
    expect(rig).not.toContain('FACE_ASSETS');
    expect(rig).not.toContain("WebGLRenderingContext");
    expect(rig).not.toContain("FRAGMENT_SHADER");
  });
  it("preserves iPhone and reduced-motion fallbacks", () => {
    expect(rig).toContain('canvas?.getContext("2d"');
    expect(rig).toContain("const interval = size <= 72 ? 33 : 22");
    expect(rig).toContain('prefers-reduced-motion: reduce');
    expect(rig).toContain("IntersectionObserver");
    expect(rig).toContain("document.hidden");
    expect(portrait).toContain('<Image src="/images/berni/berni-fox-head.png"');
    expect(css).toContain("prefers-reduced-motion:reduce");
  });
  it("keeps interactive large and small visual previews", () => {
    expect(preview).toContain("size={320}");
    expect(preview).toContain("size={56}");
    expect(preview).toContain("blinkToken={blinkToken}");
  });
});
