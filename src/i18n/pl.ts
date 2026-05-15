import type { Translations } from "./en";

export const pl: Translations = {
  nav: {
    home: "Start",
    about: "O mnie",
    projects: "Projekty",
    techStack: "Technologie",
    contact: "Kontakt",
    cta: "Skontaktuj się",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
  },
  hero: {
    eyebrow: "Praktyczne aplikacje webowe dla małych firm",
    name: "Kacper Bernecki",
    title: "AI-Assisted Web Developer & Business App Builder",
    description:
      "Tworzę praktyczne aplikacje webowe, CRM-y i automatyzacje dla małych firm. Łączę podejście biznesowe z nowoczesnymi technologiami, żeby budować narzędzia, które realnie porządkują sprzedaż, obsługę klientów i codzienną pracę.",
    projectsBtn: "Zobacz projekty",
    contactBtn: "Skontaktuj się",
    imageAlt: "Profesjonalny portret Kacpra Berneckiego",
    metrics: [
      { value: "CRM", label: "Sprzedaż i obsługa leadów" },
      { value: "AI", label: "Szybsze prototypowanie" },
      { value: "Web", label: "Responsywne narzędzia firmowe" },
    ],
  },
  about: {
    title: "O mnie",
    heading: "AI, biznes i webowe narzędzia, które mają działać w praktyce.",
    paragraphs: [
      "Zaczynałem od biznesu, sprzedaży i pracy z klientem, dlatego patrzę na aplikacje inaczej niż tylko przez pryzmat kodu. Interesują mnie rozwiązania, które mają konkretne zastosowanie: CRM-y, generatory ofert, dashboardy, automatyzacje i narzędzia, które pomagają firmom szybciej działać.",
      "Lubię technologię, AI, biznes, samochody i projekty, które można realnie wdrożyć. Nie buduję aplikacji \"dla samego kodu\". Najważniejsze jest dla mnie to, żeby produkt rozwiązywał konkretny problem, był prosty w obsłudze i wyglądał profesjonalnie.",
      "W projektach biznesowych miałem styczność z obsługą klientów, sprzedażą, finansami, OZE, importem aut i organizacją procesów. To pomaga mi lepiej rozumieć, czego faktycznie potrzebuje mała firma, zanim zacznie się pisać kod.",
    ],
    highlights: [
      {
        title: "Biznes przede wszystkim",
        description: "Zaczynam od procesu, sprzedaży i realnego problemu użytkownika.",
      },
      {
        title: "Proste narzędzia",
        description: "CRM-y, dashboardy i automatyzacje, które mają być użyteczne od pierwszego dnia.",
      },
      {
        title: "Praca wspierana AI",
        description: "Wykorzystuję nowoczesne narzędzia AI do szybszego prototypowania i analizy problemów.",
      },
      {
        title: "Czysta prezentacja",
        description: "Produkt powinien być przejrzysty, responsywny i wyglądać profesjonalnie.",
      },
    ],
    imageAlt: "Profesjonalny portret siedzącego Kacpra Berneckiego",
  },
  background: {
    title: "Historia",
    heading: "Kontekst biznesowy przed decyzjami technologicznymi.",
    paragraphs: [
      "Moja droga nie zaczęła się od klasycznego programowania. Pracowałem blisko sprzedaży, klientów i realnych problemów firm. Dzięki temu dobrze rozumiem, że aplikacja ma przede wszystkim działać w praktyce: ma oszczędzać czas, porządkować dane i ułatwiać zarabianie pieniędzy.",
      "Przy projektach związanych z OZE i firmą re-energy system zajmowałem się również tematami organizacyjnymi oraz technologicznymi: procesami, narzędziami, obsługą danych i szukaniem rozwiązań, które usprawniają codzienną pracę.",
      "Obecnie rozwijam własne projekty webowe, głównie CRM-y, landing page i aplikacje biznesowe wspierane AI.",
    ],
  },
  services: {
    title: "Co robię",
    subtitle: "Praktyczne narzędzia dla małych firm, które potrzebują porządku, szybkości i lepszej obsługi klienta.",
    items: [
      {
        title: "CRM-y dla małych firm",
        description:
          "Systemy do obsługi leadów, klientów, handlowców, statusów, callbacków, spotkań i historii kontaktu.",
      },
      {
        title: "Landing page",
        description:
          "Nowoczesne strony ofertowe dla usług, lokalnych firm, specjalistów i kampanii reklamowych.",
      },
      {
        title: "Generatory ofert",
        description:
          "Narzędzia do tworzenia ofert PDF, kalkulacji, konfiguracji produktów i prezentowania propozycji klientowi.",
      },
      {
        title: "Dashboardy",
        description:
          "Panele z danymi, statystykami, filtrami i przejrzystym widokiem wyników.",
      },
      {
        title: "Automatyzacje",
        description:
          "Proste automatyzacje procesów: formularze, powiadomienia, statusy, przypomnienia i przepływ danych.",
      },
      {
        title: "AI-assisted development",
        description:
          "Wykorzystanie AI do szybszego prototypowania, tworzenia aplikacji, analizowania problemów i usprawniania pracy firm.",
      },
    ],
  },
  projects: {
    title: "Projekty",
    subtitle: "Aktualne projekty oparte na praktycznym użyciu biznesowym, nauce i szybkim wdrażaniu.",
    featuresLabel: "Funkcje",
    techLabel: "Technologie",
    demoLabel: "Demo",
    repoLabel: "Repo",
    linkLabel: "Otwórz projekt",
    credentialsLabel: "Dane demo",
    statusLabel: "Status",
    noteLabel: "Uwaga",
    items: [
      {
        title: "B-CRM - CRM dla branży OZE",
        description:
          "Webowy CRM przygotowany dla zespołów sprzedażowych z branży fotowoltaiki i OZE. System pozwala zarządzać leadami, przypisywać je do użytkowników, obsługiwać statusy, dodawać komentarze, planować callbacki i spotkania oraz pracować na kontach o różnych rolach.",
        features: [
          "Role: admin, handlowiec, menadżer",
          "Zarządzanie leadami",
          "Statusy leadów",
          "Komentarze i historia kontaktu",
          "Callbacki i spotkania",
          "Panel administracyjny",
          "Konta demo",
          "Generowanie / obsługa ofert PDF",
        ],
        technologies: ["React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel"],
        demoUrl: "https://b-crm-berni.vercel.app/login",
        repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
        credentials: ["Admin: demo / demo", "Handlowiec: demo-handlowiec / demo", "Menadżer: demo-menadzer / demo"],
      },
      {
        title: "Berni Rush - prosta gra webowa",
        description:
          "Prosta gra webowa stworzona jako projekt testowy i eksperymentalny. Projekt pozwolił mi przećwiczyć pracę z interaktywnym frontendem, logiką gry, wdrożeniem na Vercel oraz podstawową optymalizacją działania aplikacji w przeglądarce.",
        note:
          "Projekt edukacyjny / eksperymentalny, nieprzedstawiany jako dopracowana gra komercyjna.",
        technologies: ["React", "Vite", "JavaScript or TypeScript", "Vercel"],
        liveUrl: "https://bernirushdemooo.vercel.app",
      },
      {
        title: "Personal Portfolio - strona portfolio",
        description:
          "Nowoczesna strona portfolio przygotowana jako osobisty landing page. Prezentuje projekty, doświadczenie, technologie, dane kontaktowe oraz podejście do tworzenia praktycznych aplikacji biznesowych.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Vercel", "Responsive Design"],
        status: "Projekt portfolio",
      },
    ],
  },
  skills: {
    title: "Technologie",
    description: "Technologie, z którymi pracuję lub które wykorzystuję w projektach:",
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
    title: "Masz pomysł na aplikację, CRM albo landing page?",
    description:
      "Napisz do mnie, jeśli potrzebujesz prostego systemu dla firmy, strony ofertowej, automatyzacji albo chcesz sprawdzić, czy dany pomysł da się szybko wdrożyć.",
    emailLabel: "Email",
    phoneLabel: "Telefon",
    locationLabel: "Lokalizacja",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    email: "Kacper.bernecki@gmail.com",
    phone: "+48 575 109 897",
    location: "Polska",
    github: "https://github.com/ft4k696bk6-prog",
    linkedin: "https://www.linkedin.com/in/casper-bernecki-a8a81537b/?locale=pl",
    emailCta: "Napisz maila",
    githubCta: "Zobacz GitHub",
    linkedinCta: "LinkedIn",
    copyright: "© 2026 Kacper Bernecki. Wszelkie prawa zastrzeżone.",
  },
};
