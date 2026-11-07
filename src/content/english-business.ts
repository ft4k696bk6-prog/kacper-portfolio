/** English editorial versions of public business pages. No machine translation at runtime. */
export const englishServices = {
  websites: {
    label:"Website development",
    title:"Website Development for Businesses | Kacper Bernecki",
    eyebrow:"Websites · Landing pages · Product websites",
    heading:"A website that explains your offer and turns interest into enquiries.",
    intro:"I design and build fast, responsive websites for businesses, services and product brands. You work directly with the person responsible for design, development and launch — without unnecessary layers of communication.",
    points:[
      {title:"A clear offer",body:"A structure that helps visitors understand what you do, who it is for and how to contact you."},
      {title:"Mobile-first design",body:"Layouts, typography and images designed to remain readable on phones as well as desktop screens."},
      {title:"Forms and integrations",body:"Contact forms, analytics and connections to the systems used by your business."},
      {title:"Search-ready foundations",body:"Technical SEO, meaningful content structure, metadata and crawlable navigation."}
    ],
    scope:"Company websites, campaign landing pages, product presentations and website improvements.",
    original:"/tworzenie-stron-internetowych",
    kind:"websites"
  },
  crm: {
    label:"CRM and web applications",
    title:"Custom CRM and Web Applications | Kacper Bernecki",
    eyebrow:"CRM · Dashboards · Business applications",
    heading:"Software designed around your workflow, not the other way around.",
    intro:"I create web applications that organize customer enquiries, sales teams, responsibilities and business processes. A custom CRM can combine lead management, role-based views, reminders and integrations in one place.",
    points:[
      {title:"Lead management",body:"Assignments, stages, notes, follow-ups and clear ownership of each customer enquiry."},
      {title:"Roles and access",body:"Different views for administrators, sales representatives and operational teams, with server-side authorization."},
      {title:"Integrations",body:"Connection to Meta Lead Ads, files, calendars, forms and other business tools."},
      {title:"Room to grow",body:"A practical first version that can be expanded as your processes and team evolve."}
    ],
    scope:"Custom CRM systems, admin panels, dashboards, internal tools and API integrations.",
    original:"/crm-i-aplikacje-webowe",
    kind:"crm"
  },
  marketing: {
    label:"Marketing and advertising",
    title:"Meta Ads, Lead Generation and Marketing | Kacper Bernecki",
    eyebrow:"Meta Ads · Lead generation · Social media",
    heading:"Marketing that brings enquiries into a working sales process.",
    intro:"I plan and run advertising campaigns for businesses, combining the offer, creative content and lead forms with follow-up in the CRM. I focus on contact quality and a clear route from the first enquiry to the sales team.",
    points:[
      {title:"Campaign strategy",body:"Offers, audiences and messaging adjusted to the service, region and customer needs."},
      {title:"Ad creative and forms",body:"Clear advertising content and lead forms with questions that help qualify enquiries."},
      {title:"Lead delivery",body:"Forwarding new contacts to the right team member, with source attribution and follow-up stages."},
      {title:"Measurement",body:"Tracking cost per lead, contact quality, conversations and the next steps in sales."}
    ],
    scope:"Facebook and Instagram ads, lead generation, social media communication and CRM-connected marketing.",
    original:"/marketing-i-reklamy",
    kind:"marketing"
  }
} as const;

