import cases0 from "./offline/batch2-react-typescript.json";
import cases1 from "./offline/batch2-nextjs-router.json";
import cases2 from "./offline/batch2-supabase-auth.json";
import cases3 from "./offline/batch2-supabase-storage.json";
import cases4 from "./offline/batch2-github-vercel.json";
import cases5 from "./offline/batch2-google-seo.json";
import cases6 from "./offline/batch2-wordpress.json";
import cases7 from "./offline/batch2-meta-ads.json";
import cases8 from "./offline/batch2-http-api.json";
import cases9 from "./offline/batch2-dns-crm.json";

/** 200 source-based editorial cases. No generative AI API is used for this batch. */
export const offlineBatchTwoCases = [
  ...[...cases0, ...cases1].map((item) => ({ slug:item.slug,title:item.title,symptom:item.symptom,diagnose:item.inspect.join(" "),fix:item.fix.join(" "),verify:item.verify,source:item.source,category:item.category,cause:item.cause,warning:item.warning })),
  ...cases2,
  ...cases3,
  ...cases4,
  ...cases5,
  ...cases6,
  ...cases7,
  ...cases8,
  ...cases9,
];

const services: Record<string, readonly [string,string]> = {
  "nextjs-react": ["/crm-i-aplikacje-webowe","Aplikacje internetowe"],
  "supabase-bazy": ["/crm-i-aplikacje-webowe","CRM i bazy danych"],
  "vercel-hosting": ["/tworzenie-stron-internetowych","Wdrożenia i hosting"],
  "automatyzacje": ["/crm-i-aplikacje-webowe","Automatyzacje"],
  "seo-google": ["/tworzenie-stron-internetowych","SEO i strony"],
  "wordpress": ["/tworzenie-stron-internetowych","WordPress"],
  "meta-ads": ["/marketing-i-reklamy","Reklamy i marketing"],
  "domeny-poczta": ["/tworzenie-stron-internetowych","Domeny i poczta"],
  "formularze-api": ["/crm-i-aplikacje-webowe","Integracje i API"],
  "crm-leady": ["/crm-i-aplikacje-webowe","CRM i obsługa leadów"]
};

const safetyNotes: Record<string,string> = {
  "nextjs-react": "Testuj kompilację produkcyjną i działanie po przeładowaniu, nie tylko tryb developerski. Nie publikuj prywatnych tokenów z DevTools.",
  "supabase-bazy": "Wprowadzaj zmiany uprawnień i schematu najpierw na danych testowych z kopią zapasową. Nie umieszczaj service_role w przeglądarce.",
  "vercel-hosting": "Zachowaj poprzedni działający deployment aż do potwierdzenia nowego pod własną domeną. Unikaj wypisywania sekretów w logach.",
  "automatyzacje": "Stosuj minimalne uprawnienia tokenów i idempotencję ponowień. Nie usuwaj ochrony gałęzi main tylko dla wygody automatu.",
  "seo-google": "Indeksacja i pozycja w wyszukiwarce nie są gwarantowane. Nie twórz wtórnych kopii strony ani sztucznych wyników testów.",
  "wordpress": "Zrób kopię zapasową przed migracją lub aktualizacją PHP. Nie wpisuj danych dostępu w niezaufane formularze.",
  "meta-ads": "Mierz wyniki w tym samym okresie i według tej samej definicji konwersji. Chroń dane kontaktowe leadów i przestrzegaj zasad platformy.",
  "domeny-poczta": "Zanim zmienisz DNS, ustal autorytatywne serwery nazw. Nie publikuj haseł SMTP ani prywatnych kluczy DKIM.",
  "formularze-api": "Nie wyłączaj autoryzacji ani walidacji podpisu webhooka dla statusu 200. Zamazuj tokeny w logach.",
  "crm-leady": "Przeprowadzaj testy na zanonimizowanych danych i kontroluj uprawnienia po stronie serwera, a nie tylko w interfejsie."
};
const evidenceHints: Record<string,string> = {
  "nextjs-react": "Porównaj komunikat z konsoli z wynikiem kompilacji produkcyjnej oraz stanem po odświeżeniu strony.",
  "supabase-bazy": "Porównaj wynik dla uprawnionego i nieuprawnionego użytkownika, nazwę projektu i dokładny kod błędu.",
  "vercel-hosting": "Porównaj SHA commita, status deploymentu i odpowiedź HTTP pod ostateczną domeną, nie sam status READY.",
  "automatyzacje": "Sprawdź typ zdarzenia workflow, permissions joba, identyfikator przebiegu i pierwszy nieudany krok.",
  "seo-google": "Sprawdź serwerowy HTML, status HTTP, canonical i robots dla finalnego adresu produkcyjnego.",
  "wordpress": "Sprawdź log błędów, ostatnie zmiany wtyczek i wersję środowiska na kopii testowej witryny.",
  "meta-ads": "Porównaj status na poziomie konta, kampanii, zestawu i reklamy; odróżnij kliknięcia od pozyskanych klientów.",
  "domeny-poczta": "Zbadaj publiczny DNS oraz nagłówki Authentication-Results rzeczywistej wiadomości testowej.",
  "formularze-api": "Zapisz metodę, status, nagłówki i zanonimizowane body żądania oraz odpowiedzi.",
  "crm-leady": "Porównaj identyfikator rekordu, aktualne filtry, role i wynik zapytania bazy z widokiem panelu."
};

export const offlineBatchTwoGuides = offlineBatchTwoCases.map((item) => {
  const [service, serviceLabel] = services[item.category] ?? ["/crm-i-aplikacje-webowe","Aplikacje internetowe"];
  const note: string = ("warning" in item && typeof item.warning === "string") ? item.warning : (safetyNotes[item.category] ?? "Nie publikuj prywatnych danych ani sekretów.");
  const cause: string = ("cause" in item && typeof item.cause === "string") ? item.cause : "Przyczyna wymaga sprawdzenia w rzeczywistym środowisku.";
  return {
    slug: item.slug,
    title: item.title,
    description: item.symptom,
    intro: item.symptom + " " + cause,
    service,serviceLabel,
    category: item.category,
    offlinePseo: true as const,
    sections: [
      {title:"Jak rozpoznać źródło problemu",paragraphs:[item.diagnose,evidenceHints[item.category] ?? "Zapisz dokładny komunikat, wersję środowiska oraz warunki wystąpienia problemu."]},
      {title:"Kroki naprawcze",paragraphs:[item.fix]},
      {title:"Jak przetestować rozwiązanie",paragraphs:[item.verify]},
      {title:"Bezpieczeństwo i ograniczenia",paragraphs:[note]}
    ],
    sources:[{label:"Dokumentacja producenta lub oficjalny standard",url:item.source}]
  };
});
