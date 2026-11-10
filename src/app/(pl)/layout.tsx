import type { Metadata, Viewport } from "next";
import "../globals.css";
import "../design-system.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LanguageMetadataSync } from "@/components/LanguageMetadataSync";
import { AnalyticsConsent } from "@/components/AnalyticsConsent";
import { AIMascotAssistant } from "@/components/AIMascotAssistant";
import { Geist } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const siteUrl = "https://bernecki.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rozwój biznesu, AI, strony, CRM i marketing | Kacper Bernecki",
    template: "%s | Kacper Bernecki",
  },
  description:
    "Rozwój biznesu, wdrożenia AI, produkty, dostawcy, strony, CRM i marketing. Od pomysłu do działającego przedsięwzięcia z Kacprem Berneckim.",
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
    "wdrożenia AI dla firm",
    "AI i automatyzacje",
    "asystenci AI dla biznesu",
    "dashboardy",
    "aplikacje biznesowe",
    "formularze",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Kacper Bernecki" }],
  creator: "Kacper Bernecki",
  openGraph: {
    title: "Kacper Bernecki — rozwój biznesu, AI i technologia",
    description:
      "Pomysły biznesowe, produkty, dostawcy, strony, CRM i marketing. Praktyczne wsparcie od planu po wdrożenie.",
    url: siteUrl,
    siteName: "Kacper Bernecki Portfolio",
    type: "website",
    locale: "pl_PL",
    alternateLocale: "en_US",
    images: [
      {
        url: "/opengraph-image?hero=20261108-01",
        width: 1200,
        height: 630,
        alt: "Kacper Bernecki na tle rzeczywistych realizacji StarCars, Isto Kebab i B-CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kacper Bernecki — rozwój biznesu, AI i technologia",
    description:
      "Pomysły biznesowe, produkty, dostawcy, strony, CRM i marketing. Praktyczne wsparcie od planu po wdrożenie.",
    images: ["/opengraph-image?hero=20261108-01"],
  },
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg?v=silver-20261108-01", type: "image/svg+xml" },
      { url: "/icon?v=silver-20261108-01", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/favicon.svg?v=silver-20261108-01", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon?v=silver-20261108-01", type: "image/png", sizes: "180x180" }],
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
    <html lang="pl" suppressHydrationWarning className={`scroll-smooth font-sans ${geist.variable}`}>
      <body>
        <Script id="bernecki-home-intro-session" strategy="beforeInteractive">
          {`(function(){try{if(window.location.pathname!=="/")return;var key="bernecki-home-intro-v1";if(window.sessionStorage.getItem(key)){document.documentElement.dataset.homeIntro="skip";}else{window.sessionStorage.setItem(key,"1");}}catch(e){}})();`}
        </Script>
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
