import { industryGuideArticles } from "./industryGuides";
import { taxGuideArticles } from "./taxGuides";
import { companyGuideArticles } from "./companyGuides";
/**
 * Carefully scoped general business education. No individualized tax, customs,
 * accounting or legal advice. English is authored alongside Polish, not generated
 * by the autopilot; both versions share stable source documents.
 */
export const businessArticles = [
  {
    slug: "zwrot-vat-8-23-przyklad-50000",
    sources: [
      {label:"Ministerstwo Finansów — odliczenie i zwrot VAT (aktualizacja 13.10.2026)",url:"https://podatki.gov.pl/podatki-firmowe/vat/poradniki-i-informatory/odliczenie-i-zwrot-podatku-vat"},
      {label:"Ministerstwo Finansów — stawki VAT",url:"https://podatki.gov.pl/podatki-firmowe/vat/stawki-i-limity"}
    ],
    pl: {
      title:"Zwrot VAT przy sprzedaży 8% i zakupach 23% — przykład 50 000 zł",
      description:"Jak obliczyć nadwyżkę VAT, gdy sprzedajesz usługę z 8% VAT, a kupujesz materiały z 23% VAT? Dwa przykłady po 50 000 zł brutto i netto.",
      intro:"Sprzedaż ze stawką 8% VAT i zakupy ze stawką 23% VAT mogą dać nadwyżkę podatku naliczonego nad należnym. Nie oznacza to jednak darmowego zarobku. Wszystko zależy od tego, czy kwoty są brutto czy netto, czy wolno odliczyć VAT oraz od całego rozliczenia za dany okres.",
      sections:[
        {title:"Najpierw brutto czy netto? Nie odejmuj 8% od kwoty brutto",paragraphs:[
          "Jeśli cena brutto wynosi 50 000 zł przy stawce 8%, to cena netto wynosi 50 000 / 1,08 = 46 296,30 zł, a VAT należny wynosi 3 703,70 zł. Nie 4 000 zł. Dla 23% VAT przy zakupie za 50 000 zł brutto: netto to 50 000 / 1,23 = 40 650,41 zł, VAT naliczony 9 349,59 zł.",
          "Zawsze wyodrębniaj VAT z brutto dzieleniem przez 1 + stawka, a nie odejmowaniem procentu od brutto. Tak samo ważne jest rozróżnienie netto i brutto w cennikach i ofertach wykonawców."
        ]},
        {title:"Wariant A: sprzedaż 50 000 zł brutto i zakupy 50 000 zł brutto",paragraphs:[
          "Sprzedaż: 46 296,30 zł netto + 3 703,70 zł VAT = 50 000 zł brutto. Zakupy: 40 650,41 zł netto + 9 349,59 zł VAT = 50 000 zł brutto.",
          "Nadwyżka VAT naliczonego nad należnym wynosi 9 349,59 − 3 703,70 = 5 645,89 zł. Jeśli podatnik ma pełne prawo do odliczenia, może tę nadwyżkę rozliczyć z innymi pozycjami w JPK_VAT, przenieść lub wnioskować o zwrot.",
          "W tym wariancie marża netto na samych dwóch pozycjach wynosi 46 296,30 − 40 650,41 = 5 645,89 zł. Zwrot VAT nie jest dodatkowym zyskiem ponad marżę — umożliwia odzyskanie kwoty podatku, która nie powinna obciążać uprawnionego podatnika."
        ]},
        {title:"Wariant B: sprzedaż i zakupy po 50 000 zł netto",paragraphs:[
          "Sprzedaż: 50 000 zł netto + 4 000 zł VAT = 54 000 zł brutto. Zakupy: 50 000 zł netto + 11 500 zł VAT = 61 500 zł brutto.",
          "11 500 − 4 000 = 7 500 zł nadwyżki VAT. Przed rozliczeniem podatku firma finansuje 7 500 zł różnicy przepływów brutto; potencjalny zwrot VAT tę różnicę wyrównuje. Marża netto na tych pozycjach wynosi 0 zł, nie 7 500 zł.",
          "Jeżeli poniesiono koszty, od których VAT nie można odliczyć, albo wystąpiła inna sprzedaż czy korekty, rozliczenie będzie inne. Przykład nie stanowi kalkulacji dla konkretnej firmy."
        ]},
        {title:"Kiedy możesz odliczyć VAT i wystąpić o zwrot?",paragraphs:[
          "Zasadniczo trzeba być czynnym podatnikiem VAT, mieć zakupy służące czynnościom opodatkowanym i spełnić ustawowe warunki odliczenia. Nie każdy wydatek oraz nie każda faktura dają pełne odliczenie. Liczy się całe rozliczenie, a nie pojedyncza faktura.",
          "Dla okresów rozliczeniowych od 1 lutego 2026 r. podstawowy termin zwrotu wynosi 40 dni od złożenia rozliczenia JPK_VAT z deklaracją; są terminy szczególne i możliwość przedłużenia weryfikacji. Nadwyżkę możesz też przenieść na następny okres zamiast wnioskować o zwrot.",
          "Urzędowy zwrot nie jest automatycznie wypłacanym bonusem za stawkę 8%. Prawidłowa stawka sprzedaży i uprawnienie do odliczenia muszą być uzasadnione dokumentami i charakterem transakcji."
        ]},
        {title:"Najczęstsze błędy i bezpieczna praktyka",paragraphs:[
          "Błąd pierwszy: uznać, że każda usługa z montażem lub każda usługa dla osoby prywatnej ma 8% VAT. Błąd drugi: pomylić 5,5% ryczałtu od przychodów z VAT. Błąd trzeci: potraktować zwrot VAT jak zysk, pomijając marżę i cash flow.",
          "Przed wyceną sprawdź kwalifikację świadczenia, dokumenty zakupowe i zakres odliczenia. W razie wątpliwości dotyczących stawki warto rozważyć wiążącą informację stawkową (WIS), a w indywidualnej sprawie poprosić o ocenę uprawnionego specjalistę."
        ]}
      ]
    },
    en: {
      title:"VAT refund with 8% sales and 23% purchases — a PLN 50,000 example",
      description:"How input and output VAT differ when a service is taxed at 8% and materials at 23%. Two correct examples using PLN 50,000 gross and net.",
      intro:"Selling at 8% VAT while buying at 23% can create excess deductible input VAT. That is not a free profit. The answer depends on whether amounts are gross or net, whether input VAT is deductible, and the entire VAT return for the period.",
      sections:[
        {title:"First distinguish gross from net",paragraphs:[
          "At 8% VAT, PLN 50,000 gross means PLN 50,000 / 1.08 = PLN 46,296.30 net and PLN 3,703.70 output VAT. At 23%, PLN 50,000 gross on purchases means PLN 40,650.41 net and PLN 9,349.59 input VAT.",
          "To extract VAT from a gross price, divide by 1 plus the VAT rate. Never just subtract 8% or 23% of the gross price."
        ]},
        {title:"Scenario A: PLN 50,000 gross in sales and purchases",paragraphs:[
          "Sales: PLN 46,296.30 net plus PLN 3,703.70 VAT equals PLN 50,000 gross. Purchases: PLN 40,650.41 net plus PLN 9,349.59 VAT equals PLN 50,000 gross.",
          "Excess input VAT is PLN 9,349.59 − PLN 3,703.70 = PLN 5,645.89, provided full deduction is allowed. The amount must be considered together with other items in the VAT return.",
          "The net margin on these two items is also PLN 5,645.89 before other costs. A VAT refund is not extra profit on top of that margin."
        ]},
        {title:"Scenario B: PLN 50,000 net in sales and purchases",paragraphs:[
          "Sales: PLN 50,000 net + PLN 4,000 VAT = PLN 54,000 gross. Purchases: PLN 50,000 net + PLN 11,500 VAT = PLN 61,500 gross.",
          "The excess input VAT is PLN 7,500, while the net margin on these two items is zero. A potential refund offsets the gross cash-flow difference; it does not create PLN 7,500 of earnings.",
          "Real figures can differ when input VAT is only partially deductible, other invoices are included, or adjustments apply."
        ]},
        {title:"When can a business claim a refund?",paragraphs:[
          "Generally a business must be an active VAT taxpayer, have purchases used for taxable activity, and meet statutory deduction requirements. Not all expenses qualify; the entire reporting period matters.",
          "For reporting periods starting on or after 1 February 2026, the ordinary Polish refund period is 40 days after submitting JPK_VAT with the declaration. Special periods apply and verification can extend the payment date. The credit may also be carried forward.",
          "An 8% sale does not itself guarantee a tax refund. Both the reduced sale rate and input VAT deduction must be properly supported."
        ]},
        {title:"Mistakes worth avoiding",paragraphs:[
          "Do not assume that every consumer service or every installation is taxed at 8%. Do not confuse the 5.5% lump-sum income tax rate for certain construction services with VAT. Do not treat a VAT refund as profit.",
          "Check the nature of the supply, invoice documentation and deduction rules. A Polish Binding Rate Information decision (WIS) may help establish a VAT rate; case-specific tax advice should come from an authorized professional."
        ]}
      ]
    }
  },
  {
    slug:"kiedy-vat-8-budownictwo-oze-klimatyzacja-fryzjer",
    sources:[
      {label:"Ministerstwo Finansów — stawki i limity VAT",url:"https://podatki.gov.pl/podatki-firmowe/vat/stawki-i-limity"},
      {label:"Krajowa Informacja Skarbowa — obniżenie stawek VAT dla usług kosmetycznych",url:"https://www.kis.gov.pl/c/document_library/get_file?groupId=6609173&uuid=fc7a5451-1f01-4f2d-806a-b748f2c2ebdb"},
      {label:"Ministerstwo Finansów — stawki ryczałtu od przychodów",url:"https://podatki.gov.pl/podatki-firmowe/pit/stawki-i-limity"},
      {label:"KIS — przykładowa WIS: montaż klimatyzacji w lokalu mieszkalnym",url:"https://eureka.mf.gov.pl/informacje/podglad/579553"},
      {label:"KIS — przykładowa WIS: instalacja PV i magazyn energii",url:"https://eureka.mf.gov.pl/informacje/podglad/713168"}
    ],
    pl:{
      title:"Kiedy można zastosować 8% VAT? Budowlanka, OZE, klima i fryzjer",
      description:"8% VAT nie przysługuje każdej usłudze dla osoby prywatnej. Sprawdź warunki przy pracach w domach, fotowoltaice, klimatyzacji i usługach beauty oraz różnicę z ryczałtem 5,5%.",
      intro:"Stawka VAT zależy od faktycznej usługi, jej klasyfikacji i warunków ustawowych. Sam fakt, że klient jest osobą prywatną, nie wystarczy. Poniższe przykłady pokazują ogólne zasady — nie przesądzają prawidłowej stawki na konkretnej fakturze.",
      sections:[
        {title:"Budownictwo mieszkaniowe: dom do 300 m² i lokal do 150 m²",paragraphs:[
          "Obniżona stawka 8% może objąć m.in. budowę, remont, modernizację, termomodernizację i przebudowę obiektów zaliczonych do budownictwa objętego społecznym programem mieszkaniowym. Ustawa przewiduje podstawowe limity powierzchni: 300 m² dla domów jednorodzinnych i 150 m² dla lokali mieszkalnych.",
          "Gdy powierzchnia przekracza limit, preferencja może dotyczyć jedynie odpowiedniej części podstawy opodatkowania. Liczą się też rodzaj budynku, zakres prac i sposób świadczenia. Usługa wykonana w lokalu użytkowym nie staje się automatycznie usługą na 8% tylko dlatego, że budynek ma mieszkania."
        ]},
        {title:"Fotowoltaika, pompy ciepła i magazyny energii",paragraphs:[
          "Instalacja OZE może spełnić warunki 8% VAT w budownictwie objętym społecznym programem mieszkaniowym. W przypadku mikroinstalacji funkcjonalnie związanej z takim budynkiem miejsce montażu nie jest jedynym kryterium; ważne są także definicja urządzenia, przeznaczenie i charakter całej usługi.",
          "Nie każda fotowoltaika na gruncie, dach budynku gospodarczego ani każdy magazyn energii automatycznie kwalifikują się do 8%. Wiążąca informacja stawkowa dotyczy konkretnie opisanej transakcji. Dla inwestycji firmowej lub nietypowego montażu trzeba osobno ustalić stawkę."
        ]},
        {title:"Klimatyzacja i modernizacja mieszkania",paragraphs:[
          "Przykładowe rozstrzygnięcia KIS dopuszczały stawkę 8% dla kompleksowej dostawy i montażu klimatyzacji trwale związanej z elementami konstrukcyjnymi lokalu mieszkalnego, gdy świadczenie stanowi modernizację i spełnia pozostałe warunki.",
          "Sprzedaż samego urządzenia, montaż urządzenia łatwego do przeniesienia albo wykonanie usługi w obiekcie niekwalifikującym się do preferencji może prowadzić do innej stawki. To nie jest automatyczna reguła dla każdej klimatyzacji."
        ]},
        {title:"Fryzjer, barber i beauty: sprawdź konkretną usługę",paragraphs:[
          "W usługach fryzjerskich i wybranych usługach kosmetycznych mogą występować stawki 8%, ale nie należy traktować całej branży beauty tak samo. Od 1 kwietnia 2024 r. 8% objęto określone usługi kosmetyczne, np. wskazane w PKWiU 96.02.13.0 i 96.02.19.0.",
          "Strzyżenie, pielęgnacja brody, sprzedaż kosmetyków i zabiegi estetyczne mogą mieć różną kwalifikację. Sama nazwa 'barber' na szyldzie nie rozstrzyga stawki. Przy wątpliwościach zweryfikuj odpowiednie PKWiU i rozważ WIS."
        ]},
        {title:"5,5% ryczałtu to podatek dochodowy, nie VAT",paragraphs:[
          "Ryczałt 5,5% może dotyczyć przychodów z robót budowlanych na gruncie ustawy o podatku dochodowym. VAT 8% to odrębny podatek od sprzedaży określonych towarów i usług. Stawka ryczałtu nie jest dowodem na właściwą stawkę VAT.",
          "Możliwe są sytuacje, w których podatnik stosuje ryczałt jako formę PIT oraz rozlicza VAT, ale konkretna klasyfikacja działalności, warunki prawa do ryczałtu, zwolnienia VAT i dokumenty muszą zostać zbadane oddzielnie."
        ]},
        {title:"Co zrobić, gdy nie jesteś pewien stawki?",paragraphs:[
          "Opisz dokładnie zakres prac, miejsce wykonania, charakter dostawy z montażem, przeznaczenie instalacji i dane budynku. Rozróżnij usługę kompleksową od samej sprzedaży urządzeń. Dokumentuj istotne warunki.",
          "Możesz sprawdzić oficjalne wyjaśnienia Ministerstwa Finansów i wystąpić o WIS do Dyrektora Krajowej Informacji Skarbowej. W przypadku indywidualnych zobowiązań podatkowych skorzystaj z uprawnionego doradcy podatkowego."
        ]}
      ]
    },
    en:{
      title:"When does Poland's 8% VAT rate apply? Housing, solar, air conditioning and beauty",
      description:"An 8% VAT rate does not apply to every service for a private individual. Learn the conditions for residential works, solar, air conditioning and hair or beauty services.",
      intro:"VAT depends on the actual supply, its classification and statutory conditions. Selling to a consumer is not enough by itself. These are general examples, not a definitive assessment of a particular invoice.",
      sections:[
        {title:"Residential construction: 300 m² houses and 150 m² flats",paragraphs:[
          "The reduced 8% rate can apply to qualifying construction, repair, modernization and thermal modernization of housing within Poland's social housing programme. Standard area thresholds are 300 m² for detached houses and 150 m² for residential flats.",
          "Above the thresholds the reduced rate may apply only to the proportion allowed by law. The type of property, actual work and contractual arrangement also matter. Commercial premises do not become eligible merely because they are in a residential building."
        ]},
        {title:"Solar PV, heat pumps and energy storage",paragraphs:[
          "Eligible renewable energy installations in social-programme housing may qualify for 8%. Certain micro-installations functionally linked to residential buildings are assessed on more than the physical location of panels.",
          "Not every ground-mounted system, outbuilding roof or battery installation qualifies. The exact service, statutory micro-installation definition, building use and evidence must be checked. Case-specific Binding Rate Information (WIS) can be useful."
        ]},
        {title:"Air conditioning and residential modernization",paragraphs:[
          "Some Polish tax authority decisions accepted 8% for an integrated supply and installation of air conditioning permanently connected to the structure of a qualifying dwelling, where it amounted to modernization.",
          "Selling just an appliance, installing a movable unit or working in non-qualifying premises can lead to different treatment. No blanket rule covers all air-conditioning jobs."
        ]},
        {title:"Barbers, hairdressers and beauty services",paragraphs:[
          "Certain hairdressing and beauty services can use 8%, but classification matters. From 1 April 2024 selected cosmetic services, including specified PKWiU 96.02.13.0 and 96.02.19.0, were covered by a reduced rate.",
          "Haircuts, beard services, retail cosmetics and aesthetic procedures should not be assigned one rate merely because the business calls itself a barber or beauty salon. Check the actual service and consider WIS if uncertain."
        ]},
        {title:"The 5.5% lump-sum income tax is not VAT",paragraphs:[
          "The Polish 5.5% lump-sum tax can apply to revenue from qualifying construction work under income-tax rules. It is distinct from the 8% VAT on certain supplies.",
          "A business can be subject to lump-sum income tax and have VAT obligations, but the eligibility, rates, exemptions and documentation are assessed separately."
        ]},
        {title:"How to check a doubtful rate",paragraphs:[
          "Document the specific work, property, scope of supply and installation, system purpose and relevant building characteristics. Distinguish a composite installation service from selling an appliance alone.",
          "Check Polish Ministry of Finance publications and consider applying to the National Revenue Information authority for WIS. Personalized tax obligations should be assessed by an authorized tax adviser."
        ]}
      ]
    }
  },
  {
    slug:"od-pomyslu-do-firmy-pierwsze-kroki",
    sources:[
      {label:"Biznes.gov.pl — informacje dla przedsiębiorców",url:"https://www.biznes.gov.pl/pl"},
      {label:"Ministerstwo Finansów — rozpoczęcie działalności",url:"https://podatki.gov.pl/poradniki-i-informatory/rozpoczecie-dzialalnosci-gospodarczej"},
      {label:"Ustawa o doradztwie podatkowym — tekst jednolity Dz.U. 2026 poz. 1274",url:"https://eli.sejm.gov.pl/eli/DU/2026/1274/ogl"}
    ],
    pl:{
      title:"Od pomysłu do firmy: jak sprawdzić produkt, dostawców i pierwszą sprzedaż",
      description:"Plan startu biznesu: rynek, próby produktu, koszty, dostawcy, import, formalności, technologia i pierwsze kampanie bez obiecywania gotowych sukcesów.",
      intro:"Nie musisz zaczynać od logo, drogiego sklepu ani magazynu towaru. Najpierw ustal, kto naprawdę kupi produkt, za ile możesz go sprzedać, jak dostarczysz zamówienie i jakie zobowiązania powstaną po drodze.",
      sections:[
        {title:"1. Zweryfikuj problem i klienta, zanim zamówisz towar",paragraphs:[
          "Opisz jednego konkretnego odbiorcę, jego problem, obecną alternatywę i cenę, którą jest skłonny zapłacić. Sprawdź dziesięć realnych rozmów lub zamówień próbnych, zamiast wyciągać wnioski tylko z komentarzy w internecie.",
          "Zapisz, co świadczy o popycie: deklaracja zainteresowania jest słabszym sygnałem niż wpłacona zaliczka lub rzeczywista sprzedaż. Dopiero wtedy planuj większy nakład na produkt i reklamę."
        ]},
        {title:"2. Policz cały koszt jednostkowy i przepływy pieniędzy",paragraphs:[
          "Poza ceną fabryczną uwzględnij prototypy, transport, odprawę, cło, należny importowy VAT, zgodność produktu z normami UE, ewentualne testy, opakowanie, magazynowanie, płatności, reklamacje i zwroty.",
          "Oddziel marżę od przepływów pieniężnych. Rentowna na papierze sprzedaż może wymagać finansowania zapasów przez kilka miesięcy. Kalkuluj wariant pesymistyczny, nie tylko najlepszy."
        ]},
        {title:"3. Porównaj dostawców i zabezpiecz jakość",paragraphs:[
          "Zamów próbki, poproś o pisemną specyfikację, ustal terminy, warunki reklamacji, kontrolę jakości, Incoterms oraz odpowiedzialność za dokumenty i transport. Cena najtańszej oferty nie jest pełnym kosztem produktu.",
          "Przy imporcie spoza UE sprawdź, czy pełnisz rolę importera w świetle przepisów dotyczących bezpieczeństwa produktu, oznaczeń, instrukcji i dokumentacji. Dla urządzeń elektrycznych mogą mieć zastosowanie dodatkowe wymagania."
        ]},
        {title:"4. Uporządkuj formalności we właściwej kolejności",paragraphs:[
          "Wybierz model działalności, przygotuj zasady współpracy i rachunkowości oraz sprawdź obowiązki rejestrowe. Ogólne różnice pomiędzy JDG a spółką z o.o. możesz poznać z oficjalnych poradników, ale właściwy wybór podatkowy zależy od Twojej sytuacji.",
          "Do indywidualnej oceny podatków, VAT, ceł i umów zaangażuj odpowiednio uprawnionych specjalistów. Nie zakładaj, że faktura z innego państwa UE lub konkretna trasa dostawy automatycznie zmienia właściwe opodatkowanie."
        ]},
        {title:"5. Zbuduj kanał sprzedaży, który mierzy wyniki",paragraphs:[
          "Zacznij od prostej strony lub sklepu, dobrze opisanej oferty, jasnych zasad dostawy i działającego kontaktu. Połącz formularze i zamówienia z narzędziem do obsługi klientów. Zadbaj o analitykę i zgodność z wymogami prywatności.",
          "Przetestuj mały budżet kampanii, porównaj koszt pozyskania klienta z realną marżą i sprawdź liczbę zwrotów oraz reklamacji. Rozbudowuj funkcje dopiero po potwierdzeniu sprzedaży."
        ]},
        {title:"6. Korzystaj z pomocy praktycznej, ale weryfikuj ryzyka",paragraphs:[
          "Mogę pomóc w analizie modelu działania, poszukiwaniu dostawców, organizacji wdrożenia, sklepu, marketingu i systemów sprzedażowych. Każdy projekt zaczynam od zakresu, ograniczeń i budżetu, zamiast obiecywać gotowy wynik.",
          "Materiały mają charakter edukacyjny i organizacyjny. Nie zastępują opinii podatkowej, prawnej, księgowej ani oceny zgodności produktu wymagającej odrębnych kompetencji."
        ]}
      ]
    },
    en:{
      title:"From idea to business: test demand, source products and launch sales",
      description:"A practical sequence from demand testing and supplier research to costs, import compliance, website and early sales, with real risk checks.",
      intro:"Do not start with an expensive brand identity, warehouse or complex e-commerce site. First identify a paying customer, a workable price, a reliable fulfilment path and the obligations involved.",
      sections:[
        {title:"1. Test demand before committing to inventory",paragraphs:[
          "Define one target customer, the problem and the alternatives. Speak with potential buyers and test small commitments, rather than relying entirely on likes and comments.",
          "A paid preorder is usually a stronger signal than vague enthusiasm. Start with small experiments before expanding production."
        ]},
        {title:"2. Calculate true unit cost and cash flow",paragraphs:[
          "Include samples, shipping, customs duties, import VAT, EU product compliance, packaging, storage, payment fees, returns and warranties alongside the factory price.",
          "Margin and cash flow are different. Even a profitable business may need months of working capital to finance inventory. Use a downside scenario."
        ]},
        {title:"3. Check suppliers and product quality",paragraphs:[
          "Order samples, agree on written specifications, delivery terms, warranty and claims processes, quality inspection, Incoterms and responsibility for shipping and documents.",
          "If importing into the EU, check whether you are the legal importer and what safety, labeling and technical documentation is needed. Electrical products may be subject to additional requirements."
        ]},
        {title:"4. Address registration, tax and contracts",paragraphs:[
          "Compare business structures using official guidance, record responsibilities and check registration requirements. The appropriate income-tax and VAT treatment depends on the actual circumstances.",
          "Qualified advisers should review personalized tax, customs or legal matters. A route through an EU country or a foreign invoice does not by itself determine the correct tax treatment."
        ]},
        {title:"5. Build a measurable route to market",paragraphs:[
          "Start with a focused landing page or store, a clear offer and reliable contact and checkout. Connect orders and inquiries to a manageable workflow.",
          "Test advertising with a controlled budget, compare acquisition costs to real margins, and monitor returns and complaints before scaling."
        ]},
        {title:"6. Get practical operational support while checking risks",paragraphs:[
          "I can help structure a business concept, research suppliers, coordinate implementation and build websites, marketing and sales systems. Every engagement should start with scope, constraints and budget.",
          "This is general business education and operational support, not personalized tax, legal, accounting or regulated product-certification advice."
        ]}
      ]
    }
  },
  ...industryGuideArticles,
  ...taxGuideArticles,
  ...companyGuideArticles,
] as const;

export const businessGuides = businessArticles.map(article => ({
  slug: article.slug,
  title: article.pl.title,
  description: article.pl.description,
  intro: article.pl.intro,
  sections: article.pl.sections,
  category: companyGuideArticles.some(x=>x.slug===article.slug) ? "spolki-cit" as const : industryGuideArticles.some(x=>x.slug===article.slug) ? "branze-pkd" as const : "biznes-podatki" as const,
  service: "/rozwoj-biznesu",
  serviceLabel: "Rozwój biznesu",
  sources: article.sources
}));
