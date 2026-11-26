# Bernecki Universe

- Atlas pokazuje zabudowę przed wybraniem planety. Odpowiedniki budynków i tor StarCars widać z orbity, a scena w pełnym detalu stopniowo przejmuje obraz podczas dolotu.
- Wydanie atlasu wprowadza nowy ekran wejścia, mapę i menu, karty realizacji z podglądem zdjęć oraz nową oprawę sceny 3D. Wariant sprzed zmian jest zachowany na `backup/universe-before-visual-refinement`.
- Dopracowano siedzibę i budynki projektowe, wybrzeża, oświetlenie i kadr otwarcia. Drogi na planecie startowej nadal korzystają ze wspólnej walidacji terenu i przeszkód.
- StarCars wykorzystuje na telefonie lżejsze sylwetki z orbity i pobiera pełne modele po zbliżeniu do salonu. Test WebKit potwierdził oba widoki.
- Wersja gry `c0d9e51` jest zachowana na `backup/bernecki-world-before-universe` i w poprzednim podglądzie Vercel.
- Gotowe — planeta startowa, siedem planet realizacji, AI World, dwa księżyce i tajna planeta. Sterowanie obejmuje kamerę. Postacie, pojazdy i otoczenie działają autonomicznie.
- Mapa pokazuje uproszczone reprezentacje, a aktywna planeta wczytuje własną architekturę i animacje. Trasy wynikają z masek terenu i omijają zabudowę. Dziennik zachowuje 25 odkryć i postęp poprzedniego wydania.
- Zweryfikowano build, TypeScript, 363 testy, 41 tras, gesty i obrót telefonu, karty, przełączanie języków, Classic, przerwanie lotu, oba księżyce i UFO. Poprawiono kadr na krótkich ekranach i konflikt skanowania z resetem kamery oraz nakładanie tytułu na mapę w WebKit. [Kadry](docs/world/README.md#kadry-z-buildu-produkcyjnego)
- Ograniczenie — pomiar na sprzętowym GPU i fizycznym telefonie pozostaje otwarty. [Wyniki](QUALITY_GATE.md)
- Następny krok — sprawdzić cel 60/30 FPS na sprzęcie. [Podgląd i kontrole w PR #116](https://github.com/ft4k696bk6-prog/kacper-portfolio/pull/116)
