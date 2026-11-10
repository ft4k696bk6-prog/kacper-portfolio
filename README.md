# Kacper Bernecki — Websites, CRM and Web Apps

Portfolio and project evidence for Kacper Bernecki, an independent Polish frontend and web application developer. I work directly with small businesses and founders on websites, landing pages, CRM systems, dashboards, forms, workflow tools and API integrations.

I am not a large agency: clients speak directly with the person designing and building the solution. The focus is clear communication, careful implementation, useful technology and a fair scope instead of unnecessary corporate process.

PL: Tworzę strony internetowe, landing page, CRM-y i aplikacje webowe dla małych firm. Pracuję bezpośrednio z klientem, bez korporacyjnego narzutu, z naciskiem na skrupulatność, dobry kontakt i uczciwą wycenę.

## Services

- Business websites, product websites and landing pages.
- Campaign pages and conversion flows for marketing and advertising.
- CRM and lead-management systems.
- Dashboards, admin panels, forms, calculators and internal tools.
- Role-based access, Supabase, PostgreSQL and API integrations.
- Vercel deployment and practical iteration after launch.

## Live portfolio

https://bernecki.dev

Service pages:

- [Website development](https://bernecki.dev/tworzenie-stron-internetowych)
- [CRM and web applications](https://bernecki.dev/crm-i-aplikacje-webowe)
- [Marketing and advertising landing pages](https://bernecki.dev/marketing-i-reklamy)

- [Re-Energy System](https://re-energysystem.pl) — photovoltaic systems and energy storage company; website and a real-world Meta Ads lead-generation case study: https://bernecki.dev/case-studies/re-energy-meta-ads.

Machine-readable project and positioning summary: [bernecki.dev/llms.txt](https://bernecki.dev/llms.txt)

## Selected projects

- [B-CRM](https://demo-crm.bernecki.dev/login) — production-like CRM demo with role-aware sales and operations workflows.
- [Motomizer](https://motomizer.pl) — product landing page with responsive presentation and variant galleries.
- [StarCars Import](https://www.star-cars.us) — business website with an import-cost estimator and enquiry flow.
- [BeatMarket](https://beatmarket.bernecki.dev) — beat discovery and licensing marketplace in active development.

Case studies are available at https://bernecki.dev/case-studies.

## Features

- B-CRM-first project presentation.
- Technical reviewer section for companies and recruiters.
- Bilingual case studies for all portfolio projects.
- Technology section focused on project stack and usage.
- Direct email/phone reveal without rendering contact details in the initial HTML.
- Turnstile fallback, honeypot and rate-limit protection for contact reveal.
- Custom booking calendar that talks to Cal.com through server routes.
- Conversational AI assistant with text input, optional speech input, retry/error states and portfolio-focused fallback replies.
- Fixed bottom-right AI assistant with a quiet opt-in UI, without 3D model loading.
- Optional Google Tag Manager integration via environment variable.
- SEO, OpenGraph, Twitter card, sitemap and robots metadata.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Cloudflare Turnstile
- Cal.com API
- NVIDIA NIM API
- Vercel
- Vitest

## Project structure

- `src/app/` -- App Router pages, metadata, API routes, sitemap and robots.
- `src/components/` -- portfolio sections, UI and GTM/contact components.
- `src/i18n/` -- Polish and English content.
- `src/contexts/` -- language context.
- `public/images/` -- profile visuals and static assets.
- `docs/` -- roadmap, changelog, issue backlog and screenshots folder.

## Getting started

```bash
git clone https://github.com/ft4k696bk6-prog/kacper-portfolio.git
cd kacper-portfolio
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Environment variables

Create `.env.local` from `.env.example`.

```bash
NEXT_PUBLIC_SITE_URL=
CONTACT_TO_EMAIL=
CONTACT_REVEAL_EMAIL=
CONTACT_REVEAL_PHONE=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NVIDIA_API_KEY=
NVIDIA_API_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-70b-instruct
CAL_API_KEY=
CAL_EVENT_TYPE_ID=
CAL_USERNAME=
CAL_EVENT_TYPE_SLUG=
NEXT_PUBLIC_CALENDAR_TIMEZONE=Europe/Warsaw
```

`NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_GA_MEASUREMENT_ID` are optional. The AI consultant uses NVIDIA/NIM through a server route, so `NVIDIA_API_KEY` must stay server-only and must never be committed or exposed with a `NEXT_PUBLIC_` prefix. If `NVIDIA_API_KEY` is not set, the assistant still returns local portfolio-focused fallback answers instead of failing. The booking calendar uses Cal.com API through server routes, so `CAL_API_KEY` must also stay server-only. Prefer `CAL_EVENT_TYPE_ID`; use `CAL_USERNAME` + `CAL_EVENT_TYPE_SLUG` only as a fallback. Direct contact details use server-only `CONTACT_REVEAL_EMAIL` and `CONTACT_REVEAL_PHONE`; email falls back to `CONTACT_TO_EMAIL` when `CONTACT_REVEAL_EMAIL` is not set.

## Security notes

The contact reveal flow avoids rendering direct email and phone details in the initial page HTML. Bot protection uses a honeypot, simple rate limiting and Cloudflare Turnstile verification when configured. Booking and AI consultant requests are sent through server routes so Cal.com and NVIDIA API keys are not exposed in the browser. `robots.txt` is configured for indexing; it is not treated as a scraping prevention mechanism.

## What I learned

- Positioning a portfolio around evidence and technical specificity.
- Building contact reveal and booking flows through server routes.
- Keeping public contact details out of rendered markup.
- Structuring project cards and case studies around problem, real features, stack and status.
- Managing SEO and OpenGraph metadata in Next.js.

## Roadmap

- Add real screenshots for the remaining projects.
- Add browser smoke tests for portfolio navigation, booking and contact reveal states.
- Add a richer B-CRM architecture diagram.
- Add analytics events through GTM after the container ID is configured.
- Add GTM events for booking day/time selection after the container ID is configured.
- Review Core Web Vitals after deployment.

## Contact

For a website, CRM, web app or campaign landing page, contact Kacper through https://bernecki.dev/#contact.

- GitHub: https://github.com/ft4k696bk6-prog
- LinkedIn: https://www.linkedin.com/in/kacper-bernecki/

## Status

Active development.

## License

MIT.
