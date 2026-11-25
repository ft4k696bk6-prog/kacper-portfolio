# Bernecki World

Świat jest dostępny pod adresami `/world`, `/en/world` i `/uk/world`. Przeciągnięcie myszą lub palcem obraca planetę przy stałym środku i skali. Katalog projektów pokazuje nadal cały glob. Wybranie miejsca z modelu, mapy lub klawiatury uruchamia przelot i zbliżenie. W klasycznej stronie przycisk „Świat 3D” otwiera wybór trybu z dwoma podglądami.

## Miejsca na planecie

| Miejsce | Co otwiera |
| --- | --- |
| Centrum fotowoltaiki ReEnergy | Strona firmowa, kampanie Meta Ads i obsługa leadów w CRM |
| Plac StarCars | Strona importera, kalkulator kosztów i formularze zapytań |
| Budka Isto Kebab | Strona restauracji, menu i zamówienia |
| Skarbówka B-CRM | Demo CRM z rolami, leadami i przekazywaniem spraw do realizacji |
| Laboratorium AI | Wdrożenia AI, automatyzacje i integracje |
| Warsztat Motomizer | Prezentacja produktu i wariantów |
| Scena BeatMarket | Platforma producentów i odsłuch beatów |
| Pluszowy przewodnik Kacper | Informacje o autorze i ścieżka współpracy |

Przyciski na mapie, kliknięcia obiektów i linki `#project-*` prowadzą do tych samych kart i zbliżeń. Miejsca rozmieszczono dla kompozycji globu i odkrywania jego drugiej strony. Etykieta Kacpra śledzi postać podczas poruszania klawiszami W, A, S, D lub kliknięciem alejki na placu.

## Kadry z buildu produkcyjnego

| Ekran | Zrzut |
| --- | --- |
| 1920 × 1080 | [Przegląd](screenshots/1920x1080.webp) |
| 1440 × 900 | [Przegląd](screenshots/1440x900.webp) |
| 1024 × 768 | [Przegląd](screenshots/1024x768.webp) |
| 768 × 1024 | [Przegląd](screenshots/768x1024.webp) |
| 390 × 844 | [Przegląd](screenshots/390x844.webp) |
| 390 × 664 | [Przegląd](screenshots/390x664.webp) |
| 320 × 568 | [Przegląd](screenshots/320x568.webp) |

- [Pełny profil renderowania, 1440 × 900](screenshots/full-quality-1440.webp)
- [Panele słoneczne i karta ReEnergy](screenshots/reenergy.webp)
- [Zbliżenie i karta StarCars na komputerze](screenshots/project-1440.webp)
- [Plac StarCars na telefonie](screenshots/starcars-mobile.webp)
- [Karta Isto Kebab w widoku dotykowym](screenshots/project-390.webp)
- [Budka Isto Kebab](screenshots/isto-kebab.webp)
- [Budynek B-CRM](screenshots/b-crm.webp)
- [Kopuła Laboratorium AI](screenshots/lab.webp)
- [Warsztat Motomizer](screenshots/motomizer.webp)
- [Scena BeatMarket](screenshots/beatmarket.webp)
- [Pluszowy przewodnik](screenshots/hq.webp)
- [Wybór trybu](screenshots/mode.webp)
- [Widok po wyłączeniu WebGL](screenshots/fallback.webp)
- [Profil iPhone 13 w WebKit](screenshots/webkit-iphone.webp)

Przeglądy w tabeli wykonano w Chromium z renderowaniem programowym. Dodatkowy kadr pokazuje pełny profil oświetlenia i geometrii z wymuszonym profilem w tej samej przeglądarce. Kadry mobilne pochodzą z profili przeglądarek. Przy 320 × 568 druga część mapy jest dostępna przy przewijaniu.

## Uruchomienie i źródła

```sh
npm ci
npm run dev
```

Scena wczytuje się dynamicznie na trasach World. Kula Three.js ma teksturę satelitarną i atmosferę. Każda lokalizacja ma własny układ współrzędnych styczny do kuli. Kamera najpierw odsuwa się od aktywnego miejsca, przemieszcza po zewnętrznym łuku i zbliża do celu od strony powierzchni. Na wolnym sprzęcie rozdzielczość bufora zmniejsza się podczas ruchu. Karty wykorzystują zrzuty i potwierdzony zakres istniejących realizacji.

## Źródła modeli i tekstur

- **Ziemia i chmury.** `planet-earth.webp` łączy mapę dzienną i mapę chmur Solar System Scope opartą na danych NASA, w tym Blue Marble. Zmieniono kolor i krycie chmur oraz zapisano wynik w WebP. [Solar System Scope](https://www.solarsystemscope.com/textures/) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- **Samochody.** `starcars-supercar.glb` to zoptymalizowany wariant LOD1 modelu Mid-Engine Supercar v2. Scena używa trzech wariantów lakieru i pobiera model przy wejściu do StarCars. [tevy](https://tevy.dev/models/supercar) · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- **Asfalt.** `starcars-asphalt.webp` wykorzystuje mapę koloru Asphalt 012 z ambientCG. [ambientCG](https://ambientcg.com/view?id=Asphalt012) · [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- **Kacper.** Pluszowy portret powstał w ImageGen na podstawie portretu właściciela z portfolio. Model 3D odtwarza zaczesane włosy, zarost, marynarkę i skrzyżowane ręce.

Sterowanie i ustawienie widoku statycznego są dostępne pod przyciskiem pomocy w scenie. Pełny raport sprawdzeń znajduje się w [QUALITY_GATE.md](../../QUALITY_GATE.md), a aktualny stan wydania w [HEARTBEAT.md](../../HEARTBEAT.md).
