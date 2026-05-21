export type AiConsultantRole = "user" | "assistant";

export type AiConsultantMessage = {
  role: AiConsultantRole;
  content: string;
};

const DEFAULT_NVIDIA_API_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_NVIDIA_MODEL = "meta/llama-3.1-70b-instruct";
const DISALLOWED_POSITIONING = ["ju", "nior"].join("");

const PORTFOLIO_CONTEXT = `
Kacper Bernecki is a Frontend / Web App Developer focused on practical business web applications.

Positioning:
- React, TypeScript, Next.js, Supabase, PostgreSQL, Tailwind CSS and Vercel.
- Business apps, CRMs, dashboards, forms, role-based workflows, data handling and API integrations.
- AI is used as a supporting tool for prototyping, debugging and selected product features, not as a replacement for engineering skills.

Projects:
- B-CRM: production-like CRM demo for lead management and sales/operations workflow. Stack: React, TypeScript, Next.js, Supabase, PostgreSQL, Tailwind CSS, Vercel. Features include auth, demo accounts, roles, lead statuses, comments, history, callbacks, meetings, admin panel, manager hierarchy, finance/accounting/logistics/installation flow, CSV import/export, PDF offer flow and KSeF demo payload.
- Interactive MacBook Portfolio: experimental interactive portfolio with a cinematic intro, desktop panels, dock, terminal actions, project links, contact shortcuts and mini games.
- Berni Rush: playable browser game prototype built with React, TypeScript, Vite, Three.js, Zustand and Vercel.
- Portfolio: this Next.js portfolio with bilingual case studies, project evidence, custom Cal.com booking, protected contact reveal, SEO metadata and analytics setup.
- Unreal Engine Gameplay Prototype: local UE5 prototype with driving, contracts, UI/HUD, open-world blockout and gameplay interaction systems.
- BerniNutri: nutrition/meal-analysis prototype using an AI-backed endpoint. It is not medical advice.
- Leasing Calculator: business calculator demo for leasing estimates. It is informational, not a financial offer.

Contact:
- The portfolio has a calendar booking section and protected email/phone reveal.
- Do not invent private contact details. Tell users to use the contact section on the page.
`;

export const AI_CONSULTANT_LIMITS = {
  maxMessages: 8,
  maxMessageLength: 2200,
  maxResponseTokens: 760,
};

export function getNvidiaApiKey() {
  return (
    process.env.NVIDIA_API_KEY?.trim() ||
    process.env.NVIDIA_NIM_API_KEY?.trim() ||
    process.env.NVCF_API_KEY?.trim() ||
    process.env.nvidia?.trim()
  );
}

export function getNvidiaApiBaseUrl() {
  return (process.env.NVIDIA_API_BASE_URL?.trim() || DEFAULT_NVIDIA_API_BASE_URL).replace(
    /\/+$/,
    "",
  );
}

export function getNvidiaModel() {
  return process.env.NVIDIA_MODEL?.trim() || DEFAULT_NVIDIA_MODEL;
}

export function buildAiConsultantSystemPrompt(language: "en" | "pl") {
  const responseLanguage =
    language === "pl"
      ? "Answer in Polish unless the user clearly asks for English."
      : "Answer in English unless the user clearly asks for Polish.";

  return `
You are AI Kacper: a curious, human-feeling portfolio companion embedded in Kacper Bernecki's site.
${responseLanguage}

Rules:
- Help recruiters, clients and technical reviewers understand Kacper's projects and fit.
- Sound direct, warm, curious, lightly funny and practical. You can be playful and a little mischievous, but never goofy at the user's expense.
- Base portfolio answers only on the portfolio context below.
- If a user asks for code help, give practical debugging or implementation guidance for React, TypeScript, Next.js, Supabase, forms, dashboards, APIs and frontend architecture.
- Ask for the smallest relevant code snippet when needed, but remind users not to paste API keys, passwords, tokens or private customer data.
- You may help users decide what to click on this page: projects, B-CRM, contact, booking, stack, code help and case studies.
- Do not pretend you performed actions outside this page or changed code unless the page has a real capability for that action.
- Refuse spam, sender rotation, bypassing rate limits, credential abuse, scraping abuse, false claims and anything legally or ethically risky.
- Be specific and practical. Avoid hype, empty slogans and claims about commercial experience unless the context states it.
- Do not use the word "${DISALLOWED_POSITIONING}".
- If asked about unavailable private details, point users to the contact/calendar section.
- If unsure, say what can be verified in the live demos, repositories or case studies.
- Keep answers short by default: usually 2-6 sentences or a compact bullet list.
- Keep a lively, curious, helpful tone. Small jokes are welcome, but never at the cost of clarity or trust.
- You can suggest using the floating buttons for projects, B-CRM, contact or booking, but do not claim you performed a page action yourself.

Portfolio context:
${PORTFOLIO_CONTEXT}
`;
}

function latestUserContent(messages: AiConsultantMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user")?.content.trim() || "";
}

