import { describe, expect, it } from "vitest";
import { en } from "./en";
import { pl } from "./pl";

describe("portfolio content", () => {
  it("does not use entry-level positioning", () => {
    const content = JSON.stringify({ en, pl }).toLowerCase();

    expect(content).not.toMatch(new RegExp(["ju", "nior"].join(""), "i"));
  });

  it("keeps the requested project order", () => {
    expect(en.projects.items.map((item) => item.title)).toEqual([
      "B-CRM",
      "Interactive MacBook Portfolio",
      "Berni Rush",
      "Portfolio",
      "Unreal Engine Gameplay Prototype",
      "BerniNutri",
      "Kalkulator leasingu",
    ]);
    expect(pl.projects.items.map((item) => item.title)).toEqual([
      "B-CRM",
      "Interactive MacBook Portfolio",
      "Berni Rush",
      "Portfolio",
      "Unreal Engine Gameplay Prototype",
      "BerniNutri",
      "Kalkulator leasingu",
    ]);
  });

  it("keeps the technology section free of meta instructions", () => {
    const content = JSON.stringify({ en: en.skills, pl: pl.skills }).toLowerCase();

    expect(content).not.toMatch(new RegExp(["pro", "cent"].join(""), "i"));
    expect(content).not.toMatch(new RegExp(["skill", " bars"].join(""), "i"));
  });

  it("does not expose old calendar and profile helper copy", () => {
    const content = JSON.stringify({ en, pl });

    expect(content).not.toContain("Choose a day, then a time");
    expect(content).not.toContain("No free times");
    expect(content).not.toContain("HOW I APPROACH WEB APPS");
    expect(content).not.toContain("Jak podchodzę do aplikacji");
    expect(content).not.toContain(["Let's", "meet"].join(" "));
    expect(content).not.toContain(["Poznajmy", "się"].join(" "));
    expect(content).not.toContain("Contact details could not be revealed");
  });

  it("adds case study links for every project in both languages", () => {
    for (const locale of [en, pl]) {
      const caseStudySlugs = new Set(locale.caseStudies.items.map((item) => item.slug));

      for (const project of locale.projects.items) {
        expect(project.caseStudyUrl).toMatch(/^\/case-studies\//);
        expect(caseStudySlugs.has(project.caseStudyUrl.replace("/case-studies/", ""))).toBe(true);
      }
    }
  });

  it("includes the Unreal prototype case study in both languages", () => {
    const enUnreal = en.caseStudies.items.find(
      (item) => item.slug === "unreal-gameplay-prototype",
    );
    const plUnreal = pl.caseStudies.items.find(
      (item) => item.slug === "unreal-gameplay-prototype",
    );

    expect(enUnreal?.status).toBe("Local prototype / Experimental");
    expect(plUnreal?.status).toBe("Local prototype / Experimental");
    expect(enUnreal?.images?.length).toBeGreaterThanOrEqual(2);
    expect(plUnreal?.images?.length).toBeGreaterThanOrEqual(2);
    expect(enUnreal?.liveUrl).toBeUndefined();
    expect(enUnreal?.repoUrl).toBeUndefined();
  });

  it("includes the interactive portfolio case study in both languages", () => {
    const enInteractive = en.caseStudies.items.find(
      (item) => item.slug === "interactive-portfolio",
    );
    const plInteractive = pl.caseStudies.items.find(
      (item) => item.slug === "interactive-portfolio",
    );

    expect(enInteractive?.status).toBe("Experimental interactive portfolio");
    expect(plInteractive?.status).toBe("Experimental interactive portfolio");
    expect(enInteractive?.liveUrl).toBe("https://kacper-bernecki.vercel.app");
    expect(enInteractive?.images?.length).toBeGreaterThanOrEqual(2);
    expect(plInteractive?.images?.length).toBeGreaterThanOrEqual(2);
  });

  it("defaults the translated content to ENG before a saved language is selected", () => {
    expect(en.meta.homeTitle).toContain("Frontend / Web App Developer");
    expect(en.nav.interactive).toBe("Interactive portfolio");
  });

  it("keeps case study section labels localized", () => {
    const enCaseStudies = JSON.stringify(en.caseStudies);
    const plCaseStudies = JSON.stringify(pl.caseStudies);

    expect(enCaseStudies).not.toContain("Cel projektu");
    expect(enCaseStudies).not.toContain("Użytkownicy i role");
    expect(enCaseStudies).not.toContain("Najważniejsze funkcje");
    expect(plCaseStudies).not.toContain("Goal");
    expect(plCaseStudies).not.toContain("Users and roles");
    expect(plCaseStudies).not.toContain("Key features");
  });

  it("updates B-CRM case study with current roles and tutorial context", () => {
    const enBcrm = en.caseStudies.items.find((item) => item.slug === "b-crm");
    const plBcrm = pl.caseStudies.items.find((item) => item.slug === "b-crm");

    expect(enBcrm?.roles.map((role) => role.name)).toEqual(
      expect.arrayContaining([
        "Owner",
        "Admin",
        "Manager",
        "Sales representative",
        "Finance",
        "Viewer",
        "Accounting",
        "Logistics",
        "Installer",
      ]),
    );
    expect(JSON.stringify(enBcrm)).toContain("Safe demo tutorial");
    expect(JSON.stringify(enBcrm)).toContain("KSeF");
    expect(JSON.stringify(plBcrm)).toContain("samouczek");
    expect(JSON.stringify(plBcrm)).toContain("KSeF");
  });

  it("removes the old message form copy from contact content", () => {
    const content = JSON.stringify({ en: en.contact, pl: pl.contact });

    expect(content).not.toContain(["Send", "message"].join(" "));
    expect(content).not.toContain(["Wyślij", "wiadomość"].join(" "));
    expect(content).not.toContain(["Use", "the", "form"].join(" "));
    expect(content).not.toContain(["Użyj", "formularza"].join(" "));
    expect(content).not.toContain("Resend");
    expect(content).not.toContain("Direct contact");
    expect(content).not.toContain("Bezpośredni kontakt");
    expect(content).not.toContain("Email and phone are available");
    expect(content).not.toContain("Email i telefon są dostępne");
  });
});
