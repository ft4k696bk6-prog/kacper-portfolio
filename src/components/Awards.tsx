import { Award, Trophy, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AwardItem {
  icon: LucideIcon;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export function Awards() {
  const awards: AwardItem[] = [
    {
      icon: Trophy,
      title: "Adobe Certified Expert",
      issuer: "Adobe",
      date: "2020",
      description: "Adobe Commerce Cloud Developer certification",
    },
    {
      icon: Award,
      title: "Solution Architecture Excellence",
      issuer: "Heineken",
      date: "2024",
      description:
        "Recognition for outstanding GraphQL Federation architecture design",
    },
    {
      icon: Star,
      title: "Innovation Award",
      issuer: "Schneider Electric",
      date: "2024",
      description: "Custom web components architecture implementation",
    },
    {
      icon: Award,
      title: "Azure Solutions Architect",
      issuer: "Microsoft",
      date: "2023",
      description: "Certified Azure Solutions Architect Expert",
    },
    {
      icon: Trophy,
      title: "Team Excellence Award",
      issuer: "ABB",
      date: "2022",
      description: "Outstanding contribution to enterprise platform delivery",
    },
    {
      icon: Star,
      title: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2022",
      description: "AWS Certified Developer - Associate",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/50">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-white mb-12">
            Honors & Awards
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-colors">
                      <award.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white mb-1">{award.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>{award.issuer}</span>
                        <span>•</span>
                        <span>{award.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-auto">
                    {award.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