export const englishRealizations = {
 "isto-kebab-strona":{title:"Isto Kebab — Restaurant Website and Orders",category:"Websites",summary:"A restaurant site with menu, product selection and an ordering workflow.",details:["Designed and developed the Isto Kebab website for a restaurant in Jabłonka, including a mobile-friendly menu, food presentation and customer ordering interface.","The project connects a public website with ordering workflows and an operational panel. The live site is also available at isto.bernecki.dev.","The screenshots shown in this portfolio come from the actual deployed website, not generated mockups."]},
  "jalapeno-marketing":{
    title:"Jalapeno — Local Community and Marketing",category:"Marketing",
    summary:"Advertising and social media that helped a local restaurant reach customers in Niemce and surrounding towns.",
    details:[
      "I worked on social media communication and Meta Ads campaigns for Jalapeno Kebab in Niemce, aiming to build awareness and bring customers to the restaurant throughout the week.",
      "Campaign results included 4,700 interactions at PLN 0.25 each, followed by 7,400 interactions at PLN 0.11 each. An awareness campaign reached 182,100 accounts at a cost of PLN 3.75 per 1,000 accounts.",
      "Growing interest also meant more weekday traffic and a greater need to coordinate deliveries and customer service."
    ]
  },
  "reenergy-rozwoj-marki":{
    title:"Re-Energy System — Building a Renewable Energy Brand",category:"Marketing",
    summary:"Meta Ads lead generation, recruitment campaigns, a company website and sales processes developed together.",
    details:[
      "I have worked with Re-Energy System on its online presence, marketing and tools for managing customer enquiries since an early stage of the business.",
      "Around two years of Meta Ads campaigns involved PLN 90,837 in advertising spend. The company reached PLN 6 million in turnover during the collaboration. Seventeen lead generation campaigns produced 2,331 contacts at an average cost of PLN 29.79.",
      "Marketing and the sales workflow operate together: new leads are qualified, assigned and guided through the next stages in the CRM."
    ]
  },
  "reenergy-crm":{
    title:"Re-Energy System — CRM and Sales Operations",category:"CRM and applications",
    summary:"A sales workflow connecting enquiries, assignments and customer follow-up.",
    details:[
      "The project connects customer acquisition with CRM tools for assigning and managing new contacts.",
      "A practical sales system needs clear ownership of each lead, activity history, statuses and appropriate access for each role. These features help the team respond consistently."
    ]
  },
  "reenergy-strona":{
    title:"Re-Energy System — Company Website",category:"Websites",
    summary:"An online presentation of renewable energy services integrated into a broader marketing strategy.",
    details:[
      "The company website presents the renewable energy offer and creates a clear path for customers to get in touch.",
      "Website content, advertising and internal tools are planned as parts of one customer experience, while keeping their individual goals and responsibilities clear."
    ]
  },
  "starcars-filmy-social-media":{
    title:"StarCars — Video and Social Media",category:"Marketing",
    summary:"Short-form video production, social media communication and advertising for car imports.",
    details:[
      "I developed short video content, editing and marketing communication for the StarCars car-import service.",
      "The videos help customers understand the offer and connect advertising and social media with a straightforward route to contacting the company."
    ]
  },
  "gentlemen-social-media":{
    title:"Gentlemen Barber — Social Media",category:"Marketing",
    summary:"Social media communication for a barbershop in Warsaw.",
    details:[
      "I worked on social media communication for Gentlemen Barber in Warsaw.",
      "The content showcases services and the team's work, helping local customers discover the barbershop and decide to book a visit."
    ]
  },
  "motomizer-marka":{
    title:"Motomizer — Product Brand Development",category:"Brand and marketing",
    summary:"Product positioning and online presentation for an automotive fragrance diffuser.",
    details:[
      "Motomizer combines a distinctive automotive-inspired product with brand identity and a clear online presentation.",
      "The product website highlights the car-shaped design, mist, lighting, sound and available colour variants."
    ]
  },
  "b-code":{
    title:"B-Code — Multi-Model AI Tool",category:"CRM and applications",
    summary:"An application combining APIs from several AI models with distinct responsibilities.",
    details:[
      "I developed a tool that connects several AI model APIs and assigns separate roles to the stages of a task.",
      "The project focuses on practical orchestration, cost controls and a clear process for passing context between models."
    ]
  }
} as const;

export type EnglishServiceSlug = keyof typeof englishServices;
export type EnglishRealizationSlug = keyof typeof englishRealizations;
