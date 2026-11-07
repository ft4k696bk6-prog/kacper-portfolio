# Programmatic SEO — bernecki.dev

## Cel i zakres

Docelowo nawet **5000 odrębnych problemów**, bez tworzenia 5000 stron wypełnionych zamienianymi słowami. Każda publikacja musi odpowiadać na realne pytanie, opisywać właściwą diagnostykę i dawać możliwość sprawdzenia wyniku. Zgodnie z zasadami Google, masowe tworzenie nieoryginalnych stron dla pozycji w wyszukiwarce może być uznane za *scaled content abuse*.

## Co zostało wdrożone

- **Wspólne źródło artykułów:** `src/lib/guide-directory.ts` łączy istniejące `src/content/guides.ts` (razem z importowanymi stamtąd poradnikami) i nowe `src/content/pseo/guides.ts`. Nie usuwa dotychczasowych wpisów i nie wymaga ręcznego dopisywania URL do sitemap.
- **Wielokrotne szablony danych, jeden solidny widok:** `src/app/poradniki/[slug]/page.tsx` obsługuje oba rodzaje treści z tym samym kanonicznym adresem, nagłówkiem, treścią, źródłami i danymi strukturalnymi Article.
- **Topical clusters:** `/poradniki/tematy/[kategoria]` to tematyczne strony nawigacyjne. Reguły klasyfikacji są w `src/lib/guide-directory.ts`. W przypadku dwuznaczności należy poprawić regułę lub dodać jawne przypisanie.
- **Hub poradników:** `/poradniki` ma wyszukiwanie po problemie i paginację co 24 wpisy. Nie renderuje jednocześnie 5000 kart.
- **Linki wewnętrzne:** każdy poradnik pokazuje do sześciu najbardziej powiązanych poradników zamiast listować wszystkie podstrony.
- **ISR:** pierwsze 100 poradników może zostać wyrenderowanych na etapie kompilacji, pozostałe na żądanie z rewalidacją po 24 h. Nie trzeba budować wszystkich 5000 stron podczas jednego wdrożenia.
- **Sitemap:** automatycznie zawiera opublikowane artykuły ze wszystkich źródeł i niepuste kategorie. Nawet przy 5000 podstronach mieści się w typowym limicie 50 000 adresów mapy witryny.
- **Kontrola jakości:** `src/lib/guide-directory.test.ts` sprawdza duplikaty slugów i tytułów, jakość struktury nowych wpisów i działanie katalogu.
- **Kolejka tematów:** `docs/pseo-backlog.json` to plan tematów do opracowania; nie są widoczne dla robotów. Wpisy można przeglądać poleceniem `npm run pseo:backlog`.

## Wprowadzanie nowego poradnika

1. Sprawdź, czy problem nie ma już swojej podstrony (wliczając starsze poradniki przygotowywane w innych sesjach).
2. Ustal dokładny **objaw**, **przyczynę**, **czynności diagnostyczne**, **naprawę**, **kryteria testu** i **typowe błędy**. Nie nazywaj hipotetycznej procedury „sprawdzonym sposobem z mojego projektu”, jeżeli brak potwierdzenia.
3. Dopiero gotowy i zweryfikowany wpis dodaj jako rekord do `publishedEntries` w `src/content/pseo/guides.ts`. Od chwili publikacji trafia do katalogu i sitemap automatycznie.
4. Uzupełnij źródła, najlepiej oficjalną dokumentacją. Nie kopiuj tekstów źródłowych w dużych fragmentach.
5. Uruchom `npm run pseo:check`, `npm run typecheck`, `npm run lint` i `npm run build`. Każda poprawka powinna przejść CI.
6. Po wdrożeniu sprawdź produkcyjny URL, canonical, JSON-LD, sitemap, logi i faktyczne renderowanie tekstu w HTML.
7. Monitoruj indeksację, wyświetlenia, CTR i zapytania w Search Console. Zgłoszenie URL przez sitemap/IndexNow **nie gwarantuje indeksacji ani cytowania przez AI**.

## Zasady skalowania do 5000

- Prowadź kolejkę z odrębnymi pytaniami, nie listę miast/produktów różniących się jednym słowem.
- Publikuj partiami po przeglądzie jakości. Nie ma sensu uruchamiać 5000 pustych tras ani generować automatycznych FAQ z niezweryfikowanymi odpowiedziami.
- Co każde 50–100 opublikowanych wpisów zbadaj pokrycie tematów, indeksację, duplikaty oraz jakość interlinkowania. Zmieniające się interfejsy Meta/Vercel/Supabase wymagają okresowej kontroli procedur.
- Zanonimizuj wszelkie dane klientów, maile, identyfikatory użytkowników, tokeny, sesje i klucze API w przykładach.
- Nie publikuj wspomnień o incydentach czy diagnozach, których nie potwierdza repo, logi albo dokumentacja.
- Jeśli po zwiększeniu liczby stron build zwalnia, utrzymuj tylko ważne pre-renderowane trasy i korzystaj z ISR oraz paginacji. Przy ponad 50 000 adresach rozważ podział sitemap.

## Komendy

```bash
npm run pseo:backlog
npm run pseo:backlog -- --category=supabase-bazy --limit=20
npm run pseo:check
npm run typecheck
npm run build
```

## Źródła standardów

- Google Search Central: https://developers.google.com/search/docs/essentials/spam-policies
- Next.js App Router, generateStaticParams: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
- Next.js Sitemap: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
