export function Skills() {
  const skillCategories = [
    {
      category: "Core Technologies",
      skills: [
        { name: "TypeScript & Node.js", level: 95 },
        { name: "GraphQL", level: 90 },
        { name: "React.js", level: 85 },
        { name: "SQL", level: 85 },
      ],
    },
    {
      category: "Cloud & Infrastructure",
      skills: [
        { name: "Azure", level: 88 },
        { name: "AWS", level: 85 },
        { name: "Docker & Kubernetes", level: 80 },
        { name: "Git", level: 90 },
      ],
    },
    {
      category: "Architecture & Security",
      skills: [
        { name: "Technical Design", level: 92 },
        { name: "CIAM & IAM", level: 88 },
        { name: "Adobe Commerce", level: 90 },
        { name: "API Governance", level: 87 },
      ],
    },
    {
      category: "Additional",
      skills: [
        { name: "C#", level: 75 },
        { name: "Python & PyTorch", level: 70 },
      ],
    },
  ];

  const languages = [
    { name: "English", level: 95 },
    { name: "Polish", level: 100 },
  ];

  const hobbies = [
    "Home Automation",
    "3D Printing",
    "Skiing",
    "Biking",
    "Sailing",
    "Squash",
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-white mb-12">
            Skills & Expertise
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {skillCategories.map((category, index) => (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
              >
                <h3 className="text-xl text-cyan-400 mb-6">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.skills.map((skill, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="text-white">{skill.name}</span>
                        <span className="text-slate-400 text-sm">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl text-cyan-400 mb-6">Languages</h3>
              <div className="space-y-4">
                {languages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{lang.name}</span>
                      <span className="text-slate-400 text-sm">
                        {lang.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${lang.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl text-cyan-400 mb-6">
                Hobbies & Interests
              </h3>
              <div className="flex flex-wrap gap-3">
                {hobbies.map((hobby, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-colors"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-slate-400 text-sm">
                Technology enthusiast with passion for automation and outdoor
                activities. Balancing innovation with adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
