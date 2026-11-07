export type BlogLanguage = "pl"|"en";
export type BlogTopic = "marketing"|"crm"|"seo"|"websites";
type BlogSection = { heading:string; paragraphs:string[] };
export type BlogTranslation = {title:string;excerpt:string;lead:string;sections:BlogSection[]};
export type BlogPost = {slug:string;topic:BlogTopic;guideCategories:string[];guideSlugs:string[];service:{pl:string;en:string};caseStudy?:{pl:string;en:string};pl:BlogTranslation;en:BlogTranslation};
export const BLOG_PUBLISHED_DATE="2026-11-07";
export const blogPosts: BlogPost[] = [
  {
    "slug": "od-reklamy-do-sprzedazy-meta-ads-crm",
    "topic": "marketing",
    "guideCategories": [
      "meta-ads"
    ],
    "service": {
      "pl": "/marketing-i-reklamy",
      "en": "/en/services/marketing"
    },
    "caseStudy": {
      "pl": "/case-studies/re-energy-meta-ads",
      "en": "/en/case-studies/re-energy-meta-ads"
    },
    "guideSlugs": [
      "ile-kosztuje-lead-z-facebook-ads",
      "meta-lead-ads-formularz-jest-crm-pusty",
      "meta-leady-tanie-ale-nie-jakosciowe",
      "crm-licznik-leadow-nie-zgadza-sie-z-lista"
    ],
    "pl": {
      "title": "Od reklamy do sprzedaży: jak połączyć Meta Ads, formularze i CRM",
      "excerpt": "Dlaczego niska cena leada nie wystarcza? Praktyczny model: reklama, kwalifikacja, CRM, szybka reakcja i pomiar wyniku.",
      "lead": "Reklama jest początkiem procesu sprzedaży, a nie jego końcem. Firma może pozyskiwać wiele tanich kontaktów i wciąż nie mieć nad nimi kontroli. Skuteczny układ łączy ofertę, formularz, przypisanie handlowca, rozmowę i informację zwrotną do kampanii.",
      "sections": [
        {
          "heading": "Najpierw ustal, jaki kontakt ma wartość",
          "paragraphs": [
            "Sam formularz nie jest sprzedażą. Oddziel liczbę wysłanych zgłoszeń od kontaktów, z którymi udało się porozmawiać, które mają potrzebę oraz realną możliwość zakupu. Już na etapie reklamy opisz usługę i podstawowe warunki, aby ograniczyć przypadkowe zapytania.",
            "Zapisz kryteria kwalifikacji: obszar działania, rodzaj usługi, termin realizacji i wymagane dane kontaktowe. Formularz nie powinien być jednak tak długi, że porzucą go osoby zdecydowane. Pytania dobieraj do decyzji, które handlowiec naprawdę musi podjąć."
          ]
        },
        {
          "heading": "Przekazanie leada do CRM to osobny proces",
          "paragraphs": [
            "Po wysłaniu formularza kontakt powinien trafić do właściwego zespołu, mieć identyfikator źródła, status i osobę odpowiedzialną. Automatyzacja nie może kończyć się na zielonym komunikacie «wysłano» — trzeba sprawdzić, czy rekord rzeczywiście dotarł i jest widoczny dla opiekuna.",
            "Zdefiniuj obsługę błędów webhooka, duplikatów i powtórzonych dostarczeń. Zapisuj czas zgłoszenia i pierwszej próby kontaktu. Jeśli integracja przestanie działać, potrzebujesz alertu oraz procedury odzyskania zgłoszeń, a nie ręcznego zgadywania, czego brakuje."
          ]
        },
        {
          "heading": "Mierz jakość i tempo reakcji",
          "paragraphs": [
            "Przydatny pulpit pokazuje nie tylko CPL, ale również odsetek poprawnych numerów, odebranych rozmów, umówionych spotkań, ofert i sprzedaży. Porównuj te wyniki w spójnym okresie oraz według tej samej definicji leada. Bez danych z handlu nie da się wiarygodnie liczyć kosztu pozyskania klienta ani zwrotu z reklam.",
            "Każdy status powinien odpowiadać rzeczywistemu zdarzeniu. Jeśli CRM opisuje wszystkie nieodebrane telefony jako «stracone», analiza będzie błędna. Warto osobno śledzić brak kontaktu, odmowę, niewłaściwy obszar i umówiony kolejny termin."
          ]
        },
        {
          "heading": "Co wdrożyć najpierw — bez przebudowy całej firmy",
          "paragraphs": [
            "Zacznij od jednej kampanii i jednego formularza. Wykonaj testowy lead, sprawdź przydzielenie, zobacz powiadomienie, zadzwoń i zamknij test ze statusem. Dopiero potem dodawaj kolejnych handlowców, reguły i raporty. W praktyce proste rozwiązanie, które działa codziennie, jest lepsze niż rozbudowany CRM bez właściciela procesu.",
            "Przykład zastosowania tego podejścia pokazuje współpraca przy kampaniach OZE: reklama dostarcza zapytanie, ale o dalszym wyniku decyduje również sposób prowadzenia rozmowy i obsługi kontaktu. Konkretną liczbę leadów warto czytać razem z opisem procesu, a nie jako obietnicę podobnego rezultatu dla każdej firmy."
          ]
        }
      ]
    },
    "en": {
      "title": "From Meta Ads to Sales: Connecting Lead Forms, CRM and Follow-Up",
      "excerpt": "A practical workflow from advertising to qualified leads, CRM assignments, prompt follow-up and meaningful performance metrics.",
      "lead": "An ad starts the sales process; it does not finish it. A business can generate cheap enquiries yet lose track of them. A stronger setup connects the offer, lead form, CRM assignment, sales conversation and performance feedback.",
      "sections": [
        {
          "heading": "Define what makes an enquiry valuable",
          "paragraphs": [
            "A submitted form is not a sale. Separate the number of enquiries from the contacts you reached, qualified and converted. Set the right expectations in the ad so that visitors understand the service before leaving their details.",
            "Choose qualification criteria the sales team actually uses: service area, scope, expected timing and contact details. Avoid building a form so long that genuinely interested customers abandon it."
          ]
        },
        {
          "heading": "Delivering leads to your CRM is a separate workflow",
          "paragraphs": [
            "After submission, the enquiry needs a source, status and a named owner. Do not assume a form confirmation means that your CRM received the record. Test whether the correct salesperson can see it.",
            "Plan for webhook errors, retries and duplicate submissions. Record the submission time and first contact attempt. Add failure alerts and a recovery procedure instead of losing leads silently."
          ]
        },
        {
          "heading": "Measure quality and response time",
          "paragraphs": [
            "A useful dashboard shows more than cost per lead. Track valid phone numbers, conversations, appointments, offers and eventual sales. Compare the same time period and consistent definitions. Without sales data, customer acquisition cost and advertising return remain uncertain.",
            "CRM statuses should describe real events. An unanswered phone call is not necessarily a lost opportunity. Distinguish unreachable contacts from disqualified leads, declined offers and scheduled follow-ups."
          ]
        },
        {
          "heading": "Start with one working process",
          "paragraphs": [
            "Choose one campaign and one form. Submit a test enquiry, verify its assignment and notification, complete a callback and close the record with a status. Only then expand routing rules and reporting. A simple reliable process is more useful than a complicated CRM without ownership.",
            "The renewable energy campaign case study illustrates the relationship between lead generation and sales operations. Campaign numbers describe the flow of enquiries, while follow-up determines what happens next. They should not be read as guaranteed outcomes for another business."
          ]
        }
      ]
    }
  },
  {
    "slug": "crm-dla-firmy-od-arkusza-do-systemu",
    "topic": "crm",
    "guideCategories": [
      "crm-leady"
    ],
    "service": {
      "pl": "/crm-i-aplikacje-webowe",
      "en": "/en/services/crm"
    },
    "caseStudy": {
      "pl": "/case-studies/b-crm",
      "en": "/case-studies/b-crm"
    },
    "guideSlugs": [
      "crm-licznik-leadow-nie-zgadza-sie-z-lista",
      "crm-odblokowany-lead-nadal-niewidoczny",
      "crm-paginacja-pokazuje-tylko-pierwsze-leady",
      "supabase-rls-pusta-lista-po-logowaniu"
    ],
    "pl": {
      "title": "Kiedy firma potrzebuje CRM zamiast arkusza? Plan wdrożenia bez chaosu",
      "excerpt": "Jak rozpoznać moment, w którym Excel przestaje wystarczać, i zaplanować CRM dla leadów, handlowców oraz obsługi klienta.",
      "lead": "Arkusz kalkulacyjny jest dobry, dopóki zespół umie szybko odpowiedzieć: kto prowadzi klienta, kiedy trzeba oddzwonić i co wydarzyło się ostatnio. Jeżeli odpowiedzi zależą od telefonu do kolegi albo przeszukiwania kilku plików, problemem nie jest wygląd tabeli, lecz brak wspólnego procesu.",
      "sections": [
        {
          "heading": "Objawy, że arkusz zaczyna ograniczać sprzedaż",
          "paragraphs": [
            "Te same zgłoszenia trafiają do dwóch osób, oddzwonienia wypadają z kalendarza, a nieaktualne wersje arkusza rozjeżdżają dane. Brakuje również historii: nie wiadomo, kto zmienił status i czy klient otrzymał obiecaną ofertę.",
            "Nie każda firma potrzebuje systemu na zamówienie. Jeśli kilka osób pracuje na prostej liście i nie ma automatycznych integracji, gotowe narzędzie może wystarczyć. Najpierw opisz powtarzające się problemy, potem oceniaj oprogramowanie."
          ]
        },
        {
          "heading": "Minimalny CRM powinien rozwiązywać cztery zadania",
          "paragraphs": [
            "Każdy kontakt ma jednego właściciela, status, termin kolejnej akcji i uporządkowaną historię. Manager widzi obciążenie zespołu, handlowiec swoje zadania, a administrator może zarządzać dostępem. Uprawnienia muszą być egzekwowane przez serwer i bazę danych, nie wyłącznie przez ukrycie przycisku.",
            "Potrzebujesz również szybkiego wyszukiwania, filtrów i paginacji. Gdy licznik pokazuje 180 rekordów, a lista 100, przyczyną bywa limit API lub inny zakres filtrów. Takie zachowania trzeba testować przed wdrożeniem na prawdziwe dane."
          ]
        },
        {
          "heading": "Zbuduj przepływ testowy przed rozbudową funkcji",
          "paragraphs": [
            "Przetestuj drogę zgłoszenia: utworzenie, przypisanie, pierwsza rozmowa, termin kontaktu, oferta, wygrana albo rezygnacja. Sprawdź przypadki wyjątkowe — brak numeru, zmiana opiekuna, równoczesna edycja i usunięte uprawnienia.",
            "Integracja z reklamami i formularzami ma sens dopiero wtedy, gdy wiadomo, kto przejmuje nowe zadanie. Wprowadź powiadomienia tylko tam, gdzie prowadzą do działania. Zbyt wiele komunikatów powoduje, że zespół zaczyna je ignorować."
          ]
        },
        {
          "heading": "Jak ocenić wdrożenie po miesiącu",
          "paragraphs": [
            "Sprawdź, czy zmniejszyła się liczba zgłoszeń bez opiekuna i zaległych oddzwonień. Zobacz, jak długo zajmuje odnalezienie historii klienta i przygotowanie zestawienia. Ważniejsza od liczby funkcji jest codzienna praca zespołu na tych samych danych.",
            "Rozbudowę planuj na podstawie rzeczywistych wąskich gardeł. Dopiero po opanowaniu podstaw dodawaj dokumenty, kalendarze instalacji, rozliczenia prowizji czy kolejne role. Unikniesz kosztownej przebudowy procesu po kilku tygodniach."
          ]
        }
      ]
    },
    "en": {
      "title": "When Does a Business Need CRM Instead of Spreadsheets?",
      "excerpt": "A practical roadmap from scattered spreadsheets to shared leads, assigned tasks, access controls and reliable sales follow-up.",
      "lead": "Spreadsheets work until the team struggles to answer who owns a lead, when to call back and what happened last. If those answers require several files and phone calls, the main problem is a fragmented process, not the design of a table.",
      "sections": [
        {
          "heading": "Signs the spreadsheet is limiting the team",
          "paragraphs": [
            "Two people contact the same customer, follow-ups disappear and different copies of a spreadsheet disagree. The team may also lack an audit trail showing who changed a status and whether the promised offer was sent.",
            "A custom-built system is not automatically the best choice. A small team with a straightforward contact list may be better served by existing CRM software. Identify repeated failures before buying or building features."
          ]
        },
        {
          "heading": "Four essentials for an initial CRM",
          "paragraphs": [
            "Every lead needs an owner, a status, a next action and a reliable history. Managers need an overview while sales representatives need their own task lists. Permissions must be enforced in the database and backend, not just by hiding controls.",
            "Search, filtering and pagination matter as the list grows. If the counter shows 180 records but the list stops at 100, a query limit or inconsistent filter may be the cause. Test such cases before importing live business data."
          ]
        },
        {
          "heading": "Test the complete workflow first",
          "paragraphs": [
            "Run an enquiry from creation through assignment, conversation, follow-up, quotation and closure. Include edge cases: missing contact details, reassignment, concurrent edits and revoked access.",
            "Connect advertising and forms only after defining who receives new leads. Alerts should be actionable rather than constant background noise. Too many notifications quickly lose their usefulness."
          ]
        },
        {
          "heading": "Review the results after a month",
          "paragraphs": [
            "Look for fewer unassigned enquiries, fewer overdue callbacks and faster access to customer history. A shared, trusted data set matters more than a long list of rarely used features.",
            "Build advanced features around real bottlenecks. Documents, scheduling, commissions and new permission roles can come later. This reduces the risk of paying to rebuild an overly ambitious first version."
          ]
        }
      ]
    }
  },
  {
    "slug": "indeksacja-google-mapa-witryny-linkowanie",
    "topic": "seo",
    "guideCategories": [
      "seo-google"
    ],
    "service": {
      "pl": "/tworzenie-stron-internetowych",
      "en": "/en/services/websites"
    },
    "guideSlugs": [
      "google-sitemap-zgloszona-a-strony-brak",
      "google-zeskanowano-ale-nie-zindeksowano",
      "seo-google-pagination-canonical",
      "seo-podstrony-miasta-duplikat-tresci"
    ],
    "pl": {
      "title": "Sitemap, indeksacja i linkowanie: jak zbudować widoczną bazę treści",
      "excerpt": "Dlaczego 1000 adresów w sitemap nie oznacza 1000 wyników Google? Plan architektury poradników, kategorii i bloga.",
      "lead": "Witryna może mieć setki poprawnych adresów w sitemap.xml i niewiele widocznych wyników Google. Mapa pomaga robotowi poznawać adresy, ale nie zastępuje wartości treści ani linkowania między podstronami. Dlatego rozbudowę bazy artykułów warto zacząć od architektury informacji, nie od licznika opublikowanych URL-i.",
      "sections": [
        {
          "heading": "Sitemap to lista adresów, nie nakaz indeksacji",
          "paragraphs": [
            "Najpierw sprawdź, czy strona zwraca HTTP 200, nie ma noindex i wskazuje właściwy canonical. Następnie zweryfikuj konkretny URL przez Inspekcję adresu w Google Search Console. Sukces wysłania mapy nie potwierdza indeksowania każdej podstrony.",
            "Nie dopisuj ręcznie dat aktualizacji, jeśli treści się nie zmieniły. Mapa witryny powinna odzwierciedlać strony, które rzeczywiście chcesz indeksować, i aktualizować się automatycznie wraz z publikacją oraz usunięciem artykułów."
          ]
        },
        {
          "heading": "Połącz strony w logiczne klastry tematyczne",
          "paragraphs": [
            "Poradnik rozwiązuje jeden objaw, na przykład błąd sitemap. Artykuł blogowy może wyjaśnić szerszy proces: od przygotowania treści przez crawl do indeksacji. Kategoria łączy podobne instrukcje, a strona usługowa pokazuje, w czym można uzyskać praktyczną pomoc.",
            "Linki powinny być opisowe i osadzone tam, gdzie ułatwiają zrozumienie tematu. Nie twórz wielkiej ściany odnośników tylko po to, by każda podstrona prowadziła do każdej. Kilka dobrze wybranych połączeń jest bardziej użytecznych dla człowieka."
          ]
        },
        {
          "heading": "Pilnuj stron osieroconych i duplikatów",
          "paragraphs": [
            "Każda ważna podstrona powinna mieć normalny link HTML z katalogu, kategorii lub powiązanego artykułu. Jeśli katalog ma paginację, dalsze strony muszą być dostępne za pomocą klikalnych linków. Nieskończone przewijanie bez adresów kolejnych stron potrafi utrudniać odkrywanie treści.",
            "Tworzenie wielu stron pod niewielkie odmiany tego samego pytania nie daje automatycznej przewagi. Usuń lub połącz materiały, które nie rozwiązują odrębnego problemu. Zadbaj, aby obiecana odpowiedź znajdowała się na stronie, a nie tylko w tytule."
          ]
        },
        {
          "heading": "Mierz indeksowanie zamiast liczby nowych URL-i",
          "paragraphs": [
            "Monitoruj w Search Console, które strony zostały wykryte, zeskanowane i zaindeksowane. Porównuj klastry i konkretne adresy: być może problemem jest duplikacja, niewystarczająca treść, canonical albo błędy serwera. Patrz również na wejścia z wyszukiwarki oraz zapytania użytkowników.",
            "Najlepszy rytm rozwoju to publikacja, kontrola jakości, linkowanie, analiza danych i aktualizacja. Dodawanie 100 artykułów dziennie bez analizy widoczności może zwiększać koszty utrzymania bez proporcjonalnego wzrostu ruchu."
          ]
        }
      ]
    },
    "en": {
      "title": "Sitemaps, Indexing and Internal Links: A Content Architecture Guide",
      "excerpt": "Why 1,000 URLs in a sitemap do not mean 1,000 indexed pages, and how to connect guides, categories, blog posts and services.",
      "lead": "A website can have hundreds of valid URLs in sitemap.xml yet appear for relatively few searches. Sitemaps help search engines discover URLs, but they do not replace useful content or internal links. Plan your information architecture before chasing a publication count.",
      "sections": [
        {
          "heading": "A sitemap is not an instruction to index every URL",
          "paragraphs": [
            "Start by checking that a page returns HTTP 200, is not marked noindex and declares the right canonical URL. Then inspect the particular URL in Google Search Console. A successfully submitted sitemap does not prove that every page is indexed.",
            "Do not invent update dates when content has not changed. Your sitemap should represent pages you genuinely want discovered and update as articles are published or removed."
          ]
        },
        {
          "heading": "Build clusters around meaningful topics",
          "paragraphs": [
            "A troubleshooting guide answers one concrete question, such as an invalid sitemap error. A blog article can explain the broader process from content creation to crawling and indexing. Category pages connect similar guides while service pages show how the work can be implemented.",
            "Use descriptive, contextual links. A giant block that connects every page to every other page adds little value. A few closely related resources help people follow the next logical step."
          ]
        },
        {
          "heading": "Watch for orphan pages and duplication",
          "paragraphs": [
            "Every important article should have a crawlable HTML link from the directory, a category or another relevant page. Paginated directories need accessible links to later pages. Infinite scrolling without crawlable pagination may hide content from search engines.",
            "Generating many pages for minor variations of one question does not automatically improve search visibility. Merge or remove material that fails to solve a distinct problem. The promised answer must exist on the page, not just in the title."
          ]
        },
        {
          "heading": "Measure indexed pages, not publication volume",
          "paragraphs": [
            "Use Search Console to distinguish discovered, crawled and indexed URLs. Compare topical clusters and individual pages. Duplicated content, canonical issues and server errors may explain why a URL is missing.",
            "A better publishing cycle is: write, review, link, measure and update. Publishing a hundred new pages per day without monitoring can increase maintenance work without a corresponding benefit."
          ]
        }
      ]
    }
  },
  {
    "slug": "strona-firmowa-ktora-zamienia-ruch-w-zapytania",
    "topic": "websites",
    "guideCategories": [
      "strony-ux",
      "formularze-api"
    ],
    "service": {
      "pl": "/tworzenie-stron-internetowych",
      "en": "/en/services/websites"
    },
    "caseStudy": {
      "pl": "/case-studies",
      "en": "/en/case-studies"
    },
    "guideSlugs": [
      "ile-kosztuje-strona-internetowa",
      "formularz-strona-nie-dziala-500",
      "mobile-viewport-przeskakuje-przewijanie",
      "nextjs-hydration-failed-jak-naprawic"
    ],
    "pl": {
      "title": "Strona firmowa, która zamienia ruch w zapytania: 7 decyzji przed wdrożeniem",
      "excerpt": "Na co zwrócić uwagę, aby strona była czytelna na telefonie, miała skuteczny kontakt i nie traciła zapytań przez techniczne błędy.",
      "lead": "Ładny projekt to tylko część dobrze działającej strony firmowej. Użytkownik musi szybko dowiedzieć się, co oferujesz, dla kogo pracujesz i co ma zrobić dalej. Właściciel firmy powinien z kolei wiedzieć, skąd pojawiają się zapytania i czy formularze rzeczywiście działają.",
      "sections": [
        {
          "heading": "Ustal jedno główne zadanie strony",
          "paragraphs": [
            "Strona usługowa może zbierać zapytania, rezerwacje lub telefony. Nie próbuj równie mocno eksponować dziesięciu różnych działań. Jasny nagłówek, krótki opis oferty i widoczny kontakt zazwyczaj pomagają bardziej niż kolejna ozdobna animacja.",
            "Oddziel osoby, które szukają szybkiego kontaktu, od tych, które muszą zobaczyć realizacje, zakres prac i odpowiedzi na pytania. Przygotuj dla nich logiczne ścieżki w nawigacji i treści."
          ]
        },
        {
          "heading": "Projektuj mobile jako podstawowy scenariusz",
          "paragraphs": [
            "Sprawdź czytelność nagłówka, odstępy, wielkość przycisków i sposób kadrowania zdjęć. Zmiana wysokości paska przeglądarki na telefonie potrafi przesuwać hero, jeśli układ nadmiernie polega na 100vh.",
            "Nie kładź ważnego tekstu na twarzy osoby ze zdjęcia. Nie wprowadzaj animacji, która skacze przy przewijaniu albo utrudnia formularz. Wrażenie profesjonalizmu tworzy również przewidywalny i szybki interfejs."
          ]
        },
        {
          "heading": "Formularz musi dostarczać kontakt, nie tylko udawać sukces",
          "paragraphs": [
            "Po wysłaniu testowego formularza zweryfikuj zapis lub dostarczenie wiadomości do docelowej skrzynki i sprawdź poprawne odpowiedzi API. Nie wyświetlaj sukcesu przed otrzymaniem potwierdzenia z serwera. Po stronie bezpieczeństwa zastosuj walidację, ochronę przed spamem i ograniczenia liczby żądań.",
            "Zadbaj o sensowny komunikat przy błędzie oraz alternatywny kanał kontaktu. Jeśli email z formularza nie dochodzi przez konfigurację domeny, samo zmienianie wyglądu przycisku niczego nie naprawi."
          ]
        },
        {
          "heading": "Po publikacji sprawdzaj działanie i wyszukiwalność",
          "paragraphs": [
            "Ustal, kto ma dostęp do domeny, hostingu, analityki i systemu kontaktowego. Przetestuj stronę na kilku ekranach i sprawdź wersję produkcyjną, nie tylko lokalny podgląd. Skontroluj szybkość, poprawne przekierowania, metadane i sitemap.",
            "Połącz ofertę z realnymi realizacjami, konkretnymi poradnikami i kontaktem. Rozbudowuj zawartość na podstawie pytań klientów, a nie samej liczby słów. Każda nowa podstrona ma ułatwiać podjęcie decyzji albo rozwiązać konkretny problem."
          ]
        }
      ]
    },
    "en": {
      "title": "Business Websites That Turn Traffic into Enquiries: 7 Key Decisions",
      "excerpt": "How to build a clear mobile experience, reliable lead forms and useful paths from search traffic to genuine customer enquiries.",
      "lead": "Good-looking design is only part of an effective business website. Visitors should quickly understand what you offer, who you work with and what to do next. A business owner also needs to know where enquiries come from and whether the contact process actually works.",
      "sections": [
        {
          "heading": "Choose one primary goal for the page",
          "paragraphs": [
            "A service page can drive enquiries, bookings or phone calls. Do not give ten competing actions equal visual weight. A clear headline, concise offer and visible contact option usually matter more than another decorative animation.",
            "Some visitors want immediate contact; others need examples, scope and answers to questions. Create logical paths through the content and navigation for both groups."
          ]
        },
        {
          "heading": "Treat mobile as a primary experience",
          "paragraphs": [
            "Check headline readability, spacing, button sizes and image cropping. The browser interface on phones changes the visible viewport; a layout built entirely around 100vh can jump while scrolling.",
            "Avoid putting important text over someone's face in a photograph. Do not use animations that interfere with reading or submitting a form. A predictable, fast interface is part of a professional impression."
          ]
        },
        {
          "heading": "Contact forms must deliver enquiries reliably",
          "paragraphs": [
            "After submitting a test form, check that the enquiry reaches its destination and that the API returns a genuine success response. Never display a success message before the server confirms it. Use validation, anti-spam checks and appropriate rate limits.",
            "Provide useful error feedback and an alternative contact method. If messages are lost because of email domain configuration, changing the button design cannot solve the problem."
          ]
        },
        {
          "heading": "Monitor the live site after launch",
          "paragraphs": [
            "Know who controls the domain, hosting, analytics and contact system. Test on several screens and inspect the production site, not just a development preview. Review performance, redirects, metadata and the sitemap.",
            "Connect the offer to authentic case studies, useful guides and contact information. Expand the site using real customer questions rather than word-count targets. Every new page should help visitors make a decision or solve a defined problem."
          ]
        }
      ]
    }
  }
];
export const blogTopicLabels:Record<BlogLanguage,Record<BlogTopic,string>>={
 pl:{marketing:"Marketing i sprzedaż",crm:"CRM i procesy",seo:"SEO i widoczność",websites:"Strony internetowe"},
 en:{marketing:"Marketing and sales",crm:"CRM and workflows",seo:"SEO and search",websites:"Websites"}
};
export function getBlogPost(slug:string){return blogPosts.find(post=>post.slug===slug);}
export function blogPostsForGuideCategory(category:string, limit=2){
 return blogPosts.filter(post=>post.guideCategories.includes(category)).slice(0,Math.max(0,Math.min(4,limit)));
}
export function blogRelatedPosts(slug:string,limit=3){
 const post=getBlogPost(slug);if(!post)return [];
 return blogPosts.filter(item=>item.slug!==slug).sort((a,b)=>Number(b.topic===post.topic)-Number(a.topic===post.topic)).slice(0,limit);
}
