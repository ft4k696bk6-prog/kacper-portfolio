export const errorGuides = [
  {
    slug: "nextjs-hydration-failed-jak-naprawic",
    title: "Next.js: Hydration failed — jak znaleźć i naprawić błąd?",
    description: "Hydration failed, server rendered HTML didn't match the client. Lista przyczyn i sprawdzanie krok po kroku w Next.js i React.",
    service: "/crm-i-aplikacje-webowe",
    serviceLabel: "CRM i aplikacje webowe",
    intro: "Komunikat Hydration failed oznacza, że HTML wygenerowany na serwerze różni się od pierwszego renderowania Reacta w przeglądarce. Nie zaczynaj od wyłączania SSR: znajdź element, który ma inną wartość przy pierwszym renderze.",
    sections: [
      {title:"1. Znajdź pierwszy rozjechany element", paragraphs:["Otwórz konsolę DevTools i sprawdź fragment drzewa komponentów pokazany przy błędzie. Nie skupiaj się wyłącznie na najwyższym komponencie: istotny jest pierwszy element z rozbieżną zawartością. Jeśli problem jest tylko w jednej przeglądarce, sprawdź rozszerzenia modyfikujące HTML.","Zweryfikuj też zagnieżdżenie HTML. Element p nie może zawierać kolejnego p ani div, a przycisk nie powinien zawierać drugiego przycisku. Przeglądarka może automatycznie poprawić niepoprawny HTML i spowodować rozjazd przy hydratacji."]},
      {title:"2. Sprawdź dane zależne od przeglądarki", paragraphs:["Najczęstszy błąd: podczas renderowania używasz window, localStorage, losowej liczby albo bieżącego czasu. Serwer i klient mogą wtedy zwrócić różne treści. W React stan początkowy powinien generować identyczny HTML; odczyt lokalnych ustawień wykonaj dopiero w useEffect.","Jeżeli aplikacja renderuje datę, sformatuj ją deterministycznie: jawnie wskaż locale i timeZone albo pokaż wartość po zamontowaniu komponentu. Różne strefy czasowe po stronie serwera i telefonu to częsty powód."]},
      {title:"3. Napraw przyczynę, nie ukrywaj ostrzeżenia", paragraphs:["Po wprowadzeniu poprawki uruchom kompilację produkcyjną i sprawdź tę samą podstronę bez cache oraz w trybie prywatnym. suppressHydrationWarning stosuj wyłącznie do pojedynczych treści, które muszą się różnić, np. czasu; nie jest uniwersalnym rozwiązaniem. Wyłączanie SSR w całym widoku pogarsza często wydajność i SEO.","Jeśli renderowanie różni się wyłącznie z powodu biblioteki zależnej od DOM, wydziel ją do osobnego klientowego komponentu i dopiero tam rozważ renderowanie bez SSR. Zachowaj po stronie serwera ważny tekst, nagłówki i linki."]},
    ],
    sources:[{label:"Next.js — React hydration error",url:"https://nextjs.org/docs/messages/react-hydration-error"}]
  },
  {
    slug: "vercel-deployment-not-found-404",
    title: "Vercel DEPLOYMENT_NOT_FOUND (404) — co sprawdzić po kolei?",
    description: "Strona na Vercel pokazuje DEPLOYMENT_NOT_FOUND? Sprawdź domenę, deployment, alias i status produkcji krok po kroku.",
    service: "/tworzenie-stron-internetowych",
    serviceLabel: "Tworzenie stron internetowych",
    intro: "Błąd 404 DEPLOYMENT_NOT_FOUND wskazuje, że żądanie trafiło pod adres deploymentu, którego Vercel nie znajduje. To co innego niż zwykły błąd 404 konkretnej podstrony aplikacji.",
    sections: [
      {title:"1. Odróżnij brak deploymentu od braku strony",paragraphs:["Jeżeli komunikat zawiera DEPLOYMENT_NOT_FOUND, najpierw sprawdź dokładny hostname z paska adresu. Stary link do preview lub nieaktualny adres deploymentu może nie istnieć. Otwórz panel projektu Vercel i porównaj adres z aktualnym, działającym wdrożeniem.","Jeżeli strona główna działa, a 404 dotyczy tylko jednej ścieżki, to prawdopodobnie problem routingu lub konfiguracji aplikacji, a nie nieistniejącego deploymentu."]},
      {title:"2. Sprawdź stan wdrożenia i przypisanie domeny",paragraphs:["W Vercel otwórz Project → Deployments. Znajdź ostatni deployment produkcyjny i sprawdź, czy ma status Ready. Jeżeli build zakończył się błędem, otwórz Build Logs i napraw pierwszy istotny błąd, nie tylko końcowe build exited with 1.","Następnie przejdź do Settings → Domains. Upewnij się, że Twoja domena jest przypisana do właściwego projektu i że DNS jest zweryfikowany. Jeśli kilka projektów miało podobną nazwę, sprawdź także identyfikator projektu, aby nie diagnozować niepowiązanej aplikacji."]},
      {title:"3. Bezpieczne przywrócenie strony",paragraphs:["Jeśli wdrożenie produkcyjne nie działa, wybierz znany poprawny deployment i użyj funkcji przywrócenia albo przygotuj nowe wdrożenie z poprawionym kodem. Nie zmieniaj DNS w ciemno. Zmiana adresu domeny bez zrozumienia przyczyny może pogorszyć dostępność.","Na koniec sprawdź stronę pod własną domeną, nie tylko pod adresem .vercel.app, zarówno na komputerze, jak i na telefonie."]},
    ],
    sources:[{label:"Vercel — DEPLOYMENT_NOT_FOUND",url:"https://vercel.com/docs/errors/deployment_not_found"},{label:"Vercel — Troubleshooting Build Errors",url:"https://vercel.com/docs/deployments/troubleshoot-a-build"}]
  },
  {
    slug: "cors-access-control-allow-origin-brak",
    title: "CORS: brak Access-Control-Allow-Origin — jak naprawić fetch?",
    description: "Blocked by CORS policy, Access-Control-Allow-Origin missing i błędy OPTIONS. Diagnostyka i poprawna konfiguracja API.",
    service: "/crm-i-aplikacje-webowe",
    serviceLabel: "CRM i aplikacje webowe",
    intro: "Błąd CORS oznacza, że przeglądarka nie pozwoliła skryptowi odczytać odpowiedzi API z innego origin. Najczęściej naprawę wykonuje się na serwerze API, a nie przez obejścia po stronie frontendu.",
    sections: [
      {title:"1. Znajdź dokładne żądanie",paragraphs:["W DevTools otwórz Network, odtwórz błąd i znajdź żądanie fetch. Zapisz adres frontendowy (Origin), URL API, metodę oraz status. Zajrzyj do Console: samo Failed to fetch nie mówi, który nagłówek jest brakujący.","Sprawdź, czy przed właściwym zapytaniem pojawia się OPTIONS. To preflight, w którym przeglądarka pyta API o dozwolone metody i nagłówki. Nieobsługiwany OPTIONS może blokować prawidłowe POST."]},
      {title:"2. Popraw politykę API",paragraphs:["Jeśli kontrolujesz API, ustaw Access-Control-Allow-Origin na konkretny zaufany origin i poprawnie obsłuż metody oraz żądanie OPTIONS. Przy ciasteczkach i credentials nie stosuj gwiazdki jako dozwolonego origin. Gdy odpowiedź zależy od Origin, użyj też Vary: Origin.","Dopilnuj, by nagłówki CORS były obecne także w odpowiedziach z błędami, jeśli przeglądarka ma je odczytywać. API może zwracać 401 czy 500 i równocześnie mieć źle ustawioną politykę CORS."]},
      {title:"3. Czego nie robić",paragraphs:["Nie wyłączaj zabezpieczeń przeglądarki i nie korzystaj z nieznanych publicznych proxy do przesyłania danych klientów. mode no-cors nie rozwiązuje potrzeby odczytania odpowiedzi: zwraca odpowiedź nieprzezroczystą.","Jeśli zewnętrzne API nie umożliwia wywołań z Twojego origin, zweryfikuj jego oficjalny backend SDK lub pośredniczący endpoint serwera, z uwzględnieniem uwierzytelnienia i limitowania żądań."]},
    ],
    sources:[{label:"MDN — CORS errors",url:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors"},{label:"MDN — Missing Allow-Origin header",url:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSMissingAllowOrigin"}]
  },

];
