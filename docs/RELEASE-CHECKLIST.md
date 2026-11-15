# Mandatory publishing checklist – bernecki.dev

Use this list on EVERY change that affects pages, offers, guides, navigation, forms or SEO.

## Before implementation
- Identify the real customer problem and target search intent; check existing content to avoid duplicate pages and overlapping keywords.
- Define the Polish page and its equivalent English route, title, description, H1, CTA and internal links; include pricing/package navigation and real project evidence where relevant.
- Check platform ad policies and current information before publishing advertising tutorials. Do not invent audience targeting or results.

## Before merging
- [ ] Both PL and EN render real, complete content (including forms, errors, labels and service links).
- [ ] PL/ENG language switch links to the correct counterpart, including mobile navigation and the footer.
- [ ] Self-canonical and reciprocal hreflang exist on both page variants, with correct page metadata.
- [ ] Both canonical routes appear in /sitemap.xml and no incorrect redirects or duplicate URLs are listed.
- [ ] Titles, meta descriptions, structured data and headlines describe the correct service in plain language.
- [ ] Related guides link to a matching service, prices and an actionable contact form.
- [ ] No 404s, no nonfunctional buttons, no unsupported promises or fictional numbers.
- [ ] Tests, typecheck and build succeed, including **npm run verify:bilingual**.
- [ ] Responsive/mobile layout and navigation checked, not just desktop.
- [ ] Accessibility basics: semantic headings, sensible labels, keyboard navigation and focus.
- [ ] Pricing displays net starting amounts and clearly separates ad-platform media spend.
- [ ] Existing URLs preserved or given intentional 301 redirects.
- [ ] Forms submit successfully, show clear confirmation and preserve service/package selection.

## After production
- [ ] Vercel production deployment reports READY with the right SHA and domain aliases.
- [ ] Confirm 200 responses at PL and EN canonical URLs; no incorrect redirects or noindex.
- [ ] Confirm live /sitemap.xml includes both URLs and reciprocal hreflang; /robots.txt references sitemap.
- [ ] Verify that Google can discover pages via sitemap/Search Console. Do not confuse IndexNow with Google indexing.
- [ ] Inspect indexation status for important commercial routes and address any exclusions.
- [ ] Check GA4 event recording for successfully submitted leads and separate qualified-lead reporting.
- [ ] Monitor actual enquiries and lead quality by channel. Track CTR only as a diagnostic.
- [ ] Report any unavailable test or remaining issue explicitly. Never claim "fully tested" if a check was skipped.
