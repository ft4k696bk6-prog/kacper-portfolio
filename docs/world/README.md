# Bernecki World

Interaktywne portfolio działa pod adresami `/world`, `/en/world` i `/uk/world`. Menu zawiera istniejące realizacje i usługi, kontakt oraz przejście do Classic. Każdy projekt zachowuje link `#project-*`.

## Poruszanie się

| Tryb | Sterowanie |
| --- | --- |
| Glob i swobodna kamera | Przeciągnij myszą lub palcem. Zmień zoom kółkiem, gestem dwoma palcami lub klawiszami + i −. Obrót klawiaturą obsługują strzałki. |
| Samochód | WASD, strzałki lub przyciski dotykowe. Spacja włącza klakson, R wraca na linię startu. Wjazd w strefę projektu otwiera jego kartę. |
| Fotografia | F lub opcja kamery w menu. Wyjście klawiszem Escape albo dyskretnym przyciskiem. Dzień i noc można ustawić w menu kamery. |
| Odkrycia | Kliknij obiekt lub skorzystaj z przycisku „Zbadaj” i klawisza E. Dziennik zapisuje licznik i osiągnięcia lokalnie. |
| Podróże | Pomocnik wskazuje widoczne ciało niebieskie. Fast Travel pokazuje odkryte światy. |

Scena przechodzi w statyczny podgląd, jeśli WebGL nie jest dostępny. Projekty pozostają wtedy dostępne z menu. Preferencja ograniczonego ruchu zatrzymuje animacje otoczenia i skraca przeloty.

## Realizacje

| Miejsce | Co otwiera |
| --- | --- |
| Centrum fotowoltaiki ReEnergy | Strona firmowa, kampanie Meta Ads i obsługa leadów w CRM |
| Plac StarCars | Strona importera, kalkulator kosztów i formularze zapytań |
| Budka Isto Kebab | Strona restauracji, menu i zamówienia |
| Budynek B-CRM | Demo CRM z rolami, leadami i przekazywaniem spraw do realizacji |
| Laboratorium AI | Wdrożenia AI, automatyzacje i integracje |
| Warsztat Motomizer | Prezentacja produktu i wariantów |
| Scena BeatMarket | Platforma producentów i odsłuch beatów |
| Pluszowy przewodnik Kacper | Informacje o autorze i ścieżka współpracy |

## Kadry z buildu produkcyjnego

- [Planeta i Księżyc](screenshots/game-desktop.webp) · [Planeta na telefonie](screenshots/game-mobile.webp)
- [Kamera za samochodem](screenshots/game-drive.webp) · [Sterowanie dotykiem](screenshots/game-mobile-drive.webp)
- [Menu](screenshots/game-menu.webp) · [B-CRM](screenshots/game-project.webp)
- [Baza księżycowa](screenshots/game-moon.webp) · [Aster](screenshots/game-signal.webp) · [UFO](screenshots/game-ufo.webp)
- [Przelot kosmiczny](screenshots/game-transit.webp) · [Tryb bez WebGL](screenshots/game-static.webp)
- [Sprawdzenia i pomiary](../../QUALITY_GATE.md) · [Stan projektu](../../PROGRESS.md)

## Zasoby

Mapa terenu, drogi, pojazd gracza, dodatkowe światy i efekty to modele i materiały generowane przez scenę Three.js. LOD i profil jakości ograniczają zagęszczenie siatek, cząsteczki są buforowane, a flora jest instancjonowana. Aster jest budowane przy pierwszej podróży. Scena wycisza animacje w tle i ogranicza rozdzielczość, gdy renderer zwalnia.

- Szczegółowe samochody StarCars są pobierane przy wejściu do projektu. [Mid-Engine Supercar v2, tevy · CC0](https://tevy.dev/models/supercar)
- Kolor, normalne i szorstkość powierzchni pochodzą z map ambientCG. [Asphalt 012](https://ambientcg.com/view?id=Asphalt012) · [Concrete 034](https://ambientcg.com/view?id=Concrete034) · [Wood 049](https://ambientcg.com/view?id=Wood049)
- Światło bazowe korzysta z atlasu HDRI. [Poly Haven Kloppenheim 06 Pure Sky · CC0](https://polyhaven.com/a/kloppenheim_06_puresky)
- Pluszowy portret powstał w ImageGen na podstawie portretu właściciela z portfolio. Model 3D wykorzystuje jego charakterystyczną fryzurę, zarost i marynarkę.
