/**
 * Redakcyjne poradniki o reklamach Google, usługach cyfrowych i wdrożeniach.
 * Nie zawierają sztucznych wyników klientów, gwarantowanych CPC ani deklaracji certyfikacji.
 */
const items = [
  {
    slug: "google-ads-nie-dziala-co-sprawdzic",
    title: "Google Ads nie działa — jak zdiagnozować kampanię krok po kroku?",
    description: "Reklamy Google Ads nie działają? Sprawdź emisję, rozliczenia, odrzucenia, słowa kluczowe, landing page oraz pomiar konwersji.",
    intro: "„Google Ads nie działa” może oznaczać dwa różne problemy: brak wyświetleń albo wydatki bez klientów. Każdy wymaga innej diagnostyki. Nie zwiększaj budżetu, dopóki nie wiesz, co faktycznie się dzieje.",
    sections: [
      {title:"Krok 1. Ustal, czy reklamy w ogóle się wyświetlają",paragraphs:["Sprawdź status konta, kampanii, grup i reklam, okres raportowania, daty harmonogramu, rozliczenia, ograniczenia budżetu i polityki reklamowe. Porównaj wyświetlenia z poprzednim równoważnym okresem.", "Jeżeli reklama jest odrzucona, przeczytaj dokładne uzasadnienie. Nie rozwiązuj problemu przez tworzenie nowych kont na obejście ograniczeń."]},
      {title:"Krok 2. Sprawdź zapytania i obszar emisji",paragraphs:["Otwórz raport wyszukiwanych haseł, przejrzyj dopasowanie słów oraz wykluczenia. Zobacz, czy budżet nie wydaje się na zapytania niezwiązane z ofertą lub regionem obsługi.", "Sprawdź ustawienia lokalizacji — samo wpisanie miasta w nazwie kampanii nie oznacza, że system precyzyjnie ogranicza emisję do tego miasta."]},
      {title:"Krok 3. Przetestuj ścieżkę konwersji",paragraphs:["Otwórz stronę z reklamy na telefonie i wyślij testowy formularz. Zweryfikuj, czy wiadomość dociera do właściwej skrzynki lub CRM i czy w raporcie konwersji widać odpowiednią akcję.", "Nie traktuj każdego kliknięcia jako leada. Telefon może nie zostać odebrany, formularz może być uszkodzony, a pomiar może dublować działania."]},
      {title:"Krok 4. Napraw konkretny problem i porównaj wynik",paragraphs:["Zapisz dzień i treść zmiany, a następnie porównuj podobne okresy i te same cele. Przy małej liczbie konwersji nie podejmuj decyzji na podstawie jednego zapytania.", "Jeżeli nie potrafisz stwierdzić, co jest konwersją, zacznij od audytu pomiaru. Sam wzrost liczby kliknięć nie jest dowodem, że firma pozyskuje więcej klientów."]},
    ],
    sources:[{label:"Pomiar konwersji Google Ads",url:"https://support.google.com/google-ads/answer/1722022"},{label:"Raport wyszukiwanych haseł",url:"https://support.google.com/google-ads/answer/2472708"}],
  },
  {
    slug:"google-ads-brak-konwersji",
    title:"Google Ads ma kliknięcia, ale nie ma konwersji — co poprawić?",
    description:"Google Ads wydaje budżet bez leadów? Sprawdź jakość zapytań, ofertę, formularz, mobilny landing page i konfigurację konwersji.",
    intro:"Gdy kampania ma kliknięcia, ale konwersji jest zero, problem może leżeć w ruchu, stronie, ofercie albo analityce. Rozdziel te przyczyny zanim zmienisz stawki.",
    sections:[
      {title:"Sprawdź, czy pomiar jest rzeczywiście poprawny",paragraphs:["Ustal, które działania oznaczono jako konwersje główne. Zweryfikuj tag, zdarzenie formularza i sposób liczenia powtórzonych działań; wykonaj kontrolowany test.", "Jeżeli formularz wysyła wiadomości, ale raport pokazuje zero, podejrzenie powinno paść na pomiar, a nie od razu na kreacje reklamowe."]},
      {title:"Prześledź jakość wejść",paragraphs:["Porównaj wyszukiwane hasła z faktyczną ofertą. Jeśli firma sprzedaje płatną usługę, ogólne hasła edukacyjne mogą dawać ruch bez zakupów.", "Sprawdź lokalizację kampanii oraz urządzenia. Dobre liczby kliknięć nie gwarantują obecności klientów docelowych."]},
      {title:"Zbadaj formularz i stronę docelową",paragraphs:["Sprawdź na telefonie czy nagłówek odpowiada treści reklamy, formularz się wysyła, a przyciski nie są zasłonięte. Porównaj czas ładowania i liczbę pól z rzeczywistą potrzebą kwalifikacji.", "Test powinien zakończyć się otrzymaniem zgłoszenia po stronie handlowca, a nie jedynie komunikatem „wysłano”."]},
      {title:"Zmierz prawdziwe wyniki",paragraphs:["Spisuj koszt kliknięć, liczbę potwierdzonych leadów, koszt wartościowego kontaktu oraz liczbę złożonych ofert. Dopiero po tym rozważ optymalizację budżetu lub słów.", "Możesz skorzystać z darmowego kalkulatora budżetu na bernecki.dev, pamiętając, że to symulacja oparta na podanych założeniach."]},
    ],
    sources:[{label:"Google Ads — konwersje",url:"https://support.google.com/google-ads/answer/1722022"}],
  },
  {
    slug:"ile-kosztuje-reklama-google-ads",
    title:"Ile kosztuje reklama w Google Ads? Budżet, CPC i koszt pozyskania leada",
    description:"Ile kosztują reklamy w Google? Wyjaśniamy budżet Google Ads, CPC, konwersję strony, opłatę za obsługę i kalkulację kosztu klienta.",
    intro:"Nie istnieje jedna uczciwa stawka CPC dla wszystkich branż i miast. Koszt zależy od konkurencji o dane zapytanie, jakości kampanii, budżetu, strony oraz tego, co liczysz jako wynik.",
    sections:[
      {title:"Budżet reklamowy a koszt obsługi",paragraphs:["Kwota wpłacana do Google służy zakupowi emisji i kliknięć. Osobno możesz płacić za przygotowanie oraz prowadzenie kampanii, treści, zdjęcia, landing page czy integrację z CRM.", "Pytaj o oba elementy wyceny. Łączenie ich bez rozdzielenia zaciemnia ocenę efektywności."]},
      {title:"Jak policzyć szacunkową liczbę leadów",paragraphs:["Przyjmij hipotetycznie budżet 1 500 zł, koszt kliknięcia 5 zł i konwersję strony 4%. Daje to około 300 kliknięć i 12 leadów, czyli 125 zł za lead. To wyłącznie arytmetyczny przykład, nie prognoza rynkowa.", "Wynik zależy od tego, ilu użytkowników rzeczywiście wypełni formularz i czy zgłoszenia są wartościowe. Jeżeli konwersja spadnie o połowę, koszt leada może wzrosnąć dwukrotnie."]},
      {title:"Co sprawdzić przed zwiększeniem budżetu",paragraphs:["Oceń zapytania, lokalizacje i wykluczenia. Zmierz odsetek kwalifikowanych leadów i częstotliwość finalizacji sprzedaży. Zastanów się, ile firma może wydać na pozyskanie klienta przy danej marży.", "Mała firma nie musi rywalizować z większym konkurentem na każde możliwe hasło. Często lepiej wybrać węższy zestaw zapytań."]},
      {title:"Użyj kalkulatora z własnymi założeniami",paragraphs:["Na bernecki.dev dostępny jest darmowy kalkulator budżetu Google Ads z polami budżetu, CPC i konwersji strony. Wpisz własne szacunki, zamiast używać niepotwierdzonych średnich rynkowych.", "Weryfikuj założenia na faktycznych danych konta, a gdy ich brakuje, traktuj kalkulację tylko jako scenariusz."]},
    ],
    sources:[{label:"Google Ads — pomiar konwersji",url:"https://support.google.com/google-ads/answer/1722022"}],
  },
  {
    slug:"google-ads-czy-meta-ads",
    title:"Google Ads czy Meta Ads — co wybrać dla firmy usługowej?",
    description:"Google Ads vs Facebook i Instagram Ads: różnice w intencji, budżecie, kreacjach, jakości leadów i zastosowaniu dla usług.",
    intro:"W Google klient często sam wpisuje problem i aktywnie szuka rozwiązania. W Meta częściej docierasz do odbiorcy podczas przeglądania treści. To odmienne sytuacje zakupowe, nie dwa zamienne przyciski do pozyskiwania klientów.",
    sections:[
      {title:"Kiedy Google Ads ma przewagę",paragraphs:["Gdy popyt jest wyrażony konkretnymi zapytaniami, takimi jak nazwa usługi, awaria czy szybka wycena. Kampania wyszukiwania pozwala porządkować zapytania i kierować do dopasowanych stron.", "Przy bardzo małym wolumenie wyszukiwań Google Ads może nie zapewnić wystarczającej liczby kontaktów."]},
      {title:"Kiedy wybrać Meta Ads",paragraphs:["Jeśli ofertę łatwiej pokazać obrazem, wideo, realizacją lub historią klienta, Facebook i Instagram mogą generować zainteresowanie przed rozpoczęciem aktywnego szukania.", "Ważne są kreacje i kwalifikacja zgłoszeń, bo tani formularz bywa słabym leadem."]},
      {title:"Porównuj koszt klienta, nie popularność kanału",paragraphs:["Dla obu kanałów zdefiniuj te same etapy: zgłoszenie, kontakt, oferta i sprzedaż. Porównuj całkowity koszt oraz marżę pozyskanego klienta, pamiętając o opóźnieniu sprzedaży.", "Przy niewielkim budżecie warto najpierw uruchomić jeden dobrze mierzony kanał, zamiast dzielić wydatki na wiele nieprzetestowanych kampanii."]},
      {title:"Kiedy warto połączyć kampanie",paragraphs:["Jeśli firma umie szybko obsługiwać leady i ma sprawny pomiar, możesz łączyć reklamy wyszukiwania z kampaniami budującymi popyt. Zadbaj o wyraźnie odrębne cele i nie przypisuj jednej sprzedaży podwójnie bez analizy atrybucji."]},
    ],
    sources:[{label:"Google Ads — reklamy w wyszukiwarce",url:"https://support.google.com/google-ads/answer/1704371"},{label:"Meta Business Help",url:"https://www.facebook.com/business/help"}],
  },
  {
    slug:"jak-dobrac-slowa-kluczowe-google-ads",
    title:"Jak dobrać słowa kluczowe w Google Ads i nie przepalać budżetu?",
    description:"Dobór słów kluczowych Google Ads dla firmy usługowej: intencja zakupu, dopasowania, lokalizacje, grupy reklam i raport wyszukiwanych haseł.",
    intro:"Słowo kluczowe ma odpowiadać sposobowi, w jaki klient szuka Twojej usługi, a nie tylko temu, jak firma opisuje się wewnętrznie.",
    sections:[
      {title:"Zacznij od konkretnych usług i intencji",paragraphs:["Wypisz główne usługi oraz pytania klientów przed zakupem. Oddziel zapytania „chcę zamówić” od edukacyjnych „jak zrobić samodzielnie”. Przy małym budżecie skup się na węższych, wartościowych hasłach.", "Nie kopiuj bezrefleksyjnie listy słów konkurencji — inna firma może mieć inną marżę, zasięg i produkty."]},
      {title:"Buduj grupy tematyczne",paragraphs:["Rozdziel kampanie lub grupy według wyraźnych kategorii usług, a nie przypadkowej liczby słów. Tekst reklamy i strona docelowa powinny odpowiadać wyszukiwaniu.", "Zwróć uwagę na dopasowanie ścisłe, do wyrażenia i przybliżone. Każde ma inne ryzyko emisji na mniej dokładne zapytania."]},
      {title:"Kontroluj raport wyszukiwanych haseł",paragraphs:["Regularnie przeglądaj, jakie zapytania realnie uruchomiły reklamę. Odrzucaj tematy związane z pracą, darmowymi poradnikami lub nieobsługiwanymi usługami, jeśli nie mają wartości.", "Zmieniaj wykluczenia ostrożnie: zbyt szerokie może odciąć również wartościowych odbiorców."]},
      {title:"Oceń wynik po jakości leadów",paragraphs:["Słowo z wyższym CPC może być opłacalne, jeśli prowadzi do wartościowych zleceń. Porównuj faktyczne zgłoszenia i sprzedaż, nie wyłącznie liczbę kliknięć.", "Dane z CRM pozwalają powiązać intencję i koszty z późniejszym wynikiem handlowym."]},
    ],
    sources:[{label:"Google Ads — słowa kluczowe",url:"https://support.google.com/google-ads/answer/1704371"},{label:"Google Ads — optymalizacja słów",url:"https://support.google.com/google-ads/answer/6238816"}],
  },
  {
    slug:"wykluczajace-slowa-kluczowe-google-ads",
    title:"Wykluczające słowa kluczowe Google Ads — jak je ustawić?",
    description:"Lista słów wykluczających w Google Ads: dopasowania, raport wyszukiwanych haseł, typowe pomyłki i ochrona budżetu kampanii.",
    intro:"Wykluczające słowa kluczowe pomagają ograniczyć reklamy dla użytkowników, którzy szukają czegoś innego niż Twoja oferta. To ważniejsze niż ślepe dodawanie kolejnych ogólnych haseł.",
    sections:[
      {title:"Skąd wziąć dobre wykluczenia",paragraphs:["Sprawdź raport wyszukiwanych haseł i zaznacz zapytania niepasujące do sprzedawanych usług. Typowe przykłady to poszukiwanie pracy, instrukcji bezpłatnej lub produktu, którego firma nie oferuje. Nie kopiuj jednak gotowej listy bez sprawdzenia własnej branży.", "Weryfikuj, czy zapytania wykluczane są rzeczywiście niekomercyjne."]},
      {title:"Dopasowania negatywnych słów działają inaczej",paragraphs:["Wykluczenia przybliżone, do wyrażenia i ścisłe różnią się logiką dopasowania. Nie działają identycznie jak pozytywne słowa kluczowe i nie obejmują automatycznie wszystkich wariantów.", "Przed zapisaniem dużej listy sprawdź, czy nie blokuje ona nazw wartościowych usług."]},
      {title:"Poziom konta, kampanii czy grupy reklam?",paragraphs:["Wykluczenia wspólne dla biznesu możesz stosować szerzej, a te specyficzne dla oferty — w odpowiednim obszarze konta. Zadbaj o opis list i dokumentację zmian.", "Jeśli kampania obsługuje kilka usług, nadmierne wykluczenia mogą niechcący ograniczyć wzajemnie powiązane zapytania."]},
      {title:"Jak ocenić poprawę",paragraphs:["Porównaj proporcję zapytań niepasujących do oferty, koszt wartościowego kontaktu i liczbę zgłoszeń. Zmiana może zmniejszyć liczbę kliknięć, a zwiększyć ich przydatność.", "Wynik oceniaj na porównywalnych okresach, nie po pojedynczym dniu."]},
    ],
    sources:[{label:"Google Ads — negative keywords",url:"https://support.google.com/google-ads/answer/2453972"},{label:"Google Ads — search terms report",url:"https://support.google.com/google-ads/answer/7102466"}],
  },
  {
    slug:"google-ads-nie-wyswietla-reklam",
    title:"Google Ads nie wyświetla reklam — diagnostyka statusu i rozliczeń",
    description:"Google Ads pokazuje 0 wyświetleń? Sprawdź ograniczenia konta, budżet, harmonogram, status reklamy, słowa kluczowe i lokalizację.",
    intro:"Zero wyświetleń to problem inny niż zero konwersji. Najpierw sprawdź, czy reklamy kwalifikują się do emisji i czy w wybranym okresie istnieje popyt na wybrane hasła.",
    sections:[
      {title:"Statusy konta, kampanii i reklam",paragraphs:["Zobacz powiadomienia rozliczeniowe i status polityk reklamowych. Sprawdź przełączniki kampanii, grup reklam i poszczególnych materiałów oraz ewentualne ograniczenia konta.", "Jeśli reklama jest weryfikowana albo odrzucona, otwórz szczegóły zamiast zakładać, że potrzebuje większego budżetu."]},
      {title:"Harmonogram i ustawienia lokalizacji",paragraphs:["Porównaj bieżący czas i strefę konta z zaplanowanymi godzinami emisji. Skontroluj lokalizacje i język, żeby nie ograniczyć przypadkiem docelowej grupy do zbyt wąskiego segmentu.", "Sprawdź też, czy daty końca kampanii nie minęły."]},
      {title:"Słowa kluczowe i wykluczenia",paragraphs:["Zbyt wąski dobór zapytań, słowa o bardzo niskiej liczbie wyszukiwań oraz nieprzemyślane wykluczenia mogą ograniczać liczbę potencjalnych emisji.", "Najpierw sprawdź powody statusu konkretnych słów i poziom wyświetleń, dopiero później dostosowuj dopasowanie."]},
      {title:"Weryfikacja po naprawie",paragraphs:["Zapisz zmianę i sprawdź wyświetlenia w porównywalnym okresie. Jeśli reklama emituje się prawidłowo, dopiero wtedy przejdź do kontroli kliknięć i konwersji."]},
    ],
    sources:[{label:"Google Ads — centrum pomocy",url:"https://support.google.com/google-ads/"}],
  },
  {
    slug:"audyt-google-ads-checklista",
    title:"Audyt Google Ads — checklista przed kolejnym zwiększeniem budżetu",
    description:"Checklista audytu Google Ads: koszt konwersji, słowa, wykluczenia, strona docelowa, rozliczenia, lokalizacja i CRM.",
    intro:"Dobry audyt Google Ads nie polega na ocenianiu konta po jednym wskaźniku. Najważniejsze jest to, czy kampania pozyskuje odpowiednich klientów po koszcie akceptowalnym dla firmy.",
    sections:[
      {title:"Cel i model ekonomiczny",paragraphs:["Ustal, czym jest konwersja w systemie i czym jest wartościowy klient dla firmy. Przyjrzyj się marży, częstotliwości zakupów i czasowi od leada do sprzedaży.", "Przy porównywaniu kampanii rozdziel koszt Google i opłatę za prowadzenie konta."]},
      {title:"Struktura kampanii i słowa",paragraphs:["Przejrzyj oddzielenie głównych usług, typy dopasowania, zapytania, wykluczenia, urządzenia, regiony i harmonogram. Czy największy wydatek dotyczy zapytań przynoszących wartościowe zgłoszenia?", "Zapisz zmiany, które mogły zresetować uczenie strategii stawek."]},
      {title:"Strona, formularz i dane",paragraphs:["Przeprowadź próbny kontakt od kliknięcia do CRM. Sprawdź szybkość, wersję mobilną, błędy formularza i przekazywanie źródła zapytania. Porównaj raport konwersji z faktycznymi zgłoszeniami.", "Nie wdrażaj identyfikatorów i danych osobowych do pomiaru bez sprawdzenia zgód oraz obowiązków prawnych."]},
      {title:"Raport naprawczy",paragraphs:["Oznacz problemy według kosztu ich usunięcia i potencjalnego wpływu na jakość leadów. Wybierz kilka mierzalnych testów, ustal okres obserwacji i sposób weryfikacji po zmianach.", "Audyt nie gwarantuje wyższego ROAS. Daje jednak podstawę do uporządkowanych decyzji."]},
    ],
    sources:[{label:"Google Ads — pomiar konwersji",url:"https://support.google.com/google-ads/answer/1722022"},{label:"Google Ads — keyword optimization",url:"https://support.google.com/google-ads/answer/6238816"}],
  },
  {
    slug:"integracja-crm-z-google-ads",
    title:"Integracja CRM z Google Ads — jak mierzyć jakość leadów i sprzedaż?",
    description:"Jak połączyć Google Ads z CRM, żeby mierzyć nie tylko formularze, ale też kwalifikację kontaktów i sprzedaż? Zakres, bezpieczeństwo i pomiar.",
    intro:"Panel reklam może pokazywać konwersje, których handlowiec nigdy nie zamieni w ofertę. CRM pomaga oddzielić „wysłał formularz” od „był klientem z realną potrzebą”.",
    sections:[
      {title:"Zaprojektuj etapy lejka",paragraphs:["Nazwij jednoznacznie statusy: nowy lead, kontakt podjęty, zakwalifikowany, oferta i sprzedaż. Ustal, które etapy mają być raportowane do Google Ads i czy dane nadają się do takiej integracji.", "Zbieraj minimalny zakres danych, który jest potrzebny do analizy."]},
      {title:"Sprawdź źródła i identyfikatory",paragraphs:["Zaplanuj przechwycenie źródła kampanii zgodnie z dostępnymi parametrami oraz ustawieniami zgód. Weryfikuj, czy dane nie giną przy przekierowaniu, formularzu lub przejściu do CRM.", "Nie wysyłaj do systemów reklamowych informacji wrażliwych ani danych, do których brak podstawy przetwarzania."]},
      {title:"Wybierz poprawną metodę pomiaru",paragraphs:["Google Ads obsługuje m.in. pomiar konwersji w witrynie oraz enhanced conversions for leads. Konkretna metoda zależy od konfiguracji, możliwości CRM i wymagań prawnych.", "Zanim włączysz automatyczne importy, przetestuj poprawność przekazywania danych na przykładach testowych."]},
      {title:"Mierz rzeczywisty koszt pozyskania",paragraphs:["Porównuj koszt zgłoszenia z kosztem leada zakwalifikowanego oraz wynikiem sprzedażowym. Pamiętaj o opóźnieniu procesu i o tym, że nie wszystkie konwersje można przypisać jednoznacznie.", "Dopiero na takiej podstawie warto podejmować decyzje o skalowaniu budżetu."]},
    ],
    sources:[{label:"Google Ads — enhanced conversions for leads",url:"https://support.google.com/google-ads/answer/14795081"}],
  },
  {
    slug:"pozycjonowanie-w-ai-jak-zaczac",
    title:"Widoczność firmy w ChatGPT, Gemini i AI — co można realnie poprawić?",
    description:"SEO w AI, AEO i GEO: jak przygotować strony, ofertę, dane firmy i materiały, aby systemy AI mogły je łatwiej odczytać i cytować.",
    intro:"Nie da się uczciwie obiecać, że ChatGPT, Gemini lub Perplexity zawsze polecą konkretną firmę. Można jednak uporządkować publiczne informacje, treści i wiarygodne źródła oraz sprawdzać, co rzeczywiście widać w wynikach.",
    sections:[
      {title:"Ustal, jakie pytania zadaje klient",paragraphs:["Spisz powtarzalne pytania o zakres, cenę, proces, region realizacji i różnice między usługami. Odpowiedz na nie wprost na stronie, unikając marketingowych ogólników.", "Pokaż realne doświadczenia i udokumentowane projekty zamiast tworzyć fikcyjne opinie czy liczby."]},
      {title:"Sprawdź dostępność i spójność informacji",paragraphs:["Zadbaj o publiczną, indeksowalną stronę, jasne tytuły, poprawne adresy kanoniczne i linkowanie. Dane o firmie i usługach powinny być zgodne na wszystkich oficjalnych kanałach.", "Schema.org może pomóc opisać strony, ale nie jest przyciskiem gwarantującym obecność w odpowiedziach AI."]},
      {title:"Weryfikuj widoczność zamiast zgadywać",paragraphs:["Prowadź zestaw powtarzalnych pytań branżowych i odnotowuj, czy model cytuje Twoją stronę. Wyniki mogą się zmieniać między użytkownikami, czasem i konfiguracjami modeli.", "Nie przypisuj wzrostu liczby leadów działaniom AEO, dopóki nie masz porównywalnych danych i wiarygodnych źródeł ruchu."]},
      {title:"Czego nie robić",paragraphs:["Nie publikuj masowo setek niemal identycznych tekstów z podmienionym miastem. Google ostrzega przed scaled content i doorway abuse. Lepiej opublikować mniej materiałów z realną wartością i regularnie je aktualizować.", "Nie kupuj fałszywych recenzji, cytowań ani publikacji w miejscach tworzonych wyłącznie pod manipulowanie widocznością."]},
    ],
    sources:[{label:"Google — tworzenie wartościowych treści",url:"https://developers.google.com/search/docs/fundamentals/creating-helpful-content"},{label:"Google — spam policies",url:"https://developers.google.com/search/docs/essentials/spam-policies"}],
  },
  {
    slug:"sklep-internetowy-od-czego-zaczac",
    title:"Jak założyć sklep internetowy? Platforma, płatności, kategorie i SEO",
    description:"Sklep internetowy krok po kroku: dobór platformy, katalogu, płatności, dostaw, polityk, zamówień oraz podstaw SEO produktów.",
    intro:"Przed zakupem szablonu sklepu sprawdź, jakie procesy musi obsłużyć firma. Wdrożenie e-commerce to nie tylko widok strony głównej, ale także stany magazynowe, zamówienia, płatności i obsługa klienta.",
    sections:[
      {title:"Zaplanuj katalog i proces zakupu",paragraphs:["Określ liczbę produktów, wariantów, kategorii oraz filtry. Ustal, jak klient ma znaleźć produkt, porównać informacje, przejść przez koszyk i otrzymać potwierdzenie zakupu.", "Dla małego katalogu często wystarczy popularna platforma, nie od razu oprogramowanie szyte na miarę."]},
      {title:"Sprawdź płatności, dostawy i integracje",paragraphs:["Wypisz wymagane sposoby płatności, przewoźników, połączenia z magazynem, fakturowanie i sposób obsługi zwrotów. Oceń koszt i ograniczenia integracji przed decyzją o platformie.", "Nie obiecuj klientom konkretnych terminów dostawy, jeżeli system nie potrafi sprawdzić dostępności."]},
      {title:"Zadbaj o użyteczność i bezpieczeństwo",paragraphs:["Przeprowadź testowe zamówienie na telefonie i komputerze, w tym płatność odrzuconą, brak produktu i niepoprawne dane. Zadbaj o aktualizacje, kopie zapasowe i właściwe uprawnienia.", "Sprawdź prawidłowość treści informacyjnych i regulaminów z odpowiednią osobą odpowiedzialną za zgodność prawną."]},
      {title:"SEO dla sklepów",paragraphs:["Unikaj duplikowania opisów produktów w wielu kategoriach. Przygotuj logiczne adresy URL, tytuły, opisy, linki między kategoriami i mapę witryny. Monitoruj skuteczność organiczną w GSC.", "Nie twórz tysięcy cienkich stron dla nieistotnych kombinacji filtrów."]},
    ],
    sources:[{label:"Google Search Central — ecommerce",url:"https://developers.google.com/search/docs/specialty/ecommerce"}],
  },
  {
    slug:"audyt-wcag-strony-jak-zaczac",
    title:"Audyt WCAG strony internetowej — jak zacząć i co poprawić?",
    description:"Pierwszy audyt dostępności WCAG: kontrast, klawiatura, formularze, nagłówki, opisy obrazów i testy ręczne.",
    intro:"Automatyczny skaner dostępności wykrywa część problemów, ale nie zastępuje sprawdzenia strony klawiaturą ani oceny czytelności formularzy przez człowieka.",
    sections:[
      {title:"Przetestuj stronę bez myszy",paragraphs:["Przejdź klawiszem Tab przez menu, linki, formularz i okna dialogowe. Sprawdź, czy kolejność fokusu jest logiczna, a element aktywny widoczny.", "Upewnij się, że da się zamknąć modal i przesłać formularz bez blokady klawiatury."]},
      {title:"Sprawdź treść i kontrast",paragraphs:["Zweryfikuj hierarchię nagłówków, opisy linków i obrazów oraz kontrast tekstu względem tła. Powiększ widok i sprawdź, czy nic nie znika poza ekranem.", "Sama obecność przycisku „dostępność” nie oznacza, że strona spełnia wymagania WCAG."]},
      {title:"Przetestuj formularze i komunikaty",paragraphs:["Każde pole powinno mieć czytelną etykietę, a błąd powinien jasno mówić, jak go poprawić. Sprawdź komunikaty po wysłaniu i ich dostępność dla technologii asystujących.", "Nie zmuszaj użytkownika do rozwiązywania nieczytelnych zabezpieczeń przeciw spamowi."]},
      {title:"Kiedy potrzebny pełny audyt",paragraphs:["Przy obowiązkach prawnych i większych serwisach konieczny może być kompleksowy audyt ekspercki na uzgodnioną wersję WCAG oraz konsultacja dotycząca zakresu obowiązujących przepisów.", "Nie deklaruj certyfikacji tylko na podstawie automatycznego testu kilku stron."]},
    ],
    sources:[{label:"W3C — WCAG overview",url:"https://www.w3.org/WAI/standards-guidelines/wcag/"}],
  },
  {
    slug:"ile-kosztuje-opieka-techniczna-nad-strona",
    title:"Ile kosztuje opieka techniczna nad stroną i co powinna obejmować?",
    description:"Utrzymanie strony WWW: aktualizacje, monitoring, kopie zapasowe, WordPress, formularze i opieka po wdrożeniu.",
    intro:"Koszt opieki technicznej zależy od technologii, liczby zmian, stopnia krytyczności strony i oczekiwanego czasu reakcji. Stała opłata jest sensowna tylko przy jasno uzgodnionym zakresie.",
    sections:[
      {title:"Co warto uwzględnić w umowie",paragraphs:["Ustal odpowiedzialność za hosting, domenę, SSL, kopie zapasowe, aktualizacje, formularze i reakcję na awarie. Osobno zdefiniuj zakres nowych funkcji i dużych zmian projektu.", "Bez konkretnego zakresu abonament trudno porównać z płatnością za pojedyncze zlecenia."]},
      {title:"Bezpieczeństwo i sprawdzanie formularzy",paragraphs:["Regularnie kontroluj wersje komponentów, uprawnienia do panelu, dostęp administratorów i możliwość przywrócenia kopii. Przetestuj, czy formularz naprawdę dostarcza zgłoszenia.", "Warto rozdzielić monitoring dostępności od monitorowania, czy użytkownik może wykonać ważne działanie."]},
      {title:"Na co uważać przy wyborze zakresu",paragraphs:["Nie każde wdrożenie potrzebuje całodobowego monitoringu. Krytyczna aplikacja sprzedażowa będzie wymagała innej opieki niż prosta strona wizytówkowa.", "W umowie określ liczbę zmian, czas reakcji i sposób rozliczania prac dodatkowych."]},
      {title:"Kiedy zamiast opieki potrzebna jest przebudowa",paragraphs:["Jeśli strona ma przestarzałą technologię, niedziałające formularze lub kosztowne w utrzymaniu modyfikacje, dalsze poprawki mogą być mniej opłacalne niż planowana modernizacja.", "Decyzję warto oprzeć na kosztach 12–24 miesięcy i ryzyku awarii, a nie na wyglądzie panelu administracyjnego."]},
    ],
    sources:[{label:"OWASP — bezpieczeństwo aplikacji",url:"https://owasp.org/www-project-top-ten/"}],
  },
] as const;