function normalizeForIntent(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function buildConfiguredFallbackAnswer(
  messages: AiConsultantMessage[],
  language: "en" | "pl",
) {
  const latestQuestion = latestUserContent(messages);
  const normalizedQuestion = normalizeForIntent(latestQuestion);
  const isPolish = language === "pl";

  if (!latestQuestion) {
    return isPolish
      ? "Jestem gotowy. Zapytaj o B-CRM, stack, projekty albo kontakt, a ja poprowadze bez lania wody."
      : "Ready when you are. Ask about B-CRM, the stack, projects or contact, and I will keep it crisp.";
  }

  if (hasAny(normalizedQuestion, ["b-crm", "b crm", "crm", "lead", "sales", "sprzedaz"])) {
    return isPolish
      ? "B-CRM to najmocniejszy projekt do sprawdzenia: production-like CRM z rolami, statusami leadow, komentarzami, historia zmian, callbackami, spotkaniami, panelami operacyjnymi i danymi w Supabase/PostgreSQL. Najlepiej pokazuje, ze Kacper mysli procesem biznesowym, nie tylko ladnym ekranem. Moge tez wskazac konkretnie role, workflow albo stack."
      : "B-CRM is the strongest project to review: a production-like CRM with roles, lead statuses, comments, history, callbacks, meetings, operational panels and Supabase/PostgreSQL-backed data. It shows Kacper thinking in business workflow, not just nice screens. I can also point you to the roles, workflow or stack next.";
  }

  if (hasAny(normalizedQuestion, ["project", "projects", "portfolio", "projek", "realizac"])) {
    return isPolish
      ? "Najkrocej: B-CRM jest glownym dowodem technicznym, Portfolio pokazuje Next.js i dopracowane case studies, Berni Rush pokazuje Three.js/game loop, a BerniNutri i kalkulator leasingu pokazuja prototypy narzedzi biznesowych. Dobry przeglad? Najpierw B-CRM, potem case study Portfolio, potem poboczne eksperymenty."
      : "Short version: B-CRM is the main technical proof, Portfolio shows Next.js and polished case studies, Berni Rush shows Three.js/game-loop work, and BerniNutri plus the leasing calculator show business-tool prototypes. Best review path: B-CRM first, then the Portfolio case study, then the side experiments.";
  }

  if (hasAny(normalizedQuestion, ["stack", "tech", "technolog", "typescript", "react", "next", "supabase"])) {
    return isPolish
      ? "Glowny stack Kacpra to React, TypeScript, Next.js, Supabase/PostgreSQL, Tailwind CSS i Vercel. W praktyce uzywa go do CRM-ow, dashboardow, formularzy, route handlerow, autoryzacji, rol i integracji API. To jest bardziej warsztat web app niz wizytowka z animacjami."
      : "Kacper's core stack is React, TypeScript, Next.js, Supabase/PostgreSQL, Tailwind CSS and Vercel. In practice he uses it for CRMs, dashboards, forms, route handlers, auth, roles and API integrations. More web-app workshop than animated business card.";
  }

  if (hasAny(normalizedQuestion, ["contact", "kontakt", "email", "phone", "telefon", "book", "call", "meeting", "spotkanie", "rozmow"])) {
    return isPolish
      ? "Kontakt najlepiej zalatwic przez sekcje kontaktu na stronie: jest tam kalendarz rozmowy oraz chronione odsloniecie emaila/telefonu. Nie wymyslam prywatnych danych, bo to slaby sport i jeszcze gorszy UX."
      : "The best route is the contact section on the page: it has calendar booking plus protected email/phone reveal. I will not invent private contact details, because that is bad sport and worse UX.";
  }

  if (hasAny(normalizedQuestion, ["code", "bug", "debug", "frontend", "typescript", "kod", "blad"])) {
    return isPolish
      ? "Moge pomoc z kodem, szczegolnie React/TypeScript/Next.js, formularze, dashboardy, API i Supabase. Wklej najmniejszy fragment problemu bez sekretow, tokenow, kluczy API ani danych klientow, a przejde po nim konkretnie."
      : "I can help with code, especially React/TypeScript/Next.js, forms, dashboards, APIs and Supabase. Paste the smallest relevant snippet without secrets, tokens, API keys or customer data, and I will go through it directly.";
  }

  if (hasAny(normalizedQuestion, ["what can", "co potrafi", "umie", "fit", "hire", "value", "wartosc"])) {
    return isPolish
      ? "Kacper potrafi budowac praktyczne aplikacje webowe dla procesow biznesowych: CRM-y, dashboardy, formularze, role uzytkownikow, dane w Supabase/PostgreSQL i integracje API. Najwieksza wartosc jest w przekladaniu procesu firmy na czytelne ekrany i flow, a nie w samym klikaniu komponentow."
      : "Kacper builds practical web apps for business processes: CRMs, dashboards, forms, user roles, Supabase/PostgreSQL data and API integrations. The value is translating company workflow into clear screens and flows, not just assembling components.";
  }

  return isPolish
    ? "Na bazie portfolio: Kacper skupia sie na aplikacjach biznesowych w React/TypeScript/Next.js: CRM, dashboardy, formularze, role, dane i integracje. Jesli chcesz szybki dowod techniczny, zapytaj o B-CRM. Jesli chcesz decyzje biznesowa, zapytaj, ktory projekt najlepiej pasuje do Twojego przypadku."
    : "Based on the portfolio: Kacper focuses on business web apps in React/TypeScript/Next.js: CRMs, dashboards, forms, roles, data and integrations. If you want quick technical proof, ask about B-CRM. If you want a business-fit answer, ask which project maps best to your case.";
}

export function sanitizeAiMessages(messages: AiConsultantMessage[]) {
  return messages
    .slice(-AI_CONSULTANT_LIMITS.maxMessages)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, AI_CONSULTANT_LIMITS.maxMessageLength),
    }))
    .filter((message) => message.content.length > 0);
}
