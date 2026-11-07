import { describe, expect, it } from "vitest";
import { allGuides } from "./guide-directory";
import { realizations } from "../content/realizations";
import { homepageCopy } from "../content/homepage-copy";
import { plCaseStudies, enCaseStudies } from "../i18n/case-studies";

type ContentFragment = { path: string; text: string };
function texts(value: unknown, path = "content"): ContentFragment[] {
  if (typeof value === "string") return [{path, text:value}];
  if (Array.isArray(value)) return value.flatMap((entry, index) => texts(entry, `${path}[${index}]`));
  if (value !== null && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) => texts(entry, `${path}.${key}`));
  }
  return [];
}

// Don't ban useful safety warnings, accurate limitations or source documentation.
// These patterns target only editorial process notes that don't belong on a public business website.
const internalNarration: readonly RegExp[] = [
  /(?:według|wedle) (?:relacji|informacji) (?:Kacpra|właściciela)/i,
  /(?:właściciel|Kacper) (?:deklaruje|podaje)\b/i,
  /(?:z|na podstawie) (?:udostępnionych|przesłanych|dostarczonych) zrzutów/i,
  /brak niezależnego audytu panelu/i,
  /nie mam niezależnej weryfikacji/i,
  /nie publikujemy surowych zrzutów ekranu/i,
  /zrzuty przedstawiają publiczną wersję strony/i,
  /screenshots show the public live site/i,
  /screenshot captured from the public live site/i,
  /dane biznesowe deklarowane przez właściciela/i,
  /przy analizie działania B-CRM/i,
  /materiały dostępne bez połączeń z API generatywnej AI/i,
  /treść wspomagana AI, poddana automatycznej kontroli/i,
];

describe("customer-facing editorial quality of the full portfolio and all guides", () => {
  const content: ContentFragment[] = [
    ...texts(allGuides,"allGuides"),
    ...texts(realizations,"realizations"),
    ...texts(homepageCopy,"homepageCopy"),
    ...texts(plCaseStudies,"plCaseStudies"),
    ...texts(enCaseStudies,"enCaseStudies")
  ];
  it("scans the entire published guide catalog, not only a sample", () => {
    expect(allGuides.length).toBeGreaterThanOrEqual(400);
    expect(content.length).toBeGreaterThan(1500);
    for (const guide of allGuides) {
      expect(guide.title.trim().length).toBeGreaterThan(12);
      expect(guide.description.trim().length).toBeGreaterThan(20);
      expect(guide.intro.trim().length).toBeGreaterThan(40);
      expect(guide.sections.length).toBeGreaterThanOrEqual(2);
      for (const section of guide.sections) {
        expect(section.title.trim().length).toBeGreaterThan(5);
        expect(section.paragraphs.length).toBeGreaterThan(0);
        for (const paragraph of section.paragraphs) {
          expect(String(paragraph).trim().length).toBeGreaterThan(25);
        }
      }
    }
  });
  it("contains no internal audit, screenshot provenance or private-chat reporting notes", () => {
    const violations: string[] = [];
    for (const {path, text} of content) {
      for (const pattern of internalNarration) {
        if (pattern.test(text)) violations.push(`${path}: ${pattern.source}: ${text.slice(0,125)}`);
      }
    }
    expect(violations).toEqual([]);
  });
});