export const googleAdsAndDigitalGuides = items.map((guide) => ({
  slug: guide.slug,
  title: guide.title,
  description: guide.description,
  intro: guide.intro,
  service: guide.slug.includes("google-ads") || guide.slug === "ile-kosztuje-reklama-google-ads" || guide.slug === "integracja-crm-z-google-ads" ? "/google-ads-dla-firm"
    : guide.slug.includes("wcag") || guide.slug.includes("pozycjonowanie") || guide.slug.includes("strona") || guide.slug.includes("sklep") ? "/tworzenie-stron-internetowych"
    : "/crm-i-aplikacje-webowe",
  serviceLabel: guide.slug.includes("google-ads") || guide.slug === "ile-kosztuje-reklama-google-ads" || guide.slug === "integracja-crm-z-google-ads" ? "Reklamy Google i audyt Google Ads"
    : "Oferta usług dla firm",
  category: (guide.slug.includes("google-ads") || guide.slug === "ile-kosztuje-reklama-google-ads" || guide.slug === "integracja-crm-z-google-ads"
    ? "google-ads" : guide.slug.includes("pozycjonowanie") ? "seo-google" : "rozwoj-firmy") as "google-ads" | "seo-google" | "rozwoj-firmy",
  sections: guide.sections,
  sources: guide.sources,
}));
