# Project Plan: Kacper Bernecki Portfolio

## English

### Project Goal

I built a modern personal portfolio website that presents practical web applications, CRM systems, automations, technologies, experience, and contact options. The site should work as a project and contact hub for showing real projects and making contact easy.

### Problem and Users

I designed this for potential clients, collaborators, and people checking my work who need to quickly understand what I build, what technologies he uses, and how to contact or book a conversation with him. I used this project to solve the problem of scattered proof of work by turning projects, skills, services, and contact into a structured web presence.

### Functional Scope

I planned the project scope around:

- Hero section with clear positioning and profile imagery.
- Project section presenting portfolio applications.
- Services and skills sections explaining the type of work offered.
- Experience/profile content.
- Contact flow with form fields and clear calls to action.
- Booking flow through Cal.com embed.
- Polish and English content through i18n files.
- Responsive layout for mobile and desktop.
- SEO basics, sitemap, robots, metadata, and Vercel deployment readiness.
- Security and integration support for contact/booking scripts where needed.

### Architecture and Technical Decisions

- I chose Next.js, React, and TypeScript for a portfolio site ready for deployment.
- I used Tailwind CSS and reusable UI components for consistent styling.
- I kept translatable content in `src/i18n/pl.ts` and `src/i18n/en.ts` so copy can be edited without hunting through components.
- I used component sections such as Hero, Projects, Services, Skills, Experience/Profile, and Contact to keep the page maintainable.
- I chose Cal.com embed for booking instead of building scheduling logic from scratch.
- I used Resend and Turnstile-related dependencies for contact/security capabilities.
- I included sitemap and robots routes for discoverability.
- I prepared the project for Vercel deployment with standard Next.js scripts.

### Delivery Phases

1. Site foundation: Next.js app, global styles, layout, typography, and responsive structure.
2. Content model: Polish and English content files, language context, and language switcher.
3. Core sections: hero, profile, services, skills, experience, projects, and contact.
4. Contact and booking: contact dialog/form, Cal.com embed, CTA labels, validation/security dependencies, and UX refinements.
5. SEO and production: metadata, sitemap, robots, CSP fixes for external scripts, Vercel build readiness, and documentation.
6. Portfolio polish: profile images, project presentation, responsive tuning, and final README.

### What Has Been Delivered

In the repository I delivered a Next.js portfolio site with localized content, profile imagery, project and service sections, contact/booking UI, reusable components, SEO routes, and deployment documentation. The commit history shows iterative work around contact and booking dialogs, Cal.com embed integration, CSP fixes for external services, CTA copy, and final portfolio polish.

### Acceptance Criteria

- Visitor can understand the owner, services, skills, and showcased projects from the first page.
- Site works on mobile and desktop without layout breakage.
- User can switch between Polish and English content.
- Contact and booking actions are visible and usable.
- Project content is easy to update through centralized content files.
- SEO routes and metadata exist for basic search/social readiness.
- Production build succeeds for Vercel deployment.

### Testing and Verification

- Run `npm run build` to verify production build readiness.
- Run `npm run lint` to verify linting.
- Manually test mobile and desktop layouts.
- Test language switching and confirm important sections update correctly.
- Test contact and booking flows, including dialog layout and external embed loading.
- Verify sitemap, robots, metadata, profile images, and main project cards render correctly.

### What This Project Shows

This project shows frontend presentation: content architecture, localization, responsive UI, contact/booking integrations, SEO basics, and deployment readiness. It also acts as the hub that connects the other portfolio projects into one coherent professional story.

### Future Improvements

- Add case-study pages for each major project.
- Add analytics for project clicks and contact conversions.
- Add automated visual regression checks for key sections.
- Add CMS-backed content editing if portfolio updates become frequent.
- Add richer testimonials or measurable project outcomes.

---

## Polski

### Cel projektu

Zbudowałem nowoczesną stronę portfolio, która prezentuje praktyczne aplikacje webowe, CRM-y, automatyzacje, technologie, doświadczenie i kontakt. Strona ma działać jako centrum projektów i kontaktu: pokazywać realne projekty i ułatwiać kontakt.

### Problem i użytkownicy

Zaprojektowałem to dla potencjalnych klientów, współpracowników i osób sprawdzających moje projekty, którzy chcą szybko zrozumieć, co buduję, jakich technologii używa i jak można się z nim skontaktować albo umówić rozmowę. Tym projektem rozwiązuję problem rozproszonego proof of work, układając projekty, umiejętności, usługi i kontakt w jedną spójną obecność w sieci.

