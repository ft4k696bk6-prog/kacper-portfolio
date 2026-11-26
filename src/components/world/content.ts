export type WorldLocale = "pl" | "en" | "uk";
export type Zone = "hq" | "gallery" | "studio" | "lab" | "contact";
export type Point = readonly [number, number, number];

export const worldPaths = { pl: "/world", en: "/en/world", uk: "/uk/world" } as const;
export const classicPaths = { pl: "/", en: "/en", uk: "/uk" } as const;
export const contactPaths = { pl: "/kontakt", en: "/en/contact", uk: "/uk/kontakty" } as const;
export const worldPreferenceKey = "bernecki-experience";

type CameraStop = { marker: Point; target: Point; labelSide: "left" | "right" };

export const zones = [
  { id: "hq", marker: [0, 2.27, 0.23], target: [0.09, 0.80, -0.13], labelSide: "right" },
  { id: "gallery", marker: [0, 0, 0], target: [0.1, 1.2, 0], labelSide: "right" },
  { id: "studio", marker: [-1.9, 2.0, -4.2], target: [-1.9, 1.1, -4.2], labelSide: "left" },
  { id: "lab", marker: [5.55, 5.55, -8.3], target: [5.1, 2.4, -7.8], labelSide: "right" },
  { id: "contact", marker: [0, 0, 0], target: [0.10, 1.05, -0.13], labelSide: "right" },
] as const satisfies ReadonlyArray<CameraStop & { id: Zone }>;

export const projectStops = {
  "jalapeno": { marker: [0, 3, 0], target: [0, 1, 0], labelSide: "right" },
  "starcars": { marker: [7.15, 1.52, 6.5], target: [6.35, 0.8, 5.95], labelSide: "right" },
  "b-crm": { marker: [-9.9, 4.05, 0.85], target: [-9.6, 1.9, 0.0], labelSide: "left" },
  "isto-kebab": { marker: [-5.0, 3.4, 8.15], target: [-5.1, 1.25, 8.2], labelSide: "left" },
  "reenergy": { marker: [-7.6, 3.78, -7.2], target: [-7.9, 1.6, -7.2], labelSide: "left" },
  "motomizer": { marker: [10.4, 2.65, -0.7], target: [10.45, 1.2, -0.1], labelSide: "right" },
  "beatmarket": { marker: [1.25, 2.7, -3.1], target: [1.45, 1.1, -2.9], labelSide: "right" },
} as const satisfies Record<string, CameraStop>;

export type ProjectId = keyof typeof projectStops;
export type StopId = Zone | ProjectId;

