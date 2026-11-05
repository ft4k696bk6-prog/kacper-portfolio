import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/CaseStudyPage";
import { pl } from "@/i18n/pl";

type CaseStudyRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = "https://bernecki.dev";

export function generateStaticParams() {
  return pl.caseStudies.items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const study = pl.caseStudies.items.find((item) => item.slug === slug);

  if (!study) {
    return {
      title: "Case study | Kacper Bernecki",
    };
  }

  return {
    title: `${study.title} — Case study`,
    description: study.summary,
    alternates: {
      canonical: `${siteUrl}/case-studies/${study.slug}`,
    },
    openGraph: {
      title: `${study.title} — Case study`,
      description: study.summary,
      url: `${siteUrl}/case-studies/${study.slug}`,
      type: "article",
      locale: "pl_PL",
      images: study.images?.[0] ? [{ url: study.images[0].src, alt: study.images[0].alt }] : [{ url: "/opengraph-image" }],
    },
  };
}

export default async function Page({ params }: CaseStudyRouteProps) {
  const { slug } = await params;
  const exists = pl.caseStudies.items.some((item) => item.slug === slug);

  if (!exists) {
    notFound();
  }

  const study = pl.caseStudies.items.find((item) => item.slug === slug)!;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kacper Bernecki", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Realizacje", item: `${siteUrl}/case-studies` },
        { "@type": "ListItem", position: 3, name: study.title, item: `${siteUrl}/case-studies/${slug}` },
      ],
    }).replace(/</g, "\\u003c") }} />
    <CaseStudyPage slug={slug} />
  </>;
}
