import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { seoDescription, seoTitle, serviceMetadata } from "./seo";

describe("SEO metadata safeguards", () => {
  it("keeps search titles concise without changing article headings", () => {
    const original = "Jak zwiększyć liczbę wejść na stronę internetową małej firmy bez wydawania pieniędzy na reklamy";
    expect(seoTitle(original).length).toBeLessThanOrEqual(62);
    expect(seoTitle("Strony internetowe")).toContain("Kacper Bernecki");
    expect(seoTitle("Strony internetowe | Kacper Bernecki").match(/Kacper Bernecki/g)).toHaveLength(1);
  });

  it("uses informative intros for short descriptions without repeating text", () => {
    const short = "Sprawdź, dlaczego reklamy nie przynoszą klientów.";
    const detail = "Warto rozdzielić koszty kliknięć, jakość formularzy oraz późniejszą obsługę zapytań, żeby wskazać etap wymagający poprawy.";
    expect(seoDescription(short, detail).length).toBeGreaterThan(100);
    expect(seoDescription(short, detail).length).toBeLessThanOrEqual(158);
    expect(seoDescription(detail.slice(0, 120), detail).length).toBeLessThanOrEqual(158);
  });

  it("emits canonical and OG URL pointing to the same page", () => {
    const meta = serviceMetadata("CRM dla firm handlowych", "System do zarządzania procesem sprzedaży", "crm-dla-firm-handlowych");
    expect(meta.alternates?.canonical).toBe("https://bernecki.dev/crm-dla-firm-handlowych");
    expect(meta.openGraph?.url).toBe(meta.alternates?.canonical);
  });
});

describe("server HTML language", () => {
  it("uses distinct static root layouts with matching document languages", () => {
    const pl = readFileSync("src/app/(pl)/layout.tsx", "utf8");
    const en = readFileSync("src/app/(en)/layout.tsx", "utf8");
    expect(pl).toContain('<html lang="pl"');
    expect(en).toContain('<html lang="en"');
    expect(existsSync("src/app/layout.tsx")).toBe(false);
  });
});
