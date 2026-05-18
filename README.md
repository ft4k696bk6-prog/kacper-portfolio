# Kacper Bernecki Portfolio

Professional portfolio for a Frontend / Web App Developer focused on business web applications: CRMs, dashboards, forms, admin panels, workflow tools and API integrations.

PL: Portfolio prezentuje projekty web app bez pozycjonowania jako osoba początkująca, z B-CRM jako głównym projektem technicznym.

## Live demo

https://kacper-portfolio.vercel.app

## Screenshots

Screenshots should be added to `docs/screenshots/`. Placeholder image links are not included.

## Features

- B-CRM-first project presentation.
- Technical reviewer section for companies and recruiters.
- B-CRM case study page.
- Technology section focused on project stack and usage.
- Contact form that avoids rendering direct email/phone publicly.
- Turnstile honeypot/rate-limit contact protection.
- Optional Google Tag Manager integration via environment variable.
- SEO, OpenGraph, Twitter card, sitemap and robots metadata.

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Resend
- Cloudflare Turnstile
- Vercel
- Vitest

## Project structure

- `src/app/` — App Router pages, metadata, API routes, sitemap and robots.
- `src/components/` — portfolio sections, UI and GTM/contact components.
- `src/i18n/` — Polish and English content.
- `src/contexts/` — language context.
- `public/images/` — profile visuals and static assets.
- `docs/` — roadmap, changelog, issue backlog and screenshots folder.

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
RESEND_API_KEY=
CONTACT_TO_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_CALENDAR_URL=
```

`NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_CALENDAR_URL` are optional. GTM and the calendar card load only when their variables are set.

## Security notes

The contact form avoids rendering direct email and phone details in the page. Bot protection uses a honeypot, simple rate limiting and optional Cloudflare Turnstile verification. `robots.txt` is configured for indexing; it is not treated as a scraping prevention mechanism.

## What I learned

- Positioning a portfolio around evidence and technical specificity.
- Building a contact flow with server-side email delivery.
- Keeping public contact details out of rendered markup.
- Structuring project cards around problem, real features, stack and status.
- Managing SEO and OpenGraph metadata in Next.js.

## Roadmap

- Add real screenshots for every project.
- Add browser smoke tests for portfolio navigation and contact form states.
- Add a richer B-CRM architecture diagram.
- Add analytics events through GTM after the container ID is configured.
- Review Core Web Vitals after deployment.

## Status

Active development.

## License

MIT.
