export type ToolboxItem = { slug:string; title:string; description:string; category:string; mode:string; hint:string; question:string; answer:string };
export const toolboxItems: ToolboxItem[] =  [
  {
    "slug": "audyt-strony",
    "title": "Darmowy kompleksowy audyt strony internetowej",
    "description": "Wpisz jeden adres i sprawdź do 7 publicznych podstron: SEO, indeksowanie, meta tagi, obrazy, TLS, DNS, analitykę i nagłówki bezpieczeństwa. Jeden zbiorczy raport.",
    "category": "WWW i SEO",
    "mode": "site",
    "hint": "Zbiorczy raport analizuje do 7 podstron tej samej domeny oraz publiczne ustawienia robots.txt, sitemap.xml, SSL i poczty. Podpowiada konkretne poprawki, bez przełączania się pomiędzy osobnymi testerami.",
    "question": "Czy jeden audyt zastąpi sprawdzanie wszystkich podstron?",
    "answer": "W jednym uruchomieniu wykonujemy wiele kontroli na maksymalnie 7 podstronach. To praktyczna analiza próbki, nie pełny crawl całej witryny ani pomiar Core Web Vitals. Szczegółowe testery pozostają dostępne osobno."
  },
  {
    "slug": "audyt-seo",
    "title": "Darmowy audyt SEO strony",
    "description": "Sprawdź tytuł, opis, nagłówki, kanoniczny adres, indeksowanie i dane strukturalne swojej podstrony.",
    "category": "WWW i SEO",
    "mode": "seo",
    "hint": "Szybko zidentyfikuj problemy on-page, które warto zweryfikować przed rozbudową SEO.",
    "question": "Czy wynik pokazuje pozycję w Google?",
    "answer": "Nie. Analizuje wybrane elementy strony, nie jej rzeczywiste pozycje ani status indeksowania w Google Search Console."
  },
  {
    "slug": "analizator-meta-tagow",
    "title": "Darmowy analizator meta tagów strony",
    "description": "Sprawdź title, description, canonical i robots bez instalowania rozszerzeń.",
    "category": "WWW i SEO",
    "mode": "meta",
    "hint": "Podaj URL, aby odczytać kluczowe znaczniki strony i ich długości.",
    "question": "Czy Google zawsze pokazuje meta description?",
    "answer": "Nie. Google może ułożyć własny opis na podstawie treści strony i zapytania."
  },
  {
    "slug": "tester-naglowkow-h1-h6",
    "title": "Darmowy tester nagłówków H1–H6",
    "description": "Zobacz hierarchię nagłówków H1, H2 i H3 na swojej stronie internetowej.",
    "category": "WWW i SEO",
    "mode": "headings",
    "hint": "Sprawdź strukturę nagłówków odczytaną z HTML i oceniaj ją w kontekście treści.",
    "question": "Czy jeden H1 to bezwzględny wymóg?",
    "answer": "Nie. To czytelna konwencja, a nie gwarancja wyższej pozycji w wyszukiwarce."
  },
  {
    "slug": "tester-open-graph",
    "title": "Darmowy tester Open Graph",
    "description": "Sprawdź, jakie tytuły, opisy i grafiki strona podaje do podglądu linków.",
    "category": "WWW i SEO",
    "mode": "og",
    "hint": "Wykryj znaczniki og:title, og:description, og:image oraz Twitter Cards.",
    "question": "Czy podgląd jest identyczny we wszystkich serwisach?",
    "answer": "Nie. Facebook, LinkedIn i inne platformy mogą stosować własny cache i zasady kadrowania."
  },
  {
    "slug": "czy-ai-widzi-strone",
    "title": "Darmowy test dostępności strony dla botów AI",
    "description": "Sprawdź podstawowe sygnały dostępu dla crawlerów AI: robots.txt, noindex i treści HTML.",
    "category": "AI i wyszukiwarki",
    "mode": "ai",
    "hint": "Sprawdź, czy publiczny kod strony i wskazówki dla botów nie blokują wybranych robotów.",
    "question": "Czy dostępność strony gwarantuje polecanie przez AI?",
    "answer": "Nie. Tester sprawdza techniczne sygnały dostępności, nie rekomendacje, cytowania ani widoczność w modelach AI."
  },
  {
    "slug": "sprawdzanie-certyfikatu-ssl",
    "title": "Darmowe sprawdzanie certyfikatu SSL i TLS",
    "description": "Odczytaj wystawcę, termin ważności i domenę publicznego certyfikatu HTTPS.",
    "category": "WWW i SEO",
    "mode": "tls",
    "hint": "Sprawdź certyfikat serwera HTTPS bez instalowania narzędzi.",
    "question": "Czy poprawny certyfikat oznacza pełne bezpieczeństwo?",
    "answer": "Nie. Potwierdza wybrane aspekty szyfrowanego połączenia, nie bezpieczeństwo całej aplikacji."
  },
  {
    "slug": "test-spf-dmarc",
    "title": "Darmowy tester SPF i DMARC domeny",
    "description": "Sprawdź publiczne rekordy SPF i DMARC oraz podstawowe błędy konfiguracji poczty.",
    "category": "WWW i SEO",
    "mode": "dns",
    "hint": "Podaj domenę, aby zobaczyć rekordy TXT dotyczące uwierzytelniania poczty.",
    "question": "Czy to sprawdza również DKIM?",
    "answer": "Nie. Sprawdzenie DKIM wymaga znajomości selektora używanego przez dostawcę poczty."
  },
  {
    "slug": "walidator-robots-txt",
    "title": "Darmowy tester pliku robots.txt",
    "description": "Wklej robots.txt i sprawdź dyrektywy User-agent, Allow, Disallow oraz Sitemap.",
    "category": "WWW i SEO",
    "mode": "robots",
    "hint": "Wklej zawartość pliku robots.txt i skontroluj podstawową składnię oraz reguły.",
    "question": "Czy Disallow blokuje indeksowanie?",
    "answer": "Nie zawsze. Dyrektywa ogranicza crawling, a URL może nadal być indeksowany innymi metodami."
  },
  {
    "slug": "walidator-sitemap-xml",
    "title": "Darmowy walidator sitemap.xml",
    "description": "Sprawdź poprawność XML i policz adresy URL w mapie strony.",
    "category": "WWW i SEO",
    "mode": "sitemap",
    "hint": "Wklej sitemap.xml i otrzymaj raport o strukturze, liczbie adresów i błędach.",
    "question": "Czy poprawna mapa oznacza indeksację?",
    "answer": "Nie. Mapa strony pomaga odkrywać adresy, ale ich indeksacja zależy od wielu innych czynników."
  },
  {
    "slug": "walidator-schema-org",
    "title": "Darmowy walidator danych Schema.org",
    "description": "Sprawdź składnię JSON-LD i podstawową strukturę danych uporządkowanych.",
    "category": "WWW i SEO",
    "mode": "schema",
    "hint": "Wklej dane JSON-LD i wykryj błędy składni oraz brak kluczowych pól.",
    "question": "Czy tester potwierdza rich results Google?",
    "answer": "Nie. Do sprawdzenia obsługiwanych wyników rozszerzonych użyj również oficjalnego testu Google."
  },
  {
    "slug": "generator-schema-localbusiness",
    "title": "Darmowy generator Schema.org LocalBusiness",
    "description": "Wygeneruj kod JSON-LD z nazwą, stroną i adresem swojej firmy.",
    "category": "WWW i SEO",
    "mode": "schemaGenerate",
    "hint": "Wypełnij dane firmy i skopiuj gotowy znacznik JSON-LD.",
    "question": "Czy mogę wpisywać nieprawdziwe dane?",
    "answer": "Nie. Dane strukturalne powinny odpowiadać realnej treści i faktycznym informacjom o działalności."
  },
  {
    "slug": "podglad-wyniku-google",
    "title": "Darmowy podgląd wyniku Google",
    "description": "Zobacz symulację tytułu, opisu i adresu w wynikach wyszukiwania.",
    "category": "WWW i SEO",
    "mode": "serp",
    "hint": "Wpisz title, description i URL. Zobacz przybliżony wygląd wyniku wyszukiwania.",
    "question": "Czy Google wyświetli dokładnie taki snippet?",
    "answer": "Nie. To podgląd orientacyjny; Google może modyfikować tytuł i opis."
  },
  {
    "slug": "generator-llms-txt",
    "title": "Darmowy generator pliku llms.txt",
    "description": "Stwórz prosty plik llms.txt opisujący firmę i jej najważniejsze zasoby.",
    "category": "AI i wyszukiwarki",
    "mode": "llms",
    "hint": "Wpisz nazwę, opis i linki. Pobierz gotowy tekst do udostępnienia pod /llms.txt.",
    "question": "Czy llms.txt wpływa na ranking w AI?",
    "answer": "Nie ma gwarancji. To propozycja formatu, a nie oficjalny czynnik rankingu."
  },
  {
    "slug": "diagnostyka-meta-ads",
    "title": "Darmowa diagnostyka Meta Ads",
    "description": "Znajdź przyczynę komunikatów: zestaw reklam nieaktywny, reklama odrzucona lub brak wydatków.",
    "category": "Reklamy i marketing",
    "mode": "adsIssues",
    "hint": "Wybierz problem z Menedżera reklam. Otrzymasz konkretne kroki diagnostyczne.",
    "question": "Czy narzędzie ma dostęp do konta reklamowego?",
    "answer": "Nie. Diagnostyka jest oparta na wybranym objawie i nie wymaga logowania na Facebooka."
  },
  {
    "slug": "analiza-wynikow-meta-ads-csv",
    "title": "Darmowa analiza wyników Meta Ads z CSV",
    "description": "Wgraj eksport CSV z Menedżera reklam i policz wydatki, kliknięcia, CTR, CPC, leady i CPL.",
    "category": "Reklamy i marketing",
    "mode": "adsCsv",
    "hint": "Wczytaj plik CSV lokalnie w przeglądarce. Raport nie musi trafiać na serwer.",
    "question": "Czy moje dane reklamowe są wysyłane?",
    "answer": "Nie. CSV jest przeliczany lokalnie w przeglądarce. Sprawdź poprawność rozpoznanych kolumn."
  },
  {
    "slug": "kalkulator-roas",
    "title": "Darmowy kalkulator ROAS",
    "description": "Policz zwrot z wydatków reklamowych na podstawie przychodu i budżetu.",
    "category": "Reklamy i marketing",
    "mode": "roas",
    "hint": "Wprowadź kwotę wydaną na reklamę i przychód przypisany kampanii.",
    "question": "Czy ROAS oznacza zysk?",
    "answer": "Nie. ROAS nie odejmuje kosztu produktów, obsługi ani podatków."
  },
  {
    "slug": "kalkulator-cpl",
    "title": "Darmowy kalkulator CPL i kosztu leada",
    "description": "Oblicz koszt pozyskania kontaktu z reklamy i oszacuj liczbę leadów.",
    "category": "Reklamy i marketing",
    "mode": "cpl",
    "hint": "Podaj wydatki reklamowe i liczbę pozyskanych leadów.",
    "question": "Czy najniższy CPL jest zawsze najlepszy?",
    "answer": "Nie. Liczy się też jakość leadów i koszt pozyskania klienta."
  },
  {
    "slug": "kalkulator-budzetu-reklam",
    "title": "Darmowy kalkulator budżetu reklamowego",
    "description": "Wylicz orientacyjny budżet potrzebny do osiągnięcia celu leadowego.",
    "category": "Reklamy i marketing",
    "mode": "budget",
    "hint": "Podaj docelową liczbę leadów i zakładany CPL.",
    "question": "Czy kalkulator przewiduje realne wyniki kampanii?",
    "answer": "Nie. Oblicza budżet na podstawie przyjętych założeń, a nie prognozuje aukcji reklamowej."
  },
  {
    "slug": "kalkulator-oplacalnosci-reklam",
    "title": "Darmowy kalkulator opłacalności reklam",
    "description": "Oceń wynik kampanii z uwzględnieniem przychodu, marży i kosztu reklam.",
    "category": "Reklamy i marketing",
    "mode": "profit",
    "hint": "Wprowadź przychód, marżę brutto i wydatki na reklamę.",
    "question": "Czy wynik jest księgowym zyskiem netto?",
    "answer": "Nie. Nie uwzględnia wszystkich kosztów stałych, podatków i kosztów pracy."
  },
  {
    "slug": "generator-utm",
    "title": "Darmowy generator linków UTM",
    "description": "Zbuduj link kampanii z utm_source, utm_medium, utm_campaign i innymi parametrami.",
    "category": "Reklamy i marketing",
    "mode": "utm",
    "hint": "Wypełnij pola i skopiuj poprawnie zakodowany adres URL.",
    "question": "Czy UTM wpływają na pozycjonowanie?",
    "answer": "Same parametry UTM nie poprawiają pozycji, służą do oznaczania źródeł ruchu."
  },
  {
    "slug": "licznik-znakow-reklamy",
    "title": "Darmowy licznik znaków reklamy",
    "description": "Sprawdź długość nagłówka i tekstu reklamy przed publikacją.",
    "category": "Reklamy i marketing",
    "mode": "adText",
    "hint": "Wklej tekst reklamy i kontroluj liczbę znaków w polach.",
    "question": "Czy limity są takie same na wszystkich placementach?",
    "answer": "Nie. Widoczna długość tekstu zależy od platformy, formatu i urządzenia."
  },
  {
    "slug": "kalkulator-konwersji-strony",
    "title": "Darmowy kalkulator konwersji strony WWW",
    "description": "Policz współczynnik konwersji odwiedzin na zapytania i sprzedaż.",
    "category": "Reklamy i marketing",
    "mode": "conversion",
    "hint": "Podaj liczbę odwiedzin, leadów i klientów.",
    "question": "Czy konwersja równa się sprzedaży?",
    "answer": "Nie. Możesz mierzyć osobno konwersję na leada i konwersję leada w klienta."
  },
  {
    "slug": "kalkulator-cac",
    "title": "Darmowy kalkulator kosztu pozyskania klienta (CAC)",
    "description": "Oblicz koszt pozyskania jednego klienta na podstawie wydatków i sprzedaży.",
    "category": "Reklamy i marketing",
    "mode": "cac",
    "hint": "Wprowadź koszty marketingu i sprzedaży oraz liczbę nowych klientów.",
    "question": "Czy CAC uwzględnia koszt obsługi?",
    "answer": "Tylko wtedy, gdy dodasz go do kosztów. Wynik zależy od przyjętego zakresu kosztów."
  },
  {
    "slug": "kalkulator-strat-z-leadow",
    "title": "Darmowy kalkulator utraconych leadów",
    "description": "Oszacuj wartość kontaktów, na które firma nie odpowiedziała.",
    "category": "CRM i sprzedaż",
    "mode": "lostLeads",
    "hint": "Wprowadź liczbę nieobsłużonych leadów, konwersję i średnią marżę na sprzedaży.",
    "question": "Czy to rzeczywista strata firmy?",
    "answer": "Nie. To model potencjalnie utraconej marży oparty na Twoich założeniach."
  },
  {
    "slug": "kalkulator-roi-crm",
    "title": "Darmowy kalkulator zwrotu z CRM",
    "description": "Sprawdź hipotetyczny okres zwrotu z wdrożenia CRM przy założonym wzroście sprzedaży.",
    "category": "CRM i sprzedaż",
    "mode": "crm",
    "hint": "Podaj koszty CRM, obecne leady i możliwą poprawę konwersji.",
    "question": "Czy CRM gwarantuje wzrost sprzedaży?",
    "answer": "Nie. Kalkulator pokazuje scenariusz, a wynik zależy od procesu i jakości wdrożenia."
  },
  {
    "slug": "kalkulator-oszczednosci-automatyzacji",
    "title": "Darmowy kalkulator oszczędności z automatyzacji",
    "description": "Sprawdź, ile czasu i kosztów może oszczędzić automatyzacja powtarzalnych zadań.",
    "category": "CRM i sprzedaż",
    "mode": "automation",
    "hint": "Wpisz liczbę godzin, koszt godziny i poziom automatyzacji.",
    "question": "Czy automatyzacja usuwa cały koszt pracy?",
    "answer": "Nie. Obliczenie pokazuje orientacyjną wartość odzyskanego czasu, nie zawsze oszczędność gotówkową."
  },
  {
    "slug": "kalkulator-kosztu-strony",
    "title": "Darmowy kalkulator ceny strony internetowej",
    "description": "Oszacuj orientacyjny budżet na stronę lub landing page na podstawie zakresu prac.",
    "category": "CRM i sprzedaż",
    "mode": "siteCost",
    "hint": "Zaznacz typ strony, liczbę podstron i dodatkowe funkcje.",
    "question": "Czy wynik jest wiążącą wyceną?",
    "answer": "Nie. To orientacyjny przedział budżetu; oferta wymaga analizy treści i funkcjonalności."
  },
  {
    "slug": "dekoder-jwt",
    "title": "Darmowy dekoder JWT",
    "description": "Odczytaj nagłówek i payload tokenu JWT bez wysyłania go na serwer.",
    "category": "Dla programistów",
    "mode": "jwt",
    "hint": "Wklej token. Dekodowanie odbywa się wyłącznie w przeglądarce.",
    "question": "Czy dekoder sprawdza podpis JWT?",
    "answer": "Nie. Dekodowanie danych nie oznacza weryfikacji podpisu ani autentyczności tokenu."
  },
  {
    "slug": "konwerter-unix-time",
    "title": "Darmowy konwerter czasu Unix",
    "description": "Zamieniaj znaczniki czasu Unix na datę w Polsce i UTC.",
    "category": "Dla programistów",
    "mode": "unix",
    "hint": "Wprowadź timestamp w sekundach lub milisekundach.",
    "question": "Dlaczego wynik różni się o godzinę lub dwie?",
    "answer": "Czas polski uwzględnia przesunięcie strefowe i zmianę czasu letniego."
  },
  {
    "slug": "formatter-json",
    "title": "Darmowy walidator i formatter JSON",
    "description": "Waliduj, formatuj i kopiuj czytelny kod JSON bez przesyłania danych na serwer.",
    "category": "Dla programistów",
    "mode": "json",
    "hint": "Wklej JSON, aby wykryć błąd składni i otrzymać poprawne formatowanie.",
    "question": "Czy formatter modyfikuje wartości danych?",
    "answer": "Nie zmienia znaczenia poprawnego JSON; może jedynie zmienić wcięcia i zapis whitespace."
  },
  {
    "slug": "generator-uuid",
    "title": "Darmowy generator UUID v4",
    "description": "Generuj losowe identyfikatory UUID w przeglądarce.",
    "category": "Dla programistów",
    "mode": "uuid",
    "hint": "Wygeneruj UUID v4 za pomocą bezpiecznego generatora losowości przeglądarki.",
    "question": "Czy UUID jest hasłem?",
    "answer": "Nie. UUID służy do identyfikacji obiektów, nie jako tajny token bezpieczeństwa."
  },
  {
    "slug": "test-czasu-odpowiedzi-serwera",
    "title": "Darmowy tester czasu odpowiedzi serwera TTFB",
    "description": "Zmierz czas otrzymania pierwszego bajtu odpowiedzi dla publicznej strony internetowej.",
    "category": "WWW i SEO",
    "mode": "ttfb",
    "hint": "Zobacz czas pierwszej odpowiedzi i rozmiar pobranego HTML. To pomiar pojedynczego żądania, nie pełny test szybkości.",
    "question": "Czy TTFB jest równoznaczne z Core Web Vitals?",
    "answer": "Nie. TTFB mierzy tylko część komunikacji z serwerem, a Core Web Vitals dotyczą doświadczeń użytkownika z ładowania i interakcji."
  },
  {
    "slug": "tester-przekierowan-301-302",
    "title": "Darmowy tester przekierowań HTTP 301/302",
    "description": "Sprawdź łańcuch przekierowań i ostateczny adres URL swojej strony.",
    "category": "WWW i SEO",
    "mode": "redirects",
    "hint": "Prześledź do trzech przekierowań HTTP od podanego adresu do końcowego URL.",
    "question": "Czy każde przekierowanie 301 jest błędem?",
    "answer": "Nie. Przekierowanie 301 może być prawidłowe. Problematyczne bywają pętle lub długie łańcuchy."
  },
  {
    "slug": "tester-naglowkow-bezpieczenstwa",
    "title": "Darmowy tester nagłówków bezpieczeństwa HTTP",
    "description": "Sprawdź, czy serwer zwraca CSP, HSTS, X-Content-Type-Options i inne nagłówki.",
    "category": "WWW i SEO",
    "mode": "headers",
    "hint": "Odczytaj podstawowe nagłówki bezpieczeństwa z odpowiedzi publicznej strony.",
    "question": "Czy obecność CSP oznacza całkowite bezpieczeństwo?",
    "answer": "Nie. Prawidłowa polityka CSP zależy od wartości i aplikacji; samo istnienie nagłówka nie gwarantuje ochrony."
  },
  {
    "slug": "tester-meta-pixel",
    "title": "Darmowy tester Meta Pixel",
    "description": "Wykryj typowe fragmenty instalacji Meta Pixel w publicznym HTML strony.",
    "category": "Reklamy i marketing",
    "mode": "pixel",
    "hint": "Sprawdź obecność kodu fbevents.js lub fbq w kodzie odpowiedzi serwera.",
    "question": "Czy wykryty kod oznacza poprawną konwersję?",
    "answer": "Nie. Pixel może się uruchamiać błędnie, być blokowany przez zgody lub nie wysyłać właściwych zdarzeń."
  },
  {
    "slug": "tester-google-tag-manager",
    "title": "Darmowy tester Google Tag Manager",
    "description": "Sprawdź ślady kontenera GTM i tagu Google Analytics w kodzie strony.",
    "category": "Reklamy i marketing",
    "mode": "gtm",
    "hint": "Wykryj skrypt Google Tag Manager lub identyfikator pomiarowy w pobranym HTML.",
    "question": "Czy brak GTM oznacza brak analityki?",
    "answer": "Nie. Analityka może być zaimplementowana inaczej lub doładowana po uruchomieniu JavaScript."
  },
  {
    "slug": "tester-obrazow-alt",
    "title": "Darmowy tester atrybutów ALT obrazów",
    "description": "Sprawdź liczbę obrazów i brakujących atrybutów alt w publicznym HTML.",
    "category": "WWW i SEO",
    "mode": "images",
    "hint": "Zlicz elementy img oraz te, które nie zawierają atrybutu alt.",
    "question": "Czy każdy obraz musi mieć opisowy ALT?",
    "answer": "Nie. Obrazy dekoracyjne mogą mieć alt pusty; brak atrybutu alt jest jednak sygnałem do sprawdzenia."
  },
  {
    "slug": "kalkulator-cpc",
    "title": "Darmowy kalkulator CPC",
    "description": "Oblicz średni koszt kliknięcia reklamy na podstawie budżetu i liczby kliknięć.",
    "category": "Reklamy i marketing",
    "mode": "cpc",
    "hint": "Podaj łączny koszt i liczbę kliknięć linku.",
    "question": "Czy CPC uwzględnia jakość leadów?",
    "answer": "Nie. CPC mierzy koszt kliknięcia, nie późniejszą skuteczność pozyskiwania klientów."
  },
  {
    "slug": "kalkulator-cpm",
    "title": "Darmowy kalkulator CPM",
    "description": "Oblicz koszt tysiąca wyświetleń reklam i porównaj kampanie.",
    "category": "Reklamy i marketing",
    "mode": "cpm",
    "hint": "Podaj wydatki reklamowe i liczbę wyświetleń.",
    "question": "Czy tani CPM oznacza skuteczną kampanię?",
    "answer": "Nie. Istotne są również częstotliwość, jakość odbiorców i konwersje."
  },
  {
    "slug": "kalkulator-leadow-z-ruchu",
    "title": "Darmowy kalkulator leadów z ruchu",
    "description": "Oszacuj liczbę zapytań przy zadanym ruchu i współczynniku konwersji strony.",
    "category": "Reklamy i marketing",
    "mode": "traffic",
    "hint": "Wprowadź liczbę odwiedzin i zakładany procent konwersji.",
    "question": "Czy to prognoza pozyskiwania leadów?",
    "answer": "Nie. To scenariusz wynikający z podanych założeń, a nie prognoza ruchu lub skuteczności."
  },
  {
    "slug": "kalkulator-ltv-klienta",
    "title": "Darmowy kalkulator LTV klienta",
    "description": "Oblicz modelową wartość marży z klienta z uwzględnieniem ponownych zakupów.",
    "category": "CRM i sprzedaż",
    "mode": "ltv",
    "hint": "Wprowadź średnią wartość zamówienia, liczbę zakupów rocznie, okres współpracy i marżę.",
    "question": "Czy model LTV uwzględnia retencję i dyskonto?",
    "answer": "Nie. To uproszczony scenariusz bez prawdopodobieństw rezygnacji i wartości pieniądza w czasie."
  },
  {
    "slug": "konwerter-base64",
    "title": "Darmowy konwerter Base64",
    "description": "Koduj i dekoduj UTF-8 jako Base64 bez wysyłania tekstu na serwer.",
    "category": "Dla programistów",
    "mode": "base64",
    "hint": "Wklej tekst i wybierz kodowanie lub dekodowanie Base64 w przeglądarce.",
    "question": "Czy Base64 szyfruje dane?",
    "answer": "Nie. To kodowanie reprezentacji bajtów, nie zabezpieczenie ani szyfrowanie."
  },
  {
    "slug": "generator-sha256",
    "title": "Darmowy generator SHA-256",
    "description": "Oblicz skrót SHA-256 dowolnego tekstu lokalnie w przeglądarce.",
    "category": "Dla programistów",
    "mode": "sha256",
    "hint": "Wpisz tekst, aby otrzymać jego skrót SHA-256 w postaci szesnastkowej.",
    "question": "Czy SHA-256 nadaje się do przechowywania haseł?",
    "answer": "Nie używaj zwykłego SHA-256 bezpośrednio do haseł. Preferuj Argon2id, bcrypt lub scrypt z odpowiednimi parametrami."
  },
  {
    "slug": "tester-kontrastu-kolorow",
    "title": "Darmowy tester kontrastu kolorów WCAG",
    "description": "Sprawdź kontrast dwóch kolorów i podstawowe progi WCAG AA dla tekstu.",
    "category": "Dla programistów",
    "mode": "contrast",
    "hint": "Podaj dwa kolory w formacie HEX, aby obliczyć współczynnik kontrastu.",
    "question": "Czy samo AA zapewnia zgodność WCAG?",
    "answer": "Nie. Kontrast dotyczy tylko jednego kryterium dostępności; potrzebne są także inne kontrole."
  },
  {
    "slug": "kalkulator-vat",
    "title": "Darmowy kalkulator VAT netto brutto — 8% i 23%",
    "description": "Błyskawicznie przelicz cenę netto na brutto i brutto na netto. Wybierz VAT 8% lub 23%, sprawdź podatek i skopiuj wynik.",
    "category": "CRM i sprzedaż",
    "mode": "vat",
    "hint": "Wybierz stawkę 8% albo 23%, kierunek przeliczenia i wpisz kwotę. Kalkulator natychmiast pokazuje netto, VAT i brutto. Przeliczanie odbywa się lokalnie w przeglądarce z dokładnością do grosza.",
    "question": "Czy z kwoty brutto mogę wyliczyć netto i sam VAT?",
    "answer": "Tak. Kalkulator dzieli kwotę brutto przez 1,08 lub 1,23 i zaokrągla wynik do grosza. Pamiętaj, że prawidłowa stawka VAT zależy od rodzaju towaru lub usługi."
  },
  {
    "slug": "edytor-pdf",
    "title": "Darmowy edytor PDF online — bez rejestracji",
    "description": "Edytuj PDF za darmo: dodawaj tekst, podpisy i zdjęcia, zmieniaj kolejność stron, obracaj je i pobieraj wynik. Bez rejestracji, bez karty kredytowej i bez przesyłania plików na serwer.",
    "category": "Dokumenty i pliki",
    "mode": "pdf",
    "hint": "Otwórz PDF z dysku lub stwórz pusty dokument. Dodawaj tekst, podpisy, obrazy i kształty, edytuj je oraz porządkuj strony. Pobierz gotowy PDF bez logowania. Podmiana istniejącego tekstu PDF odbywa się przez wizualną nakładkę i nie usuwa oryginalnej zawartości.",
    "question": "Czy mogę zmienić istniejący tekst w PDF jak w Wordzie?",
    "answer": "Możesz kliknąć tekst i wizualnie zakryć go nową treścią. To nie jest pełna edycja oryginalnego strumienia tekstu PDF. Oryginał pozostaje w warstwie dokumentu, dlatego ta funkcja nie nadaje się do usuwania poufnych danych."
  }
];
export const toolboxCategories = ["Wszystkie", "WWW i SEO", "Reklamy i marketing", "CRM i sprzedaż", "AI i wyszukiwarki", "Dla programistów", "Dokumenty i pliki"];
export function findTool(slug:string){return toolboxItems.find(item=>item.slug===slug);}
