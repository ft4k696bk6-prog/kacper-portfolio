export type WorldLocale = "pl" | "en" | "uk";
export type Zone = "hq" | "gallery" | "studio" | "lab" | "contact";
export type Point = readonly [number, number, number];

export const worldPaths = { pl: "/world", en: "/en/world", uk: "/uk/world" } as const;
export const classicPaths = { pl: "/", en: "/en", uk: "/uk" } as const;
export const contactPaths = { pl: "/kontakt", en: "/en/contact", uk: "/uk/kontakty" } as const;
export const worldPreferenceKey = "bernecki-experience";

export const zones = [
  { id: "hq", marker: [-8.8, 5.2, -4.7], target: [-7.2, 2.1, -5.2], angle: [0.66, 1.15, 22], labelSide: "left" },
  { id: "gallery", marker: [7.3, 3.65, 2.8], target: [7.3, 1.95, 2.85], angle: [0.24, 1.17, 18], labelSide: "right" },
  { id: "studio", marker: [-8.65, 3.35, 6.13], target: [-8.1, 1.25, 5.55], angle: [0.58, 1.15, 21], labelSide: "left" },
  { id: "lab", marker: [7.4, 4.85, -6.1], target: [7.65, 1.7, -5.9], angle: [0.75, 1.15, 22], labelSide: "right" },
  { id: "contact", marker: [6, 2.7, 9.0], target: [6, 1.05, 8.55], angle: [0.54, 1.28, 15], labelSide: "right" },
] as const satisfies ReadonlyArray<{ id: Zone; marker: Point; target: Point; angle: Point; labelSide: "left" | "right" }>;

type ProjectCopy = readonly [description: string, features: readonly string[]];
type Project = {
  name: string;
  id: string;
  images: readonly string[];
  site: string;
  caseStudy: Partial<Record<WorldLocale, string>>;
  stack?: readonly string[];
  copy: Record<WorldLocale, ProjectCopy>;
};

// Existing portfolio captures and documented project scope, curated for the exhibition.
export const projects: readonly Project[] = [
  {
    id: "starcars", name: "StarCars Import",
    images: ["starcars-live-current.jpg", "starcars-live-2.jpg", "starcars-live-3.jpg"],
    site: "https://star-cars.us",
    caseStudy: { pl: "/case-studies/starcars" },
    stack: ["React", "TypeScript", "Vite", "Three.js", "GSAP", "NBP API"],
    copy: {
      pl: ["Strona firmy sprowadzającej auta z USA i Kanady. Kalkulator pozwala oszacować koszty importu przed wysłaniem zapytania.", ["Kalkulator kosztów importu", "Prezentacja procesu sprowadzenia auta", "Formularze zapytań"]],
      en: ["A website for a company importing vehicles from the US and Canada. Its calculator estimates the landed cost before a customer sends an enquiry.", ["Import-cost calculator", "Guide to the import process", "Enquiry forms"]],
      uk: ["Сайт компанії, що імпортує автомобілі зі США й Канади. Калькулятор дає змогу оцінити витрати до надсилання запиту.", ["Калькулятор вартості імпорту", "Опис процесу імпорту", "Форми для запитів"]],
    },
  },
  {
    id: "b-crm", name: "B-CRM",
    images: ["bcrm-admin-dashboard.jpg", "bcrm-realization-tutorial.jpg"],
    site: "https://demo-crm.bernecki.dev/login",
    caseStudy: { pl: "/case-studies/b-crm" },
    stack: ["Next.js", "TypeScript", "Supabase"],
    copy: {
      pl: ["Demo autorskiego CRM pokazuje, jak lead przechodzi przez kolejne etapy sprzedaży i trafia do zespołu realizacji.", ["Widoki dopasowane do ról", "Leady, przypomnienia i zadania", "Przekazanie sprawy do realizacji"]],
      en: ["This custom CRM demo shows how a lead moves through sales and into the operations team’s workflow.", ["Role-based views", "Leads, reminders and tasks", "Sales-to-operations handoff"]],
      uk: ["Демонстрація власної CRM показує, як потенційний клієнт проходить етапи продажу, а його заявка потрапляє до команди виконання.", ["Інтерфейси за ролями", "Ліди, нагадування й завдання", "Передавання замовлення у виконання"]],
    },
  },
  {
    id: "isto-kebab", name: "Isto Kebab",
    images: ["isto-live-nov08.jpg"],
    site: "https://isto.bernecki.dev",
    caseStudy: { pl: "/realizacje/isto-kebab-strona", en: "/en/projects/isto-kebab-strona" },
    copy: {
      pl: ["Witryna restauracji w Jabłonce z mobilnym menu i procesem składania zamówień.", ["Menu dopasowane do telefonu", "Wybór pozycji i wariantów", "Obsługa zamówień"]],
      en: ["A website for a restaurant in Jabłonka, built around a mobile-friendly menu and an ordering workflow.", ["Mobile-friendly menu", "Items and variant selection", "Order handling"]],
      uk: ["Сайт ресторану в Яблонці з меню для мобільних пристроїв і можливістю оформлення замовлення.", ["Адаптивне меню", "Вибір страв і варіантів", "Оброблення замовлень"]],
    },
  },
  {
    id: "motomizer", name: "Motomizer",
    images: ["motomizer-live.jpg", "motomizer-live-2.jpg", "motomizer-live-3.jpg"],
    site: "https://motomizer.pl",
    caseStudy: { pl: "/case-studies/motomizer" },
    stack: ["HTML", "CSS", "JavaScript"],
    copy: {
      pl: ["Dwujęzyczna strona produktowa z interaktywną prezentacją funkcji Motomizera.", ["Galeria wariantów", "Prezentacja funkcji", "Zapytania o dostępność"]],
      en: ["A bilingual product site with an interactive presentation of Motomizer’s features.", ["Variant galleries", "Interactive feature presentation", "Availability enquiries"]],
      uk: ["Двомовний сайт продукту з інтерактивною демонстрацією можливостей Motomizer.", ["Галерея варіантів", "Демонстрація функцій", "Запити щодо наявності"]],
    },
  },
  {
    id: "beatmarket", name: "BeatMarket",
    images: ["beatmarket-live.jpg", "beatmarket-live-2.jpg", "beatmarket-live-3.jpg"],
    site: "https://beatmarket.bernecki.dev",
    caseStudy: { pl: "/case-studies/beatmarket" },
    stack: ["Next.js", "React", "JavaScript", "Supabase", "PostgreSQL"],
    copy: {
      pl: ["Platforma do odkrywania beatów i prezentacji producentów, z odsłuchem bezpośrednio w przeglądarce.", ["Odsłuch beatów", "Profile producentów", "Przeglądanie gatunków i wariantów licencji"]],
      en: ["A beat discovery marketplace with producer profiles and in-browser previews.", ["Beat previews", "Producer profiles", "Browsing genres and licensing options"]],
      uk: ["Майданчик для пошуку бітів із профілями продюсерів і прослуховуванням у браузері.", ["Прослуховування бітів", "Профілі продюсерів", "Пошук за жанрами й перегляд різних ліцензій"]],
    },
  },
];

