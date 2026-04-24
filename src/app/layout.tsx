import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Michał Sagan — Product Architect",
  description:
    "Product Architect specializing in cloud-native integration platforms, GraphQL Federation, and API ecosystems.",
  openGraph: {
    title: "Michał Sagan — Product Architect",
    description:
      "Transforming complex business requirements into scalable technical solutions.",
    siteName: "sagan.dev",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <LanguageSwitcher />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
