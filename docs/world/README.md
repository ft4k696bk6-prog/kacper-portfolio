# Bernecki World

Świat jest dostępny pod adresami `/world`, `/en/world` i `/uk/world`. W klasycznej stronie przycisk „Świat 3D” otwiera wybór trybu z dwoma podglądami. Wejście prosto na stronę klasyczną pozostaje dostępne w każdym języku.

## Miejsca na wyspie

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

Przyciski na mapie, kliknięcia obiektów i linki `#project-*` prowadzą do tych samych kart i zbliżeń. Etykieta Kacpra śledzi postać podczas poruszania klawiszami W, A, S, D lub kliknięciem alejki na placu.

## Kadry z buildu produkcyjnego

| Ekran | Zrzut |
| --- | --- |
| 1920 × 1080 | [Przegląd](screenshots/1920x1080.webp) |
| 1440 × 900 | [Przegląd](screenshots/1440x900.webp) |
| 1024 × 768 | [Przegląd](screenshots/1024x768.webp) |
| 768 × 1024 | [Przegląd](screenshots/768x1024.webp) |
| 390 × 844 | [Przegląd](screenshots/390x844.webp) |
| 320 × 568 | [Przegląd](screenshots/320x568.webp) |

- [Pełny profil renderowania, 1440 × 900](screenshots/full-quality-1440.webp)
- [Panele słoneczne i karta ReEnergy](screenshots/reenergy.webp)
- [Zbliżenie i karta StarCars na komputerze](screenshots/project-1440.webp)
- [Karta StarCars na telefonie](screenshots/project-390.webp)
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

Scena wczytuje się dynamicznie na trasach World. Okrągła makieta powstaje z modelu proceduralnego Three.js. Wszystkie szyldy korzystają z jednej tekstury, a w profilu programowym statyczne oświetlenie powierzchni jest zapisane w geometrii. Na wolnym sprzęcie rozdzielczość bufora zmniejsza się tylko na czas ruchu kamery. Karty wykorzystują zrzuty i potwierdzony zakres istniejących realizacji. Atlas HDR powstał z `RoomEnvironment` Three.js przy rozmiarze ściany 128 px i rozmyciu 0,025 rad. Atlas CubeUV zapisano w WebP z mantysami w RGB i wspólnym wykładnikiem w kanale alfa.

Sterowanie i ustawienie widoku statycznego są dostępne pod przyciskiem pomocy w scenie. Pełny raport sprawdzeń znajduje się w [QUALITY_GATE.md](../../QUALITY_GATE.md), a aktualny stan wydania w [HEARTBEAT.md](../../HEARTBEAT.md).
