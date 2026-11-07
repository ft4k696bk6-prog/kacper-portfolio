# Brief wykonawczy: +2000 nowych poradników na bernecki.dev

**Odbiorca:** równoległa sesja / projekt Programmatic SEO na gałęzi `feat/programmatic-seo-20261107`.

**Cel:** 2000 **NOWYCH, niezależnych merytorycznie** poradników rozwiązujących rzeczywiste problemy (nie 2000 wariantów tych samych 100 wpisów). Już opublikowanych wpisów w `src/content/guides.ts` i `src/content/pseo/guides.ts` **nie wliczać**. **Żaden szkic, niezweryfikowana sugestia ani sam tytuł nie jest poradnikiem.**

## Stan wejściowy sprawdzony 2026-11-07
- Gałąź PSEO posiada scalony katalog `src/lib/guide-directory.ts`, kategorie, wyszukiwanie, paginację po 24 rekordy, automatyczny sitemap, ISR i kontrolę części duplikatów.
- `docs/pseo-backlog.json` ma już 144 pozycje ze statusem backlog (nie są artykułami, nie są indeksowane).
- `src/content/pseo/guides.ts` ma 4 dodatkowe pełne teksty. Zachować istniejące treści i równoległe zmiany.
- Nie wolno ślepo scalać bieżącego `main` z innymi gałęziami bez przejrzenia diffu; trwają równoległe prace nad stroną.
- Zmiany dotyczą wyłącznie `/poradniki`, ich treści, indeksacji, wyszukiwarki i narzędzi SEO. Nie dotykać hero, zdjęcia, portfolio, czatu AI ani CRM.

## Podział 2000 nowych poradników — *przybliżony plan*, nie deklaracja istniejących treści

| Domena tematyczna | Docelowa liczba NOWYCH artykułów |
| --- | ---: |
| Next.js, React, TypeScript | 250 |
| Supabase, PostgreSQL, RLS i Auth | 200 |
| Vercel, hosting, DNS i wdrożenia | 175 |
| GitHub, npm, Git, CI/CD | 125 |
| Meta Ads, Facebook Lead Ads, Conversions API | 225 |
| SEO, Google Search Console, indeksacja, widoczność AI | 225 |
| WordPress, WooCommerce i CMS | 200 |
| Domeny, iCloud Mail, SPF/DKIM/DMARC i poczta | 175 |
| Formularze, webhooki, API i integracje | 175 |
| Mobilny UX, Core Web Vitals, dostępność | 100 |
| OpenRouter, LLM API i koszty AI | 75 |
| Bezpieczeństwo, sesje, MFA, uprawnienia | 75 |
| **Razem** | **2000** |

Kwoty są *sufitem roboczym*, nie powodem do wymyślania tematów. Obszary z niedostateczną liczbą oryginalnych zagadnień zmniejszyć i przenieść zasoby do tych o potwierdzonym zapotrzebowaniu. W pierwszej kolejności wyczerpać i oczyścić istniejące 144 tematy w kolejce.

## Główna procedura
1. Zbierz problem (wiadomości użytkownika, udostępnione screenshoty, rzeczywiste logi Vercel/GitHub, oficjalna dokumentacja, intencja wyszukiwania). Odróżnij autentycznie stwierdzony błąd od typowego problemu opisanego w dokumentacji.
2. Sprawdź `allGuides`, `docs/pseo-backlog.json`, historię git i podobne tytuły. Odrzuć duplikaty semantyczne, nie tylko identyczne `slug`.
3. Wyodrębnij **dokładny objaw + system + konkretną przyczynę lub proces diagnostyczny**. Jeśli różnica między dwoma planowanymi wpisami sprowadza się do zamiany platformy, wersji lub miasta bez zmiany rozwiązania, połącz je w jeden artykuł.
4. Przygotuj oryginalny wpis: objaw, środowisko/wersja, 2–4 hipotezy i testy rozróżniające, naprawa krok po kroku, realny fragment kodu/logu jeśli przydatny, weryfikacja, pułapki, oficjalne źródła, data sprawdzenia.
5. Jeśli możliwe, dołącz zanonimizowany autentyczny screenshot lub log. **Nie nazywaj logu ani ilustracji „naszym błędem”, jeśli nie ma potwierdzenia.** Nie używaj losowych grafik z internetu; zabronione są wymyślone screenshoty z błędami.
6. Przegląd jakości: faktografia, linki, unikalność rozwiązania, realna przydatność, dostępność, brak danych poufnych, brak nadmiernej autoreklamy. Nie podawać sztywnych pozornych progów liczby słów.
7. Publikacja wyłącznie wpisów ze statusem `published`; backlog i szkice nigdy nie wchodzą do sitemap ani publicznego katalogu. Buduj małe partie 25–50, monitoruj wyniki co 50–100 opublikowanych poradników.
8. Testy `npm run pseo:check`, typecheck, lint, build; sprawdź sitemap, canonical, Article JSON-LD, status 200, mobile, indeksowanie oraz zakres renderowania ISR.
9. Mierz wejścia i indeksację w Search Console. Tematy bez intencji lub realnego rozwiązania oznacz jako `rejected`, nie publikuj „dla liczby”.

## Udokumentowane przypadki z naszych projektów — pierwszeństwo
Szczegółowe, potwierdzone przypadki i identyfikatory wdrożeń: `docs/pseo-provenance-cases.json`. Każdy z nich może być bazą odrębnego artykułu po sprawdzeniu, czy nie jest już opisany.

### Obrazy ze starszych rozmów
- `IMG_1613.png`: rzeczywisty ekran Google Search Console z komunikatem „Nieprawidłowy adres mapy witryny”.
- `IMG_1612.png`: wcześniejszy ekran przesyłania mapy witryny.
- `IMG_1614.png`: rzeczywisty ekran weryfikacji Profilu Firmy Google wymagający nagrania wideo.
- Pliki znajdują się w bibliotece użytkownika; nie udawać, że są już w repozytorium. Przed publikacją wykonać anonimizację i upewnić się, że sposób użycia odpowiada kontekstowi artykułu.

## Jak oceniać postęp
Prowadzić rozłączne liczniki:
- `ideas`: propozycje tematów do researchu (nigdy nie nazywać ich „poradnikami”).
- `ready`: zweryfikowane, opracowane teksty oczekujące na review.
- `published`: nowe pełne artykuły uruchomione i zweryfikowane pod właściwymi URL.
- `indexed`: osobny stan, tylko na podstawie faktycznej wiedzy z Search Console.
- `rejected`: duplikaty, błędne/mało wartościowe koncepcje.

**Definicja ukończenia:** 2000 nowych, użytecznych, różnych opublikowanych poradników i testy produkcyjne — a nie 2000 wygenerowanych slugów czy 2000 pomysłów.

## Kryteria redakcyjne w SEO i AI
Priorytet: rzeczywiste problemy, kod i dowody, nie „AI tricks”. Google wyraźnie wskazuje, że masowe treści bez wartości są *scaled content abuse*:
- https://developers.google.com/search/docs/essentials/spam-policies
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content/
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

Żadne 2000 nowych stron nie daje gwarancji indeksacji, pozycji ani rekomendacji w odpowiedziach AI.
