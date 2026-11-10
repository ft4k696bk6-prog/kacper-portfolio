# Bernecki Tools — katalog i plan (2026-11-11)

## Zasady
- Zachować istniejące 45 narzędzi SEO/marketing/CRM i ich osobne PL/EN URL.
- Portfolio pozostaje portfolio. Jeden link do narzędzi, katalog na /narzedzia oraz /en/tools, osobne centra tematyczne.
- Bez logowania, płatnych API i utrudniających reklam, jeśli to możliwe. Przetwarzanie poufnych plików lokalnie w przeglądarce.
- Nie tworzyć atrap funkcji ani masowo cienkich podstron tylko dla SEO.
- Nigdy nie oznaczać wdrożenia jako zakończonego bez trzech pozytywnych rund QA.

## Etap A: pierwsze osiem modułów w gałęzi
- Porządkowanie tekstu: spacje, znaki niewidoczne, duplikaty, duże/małe litery.
- Kalkulator procentów: wzrost, spadek, procent z kwoty, różnica.
- Generator bezpiecznych haseł: kryptograficzny RNG, wybór grup znaków.
- Konwerter zdjęć: JPG/PNG/WebP, zmiana maksymalnego wymiaru i jakości (HEIC zależne od przeglądarki).
- Losowanie z listy.
- Podstawowy kreator stopki e-mail: podgląd i kopiowanie formatowanego HTML, statyczna wersja w kliencie poczty.
- Test refleksu.
- Autorska Klawiaturowa Galaktyka: pełny ekran, litery/cyfry, symbole, smugi dotyku i kursora, tła.
Dwa URL: /narzedzia/codzienne oraz /en/tools/everyday. Oba katalogi główne zawierają dyskretne wejście. Nie wymaga to zmiany struktury istniejących 45 narzędzi.

## Backlog docelowy — kandydaci, nie wdrożone funkcje
### PDF i dokumenty (18)
Łączenie, dzielenie, obracanie, kompresja, numerowanie stron, znaki wodne, wyciąganie stron, PDF do JPG/PNG, zdjęcia do PDF, zmiana kolejności, podgląd, anotowanie, podpis graficzny, metadane PDF, usuwanie metadanych, porównywanie PDF, edycja pól formularzy PDF, skanowanie do PDF.

### Zdjęcia i grafika (20)
HEIC/JPG/PNG/WebP/AVIF, kompresja, redukcja rozmiaru, crop, obrót, odbicie, zdjęcia dokumentowe, transparentne tło, usuwanie tła, kolor picker, paleta, kontrast WCAG, gradienty CSS, kolaże, porównanie przed/po, favicon, watermark, miniaturki social, EXIF i GPS, pixel art, generator siatek.

### Tekst (17)
Licznik znaków, licznik słów, czyszczenie tekstu, usuwanie duplikatów, porównywanie wersji, sortowanie linii, Markdown->HTML, HTML->TXT, OCR, zamiana wielkości liter, usuwanie formatowania AI, zamiana znaków specjalnych, tekst bez polskich znaków, tekst z numeracją, CSV->JSON, PDF->TXT, proste edytowanie SRT.

### Kalkulatory (18)
Procenty, rabaty, VAT, marża, narzut, raty, lokata, procent składany, oszczędzanie na cel, przelicznik jednostek, daty, dni robocze, koszt paliwa, podział rachunku, średnia ważona, wynagrodzenie brutto/netto (z aktualizowaną wiedzą prawną), koszt subskrypcji, koszt ogrzewania (założenia jawne).

### Firma i praca (15)
Kreator stopki premium, szablony stopek, opcjonalne animowane GIF-y, wizytówki, vCard, QR do opinii, generator pro formy, generator ofert PDF, generator etykiet, cennik do druku, harmonogram zadań, planer dyżurów, prosty kosztorys, kalkulator pracownika, protokół zdawczo-odbiorczy.

### Internet i prywatność (15)
QR z logo, QR Wi-Fi, QR vCard, generator haseł, lokalny test siły hasła, metadane zdjęć, usuwanie EXIF, informacje o przeglądarce, test klawiatury, test ekranu, test mikrofonu, test kamery, URL encoding, pobieranie elementów HTML, analiza bezpieczeństwa HTTPS (częściowo istnieje).

### Programowanie (18)
JSON, YAML, JWT, UUID, SHA, Base64, timestamp, regex, URL builder, cron parser, HTML entities, CSS minifier, SVG optimizer, generator CSS gradient, JSON diff, mock data, hex dump, generowanie pól formularza. Część już działa w istniejącym toolboxie — nie dublować!

### AI i pochodzenie (8)
Walidacja C2PA, odczyt EXIF/software, inspekcja metadanych generatora, detektor obrazów na sprawdzonym modelu, detektor tekstów ze szczególnie ostrożnymi wynikami, raport o kompresji, OCR i ekstrakcja, anonimizacja dokumentów. Wynik procentowy tylko z realnego, przetestowanego modelu; nie jest dowodem autorstwa. Może być brak rozstrzygnięcia.

