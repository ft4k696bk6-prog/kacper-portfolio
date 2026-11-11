import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
const ai = readFileSync("src/components/AIMascotAssistant.tsx", "utf8");
const copy = readFileSync("src/lib/companion-scenarios.ts", "utf8");
describe("Static AI chat bubble", () => {
 it("shows accessible AI chat bubble and no animated mascot", () => {
  expect(ai).toContain('data-testid="ai-chat-bubble"');
  expect(ai).toContain("aria-expanded={open}");
  expect(ai).toContain("onClick={() => openChat()}");
  expect(ai).toContain("MessageCircle");
  expect(ai).not.toContain("BerniCompanion");
  expect(ai).not.toContain("BerniRendered3D");
 });
 it("keeps the static mascot and avoids drag controls, while allowing chat-panel transitions", () => {
  for(const item of ["dragPlacement","handleBerniDragEnd","model-viewer","animate-spin"]) expect(ai).not.toContain(item);
  expect(ai).toContain("<motion.aside");
  expect(ai).toContain("AnimatePresence");
 });
 it("preserves all contextual messages and manual opt-out", () => {
  expect(ai).toContain("pickCompanionNudge(context, history.ids");
  expect(ai).toContain("nudge.text");
  expect(ai).toContain("NUDGE_MEMORY_KEY");
  expect(ai).toContain("disableNudges");
  expect(ai).toContain("enableNudges");
  expect(copy).toContain("pickCompanionNudge");
 });
 it("keeps intro gating, consent and API chat", () => {
  expect(ai).toContain("!introFinished");
  expect(ai).toContain("cookieBannerVisible");
  expect(ai).toContain('"/api/ai-consultant"');
  expect(ai).toContain("renderLinkedMessage(message.content)");
 });
 it("keeps audit, booking and Polish / English texts", () => {
  expect(ai).toContain('"/api/tools/inspect"');
  expect(ai).toContain('"/api/booking"');
  expect(ai).toContain("t.aiMascot.initialMessage");
  expect(ai).toContain('lang === "pl" ? "Asystent AI" : "AI assistant"');
 });
});
