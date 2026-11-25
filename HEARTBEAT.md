# Bernecki World — stan prac

- Etap — testy zakończone, kod i dokumentacja przygotowane do przeglądu na `feat/bernecki-world`.
- Ukończone — makieta z pięcioma strefami, pięć rzeczywistych realizacji, wersje PL/EN/UK, wybór trybu, kontakt, sterowanie i pełny widok statyczny.
- Testy — build, TypeScript, 354 testy Vitest, Playwright w Chromium i WebKit, 41 odpowiedzi HTTP 200, SEO, trzy przejścia axe i sześć rozdzielczości. [Kadry](docs/world/README.md#kadry-z-buildu-produkcyjnego)
- Ostatnia zmiana — obsługa synchronicznej kompilacji shaderów na sterownikach bez rozszerzenia równoległego, razem z raportem pomiarów.
- Ocena — 89/100. Największe ograniczenie to płynność w środowisku programowym. [Wyniki](QUALITY_GATE.md)
- Otwarte — pomiar na desktopie z GPU oraz na fizycznych telefonach. Zmiany są przygotowane do przeglądu w preview.