### Audio / wideo (12)
MP4->GIF, wideo->klatki, wycinanie wideo, wyciszanie, MP3/WAV/OGG, łączenie krótkich ścieżek, regulacja głośności, wycinanie ciszy, waveform, edytor SRT, zmiana szybkości, nagrywanie głosu lokalnie. Uważać na rozmiary bibliotek WASM na telefonach.

### Proste gry (20)
Snake, Pong, Breakout, Memory, 2048, Sudoku, Minesweeper, Wordle-podobna oryginalna gra, Tic Tac Toe, Connect Four, statki, puzzle, test pisania, test refleksu (już jest), koło fortuny, quiz, zgadywanie liczb, szachy z licencjonowanym silnikiem, platformówka 2D, kosmiczna strzelanka, wyścigi 2D.

### Dla dzieci (18)
Klawiaturowa galaktyka (już jest), litery PL/EN, cyfry, interaktywne kolorowanki, malowanie palcem, baloniki, efekty kursora, myszkowe smugi, pamięć obrazkowa, dopasowywanie kształtów, zwierzęta i dźwięki, planety, alfabet, układanka, kolory, proste piano, litery sylabami, mała platformówka. Brak reklam i zewnętrznych linków podczas zabawy, bez dźwięku domyślnie, pełen ekran i dotyk.

### Retro i stare PC (6 grup)
Oryginalne gry inspirowane estetyką DOS; porty open source; prawidłowo licencjonowany freeware; shareware z wyraźną zgodą na dystrybucję; legalne tytuły na js-dos; mobilne wersje z kontrolami dotykowymi. Samo „abandonware” nie daje prawa do hostowania gry.

## Układ witryny
1. Główny nagłówek: portfolio + pojedynczy link „Narzędzia”. Bez wyświetlania kilkudziesięciu linków w hero.
2. Katalog: wyszukiwarka, kategorie, wyróżnione narzędzie audytu, wejście do „Codziennych” oraz do „Gier”.
3. Osobne kategorie: Biznes/SEO, Pliki i PDF, Zdjęcia, Tekst, Kalkulatory, Kreatory, Prywatność/AI, Programiści, Gry, Dla dzieci.
4. Docelowo narzędzia mają własne krótkie, kanoniczne, dwujęzyczne adresy — tylko gdy faktycznie działają.
5. Spójne komponenty: wejście, walidacja, wynik, kopiowanie/eksport. Ciemnoszary i srebrny branding bez osobnej krzykliwej stylistyki.
6. Gry otwierają się w odseparowanym widoku, z funkcją pełnego ekranu i bez menu w czasie grania. Ładować dopiero po wejściu.
7. Asystent AI może polecać rzeczywiście istniejące narzędzia; nigdy nie deklaruje wykonania obliczeń, których nie wykonał.
8. Wszystkie teksty PL/EN pisane i weryfikowane osobno; hreflang, kanonikalne, sitemap i poprawne etykiety.
9. Pliki lokalne nie są przesyłane do zewnętrznego serwera bez wyraźnej zgody; limity rozmiaru i komunikaty o braku obsługi formatów.
10. Mierzyć rzeczywiste użycie, Core Web Vitals i wpływ na zapytania ofertowe. Unikać treści SEO bez wartości.

## Kolejność wdrażania
A. 8 lekkich narzędzi + gra dla dzieci + PL/EN + katalog.
B. Centrum PDF, zdjęć, QR i prywatności plików.
C. Kreator stopek zaawansowanych: gotowe szablony, loga, warianty ciemne i jasne, GIF z fallbackiem; testy Gmail/Outlook/Apple Mail.
D. Gry własne i legalnie licencjonowane porty retro, osobne tryby mobile.
E. Weryfikacja obrazów i tekstów AI: najpierw benchmark, potem wdrożenie modelu i uczciwa prezentacja ograniczeń.
F. Optymalizacja katalogu na podstawie użycia oraz usuwanie słabych lub zbyt podobnych funkcji.

## 3 niezależne rundy QA przed produkcją
I. CI: eslint, TypeScript, Vitest, build oraz regresja wcześniejszych 45 narzędzi.
II. Browser funkcjonalny: zdjęcia, tekst, hasła, liczby, losowania, stopki, pełny ekran, klawiatura, timer, clipboard, dane niepoprawne.
III. UX i i18n: desktop/mobile, poziomy overflow, widoczność focusa, czytelność PL/EN, meta, aria, linki, wygląd, dostępność, wyniki w Safari/Chrome tam, gdzie możliwe.
Każda nieudana kontrola blokuje połączenie z main. Prowadzić dziennik testów w PR.
