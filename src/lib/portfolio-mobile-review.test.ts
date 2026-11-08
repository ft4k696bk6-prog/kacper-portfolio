import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const get = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("portfolio mobile review", () => {
  it("uses an uncropped cutout instead of the grey hero card", () => {
    const hero = get("../components/HomeStudio.tsx");
    const css = get("../components/HomeStudio.module.css");
    expect(hero).toContain("/images/profile-3-cutout.png");
    expect(css).toContain(".portrait { background:transparent");
    expect(css).toContain("object-fit:contain");
    expect(css).toContain("orientation:landscape");
  });

  it("keeps the assistant usable on short-height mobile screens", () => {
    const assistant = get("../components/AIMascotAssistant.tsx");
    expect(assistant).toContain("h-[min(22rem,calc(100dvh-8rem))]");
    expect(assistant).not.toContain("h-[min(22rem,calc(100vh-19rem))]");
  });

  it("uses two local website previews without the foreground CRM tile", () => {
    const hero = get("../components/HomeStudio.tsx");
    expect(hero.match(/styles\.heroTile/g)).toHaveLength(2);
    expect(hero).toContain("/images/projects/isto-live-nov08.jpg");
    expect(hero).not.toContain("mshots");
    expect(hero).not.toContain("tileCrm");
    expect(get("../components/HomeStudio.module.css")).toContain("prefers-reduced-motion:no-preference");
  });

  it("allows the mobile menu to scroll and close with Escape", () => {
    const navigation = get("../components/LanguageSwitcher.tsx");
    expect(navigation).toContain("max-h-[calc(100dvh-5rem)] overflow-y-auto");
    expect(navigation).toContain('event.key === "Escape"');
    expect(navigation).toContain("menuButton.current?.focus()");
  });

  it("does not send a B-CRM demo prospect to a protected deployment", () => {
    const projects = get("../components/ui/interactive-image-accordion.tsx");
    expect(projects).toContain('p.href==="/case-studies/b-crm"');
    expect(projects).toContain('href="/#contact"');
    expect(projects).toContain('"Umów demo"');
  });
});
