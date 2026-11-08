export type ServiceCity = {
  slug: string;
  name: string;
  adjective: string;
  regionalContext: string;
};

export const serviceCities: ServiceCity[] = [
  { slug: "warszawa", name: "Warszawa", adjective: "warszawskich", regionalContext: "firm usługowych, handlowych i zespołów obsługujących klientów w stolicy" },
  { slug: "krakow", name: "Kraków", adjective: "krakowskich", regionalContext: "lokalnych usług, turystyki, gastronomii i firm prowadzących sprzedaż online" },
  { slug: "wroclaw", name: "Wrocław", adjective: "wrocławskich", regionalContext: "zespołów B2B, firm usługowych oraz przedsiębiorców rozwijających procesy sprzedaży" },
  { slug: "poznan", name: "Poznań", adjective: "poznańskich", regionalContext: "firm handlowych, e-commerce i przedsiębiorstw usługowych" },
  { slug: "gdansk", name: "Gdańsk", adjective: "gdańskich", regionalContext: "firm usługowych, turystycznych oraz biznesów pracujących z klientami z wielu regionów" },
  { slug: "szczecin", name: "Szczecin", adjective: "szczecińskich", regionalContext: "firm usługowych i handlowych, w tym obsługujących klientów transgranicznych" },
  { slug: "lodz", name: "Łódź", adjective: "łódzkich", regionalContext: "firm handlowych, usługowych i rozwijających sprzedaż wielokanałową" },
  { slug: "katowice", name: "Katowice", adjective: "katowickich", regionalContext: "firm B2B, zespołów sprzedaży i przedsiębiorstw usługowych na Śląsku" },
  { slug: "lublin", name: "Lublin", adjective: "lubelskich", regionalContext: "lokalnych firm usługowych, handlowych oraz przedsiębiorców rozwijających działalność w regionie" },
  { slug: "rzeszow", name: "Rzeszów", adjective: "rzeszowskich", regionalContext: "firm usługowych, sprzedażowych oraz przedsiębiorców z Podkarpacia" },
  { slug: "bialystok", name: "Białystok", adjective: "białostockich", regionalContext: "firm usługowych i handlowych rozwijających pozyskiwanie klientów online" },
  { slug: "kielce", name: "Kielce", adjective: "kieleckich", regionalContext: "lokalnych usług, handlu i firm pracujących na zapytaniach od klientów" },
  { slug: "olsztyn", name: "Olsztyn", adjective: "olsztyńskich", regionalContext: "firm usługowych, turystycznych i przedsiębiorstw obsługujących klientów w regionie" },
  { slug: "torun", name: "Toruń", adjective: "toruńskich", regionalContext: "lokalnych usług, e-commerce i firm potrzebujących sprawniejszej obsługi leadów" },
  { slug: "bydgoszcz", name: "Bydgoszcz", adjective: "bydgoskich", regionalContext: "firm handlowych, produkcyjnych i usługowych" },
  { slug: "opole", name: "Opole", adjective: "opolskich", regionalContext: "małych i średnich firm, handlu i przedsiębiorstw usługowych" },
  { slug: "gorzow-wielkopolski", name: "Gorzów Wielkopolski", adjective: "gorzowskich", regionalContext: "firm usługowych i handlowych obsługujących klientów lokalnie i poza regionem" },
  { slug: "zielona-gora", name: "Zielona Góra", adjective: "zielonogórskich", regionalContext: "firm usługowych, handlowych oraz przedsiębiorców rozwijających marketing i sprzedaż online" },
];

export function getServiceCity(slug: string) {
  return serviceCities.find((city) => city.slug === slug);
}
