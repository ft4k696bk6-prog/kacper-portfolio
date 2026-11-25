import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "../../app/sitemap";
import { classicPaths, contactPaths, copy, mapStops, projectStops, projects, sceneStops, worldPaths, zones } from "./content";

const locales = ["pl", "en", "uk"] as const;
const origin = "https://bernecki.dev";

describe("Bernecki World content", () => {
  it("keeps all language variants in the sitemap with reciprocal links", () => {
    const entries = sitemap();
    const alternateUrls = { "pl-PL": origin + worldPaths.pl, en: origin + worldPaths.en, "uk-UA": origin + worldPaths.uk };

    for (const locale of locales) {
      const route = entries.filter(entry => entry.url === origin + worldPaths[locale]);
      expect(route).toHaveLength(1);
      expect(route[0].alternates?.languages).toEqual(alternateUrls);
      expect(entries.some(entry => entry.url === origin + classicPaths[locale])).toBe(true);
      expect(entries.some(entry => entry.url === origin + contactPaths[locale])).toBe(true);
      expect(Object.keys(copy[locale].zones).sort()).toEqual(zones.map(zone => zone.id).sort());
    }
  });

  it("only exposes real existing captures and project details in every locale", () => {
    expect(new Set(projects.map(project => project.id)).size).toBe(projects.length);
    for (const project of projects) {
      expect(new URL(project.site).protocol).toBe("https:");
      expect(project.images.length).toBeGreaterThan(0);
      for (const name of project.images) expect(existsSync(resolve("public/images/projects", name)), name).toBe(true);
      expect(existsSync(resolve("public/images/world", `${project.id}.webp`))).toBe(true);
      for (const locale of locales) {
        const [description, features] = project.copy[locale];
        expect(description.length).toBeGreaterThan(30);
        expect(features.length).toBeGreaterThan(0);
      }
    }
  });

  it("gives every project a distinct camera stop, marker, and map entry", () => {
    expect(Object.keys(projectStops).sort()).toEqual(projects.map(project => project.id).sort());
    expect(new Set(projects.map(project => projectStops[project.id].target.join(","))).size).toBe(projects.length);
    for (const project of projects) {
      expect(sceneStops.filter(stop => stop.id === project.id)).toHaveLength(1);
      expect(mapStops.filter(id => id === project.id)).toHaveLength(1);
    }
  });
});
