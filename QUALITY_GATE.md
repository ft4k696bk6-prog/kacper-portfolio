# Bernecki World — weryfikacja wydania gry

## Interakcje i wydanie

- Produkcyjny build Next.js, TypeScript, kontrola PL/EN i 359 testów przeszły. ESLint w zmienionych komponentach świata zwrócił 0 błędów.
- Playwright sprawdził zmianę zoomu, jazdę z klawiatury, skok z rampy, wjazd do strefy projektu, lot na Księżyc, interakcję ze znajdźką, terminal i tajny świat, tryb zdjęć, zapis po przeładowaniu oraz szybki powrót. Osobny scenariusz z animacjami potwierdził wykrycie UFO, przelot do Aster i powrót do B-CRM.
- W profilu telefonu sprawdzono prawdziwe zdarzenia dwóch punktów dotyku w Chromium, jazdę przyciskiem dotykowym i zmianę orientacji. Przy wyłączonym WebGL sprawdzono dostęp do projektu, zmianę PL → EN → UK z zachowaniem projektu i powrót do Classic.
- W sprawdzonych ścieżkach Chromium nie zgłosiło błędów konsoli. Axe nie wykrył naruszeń w polskim widoku startowym ani w otwartym menu.
- 41 tras lokalnych, adresy kanoniczne i hreflang, sitemap, robots.txt i metadane przeszły kontrolę. Wszystkie sześć zewnętrznych linków „Otwórz projekt” zwróciło HTTP 200.
- Obejrzano kadry w przeglądarce i skorygowano punkt startowy samochodu, widoczność Księżyca na telefonie oraz kompozycję po lądowaniu. [Kadry](docs/world/README.md#kadry-z-buildu-produkcyjnego)

## Pomiary

Pomiary lokalnego buildu w Chromium ze SwiftShader i WebKit WPE. Środowisko nie udostępnia fizycznego telefonu ani sprzętowego GPU. Pierwsza klatka jest czasem od startu nawigacji do gotowości sceny. FPS pochodzi z krótkiego pomiaru faktycznych odświeżeń WebGL podczas przyspieszania samochodu.

| Profil przeglądarki | Pierwsza klatka | Jazda |
| --- | ---: | ---: |
| Chromium SwiftShader, 1440 × 900 | 3,12 s | 5,5 FPS (6 klatek) |
| Chromium SwiftShader, Pixel 7 | 2,08 s | 10,9 FPS (13 klatek) |
| WebKit WPE, profil iPhone 13 | 2,85 s | 48,8 FPS (54 klatki) |

Odcięcie zabudowy za horyzontem zmniejszyło ilość renderowanej geometrii. Wynik krótkiej próby na SwiftShader pozostał podobny. Cele 60 FPS i 30 FPS pozostają do sprawdzenia na fizycznych urządzeniach. Nawigacja statyczna działa również bez WebGL.

Symulacja jazdy używa lokalnej grawitacji i wybranych kolizji. Krajobraz obejmuje m.in. port, lagunę, elektrownię wiatrową, obserwatorium, wulkan i jaskinię. Większe tunele, lotnisko i pełna przestrzenna oprawa dźwiękowa pozostają do rozbudowy. Scenariusze przeglądarkowe próbkują mechaniki odkrywania, a stan osiągnięć sprawdza też test jednostkowy.
