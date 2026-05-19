import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/CaseStudyPage";
import { en } from "@/i18n/en";

type CaseStudyRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

const siteUrl = "https://kacper-portfolio.vercel.app";

export function generateStaticParams() {
  return en.caseStudies.items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const study = en.caseStudies.items.find((item) => item.slug === slug);

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
    },
  };
}

export default async function Page({ params }: CaseStudyRouteProps) {
  const { slug } = await params;
  const exists = en.caseStudies.items.some((item) => item.slug === slug);

  if (!exists) {
    notFound();
  }

  return <CaseStudyPage slug={slug} />;
}
