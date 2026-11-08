/**
 * Odrębne poradniki problemowe dla właścicieli firm: redakcyjne scenariusze,
 * nie zamiana słów kluczowych w jednym tekście. Zestaw 1/4.
 */
const entries: string[][] = [
  [
    "jak-zwiekszyc-sprzedaz-w-firmie",
    "Jak zwiększyć sprzedaż w firmie? Zacznij od lejka, nie od reklam",
    "Jeśli firma ma zapytania, ale sprzedaż stoi, dodatkowy budżet reklamowy może tylko powiększyć koszt problemu. Najpierw ustal, na którym etapie tracisz kupujących.",
    "Sprawdź liczbę kontaktów, odsetek rozmów, ofert i podpisanych umów z ostatnich 30–90 dni. Rozdziel źródła kontaktów i porównaj czas odpowiedzi oraz powody odmów.",
    "Wprowadź jeden rejestr leadów, obowiązkowy następny krok po kontakcie i cykliczny przegląd utraconych szans. Dopiero po naprawie najgorszego etapu testuj nowy kanał pozyskiwania klientów.",
    "Co tydzień licz konwersję zapytanie→rozmowa→oferta→sprzedaż oraz koszt pozyskania klienta, nie wyłącznie kliknięcia.",
    "Nie oceniaj handlowców na podstawie samych przychodzących leadów, jeśli jakość ruchu między kampaniami jest różna.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-zdobyc-wiecej-klientow",
    "Jak zdobyć więcej klientów bez przypadkowego zwiększania budżetu?",
    "Więcej klientów nie zawsze wymaga kolejnej reklamy. Część możliwości leży w obecnych odwiedzających, niezrealizowanych wycenach i poleceniach.",
    "Przejrzyj formularze, telefony, porzucone zapytania i powracających klientów. Ustal, ile osób dostało ofertę, ale nikt nie wrócił z odpowiedzią.",
    "Przygotuj prosty system ponownego kontaktu po wycenie, doprecyzuj jedną główną korzyść na stronie i zapytaj dotychczasowych klientów o polecenie. Testuj każdy element osobno.",
    "Porównuj liczbę jakościowych rozmów i umów z podziałem na źródło oraz koszt każdej z nich.",
    "Kupowanie tanich leadów bez procesu obsługi często daje większą liczbę rekordów, ale nie większą sprzedaż.",
    "/marketing-i-reklamy"
  ],
  [
    "dlaczego-firma-nie-ma-klientow",
    "Dlaczego firma nie ma klientów mimo działającej strony i reklam?",
    "Sama obecność w internecie nie oznacza, że oferta trafia do właściwych osób albo zachęca je do kontaktu.",
    "Sprawdź, czy strona pokazuje konkretną usługę, obszar działania, dowody realizacji i widoczny kontakt. Następnie oceń, jakie zapytania uruchamiają reklamy i jakie strony odwiedzają użytkownicy.",
    "Zmień niejasny komunikat na ofertę dla określonego odbiorcy. Usuń tarcie z formularza, popraw zdjęcia i realizacje, a w reklamach oddziel intencję zakupu od ogólnego zainteresowania.",
    "Mierz zapytania kwalifikowane i odsetek osób, które przechodzą od odwiedzin do rozmowy.",
    "Bez danych nie nazywaj problemu SEO: przyczyną może być cena, opinie, obsługa lub produkt.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "firma-ma-obroty-ale-nie-ma-zysku",
    "Firma ma duże obroty, ale mały zysk — co sprawdzić?",
    "Rosnący obrót może maskować słabą marżę, rabaty, koszty obsługi albo drogie pozyskiwanie klienta. Diagnoza wymaga rozdzielenia przychodów i kosztów.",
    "Podziel sprzedaż według usług lub produktów. Dla każdej grupy zbierz cenę netto, koszty bezpośrednie, zwroty, rabaty oraz koszt zdobycia zlecenia; pełną rentowność potwierdź z księgowością.",
    "Wskaż oferty o najniższym wkładzie do pokrycia kosztów, usprawnij ich realizację i popraw politykę rabatową. Jeśli problemem są reklamy, zmień pomiar z kosztu leada na koszt pozyskanego klienta.",
    "Porównuj marżę brutto, koszt pozyskania oraz wynik po kosztach operacyjnych na poziomie całej firmy.",
    "Nie utożsamiaj marży brutto z zyskiem netto ani wpływu na konto z wynikiem księgowym.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-zwiekszyc-marze-w-firmie",
    "Jak zwiększyć marżę w firmie bez podnoszenia cen wszystkim?",
    "Marżę można poprawić także przez lepszą strukturę ofert, ograniczenie niepotrzebnych rabatów i mniej kosztowną obsługę zleceń.",
    "Zestaw pięć najczęściej sprzedawanych usług: cena, koszt wykonania, typowe rabaty, czas zespołu i reklamacje. Sprawdź, które dodatki zużywają dużo czasu, a nie tworzą wartości.",
    "Ustal minimalne progi opłacalności, doprecyzuj zakres pakietów i oddziel płatne prace dodatkowe. Zautomatyzuj powtarzalne czynności tam, gdzie oszczędność jest mierzalna.",
    "Mierz marżę na zleceniu przed i po zmianie oraz liczbę reklamacji i zwrotów.",
    "Podnoszenie marży przez obcinanie jakości może obniżyć utrzymanie klientów i ostatecznie pogorszyć wynik.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "gdzie-firma-traci-pieniadze",
    "Gdzie firma traci pieniądze? Prosty audyt siedmiu obszarów",
    "Nie każda strata jest widoczna w fakturach. Część pieniędzy znika w nieskutecznych reklamach, pominiętych kontaktach i ręcznych poprawkach.",
    "Sprawdź kolejno reklamę, stronę, formularz, kontakt handlowca, ofertowanie, realizację i powracających klientów. W każdym miejscu zapisz objaw, koszt i osobę odpowiedzialną.",
    "Zacznij od dwóch strat o największym wpływie i najłatwiejszym sposobie pomiaru. Przypisz właściciela zmiany i termin ponownej kontroli zamiast równocześnie zmieniać cały system.",
    "Dla każdej poprawki wpisz koszt wdrożenia, wynik bazowy i efekt po 30 dniach.",
    "Nie używaj arbitralnych procentów oszczędności bez dokumentów i porównywalnych okresów.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-zwiekszyc-rentownosc-firmy",
    "Jak zwiększyć rentowność firmy? Działania od sprzedaży po operacje",
    "Rentowność zależy jednocześnie od ceny, kosztu obsługi, jakości klientów i powtarzalności procesu. Samo cięcie marketingu bywa błędem.",
    "Zbierz wynik dla kluczowych usług i kanałów: przychód, koszty zmienne, czas pracy, reklamacje oraz koszt pozyskania. Ustal, czy najbardziej opłacalni klienci pochodzą z poleceń czy reklam.",
    "Przesuń zasoby do rentownych usług, popraw wyceny i usuń niepotrzebne etapy realizacji. Przy dużych odchyleniach zaplanuj osobne analizy rachunkowe z osobą odpowiedzialną za finanse.",
    "Śledź marżę na ofercie i rzeczywisty wkład danego kanału do wyniku operacyjnego.",
    "Wysoka liczba leadów nie oznacza wysokiej rentowności, podobnie jak niska cena kliknięcia.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-obnizyc-koszty-pozyskania-klienta",
    "Jak obniżyć koszt pozyskania klienta (CAC)?",
    "Niski koszt leada bywa złudny, jeśli zgłoszenia nie kończą się sprzedażą. CAC obejmuje koszt zdobycia klienta, a nie samo wypełnienie formularza.",
    "Zsumuj wydatki na dany kanał oraz uzasadnioną część kosztów jego obsługi, a potem podziel przez liczbę nowych klientów w porównywalnym okresie. Sprawdź również wartość zleceń.",
    "Popraw dopasowanie reklam do oferty i jakość strony docelowej. Połącz kampanie z CRM, aby widzieć, które źródło generuje transakcje, a które tylko kontakty.",
    "Porównaj CAC i wartość klienta przy tym samym oknie pomiarowym, z uwzględnieniem opóźnień sprzedaży.",
    "Nie optymalizuj kampanii wyłącznie pod najtańszy formularz, jeżeli powoduje spadek jakości leadów.",
    "/marketing-i-reklamy"
  ],
  [
    "jak-poprawic-konwersje-sprzedazy",
    "Jak poprawić konwersję sprzedaży, gdy leadów nie brakuje?",
    "Jeśli handlowcy otrzymują kontakty, lecz mało z nich zamienia się w umowy, problem może leżeć w czasie reakcji, ofercie lub sposobie prowadzenia rozmowy.",
    "Porównaj wyniki według źródła leadów, handlowca i etapu procesu. Posłuchaj wybranych rozmów za zgodą uczestników lub sprawdź notatki i powody utraty ofert.",
    "Ustal standard pierwszego kontaktu, terminy ponownego oddzwonienia i krótką listę pytań kwalifikujących. Zadbaj o jasne kolejne kroki oraz propozycję wartości dopasowaną do klienta.",
    "Mierz konwersję etapów, średni czas odpowiedzi i liczbę ofert bez decyzji po 14 dniach.",
    "Nie porównuj zespołów bez uwzględnienia różnej jakości kontaktów i wielkości transakcji.",
    "/crm-dla-firm-handlowych"
  ],
  [
    "dlaczego-klienci-nie-odpowiadaja-na-oferty",
    "Dlaczego klienci nie odpowiadają na wysłane oferty?",
    "Milczenie po wycenie nie musi oznaczać zbyt wysokiej ceny. Klient może nie rozumieć zakresu, różnicy względem konkurencji lub kolejnego kroku.",
    "Sprawdź długość oferty, jej czas przygotowania, sposób prezentacji efektu i termin kolejnego kontaktu. Porównaj przypadki, które zakończyły się umową, z pozostałymi.",
    "Przygotuj krótkie podsumowanie problemu i rozwiązania, jasny zakres, warianty oraz datę rozmowy po wysłaniu oferty. Ustal, czy klient potrzebuje pomocy w ocenie opcji.",
    "Monitoruj odsetek odpowiedzi na oferty, czas do decyzji i najczęstszy powód rezygnacji.",
    "Masowe wysyłanie ponagleń bez kontekstu może pogorszyć relację; kontakt powinien mieć uzasadnienie.",
    "/crm-dla-firm-handlowych"
  ],
  [
    "jak-zwiekszyc-sprzedaz-w-malej-firmie",
    "Jak zwiększyć sprzedaż w małej firmie przy niewielkim budżecie?",
    "Mały biznes powinien najpierw wykorzystywać istniejący popyt i poprawiać obsługę, zanim uruchomi kosztowną wielokanałową strategię.",
    "Sprawdź, skąd pochodzi pięciu ostatnich klientów, co pytają przed zakupem i czy łatwo znaleźć odpowiedź na stronie lub w profilu firmy.",
    "Uzupełnij ofertę o konkretne realizacje, ceny lub zasady wyceny, dodaj prosty formularz i proś o opinie po wykonanej usłudze. Następnie testuj jeden kanał ruchu.",
    "Mierz liczbę rozmów i zleceń miesięcznie oraz czas potrzebny na ich obsługę.",
    "Unikaj kupowania wielu abonamentów marketingowych bez planu wykorzystania i analityki.",
    "/marketing-i-reklamy"
  ],
  [
    "jak-odzyskac-utraconych-klientow",
    "Jak odzyskać utraconych klientów i niedokończone wyceny?",
    "Niedokończone zapytania mogą zawierać realny potencjał sprzedażowy, ale ponowny kontakt powinien być przemyślany i zgodny z zasadami komunikacji marketingowej.",
    "W CRM rozdziel osoby, które prosiły o ofertę, klientów z dawnych zleceń i osoby bez zgody na marketing. Zweryfikuj powody przerwania rozmowy.",
    "Przy kontaktach dopuszczalnych prawnie wyślij pomocne przypomnienie odnoszące się do ostatniego ustalenia, zapytaj o zmienione potrzeby i zapisz odpowiedź. Zaproponuj bardziej dopasowany zakres.",
    "Mierz odsetek wznowionych rozmów, liczbę zamkniętych zleceń i zgłoszenia sprzeciwu.",
    "Nie traktuj wcześniejszego kontaktu jako automatycznej zgody na dowolny marketing e-mail lub telefoniczny.",
    "/crm-dla-firm-handlowych"
  ],
  [
    "jak-ustalic-cennik-uslug",
    "Jak ustalić cennik usług, żeby firma nie dopłacała do zleceń?",
    "Cena oparta wyłącznie na stawce konkurencji nie uwzględnia czasu, materiałów, reklamacji i kosztu zdobycia klienta.",
    "Dla reprezentatywnych usług policz koszty bezpośrednie, nakład pracy oraz uzasadnioną część kosztów stałych. Sprawdź, które elementy zakresu powodują przekroczenie budżetu.",
    "Utwórz podstawowe pakiety i osobne pozycje za dodatki. Dla wycen niestandardowych zaplanuj etap zbierania danych, zanim obiecasz cenę.",
    "Monitoruj różnicę między planowanym a rzeczywistym kosztem zlecenia i odsetek ofert zaakceptowanych.",
    "Sam wysoki procent marży nie gwarantuje rentowności, jeśli liczba zleceń nie pokrywa kosztów stałych.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-zrobic-audyt-sprzedazy",
    "Jak zrobić audyt sprzedaży w firmie krok po kroku?",
    "Audyt sprzedaży powinien odpowiedzieć, gdzie tracone są szanse, a nie kończyć się ogólnym stwierdzeniem, że zespół potrzebuje więcej leadów.",
    "Wyeksportuj z CRM lub arkusza kontakty z trzech miesięcy, etapy, daty działań, wartości ofert i przyczyny utraty. Jeśli danych brakuje, ten brak zapisz jako osobny problem.",
    "Rozrysuj proces od pierwszego zapytania do płatności, wskaż wąskie gardła i przetestuj dwie konkretne poprawki: np. szybszy kontakt oraz follow-up po wycenie.",
    "Zapisz metrykę początkową dla każdego etapu i sprawdź zmianę po pełnym cyklu sprzedażowym.",
    "Audyt bez właściciela wdrożenia, dat i sposobu pomiaru staje się dokumentem bez wpływu na wynik.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "dlaczego-sprzedaz-spada",
    "Dlaczego sprzedaż spada? Jak rozpoznać przyczynę",
    "Spadek sprzedaży może wynikać z mniejszej liczby zapytań, gorszej konwersji lub niższej wartości zamówienia. Te problemy wymagają innych działań.",
    "Porównaj analogiczne okresy z uwzględnieniem sezonowości. Rozdziel liczbę zapytań, współczynnik wygranych ofert, średnią wartość transakcji oraz dostępność produktu.",
    "Wybierz jeden główny czynnik spadku. Jeśli zniknął ruch organiczny, zbadaj SEO; jeśli oferty przegrywają, przeanalizuj cenę, zakres i konkurencję; jeśli maleje wartość koszyka, sprawdź miks usług.",
    "Mierz wszystkie trzy składniki osobno i wyznacz datę ponownej oceny.",
    "Nie zmieniaj jednocześnie cen, reklam i strony, bo nie ustalisz, która korekta wpłynęła na wynik.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-sprzedawac-wiecej-stalym-klientom",
    "Jak zwiększyć sprzedaż obecnym klientom bez nachalnej sprzedaży?",
    "Powtórne zamówienia bywają tańsze w obsłudze, ale skuteczna oferta dodatkowa musi wynikać z rzeczywistej potrzeby klienta.",
    "Podziel klientów według zakupionej usługi, terminu kolejnego serwisu, typowych problemów i zgód komunikacyjnych. Sprawdź, które uzupełniające usługi naprawdę poprawiają efekt.",
    "Zaproponuj logiczny kolejny krok, np. opiekę techniczną po uruchomieniu strony lub szkolenie po wdrożeniu CRM. Uwzględnij jasny zakres i możliwość odmowy.",
    "Mierz wartość powracających klientów, powtarzalność zamówień i satysfakcję po realizacji.",
    "Nie sprzedawaj dodatków, które nie tworzą wartości; zwiększają przychód krótkoterminowo, ale pogarszają retencję.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-zbudowac-lejek-sprzedazowy",
    "Jak zbudować lejek sprzedażowy w firmie usługowej?",
    "Lejek nie musi oznaczać skomplikowanego oprogramowania. Wystarczy jasno opisać drogę od zapytania do umowy i odpowiedzialność na każdym etapie.",
    "Spisz aktualne źródła leadów, typowe decyzje klienta i momenty przekazania kontaktu między zespołami. Usuń statusy, które niczego nie wyjaśniają.",
    "Zdefiniuj etapy: nowy kontakt, kwalifikacja, rozmowa, oferta, decyzja, wygrane/przegrane. Dla każdego etapu podaj wymagane działanie i termin następnego kroku.",
    "Analizuj konwersję pomiędzy etapami i liczbę spraw, które utknęły bez daty następnego kontaktu.",
    "Lejek nie powinien być tylko wykresem w CRM: bez aktualizacji przez zespół pokaże nieprawdziwy obraz.",
    "/crm-dla-firm-handlowych"
  ],
  [
    "jak-stworzyc-strategie-rozwoju-firmy",
    "Jak stworzyć strategię rozwoju firmy na 90 dni?",
    "Dobra strategia na kwartał to ograniczona liczba decyzji, a nie lista wszystkich pomysłów właściciela.",
    "Ustal obecny wynik, najrentowniejsze usługi, główne źródła klientów, ograniczenia zasobów i dwa ryzyka. Wybierz maksymalnie trzy cele, które da się realnie zmierzyć.",
    "Dla każdego celu zapisz inicjatywę, właściciela, budżet, miernik i datę kontroli. Zablokuj nowe projekty, jeśli nie wspierają bieżących priorytetów.",
    "Raz w tygodniu sprawdzaj wynik i przeszkody, a po 30 dniach koryguj założenia na podstawie danych.",
    "Plan zakładający jednoczesny wzrost wszystkich usług i kanałów zwykle przeciąża zespół.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-poprawic-obsluge-klienta-w-firmie",
    "Jak poprawić obsługę klienta i nie tracić zapytań?",
    "Klient może odejść nie dlatego, że oferta jest słaba, lecz dlatego, że czekał na odpowiedź lub dostał sprzeczne informacje.",
    "Przetestuj formularz, telefon i wiadomości poza godzinami pracy. Sprawdź, kto przejmuje zgłoszenie, gdzie jest historia rozmowy i jak oznaczana jest sprawa zakończona.",
    "Przygotuj prosty standard odpowiedzi i przekazania sprawy. Ustal godziny kontaktu, automatyczne potwierdzenie otrzymania zgłoszenia oraz monitorowanie nierozwiązanych kontaktów.",
    "Mierz czas pierwszej reakcji, odsetek spraw bez właściciela i udział powracających klientów.",
    "Automatyczna odpowiedź nie zastępuje faktycznej rozmowy z człowiekiem i rozwiązania problemu.",
    "/crm-dla-firm-handlowych"
  ],
  [
    "ile-kosztuje-pozyskanie-klienta",
    "Ile kosztuje pozyskanie klienta i jak to policzyć?",
    "Koszt pozyskania klienta jest zwykle wyższy niż koszt jednego leada, bo nie każde zgłoszenie kończy się zakupem.",
    "Dla określonego okresu i kanału zbierz wydatki reklamowe, prowizje i inne istotne koszty pozyskania, a następnie policz liczbę nowych klientów. Zadbaj o spójne zasady przypisania źródła.",
    "Podziel koszt pozyskania przez liczbę klientów i porównaj z marżą na transakcji lub wartością relacji w czasie. Przy długim procesie sprzedaży zastosuj odpowiednią kohortę.",
    "Analizuj CAC osobno dla kanałów, typów klientów i okresów, z uwzględnieniem zwrotów.",
    "Nie dziel kosztu kampanii przez wszystkie przychodzące wiadomości i nie nazywaj wyniku CAC.",
    "/marketing-i-reklamy"
  ],
  [
    "jak-ustalic-kpi-w-firmie",
    "Jakie KPI mierzyć w małej firmie, żeby nie tonąć w raportach?",
    "Dziesiątki wykresów nie poprawiają decyzji, jeśli nikt nie wie, który wynik wymaga reakcji.",
    "Wypisz trzy główne cele firmy i powiąż je z liczbą zapytań, konwersją, marżą, czasem obsługi lub terminowością. Zaznacz wskaźniki, na które zespół realnie ma wpływ.",
    "Wybierz pięć do ośmiu KPI, ustal właściciela danych i częstotliwość kontroli. Zbuduj prosty dashboard z wartościami obecnymi i trendem zamiast raportu pełnego liczb bez kontekstu.",
    "Co tydzień zapisuj podjętą decyzję i sprawdzaj, czy wynikała z konkretnej metryki.",
    "Nie nagradzaj ilości działań bez sprawdzania ich jakości; liczba telefonów nie jest sama w sobie sprzedażą.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-obliczyc-konwersje-leadow",
    "Jak obliczyć konwersję leadów na sprzedaż?",
    "Bez określenia etapów i okresu pomiaru procent konwersji może wyglądać korzystnie, choć wiele szans nadal pozostaje otwartych.",
    "Zdefiniuj, co uznajesz za lead, rozmowę, ofertę i wygraną transakcję. Pracuj na tej samej grupie zapytań z odpowiednio długim czasem do zamknięcia.",
    "Podziel liczbę wygranych szans przez liczbę zakwalifikowanych leadów z tej grupy. Oblicz osobno konwersję kolejnych etapów, żeby znaleźć konkretne wąskie gardło.",
    "Śledź trend dla kohort i źródeł leadów, a nie tylko jedną miesięczną wartość.",
    "Nie porównuj świeżych leadów z zeszłego tygodnia z transakcjami pochodzącymi z ubiegłego kwartału bez korekty.",
    "/crm-dla-firm-handlowych"
  ],
  [
    "jak-zwiekszyc-srednia-wartosc-zamowienia",
    "Jak zwiększyć średnią wartość zamówienia w firmie usługowej?",
    "Wyższa wartość zamówienia ma sens, gdy klient dostaje dopasowaną usługę, a firma zachowuje marżę.",
    "Przeanalizuj najczęstsze pakiety i dodatki, które klienci kupują razem. Oceń, czy łatwo zrozumieć różnicę między wariantami oferty.",
    "Przygotuj dwa lub trzy czytelne zakresy usługi i przedstaw korzyści opcji wyższej. Dodawaj elementy tylko wtedy, gdy odpowiadają na zgłoszoną potrzebę.",
    "Mierz średnią wartość transakcji, marżę oraz odsetek reklamacji i ponownych zakupów.",
    "Podnoszenie średniej wartości koszyka przez niepotrzebne dodatki może obniżać zaufanie i liczbę zamówień.",
    "/zewnetrzny-dyrektor"
  ],
  [
    "jak-zrobic-plan-marketingowy-dla-firmy",
    "Jak zrobić plan marketingowy dla firmy bez dużego działu?",
    "Plan marketingowy powinien wynikać z tego, jaki klient jest opłacalny i jak podejmuje decyzję, nie z potrzeby obecności na każdej platformie.",
    "Opisz dwie grupy klientów, ich problemy, dostępny budżet i czas potrzebny do sprzedaży. Sprawdź, z jakich kanałów pojawiły się ostatnie dobre zapytania.",
    "Wybierz jedną ofertę, jedną stronę docelową i maksymalnie dwa kanały do testów. Ustal treści, częstotliwość, odpowiedzialność i pomiar kontaktów.",
    "Co 30 dni porównuj jakość leadów, koszt rozmowy i koszt podpisanej umowy.",
    "Nie rozpisuj dziesiątek postów bez pomysłu, jak użytkownik przejdzie z treści do konkretnej oferty.",
    "/marketing-i-reklamy"
  ],
  [
    "marketing-firmy-nie-przynosi-efektow",
    "Marketing firmy nie przynosi efektów — co robić zamiast przepalać budżet?",
    "Wynik marketingu nie kończy się na kliknięciu. Problem może wystąpić w reklamie, ofercie, stronie lub dalszej obsłudze.",
    "Rozdziel dane na zasięg, wejścia, formularze, rozmowy i transakcje. Sprawdź również, czy zdarzenia konwersji są poprawnie mierzone i czy firma odbiera telefony.",
    "Napraw pierwszy udokumentowany punkt utraty potencjalnego klienta. Przy małym budżecie wstrzymaj eksperymenty o niejasnym celu i skup środki na kontrolowanym teście.",
    "Oceniaj liczbę sensownych zapytań oraz sprzedaż przy porównywalnym nakładzie, nie samo ROAS zgłaszane przez platformę.",
    "Nie przypisuj każdej zmiany wyniku jednej kampanii, jeśli równocześnie zmieniły się ceny, sezon i proces sprzedaży.",
    "/zewnetrzny-dyrektor"
  ]
];

export const businessGrowthGuidesOne = entries.map(([slug,title,intro,diagnosis,action,measurement,pitfall,service]) => ({
  slug, title, description: intro.slice(0,155), intro,
  service, serviceLabel: service === "/crm-dla-firm-handlowych" ? "CRM i procesy sprzedaży" : service === "/marketing-i-reklamy" ? "Marketing i reklamy" : "Partner w rozwoju biznesu",
  category: "rozwoj-firmy" as const,
  sections: [
    { title:"Co najpierw sprawdzić", paragraphs:[diagnosis] },
    { title:"Co konkretnie zmienić", paragraphs:[action] },
    { title:"Jak zmierzyć poprawę", paragraphs:[measurement] },
    { title:"Najczęstszy błąd", paragraphs:[pitfall] }
  ]
}));
