import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) => readFileSync(new URL(relativePath, import.meta.url), "utf8");
const homepage = read("../components/HomeStudio.tsx");
const nav = read("../components/LanguageSwitcher.tsx");
const styles = read("../components/HomeStudio.module.css");
const layout = read("../app/(pl)/layout.tsx");
const globals = read("../app/globals.css");
const consent = read("../components/AnalyticsConsent.tsx");

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
    expect(layout).toContain("bernecki-home-intro-v4");
    expect(layout).toContain('get("intro")==="1"');
    expect(layout).toContain('root.dataset.homeIntro="armed"');
    expect(layout).toContain('root.dataset.homeIntro="skip"');
    expect(layout).toContain("prefers-reduced-motion: reduce");
    expect(layout).toContain("window.setTimeout(function()");
    expect(styles).toContain("@media(prefers-reduced-motion:reduce){.introOverlay,.introTerminal{display:none!important}}");
  });

  it("types the build sequentially and unveils the hero from top down without lines", () => {
    expect(styles).toContain("studioTopDownUnveil");
    expect(styles).toContain("studioHeadlineType");
    expect(styles).toContain("clip-path:inset(100% 0 0 0)");
    expect(styles).not.toContain("studioTraceH");
    expect(styles).not.toContain("studioTraceV");
    expect(homepage).not.toContain("introBlueprint");
    expect(homepage).toContain("introCodeRowFive");
    expect(homepage).toContain("AI / BUILD ENGINE");
    expect(homepage).toContain('/images/profile-3-cutout.png');
    expect(homepage).toContain('/images/projects/starcars-live-current.jpg');
    expect(homepage).toContain('/images/projects/isto-live-nov08.jpg');
    expect(homepage).toContain('/images/projects/bcrm-admin-dashboard.jpg');
  });

  it("reveals a compact, translucent cookie card only once the intro completes", () => {
    expect(consent).toContain("cookie-consent-banner");
    expect(consent).toContain("max-w-[23rem]");
    expect(consent).toContain("bg-[#101114]/80");
    expect(globals).toContain('html:is([data-home-intro="armed"],[data-home-intro="running"]) .cookie-consent-banner');
    expect(globals).toContain("visibility: hidden;");
    expect(globals).toContain("pointer-events: none;");
  });
});
