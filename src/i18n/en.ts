export const en = {
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    techStack: "Tech Stack",
    contact: "Contact",
    cta: "Contact Me",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: "Practical web apps for small businesses",
    name: "Kacper Bernecki",
    title: "AI-Assisted Web Developer & Business App Builder",
    description:
      "I build practical web apps, CRMs and automations for small businesses. I combine business thinking with modern technology to create tools that organize sales, customer handling and everyday operations.",
    projectsBtn: "View Projects",
    contactBtn: "Contact Me",
    imageAlt: "Kacper Bernecki professional portrait",
    metrics: [
      { value: "CRM", label: "Sales and lead handling" },
      { value: "AI", label: "Faster prototyping" },
      { value: "Web", label: "Responsive business tools" },
    ],
  },
  about: {
    title: "About",
    heading: "AI, business and web tools built to work in practice.",
    paragraphs: [
      "I started from business, sales and direct client work, so I look at applications from a practical point of view, not only through code. I am interested in tools with real use cases: CRMs, offer generators, dashboards, automations and systems that help companies work faster.",
      "I like technology, AI, business, cars and projects that can actually be implemented. I do not build apps just for the sake of writing code. For me, the most important thing is that the product solves a clear problem, is easy to use and looks professional.",
      "Through business projects, I have worked around client service, sales, finance, renewable energy, car import and process organization. This helps me understand what a small company really needs before starting to build software.",
    ],
    highlights: [
      {
        title: "Business first",
        description: "I start with the workflow, sales process and real user problem.",
      },
      {
        title: "Simple tools",
        description: "CRMs, dashboards and automations designed to be useful from day one.",
      },
      {
        title: "AI-assisted workflow",
        description: "I use modern AI tools to prototype faster and analyze problems better.",
      },
      {
        title: "Clean presentation",
        description: "Every product should be clear, responsive and professional.",
      },
    ],
    imageAlt: "Kacper Bernecki seated professional portrait",
  },
  background: {
    title: "Background",
    heading: "Business context before software decisions.",
    paragraphs: [
      "My path did not start from traditional software development. I worked close to sales, clients and real business problems. Because of that, I understand that an application should work in practice first: save time, organize data and help the company make money.",
      "In projects related to renewable energy and re-energy system, I was also involved in organizational and technology-related areas: processes, tools, data handling and finding solutions that improve everyday work.",
      "Today, I focus on building my own web projects, mainly CRMs, landing pages and AI-assisted business applications.",
    ],
  },
  services: {
    title: "What I Build",
    subtitle: "Focused tools for small companies that need order, speed and a more professional customer workflow.",
    items: [
      {
        title: "CRMs for small businesses",
        description:
          "Systems for managing leads, clients, sales reps, statuses, callbacks, meetings and contact history.",
      },
      {
        title: "Landing pages",
        description:
          "Modern offer pages for services, local businesses, specialists and advertising campaigns.",
      },
      {
        title: "Offer generators",
        description:
          "Tools for creating PDF offers, calculations, product configurations and client-ready proposals.",
      },
      {
        title: "Dashboards",
        description:
          "Panels with data, statistics, filters and clear business performance views.",
      },
      {
        title: "Automations",
        description:
          "Simple process automations: forms, notifications, statuses, reminders and data flow.",
      },
      {
        title: "AI-assisted development",
        description:
          "Using AI to prototype faster, build applications, analyze problems and improve business workflows.",
      },
    ],
  },
  projects: {
    title: "Projects",
    subtitle: "Current projects built around practical business use cases, learning and fast implementation.",
    featuresLabel: "Features",
    techLabel: "Tech",
    demoLabel: "Demo",
    repoLabel: "Repository",
    linkLabel: "Open project",
    credentialsLabel: "Demo credentials",
    statusLabel: "Status",
    noteLabel: "Note",
    items: [
      {
        title: "B-CRM - CRM for renewable energy sales teams",
        description:
          "A web-based CRM built for photovoltaic and renewable energy sales teams. The system helps manage leads, assign them to users, handle statuses, add comments, schedule callbacks and meetings, and work with different user roles.",
        features: [
          "Roles: admin, sales rep, manager",
          "Lead management",
          "Lead statuses",
          "Comments and contact history",
          "Callbacks and meetings",
          "Admin panel",
          "Demo accounts",
          "PDF offer handling / generation",
        ],
        technologies: ["React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel"],
        demoUrl: "https://b-crm-berni.vercel.app/login",
        repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
        credentials: ["Admin: demo / demo", "Sales rep: demo-handlowiec / demo", "Manager: demo-menadzer / demo"],
      },
      {
        title: "Berni Rush - simple web game",
        description:
          "A simple browser-based game created as an experimental project. It helped me practice interactive frontend logic, game flow, Vercel deployment and basic browser performance optimization.",
        note:
          "Learning and experimental project, not presented as a polished commercial game.",
        technologies: ["React", "Vite", "JavaScript or TypeScript", "Vercel"],
        liveUrl: "https://bernirushdemooo.vercel.app",
      },
      {
        title: "Personal Portfolio - portfolio website",
        description:
          "A modern portfolio website built as a personal landing page. It presents projects, background, technologies, contact details and my approach to building practical business applications.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel", "Responsive Design"],
        status: "Portfolio project",
      },
    ],
  },
  skills: {
    title: "Tech Stack",
    description: "Technologies I work with or use in my projects:",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "Vercel",
      "GitHub",
      "AI-assisted development",
      "PDF generation",
      "API integrations",
      "Responsive Design",
    ],
  },
  contact: {
    title: "Have an idea for an app, CRM or landing page?",
    description:
      "Contact me if you need a simple business system, an offer page, an automation or want to check whether your idea can be quickly implemented.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    locationLabel: "Location",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    email: "Kacper.bernecki@gmail.com",
    phone: "+48 575 109 897",
    location: "Poland",
    github: "https://github.com/ft4k696bk6-prog",
    linkedin: "https://www.linkedin.com/in/casper-bernecki-a8a81537b/?locale=pl",
    emailCta: "Send Email",
    githubCta: "View GitHub",
    linkedinCta: "LinkedIn",
    copyright: "© 2026 Kacper Bernecki. All rights reserved.",
  },
};

export type Translations = typeof en;
