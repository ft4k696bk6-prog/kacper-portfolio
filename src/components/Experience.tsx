"use client";

import { useState } from "react";
import { Building2, Calendar, ChevronRight } from "lucide-react";

export function Experience() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const experiences = [
    {
      role: "Product Architect",
      company: "Heineken",
      period: "October 2024 - Present",
      description:
        "Defining and governing target architecture for global digital commerce platforms across multiple OpCos. Designing and scaling federated GraphQL architecture, including subgraph ownership models, domain boundaries, and governance standards.",
      technologies: [
        "GraphQL Federation",
        "Azure",
        "Node.js",
        "TypeScript",
        "CIAM",
      ],
      highlights: [
        "Leading architectural decision-making (KDDs/ADRs) for GraphQL Federation",
        "Designing CIAM and authentication flows (OAuth2, OIDC, PKCE, JWT)",
        "Platform engineering and developer enablement initiatives",
      ],
    },
    {
      role: "Software Architect & Developer",
      company: "Schneider Electric",
      period: "October 2023 - October 2024",
      description:
        "Modeling architecture of integrations with external applications, solution topology, and security. Developing TypeScript code for AWS Lambda with S3, DynamoDB, AWS EventBridge.",
      technologies: [
        "AWS",
        "Node.js",
        "SvelteKit",
        "GitHub Actions",
        "Builder.io",
      ],
      highlights: [
        "Implemented web components (CAAS) architecture",
        "Managed complex Builder.io (SAAS) integrations",
        "Automated deployment pipelines",
      ],
    },
    {
      role: "Full-Stack Developer",
      company: "Hunter Douglas USA",
      period: "January 2022 - September 2023",
      description:
        "Designed and delivered custom migration tool from Magento 1. Integrated SAP pricing engine and Order Management System. Built Progressive Web App with Magento PWA Studio.",
      technologies: ["PHP", "AWS", "React", "PWA", "SAP", "Adobe Commerce"],
      highlights: [
        "Custom migration tool implementation",
        "SAP pricing engine integration",
        "Platform performance optimization",
      ],
    },
    {
      role: "Adobe Commerce Architect & Developer",
      company: "ABB (via Accenture)",
      period: "February 2021 - July 2022",
      description:
        "Hybrid role combining Architect and Principal Software Engineer for Adobe Commerce Cloud B2B platform. Designed integrations across MuleSoft, SAP, Salesforce, and Fastly.",
      technologies: [
        "MuleSoft",
        "PHP",
        "Adobe Commerce Cloud",
        "Knockout.js",
      ],
      highlights: [
        "Microfrontend architecture implementation",
        "Complex enterprise integrations",
        "Global platform performance optimization",
      ],
    },
    {
      role: "Software Architect",
      company: "JTI Geneva",
      period: "May 2019 - November 2020",
      description:
        "Led design of development environment and software architecture for large-scale B2C eCommerce platform at Japanese Tobacco International HQ.",
      technologies: ["AEM", "React.js", "Adobe Commerce", "Agile"],
      highlights: [
        "Designed headless commerce architecture",
        "Collaborated with Adobe and BuzzBrothers engineering teams",
        "Delivered platform enablement and training",
      ],
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/50">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-white mb-12">
            Employment History
          </h2>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent"></div>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="relative pl-20 pb-8 group cursor-pointer"
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-cyan-500 border-4 border-slate-900 group-hover:scale-125 transition-transform"></div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl text-white mb-2">{exp.role}</h3>
                        <div className="flex items-center gap-4 text-slate-400">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span>{exp.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{exp.period}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-6 h-6 text-cyan-400 transition-transform ${
                          expandedIndex === index ? "rotate-90" : ""
                        }`}
                      />
                    </div>

                    <p className="text-slate-300 mb-4">{exp.description}</p>

                    {expandedIndex === index && (
                      <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <h4 className="text-sm text-cyan-400 uppercase tracking-wider mb-2">
                            Key Highlights
                          </h4>
                          <ul className="space-y-2">
                            {exp.highlights.map((highlight, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-slate-300"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></div>
                                <span className="text-sm">{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm text-cyan-400 uppercase tracking-wider mb-2">
                            Technologies
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-slate-700/50 text-cyan-300 rounded-full text-sm border border-slate-600"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
