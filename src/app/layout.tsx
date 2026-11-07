import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import "./design-system.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LanguageMetadataSync } from "@/components/LanguageMetadataSync";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AIMascotAssistant } from "@/components/AIMascotAssistant";
import { Geist } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const siteUrl = "https://bernecki.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rozwój biznesu, strony, CRM i marketing | Kacper Bernecki",
    template: "%s | Kacper Bernecki",
  },
  description:
    "Rozwój biznesu, produkty, dostawcy, strony, CRM i marketing. Od pomysłu do działającego przedsięwzięcia z Kacprem Berneckim.",
  keywords: [
    "Kacper Bernecki",
    "rozwój biznesu",
    "sourcing produktów",
    "wdrożenia biznesowe",
    "marketing i sprzedaż",
    "Frontend Developer",
    "Web App Developer",
    "React Developer",
    "TypeScript Developer",
    "Next.js Developer",
    "Supabase",
    "CRM",
    "dashboardy",
    "aplikacje biznesowe",
    "formularze",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Kacper Bernecki" }],
  creator: "Kacper Bernecki",
  openGraph: {
    title: "Kacper Bernecki — rozwój biznesu, technologia i marketing",
    description:
      "Pomysły biznesowe, produkty, dostawcy, strony, CRM i marketing. Praktyczne wsparcie od planu po wdrożenie.",
    url: siteUrl,
    siteName: "Kacper Bernecki Portfolio",
    type: "website",
    locale: "pl_PL",
    alternateLocale: "en_US",
    images: [
      {
        url: "/opengraph-image?brand=studio-20261107",
        width: 1200,
        height: 630,
        alt: "Kacper Bernecki — strony internetowe, aplikacje i marketing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kacper Bernecki — rozwój biznesu, technologia i marketing",
    description:
      "Pomysły biznesowe, produkty, dostawcy, strony, CRM i marketing. Praktyczne wsparcie od planu po wdrożenie.",
    images: ["/opengraph-image?brand=studio-20261107"],
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg?v=studio-20261107", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/favicon.svg?v=studio-20261107", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: brand.background,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`scroll-smooth font-sans ${geist.variable}`}>
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        {/* Web Analytics without additional dependencies; enabled in Vercel project settings */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.va = window.va || function(){(window.vaq = window.vaq || []).push(arguments);};",
          }}
        />
        <script defer src="/_vercel/insights/script.js" />
        <LanguageProvider>
          <AnalyticsConsent />
          <LanguageMetadataSync />
          <LanguageSwitcher />
          {children}
          <SiteFooter />
          <AIMascotAssistant />
        </LanguageProvider>
      </body>
    </html>
  );
}
