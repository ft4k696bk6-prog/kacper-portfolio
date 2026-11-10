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
    // The booking flow needs more than 22rem; the actual compact panel is
    // bounded by the dynamic viewport and lets its message history scroll.
    expect(assistant).toContain('h-[min(36rem,calc(100dvh-8.5rem))]');
    expect(assistant).toContain('h-[min(36rem,calc(100dvh-7rem))]');
    expect(assistant).toContain('className="min-h-0 max-h-80 flex-1');
    expect(assistant).not.toContain("calc(100vh-19rem)");
  });

  it("shows three authentic project previews in the requested layered hero", () => {
    const hero = get("../components/HomeStudio.tsx");
    const css = get("../components/HomeStudio.module.css");
    expect(hero.split("styles.heroTile").length - 1).toBe(3);
    expect(hero).toContain("/images/projects/starcars-live-current.jpg");
    expect(hero).toContain("/images/projects/isto-live-nov08.jpg");
    expect(hero).toContain("/images/projects/bcrm-admin-dashboard.jpg");
    expect(hero).not.toContain("mshots");
    expect(css).toContain(".tileCrm");
    expect(css).toContain("heroDriftStar");
    expect(css).toContain("prefers-reduced-motion:no-preference");
    expect(css).toContain("@media(hover:none)");
  });

  it("keeps every mobile tile outside the face and reduces CRM coverage", () => {
    const css = get("../components/HomeStudio.module.css");
    expect(css).toContain(" .tileStarCars {left:0;top:11%;width:43%");
    expect(css).toContain(" .tileIsto {left:1%;right:auto;top:43%");
    expect(css).toContain(" .tileCrm {left:0;bottom:1%;width:53%");
    expect(css).toContain(".portrait { background:transparent;position:absolute;z-index:5");
    expect(css).toContain(".tileIsto {z-index:2;right:0;top:29%;width:28%");
    expect(css).toContain(".tileCrm {z-index:6;left:-1%;bottom:1%;width:47%");
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
