import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), "utf8");

describe("iPhone input focus and AI panel", () => {
  it("prevents Safari focus zoom across the shared PL/EN form styles without disabling manual zoom", () => {
    const css = read("../app/design-system.css");
    expect(css).toContain("@media (hover: none) and (pointer: coarse)");
    expect(css).toContain("font-size: max(16px, 1em) !important");
    for (const selector of ["input:not([type=\"button\"])", "textarea,", "select,", '[contenteditable="true"]']) {
      expect(css).toContain(selector);
    }
    expect(css).not.toMatch(/(?:user-scalable\s*=\s*no|maximum-scale\s*=\s*1)/i);
  });

  it("expands and collapses the mobile AI dialog from the actual bubble position", () => {
    const assistant = read("../components/AIMascotAssistant.tsx");
    expect(assistant).toContain("<AnimatePresence>");
    expect(assistant).toContain("<motion.aside");
    expect(assistant).toContain("initial={isCompactViewport ? closedBubbleRect");
    expect(assistant).toContain("exit={isCompactViewport ? closedBubbleRect");
    expect(assistant).toContain("height:mobilePanelHeight");
    expect(assistant).toContain("mobileViewport.top");
    expect(assistant).toContain("useReducedMotion");
    expect(assistant).toContain('inputRef.current?.blur(); setOpen(false)');
  });
});
