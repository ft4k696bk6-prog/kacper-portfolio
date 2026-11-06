import { errorGuides } from "./errorGuides";
export const guides = [...errorGuides,
  {
    slug: "ile-kosztuje-strona-internetowa",
    title: "Ile kosztuje strona internetowa dla małej firmy?",
    description: "Co wpływa na wycenę strony, jak porównać oferty i które koszty utrzymania uwzględnić przed rozpoczęciem projektu.",
    service: "/tworzenie-stron-internetowych",
    serviceLabel: "Tworzenie stron internetowych",
    intro: "Cena strony zależy od tego, co ma robić, kto przygotuje materiały i jakie systemy trzeba połączyć. Żeby porównać dwie wyceny, najpierw porównaj zakres. Jedna strona z ofertą i kontaktem to inne zlecenie niż serwis z kalkulatorem, kilkoma językami i panelem do edycji.",
    sections: [
      { title: "Co najbardziej zmienia wycenę?", paragraphs: ["Liczba podstron jest tylko początkiem. Znaczenie mają indywidualny projekt graficzny, przygotowanie tekstów i zdjęć, wersje językowe, formularze oraz integracje. Formularz wysyłający wiadomość wymaga mniej pracy niż formularz, który zapisuje zapytanie w CRM, przypisuje opiekuna i wysyła potwierdzenie.", "Warto opisać też obsługę strony po publikacji. Jeśli chcesz samodzielnie zmieniać ofertę i dodawać realizacje, uwzględnij panel edycji i instrukcję. Jeśli treść zmienia się rzadko, prostsza strona może wystarczyć."] },
      { title: "Trzy zakresy, które warto rozróżnić", paragraphs: ["Landing page skupia się na jednej ofercie i jednej akcji: zapytaniu, rezerwacji albo zakupie. Sprawdza się jako strona kampanii lub pierwsza prezentacja nowej usługi.", "Strona firmowa porządkuje kilka usług, informacje o wykonawcy, realizacje i kontakt. Daje miejsce na osobne odpowiedzi na pytania klientów i rozbudowę treści w wyszukiwarce.", "Serwis z funkcjami biznesowymi zawiera na przykład kalkulator, rezerwacje, konta użytkowników lub integrację z CRM. W tym wariancie trzeba wycenić również logikę, bezpieczeństwo i obsługę błędów. W moim portfolio StarCars pokazuje stronę usługową z kalkulatorem, a Motomizer — prezentację produktu."] },
      { title: "Jak porównać oferty wykonawców?", paragraphs: ["Poproś o wyszczególnienie projektu, wdrożenia, treści, testów mobilnych, poprawek i publikacji. Ustal, kto zakłada konta domeny i hostingu, kto ma do nich dostęp i co otrzymujesz po zakończeniu współpracy. Zapytaj, czy cena obejmuje konfigurację analityki i podstawowe przygotowanie do indeksowania.", "Do budżetu dolicz odnawianie domeny, hosting i ewentualne płatne narzędzia. Reklamy, regularne prowadzenie treści i dalszy rozwój zwykle wymagają osobnego zakresu. Niska cena uruchomienia nie mówi jeszcze, ile będzie kosztować utrzymanie całości."] },
      { title: "Jak ograniczyć koszt bez pogarszania najważniejszych funkcji?", paragraphs: ["Zacznij od jednej dobrze opisanej oferty, widocznego kontaktu i potrzebnych formularzy. Zbierz logo, zdjęcia, opisy usług i przykłady realizacji przed rozpoczęciem projektowania. Ustal osobno funkcje konieczne do startu oraz te, które mogą poczekać.", "Nie rezygnuj z testów na telefonie ani sprawdzenia drogi zapytania od formularza do odbiorcy. Nawet mała strona powinna pozwalać klientowi znaleźć ofertę i skutecznie się skontaktować."] },
      { title: "Co wysłać mi do wyceny?", paragraphs: ["Opisz branżę, główną ofertę, odbiorców, planowane podstrony i funkcje. Dołącz obecną stronę, jeśli ją masz, oraz dwa przykłady stylistyki, którą lubisz. Napisz, jakie materiały są gotowe, jaki masz termin i orientacyjny budżet.", "Wyceniam ustalony zakres indywidualnie. Te informacje pozwalają zaproponować sensowną pierwszą wersję i wskazać, co można wdrożyć później. Napisz na kacper@bernecki.dev z tematem „Wycena strony”."] },
    ],
  },
  {
    slug: "crm-na-zamowienie-czy-gotowy",
    title: "CRM na zamówienie czy gotowy system — co wybrać?",
    description: "Kiedy wystarczy gotowy CRM, kiedy warto budować własny i jak sprawdzić koszty, uprawnienia oraz migrację danych.",
    service: "/crm-i-aplikacje-webowe",
    serviceLabel: "CRM i aplikacje webowe",
    intro: "Gotowy CRM jest dobrym początkiem, gdy firma potrzebuje standardowej listy kontaktów, etapów sprzedaży i przypomnień. System na zamówienie warto rozważyć, gdy konkretne procesy, role lub integracje trudno odwzorować w dostępnych narzędziach. Sam fakt, że arkusz stał się niewygodny, nie oznacza jeszcze potrzeby budowy własnej aplikacji.",
    sections: [
      { title: "Najpierw opisz proces, potem wybieraj narzędzie", paragraphs: ["Rozpisz drogę jednego zapytania: skąd przychodzi, kto je odbiera, kiedy zmienia status i komu jest przekazywane. Zapisz, jakie dane są potrzebne na każdym etapie oraz które informacje powinny być dostępne tylko dla wybranych osób.", "Wskaż trzy problemy, które system ma rozwiązać. Mogą to być zagubione telefony, brak historii ustaleń lub ręczne przepisywanie danych do ofert. Taka lista daje kryteria oceny narzędzia lepsze niż liczba funkcji na stronie producenta."] },
      { title: "Kiedy wybrać gotowy CRM?", paragraphs: ["Gdy proces jest typowy, ważny jest szybki start, a integracje są już dostępne. Sprawdź wersję próbną na kilku przykładowych sprawach. Policz koszt dla rzeczywistej liczby użytkowników i upewnij się, że potrzebne automatyzacje nie wymagają droższego planu.", "Sprawdź eksport danych i załączników, kopie zapasowe, uprawnienia oraz warunki zakończenia umowy. Przy ocenie ceny uwzględnij wdrożenie i czas zespołu, nie tylko miesięczny abonament."] },
      { title: "Kiedy uzasadniony jest własny system?", paragraphs: ["Gdy wiele działów obsługuje tę samą sprawę, potrzebujesz nietypowych uprawnień albo proces obejmuje sprzedaż, finansowanie i realizację. Własna aplikacja pozwala zbudować widoki i przejścia dopasowane do tej pracy, ale wymaga budżetu na utrzymanie, aktualizacje i rozwój.", "Współpraca z Re-energy System obejmowała stronę, reklamy i CRM. Osobno udostępniam B-CRM jako demonstrację pracy z rolami i etapami obsługi. To demo do poznania możliwości — dane i dostęp klientów nie są jego częścią."] },
      { title: "Co powinno znaleźć się w pierwszej wersji?", paragraphs: ["Zwykle warto zacząć od listy spraw, przypisania opiekuna, statusów, historii zmian i uprawnień. Dopiero po przejściu pełnego procesu przez użytkowników rozwijać raporty oraz automatyzacje. Zakres pierwszej wersji zależy od tego, które zadania faktycznie blokują zespół.", "Przed importem uporządkuj duplikaty i uzgodnij znaczenie pól. Migrację najpierw sprawdź na próbce, zachowaj kopię źródła i określ sposób powrotu do poprzedniego procesu. Uprawnienia muszą działać po stronie serwera, a nie tylko ukrywać przyciski na ekranie."] },
      { title: "Jak przygotować rozmowę o CRM?", paragraphs: ["Przygotuj liczbę użytkowników, listę ról, etapy obsługi, obecne narzędzia i wymagane integracje. Pokaż zanonimizowany przykład sprawy zamiast przesyłać prawdziwe dane klientów. Określ, jakie informacje mają być eksportowane i kto odpowiada za utrzymanie.", "Napisz na kacper@bernecki.dev, co dziś robisz ręcznie i gdzie tracisz najwięcej czasu. Możemy zacząć od jednego procesu, a dopiero potem rozbudować aplikację."] },
    ],
  },
  {
    slug: "reklama-lokalnej-firmy-strona-i-social-media",
    title: "Reklama lokalnej firmy: strona, social media i pomiar zapytań",
    description: "Jak przygotować lokalną firmę do kampanii: oferta, profil, strona docelowa, budżet i obsługa zapytań od klientów.",
    service: "/marketing-i-reklamy",
    serviceLabel: "Marketing, reklamy i social media",
    intro: "Przed uruchomieniem reklamy ustal, jaką usługę promujesz, komu ją pokazujesz i co ma zrobić zainteresowana osoba. Dla gastronomii może to być przejście do menu, dla salonu rezerwacja, a dla firmy usługowej rozmowa o wycenie. Każda z tych sytuacji wymaga innej drogi od reklamy do działania.",
    sections: [
      { title: "Jedna kampania powinna mieć czytelny cel", paragraphs: ["Zacznij od jednej oferty i obszaru, który możesz rzeczywiście obsłużyć. Przygotuj zdjęcia, warunki oferty, aktualne godziny i sposób kontaktu. Użytkownik powinien znaleźć po kliknięciu to, co zobaczył w reklamie, bez szukania właściwej usługi na rozbudowanej stronie.", "Nie każda kampania wymaga nowej witryny. Jeśli obecna strona ma odpowiednią ofertę i sprawny formularz, wystarczy ją dopracować. Osobny landing page przydaje się, gdy oferta, grupa odbiorców albo cel kampanii różnią się od reszty serwisu."] },
      { title: "Po co łączyć social media ze stroną?", paragraphs: ["Profil pomaga pokazywać aktualności, ofertę i codzienną pracę. Strona porządkuje trwałe informacje: usługi, zakres, realizacje, pytania i kontakt. Zadbaj o zgodność nazwy, danych kontaktowych i godzin w kanałach, z których korzystają klienci.", "Moja współpraca z Jalapeno Kebab w Niemcach obejmuje reklamy, marketing i prowadzenie social mediów. Dla StarCars zakres obejmuje stronę, reklamy i marketing. To dwa różne konteksty: lokalna gastronomia oraz usługa importu samochodów, przy której klient potrzebuje więcej informacji przed kontaktem."] },
      { title: "Jakie materiały przygotować?", paragraphs: ["Zbierz aktualne zdjęcia produktu lub realizacji, konkretny opis oferty, odpowiedzi na najczęstsze pytania i zasady skorzystania z usługi. Opinia klienta powinna mieć jego zgodę i zachować rzeczywiste brzmienie. Zdjęcia oraz teksty muszą nadawać się do legalnego wykorzystania w reklamie.", "Dla gastronomii przydatne są menu i łatwa ścieżka zamówienia. Dla usług — zakres prac, przykłady i formularz zbierający informacje potrzebne do wyceny. Ogranicz liczbę pól do tych, których naprawdę potrzebujesz przed pierwszą rozmową."] },
      { title: "Co mierzyć zamiast samych polubień?", paragraphs: ["Rozróżnij kliknięcie kontaktu, wysłanie zapytania i pozyskanie klienta. Kliknięcie numeru telefonu nie potwierdza rozmowy, a wysłany formularz nie oznacza jeszcze wartościowego zlecenia. Jeśli to możliwe, zapisuj źródło zapytania i jego dalszy wynik.", "Koszt wartościowego zapytania policz, dzieląc wydatki na kampanię przez liczbę zapytań spełniających ustalone kryteria. Przy porównywaniu kanałów uwzględnij także koszty obsługi i przygotowania materiałów. Pomiar analityczny konfiguruj z uwzględnieniem wymaganych zgód użytkowników."] },
      { title: "Budżet i obsługa kontaktów", paragraphs: ["Oddziel budżet płacony platformie reklamowej od wynagrodzenia za obsługę, materiały i stronę. Ustal limit wydatków oraz warunki oceny pierwszych wyników. Jeśli pojawiają się niepasujące zapytania, sprawdź ofertę, kierowanie reklamy i treść formularza przed zwiększaniem budżetu.", "Ustal też, kto odpowiada na wiadomości i oddzwania. Napisz na kacper@bernecki.dev, w jakiej branży działasz, gdzie obsługujesz klientów, co chcesz promować i jakie kanały już masz. Na tej podstawie ustalimy zakres działań."] },
    ],
  },
{
  "slug": "ile-kosztuje-lead-z-facebook-ads",
  "title": "Ile kosztuje lead z Facebook Ads? CPL i prawdziwa ocena reklamy",
  "description": "Jak obliczyć koszt leada z Meta Ads, czym różni się CPL od CAC i dlaczego tani formularz nie zawsze przynosi klienta. Przykład kampanii OZE.",
  "service": "/reklamy-meta-ads-dla-firm",
  "serviceLabel": "Prowadzenie kampanii Meta Ads",
  "intro": "Koszt leada (CPL) to wydatki na kampanie podzielone przez liczbę uzyskanych kontaktów. To ważna, ale nie jedyna liczba. Na podstawie udostępnionych zrzutów Meta Ads w jednym z projektów OZE można wykazać 2 331 kontaktów i średni CPL około 29,79 zł w wybranych kampaniach. Nie oznacza to, że dokładnie tyle kosztuje lead w każdej branży.",
  "sections": [
    {
      "title": "CPL, koszt kwalifikowanego leada i CAC to różne rzeczy",
      "paragraphs": [
        "CPL mówi, ile kosztowało wygenerowanie formularza lub innego zdefiniowanego kontaktu. Nie potwierdza, że człowiek ma realny budżet, odbierze telefon ani kupi usługę. Do liczenia kwalifikowanego leada trzeba uzgodnić kryteria, np. prawidłowy numer, zainteresowanie konkretną ofertą oraz obszar obsługi.",
        "CAC to koszt pozyskania faktycznego klienta. Wymaga danych z całego procesu, a nie tylko z panelu Meta Ads. Żeby go policzyć, trzeba znać również liczbę podpisanych umów i ustalony zakres kosztów sprzedaży i reklamy."
      ]
    },
    {
      "title": "Jak obliczyć średni koszt kontaktu bez przekłamań?",
      "paragraphs": [
        "Sumuje się wydatki kampanii należących do tego samego celu i dzieli przez sumę uzyskanych kontaktów. To średnia ważona liczbą wyników, a nie zwykła średnia kosztów poszczególnych kampanii. Dzięki temu mała kampania z kilkoma leadami nie zniekształca obrazu dużej kampanii.",
        "W udostępnionych zrzutach wybrane 17 kampanii leadowych miało łącznie 2 331 kontaktów i około 69,4 tys. zł wydatków. Daje to około 29,79 zł za kontakt. Kwoty wyświetlane w tysiącach były zaokrąglone; zrzuty nie podają zakresu dat, więc nie należy przypisywać ich do konkretnego roku."
      ]
    },
    {
      "title": "Dlaczego koszt kontaktu zależy od branży?",
      "paragraphs": [
        "Na CPL wpływa atrakcyjność oferty, stopień konkurencji, sezon, obszar, jakość kreacji, pytania formularza i sposób optymalizacji. Usługa wymagająca dużej inwestycji może generować mniej formularzy, ale wymagać lepszej kwalifikacji.",
        "Nie ma jednej wiarygodnej stawki CPL dla całego Facebooka czy Instagrama. W porównaniach należy zestawiać kampanie o zbliżonym celu i definicji wyniku."
      ]
    },
    {
      "title": "Co sprawdzić, gdy Meta pokazuje tanie leady, a sprzedaż stoi?",
      "paragraphs": [
        "Zacznij od odsetka odebranych połączeń, szybkości kontaktu, aktualności numerów i zgodności oczekiwań użytkowników z ofertą. Następnie porównaj treść reklamy z pytaniami formularza i skryptem pierwszej rozmowy.",
        "Jeśli reklama działa, ale handlowcy nie kontaktują się z leadami na czas, samo zwiększenie budżetu najprawdopodobniej nie rozwiąże problemu. Warto połączyć formularze z CRM i regularnie analizować etapy obsługi."
      ]
    },
    {
      "title": "Zobacz case study i przygotuj własny pomiar",
      "paragraphs": [
        "Przykład Re-Energy System pokazuje znaczenie pozyskiwania kontaktów dla branży OZE. Dane 2 331 kontaktów i średniego kosztu 29,79 zł pochodzą z wybranych kampanii na zrzutach przekazanych przez właściciela; nie są informacją o liczbie klientów ani o obrocie przypisanym reklamie.",
        "Przed uruchomieniem własnej kampanii ustal cel, obszar obsługi, liczbę osób kontaktujących się z leadami, sposób przypisywania źródła i definicję kwalifikowanego kontaktu. Więcej informacji znajduje się w case study Re-Energy System na stronie portfolio."
      ]
    }
  ]
},
{
  "slug": "facebook-lead-ads-integracja-z-crm",
  "title": "Facebook Lead Ads i CRM — jak nie gubić kontaktów z reklam?",
  "description": "Przekazywanie formularzy Meta Lead Ads do CRM: przydziały, duplikaty, statusy, czas kontaktu i kontrola uprawnień. Praktyczny poradnik dla firm.",
  "service": "/crm-i-aplikacje-webowe",
  "serviceLabel": "CRM i aplikacje webowe",
  "intro": "Po wysłaniu formularza reklamowego praca dopiero się zaczyna. Kontakt powinien znaleźć się w miejscu, gdzie handlowiec go zobaczy, zadzwoni i zapisze wynik. Ręczne kopiowanie leadów z Meta do arkusza utrudnia kontrolę i zwiększa ryzyko pominięć.",
  "sections": [
    {
      "title": "Co powinno się stać po wysłaniu formularza?",
      "paragraphs": [
        "System powinien przyjąć dane z formularza, zapisać źródło zgłoszenia, datę oraz poprawnie utworzyć kontakt. Jeżeli przesłanie się nie powiedzie, potrzebny jest czytelny alert i możliwość ponowienia operacji. Automatyzacja nie może oznaczać cichej utraty leada.",
        "Warto od razu określić osobę odpowiedzialną za kontakt, kolejkę nowych spraw i sposób oznaczania terminu oddzwonienia."
      ]
    },
    {
      "title": "Jak działa przypisywanie leadów handlowcom?",
      "paragraphs": [
        "Firma może rozdzielać kontakty według lokalizacji, rodzaju produktu, dyżuru lub ręcznej decyzji menedżera. Ważne, by reguły były zapisane, a zmiana przypisania nie usuwała historii kontaktu i komentarzy.",
        "Handlowiec powinien widzieć swoje zadania oraz zaległe sprawy, a przełożony zbiorczy stan kolejki. Dostęp do danych klienta ogranicza się do ról, które naprawdę go potrzebują."
      ]
    },
    {
      "title": "Duplikaty, błędne numery i jakość danych",
      "paragraphs": [
        "Ta sama osoba może wysłać formularz kilka razy lub zainteresować się różnymi usługami. Bez zasad deduplikacji CRM może utworzyć kilka niepowiązanych wpisów. Łączenie kontaktów wymaga ostrożności: ten sam numer nie zawsze oznacza tę samą osobę.",
        "Dobre formularze nie powinny zbierać nadmiarowych danych. Trzeba też określić retencję, podstawę prawną przetwarzania i sposób obsługi żądań osób, których dane dotyczą."
      ]
    },
    {
      "title": "Jak mierzyć efektywność po stronie sprzedaży?",
      "paragraphs": [
        "Zestawiaj wyniki z Meta z liczbą prób kontaktu, odebranych telefonów, ofert i podpisanych umów. Sam koszt formularza nie pokaże, czy kampania przyczynia się do sprzedaży.",
        "Nawet prosty raport z czasem pierwszego kontaktu oraz powodami odrzucenia leada pomaga odróżnić problem reklamy od problemu obsługi zapytań."
      ]
    },
    {
      "title": "Kiedy budować własną integrację?",
      "paragraphs": [
        "Gotowa integracja bywa wystarczająca, gdy proces jest prosty. Własna aplikacja może mieć sens przy wielu rolach, niestandardowych przydziałach, automatyzacjach, umowach i kontroli realizacji.",
        "Przykładem systemu rozwijanego dla procesu handlowego jest B-CRM. Warto rozpocząć od mapy przepływu danych i testu na fikcyjnych kontaktach, zanim podłączy się produkcyjne formularze."
      ]
    }
  ]
},
{
  "slug": "reklamy-oze-magazyny-energii",
  "title": "Reklamy OZE i magazynów energii — jak pozyskiwać klientów?",
  "description": "Jak prowadzić kampanie Meta Ads dla fotowoltaiki i magazynów energii: komunikaty, kwalifikacja kontaktów, obsługa handlowców i pomiar CPL.",
  "service": "/marketing-i-reklamy",
  "serviceLabel": "Marketing i reklamy",
  "intro": "W branży OZE kontakt do osoby zainteresowanej magazynem energii jest dopiero początkiem. Liczy się spójność komunikatu, prawidłowe oczekiwania klienta, szybka reakcja i techniczna kwalifikacja zapytania.",
  "sections": [
    {
      "title": "Jedna reklama, jedno konkretne zastosowanie",
      "paragraphs": [
        "Magazyn energii może być przedstawiany w kontekście autokonsumpcji, zasilania rezerwowego lub współpracy z istniejącą instalacją PV. Nie należy obiecywać oszczędności ani dofinansowania bez sprawdzenia indywidualnych warunków.",
        "Przed przygotowaniem reklamy ustal, kto jest odbiorcą: właściciel nowej instalacji, osoba rozbudowująca PV czy klient firmy. Każda z tych grup ma inne pytania i wymagania techniczne."
      ]
    },
    {
      "title": "Kreacja powinna prowadzić do precyzyjnego formularza",
      "paragraphs": [
        "Informacja o ofercie powinna być zgodna z tym, co rzeczywiście może zaproponować handlowiec. Dobrze dobrane pytania pomagają rozpoznać lokalizację, status instalacji i główne potrzeby, bez tworzenia nadmiernie długiego formularza.",
        "Warto testować kilka wersji komunikatu, ale porównywać nie tylko ilość zgłoszeń, lecz również odsetek kontaktów użytecznych dla sprzedaży."
      ]
    },
    {
      "title": "Przykład z kampanii Re-Energy System",
      "paragraphs": [
        "Właściciel Re-Energy System deklaruje, że kampanie reklamowe przez około dwa lata były jedynym źródłem pozyskiwania leadów firmy. W udostępnionych zrzutach Meta Ads z wybranych 17 kampanii leadowych widać łącznie 2 331 kontaktów, przy średnim koszcie około 29,79 zł.",
        "To wynik wybranych kampanii, nie całego okresu działalności. Nie publikujemy nazw kampanii, obszarów ani budżetów pojedynczych reklam. Zrzuty nie zawierają jednoznacznego przedziału dat."
      ]
    },
    {
      "title": "W OZE konieczna jest sprawna obsługa leadów",
      "paragraphs": [
        "Przy dużym napływie zgłoszeń potrzebne są przydziały, kolejki kontaktów, terminy oddzwonienia i historia rozmów. Nieobsłużone formularze mogą pogarszać efektywność nawet dobrze zoptymalizowanej kampanii.",
        "System CRM powinien pokazywać, co stało się z leadem po pozyskaniu. Praca handlowca oraz wyniki Meta Ads to dwa elementy jednego procesu."
      ]
    },
    {
      "title": "Jak oceniać wynik bez sztucznego ROAS?",
      "paragraphs": [
        "Obrót całej firmy i wydatki reklamowe nie wystarczą do obliczenia przychodu przypisanego kampaniom. Potrzebne są dane o zamkniętych umowach, model atrybucji oraz informacja o innych źródłach zapytań.",
        "Przed wdrożeniem kampanii ustal, co liczy się jako lead, kto go kwalifikuje i jak raportowany jest wynik sprzedaży. Pełne case study udostępniam na stronie Re-Energy System w portfolio."
      ]
    }
  ]
},
{
  "slug": "formularz-meta-ads-czy-landing-page",
  "title": "Formularz Meta Lead Ads czy landing page — co lepsze dla firmy?",
  "description": "Porównanie formularzy Facebook i Instagram Ads z landing page: koszt kontaktów, jakość zgłoszeń, analityka, szybkość i integracja CRM.",
  "service": "/reklamy-meta-ads-dla-firm",
  "serviceLabel": "Meta Ads dla firm",
  "intro": "Formularz w reklamie ułatwia szybkie wysłanie zapytania bez wychodzenia z Facebooka lub Instagrama. Landing page daje więcej miejsca na wyjaśnienie oferty i pokazanie realizacji. Wybór zależy od celu i procesu sprzedaży.",
  "sections": [
    {
      "title": "Kiedy warto zacząć od formularza Meta?",
      "paragraphs": [
        "Jeśli oferta jest prosta i odbiorca rozumie, czego dotyczy zgłoszenie, formularz natywny może ograniczyć liczbę kroków. To przydatne zwłaszcza przy usługach, których pierwszym etapem jest rozmowa telefoniczna.",
        "Nie zakładaj jednak, że mniejszy koszt formularza oznacza lepszy wynik biznesowy. Część zapytań może być przypadkowa lub nie odpowiadać warunkom oferty."
      ]
    },
    {
      "title": "Kiedy landing page ma przewagę?",
      "paragraphs": [
        "Przy złożonych i drogich produktach klient może potrzebować porównania wariantów, zdjęć realizacji, odpowiedzi na pytania oraz zasad współpracy. Osobna strona pozwala też prezentować treści organiczne i wspiera SEO.",
        "Landing wymaga sprawnego działania na telefonach, jasnego CTA i kontroli poprawności formularza. Niespójność reklamy i strony potrafi znacząco obniżyć liczbę zapytań."
      ]
    },
    {
      "title": "Jak porównać obie drogi rzetelnie?",
      "paragraphs": [
        "Porównuj nie tylko CPL, ale też odsetek kontaktów poprawnych, liczbę realnych rozmów oraz wartość transakcji. Różne grupy docelowe lub treści reklam mogą zaburzać porównanie.",
        "Warto przyjąć z góry definicję kontaktu kwalifikowanego i ustalić jednakowy sposób dalszej obsługi obu źródeł w CRM."
      ]
    },
    {
      "title": "Techniczne podstawy kampanii",
      "paragraphs": [
        "Dla formularza Meta zadbaj o zgodne z prawem informacje dotyczące danych osobowych i bezpieczne pobieranie zgłoszeń. Dla landing page dodaj prawidłowe metadane, podstawową analitykę i odpowiednie zarządzanie zgodami.",
        "Przed startem przetestuj wysłanie próbnego zgłoszenia oraz to, czy dociera ono do właściwej osoby. Nawet najlepiej zaprojektowana kampania nie pomoże, jeśli lead zaginie."
      ]
    },
    {
      "title": "Co proponuję firmom?",
      "paragraphs": [
        "Zamiast przyjmować jedną metodę jako obowiązkową, dobieram rozwiązanie do branży, budżetu i potrzeb handlowców. Często sensowne jest równoległe testowanie natywnego formularza oraz dobrze przygotowanej strony.",
        "Możemy zacząć od analizy oferty i obecnego źródła zapytań, a następnie ustalić sposób mierzenia jakości leada."
      ]
    }
  ]
}
] as const;
