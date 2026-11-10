import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), "utf8");
const homepage = read("../components/HomeStudio.tsx");
const nav = read("../components/LanguageSwitcher.tsx");
const styles = read("../components/HomeStudio.module.css");
const layout = read("../app/(pl)/layout.tsx");
const globals = read("../app/globals.css");

describe("home page build intro", () => {
  it("moves the actual navbar mark and never creates a second KB sprite", () => {
    expect(nav).toContain("data-bernecki-nav-logo");
    expect(nav).toContain('initial={pathname === "/" ? false');
    expect(homepage).toContain('querySelector<HTMLElement>("[data-bernecki-nav-logo]")');
    expect(homepage).toContain("logo.animate([");
    expect(homepage).toContain("flight.cancel()");
    expect(homepage).not.toContain("introFlightMark");
    expect(homepage).not.toContain("introFlightAnchor");
    expect(globals).toContain("data-bernecki-nav-logo");
  });

  it("runs once, permits replay and cannot trap a slow/hydration-disabled visitor", () => {
    expect(layout).toContain("bernecki-home-intro-v3");
    expect(layout).toContain('get("intro")==="1"');
    expect(layout).toContain('root.dataset.homeIntro="armed"');
    expect(layout).toContain('root.dataset.homeIntro="skip"');
    expect(layout).toContain("prefers-reduced-motion: reduce");
    expect(layout).toContain("window.setTimeout(function()");
    expect(styles).toContain("@media(prefers-reduced-motion:reduce){.introOverlay,.introBlueprint,.introTerminal{display:none!important}}");
  });

  it("unveils the existing hero in a top-left to bottom-right build", () => {
    expect(styles).toContain("studioBuildFromLogo");
    expect(styles).toContain("studioTraceH");
    expect(styles).toContain("studioTraceV");
    expect(homepage).toContain("introBlueprint");
    expect(homepage).toContain("AI / BUILD ENGINE");
    expect(homepage).toContain('/images/profile-3-cutout.png');
    expect(homepage).toContain('/images/projects/starcars-live-current.jpg');
    expect(homepage).toContain('/images/projects/isto-live-nov08.jpg');
    expect(homepage).toContain('/images/projects/bcrm-admin-dashboard.jpg');
  });
});
