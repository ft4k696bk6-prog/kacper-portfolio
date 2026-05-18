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
});
