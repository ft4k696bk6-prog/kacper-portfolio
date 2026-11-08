import type { Metadata } from "next";

const BRAND = "Kacper Bernecki";
const TITLE_LIMIT = 62;
const DESCRIPTION_LIMIT = 158;

/** Display length is pixel-dependent, so this is a practical guard, not a Google ranking rule. */
function cutAtWord(text: string, limit: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const piece = clean.slice(0, limit + 1);
  const breakAt = piece.lastIndexOf(" ");
  return (breakAt > limit * 0.65 ? piece.slice(0, breakAt) : clean.slice(0, limit))
    .replace(/[\s.,;:—–-]+$/g, "").trim();
}

export function seoTitle(input: string): string {
  const clean = input.replace(/\s+/g, " ").trim().replace(/\s*\|\s*Kacper Bernecki$/i, "");
  const withBrand = `${clean} | ${BRAND}`;
  return withBrand.length <= TITLE_LIMIT ? withBrand : cutAtWord(clean, TITLE_LIMIT);
}

export function seoDescription(input: string, details = ""): string {
  const base = input.replace(/\s+/g, " ").trim();
  const extra = details.replace(/\s+/g, " ").trim();
  // When descriptions are derived from intros, avoid appending the same passage twice.
  const combined = base.length >= 110 || !extra || extra.startsWith(base)
    ? (extra.startsWith(base) && extra.length > base.length ? extra : base)
    : `${base.replace(/[\s.,;:—–-]+$/g, "")}. ${extra}`;
  return cutAtWord(combined, DESCRIPTION_LIMIT);
}

export function serviceMetadata(
  title: string,
  description: string,
  slug: string,
  details = "",
): Metadata {
  const label = seoTitle(title);
  const summary = seoDescription(description, details);
  const url = `https://bernecki.dev/${slug}`;
  return {
    title: { absolute: label },
    description: summary,
    alternates: { canonical: url },
    openGraph: {
      title: title.includes(BRAND) ? title : `${title} | ${BRAND}`,
      description: summary,
      url,
      type: "website",
      locale: "pl_PL",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: label,
      description: summary,
      images: ["/opengraph-image"],
    },
  };
}
