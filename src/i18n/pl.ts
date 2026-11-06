import type { Translations } from "./en";
import { plCaseStudies } from "./case-studies";

export const pl: Translations = {
  nav: {
    home: "Oferta",
    about: "O mnie",
    projects: "Projekty",
    techStack: "FAQ",
    contact: "Kontakt",
    cta: "Kontakt",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    interactive: "Interaktywne portfolio",
  },
  meta: {
    homeTitle: "Strony internetowe, CRM i aplikacje webowe | Kacper Bernecki",
    homeDescription:
      "Strony internetowe, landing page i CRM-y dla firm. Kacper Bernecki — bezpośredni kontakt, dopracowany wygląd i wycena dopasowana do zakresu.",
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
    bcrmBtn: "Sprawdź B-CRM DEMO",
    contactBtn: "Kontakt",
    imageAlt: "Profesjonalny portret Kacpra Berneckiego",
  },
  choose: {
    title: "Które portfolio chcesz wybrać?",
    staticLabel: "Statyczne",
    interactiveLabel: "Interaktywne",
    contactCta: "Kontakt",
    imageAlt: "Kacper Bernecki prezentujący wybór portfolio",
  },
  about: {
    title: "O mnie",
    heading: "Za tym projektem stoi człowiek. Będziesz znać go po imieniu.",
    paragraphs: [
      "Jestem Kacper. Projektuję i programuję strony oraz aplikacje dla firm. Rozmawiasz ze mną od pierwszych ustaleń po wdrożenie, więc pomysł nie ginie po drodze między kolejnymi osobami.",
      "Lubię konkret: co ma zrobić użytkownik, jak uprościć pracę zespołu i które funkcje naprawdę są potrzebne. Na tej podstawie dobieram wygląd, technologię i zakres prac.",
      "Zwracam uwagę na szczegóły: widok na telefonie, czytelne formularze, komunikaty błędów i wygodną nawigację. Projekty możesz obejrzeć na żywo i sprawdzić w case studies.",
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
    title: "Współpraca krok po kroku",
    heading: "Od „mam pomysł” do „już działa”.",
    paragraphs: [
      "Rozmowa i plan. Opowiadasz o firmie, odbiorcach i celu. Ustalamy zakres, priorytety, budżet oraz termin — zanim ruszą prace.",
      "Projekt i wykonanie. Przygotowuję kierunek wizualny i działające widoki. Oglądasz postępy, przekazujesz uwagi i wiesz, co powstaje.",
      "Sprawdzenie i wdrożenie. Testuję widoki na telefonie i komputerze, formularze oraz najważniejsze ścieżki. Publikujemy rozwiązanie i ustalamy ewentualny dalszy rozwój.",
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
    subtitle: "Jeśli chcesz szybko ocenić moje umiejętności web app, zacznij od B-CRM DEMO.",
    bestProject: "Najlepszy projekt do sprawdzenia: B-CRM DEMO",
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
  aiMascot: {
    openLabel: "Otwórz asystenta AI",
    closeLabel: "Zamknij chat",
    hideLabel: "Schowaj asystenta na 48 godzin",
    restoreLabel: "Pokaż asystenta",
    chatTitle: "Asystent AI",
    chatSubtitle: "Projekty i współpraca",
    personaLabel: "Asystent AI",
    greeting: "Zapytaj o projekty i współpracę.",
    initialMessage:
      "Cześć! Mogę opowiedzieć o projektach, doświadczeniu i technologiach Kacpra. Pomogę też znaleźć kontakt lub umówić spotkanie.",
    placeholder: "Napisz pytanie...",
    placeholderDictation: "Napisz albo podyktuj...",
    inputLabel: "Wiadomość do asystenta AI",
    sendLabel: "Wyślij wiadomość",
    micLabel: "Włącz dyktowanie",
    stopMicLabel: "Zatrzymaj dyktowanie",
    dictationReadyLabel: "Gotowy do rozmowy",
    dictationListeningLabel: "Słucham dyktowania",
    dictationHint: "Mikrofon tylko wpisuje tekst do pola. Ty decydujesz, kiedy wysłać.",
    dictationUnsupported: "Ta przeglądarka nie wspiera dyktowania.",
    dictationPermissionError: "Nie udało się uzyskać dostępu do mikrofonu. Nadal możesz pisać normalnie.",
    listeningLabel: "Słucham...",
    thinkingLabel: "Myślę...",
    errorMessage: "Asystent jest teraz niedostępny. Spróbuj ponownie później.",
    quickActions: {
      projects: "Pokaż projekty",
      bcrm: "Otwórz B-CRM",
      book: "Znajdź termin",
      contact: "Kontakt",
      code: "Pomoc z kodem",
    },
    actionReplies: {
      projects: "Jasne, pokazuję projekty. B-CRM idzie pierwszy, jak trzeba.",
      bcrm: "Otwieram case study B-CRM. To główny dowód techniczny.",
      contact: "Przenoszę do kontaktu. Tam jest kalendarz, email i telefon.",
      book: "Otwieram dostępne terminy tutaj, bez przerzucania na zewnętrzną stronę.",
    },
    codePrompt:
      "Mam problem z frontendem/kodem. Wkleję najmniejszy potrzebny fragment bez sekretów.",
    booking: {
      loadingDays: "Sprawdzam dostępne dni...",
      loadingSlots: "Sprawdzam wolne godziny...",
      chooseDay: "Wybierz dzień",
      unavailable: "Rezerwacja jest chwilowo niedostępna tutaj. Nadal możesz użyć sekcji kontaktu.",
      name: "Imię i nazwisko",
      email: "Email",
      topic: "Krótki temat",
      submit: "Zarezerwuj termin",
      success: "Gotowe. Spotkanie jest zarezerwowane, a potwierdzenie powinno przyjść na email.",
      error: "Nie udało się zarezerwować tego terminu. Wybierz inny slot albo użyj kontaktu.",
    },
  },
  projects: {
    title: "Projekty",
    subtitle: "Zobacz, co już działa.",
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
        title: "B-CRM DEMO",
        problem:
          "Zespoły sprzedażowe potrzebują jednego miejsca do kontroli właściciela leada, statusów, callbacków, spotkań i historii działań.",
        description:
          "Autorski CRM zbudowany przeze mnie od zera. Porządkuje leady, zadania zespołu i proces od sprzedaży po realizację. Publiczne demo pokazuje role i workflow bez danych klientów.",
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
        demoUrl: "https://demo-crm.bernecki.dev/login",
        repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
        caseStudyUrl: "/case-studies/b-crm",
        credentials: ["Admin: demo / demo", "Handlowiec: demo-handlowiec / demo", "Menadżer: demo-menadzer / demo"],
        image: {
          src: "/images/projects/bcrm-admin-dashboard.jpg",
          alt: "Preview dashboardu admina i workflow demo B-CRM",
        },
      },
      {
        "title": "Motomizer",
        "problem": "Produkt o niecodziennym wyglądzie i funkcjach wymaga strony, na której klient szybko zrozumie działanie urządzenia i zobaczy dostępne warianty.",
        "description": "Responsywny landing produktowy aromatyzera w formie auta: efekt pary z wydechu, podświetlenie LED, dźwięk silnika i tryb REV. Projekt nastawiony na prezentację produktu i zbieranie zainteresowania.",
        "features": [
          "Interaktywny wybór koloru: czarny, biały i bordowy",
          "Galerie zdjęć z obsługą gestów i nawigacją",
          "Osobne wizualizacje funkcji, zestawu i wymiarów",
          "Dwujęzyczna witryna PL/EN",
          "Formularz powiadomienia o dostępności",
          "Układ dostosowany do telefonu i desktopu"
        ],
        "technologies": [
          "HTML",
          "CSS",
          "JavaScript",
          "Responsive UI",
          "Vercel"
        ],
        "status": "Publiczna strona produktu / lista zainteresowanych",
        "demoUrl": "https://motomizer.pl",
        "externalLabel": "Zobacz witrynę",
        "caseStudyUrl": "/case-studies/motomizer",
        "image": {
          "src": "/images/projects/motomizer-live.jpg",
          "alt": "Zrzut ekranu działającej strony Motomizer z landingiem aromatyzera samochodowego"
        }
      },
      {
        "title": "StarCars Import",
        "problem": "Import auta z USA lub Kanady jest złożony: cena aukcyjna to tylko część kosztu, a klient potrzebuje czytelnej ścieżki i orientacyjnej kalkulacji.",
        "description": "Strona usługowa dla importu samochodów z USA i Kanady, z interaktywną prezentacją marki, kalkulatorem całkowitego kosztu, formularzem kontaktowym i opisem procesu od aukcji po odbiór.",
        "features": [
          "Kalkulator kosztów importu z rozbiciem na opłaty",
          "Warianty aukcji, regionów, portów i typu pojazdu",
          "Pobieranie orientacyjnego kursu USD/PLN z NBP",
          "Sekcje procesu, realizacji i odpowiedzi na pytania",
          "Formularz zapytania z kontekstem kalkulacji",
          "Interaktywne elementy 3D i animacje"
        ],
        "technologies": [
          "React",
          "TypeScript",
          "Vite",
          "Three.js",
          "GSAP",
          "Vercel"
        ],
        "status": "Publiczna strona usługowa / rozwój",
        "demoUrl": "https://star-cars.us",
        "externalLabel": "Zobacz witrynę",
        "caseStudyUrl": "/case-studies/starcars",
        "image": {
          "src": "/images/projects/starcars-live.jpg",
          "alt": "Zrzut ekranu działającej strony StarCars z sekcją importu samochodów"
        }
      },
      {
        "title": "BeatMarket",
        "problem": "Producenci i artyści potrzebują miejsca, w którym odsłuch, wyszukiwanie beatów i wybór licencji tworzą spójny proces zamiast wymiany plików przez wiadomości.",
        "description": "Marketplace dla producentów i artystów: odkrywanie muzyki, odsłuch i wybór licencji w jednym miejscu. Projekt w aktywnym rozwoju.",
        "features": [
          "Katalog beatów z wyszukiwarką i sortowaniem",
          "Filtry: gatunek, tonacja i zakres BPM",
          "Odtwarzanie podglądów i szczegóły utworu",
          "Profile producentów i formularz zgłoszenia beatu",
          "Moderacja zgłoszeń przed publikacją",
          "Obsługa licencji i rozwijana integracja płatności"
        ],
        "technologies": [
          "Next.js",
          "React",
          "JavaScript",
          "Supabase",
          "PostgreSQL",
          "Vercel"
        ],
        "status": "Marketplace w aktywnym rozwoju",
        "demoUrl": "https://beatmarket.bernecki.dev",
        "externalLabel": "Otwórz BeatMarket",
        "caseStudyUrl": "/case-studies/beatmarket",
        "image": {
          "src": "/images/projects/beatmarket-live.jpg",
          "alt": "Zrzut ekranu działającego BeatMarket z katalogiem beatów"
        }
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
          "Użyte w B-CRM, StarCars i BeatMarket, kalkulatorze leasingu i portfolio. Komponenty UI, formularze, routing, zarządzanie stanem i logika aplikacji.",
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
    title: "Co chcesz zbudować?",
    description:
      "Napisz, czym zajmuje się Twoja firma i czego potrzebujesz. Jeśli masz inspiracje, termin lub budżet — dodaj je. Ustalimy sensowny zakres i wycenę. Możesz też wybrać termin rozmowy.",
    calendarTitle: "Kalendarz",
    calendarDescription:
      "Wybierz termin w kalendarzu.",
    calendarCta: "Znajdź termin",
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
      "Zapamiętuję ustawienia strony. Opcjonalny pomiar odwiedzin włączę po Twojej zgodzie.",
    accept: "Akceptuję cookies",
    reject: "Odrzuć opcjonalne cookies",
    settings: "Ustawienia cookies",
  },
  caseStudies: plCaseStudies,
};
