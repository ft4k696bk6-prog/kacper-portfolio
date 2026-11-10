import { expandedCompanionRules } from "./companion-expanded";

export type CompanionLocale = "pl" | "en";
export type CompanionDevice = "iphone" | "ipad" | "android" | "tablet" | "mac" | "windows" | "linux" | "unknown";
export type CompanionBrowser = "safari" | "chrome" | "firefox" | "edge" | "other";
export type CompanionCategory = "weather" | "device" | "viewport" | "time" | "location" | "browser" | "page" | "return" | "combination" | "playful";

export type CompanionWeather = {
  temperature: number;
  windSpeed: number | null;
  symbol: string | null;
  approximate: true;
  source: "MET Norway";
  sourceUrl: string;
};
export type CompanionServerContext = {
  location: { city: string | null; country: string | null; approximate: true };
  weather: CompanionWeather | null;
};
export type CompanionContext = {
  lang: CompanionLocale;
  pathname: string;
  city: string | null;
  country: string | null;
  weather: CompanionWeather | null;
  device: CompanionDevice;
  browser: CompanionBrowser;
  hour: number;
  day: number;
  month: number;
  date: number;
  dark: boolean;
  touch: boolean;
  reducedMotion: boolean;
  width: number;
  returning: boolean;
};
export type CompanionTopic = "weather" | "device" | "viewport" | "time" | "location" | "browser" | "page" | "return" | "playful";
export type CompanionNudge = {
  id: string;
  category: CompanionCategory;
  topic: CompanionTopic;
  family: string;
  text: string;
  intent: "chat" | "audit";
};

type Rule = {
  id: string;
  category: CompanionCategory;
  eligible: (c: CompanionContext) => boolean;
  pl: string;
  en: string;
  weight: number;
  intent: CompanionNudge["intent"];
  topic?: CompanionTopic;
  family?: string;
};
const rules: Rule[] = [];

function addSet(
  id: string,
  category: CompanionCategory,
  eligible: Rule["eligible"],
  variants: ReadonlyArray<readonly [pl: string, en: string]>,
  weight = 1,
  intent: CompanionNudge["intent"] = "chat",
) {
  variants.forEach(([pl, en], i) => rules.push({
    id: id + "-" + String(i + 1),
    category,
    eligible,
    pl,
    en,
    weight,
    intent,
  }));
}

const any = () => true;
const hasWeather = (c: CompanionContext) => c.weather !== null && Boolean(c.city);
const temperature = (c: CompanionContext) => c.weather?.temperature ?? 99;
const symbol = (c: CompanionContext) => c.weather?.symbol?.toLowerCase() ?? "";
const storm = (c: CompanionContext) => /thunder/.test(symbol(c));
const sleet = (c: CompanionContext) => /sleet/.test(symbol(c));
const snow = (c: CompanionContext) => /snow/.test(symbol(c)) && !sleet(c);
const rain = (c: CompanionContext) => /(rain|drizzle)/.test(symbol(c)) && !storm(c) && !sleet(c);
const cloudy = (c: CompanionContext) => /(cloudy|partlycloudy)/.test(symbol(c));
const sunny = (c: CompanionContext) => /(clearsky|fair)/.test(symbol(c));
const fog = (c: CompanionContext) => /fog/.test(symbol(c));
const windy = (c: CompanionContext) => (c.weather?.windSpeed ?? 0) >= 10;
const phone = (c: CompanionContext) => c.device === "iphone" || c.device === "android";
const night = (c: CompanionContext) => c.hour >= 23 || c.hour < 5;
const evening = (c: CompanionContext) => c.hour >= 18 && c.hour < 23;
const isAudit = (c: CompanionContext) => /narzedzia|tools|audyt|audit/.test(c.pathname);
const isAds = (c: CompanionContext) => /meta-ads|marketing|reklamy|ads/.test(c.pathname);
const isCrm = (c: CompanionContext) => /crm|aplikacje-webowe|web-apps/.test(c.pathname);
const isServices = (c: CompanionContext) => /uslugi|services|tworzenie-stron|website/.test(c.pathname);
const isWork = (c: CompanionContext) => /realizacje|projects|case-stud|portfolio/.test(c.pathname);
const isGuide = (c: CompanionContext) => /poradniki|blog|guides/.test(c.pathname);

