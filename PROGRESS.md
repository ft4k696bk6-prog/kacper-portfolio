# Bernecki World — etap premium

- Baza z poprawionym szyldem B-CRM jest zachowana w `backup/bernecki-world-before-premium` (`76a8c7f`) i w podglądzie Vercel poprzedniego wydania.
- Gotowe — schowane menu, stabilny środek globu, przeloty z powrotem, skompresowany atlas HDRI, PBR betonu i drewna oraz detale budynków. Materiały i auta wczytują się przy zbliżeniu, a lżejszy profil ogranicza koszty renderowania.
- Po przeglądzie kadrów skorygowano jasność materiałów, szwy dachu, dalszy plan i obciążenie interfejsu mobilnego.
- Weryfikacja — build, 355 testów, siedem rozmiarów ekranu, Playwright w Chromium i WebKit, klawiatura, dotyk, widok statyczny i 41 tras. [Kadry](docs/world/README.md#kadry-z-buildu-produkcyjnego) · [Pomiary](QUALITY_GATE.md)
- Ograniczenia — częściowo stylizowana geometria i wydajność mierzona w profilach przeglądarek. Ocena wydania 8,8/10.
- Następny krok — zmierzyć przeloty i czas wejścia na fizycznych telefonach i sprzętowym GPU. [Podgląd i kontrole w PR #116](https://github.com/ft4k696bk6-prog/kacper-portfolio/pull/116)
