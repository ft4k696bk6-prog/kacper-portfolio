# Bernecki Universe

Portfel projektów działa pod adresami `/world`, `/en/world` i `/uk/world`. Wejście prowadzi na Bernecki World. Menu zawiera mapę, karty realizacji, kontakt i powrót do Classic. Każda realizacja zachowuje adres `#project-*`.

## Eksploracja

| Cel | Sterowanie |
| --- | --- |
| Obejrzyj planetę | Przeciągnij palcem lub myszą. Użyj gestu dwoma palcami, kółka albo klawiszy + i −, by zmienić zoom. Strzałki na scenie obracają kamerę. |
| Przejdź między światami | Użyj Mapy układu lub menu. Klawisz G otwiera mapę, a Escape przerywa lot. |
| Zobacz projekt | Wybierz obiekt z nazwą na powierzchni lub otwórz kartę z menu. |
| Odkrywaj | Klikaj miejsca w scenie. E aktywuje najbliższą widoczną wskazówkę. Dziennik zachowuje stan w przeglądarce. |
| Fotografuj | Klawisz F lub menu kamery włącza tryb zdjęć. Escape przywraca interfejs. |

Grafika, oświetlenie i intensywność efektów są regulowane w menu. Dźwięk jest domyślnie wyłączony. W trybie bez WebGL dostępne są obraz planety, karty projektów, klasyczne portfolio i kontakt. Ograniczenie ruchu zatrzymuje środowisko i skraca loty.

## Światy

| Planeta | Charakter i realizacja |
| --- | --- |
| Bernecki World | Siedziba, obserwatorium, port, góry, wulkan i miejsce startu. |
| StarCars | Salon importera, tor, laweta, dźwig i transport wodny. |
| ReEnergy | Centrum fotowoltaiki, turbiny, magazyn energii, przepływ energii. |
| B-CRM | Centrum operacyjne, serwerownie i animowany przepływ syntetycznych danych. |
| AI World | Laboratorium, robot naprawczy, mieszkańcy i terminal. Karta AI zawiera również odsyłacz do autorskiego B-Code w PL i EN. |
| Motomizer | Warsztat i widoczna od góry fabryka z taśmą i ramionami robotów. |
| BeatMarket | Sceny, ruchomy tłum, pokaz świetlny i syntetyczne warianty muzyki. |
| Isto Kebab | Bistro z menu i zamówieniami, stragany i gotująca postać. |
| Jalapeno | Plac z przyczepą gastronomiczną odsyła do istniejącej realizacji marketingowej. |

Dodatkowe ciała niebieskie pojawiają się na mapie po odkryciu.

## Kadry z buildu produkcyjnego

- [Start](screenshots/universe-home.webp) · [Mapa](screenshots/universe-system.webp) · [Menu](screenshots/universe-menu.webp)
- [Telefon](screenshots/universe-mobile-home.webp) · [Mapa na telefonie](screenshots/universe-mobile-system.webp) · [Krótki ekran w WebKit](screenshots/universe-mobile-short.webp) · [BeatMarket na telefonie](screenshots/universe-mobile-beatmarket.webp)
- [StarCars](screenshots/universe-starcars.webp) · [ReEnergy](screenshots/universe-reenergy.webp) · [B-CRM](screenshots/universe-b-crm.webp) · [AI World](screenshots/universe-ai.webp)
- [Motomizer](screenshots/universe-motomizer.webp) · [BeatMarket](screenshots/universe-beatmarket.webp) · [Isto](screenshots/universe-isto-kebab.webp) · [Jalapeno](screenshots/universe-jalapeno.webp)
- [K-01](screenshots/universe-moon.webp) · [G-02](screenshots/universe-garage.webp) · [The Unknown](screenshots/universe-unknown.webp)
- [Skan UFO](screenshots/universe-ufo.webp) · [Podróż](screenshots/universe-flight.webp)
- [Szczegóły B-CRM i karta](screenshots/universe-b-crm-panel.webp) · [Widok bez WebGL](screenshots/universe-static.webp)
- [Sprawdzenia i pomiary](../../QUALITY_GATE.md) · [Stan projektu](../../PROGRESS.md)

## Scena i źródła

Rejestr planet utrzymuje pozycje i promienie. Widok układu używa prostych zastępników. Z aktywną planetą wczytywane są lokalna architektura i ruch, a zasoby projektu są zwalniane po opuszczeniu planety. Drogi, tory i chodniki powstają z tych samych zweryfikowanych próbek co ruch. Trasy wodne korzystają z maski przeciwnej do tras lądowych.

- Samochody ekspozycyjne StarCars pochodzą z modelu [Mid-Engine Supercar v2, tevy · CC0](https://tevy.dev/models/supercar).
- Kolor, normalne i szorstkość wykorzystują [Asphalt 012](https://ambientcg.com/view?id=Asphalt012), [Concrete 034](https://ambientcg.com/view?id=Concrete034) i [Wood 049](https://ambientcg.com/view?id=Wood049).
- Oświetlenie wykorzystuje [Poly Haven Kloppenheim 06 Pure Sky · CC0](https://polyhaven.com/a/kloppenheim_06_puresky).
- Modele przestrzeni, wnętrza scen projektowych i dźwięki syntezowane są częścią implementacji. Portret pluszowego przewodnika wykorzystuje portret autora.

Na potrzeby lokalnego uruchomienia użyj `npm ci` oraz `npm run dev`.
