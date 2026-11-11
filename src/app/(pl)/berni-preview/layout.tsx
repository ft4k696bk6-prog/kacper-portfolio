import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Berni — test animowanej maskotki",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/berni-preview" },
};
export default function BerniPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
