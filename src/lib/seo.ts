import type { Metadata } from "next";

export function serviceMetadata(
  title: string,
  description: string,
  slug: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: `https://bernecki.dev/${slug}` },
    openGraph: {
      title: `${title} | Kacper Bernecki`,
      description,
      url: `https://bernecki.dev/${slug}`,
      type: "website",
      locale: "pl_PL",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