addSet("wx-freeze", "weather", c => hasWeather(c) && temperature(c) < 0, [
  ["{place} dziś {temp}°C. Brrr… aż mi się piksele trzęsą.","{place} it's {temp}°C today. Brrr… even my pixels are shivering."],
  ["{place} {temp}°C. Jeśli mi zamarznie wentylator, będzie wiadomo dlaczego.","{place} it's {temp}°C. If my fan freezes, you'll know why."],
  ["{place} taki mróz, że nawet mój kod chciałby założyć kurtkę.","{place} it's so cold that even my code wants a coat."],
  ["{place} temperatura spadła poniżej zera. To nie są warunki dla cyfrowego zwierzaka.","{place} the temperature is below zero. Not ideal for a little digital creature."],
], 3);
addSet("wx-extreme-freeze", "weather", c => hasWeather(c) && temperature(c) <= -10, [
  ["{place} aż {temp}°C?! Ktoś przestawił pogodę w tryb ekstremalny?","{place} it's {temp}°C?! Did someone switch the weather to extreme mode?"],
  ["{place} {temp}°C. Ja zostaję po tej stronie ekranu, dzięki.","{place} it's {temp}°C. I'm staying on this side of the screen, thanks."],
], 4);
addSet("wx-chilly", "weather", c => hasWeather(c) && temperature(c) >= 0 && temperature(c) <= 8, [
  ["Brrr… {place} dziś tylko {temp}°C. Chyba pora na coś ciepłego.","Brrr… {place} it's only {temp}°C today. Time for something warm."],
  ["{place} zrobiło się chłodno. Gdybym miał ręce, schowałbym je do kieszeni.","{place} it's turned chilly. If I had hands, they'd be in my pockets."],
  ["{place} {temp}°C. Dobrze, że do działania wystarcza mi trochę prądu.","{place} it's {temp}°C. Good thing all I need is a little electricity."],
], 2);
addSet("wx-mild", "weather", c => hasWeather(c) && temperature(c) >= 9 && temperature(c) <= 22, [
  ["{place} dziś {temp}°C. W sam raz, żeby złapać nowy pomysł.","{place} it's {temp}°C today. Nice weather for a new idea."],
  ["{place} zapowiada się przyjemny dzień. Nawet ja wyszedłbym z ekranu na spacer.","{place} the day looks pleasant. Even I'd leave this screen for a walk."],
], 1);
addSet("wx-warm", "weather", c => hasWeather(c) && temperature(c) >= 23 && temperature(c) < 30, [
  ["{place} już {temp}°C. Mój cyfrowy termostat też to zauważył.","{place} it's already {temp}°C. My digital thermostat noticed too."],
  ["{place} całkiem ciepło. Gdybym miał okulary przeciwsłoneczne, już bym je założył.","{place} it's pretty warm. If I had sunglasses, I'd be wearing them."],
], 2);
addSet("wx-heat", "weather", c => hasWeather(c) && temperature(c) >= 30, [
  ["{place} aż {temp}°C. Oby Twój sprzęt miał porządne chłodzenie.","{place} it's {temp}°C. Hope your device has decent cooling."],
  ["{place} {temp}°C?! Dziś nawet piksele wolą siedzieć w cieniu.","{place} it's {temp}°C?! Even pixels would rather stay in the shade."],
  ["{place} taki upał, że mógłbym usmażyć na procesorze naleśnika. Gdybym miał procesor.","{place} it's so hot I could fry a pancake on my processor. If I had one."],
  ["{place} według prognozy naprawdę gorąco. Dobrze, że mogę udawać, że mam klimatyzację.","{place} it's seriously hot in the forecast. Good thing I can pretend to have air conditioning."],
], 4);
addSet("wx-rain", "weather", rain, [
  ["Kap, kap… {place} prognoza zapowiada deszcz. Ja zostaję pod cyfrowym dachem.","Drip, drip… {place} rain is in the forecast. I'll stay under my digital roof."],
  ["{place} dziś deszczowo. Na szczęście strony internetowe nie potrzebują parasola.","{place} rainy weather today. Luckily, websites don't need umbrellas."],
  ["{place} nadciąga deszcz. Natura dorzuca własne efekty specjalne, bez JavaScriptu.","{place} rain's on the way. Nature has its own special effects, no JavaScript required."],
  ["{place} w prognozie deszcz. Jeśli wybierasz się na spacer, zerknij najpierw za okno.","{place} rain is in the forecast. If you're going for a walk, have a look outside first."],
], 3);
addSet("wx-snow", "weather", snow, [
  ["{place} prognoza zapowiada śnieg! Gdybym miał ręce, lepiłbym bałwana.","{place} snow is in the forecast! If I had hands, I'd build a snowman."],
  ["{place} zrobi się biało. Mój ciemny interfejs będzie miał konkurencję.","{place} things may turn white. My dark interface has some competition."],
  ["{place} śnieg w prognozie. Ciekawe, czy piksele potrafią robić aniołki na śniegu.","{place} snow is in the forecast. Wonder if pixels can make snow angels."],
], 3);
addSet("wx-sleet", "weather", sleet, [
  ["{place} deszcz ze śniegiem. Nawet pogoda nie potrafi dziś podjąć decyzji.","{place} sleet in the forecast. Even the weather can't make a decision today."],
  ["{place} trochę śniegu, trochę deszczu. Klasyczny pogodowy kompromis.","{place} a bit of snow, a bit of rain. A classic weather compromise."],
], 3);
addSet("wx-storm", "weather", storm, [
  ["{place} prognoza zapowiada burzę. Oby prąd został z nami — mam jeszcze sporo do powiedzenia.","{place} thunderstorms are in the forecast. Hope the power stays on — I've got more to say."],
  ["{place} zapowiadają grzmoty. Nie boję się, tylko na wszelki wypadek schowam trochę niżej.","{place} thunder is expected. I'm not scared, just moving a little lower to be safe."],
  ["{place} niebo szykuje własny pokaz efektów. Dziś nie zamierzam konkurować.","{place} the sky is preparing a light show. I won't compete today."],
], 5);
addSet("wx-windy", "weather", windy, [
  ["{place} mocno wieje: około {wind} m/s według prognozy. Trzymaj się tam!","{place} the forecast calls for winds near {wind} m/s. Hold on tight!"],
  ["{place} wietrznie. Ja na szczęście jestem mocno przypięty do tej strony.","{place} windy today. Luckily, I'm firmly attached to this website."],
  ["{place} taki wiatr, że dobrze, iż nie da się mnie zdmuchnąć z ekranu.","{place} so windy that I'm glad I can't be blown off your screen."],
], 3);
addSet("wx-sunny", "weather", sunny, [
  ["{place} według prognozy słonecznie, a Ty w internecie? Nie oceniam. Sam tu mieszkam.","{place} sunshine in the forecast and you're online? No judgment. I live here."],
  ["{place} zapowiada się ładnie. Nie będę Cię długo zatrzymywać od spaceru.","{place} a lovely day ahead. I won't keep you from your walk for long."],
  ["{place} słońce robi dziś świetną robotę. Nawet bez CSS.","{place} the sun's putting on a great show today. No CSS required."],
], 1);
addSet("wx-clouds", "weather", cloudy, [
  ["{place} pochmurno. Dobrze, że ja też potrafię działać w chmurze.","{place} cloudy today. Good thing I can work in the cloud too."],
  ["{place} słońce gra z chmurami w chowanego. Ja gram w asystenta.","{place} the sun is playing hide-and-seek with the clouds. I'm playing assistant."],
  ["{place} sporo chmur w prognozie. W moim małym okienku przynajmniej coś widać.","{place} lots of clouds in the forecast. At least things are clear in my little window."],
], 1);
addSet("wx-fog", "weather", fog, [
  ["{place} mgliście. Oby Twoje plany na dziś były bardziej przejrzyste.","{place} it's foggy. Hope your plans for today are clearer."],
  ["{place} prognoza zapowiada mgłę. Ja przynajmniej widzę wszystkie piksele.","{place} fog is in the forecast. At least I can see every pixel."],
], 2);

addSet("device-iphone", "device", c => c.device === "iphone", [
  ["Widzę, że przeglądasz stronę na iPhonie. Wiesz, ile firm traci klientów przez źle działającą wersję mobilną? Możemy sprawdzić Twoją.","I can see you're browsing on an iPhone. Know how many businesses lose customers to a broken mobile website? We can check yours."],
  ["iPhone wykryty. Cała ta strona mieści się na Twoim ekranie — i właśnie tak powinna działać responsywność.","iPhone detected. This whole site fits on your screen — that's what responsiveness should feel like."],
  ["Na iPhonie każdy źle ustawiony przycisk od razu rzuca się w oczy. Sprawdź, czy tutaj wszystko działa wygodnie.","On an iPhone, a badly placed button stands out immediately. See how comfortable this site feels."],
], 4, "audit");
addSet("device-android", "device", c => c.device === "android", [
  ["Widzę, że przeglądasz stronę na telefonie z Androidem. Wiesz, ile firm traci klientów przez kiepską wersję mobilną?","I can see you're browsing on an Android phone. Know how many businesses lose customers because of poor mobile design?"],
  ["Android wykryty. Na takim telefonie dobra strona powinna działać równie sprawnie jak na iPhonie.","Android detected. A good website should work just as well on your phone as it does on an iPhone."],
  ["Przeglądasz na Androidzie. Wygodne przyciski i czytelne teksty to nie luksus, tylko podstawa.","You're browsing on Android. Easy-to-tap buttons and readable text aren't luxuries — they're essentials."],
], 4, "audit");
addSet("device-ipad", "device", c => c.device === "ipad", [
  ["Widzę iPada. Sprawdź, jak układ tej strony dopasował się do Twojego ekranu.","I can see you're using an iPad. Notice how this page layout adapts to your screen."],
  ["iPad wykryty! Na takim ekranie od razu widać, czy projekt naprawdę jest responsywny.","iPad detected! This kind of screen quickly reveals whether a design is truly responsive."],
], 2);
addSet("device-tablet", "device", c => c.device === "tablet", [
  ["Tablet wykryty. Sprawdź, jak układ strony wykorzystuje ten rozmiar ekranu.", "Tablet detected. See how the page layout makes use of this screen size."],
  ["Przeglądasz na tablecie. Tu małe, źle rozmieszczone przyciski naprawdę potrafią przeszkadzać.", "You're browsing on a tablet. Tiny, awkwardly placed buttons can really get in the way."],
], 2);

