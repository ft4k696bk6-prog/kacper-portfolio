# Bernecki Universe — kontrola jakości

## Audyt wydania atlasu

- Porównano rzeczywiste kadry z `fdcf47c` z przebudowanym ekranem wejścia, mapą, kartą realizacji i menu. Na wejściu jest jeden główny tytuł, a widok planety otrzymał własną przestrzeń. Sprawdzono czytelność menu, etykiet planet i przycisków na ekranach 1440 × 900, 390 × 844, 390 × 664 i 320 × 568.
- Kosmiczna mapa i znaczniki korzystają z tych samych wymiarów płótna. Na telefonie atlas ma identyczny kadr po locie animowanym i po przejściu z ograniczeniem ruchu. Karty mają stały dostęp z planety, rzeczywiste materiały projektowe i powiększony podgląd zdjęć.
- Zweryfikowano obsługę dotyku i klawiatury, powrót fokusu z menu i podglądu zdjęć, przejście PL → EN → UK z zachowaniem projektu oraz dostęp bez WebGL. Build, TypeScript, 363 testy i kontrola 41 tras przeszły. [Kadry atlasu](docs/world/README.md#kadry-z-buildu-produkcyjnego)

## Scena i portfolio

- Produkcyjny build Next.js, weryfikacja TypeScript i 363 testy przeszły. Zmiany zachowują istniejące ścieżki oraz hashe projektów.
- Testy jednostkowe sprawdzają separację planet, obwiednie wzdłuż 66 punktów próbkowania każdej pary lotów, maski drogi i wody, odrzucanie przeszkód, orientację pojazdu i przejście przez szew zamkniętej trasy.
- Na buildzie produkcyjnym sprawdzono osobne światy dla siedmiu realizacji i AI, karty projektów, lądowanie na księżycu, terminal, odkrycie The Unknown i ukrycie sekretów przed odblokowaniem. Kliknięcie modelu złotego auta odblokowało G-02. Zapis z wcześniejszej wersji zachował dostęp. Osobny scenariusz potwierdził też przerwanie lotu i wybór planety bezpośrednio na płótnie. Zweryfikowano skan UFO, aktywację widocznego obiektu, animowany przelot, zapis odkrycia i wyjście z trybu zdjęć.
- Chromium potwierdził dotyk z dwoma punktami, wybór planety, obrót ekranu oraz brak błędów konsoli w scenariuszu. Axe sprawdził menu w polskiej wersji bez naruszeń. W WebKit na ekranie 390 × 664 sprawdzono wybór planety i brak nakładania tytułu startowego na podpis mapy.
- Sprawdzono 41 tras, adresy kanoniczne, hreflang, sitemap, tryb bez WebGL z przełączaniem PL → EN → UK, zachowanie hasha i Classic. Nowe odsyłacze do Jalapeno i B-Code zwracają 200 w PL i EN. [Kadry](docs/world/README.md#kadry-z-buildu-produkcyjnego)

## Ograniczenia

Planety łączą modele autorskie, istniejącą zabudowę i uproszczone detale. Rozbudowane tunele, policyjny pościg, przestrzenne nagrania i dodatkowe mikrohistorie pozostają do rozwoju. Dźwięk oraz muzyka BeatMarket są syntetyczne. Pomiary wydajności pochodzą z przeglądarek emulowanych i nie potwierdzają celów na fizycznych urządzeniach.

## Pomiary poprzedniego wydania

Próbka automatycznego obrotu wokół StarCars przez około 3,5 sekundy. Liczono faktyczne odświeżenia WebGL. Linuksowe środowisko testowe nie miało sprzętowego GPU ani fizycznego telefonu.

| Profil | Pierwsza klatka 3D | FPS |
| --- | ---: | ---: |
| Chromium SwiftShader, 1440 × 900 | 2,55 s | 6,8 (24 klatki) |
| WebKit WPE, profil iPhone 13 | 1,25 s | 45,6 (160 klatek) |
