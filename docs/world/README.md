# Bernecki World

Świat jest dostępny pod adresami `/world`, `/en/world` i `/uk/world`. W klasycznej stronie przycisk „Świat 3D” otwiera wybór trybu z dwoma podglądami. Wejście prosto na stronę klasyczną pozostaje dostępne w każdym języku.

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
- [Zbliżenie i karta StarCars na komputerze](screenshots/project-1440.webp)
- [Karta StarCars na telefonie](screenshots/project-390.webp)
- [Wybór trybu](screenshots/mode.webp)
- [Widok po wyłączeniu WebGL](screenshots/fallback.webp)
- [Profil iPhone 13 w WebKit](screenshots/webkit-iphone.webp)

W przeglądzie na 320 × 568 dolny rząd mapy jest dostępny przy przewijaniu. Przeglądy w tabeli wykonano w Chromium z renderowaniem programowym. Dodatkowy kadr pokazuje pełny profil oświetlenia i geometrii. Kadry mobilne pochodzą z profili przeglądarek.

## Uruchomienie i źródła

```sh
npm ci
npm run dev
```

Scena wczytuje się dynamicznie na trasach World. Makietę wyrenderowano z modelu proceduralnego. W profilu programowym oświetlenie powierzchni jest zapisane w geometrii, a rozdzielczość bufora zmniejsza się na czas ruchu kamery. Galeria wykorzystuje oryginalne zrzuty z portfolio i stos technologiczny z istniejących studiów przypadku. Atlas HDR powstał z `RoomEnvironment` Three.js przy rozmiarze ściany 128 px i rozmyciu 0,025 rad. Atlas CubeUV zapisano w WebP z mantysami w RGB i wspólnym wykładnikiem w kanale alfa.

Sterowanie i ustawienie widoku statycznego są dostępne pod przyciskiem pomocy w scenie. Pełny raport sprawdzeń znajduje się w [QUALITY_GATE.md](../../QUALITY_GATE.md), a aktualny stan wydania w [HEARTBEAT.md](../../HEARTBEAT.md).
