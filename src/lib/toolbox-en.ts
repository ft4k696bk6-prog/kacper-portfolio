import { toolboxItems, type ToolboxItem } from "./toolbox";

export type EnglishToolboxItem = ToolboxItem & { englishSlug:string };
const englishData: Record<string,{slug:string;title:string;description:string}> = {
  "audyt-strony": {
    "slug": "free-website-audit",
    "title": "Free comprehensive website audit",
    "description": "Check up to seven public pages for SEO, indexing, images, SSL, DNS and analytics in one report."
  },
  "audyt-seo": {
    "slug": "free-seo-audit",
    "title": "Free SEO audit",
    "description": "Check page titles, descriptions, headings, canonical URLs, indexing signals and structured data."
  },
  "analizator-meta-tagow": {
    "slug": "meta-tag-checker",
    "title": "Free meta tag checker",
    "description": "Inspect page titles, descriptions, canonical URLs and robots directives."
  },
  "tester-naglowkow-h1-h6": {
    "slug": "heading-checker",
    "title": "Free H1–H6 heading checker",
    "description": "Review heading hierarchy and identify missing or repeated H1 elements."
  },
  "tester-open-graph": {
    "slug": "open-graph-checker",
    "title": "Free Open Graph checker",
    "description": "Inspect social-sharing titles, descriptions and images in public HTML."
  },
  "czy-ai-widzi-strone": {
    "slug": "ai-crawler-checker",
    "title": "Free AI crawler access checker",
    "description": "Check robots.txt, noindex and the HTML signals relevant to AI crawlers."
  },
  "sprawdzanie-certyfikatu-ssl": {
    "slug": "ssl-certificate-checker",
    "title": "Free SSL/TLS certificate checker",
    "description": "Inspect the HTTPS certificate, issuer, validity and TLS protocol."
  },
  "test-spf-dmarc": {
    "slug": "spf-dmarc-checker",
    "title": "Free SPF and DMARC checker",
    "description": "Inspect your domain’s public email-authentication records."
  },
  "walidator-robots-txt": {
    "slug": "robots-txt-validator",
    "title": "Free robots.txt validator",
    "description": "Check common robots.txt directives, rules and sitemap entries."
  },
  "walidator-sitemap-xml": {
    "slug": "sitemap-xml-validator",
    "title": "Free XML sitemap validator",
    "description": "Check the sitemap structure and count its URL entries."
  },
  "walidator-schema-org": {
    "slug": "schema-markup-validator",
    "title": "Free Schema.org validator",
    "description": "Check JSON-LD syntax and key structured-data properties."
  },
  "generator-schema-localbusiness": {
    "slug": "localbusiness-schema-generator",
    "title": "Free LocalBusiness Schema generator",
    "description": "Generate structured JSON-LD markup from real business information."
  },
  "podglad-wyniku-google": {
    "slug": "google-serp-preview",
    "title": "Free Google search snippet preview",
    "description": "Preview your page title, description and URL as a simulated search result."
  },
  "generator-llms-txt": {
    "slug": "llms-txt-generator",
    "title": "Free llms.txt generator",
    "description": "Create a simple llms.txt draft with your company details and useful links."
  },
  "diagnostyka-meta-ads": {
    "slug": "meta-ads-troubleshooter",
    "title": "Free Meta Ads troubleshooter",
    "description": "Follow practical checks for rejected ads, inactive ad sets and delivery issues."
  },
  "analiza-wynikow-meta-ads-csv": {
    "slug": "meta-ads-csv-analyzer",
    "title": "Free Meta Ads CSV analyzer",
    "description": "Import an export from Ads Manager and calculate spend, clicks, CTR and lead costs locally."
  },
  "kalkulator-roas": {
    "slug": "roas-calculator",
    "title": "Free ROAS calculator",
    "description": "Calculate return on ad spend based on revenue and advertising costs."
  },
  "kalkulator-cpl": {
    "slug": "cost-per-lead-calculator",
    "title": "Free cost-per-lead calculator",
    "description": "Calculate CPL from advertising spend and the number of leads generated."
  },
  "kalkulator-budzetu-reklam": {
    "slug": "ad-budget-calculator",
    "title": "Free advertising budget calculator",
    "description": "Estimate the budget needed for a target lead volume at a chosen CPL."
  },
  "kalkulator-oplacalnosci-reklam": {
    "slug": "ad-profitability-calculator",
    "title": "Free advertising profitability calculator",
    "description": "Estimate campaign contribution after gross margin and ad spend."
  },
  "generator-utm": {
    "slug": "utm-builder",
    "title": "Free UTM link builder",
    "description": "Add source, medium, campaign and content parameters to your URLs."
  },
  "licznik-znakow-reklamy": {
    "slug": "ad-copy-character-counter",
    "title": "Free ad copy character counter",
    "description": "Count characters and words in your ad headlines and primary copy."
  },
  "kalkulator-konwersji-strony": {
    "slug": "website-conversion-calculator",
    "title": "Free website conversion rate calculator",
    "description": "Calculate visit-to-lead, lead-to-customer and visit-to-customer conversion."
  },
  "kalkulator-cac": {
    "slug": "customer-acquisition-cost-calculator",
    "title": "Free customer acquisition cost (CAC) calculator",
    "description": "Estimate how much marketing and sales spend is needed per new customer."
  },
  "kalkulator-strat-z-leadow": {
    "slug": "lost-leads-calculator",
    "title": "Free missed-lead value calculator",
    "description": "Model the potential margin lost through unanswered enquiries."
  },
  "kalkulator-roi-crm": {
    "slug": "crm-roi-calculator",
    "title": "Free CRM ROI calculator",
    "description": "Estimate payback time under a hypothetical improvement in conversion."
  },
  "kalkulator-oszczednosci-automatyzacji": {
    "slug": "automation-savings-calculator",
    "title": "Free automation savings calculator",
    "description": "Estimate time recovered and the value of automating repetitive tasks."
  },
  "kalkulator-kosztu-strony": {
    "slug": "website-cost-calculator",
    "title": "Free website cost calculator",
    "description": "Estimate a non-binding website budget based on page count and integrations."
  },
  "dekoder-jwt": {
    "slug": "jwt-decoder",
    "title": "Free JWT decoder",
    "description": "Decode JWT header and payload locally without sending the token to a server."
  },
  "konwerter-unix-time": {
    "slug": "unix-time-converter",
    "title": "Free Unix timestamp converter",
    "description": "Convert Unix seconds or milliseconds to human-readable dates."
  },
  "formatter-json": {
    "slug": "json-formatter",
    "title": "Free JSON formatter and validator",
    "description": "Validate JSON syntax and format it locally in your browser."
  },
  "generator-uuid": {
    "slug": "uuid-generator",
    "title": "Free UUID v4 generator",
    "description": "Create random UUID v4 identifiers with your browser’s secure random generator."
  },
  "test-czasu-odpowiedzi-serwera": {
    "slug": "ttfb-checker",
    "title": "Free server response time (TTFB) checker",
    "description": "Measure time to first byte for one request to a public web page."
  },
  "tester-przekierowan-301-302": {
    "slug": "http-redirect-checker",
    "title": "Free HTTP redirect checker",
    "description": "Inspect the redirect chain, status codes and final destination URL."
  },
  "tester-naglowkow-bezpieczenstwa": {
    "slug": "http-security-headers-checker",
    "title": "Free HTTP security headers checker",
    "description": "Inspect CSP, HSTS and other response security headers."
  },
  "tester-meta-pixel": {
    "slug": "meta-pixel-checker",
    "title": "Free Meta Pixel checker",
    "description": "Look for common Meta Pixel installation markers in public page HTML."
  },
  "tester-google-tag-manager": {
    "slug": "google-tag-manager-checker",
    "title": "Free Google Tag Manager checker",
    "description": "Look for GTM and Google Analytics markers in publicly returned HTML."
  },
  "tester-obrazow-alt": {
    "slug": "image-alt-checker",
    "title": "Free image alt attribute checker",
    "description": "Count images and identify missing alt attributes in page HTML."
  },
  "kalkulator-cpc": {
    "slug": "cpc-calculator",
    "title": "Free CPC calculator",
    "description": "Calculate average cost per ad-link click."
  },
  "kalkulator-cpm": {
    "slug": "cpm-calculator",
    "title": "Free CPM calculator",
    "description": "Calculate the cost of one thousand advertising impressions."
  },
  "kalkulator-leadow-z-ruchu": {
    "slug": "website-leads-calculator",
    "title": "Free website traffic-to-lead calculator",
    "description": "Estimate leads from traffic and an assumed conversion rate."
  },
  "kalkulator-ltv-klienta": {
    "slug": "customer-ltv-calculator",
    "title": "Free customer lifetime value calculator",
    "description": "Estimate the gross-margin value of a customer over a chosen period."
  },
  "konwerter-base64": {
    "slug": "base64-encoder-decoder",
    "title": "Free Base64 encoder and decoder",
    "description": "Encode UTF-8 as Base64 or decode it locally in your browser."
  },
  "generator-sha256": {
    "slug": "sha256-hash-generator",
    "title": "Free SHA-256 hash generator",
    "description": "Generate a SHA-256 text hash without transmitting the input."
  },
  "tester-kontrastu-kolorow": {
    "slug": "wcag-contrast-checker",
    "title": "Free WCAG color contrast checker",
    "description": "Calculate a color pair’s contrast ratio and compare it with WCAG thresholds."
  }
};
export const englishToolboxCategories: Record<string,string> = {
  "WWW i SEO":"Website & SEO",
  "Reklamy i marketing":"Advertising & marketing",
  "CRM i sprzedaż":"CRM & sales",
  "AI i wyszukiwarki":"AI & search",
  "Dla programistów":"Developer tools"
};
export const englishToolboxItems: EnglishToolboxItem[] = toolboxItems.map(tool=>({
 ...tool,
 title:englishData[tool.slug]?.title||tool.title,
 description:englishData[tool.slug]?.description||tool.description,
 englishSlug:englishData[tool.slug]?.slug||tool.slug,
 category:englishToolboxCategories[tool.category]||tool.category
}));
export function englishToolForSlug(slug:string){return englishToolboxItems.find(x=>x.englishSlug===slug);}
export function englishToolPath(polishSlug:string){return "/en/tools/"+(englishData[polishSlug]?.slug||polishSlug);}
export function localizedToolPath(polishSlug:string,language:"pl"|"en"){return language==="en"?englishToolPath(polishSlug):"/narzedzia/"+polishSlug;}
export function localizedToolboxPath(language:"pl"|"en"){return language==="en"?"/en/tools":"/narzedzia";}
