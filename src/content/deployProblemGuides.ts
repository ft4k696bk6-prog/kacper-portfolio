const topics = [
  {
    "slug": "vercel-this-deployment-is-temporarily-paused",
    "title": "Vercel: This deployment is temporarily paused — co oznacza i jak przywrócić stronę?",
    "description": "Na stronie widzisz This deployment is temporarily paused? Sprawdź stan projektu, limit planu i ostatnie wdrożenie.",
    "symptom": "Strona lub CRM przestaje się otwierać, a wszyscy widzą komunikat This deployment is temporarily paused. Podobny przypadek dotyczył wdrożenia B-CRM.",
    "cause": "To komunikat warstwy hostingu, a nie standardowy błąd Reacta. Przyczynę trzeba ustalić w panelu Vercel: status projektu, rozliczenia, limity i konkretne wdrożenie.",
    "steps": [
      "Otwórz Vercel Dashboard, wybierz właściwy zespół i projekt; sprawdź komunikaty o wstrzymaniu i rozliczeniach.",
      "Sprawdź stan ostatniego wdrożenia, datę ostatniej poprawnej publikacji i aktualny adres produkcyjny.",
      "Zweryfikuj, czy projekt lub zespół nie ma limitu, końca trialu lub ograniczenia konta. Nie zakładaj automatycznie, że winny jest kod.",
      "Jeśli Vercel udostępnia opcję wznowienia po rozwiązaniu przyczyny, wykonaj ją w panelu. Przy niejasnym ograniczeniu skorzystaj ze wsparcia.",
      "Po wznowieniu sprawdź własną domenę, stronę logowania, wywołania API i działanie formularzy na kontach testowych."
    ],
    "check": "Własna domena zwraca prawidłową stronę, logowanie i kluczowy przepływ biznesowy działają, a panel nie pokazuje aktywnego wstrzymania.",
    "warning": "Samo ponowne wdrożenie repozytorium nie musi usunąć ograniczenia na poziomie konta lub planu.",
    "source": "https://vercel.com/docs/plans"
  },
  {
    "slug": "vercel-trial-expired-credits",
    "title": "Vercel lub Railway: trial się kończy — czy strona zostanie wyłączona?",
    "description": "Komunikat o wygaśnięciu okresu próbnego lub kredytów. Jak sprawdzić zależności produkcji i zaplanować migrację.",
    "symptom": "Panel ostrzega, że trial wygasa lub kończą się kredyty. Nie zawsze wiadomo, które usługi zależą od płatnego planu.",
    "cause": "Różne platformy rozliczają hosting, bazę, transfer i dodatkowe usługi w odmienny sposób. Jeden komunikat nie oznacza automatycznie identycznych skutków dla wszystkich projektów.",
    "steps": [
      "Sprawdź nazwę dostawcy, plan, saldo, prognozowany koniec trialu i powiązane zasoby.",
      "Zrób listę usług: frontend, API, baza, zadania cykliczne, storage i domena.",
      "Odczytaj aktualne zasady planu w dokumentacji dostawcy, nie na podstawie starego poradnika lub reklamy.",
      "Przygotuj eksport bazy i konfiguracji, przećwicz przywrócenie na środowisku testowym.",
      "Ustal, czy przejście na plan płatny ma sens, czy prostszy hosting wystarczy; monitoruj stan po zmianie."
    ],
    "check": "Wiesz, która usługa jest objęta opłatą, jakie zasoby pozostaną aktywne i masz przetestowaną możliwość odtworzenia danych.",
    "warning": "Nie przenoś produkcyjnej bazy w ostatniej chwili bez kopii i planu cofnięcia.",
    "source": "https://vercel.com/docs/plans"
  },
  {
    "slug": "vercel-domena-404-mimo-poprawnego-deploy",
    "title": "Vercel: domena pokazuje 404, ale adres vercel.app działa",
    "description": "Projekt Vercel działa pod adresem technicznym, lecz własna domena pokazuje 404. Diagnostyka przypisania domeny i DNS.",
    "symptom": "Pod adresem *.vercel.app strona działa, ale własna domena nie trafia do właściwego projektu.",
    "cause": "Domena może być przypisana do innego projektu lub zespołu, mieć nieprawidłowy rekord DNS albo czekać na weryfikację.",
    "steps": [
      "W zakładce Domains projektu sprawdź dokładną nazwę domeny i status weryfikacji.",
      "Porównaj rekordy A, AAAA i CNAME z instrukcją pokazaną dla konkretnego projektu.",
      "Usuń konfliktujące rekordy starego hostingu tylko po upewnieniu się, że nie obsługują poczty lub innych usług.",
      "Sprawdź osobno domenę główną i www, a także docelowy adres przekierowania.",
      "Po propagacji uruchom test strony, certyfikatu HTTPS i ścieżek podstron."
    ],
    "check": "Domena główna i www prowadzą do oczekiwanej wersji witryny bez błędów certyfikatu i bez niepotrzebnych przekierowań.",
    "warning": "Nie kopiuj rekordów DNS z poradnika bez sprawdzenia aktualnych wartości podanych przez Vercel.",
    "source": "https://vercel.com/docs/domains"
  },
  {
    "slug": "vercel-dns-propagacja-nie-dziala",
    "title": "Domena po podpięciu do Vercel nie działa — DNS krok po kroku",
    "description": "Jak sprawdzić propagację DNS, CNAME, rekord A, konflikt www i ustawienia u rejestratora domeny.",
    "symptom": "Po zmianie DNS niektórzy widzą nową stronę, a inni starą albo błąd połączenia.",
    "cause": "DNS jest buforowany przez resolver i przeglądarkę. Możliwe też, że edytowano niewłaściwą strefę DNS, bo domena używa innych serwerów nazw.",
    "steps": [
      "Odczytaj bieżące serwery nazw domeny i ustal, który panel rzeczywiście zarządza strefą.",
      "Sprawdź rekordy domeny głównej, www i każdej potrzebnej subdomeny.",
      "Porównaj wyniki zapytań DNS z kilku resolverów i zweryfikuj TTL.",
      "Usuń wyłącznie rekordy konfliktujące z docelową konfiguracją; pozostaw MX, SPF, DKIM i inne rekordy poczty.",
      "Po zmianie sprawdź HTTPS oraz przekierowania dla każdej wersji domeny."
    ],
    "check": "Autorytatywna strefa zawiera prawidłowe rekordy, a po wygaśnięciu cache różne resolvery zwracają spójny wynik.",
    "warning": "Nie zmieniaj całych nameserverów bez przepisania ważnych rekordów pocztowych.",
    "source": "https://vercel.com/docs/domains/managing-dns-records"
  },
  {
    "slug": "vercel-github-commit-nie-aktualizuje-strony",
    "title": "Wrzuciłem commit do GitHub, a Vercel pokazuje starą stronę",
    "description": "Commit jest na GitHub, ale produkcja nie zmienia się. Jak znaleźć branch, projekt, deploy i cache.",
    "symptom": "Kod w repozytorium został poprawiony, a użytkownik nadal widzi starą wersję strony.",
    "cause": "Zmiana może trafić na inny branch, Vercel mógł wdrożyć inny commit albo deploy nie został ukończony. Czasem dochodzi pamięć podręczna przeglądarki lub CDN.",
    "steps": [
      "Porównaj SHA commitu w GitHub z SHA widocznym przy produkcyjnym deployu Vercel.",
      "Sprawdź branch produkcyjny i repozytorium przypięte do projektu.",
      "Jeżeli deploy ma status ERROR, otwórz build logs i popraw rzeczywistą przyczynę.",
      "Jeśli READY, otwórz dokładny URL wdrożenia i porównaj z własną domeną.",
      "Przy aktualnym kodzie sprawdź cache zasobów, service worker i pobierane dane z API."
    ],
    "check": "Produkcyjny deploy wskazuje właściwy SHA i w trybie prywatnym pokazuje oczekiwaną zmianę.",
    "warning": "Nie czyść w ciemno wszystkich cache i nie wymuszaj nowych deployów bez sprawdzenia źródłowego commitu.",
    "source": "https://vercel.com/docs/deployments"
  },
  {
    "slug": "vercel-preview-inna-strona-niz-production",
    "title": "Vercel Preview działa, Production nie — dlaczego strony są różne?",
    "description": "Dlaczego wersja podglądowa Vercel działa, a produkcja nie? Branch, domena, env i inne ustawienia środowisk.",
    "symptom": "Podgląd PR działa prawidłowo, ale domena produkcyjna zwraca błąd lub pokazuje inny widok.",
    "cause": "Vercel rozdziela środowiska i zmienne. Preview może korzystać z innej bazy, kluczy, domen i wersji commitu niż Production.",
    "steps": [
      "Sprawdź, czy porównujesz ten sam commit i tę samą ścieżkę.",
      "W panelu Deployment skontroluj środowisko oraz przypisaną domenę.",
      "Porównaj nazwy i zakresy zmiennych ENV, nie ujawniając ich wartości.",
      "Zweryfikuj połączenie z bazą i zewnętrznym API osobno dla Preview i Production.",
      "Po poprawce wykonaj nowy deploy z prawidłowymi zmiennymi i test ścieżki krytycznej."
    ],
    "check": "Podgląd i produkcja różnią się tylko świadomie skonfigurowanymi elementami; strona produkcyjna działa z właściwą bazą.",
    "warning": "Nie podłączaj preview do bazy produkcyjnej bez ścisłych zabezpieczeń i świadomej decyzji.",
    "source": "https://vercel.com/docs/projects/environment-variables"
  },
  {
    "slug": "vercel-error-500-po-publikacji",
    "title": "Next.js na Vercel: Error 500 dopiero po wdrożeniu",
    "description": "Na localhost działa, a na Vercel błąd 500. Diagnostyka runtime logs, ENV, czasu wykonania i serwera.",
    "symptom": "Strona działa lokalnie, lecz produkcyjna podstrona lub API zwraca 500 Internal Server Error.",
    "cause": "Środowisko produkcyjne ma inne zmienne, ograniczenia runtime lub uprawnienia dostępu do usług. Kompilacja bez błędów nie potwierdza działania endpointów.",
    "steps": [
      "Otwórz Runtime Logs dokładnego wdrożenia w panelu Vercel i znajdź żądanie, które zwróciło 500.",
      "Sprawdź wymagane ENV i sposób ich odczytu po stronie serwera.",
      "Zweryfikuj połączenia z bazą, zewnętrznym API i dostępność zależności.",
      "Ustal, czy błąd zależy od jednej ścieżki, metody HTTP czy danych wejściowych.",
      "Dodaj obsługę błędów bez ujawniania sekretów i wykonaj test na środowisku produkcyjnym."
    ],
    "check": "Ten sam scenariusz działa na produkcji, logi nie zawierają sekretów, a niepoprawne dane zwracają kontrolowany kod błędu.",
    "warning": "Nie pokazuj użytkownikom surowych stack trace ani kluczy API w odpowiedziach serwera.",
    "source": "https://vercel.com/docs/observability/runtime-logs"
  },
  {
    "slug": "nextjs-dynamic-route-404-po-build",
    "title": "Next.js: dynamiczna podstrona działa w dev, ale produkcja zwraca 404",
    "description": "Route [slug] w Next.js nie działa po buildzie? Sprawdź generateStaticParams, dynamicParams i źródło slugów.",
    "symptom": "Lokalnie poradnik lub realizacja otwiera się, ale po publikacji wybrany slug zwraca 404.",
    "cause": "Przy statycznym generowaniu część adresów mogła nie trafić do generateStaticParams, a dynamicParams=false blokuje nieznane ścieżki.",
    "steps": [
      "Ustal, czy route używa generateStaticParams i dynamicParams=false.",
      "Porównaj żądany slug z listą zwracaną podczas produkcyjnego builda.",
      "Sprawdź normalizację wielkości liter, polskich znaków i końcowych ukośników.",
      "Upewnij się, że dane poradnika są dostępne podczas kompilacji, a nie dopiero w przeglądarce.",
      "Uruchom build i lokalny start produkcyjny, a następnie odwiedź kilka losowych slugów."
    ],
    "check": "Każdy adres ze spisu treści i sitemap zwraca 200 po produkcyjnym buildzie.",
    "warning": "Nie ustawiaj dynamicParams=true bez przemyślenia strategii generowania i obsługi błędnych adresów.",
    "source": "https://nextjs.org/docs/app/api-reference/functions/generate-static-params"
  },
  {
    "slug": "nextjs-opengraph-stara-miniaturka",
    "title": "Next.js: miniaturka linku w Messengerze lub LinkedIn się nie zmienia",
    "description": "Wymieniłeś grafikę Open Graph, ale podgląd pokazuje starą. Sprawdź metadata, adres obrazu i cache.",
    "symptom": "Po zmianie wyglądu strony link nadal pokazuje starą grafikę lub dawny tytuł.",
    "cause": "Platformy społecznościowe buforują dane Open Graph. Dodatkowo Next.js może generować inny og:image niż zakładano.",
    "steps": [
      "Otwórz źródło HTML produkcyjnej strony i znajdź og:image, og:title oraz canonical.",
      "Sprawdź, czy URL obrazu działa publicznie, bez autoryzacji i zwraca właściwy format.",
      "Gdy grafika rzeczywiście się zmieniła, użyj nowego identyfikatora wersji w adresie obrazu.",
      "Skorzystaj z narzędzi diagnostycznych platformy do ponownego pobrania podglądu, jeśli są dostępne.",
      "Porównaj Messenger, LinkedIn i zwykłą przeglądarkę, bo każda platforma ma osobny cache."
    ],
    "check": "Nowy URL og:image zwraca nowy obraz, a po aktualizacji cache platformy odczytują właściwą miniaturkę.",
    "warning": "Nie zakładaj, że odświeżenie favicon zmieni obraz udostępnianego linku. To odrębne metadane.",
    "source": "https://nextjs.org/docs/app/api-reference/functions/generate-metadata"
  },
  {
    "slug": "nextjs-sitemap-nie-pokazuje-nowych-url",
    "title": "Nowy artykuł nie trafia do sitemap.xml w Next.js",
    "description": "Jak znaleźć błąd w generowaniu sitemap Next.js i upewnić się, że nowe adresy są widoczne dla robotów.",
    "symptom": "Nowy poradnik działa, ale po wejściu na sitemap.xml jego adresu brak.",
    "cause": "Lista slugów w sitemap może być statyczna lub nie korzystać z tego samego źródła co routing. Mapa mogła zostać wygenerowana ze starego zbioru.",
    "steps": [
      "Otwórz publiczne /sitemap.xml i wyszukaj dokładny slug.",
      "Sprawdź implementację src/app/sitemap.ts i import danych, z których powstają podstrony.",
      "Porównaj wszystkie slug z generateStaticParams z adresami w sitemap.",
      "Zweryfikuj, czy nowa wersja kodu została rzeczywiście wdrożona na produkcję.",
      "Przetestuj każdy wpis sitemap odpowiedzią HTTP, bez przekierowań do niedostępnej wersji."
    ],
    "check": "Nowy poradnik jest w sitemap i zwraca 200 po otwarciu pod prawidłową domeną.",
    "warning": "Sama obecność URL w mapie strony nie gwarantuje indeksacji Google.",
    "source": "https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap"
  },
  {
    "slug": "nextjs-robots-noindex-vercel",
    "title": "Next.js na Vercel: dlaczego Google widzi noindex?",
    "description": "Przeglądarka otwiera stronę, ale robot dostaje noindex. Sprawdź robots, nagłówki i ochronę środowisk.",
    "symptom": "Search Console informuje o wykluczeniu przez noindex, mimo że właściciel chce pokazywać witrynę w wynikach.",
    "cause": "Noindex może być zapisany w metadata robots, nagłówku X-Robots-Tag, middleware lub dotyczyć wyłącznie adresów preview.",
    "steps": [
      "Otwórz produkcyjny URL z własną domeną i sprawdź meta robots w HTML.",
      "Zweryfikuj nagłówki odpowiedzi, w szczególności X-Robots-Tag.",
      "Sprawdź plik robots.ts i ewentualne reguły middleware lub CDN.",
      "Oddziel celowe blokowanie preview od strony produkcyjnej.",
      "Po poprawce użyj Inspekcji URL w Search Console i obserwuj ponowne indeksowanie."
    ],
    "check": "Produkcyjna strona jest publiczna i nie emituje niezamierzonego noindex; adres preview może pozostać chroniony.",
    "warning": "Zezwolenie w robots.txt nie znosi meta noindex. Te mechanizmy mają inne role.",
    "source": "https://developers.google.com/search/docs/crawling-indexing/block-indexing"
  },
  {
    "slug": "nextjs-cache-pokazuje-stare-dane",
    "title": "Next.js pokazuje stare dane mimo aktualizacji w bazie — cache",
    "description": "Stara zawartość w Next.js App Router? Jak rozróżnić cache, statyczny rendering i problem z API.",
    "symptom": "Po zapisaniu zmian w panelu użytkownik odświeża stronę i nadal widzi starą wartość.",
    "cause": "Wynik może pochodzić z cache serwera, cache przeglądarki, statycznego builda albo z nieodświeżonego stanu React.",
    "steps": [
      "Otwórz bezpośrednie API i sprawdź, czy zwraca nowe dane.",
      "Rozróżnij cache zapytania, route i przeglądarki; ustal miejsce, gdzie zmiana znika.",
      "Sprawdź ustawienia revalidate lub jawny mechanizm odświeżenia po mutacji.",
      "Dla danych krytycznych określ strategię świeżości i ewentualnie wymuś dynamiczne pobranie.",
      "Testuj po zmianie danych bez restartowania serwera i z innego urządzenia."
    ],
    "check": "Po aktualizacji zmiana pojawia się w czasie zgodnym z przyjętą strategią, nie dopiero po nowym deployu.",
    "warning": "Ustawianie no-store wszędzie może bez potrzeby pogorszyć wydajność. Zidentyfikuj właściwy zakres.",
    "source": "https://nextjs.org/docs/app/guides/caching"
  },
  {
    "slug": "mobile-viewport-przeskakuje-przewijanie",
    "title": "Strona na telefonie przeskakuje przy przewijaniu — przyczyny CSS",
    "description": "Mobilny viewport skacze przy przewijaniu, animacjach lub wysuwanym pasku Safari. Jak diagnozować 100vh i layout shifts.",
    "symptom": "Na iPhone tło lub sekcje strony przeskakują, podczas gdy desktop wygląda normalnie. Taki problem pojawiał się przy dopracowywaniu portfolio.",
    "cause": "100vh nie zawsze zachowuje się tak jak wysokość widocznego obszaru przy pojawianiu się paska przeglądarki. Dodatkowo obrazy bez wymiarów i animacje mogą powodować CLS.",
    "steps": [
      "Odtwórz problem na realnym telefonie i rozróżnij zmianę wysokości viewportu od przesuwania elementów.",
      "Sprawdź elementy z height:100vh i rozważ 100svh lub 100dvh zgodnie z potrzebą projektu.",
      "Zarezerwuj rozmiar dla zdjęć, fontów i kart, żeby ładowanie nie przesuwało tekstu.",
      "Ogranicz animacje transform i fixed, które wpływają na odczucie ruchu.",
      "Przetestuj Safari, Chrome, obrót ekranu, klawiaturę ekranową i przewijanie w obu kierunkach."
    ],
    "check": "Sekcje pozostają stabilne, a elementy nie zasłaniają zawartości po wysunięciu paska przeglądarki.",
    "warning": "Nie dodawaj kolejnych losowych min-height bez znalezienia elementu, który faktycznie zmienia rozmiar.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/length"
  },
  {
    "slug": "mobile-horizontal-scroll-css",
    "title": "Na telefonie pojawia się poziomy pasek przewijania — jak znaleźć winowajcę?",
    "description": "CSS overflow-x na mobile, sztywne szerokości, 100vw i animacje. Sprawdź, co wypycha stronę poza ekran.",
    "symptom": "Stronę da się przesuwać na boki, a menu, tekst albo grafika wychodzą poza szerokość telefonu.",
    "cause": "Przyczyną często jest element z width:100vw wewnątrz kontenera, sztywna szerokość, długi URL lub transformacja.",
    "steps": [
      "W DevTools porównaj szerokość dokumentu z szerokością viewportu i znajdź najszerszy element.",
      "Sprawdź flex i grid: elementy potomne mogą wymagać min-width:0 oraz zawijania długiego tekstu.",
      "Zamień niepotrzebne 100vw na 100% tam, gdzie element powinien mieścić się w rodzicu.",
      "Sprawdź animowane elementy wysuwające się poza ekran.",
      "Napraw źródło overflow i przetestuj 320, 375, 390 oraz 430 px."
    ],
    "check": "Nie ma poziomego przewijania przy zwykłym korzystaniu, a ważne treści i kontrolki pozostają dostępne.",
    "warning": "Globalne overflow-x:hidden potrafi ukryć błąd oraz obciąć menu i przyciski.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x"
  },
  {
    "slug": "mobile-menu-biale-tlo-zmiana-stylu",
    "title": "Menu mobilne ma białe tło mimo ciemnej strony — jak znaleźć styl?",
    "description": "Pasek nawigacji nie pasuje do dark theme? Kaskada CSS, style przeglądarki, select i backdrop.",
    "symptom": "Cała strona jest ciemna, ale nagłówek lub rozwijane menu na telefonie nadal ma białą belkę.",
    "cause": "Wariant mobilny może mieć oddzielną klasę, domyślne tło elementu lub regułę CSS o wyższej specyficzności.",
    "steps": [
      "Otwórz inspektor na szerokości mobilnej i sprawdź computed background-color elementu oraz rodzica.",
      "Znajdź regułę, która wygrywa w kaskadzie CSS, także w media queries.",
      "Upewnij się, że tło menu i panelu rozwijanego korzysta z tych samych tokenów design systemu.",
      "Sprawdź kontrast logo, ikon, linków i stanów focus oraz hover.",
      "Przetestuj menu zamknięte, rozwinięte, przewinięte i na jasnym ekranie systemowym."
    ],
    "check": "Nagłówek jest spójny z identyfikacją strony, a elementy nawigacyjne pozostają czytelne i dostępne.",
    "warning": "Nie dopisuj wielu kolejnych reguł !important, jeśli problem wynika z jednego starego stylu.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity"
  },
  {
    "slug": "mobile-tekst-nachodzi-na-twarz-zdjecie",
    "title": "Tekst nachodzi na twarz na telefonie — jak zaprojektować hero?",
    "description": "Zdjęcie osoby i napisy w hero zachodzą na siebie. Rozwiązania CSS dla desktopu i mobile bez edycji zdjęcia.",
    "symptom": "Desktop wygląda dobrze, ale po zmniejszeniu ekranu nagłówek ląduje na twarzy albo znika poza kadrem.",
    "cause": "Pozycja tekstu oparta na pikselach i jedno zdjęcie dla wielu proporcji tworzą kolizję przy węższym ekranie.",
    "steps": [
      "Zaznacz obszar zdjęcia, którego nie można zasłonić, i sprawdź kadrowanie przy kilku proporcjach.",
      "Zastosuj inną kompozycję na małych ekranach: tekst obok lub pod zdjęciem zamiast na nim.",
      "Jeśli używasz nakładki, ustaw responsywny max-width, odstępy i bezpieczny obszar dla twarzy.",
      "Przy object-fit:cover kontroluj object-position i naturalne proporcje.",
      "Przetestuj 320–430 px, obrót i większe ustawienia tekstu."
    ],
    "check": "Twarz i wszystkie nagłówki są widoczne, nic się nie nakłada, a zdjęcie pozostaje niezmienione.",
    "warning": "Przesuwanie absolutnego top o kilka pikseli może działać na jednym modelu telefonu, ale nie na innych.",
    "source": "https://developer.mozilla.org/en-US/docs/Web/CSS/object-position"
  },
  {
    "slug": "next-image-obraz-znika-po-resize",
    "title": "Next/Image: obraz znika lub źle się skaluje po zmianie okna",
    "description": "Błędy next/image i responsywnych zdjęć: fill, sizes, pozycjonowanie rodzica i wysokość kontenera.",
    "symptom": "Zdjęcie znika w części breakpointów lub wygląda jak pusty prostokąt po zmianie orientacji.",
    "cause": "Image z fill wymaga rozmiaru i odpowiednio pozycjonowanego rodzica. Błędne sizes dodatkowo prowadzi do nieoptymalnego pobierania.",
    "steps": [
      "Sprawdź wymiary rodzica i computed height w miejscu, gdzie obraz znika.",
      "Dla fill ustaw rodzicowi pozycjonowanie i rzeczywistą wysokość lub aspect-ratio.",
      "Sprawdź z-index, overflow i widoczność przy breakpointach.",
      "Ustaw sizes zgodnie z faktyczną szerokością obrazu w projekcie.",
      "Przetestuj powolną sieć, nawigację w przód i wstecz oraz obrót ekranu."
    ],
    "check": "Obraz pozostaje widoczny we wszystkich docelowych układach bez gwałtownego skoku treści.",
    "warning": "Nie naprawiaj tego wyłącznie przez dopisanie dużej stałej wysokości do wszystkich ekranów.",
    "source": "https://nextjs.org/docs/app/api-reference/components/image"
  },
  {
    "slug": "favicon-stara-ikona-google-safari",
    "title": "Zmieniłem favicon, ale Google i Safari pokazują starą ikonę",
    "description": "Dlaczego favicon nie aktualizuje się w kartach, zakładkach i wynikach Google? Cache, format i adresy ikon.",
    "symptom": "Po zmianie logotypu strona nadal wyświetla poprzedni symbol w wynikach wyszukiwania lub zakładkach.",
    "cause": "Przeglądarki i wyszukiwarki buforują ikony niezależnie od HTML. Dodatkowo strona może nadal podawać stary adres favicon w metadata.",
    "steps": [
      "Otwórz źródło HTML i sprawdź rel=icon, apple-touch-icon oraz manifest.",
      "Sprawdź, czy wskazane pliki rzeczywiście zawierają nowy znak i zwracają kod 200.",
      "Zmień wersję adresu ikony lub nazwę pliku, jeśli zasób był długo cache'owany.",
      "Sprawdź lokalnie w trybie prywatnym i na innym urządzeniu.",
      "Dla Google zweryfikuj wymagania favicon i daj robotowi czas na ponowne pobranie."
    ],
    "check": "Nowy dokument HTML wskazuje poprawne ikony, a ich URL zwraca nową zawartość. Aktualizacja w Google może nastąpić później.",
    "warning": "Nie ma sposobu, by wymusić natychmiastową zmianę favicon u wszystkich użytkowników i we wszystkich wynikach.",
    "source": "https://developers.google.com/search/docs/appearance/favicon-in-search"
  },
  {
    "slug": "og-image-link-pokazuje-stary-obraz",
    "title": "Link do strony w komunikatorze pokazuje nieaktualny obraz",
    "description": "Różnica między favicon, Open Graph i obrazem w karcie linku. Jak poprawić podgląd w social media.",
    "symptom": "Udostępniasz link do portfolio, a miniaturka nadal pokazuje dawny projekt lub zły kadr.",
    "cause": "Komunikatory odczytują znaczniki og:image i często przechowują poprzednią odpowiedź w pamięci podręcznej.",
    "steps": [
      "Sprawdź bezpośrednio adres og:image w HTML docelowego URL.",
      "Zweryfikuj wymiar, typ MIME i dostępność pliku dla niezalogowanego robota.",
      "Dopasuj ważny tekst i logo do bezpiecznego obszaru miniatury.",
      "Gdy zmieniłeś plik, zastosuj nowy niezmienny URL obrazu.",
      "Otwórz narzędzie debugowania podglądu danej platformy, jeśli obsługuje ponowne pobranie."
    ],
    "check": "Źródło strony podaje poprawny obraz, który daje się pobrać publicznie. Po odświeżeniu cache podgląd powinien go wyświetlić.",
    "warning": "Zmiana zdjęcia na stronie głównej sama w sobie nie zmienia og:image.",
    "source": "https://ogp.me/"
  },
  {
    "slug": "vercel-subdomena-konfiguracja-dns",
    "title": "Jak podpiąć subdomenę CRM lub demo do Vercel bez psucia poczty?",
    "description": "Konfiguracja crm.domena.pl i demo.domena.pl z Vercel, gdy główna domena i poczta działają osobno.",
    "symptom": "Chcesz uruchomić kilka projektów pod subdomenami jednej domeny, ale boisz się przerwania poczty i strony głównej.",
    "cause": "Każda subdomena może mieć własny rekord DNS i projekt. Rekordy MX, SPF, DKIM dotyczące poczty nie powinny być przypadkowo nadpisywane.",
    "steps": [
      "Sporządź mapę domena główna, www, crm oraz demo i przypisz każdej docelowy projekt.",
      "W Vercel dodaj każdą subdomenę do odpowiedniego projektu i odczytaj zalecany rekord DNS.",
      "U rejestratora zmień tylko rekordy dotyczące konkretnych hostów.",
      "Zweryfikuj HTTPS, przekierowania i dostępność loginu dla każdej subdomeny.",
      "Po zmianie przetestuj wysyłanie i odbieranie poczty oraz działanie pozostałych projektów."
    ],
    "check": "Wszystkie wskazane subdomeny otwierają właściwe aplikacje, a rekordy poczty i obsługa głównej domeny nie uległy zmianie.",
    "warning": "Nie usuwaj całej strefy DNS przy dodawaniu jednego CNAME.",
    "source": "https://vercel.com/docs/domains/working-with-domains"
  }
] as const;

export const deployProblemGuides = topics.map(topic => ({
 slug:topic.slug,title:topic.title,description:topic.description, category:'Vercel, Next.js i frontend',
 service:'/tworzenie-stron-internetowych', serviceLabel:'Tworzenie stron internetowych',intro:topic.symptom,
 sections:[{title:'Skąd bierze się problem?',paragraphs:[topic.cause]},{title:'Co zrobić krok po kroku?',paragraphs:topic.steps.map((s,i)=>(i+1)+'. '+s)},{title:'Test poprawki i ważna pułapka',paragraphs:[topic.check,topic.warning]}],
 sources:[{label:'Dokumentacja techniczna',url:topic.source}]
}));