type PlaceCopy = { title: string; short: string; eyebrow: string; text: string; links?: ReadonlyArray<readonly [string, string]> };
type Labels = {
  description: string; enter: string; explore: string; overview: string; classic: string; interactive: string;
  switch: string; classicBlurb: string; worldBlurb: string; chooserTitle: string; contact: string; language: string;
  places: string; rotate: string; zoom: string; zoomIn: string; zoomOut: string; reset: string; help: string;
  touch: string; close: string; keyboard: string; gallery: string; projectImage: string;
  prev: string; next: string; prevPhoto: string; nextPhoto: string; live: string; caseStudy: string; features: string; stack: string;
  loading: string; fallback: string; staticView: string; world3d: string; scene: string; photo: string; mail: string;
  portrait: string;
  zones: Record<Zone, PlaceCopy>;
};

export const copy: Record<WorldLocale, Labels> = {
  pl: {
    description: "Mały świat, w którym powstają strony, aplikacje i automatyzacje.",
    enter: "Odkryj świat", explore: "Interaktywne portfolio 3D", overview: "Przegląd",
    classic: "Klasyczna strona", interactive: "Świat 3D", switch: "Zmień tryb",
    classicBlurb: "Oferta, ceny i realizacje w klasycznej wersji serwisu.",
    worldBlurb: "Odwiedź studio i zobacz realizacje w interaktywnej makiecie.",
    chooserTitle: "Wybierz tryb portfolio", contact: "Kontakt", language: "Język",
    places: "Mapa świata", rotate: "Przeciągnij, aby obrócić", zoom: "Przewiń, aby przybliżyć", zoomIn: "Przybliż", zoomOut: "Oddal",
    reset: "Resetuj kamerę", help: "Sterowanie", touch: "Przeciągnij lub rozsuń palce", close: "Zamknij",
    keyboard: "Strzałki obracają kamerę. + i − zmieniają zbliżenie. 0 resetuje widok, a 1–5 otwiera miejsca. W, A, S i D poruszają postacią na placu.",
    gallery: "Wybierz projekt", projectImage: "Zrzut ekranu projektu", prev: "Poprzedni projekt", next: "Następny projekt",
    prevPhoto: "Poprzedni zrzut", nextPhoto: "Następny zrzut", live: "Otwórz projekt", caseStudy: "Opis realizacji", features: "Funkcje", stack: "Technologie",
    loading: "Ładowanie sceny 3D", fallback: "Widok statyczny. Wszystkie miejsca możesz otworzyć z mapy.",
    staticView: "Widok statyczny", world3d: "Scena 3D", scene: "Interaktywna makieta studia Bernecki.dev", photo: "Otwórz zrzut ekranu", mail: "Napisz e-mail",
    portrait: "Kacper Bernecki",
    zones: {
      hq: { title: "Centrala", short: "Centrala", eyebrow: "Kacper Bernecki", text: "Tworzę strony, CRM i aplikacje webowe. Pomagam też łączyć narzędzia, automatyzować obsługę klientów i rozwijać sprzedaż. Możesz pracować ze mną bezpośrednio, od ustalenia zakresu po wdrożenie.", links: [["O współpracy", "/partner-w-rozwoju-biznesu"], ["LinkedIn", "https://www.linkedin.com/in/kacper-bernecki/"]] },
      gallery: { title: "Galeria projektów", short: "Projekty", eyebrow: "Wybrane realizacje", text: "Zobacz działające strony i aplikacje. Wybierz ekran lub projekt z listy." },
      studio: { title: "Studio deweloperskie", short: "Studio", eyebrow: "Strony i aplikacje", text: "Strony firmowe, landing pages i aplikacje webowe dopasowane do tego, jak działa Twoja firma. Zakres może obejmować projekt, integracje i wdrożenie.", links: [["Strony i landing pages", "/tworzenie-stron-internetowych"], ["Aplikacje webowe i CRM", "/crm-i-aplikacje-webowe"], ["Pakiety", "/pakiety"], ["Cennik", "/cennik"]] },
      lab: { title: "Laboratorium AI", short: "Lab AI", eyebrow: "AI i automatyzacja", text: "Łączę CRM, formularze i systemy przez API. Automatyzuję przekazywanie leadów, obsługę zapytań i powtarzalne zadania. Wdrażam narzędzia AI tam, gdzie usprawniają pracę zespołu.", links: [["Wdrożenia AI", "/wdrozenia-ai-dla-firm"], ["Automatyzacje", "/automatyzacja-leadow-i-sprzedazy"], ["Integracje API", "/oferta/integracje-api"]] },
      contact: { title: "Porozmawiajmy", short: "Kontakt", eyebrow: "Kontakt", text: "Opowiedz mi o projekcie, który chcesz zrealizować. Możesz napisać bezpośrednio lub skorzystać z formularza i kalendarza na stronie kontaktowej." },
    },
  },
  en: {
    description: "A small world for building websites, software and automations.",
    enter: "Explore the world", explore: "Interactive 3D portfolio", overview: "Overview",
    classic: "Classic site", interactive: "3D world", switch: "Switch mode",
    classicBlurb: "Services, pricing and case studies in the classic portfolio.",
    worldBlurb: "Visit the studio and explore real projects in an interactive model.",
    chooserTitle: "Choose your experience", contact: "Contact", language: "Language",
    places: "World map", rotate: "Drag to rotate", zoom: "Scroll to zoom", zoomIn: "Zoom in", zoomOut: "Zoom out",
    reset: "Reset camera", help: "Controls", touch: "Drag or pinch to explore", close: "Close",
    keyboard: "Use the arrow keys to rotate, + and − to zoom, 0 to reset and 1–5 to open a place. W, A, S and D move the figure around the courtyard.",
    gallery: "Choose a project", projectImage: "Project screenshot", prev: "Previous project", next: "Next project",
    prevPhoto: "Previous screenshot", nextPhoto: "Next screenshot", live: "Open project", caseStudy: "Case study", features: "Features", stack: "Technologies",
    loading: "Loading the 3D scene", fallback: "Static view. You can still open every location from the map.",
    staticView: "Static view", world3d: "3D scene", scene: "Interactive scale model of the Bernecki.dev studio", photo: "Open screenshot", mail: "Send an email",
    portrait: "Kacper Bernecki",
    zones: {
      hq: { title: "Headquarters", short: "Headquarters", eyebrow: "Kacper Bernecki", text: "I build websites, CRM systems and web applications. I also connect tools, automate customer workflows and support sales. You can work with me directly, from scoping through deployment.", links: [["Working together", "/en/business"], ["LinkedIn", "https://www.linkedin.com/in/kacper-bernecki/"]] },
      gallery: { title: "Project Gallery", short: "Project Gallery", eyebrow: "Selected work", text: "See real websites and applications. Select a screen or choose a project from the list." },
      studio: { title: "Development Studio", short: "Dev Studio", eyebrow: "Websites and apps", text: "Company websites, landing pages and web applications built around your business. The scope can cover design, integrations and deployment.", links: [["Websites and landing pages", "/en/services/websites"], ["Web applications and CRM", "/en/services/crm"], ["Packages", "/en/packages"], ["Pricing", "/en/pricing"]] },
      lab: { title: "AI & Automation Lab", short: "AI Lab", eyebrow: "AI and automation", text: "I connect CRMs, forms and other systems through APIs. I automate lead handoffs, enquiries and repetitive tasks, and introduce AI where it improves the team’s work.", links: [["AI and automation", "/en/services/automation"], ["CRM and integrations", "/en/services/crm"]] },
      contact: { title: "Let’s talk", short: "Contact", eyebrow: "Contact", text: "Tell me what you’d like to build. Email me directly or use the enquiry form and booking calendar on the contact page." },
    },
  },
  uk: {
    description: "Маленький світ, де створюються сайти, застосунки й автоматизації.",
    enter: "Дослідити світ", explore: "Інтерактивне 3D-портфоліо", overview: "Огляд",
    classic: "Класичний сайт", interactive: "Світ 3D", switch: "Змінити режим",
    classicBlurb: "Послуги, ціни та реалізовані проєкти.",
    worldBlurb: "Відвідайте студію та перегляньте проєкти в інтерактивному макеті.",
    chooserTitle: "Оберіть режим портфоліо", contact: "Контакт", language: "Мова",
    places: "Мапа світу", rotate: "Перетягніть, щоб повернути", zoom: "Прокрутіть, щоб наблизити", zoomIn: "Наблизити", zoomOut: "Віддалити",
    reset: "Скинути камеру", help: "Керування", touch: "Перетягніть або розведіть пальці", close: "Закрити",
    keyboard: "Стрілки повертають камеру, + і − змінюють масштаб, 0 скидає вигляд, а 1–5 відкривають локації. Клавіші W, A, S і D переміщують фігурку подвір’ям.",
    gallery: "Оберіть проєкт", projectImage: "Знімок екрана проєкту", prev: "Попередній проєкт", next: "Наступний проєкт",
    prevPhoto: "Попередній знімок", nextPhoto: "Наступний знімок", live: "Відкрити проєкт", caseStudy: "Опис проєкту", features: "Функції", stack: "Технології",
    loading: "Завантаження 3D-сцени", fallback: "Статичний вигляд. Усі локації доступні на мапі.",
    staticView: "Статичний вигляд", world3d: "3D-сцена", scene: "Інтерактивний макет студії Bernecki.dev", photo: "Відкрити знімок екрана", mail: "Написати листа",
    portrait: "Кацпер Бернецький",
    zones: {
      hq: { title: "Штаб-квартира", short: "Штаб-квартира", eyebrow: "Кацпер Бернецький", text: "Створюю сайти, CRM і вебзастосунки. Інтегрую інструменти, автоматизую роботу із клієнтами та допомагаю розвивати продажі. Працюю з вами напряму від визначення обсягу до запуску.", links: [["Обговорити співпрацю", "/uk/kontakty"], ["LinkedIn", "https://www.linkedin.com/in/kacper-bernecki/"]] },
      gallery: { title: "Галерея проєктів", short: "Проєкти", eyebrow: "Вибрані роботи", text: "Перегляньте реальні сайти й застосунки. Оберіть екран або проєкт зі списку." },
      studio: { title: "Студія розробки", short: "Студія", eyebrow: "Сайти та застосунки", text: "Корпоративні сайти, лендинги та вебзастосунки, розроблені з урахуванням того, як працює ваш бізнес. Можу допомогти з дизайном, інтеграціями й запуском.", links: [["Сайти та лендинги", "/uk/stvorennia-saitiv"], ["Вебзастосунки й CRM", "/uk/crm-dlia-biznesu"], ["Ціни", "/uk/tsiny"]] },
      lab: { title: "Лабораторія ШІ", short: "Лаб. ШІ", eyebrow: "ШІ та автоматизація", text: "З’єдную CRM, форми та інші системи через API. Автоматизую передавання лідів, роботу із запитами й повторювані завдання. Впроваджую ШІ там, де він полегшує роботу команди.", links: [["Автоматизація бізнесу", "/uk/avtomatyzatsiia-biznesu"], ["CRM та інтеграції", "/uk/crm-dlia-biznesu"]] },
      contact: { title: "Поговорімо", short: "Контакт", eyebrow: "Контакт", text: "Розкажіть про проєкт, який хочете реалізувати. Напишіть мені напряму або скористайтеся формою на сторінці контактів." },
    },
  },
};
