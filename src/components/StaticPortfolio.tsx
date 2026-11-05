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
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://bernecki.dev/#person",
      name: "Kacper Bernecki",
      jobTitle: "Frontend / Web App Developer",
      description:
        "Independent Polish developer building websites, CRM systems and practical business web apps.",
      address: { "@type": "PostalAddress", addressCountry: "PL" },
      sameAs: [
        "https://github.com/ft4k696bk6-prog",
        "https://www.linkedin.com/in/kacper-bernecki/",
      ],
      image: "https://bernecki.dev/images/profile-3-cutout.png",
      knowsAbout: [
        "Website development",
        "CRM systems",
        "Business web applications",
        "React",
        "TypeScript",
        "Next.js",
        "Supabase",
        "PostgreSQL",
        "Digital marketing websites",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://bernecki.dev/#service",
      name: "Kacper Bernecki — strony internetowe, CRM i web app",
      url: "https://bernecki.dev/",
      provider: { "@id": "https://bernecki.dev/#person" },
      areaServed: "PL",
      serviceType: [
        "Website development",
        "CRM development",
        "Business web application development",
        "Landing page development",
      ],
    },
  ],
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