type ProjectCopy = readonly [description: string, features: readonly string[]];
type Project = {
  name: string;
  id: ProjectId;
  images: readonly string[];
  site?: string;
  caseStudy: Partial<Record<WorldLocale, string>>;
  stack?: readonly string[];
  links?: Partial<Record<WorldLocale, ReadonlyArray<readonly [string, string]>>>;
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
    id: "reenergy", name: "ReEnergy System",
    images: ["reenergy-website-live.jpg", "reenergy-campaign-results.jpg", "reenergy-crm-chapter.jpg"],
    site: "https://re-energysystem.pl/",
    caseStudy: { pl: "/realizacje/reenergy-strona", en: "/en/projects/reenergy-strona" },
    links: {
      pl: [["Kampanie Meta Ads", "/case-studies/re-energy-meta-ads"], ["CRM i obsługa leadów", "/realizacje/reenergy-crm"]],
      en: [["Meta Ads campaigns", "/en/case-studies/re-energy-meta-ads"], ["CRM and lead workflows", "/en/projects/reenergy-crm"]],
    },
    copy: {
      pl: ["Dla firmy z branży OZE stworzyłem stronę firmową, prowadziłem kampanie Meta Ads i wdrożyłem CRM do obsługi kontaktów z reklam.", ["Strona prezentująca ofertę OZE", "Kampanie pozyskujące klientów i pracowników", "CRM porządkujący przekazywanie i obsługę leadów"]],
      en: ["For this renewable energy company I built the website, ran Meta Ads campaigns, and implemented a CRM for enquiries generated by the ads.", ["Website for renewable energy services", "Campaigns for customer acquisition and recruitment", "CRM for lead handoff and follow-up"]],
      uk: ["Для компанії з відновлюваної енергетики я створив сайт, проводив кампанії Meta Ads і впровадив CRM для опрацювання заявок із реклами.", ["Сайт з послугами відновлюваної енергетики", "Кампанії для залучення клієнтів і працівників", "CRM для передавання й опрацювання заявок"]],
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
  {
    id: "jalapeno", name: "Jalapeno Kebab",
    images: ["jalapeno-campaign-results.jpg"],
    caseStudy: { pl: "/realizacje/jalapeno-marketing", en: "/en/projects/jalapeno-marketing" },
    stack: ["Meta Ads"],
    copy: {
      pl: ["Komunikacja i kampanie Meta Ads dla restauracji w Niemcach, kierowane do lokalnej społeczności.", ["Prowadzenie komunikacji w social media", "Kampanie rozpoznawalności i interakcji", "Docieranie do gości w Niemcach i okolicach"]],
      en: ["Social media and Meta Ads for a restaurant in Niemce, focused on reaching its local community.", ["Social media communication", "Awareness and engagement campaigns", "Reaching customers in Niemce and nearby towns"]],
      uk: ["Комунікація в соцмережах і рекламі Meta для ресторану в Нємце з акцентом на місцеву громаду.", ["Комунікація в соцмережах", "Кампанії впізнаваності та залучення", "Охоплення гостей у Нємце та сусідніх містах"]],
    },
  },
];

export const projectIndex = (id: ProjectId) => projects.findIndex(project => project.id === id);

export const sceneStops = [
  ...zones.filter(zone => zone.id === "hq"),
];

export const mapStops = ["reenergy", "starcars", "isto-kebab", "b-crm", "lab", "motomizer", "beatmarket", "hq", "jalapeno", "gallery", "studio", "contact"] as const satisfies readonly StopId[];

export const worldEditorial = {
  pl: {
    atlas: "Eksploruj układ",
    projects: "Zobacz realizacje",
    lead: "Strony, aplikacje i automatyzacje. Każda realizacja ma tu własną planetę.",
    index: "Atlas projektów",
    commission: "Realizacja",
    return: "Wróć do planety",
    gallery: "Wybierz realizację, by zobaczyć opis, zrzuty i link do projektu.",
  },
  en: {
    atlas: "Explore the system",
    projects: "View the work",
    lead: "Websites, applications and automation. Each project has a planet of its own.",
    index: "Project atlas",
    commission: "Project",
    return: "Back to the planet",
    gallery: "Choose a project to see its story, screenshots and link.",
  },
  uk: {
    atlas: "Досліджуйте систему",
    projects: "Переглянути роботи",
    lead: "Сайти, застосунки й автоматизація. Кожен проєкт має власну планету.",
    index: "Атлас проєктів",
    commission: "Проєкт",
    return: "Назад до планети",
    gallery: "Оберіть проєкт, щоб переглянути опис, знімки екрана й посилання.",
  },
} as const satisfies Record<WorldLocale, Record<string, string>>;

type PlaceCopy = { title: string; short: string; eyebrow: string; text: string; links?: ReadonlyArray<readonly [string, string]> };
type Labels = {
  description: string; enter: string; explore: string; overview: string; classic: string; interactive: string;
  switch: string; classicBlurb: string; worldBlurb: string; chooserTitle: string; contact: string; language: string;
  menu: string; places: string; rotate: string; rotateLeft: string; rotateRight: string; reset: string; help: string;
  touch: string; close: string; keyboard: string; gallery: string; projectImage: string;
  prev: string; next: string; prevPhoto: string; nextPhoto: string; live: string; caseStudy: string; features: string; stack: string;
  loading: string; fallback: string; staticView: string; world3d: string; scene: string; photo: string; mail: string;
  portrait: string; credits: string;
  zones: Record<Zone, PlaceCopy>;
};

export const copy: Record<WorldLocale, Labels> = {
  pl: {
    description: "Odkryj Bernecki Universe, interaktywne portfolio 3D. Każdy projekt ma własną planetę z autonomicznym życiem i sekretami.",
    enter: "Zobacz projekty", explore: "Interaktywne portfolio 3D", overview: "Przegląd",
    classic: "Klasyczne portfolio", interactive: "Odkryj uniwersum", switch: "Zmień tryb",
    classicBlurb: "Oferta, ceny i realizacje w klasycznej wersji serwisu.",
    worldBlurb: "Odwiedź żyjące planety, z których każda przedstawia inny projekt.",
    chooserTitle: "Wybierz tryb portfolio", contact: "Kontakt", language: "Język",
    menu: "Menu", places: "Miejsca", rotate: "Przeciągnij, aby obrócić", rotateLeft: "Obróć w lewo", rotateRight: "Obróć w prawo",
    reset: "Resetuj kamerę", help: "Sterowanie", touch: "Przeciągnij palcem, aby obrócić", close: "Zamknij",
    keyboard: "Strzałki obracają planetę. 0 przywraca przegląd, a klawisze od 1 do 8 otwierają miejsca z bliska. G otwiera mapę układu.",
    gallery: "Wybierz projekt", projectImage: "Zrzut ekranu projektu", prev: "Poprzedni projekt", next: "Następny projekt",
    prevPhoto: "Poprzedni zrzut", nextPhoto: "Następny zrzut", live: "Otwórz projekt", caseStudy: "Opis realizacji", features: "Funkcje", stack: "Technologie",
    loading: "Ładowanie sceny 3D", fallback: "Widok statyczny. Wszystkie miejsca możesz otworzyć z menu.",
    staticView: "Widok statyczny", world3d: "Scena 3D", scene: "Interaktywna planeta projektów Bernecki.dev", photo: "Otwórz zrzut ekranu", mail: "Napisz e-mail",
    portrait: "Pluszowa postać Kacpra Berneckiego", credits: "Źródła zasobów 3D",
    zones: {
      hq: { title: "Kacper Bernecki", short: "Kacper", eyebrow: "Kacper Bernecki", text: "Tworzę strony, CRM i aplikacje webowe. Pomagam też łączyć narzędzia, automatyzować obsługę klientów i rozwijać sprzedaż. Możesz pracować ze mną bezpośrednio, od ustalenia zakresu po wdrożenie.", links: [["O współpracy", "/partner-w-rozwoju-biznesu"], ["LinkedIn", "https://www.linkedin.com/in/kacper-bernecki/"]] },
      gallery: { title: "Galeria projektów", short: "Projekty", eyebrow: "Wybrane realizacje", text: "Zobacz działające strony i aplikacje. Wybierz miejsce na planecie lub projekt z listy." },
      studio: { title: "Studio deweloperskie", short: "Studio", eyebrow: "Strony i aplikacje", text: "Strony firmowe, landing pages i aplikacje webowe dopasowane do tego, jak działa Twoja firma. Zakres może obejmować projekt, integracje i wdrożenie.", links: [["Strony i landing pages", "/tworzenie-stron-internetowych"], ["Aplikacje webowe i CRM", "/crm-i-aplikacje-webowe"], ["Pakiety", "/pakiety"], ["Cennik", "/cennik"]] },
      lab: { title: "Laboratorium AI", short: "Lab AI", eyebrow: "AI i automatyzacja", text: "Łączę CRM, formularze i systemy przez API. Automatyzuję przekazywanie leadów, obsługę zapytań i powtarzalne zadania. Wdrażam narzędzia AI tam, gdzie usprawniają pracę zespołu.", links: [["Wdrożenia AI", "/wdrozenia-ai-dla-firm"], ["Automatyzacje", "/automatyzacja-leadow-i-sprzedazy"], ["Integracje API", "/oferta/integracje-api"], ["B-Code · projekt własny", "/realizacje/b-code"]] },
      contact: { title: "Porozmawiajmy", short: "Kontakt", eyebrow: "Kontakt", text: "Opowiedz mi o projekcie, który chcesz zrealizować. Możesz napisać bezpośrednio lub skorzystać z formularza i kalendarza na stronie kontaktowej." },
    },
  },
  en: {
    description: "Explore Bernecki Universe, an interactive 3D portfolio with a living planet for each project.",
    enter: "Explore projects", explore: "Interactive 3D portfolio", overview: "Overview",
    classic: "Classic Portfolio", interactive: "Explore Universe", switch: "Switch mode",
    classicBlurb: "Services, pricing and case studies in the classic portfolio.",
    worldBlurb: "Explore living planets, each built around a different project.",
    chooserTitle: "Choose your experience", contact: "Contact", language: "Language",
    menu: "Menu", places: "Locations", rotate: "Drag to rotate", rotateLeft: "Rotate left", rotateRight: "Rotate right",
    reset: "Reset camera", help: "Controls", touch: "Drag to spin the globe", close: "Close",
    keyboard: "Use the arrow keys to spin the globe, 0 to reset, and 1–8 to visit a place up close. G opens the system map.",
    gallery: "Choose a project", projectImage: "Project screenshot", prev: "Previous project", next: "Next project",
    prevPhoto: "Previous screenshot", nextPhoto: "Next screenshot", live: "Open project", caseStudy: "Case study", features: "Features", stack: "Technologies",
    loading: "Loading the 3D scene", fallback: "Static view. You can open every location from the menu.",
    staticView: "Static view", world3d: "3D scene", scene: "Interactive globe of Bernecki.dev projects", photo: "Open screenshot", mail: "Send an email",
    portrait: "Plush figure of Kacper Bernecki", credits: "3D asset credits",
    zones: {
      hq: { title: "Kacper Bernecki", short: "Kacper", eyebrow: "Kacper Bernecki", text: "I build websites, CRM systems and web applications. I also connect tools, automate customer workflows and support sales. You can work with me directly, from scoping through deployment.", links: [["Working together", "/en/business"], ["LinkedIn", "https://www.linkedin.com/in/kacper-bernecki/"]] },
      gallery: { title: "Project Gallery", short: "Project Gallery", eyebrow: "Selected work", text: "See real websites and applications. Pick a place on the planet or choose a project from the list." },
      studio: { title: "Development Studio", short: "Dev Studio", eyebrow: "Websites and apps", text: "Company websites, landing pages and web applications built around your business. The scope can cover design, integrations and deployment.", links: [["Websites and landing pages", "/en/services/websites"], ["Web applications and CRM", "/en/services/crm"], ["Packages", "/en/packages"], ["Pricing", "/en/pricing"]] },
      lab: { title: "AI & Automation Lab", short: "AI Lab", eyebrow: "AI and automation", text: "I connect CRMs, forms and other systems through APIs. I automate lead handoffs, enquiries and repetitive tasks, and introduce AI where it improves the team’s work.", links: [["AI and automation", "/en/services/automation"], ["CRM and integrations", "/en/services/crm"], ["B-Code · independent project", "/en/projects/b-code"]] },
      contact: { title: "Let’s talk", short: "Contact", eyebrow: "Contact", text: "Tell me what you’d like to build. Email me directly or use the enquiry form and booking calendar on the contact page." },
    },
  },
  uk: {
    description: "Дослідіть Bernecki Universe — інтерактивне 3D-портфоліо, де кожен проєкт має власну живу планету.",
    enter: "Переглянути проєкти", explore: "Інтерактивне 3D-портфоліо", overview: "Огляд",
    classic: "Класичне портфоліо", interactive: "Досліджуйте всесвіт", switch: "Змінити режим",
    classicBlurb: "Послуги, ціни та реалізовані проєкти.",
    worldBlurb: "Відвідайте живі планети, кожна з яких представляє окремий проєкт.",
    chooserTitle: "Оберіть режим портфоліо", contact: "Контакт", language: "Мова",
    menu: "Меню", places: "Локації", rotate: "Перетягніть, щоб повернути", rotateLeft: "Обернути ліворуч", rotateRight: "Обернути праворуч",
    reset: "Скинути камеру", help: "Керування", touch: "Проведіть пальцем, щоб обертати планету", close: "Закрити",
    keyboard: "Стрілки обертають планету, 0 повертає до огляду, а 1–8 наближають локації. G відкриває мапу системи.",
    gallery: "Оберіть проєкт", projectImage: "Знімок екрана проєкту", prev: "Попередній проєкт", next: "Наступний проєкт",
    prevPhoto: "Попередній знімок", nextPhoto: "Наступний знімок", live: "Відкрити проєкт", caseStudy: "Опис проєкту", features: "Функції", stack: "Технології",
    loading: "Завантаження 3D-сцени", fallback: "Статичний вигляд. Усі локації доступні в меню.",
    staticView: "Статичний вигляд", world3d: "3D-сцена", scene: "Інтерактивна планета проєктів Bernecki.dev", photo: "Відкрити знімок екрана", mail: "Написати листа",
    portrait: "Плюшева фігурка Кацпера Бернецького", credits: "Джерела 3D-матеріалів",
    zones: {
      hq: { title: "Кацпер Бернецький", short: "Кацпер", eyebrow: "Кацпер Бернецький", text: "Створюю сайти, CRM і вебзастосунки. Інтегрую інструменти, автоматизую роботу із клієнтами та допомагаю розвивати продажі. Працюю з вами напряму від визначення обсягу до запуску.", links: [["Обговорити співпрацю", "/uk/kontakty"], ["LinkedIn", "https://www.linkedin.com/in/kacper-bernecki/"]] },
      gallery: { title: "Галерея проєктів", short: "Проєкти", eyebrow: "Вибрані роботи", text: "Перегляньте реальні сайти й застосунки. Виберіть місце на планеті або проєкт зі списку." },
      studio: { title: "Студія розробки", short: "Студія", eyebrow: "Сайти та застосунки", text: "Корпоративні сайти, лендинги та вебзастосунки, розроблені з урахуванням того, як працює ваш бізнес. Можу допомогти з дизайном, інтеграціями й запуском.", links: [["Сайти та лендинги", "/uk/stvorennia-saitiv"], ["Вебзастосунки й CRM", "/uk/crm-dlia-biznesu"], ["Ціни", "/uk/tsiny"]] },
      lab: { title: "Лабораторія ШІ", short: "Лаб. ШІ", eyebrow: "ШІ та автоматизація", text: "З’єдную CRM, форми та інші системи через API. Автоматизую передавання лідів, роботу із запитами й повторювані завдання. Впроваджую ШІ там, де він полегшує роботу команди.", links: [["Автоматизація бізнесу", "/uk/avtomatyzatsiia-biznesu"], ["CRM та інтеграції", "/uk/crm-dlia-biznesu"]] },
      contact: { title: "Поговорімо", short: "Контакт", eyebrow: "Контакт", text: "Розкажіть про проєкт, який хочете реалізувати. Напишіть мені напряму або скористайтеся формою на сторінці контактів." },
    },
  },
};
