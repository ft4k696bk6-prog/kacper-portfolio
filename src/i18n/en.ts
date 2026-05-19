import { enCaseStudies } from "./case-studies";

export const en = {
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    techStack: "Technologies",
    contact: "Contact",
    cta: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  meta: {
    homeTitle: "Kacper Bernecki — Frontend / Web App Developer",
    homeDescription:
      "I build business web applications with React, TypeScript, Next.js and Supabase: CRMs, dashboards, forms and workflow tools.",
  },
  hero: {
    eyebrow: "Business web applications",
    name: "Kacper Bernecki",
    title: "Frontend / Web App Developer",
    description:
      "I build business applications with React, TypeScript, Next.js and Supabase: CRMs, dashboards, forms, admin panels and tools that support company workflows.",
    secondary:
      "I focus on practical web apps: lead management, user roles, forms, dashboards, automations and API integrations.",
    projectsBtn: "View projects",
    bcrmBtn: "Check B-CRM",
    contactBtn: "Contact",
    imageAlt: "Kacper Bernecki professional portrait",
  },
  about: {
    title: "About",
    heading: "I build practical web apps for business processes, not generic portfolio demos.",
    paragraphs: [
      "My strongest projects are operational web apps: CRM views, lead handling, role-based access, dashboards, forms and API-backed workflows.",
      "I combine frontend work with enough backend and database context to build useful application flows end to end: Supabase auth, PostgreSQL data, server routes, validation and deployment.",
      "AI tools are part of my workflow for prototyping, debugging and selected product features, but the core value is still application design, implementation quality and clear technical thinking.",
    ],
    highlights: [
      {
        title: "CRM and workflow screens",
        description: "CRM, dashboards, forms, admin panels and workflow tools.",
      },
      {
        title: "Forms and typed UI",
        description: "Component UI, typed logic, routing, state and form flows.",
      },
      {
        title: "Roles and access",
        description: "Auth, roles, lead data, history and database-backed screens.",
      },
      {
        title: "Database and deployment",
        description: "Vercel deployments, README/docs, CI and project roadmaps.",
      },
    ],
    imageAlt: "Kacper Bernecki seated professional portrait",
  },
  background: {
    title: "Context",
    heading: "Business workflow first, technology second.",
    paragraphs: [
      "Before writing code, I look at the process: who uses the app, what data they need, what changes status, and where the next action should be visible.",
      "That approach is visible in B-CRM: role-aware sales and operations views, lead statuses, callbacks, meetings, comments, history and database-backed access rules.",
      "The portfolio is organized around practical projects that can be inspected through live demos, repositories and case studies.",
    ],
  },
  services: {
    title: "Application Focus",
    subtitle: "The recurring patterns in my projects are CRM workflows, dashboards, forms, data handling and integrations.",
    items: [
      {
        title: "CRM and lead management",
        description:
          "Lead lists, ownership, statuses, comments, callbacks, meetings and activity history.",
      },
      {
        title: "Dashboard views",
        description:
          "Operational screens with metrics, filters, rankings and clear next actions.",
      },
      {
        title: "Forms and validation",
        description:
          "Lead forms, admin forms, offer/calculation inputs and user-facing error states.",
      },
      {
        title: "Role-based access",
        description:
          "Different views and permissions for sales, management, finance, accounting, logistics and installation roles.",
      },
      {
        title: "API and database work",
        description:
          "Supabase, PostgreSQL, route handlers, serverless functions and external API calls.",
      },
      {
        title: "AI as a tool",
        description:
          "AI support for prototyping, debugging, automation and selected app features.",
      },
    ],
  },
  technicalAudience: {
    title: "For companies and technical reviewers",
    subtitle: "Start with B-CRM if you want the fastest read on my web app skills.",
    bestProject: "Best project to review: B-CRM",
    stackLabel: "Stack",
    stack: "React, TypeScript, Next.js, Supabase, PostgreSQL, Tailwind CSS, Vercel",
    showsLabel: "What the project shows",
    shows: [
      "Supabase authentication and protected app screens",
      "User roles and permission rules for owner, admin, manager, sales and operational users",
      "Lead management with statuses, comments, callbacks and meetings",
      "Manager hierarchy, change history and activity-oriented CRM screens",
      "Dashboards, filters, forms and database-backed workflows",
      "Finance, accounting, logistics and installation realization flow",
      "Deployment of a production-like web app demo on Vercel",
    ],
    links: {
      demo: "Live demo",
      repo: "GitHub repo",
      caseStudy: "Case study",
      contact: "Contact",
    },
  },
  projects: {
    title: "Projects",
    subtitle: "A focused set of business apps and supporting web projects. B-CRM is the main technical proof.",
    featuresLabel: "Real features",
    techLabel: "Stack",
    demoLabel: "Live demo",
    repoLabel: "GitHub",
    caseStudyLabel: "Case study",
    linkLabel: "Open project",
    credentialsLabel: "Demo credentials",
    statusLabel: "Status",
    noteLabel: "Note",
    problemLabel: "Problem",
    items: [
      {
        title: "B-CRM",
        problem:
          "Sales teams need one place to control lead ownership, status changes, callbacks, meetings and activity history.",
        description:
          "Production-like CRM demo for lead management and sales workflow, built with role-based screens and Supabase-backed data.",
        features: [
          "Login and demo accounts",
          "Roles: owner, admin, manager, sales, finance, viewer, accounting, logistics, installer",
          "Lead statuses, comments and history",
          "Callbacks, meetings and calendar views",
          "Admin panel, team management and manager hierarchy",
          "Realization tutorial: finance, accounting, logistics and installation",
          "CSV import/export, PDF offer flow and KSeF demo payload",
        ],
        technologies: ["React", "TypeScript", "Next.js", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel"],
        status: "Production-like CRM demo",
        demoUrl: "https://b-crm-berni.vercel.app/login",
        repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
        caseStudyUrl: "/case-studies/b-crm",
        credentials: ["Demo accounts are available on the login screen."],
        image: {
          src: "/images/projects/bcrm-login.jpg",
          alt: "B-CRM login and demo account screen",
        },
      },
      {
        title: "Berni Rush",
        problem:
          "A browser game project needs fast interaction, clear state handling and a playable loop rather than business workflow screens.",
        description:
          "Playable 3D arena game prototype built to practice real-time interaction, state management and browser deployment.",
        features: [
          "3D arena gameplay",
          "Keyboard and touch controls",
          "Playable classes and skins",
          "Enemy waves and boss encounters",
          "Upgrades, pickups and saved progress",
        ],
        technologies: ["React", "TypeScript", "Vite", "Three.js", "Zustand", "Vercel"],
        status: "Playable prototype / Side project",
        demoUrl: "https://bernirushdemooo.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/Berni-rush-demoo",
        caseStudyUrl: "/case-studies/berni-rush",
        image: {
          src: "/images/projects/berni-rush.jpg",
          alt: "Berni Rush browser game preview",
        },
      },
      {
        title: "Portfolio",
        problem:
          "A technical portfolio should help reviewers understand the strongest project quickly without entry-level positioning or vague marketing.",
        description:
          "Personal developer site focused on business web applications, project evidence, bilingual case studies and direct contact.",
        features: [
          "B-CRM-first project structure",
          "Technical reviewer section",
          "Bilingual case studies",
          "Custom Cal.com booking flow",
          "Protected email and phone reveal",
          "SEO, OpenGraph and GTM-ready metadata",
        ],
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Cal.com API", "Turnstile", "Vercel"],
        status: "Active development",
        demoUrl: "https://kacper-portfolio.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/kacper-portfolio",
        caseStudyUrl: "/case-studies/portfolio",
        image: {
          src: "/images/projects/portfolio-home.jpg",
          alt: "Portfolio homepage preview",
        },
      },
      {
        title: "Unreal Engine Gameplay Prototype",
        problem:
          "A gameplay prototype needs interaction systems, mission structure and environment blockout before it can become a full game.",
        description:
          "Local Unreal Engine 5 prototype focused on gameplay systems, driving, contracts, UI/HUD and open-world environment exploration.",
        features: [
          "Driving systems",
          "Mission and contract mechanics",
          "UI/HUD systems",
          "Open-world environment blockout",
          "Gameplay interaction systems",
          "Performance and gameplay experimentation",
        ],
        technologies: ["Unreal Engine 5", "Blueprint System", "Game Design", "UI Systems", "Open-world prototyping"],
        status: "Local prototype / Experimental",
        caseStudyUrl: "/case-studies/unreal-gameplay-prototype",
        note: "Local prototype only: no public demo or repository.",
        image: {
          src: "/images/projects/unreal-gameplay.jpg",
          alt: "Unreal Engine gameplay prototype HUD screenshot",
        },
      },
      {
        title: "BerniNutri",
        problem:
          "Food tracking from photos needs a clear review flow because AI nutrition estimates can be incomplete or inaccurate.",
        description:
          "Mobile-first AI nutrition tracker prototype with image analysis, local meal history and explicit confidence notes.",
        features: [
          "Meal photo upload",
          "OpenAI-backed analysis endpoint",
          "Calories and macro summary",
          "Local meal history",
          "Daily progress dashboard",
          "Error states for missing API configuration",
        ],
        technologies: ["React", "TypeScript", "Vite", "OpenAI API", "LocalStorage", "Vercel"],
        status: "Prototype",
        demoUrl: "https://berninutri-portfolio.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/berninutri-portfolio",
        caseStudyUrl: "/case-studies/berninutri",
        image: {
          src: "/images/projects/berninutri-live.jpg",
          alt: "BerniNutri mobile dashboard preview",
        },
      },
      {
        title: "Kalkulator leasingu",
        problem:
          "Business users often need a quick leasing cost estimate before moving to a financial offer conversation.",
        description:
          "Business calculator demo with leasing inputs, cost summary, printable result and lead capture flow.",
        features: [
          "Net and gross value handling",
          "Down payment, period and buyout inputs",
          "Operational/financial loan variants in UI copy",
          "Result summary for the client",
          "Lead form connected to a serverless endpoint",
          "Business disclaimer for indicative results",
        ],
        technologies: ["React", "TypeScript", "Vite", "Hono", "Drizzle", "Bun", "Vercel"],
        status: "Production-like business tool demo",
        demoUrl: "https://kalkulator-leasingu-1-desktop.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/kalkulator.leasingu-1",
        caseStudyUrl: "/case-studies/kalkulator-leasingu",
        image: {
          src: "/images/projects/leasing-calculator.jpg",
          alt: "Leasing calculator business tool preview",
        },
      },
    ],
  },
  skills: {
    title: "Technologies used in projects",
    description: "Stack used across projects and public demos.",
    items: [
      {
        title: "React / TypeScript",
        description:
          "Used in B-CRM, BerniNutri, the leasing calculator and portfolio for UI components, forms, routing, state and app logic.",
      },
      {
        title: "Next.js",
        description:
          "Used for web app structure, routing, metadata, server routes and Vercel deployment.",
      },
      {
        title: "Supabase / PostgreSQL",
        description:
          "Used in B-CRM for auth, user roles, lead data, change history and database-backed workflows.",
      },
      {
        title: "Tailwind CSS",
        description:
          "Used to build responsive interfaces quickly across dashboards, forms and portfolio views.",
      },
      {
        title: "Vercel",
        description:
          "Used to deploy the portfolio, B-CRM and supporting public app demos.",
      },
      {
        title: "OpenAI API",
        description:
          "Used as a supporting tool for prototyping, debugging, automation and selected app features. AI is not presented as a replacement for software engineering skills.",
      },
    ],
  },
  contact: {
    title: "Talk about a web app, CRM or frontend role",
    description:
      "Book a short call or reveal direct contact details after a quick human check.",
    calendarTitle: "Calendar",
    calendarDescription:
      "Choose a meeting time in the calendar.",
    calendarCta: "Book a call",
    booking: {
      title: "Calendar",
      timezoneLabel: "Europe/Warsaw",
      chooseDayLabel: "Choose a day",
      chooseTimeLabel: "Choose a time",
      backToDaysLabel: "Back to days",
      selectedDayLabel: "Selected day",
      bookingNameLabel: "Name",
      bookingEmailLabel: "Email",
      bookingCompanyLabel: "Company or context",
      bookingMessageLabel: "Short call topic",
      bookingSubmitLabel: "Book this time",
      bookingSendingLabel: "Checking...",
      bookingSuccessLabel: "The time has been booked. Confirmation should arrive by email.",
      bookingErrorLabel: "The time could not be booked. Try again later.",
    },
    reveal: {
      emailButton: "Click to reveal email",
      phoneButton: "Click to reveal phone",
      emailLabel: "Email",
      phoneLabel: "Phone",
      humanCheckLabel: "Human check",
      errorMessage: "The contact detail is not available right now.",
    },
    locationLabel: "Location",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    location: "Poland",
    github: "https://github.com/ft4k696bk6-prog",
    linkedin: "https://www.linkedin.com/in/kacper-bernecki/",
    githubCta: "View GitHub",
    linkedinCta: "LinkedIn",
    copyright: "© 2026 Kacper Bernecki. All rights reserved.",
  },
  caseStudies: enCaseStudies,
};

export type Translations = typeof en;