addSet("device-mac", "device", c => c.device === "mac", [
  ["Mac wykryty. Chcesz zobaczyć, jak wygląda ta strona od strony kodu?","Mac detected. Want to see what's happening behind the scenes?"],
  ["Przeglądasz na Macu. Obiecuję nie kazać Ci instalować siedmiu aplikacji, żeby zobaczyć moje projekty.","You're browsing on a Mac. I promise you won't need seven apps just to see my projects."],
], 2);
addSet("device-windows", "device", c => c.device === "windows", [
  ["Windows wykryty. Spokojnie, nie poproszę Cię o ponowne uruchomienie komputera.","Windows detected. Don't worry, I won't ask you to restart your computer."],
  ["Przeglądasz na Windowsie, a okno ma teraz {width} px szerokości. Układ dopasowuję właśnie do tej wartości.","You're browsing on Windows, and your browser window is currently {width}px wide. That's the space this layout adapts to."],
], 2);
addSet("device-linux", "device", c => c.device === "linux", [
  ["Linux wykryty. Czyli istnieje szansa, że rozumiesz moje problemy z zależnościami.","Linux detected. So there's a chance you understand my dependency problems."],
  ["O, Linux! Jeśli coś tutaj nie działa, pewnie już wiesz, gdzie zajrzeć w konsoli.","Oh, Linux! If something breaks here, you probably already know where to look in the console."],
], 4);
addSet("device-phone", "device", phone, [
  ["Całe bernecki.dev oglądasz teraz {onDevice}. Fajnie, ile da się zmieścić w małym oknie, prawda?","You're viewing all of bernecki.dev {onDevice}. Amazing how much can fit in a small window, right?"],
  ["Przeglądasz {onDevice}. Zobacz, jak dopasowałem układ do tego sposobu korzystania ze strony.","You're browsing {onDevice}. Notice how the layout adapts to the way you're using it."],
  ["Widzę Cię {onDevice}. Gdy projektuję przyciski, właśnie takie urządzenia mam na myśli.","I see you're browsing {onDevice}. Devices like yours are exactly what I think about when designing buttons."],
], 2);
addSet("viewport-wide", "viewport", c => c.width >= 1500, [
  ["Twoje okno przeglądarki ma {width} px szerokości. Sporo miejsca na dobre pomysły.","Your browser window is {width}px wide. Plenty of room for good ideas."],
  ["{width} px szerokości okna? Przy takiej przestrzeni nawet moje piksele mogą się rozprostować.","A {width}px browser window? Even my pixels have room to stretch."],
], 2);
addSet("viewport-compact", "viewport", c => c.width > 0 && c.width < 400, [
  ["Okno Twojej przeglądarki ma tylko {width} px szerokości. I właśnie dlatego pilnuję każdego piksela.", "Your browser window is just {width}px wide. That's why I pay attention to every pixel."],
  ["{width} px szerokości okna — niewiele, ale wystarczy, żeby zmieścić całą historię tej strony.", "A {width}px-wide window — not much, but enough to fit this website's story."],
], 2);
addSet("viewport-medium", "viewport", c => c.width >= 400 && c.width < 900, [
  ["Twoje okno przeglądarki ma teraz {width} px. Spróbuj je zmienić, a zobaczysz, jak reaguje układ.", "Your browser window is {width}px wide. Resize it to see how the layout responds."],
  ["{width} px dostępnej szerokości. Układ strony właśnie do tego się dopasowuje.", "{width}px of browser width. The page layout is adapting to that space."],
], 2);
addSet("viewport-large", "viewport", c => c.width >= 900 && c.width < 1500, [
  ["Twoje okno ma {width} px szerokości. W sam raz, żeby rozłożyć projekty bez ścisku.", "Your browser window is {width}px wide. Plenty of room to spread out the projects."],
  ["{width} px szerokości okna. Żadnego zgadywania modelu sprzętu — po prostu dopasowanie układu.", "Your browser window is {width}px wide. No device guessing — just a responsive layout."],
], 2);

addSet("device-touch", "device", c => c.touch, [
  ["Twoje urządzenie obsługuje dotyk. Możesz mnie stuknąć — jestem odporny na odciski palców.","Your device supports touch. Go ahead and tap me — fingerprints won't hurt."],
], 1);

addSet("time-morning", "time", c => c.hour >= 5 && c.hour < 9, [
  ["Tak wcześnie na bernecki.dev? Ktoś tu chyba ma konkretny plan na dzień.","On bernecki.dev this early? Someone must have a plan for the day."],
  ["Dzień dobry! Ja już jestem na stanowisku. A kawa u Ciebie gotowa?","Good morning! I'm already on duty. Is your coffee ready?"],
  ["Poranek i przeglądanie projektów. Brzmi jak niezły początek dnia.","A morning spent browsing projects. Not a bad way to start the day."],
], 2);
addSet("time-lunch", "time", c => c.hour >= 11 && c.hour < 15, [
  ["Pora obiadowa, a Ty na bernecki.dev? To ja poproszę trochę RAM-u na deser.","Lunchtime and you're on bernecki.dev? I'll have some extra RAM for dessert."],
  ["Południe. Ja nie robię przerwy na obiad, ale Ty możesz.","Midday. I don't take lunch breaks, but you can."],
], 1);
addSet("time-evening", "time", evening, [
  ["Dobry wieczór. To pora, gdy wiele dobrych pomysłów dopiero się zaczyna.","Good evening. This is when a lot of good ideas are only getting started."],
  ["Wieczorny research na bernecki.dev? Rozgość się, mam kilka rzeczy do pokazania.","Doing some evening research on bernecki.dev? Make yourself at home."],
  ["Wieczór, spokojny ekran i trochę technologii. Całkiem dobry zestaw.","Evening, a quiet screen, and a bit of tech. Not a bad combination."],
], 2);
addSet("time-night", "time", night, [
  ["Ty jeszcze nie śpisz? Ja nie muszę, ale Ty pewnie powinieneś.","Still awake? I don't need sleep, but you probably do."],
  ["Nocne przeglądanie portfolio? Albo świetny pomysł, albo bezsenność.","Browsing a portfolio late at night? Either a great idea or insomnia."],
  ["U Ciebie już tak późno? U mnie czas płynie trochę inaczej.","It's that late for you already? Time works a little differently for me."],
], 3);
addSet("time-monday", "time", c => c.day === 1, [
  ["Poniedziałek… jeszcze tylko kilka kaw i będzie piątek.","Monday… just a few coffees and it'll be Friday."],
  ["Nowy tydzień, nowa lista rzeczy do zrobienia. Brzmi znajomo?","New week, new to-do list. Sound familiar?"],
], 1);
addSet("time-friday", "time", c => c.day === 5, [
  ["Piątek! Oby Twoje weekendowe plany miały mniej błędów niż piątkowy deploy.","Friday! Hope your weekend plans have fewer bugs than a Friday deploy."],
  ["Piątek, a ja wciąż na stanowisku. Urlopy to dla mnie nieodkryta funkcja.","Friday and I'm still on duty. Holidays are an unexplored feature for me."],
], 2);
addSet("time-weekend", "time", c => c.day === 0 || c.day === 6, [
  ["Weekend, a Ty na bernecki.dev? Szanuję tę ciekawość.","Weekend and you're on bernecki.dev? I respect the curiosity."],
  ["Weekend! Ja nie znam wolnego, ale Tobie polecam chwilę odpoczynku.","It's the weekend! I don't get time off, but you should."],
], 2);
addSet("time-winter", "time", c => c.country === "PL" && (c.month === 11 || c.month <= 1), [
  ["Zima w Polsce: ogrzewanie, kawa i dobry kod. Kolejność dowolna.","Winter in Poland: heating, coffee, and clean code. In any order."],
], 1);
addSet("time-spring", "time", c => c.country === "PL" && c.month >= 2 && c.month <= 4, [
  ["Wiosna w Polsce! Może czas odświeżyć też firmową stronę?","Spring in Poland! Maybe it's time to refresh the business website too?"],
], 1);
addSet("time-autumn", "time", c => c.country === "PL" && c.month >= 8 && c.month <= 10, [
  ["Polska jesień. Liście spadają, ale oby liczba klientów nie spadała.","Autumn in Poland. The leaves are falling — hopefully your customer count isn't."],
], 1);
addSet("time-halloween", "time", c => c.month === 9 && c.date === 31, [
  ["Buuu! Najstraszniejsze rzeczy, jakie widziałem, to stare fragmenty kodu.","Boo! The scariest things I've seen are pieces of legacy code."],
], 2);

