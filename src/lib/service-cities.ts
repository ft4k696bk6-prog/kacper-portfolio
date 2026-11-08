export type ServiceCity = {
  slug: string;
  name: string;
  adjective: string;
  from: string;
  where: string;
  regionalContext: string;
};

export const serviceCities: ServiceCity[] = [
  { slug: "warszawa", name: "Warszawa", adjective: "warszawskim", from: "z Warszawy", where: "w Warszawie", regionalContext: "firm usługowych, handlowych i zespołów obsługujących klientów w stolicy" },
  { slug: "krakow", name: "Kraków", adjective: "krakowskim", from: "z Krakowa", where: "w Krakowie", regionalContext: "lokalnych usług, turystyki, gastronomii i firm prowadzących sprzedaż online" },
  { slug: "wroclaw", name: "Wrocław", adjective: "wrocławskim", from: "z Wrocławia", where: "we Wrocławiu", regionalContext: "zespołów B2B, firm usługowych oraz przedsiębiorców rozwijających procesy sprzedaży" },
  { slug: "poznan", name: "Poznań", adjective: "poznańskim", from: "z Poznania", where: "w Poznaniu", regionalContext: "firm handlowych, e-commerce i przedsiębiorstw usługowych" },
  { slug: "gdansk", name: "Gdańsk", adjective: "gdańskim", from: "z Gdańska", where: "w Gdańsku", regionalContext: "firm usługowych, turystycznych oraz biznesów pracujących z klientami z wielu regionów" },
  { slug: "szczecin", name: "Szczecin", adjective: "szczecińskim", from: "ze Szczecina", where: "w Szczecinie", regionalContext: "firm usługowych i handlowych, w tym obsługujących klientów transgranicznych" },
  { slug: "lodz", name: "Łódź", adjective: "łódzkim", from: "z Łodzi", where: "w Łodzi", regionalContext: "firm handlowych, usługowych i rozwijających sprzedaż wielokanałową" },
  { slug: "katowice", name: "Katowice", adjective: "katowickim", from: "z Katowic", where: "w Katowicach", regionalContext: "firm B2B, zespołów sprzedaży i przedsiębiorstw usługowych na Śląsku" },
  { slug: "lublin", name: "Lublin", adjective: "lubelskim", from: "z Lublina", where: "w Lublinie", regionalContext: "lokalnych firm usługowych, handlowych oraz przedsiębiorców rozwijających działalność w regionie" },
  { slug: "rzeszow", name: "Rzeszów", adjective: "rzeszowskim", from: "z Rzeszowa", where: "w Rzeszowie", regionalContext: "firm usługowych, sprzedażowych oraz przedsiębiorców z Podkarpacia" },
  { slug: "bialystok", name: "Białystok", adjective: "białostockim", from: "z Białegostoku", where: "w Białymstoku", regionalContext: "firm usługowych i handlowych rozwijających pozyskiwanie klientów online" },
  { slug: "kielce", name: "Kielce", adjective: "kieleckim", from: "z Kielc", where: "w Kielcach", regionalContext: "lokalnych usług, handlu i firm pracujących na zapytaniach od klientów" },
  { slug: "olsztyn", name: "Olsztyn", adjective: "olsztyńskim", from: "z Olsztyna", where: "w Olsztynie", regionalContext: "firm usługowych, turystycznych i przedsiębiorstw obsługujących klientów w regionie" },
  { slug: "torun", name: "Toruń", adjective: "toruńskim", from: "z Torunia", where: "w Toruniu", regionalContext: "lokalnych usług, e-commerce i firm potrzebujących sprawniejszej obsługi leadów" },
  { slug: "bydgoszcz", name: "Bydgoszcz", adjective: "bydgoskim", from: "z Bydgoszczy", where: "w Bydgoszczy", regionalContext: "firm handlowych, produkcyjnych i usługowych" },
  { slug: "opole", name: "Opole", adjective: "opolskim", from: "z Opola", where: "w Opolu", regionalContext: "małych i średnich firm, handlu i przedsiębiorstw usługowych" },
  { slug: "gorzow-wielkopolski", name: "Gorzów Wielkopolski", adjective: "gorzowskim", from: "z Gorzowa Wielkopolskiego", where: "w Gorzowie Wielkopolskim", regionalContext: "firm usługowych i handlowych obsługujących klientów lokalnie i poza regionem" },
  { slug: "zielona-gora", name: "Zielona Góra", adjective: "zielonogórskim", from: "z Zielonej Góry", where: "w Zielonej Górze", regionalContext: "firm usługowych, handlowych oraz przedsiębiorców rozwijających marketing i sprzedaż online" },
];

export function getServiceCity(slug: string) {
  return serviceCities.find((city) => city.slug === slug);
}
