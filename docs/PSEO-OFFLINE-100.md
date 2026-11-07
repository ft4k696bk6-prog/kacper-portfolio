# pSEO offline: 100 niezależnych poradników

## Cel
Opublikować partię 100 praktycznych poradników na bernecki.dev bez generowania tekstu w czasie działania strony i bez wywołań OpenRouter/AI przez generator tej partii.

## Jak działa
- Pięć wersjonowanych zestawów danych w `src/content/pseo/offline/` obejmuje **100 konkretnych problemów** i niezależnych instrukcji.
- Każda pozycja ma unikalny slug, objaw, przyczynę, dwa kroki diagnostyczne, dwa kroki naprawy, test wyniku, ostrzeżenie i źródło dokumentacji.
- `src/content/pseo/offline-guides.ts` przekształca te rekordy w standardowe poradniki. Nie wysyła niczego do modelu ani do zewnętrznego API.
- `src/lib/guide-directory.ts` łączy stare wpisy, AI Autopilot i nowe poradniki offline w jeden katalog; wszystkie opublikowane URL trafiają automatycznie do sitemap.

## Liczby według plików
| Zestaw | Artykuły |
| --- | ---: |
| Next.js, React, TypeScript | 21 |
| Supabase i PostgreSQL | 21 |
| Vercel i GitHub Actions | 20 |
| SEO Google i WordPress | 20 |
| Meta Ads, poczta, HTTP / API | 18 |
| **Razem** | **100** |

## Linkowanie
- Każdy poradnik posiada link do swojego hubu kategorii, głównego katalogu, usługi i do maksymalnie 10 powiązanych merytorycznie poradników.
- Na stronie poradnika znajduje się osobne przejście do pięciu innych kategorii.
- Katalog oraz huba kategorii mają linki HTML do kolejnych numerowanych stron (bez jednorazowego renderowania tysięcy kart).
- Paginacja kategorii i katalogu ma własny adres kanoniczny, bez podszywania się pod stronę pierwszą.
- Każdy poradnik ma link do oficjalnej dokumentacji. Nie kupujemy sztucznych backlinków i nie budujemy ukrytych farm linków.

## Sprawdzenie jakości
- `src/lib/guide-directory.test.ts` testuje dokładnie 100 rekordów offline, poprawne URL, unikalność tytułów, unikalność slugów, strukturę i przypisanie kategorii.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run pseo:qa`, `npm run build`.
- Po wdrożeniu należy sprawdzić `/sitemap.xml` i próbkę produkcyjnych URL, a potem indeksację w Search Console.

## Co dalej z automatem
Automat AI nadal jest osobną, już działającą funkcją GitHub Actions. Jego generator został rozszerzony, aby sprawdzał również 100 nowych wpisów offline i nie powielał ich tytułów lub adresów. **Samodzielne tworzenie kolejnych unikalnych, zweryfikowanych poradników bez AI wymaga nowych poprawnych rekordów źródłowych** (takich jak w zestawach offline). Samo pobranie tytułu issue lub podmienienie nazwy platformy nie wystarcza do rzetelnej publikacji. Nie wolno przedstawiać liczby propozycji jako opublikowanych artykułów.

Oficjalne wytyczne Google:
- https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- https://developers.google.com/search/docs/essentials/spam-policies
