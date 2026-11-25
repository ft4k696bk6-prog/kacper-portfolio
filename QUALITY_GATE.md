# Bernecki World — bramka jakości

**89/100. Próg 90/100 pozostaje otwarty.** Funkcjonalny podgląd przeszedł testy. Ocenę utrzymano poniżej progu ze względu na pomiary płynności w Chromium i brak pomiaru na sprzęcie z fizycznym GPU.

| Obszar | Ocena | Podstawa |
| --- | ---: | --- |
| Kierunek artystyczny | 14/15 | Spójne kadry we wszystkich sześciu rozdzielczościach, znak KB, grafit, srebro i światło. |
| Efekt pierwszego wejścia | 13/15 | Duża makieta i typografia, odsłonięcie znaku i wejściowy ruch kamery. W profilu programowym część detali jest uproszczona. |
| Świat 3D | 13/15 | Pięć różnych budynków, dziedziniec, oświetlenie, samochód, postać i pięć ekranów z prawdziwymi realizacjami. |
| Animacja i kamera | 13/15 | Kamera wraca do tego samego kadru po obrocie. Zbliżenia pokazują budynki i monitory. Ruch w środowisku programowym ma widoczne skoki. |
| Interakcje i UX | 10/10 | Interakcje myszy, dotyku i klawiatury, przewidywalny fokus, mapa, wybór trybu i ścieżka kontaktu przeszły testy. |
| Mobile | 9/10 | Obrót dotykiem, pinch, projekty, kontakt i widok statyczny. Przy 320 px pełna mapa wymaga przewinięcia. |
| Wydajność i stabilność | 7/10 | Rozdzielone ładowanie, lżejsze cieniowanie, adaptacyjna rozdzielczość i przetestowane odzyskanie widoku. Chrome w laboratorium osiągnął 3,3–14,9 FPS. |
| Oryginalność i marka | 5/5 | Oryginalna proceduralna makieta z istniejącym znakiem KB oraz materiałami właściciela. |
| Funkcjonalność biznesowa | 5/5 | Pięć rzeczywistych projektów, potwierdzony stos technologiczny, linki do ofert, projektów i kontaktu. |

Niezależny przegląd trzeciej iteracji przyznał 81/90 punktów w obszarach innych niż wydajność. Po nim skorygowano pozycję opisu na 1024 px, odstęp pierwszej etykiety na 320 px i dostępne nazwy przycisków w trzech wersjach językowych. [Kadry z builda produkcyjnego](docs/world/README.md#kadry-z-buildu-produkcyjnego)

## Weryfikacja

- Build produkcyjny, TypeScript, 354 testy Vitest oraz kontrola PL/EN przeszły. ESLint zgłosił 0 błędów i 15 wcześniejszych ostrzeżeń poza zmianą.
- Playwright w Chromium potwierdził mysz, powiększanie, reset, kliknięcie budynku i monitora B-CRM, ruch postaci klawiaturą, pięć kart projektów, ich zdjęcia i linki, fokus po zamykaniu panelu, zmianę PL/EN/UK i zapis preferencji Classic / Interactive.
- W profilu dotykowym Chromium przeszły obrót i gest pinch. W profilu iPhone 13 silnik WebKit uruchomił scenę i otworzył kartę przez dotyk. Redukcja ruchu, ręczne przełączanie, wyłączony WebGL i wymuszona utrata kontekstu przeszły testy.
- Axe 4 sprawdził zasady WCAG 2.1 A i AA w przeglądzie każdej wersji językowej i zwrócił 0 naruszeń. Pełny przebieg desktopowy zakończył się bez błędów konsoli ani nieudanych żądań zasobów.
- 41 sprawdzonych tras zwróciło HTTP 200, w tym istniejąca strona, oferty, realizacje, kontakt, sitemap, robots i Open Graph. Sprawdzono adresy kanoniczne i wzajemne hreflang. Pięć zewnętrznych adresów realizacji zwróciło HTTP 200.
- Ścieżka kontaktu linkuje do istniejących formularzy i poczty. Test objął dotarcie do formularza.

## Pomiary

Lokalny build produkcyjny, Linux bez udostępnionego GPU, Chromium 156 ze SwiftShader i WebKit WPE 27.2. FPS to mediana sześciu zbliżeń i powrotów, liczona z kolejnych aktualizacji położenia punktu w scenie. Mierzono od nawigacji do pierwszej oznaczonej klatki WebGL.

| Profil | Pierwsza klatka 3D | Mediana podczas ruchu |
| --- | ---: | ---: |
| Chromium, 1440 × 900 | 4,08 s | 3,3 FPS |
| Chromium, Pixel 7 | 1,86 s | 14,9 FPS |
| WebKit, 1440 × 900 | 2,67 s | 2,7 FPS |
| WebKit, iPhone 13 | 1,19 s | 48,7 FPS |

Lighthouse 13.6, symulacja mobilna w Chromium. **Performance 63, Accessibility 100, Best Practices 100, SEO 100.** FCP 0,92 s, LCP 3,18 s, TBT 5,60 s i CLS 0,005. Chromium zarejestrował około 318 kB skompresowanego JavaScriptu i 169 kB obrazów sceny. Pomiary dotyczą wersji kodu `aec881b`. Późniejsza zmiana wybiera właściwą metodę wstępnej kompilacji shaderów w zależności od obsługi rozszerzenia WebGL.

Pomiary na fizycznym komputerze, iPhonie i telefonie z Androidem pozostają otwarte. Wynik programowego desktopu i profilu Pixel 7 ograniczył ocenę. Użycie widoku statycznego zachowuje dostęp do galerii, usług, kontaktu i wyboru trybu.
