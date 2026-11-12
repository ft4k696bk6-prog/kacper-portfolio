/** Materiały evergreen pod aktualizację przestarzałych odnośników do wycofanych usług Google.
 * Daty i status produktów są oparte na oficjalnej dokumentacji Google.
 */
export const evergreenLinkGuides = [
  {
    slug: "google-optimize-nie-dziala-alternatywy-testy-ab",
    title: "Google Optimize nie działa — jak zrobić test A/B po zamknięciu usługi?",
    description: "Google Optimize zakończył działanie 30 września 2023 r. Sprawdź dostępne alternatywy, zaplanuj uczciwy test A/B i nie pomyl wzrostu kliknięć z wynikiem biznesowym.",
    service: "/marketing-i-reklamy",
    serviceLabel: "Marketing i reklamy dla firm",
    category: "rozwoj-firmy" as const,
    intro: "Jeżeli poradnik nadal odsyła Cię do Google Optimize, korzystasz z nieaktualnej instrukcji. Google potwierdził zakończenie usługi 30 września 2023 r. Sam Google Analytics 4 nie zastępuje narzędzia, które dzieli ruch między warianty strony. Poniżej pokazuję, jak przygotować bezpieczny eksperyment i jakich elementów nie pomijać przy wyborze następcy Optimize.",
    sections: [
      {title:"Co właściwie przestało działać?",paragraphs:[
        "Google Optimize oraz Optimize 360 zakończyły działanie 30 września 2023 r.; aktywne eksperymenty i personalizacje zostały zakończone. Samodzielne otwieranie starych instrukcji lub instalowanie nieaktualnego kodu nie uruchomi testu A/B.",
        "Google Analytics 4 to narzędzie pomiaru. Nie należy zakładać, że samo utworzenie zdarzenia w GA4 przydzieli odwiedzających do dwóch losowych wariantów strony."
      ]},
      {title:"Jakie zamienniki mają sens?",paragraphs:[
        "W oficjalnej dokumentacji Google jako partnerów integracji testów A/B z Google Analytics wymieniono AB Tasty, Optimizely i VWO. Ich ceny, limity i możliwość testowania trzeba zweryfikować na stronach dostawców — nie deklaruję, że wszystkie są darmowe.",
        "Mała firma może też przeprowadzić własny eksperyment w aplikacji, ale potrzebuje spójnego przydziału użytkownika do wariantu, pomiaru tej samej konwersji i zabezpieczenia przed zmianą wariantu podczas sesji. Samo wyświetlanie różnych nagłówków naprzemiennie przy odświeżeniu nie jest rzetelnym testem."
      ]},
      {title:"Jak zaplanować test bez przepalania budżetu?",paragraphs:[
        "Najpierw postaw hipotezę, np. że wyraźniejsza informacja o czasie odpowiedzi zwiększy liczbę poprawnych formularzy. Wybierz jedno zdarzenie główne: skutecznie dostarczony formularz, umówiona rozmowa lub potwierdzony zakup, a nie samo kliknięcie przycisku.",
        "Zapisz datę rozpoczęcia i zakończenia, źródła ruchu, segmenty, zgodność urządzeń oraz warianty. Nie zmieniaj jednocześnie ceny, formularza, reklamy i grup odbiorców, jeśli później chcesz przypisać zmianę wyniku jednemu elementowi.",
        "Jeśli ruch jest mały, zmierz liczbę konwersji w obu wariantach i nie wyciągaj kategorycznych wniosków z dwóch dodatkowych zgłoszeń. Przyjmij z góry regułę zatrzymania eksperymentu; nie kończ go wyłącznie w chwilowym szczycie."
      ]},
      {title:"Jak ocenić wynik w CRM, a nie tylko w analityce?",paragraphs:[
        "W kampaniach leadowych liczba formularzy to tylko początek. Porównuj także poprawne numery, odsetek odebranych telefonów, zakwalifikowanych leadów i koszt pozyskania realnej szansy sprzedaży. Wartościowy formularz to nie zawsze najtańszy formularz.",
        "Połącz anonimowy identyfikator wariantu z konwersją i — tam, gdzie masz podstawę oraz zgodny proces przetwarzania danych — sprawdź dalszy status w CRM. Nie wysyłaj danych osobowych do analityki bez potrzeby."
      ]},
      {title:"Szybka lista kontrolna przed uruchomieniem testu",paragraphs:[
        "Zweryfikuj działanie formularza na telefonie, poprawność zdarzeń i zgód, stały przydział do wariantów, niezmienność celu pomiaru, czas trwania oraz możliwość wycofania zmiany. Wykonaj jeden testowy kontakt i sprawdź, czy rzeczywiście dotarł do odbiorcy.",
        "Przed testowaniem zmian na stronie możesz użyć darmowego audytu na bernecki.dev/narzedzia/audyt-strony. Audyt sprawdza publiczne elementy HTML i technikalia, ale nie przydziela wariantów ani nie zastępuje platformy eksperymentacyjnej."
      ]}
    ],
    sources:[
      {label:"Google Analytics — informacja o wycofaniu Google Optimize",url:"https://support.google.com/analytics/answer/12979939?hl=pl"},
      {label:"Darmowy audyt strony na bernecki.dev",url:"https://bernecki.dev/narzedzia/audyt-strony"}
    ]
  },
  {
    slug:"google-mobile-friendly-test-nie-dziala-jak-sprawdzic-strone-mobilna",
    title:"Google Mobile-Friendly Test nie działa — czym sprawdzić stronę mobilną w 2026 roku?",
    description:"Test Mobile-Friendly Google został wycofany w grudniu 2023 r. Zobacz PageSpeed Insights, Lighthouse i praktyczną checklistę testowania strony na telefonie.",
    service:"/tworzenie-stron-internetowych",
    serviceLabel:"Tworzenie stron i UX",
    category:"strony-ux" as const,
    intro:"Stare poradniki nadal kierują do Google Mobile-Friendly Test, ale Google wycofał to narzędzie i raport Mobile Usability w Search Console w grudniu 2023 r. Nadal trzeba sprawdzać wygodę obsługi na telefonach — po prostu innymi metodami. Test szybkości i techniczny audyt HTML nie potwierdzają automatycznie, że cały interfejs działa dobrze na iPhonie czy Androidzie.",
    sections:[
      {title:"Co wycofał Google i kiedy?",paragraphs:[
        "Google ogłosił wycofanie Mobile-Friendly Test, jego API i raportu Mobile Usability w Search Console z początkiem grudnia 2023 r. Nie jest to równoznaczne z utratą znaczenia wygody obsługi mobilnej.",
        "Nie należy korzystać ze starych zrzutów ekranu, instrukcji ani linków do testu jako z aktualnego narzędzia diagnostycznego."
      ]},
      {title:"Trzy kontrole, które naprawdę warto wykonać",paragraphs:[
        "1. Otwórz PageSpeed Insights i wybierz wyniki mobilne. Sprawdź Core Web Vitals oraz uwagi o wydajności. Wynik może zawierać dane laboratoryjne oraz rzeczywiste dane użytkowników, jeśli są dostępne.",
        "2. Uruchom Lighthouse w Chrome dla wersji mobilnej. Obejmuje wydajność, dostępność i wybrane dobre praktyki, ale nadal nie zastępuje ręcznego testowania wszystkich interakcji.",
        "3. Na prawdziwym telefonie sprawdź pole wyszukiwania, formularz, klawiaturę, menu, dymki, okna modalne, przewijanie poziome i poprawność kliknięć. To właśnie problemy z fokusem, zoomem pól formularza i nakładkami często umykają skanowi kodu."
      ]},
      {title:"Checklista dla iPhone i Androida",paragraphs:[
        "Sprawdź szerokość 320–430 px oraz większy tablet. Upewnij się, że żaden element nie wymusza przewijania poziomego, wszystkie przyciski są osiągalne, formularze mają poprawne typy pól, a komunikaty błędów są widoczne.",
        "Otwórz i zamknij menu i modal, przesuń stronę po otwarciu klawiatury, kliknij poza dymkiem i sprawdź działanie przycisku Wstecz. Przetestuj ciemny motyw oraz różne orientacje ekranu, jeśli produkt ich używa.",
        "Na iOS pole tekstowe o zbyt małym rozmiarze pisma może prowokować powiększenie widoku po uzyskaniu fokusu. Nie wyłączaj skalowania strony na siłę — popraw projekt formularza."
      ]},
      {title:"Co sprawdzi bezpłatny audyt HTML?",paragraphs:[
        "Darmowy kompleksowy audyt bernecki.dev odczytuje m.in. obecność znacznika viewport, strukturę nagłówków, informacje o obrazach, czas odpowiedzi serwera oraz podstawowe sygnały SEO na próbce podstron. Brak meta viewport to sygnał ostrzegawczy dla wersji mobilnej.",
        "To NIE jest emulacja przeglądarki ani pełny test responsywności. Do sprawdzenia rzeczywistego layoutu, błędów po otwarciu klawiatury i Core Web Vitals nadal potrzebujesz narzędzi przeglądarkowych oraz testu na urządzeniu."
      ]},
      {title:"Kiedy uznać poprawkę za zakończoną?",paragraphs:[
        "Zrób tę samą ścieżkę użytkownika przed i po zmianie: otwarcie strony, znalezienie oferty, wypełnienie i wysłanie formularza, zamknięcie okna i powrót do treści. Zachowaj listę modeli telefonów i przeglądarek.",
        "Osobno obserwuj raport Core Web Vitals w Search Console. Wyniki z pola i raporty laboratoryjne różnią się metodologią, dlatego pojedyncza poprawa punktacji Lighthouse nie dowodzi rozwiązania problemu wszystkich użytkowników."
      ]}
    ],
    sources:[
      {label:"Google Search Central — wycofanie Mobile-Friendly Test",url:"https://developers.google.com/search/blog/2023/04/page-experience-in-search"},
      {label:"Google — PageSpeed Insights",url:"https://pagespeed.web.dev/"},
      {label:"Darmowy test strony mobilnej i audyt viewport",url:"https://bernecki.dev/narzedzia/test-mobilnosci-strony"}
    ]
  }
] as const;
