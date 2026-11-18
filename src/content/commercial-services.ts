export type CommercialServiceDetail = {
  title: string;
  category: string;
  problem: string;
  scenario: string;
  decision: string;
  caution: string;
  proofUrl: string;
  proofLabel: string;
};

/**
 * Odrebne, sprawdzalne potrzeby klientow. Nie tworzyc automatycznie duplikatow
 * najwazniejszych stron ofertowych: /tworzenie-stron-internetowych,
 * /crm-i-aplikacje-webowe, /google-ads-dla-firm itd.
 */
export const commercialServiceDetails: Record<string, CommercialServiceDetail> = {
  "landing-page": {
    "title": "Landing page sprzedażowy – projekt i wdrożenie",
    "category": "Strony i sprzedaż",
    "problem": "Masz reklamę lub jedną konkretną usługę, ale strona kieruje odbiorcę do całego menu. Potrzebujesz prostego procesu od kliknięcia do formularza lub rozmowy, bez zbędnych wyborów.",
    "scenario": "Dla kampanii lokalnej można przygotować jedną stronę z ofertą, sekcją najczęstszych obiekcji, widocznym numerem telefonu i formularzem wysyłającym dane do CRM.",
    "decision": "Warto zacząć od landing page, gdy kampania ma jeden cel. Jeśli prezentujesz wiele usług i chcesz budować ruch organiczny na różnych tematach, lepsza będzie rozbudowana witryna firmowa.",
    "caution": "Wskaźnikiem sukcesu powinny być wartościowe zapytania, a nie sama liczba kliknięć reklamy.",
    "proofUrl": "/case-studies/starcars",
    "proofLabel": "StarCars – strona i kalkulator"
  },
  "wdrozenie-crm": {
    "title": "Wdrożenie CRM w firmie – migracja i konfiguracja",
    "category": "CRM i sprzedaż",
    "problem": "Kontakty klientów żyją w arkuszach, wiadomościach i prywatnych telefonach. Przy zmianie handlowca trudno sprawdzić, kto ma oddzwonić, jaki jest status oferty i czy nie doszło do duplikatu.",
    "scenario": "Zaczynamy od mapy etapów sprzedaży, przenosimy próbkę kontaktów, ustawiamy widoki handlowców i menedżerów, a po testach przechodzimy na właściwe dane.",
    "decision": "Nie zawsze potrzebny jest nowy system od zera. Najpierw warto sprawdzić, czy obecne narzędzie można skonfigurować, zintegrować lub rozbudować.",
    "caution": "Przed migracją ustalamy uprawnienia, odpowiedzialność za dane i plan wycofania zmian.",
    "proofUrl": "/case-studies/b-crm",
    "proofLabel": "B-CRM – role, leady i zadania"
  },
  "crm-z-ai": {
    "title": "CRM z AI – podsumowania, klasyfikacja i automatyzacja",
    "category": "AI i CRM",
    "problem": "Handlowcy tracą czas na czytanie długich historii kontaktu i przepisywanie notatek. Reguły i modele AI mogą skracać część czynności, ale nie powinny samodzielnie zmieniać wrażliwych danych.",
    "scenario": "Moduł może proponować streszczenie leada i następny krok, a pracownik zatwierdza zapis w CRM. Jakość mierzymy na ustalonej próbce prawdziwych scenariuszy.",
    "decision": "Najpierw porządkujemy statusy i bazę danych. Jeśli informacje w CRM są niekompletne, AI będzie wzmacniało chaos zamiast go naprawiać.",
    "caution": "Ważne są zakres udostępnianych danych, koszt zapytań do modeli i ręczna kontrola krytycznych operacji.",
    "proofUrl": "/case-studies/b-crm",
    "proofLabel": "B-CRM – przykład bazy do integracji (bez deklaracji gotowego AI)"
  },
  "chatbot-ai-dla-firm": {
    "title": "Chatbot AI na stronę firmy – obsługa pytań i leadów",
    "category": "AI i obsługa klienta",
    "problem": "Klienci pytają w kółko o cennik, dostępność usług i warunki współpracy, często wieczorem. Zwykły formularz nie odpowiada na pytania i nie pomaga dobrać odpowiedniej usługi.",
    "scenario": "Bot może korzystać wyłącznie z zaakceptowanej bazy wiedzy, pokazywać linki do ofert, zebrać kontakt za zgodą i przekazać trudne pytania człowiekowi.",
    "decision": "Chatbot ma sens, gdy baza wiedzy jest aktualna i firma umie szybko odbierać przekazane rozmowy. Przy kilku pytaniach miesięcznie wystarczy dobrze napisane FAQ.",
    "caution": "Nie obiecuję bezbłędnych odpowiedzi; przed uruchomieniem potrzebne są testy faktów, odmów i przypadków nietypowych.",
    "proofUrl": "/wdrozenia-ai-dla-firm",
    "proofLabel": "Jak projektuję i testuję wdrożenia AI"
  },
  "wirtualna-recepcjonistka-ai": {
    "title": "Wirtualna recepcjonistka AI – zapytania i rezerwacje",
    "category": "AI i obsługa klienta",
    "problem": "Recepcja lub właściciel firmy nie nadąża za pytaniami o terminy, odwołaniami wizyt i podstawowymi informacjami. Sam kalendarz nie wyjaśnia klientom zasad usługi.",
    "scenario": "Asystent zbiera rodzaj usługi i preferowany termin, sprawdza dostępność przez kalendarz oraz zapisuje zgłoszenie po potwierdzeniu. W sprawach niejednoznacznych przekazuje rozmowę pracownikowi.",
    "decision": "Najpierw ustalamy kanał: czat na stronie, komunikator albo telefon. Obsługa głosowa wymaga dodatkowych integracji i nie jest automatycznym dodatkiem do chatbota.",
    "caution": "Rezerwacje muszą być potwierdzane w rzeczywistym kalendarzu, a nie proponowane na podstawie zgadywania przez model.",
    "proofUrl": "/wdrozenia-ai-dla-firm",
    "proofLabel": "Proces wdrożeń AI"
  },
  "automatyzacja-obslugi-klienta": {
    "title": "Automatyzacja obsługi klienta – formularze, e-mail i CRM",
    "category": "Automatyzacja",
    "problem": "Klient zostawia zapytanie na stronie, ale nie trafia ono do właściwej osoby. Kolejne wiadomości giną między skrzynkami i terminami, a menedżer nie widzi zaległych kontaktów.",
    "scenario": "Po wysłaniu formularza system tworzy leada, przypisuje opiekuna, uruchamia przypomnienie i aktualizuje status. Błędy integracji trafiają do osobnego rejestru.",
    "decision": "Warto automatyzować powtarzalne kroki, jeśli wiadomo, kto odpowiada za każdy etap. Bez jasnych zasad przypisywania nawet dobrze działający webhook nie usprawni sprzedaży.",
    "caution": "Weryfikujemy zgody, duplikaty, niezawodność dostarczania i możliwość ponowienia nieudanych operacji.",
    "proofUrl": "/case-studies/b-crm",
    "proofLabel": "B-CRM – proces obsługi leadów"
  },
  "widocznosc-w-internecie": {
    "title": "Widoczność firmy w Google – rozwój SEO",
    "category": "SEO i widoczność",
    "problem": "Witryna istnieje, ale klienci nie znajdują odpowiednich usług albo Google pokazuje przypadkowe artykuły zamiast podstron ofertowych. Większa liczba adresów nie rozwiązuje problemu sama w sobie.",
    "scenario": "Najpierw analizuję zapytania i strony w Search Console, następnie porządkuję strukturę usług, linki wewnętrzne i treści odpowiadające na realne pytania zakupowe.",
    "decision": "Stała praca nad widocznością różni się od jednorazowego audytu SEO. Gdy witryna ma błędy techniczne, najpierw naprawiamy podstawy, dopiero później rozwijamy treści.",
    "caution": "Indeksowanie, pozycje i ruch zależą od decyzji wyszukiwarki. Nie gwarantuję miejsc w TOP 3.",
    "proofUrl": "/narzedzia",
    "proofLabel": "Darmowe narzędzia diagnostyczne"
  },
  "audyt-google-ads": {
    "title": "Audyt Google Ads – dlaczego reklamy nie sprzedają?",
    "category": "Reklamy i analityka",
    "problem": "Kampania wydaje budżet, a formularz przynosi mało zapytań lub nie da się powiązać kliknięć z klientami. Problem może dotyczyć słów, lokalizacji, strony albo śledzenia konwersji.",
    "scenario": "Porównuję zapytania i wykluczenia, strukturę kampanii, cele konwersji oraz zachowanie formularza. Wnioski dzielę na poprawki bezpieczne i zmiany wymagające eksperymentu.",
    "decision": "Gdy kampania nie ma poprawnie mierzonego celu, samo zwiększanie budżetu bywa nieopłacalne. Najpierw trzeba ustalić, które działania są prawdziwym sygnałem sprzedaży.",
    "caution": "Dostęp do konta reklamowego i do danych CRM uzgadniamy oddzielnie; nie opieram rekomendacji wyłącznie na liczbie kliknięć.",
    "proofUrl": "/google-ads-dla-firm",
    "proofLabel": "Zakres obsługi Google Ads"
  },
  "sklepy-internetowe": {
    "title": "Tworzenie sklepów internetowych – sprzedaż i integracje",
    "category": "Strony i e-commerce",
    "problem": "Klient widzi produkt, ale trudno mu wybrać wariant, sprawdzić dostawę lub ukończyć zamówienie. Katalog działa tylko na komputerze, a właściciel ręcznie przepisuje płatności i stany.",
    "scenario": "Dla małego sklepu budujemy czytelną strukturę produktów i koszyk z płatnościami. Przy większym katalogu trzeba uwzględnić filtrowanie, zamówienia i synchronizację danych.",
    "decision": "Nie każdy sklep powinien powstawać od zera. Dobór gotowej platformy lub własnej aplikacji zależy od funkcji, skali zamówień i budżetu utrzymania.",
    "caution": "Integracje magazynowe i płatności wymagają osobnego zakresu, testów i zgodności z operatorem.",
    "proofUrl": "/case-studies/isto-kebab",
    "proofLabel": "Isto Kebab – przykład internetowego procesu zamawiania"
  },
  "aplikacje-webowe-na-zamowienie": {
    "title": "Aplikacje webowe na zamówienie – panele i systemy",
    "category": "Aplikacje i oprogramowanie",
    "problem": "Zespół obsługuje firmę w kilku arkuszach i panelach, bo gotowe oprogramowanie nie odzwierciedla rzeczywistych kroków pracy. Pojawiają się pomyłki, ręczne eksporty i brak kontroli uprawnień.",
    "scenario": "Przykładowo aplikacja może łączyć listę zadań, terminarz, dokumenty PDF, role pracowników i prosty panel administratora z bazą PostgreSQL.",
    "decision": "Zaczynamy od najważniejszego procesu i pierwszej wersji użytkowej. Dopiero po testach w zespole dokładamy raporty, integracje oraz mniej krytyczne moduły.",
    "caution": "Projekt obejmuje też logowanie, walidację danych, kopie zapasowe i testy dostępu, nie tylko interfejs.",
    "proofUrl": "/case-studies/b-crm",
    "proofLabel": "B-CRM – rzeczywisty projekt web app"
  },
  "opieka-nad-strona": {
    "title": "Opieka techniczna nad stroną WWW – utrzymanie",
    "category": "Strony i utrzymanie",
    "problem": "Strona działa dziś, ale po aktualizacji przestaje wysyłać formularze, pojawiają się błędy mobilne albo w Google indeksują się przypadkowe adresy.",
    "scenario": "Ustalamy listę krytycznych elementów: stronę oferty, formularz, płatności lub kalkulator. Wykonuję cykliczne testy, śledzę błędy i przygotowuję plan aktualizacji.",
    "decision": "Prostej statycznej stronie może wystarczyć okresowy przegląd. Aplikacja z API i danymi klientów wymaga wyraźnych zasad utrzymania i czasu reakcji.",
    "caution": "Zakres serwisu, monitoring i możliwość dostępu do hostingu potwierdzamy przed rozpoczęciem opieki.",
    "proofUrl": "/case-studies/starcars",
    "proofLabel": "StarCars – przykład rozwijanej witryny"
  },
  "audyt-seo": {
    "title": "Audyt SEO – indeksacja, technika i struktura strony",
    "category": "SEO i widoczność",
    "problem": "Google pomija ważne adresy, podstrony mają błędne canonical albo poradniki konkurują z ofertą. Bez diagnozy łatwo tworzyć więcej treści, które też nie przyniosą ruchu.",
    "scenario": "Sprawdzam indeksację, robots, sitemapę, przekierowania i linkowanie. Następnie zestawiam je z zapytaniami, wyświetleniami i kliknięciami z Search Console.",
    "decision": "Audyt daje listę przyczyn i priorytetów. Osobnym etapem jest wdrożenie poprawek, rozwijanie wartościowych ofert i monitorowanie reakcji Google.",
    "caution": "Brak indeksacji nie zawsze jest błędem technicznym; Google sam decyduje, które adresy dodać do wyszukiwarki.",
    "proofUrl": "/narzedzia",
    "proofLabel": "Narzędzia do wstępnej analizy witryny"
  },
  "audyt-wcag": {
    "title": "Audyt WCAG – dostępność stron i aplikacji",
    "category": "Dostępność i UX",
    "problem": "Formularza nie da się wypełnić klawiaturą, linki nie mają czytelnych nazw, kontrast utrudnia odczyt, a komunikaty błędów są niezrozumiałe.",
    "scenario": "Badam kluczowe widoki klawiaturą i technicznymi narzędziami, dokumentuję problemy oraz proponuję konkretne zmiany w semantyce, nawigacji i formularzach.",
    "decision": "Automatyczny skaner to punkt wyjścia, nie pełny audyt. Rzeczywista dostępność wymaga także ręcznych testów interakcji i scenariuszy użytkowników.",
    "caution": "Przegląd techniczny nie jest automatycznie certyfikatem zgodności ani opinią prawną.",
    "proofUrl": "/narzedzia",
    "proofLabel": "Narzędzia techniczne"
  },
  "integracje-api": {
    "title": "Integracje API i webhooki – połącz systemy firmy",
    "category": "Integracje i automatyzacja",
    "problem": "Informacje o kliencie trzeba przepisywać pomiędzy formularzem, reklamami, CRM, kalendarzem i narzędziami do faktur. Gdy jeden zapis się nie uda, dane rozchodzą się między systemami.",
    "scenario": "Integracja odbiera zdarzenie, sprawdza poprawność danych, unika duplikatów i zapisuje wynik w CRM. W razie błędu może ponowić operację i oznaczyć ją do sprawdzenia.",
    "decision": "Przed napisaniem integracji trzeba sprawdzić dokumentację API, limity, koszty dostawców i uprawnienia. Czasem proste połączenie wystarczy, a czasem potrzebna jest kolejka zdarzeń.",
    "caution": "Nie deklaruję gotowej integracji z każdym systemem bez weryfikacji jego API.",
    "proofUrl": "/case-studies/b-crm",
    "proofLabel": "B-CRM – integracje źródeł leadów"
  },
  "widocznosc-w-ai": {
    "title": "Widoczność firmy w ChatGPT i wyszukiwarkach AI",
    "category": "SEO i AI",
    "problem": "Firma jest w internecie, ale systemy odpowiedzi AI nie mają łatwych do zweryfikowania informacji o jej usługach, realizacjach i sposobie kontaktu.",
    "scenario": "Porządkuję jednoznaczne opisy usług, dane strukturalne, autorstwo, realizacje i źródła zewnętrzne. Następnie sprawdzamy, na jakie pytania marka rzeczywiście pojawia się w odpowiedziach.",
    "decision": "Optymalizacja widoczności AI nie zastępuje zwykłego SEO. Najpierw potrzebne są dostępne, wiarygodne strony i podstawowe informacje o firmie.",
    "caution": "Nie ma sposobu na zagwarantowanie rekomendacji w ChatGPT, Gemini lub Perplexity; testy i wyniki trzeba rozdzielać od obietnic marketingowych.",
    "proofUrl": "/uslugi",
    "proofLabel": "Przegląd oferty i sposobu współpracy"
  },
  "mvp-dla-startupow": {
    "title": "MVP dla startupu – aplikacja od pomysłu do testów",
    "category": "Startupy i MVP",
    "problem": "Masz pomysł na aplikację, ale nie wiesz, które funkcje są niezbędne do pierwszej sprzedaży lub testu z użytkownikami. Rozbudowany produkt od razu może pochłonąć budżet bez potwierdzenia popytu.",
    "scenario": "Ustalamy jeden główny przypadek użycia, model danych, rejestrację użytkownika i kluczowy ekran. Budujemy pierwszą wersję, zbieramy uwagi i dopiero potem wyznaczamy kolejny etap.",
    "decision": "MVP to nie niedokończona duża aplikacja. Ma działać w najważniejszym scenariuszu i umożliwiać sprawdzenie hipotezy biznesowej bez zbędnych modułów.",
    "caution": "Nie gwarantuję sukcesu rynkowego startupu. Pierwszą wersję należy konfrontować z odbiorcami i realnymi kosztami utrzymania.",
    "proofUrl": "/case-studies/beatmarket",
    "proofLabel": "BeatMarket – projekt produktu cyfrowego"
  },
  "aplikacje-saas": {
    "title": "Aplikacja SaaS na zamówienie – panel i abonament",
    "category": "Startupy i SaaS",
    "problem": "Chcesz sprzedawać usługę przez przeglądarkę wielu klientom, ale potrzebujesz rozdzielenia danych organizacji, kont użytkowników i dostępu do płatnych funkcji.",
    "scenario": "Pierwsza wersja SaaS może obejmować rejestrację firm, role użytkowników, jeden płatny plan, panel administratora i kluczową funkcję produktu.",
    "decision": "Na początku warto sprawdzić model cenowy i koszt obsługi jednego klienta. Architektura wielofirmowa wymaga większej uwagi niż pojedynczy panel wewnętrzny.",
    "caution": "Bezpieczeństwo izolacji danych, płatności, limity i polityka retencji należy uwzględnić przed komercyjnym uruchomieniem.",
    "proofUrl": "/case-studies/b-crm",
    "proofLabel": "B-CRM – przykład aplikacji biznesowej, nie gotowej platformy SaaS"
  }
};

export const commercialServiceSlugs = Object.keys(commercialServiceDetails);