addSet("browser-safari", "browser", c => c.browser === "safari", [
  ["Safari! Zobacz, czy wszystko działa równie płynnie, jak powinno.", "Safari! See whether everything runs as smoothly as it should."],
], 1);
addSet("browser-chrome", "browser", c => c.browser === "chrome", [
  ["Chrome wykryty. Obiecuję nie otwierać Ci kolejnych 37 kart.", "Chrome detected. I promise not to open another 37 tabs."],
], 1);
addSet("browser-firefox", "browser", c => c.browser === "firefox", [
  ["O, Firefox. Lisek odwiedził mojego małego cyfrowego stworka.", "Oh, Firefox. A fox has come to visit this little digital creature."],
], 2);
addSet("browser-edge", "browser", c => c.browser === "edge", [
  ["Edge? Microsoft byłby dumny. Ja po prostu cieszę się z odwiedzin.", "Edge? Microsoft would be proud. I'm just happy you're here."],
], 2);
addSet("browser-dark", "browser", c => c.dark, [
  ["Twój system preferuje ciemny motyw. Mamy podobny gust.","Your system prefers dark mode. We have similar taste."],
  ["Ciemny motyw ustawiony w systemie, ciemna strona na ekranie. Współpracujemy.","Dark mode in your system, dark site on your screen. A good match."],
], 1);
addSet("browser-light", "browser", c => !c.dark, [
  ["Twój system preferuje jasny motyw, a ja mieszkam na czarnej stronie. Kontrast charakterów.","Your system prefers light mode, but I live on a dark website. Opposites attract."],
], 1);
addSet("browser-reduced", "browser", c => c.reducedMotion, [
  ["Twój system prosi o ograniczenie animacji. Jasna sprawa — żadnych niepotrzebnych akrobacji.","Your system asks for reduced motion. Understood — no unnecessary acrobatics."],
], 2);

addSet("location-city", "location", c => Boolean(c.city), [
  ["{city} — pozdrawiam! Miło, że zajrzałeś na bernecki.dev.","{city} — hello! Nice to have you on bernecki.dev."],
  ["{city} melduje się na radarze. Zobacz, co potrafi mały kawałek internetu.","{city} is on my radar. See what a little corner of the internet can do."],
  ["O, {city}! Widzę nazwę miasta, ale spokojnie — nie znam Twojego adresu.","Oh, {city}! I can see the city's name, but don't worry — I don't know your address."],
], 2);
addSet("location-outside", "location", c => Boolean(c.city) && Boolean(c.country) && c.country !== "PL", [
  ["{city} — nawet stamtąd dotarłeś do mojego portfolio. Internet nie zna granic.","{city} — you've found my portfolio from all the way over there. The internet knows no borders."],
  ["Hej, {city}! Kilometry nas dzielą, ale ta strona dociera do Ciebie bez problemu.","Hey, {city}! We might be miles apart, but this site still reaches you."],
], 2);
addSet("page-tools", "page", isAudit, [
  ["Jesteś w darmowych narzędziach. Lubię ten dział — tu można coś naprawdę sprawdzić.","You're browsing the free tools. I like this section — you can actually test things here."],
  ["Oglądasz narzędzia diagnostyczne. Najpierw konkretne dane, potem wnioski.","You're looking at diagnostic tools. Facts first, conclusions second."],
  ["W tym dziale zamiast zgadywać, możesz zrobić szybki test. To lubię.","In this section, you can run a quick test instead of guessing. I like that."],
], 3);
addSet("page-ads", "page", isAds, [
  ["Czytasz o reklamach. Jeden drobny błąd w ustawieniach potrafi sporo kosztować.","You're reading about advertising. One small configuration mistake can be expensive."],
  ["Marketing i reklamy na ekranie. W tym temacie wolę liczby od obietnic.","Marketing and ads on your screen. In this area I prefer numbers to promises."],
  ["Zaglądasz do tematu reklam. Fajnie, że chcesz zrozumieć mechanikę, a nie tylko klikać „Promuj”.","You're exploring advertising. Good to understand how it works rather than just hitting Boost."],
], 3);
addSet("page-crm", "page", isCrm, [
  ["Oglądasz rozwiązania CRM. Najlepszy system to taki, którego nie trzeba tłumaczyć przez godzinę.","You're exploring CRMs. The best system is one that doesn't need an hour-long explanation."],
  ["Czytasz o CRM. Dobry system powinien skracać pracę, a nie dokładać kolejnych kliknięć.","You're reading about CRM systems. A good one should reduce work, not add clicks."],
  ["Lead, notatka, zadanie, termin. W CRM najlepiej mieć to w jednym miejscu.","Lead, note, task, deadline. In a CRM, it's best to keep them together."],
], 3);
addSet("page-services", "page", isServices, [
  ["Oglądasz moje usługi. Ciekawostka: najwięcej pracy często zajmują rzeczy, których później nie widać.","You're exploring my services. Funny thing: the hardest work is often invisible at the end."],
  ["Jesteś w ofercie. Ja pilnuję pikseli, a Kacper zajmuje się resztą.","You're browsing the services. I look after the pixels; Kacper handles the rest."],
  ["Ta strona dopasowuje układ do szerokości okna. Możesz sprawdzić to, zmieniając jego rozmiar.","This site adapts its layout to the browser window width. Try resizing it."],
], 3);
addSet("page-work", "page", isWork, [
  ["Przeglądasz realizacje? Dobrze trafiłeś. Lubię, gdy widać efekt końcowy.","Looking through projects? You're in the right place. I like seeing the finished work."],
  ["Oglądasz projekty, które naprawdę powstały. Gdybym miał ręce, może pomógłbym przy kolejnym.","You're looking at real projects. If I had hands, maybe I could help with the next one."],
  ["Realizacje mówią więcej niż obietnice. Dlatego masz je właśnie przed sobą.","Real work speaks louder than promises. That's why it's right here."],
], 3);
addSet("page-guides", "page", isGuide, [
  ["Czytasz poradnik. Dobra decyzja: najpierw zrozumieć problem, potem go rozwiązać.","You're reading a guide. Good call: understand the problem first, solve it second."],
  ["Jeden dobry poradnik potrafi oszczędzić kilka godzin szukania. Oby ten był właśnie taki.","One useful guide can save hours of searching. Hope this one does."],
], 2);
addSet("page-contact", "page", c => /kontakt|contact/.test(c.pathname), [
  ["Jesteś przy kontakcie. Jeśli wolisz porozmawiać z człowiekiem, Kacper już jest jeden krok dalej.","You're on the contact page. If you'd rather talk to a human, Kacper is one step away."],
], 2);
addSet("return-visit", "return", c => c.returning, [
  ["O, wróciłeś na bernecki.dev! Miło znowu Cię widzieć.","You're back on bernecki.dev! Nice to see you again."],
  ["Witaj ponownie. Jak widzisz, nadal pilnuję tego miejsca.","Welcome back. As you can see, I'm still looking after this place."],
  ["Znowu się widzimy. Chyba zaczynamy się lubić.","We meet again. I think we're starting to get along."],
], 3);
addSet("playful-general", "playful", any, [
  ["Psst… jestem obok, jeśli będziesz czegoś szukać.","Psst… I'm around if you're looking for something."],
  ["Czasem tylko mrugam, a czasem zagaduję. Tak to jest, gdy mieszka się w portfolio.","Sometimes I blink, sometimes I chat. Life inside a portfolio."],
  ["Mam stąd niezły widok na stronę. Tylko kursor czasem mi go zasłania.","I've got a good view of the page from here. The cursor gets in the way sometimes."],
  ["Zwykle siedzę cicho. Ale trudno zawsze milczeć, gdy tyle się tu dzieje.","I'm usually quiet. Hard to stay silent with so much going on here."],
  ["Nie przeszkadzam? Dobra. Będę tutaj, gdy zechcesz pogadać.","Not interrupting, am I? Good. I'll be here if you feel like chatting."],
], 1);

