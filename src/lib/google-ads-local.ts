/**
 * Hipotetyczne scenariusze dopasowania kampanii do branż w danym mieście.
 * To przykłady zastosowań, nie statystyki, obietnice efektu ani deklaracje lokalnych realizacji.
 */
export const googleAdsCityPlans = {
  warszawa: {
    focus: "Usługi B2B, specjalistyczne oraz zespoły obsługujące kilka dzielnic i miast ościennych.",
    intent: "Rozdzielenie haseł ogólnych od precyzyjnych zapytań o konkretną usługę oraz podział kampanii według obszaru faktycznej obsługi.",
    landing: "Dla usług wieloetapowych warto pokazać proces, przykłady zastosowań i możliwość umówienia konsultacji.",
  },
  krakow: {
    focus: "Usługi specjalistyczne, rezerwacje oraz firmy pracujące zarówno z klientem lokalnym, jak i przyjezdnym.",
    intent: "Osobne komunikaty dla osób szukających usługi natychmiast oraz dla klientów porównujących oferty.",
    landing: "W kampaniach rezerwacyjnych sprawdza się widoczny termin, lokalizacja realizacji i jasny zakres usługi.",
  },
  wroclaw: {
    focus: "Przedsiębiorstwa usługowe i B2B ze sprzedażą konsultacyjną i kilkoma etapami kontaktu.",
    intent: "Weryfikacja słów związanych z intencją zakupu, konsultacją i zamówieniem usługi zamiast samych haseł informacyjnych.",
    landing: "Przekierowanie do odpowiedniej podstrony ofertowej i zapis jakości leadów w CRM pozwalają oceniać wynik poza kliknięciem.",
  },
  poznan: {
    focus: "Firmy handlowe, dostawcy usług i sklepy obsługujące klientów z Poznania i okolic.",
    intent: "Oddzielenie zapytań ofertowych od zapytań o pracę, darmowe materiały i instrukcje.",
    landing: "Warto przetestować kartę usługi z konkretnymi warunkami współpracy i krótkim formularzem.",
  },
  gdansk: {
    focus: "Usługi lokalne, turystyka i biznesy, w których sezonowość wpływa na liczbę zapytań.",
    intent: "Sezonowa kontrola terminów, godzin emisji i realnej dostępności usługi.",
    landing: "Strona powinna jasno określać obsługiwany obszar, terminy oraz warunki rezerwacji.",
  },
  szczecin: {
    focus: "Firmy usługowe i handlowe pozyskujące klientów lokalnie oraz z obszarów przygranicznych.",
    intent: "Rozróżnienie zapytań polskojęzycznych i zagranicznych oraz kierowanie do odpowiednich wersji oferty, jeśli takie istnieją.",
    landing: "Dla różnych grup językowych lepiej przygotować faktycznie przetłumaczone informacje niż jeden przypadkowy landing.",
  },
  lodz: {
    focus: "Lokalne usługi, firmy handlowe i przedsiębiorstwa z procesem ofertowania.",
    intent: "Podział słów kluczowych na nazwę usługi, zastosowanie i pilność zakupu.",
    landing: "Warto ograniczyć liczbę pól formularza, ale zachować minimum informacji potrzebnych do wstępnej wyceny.",
  },
  katowice: {
    focus: "Usługi dla firm i przedsiębiorstwa obsługujące aglomerację śląską, a nie wyłącznie centrum Katowic.",
    intent: "Dopasowanie lokalizacji do realnych możliwości obsługi w kilku miastach sąsiednich.",
    landing: "Na stronie docelowej trzeba podać rzeczywisty obszar realizacji, nie sugerując biura w każdej lokalizacji.",
  },
  lublin: {
    focus: "Usługi dla klientów lokalnych i firm z województwa lubelskiego, które otrzymują wyceny po formularzu.",
    intent: "Łączenie nazwy usługi z lokalnym zapytaniem i wykluczenie zapytań niekomercyjnych.",
    landing: "Wyraźna oferta, przykładowy zakres prac i prosty przycisk zamówienia wyceny mogą ograniczyć liczbę przypadkowych leadów.",
  },
  rzeszow: {
    focus: "Usługi B2B, firmy wykonawcze oraz przedsiębiorcy z Rzeszowa i Podkarpacia.",
    intent: "Oddzielenie zapytań informacyjnych od haseł z zamiarem uzyskania wyceny lub kontaktu.",
    landing: "Telefon, krótki formularz i potwierdzenie obsługi na Podkarpaciu powinny być czytelne bez powiększania ekranu.",
  },
  bialystok: {
    focus: "Firmy usługowe, handel i zapytania o realizacje w Białymstoku oraz pobliskich miejscowościach.",
    intent: "Rozdzielenie fraz lokalnych od kampanii kierowanych szerzej na region.",
    landing: "Dobrym punktem startowym jest strona z zakresem realizacji, obszarem działania i czytelnym sposobem kontaktu.",
  },
  kielce: {
    focus: "Usługi lokalne i wykonawcze, w których ważna jest szybka reakcja na prośbę o ofertę.",
    intent: "Weryfikacja wyszukiwanych haseł dotyczących zlecenia i kosztów realizacji.",
    landing: "W formularzu warto określić rodzaj usługi i oczekiwany termin, bez wymuszania nadmiernej ilości danych.",
  },
  olsztyn: {
    focus: "Usługi związane z obsługą mieszkańców i klientów sezonowych w Olsztynie oraz regionie.",
    intent: "Harmonogram i budżet warto dopasowywać do rzeczywistej dostępności obsługi, nie do ogólnych szacunków.",
    landing: "W landing page przydatne mogą być aktualne terminy, obszar dojazdu i sposób potwierdzenia rezerwacji.",
  },
  torun: {
    focus: "Lokalne usługi, sprzedaż internetowa i firmy kierujące zapytania do jednego zespołu obsługi.",
    intent: "Porównanie zapytań ogólnopolskich z tymi zawierającymi nazwę miasta.",
    landing: "Pomiar zgłoszeń powinien obejmować formularz i dalszą obsługę w CRM, żeby nie optymalizować wyłącznie pod kliknięcia.",
  },
  bydgoszcz: {
    focus: "Firmy usługowe i produkcyjne otrzymujące szczegółowe zapytania ofertowe.",
    intent: "Dobór fraz związanych z konkretnym problemem, materiałem lub typem usługi zamiast bardzo ogólnych tematów.",
    landing: "Warto pokazać parametry realizacji, proces wyceny i sposób przekazania specyfikacji.",
  },
  opole: {
    focus: "Małe i średnie firmy świadczące konkretne usługi na terenie Opola i okolic.",
    intent: "Ograniczenie przypadkowych wyszukiwań spoza obszaru pracy i weryfikacja ustawień lokalizacji.",
    landing: "Krótka strona z jasnym zakresem działania, dowodami kompetencji i kontaktem może być lepsza niż ogólny serwis.",
  },
  "gorzow-wielkopolski": {
    focus: "Lokalne firmy usługowe obsługujące Gorzów Wielkopolski oraz okoliczne miejscowości.",
    intent: "Kontrola różnic w zapytaniach zawierających pełną i skróconą nazwę miasta oraz miejscowości ościenne.",
    landing: "Strona powinna opisywać prawdziwy obszar dojazdu lub zdalnej obsługi bez sugerowania nieistniejącego biura.",
  },
  "zielona-gora": {
    focus: "Usługi lokalne, firmy handlowe i przedsiębiorcy realizujący zamówienia w Zielonej Górze i regionie.",
    intent: "Oddzielenie fraz z intencją zapytania ofertowego od poradników i ofert pracy.",
    landing: "Warto testować widoczny przycisk zamówienia wyceny oraz potwierdzenie, co dzieje się po wysłaniu formularza.",
  },
} as const;

export type GoogleAdsCitySlug = keyof typeof googleAdsCityPlans;
export function getGoogleAdsCityPlan(city: string) {
  return googleAdsCityPlans[city as GoogleAdsCitySlug];
}
