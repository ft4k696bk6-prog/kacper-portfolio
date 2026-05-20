import type { Translations } from "./en";
import { plCaseStudies } from "./case-studies";

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
    interactive: "Interaktywne portfolio",
  },
  meta: {
    homeTitle: "Kacper Bernecki — Frontend / Web App Developer",
    homeDescription:
      "Tworzę aplikacje biznesowe w React, TypeScript, Next.js i Supabase: CRM-y, dashboardy, formularze i narzędzia workflow.",
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
  choose: {
    eyebrow: "Wybierz widok",
    title: "Wybierz wersję portfolio pod swój kontekst.",
    description:
      "Otwórz statyczne portfolio do szybkiej oceny technicznej albo interaktywną wersję MacBook do bardziej wizualnej prezentacji.",
    businessTitle: "Statyczne portfolio biznesowe",
    businessDescription:
      "Projekty, case studies, B-CRM, stack, kontakt i rezerwacja rozmowy w czystym formacie dla rekrutera lub firmy.",
    businessCta: "Otwórz statyczne portfolio",
    interactiveTitle: "Interaktywne portfolio MacBook",
    interactiveDescription:
      "Interaktywny pulpit z aplikacjami, projektami, terminalem, grami i skrótami kontaktowymi.",
    interactiveCta: "Otwórz interaktywne portfolio",
    projectsCta: "Przejdź do projektów",
    contactCta: "Kontakt",
    businessImageAlt: "Preview sekcji projektów statycznego portfolio",
    interactiveImageAlt: "Preview interaktywnego portfolio MacBook",
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
      "To podejście widać w B-CRM: widoki sprzedażowe i operacyjne zależne od ról, statusy leadów, callbacki, spotkania, komentarze, historia oraz reguły dostępu oparte o bazę.",
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
          "Różne widoki i uprawnienia dla sprzedaży, zarządzania, finansów, księgowości, logistyki i montażu.",
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
    stackLabel: "Stack",
    stack: "React, TypeScript, Next.js, Supabase, PostgreSQL, Tailwind CSS, Vercel",
    showsLabel: "Co pokazuje projekt",
    shows: [
      "Autoryzację Supabase i chronione ekrany aplikacji",
      "Role i uprawnienia dla właściciela, admina, menadżera, handlowca i ról operacyjnych",
      "Zarządzanie leadami ze statusami, komentarzami, callbackami i spotkaniami",
      "Hierarchię menadżerską, historię zmian i ekrany CRM oparte o aktywności",
      "Dashboardy, filtry, formularze i workflow oparte o bazę danych",
      "Proces realizacji z finansami, księgowością, logistyką i montażem",
      "Deploy production-like web app demo na Vercel",
    ],
    links: {
      demo: "Live demo",
      repo: "Repozytorium GitHub",
      caseStudy: "Studium przypadku",
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
    caseStudyLabel: "Studium przypadku",
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
          "Role: właściciel, admin, menadżer, handlowiec, finanse, podgląd, księgowość, logistyka, monter",
          "Statusy leadów, komentarze i historia",
          "Callbacki, spotkania i widok kalendarza",
          "Panel admina, zarządzanie zespołem i hierarchia menadżerska",
          "Samouczek realizacji: finanse, księgowość, logistyka i montaż",
          "Import/eksport CSV, flow ofert PDF i demo payload KSeF",
        ],
        technologies: ["React", "TypeScript", "Next.js", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel"],
        status: "Production-like CRM demo",
        demoUrl: "https://b-crm-berni.vercel.app/login",
        repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
        caseStudyUrl: "/case-studies/b-crm",
        credentials: ["Konta demo są dostępne na ekranie logowania."],
        image: {
          src: "/images/projects/bcrm-admin-dashboard.jpg",
          alt: "Preview dashboardu admina i workflow demo B-CRM",
        },
      },
      {
        title: "Interactive MacBook Portfolio",
        problem:
          "Interaktywne portfolio powinno być angażujące, ale nie zastępować czytelnych dowodów technicznych z głównej strony.",
        description:
          "Eksperymentalne portfolio w stylu MacBooka z filmowym intro, pulpitem, oknami projektów, skrótami kontaktowymi i mini grami.",
        features: [
          "Intro MacBooka uruchamiane kliknięciem",
          "Interaktywny pulpit z dockiem i oknami aplikacji",
          "Panele projektów, o mnie, umiejętności, kontaktu i kalendarza",
          "Komendy terminala i szybkie akcje",
          "Mini gry oraz skrót do Berni Rush",
          "Przełącznik języka ENG/PL",
        ],
        technologies: ["React", "TypeScript", "Vite", "CSS", "lucide-react", "Vercel"],
        status: "Experimental interactive portfolio",
        demoUrl: "https://kacper-bernecki.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/Kacper-Bernecki",
        caseStudyUrl: "/case-studies/interactive-portfolio",
        image: {
          src: "/images/projects/interactive-portfolio-desktop.jpg",
          alt: "Preview interaktywnego portfolio w stylu MacBooka",
        },
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
        caseStudyUrl: "/case-studies/berni-rush",
        image: {
          src: "/images/projects/berni-rush-gameplay.jpg",
          alt: "Preview gry Berni Rush w przeglądarce",
        },
      },
      {
        title: "Portfolio",
        problem:
          "Portfolio techniczne powinno szybko pokazać najmocniejszy projekt bez pozycjonowania jako osoba początkująca i bez ogólnikowego marketingu.",
        description:
          "Osobista strona developera skupiona na aplikacjach biznesowych, projektach, dwujęzycznych studiach przypadku i bezpośrednim kontakcie.",
        features: [
          "Struktura projektów z B-CRM jako priorytetem",
          "Sekcja dla osób technicznych",
          "Dwujęzyczne studia przypadku",
          "Własny kalendarz przez Cal.com",
          "Chronione odsłanianie emaila i telefonu",
          "SEO, OpenGraph i metadata pod GTM",
        ],
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Cal.com API", "Turnstile", "Vercel"],
        status: "Active development",
        demoUrl: "https://kacper-portfolio.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/kacper-portfolio",
        caseStudyUrl: "/case-studies/portfolio",
        image: {
          src: "/images/projects/portfolio-home.jpg",
          alt: "Preview strony portfolio",
        },
      },
      {
        title: "Unreal Engine Gameplay Prototype",
        problem:
          "Prototyp gameplayu wymaga systemów interakcji, struktury misji i blockoutu świata zanim stanie się pełną grą.",
        description:
          "Lokalny prototyp Unreal Engine 5 skupiony na systemach gameplayu, jeździe, kontraktach, UI/HUD i eksploracji świata open-world.",
        features: [
          "System jazdy",
          "Mechanika misji i kontraktów",
          "Systemy UI/HUD",
          "Blockout środowiska open-world",
          "Systemy interakcji gameplayowych",
          "Eksperymenty wydajnościowe i gameplayowe",
        ],
        technologies: ["Unreal Engine 5", "Blueprint System", "Game Design", "UI Systems", "Open-world prototyping"],
        status: "Local prototype / Experimental",
        caseStudyUrl: "/case-studies/unreal-gameplay-prototype",
        note: "Tylko lokalny prototyp: bez publicznego demo i repozytorium.",
        image: {
          src: "/images/projects/unreal-gameplay.jpg",
          alt: "Screenshot HUD z prototypu gameplayu w Unreal Engine",
        },
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
        caseStudyUrl: "/case-studies/berninutri",
        image: {
          src: "/images/projects/berninutri-live.jpg",
          alt: "Preview mobilnego dashboardu BerniNutri",
        },
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
        demoUrl: "https://kalkulatorleasingu-7484-main.vercel.app",
        repoUrl: "https://github.com/ft4k696bk6-prog/kalkulator.leasingu-1",
        caseStudyUrl: "/case-studies/kalkulator-leasingu",
        image: {
          src: "/images/projects/leasing-calculator-app.jpg",
          alt: "Preview kalkulatora leasingu",
        },
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
      "Umów krótką rozmowę albo odsłoń email i telefon po szybkiej weryfikacji człowieka.",
    calendarTitle: "Kalendarz",
    calendarDescription:
      "Wybierz termin rozmowy w kalendarzu.",
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
      bookingErrorLabel: "Nie udało się zarezerwować terminu. Spróbuj ponownie później.",
    },
    reveal: {
      emailButton: "Kliknij, aby odsłonić email",
      phoneButton: "Kliknij, aby odsłonić telefon",
      emailLabel: "Email",
      phoneLabel: "Telefon",
      humanCheckLabel: "Weryfikacja człowieka",
      errorMessage: "Nie udało się odsłonić danych kontaktowych. Spróbuj ponownie później.",
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
  consent: {
    title: "Ustawienia cookies",
    description:
      "Używam małych ustawień strony, żeby zapamiętać wybrany język i utrzymać portfolio w dobrym działaniu. Opcjonalny pomiar odwiedzin działa dopiero po akceptacji.",
    accept: "Akceptuję cookies",
    reject: "Odrzuć opcjonalne cookies",
    settings: "Ustawienia cookies",
  },
  caseStudies: plCaseStudies,
};
