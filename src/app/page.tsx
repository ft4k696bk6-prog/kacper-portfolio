"use client";

import { Hero } from "@/components/Hero";
import { Profile } from "@/components/Profile";
import { Experience } from "@/components/Experience";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kacper Bernecki",
  jobTitle: "AI-Assisted Web Developer & Business App Builder",
  description:
    "I build practical web apps, CRMs, landing pages and automations for small businesses.",
  email: "mailto:Kacper.bernecki@gmail.com",
  telephone: "+48 575 109 897",
  address: {
    "@type": "PostalAddress",
    addressCountry: "PL",
  },
  sameAs: [
    "https://github.com/ft4k696bk6-prog",
    "https://www.linkedin.com/in/casper-bernecki-a8a81537b/?locale=pl",
  ],
  image: "/images/profile-1.png",
};

export default function Home() {
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
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