### Zakres funkcjonalny

Zakres projektu rozpisałem na:

- Sekcję hero z jasnym pozycjonowaniem i zdjęciem profilowym.
- Sekcję projektów prezentującą aplikacje portfolio.
- Sekcje usług i umiejętności pokazujące typ pracy.
- Treści doświadczenia/profilu.
- Flow kontaktu z formularzem i czytelnymi CTA.
- Flow umawiania rozmowy przez embed Cal.com.
- Treści po polsku i angielsku przez pliki i18n.
- Responsywny layout dla mobile i desktop.
- Podstawy SEO: sitemap, robots, metadata i gotowość wdrożenia na Vercel.
- Obsługę bezpieczeństwa i integracji dla formularza/booking scripts tam, gdzie potrzebne.

### Architektura i decyzje techniczne

- Next.js, React i TypeScript jako produkcyjna baza portfolio.
- Tailwind CSS i komponenty UI dla spójnego stylowania.
- Treści tłumaczeń w `src/i18n/pl.ts` i `src/i18n/en.ts`, żeby copy można było edytować bez szukania w komponentach.
- Sekcje komponentowe Hero, Projects, Services, Skills, Experience/Profile i Contact dla utrzymania strony.
- Embed Cal.com zamiast budowania własnej logiki kalendarza.
- Zależności Resend i Turnstile jako podstawa funkcji kontaktu i ochrony formularza.
- Sitemap i robots dla discoverability.
- Przygotowanie do Vercel przez standardowe skrypty Next.js.

### Etapy realizacji

1. Fundament strony: aplikacja Next.js, globalne style, layout, typografia i responsywna struktura.
2. Model treści: pliki PL/EN, kontekst języka i przełącznik języka.
3. Główne sekcje: hero, profil, usługi, umiejętności, doświadczenie, projekty i kontakt.
4. Kontakt i booking: dialog/formularz, embed Cal.com, CTA, zależności walidacji/bezpieczeństwa i poprawki UX.
5. SEO i produkcja: metadata, sitemap, robots, poprawki CSP dla zewnętrznych skryptów, build Vercel i dokumentacja.
6. Portfolio polish: zdjęcia profilowe, prezentacja projektów, responsywność i finalne README.

### Co zostało zrobione

W repozytorium dowiozłem stronę portfolio w Next.js z lokalizowanymi treściami, zdjęciami profilowymi, sekcjami projektów i usług, UI kontaktu/booking, komponentami wielokrotnego użytku, trasami SEO i dokumentacją wdrożenia. Historia commitów pokazuje iteracje wokół kontaktu i booking dialogów, integracji Cal.com, poprawek CSP dla zewnętrznych usług, etykiet CTA i finalnego polishu portfolio.

### Kryteria akceptacji

- Odwiedzający rozumie właściciela, usługi, umiejętności i projekty z pierwszej strony.
- Strona działa na mobile i desktop bez rozjechanego layoutu.
- Użytkownik może przełączać treści PL/EN.
- Kontakt i booking są widoczne i używalne.
- Treści projektów można łatwo aktualizować przez scentralizowane pliki.
- Istnieją trasy SEO i metadata dla podstawowej widoczności.
- Build produkcyjny działa pod wdrożenie Vercel.

### Testowanie i weryfikacja

- Uruchomić `npm run build`, żeby sprawdzić gotowość produkcyjną.
- Uruchomić `npm run lint`, żeby sprawdzić linting.
- Ręcznie sprawdzić layout mobile i desktop.
- Przetestować przełączanie języka i upewnić się, że ważne sekcje zmieniają treść.
- Przetestować kontakt i booking, w tym layout dialogów i ładowanie zewnętrznego embedu.
- Zweryfikować sitemap, robots, metadata, zdjęcia profilowe i główne karty projektów.

### Co pokazuje ten projekt

Tym projektem pokazuję frontend nastawiony na prezentację projektów i mojej pracy: architekturę treści, lokalizację, responsywny UI, integracje kontaktu/booking, podstawy SEO i gotowość do wdrożenia. Jest też hubem, który łączy pozostałe projekty portfolio w jedną spójną historię zawodową.

### Możliwe dalsze kroki

- Dodać osobne case study dla każdego większego projektu.
- Dodać analitykę kliknięć w projekty i konwersji kontaktu.
- Dodać automatyczne visual regression checks dla kluczowych sekcji.
- Dodać CMS, jeśli aktualizacje portfolio będą częste.
- Dodać mocniejsze testimonials albo mierzalne efekty projektów.
