import { enCaseStudies } from "./case-studies";

export const en = {
  nav: {
    home: "Services",
    about: "About",
    projects: "Projects",
    techStack: "FAQ",
    contact: "Contact",
    cta: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    interactive: "Interactive portfolio",
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
    bcrmBtn: "Check B-CRM DEMO",
    contactBtn: "Contact",
    imageAlt: "Kacper Bernecki professional portrait",
  },
  choose: {
    title: "Which portfolio do you want to choose?",
    staticLabel: "Static",
    interactiveLabel: "Interactive",
    contactCta: "Contact me",
    imageAlt: "Kacper Bernecki presenting portfolio choice",
  },
  about: {
    title: "About",
    heading: "A real person behind your project. You’ll know me by name.",
    paragraphs: [
      "I’m Kacper. I design and build websites and business apps. You work directly with me from the first conversation to launch, so your idea stays clear throughout the project.",
      "I start with practical questions: what should your visitors do, what would make your team’s work easier, and which features matter? That shapes the design, technology and scope.",
      "I care about everyday details: mobile layouts, clear forms, helpful error messages and easy navigation. Explore my live projects and read how they were built.",
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
    title: "Working together",
    heading: "From an idea to a working product.",
    paragraphs: [
      "Conversation and plan. Tell me about your business, audience and goal. We agree on scope, priorities, budget and timing before work starts.",
      "Design and development. I prepare the visual direction and working screens. You see progress, share feedback and know what is being built.",
      "Testing and launch. I check mobile and desktop layouts, forms and key user journeys. We launch the solution and discuss any next steps.",
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
    subtitle: "Start with B-CRM DEMO if you want the fastest read on my web app skills.",
    bestProject: "Best project to review: B-CRM DEMO",
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
  aiMascot: {
    openLabel: "Open AI assistant",
    closeLabel: "Close chat",
    hideLabel: "Hide assistant for 48 hours",
    restoreLabel: "Show assistant",
    chatTitle: "AI Assistant",
    chatSubtitle: "Projects and collaboration",
    personaLabel: "AI Assistant",
    greeting: "Ask about projects and collaboration.",
    initialMessage:
      "Hi! I can explain Kacper’s projects, experience and technologies, and help you find contact details or book a meeting.",
    placeholder: "Write a question...",
    placeholderDictation: "Write or dictate something...",
    inputLabel: "Message for the AI assistant",
    sendLabel: "Send message",
    micLabel: "Start dictation",
    stopMicLabel: "Stop dictation",
    dictationReadyLabel: "Ready to chat",
    dictationListeningLabel: "Listening for dictation",
    dictationHint: "Mic only writes into the input. You stay in control of sending.",
    dictationUnsupported: "Dictation is not supported in this browser.",
    dictationPermissionError: "I could not access the microphone. You can still write normally.",
    listeningLabel: "Listening...",
    thinkingLabel: "Thinking...",
    errorMessage: "The assistant is not available right now. Try again later.",
    quickActions: {
      projects: "Show projects",
      bcrm: "Open B-CRM",
      book: "Find a slot",
      contact: "Contact",
      code: "Help with code",
    },
    actionReplies: {
      projects: "Sure, opening the projects. B-CRM goes first, as it should.",
      bcrm: "Opening the B-CRM case study. This is the main technical proof.",
      contact: "Jumping to contact. Calendar, email and phone are there.",
      book: "Opening the available slots here, without sending you to another page.",
    },
    codePrompt:
      "I have a frontend/code problem. I will paste the smallest relevant snippet without secrets.",
    booking: {
      loadingDays: "Checking available days...",
      loadingSlots: "Checking free times...",
      chooseDay: "Choose a day",
      unavailable: "Booking is temporarily unavailable here. You can still use the contact section.",
      name: "Your name",
      email: "Email",
      topic: "Short topic",
      submit: "Book this time",
      success: "Done. The meeting is booked and confirmation should arrive by email.",
      error: "I could not book this time. Try another slot or use direct contact.",
    },
  },
  projects: {
    title: "Projects",
    subtitle: "See what’s already working.",
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
        title: "B-CRM DEMO",
        problem:
          "Sales teams need one place to control lead ownership, status changes, callbacks, meetings and activity history.",
        description:
          "A CRM demo that organises leads, team tasks and the journey from sales to delivery. Each role sees the information and actions needed for their work.",
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
        demoUrl: "https://demo-crm.bernecki.dev/login",
        repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
        caseStudyUrl: "/case-studies/b-crm",
        credentials: ["Admin: demo / demo", "Sales: demo-handlowiec / demo", "Manager: demo-menadzer / demo"],
        image: {
          src: "/images/projects/bcrm-admin-dashboard.jpg",
          alt: "B-CRM admin dashboard and demo workflow preview",
        },
      },
      {
        "title": "Motomizer",
        "problem": "A distinctive product with several functions needs a landing page that quickly explains what it does and lets visitors explore the available variants.",
        "description": "Responsive product landing page for a car-shaped aroma diffuser featuring exhaust-like mist, LEDs, engine sound and REV mode. Built around product presentation and availability enquiries.",
        "features": [
          "Interactive colour selection: black, white and burgundy",
          "Swipe-friendly product galleries and navigation",
          "Dedicated feature, package and dimension visuals",
          "Bilingual Polish and English website",
          "Availability notification form",
          "Mobile and desktop layouts"
        ],
        "technologies": [
          "HTML",
          "CSS",
          "JavaScript",
          "Responsive UI",
          "Vercel"
        ],
        "status": "Public product landing / availability waitlist",
        "demoUrl": "https://motomizer.pl",
        "externalLabel": "Visit website",
        "caseStudyUrl": "/case-studies/motomizer",
        "image": {
          "src": "/images/projects/motomizer-live.jpg",
          "alt": "Motomizer live website showing the automotive aroma diffuser landing page"
        }
      },
      {
        "title": "StarCars Import",
        "problem": "Importing a car from the US or Canada is complex: the auction bid is only part of the total cost, and customers need an understandable process and estimate.",
        "description": "Customer-facing site for US and Canadian vehicle imports, featuring interactive brand presentation, a landed-cost estimator, contact forms and a step-by-step journey from auction to delivery.",
        "features": [
          "Import cost breakdown and estimator",
          "Auction, origin-region, port and vehicle choices",
          "Indicative USD/PLN exchange rate from the Polish central bank",
          "Process, projects and FAQ sections",
          "Enquiry form prefilled with cost context",
          "Interactive 3D elements and animations"
        ],
        "technologies": [
          "React",
          "TypeScript",
          "Vite",
          "Three.js",
          "GSAP",
          "Vercel"
        ],
        "status": "Public business website / evolving",
        "demoUrl": "https://star-cars.us",
        "externalLabel": "Visit website",
        "caseStudyUrl": "/case-studies/starcars",
        "image": {
          "src": "/images/projects/starcars-live.jpg",
          "alt": "StarCars live website showing the car import service hero section"
        }
      },
      {
        "title": "BeatMarket",
        "problem": "Producers and artists need a cohesive experience for discovering, previewing and licensing beats instead of fragmented file-sharing conversations.",
        "description": "An evolving beat marketplace with catalog discovery, audio previews, musical filters, producer pages, track submission and a licensing purchase flow.",
        "features": [
          "Searchable beat catalog with sorting",
          "Genre, musical-key and BPM-range filters",
          "Audio previews and detailed beat pages",
          "Producer profiles and track submission",
          "Moderation before public listing",
          "Licensing flow and developing payment integration"
        ],
        "technologies": [
          "Next.js",
          "React",
          "JavaScript",
          "Supabase",
          "PostgreSQL",
          "Vercel"
        ],
        "status": "Marketplace in active development",
        "demoUrl": "https://beatmarket.bernecki.dev",
        "externalLabel": "Open BeatMarket",
        "caseStudyUrl": "/case-studies/beatmarket",
        "image": {
          "src": "/images/projects/beatmarket-live.jpg",
          "alt": "BeatMarket live website showing the beat discovery catalog"
        }
      },
      {
        title: "Interactive MacBook Portfolio",
        problem:
          "An interactive portfolio needs to stay playful without replacing the clearer technical evidence of the main site.",
        description:
          "Experimental MacBook-style portfolio with a cinematic intro, desktop panels, project links, contact shortcuts and mini games.",
        features: [
          "Click-to-start MacBook intro",
          "Interactive desktop with dock and app windows",
          "Project, about, skills, contact and calendar panels",
          "Terminal commands and quick actions",
          "Embedded browser games and Berni Rush shortcut",
          "ENG/PL language switch",
        ],
        technologies: ["React", "TypeScript", "Vite", "CSS", "lucide-react", "Vercel"],
        status: "Experimental interactive portfolio",
        demoUrl: "https://kacper-bernecki.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/Kacper-Bernecki",
        caseStudyUrl: "/case-studies/interactive-portfolio",
        image: {
          src: "/images/projects/interactive-portfolio-desktop.jpg",
          alt: "Interactive MacBook portfolio desktop preview",
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
          src: "/images/projects/berni-rush-gameplay.jpg",
          alt: "Berni Rush browser game preview",
        },
      },
      {
        title: "Portfolio",
        problem:
          "A technical portfolio should help reviewers understand the strongest project quickly without entry-level positioning or vague marketing.",
        description:
          "Personal developer site focused on business web applications, project evidence, bilingual case studies and protected email/phone reveal.",
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
        demoUrl: "https://bernecki.dev",
        repoUrl: "https://github.com/ft4k696bk6-prog/kacper-portfolio",
        caseStudyUrl: "/case-studies/portfolio",
        image: {
          src: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fbernecki.dev?vpw=1440&vph=1100&w=1200&requeue=true",
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
        title: "Leasing Calculator",
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
        demoUrl: "https://kalkulatorleasingu-7484-main.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/kalkulator.leasingu-1",
        caseStudyUrl: "/case-studies/kalkulator-leasingu",
        image: {
          src: "/images/projects/leasing-calculator-app.jpg",
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
          "Used in B-CRM, StarCars and BeatMarket, the leasing calculator and portfolio for UI components, forms, routing, state and app logic.",
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
    title: "Let’s talk about your business.",
    description:
      "Tell me what you need. We’ll work out the scope, timing and quote. Send a message or book a call.",
    calendarTitle: "Calendar",
    calendarDescription:
      "Choose a meeting time in the calendar.",
    calendarCta: "Find a slot",
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
  consent: {
    title: "Cookie settings",
    description:
      "This site remembers your preferences. Optional visit measurement starts only with your consent.",
    accept: "Accept cookies",
    reject: "Reject optional cookies",
    settings: "Cookie settings",
  },
  caseStudies: enCaseStudies,
};

export type Translations = typeof en;
