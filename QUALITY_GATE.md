# Bernecki World — etap premium

**8,8/10.** Ocena po porównaniu kadrów produkcyjnych i sprawdzeniu interakcji. Największe rezerwy pozostały w realizmie modeli i płynności na słabszym rendererze. [Kadry desktop i mobile](docs/world/README.md#kadry-z-buildu-produkcyjnego)

| Obszar | Ocena | Co sprawdzono |
| --- | ---: | --- |
| Realizm 3D | 8,1 | HDRI, mapy PBR, kontaktowe przyciemnienie, odbicia i detale elewacji są widoczne w zbliżeniach. Niektóre budynki, rośliny i postać zachowują styl miniatury. |
| Estetyka premium | 9,2 | Spójna paleta, spokojna typografia, czytelne karty i miękkie oddzielenie zbliżenia od tła. |
| Pierwsze wrażenie | 9,0 | Ujęcie całej kuli przechodzi po wyborze w przelot do miejsca osadzonego na jej powierzchni. |
| Minimalizm | 9,5 | Na wejściu widać glob, logo, tytuł, menu i krótką wskazówkę. Etykiety i treści pojawiają się przy interakcji. |
| Animacja | 9,0 | Sprawdzono obrót, lot na drugą stronę kuli, zmianę projektu, powrót i ograniczenie ruchu. |
| UX | 9,3 | Obiekty, menu, klawiatura, dotyk, link do projektu i widok klasyczny mają działające ścieżki. |
| Wydajność | 7,6 | Materiały i pojazdy są pobierane przy zbliżeniu, bez obciążania pierwszego widoku. Na rendererze programowym płynność lotu silnie zależy od profilu. |
| Mobile | 8,8 | Menu i karta mają własny układ, a środek kuli pozostaje stabilny. Dotyk sprawdzono w profilach Chromium i WebKit. |

## Weryfikacja

- Produkcyjny build, TypeScript, weryfikacja PL/EN i 355 testów Vitest przeszły. ESLint zwrócił 0 błędów i 15 istniejących ostrzeżeń.
- Playwright sprawdził siedem rozmiarów ekranu, stały środek i skalę globu, ukryte menu, klawiaturę i powrót fokusu, kliknięcie modelu, dotyk, przelot i powrót, szyld B-CRM, wczytywanie pojazdów i materiałów, ruch maskotki, widok bez WebGL oraz Classic. Axe zwrócił 0 naruszeń z otwartym i zamkniętym menu w PL, EN i UK.
- 41 tras zwróciło HTTP 200. Zweryfikowano adresy kanoniczne, hreflang, sitemap, robots.txt i Open Graph.

## Pomiary

Build produkcyjny uruchomiony w Linuksie bez sprzętowego GPU. Pierwsza klatka jest liczona od nawigacji do gotowości sceny WebGL. FPS jest medianą tempa aktualizacji projekcji w zarejestrowanych fragmentach przelotów.

| Profil przeglądarki | Pierwsza klatka | Mediana aktualizacji |
| --- | ---: | ---: |
| Chromium SwiftShader, 1440 × 900 | 2,83 s | 18,2 FPS (4 próbki) |
| Chromium SwiftShader, Pixel 7 | 2,00 s | 20,9 FPS (6 próbek) |
| WebKit WPE, 1440 × 900 | 2,94 s | 12,4 FPS (6 próbek) |
| WebKit WPE, iPhone 13 | 1,51 s | 51,8 FPS (6 próbek) |

Scena w uproszczonym profilu pobrała ok. 331 kB skompresowanego JavaScriptu i 531 kB obrazów przed wyborem projektu. Pełny profil pobiera też atlas HDRI. Płynność na fizycznych telefonach i komputerze ze sprzętowym GPU wymaga odrębnego pomiaru.

Mobilny profil Lighthouse 13.6 w tym środowisku uzyskał 61/100 Performance oraz po 100/100 za Accessibility, Best Practices i SEO. FCP 0,9 s, LCP 3,3 s, TBT 4,21 s i CLS 0,001.
