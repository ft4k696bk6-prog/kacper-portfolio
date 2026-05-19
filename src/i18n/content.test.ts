import { describe, expect, it } from "vitest";
import { en } from "./en";
import { pl } from "./pl";

describe("portfolio content", () => {
  it("does not use entry-level positioning", () => {
    const content = JSON.stringify({ en, pl }).toLowerCase();

    expect(content).not.toMatch(new RegExp(["ju", "nior"].join(""), "i"));
  });

  it("keeps B-CRM as the first project", () => {
    expect(en.projects.items[0].title).toBe("B-CRM");
    expect(pl.projects.items[0].title).toBe("B-CRM");
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
    expect(content).not.toContain("Let's meet");
    expect(content).not.toContain("Poznajmy się");
    expect(content).not.toContain("Contact details could not be revealed");
  });
});
