# bernecki.dev – mandatory rules for every change

These rules apply to ChatGPT, Codex, other AI agents and human contributors. Read before working on this repository. A task is NOT complete just because a GitHub commit was made.

## 1. Language parity: Polish AND English
- Every new public service page, sales page, package, pricing page, guide, blog article, navigation link and customer-facing element must have a real, complete, idiomatic Polish AND English version.
- A PL/ENG switch must take users to the *equivalent content* at a working URL. Translating the button, menu or title while leaving the main content Polish is NOT acceptable.
- Do not create indexed EN placeholders. Do not add English hreflang until a full English page exists. For new sales guides, add a matching reviewed English edition in the sales-en-*.json files (same slug, correct section count, all paragraphs translated).
- English guides must link to English offers, pricing, contact and privacy. Shared UI should display the correct language, including form labels, options, errors and confirmation messages.
- A PL/EN pair must have a unique self-canonical on each URL and reciprocal alternate hreflang annotations. Do not canonicalize the English URL to the Polish URL.
- Keep proper English metadata, structured data and descriptive internal links. Maintain all existing PL URLs unless a redirect plan is supplied.

## 2. Search visibility and indexing
- Every new indexable route must appear in the dynamically generated sitemap at /sitemap.xml. Every paired PL/EN route must have BOTH URLs and reciprocal hreflang entries. Use only live, indexable canonical URLs; never put a 404, redirect, noindex, or not-yet-published page into sitemap.
- Check /robots.txt includes /sitemap.xml. Do not block important commercial pages. Preserve domain canonicalization and HTTPS. Google does NOT use IndexNow; submitting to Bing/IndexNow is supplementary, not a substitute for Google Search Console.
- Inspect/verify page titles, descriptions, one clear H1, helpful original content, CTA, mobile layout, accessibility, and internal linking (especially from guides → service/pricing/contact).
- Do not bulk-create near-duplicate local landing pages or keyword stuffing. Group related search queries by search intent; prioritize actual buyers and enquiries, not impressions alone.
- After deployment: inspect live 200 responses, self-canonical and hreflang, /sitemap.xml and /robots.txt, then check Search Console crawl/index status when connected. Request Google indexing only when the page is live and eligible. There is NO guarantee of indexing.

## 3. Sales, UX and forms
- The "Cennik / Pricing" navigation must always expose TWO obvious options together: packages and individual service prices, including on mobile. Show the pricing section alongside Offer and Projects.
- Pricing must distinguish indicative net service fees from advertising spend, hosting, APIs, subscriptions and ongoing support. Never invent performance promises or case-study results.
- Every high-intent page should show what is offered, for whom, real examples where available, approximate prices or price factors, a clear CTA, and an easy contact/quote path.
- Test real forms (including EN language, privacy consent, antibot and sending) and make sure enquiries are stored and notifications are working. Do not collect test submissions without labeling them as tests.
- Track actual lead submissions, qualified leads and sales, not just clicks, page views or email button opens. Do not add analytics before valid consent.

## 4. Release gates
- Before merging or deploying: run npm run verify:bilingual, TypeScript type check, tests, and the Next.js build. A failure blocks release.
- Check routes in both languages, especially new pages and guides; test switching PL → ENG → PL and responsive menu.
- After deploying: verify production Vercel READY, canonical domain aliases, 200s, sitemap, hreflang, proper EN copy and working forms. Update search engine submission where supported.
- Use a PR and preserve source history. Report accurately what was deployed, tested, and what remains unverified. "Submitted to IndexNow" is not "indexed in Google".
- If work changes public-facing copy or a URL, actively check the implications for its translated counterpart, menus, breadcrumbs, links, schema, OG metadata, sitemap, and Search Console. Never wait for the owner to ask.

## 5. Ownership of work
- Think through related consequences yourself before declaring a feature complete. Do not ask the site owner to remind you of language parity, sitemap, internal links, basic SEO, or conversion tracking.
- Document all relevant changes and remaining limitations plainly. A future contributor must use this file and docs/RELEASE-CHECKLIST.md.
