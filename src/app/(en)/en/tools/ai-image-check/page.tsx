import type { Metadata } from "next";
import Link from "next/link";
import { AiImageOriginChecker } from "@/components/AiImageOriginChecker";

const url = "https://bernecki.dev/en/tools/ai-image-check";
export const metadata: Metadata = {
  title: "Was this image made by AI? Free metadata check | bernecki.dev",
  description: "Inspect image metadata for traces of AI generators and C2PA markers for free. Local processing; no upload. Results are not proof of origin.",
  alternates: { canonical: url, languages: { en: url, "pl-PL": "https://bernecki.dev/narzedzia/sprawdz-czy-zdjecie-ai" } },
  openGraph: { title: "Check an image for AI generation clues", description: "Free local metadata check for JPEG, PNG and WebP images.", url, type: "website" },
};
export default function EnglishAiImageCheckPage() {
  return <main lang="en" className="site-page mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
    <nav aria-label="Breadcrumbs" className="text-xs text-white/60"><Link href="/" className="underline underline-offset-4">Home</Link><span className="mx-2">/</span><Link href="/en/tools" className="underline underline-offset-4">Tools</Link><span className="mx-2">/</span>AI image check</nav>
    <header className="mx-auto mb-10 mt-12 max-w-4xl">
      <p className="page-eyebrow">FREE TOOL / NO SIGN-UP</p>
      <h1 className="mt-5">Was this image made by AI?</h1>
      <p className="page-intro mt-5 max-w-3xl text-base md:text-lg">Check whether an image contains metadata associated with AI generators. This is not a visual classifier and cannot determine image origin with certainty.</p>
    </header>
    <AiImageOriginChecker lang="en"/>
    <p className="mx-auto mt-8 max-w-4xl text-sm leading-7 text-white/60">No AI metadata does not prove an image is authentic. C2PA digital credentials require separate cryptographic verification. <Link href="/en/tools" className="underline underline-offset-4">Back to the tools directory</Link>.</p>
  </main>;
}
