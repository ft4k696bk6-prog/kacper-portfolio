import { Code2, Cloud, Database, Shield } from "lucide-react";

export function Profile() {
  const highlights = [
    {
      icon: Code2,
      title: "GraphQL Federation",
      description:
        "Architecting federated GraphQL solutions at enterprise scale",
    },
    {
      icon: Cloud,
      title: "Cloud Architecture",
      description: "Azure & AWS cloud-native integration platforms",
    },
    {
      icon: Database,
      title: "API Ecosystems",
      description: "Building scalable, well-governed API solutions",
    },
    {
      icon: Shield,
      title: "CIAM & Security",
      description: "OAuth2, OIDC, PKCE, JWT implementation expertise",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-white mb-8">Profile</h2>

          <p className="text-lg text-slate-300 leading-relaxed mb-12">
            Experienced Software Engineer specializing in cloud-native
            integration platforms and API ecosystems. Strong expertise in Web
            Apps, Commerce, GraphQL Federation, CIAM, and secure
            service-to-service communication, with hands-on experience in
            Node.js, TypeScript, and Azure/AWS. Proven ability to translate
            complex business requirements into scalable, well-governed technical
            solutions while collaborating effectively across teams.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <item.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