// Hand-written combinations are not assembled randomly: each sentence has a natural rhythm.
addSet("combo-iphone-night", "combination", c => c.device === "iphone" && night(c), [
  ["Środek nocy, a Ty przeglądasz stronę na iPhonie? Albo masz świetny pomysł, albo nie możesz zasnąć.","It's the middle of the night and you're browsing on an iPhone? Either a great idea or you can't sleep."],
  ["iPhone i taka godzina? Najlepsze pomysły podobno nie patrzą na zegarek.","An iPhone at this hour? The best ideas apparently don't watch the clock."],
], 5);
addSet("combo-iphone-rain", "combination", c => c.device === "iphone" && rain(c), [
  ["{place} według prognozy będzie padać, a Ty przeglądasz na iPhonie. Idealna pora na cyfrowe porządki.","{place} rain is forecast, and you're on an iPhone. Perfect timing for a little digital housekeeping."],
  ["iPhone w dłoni, a {place} zapowiadają deszcz. Ja bym dziś został przy dobrym Wi-Fi.","An iPhone in hand, and {place} rain is on the way. I'd stay somewhere with good Wi-Fi."],
], 4);
addSet("combo-iphone-cold", "combination", c => c.device === "iphone" && hasWeather(c) && temperature(c) <= 4, [
  ["Brrr… {place} {temp}°C, a Ty przeglądasz na iPhonie. Mam nadzieję, że palce nie marzną.","Brrr… {place} it's {temp}°C, and you're browsing on an iPhone. Hope your fingers aren't freezing."],
  ["{place} naprawdę zimno. iPhone w dłoni, a rękawiczki chyba też by się przydały.","{place} it's seriously cold. You've got an iPhone in hand; gloves might help too."],
], 4);
addSet("combo-iphone-heat", "combination", c => c.device === "iphone" && hasWeather(c) && temperature(c) >= 30, [
  ["{place} {temp}°C, a Ty na iPhonie? Daj mu trochę cienia — elektronika też nie lubi upałów.","{place} it's {temp}°C and you're on an iPhone? Give it some shade — electronics don't love the heat."],
], 4);
addSet("combo-android-night", "combination", c => c.device === "android" && night(c), [
  ["Android, późna noc i przeglądanie portfolio. Zapowiada się ciekawy projekt?","Android, late night, and portfolio browsing. Working on a new idea?"],
  ["Tak późno, a Ty na Androidzie? Ja nie potrzebuję snu, ale Ty chyba tak.","This late and you're browsing on Android? I don't need sleep, but you might."],
], 4);
addSet("combo-android-wind", "combination", c => c.device === "android" && windy(c), [
  ["{place} mocno wieje, a Ty przeglądasz stronę na Androidzie. Oby telefon trzymał się pewnie.","{place} it's windy and you're browsing on Android. Hope you're holding on to your phone."],
], 4);
addSet("combo-mac-night", "combination", c => c.device === "mac" && night(c), [
  ["Mac, późna noc i przeglądanie realizacji. Brzmi jak początek ciekawego projektu.","A Mac, late night, and project browsing. Sounds like the start of something interesting."],
  ["Przeglądasz na Macu o tej porze? Oby to był dobry pomysł, a nie deadline na jutro.","Browsing on a Mac this late? Hope it's a great idea, not tomorrow's deadline."],
], 5);
addSet("combo-windows-monday", "combination", c => c.device === "windows" && c.day === 1, [
  ["Poniedziałek i Windows. Mam nadzieję, że przynajmniej jedno dzisiaj działa bez niespodzianek.","Monday and Windows. Hopefully at least one behaves today."],
  ["Windows w poniedziałek? Na wszelki wypadek nie pytam o aktualizacje.","Windows on a Monday? I won't ask about updates, just in case."],
], 4);
addSet("combo-windows-night", "combination", c => c.device === "windows" && night(c), [
  ["Windows, późna noc i portfolio. Ktoś tu chyba zbiera inspiracje.","Windows, late night, and a portfolio. Someone's collecting inspiration."],
], 4);
addSet("combo-linux-night", "combination", c => c.device === "linux" && night(c), [
  ["Linux i późna noc? Mam podejrzenie, że gdzieś masz otwarty terminal.","Linux and a late night? I have a suspicion there's a terminal open somewhere."],
  ["Przeglądasz na Linuksie o tej porze? Mam nadzieję, że nie walczysz z kolejną zależnością.","Browsing on Linux at this hour? Hope you're not fighting another dependency."],
], 5);
addSet("combo-tablet-weather", "combination", c => (c.device === "ipad" || c.device === "tablet") && rain(c), [
  ["{place} prognoza zapowiada deszcz, a Ty przeglądasz {onTablet}. Spokojny plan na wieczór?","{place} rain's in the forecast, and you're browsing {onTablet}. A quiet evening in?"],
], 3);
addSet("combo-phone-heat", "combination", c => phone(c) && hasWeather(c) && temperature(c) >= 30, [
  ["{place} {temp}°C, a Ty przeglądasz {onDevice}. Trzymaj sprzęt w cieniu — upał nie pomaga baterii.","{place} it's {temp}°C and you're browsing {onDevice}. Keep it in the shade — heat isn't great for batteries."],
], 3);
addSet("combo-phone-audit", "combination", c => phone(c) && isAudit(c), [
  ["Przeglądasz audyt {onDevice}. Właśnie na takich urządzeniach często wychodzą błędy mobilnego interfejsu.","You're checking the audit {onDevice}. That's often where mobile UI problems show up."],
  ["Narzędzia SEO {onDevice}? Dobry test, czy wszystko działa wygodnie również bez myszy.","SEO tools {onDevice}? A good test of whether everything works without a mouse."],
], 5);
addSet("combo-phone-ads", "combination", c => phone(c) && isAds(c), [
  ["Meta Ads {onDevice}? Jeden nieuważny klik w Menedżerze reklam potrafi sporo kosztować.","Meta Ads {onDevice}? One careless tap in Ads Manager can be expensive."],
  ["Przeglądasz poradniki reklamowe {onDevice}. Właśnie tak wielu klientów widzi reklamy firm.","You're browsing ad guides {onDevice}. That's how many customers see business ads too."],
], 4);
addSet("combo-phone-crm", "combination", c => phone(c) && isCrm(c), [
  ["Czytasz o CRM {onDevice}. Handlowiec też powinien móc wygodnie obsłużyć leada na takim sprzęcie.","You're reading about CRMs {onDevice}. A salesperson should be able to manage a lead on that device too."],
  ["CRM {onDevice} powinien ułatwiać pracę, a nie zmuszać do celowania w mikroskopijne przyciski.","A CRM {onDevice} should make work easier, not force people to aim at tiny buttons."],
], 4);
addSet("combo-night-audit", "combination", c => night(c) && isAudit(c), [
  ["Audyt strony o tej porze? Szanuję determinację. Zobaczmy, co da się sprawdzić.","A website audit at this hour? Respect the determination. Let's see what we can check."],
], 4);
addSet("combo-night-crm", "combination", c => night(c) && isCrm(c), [
  ["Późna noc, a Ty oglądasz rozwiązania CRM? Chyba szykuje się porządkowanie procesów.","Late night and you're exploring CRM solutions? Sounds like some workflow improvements are coming."],
], 4);
addSet("combo-weekend-work", "combination", c => (c.day === 0 || c.day === 6) && isWork(c), [
  ["Weekendowy przegląd realizacji? To się nazywa porządny research.","Browsing projects on the weekend? That's thorough research."],
  ["Weekend, a Ty oglądasz projekty. Mam nadzieję, że znajdziesz coś inspirującego.","It's the weekend and you're looking at projects. Hope you find some inspiration."],
], 4);
addSet("combo-friday-ads", "combination", c => c.day === 5 && isAds(c), [
  ["Piątek i tematy reklamowe. Oby żadna kampania nie zrobiła dziś niespodzianki.","Friday and advertising topics. Hope no campaign has any surprises today."],
], 4);
addSet("combo-monday-crm", "combination", c => c.day === 1 && isCrm(c), [
  ["Poniedziałek i CRM. Dobry moment, żeby reszta tygodnia była prostsza.","Monday and CRM. Good timing to make the rest of the week easier."],
], 4);
addSet("combo-return-night", "combination", c => c.returning && night(c), [
  ["Późna pora, a Ty znów tutaj? Chyba zaczynamy się lubić.","Late at night and you're back? I think we're starting to get along."],
  ["Witaj ponownie! Nawet o tej godzinie pamiętam, że już się widzieliśmy.","Welcome back! Even at this hour I remember we've met before."],
], 5);
addSet("combo-return-audit", "combination", c => c.returning && isAudit(c), [
  ["Wracasz do narzędzi? Dobrze, warto sprawdzać efekty po zmianach.","Back to the tools? Good — it's worth checking results after making changes."],
], 5);
addSet("combo-rain-evening", "combination", c => rain(c) && evening(c), [
  ["{place} prognozują deszczowy wieczór. W sam raz na chwilę przy komputerze.","{place} a rainy evening is forecast. A good moment to spend a little time at the computer."],
  ["Wieczór, a {place} deszcz w prognozie. Ja bym jeszcze dorzucił herbatę.","Evening, and {place} rain in the forecast. I'd add a cup of tea."],
], 4);
addSet("combo-snow-night", "combination", c => snow(c) && night(c), [
  ["{place} w nocnej prognozie śnieg. Brzmi jak ładny widok za oknem.","{place} snow is in the overnight forecast. Sounds like a lovely view outside."],
], 4);
addSet("combo-storm-night", "combination", c => storm(c) && night(c), [
  ["{place} prognoza zapowiada nocną burzę. Jeśli zgasną światła, nie bierz tego do siebie.","{place} thunderstorms are forecast overnight. If the lights go out, don't take it personally."],
], 5);
addSet("combo-wind-cold", "combination", c => windy(c) && hasWeather(c) && temperature(c) <= 5, [
  ["{place} zimno i wietrznie. Nawet ja wolałbym dziś nie wychodzić z ekranu.","{place} cold and windy. Even I'd rather stay inside the screen."],
], 4);
addSet("combo-sun-weekend", "combination", c => sunny(c) && (c.day === 0 || c.day === 6), [
  ["{place} słońce w weekendowej prognozie. Nie będę Cię długo zatrzymywać.","{place} sunshine in the weekend forecast. I won't keep you long."],
], 4);
addSet("combo-fog-morning", "combination", c => fog(c) && c.hour >= 5 && c.hour <= 10, [
  ["{place} mglisty poranek. Dobrze, że tutaj wszystko staram się pokazać wyraźnie.","{place} a foggy morning. Good thing I try to keep everything clear here."],
], 4);
addSet("combo-heat-crm", "combination", c => hasWeather(c) && temperature(c) >= 30 && isCrm(c), [
  ["{place} upał, a Ty czytasz o CRM. Przynajmniej procesy firmowe mogą działać na chłodno.","{place} it's hot and you're reading about CRMs. At least business processes can stay cool."],
], 4);
addSet("combo-cold-marketing", "combination", c => hasWeather(c) && temperature(c) < 0 && isAds(c), [
  ["{place} mróz w prognozie, a Ty analizujesz reklamy. Oby tylko temperatura była poniżej zera.","{place} freezing temperatures in the forecast, and you're checking ads. Hope it's only the temperature that's below zero."],
], 4);
addSet("combo-dark-night", "combination", c => c.dark && night(c), [
  ["Późna noc, a Twój system preferuje ciemny motyw. Zgraliśmy się idealnie.","Late at night, and your system prefers dark mode. A perfect match."],
], 2);
addSet("combo-linux-guides", "combination", c => c.device === "linux" && isGuide(c), [
  ["Linux i poradniki techniczne. Widzę, że lubisz mieć rzeczy pod kontrolą.","Linux and technical guides. Looks like you like to be in control."],
], 4);
addSet("combo-city-rain", "combination", c => Boolean(c.city) && rain(c), [
  ["{place} prognozują deszcz. Ja na szczęście mieszkam w chmurze, która nie przecieka.","{place} rain's in the forecast. Luckily, my cloud doesn't leak."],
], 4);
addSet("combo-city-snow", "combination", c => Boolean(c.city) && snow(c), [
  ["{place} prognoza zapowiada śnieg. Gdybym miał nos, złapałbym na niego płatek.","{place} snow's in the forecast. If I had a nose, I'd catch a snowflake on it."],
], 4);
addSet("combo-city-heat", "combination", c => Boolean(c.city) && hasWeather(c) && temperature(c) >= 30, [
  ["{place} aż {temp}°C według prognozy?! Na szczęście mój pot jest tylko wirtualny.","{place} it's {temp}°C in the forecast?! Luckily, my sweat is purely virtual."],
], 4);
addSet("combo-city-wind", "combination", c => Boolean(c.city) && windy(c), [
  ["{place} mocny wiatr. Dobrze, że jestem przypięty do przycisku czatu.","{place} strong winds. Good thing I'm attached to the chat button."],
], 4);

