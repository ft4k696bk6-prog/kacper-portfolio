# Bernecki World — bramka jakości

**92/100.** Ocena dotyczy wydania z globem 3D, obrotem wokół jego środka i zbliżeniem po wybraniu miejsca. [Kadry produkcyjne](docs/world/README.md#kadry-z-buildu-produkcyjnego)

| Obszar | Ocena | Podstawa |
| --- | ---: | --- |
| Kierunek artystyczny | 14/15 | Ciemne tło, satelitarna mapa z chmurami i atmosfera kuli. Siedem kadrów sprawdzono w rzeczywistej przeglądarce. |
| Efekt pierwszego wejścia | 14/15 | Cała planeta w środku kadru, z rozpoznawalnymi miejscami i zaproszeniem do obrotu. |
| Świat 3D | 14/15 | Miejsca mają geometrię na całej powierzchni kuli. Auta wykorzystują szczegółowe siatki, a zabudowa i ruchomy miś mają formę stylizowanych miniatur. |
| Animacja i kamera | 14/15 | Obrót zachowuje środek i skalę. Animowany przelot do miejsca po drugiej stronie globu oraz powrót do centrum przeszły testy. |
| Interakcje i UX | 10/10 | Mysz, dotyk, klawiatura, kliknięcie modelu, karty, obrót, przełącznik trybów i dostęp do projektów bez WebGL działają. |
| Mobile | 9/10 | Glob zachowuje środek w testowanych rozmiarach, a wybór miejsca działa dotykiem. Na najmniejszym ekranie do dalszych pozycji mapy dociera się przewijaniem. |
| Wydajność i stabilność | 7/10 | Szczegółowe auta są ładowane przy wyborze StarCars i pojawiają się po przelocie. Oświetlenie globu jest uproszczone w rendererze programowym. Płynność zależy od profilu przeglądarki. |
| Oryginalność i marka | 5/5 | Autorskie miejsca, portret pluszaka oparty na zdjęciu właściciela, geometryczne detale misia i ruch na placu. |
| Funkcjonalność biznesowa | 5/5 | Sześć rzeczywistych realizacji, materiały z portfolio, linki do usług i kontakt. |

## Weryfikacja

- Build produkcyjny, TypeScript, 355 testów Vitest i weryfikacja PL/EN przeszły. ESLint zgłosił 0 błędów i 15 istniejących ostrzeżeń poza zmianą.
- Playwright sprawdził środek i skalę globu po obrocie, brak zoomu kółkiem, katalog przy stałym kadrze, kliknięcie modelu ReEnergy, animowany przelot do BeatMarket oraz powrót. Sprawdzono osiem głównych lokacji, ruch pluszaka, wczytanie GLB samochodów i tekstury asfaltu, tryb dotykowy, siedem rozmiarów i widok bez WebGL.
- W profilu iPhone 13 w WebKit WPE uruchomiono widok angielski i otwarto projekt dotykiem. Tryby Classic i Interactive oraz 41 tras, metadane, sitemap i adresy kanoniczne przeszły testy. Axe zwrócił 0 naruszeń w przeglądzie sceny dla PL, EN i UK.

## Pomiary

Lokalny build produkcyjny z kodu `c8a86fc`. Linux bez udostępnionego GPU, Chromium 156 ze SwiftShader i WebKit WPE 27.2. FPS to mediana z sześciu przejść między przeglądem a zbliżeniami. Czas pierwszej klatki liczono od nawigacji do pierwszej oznaczonej klatki WebGL.

| Profil | Pierwsza klatka 3D | Mediana podczas ruchu |
| --- | ---: | ---: |
| Chromium, 1440 × 900 | 4,02 s | 8,2 FPS |
| Chromium, Pixel 7 | 2,30 s | 19,0 FPS |
| WebKit, 1440 × 900 | 2,63 s | 13,4 FPS |
| WebKit, iPhone 13 | 1,69 s | 52,9 FPS |

Chromium pobrał około 332 kB skompresowanego JavaScriptu i 516 kB obrazów przed wejściem do StarCars. Model samochodu ma 549 kB i jest pobierany na żądanie. Płynność na fizycznych telefonach i komputerze z GPU pozostaje do zmierzenia.

Lighthouse 13.6.0 w profilu mobilnym dał **61 Performance, 100 Accessibility, 100 Best Practices i 100 SEO**. FCP 0,92 s, LCP 3,32 s, TBT 5,61 s i CLS 0,003.
