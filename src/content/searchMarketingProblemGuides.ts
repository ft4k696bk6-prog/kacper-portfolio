const topics = [
  {
    "slug": "google-sitemap-zgloszona-a-strony-brak",
    "title": "Sitemap wysłana do Google, ale strony nadal nie ma w wynikach",
    "description": "Google Search Console przyjęło sitemap.xml, lecz domena nie pojawia się w wyszukiwarce. Co sprawdzić dalej?",
    "symptom": "Search Console pokazuje pomyślne przesłanie mapy, ale po wpisaniu nazwy nowej strony trudno znaleźć wynik. Taka sytuacja była analizowana przy witrynach firmowych.",
    "cause": "Mapa strony wskazuje robotowi adresy, ale nie jest obietnicą ich indeksowania. Google analizuje dostępność, duplikację, jakość i znaczenie treści.",
    "steps": [
      "W Search Console sprawdź Inspekcję URL dla konkretnego adresu, a nie tylko status sitemap.",
      "Zweryfikuj, czy strona zwraca 200, jest publiczna i nie ma noindex.",
      "Sprawdź canonical, przekierowania oraz link do podstrony z istniejącej nawigacji.",
      "Porównaj zawartość z innymi podstronami i usuń niepotrzebne kopie tekstu.",
      "Po naprawie poproś o ponowne sprawdzenie i obserwuj raport indeksacji, zamiast wielokrotnie wysyłać tę samą mapę."
    ],
    "check": "Adres jest dostępny dla robota i ma poprawne sygnały techniczne; ostateczna decyzja o indeksacji należy do wyszukiwarki.",
    "warning": "Nie obiecuj sobie ani klientowi natychmiastowego pojawienia się w wynikach tylko dlatego, że mapa została przyjęta.",
    "source": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview"
  },
  {
    "slug": "google-zeskanowano-ale-nie-zindeksowano",
    "title": "Google: zeskanowano, ale nie zindeksowano — co poprawić?",
    "description": "Crawled - currently not indexed. Jak rozpoznać problem treści, duplikacji lub niskiej wartości podstrony.",
    "symptom": "Google pobrał podstronę, ale nie dodał jej do indeksu.",
    "cause": "Sam prawidłowy kod HTTP nie gwarantuje, że wyszukiwarka uzna stronę za wartą indeksacji. Częstym problemem jest powtarzalna lub zbyt uboga zawartość.",
    "steps": [
      "Otwórz Inspekcję URL i sprawdź wersję kanoniczną oraz datę ostatniego crawlu.",
      "Porównaj stronę z innymi artykułami: czy rozwiązuje odrębny problem i podaje konkretne kroki?",
      "Dodaj własne przykłady, diagnostykę, zrzuty lub wynik testu tam, gdzie naprawdę istnieją.",
      "Wzmocnij linkowanie wewnętrzne z tematycznie bliskich artykułów.",
      "Po istotnej aktualizacji poproś o ponowną kontrolę i monitoruj status bez ustawiania sztucznych dat."
    ],
    "check": "Strona ma unikalną, użyteczną treść i poprawne sygnały indeksowania, choć decyzja Google nadal może być odmowna.",
    "warning": "Nie produkuj kilku niemal identycznych stron pod odmiany jednego zapytania, aby wymusić obecność w indeksie.",
    "source": "https://developers.google.com/search/docs/fundamentals/creating-helpful-content"
  },
  {
    "slug": "google-wykryto-ale-nie-zindeksowano",
    "title": "Google: wykryto, ale nie zindeksowano — dlaczego nie ma crawlu?",
    "description": "Discovered - currently not indexed w Search Console. Jak sprawdzić linki, sitemap i dostępność serwera.",
    "symptom": "Google zna adres nowego artykułu, ale raport pokazuje brak jego pobrania.",
    "cause": "Robot może odłożyć odwiedzenie adresu, szczególnie gdy witryna ma dużo podobnych stron, słabe linkowanie lub okresowe problemy z serwerem.",
    "steps": [
      "Sprawdź poprawny URL, zwłaszcza po zmianach domeny i przekierowaniach.",
      "Oceń odpowiedzi serwera i dostępność witryny dla niezalogowanych użytkowników.",
      "Dodaj naturalne linki z kategorii i powiązanych artykułów.",
      "W sitemap uwzględniaj wyłącznie kanoniczne, wartościowe URL.",
      "Poczekaj na kolejną próbę pobrania i śledź logi oraz raport Search Console."
    ],
    "check": "Robot ma dostępną ścieżkę do adresu, a serwer nie blokuje pobierania. Nie istnieje gwarantowany termin crawlu.",
    "warning": "Nie zgłaszaj wielokrotnie tego samego adresu jako jedynej strategii SEO.",
    "source": "https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget"
  },
  {
    "slug": "google-wybral-inny-adres-kanoniczny",
    "title": "Google wybrał inny canonical niż wskazałem — jak to naprawić?",
    "description": "Duplikaty URL i inny canonical w Search Console. Jak ujednolicić przekierowania, sitemap i linkowanie.",
    "symptom": "W Google Search Console wybrany przez Google adres kanoniczny jest inny niż ustawiony na stronie.",
    "cause": "Canonical jest wskazówką, a Google może wybrać inną wersję, gdy widzi sprzeczne sygnały między linkami, przekierowaniami i treścią.",
    "steps": [
      "Porównaj oba adresy i sprawdź, czy pokazują ten sam materiał.",
      "Zweryfikuj rel=canonical w HTML obu stron oraz odpowiedzi HTTP.",
      "Ujednolić linki wewnętrzne, sitemap, hreflang i przekierowania do jednej wersji.",
      "Rozróżnij faktyczny duplikat od stron, które powinny mieć osobną wartościową treść.",
      "Ponownie sprawdź dane po recrawlu i unikaj masowych zmian bez ustalenia przyczyny."
    ],
    "check": "Wszystkie ważne sygnały wskazują na oczekiwany adres, a niepotrzebne warianty nie są promowane linkami.",
    "warning": "Canonical nie jest twardą komendą dla Google i nie zastępuje trwałego przekierowania, gdy adres ma zostać wycofany.",
    "source": "https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls"
  },
  {
    "slug": "seo-javascript-strona-pusta-dla-robota",
    "title": "Strona w React wygląda dobrze, ale robot widzi mało treści",
    "description": "CSR kontra SSR i statyczne renderowanie w React/Next.js. Jak upewnić się, że tekst i linki są dostępne dla Google.",
    "symptom": "Użytkownik widzi artykuły i ofertę, ale w źródłowym HTML niewiele jest tekstu.",
    "cause": "Treść generowana wyłącznie po stronie klienta może wymagać dodatkowego etapu renderowania przez wyszukiwarkę i być trudniejsza do odkrycia.",
    "steps": [
      "Otwórz View Source i porównaj HTML z widokiem po uruchomieniu JavaScript.",
      "Sprawdź, czy nagłówki, podstawowe teksty i zwykłe linki a href pojawiają się w odpowiedzi serwera.",
      "W Next.js rozważ SSR lub statyczne renderowanie stron informacyjnych.",
      "Przetestuj narzędzia Search Console do oceny wersji widzianej przez Google.",
      "Unikaj blokowania zasobów JS i CSS potrzebnych do renderowania."
    ],
    "check": "Kluczowy tekst, tytuł i linki do artykułów znajdują się w HTML serwera, a strona pozostaje użyteczna po wczytaniu skryptów.",
    "warning": "Nie zakładaj, że Google w ogóle nie obsługuje JavaScript; problemem jest niezawodność i dostępność treści.",
    "source": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics"
  },
  {
    "slug": "google-business-wizytowka-bez-adresu-weryfikacja",
    "title": "Wizytówka Google bez adresu: jak zweryfikować firmę usługową?",
    "description": "Profil Firmy w Google bez publicznego biura. Obszar działania, ukryty adres i możliwe metody weryfikacji.",
    "symptom": "Firma obsługuje klientów u nich, nie prowadzi lokalu dostępnego dla odwiedzających i nie chce podawać adresu w wizytówce.",
    "cause": "Google rozróżnia firmy z lokalizacją dla klientów i firmy działające na określonym obszarze. Metody weryfikacji zależą od profilu i są wybierane przez platformę.",
    "steps": [
      "Sprawdź zasady kwalifikowania się firmy usługowej i czy działalność spełnia warunki profilu.",
      "Ustaw typ działalności oraz obszar obsługi zgodnie z rzeczywistą działalnością.",
      "Jeśli nie przyjmujesz klientów pod adresem, skonfiguruj ukrywanie adresu według zasad Google.",
      "Wybierz jedną z metod weryfikacji udostępnionych w panelu.",
      "Gdy weryfikacja utknęła, skorzystaj z oficjalnej pomocy i przygotuj prawdziwe materiały potwierdzające działalność."
    ],
    "check": "Profil odzwierciedla realne zasady obsługi klientów i nie prezentuje fikcyjnego lokalu.",
    "warning": "Nie używaj wirtualnego biura lub nieprawdziwego adresu, by obejść wymagania weryfikacji.",
    "source": "https://support.google.com/business/answer/3038177"
  },
  {
    "slug": "google-business-weryfikacja-wideo-brak-filmu",
    "title": "Google żąda weryfikacji wizytówki wideo, a nie mam filmu — co robić?",
    "description": "Weryfikacja Profilu Firmy w Google przez wideo. Jak sprawdzić dostępne metody i wymagane dowody.",
    "symptom": "Panel prosi o nagranie wideo, lecz właściciel firmy nie ma nagrania albo nie może łatwo przedstawić siedziby.",
    "cause": "Google wyświetla dostępne metody weryfikacji zależnie od profilu. Nie zawsze można samodzielnie przełączyć je na inny wariant.",
    "steps": [
      "Sprawdź dokładną instrukcję weryfikacji wyświetlaną w panelu, a nie ogólną listę w poradniku.",
      "Ustal, jakie prawdziwe elementy działalności można pokazać: sprzęt, oznakowanie lub narzędzia pracy, zgodnie z instrukcją.",
      "Sprawdź, czy panel oferuje alternatywną metodę; nie zakładaj, że jest dostępna dla każdej firmy.",
      "Jeśli wykonanie nagrania jest niemożliwe, zgłoś problem przez oficjalny kanał wsparcia.",
      "Nie zmieniaj fikcyjnie adresu ani kategorii firmy tylko po to, by wymusić inny typ weryfikacji."
    ],
    "check": "Weryfikacja przebiega metodą dopuszczoną przez Google, z prawdziwymi materiałami i poprawnymi danymi firmy.",
    "warning": "Nie można zagwarantować zastępczej weryfikacji bez wideo; decyzja zależy od Google.",
    "source": "https://support.google.com/business/answer/7107242"
  },
  {
    "slug": "seo-podstrony-miasta-duplikat-tresci",
    "title": "SEO na miasta: czy kopiowanie tej samej strony dla 300 miast działa?",
    "description": "Masowe podstrony lokalne, doorway pages i zduplikowane teksty. Jak budować strony usługowe bez ryzyka spam SEO.",
    "symptom": "Firma działa w całej Polsce i chce mieć osobny adres dla każdego miasta, zmieniając wyłącznie nazwę lokalizacji.",
    "cause": "Strony o niemal identycznej treści nie wnoszą wartości dla odbiorcy i mogą zostać potraktowane jako duplikaty lub doorway pages.",
    "steps": [
      "Wybierz miasta, w których masz rzeczywiste realizacje, lokalny zakres usług lub odrębne informacje.",
      "Dla każdej strony przygotuj faktyczne przykłady, proces obsługi, odpowiednie zdjęcia i ograniczenia.",
      "Dodaj lokalne FAQ tylko wtedy, gdy odpowiedzi naprawdę różnią się między lokalizacjami.",
      "Dla pozostałego obszaru stwórz jedną sensowną stronę o ogólnopolskim zakresie usług.",
      "Monitoruj indeksację i zapytania zamiast mierzyć skuteczność liczbą wyprodukowanych URL."
    ],
    "check": "Każda podstrona daje użytkownikowi powód do wejścia niezależnie od innych miast i nie zawiera fikcyjnych lokalnych realizacji.",
    "warning": "Nie twórz setek stron typu 'strony internetowe miasto X' różniących się tylko H1.",
    "source": "https://developers.google.com/search/docs/essentials/spam-policies"
  },
  {
    "slug": "seo-firma-dziala-cala-polska-uslugi",
    "title": "Firma działa w całej Polsce — jak zrobić SEO bez fikcyjnych oddziałów?",
    "description": "Jak promować ogólnopolskie usługi poprzez treści branżowe, case studies i realny obszar działania.",
    "symptom": "Nie masz biur w każdym województwie, ale świadczysz usługi zdalnie lub z dojazdem w całym kraju.",
    "cause": "Sztuczne adresy i masowe lokalne kopie nie budują wiarygodnej obecności. Zwykle lepiej wyjaśnić realny proces obsługi i pokazać potwierdzone realizacje.",
    "steps": [
      "Na głównej stronie jasno opisz, czy usługa jest zdalna, hybrydowa czy z dojazdem.",
      "Utwórz podstrony usług i case studies z realnymi wynikami, nie fałszywe wizytówki oddziałów.",
      "Opisuj obszary obsługi tam, gdzie ma to sens logistyczny lub handlowy.",
      "Dodawaj poradniki odpowiadające na problemy klientów, a nie tylko nazwy miast.",
      "Sprawdzaj Search Console, skąd pochodzą wyświetlenia i które treści faktycznie pomagają użytkownikom."
    ],
    "check": "Klient wie, gdzie i jak obsługujesz zlecenia, a strona nie sugeruje nieistniejących adresów.",
    "warning": "Google Business Profile ma własne zasady obszaru działalności, odrębne od organicznych wyników witryny.",
    "source": "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
  },
  {
    "slug": "seo-llms-txt-czy-ai-cytuje",
    "title": "Czy llms.txt sprawi, że ChatGPT będzie cytował moją stronę?",
    "description": "Czym jest llms.txt i czy gwarantuje obecność w ChatGPT lub innych asystentach AI? Fakty i ograniczenia.",
    "symptom": "Właściciel publikuje llms.txt z opisem usług i oczekuje, że AI automatycznie zacznie polecać jego firmę.",
    "cause": "Plik llms.txt jest propozycją formatu ułatwiającego opis treści, ale nie ma powszechnej gwarancji, że konkretny system go czyta lub wykorzystuje do cytowania.",
    "steps": [
      "Przede wszystkim udostępnij publiczne strony HTML z unikalnymi tekstami i linkami.",
      "Zadbaj o właściwe tytuły, canonical, sitemap i dostępność robotów zgodnie z potrzebami witryny.",
      "Jeśli używasz llms.txt, umieszczaj tam tylko prawdziwe opisy i działające kanoniczne URL.",
      "Nie traktuj llms.txt jako zamiennika jakości treści, źródeł i linkowania.",
      "Mierz faktyczne wejścia z dostępnych raportów i weryfikuj zachowanie systemów indywidualnie."
    ],
    "check": "Strona jest czytelna w HTML, zawiera rzetelne informacje, a llms.txt nie opisuje fikcyjnych osiągnięć.",
    "warning": "Nie istnieje gwarantowany mechanizm wymuszania cytatów ani poleceń firmy przez ChatGPT.",
    "source": "https://developers.google.com/search/docs/fundamentals/creating-helpful-content"
  },
  {
    "slug": "seo-chatgpt-ai-overviews-cytowanie-strony",
    "title": "Jak zwiększyć szansę, że AI zacytuje mój poradnik?",
    "description": "SEO pod pytania użytkowników i cytowanie przez AI. Konkretne odpowiedzi, źródła, autor i ograniczenia.",
    "symptom": "Poradnik jest w Google, ale odpowiedzi generowane przez asystentów nie wskazują strony jako źródła.",
    "cause": "Systemy AI różnią się sposobem wyszukiwania i dobierania źródeł. Żadna konfiguracja SEO nie daje gwarancji cytowania.",
    "steps": [
      "Formułuj nagłówek i pierwszą odpowiedź językiem konkretnego problemu, a nie ogólnym sloganem.",
      "Dodaj kroki diagnostyczne i wynik sprawdzenia, w tym rzeczywiste przykłady, gdy je posiadasz.",
      "Podpisz autora i podaj linki do dokumentacji lub własnych materiałów potwierdzających twierdzenia.",
      "Zadbaj o indeksowalny HTML, canonical i wewnętrzne linki do tematycznych artykułów.",
      "Aktualizuj tekst, gdy zmieniają się API lub zasady platform; nie zmieniaj daty bez zmian merytorycznych."
    ],
    "check": "Odbiorca może rozwiązać problem na podstawie tekstu i sprawdzić źródła niezależnie od tego, czy jakikolwiek AI go zacytuje.",
    "warning": "Danych o rzekomym wzroście prawdopodobieństwa cytowania nie podawaj bez rzetelnego pomiaru.",
    "source": "https://developers.google.com/search/docs/appearance/ai-features"
  },
  {
    "slug": "seo-article-schema-jsonld",
    "title": "Article schema JSON-LD: czy dodanie danych strukturalnych poprawia SEO?",
    "description": "Jak poprawnie oznaczyć artykuł: headline, author, canonical, data i czym schema nie jest.",
    "symptom": "Podstrona ma poradnik, ale w kodzie nie ma wyraźnych danych o autorze i typie publikacji.",
    "cause": "Dane strukturalne pomagają interpretować treść, ale nie zastępują jakości ani nie gwarantują wyniku rozszerzonego.",
    "steps": [
      "Sprawdź, czy strona ma jeden logiczny H1, prawdziwy tytuł i autora.",
      "Dodaj Article lub BlogPosting z mainEntityOfPage i rzeczywistymi właściwościami artykułu.",
      "Jeśli podajesz datePublished lub dateModified, użyj rzeczywistych dat publikacji i istotnych aktualizacji.",
      "Dodaj BreadcrumbList zgodny z widoczną nawigacją.",
      "Przetestuj JSON-LD i sprawdź błędy w odpowiednim narzędziu Google."
    ],
    "check": "Dane strukturalne są poprawne i nie zawierają informacji niewidocznych lub sprzecznych z treścią strony.",
    "warning": "Nie dopisuj nieprawdziwych ocen, dat, autorów ani FAQ tylko dla potencjalnych rich results.",
    "source": "https://developers.google.com/search/docs/appearance/structured-data/article"
  },
  {
    "slug": "meta-leady-tanie-ale-nie-jakosciowe",
    "title": "Tanie leady z Meta Ads nie odbierają telefonu — jak poprawić jakość?",
    "description": "Gdy CPL spada, ale liczba klientów nie rośnie. Jak analizować formularze, czas reakcji i kwalifikację.",
    "symptom": "Kampania generuje wiele tanich zapytań, a handlowcy zgłaszają brak kontaktu lub brak zainteresowania.",
    "cause": "Algorytm może optymalizować łatwe wypełnienia formularza, nie podpisane umowy. Czas reakcji i zgodność obietnicy z ofertą mają duże znaczenie.",
    "steps": [
      "Wyznacz definicję kontaktu kwalifikowanego oraz powód odrzucenia leada.",
      "Sprawdź czas od wysłania formularza do pierwszej próby połączenia.",
      "Porównaj treść reklamy, formularza i faktyczną ofertę przekazywaną przez handlowca.",
      "Przetestuj dodatkowe pytanie kwalifikujące, ale monitoruj wpływ na liczbę i jakość zgłoszeń.",
      "Oceń kampanię na danych CRM: połączenia, oferty, umowy, a nie sam CPL."
    ],
    "check": "Zmiany poprawiają mierzalny udział kwalifikowanych rozmów lub sprzedaży przy akceptowalnym koszcie.",
    "warning": "Droższy CPL nie oznacza automatycznie lepszych leadów; porównuj cały lejek.",
    "source": "https://www.facebook.com/business/help"
  },
  {
    "slug": "meta-ads-reklama-odrzucona-co-robic",
    "title": "Meta Ads odrzuciło reklamę — gdzie sprawdzić powód?",
    "description": "Reklama odrzucona w Meta. Jak sprawdzić zasady, poprawić treść i złożyć odwołanie bez ponownego łamania reguł.",
    "symptom": "Reklama działała lub została właśnie utworzona, ale panel pokazuje odrzucenie i kampania nie rusza.",
    "cause": "Meta może wykryć naruszenie zasad w tekście, grafice, ofercie albo na stronie docelowej. Automatyczna decyzja może wymagać weryfikacji.",
    "steps": [
      "Odczytaj dokładny komunikat o odrzuceniu i powiązaną zasadę w panelu jakości konta.",
      "Sprawdź tekst, kreację, formularz i landing page pod kątem tej zasady.",
      "Popraw rzeczywistą przyczynę zamiast masowo duplikować reklamę.",
      "Jeśli uważasz decyzję za błędną, użyj dostępnej procedury weryfikacji.",
      "Po zatwierdzeniu sprawdź dostarczanie i zgodność końcowej reklamy ze stroną docelową."
    ],
    "check": "Reklama ma poprawny status zgodny z zasadami platformy i jest dostarczana lub ma jasno wskazaną kolejną czynność.",
    "warning": "Nie próbuj omijać zasad przez ukrywanie treści przed systemem kontroli.",
    "source": "https://transparency.meta.com/policies/ad-standards/"
  },
  {
    "slug": "meta-ads-reklama-aktywna-zero-wyswietlen",
    "title": "Meta Ads: reklama aktywna, ale ma zero wyświetleń",
    "description": "Status aktywna, a reklama nie dociera do ludzi. Co sprawdzić: harmonogram, budżet, grupę, płatności i status.",
    "symptom": "Panel pokazuje zielony status aktywna, lecz statystyki wyświetleń nie rosną.",
    "cause": "Warunki dostarczania mogą blokować emisję mimo statusu technicznego. Przyczyną bywa harmonogram, limit, rozliczenie lub nieodpowiednia konfiguracja grupy.",
    "steps": [
      "Sprawdź poziomy kampanii, zestawu reklam i samej reklamy; statusy mogą się różnić.",
      "Zweryfikuj datę rozpoczęcia, harmonogram oraz limity wydatków.",
      "Sprawdź rozliczenia i ewentualne ograniczenia konta.",
      "Oceń wielkość grupy odbiorców, lokalizacje i zbyt wąskie wykluczenia.",
      "Porównaj okres raportowania z rzeczywistym czasem emisji oraz opóźnienie statystyk."
    ],
    "check": "Reklama zaczyna generować rzeczywiste wyświetlenia po usunięciu ustalonej blokady, bez przypadkowego zwiększania kosztów.",
    "warning": "Nie podnoś budżetu w ciemno, jeśli problemem jest brak uprawnień albo blokada konta.",
    "source": "https://www.facebook.com/business/help"
  },
  {
    "slug": "meta-pixel-capi-brak-zdarzen",
    "title": "Meta Pixel i Conversions API: dlaczego brak zdarzeń w Menedżerze?",
    "description": "Pixel i CAPI nie rejestrują konwersji? Jak sprawdzić konfigurację, zgody, test events i ID zdarzenia.",
    "symptom": "Użytkownicy wysyłają formularze, ale Menedżer zdarzeń nie pokazuje oczekiwanej konwersji.",
    "cause": "Skrypt mógł się nie załadować, identyfikator zestawu danych jest błędny, blokuje go zgoda lub zdarzenie serwerowe nie dociera do API.",
    "steps": [
      "Sprawdź czy zdarzenie powinno być wysyłane po zgodzie użytkownika i czy właściwy stan zgody jest zachowany.",
      "Zweryfikuj identyfikator danych oraz uruchomienie kodu we właściwym środowisku.",
      "Przetestuj jedną kontrolowaną konwersję w narzędziu Test Events.",
      "Dla CAPI sprawdź odpowiedź API, event_name, event_time oraz ewentualny event_id.",
      "Rozróżnij brak rejestracji zdarzenia od opóźnienia jego prezentacji w raportach."
    ],
    "check": "Kontrolne zdarzenie jest widoczne w testach, a zakres przetwarzania odpowiada rzeczywistym zgodom.",
    "warning": "Nie wysyłaj zdarzeń z danymi osobowymi bez odpowiedniej podstawy prawnej i zgodności z zasadami platformy.",
    "source": "https://developers.facebook.com/docs/marketing-api/conversions-api/"
  },
  {
    "slug": "meta-ads-wydatki-rosna-brak-sprzedazy",
    "title": "Meta Ads wydaje budżet, ale nie ma klientów — co analizować?",
    "description": "Jak rozdzielić problem reklamy od problemu formularza, obsługi leadów i sprzedaży.",
    "symptom": "Budżet jest wydawany zgodnie z planem, ale firma nie odnotowuje podpisanych umów ani wartościowych rozmów.",
    "cause": "Ruch i formularze są etapami lejka. Problem może występować w jakości oferty, targetowaniu, formularzu, czasie odpowiedzi lub domykaniu sprzedaży.",
    "steps": [
      "Sprawdź dane kampanii od wyświetlenia przez kliknięcie po formularz.",
      "Zbadaj, czy formularz faktycznie trafia do CRM i do osoby odpowiedzialnej.",
      "Zlicz próby kontaktu, rozmowy, oferty i umowy w tym samym okresie.",
      "Porównaj kreacje i grupy na podstawie wyników kwalifikowanych, nie tylko liczby kliknięć.",
      "Wprowadzaj jedną istotną zmianę na raz i zapisz hipotezę przed testem."
    ],
    "check": "Wiesz, na którym etapie tracisz potencjalnych klientów i masz miernik poprawy dla konkretnej zmiany.",
    "warning": "Nie zwiększaj budżetu na kampanię, dopóki nie wiesz, czy obecne leady są prawidłowo obsługiwane.",
    "source": "https://www.facebook.com/business/help"
  },
  {
    "slug": "meta-reklama-edycja-tekstu-brak-efektu",
    "title": "Zmieniłem tekst w reklamie Meta, ale nie widzę różnicy — dlaczego?",
    "description": "Zmieniony nagłówek lub kreacja nie wyświetla się tak jak w edytorze. Podglądy, dynamiczna kreacja i proces akceptacji.",
    "symptom": "Po edycji copy użytkownik wciąż widzi dawną wersję reklamy albo inny wariant tekstu.",
    "cause": "Niektóre formaty używają wariantów kreacji i optymalizacji wyświetlania, a zmiany mogą czekać na zatwierdzenie. Podgląd nie zawsze oddaje wszystkie miejsca emisji.",
    "steps": [
      "Sprawdź, czy zmiana została opublikowana, a nie zapisana jako szkic.",
      "Odczytaj status reklamy po edycji oraz czas ostatniej publikacji.",
      "Sprawdź, czy używane są warianty tekstu lub dynamiczne opcje kreacji.",
      "Porównaj podglądy dla różnych placementów i urządzeń.",
      "Jeśli wynik nadal jest niespójny, zanotuj identyfikator reklamy i sprawdź dostępne informacje w pomocy Meta."
    ],
    "check": "Opublikowana konfiguracja odpowiada planowanemu tekstowi, a różnice wynikające z placementów są świadomie zaakceptowane.",
    "warning": "Nie poprawiaj tekstu wielokrotnie co kilka minut, zanim platforma zakończy proces publikacji i weryfikacji.",
    "source": "https://www.facebook.com/business/help"
  },
  {
    "slug": "facebook-ads-jak-obliczyc-sredni-cpl-kampanii",
    "title": "Jak policzyć średni CPL z 10 kampanii Meta Ads bez błędu?",
    "description": "Średni koszt leada liczony metodą ważoną. Dlaczego prosta średnia CPL z kampanii może wprowadzać w błąd.",
    "symptom": "Raport zawiera kilka kampanii z różnym budżetem i liczbą leadów; zwykła średnia ich CPL daje mylący wynik.",
    "cause": "Koszt kontaktu jest ilorazem całkowitych wydatków i całkowitej liczby wyników. Mała kampania z dwoma leadami nie powinna ważyć tyle samo co duża ze 200.",
    "steps": [
      "Dla porównywanego okresu zbierz wydatki i liczbę leadów każdej kampanii.",
      "Sprawdź, czy we wszystkich kampaniach wynik oznacza ten sam typ kontaktu.",
      "Zsumuj wydatki oraz osobno liczbę leadów.",
      "Podziel łączne wydatki przez łączną liczbę leadów; nie uśredniaj jednostkowych CPL.",
      "Dodatkowo policz koszt leada kwalifikowanego i klienta, jeśli masz wiarygodne dane CRM."
    ],
    "check": "Łączny CPL zgadza się z ilorazem sum, a zakres i definicja wyniku są jawne.",
    "warning": "Jeśli kampania ma zero leadów, nie próbuj liczyć jej indywidualnego CPL przez dzielenie przez zero.",
    "source": "https://www.facebook.com/business/help"
  },
  {
    "slug": "meta-ads-utm-nie-zapisuje-sie-crm",
    "title": "UTM z reklam Meta nie zapisuje się w CRM — skąd przyszedł klient?",
    "description": "Jak przechwycić parametry utm_source, utm_campaign i click ID przy formularzu i zapisać źródło leada.",
    "symptom": "CRM ma nowe zgłoszenia, ale pole źródło kampanii jest puste lub dla wszystkich wpisów ma tę samą wartość.",
    "cause": "Parametry URL mogą zniknąć podczas nawigacji, formularz ich nie zapisuje lub webhook przekazuje tylko dane kontaktowe.",
    "steps": [
      "Sprawdź, czy docelowy URL reklamy rzeczywiście zawiera poprawne parametry UTM.",
      "Otwórz landing page z parametrami i przejdź całą ścieżkę formularza, sprawdzając ich utrzymanie.",
      "Dodaj pola ukryte lub bezpieczny stan sesji dla danych atrybucyjnych, respektując obowiązujące zasady prywatności.",
      "Prześlij parametry do serwera wraz z formularzem i zapisz je przy rekordzie bez nadpisywania historii.",
      "Porównaj dane Meta, analityki i CRM na sztucznym zgłoszeniu z jednym identyfikatorem testowym."
    ],
    "check": "Testowy lead zachowuje poprawny source i campaign, a brak UTM nie prowadzi do dopisania zmyślonej kampanii.",
    "warning": "UTM opisuje źródło wejścia, ale nie jest sam w sobie dowodem, że reklama doprowadziła do sprzedaży.",
    "source": "https://support.google.com/analytics/answer/10917952"
  }
] as const;

export const searchMarketingProblemGuides = topics.map(topic => ({
 slug:topic.slug,title:topic.title,description:topic.description,category:'SEO i reklamy Meta',
 service:/^meta-|^facebook-ads/.test(topic.slug)?'/marketing-i-reklamy':'/tworzenie-stron-internetowych',
 serviceLabel:'Strony, SEO i reklamy',intro:topic.symptom,
 sections:[{title:'Najważniejsza przyczyna',paragraphs:[topic.cause]},{title:'Praktyczna procedura',paragraphs:topic.steps.map((s,i)=>(i+1)+'. '+s)},{title:'Jak potwierdzić wynik?',paragraphs:[topic.check,topic.warning]}],
 sources:[{label:'Źródło i dokumentacja',url:topic.source}]
}));
