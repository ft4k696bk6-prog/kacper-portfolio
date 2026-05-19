export type CaseStudyItem = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  status: string;
  liveUrl: string;
  repoUrl: string;
  problem: string;
  goal: string;
  roles: Array<{ name: string; description: string }>;
  features: string[];
  stack: string[];
  decisions: string[];
  learned: string[];
  next: string[];
  limitations: string;
};

export type CaseStudiesContent = {
  backLabel: string;
  projectsBackLabel: string;
  eyebrow: string;
  liveDemoLabel: string;
  repoLabel: string;
  stackLabel: string;
  notFoundTitle: string;
  notFoundDescription: string;
  sections: {
    problem: string;
    goal: string;
    roles: string;
    features: string;
    decisions: string;
    learned: string;
    next: string;
    limitations: string;
  };
  items: CaseStudyItem[];
};

export const enCaseStudies: CaseStudiesContent = {
  backLabel: "Back to portfolio",
  projectsBackLabel: "Back to projects",
  eyebrow: "Case study",
  liveDemoLabel: "Live demo",
  repoLabel: "GitHub",
  stackLabel: "Stack",
  notFoundTitle: "Case study not found",
  notFoundDescription: "This project case study is not available.",
  sections: {
    problem: "Problem",
    goal: "Goal",
    roles: "Users and roles",
    features: "Key features",
    decisions: "Technical decisions",
    learned: "What I learned",
    next: "Next improvements",
    limitations: "Limitations",
  },
  items: [
    {
      slug: "b-crm",
      title: "B-CRM — CRM for lead handling and sales operations",
      subtitle:
        "Production-like CRM demo with role-aware views, Supabase data, operations workflow and documented limitations.",
      summary:
        "B-CRM shows a practical business web app flow: auth, roles, leads, dashboards, activities, operations and deployment.",
      status: "Production-like CRM demo",
      liveUrl: "https://b-crm-berni.vercel.app/login",
      repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
      problem:
        "Sales and operations teams need one place for lead ownership, statuses, callbacks, meetings, files, comments and post-contract execution.",
      goal:
        "Build a CRM demo that organizes lead work, separates role-based screens and shows how a record moves from sales into operations.",
      roles: [
        { name: "Owner", description: "Full control over CRM data, roles, settings, exports and system-level access." },
        { name: "Admin", description: "Manages users, imports, leads, team structure and operational CRM settings." },
        { name: "Manager", description: "Works with team leads, assignment, team metrics, approvals and follow-up." },
        { name: "Sales representative", description: "Handles assigned leads, statuses, comments, callbacks, meetings and offers." },
        { name: "Finance", description: "Reviews financing context, reports and data needed before settlement continues." },
        { name: "Viewer", description: "Read-only access for management review, audit or safe observation." },
        { name: "Accounting", description: "Works with documents, invoices, annexes and demo KSeF payloads after contract approval." },
        { name: "Logistics", description: "Coordinates orders, picking, warehouse preparation and delivery documents." },
        { name: "Installer", description: "Handles the installation stage and confirms field execution." },
      ],
      features: [
        "Supabase Auth login and demo role cards on the login screen.",
        "Role normalization, permission helpers and legacy aliases: manager to manager role, sales to sales representative.",
        "Lead ownership, statuses, comments, activity history, reminders, files, callbacks and meetings.",
        "Admin, manager, sales, calendar, calculators, import, users and lead-detail routes.",
        "CSV import, filtered export, offer/PDF-oriented calculators and print-ready offer flow.",
        "Operations route with finance, accounting, logistics and installation workflow.",
        "Safe demo tutorial that walks through sales PDF, manager check, finance, accounting, logistics and installer steps.",
        "KSeF demo package/payload preview without sending production data.",
        "Supabase SQL files for schema, RLS, policies, demo users, hierarchy and demo/production isolation.",
      ],
      stack: ["React", "TypeScript", "Next.js", "Supabase Auth", "PostgreSQL", "Tailwind CSS", "Vercel", "Vitest"],
      decisions: [
        "Supabase is used because it combines auth, PostgreSQL, policies and fast demo-friendly deployment.",
        "Role logic is centralized in role helpers and permission checks instead of being scattered through UI components.",
        "Data is read through the Supabase client and selected route handlers where server-side validation or admin operations are needed.",
        "The app separates sales work from post-contract operations through dedicated routes and role-aware home paths.",
        "Demo users and demo scope are documented so portfolio review can happen without touching real client data.",
      ],
      learned: [
        "Designing role-based workflows beyond a simple admin/user split.",
        "Working with Supabase Auth, PostgreSQL tables, RLS-oriented SQL and demo seed data.",
        "Building dashboards and dense CRM screens around real operational states.",
        "Connecting lead work with post-contract finance, accounting, logistics and installation steps.",
        "Documenting a production-like demo honestly with tests, CI, roadmap and known risks.",
      ],
      next: [
        "Add more Playwright smoke tests for login, dashboards and operations tutorial.",
        "Split the largest route components into smaller domain modules.",
        "Improve Supabase error logging, analytics and monitoring.",
        "Strengthen mobile UX for dense tables and long operational forms.",
        "Add a safe demo reset/seed script for repeatable presentations.",
      ],
      limitations:
        "B-CRM is a portfolio demo with production-like patterns. It still needs broader e2e coverage, monitoring, security review and UX hardening before real production use.",
    },
    {
      slug: "berninutri",
      title: "BerniNutri — AI meal photo analysis prototype",
      subtitle:
        "Mobile-first nutrition tracker prototype that uses an OpenAI-backed endpoint for estimated meal analysis.",
      summary:
        "BerniNutri is a prototype for reviewing AI-estimated calories and macros from meal photos, with explicit uncertainty.",
      status: "Prototype",
      liveUrl: "https://berninutri-portfolio.vercel.app",
      repoUrl: "https://github.com/ft4k696bk6-prog/berninutri-portfolio",
      problem:
        "Food analysis from a photo can be useful, but AI estimates may be incomplete or inaccurate and need a clear review flow.",
      goal:
        "Create a mobile-first prototype where a user uploads a meal photo, reviews estimated nutrition data and stores local meal history.",
      roles: [],
      features: [
        "Meal photo upload and browser-side image compression.",
        "Serverless analysis endpoint that keeps the OpenAI API key server-side.",
        "Strict JSON schema for model output.",
        "Calories, macros, ingredients, confidence and notes in the result view.",
        "Local meal history stored in browser localStorage.",
        "Sample meals, empty states and missing API key error state.",
      ],
      stack: ["React", "TypeScript", "Vite", "Vercel Functions", "OpenAI Responses API", "localStorage"],
      decisions: [
        "The API key stays server-side in the Vercel function.",
        "AI output is normalized before display instead of trusted directly.",
        "The product copy presents analysis as a helper, not dietary or medical advice.",
      ],
      learned: [
        "Designing a product flow around an AI feature instead of only a prompt.",
        "Handling structured model output and user-facing uncertainty.",
        "Managing local browser history and useful empty states.",
      ],
      next: [
        "Improve image validation and retry states.",
        "Add editable meal results before saving.",
        "Add account-based history with a real database.",
        "Improve accessibility and keyboard navigation.",
      ],
      limitations:
        "The app is not medical advice, dietary advice or a professional nutrition service. AI results should be treated as estimates.",
    },
    {
      slug: "kalkulator-leasingu",
      title: "Kalkulator leasingu — business leasing estimate tool",
      subtitle:
        "Business calculator demo for quick indicative leasing cost estimates before a finance offer conversation.",
      summary:
        "The leasing calculator separates calculation logic from UI and presents simplified business estimates responsibly.",
      status: "Production-like business tool demo",
      liveUrl: "https://kalkulator-leasingu-1-desktop.vercel.app",
      repoUrl: "https://github.com/ft4k696bk6-prog/kalkulator.leasingu-1",
      problem:
        "Business users often need a fast leasing cost estimate before they are ready for a formal financial offer.",
      goal:
        "Build a calculator that handles common leasing inputs, displays a clear result summary and can capture a lead.",
      roles: [],
      features: [
        "Asset type, net/gross value and VAT conversion.",
        "Down payment, leasing period, buyout and annual rate inputs.",
        "Simplified insurance, GAP and service estimates.",
        "Monthly net/gross rate, financed amount, installments and financing cost summary.",
        "Scenario presets, print/save-friendly result and lead endpoint.",
      ],
      stack: ["React", "TypeScript", "Vite", "Bun workspaces", "Hono", "Drizzle", "Tailwind CSS", "Vercel", "Vitest"],
      decisions: [
        "Calculation logic lives outside UI components so it can be tested directly.",
        "The formula uses a simplified annuity calculation for indicative estimates.",
        "The UI includes a financial disclaimer instead of presenting results as an offer.",
      ],
      learned: [
        "Separating business calculation logic from interface state.",
        "Designing a result summary for a practical business workflow.",
        "Writing responsible copy for indicative financial values.",
      ],
      next: [
        "Add more edge-case tests for calculation scenarios.",
        "Improve lead persistence beyond webhook forwarding.",
        "Add analytics for calculator usage.",
        "Improve accessibility of controls.",
      ],
      limitations:
        "The calculator is informational and simplified. It is not a financial offer and results may differ from real leasing proposals.",
    },
    {
      slug: "berni-rush",
      title: "Berni Rush — browser 3D arena game prototype",
      subtitle:
        "Playable side project focused on real-time interaction, game state, rendering and browser deployment.",
      summary:
        "Berni Rush is a non-business interactive project used to practice a playable loop, state and 3D rendering.",
      status: "Playable prototype / Side project",
      liveUrl: "https://bernirushdemooo.vercel.app",
      repoUrl: "https://github.com/ft4k696bk6-prog/Berni-rush-demoo",
      problem:
        "A browser game needs fast interaction, clear state handling and a playable loop rather than static screens.",
      goal:
        "Create a playable 3D arena prototype with controls, enemy waves, pickups and saved local progress.",
      roles: [],
      features: [
        "3D arena gameplay in the browser.",
        "Keyboard and touch controls.",
        "Playable class styles, skins and loadout choices.",
        "Enemy waves, elites, boss encounters, projectiles and pickups.",
        "Local progress for profile, records, wallet, class and skins.",
        "Mobile-aware rendering quality adjustments.",
      ],
      stack: ["React", "TypeScript", "Vite", "Three.js", "@react-three/fiber", "@react-three/drei", "Zustand", "Vercel"],
      decisions: [
        "Game state is separated from 3D rendering concerns.",
        "Local persistence supports a prototype loop without account infrastructure.",
        "The project is positioned honestly as a side project, not a business app.",
      ],
      learned: [
        "Managing a real-time interaction loop in a browser UI.",
        "Working with Three.js through React components.",
        "Persisting local progress and tuning browser performance.",
      ],
      next: [
        "Add onboarding for first-time players.",
        "Improve sound, feedback and enemy variety.",
        "Add screenshots or short gameplay clips.",
        "Add focused tests for pure balancing and save helpers where practical.",
      ],
      limitations:
        "This is a playable prototype and side project. It is not presented as a finished commercial game.",
    },
    {
      slug: "portfolio",
      title: "Portfolio — developer site for business web apps",
      subtitle:
        "Personal portfolio focused on technical evidence, project context, case studies and protected contact reveal.",
      summary:
        "The portfolio is structured around B-CRM as the strongest technical proof and keeps positioning specific to business web apps.",
      status: "Active development",
      liveUrl: "https://kacper-portfolio.vercel.app",
      repoUrl: "https://github.com/ft4k696bk6-prog/kacper-portfolio",
      problem:
        "A technical portfolio should help reviewers understand the strongest project quickly without vague marketing or entry-level positioning.",
      goal:
        "Build a fast portfolio that presents projects by problem, real features, stack, status and case study links.",
      roles: [],
      features: [
        "B-CRM-first project order.",
        "Technical reviewer section for companies and recruiters.",
        "Localized project cards and case studies.",
        "Custom booking calendar using Cal.com through server routes.",
        "Protected contact reveal for email and phone.",
        "SEO, OpenGraph, sitemap, robots and optional GTM.",
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Turnstile", "Cal.com API", "Vercel", "Vitest"],
      decisions: [
        "The site focuses on business web apps instead of broad freelancing copy.",
        "Direct contact details are revealed through a server route instead of rendered in the initial HTML.",
        "Booking uses a custom UI and server-side Cal.com API calls instead of an external embed.",
      ],
      learned: [
        "Positioning projects through concrete technical evidence.",
        "Building localized content structures for portfolio pages.",
        "Keeping contact and booking flows practical without exposing API keys.",
      ],
      next: [
        "Add real screenshots for every project.",
        "Add browser smoke tests for navigation, booking and contact reveal.",
        "Add analytics events through GTM after final container configuration.",
        "Review Core Web Vitals after design changes.",
      ],
      limitations:
        "The portfolio is an active project. Screenshots, browser smoke tests and analytics events still need more coverage.",
    },
  ],
};

export const plCaseStudies: CaseStudiesContent = {
  backLabel: "Wróć do portfolio",
  projectsBackLabel: "Wróć do projektów",
  eyebrow: "Studium przypadku",
  liveDemoLabel: "Demo",
  repoLabel: "GitHub",
  stackLabel: "Stack",
  notFoundTitle: "Nie znaleziono studium przypadku",
  notFoundDescription: "To studium projektu nie jest dostępne.",
  sections: {
    problem: "Problem",
    goal: "Cel projektu",
    roles: "Użytkownicy i role",
    features: "Najważniejsze funkcje",
    decisions: "Decyzje techniczne",
    learned: "Czego się nauczyłem",
    next: "Co poprawiłbym dalej",
    limitations: "Ograniczenia",
  },
  items: [
    {
      slug: "b-crm",
      title: "B-CRM — CRM do obsługi leadów i pracy sprzedażowo-operacyjnej",
      subtitle:
        "Production-like CRM demo z widokami zależnymi od ról, danymi Supabase, procesem realizacji i opisanymi ograniczeniami.",
      summary:
        "B-CRM pokazuje praktyczny przepływ aplikacji biznesowej: auth, role, leady, dashboardy, aktywności, realizację i deploy.",
      status: "Production-like CRM demo",
      liveUrl: "https://b-crm-berni.vercel.app/login",
      repoUrl: "https://github.com/ft4k696bk6-prog/B-CRM",
      problem:
        "Zespoły sprzedażowe i operacyjne potrzebują jednego miejsca na właściciela leada, statusy, callbacki, spotkania, pliki, komentarze i realizację po podpisaniu umowy.",
      goal:
        "Zbudować demo CRM, które porządkuje pracę na leadach, rozdziela widoki według ról i pokazuje przejście rekordu ze sprzedaży do realizacji.",
      roles: [
        { name: "Właściciel", description: "Pełna kontrola nad danymi CRM, rolami, ustawieniami, eksportem i dostępem systemowym." },
        { name: "Admin", description: "Zarządza użytkownikami, importem, leadami, strukturą zespołu i ustawieniami CRM." },
        { name: "Menadżer", description: "Pracuje na leadach zespołu, przypisaniach, metrykach, akceptacjach i follow-upie." },
        { name: "Handlowiec", description: "Obsługuje przypisane leady, statusy, komentarze, callbacki, spotkania i oferty." },
        { name: "Finanse", description: "Sprawdza kontekst finansowania, raporty i dane potrzebne przed dalszym rozliczeniem." },
        { name: "Podgląd", description: "Tryb tylko do odczytu dla zarządu, audytu albo bezpiecznej obserwacji." },
        { name: "Księgowość", description: "Pracuje na dokumentach, fakturach, aneksach i paczce demo KSeF po akceptacji umowy." },
        { name: "Logistyka", description: "Koordynuje zamówienia, kompletację, przygotowanie magazynu i dokumenty wydania." },
        { name: "Monter", description: "Obsługuje etap montażu i potwierdza wykonanie prac w terenie." },
      ],
      features: [
        "Logowanie Supabase Auth i karty kont demo na ekranie logowania.",
        "Normalizacja ról, helpery uprawnień oraz aliasy legacy: manager jako menadżer, sales jako handlowiec.",
        "Właściciel leada, statusy, komentarze, historia aktywności, przypomnienia, pliki, callbacki i spotkania.",
        "Widoki admina, menadżera, handlowca, kalendarza, kalkulatorów, importu, użytkowników i szczegółu leada.",
        "Import CSV, filtrowany eksport, kalkulatory ofertowe i widok oferty gotowy do druku/PDF.",
        "Ścieżka realizacji z finansami, księgowością, logistyką i montażem.",
        "Bezpieczny samouczek demo prowadzący przez PDF sprzedażowy, kontrolę menadżera, finanse, księgowość, logistykę i montaż.",
        "Podgląd paczki/payloadu KSeF w trybie demo bez wysyłania danych produkcyjnych.",
        "Pliki SQL Supabase dla schematu, RLS, polityk, kont demo, hierarchii i izolacji demo/produkcja.",
      ],
      stack: ["React", "TypeScript", "Next.js", "Supabase Auth", "PostgreSQL", "Tailwind CSS", "Vercel", "Vitest"],
      decisions: [
        "Supabase łączy auth, PostgreSQL, polityki i szybkie wdrożenie przyjazne dla demo.",
        "Logika ról jest scentralizowana w helperach ról i uprawnień zamiast rozproszona po komponentach UI.",
        "Dane są czytane przez klienta Supabase oraz wybrane route handlers tam, gdzie potrzebna jest walidacja serwerowa lub operacje admina.",
        "Aplikacja oddziela pracę sprzedaży od realizacji po umowie przez osobne trasy i home path zależny od roli.",
        "Konta demo i zakres demo są opisane, żeby review portfolio nie dotykało prawdziwych danych klientów.",
      ],
      learned: [
        "Projektowania workflow opartego o role szerszego niż prosty podział admin/użytkownik.",
        "Pracy z Supabase Auth, tabelami PostgreSQL, SQL pod RLS i seedami demo.",
        "Budowy dashboardów oraz gęstych ekranów CRM wokół realnych stanów operacyjnych.",
        "Łączenia pracy na leadach z finansami, księgowością, logistyką i montażem po podpisaniu umowy.",
        "Dokumentowania demo production-like z testami, CI, roadmapą i znanymi ryzykami.",
      ],
      next: [
        "Dodać więcej testów Playwright dla logowania, dashboardów i samouczka realizacji.",
        "Rozbić największe route components na mniejsze moduły domenowe.",
        "Poprawić logowanie błędów Supabase, analytics i monitoring.",
        "Wzmocnić mobile UX dla gęstych tabel i długich formularzy operacyjnych.",
        "Dodać bezpieczny skrypt resetu/seedowania demo do powtarzalnych prezentacji.",
      ],
      limitations:
        "B-CRM jest demo portfolio z wzorcami production-like. Przed realnym użyciem produkcyjnym wymaga szerszych testów e2e, monitoringu, przeglądu bezpieczeństwa i dopracowania UX.",
    },
    {
      slug: "berninutri",
      title: "BerniNutri — prototyp analizy posiłków AI ze zdjęcia",
      subtitle:
        "Mobile-first prototyp trackera żywieniowego, który używa endpointu z OpenAI do estymacji posiłku.",
      summary:
        "BerniNutri pozwala przejrzeć estymowane kalorie i makro ze zdjęcia posiłku, jasno pokazując niepewność wyniku.",
      status: "Prototype",
      liveUrl: "https://berninutri-portfolio.vercel.app",
      repoUrl: "https://github.com/ft4k696bk6-prog/berninutri-portfolio",
      problem:
        "Analiza jedzenia ze zdjęcia może pomagać, ale estymacje AI bywają niepełne lub niedokładne i wymagają jasnego przepływu review.",
      goal:
        "Zbudować mobile-first prototyp, w którym użytkownik wrzuca zdjęcie posiłku, przegląda estymację i zapisuje lokalną historię.",
      roles: [],
      features: [
        "Upload zdjęcia posiłku i kompresja obrazu po stronie przeglądarki.",
        "Endpoint serverless, który trzyma klucz OpenAI po stronie serwera.",
        "Ścisły schemat JSON dla odpowiedzi modelu.",
        "Kalorie, makro, składniki, poziom pewności i notatki w widoku wyniku.",
        "Lokalna historia posiłków zapisywana w localStorage.",
        "Przykładowe posiłki, empty states i komunikat braku konfiguracji API.",
      ],
      stack: ["React", "TypeScript", "Vite", "Vercel Functions", "OpenAI Responses API", "localStorage"],
      decisions: [
        "Klucz API zostaje po stronie serwera w funkcji Vercel.",
        "Wynik AI jest normalizowany przed pokazaniem użytkownikowi.",
        "Copy przedstawia analizę jako pomocniczą estymację, nie poradę dietetyczną ani medyczną.",
      ],
      learned: [
        "Projektowania przepływu produktu wokół funkcji AI, a nie samego promptu.",
        "Obsługi ustrukturyzowanej odpowiedzi modelu i komunikowania niepewności.",
        "Zarządzania lokalną historią w przeglądarce oraz użytecznymi empty states.",
      ],
      next: [
        "Poprawić walidację obrazów i stany ponowienia analizy.",
        "Dodać edycję wyniku przed zapisem.",
        "Dodać historię kont użytkowników z realną bazą danych.",
        "Poprawić dostępność i obsługę klawiatury.",
      ],
      limitations:
        "Aplikacja nie jest poradą medyczną, dietetyczną ani profesjonalną usługą żywieniową. Wyniki AI są estymacją.",
    },
    {
      slug: "kalkulator-leasingu",
      title: "Kalkulator leasingu — narzędzie do estymacji kosztu leasingu",
      subtitle:
        "Demo kalkulatora biznesowego do szybkiej orientacyjnej estymacji przed rozmową o ofercie finansowej.",
      summary:
        "Kalkulator leasingu oddziela logikę obliczeń od UI i odpowiedzialnie pokazuje uproszczone estymacje biznesowe.",
      status: "Production-like business tool demo",
      liveUrl: "https://kalkulator-leasingu-1-desktop.vercel.app",
      repoUrl: "https://github.com/ft4k696bk6-prog/kalkulator.leasingu-1",
      problem:
        "Użytkownicy biznesowi często potrzebują szybkiej estymacji kosztu leasingu zanim przejdą do formalnej oferty finansowej.",
      goal:
        "Zbudować kalkulator obsługujący typowe parametry leasingu, czytelne podsumowanie wyniku i prosty przepływ leadowy.",
      roles: [],
      features: [
        "Typ przedmiotu, wartość netto/brutto i konwersja VAT.",
        "Wpłata własna, okres leasingu, wykup i roczna stopa.",
        "Uproszczone szacunki ubezpieczenia, GAP i serwisu.",
        "Rata netto/brutto, kwota finansowana, suma rat i koszt finansowania.",
        "Presety scenariuszy, wynik przyjazny do druku/zapisu i endpoint leadowy.",
      ],
      stack: ["React", "TypeScript", "Vite", "Bun workspaces", "Hono", "Drizzle", "Tailwind CSS", "Vercel", "Vitest"],
      decisions: [
        "Logika obliczeń jest poza komponentami UI, dzięki czemu można ją testować bez renderowania interfejsu.",
        "Formuła używa uproszczonego obliczenia annuitetowego dla orientacyjnych estymacji.",
        "UI zawiera disclaimer finansowy zamiast przedstawiać wynik jako ofertę.",
      ],
      learned: [
        "Oddzielania logiki biznesowych obliczeń od stanu interfejsu.",
        "Projektowania podsumowania wyniku dla praktycznego workflow biznesowego.",
        "Pisania odpowiedzialnego copy dla orientacyjnych wartości finansowych.",
      ],
      next: [
        "Dodać więcej testów scenariuszy i edge case obliczeń.",
        "Poprawić zapis leadów poza samym forwardingiem webhooka.",
        "Dodać analytics użycia kalkulatora.",
        "Poprawić dostępność kontrolek formularza.",
      ],
      limitations:
        "Kalkulator ma charakter informacyjny i uproszczony. Nie jest ofertą finansową, a wyniki mogą różnić się od realnych propozycji leasingowych.",
    },
    {
      slug: "berni-rush",
      title: "Berni Rush — prototyp gry 3D w przeglądarce",
      subtitle:
        "Grywalny side project skupiony na interakcji real-time, stanie gry, renderingu i deployu w przeglądarce.",
      summary:
        "Berni Rush to projekt interaktywny, niebiznesowy: ćwiczenie grywalnej pętli, stanu i renderingu 3D.",
      status: "Playable prototype / Side project",
      liveUrl: "https://bernirushdemooo.vercel.app",
      repoUrl: "https://github.com/ft4k696bk6-prog/Berni-rush-demoo",
      problem:
        "Gra webowa wymaga szybkiej interakcji, jasnego zarządzania stanem i grywalnej pętli, a nie statycznych ekranów.",
      goal:
        "Zbudować grywalny prototyp areny 3D ze sterowaniem, falami przeciwników, pickupami i lokalnym zapisem progresu.",
      roles: [],
      features: [
        "Rozgrywka na arenie 3D w przeglądarce.",
        "Sterowanie klawiaturą i dotykiem.",
        "Style klas, skórki i wybór loadoutu.",
        "Fale przeciwników, elity, bossowie, pociski i pickupy.",
        "Lokalny progres profilu, rekordów, monet, klasy i skórek.",
        "Dostosowanie jakości renderowania do urządzeń mobilnych.",
      ],
      stack: ["React", "TypeScript", "Vite", "Three.js", "@react-three/fiber", "@react-three/drei", "Zustand", "Vercel"],
      decisions: [
        "Stan gry jest oddzielony od warstwy renderowania 3D.",
        "Lokalny zapis pozwala utrzymać pętlę prototypu bez infrastruktury kont.",
        "Projekt jest uczciwie pozycjonowany jako side project, nie aplikacja biznesowa.",
      ],
      learned: [
        "Zarządzania pętlą interakcji real-time w UI przeglądarkowym.",
        "Pracy z Three.js przez komponenty React.",
        "Zapisu lokalnego progresu i strojenia wydajności w przeglądarce.",
      ],
      next: [
        "Dodać onboarding dla pierwszego uruchomienia.",
        "Poprawić dźwięk, feedback i różnorodność przeciwników.",
        "Dodać screenshoty albo krótkie klipy gameplayu.",
        "Dodać testy czystych helperów balansu i zapisu, gdzie ma to sens.",
      ],
      limitations:
        "To grywalny prototyp i side project. Nie jest przedstawiany jako skończona gra komercyjna.",
    },
    {
      slug: "portfolio",
      title: "Portfolio — strona developera od aplikacji biznesowych",
      subtitle:
        "Osobiste portfolio skupione na dowodach technicznych, kontekście projektów, studiach przypadku i chronionym odsłanianiu kontaktu.",
      summary:
        "Portfolio jest zbudowane wokół B-CRM jako najmocniejszego dowodu technicznego i jasno komunikuje specjalizację w aplikacjach biznesowych.",
      status: "Active development",
      liveUrl: "https://kacper-portfolio.vercel.app",
      repoUrl: "https://github.com/ft4k696bk6-prog/kacper-portfolio",
      problem:
        "Portfolio techniczne powinno szybko pokazać najmocniejszy projekt bez ogólnikowego marketingu i bez pozycjonowania wejściowego.",
      goal:
        "Zbudować szybką stronę, która prezentuje projekty przez problem, realne funkcje, stack, status i linki do studiów przypadku.",
      roles: [],
      features: [
        "Kolejność projektów z B-CRM jako priorytetem.",
        "Sekcja dla firm i osób technicznych.",
        "Zlokalizowane karty projektów i studia przypadku.",
        "Własny kalendarz rezerwacji używający Cal.com przez route handlers.",
        "Chronione odsłanianie emaila i telefonu.",
        "SEO, OpenGraph, sitemap, robots i opcjonalny GTM.",
      ],
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Turnstile", "Cal.com API", "Vercel", "Vitest"],
      decisions: [
        "Strona skupia się na aplikacjach biznesowych zamiast szerokiego copy freelancerskiego.",
        "Dane kontaktowe są odsłaniane przez route serwerowy zamiast renderowania w początkowym HTML.",
        "Rezerwacja używa własnego UI i serwerowych wywołań Cal.com zamiast zewnętrznego embedu.",
      ],
      learned: [
        "Pozycjonowania projektów przez konkretne dowody techniczne.",
        "Budowy lokalizowanej struktury treści dla stron portfolio.",
        "Utrzymania praktycznego kontaktu i rezerwacji bez ujawniania kluczy API.",
      ],
      next: [
        "Dodać realne screenshoty każdego projektu.",
        "Dodać testy przeglądarkowe dla nawigacji, rezerwacji i odsłaniania kontaktu.",
        "Dodać eventy analytics przez GTM po finalnej konfiguracji kontenera.",
        "Sprawdzić Core Web Vitals po zmianach layoutu.",
      ],
      limitations:
        "Portfolio jest aktywnie rozwijane. Screenshoty, testy przeglądarkowe i eventy analytics nadal wymagają szerszego pokrycia.",
    },
  ],
};
