import {toolboxItems} from "./toolbox";
import {englishToolboxItems} from "./toolbox-en";

// These 12 single-purpose inspectors largely duplicate the combined website audit.
// Keep their original URLs, metadata, search indexation and sitemap entries intact.
// They are intentionally not linked from the public toolbox catalog or related-tool cards.
export const standaloneWebsiteCheckerSlugs=[
 "audyt-seo",
 "analizator-meta-tagow",
 "tester-naglowkow-h1-h6",
 "tester-open-graph",
 "sprawdzanie-certyfikatu-ssl",
 "test-spf-dmarc",
 "test-czasu-odpowiedzi-serwera",
 "tester-przekierowan-301-302",
 "tester-naglowkow-bezpieczenstwa",
 "tester-meta-pixel",
 "tester-google-tag-manager",
 "tester-obrazow-alt"
] as const;
const hidden=new Set<string>(standaloneWebsiteCheckerSlugs);
export const isShownInToolboxCatalog=(slug:string)=>slug!=="audyt-strony"&&!hidden.has(slug);
export const visibleToolboxItems=toolboxItems.filter(tool=>isShownInToolboxCatalog(tool.slug));
export const visibleEnglishToolboxItems=englishToolboxItems.filter(tool=>isShownInToolboxCatalog(tool.slug));
export const catalogToolboxCount=visibleToolboxItems.length+1; // featured comprehensive audit
