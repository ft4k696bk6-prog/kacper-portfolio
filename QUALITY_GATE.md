# Bernecki World — bramka jakości

**92/100.** Ocena obejmuje przebudowaną, okrągłą wyspę. W galerii zrzutów są kadry ze wszystkich sześciu rozdzielczości oraz zbliżenia miejsc. [Kadry z buildu produkcyjnego](docs/world/README.md#kadry-z-buildu-produkcyjnego)

| Obszar | Ocena | Podstawa |
| --- | ---: | --- |
| Kierunek artystyczny | 14/15 | Okrągła podstawa, kamień, asfalt, metal i ciepłe oznaczenia tworzą spójną makietę. Rozkład miejsc sprawdzono na sześciu rozdzielczościach. |
| Efekt pierwszego wejścia | 14/15 | Pierwszy kadr pokazuje całą wyspę. Panele słoneczne, auta, budka i kopuła są czytelne już z góry. |
| Świat 3D | 15/15 | Sześć projektów ma osobne modele i kadry. Laboratorium i poruszający się pluszak mają własne miejsca. Każdą główną lokalizację można otworzyć bezpośrednio z modelu. |
| Animacja i kamera | 13/15 | Osobne ujęcia projektów, reset do widoku wyspy i śledzenie pozycji pluszaka sprawdzono w przeglądarce. Ruch na desktopie bez GPU jest skokowy. |
| Interakcje i UX | 10/10 | Kliknięcia modeli, etykiety, mapa, skróty klawiaturowe, karty i wybór sposobu przeglądania działają w testach. |
| Mobile | 9/10 | Obrót dotykiem, pinch, otwieranie kart i widok statyczny sprawdzono. Przy szerokości 320 px dalsza część mapy wymaga przewinięcia. |
| Wydajność i stabilność | 7/10 | Jedna tekstura szyldów, scalone powierzchnie, niższa rozdzielczość podczas ruchu na wolnym sprzęcie i pełny widok statyczny. Profil Pixel 7 osiągnął około 25 FPS, a profil iPhone 13 około 54 FPS. |
| Oryginalność i marka | 5/5 | Autorska makieta z rozpoznawalnymi miejscami dla projektów i pluszową postacią autora. |
| Funkcjonalność biznesowa | 5/5 | Sześć rzeczywistych projektów, potwierdzone opisy, materiały i linki. ReEnergy ma osobne ścieżki do strony, kampanii i CRM. |

Niezależny przegląd porównał makietę, kadry poszczególnych miejsc i telefon. Po przeglądzie skorygowano prowadzenie kamery za pluszakiem i położenie etykiet mobilnych oraz sprawdzono nową grafikę statyczną.

## Weryfikacja

- Build produkcyjny, TypeScript, 355 testów Vitest i weryfikacja PL/EN przeszły. ESLint zgłosił 0 błędów i 15 istniejących ostrzeżeń poza zmianą.
- Playwright w Chromium sprawdził kliknięcie modeli ośmiu miejsc, mysz, zoom, reset, klawiaturę, położenie i zbliżenie pluszaka po ruchu, galerię i sześć kart, wybór trybu, kontakt, języki PL/EN/UK, dotyk i pinch. Sprawdzono też ponowne uruchomienie oraz przejście do widoku statycznego po utracie WebGL.
- W profilu iPhone 13 silnik WebKit WPE uruchomił scenę i pozwolił otworzyć projekt dotykiem. Sprawdzono szerokości od 320 do 1920 px i pełny profil renderowania w Chromium. Profil z ograniczoną rozdzielczością wraca do ostrego obrazu po zakończeniu ruchu.
- Axe sprawdził WCAG 2.1 A i AA w przeglądzie każdego języka i nie wykrył naruszeń. Sprawdzono 41 tras, w tym metadane, adresy kanoniczne, hreflang, sitemap i robots.txt. Sześć zewnętrznych adresów projektów zwróciło HTTP 200.

## Pomiary

Lokalny build produkcyjny z kodu `27e0ee5`, Linux bez udostępnionego GPU, Chromium 156 ze SwiftShader i WebKit WPE 27.2. FPS to mediana aktualizacji położenia znacznika w sześciu przejściach do Laboratorium AI, ReEnergy, StarCars i z powrotem. Czas pierwszej klatki liczono od nawigacji do pierwszej oznaczonej klatki WebGL.

| Profil | Pierwsza klatka 3D | Mediana podczas ruchu |
| --- | ---: | ---: |
| Chromium, 1440 × 900 | 3,30 s | 6,3 FPS |
| Chromium, Pixel 7 | 2,10 s | 24,7 FPS |
| WebKit, 1440 × 900 | 2,61 s | 8,7 FPS |
| WebKit, iPhone 13 | 1,02 s | 54,4 FPS |

Po ograniczeniu rozdzielczości kamery na wolnych rendererach mediana desktopowego WebKit wzrosła z około 1,6 do 8,7 FPS w tym samym scenariuszu. W Chromium łącznie pobrano około 323 kB skompresowanego JavaScriptu i 190 kB obrazów sceny.

Lighthouse 13.6 w symulacji mobilnej dał **60 Performance, 100 Accessibility, 100 Best Practices i 100 SEO**. FCP 0,92 s, LCP 3,62 s, TBT 2,27 s i CLS 0,003.

Wyniki dotyczą profili przeglądarek bez fizycznego GPU. Płynność na komputerze z GPU oraz na fizycznym iPhonie i telefonie z Androidem pozostaje niezweryfikowana. Widok statyczny zachowuje projekty, usługi, kontakt i wybór trybu.
