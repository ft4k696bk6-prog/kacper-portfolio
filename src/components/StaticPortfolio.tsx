"use client";

import { Hero } from "@/components/Hero";
import { Profile } from "@/components/Profile";
import { Experience } from "@/components/Experience";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { TechnicalAudience } from "@/components/TechnicalAudience";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kacper Bernecki",
  jobTitle: "Frontend / Web App Developer",
  description:
    "I build business web applications in React, TypeScript, Next.js and Supabase: CRMs, dashboards, forms and workflow tools.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "PL",
  },
  sameAs: [
    "https://github.com/ft4k696bk6-prog",
    "https://www.linkedin.com/in/kacper-bernecki/",
  ],
  image: "/images/profile-3-cutout.png",
};

export function StaticPortfolio() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#070707] text-white">
        <Hero />
        <Profile />
        <Experience />
        <Services />
        <TechnicalAudience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}

