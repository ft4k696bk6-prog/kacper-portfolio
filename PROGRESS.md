# Bernecki World — interaktywna gra

- Baza premium `df0d0b7` jest zachowana na `backup/bernecki-world-before-game` i w dotychczasowym podglądzie Vercel.
- Gotowe — stylizowany glob, swobodna kamera, jazda z lokalną grawitacją, niezależne animacje, Księżyc, terminal, Aster, UFO i 18 odkryć z lokalnym zapisem. Menu zachowuje sześć realizacji, Classic, tryb statyczny oraz PL, EN i UK.
- Weryfikacja — build, TypeScript, 359 testów, 41 tras i sześć zewnętrznych CTA. Przeglądarka potwierdziła jazdę, dotyk, przeloty, zapis, zmianę języka i tryb bez WebGL. [Kadry](docs/world/README.md#kadry-z-buildu-produkcyjnego)
- Wykryte problemy — poprawiono położenie auta, kadry lądowania i widoczność Księżyca na mobile. Płynność spada w SwiftShader pomimo ograniczenia geometrii za horyzontem. [Pomiary i ograniczenia](QUALITY_GATE.md)
- Następny krok — zmierzyć jazdę i zbliżenia na fizycznym telefonie oraz sprzętowym GPU. [Podgląd i kontrole w PR #116](https://github.com/ft4k696bk6-prog/kacper-portfolio/pull/116)
