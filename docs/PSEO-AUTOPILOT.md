# Automatyczne poradniki pSEO — instrukcja obsługi

## Co robi system

Każdego dnia o **03:23 czasu Europe/Warsaw** GitHub Actions uruchamia `scripts/pseo-autopilot.mjs`. Pierwszy przebieg jest też podejmowany automatycznie po dodaniu workflow do gałęzi `main`.

1. Czyta kolejkę istniejących 144 pomysłów w `docs/pseo-backlog.json`. Gdy się wyczerpie, sprawdza zamknięte zgłoszenia błędów w wybranych publicznych repozytoriach GitHub (Next.js, Supabase, React, Vite, GitHub Actions i WordPress). **Nie wykonuje automatycznych zapytań do wyszukiwarki Google.**
2. Odrzuca duplikaty tytułów i tematów względem opublikowanej bazy.
3. Zamawia polski tekst diagnostyczny przez OpenRouter.
4. Sprawdza strukturę, unikalność, linki do oficjalnej dokumentacji, sekrety i minimum wartościowej treści.
5. Wykonuje **odrębny przebieg AI oceniający** poprawność, konkretność i źródła. Próg minimum 88/100, a wszelkie flagi błędów blokują publikację.
6. Uruchamia testy pSEO, walidację TypeScript, lint i produkcyjny build. Dopiero po przejściu całości commit trafia na `main`; z niego powinno uruchomić się wdrożenie Vercel.
7. Raport przebiegu pokazuje próbę, zatwierdzone, odrzucone, koszt szacunkowy. Zatrzymuje się po osiągnięciu 5000 łącznych poradników.

## Uwierzytelnianie bez dodatkowego klucza (GitHub OIDC → Vercel)

W domyślnej konfiguracji **nie trzeba niczego kopiować do GitHub Secrets**. Automat uzyskuje krótkotrwały token GitHub Actions OIDC (uprawnienie `id-token: write`) i przesyła go tylko do `https://bernecki.dev/api/pseo-bridge`. Serwer Vercel weryfikuje podpis JWT oraz dokładną tożsamość repozytorium, gałęzi `main` i pliku workflow; dopiero wtedy wywołuje OpenRouter za pomocą istniejącej serwerowej zmiennej `OPENROUTER_API_KEY`. **Klucz nigdy nie trafia do GitHub Actions ani odpowiedzi API.**

To działa tylko wtedy, gdy na Vercel **rzeczywiście jest skonfigurowany i aktywny** istniejący klucz OpenRouter. Sam chatbot na stronie ma awaryjne odpowiedzi offline, więc działający widżet nie jest dowodem, że klucz jest poprawny. Pierwszy przebieg automatu jest testem end-to-end. Przy braku klucza na Vercel API zwróci status 503 i treści nie będą publikowane.

Alternatywnie, jeśli ktoś chce niezależny klucz dla generatora, może dodać do GitHub Actions repository secret `OPENROUTER_API_KEY` — wtedy skrypt użyje bezpośrednio OpenRouter bez mostka OIDC. **Nie ma takiej potrzeby, gdy klucz Vercel działa.**

Źródło modelu bezpieczeństwa: https://docs.github.com/en/actions/reference/security/oidc

### Opcjonalne ustawienia bez sekretów

Ustawiane w GitHub → Settings → Secrets and variables → Actions → **Variables**:

| Nazwa | Wartość domyślna | Funkcja |
| --- | --- | --- |
| `PSEO_DAILY_LIMIT` | `12` | Maks. przyjętych nowych artykułów w przebiegu, twardy limit 100 |
| `PSEO_MODEL` | `openai/gpt-5-mini` | Model OpenRouter |
| `PSEO_MAX_RUN_COST_USD` | `4` | Szacowany pułap kosztów wywołań w jednym przebiegu |

**Uwaga:** koszt jest estymowany na podstawie informacji zwróconych przez API; nie jest finansowym twardym limitem na poziomie dostawcy. Dodatkowy limit wydatków ustaw w panelu OpenRouter.

## Dlaczego na start 12/dzień, a nie 100

100/dzień jest technicznie osiągalne w tym samym przepływie. Jednak bez obserwacji faktycznej jakości tekstów, indeksowania, kosztów i błędów API byłaby to ryzykowna masowa publikacja. Najpierw 7–14 dni z limitem 12; po przeglądzie danych 25–50 i ewentualnie 100. Zmiana jednej GitHub Variable nie wymaga zmian w kodzie.

Przy 12 **zatwierdzonych** tekstach dziennie od ~104 istniejących stron dojście do 5000 zajęłoby ok. 408 dni. Przy 50 — ok. 98 dni; przy 100 — ok. 49 dni. W praktyce odrzucenia, niedobory tematów, koszty i błędy mogą spowolnić publikację. **Limit to maksimum, nie gwarancja.**

## Bezpieczeństwo i ograniczenia

- Żadnych losowych ilustracji udających prawdziwe screeny błędów. Pozyskane w rozmowach zdjęcia i logi są wykorzystywane dopiero po osobnym, zanonimizowanym przygotowaniu.
- Automatyczne AI QA nie gwarantuje prawdy w każdym artykule. W miarę wzrostu serwisu potrzebna jest regularna ręczna kontrola próbki tekstów i Search Console.
- Link HTTP 200 nie dowodzi poprawności wszystkich tez artykułu. System może odrzucić poprawny artykuł, jeśli źródło jest niedostępne.
- Zgłoszenia publiczne GitHub mogą dotyczyć wersji innych od obecnej. Nie przedstawiamy ich jako własnych awarii ani potwierdzonych napraw.
- Automatyczny commit na `main` wymaga prawa zapisu dla `GITHUB_TOKEN` i polityki repozytorium zezwalającej na takie zmiany. Jeśli branch protection zabrania pushów, workflow zakończy się błędem zamiast omijać ochronę.
- GitHub Actions nie zawsze startuje punktualnie; przekroczenia limitów API, niewystarczające saldo OpenRouter, brak źródeł lub niska jakość mogą dać 0 artykułów danego dnia.
- Wymiana kodu strony/poradników przez inne narzędzia i inne równoległe sesje może wywołać konflikt. W takim wypadku push jest blokowany, zamiast nadpisywać cudze commity.
- Ochrona SEO: masowa treść niskiej wartości może zostać uznana przez Google za scaled content abuse; **liczba 5000 nie jest kryterium jakości**: https://developers.google.com/search/docs/essentials/spam-policies

## Monitorowanie

- [GitHub Actions](https://github.com/ft4k696bk6-prog/kacper-portfolio/actions/workflows/pseo-autopilot.yml)
- Katalog: [bernecki.dev/poradniki](https://bernecki.dev/poradniki)
- Opublikowane auto treści: `src/content/pseo/autopilot-published.json`
- Stan kolejki i podsumowania: `docs/pseo-autopilot-state.json`
- Test lokalny: `npm run pseo:qa`, `npm run pseo:check`.
- Ręczny przebieg: GitHub Actions → **pSEO Autopilot** → **Run workflow** (opcjonalna liczba wpisów).

**Jeśli automatycznie generowany wpis nie przejdzie testów lub wdrożenie zawiedzie, nie twórz kolejnych masowych serii, zanim przyczyna zostanie naprawiona.**
