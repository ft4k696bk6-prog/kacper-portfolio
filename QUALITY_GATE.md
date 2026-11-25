# Bernecki World — bramka jakości

**90/100. Wewnętrzny próg jakości został osiągnięty.** Ocena obejmuje build produkcyjny, testy funkcjonalne, pomiary w przeglądarkach i niezależny przegląd końcowych kadrów.

| Obszar | Ocena | Podstawa |
| --- | ---: | --- |
| Kierunek artystyczny | 14/15 | Spójne kadry we wszystkich sześciu rozdzielczościach, znak KB, grafit, srebro i światło. |
| Efekt pierwszego wejścia | 13/15 | Duża makieta i typografia, odsłonięcie znaku i wejściowy ruch kamery. W profilu programowym część detali jest uproszczona. |
| Świat 3D | 13/15 | Pięć różnych budynków, dziedziniec, oświetlenie, samochód, postać i pięć ekranów z prawdziwymi realizacjami. |
| Animacja i kamera | 13/15 | Kamera wraca do tego samego kadru po obrocie. Zbliżenia pokazują budynki i monitory. Ruch w środowisku programowym ma widoczne skoki. |
| Interakcje i UX | 10/10 | Interakcje myszy, dotyku i klawiatury, przewidywalny fokus, mapa, wybór trybu i ścieżka kontaktu przeszły testy. |
| Mobile | 9/10 | Obrót dotykiem, pinch, projekty, kontakt i widok statyczny. Przy 320 px pełna mapa wymaga przewinięcia. |
| Wydajność i stabilność | 8/10 | Rozdzielone ładowanie, wstępnie obliczone oświetlenie i adaptacyjna rozdzielczość. W Chromium mediana wzrosła z 4,0 do 12,5 FPS na desktopie bez GPU i z 16,0 do 28,0 FPS w profilu Pixel 7. Sprawdzono przejście do widoku statycznego po utracie WebGL. |
| Oryginalność i marka | 5/5 | Oryginalna proceduralna makieta z istniejącym znakiem KB oraz materiałami właściciela. |
| Funkcjonalność biznesowa | 5/5 | Pięć rzeczywistych projektów, potwierdzony stos technologiczny, linki do ofert, projektów i kontaktu. |

Niezależny przegląd trzeciej iteracji przyznał 81/90 punktów w obszarach innych niż wydajność. Po nim skorygowano pozycję opisu na 1024 px, odstęp pierwszej etykiety na 320 px i dostępne nazwy przycisków w trzech wersjach językowych. Po optymalizacji niezależny przegląd potwierdził zachowanie kompozycji, czytelności ekranów i położenia etykiet. Profil programowy ma jaśniejsze powierzchnie oraz łagodniejsze cienie. [Kadry z buildu produkcyjnego](docs/world/README.md#kadry-z-buildu-produkcyjnego)

## Weryfikacja

- Build produkcyjny, TypeScript, 354 testy Vitest oraz kontrola PL/EN przeszły. ESLint zgłosił 0 błędów i 15 wcześniejszych ostrzeżeń poza zmianą.
- Playwright w Chromium potwierdził mysz, powiększanie, reset, kliknięcie budynku i monitora B-CRM, ruch postaci klawiaturą, pięć kart projektów, ich zdjęcia i linki, fokus po zamykaniu panelu, zmianę PL/EN/UK i zapis preferencji Classic / Interactive.
- W profilu dotykowym Chromium przeszły obrót i gest pinch. W profilu iPhone 13 silnik WebKit uruchomił scenę i otworzył kartę przez dotyk. Redukcja ruchu, ręczne przełączanie, wyłączony WebGL i wymuszona utrata kontekstu przeszły testy.
- Test rozdzielczości potwierdził, że profil programowy ogranicza liczbę renderowanych pikseli podczas ruchu, po zatrzymaniu przywraca ostrość, zachowuje obszar klikania i pokazuje ostry obraz przy włączonej redukcji ruchu.
- Axe 4 sprawdził zasady WCAG 2.1 A i AA w przeglądzie każdej wersji językowej i zwrócił 0 naruszeń. Pełny przebieg desktopowy zakończył się bez błędów konsoli ani nieudanych żądań zasobów.
- 41 sprawdzonych tras zwróciło HTTP 200, w tym istniejąca strona, oferty, realizacje, kontakt, sitemap, robots i Open Graph. Sprawdzono adresy kanoniczne i wzajemne hreflang. Pięć zewnętrznych adresów realizacji zwróciło HTTP 200.
- Ścieżka kontaktu linkuje do istniejących formularzy i poczty. Test objął dotarcie do formularza.

## Pomiary

Lokalny build produkcyjny z kodu `f3856b2`, Linux bez udostępnionego GPU, Chromium 156 ze SwiftShader i WebKit WPE 27.2. FPS to mediana sześciu zbliżeń i powrotów, liczona z kolejnych aktualizacji położenia punktu w scenie. Czas pierwszej klatki liczono od nawigacji do pierwszej oznaczonej klatki WebGL. Pomiar porównawczy Chromium wykonano w tej samej sesji na buildzie `52c3ddd`.

| Profil | Pierwsza klatka 3D | Mediana podczas ruchu |
| --- | ---: | ---: |
| Chromium, 1440 × 900 | 2,82 s | 12,5 FPS |
| Chromium, Pixel 7 | 1,97 s | 28,0 FPS |
| WebKit, 1440 × 900 | 3,44 s | 2,7 FPS |
| WebKit, iPhone 13 | 0,94 s | 56,1 FPS |

Lighthouse 13.6, symulacja mobilna w Chromium. **Performance 62, Accessibility 100, Best Practices 100, SEO 100.** FCP 0,92 s, LCP 3,28 s, TBT 3,37 s i CLS 0,003. Chromium zarejestrował około 319 kB skompresowanego JavaScriptu i 169 kB obrazów sceny.

Wyniki dotyczą profili przeglądarek. Płynność na desktopie z fizycznym GPU oraz na fizycznym iPhonie i telefonie z Androidem pozostaje niezweryfikowana. Desktopowy WebKit WPE w tym środowisku osiągnął 2,7 FPS. Widok statyczny zachowuje dostęp do galerii, usług, kontaktu i wyboru trybu.
