import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), "utf8");
const homepage = read("../components/HomeStudio.tsx");
const nav = read("../components/LanguageSwitcher.tsx");
const styles = read("../components/HomeStudio.module.css");
const layout = read("../app/(pl)/layout.tsx");
const globals = read("../app/globals.css");

describe("home page build intro", () => {
  it("flies to the actual navbar mark instead of hard-coded viewport coordinates", () => {
    expect(nav).toContain("data-bernecki-nav-logo");
    expect(homepage).toContain('querySelector<HTMLElement>("[data-bernecki-nav-logo]")');
    expect(homepage).toContain("bounds.left + bounds.width / 2 - window.innerWidth / 2");
    expect(homepage).toContain("bounds.top + bounds.height / 2 - window.innerHeight / 2");
    expect(homepage).toContain('root.style.setProperty("--intro-flight-scale"');
    expect(styles).toContain("var(--intro-flight-x");
    expect(globals).toContain("berneckiHeaderLogoArrive");
  });

  it("plays only once per session, with the opt-out for reduced motion", () => {
    expect(layout).toContain("bernecki-home-intro-v2");
    expect(layout).toContain('root.dataset.homeIntro="play"');
    expect(layout).toContain('root.dataset.homeIntro="skip"');
    expect(layout).toContain("prefers-reduced-motion: reduce");
    expect(styles).toContain("@media(prefers-reduced-motion:reduce){.introOverlay{display:none!important}}");
    expect(styles).toContain("studioIntroEnd");
  });

  it("reuses the live portrait and three real project screenshots", () => {
    expect(homepage).toContain('/images/profile-3-cutout.png');
    expect(homepage).toContain('/images/projects/starcars-live-current.jpg');
    expect(homepage).toContain('/images/projects/isto-live-nov08.jpg');
    expect(homepage).toContain('/images/projects/bcrm-admin-dashboard.jpg');
    expect(homepage).toContain("<ClientTestimonials/>");
    expect(homepage).toContain("INTERFACE BUILD");
    expect(styles).toContain("studioBuildSignals");
  });
});