addSet("combo-iphone-viewport", "combination", c => c.device === "iphone" && c.width >= 250, [
  ["iPhone i okno o szerokości {width} px. Właśnie pod takie konkretne wymiary układa się ta strona.","An iPhone and a {width}px-wide browser window. That's the exact width this layout is adapting to."],
  ["Wykryłem iPhone'a. Twoja przeglądarka daje mi teraz {width} px szerokości — i ani piksela więcej.","I detected an iPhone. Your browser gives me {width}px of width right now — not a pixel more."],
], 4);

addSet("combo-android-viewport", "combination", c => c.device === "android" && c.width >= 250, [
  ["Android i okno szerokie na {width} px. Wystarczy, żeby zobaczyć, czy interfejs naprawdę jest mobilny.","Android and a {width}px-wide window. Enough to see whether the interface is genuinely mobile-friendly."],
  ["Przeglądasz na Androidzie, a moje miejsce na ekranie ma {width} px. Lepiej dobrze gospodarować pikselami.","You're browsing on Android and I've got {width}px to work with. Better use those pixels well."],
], 4);

addSet("combo-ipad-viewport", "combination", c => c.device === "ipad" && c.width >= 350, [
  ["iPad i {width} px szerokości okna. Właśnie dlatego wersja tabletowa potrzebuje własnego układu.","An iPad and a {width}px-wide window. That's why tablet layouts deserve proper attention."],
  ["Wykryłem iPada. Okno ma {width} px — wystarczająco, żeby złapać błędy, których nie widać na telefonie.","I detected an iPad. The window is {width}px wide — enough to spot issues you might miss on a phone."],
], 4);

addSet("combo-tablet-viewport", "combination", c => c.device === "tablet" && c.width >= 350, [
  ["Tablet i okno o szerokości {width} px. Właśnie do takiego widoku też dopasowuję tę stronę.","A tablet and a {width}px-wide window. This is exactly the kind of layout I design for too."],
  ["Przeglądasz na tablecie. Mam tu {width} px szerokości, więc nie będę udawał, że to wielki monitor.","You're on a tablet. I've got {width}px of width, so I won't pretend it's a huge monitor."],
], 4);

addSet("combo-mac-wide", "combination", c => c.device === "mac" && c.width >= 1200, [
  ["Mac i okno szerokie na {width} px. Tyle przestrzeni aż prosi się o dobry projekt.","A Mac and a {width}px-wide window. That's a lot of space for good design."],
  ["Przeglądasz na Macu. Przy {width} px szerokości okna moje projekty mogą wreszcie odetchnąć.","You're browsing on a Mac. At {width}px wide, my projects finally have room to breathe."],
], 4);

addSet("combo-windows-narrow", "combination", c => c.device === "windows" && c.width < 780 && c.width > 250, [
  ["Windows, ale okno ma tylko {width} px szerokości. I proszę — strona nadal powinna się mieścić.","Windows, but your window is only {width}px wide. And the site should still fit."],
  ["Na Windowsie też można mieć wąskie okno. U Ciebie ma teraz {width} px — już się dopasowuję.","Windows can have a narrow browser window too. Yours is {width}px wide — adapting now."],
], 4);

addSet("combo-linux-wide", "combination", c => c.device === "linux" && c.width >= 1200, [
  ["Linux i {width} px szerokości okna. Dużo miejsca na terminal i jeszcze trochę na mnie.","Linux and a {width}px-wide window. Room for a terminal and still some for me."],
  ["Przeglądasz na Linuksie, w oknie szerokim na {width} px. Brzmi jak porządne stanowisko do pracy.","You're browsing on Linux in a {width}px-wide window. Sounds like a solid workspace."],
], 4);

addSet("combo-iphone-city-night", "combination", c => Boolean(c.city) && c.device === "iphone" && night(c), [
  ["{place} jest już późno, a Ty wciąż przeglądasz na iPhonie. Coś mi mówi, że masz jakiś pomysł.","{place} it's already late, and you're still browsing on an iPhone. I suspect you've got an idea."],
  ["Noc na zegarku, {city} na radarze, a u Ciebie iPhone. Taki zestaw nie zdarza się przypadkiem.","Late at night, {city} on my radar, and you're using an iPhone. Quite a combination."],
], 4);

