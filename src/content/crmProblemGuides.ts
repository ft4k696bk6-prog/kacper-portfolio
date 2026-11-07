const topics = [
  {
    "slug": "crm-licznik-leadow-nie-zgadza-sie-z-lista",
    "title": "CRM pokazuje 180 leadów, ale na liście jest mniej — jak to naprawić?",
    "description": "Licznik kontaktów w CRM nie zgadza się z listą? Sprawdź filtry, paginację, uprawnienia RLS i zapytania zliczające.",
    "symptom": "Panel pokazuje 180 kontaktów, ale handlowiec widzi tylko część. Przyczyną bywa różnica między sposobem liczenia rekordów a filtrami i uprawnieniami listy.",
    "cause": "Licznik może pochodzić z innego zapytania niż lista: uwzględniać archiwum, nie stosować filtrów, korzystać z innego zakresu RLS albo liczyć wszystkie rekordy mimo paginacji. Najpierw ustal, co dokładnie reprezentuje liczba.",
    "steps": [
      "Zapisz rolę, identyfikator zalogowanego użytkownika, aktywną zakładkę oraz filtry. Porównuj te same warunki w liczniku i liście.",
      "Wyłącz wyszukiwanie, filtr statusu, ukrywanie zablokowanych i archiwum. Sprawdź, czy lista odzyskuje brakujące pozycje.",
      "Zbadaj paginację: czy interfejs pobiera tylko pierwszych 50 lub 100 rekordów, a licznik pokazuje wszystkie? Sprawdź kolejne strony i limit odpowiedzi API.",
      "Porównaj zapytanie count z zapytaniem listy, w tym warunki przypisania handlowca i polityki RLS. Nie obchodź RLS kluczem service role w przeglądarce.",
      "Dodaj test integracyjny: konto handlowca, menedżera i administratora widzi właściwe rekordy oraz spójny licznik przy tym samym filtrze."
    ],
    "check": "Po przejściu wszystkich stron suma widocznych rekordów dla określonego filtra zgadza się z licznikiem. Osobno weryfikuj łączną liczbę w bazie, bo może mieć inny zakres.",
    "warning": "Nie poprawiaj problemu przez zastąpienie licznika długością pierwszej strony. To ukryje różnicę zamiast naprawić reguły widoczności.",
    "source": "https://supabase.com/docs/guides/database/postgres/row-level-security"
  },
  {
    "slug": "crm-odblokowany-lead-nadal-niewidoczny",
    "title": "Odblokowuję lead w CRM, ale handlowiec go nie widzi",
    "description": "Co sprawdzić, gdy po zdjęciu blokady lead nie wraca na listę handlowca: status, przypisanie, RLS i odświeżanie.",
    "symptom": "Administrator odblokowuje kontakt, ale handlowiec nadal nie widzi go w panelu. Warto oddzielnie sprawdzić przypisanie, widoczność rekordu i odświeżenie danych.",
    "cause": "Odblokowanie jest zmianą jednej flagi. Kontakt może mieć inne przypisanie, ukryty status, być poza oknem paginacji albo lista może korzystać ze starej pamięci podręcznej.",
    "steps": [
      "Sprawdź zapis w bazie po zdjęciu blokady: identyfikator rekordu, flagę blokady, status oraz aktualnego opiekuna.",
      "Porównaj zapytanie listy handlowca z zapytaniem administratora. Ustal, które warunki WHERE wykluczają rekord.",
      "Sprawdź politykę SELECT RLS dla użytkownika docelowego. Samo UPDATE wykonane przez administratora nie oznacza, że handlowiec może teraz wykonać SELECT.",
      "Odśwież dane z serwera po mutacji lub unieważnij cache zapytania. Przetestuj także pełne przeładowanie strony.",
      "Dodaj test przepływu: blokada, odblokowanie, ponowne przypisanie, wejście handlowca i widoczność w odpowiedniej kolejce."
    ],
    "check": "Handlowiec widzi odblokowany lead bez ręcznego kombinowania z filtrami, a inny handlowiec bez uprawnienia go nie widzi.",
    "warning": "Nie rozszerzaj polityki RLS na wszystkie rekordy tylko po to, żeby dany lead się pokazał.",
    "source": "https://supabase.com/docs/guides/database/postgres/row-level-security"
  },
  {
    "slug": "crm-przypisanie-leadow-nie-aktualizuje-listy",
    "title": "Przypisałem leady pracownikowi, ale ich nie widzi — 5 kontroli",
    "description": "Jak diagnozować błędne przypisanie leadów w CRM i rozjazd między panelem administratora a handlowca.",
    "symptom": "Po ręcznym przypisaniu grupy leadów licznik pracownika rośnie, lecz na jego liście nie ma nowych kontaktów.",
    "cause": "Błąd bywa w mapowaniu identyfikatorów, różnicy między owner_id i assignee_id lub nieodświeżonym zapytaniu. Imię wyświetlane w interfejsie nie jest stabilnym identyfikatorem.",
    "steps": [
      "Sprawdź w bazie owner_id i assignee_id na jednym konkretnym leadzie. Porównaj je z identyfikatorem konta pracownika.",
      "Ustal, czy przydział jest zapisywany do właściwego pola, którego używa lista handlowca.",
      "Przetestuj jeden lead, potem partię. Przy masowej operacji zbieraj liczbę udanych i nieudanych aktualizacji.",
      "Zweryfikuj warunki dostępu i filtr ukrywania archiwalnych lub zablokowanych rekordów.",
      "Po przypisaniu wymuś odświeżenie listy i licznika oraz pokaż administratorowi rzeczywisty wynik operacji."
    ],
    "check": "Testowy lead pojawia się we właściwej zakładce przypisanego pracownika; po zmianie opiekuna znika z listy poprzedniego, jeśli taki jest model uprawnień.",
    "warning": "Nie przypisuj po nazwie użytkownika: dwie osoby mogą mieć takie samo imię lub zmienić nazwisko.",
    "source": "https://supabase.com/docs/guides/database/postgres/row-level-security"
  },
  {
    "slug": "crm-filtry-ukrywaja-leady",
    "title": "Leady zniknęły z CRM po zmianie filtrów — co sprawdzić?",
    "description": "Niewidoczne kontakty po filtracji statusu, regionu, daty lub kolejki? Diagnostyka warunków w interfejsie i API.",
    "symptom": "CRM wydaje się pusty po przełączeniu widoku, mimo że baza nadal zawiera kontakty.",
    "cause": "Filtry bywają łączone operatorem AND, a brak wartości domyślnej może działać jak aktywny filtr. Przy zmianie zakładki poprzedni filtr potrafi pozostać niewidoczny.",
    "steps": [
      "Wyświetl w UI aktywne filtry oraz przycisk ich wyczyszczenia. Zanotuj różnicę liczby rekordów przed i po czyszczeniu.",
      "Sprawdź, czy puste pole daty jest interpretowane jako brak ograniczenia, nie jako konkretny dzień lub NULL.",
      "Zweryfikuj statusy historyczne, wartości wielkości liter oraz migracje nazw statusów.",
      "Sprawdź sposób łączenia filtrów w zapytaniu; używaj testów na kombinacjach status, opiekun i region.",
      "Dodaj stan pustej listy opisujący aktywne ograniczenia zamiast komunikatu sugerującego utratę danych."
    ],
    "check": "Po wyczyszczeniu filtrów lista pokazuje komplet rekordów dostępnych dla danego konta, a ponowne zastosowanie filtrów daje przewidywalny wynik.",
    "warning": "Nie usuwaj danych ani nie resetuj bazy, kiedy problem dotyczy tylko warstwy widoku.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter"
  },
  {
    "slug": "crm-paginacja-pokazuje-tylko-pierwsze-leady",
    "title": "CRM pokazuje tylko pierwsze 100 leadów — paginacja Supabase",
    "description": "Dlaczego część rekordów nie dociera do Reacta? Limity odpowiedzi Supabase, range, sortowanie i spójny licznik.",
    "symptom": "W bazie jest dużo kontaktów, ale po przewinięciu lub wyszukaniu w CRM widać tylko pierwszą partię.",
    "cause": "Frontend może pobierać pojedynczy zakres danych i filtrować tylko lokalnie, a użytkownik myśli, że przeszukuje całą bazę.",
    "steps": [
      "Porównaj count w bazie z liczbą rekordów faktycznie zwróconych przez zapytanie.",
      "Wprowadź jawne stronicowanie po stronie serwera z range lub limit i offset, zależnie od użytego API.",
      "Dodaj stabilne sortowanie z drugim kluczem, np. datą i ID, by rekordy o identycznych datach nie przeskakiwały między stronami.",
      "Wyszukiwanie tekstu i filtry zastosuj przed paginacją po stronie zapytania, a nie do 100 już pobranych wierszy.",
      "Obsłuż następne strony, pusty wynik, błąd sieci i reset numeru strony po zmianie filtra."
    ],
    "check": "Ostatni rekord testowego zbioru jest dostępny, a wyszukiwanie znajduje go bez konieczności przewijania wszystkich stron.",
    "warning": "Domyślne limity i konfigurację konkretnego projektu sprawdź w panelu Supabase. Nie zakładaj, że każda instalacja ma identyczny limit.",
    "source": "https://supabase.com/docs/reference/javascript/range"
  },
  {
    "slug": "supabase-licznik-rls-a-lista",
    "title": "Supabase RLS: licznik rekordów jest inny niż lista użytkownika",
    "description": "Różnica między SELECT, count i dostępem administratora w Supabase. Jak testować licznik bez wycieku danych.",
    "symptom": "Administrator widzi wiele rekordów, handlowiec ma mniejszą listę, lecz nagłówek sugeruje tę samą liczbę dla obu kont.",
    "cause": "Licznik z endpointu administracyjnego może pomijać polityki bezpieczeństwa, podczas gdy SELECT w przeglądarce działa z JWT pracownika.",
    "steps": [
      "Określ semantykę liczby: wszystkie rekordy firmy czy tylko widoczne dla roli? Nazwij ją w UI zgodnie z definicją.",
      "Dla licznika pracownika wykonuj zapytanie pod jego kontekstem uprawnień.",
      "Przy zliczaniu administratora nie przesyłaj wartości dostępnych tylko dla administratora do klientów bez uprawnień.",
      "Przygotuj test SELECT i count dla trzech ról, włączając rekordy z innym opiekunem.",
      "Zapisz w dokumentacji, czy archiwum, rezygnacje i zablokowane leady wchodzą do licznika."
    ],
    "check": "Każda rola otrzymuje poprawną liczbę zgodną z definicją; wynik nie zdradza istnienia chronionych rekordów.",
    "warning": "Ukrycie elementu w React nie zabezpiecza tabeli. Polityki RLS oraz autoryzacja serwerowa pozostają obowiązkowe.",
    "source": "https://supabase.com/docs/guides/database/postgres/row-level-security"
  },
  {
    "slug": "supabase-insert-dziala-select-pusty",
    "title": "Supabase: INSERT działa, ale SELECT zwraca pustą listę",
    "description": "Rekord zapisany, ale niewidoczny po odświeżeniu? Sprawdź osobne polityki INSERT i SELECT, owner_id i JWT.",
    "symptom": "Formularz zapisuje rekord bez błędu, po czym użytkownik widzi pustą tabelę.",
    "cause": "Polityka INSERT i polityka SELECT to niezależne operacje. Możesz mieć prawo tworzyć rekord, ale nie prawo go później odczytać.",
    "steps": [
      "Potwierdź istnienie wiersza w kontrolowanym panelu administratora, nie na podstawie komunikatu toast.",
      "Sprawdź ustawienia RLS i osobne polityki dla INSERT oraz SELECT.",
      "Porównaj uid zalogowanego użytkownika z wartością owner_id zapisaną w rekordzie.",
      "W testach wykonuj zapytania z tokenem rzeczywistej roli, nie z kluczem serwisowym.",
      "Po zmianie polityk sprawdź ponowne odświeżenie, widoczność oraz brak dostępu do cudzych rekordów."
    ],
    "check": "Autor rekordu widzi go po zapisaniu i po nowym logowaniu, inny użytkownik widzi go tylko wtedy, gdy pozwala na to model uprawnień.",
    "warning": "Nie wyłączaj RLS na produkcji jako stałego obejścia problemu.",
    "source": "https://supabase.com/docs/guides/database/postgres/row-level-security"
  },
  {
    "slug": "supabase-admin-widzi-dane-handlowiec-nie",
    "title": "Supabase: administrator widzi rekord, użytkownik nie — diagnoza RLS",
    "description": "Jak porównać role i zasady SELECT w Supabase, kiedy panel admina działa, a konto handlowca pokazuje pustkę.",
    "symptom": "Po zalogowaniu jako administrator wszystko działa, ale zwykły pracownik nie widzi przypisanych mu spraw.",
    "cause": "Panel administratora może korzystać z innego zapytania lub uprzywilejowanego kontekstu; zwykły użytkownik podlega politykom zależnym od JWT i danych rekordu.",
    "steps": [
      "Zidentyfikuj dokładny rekord, który powinien być widoczny i konto, które ma do niego dostęp.",
      "Porównaj zapytania w obu widokach i rzeczywiste wartości pól przypisania.",
      "Sprawdź roszczenia JWT i funkcje używane w politykach RLS. Nie opieraj autoryzacji na etykiecie roli zapisanej wyłącznie w localStorage.",
      "Wykonaj testy pozytywne i negatywne dostępu pod kontami testowymi.",
      "Dodaj log diagnostyczny zapytania bez przechowywania prywatnych pól klientów."
    ],
    "check": "Uprawniony pracownik widzi sprawę po nowym logowaniu, a nieuprawniony nie może odczytać jej nawet przez bezpośrednie API.",
    "warning": "Nie przekazuj service_role do kodu frontendowego. Klucz ten omija standardowe zasady RLS.",
    "source": "https://supabase.com/docs/guides/database/postgres/row-level-security"
  },
  {
    "slug": "supabase-upsert-conflict-unique",
    "title": "Supabase upsert nie działa: ON CONFLICT i brak UNIQUE",
    "description": "Błędy upsert w Supabase: klucz unikalny, onConflict, konflikty danych i powtórzone webhooki.",
    "symptom": "Integracja miała aktualizować istniejący kontakt, ale tworzy duplikat albo zwraca błąd konfliktu.",
    "cause": "Upsert potrzebuje jednoznacznego klucza konfliktu zgodnego z ograniczeniem PRIMARY KEY lub UNIQUE. Samo pole e-mail bez właściwego indeksu nie gwarantuje poprawnego zachowania.",
    "steps": [
      "Ustal stabilny identyfikator zdarzenia lub zewnętrznego rekordu, a nie wyłącznie nazwisko lub telefon.",
      "Dodaj odpowiedni unikalny indeks w bazie, po uprzednim bezpiecznym uporządkowaniu istniejących duplikatów.",
      "W zapytaniu upsert wskaż onConflict zgodny z indeksem.",
      "Sprawdź jednoczesne dostarczenie dwóch identycznych webhooków i zachowanie przy błędzie sieci.",
      "Oddziel deduplikację zdarzeń od łączenia kilku autentycznych zgłoszeń tej samej osoby."
    ],
    "check": "Dwukrotne przetworzenie tego samego zdarzenia nie tworzy podwójnego wpisu ani kolejnego powiadomienia.",
    "warning": "Unikalność po samym numerze telefonu może skleić różne osoby lub dwa odrębne zgłoszenia. Projektuj klucz zgodnie z definicją zdarzenia.",
    "source": "https://www.postgresql.org/docs/current/sql-insert.html"
  },
  {
    "slug": "supabase-realtime-nie-odswieza-listy",
    "title": "Supabase Realtime nie aktualizuje listy bez odświeżenia",
    "description": "Zmiany w bazie nie pojawiają się w React? Sprawdź publikację tabeli, subskrypcję, filtry i RLS.",
    "symptom": "Drugi użytkownik zmienia status lub przypisanie, ale otwarta karta CRM nadal wyświetla poprzednie dane.",
    "cause": "Aplikacja może nie mieć aktywnej subskrypcji Realtime, subskrybować niewłaściwą tabelę lub nie odświeżać zapytania po zdarzeniu.",
    "steps": [
      "Potwierdź, że bezpośredni ponowny SELECT pobiera nowe dane. To odróżnia problem Realtime od problemu zapisu.",
      "Zweryfikuj konfigurację publikacji tabeli i uprawnienia do odbioru zdarzeń.",
      "Zapisuj stany połączenia subskrypcji i obsługuj rozłączenie oraz ponowne połączenie.",
      "Po zdarzeniu aktualizuj stan lokalny albo ponawiaj bezpiecznie zapytanie listy.",
      "Przetestuj otwarte dwie sesje, utratę sieci i zmianę roli przy ponownym logowaniu."
    ],
    "check": "Zmiana wykonana w pierwszej sesji jest widoczna w drugiej bez ręcznego przeładowania, również po odzyskaniu połączenia.",
    "warning": "Nie traktuj Realtime jako źródła prawdy. Po dłuższej przerwie pobierz aktualny stan z bazy.",
    "source": "https://supabase.com/docs/guides/realtime"
  },
  {
    "slug": "supabase-sesja-wygasla-po-wznowieniu",
    "title": "CRM wylogowuje po czasie: Supabase session expired",
    "description": "Wygaśnięta sesja po wznowieniu telefonu lub PWA. Refresh token, obsługa 401 i powrót do logowania.",
    "symptom": "Po kilku godzinach lub wznowieniu karty CRM żąda ponownego logowania, choć wcześniej działał.",
    "cause": "Access token ma ograniczony czas życia, a aplikacja musi prawidłowo odnawiać sesję i reagować na jej brak. Problem mogą nasilać różne zakładki oraz nieprawidłowa konfiguracja klienta.",
    "steps": [
      "Odtwórz problem po uśpieniu aplikacji i zapisz dokładny komunikat auth, bez logowania tokenów.",
      "Zweryfikuj, czy klient Supabase korzysta z obsługi odświeżania sesji zgodnej z platformą.",
      "Obsłuż wygaśnięcie bez wyświetlania pustej listy, którą można pomylić z utratą leadów.",
      "Po odnowieniu uwierzytelnienia ponownie pobierz profil, rolę i listę uprawnionych danych.",
      "Przetestuj wylogowanie, równoległe karty i zmianę hasła, pamiętając o unieważnianiu sesji."
    ],
    "check": "Po odzyskaniu aktywnej sesji dane pojawiają się normalnie; przy rzeczywiście nieważnej sesji użytkownik trafia do logowania bez ujawniania danych.",
    "warning": "Nie obchodź problemu przez bardzo długie tokeny lub trzymanie kluczy administracyjnych w przeglądarce.",
    "source": "https://supabase.com/docs/guides/auth/sessions"
  },
  {
    "slug": "supabase-storage-403-zdjecia",
    "title": "Supabase Storage 403: plik jest, ale zdjęcie się nie otwiera",
    "description": "Błąd 403 przy zdjęciach i załącznikach Supabase Storage. Bucket, signed URL i polityki dostępu.",
    "symptom": "Plik został wysłany do magazynu, lecz po kliknięciu pojawia się 403, 404 albo brak podglądu.",
    "cause": "Prawa wysyłania i pobierania pliku mogą się różnić. Prywatny bucket wymaga autoryzowanego pobrania lub krótkotrwałego podpisanego URL.",
    "steps": [
      "Potwierdź ścieżkę obiektu i dokładną nazwę bucketa, uwzględniając wielkość liter.",
      "Sprawdź, czy bucket jest publiczny czy prywatny; dokumenty klientów powinny zwykle pozostać prywatne.",
      "Skontroluj polityki dostępu do storage.objects i kontekst uwierzytelnionego użytkownika.",
      "Dla prywatnych plików generuj signed URL po autoryzacji, z rozsądnym terminem wygaśnięcia.",
      "Dodaj komunikat rozróżniający brak pliku od braku uprawnienia i sprawdź odnowienie linku."
    ],
    "check": "Uprawniony użytkownik otwiera plik, nieuprawniony nie; po wygaśnięciu podpisu aplikacja potrafi bezpiecznie wygenerować nowy.",
    "warning": "Ustawienie publicznego bucketa, żeby zniknął błąd 403, może ujawnić dokumenty klientów.",
    "source": "https://supabase.com/docs/guides/storage/security/access-control"
  },
  {
    "slug": "crm-pwa-powiadomienia-nie-przychodza",
    "title": "Powiadomienia PWA nie przychodzą na telefon — CRM i Web Push",
    "description": "Brak push w aplikacji PWA? Sprawdź zgody, service worker, token subskrypcji i zachowanie iOS.",
    "symptom": "CRM działa w przeglądarce, ale handlowiec nie dostaje powiadomień o nowych zadaniach lub oddzwonieniach.",
    "cause": "Web Push wymaga obsługi przez przeglądarkę, zgody, poprawnej subskrypcji oraz dostarczenia wiadomości przez serwer. Na iOS sposób uruchomienia i instalacji PWA ma znaczenie.",
    "steps": [
      "Sprawdź urządzenie, system, przeglądarkę i czy aplikacja została dodana do ekranu początkowego, gdy jest to wymagane.",
      "Potwierdź zgodę na powiadomienia dla witryny i uprawnienia systemowe.",
      "Zweryfikuj aktywną rejestrację service workera i poprawność endpointu subskrypcji.",
      "Po stronie serwera sprawdź odpowiedź usługi push, błędy VAPID i usuwanie nieaktualnych subskrypcji.",
      "Wyślij jedno powiadomienie testowe przy zamkniętej i otwartej aplikacji, mierząc nie tylko wysłanie, lecz rzeczywiste dostarczenie."
    ],
    "check": "Na docelowym urządzeniu przychodzi powiadomienie testowe; po kliknięciu otwiera właściwy rekord zgodnie z uprawnieniami.",
    "warning": "Nie wysyłaj w treści powiadomień wrażliwych danych klientów na ekran blokady.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/API/Push_API"
  },
  {
    "slug": "crm-heic-nie-wyswietla-zdjec",
    "title": "Zdjęcia HEIC z iPhone'a nie wyświetlają się w CRM",
    "description": "Dlaczego pliki HEIC działają na iPhonie, ale nie w każdej przeglądarce? Podgląd, konwersja i MIME.",
    "symptom": "Użytkownik dodaje zdjęcie z telefonu i widzi załącznik, ale podgląd jest pusty.",
    "cause": "HEIC nie ma jednakowego wsparcia we wszystkich przeglądarkach. Samo zmienienie rozszerzenia na JPG nie zmienia formatu pliku.",
    "steps": [
      "Sprawdź nagłówek Content-Type i rzeczywisty format na podstawie zawartości pliku.",
      "Rozdziel przechowywanie oryginału od generowania miniaturki do podglądu.",
      "Dla przeglądarek bez wsparcia konwertuj plik na JPEG lub WebP po stronie zaufanej usługi albo przy przesyłaniu.",
      "Ogranicz maksymalny rozmiar pliku, usuń niepotrzebne metadane lokalizacji i obsłuż błędy konwersji.",
      "Przetestuj podgląd na iOS Safari, Android Chrome oraz desktopie i pozwól pobrać oryginał."
    ],
    "check": "Po uploadzie użytkownik widzi miniaturkę, a załącznik zachowuje prawidłowy typ; błąd nie skutkuje utratą pliku.",
    "warning": "Nie traktuj samego rozszerzenia pliku jako wiarygodnej walidacji bezpieczeństwa.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types"
  },
  {
    "slug": "crm-termin-montazu-nie-widoczny",
    "title": "Termin montażu jest w CRM, ale handlowiec go nie widzi",
    "description": "Jak oddzielić uprawnienia do umowy, harmonogramu i pól montażowych bez ukrywania potrzebnych dat.",
    "symptom": "Administrator ustawia termin realizacji, lecz osoba prowadząca klienta nie widzi aktualnej daty.",
    "cause": "Reguły ukrywania pól często są zbyt szerokie: cały panel realizacji schowany przed handlowcem ukrywa też informację, której potrzebuje.",
    "steps": [
      "Spisz, które pola są wyłącznie administracyjne, a które handlowiec powinien mieć tylko do odczytu.",
      "Sprawdź, czy data pochodzi z tego samego rekordu lub powiązania, które aktualizuje administrator.",
      "Wydziel odczyt daty od możliwości jej edycji; ukrycie przycisku nie może być jedyną blokadą zapisu.",
      "Zweryfikuj prawa SELECT oraz UPDATE na serwerze i zakres danych zwracanych w API.",
      "Przetestuj zmianę daty, anulowanie i powiadomienie handlowca o aktualizacji."
    ],
    "check": "Handlowiec widzi aktualną datę bez dostępu do ukrytych checkboxów administracyjnych i bez możliwości nieautoryzowanej edycji.",
    "warning": "Nie kopiuj terminu do drugiego ręcznie aktualizowanego pola, bo szybko powstaną rozbieżności.",
    "source": "https://supabase.com/docs/guides/database/postgres/row-level-security"
  },
  {
    "slug": "crm-rezygnacja-archiwum-czy-usuwanie",
    "title": "Rezygnacja klienta w CRM: archiwizować czy usuwać rekord?",
    "description": "Jak zachować historię umów i leadów po rezygnacji, a jednocześnie nie pokazywać ich w aktywnej sprzedaży.",
    "symptom": "Rezygnacje mieszają się z aktywnymi umowami lub znikają bez możliwości późniejszego wyjaśnienia historii.",
    "cause": "Usunięcie rekordu i ustawienie statusu archiwalnego oznaczają zupełnie co innego. Archiwum musi też uwzględniać retencję i zakres uprawnień.",
    "steps": [
      "Zdefiniuj osobny status lub archived_at zamiast fizycznego kasowania rekordów w zwykłym workflow.",
      "Oddziel aktywną listę od archiwum w zapytaniach, ale zachowaj uprawnienia do audytu.",
      "Zapisuj kto, kiedy i z jakiego powodu zmienił status, zgodnie z zasadą minimalizacji danych.",
      "Przetestuj liczniki: aktywne sprawy nie powinny obejmować archiwum, jeśli tak je opisujesz.",
      "Zdefiniuj retencję i procedurę usuwania danych, gdy nie ma podstawy do dalszego przetwarzania."
    ],
    "check": "Rezygnacja nie jest widoczna w bieżącej kolejce handlowca, lecz uprawniony administrator może odnaleźć jej historię.",
    "warning": "Archiwum nie oznacza prawa do bezterminowego przechowywania danych osobowych.",
    "source": "https://gdpr-info.eu/art-5-gdpr/"
  },
  {
    "slug": "crm-kolejka-zadan-spoznia-sie",
    "title": "Kolejka oddzwonień CRM pokazuje zaległe zadania niepoprawnie",
    "description": "Kolejka callbacków ma złą kolejność lub pomija terminy? Strefy czasowe, statusy i sortowanie.",
    "symptom": "Zadanie zaplanowane na dziś trafia na jutro lub znika po zmianie daty, a lista zaległości jest niespójna.",
    "cause": "Mieszanie czasu UTC i czasu lokalnego, brak jednoznacznego statusu zakończenia albo sortowanie dat zapisanych jako tekst powodują błędne kolejki.",
    "steps": [
      "Zapisuj termin jako wartość czasu z jasną strefą czasową, a wyświetlaj w strefie pracownika.",
      "Rozróżnij zadania zaplanowane, zaległe, wykonane i anulowane.",
      "Porównaj filtr daty na serwerze z lokalnym formatowaniem w przeglądarce, zwłaszcza przy zmianie czasu.",
      "Ustal stabilne sortowanie po terminie i ID, nie po napisie wyświetlanym użytkownikowi.",
      "Przetestuj terminy przed północą, po północy i podczas zmiany czasu letniego."
    ],
    "check": "Termin testowy pojawia się o właściwej godzinie na różnych urządzeniach i nie znika po odświeżeniu.",
    "warning": "Nie dodawaj arbitralnie jednej lub dwóch godzin do daty, aby zamaskować błąd stref czasowych.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date"
  },
  {
    "slug": "crm-eksport-leadow-zgody-i-uprawnienia",
    "title": "Eksport leadów z CRM: jak uniknąć braków i wycieku danych?",
    "description": "Bezpieczny eksport CSV/XLSX z CRM z uwzględnieniem uprawnień, filtrów, kodowania i ochrony danych.",
    "symptom": "Eksport pliku obejmuje tylko widoczną stronę rekordów albo umożliwia pobranie danych całej firmy przez zwykłe konto.",
    "cause": "Eksport często jest budowany na danych aktualnie wczytanych do Reacta zamiast na autoryzowanym zapytaniu serwerowym.",
    "steps": [
      "Określ, czy eksport ma obejmować aktywny filtr czy wszystkie uprawnione rekordy.",
      "Weryfikuj rolę i zakres rekordów po stronie serwera przy każdym żądaniu eksportu.",
      "Stronicuj pobieranie danych lub generuj plik strumieniowo, aby nie ucinać wyników.",
      "Usuń pola niewymagane do celu eksportu i neutralizuj formuły w wartościach CSV zaczynających się od znaków specjalnych.",
      "Przetestuj liczbę wierszy, kodowanie polskich znaków i brak cudzych danych w pliku."
    ],
    "check": "Liczba rekordów w eksporcie odpowiada deklarowanemu zakresowi, a rola testowa nie pobierze danych poza swoimi uprawnieniami.",
    "warning": "Nie umieszczaj kompletnego eksportu w publicznym bucketcie ani w logach aplikacji.",
    "source": "https://owasp.org/www-community/attacks/CSV_Injection"
  },
  {
    "slug": "crm-powtorne-przypisanie-tworzy-duplikat",
    "title": "Ponowne przypisanie leada tworzy duplikat — jak znaleźć błąd?",
    "description": "Zamiast aktualizacji opiekuna CRM tworzy drugi rekord. Jak rozdzielić INSERT i UPDATE oraz historię przydziału.",
    "symptom": "Po przeniesieniu klienta między handlowcami powstają dwie podobne pozycje albo dwa zadania telefoniczne.",
    "cause": "Interfejs lub automat może tworzyć nowy lead przy zmianie opiekuna, zamiast aktualizować istniejący rekord i dopisywać zdarzenie historii.",
    "steps": [
      "Porównaj identyfikatory dwóch pozycji. Jeśli są różne, sprawdź ścieżkę tworzenia danych.",
      "Przy zmianie opiekuna wykonuj UPDATE istniejącego leada, a historię zapisuj w osobnej tabeli zdarzeń.",
      "Zablokuj wielokrotne wysyłanie tej samej mutacji przy dwukliku i ponawianiu żądań.",
      "Dodaj test integracyjny przeniesienia między trzema pracownikami.",
      "Kontroluj deduplikację z webhooków niezależnie od mechanizmu ręcznego przydzielania."
    ],
    "check": "Rekord zachowuje to samo ID, a historia pokazuje poprzednich opiekunów bez drugiej kopii klienta.",
    "warning": "Nie usuwaj automatycznie jednego z dwóch wpisów bez sprawdzenia jego komentarzy i historii kontaktu.",
    "source": "https://www.postgresql.org/docs/current/sql-update.html"
  },
  {
    "slug": "crm-google-drive-zalaczniki-token-wygasl",
    "title": "Google Drive w CRM przestał działać: wygasły lub cofnięty token",
    "description": "Załączniki Google Drive nie otwierają się w CRM. Co sprawdzić przy invalid_grant, cofniętym tokenie i OAuth.",
    "symptom": "Po miesiącach działania integracja Dysku nie pobiera ani nie zapisuje plików, choć wcześniej wszystko funkcjonowało.",
    "cause": "Odświeżanie tokenu może nie działać, użytkownik mógł cofnąć zgodę, klient OAuth mógł zmienić konfigurację lub token został unieważniony.",
    "steps": [
      "Odczytaj dokładną odpowiedź API i rozróżnij 401, 403, invalid_grant i brak dostępu do konkretnego folderu.",
      "Sprawdź konfigurację klienta OAuth i zakresy zgody bez ujawniania client_secret.",
      "Ustal, czy refresh token istnieje po stronie serwera i czy mechanizm jego odnowienia działa.",
      "Po cofnięciu uprawnienia przeprowadź ponowną autoryzację konta i zweryfikuj właściciela zasobów.",
      "Dodaj widoczny alert integracji i bezpieczną kolejkę ponowień, zamiast milcząco pomijać pliki."
    ],
    "check": "Testowy dokument trafia do właściwego folderu i daje się otworzyć z uprawnionego konta CRM.",
    "warning": "Nie przechowuj tokenów OAuth w kodzie frontendowym ani w publicznych zmiennych NEXT_PUBLIC.",
    "source": "https://developers.google.com/identity/protocols/oauth2"
  }
] as const;

export const crmProblemGuides = topics.map(topic => ({
  slug: topic.slug, title: topic.title, description: topic.description,
  category: 'CRM i Supabase',
  service: '/crm-i-aplikacje-webowe', serviceLabel: 'CRM i aplikacje webowe',
  intro: topic.symptom,
  sections: [
    {title:'Dlaczego tak się dzieje?', paragraphs:[topic.cause]},
    {title:'Rozwiązanie krok po kroku', paragraphs:topic.steps.map((step, i)=>(i+1)+'. '+step)},
    {title:'Jak sprawdzić wynik?', paragraphs:[topic.check,topic.warning]}
  ],
  sources:[{label:'Dokumentacja i źródło techniczne',url:topic.source}]
}));
