import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LanguageMetadataSync } from "@/components/LanguageMetadataSync";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AIMascotAssistant } from "@/components/AIMascotAssistant";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const siteUrl = "https://bernecki.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Strony internetowe, CRM i aplikacje webowe | Kacper Bernecki",
    template: "%s | Kacper Bernecki",
  },
  description:
    "Strony internetowe, landing page i CRM-y dla firm. Bezpośrednia współpraca z Kacprem Berneckim — od pomysłu i projektu po wdrożenie.",
  keywords: [
    "Kacper Bernecki",
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
    title: "Kacper Bernecki — strony internetowe, CRM i aplikacje webowe",
    description:
      "Strony internetowe, landing page i CRM-y dla firm. Od pomysłu i projektu po wdrożenie — bezpośrednio z Kacprem Berneckim.",
    url: siteUrl,
    siteName: "Kacper Bernecki Portfolio",
    type: "website",
    locale: "pl_PL",
    alternateLocale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kacper Bernecki — Frontend / Web App Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kacper Bernecki — strony internetowe, CRM i aplikacje webowe",
    description:
      "Strony internetowe, landing page i CRM-y dla firm. Od pomysłu i projektu po wdrożenie — bezpośrednio z Kacprem Berneckim.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
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
  themeColor: "#070707",
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
          <AIMascotAssistant />
        </LanguageProvider>
      </body>
    </html>
  );
}
