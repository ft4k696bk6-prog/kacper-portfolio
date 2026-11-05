# Widoczność: wdrożenie i dalsza dystrybucja

Oferta obejmuje strony, CRM/web app, reklamy i social media. Poradniki odpowiadają na pytania przed zakupem; zawierają linki do oferty i kontaktu. Współprace opisują zakres podany przez właściciela. Dla Gentlemen Barber nie podano zakresu, więc strona go nie przypisuje. Cytaty klientów i wyniki wymagają rzeczywistych materiałów.

## Kontrola publikacji

`npm run seo:audit` sprawdza publiczne adresy z sitemapy: dostępność, tytuły, canonical, brak noindex, H1 i poprawność JSON-LD. `npm run seo:submit` wykonuje tę kontrolę, sprawdza publiczny klucz i zgłasza adresy do IndexNow. HTTP 200/202 oznacza przyjęcie zgłoszenia, nie indeksację. Plik `docs/search-discovery.workflow.yml` jest przygotowanym szablonem cotygodniowej kontroli i ręcznego zgłoszenia. Harmonogram nie jest aktywny: publikacja z nowym plikiem w `.github/workflows` została odrzucona przez GitHub. Aby go uruchomić, właściciel repozytorium może przenieść szablon do `.github/workflows/search-discovery.yml`.

Google Search Console i Bing Webmaster Tools: rekordy DNS zostały dodane, a właściciel potwierdził zakończenie konfiguracji. Brak dostępu do tych paneli przez konektor oznacza, że nie możemy niezależnie potwierdzić raportów indeksowania ani kliknięć. Sprawdzić sitemapę i URL Inspection w panelach. Google nie korzysta z IndexNow.

## Poza własną stroną

Najbliższe działania oparte na rzeczywistych materiałach:

- Ujednolicić opis i link na własnym LinkedIn/GitHub oraz profilach usługowych. Proponowany opis: „Kacper Bernecki — strony internetowe, CRM i aplikacje webowe. Marketing, reklamy i prowadzenie social mediów dla małych firm. Bezpośrednia współpraca, zdalnie w całej Polsce. Realizacje i kontakt: https://bernecki.dev/”.
- Opublikować dokładne opinie klientów, z przypisaniem do firmy i ich zgodą. Nie kopiować opinii o restauracji czy salonie jako opinii o wykonawcy strony.
- Uzyskać naturalne wzmianki/linki w opisach współprac na stronach klientów, jeśli właściciele tych stron to akceptują. Zgoda na opis w portfolio nie jest zgodą na zmianę strony klienta.
- Rozbudować case studies o problem, własny zakres, materiały przed/po i udokumentowane wyniki. Nie przypisywać wzrostu sprzedaży bez danych.
- Po zebraniu danych w Search Console sprawdzić zapytania, strony docelowe i kliknięcia. Oceniać liczbę i jakość zapytań, nie sam ruch. Zapytać klienta, skąd trafił, gdy kanał nie jest widoczny w analityce.

Nie uruchomiono płatnych reklam ani nie zakładano kont w katalogach. Nie wysyłano wiadomości do klientów. Nie ma uzasadnienia do masowych stron miast, kupowania linków ani powielania tekstów.

## Źródła sprawdzone

- https://developers.google.com/search/docs/appearance/ai-features — podstawowe SEO, dostępność, tekst, linkowanie i zgodność schematów z widoczną treścią; brak dodatkowego specjalnego schematu AI.
- https://www.instagram.com/jalapeno_kebab/ — publiczny profil Jalapeno Kebab Niemce.
- https://re-energysystem.pl/ — publiczna strona Re-energy.
- https://star-cars.us — publiczna strona StarCars.

`llms.txt` jest pomocniczym opisem. Nie zastępuje indeksowania ani dowodów doświadczenia; nie gwarantuje rekomendacji modeli.
