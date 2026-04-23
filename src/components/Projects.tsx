import { ExternalLink, GitBranch, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Project {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  impact: string[];
  icon: LucideIcon;
}

export function Projects() {
  const projects: Project[] = [
    {
      title: "Global Commerce GraphQL Federation",
      company: "Heineken",
      period: "2024 - Present",
      description:
        "Architected and implemented federated GraphQL solution serving multiple OpCos globally. Designed subgraph ownership models, domain boundaries, and governance standards.",
      technologies: [
        "GraphQL Federation",
        "Apollo",
        "Node.js",
        "TypeScript",
        "Azure",
      ],
      impact: [
        "Enabled unified API layer across 15+ markets",
        "Reduced integration complexity by 60%",
        "Improved API response times by 40%",
      ],
      icon: GitBranch,
    },
    {
      title: "Enterprise CIAM Platform",
      company: "Heineken",
      period: "2024 - Present",
      description:
        "Designed authentication and authorization architecture implementing OAuth2, OIDC, PKCE, and JWT for global commerce platforms.",
      technologies: ["OAuth2", "OIDC", "Azure AD", "CIAM", "Security"],
      impact: [
        "Secured 50M+ user accounts",
        "Implemented zero-trust architecture",
        "Achieved SOC2 compliance",
      ],
      icon: Users,
    },
    {
      title: "Web Components as a Service (CAAS)",
      company: "Schneider Electric",
      period: "2023 - 2024",
      description:
        "Built scalable web components architecture using Builder.io integration, enabling marketing teams to build pages without developer intervention.",
      technologies: [
        "Web Components",
        "Builder.io",
        "SvelteKit",
        "AWS Lambda",
        "DynamoDB",
      ],
      impact: [
        "Reduced page deployment time from days to hours",
        "Empowered 30+ marketing users",
        "Generated 200+ custom landing pages",
      ],
      icon: Zap,
    },
    {
      title: "PWA E-commerce Platform",
      company: "Hunter Douglas USA",
      period: "2022 - 2023",
      description:
        "Delivered Progressive Web App using Magento PWA Studio with SAP integration for pricing and order management.",
      technologies: ["PWA", "React", "Magento", "SAP", "Adobe Commerce"],
      impact: [
        "Improved mobile conversion by 35%",
        "Reduced page load time to under 2s",
        "Integrated real-time SAP pricing engine",
      ],
      icon: ExternalLink,
    },
    {
      title: "B2B Commerce Cloud Platform",
      company: "ABB",
      period: "2021 - 2022",
      description:
        "Architected enterprise B2B platform with microfrontend architecture and complex integrations across MuleSoft, SAP, Salesforce, and Fastly CDN.",
      technologies: [
        "Adobe Commerce Cloud",
        "MuleSoft",
        "Microfrontends",
        "PHP",
        "SAP",
      ],
      impact: [
        "Processed $2B+ in annual transactions",
        "Served 50+ global markets",
        "Achieved 99.9% uptime SLA",
      ],
      icon: GitBranch,
    },
    {
      title: "Custom Magento Migration Tool",
      company: "Hunter Douglas USA",
      period: "2022",
      description:
        "Designed and built automated migration tool from Magento 1 to Magento 2, handling complex data transformations and business logic migration.",
      technologies: ["PHP", "MySQL", "AWS", "Data Migration", "ETL"],
      impact: [
        "Migrated 500K+ products successfully",
        "Reduced migration timeline by 70%",
        "Zero data loss during migration",
      ],
      icon: Zap,
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/50">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-white mb-12">
            Key Projects
          </h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                    <project.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-white mb-1">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span>{project.company}</span>
                      <span>•</span>
                      <span>{project.period}</span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-sm text-cyan-400 uppercase tracking-wider mb-2">
                    Impact
                  </h4>
                  <ul className="space-y-1">
                    {project.impact.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-slate-700/50 text-cyan-300 rounded text-xs border border-slate-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
