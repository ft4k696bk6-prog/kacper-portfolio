const topics = [
  {
    "slug": "icloud-wlasna-domena-maile-nie-dochodza",
    "title": "iCloud Mail: wiadomości na adres we własnej domenie nie dochodzą",
    "description": "Masz e-mail @twojadomena.pl w iCloud+, ale nic nie przychodzi? Sprawdź MX, DKIM, alias i przekazywanie.",
    "symptom": "Adres w domenie jest dodany do iCloud+, ale wiadomości od nadawców zewnętrznych nie pojawiają się w skrzynce. Najczęściej trzeba sprawdzić rekordy DNS, aktywację adresu i konfigurację konta.",
    "cause": "Samo dodanie domeny do konta Apple nie kończy konfiguracji DNS i konkretnych adresów. Błędy MX, konflikt starego hostingu lub brak aktywnego adresu blokują odbiór.",
    "steps": [
      "Otwórz iCloud+ i sprawdź, czy domena oraz konkretny adres e-mail mają status aktywny.",
      "Zweryfikuj aktualne rekordy MX oraz wymagane rekordy TXT/CNAME podane przez Apple dla domeny.",
      "Sprawdź, czy domena nie korzysta z innych nameserverów niż panel, w którym edytujesz rekordy.",
      "Wyślij test z niezależnego dostawcy, a potem sprawdź folder Niechciane i zachowanie wszystkich urządzeń.",
      "Jeśli wiadomość odbija, odczytaj kod SMTP z raportu niedostarczenia. Nie udostępniaj publicznie pełnych nagłówków z danymi prywatnymi."
    ],
    "check": "Wiadomości testowe z różnych zewnętrznych domen dochodzą na właściwą skrzynkę i można na nie odpowiedzieć jako własny adres.",
    "warning": "Nie usuwaj rekordów DNS na ślepo; MX i DKIM muszą odpowiadać dokładnie usłudze używanej do poczty.",
    "source": "https://support.apple.com/guide/icloud/add-a-custom-email-domain-mma473945269/icloud"
  },
  {
    "slug": "icloud-custom-domain-nie-ma-hasla",
    "title": "E-mail we własnej domenie iCloud nie ma osobnego hasła — jak dodać go do Maca?",
    "description": "Własny adres iCloud+ bez nowego loginu i hasła. Jak działa konto Apple oraz aplikacyjne hasło do poczty.",
    "symptom": "Utworzony adres @twojadomena.pl działa jako alias iCloud, ale przy dodawaniu go do klienta poczty pojawia się pytanie o login i hasło.",
    "cause": "Własny adres e-mail w iCloud Mail nie musi tworzyć osobnego konta logowania. Odbiór odbywa się w istniejącym koncie Apple; dla części klientów IMAP potrzebne jest hasło aplikacyjne.",
    "steps": [
      "Na Macu zaloguj się do właściwego konta Apple i włącz Poczta iCloud.",
      "Sprawdź, czy adres domenowy jest dodany w ustawieniach własnej domeny i czy widnieje w opcjach nadawcy.",
      "Jeśli korzystasz z zewnętrznego klienta IMAP, sprawdź oficjalną konfigurację Apple i wymaganie hasła aplikacyjnego.",
      "Nie próbuj używać adresu domenowego jako zupełnie nowego konta Apple bez potrzeby.",
      "Wyślij wiadomość testową z wybranego aliasu i sprawdź odpowiedź."
    ],
    "check": "Poczta jest widoczna w aplikacji Mail na Macu, a nowa wiadomość może być wysłana z właściwego adresu domenowego.",
    "warning": "Nie ujawniaj hasła do Apple ID w nieznanym kliencie; używaj oficjalnej metody uwierzytelniania.",
    "source": "https://support.apple.com/guide/icloud/use-custom-email-domain-mma4e267c8c7/icloud"
  },
  {
    "slug": "icloud-hide-my-email-nie-przekazuje",
    "title": "Ukryj mój adres e-mail Apple nie przekazuje wiadomości — co sprawdzić?",
    "description": "Alias Hide My Email nie przekazuje na Gmail lub iCloud? Sprawdź konto, docelowy adres i status aliasu.",
    "symptom": "W telefonie jest wiele losowych adresów Apple, ale korespondencja na część z nich nie trafia do oczekiwanej skrzynki.",
    "cause": "Adresy Hide My Email mogą mieć różny status i adres docelowy. Interfejsy na iPhonie i w iCloud mogą pokazywać różne zbiory w zależności od źródła aliasu.",
    "steps": [
      "Odszukaj dokładny alias użyty do rejestracji usługi i sprawdź, czy pozostaje aktywny.",
      "Zweryfikuj konto Apple, na którym alias został utworzony, i adres odbiorczy w ustawieniach przekazywania.",
      "Przeszukaj wszystkie foldery, w tym spam, pod kątem nadawcy i identyfikatora aliasu.",
      "Wyślij nieszkodliwy test z zewnętrznej skrzynki i sprawdź, czy zostanie przekazany.",
      "Dla ważnych usług rozważ zmianę adresu kontaktowego w koncie dostawcy na trwale dostępny adres."
    ],
    "check": "Test na właściwy alias przychodzi do wskazanej skrzynki; dla kont krytycznych działają także wiadomości weryfikacyjne.",
    "warning": "Nie wyłączaj aliasu wykorzystywanego przez logowanie lub odzyskiwanie konta, dopóki nie zmienisz adresu u dostawcy.",
    "source": "https://support.apple.com/guide/icloud/what-is-hide-my-email-mm9d9012c9e8/icloud"
  },
  {
    "slug": "domena-email-spf-dkim-dmarc-problemy",
    "title": "SPF, DKIM, DMARC: domena wysyła e-maile, ale odbiorcy mają spam",
    "description": "Jak sprawdzić rekordy SPF, DKIM i DMARC, gdy wiadomości z własnej domeny nie dochodzą lub trafiają do spamu.",
    "symptom": "Wiadomości wychodzą z firmowej domeny, ale odbiorcy nie dostają ich lub widzą ostrzeżenia o nadawcy.",
    "cause": "Błędne uwierzytelnienie domeny oraz niezgodność From z konfiguracją serwera obniżają wiarygodność dostarczania.",
    "steps": [
      "Ustal wszystkich legalnych dostawców wysyłających z domeny: poczta, formularze, newsletter i CRM.",
      "Sprawdź, czy istnieje jeden prawidłowy rekord SPF oraz klucze DKIM zgodne z dostawcami.",
      "Skonfiguruj DMARC etapami, zaczynając od obserwacji raportów, jeśli organizacja nie ma jeszcze pełnej kontroli.",
      "Wyślij test do kilku skrzynek i obejrzyj wynik SPF, DKIM i DMARC w nagłówkach.",
      "Napraw niezgodne źródła wysyłki i monitoruj raporty, zanim zaostrzysz politykę DMARC."
    ],
    "check": "Autoryzowane wiadomości przechodzą kontrole uwierzytelnienia i docierają do odbiorców bez nowych błędów.",
    "warning": "Nie dodawaj kilku rekordów SPF dla jednej nazwy domeny; to częsta przyczyna błędu SPF.",
    "source": "https://www.cloudflare.com/learning/email-security/dmarc-dkim-spf/"
  },
  {
    "slug": "phishing-domena-wymaga-pilnego-odnowienia",
    "title": "Mail: domena wymaga pilnego odnowienia — jak rozpoznać phishing?",
    "description": "Fałszywe faktury i groźby wyłączenia domeny. Jak sprawdzić nadawcę, link i rzeczywisty termin odnowienia.",
    "symptom": "Otrzymujesz wiadomość o pilnym wyłączeniu domeny, a w treści pojawia się link do płatności lub logowania.",
    "cause": "Oszuści wykorzystują presję czasu oraz podobne domeny i nazwy firm. Wyświetlana nazwa nadawcy nie potwierdza jego tożsamości.",
    "steps": [
      "Nie klikaj linku i nie pobieraj załącznika z podejrzanej wiadomości.",
      "Otwórz panel rejestratora wpisując znany adres ręcznie i sprawdź rzeczywisty termin domeny.",
      "Porównaj techniczną domenę nadawcy, Reply-To i docelową domenę linku.",
      "Jeśli wiadomość rzekomo pochodzi od dostawcy, skontaktuj się z nim oficjalnym kanałem.",
      "Zachowaj oryginalną wiadomość z nagłówkami jako dowód, ale usuń lub zamaskuj dane prywatne przed udostępnieniem."
    ],
    "check": "Stan domeny i faktur potwierdza bezpośrednio rejestrator, a użytkownik nie wpisuje danych na stronie z podejrzanego linku.",
    "warning": "Sam poprawny SPF lub DKIM nadawcy nie dowodzi, że cała wiadomość jest uczciwa.",
    "source": "https://www.cert.pl/"
  },
  {
    "slug": "phishing-pismo-urzad-skarbowy-email",
    "title": "Fałszywe pismo z urzędu skarbowego w e-mailu — jak sprawdzić?",
    "description": "Mail o pilnym piśmie w e-Urzędzie Skarbowym może być próbą wyłudzenia. Bezpieczna weryfikacja i zachowanie dowodów.",
    "symptom": "E-mail udaje powiadomienie urzędowe i nakłania do natychmiastowego kliknięcia załącznika lub linku.",
    "cause": "Atakujący używają znanych nazw instytucji, by skłonić do podania danych lub uruchomienia szkodliwego pliku.",
    "steps": [
      "Nie loguj się przez link z niezweryfikowanego e-maila.",
      "Wejdź samodzielnie na oficjalny portal administracji podatkowej i sprawdź powiadomienia.",
      "Zapisz kopię oryginalnej wiadomości .eml, jeśli gromadzisz dowody incydentu.",
      "Sprawdź nadawcę i domenę linku; nie polegaj tylko na nazwie wyświetlanej w polu Od.",
      "Zgłoś podejrzaną wiadomość do odpowiedniego zespołu reagowania i zabezpiecz konta, jeśli doszło do kliknięcia."
    ],
    "check": "Weryfikacja odbywa się przez oficjalny portal lub niezależny kanał kontaktu, a nie przez treść podejrzanego maila.",
    "warning": "Nie publikuj pełnych nagłówków maila z prywatnymi adresami, identyfikatorami i tokenami.",
    "source": "https://www.gov.pl/web/cert-polska"
  },
  {
    "slug": "openrouter-api-401-unauthorized",
    "title": "OpenRouter API zwraca 401 Unauthorized — co sprawdzić?",
    "description": "Błąd 401 w asystencie AI na stronie. Klucz API, nagłówek Authorization, projekt i konfiguracja serwera.",
    "symptom": "Czat na stronie pokazuje błąd zamiast odpowiedzi, a endpoint OpenRouter zwraca 401 Unauthorized.",
    "cause": "Zwykle problem dotyczy klucza, formatu nagłówka Authorization, uprawnienia albo błędnego środowiska, z którego klucz jest odczytywany.",
    "steps": [
      "Sprawdź w logach status odpowiedzi i identyfikator żądania bez drukowania klucza API.",
      "Zweryfikuj, czy kod serwera korzysta z odpowiedniej zmiennej środowiskowej.",
      "Upewnij się, że nagłówek ma wymagany format Bearer i nie zawiera przypadkowych spacji.",
      "Sprawdź w panelu dostawcy stan klucza i ewentualne ograniczenia.",
      "Po rotacji klucza wykonaj nowy deploy lub restart zgodnie z platformą i test na krótkim pytaniu."
    ],
    "check": "Serwer otrzymuje poprawną odpowiedź z API, a klucz nie pojawia się w HTML, konsoli ani repozytorium.",
    "warning": "Nigdy nie wysyłaj sekretnego klucza z przeglądarki przez NEXT_PUBLIC lub kod klientowy.",
    "source": "https://openrouter.ai/docs/quickstart"
  },
  {
    "slug": "openrouter-vercel-env-nie-czyta-klucza",
    "title": "OpenRouter na Vercel: zmienna ENV jest ustawiona, ale API nie działa",
    "description": "Błąd API AI po deployu. Różnica Preview i Production, nazwa zmiennej oraz konieczność nowego wdrożenia.",
    "symptom": "Asystent AI działa na localhost, ale po publikacji nie dostaje odpowiedzi i logi sugerują brak konfiguracji.",
    "cause": "Zmienna mogła zostać dodana tylko dla środowiska Preview, mieć literówkę w nazwie lub nie trafić do już zbudowanej wersji.",
    "steps": [
      "Porównaj nazwę zmiennej w kodzie z nazwą w Vercel Environment Variables.",
      "Sprawdź zakres Production, Preview i Development.",
      "Nie wyświetlaj wartości zmiennej w logach ani debugowym endpointcie.",
      "Wykonaj nowy deploy po aktualizacji konfiguracji, jeśli jest wymagany.",
      "Przetestuj endpoint serwerowy, obsługę limitu i komunikaty dla użytkownika."
    ],
    "check": "Produkcja odpowiada na testowe pytanie, a brak klucza wyświetla kontrolowany komunikat bez ujawniania sekretu.",
    "warning": "Nie omijaj serwera przez umieszczenie klucza OpenRouter w kodzie frontendowym.",
    "source": "https://vercel.com/docs/projects/environment-variables"
  },
  {
    "slug": "asystent-ai-na-stronie-limity-kosztow",
    "title": "Asystent AI na stronie generuje koszty — jak ustawić limity?",
    "description": "Jak zabezpieczyć firmowy chatbot API przed nadmiernym zużyciem, spamem, długimi kontekstami i niekontrolowanymi rachunkami.",
    "symptom": "Czat na portfolio działa, ale każde pytanie kosztuje, a publiczny endpoint może być wywoływany wielokrotnie.",
    "cause": "Bez limitów liczby żądań, budżetu i długości kontekstu pojedynczy użytkownik lub bot może zużyć znaczną część środków.",
    "steps": [
      "Ustal miesięczny limit wydatków i maksymalny koszt jednej rozmowy.",
      "Wprowadź rate limiting na serwerze z uwzględnieniem adresów i sesji, bez nadmiernej identyfikacji użytkowników.",
      "Ogranicz długość historii oraz maksymalne tokeny odpowiedzi.",
      "Zastosuj timeouty, obsługę 429 i kontrolowane fallbacki dla niedostępnego modelu.",
      "Monitoruj zużycie dzienne, alarmy progowe i jakość udzielanych odpowiedzi."
    ],
    "check": "Testy dużej liczby żądań uruchamiają limity, a pojedyncza awaria dostawcy nie zawiesza strony.",
    "warning": "Samo ukrycie przycisku czatu nie chroni publicznego endpointu API.",
    "source": "https://openrouter.ai/docs/api-reference/overview"
  },
  {
    "slug": "asystent-ai-wymysla-projekty-portfolio",
    "title": "Asystent AI na portfolio zmyśla realizacje — jak to ograniczyć?",
    "description": "Jak zbudować bazę wiedzy chatbota, by nie wymyślał cen, klientów, wyników kampanii i funkcji projektów.",
    "symptom": "Asystent odpowiada płynnie, ale przypisuje właścicielowi strony niepotwierdzone realizacje lub obiecuje funkcje, których nie ma.",
    "cause": "Model językowy może uzupełniać luki domysłami. Ogólna instrukcja typu 'bądź profesjonalny' nie zapewnia prawdziwości konkretnych danych.",
    "steps": [
      "Przygotuj jedną wersjonowaną bazę wiedzy z opisami projektów, linkami i ograniczeniami.",
      "W promptach oddziel fakty potwierdzone od planów, szkiców i opinii.",
      "Ustal odpowiedź 'nie mam danych' dla pytań poza bazą wiedzy.",
      "Testuj pytania o ceny, wyniki reklam, terminy i prywatne dane, których nie wolno ujawniać.",
      "Monitoruj anonimowe kategorie błędów i aktualizuj źródła po zmianie strony."
    ],
    "check": "Asystent odsyła do istniejących projektów i potrafi odmówić podania niepotwierdzonej liczby zamiast ją wymyślać.",
    "warning": "Prompt nie zastępuje walidacji dostępu do danych ani ochrony sekretów po stronie serwera.",
    "source": "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
  },
  {
    "slug": "meta-webhook-verify-token-error",
    "title": "Meta Lead Ads webhook: weryfikacja callback URL nie przechodzi",
    "description": "Weryfikacja Meta webhooka kończy się błędem. Jak obsłużyć hub.challenge, verify_token i HTTPS.",
    "symptom": "Meta nie przyjmuje URL callback, mimo że endpoint otwiera się w przeglądarce.",
    "cause": "Weryfikacja webhooka wymaga odpowiedzi na żądanie GET z parametrami challenge. Zwykły endpoint POST nie wystarczy.",
    "steps": [
      "Sprawdź, czy URL jest publiczny pod HTTPS i nie wymaga logowania ani ochrony Preview.",
      "Zweryfikuj obsługę zapytania GET z parametrami hub.mode, hub.verify_token i hub.challenge.",
      "Porównaj token po stronie serwera z tokenem podanym w konfiguracji Meta.",
      "Zwróć wymagany challenge wyłącznie po poprawnej weryfikacji tokenu.",
      "Osobno zaimplementuj obsługę POST, walidację podpisu i bezpieczne przetwarzanie leadów."
    ],
    "check": "Weryfikacja callback URL przechodzi, a testowe zdarzenie POST trafia do kontrolowanego logu bez danych wrażliwych.",
    "warning": "Nie loguj pełnych tokenów i nie traktuj publicznego challenge jako autoryzacji wszystkich żądań POST.",
    "source": "https://developers.facebook.com/docs/graph-api/webhooks/getting-started/"
  },
  {
    "slug": "meta-lead-ads-access-token-expired",
    "title": "Meta Lead Ads: wygasł access token i leady nie trafiają do CRM",
    "description": "Działająca integracja Meta nagle przestała odbierać kontakty? Diagnostyka tokenu, uprawnień i webhooka.",
    "symptom": "Formularze nadal zbierają zapytania, lecz automatyczne przesyłanie do CRM przestało działać.",
    "cause": "Token użytkownika lub strony może wygasnąć, zostać unieważniony albo utracić wymagane uprawnienie po zmianie konta.",
    "steps": [
      "Porównaj liczbę nowych formularzy w Meta z liczbą przyjętych zdarzeń webhook w CRM.",
      "Odczytaj kod odpowiedzi Graph API i identyfikator błędu, bez kopiowania tokenu do logów.",
      "Sprawdź aktualne uprawnienia integracji i przypisanie strony do aplikacji.",
      "Przeprowadź ponowną autoryzację zgodnie z wymaganym przepływem Meta.",
      "Dodaj monitoring błędów i procedurę odzyskiwania nieprzekazanych kontaktów z dozwolonego źródła."
    ],
    "check": "Testowy lead pojawia się raz w CRM, a monitoring raportuje błędy kolejnych prób.",
    "warning": "Nie wklejaj access tokenu Meta do publicznego repozytorium ani do zgłoszenia supportowego.",
    "source": "https://developers.facebook.com/docs/facebook-login/guides/access-tokens/"
  },
  {
    "slug": "meta-lead-ads-formularz-jest-crm-pusty",
    "title": "Meta pokazuje lead, ale w CRM go nie ma — integracja krok po kroku",
    "description": "Jak sprawdzić brakujący kontakt między formularzem Facebooka, webhookiem a bazą CRM.",
    "symptom": "W Menedżerze reklam pojawiło się nowe zgłoszenie, ale handlowiec nie widzi go w kolejce.",
    "cause": "Błąd może wystąpić na pobraniu szczegółów, transformacji danych, zapisie do bazy lub w widoczności rekordu po przydziale.",
    "steps": [
      "Zapisz identyfikator formularza i leadgen_id bez rozpowszechniania danych klienta.",
      "Sprawdź w logu odbiór zdarzenia webhook i odpowiedź API przy pobraniu danych.",
      "Zweryfikuj mapowanie pól formularza na pola w bazie, w tym numery telefonów i opcjonalne odpowiedzi.",
      "Sprawdź zapis transakcji, deduplikację i przypisanie do handlowca.",
      "Na końcu przetestuj listę i licznik pod kontem handlowca oraz alarm dla każdego nieudanego etapu."
    ],
    "check": "Kontrolny formularz dociera z poprawnymi danymi, a odtworzenie tego samego zdarzenia nie tworzy duplikatu.",
    "warning": "Nie zakładaj, że samo HTTP 200 webhooka oznacza poprawny zapis leada w bazie.",
    "source": "https://developers.facebook.com/docs/marketing-api/guides/lead-ads/"
  },
  {
    "slug": "meta-leady-duplikaty-po-retry-webhook",
    "title": "Meta wysłała webhook ponownie i CRM ma podwójne leady",
    "description": "Idempotencja webhooków Meta i bezpieczne ponawianie żądań, żeby nie tworzyć dubli klientów.",
    "symptom": "Ten sam kontakt pojawia się dwa razy po problemie z połączeniem lub wznowieniu integracji.",
    "cause": "Dostawcy webhooków mogą ponawiać dostarczenie zdarzenia. Jeśli integracja traktuje każde POST jako nowy lead, powstaną kopie.",
    "steps": [
      "Zidentyfikuj stabilny ID zdarzenia dostawcy i zachowaj go w bazie.",
      "Dodaj ograniczenie UNIQUE do identyfikatora zdarzenia w odpowiednim zakresie.",
      "Przy ponownym zdarzeniu zwróć bezpieczny wynik, nie wykonując drugi raz przydziałów ani powiadomień.",
      "Testuj dwa równoległe POST z identycznym payloadem.",
      "Oddziel idempotencję dostarczenia od biznesowego łączenia osobnych zapytań tej samej osoby."
    ],
    "check": "Powtórzony webhook nie zwiększa liczby leadów ani liczby wysłanych powiadomień.",
    "warning": "Nie usuwaj powtórzeń jedynie po numerze telefonu: użytkownik mógł naprawdę wysłać dwa różne formularze.",
    "source": "https://www.postgresql.org/docs/current/ddl-constraints.html"
  },
  {
    "slug": "google-drive-oauth-invalid-grant-crm",
    "title": "Google Drive OAuth: invalid_grant podczas odświeżania tokenu",
    "description": "Invalid_grant w integracji Dysku Google. Przyczyny: cofnięta zgoda, konfiguracja klienta i refresh token.",
    "symptom": "Próba odświeżenia dostępu do Google Drive kończy się invalid_grant, a załączniki w CRM nie są synchronizowane.",
    "cause": "Refresh token może być nieważny po cofnięciu zgody, zmianie warunków autoryzacji lub problemie konfiguracji aplikacji OAuth.",
    "steps": [
      "Sprawdź kod błędu i czas ostatniej udanej synchronizacji, nie ujawniając sekretów.",
      "Zweryfikuj klienta OAuth, zakresy i redirect URI dla właściwego środowiska.",
      "Sprawdź, czy aplikacja przechowuje właściwy refresh token na serwerze.",
      "Gdy wymagane, wykonaj ponowną zgodę użytkownika i przetestuj nowy dostęp do folderu.",
      "Dodaj alert awarii integracji oraz możliwość bezpiecznego ponowienia zapisu."
    ],
    "check": "OAuth uzyskuje dostęp zgodnie ze zgodą, dokument zapisuje się we właściwym folderze, a kolejna próba odnowienia działa.",
    "warning": "Nie rozwiązuj błędu przez wpisanie refresh tokenu do pliku frontendowego lub wysłanie go w logach.",
    "source": "https://developers.google.com/identity/protocols/oauth2"
  },
  {
    "slug": "google-drive-integracja-cofniete-uprawnienia",
    "title": "Google Drive: integracja działała, ale użytkownik cofnął dostęp",
    "description": "Jak bezpiecznie odbudować połączenie CRM z Dyskiem po cofnięciu zgody lub zmianie uprawnień folderu.",
    "symptom": "W CRM widnieją foldery i nazwy dokumentów, lecz ich otwieranie lub zapisywanie nagle przestało działać.",
    "cause": "Może wygasnąć autoryzacja, właściciel może zmienić uprawnienia folderu lub administrator Workspace ograniczyć aplikację.",
    "steps": [
      "Rozdziel błąd autoryzacji konta od błędu uprawnień konkretnego folderu.",
      "Sprawdź, na jakim koncie działa integracja, a na jakim koncie znajduje się folder.",
      "Potwierdź zakres zgód OAuth i aktualne zasady Workspace, jeśli dotyczy.",
      "Po ponownej autoryzacji przetestuj odczyt i zapis osobno.",
      "Dodaj rejestrowanie statusu połączenia i widoczny komunikat o konieczności ponownej zgody."
    ],
    "check": "Nowy plik zapisuje się i otwiera, a użytkownik widzi czytelny komunikat przy kolejnym cofnięciu zgody.",
    "warning": "Nie nadaj integracji szerszych uprawnień niż potrzebne tylko po to, by ominąć błąd.",
    "source": "https://developers.google.com/workspace/drive/api/guides/about-auth"
  },
  {
    "slug": "apple-private-relay-email-kod-nie-dochodzi",
    "title": "Kod logowania przychodzi na prywatny adres Apple — jak odzyskać dostęp?",
    "description": "Weryfikacja wysyłana na adres Hide My Email lub Private Relay. Jak odnaleźć alias i zmienić adres kontaktowy.",
    "symptom": "Serwis wysyła kod na ukryty adres Apple, a wiadomość nie trafia do zwykłej skrzynki.",
    "cause": "Podczas rejestracji przez Apple mógł powstać alias przekazujący. Jego powiązanie z kontem jest często inne niż zapamiętany adres Gmail.",
    "steps": [
      "Sprawdź w ustawieniach konta Apple listę aplikacji używających Sign in with Apple i przypisany adres.",
      "Zweryfikuj, czy przekazywanie dla tej aplikacji jest aktywne i dokąd prowadzi.",
      "Sprawdź spam i reguły przekazywania w docelowej skrzynce.",
      "Jeśli dostęp do usługi nadal jest aktywny na innym urządzeniu, zmień adres kontaktowy w panelu usługi.",
      "Przy braku dostępu użyj oficjalnej procedury odzyskiwania konta dostawcy."
    ],
    "check": "Kod weryfikacyjny dociera do kontrolowanego adresu i można bezpiecznie logować się ponownie.",
    "warning": "Nie zmieniaj konta Apple lub nie kasuj aliasu przed zabezpieczeniem alternatywnej metody logowania.",
    "source": "https://support.apple.com/en-us/105078"
  },
  {
    "slug": "formularz-strona-nie-dziala-500",
    "title": "Formularz na stronie nie wysyła wiadomości — co sprawdzić w API?",
    "description": "Klikasz Wyślij i nic się nie dzieje? Jak prześledzić formularz od przeglądarki przez API po e-mail lub CRM.",
    "symptom": "Formularz wygląda poprawnie, ale klient nie otrzymuje potwierdzenia, a zgłoszenie nie trafia do firmy. Najpierw sprawdź, czy żądanie trafia do serwera, czy zapisuje zgłoszenie i czy zwraca prawdziwy wynik wysyłki.",
    "cause": "Błąd może leżeć w walidacji, endpointcie, ENV, dostawcy e-mail lub w samym UI, które wyświetla sukces bez potwierdzenia zapisu.",
    "steps": [
      "W DevTools Network sprawdź, czy po kliknięciu wysyłane jest żądanie i jaki kod HTTP wraca.",
      "Porównaj walidację przeglądarki z walidacją serwera; nie ufaj tylko required w HTML.",
      "Sprawdź runtime logs endpointu, czas wykonania i odpowiedź dostawcy poczty lub CRM.",
      "Oddziel sukces zapisu zgłoszenia od sukcesu wysłania wiadomości e-mail i dodaj obsługę ponowień.",
      "Uruchom test z fikcyjnymi danymi z telefonu i desktopu; sprawdź też ochronę antyspamową."
    ],
    "check": "Zgłoszenie testowe jest zapisane lub dostarczone w docelowym systemie, a użytkownik dostaje komunikat zgodny z rzeczywistym wynikiem.",
    "warning": "Toast 'wysłano' przed uzyskaniem odpowiedzi serwera daje fałszywe poczucie sukcesu.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"
  }
] as const;

export const integrationProblemGuides = topics.map(topic => ({
 slug:topic.slug,title:topic.title,description:topic.description,category:'Poczta, integracje i bezpieczeństwo',
 service:'/crm-i-aplikacje-webowe',serviceLabel:'CRM i integracje',intro:topic.symptom,
 sections:[{title:'Dlaczego problem występuje?',paragraphs:[topic.cause]},{title:'Diagnostyka i rozwiązanie',paragraphs:topic.steps.map((s,i)=>(i+1)+'. '+s)},{title:'Jak sprawdzić i czego unikać?',paragraphs:[topic.check,topic.warning]}],
 sources:[{label:'Dokumentacja / źródło',url:topic.source}]
}));
