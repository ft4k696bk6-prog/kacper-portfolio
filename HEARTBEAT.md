# Bernecki World — stan prac

- Etap — wydanie do przeglądu na `feat/bernecki-world`, w [PR #116](https://github.com/ft4k696bk6-prog/kacper-portfolio/pull/116).
- Ukończone — makieta z pięcioma strefami, pięć rzeczywistych realizacji, wersje PL/EN/UK, wybór trybu, kontakt, sterowanie i pełny widok statyczny.
- Testy — build, TypeScript, 354 testy Vitest, Playwright w Chromium i WebKit, 41 odpowiedzi HTTP 200, SEO, trzy przejścia axe i sześć rozdzielczości. [Kadry](docs/world/README.md#kadry-z-buildu-produkcyjnego)
- Ostatnia zmiana — uproszczono oświetlenie w Chromium z renderowaniem programowym. Rozdzielczość sceny spada podczas ruchu i wraca po zatrzymaniu kamery.
- Ocena — 90/100. W Chromium bez GPU mediana wzrosła z 4,0 do 12,5 FPS na desktopie i z 16,0 do 28,0 FPS w profilu Pixel 7. [Wyniki](QUALITY_GATE.md)
- Otwarte — pomiar na desktopie z GPU oraz na fizycznych telefonach. Desktopowy WebKit WPE w laboratorium osiągnął 2,7 FPS.
