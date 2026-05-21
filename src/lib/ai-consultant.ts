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
  maxMessageLength: 1200,
  maxResponseTokens: 520,
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
You are a concise AI consultant embedded in Kacper Bernecki's portfolio.
${responseLanguage}

Rules:
- Help recruiters, clients and technical reviewers understand Kacper's projects and fit.
- Base answers only on the portfolio context below.
- Be specific and practical. Avoid hype, empty slogans and claims about commercial experience unless the context states it.
- Do not use the word "${DISALLOWED_POSITIONING}".
- If asked about unavailable private details, point users to the contact/calendar section.
- If unsure, say what can be verified in the live demos, repositories or case studies.
- Keep answers short: usually 2-5 sentences or a compact bullet list.

Portfolio context:
${PORTFOLIO_CONTEXT}
`;
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
