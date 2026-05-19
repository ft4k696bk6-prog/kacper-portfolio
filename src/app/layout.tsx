import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LanguageMetadataSync } from "@/components/LanguageMetadataSync";
import { GoogleTagManager } from "@/components/GoogleTagManager";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const siteUrl = "https://kacper-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kacper Bernecki — Frontend / Web App Developer",
    template: "%s | Kacper Bernecki",
  },
  description:
    "Tworzę aplikacje biznesowe w React, TypeScript, Next.js i Supabase: CRM-y, dashboardy, formularze i narzędzia do obsługi procesów firmowych.",
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
    title: "Kacper Bernecki — Frontend / Web App Developer",
    description:
      "Business web apps in React, TypeScript, Next.js and Supabase: CRMs, dashboards, forms and workflow tools.",
    url: siteUrl,
    siteName: "Kacper Bernecki Portfolio",
    type: "website",
    locale: "pl_PL",
    alternateLocale: "en_US",
    images: [
      {
        url: "/images/profile-3-cutout.png",
        width: 1024,
        height: 1280,
        alt: "Kacper Bernecki — Frontend / Web App Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kacper Bernecki — Frontend / Web App Developer",
    description:
      "Business web apps in React, TypeScript, Next.js and Supabase: CRMs, dashboards, forms and workflow tools.",
    images: ["/images/profile-3-cutout.png"],
  },
  alternates: {
    canonical: siteUrl,
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
        <GoogleTagManager />
        <LanguageProvider>
          <LanguageMetadataSync />
          <LanguageSwitcher />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