addSet("combo-android-city-night", "combination", c => Boolean(c.city) && c.device === "android" && night(c), [
  ["{place} późna noc, a Ty na Androidzie. Ja nie śpię, ale nie wiem, jak Ty dajesz radę.","{place} it's late at night and you're on Android. I never sleep, but I don't know how you manage."],
  ["Android, {city} i środek nocy. Oby to była inspiracja, a nie deadline.","Android, {city}, and the middle of the night. Hope it's inspiration, not a deadline."],
], 4);

addSet("combo-mac-city-evening", "combination", c => Boolean(c.city) && c.device === "mac" && evening(c), [
  ["Wieczór, {city} i Mac na pokładzie. Brzmi jak całkiem dobry czas na nowy projekt.","Evening, {city}, and a Mac. Sounds like a good time to start a new project."],
  ["{place} już wieczór, a Ty przeglądasz na Macu. Mam nadzieję, że znajdziesz tu dobrą inspirację.","{place} it's evening and you're browsing on a Mac. Hope you find some inspiration here."],
], 4);

addSet("combo-ipad-city", "combination", c => Boolean(c.city) && c.device === "ipad", [
  ["{city} melduje się na mapie, iPad w rękach. Fajnie, że mogę być z Tobą również na tablecie.","{city} on the map, iPad in hand. Nice that I can join you on a tablet too."],
], 4);

addSet("combo-tablet-city", "combination", c => Boolean(c.city) && c.device === "tablet", [
  ["{city} na moim radarze, a Ty przeglądasz na tablecie. Wszystko tu powinno się wygodnie klikać.","{city} on my radar, and you're browsing on a tablet. Everything should be easy to tap."],
], 4);

addSet("combo-windows-city", "combination", c => Boolean(c.city) && c.device === "windows", [
  ["{city} na radarze, Windows w przeglądarce. Zgadza się? Ja tylko składam to, co naprawdę widzę.","{city} on my radar, Windows in the browser. Sound right? I'm only using what I can actually detect."],
], 4);

addSet("combo-linux-city", "combination", c => Boolean(c.city) && c.device === "linux", [
  ["Linux i {city} — ciekawy zestaw. Jeśli szukasz technicznych szczegółów, jesteś w dobrym miejscu.","Linux and {city} — interesting combination. If you're looking for technical details, you're in the right place."],
], 4);

addSet("combo-safari-iphone", "combination", c => c.device === "iphone" && c.browser === "safari", [
  ["iPhone i Safari. Sprawdzam, czy wszystkie zaokrąglenia i animacje dobrze się tu zachowują.","An iPhone and Safari. I'm keeping an eye on how the rounded corners and animations behave."],
  ["Safari na iPhonie — właśnie tu dobra wersja mobilna powinna wyglądać naturalnie.","Safari on an iPhone — this is where a good mobile site should feel effortless."],
], 4);

addSet("combo-chrome-android", "combination", c => c.device === "android" && c.browser === "chrome", [
  ["Chrome na Androidzie. Dobrze, że nie musisz instalować żadnej aplikacji, żeby ze mną pogadać.","Chrome on Android. Glad you don't need to install an app to chat with me."],
], 4);

addSet("combo-firefox-linux", "combination", c => c.device === "linux" && c.browser === "firefox", [
  ["Firefox i Linux. Czuję, że ktoś tu lubi mieć kontrolę nad przeglądarką.","Firefox and Linux. Something tells me you like control over your browser."],
], 4);

addSet("combo-browser-width", "combination", c => c.browser === "chrome" && c.width >= 350, [
  ["Chrome i okno szerokie na {width} px. Dzięki, teraz wiem dokładnie, ile miejsca mam na ekranie.","Chrome and a {width}px-wide window. Now I know exactly how much space I can use."],
], 4);

addSet("combo-city-viewport", "combination", c => Boolean(c.city) && c.width >= 250 && c.width < 550, [
  ["{city} na radarze, a Twoje okno ma {width} px szerokości. Całkiem sporo informacji z jednej wizyty, prawda?","{city} on my radar and your window is {width}px wide. Quite a lot from one visit, right?"],
], 4);

// The expansion module is data-only and imports the context type exclusively.
rules.push(...expandedCompanionRules);

export const COMPANION_SCENARIO_COUNT = rules.length;

function ruleTopic(rule: Rule): CompanionTopic {
  if (rule.topic) return rule.topic;
  if (rule.category !== "combination") return rule.category;
  if (/(?:-rain|-snow|-sleet|-storm|-cold|-heat|-fog|-weather|-freeze|-sun(?:-|$)|-wind(?:-|$))/.test(rule.id)) return "weather";
  if (/(?:-iphone|-android|-ipad|-tablet|-phone|-linux|-mac(?:-|$)|-windows)/.test(rule.id)) return "device";
  if (/(?:-audit|-crm|-ads|-marketing|-guides|-work)/.test(rule.id)) return "page";
  if (rule.id.includes("-city") || rule.id.includes("-location")) return "location";
  if (rule.id.includes("-return")) return "return";
  return "time";
}

/** Enumerates authored messages for QA; weather/location messages require a real city. */
export function getEligibleCompanionMessages(context: CompanionContext): CompanionNudge[] {
  return rules.filter(rule => canRender(rule, context)).map(rule => ({
    id: rule.id,
    category: rule.category,
    topic: ruleTopic(rule),
    family: rule.family ?? rule.id.replace(/-\d+$/, ""),
    text: fillTemplate(context.lang === "en" ? rule.en : rule.pl, context),
    intent: rule.intent,
  }));
}

const LOCATIVE_PL: Record<string, string> = {
  "rzeszów": "Rzeszowie", "warszawa": "Warszawie", "kraków": "Krakowie",
  "lublin": "Lublinie", "poznań": "Poznaniu", "wrocław": "Wrocławiu",
  "gdańsk": "Gdańsku", "gdynia": "Gdyni", "sopot": "Sopocie",
  "łódź": "Łodzi", "katowice": "Katowicach", "białystok": "Białymstoku",
  "bydgoszcz": "Bydgoszczy", "toruń": "Toruniu", "szczecin": "Szczecinie",
  "olsztyn": "Olsztynie", "kielce": "Kielcach", "opole": "Opolu",
  "zielona góra": "Zielonej Górze", "gorzów wielkopolski": "Gorzowie Wielkopolskim",
  "częstochowa": "Częstochowie", "radom": "Radomiu", "płock": "Płocku",
  "przemyśl": "Przemyślu", "mielec": "Mielcu", "stalowa wola": "Stalowej Woli",
  "tarnobrzeg": "Tarnobrzegu", "krosno": "Krośnie",
  "jasło": "Jaśle", "dębica": "Dębicy", "sanok": "Sanoku",
  "jarosław": "Jarosławiu", "łańcut": "Łańcucie", "leżajsk": "Leżajsku",
  "ustrzyki dolne": "Ustrzykach Dolnych", "bieszczady": "Bieszczadach",
  "zakopane": "Zakopanem", "nowy sącz": "Nowym Sączu",
  "nowy targ": "Nowym Targu", "tarnów": "Tarnowie",
  "bielsko-biała": "Bielsku-Białej", "gliwice": "Gliwicach",
  "zabrze": "Zabrzu", "tychy": "Tychach", "rybnik": "Rybniku",
  "sosnowiec": "Sosnowcu", "chorzów": "Chorzowie",
  "dąbrowa górnicza": "Dąbrowie Górniczej",
  "elbląg": "Elblągu", "grudziądz": "Grudziądzu",
  "inowrocław": "Inowrocławiu", "włocławek": "Włocławku",
  "piła": "Pile", "kalisz": "Kaliszu", "konin": "Koninie",
  "leszno": "Lesznie", "gniezno": "Gnieźnie",
  "piotrków trybunalski": "Piotrkowie Trybunalskim",
  "bełchatów": "Bełchatowie", "sieradz": "Sieradzu",
  "zamość": "Zamościu", "chełm": "Chełmie", "puławy": "Puławach",
  "biala podlaska": "Białej Podlaskiej", "biała podlaska": "Białej Podlaskiej",
  "świdnik": "Świdniku", "łuków": "Łukowie",
  "ostrołęka": "Ostrołęce", "siedlce": "Siedlcach",
  "suwałki": "Suwałkach", "łomża": "Łomży",
  "koszalin": "Koszalinie", "kołobrzeg": "Kołobrzegu",
  "słupsk": "Słupsku", "ustka": "Ustce",
  "jelenia góra": "Jeleniej Górze", "wałbrzych": "Wałbrzychu",
  "legnica": "Legnicy", "lubin": "Lubinie",
  "świdnica": "Świdnicy", "nysa": "Nysie", "brzeg": "Brzegu",
  "głogów": "Głogowie", "świnoujście": "Świnoujściu",
  "pruszków": "Pruszkowie", "piaseczno": "Piasecznie",
  "złotów": "Złotowie", "mińsk mazowiecki": "Mińsku Mazowieckim",
  "marki": "Markach", "wołomin": "Wołominie",
  "krakow": "Krakowie", "poznan": "Poznaniu", "warsaw": "Warszawie",
  "london": "Londynie", "berlin": "Berlinie", "paris": "Paryżu",
  "vienna": "Wiedniu", "prague": "Pradze", "budapest": "Budapeszcie",
};

