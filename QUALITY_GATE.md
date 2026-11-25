# Bernecki Universe — kontrola jakości

## Scena i portfolio

- Produkcyjny build Next.js, weryfikacja TypeScript i 363 testy przeszły. Zmiany zachowują istniejące ścieżki oraz hashe projektów.
- Testy jednostkowe sprawdzają separację planet, obwiednie wzdłuż 66 punktów próbkowania każdej pary lotów, maski drogi i wody, odrzucanie przeszkód, orientację pojazdu i przejście przez szew zamkniętej trasy.
- Na buildzie produkcyjnym sprawdzono osobne światy dla siedmiu realizacji i AI, karty projektów, lądowanie na księżycu, terminal, odkrycie The Unknown i ukrycie sekretów przed odblokowaniem. Kliknięcie modelu złotego auta odblokowało G-02. Zapis z wcześniejszej wersji zachował dostęp. Osobny scenariusz potwierdził też przerwanie lotu i wybór planety bezpośrednio na płótnie. Zweryfikowano skan UFO, aktywację widocznego obiektu, animowany przelot, zapis odkrycia i wyjście z trybu zdjęć.
- Chromium potwierdził dotyk z dwoma punktami, wybór planety, obrót ekranu oraz brak błędów konsoli w scenariuszu. Axe sprawdził menu w polskiej wersji bez naruszeń.
- Sprawdzono 41 tras, adresy kanoniczne, hreflang, sitemap, tryb bez WebGL z przełączaniem PL → EN → UK, zachowanie hasha i Classic. Nowe odsyłacze do Jalapeno i B-Code zwracają 200 w PL i EN. [Kadry](docs/world/README.md#kadry-z-buildu-produkcyjnego)

## Ograniczenia

Planety łączą modele autorskie, istniejącą zabudowę i uproszczone detale. Rozbudowane tunele, policyjny pościg, przestrzenne nagrania i dodatkowe mikrohistorie pozostają do rozwoju. Dźwięk oraz muzyka BeatMarket są syntetyczne. Pomiary wydajności pochodzą z przeglądarek emulowanych i nie potwierdzają celów na fizycznych urządzeniach.

## Pomiary

Próbka automatycznego obrotu wokół StarCars przez około 3,5 sekundy. Liczono faktyczne odświeżenia WebGL. Linuksowe środowisko testowe nie miało sprzętowego GPU ani fizycznego telefonu.

| Profil | Pierwsza klatka 3D | FPS |
| --- | ---: | ---: |
| Chromium SwiftShader, 1440 × 900 | 2,55 s | 6,8 (24 klatki) |
| WebKit WPE, profil iPhone 13 | 1,25 s | 45,6 (160 klatek) |
