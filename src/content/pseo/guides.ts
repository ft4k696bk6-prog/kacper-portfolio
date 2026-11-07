import autopilotEntries from "./autopilot-published.json";
/**
 * Publikowane rekordy pSEO.
 * Każdy problem ma własną diagnostykę, procedurę i kryterium sprawdzenia.
 * Dla kolejnych partii nie generuj treści przez zamianę nazwy produktu w szablonie.
 * Treści robocze trzymaj w topics.ts — nie są indeksowane ani routowane.
 */
export type PseoEntry = {
  status: "published";
  slug: string;
  title: string;
  description: string;
  intro: string;
  service: string;
  serviceLabel: string;
  diagnostics: readonly string[];
  steps: readonly string[];
  verification: readonly string[];
  mistakes: readonly string[];
  sources: readonly { label: string; url: string }[];
};

export const publishedEntries: readonly PseoEntry[] = [
  {
    status: "published",
    slug: "github-merge-conflict-rownolegla-praca-nad-strona",
    title: "GitHub: merge conflict, gdy dwie osoby zmieniają tę samą stronę",
    description: "Dwa równoległe commity zmieniły ten sam plik? Jak zachować obie poprawki, rozwiązać konflikt i nie nadpisać pracy drugiej osoby.",
    intro: "Konflikt scalania nie oznacza uszkodzonego repozytorium. Git nie umie samodzielnie wybrać między dwiema zmianami tego samego fragmentu. Największe ryzyko to odruchowe zastąpienie całego pliku jedną wersją, przez co znika praca drugiej osoby.",
    service: "/crm-i-aplikacje-webowe",
    serviceLabel: "Aplikacje i praca z kodem",
    diagnostics: [
      "Otwórz pull request i sprawdź listę plików z konfliktem. Ustal, która gałąź jest docelowa i czy w czasie Twojej pracy ktoś dodał do niej kolejne commity. Zapisz identyfikator ostatniego commita przed podjęciem działań.",
      "Porównaj oba pliki i historię zmian, a nie tylko komunikat CONFLICT. Konflikt może dotyczyć kilku wierszy, ale różne sesje mogą równocześnie aktualizować też zależne pliki, np. katalog artykułów i mapę witryny."
    ],
    steps: [
      "Utwórz osobną gałąź na bazie aktualnego main. Nie rób force push na main i nie kasuj cudzych commitów.",
      "Pobierz najnowsze zmiany gałęzi docelowej. Otwórz konfliktujące pliki i przejrzyj oba warianty między znacznikami HEAD, ======= i nazwą drugiej gałęzi.",
      "Scal tylko te fragmenty, które rzeczywiście mają współistnieć. Przykładowo nową listę poradników zachowaj, a wyszukiwarkę i paginację dopasuj do tej listy zamiast przywracać stary plik w całości.",
      "Usuń znaczniki konfliktu, uruchom lint, kontrolę typów i testy. Sprawdź również rzeczywiste podstrony, bo poprawny syntaktycznie merge może nadal zgubić funkcję.",
      "Wykonaj commit rozwiązania, zaktualizuj pull request i dopiero po pozytywnych testach połącz go z main. Przed scaleniem jeszcze raz sprawdź, czy branch nie został ponownie zmieniony."
    ],
    verification: [
      "Historia projektu musi zawierać obie zamierzone funkcjonalności; w kodzie nie mogą pozostać znaczniki <<<<<<< ani >>>>>>>. Skan repozytorium powinien wykryć zerową liczbę takich fragmentów.",
      "Uruchom aplikację i sprawdź scenariusze z obu zmian, np. komplet poradników oraz działanie wyszukiwania. Sam status 'mergeable' nie dowodzi poprawności zachowania strony."
    ],
    mistakes: [
      "Nie używaj automatycznego 'accept incoming' dla całego pliku, jeśli zawiera niezależne poprawki. Możesz w ten sposób usunąć treści, których nie da się odtworzyć z bieżącego widoku."
    ],
    sources: [{ label: "GitHub Docs — merge conflicts", url: "https://docs.github.com/en/pull-requests/reference/merge-conflicts" }]
  },
  {
    status: "published",
    slug: "nextjs-image-unconfigured-host-remote-patterns",
    title: "Next.js Image: hostname is not configured under images — naprawa",
    description: "next/image odrzuca zdjęcie z zewnętrznego hosta? Skonfiguruj remotePatterns bez otwierania optymalizatora na wszystkie domeny.",
    intro: "Komponent next/image może odmówić wyświetlenia grafiki z zewnętrznej domeny, jeśli źródło nie pasuje do dozwolonych wzorców. To osobny problem od przycięcia zdjęcia przez CSS albo niedostępnego pliku.",
    service: "/tworzenie-stron-internetowych",
    serviceLabel: "Next.js i aplikacje webowe",
    diagnostics: [
      "W konsoli przeglądarki lub logach Next.js odczytaj dokładny hostname i URL problematycznej grafiki. Porównaj je z images.remotePatterns w next.config.ts lub next.config.js. Zwróć uwagę na protokół, ścieżkę i parametry zapytania.",
      "Sprawdź, czy oryginalny obraz otwiera się bezpośrednio. Jeżeli serwer zdjęć odpowiada 403 lub wymaga ciasteczka, samo dodanie remotePatterns nie naprawi autoryzacji zewnętrznego źródła."
    ],
    steps: [
      "W next.config.ts dodaj wpis images.remotePatterns dla konkretnej, zaufanej domeny i odpowiedniej ścieżki plików. Nie dopuszczaj dowolnego hosta za pomocą zbyt szerokiego wildcarda.",
      "Upewnij się, że hostname w konfiguracji odpowiada dokładnie domenie z src — włącznie z subdomeną. Sprawdź osobno https i ewentualny numer portu w środowisku testowym.",
      "Jeśli obraz ma parametry URL, sprawdź dopasowanie właściwości search we wzorcu. Pusta wartość może wykluczać wszystkie adresy z query string.",
      "Po zapisaniu konfiguracji uruchom ponownie serwer developerski lub wykonaj nowe wdrożenie. Zmiana next.config nie musi od razu obowiązywać w już uruchomionym procesie.",
      "Jeżeli komunikat nadal występuje, sprawdź odpowiedź endpointu /_next/image i kod HTTP. Odróżnij 400 spowodowane dopasowaniem wzorca od błędu serwera źródłowego."
    ],
    verification: [
      "Grafika powinna ładować się po twardym odświeżeniu strony, a Network nie powinien pokazywać odpowiedzi 400 dla /_next/image z powodu niezaufanego hosta.",
      "Sprawdź również inną zewnętrzną domenę, która nie jest zaufana: nie powinna przypadkowo uzyskać dostępu do optymalizatora obrazów."
    ],
    mistakes: [
      "Nie przepisuj automatycznie każdego URL z błędu do szerokiej listy wildcardów. remotePatterns pełni funkcję kontroli dozwolonych źródeł."
    ],
    sources: [{ label: "Next.js — Image remotePatterns", url: "https://nextjs.org/docs/app/api-reference/components/image#remotepatterns" }]
  },
  {
    status: "published",
    slug: "supabase-storage-413-entity-too-large-upload",
    title: "Supabase Storage 413 EntityTooLarge przy uploadzie zdjęć lub wideo",
    description: "Supabase zwraca HTTP 413 przy uploadzie? Ustal limit globalny i limit bucketa, sprawdź rozmiar pliku oraz metodę przesyłania.",
    intro: "HTTP 413 EntityTooLarge oznacza przekroczenie limitu rozmiaru w trakcie przesyłania. To nie jest typowy błąd uprawnień RLS. Naprawę zacznij od porównania rzeczywistego rozmiaru pliku z limitami projektu i konkretnego zasobnika.",
    service: "/crm-i-aplikacje-webowe",
    serviceLabel: "Supabase i aplikacje",
    diagnostics: [
      "Sprawdź pełny kod odpowiedzi i komunikat Storage, nie tylko ogólne 'upload failed'. Zapisz rozmiar pliku w bajtach, nazwę bucketa oraz metodę uploadu. Plik z telefonu może być znacznie większy niż miniatura wyświetlana w interfejsie.",
      "Supabase pozwala ustawić limit globalny i niższy limit dla poszczególnych bucketów. Faktyczny dopuszczalny rozmiar wynika z obu tych konfiguracji, a dostępność wyższych wartości zależy od planu projektu."
    ],
    steps: [
      "Otwórz Supabase → Storage Settings i sprawdź Global file size limit. Nie zmieniaj go bez oszacowania kosztów i zapotrzebowania aplikacji.",
      "Przejdź do ustawień docelowego bucketa i zweryfikuj jego własne ograniczenia rozmiaru oraz dozwolone typy MIME.",
      "Jeżeli plik jest większy od uzasadnionego limitu, w aplikacji pokaż zrozumiały komunikat przed wysłaniem. W razie potrzeby zastosuj kompresję albo osobną ścieżkę dla dużych materiałów.",
      "Dla większych plików oceń mechanizm resumable upload oparty na TUS, zamiast wielokrotnie ponawiać jeden duży upload standardowy przez niestabilne łącze.",
      "Jeśli plik mieści się w limitach, sprawdź pośredniczący serwer Next.js lub proxy, które również może narzucać własny limit żądania."
    ],
    verification: [
      "Przetestuj jeden plik mniejszy od limitu i jeden większy. Mały powinien zostać zapisany i odczytany, a duży otrzymać kontrolowany komunikat bez niekończącej się animacji.",
      "Sprawdź, czy zapisany obiekt ma poprawny rozmiar i metadane oraz czy nie powstały osierocone pliki po błędnym lub przerwanym uploadzie."
    ],
    mistakes: [
      "Nie wyłączaj RLS w celu naprawy odpowiedzi 413. Nie zwiększaj też globalnego limitu do maksimum wyłącznie dla jednego formularza z małymi załącznikami."
    ],
    sources: [
      { label: "Supabase — file size limits", url: "https://supabase.com/docs/guides/storage/uploads/file-limits" },
      { label: "Supabase — Storage error codes", url: "https://supabase.com/docs/guides/storage/debugging/error-codes" }
    ]
  },
  {
    status: "published",
    slug: "node-npm-ci-eresolve-lockfile-bledy-build",
    title: "npm ci nie działa na CI: package-lock niezgodny z package.json",
    description: "npm ci kończy się błędem w GitHub Actions lub Vercel, a npm install lokalnie działa? Sprawdź lockfile, wersję Node i zależności.",
    intro: "Polecenie npm ci jest celowo bardziej rygorystyczne niż npm install. W pipeline produkcyjnym wymaga spójnego package.json i package-lock.json i nie naprawia ich w locie. Dlatego projekt może działać lokalnie, lecz nie budować się w CI.",
    service: "/crm-i-aplikacje-webowe",
    serviceLabel: "Programowanie i wdrożenia",
    diagnostics: [
      "Otwórz pierwszy błąd npm ci w logach CI i zapisz jego dokładną treść. Rozróżnij brak pakietu w lockfile od konfliktu peerDependencies oraz od błędu wersji Node lub npm.",
      "Porównaj package.json i package-lock.json w commicie wybranym do budowy. Pamiętaj, że lokalne node_modules może zawierać pozostałości pakietów, których nie ma w plikach zależności."
    ],
    steps: [
      "Zacznij od upewnienia się, że pracujesz na właściwej gałęzi i nie masz niezapisanych zmian. Sprawdź git status oraz różnice w package.json i package-lock.json.",
      "Uruchom npm install w kontrolowanym środowisku z kompatybilną wersją Node i npm, aby odtworzyć poprawny plik package-lock.json. Nie usuwa on automatycznie przyczyny konfliktu niezgodnych wersji.",
      "Uruchom czystą instalację npm ci, najlepiej w osobnym katalogu roboczym lub po bezpiecznym usunięciu lokalnych zależności. Nie wykonuj destrukcyjnego czyszczenia w katalogu z niezapisanym kodem.",
      "Jeśli problem dotyczy peer dependencies, zidentyfikuj konkretne pakiety i dopasuj ich wersje. Flaga legacy-peer-deps może maskować konflikt i powinna być świadomą, spójną decyzją, a nie pierwszą reakcją.",
      "Zapisz i wypchnij zgodny lockfile razem z package.json, następnie ponów CI. Sprawdź, czy pipeline używa tej samej głównej wersji Node co środowisko lokalne."
    ],
    verification: [
      "Przebieg npm ci powinien zakończyć się bez błędu, a po nim powinny przejść typecheck, testy i produkcyjny build. Sama poprawna instalacja nie gwarantuje poprawności aplikacji.",
      "Na nowej gałęzi albo czystym klonie uruchom tę samą sekwencję komend co CI, aby upewnić się, że wynik nie zależy od przypadkowej zawartości node_modules."
    ],
    mistakes: [
      "Nie dopisuj node_modules do repozytorium i nie usuwaj package-lock.json tylko po to, by wyłączyć konflikt. Stracisz odtwarzalność instalacji."
    ],
    sources: [{ label: "npm CLI — npm ci", url: "https://docs.npmjs.com/cli/v11/commands/npm-ci" }]
  }
];

export const pseoGuides = [...publishedEntries, ...(autopilotEntries as unknown as PseoEntry[])].map((entry) => ({
  autoGenerated: "autoGenerated" in entry && entry.autoGenerated === true,
  generatedAt: "generatedAt" in entry && typeof entry.generatedAt === "string" ? entry.generatedAt : undefined,
  slug: entry.slug,
  title: entry.title,
  description: entry.description,
  intro: entry.intro,
  service: entry.service,
  serviceLabel: entry.serviceLabel,
  sections: [
    { title: "Jak rozpoznać przyczynę", paragraphs: [...entry.diagnostics] },
    { title: "Rozwiązanie krok po kroku", paragraphs: entry.steps.map((step, i) => `${i + 1}. ${step}`) },
    { title: "Jak sprawdzić, czy problem zniknął", paragraphs: [...entry.verification] },
    { title: "Czego nie robić", paragraphs: [...entry.mistakes] }
  ],
  sources: [...entry.sources]
}));
