import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://sagan.dev"),
  title: {
    default: "Michał Sagan — Product Architect",
    template: "%s | Michał Sagan",
  },
  description:
    "Product Architect specializing in cloud-native integration platforms, GraphQL Federation, and API ecosystems. Based in Poland.",
  keywords: [
    "Product Architect",
    "GraphQL Federation",
    "Cloud Native",
    "API Design",
    "Michał Sagan",
    "Software Architecture",
    "Integration Platforms",
    "API Ecosystems",
  ],
  authors: [{ name: "Michał Sagan", url: "https://sagan.dev" }],
  creator: "Michał Sagan",
  openGraph: {
    title: "Michał Sagan — Product Architect",
    description:
      "Product Architect specializing in cloud-native integration platforms, GraphQL Federation, and API ecosystems.",
    url: "https://sagan.dev",
    siteName: "sagan.dev",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/hero_banner.png",
        width: 448,
        height: 600,
        alt: "Michał Sagan — Product Architect",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Michał Sagan — Product Architect",
    description:
      "Product Architect specializing in cloud-native integration platforms, GraphQL Federation, and API ecosystems.",
    images: ["/hero_banner.png"],
  },
  alternates: {
    canonical: "https://sagan.dev",
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
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Consent Mode v2 — must run BEFORE GTM */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});
            `.trim(),
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5PSGWWNM');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5PSGWWNM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <LanguageProvider>
          <LanguageSwitcher />
          <CookieBanner />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
