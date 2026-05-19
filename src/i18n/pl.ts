import type { Translations } from "./en";

export const pl: Translations = {
  nav: {
    home: "Start",
    about: "O mnie",
    projects: "Projekty",
    techStack: "Technologie",
    contact: "Kontakt",
    cta: "Kontakt",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
  },
  hero: {
    eyebrow: "Aplikacje webowe dla biznesu",
    name: "Kacper Bernecki",
    title: "Frontend / Web App Developer",
    description:
      "Buduję aplikacje biznesowe w React, TypeScript, Next.js i Supabase: CRM-y, dashboardy, formularze, panele administracyjne i narzędzia do obsługi procesów firmowych.",
    secondary:
      "Specjalizuję się w praktycznych aplikacjach webowych: lead management, role użytkowników, formularze, dashboardy, automatyzacje i integracje API.",
    projectsBtn: "Zobacz projekty",
    bcrmBtn: "Sprawdź B-CRM",
    contactBtn: "Kontakt",
    imageAlt: "Profesjonalny portret Kacpra Berneckiego",
  },
  about: {
    title: "O mnie",
    heading: "Buduję praktyczne aplikacje webowe dla procesów biznesowych.",
    paragraphs: [
      "Najmocniejsze projekty w moim portfolio to aplikacje operacyjne: widoki CRM, obsługa leadów, role użytkowników, dashboardy, formularze i workflow oparte o API.",
      "Łączę frontend z wystarczającym kontekstem backendu i bazy danych, żeby budować kompletne przepływy aplikacji: Supabase auth, dane w PostgreSQL, route handlers, walidację i deploy.",
      "AI jest częścią mojego workflow przy prototypowaniu, debugowaniu i wybranych funkcjach produktu, ale nie zastępuje kompetencji programistycznych ani decyzji technicznych.",
    ],
    highlights: [
      {
        title: "Ekrany CRM i workflow",
        description: "CRM, dashboardy, formularze, panele admina i narzędzia workflow.",
      },
      {
        title: "Formularze i typowany UI",
        description: "Komponenty UI, logika typowana, routing, stan i formularze.",
      },
      {
        title: "Role i dostęp",
        description: "Auth, role, dane leadów, historia zmian i widoki z bazy.",
      },
      {
        title: "Baza danych i deploy",
        description: "Deploy na Vercel, README/docs, CI i roadmapy projektów.",
      },
    ],
    imageAlt: "Profesjonalny portret siedzącego Kacpra Berneckiego",
  },
  background: {
    title: "Kontekst",
    heading: "Najpierw workflow biznesowy, potem technologia.",
    paragraphs: [
      "Przed pisaniem kodu patrzę na proces: kto używa aplikacji, jakich danych potrzebuje, co zmienia status i gdzie ma być widoczna kolejna akcja.",
      "To podejście widać w B-CRM: widoki admina, menadżera i handlowca; statusy leadów; callbacki; spotkania; komentarze; historia oraz reguły dostępu oparte o bazę.",
      "Portfolio prowadzi przez projekty, które można sprawdzić przez live demo, repozytoria i case study.",
    ],
  },
  services: {
    title: "Obszar aplikacji",
    subtitle: "Powtarzalne wzorce w moich projektach to CRM, dashboardy, formularze, dane i integracje.",
    items: [
      {
        title: "CRM i lead management",
        description:
          "Listy leadów, właściciele, statusy, komentarze, callbacki, spotkania i historia aktywności.",
      },
      {
        title: "Widoki dashboardowe",
        description:
          "Ekrany operacyjne z metrykami, filtrami, rankingami i jasną kolejną akcją.",
      },
      {
        title: "Formularze i walidacja",
        description:
          "Formularze leadów, formularze admina, kalkulatory ofertowe i komunikaty błędów.",
      },
      {
        title: "Role użytkowników",
        description:
          "Różne widoki i uprawnienia dla admina, menadżera, handlowca oraz ról wspierających.",
      },
      {
        title: "API i baza danych",
        description:
          "Supabase, PostgreSQL, route handlers, serverless functions i zewnętrzne API.",
      },
      {
        title: "AI jako narzędzie",
        description:
          "Wsparcie AI przy prototypowaniu, debugowaniu, automatyzacji i wybranych funkcjach aplikacji.",
      },
    ],
  },
  technicalAudience: {
    title: "Dla firm i osób technicznych",
    subtitle: "Jeśli chcesz szybko ocenić moje umiejętności web app, zacznij od B-CRM.",
    bestProject: "Najlepszy projekt do sprawdzenia: B-CRM",
    stack: "React, TypeScript, Next.js, Supabase, PostgreSQL, Tailwind CSS, Vercel",
    showsLabel: "Co pokazuje projekt",
    shows: [
      "Autoryzację Supabase i chronione ekrany aplikacji",
      "Role i uprawnienia dla admina, menadżera i handlowca",
      "Zarządzanie leadami ze statusami, komentarzami, callbackami i spotkaniami",
      "Historię zmian i ekrany CRM oparte o aktywności",
      "Dashboardy, filtry, formularze i workflow oparte o bazę danych",
      "Deploy production-like web app demo na Vercel",
    ],
    links: {
      demo: "Live demo",
      repo: "GitHub repo",
      caseStudy: "Case study",
      contact: "Kontakt",
    },
  },
  projects: {
    title: "Projekty",
    subtitle: "Skupiony zestaw aplikacji biznesowych i projektów wspierających. B-CRM jest głównym dowodem technicznym.",
    featuresLabel: "Realne funkcje",
    techLabel: "Stack",
    demoLabel: "Live demo",
    repoLabel: "GitHub",
    caseStudyLabel: "Case study",
    linkLabel: "Otwórz projekt",
    credentialsLabel: "Dane demo",
    statusLabel: "Status",
    noteLabel: "Uwaga",
    problemLabel: "Problem",
    items: [
      {
        title: "B-CRM",
        problem:
          "Zespoły sprzedażowe potrzebują jednego miejsca do kontroli właściciela leada, statusów, callbacków, spotkań i historii działań.",
        description:
          "Production-like CRM demo do obsługi lead management i procesu sprzedaży, z widokami opartymi o role i dane w Supabase.",
        features: [
          "Logowanie i konta demo",
          "Role: admin, menadżer, handlowiec",
          "Statusy leadów, komentarze i historia",
          "Callbacki, spotkania i widok kalendarza",
          "Panel admina i zarządzanie zespołem",
          "Import/eksport CSV oraz flow ofert PDF",
        ],
        technologies: ["React", "TypeScript", "Next.js", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel"],
        status: "Production-like CRM demo",
        demoUrl: "https://b-crm-berni.vercel.app/login",
        repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
        caseStudyUrl: "/b-crm-case-study",
        credentials: ["Konta demo są dostępne na ekranie logowania."],
      },
      {
        title: "BerniNutri",
        problem:
          "Analiza jedzenia ze zdjęcia wymaga jasnego przepływu review, bo estymacje AI mogą być niepełne albo niedokładne.",
        description:
          "Mobile-first prototyp trackera żywieniowego AI z analizą zdjęcia, lokalną historią posiłków i notą o poziomie pewności.",
        features: [
          "Upload zdjęcia posiłku",
          "Endpoint analizy z OpenAI API",
          "Podsumowanie kalorii i makro",
          "Lokalna historia posiłków",
          "Dashboard dziennego postępu",
          "Obsługa błędów braku konfiguracji API",
        ],
        technologies: ["React", "TypeScript", "Vite", "OpenAI API", "LocalStorage", "Vercel"],
        status: "Prototype",
        demoUrl: "https://berninutri-portfolio.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/berninutri-portfolio",
      },
      {
        title: "Kalkulator leasingu",
        problem:
          "Użytkownik biznesowy często potrzebuje szybkiej estymacji kosztu leasingu przed rozmową o konkretnej ofercie finansowej.",
        description:
          "Demo kalkulatora biznesowego z parametrami leasingu, podsumowaniem kosztów, wydrukiem i formularzem leadowym.",
        features: [
          "Obsługa wartości netto i brutto",
          "Wpłata własna, okres i wykup",
          "Warianty operacyjno-finansowe w copy UI",
          "Podsumowanie wyniku dla klienta",
          "Formularz leadowy połączony z endpointem serverless",
          "Disclaimer dla wyników orientacyjnych",
        ],
        technologies: ["React", "TypeScript", "Vite", "Hono", "Drizzle", "Bun", "Vercel"],
        status: "Production-like business tool demo",
        demoUrl: "https://kalkulator-leasingu-1-desktop.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/kalkulator.leasingu-1",
      },
      {
        title: "Berni Rush",
        problem:
          "Projekt gry webowej wymaga szybkiej interakcji, jasnego zarządzania stanem i grywalnej pętli, a nie ekranów biznesowego workflow.",
        description:
          "Grywalny prototyp areny 3D stworzony do ćwiczenia interakcji real-time, zarządzania stanem i deployu w przeglądarce.",
        features: [
          "Rozgrywka na arenie 3D",
          "Sterowanie klawiaturą i dotykiem",
          "Klasy postaci i skórki",
          "Fale przeciwników i bossowie",
          "Ulepszenia, pickupy i zapis postępu",
        ],
        technologies: ["React", "TypeScript", "Vite", "Three.js", "Zustand", "Vercel"],
        status: "Playable prototype / Side project",
        demoUrl: "https://bernirushdemooo.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/Berni-rush-demoo",
      },
      {
        title: "Portfolio",
        problem:
          "Portfolio techniczne powinno szybko pokazać najmocniejszy projekt bez pozycjonowania jako osoba początkująca i bez ogólnikowego marketingu.",
        description:
          "Osobista strona developera skupiona na aplikacjach biznesowych, projektach, case study i bezpiecznym formularzu kontaktowym.",
        features: [
          "Struktura projektów z B-CRM jako priorytetem",
          "Sekcja dla osób technicznych",
          "Case study",
          "Formularz kontaktowy z zabezpieczeniami",
          "SEO i OpenGraph metadata",
        ],
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Resend", "Turnstile", "Vercel"],
        status: "Active development",
        demoUrl: "https://kacper-portfolio.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/kacper-portfolio",
      },
    ],
  },
  skills: {
    title: "Technologie użyte w projektach",
    description: "Stack z projektów i publicznych demo.",
    items: [
      {
        title: "React / TypeScript",
        description:
          "Użyte w B-CRM, BerniNutri, kalkulatorze leasingu i portfolio. Komponenty UI, formularze, routing, zarządzanie stanem i logika aplikacji.",
      },
      {
        title: "Next.js",
        description:
          "Użyte do struktury aplikacji webowych, routingu, metadanych, route handlers i deployu na Vercel.",
      },
      {
        title: "Supabase / PostgreSQL",
        description:
          "Użyte w B-CRM do auth, ról użytkowników, danych leadów, historii zmian i pracy z bazą.",
      },
      {
        title: "Tailwind CSS",
        description:
          "Użyte do szybkiego budowania responsywnych interfejsów w dashboardach, formularzach i portfolio.",
      },
      {
        title: "Vercel",
        description:
          "Użyte do deployu portfolio, B-CRM i publicznych demo aplikacji.",
      },
      {
        title: "OpenAI API",
        description:
          "Używane pomocniczo przy prototypowaniu, debugowaniu, automatyzacji oraz wybranych funkcjach aplikacji. AI nie jest przedstawiane jako zamiennik kompetencji programistycznych.",
      },
    ],
  },
  contact: {
    title: "Porozmawiajmy o aplikacji webowej, CRM-ie albo roli frontend",
    description:
      "Użyj formularza w sprawie projektu, review technicznego, współpracy albo roli web app / frontend.",
    nameLabel: "Imię i nazwisko",
    emailLabel: "Email",
    companyLabel: "Firma lub kontekst",
    messageLabel: "Wiadomość",
    submitLabel: "Wyślij wiadomość",
    sendingLabel: "Wysyłanie...",
    successMessage: "Dzięki. Wiadomość została wysłana.",
    errorMessage: "Nie udało się wysłać wiadomości. Spróbuj ponownie później.",
    privacyNote:
      "Adres email służy wyłącznie do odpowiedzi na wiadomość. Bezpośrednie dane kontaktowe są odsłaniane dopiero po weryfikacji człowieka.",
    calendarTitle: "Kalendarz",
    calendarDescription:
      "Jeśli wolisz rozmowę zamiast formularza, wybierz termin w kalendarzu.",
    calendarCta: "Umów rozmowę",
    booking: {
      title: "Kalendarz",
      timezoneLabel: "Europe/Warsaw",
      chooseDayLabel: "Wybierz dzień",
      chooseTimeLabel: "Wybierz godzinę",
      backToDaysLabel: "Wróć do dni",
      selectedDayLabel: "Wybrany dzień",
      bookingNameLabel: "Imię i nazwisko",
      bookingEmailLabel: "Email",
      bookingCompanyLabel: "Firma lub kontekst",
      bookingMessageLabel: "Krótki temat rozmowy",
      bookingSubmitLabel: "Zarezerwuj termin",
      bookingSendingLabel: "Sprawdzanie...",
      bookingSuccessLabel: "Termin został zarezerwowany. Potwierdzenie powinno przyjść na email.",
      bookingErrorLabel: "Nie udało się zarezerwować terminu. Spróbuj ponownie albo użyj formularza.",
    },
    reveal: {
      title: "Bezpośredni kontakt",
      description: "Email i telefon są dostępne po krótkiej weryfikacji człowieka.",
      emailButton: "Kliknij, aby odsłonić email",
      phoneButton: "Kliknij, aby odsłonić telefon",
      emailLabel: "Email",
      phoneLabel: "Telefon",
      humanCheckLabel: "Weryfikacja człowieka",
      errorMessage: "Nie udało się odsłonić danych. Użyj formularza kontaktowego.",
    },
    locationLabel: "Lokalizacja",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    location: "Polska",
    github: "https://github.com/ft4k696bk6-prog",
    linkedin: "https://www.linkedin.com/in/kacper-bernecki/",
    githubCta: "Zobacz GitHub",
    linkedinCta: "LinkedIn",
    copyright: "© 2026 Kacper Bernecki. Wszelkie prawa zastrzeżone.",
  },
};
