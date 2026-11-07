import { guides as existingGuides } from "../content/guides";
import { pseoGuides } from "../content/pseo/guides";
import { offlineGuides } from "../content/pseo/offline-guides";
import { offlineBatchTwoGuides } from "../content/pseo/offline-batch2-guides";
import { businessGuides } from "../content/businessGuides";

/** Jeden katalog: zachowuje wszystkie poradniki tworzone równolegle w guides.ts. */
export const allGuides = [...existingGuides, ...pseoGuides, ...offlineGuides, ...offlineBatchTwoGuides, ...businessGuides];
export type Guide = (typeof allGuides)[number];

export const guideCategories = [
  { slug: "meta-ads", label: "Meta Ads i reklamy", description: "Błędy Menedżera reklam, formularze Lead Ads, piksel i pomiar konwersji." },
  { slug: "vercel-hosting", label: "Vercel i hosting", description: "Wdrożenia, statusy projektów, konfiguracja hostingu i domen." },
  { slug: "supabase-bazy", label: "Supabase i bazy danych", description: "SQL, RLS, uprawnienia, logowanie, błędy i dane w aplikacji." },
  { slug: "nextjs-react", label: "Next.js, React i TypeScript", description: "Błędy aplikacji, renderowania, komponentów i kompilacji." },
  { slug: "crm-leady", label: "CRM i obsługa leadów", description: "Widoczność kontaktów, przydziały, statusy i integracje CRM." },
  { slug: "seo-google", label: "SEO i wyszukiwarki", description: "Indeksowanie, Search Console, mapy witryn i widoczność stron." },
  { slug: "domeny-poczta", label: "Domeny i poczta", description: "DNS, iCloud Mail, MX, SPF i błędy wysyłania lub odbierania wiadomości." },
  { slug: "formularze-api", label: "Formularze i API", description: "Formularze kontaktowe, CORS, webhooki, autoryzacja i błędy API." },
  { slug: "wordpress", label: "WordPress", description: "Wtyczki, konfiguracja, adresy i problemy stron WordPress." },
  { slug: "strony-ux", label: "Strony i UX", description: "Wygląd mobilny, obrazy, nawigacja, szybkość i dostępność." },
  { slug: "automatyzacje", label: "Automatyzacje", description: "Automatyczne procesy, harmonogramy, integracje i alerty." },
  { slug: "branze-pkd", label: "Pomysły na działalność i PKD", description: "Przykłady fryzjera, barbera, studia tatuażu i wykończeniówki: PKD, podatki, koszty i marże." },
  { slug: "spolki-cit", label: "Spółki, CIT i wypłaty", description: "CIT 9% i 19%, dywidenda, estoński CIT, umowy i rozliczenia wspólników." },
  { slug: "biznes-podatki", label: "Biznes i podatki", description: "Edukacja dla przedsiębiorców: podstawy VAT, stawki, dostawcy, koszty i zakładanie firmy." },
  { slug: "inne", label: "Pozostałe poradniki", description: "Praktyczne rozwiązania problemów z projektami internetowymi." }
] as const;

export type GuideCategorySlug = (typeof guideCategories)[number]["slug"];
export const GUIDE_PAGE_SIZE = 24;

const categoryRules: readonly [GuideCategorySlug, RegExp][] = [
  ["meta-ads", /meta|facebook|instagram|pixel|conversions.api|kampani|reklam|lead.ads|capi|ads.manager/],
  ["vercel-hosting", /vercel|deployment|hosting|build.exited|preview.production|404.after.deploy/],
  ["supabase-bazy", /supabase|postgres|row.level|\brls\b|\bsql\b|baza.danych/],
  ["nextjs-react", /next\.?js|react|typescript|hydration|server.component|app.router|use.search.params/],
  ["wordpress", /wordpress|wp.admin|woocommerce|wtyczk/],
  ["domeny-poczta", /icloud|poczta|email|e.mail|\bdns\b|\bmx\b|\bspf\b|domena/],
  ["seo-google", /\bseo\b|search.console|indeksow|sitemap|canonical|robots.txt|google.search|indexnow|miniatura.linku|open.graph/],
  ["formularze-api", /formularz|\bapi\b|webhook|\bcors\b|kontaktowy|fetch/],
  ["crm-leady", /\bcrm\b|handlow|przypisani|leady|leadow|kontaktow|kolejka/],
  ["automatyzacje", /automatyzac|harmonogram|\bcron\b|workflow/],
  ["strony-ux", /mobile|mobiln|responsyw|obraz|zdjec|menu|tlo|layout|strona.internetow|landing/]
];

export function normalizeGuideText(text: string) {
  return text.toLocaleLowerCase("pl")
    .replace(/ł/g, "l")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function guideCategory(guide: Pick<Guide, "slug" | "title" | "service">): GuideCategorySlug {
  if ("category" in guide && typeof guide.category === "string" && guideCategories.some((item) => item.slug === guide.category)) {
    return guide.category as GuideCategorySlug;
  }
  const text = normalizeGuideText(`${guide.slug} ${guide.title}`);
  for (const [category, pattern] of categoryRules) {
    if (pattern.test(text)) return category;
  }
  if (guide.service.includes("marketing")) return "meta-ads";
  if (guide.service.includes("crm")) return "crm-leady";
  if (guide.service.includes("stron")) return "strony-ux";
  return "inne";
}

export function getGuide(slug: string) {
  return allGuides.find((guide) => guide.slug === slug);
}

export function getCategory(slug: string) {
  return guideCategories.find((category) => category.slug === slug);
}

export function getGuideCounts() {
  return guideCategories.map((category) => ({
    ...category,
    count: allGuides.filter((guide) => guideCategory(guide) === category.slug).length
  }));
}

export function listGuides(options: { category?: string; query?: string; page?: number } = {}) {
  const term = normalizeGuideText((options.query ?? "").slice(0, 100));
  const filtered = allGuides.filter((guide) => {
    if (options.category && guideCategory(guide) !== options.category) return false;
    if (!term) return true;
    return normalizeGuideText(`${guide.title} ${guide.description} ${guide.intro}`).includes(term);
  }).sort((a, b) => a.title.localeCompare(b.title, "pl"));
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / GUIDE_PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.isFinite(options.page) ? Math.floor(options.page!) : 1), pages);
  return { items: filtered.slice((page - 1) * GUIDE_PAGE_SIZE, page * GUIDE_PAGE_SIZE), total, page, pages };
}

const stopWords = new Set(["przez", "ktory", "ktora", "jakie", "dlaczego", "zrobic", "blad", "problem", "naprawic", "strona", "stronie", "sprawdz", "nie", "jest"]);

function keywords(guide: Guide) {
  return new Set(normalizeGuideText(`${guide.slug} ${guide.title}`).split(" ").filter((word) => word.length > 3 && !stopWords.has(word)));
}

export function getRelatedGuides(slug: string, limit = 10) {
  const current = getGuide(slug);
  if (!current) return [];
  const currentKeywords = keywords(current);
  const currentCategory = guideCategory(current);
  return allGuides.filter((guide) => guide.slug !== slug)
    .map((guide) => {
      const shared = [...keywords(guide)].filter((word) => currentKeywords.has(word)).length;
      return { guide, score: (guideCategory(guide) === currentCategory ? 10 : 0) + shared };
    })
    .sort((a, b) => b.score - a.score || a.guide.title.localeCompare(b.guide.title, "pl"))
    .slice(0, Math.max(0, Math.min(16, limit)))
    .map(({ guide }) => guide);
}