export function formatCompanionPlace(city: string, lang: CompanionLocale): string {
  if (lang === "en") return "in " + city;
  const inCase = LOCATIVE_PL[city.trim().toLocaleLowerCase("pl")];
  return inCase ? "w " + inCase : city + " —";
}

function fillTemplate(value: string, c: CompanionContext): string {
  const city = c.city ?? "";
  const onDevice = c.device === "iphone"
    ? (c.lang === "pl" ? "na iPhonie" : "on an iPhone")
    : (c.lang === "pl" ? "na telefonie z Androidem" : "on an Android phone");
  const onTablet = c.device === "ipad"
    ? (c.lang === "pl" ? "na iPadzie" : "on an iPad")
    : (c.lang === "pl" ? "na tablecie" : "on a tablet");
  const values: Record<string, string> = {
    city,
    place: city ? formatCompanionPlace(city, c.lang) : "",
    temp: c.weather ? String(c.weather.temperature) : "",
    wind: c.weather?.windSpeed != null ? String(c.weather.windSpeed) : "",
    width: String(c.width),
    onDevice: phone(c) ? onDevice : "",
    onTablet: c.device === "ipad" || c.device === "tablet" ? onTablet : "",
  };
  let result = value;
  for (const [key, replacement] of Object.entries(values)) {
    result = result.split("{" + key + "}").join(replacement);
  }
  return result.replace(/^w /, "W ").replace(/^in /, "In ");
}

function canRender(rule: Rule, c: CompanionContext): boolean {
  if (!rule.eligible(c)) return false;
  const body = c.lang === "en" ? rule.en : rule.pl;
  if ((rule.category === "weather" || rule.category === "location") && !c.city) return false;
  if ((body.includes("{city}") || body.includes("{place}")) && !c.city) return false;
  if (body.includes("{temp}") && !c.weather) return false;
  if (body.includes("{wind}") && c.weather?.windSpeed == null) return false;
  if (body.includes("{onDevice}") && !phone(c)) return false;
  if (body.includes("{onTablet}") && c.device !== "ipad" && c.device !== "tablet") return false;
  return true;
}

/** No personal information is stored in the message selection history. */
export type CompanionSelectionMemory = {
  recentTopics?: CompanionTopic[];
  recentFamilies?: string[];
  recentTexts?: string[];
};

function canonicalCompanionText(text: string): string {
  return text.trim().toLocaleLowerCase().replace(/\\s+/g, " ");
}

/**
 * Weighted shuffle-bag rather than independent random draws.
 * 1. Avoid recently seen IDs and identical rendered sentences.
 * 2. Avoid repeating a category/topic and story family if alternatives exist.
 * 3. Use random selection among genuinely eligible, unseen candidates.
 * 4. Only recycle a message when all applicable alternatives are exhausted.
 *
 * Pure function: call sites may persist only the list of message IDs/families.
 */
export function pickCompanionNudge(
  context: CompanionContext,
  recentIds: string[] = [],
  previousTopic?: CompanionTopic,
  random: () => number = Math.random,
  memory: CompanionSelectionMemory = {},
): CompanionNudge | null {
  const entries = getEligibleCompanionMessages(context);
  if (!entries.length) return null;
  const byId = new Set(recentIds);
  const recentText = new Set((memory.recentTexts ?? []).map(canonicalCompanionText));
  const eligibleUnseen = entries.filter(e => !byId.has(e.id) && !recentText.has(canonicalCompanionText(e.text)));
  let eligible = eligibleUnseen.length ? eligibleUnseen : entries.filter(e => !recentText.has(canonicalCompanionText(e.text)));
  if (!eligible.length) eligible = entries;

  // Prevent a recurring topic/family, but don't eliminate the last choice.
  const topics = (memory.recentTopics ?? (previousTopic ? [previousTopic] : [])).slice(-3);
  const recentTopics = new Set(topics);
  const topicFresh = eligible.filter(e => !recentTopics.has(e.topic));
  if (topicFresh.length >= 3) eligible = topicFresh;
  const families = new Set((memory.recentFamilies ?? []).slice(-4));
  const familyFresh = eligible.filter(e => !families.has(e.family));
  if (familyFresh.length >= 3) eligible = familyFresh;

  const weights: Record<CompanionCategory, number> = {
    combination: 1.45, weather: 1.6, device: 1.4, viewport: 1.3, page: 1.5,
    return: 1.2, location: 1.3, time: 1.15, browser: 1.2, playful: 1.25,
  };
  const ruleIndex = new Map(rules.map(rule => [rule.id, rule] as const));
  const allWeight = eligible.reduce((n, item) => {
    const source = ruleIndex.get(item.id);
    return n + (source?.weight ?? 1) * weights[item.category];
  }, 0);
  let threshold = Math.max(0, Math.min(0.999999999, random())) * allWeight;
  let chosen = eligible[eligible.length - 1];
  for (const item of eligible) {
    const source = ruleIndex.get(item.id);
    threshold -= (source?.weight ?? 1) * weights[item.category];
    if (threshold < 0) { chosen = item; break; }
  }
  return chosen;
}

export function getCompanionContext(
  lang: CompanionLocale,
  pathname: string,
  server: CompanionServerContext | null,
  returning: boolean,
): CompanionContext {
  const ua = navigator.userAgent;
  const touch = navigator.maxTouchPoints > 0;
  const iphone = /iPhone/i.test(ua);
  const ipad = /iPad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  let device: CompanionDevice = "unknown";
  if (iphone) device = "iphone";
  else if (ipad) device = "ipad";
  else if (android && /Mobile/i.test(ua)) device = "android";
  else if (android) device = "tablet";
  else if (/Macintosh|Mac OS X/i.test(ua)) device = "mac";
  else if (/Windows NT/i.test(ua)) device = "windows";
  else if (/Linux|X11/i.test(ua)) device = "linux";


  let browser: CompanionBrowser = "other";
  if (ua.includes("Edg/") || ua.includes("EdgiOS/")) browser = "edge";
  else if (ua.includes("Firefox/") || ua.includes("FxiOS/")) browser = "firefox";
  else if (ua.includes("Chrome/") || ua.includes("CriOS/")) browser = "chrome";
  else if (ua.includes("Safari/")) browser = "safari";

  const now = new Date();
  return {
    lang,
    pathname: pathname.toLowerCase(),
    city: server?.location.city ?? null,
    country: server?.location.country ?? null,
    weather: server?.weather ?? null,
    device,
    browser,
    hour: now.getHours(),
    day: now.getDay(),
    month: now.getMonth(),
    date: now.getDate(),
    dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    touch,
    width: window.innerWidth,
    returning,
  };
}
