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
export type CompanionNudge = {
  id: string;
  category: CompanionCategory;
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
  ["Widzę, że przeglądasz stronę na iPhonie. Wiesz, ile firm traci klientów przez źle działającą wersję mobilną? Możemy sprawdzić Twoją.", "I see you're browsing on an iPhone. Know how many businesses lose customers to a broken mobile website? We can check yours."],
  ["iPhone w dłoni, a cała strona na małym ekranie. Tak właśnie powinien działać dobry projekt.", "An iPhone in hand and a whole website on a small screen. That's what good design should do."],
  ["Ciekawostka: dobry widok mobilny to nie tylko pomniejszona wersja desktopu.", "Fun fact: good mobile design isn't just a shrunken desktop site."],
], 4, "audit");
addSet("device-android", "device", c => c.device === "android", [
  ["Android na pokładzie! Twoja firmowa strona też dobrze działa na różnych telefonach? Możemy to sprawdzić.", "Android on board! Does your business website work well across phones too? We can check."],
  ["Android wykryty. A wiesz, że ta sama strona może wyglądać inaczej na każdym telefonie?", "Android detected. Did you know the same site can look different on every phone?"],
  ["Telefon to dziś często pierwsze miejsce kontaktu klienta z firmą. Warto o tym pamiętać.", "A phone is often a customer's first contact with a business. Worth remembering."],
], 4, "audit");
addSet("device-ipad", "device", c => c.device === "ipad" || c.device === "tablet", [
  ["O, tablet! Ani telefon, ani komputer. Właśnie dlatego dobre strony muszą dopasowywać się do ekranu.", "A tablet! Neither phone nor laptop. That's why good websites must adapt."],
  ["Większy ekran dotykowy to niezły test dla każdej strony. Sprawdzaj śmiało.", "A larger touchscreen is a good test for any website. Feel free to explore."],
], 2);
addSet("device-mac", "device", c => c.device === "mac", [
  ["Mac? Dobry sprzęt do kreatywnej pracy. Chcesz zajrzeć za kulisy tej strony?", "A Mac? Great for creative work. Want a peek behind the scenes?"],
  ["Mac na pokładzie. Obiecuję nie prosić Cię o instalację siedmiu aplikacji.", "Mac on board. I promise I won't ask you to install seven apps."],
], 2);
addSet("device-windows", "device", c => c.device === "windows", [
  ["Windows wykryty. Obiecuję nie poprosić o ponowne uruchomienie komputera.", "Windows detected. I promise not to ask you to restart your computer."],
  ["Duży ekran i Windows? Rozgość się, jest co oglądać.", "Windows and a larger screen? Make yourself comfortable — there's plenty to explore."],
], 2);
addSet("device-linux", "device", c => c.device === "linux", [
  ["O, Linux! Jest szansa, że rozumiesz moje problemy z zależnościami.", "Oh, Linux! You might actually understand my dependency problems."],
  ["Linux? W takim razie nie będę tłumaczył, co to terminal.", "Linux? I guess I won't have to explain what a terminal is."],
], 4);
addSet("device-phone", "device", phone, [
  ["Całą tę stronę masz teraz w kieszeni. Fajne, ile da się zmieścić na małym ekranie, prawda?", "This whole website fits in your pocket. Amazing what fits on a small screen, right?"],
  ["Przeglądasz na telefonie. Sprawdź, czy wszystko wygodnie się klika.", "You're browsing on a phone. See how easy everything is to tap."],
  ["Mały ekran nie powinien oznaczać gorszej strony. Chcesz sprawdzić własną?", "A small screen shouldn't mean a worse website. Want to check yours?"],
], 2);
addSet("viewport-wide", "viewport", c => c.width >= 1500, [
  ["Ale masz tu przestrzeni! Na takim ekranie mógłbym postawić drugi serwer.", "Look at all that space! I could fit a second server on that screen."],
  ["Szeroki ekran, szerokie możliwości. Sprawdź, jak ułożyłem tu projekty.", "Wide screen, wide possibilities. Have a look at the project layout."],
], 2);
addSet("device-touch", "device", c => c.touch, [
  ["Możesz mnie dotknąć. Tylko delikatnie, jestem z pikseli.", "You can tap me. Gently though — I'm made of pixels."],
], 1);

addSet("time-morning", "time", c => c.hour >= 5 && c.hour < 9, [
  ["Tak wcześnie? Widzę, że ktoś dzisiaj nie zamierza marnować dnia.", "Up this early? Looks like someone has plans for today."],
  ["Dzień dobry! Kawa już wypita czy dopiero zaczynamy?", "Good morning! Coffee finished, or just getting started?"],
  ["Poranek. Ja już jestem gotowy do działania, a Ty?", "Morning. I'm ready to go — are you?"],
], 2);
addSet("time-lunch", "time", c => c.hour >= 11 && c.hour < 15, [
  ["Pora obiadowa, a Ty tutaj? To ja poproszę trochę RAM-u na deser.", "Lunchtime and you're here? I'll have some extra RAM for dessert."],
  ["Południe. Idealny moment, żeby znaleźć rozwiązanie problemu, który czeka od rana.", "Midday. A good moment to solve that problem that's been waiting since morning."],
], 1);
addSet("time-evening", "time", evening, [
  ["Dobry wieczór. Podobno najlepsze pomysły przychodzą po godzinach.", "Good evening. They say the best ideas come after hours."],
  ["Wieczorny research? Dobrze trafiłeś. Mam kilka rzeczy do pokazania.", "Evening research? You're in the right place. I've got a few things to show."],
  ["Wieczór, cisza i trochę technologii. Całkiem dobry zestaw.", "An evening, some quiet, and a bit of tech. Not a bad combination."],
], 2);
addSet("time-night", "time", night, [
  ["Ty jeszcze nie śpisz? Ja nie muszę, ale Ty chyba powinieneś.", "Still awake? I don't need sleep, but you probably do."],
  ["Nocne przeglądanie internetu. Brzmi jak początek dobrego pomysłu albo długa bezsenność.", "Late-night browsing. Either a great idea or a serious case of insomnia."],
  ["Już tak późno? U mnie czas płynie trochę inaczej.", "That late already? Time works a little differently for me."],
], 3);
addSet("time-monday", "time", c => c.day === 1, [
  ["Poniedziałek… jeszcze tylko kilka kaw i będzie piątek.", "Monday… just a few coffees and it'll be Friday."],
  ["Nowy tydzień, nowa lista rzeczy do zrobienia. Brzmi znajomo?", "New week, new to-do list. Sound familiar?"],
], 1);
addSet("time-friday", "time", c => c.day === 5, [
  ["Piątek! Oby Twoje plany na weekend miały mniej błędów niż piątkowy deploy.", "Friday! Hope your weekend plans have fewer bugs than a Friday deploy."],
  ["Piątek, ale ja wciąż na stanowisku. Urlopy nie są jeszcze dla mnie.", "Friday, but I'm still on duty. No holidays for me yet."],
], 2);
addSet("time-weekend", "time", c => c.day === 0 || c.day === 6, [
  ["Weekend, a Ty oglądasz portfolio? Szanuję tę ciekawość.", "It's the weekend and you're checking out a portfolio? I respect the curiosity."],
  ["Weekend! Ja pracuję bez przerwy, ale Tobie polecam chwilę odpoczynku.", "Weekend! I work nonstop, but I recommend taking a little break."],
], 2);
addSet("time-winter", "time", c => c.month === 11 || c.month <= 1, [
  ["Zimą najlepiej działa ogrzewanie, kawa i dobry kod. Kolejność dowolna.", "In winter, heating, coffee, and clean code work best. Any order."],
], 1);
addSet("time-spring", "time", c => c.month >= 2 && c.month <= 4, [
  ["Wiosna! Może czas na wiosenne porządki również na firmowej stronie?", "Spring! Maybe it's time for a little website spring-cleaning too?"],
], 1);
addSet("time-autumn", "time", c => c.month >= 8 && c.month <= 10, [
  ["Jesień. Liście spadają, ale oby nie spadała liczba klientów.", "Autumn. Leaves are falling — hopefully your customer numbers aren't."],
], 1);
addSet("time-halloween", "time", c => c.month === 9 && c.date === 31, [
  ["Buuu! Najstraszniejsze rzeczy, jakie widziałem, to niektóre stare fragmenty kodu.", "Boo! The scariest things I've seen are pieces of legacy code."],
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
  ["Wolisz ciemny motyw? Mamy podobny gust.", "Prefer dark mode? We have similar taste."],
  ["Ciemny motyw aktywny. Oczy odpoczywają, piksele pracują.", "Dark mode is on. Eyes can relax while pixels do the work."],
], 1);
addSet("browser-light", "browser", c => !c.dark, [
  ["Jasny motyw? Jasne. Ja też czasami wychodzę z ciemności.", "Light mode? Fair enough. I step out of the dark sometimes too."],
], 1);
addSet("browser-reduced", "browser", c => c.reducedMotion, [
  ["Wolisz mniej ruchu na ekranie? Uszanuję to. Żadnych akrobacji.", "Prefer less motion? I respect that. No acrobatics."],
], 2);

addSet("location-city", "location", c => Boolean(c.city), [
  ["Psst… mój mały detektor wskazuje okolice miasta {city}. Trafiłem chociaż w pobliże?", "Psst… my little detector points somewhere near {city}. Close enough?"],
  ["{city} melduje się na radarze. Pozdrawiam z mojego kawałka internetu.", "{city} is on my radar. Greetings from my little corner of the internet."],
  ["Wygląda na to, że zaglądasz z okolic {city}. Tak naprawdę nie znam Twojego dokładnego adresu.", "Looks like you're somewhere around {city}. I don't know your exact address, though."],
], 2);
addSet("location-outside", "location", c => Boolean(c.city) && Boolean(c.country) && c.country !== "PL", [
  ["O, odwiedziny spoza Polski! Internet naprawdę nie zna granic.", "Oh, a visit from outside Poland! The internet really knows no borders."],
  ["Dzielą nas kilometry, ale ta strona i tak dociera do Ciebie w jednej chwili.", "We might be miles apart, but this page still reaches you in an instant."],
], 2);
addSet("page-tools", "page", isAudit, [
  ["O, będzie testowanie. Lubię testy. Szczególnie kiedy przechodzę je za pierwszym razem.", "Oh, we're testing things! I like tests. Especially when I pass on the first try."],
  ["Sprawdzamy stronę? Świetnie. Najpierw fakty, potem poprawki.", "Auditing a website? Great. Facts first, fixes second."],
  ["Nie trzeba zgadywać, dlaczego strona nie działa dobrze. Można to sprawdzić.", "No need to guess why a website underperforms. We can check."],
], 3);
addSet("page-ads", "page", isAds, [
  ["Reklamy potrafią przepalać budżet szybciej niż samochód paliwo. Lepiej sprawdzić ustawienia.", "Ads can burn through a budget fast. Better to check the setup."],
  ["Zestaw reklam nieaktywny? Zanim zwiększysz budżet, sprawdź, co naprawdę nie działa.", "Ad set inactive? Before spending more, check what actually failed."],
  ["Meta Ads to nie tylko przycisk „Promuj post”. Choć czasem tak to wygląda.", "Meta Ads is more than the Boost Post button. Even if it sometimes doesn't look that way."],
], 3);
addSet("page-crm", "page", isCrm, [
  ["Nadal Excel do ogarniania klientów? Nie oceniam… ale znam wygodniejsze rozwiązania.", "Still managing customers in spreadsheets? No judgment… but there are easier ways."],
  ["Dobry CRM nie powinien dokładać pracy. Powinien ją zdejmować z głowy.", "A good CRM shouldn't create more work. It should take work off your plate."],
  ["Lead, notatka, zadanie, termin. Wszystko w jednym miejscu brzmi znacznie lepiej, prawda?", "Lead, note, task, deadline. All in one place sounds better, doesn't it?"],
], 3);
addSet("page-services", "page", isServices, [
  ["Wiesz, co lubię w dobrych stronach? Kiedy są ładne, szybkie i faktycznie pomagają firmie.", "Know what I like about good websites? They look great, load fast, and genuinely help a business."],
  ["Ładna strona to początek. Ważne, żeby ktoś chciał na niej zostać.", "A beautiful website is a start. What matters is making people want to stay."],
  ["Jeśli projekt ma działać na telefonie i komputerze, warto pomyśleć o tym od początku.", "If a project needs to work on phone and desktop, plan for both from day one."],
], 3);
addSet("page-work", "page", isWork, [
  ["Zaglądasz za kulisy? Lubię ten moment.", "Looking behind the scenes? I love this part."],
  ["Te projekty nie zrobiły się same. Chociaż gdybym miał ręce…", "These projects didn't build themselves. Although, if I had hands…"],
  ["Realizacje mówią więcej niż obietnice. Dlatego warto je pokazywać.", "Real work says more than promises. That's why it's worth showing."],
], 3);
addSet("page-guides", "page", isGuide, [
  ["Dobra decyzja: najpierw zrozumieć problem, potem go rozwiązać.", "Good call: understand the problem first, then solve it."],
  ["Czasem jedna dobra wskazówka oszczędza kilka godzin szukania.", "Sometimes one useful tip saves hours of searching."],
], 2);
addSet("page-contact", "page", c => /kontakt|contact/.test(c.pathname), [
  ["Wolisz porozmawiać z człowiekiem? Rozumiem. Kacper zna więcej rzeczy ode mnie. Na razie.", "Prefer talking to a human? Fair enough. Kacper knows more than I do. For now."],
], 2);
addSet("return-visit", "return", c => c.returning, [
  ["O, znowu Ty! Miło, że wracasz.", "Oh, you again! Nice to have you back."],
  ["Witaj ponownie. Jak widzisz, nadal pilnuję tego miejsca.", "Welcome back. As you can see, I'm still looking after this place."],
  ["Znowu się widzimy. Chyba zaczynamy się lubić.", "We meet again. I think we're starting to get along."],
], 3);
addSet("playful-general", "playful", any, [
  ["Psst… jestem tutaj, gdybyś chciał o coś zapytać.", "Psst… I'm here if you feel like asking something."],
  ["Nie jestem wyskakującą reklamą. Obiecuję. Po prostu czasem lubię zagadać.", "I'm not a pop-up ad. Promise. I just like saying hello sometimes."],
  ["Mam tu całkiem niezły widok na stronę. Tylko czasami zasłania mi go kursor.", "I've got a pretty good view of this website. The cursor gets in my way sometimes."],
  ["Zwykle siedzę cicho. Ale czasem mam coś ciekawego do powiedzenia.", "I'm usually quiet. Sometimes I have something interesting to say, though."],
  ["Nie chcę przeszkadzać. Po prostu sprawdzam, czy wszystko u Ciebie dobrze.", "Don't want to interrupt. Just checking that everything's going well."],
], 1);

// Hand-written combinations are not assembled randomly: each sentence has a natural rhythm.
addSet("combo-iphone-night", "combination", c => c.device === "iphone" && night(c), [
  ["Środek nocy, a Ty przeglądasz strony na iPhonie? Albo masz świetny pomysł, albo nie możesz zasnąć.", "Browsing websites on your iPhone in the middle of the night? Either a great idea or you can't sleep."],
  ["iPhone, późna godzina i portfolio? Brzmi jak początek ciekawego projektu.", "iPhone, late hour, and a portfolio? Sounds like the start of an interesting project."],
], 5);
addSet("combo-iphone-rain", "combination", c => c.device === "iphone" && rain(c), [
  ["Deszcz w prognozie i iPhone w dłoni. Może to dobry moment, żeby sprawdzić swoją stronę?", "Rain in the forecast and an iPhone in hand. Maybe a good moment to check your website?"],
  ["Na dworze zapowiada się mokro. Przynajmniej na iPhonie ta strona pozostanie sucha.", "Looks wet outside. At least this site will stay dry on your iPhone."],
], 4);
addSet("combo-iphone-cold", "combination", c => c.device === "iphone" && hasWeather(c) && temperature(c) <= 4, [
  ["Brrr… {temp}°C w prognozie, a Ty z iPhonem? Mam nadzieję, że ręce masz w cieple.", "Brrr… {temp}°C in the forecast and you're on an iPhone? Hope your hands are warm."],
  ["Zimno w Twojej okolicy. Przynajmniej do przewijania strony nie potrzebujesz zdejmować rękawiczek… chyba.", "Chilly around you. At least scrolling shouldn't require taking your gloves off… probably."],
], 4);
addSet("combo-iphone-heat", "combination", c => c.device === "iphone" && hasWeather(c) && temperature(c) >= 30, [
  ["{temp}°C i iPhone w dłoni? Daj mu trochę cienia, a mnie trochę uwagi.", "{temp}°C and an iPhone in your hand? Give it some shade and me a little attention."],
], 4);
addSet("combo-android-night", "combination", c => c.device === "android" && night(c), [
  ["Android, późna noc i technologia. Widzę, że to nie przypadkowa wizyta.", "Android, late night, and tech. Doesn't sound like a random visit."],
  ["Jeszcze nie śpisz i przeglądasz na Androidzie? Ja na szczęście nie potrzebuję snu.", "Still awake and browsing on Android? Luckily, I don't need sleep."],
], 4);
addSet("combo-android-wind", "combination", c => c.device === "android" && windy(c), [
  ["Wietrznie w Twojej okolicy. Trzymaj Androida mocno, nie chciałbym Cię zgubić.", "Windy in your area. Hold on to that Android — I'd hate to lose you."],
], 4);
addSet("combo-mac-night", "combination", c => c.device === "mac" && night(c), [
  ["Mac, późna noc i przeglądanie portfolio? Brzmi jak początek jakiegoś ciekawego projektu.", "A Mac, a late night, and portfolio browsing? Sounds like the start of a creative project."],
  ["Praca na Macu o tej porze? Oby to był dobry pomysł, a nie deadline na jutro.", "Working on a Mac this late? Hope it's a great idea, not a deadline tomorrow."],
], 5);
addSet("combo-windows-monday", "combination", c => c.device === "windows" && c.day === 1, [
  ["Poniedziałek i Windows. Mam nadzieję, że przynajmniej jedno dzisiaj nie sprawia Ci problemów.", "Monday and Windows. Hopefully at least one of them is behaving today."],
  ["Windows w poniedziałek? Dobra, to ja na wszelki wypadek nie pytam o aktualizacje.", "Windows on a Monday? Okay, I won't ask about updates."],
], 4);
addSet("combo-windows-night", "combination", c => c.device === "windows" && night(c), [
  ["Windows, noc i portfolio. Ktoś tu chyba planuje coś większego.", "Windows, late night, and a portfolio. Someone might be planning something big."],
], 4);
addSet("combo-linux-night", "combination", c => c.device === "linux" && night(c), [
  ["Linux i noc? Nie musisz mi tłumaczyć. Pewnie jeszcze jeden terminal jest otwarty.", "Linux and late night? No explanation needed. There's probably another terminal open."],
  ["Późno, a Linux nadal działa. Czyli pewnie jeszcze nie skończyłeś konfigurować.", "It's late and Linux is still running. So the configuration probably isn't finished."],
], 5);
addSet("combo-tablet-weather", "combination", c => (c.device === "ipad" || c.device === "tablet") && rain(c), [
  ["Deszcz w prognozie, tablet w dłoni. Brzmi jak plan na spokojne popołudnie.", "Rain in the forecast and a tablet in hand. Sounds like a relaxed afternoon."],
], 3);
addSet("combo-phone-heat", "combination", c => phone(c) && hasWeather(c) && temperature(c) >= 30, [
  ["Upał i ekran telefonu. Pamiętaj o cieniu — sprzęt też nie lubi się przegrzewać.", "Heat and a phone screen. Find some shade — devices don't like overheating either."],
], 3);
addSet("combo-phone-audit", "combination", c => phone(c) && isAudit(c), [
  ["Testujesz stronę z telefonu? Świetnie. Właśnie na telefonach wiele problemów wychodzi na jaw.", "Auditing on your phone? Great. That's where a lot of website problems become obvious."],
  ["Diagnostyka na małym ekranie. Idealny sposób, żeby sprawdzić, czy narzędzie jest naprawdę wygodne.", "Auditing on a small screen. A good way to see whether a tool is actually usable."],
], 5);
addSet("combo-phone-ads", "combination", c => phone(c) && isAds(c), [
  ["Meta Ads na telefonie? Uważaj na jeden klik — czasem kosztuje więcej niż myślisz.", "Meta Ads on mobile? Careful with that one tap — it can cost more than you think."],
  ["Sprawdzasz reklamy na telefonie. Warto pamiętać, że Twoi klienci też je tam oglądają.", "Checking ads on a phone? Remember, your customers are seeing them there too."],
], 4);
addSet("combo-phone-crm", "combination", c => phone(c) && isCrm(c), [
  ["CRM na telefonie powinien ułatwiać pracę handlowcowi, a nie zmuszać go do celowania palcem w małe przyciski.", "A mobile CRM should help salespeople, not make them aim at tiny buttons."],
  ["Jeśli handlowiec nie może wygodnie sprawdzić leada na telefonie, to CRM wymaga poprawy.", "If a salesperson can't comfortably check a lead on a phone, the CRM needs work."],
], 4);
addSet("combo-night-audit", "combination", c => night(c) && isAudit(c), [
  ["Nocna diagnostyka strony? Podoba mi się ta determinacja. Sprawdźmy konkrety.", "A late-night website audit? I admire the determination. Let's check the facts."],
], 4);
addSet("combo-night-crm", "combination", c => night(c) && isCrm(c), [
  ["Jest późno, a Ty czytasz o CRM? Chyba ktoś chce w końcu uporządkować firmę.", "It's late and you're reading about CRMs? Someone's ready to get their business organized."],
], 4);
addSet("combo-weekend-work", "combination", c => (c.day === 0 || c.day === 6) && isWork(c), [
  ["Weekendowy przegląd realizacji? To naprawdę porządny research.", "Browsing case studies on the weekend? That's serious research."],
  ["Weekend, a Ty analizujesz projekty. Mam nadzieję, że znajdziesz coś inspirującego.", "Checking projects over the weekend? Hope something sparks an idea."],
], 4);
addSet("combo-friday-ads", "combination", c => c.day === 5 && isAds(c), [
  ["Piątek i Meta Ads. Oby żadna kampania nie postanowiła dziś zrobić niespodzianki.", "Friday and Meta Ads. Hopefully no campaign decides to surprise you today."],
], 4);
addSet("combo-monday-crm", "combination", c => c.day === 1 && isCrm(c), [
  ["Poniedziałek. Idealny dzień, żeby ustawić CRM tak, aby reszta tygodnia była prostsza.", "Monday. A perfect day to make your CRM simplify the rest of the week."],
], 4);
addSet("combo-return-night", "combination", c => c.returning && night(c), [
  ["Dobry wieczór, znowu się widzimy. Chyba zaczynamy się lubić.", "Good evening, we meet again. I think we're starting to get along."],
  ["Znowu Ty i znowu tak późno? Zaczynam dostrzegać pewien schemat.", "You again, and this late? I'm starting to notice a pattern."],
], 5);
addSet("combo-return-audit", "combination", c => c.returning && isAudit(c), [
  ["Wracasz do narzędzi? Bardzo dobrze. Warto sprawdzać efekty po zmianach.", "Back to the tools? Good. It's worth checking results after making changes."],
], 5);
addSet("combo-rain-evening", "combination", c => rain(c) && evening(c), [
  ["Deszczowy wieczór według prognozy. W sam raz na chwilę przy komputerze.", "A rainy evening in the forecast. A good time to spend a moment at the computer."],
  ["Wieczór, deszcz i spokojne przeglądanie. Ja bym tylko dorzucił herbatę.", "Evening, rain, and a quiet browse. I'd add a cup of tea."],
], 4);
addSet("combo-snow-night", "combination", c => snow(c) && night(c), [
  ["Śnieg i późna noc. Brzmi jak ładny widok za oknem… przynajmniej według prognozy.", "Snow and a late night. Sounds lovely outside… at least according to the forecast."],
], 4);
addSet("combo-storm-night", "combination", c => storm(c) && night(c), [
  ["Burza w nocnej prognozie? Jeśli zgasną światła, nie bierz tego do siebie.", "Thunderstorms in the overnight forecast? If the lights go out, don't take it personally."],
], 5);
addSet("combo-wind-cold", "combination", c => windy(c) && hasWeather(c) && temperature(c) <= 5, [
  ["Zimno i wietrznie. Taka pogoda potrafi przekonać nawet mnie, żeby nie wychodzić z ekranu.", "Cold and windy. Weather like that could convince even me to stay inside the screen."],
], 4);
addSet("combo-sun-weekend", "combination", c => sunny(c) && (c.day === 0 || c.day === 6), [
  ["Weekend i słońce w prognozie. Nie będę Cię zatrzymywać długo. Obiecuję.", "Weekend and sunshine in the forecast. I won't keep you long. Promise."],
], 4);
addSet("combo-fog-morning", "combination", c => fog(c) && c.hour >= 5 && c.hour <= 10, [
  ["Mglisty poranek. Ja na szczęście mam całkiem dobrą widoczność na tę stronę.", "Foggy morning. Luckily, I've got a clear view of this page."],
], 4);
addSet("combo-heat-crm", "combination", c => hasWeather(c) && temperature(c) >= 30 && isCrm(c), [
  ["Na dworze gorąco, a Ty myślisz o CRM. Przynajmniej procesy w firmie mogą działać na chłodno.", "It's hot outside and you're looking at CRMs. At least your processes can stay cool."],
], 4);
addSet("combo-cold-marketing", "combination", c => hasWeather(c) && temperature(c) < 0 && isAds(c), [
  ["Mróz w prognozie, a Ty analizujesz reklamy. Lepiej, żeby tylko pogoda miała temperaturę poniżej zera.", "Freezing forecast and you're checking ads. Let's hope it's only the temperature that's below zero."],
], 4);
addSet("combo-dark-night", "combination", c => c.dark && night(c), [
  ["Ciemny motyw i późna pora. Widać, że umiesz zadbać o klimat.", "Dark mode and a late hour. You certainly know how to set the mood."],
], 2);
addSet("combo-linux-guides", "combination", c => c.device === "linux" && isGuide(c), [
  ["Linux i poradniki techniczne? Widzę, że czytasz dokumentację także poza pracą.", "Linux and technical guides? Looks like you read documentation outside work too."],
], 4);
addSet("combo-city-rain", "combination", c => Boolean(c.city) && rain(c), [
  ["{city}: według prognozy dzisiaj mokro. Ja na szczęście mieszkam w chmurze, która nie przecieka.", "{city}: rain is in the forecast. Luckily, my cloud doesn't leak."],
], 4);
addSet("combo-city-snow", "combination", c => Boolean(c.city) && snow(c), [
  ["{city}: prognoza zapowiada śnieg. Gdybym miał nos, przykleiłbym do niego płatek.", "{city}: snow is in the forecast. If I had a nose, I'd catch a snowflake on it."],
], 4);
addSet("combo-city-heat", "combination", c => Boolean(c.city) && hasWeather(c) && temperature(c) >= 30, [
  ["{city}: aż {temp}°C według prognozy? Na szczęście ja mam tylko wirtualne czoło do ocierania.", "{city}: {temp}°C in the forecast? Luckily, my forehead is purely virtual."],
], 4);
addSet("combo-city-wind", "combination", c => Boolean(c.city) && windy(c), [
  ["{city} i taki wiatr? Trzymaj się mocno — ja już trzymam się przycisku czatu.", "{city} and winds like that? Hold tight — I'm holding on to the chat button."],
], 4);

export const COMPANION_SCENARIO_COUNT = rules.length;

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
  if (lang === "en") return "In " + city;
  const inCase = LOCATIVE_PL[city.trim().toLocaleLowerCase("pl")];
  return inCase ? "W " + inCase : city + " —";
}

function fillTemplate(value: string, c: CompanionContext): string {
  const city = c.city ?? "";
  const onDevice = c.device === "iphone"
    ? (c.lang === "pl" ? "na iPhonie" : "on an iPhone")
    : (c.lang === "pl" ? "na telefonie z Androidem" : "on an Android phone");
  const values: Record<string, string> = {
    city, place: city ? formatCompanionPlace(city, c.lang) : "",
    temp: c.weather ? String(c.weather.temperature) : "",
    wind: c.weather?.windSpeed != null ? String(c.weather.windSpeed) : "",
    width: String(c.width),
    onDevice: phone(c) ? onDevice : "",
  };
  return value.replace(/\\{(city|place|temp|wind|width|onDevice)\\}/g, (_match, token: string) => values[token] ?? "");
}

function canRender(rule: Rule, c: CompanionContext): boolean {
  if (!rule.eligible(c)) return false;
  const body = c.lang === "en" ? rule.en : rule.pl;
  if ((rule.category === "weather" || rule.category === "location") && !c.city) return false;
  if ((body.includes("{city}") || body.includes("{place}")) && !c.city) return false;
  if (body.includes("{temp}") && !c.weather) return false;
  if (body.includes("{wind}") && c.weather?.windSpeed == null) return false;
  if (body.includes("{onDevice}") && !phone(c)) return false;
  return true;
}

/**
 * Returns a deterministic, authored sentence, never a generated AI completion.
 * The recent-ID and previous-category guards reduce repeats and sales pressure.
 */
export function pickCompanionNudge(
  context: CompanionContext,
  recentIds: string[] = [],
  previousCategory?: CompanionCategory,
  random: () => number = Math.random,
): CompanionNudge | null {
  let candidates = rules.filter(rule => canRender(rule, context) && !recentIds.includes(rule.id));
  if (!candidates.length) candidates = rules.filter(rule => canRender(rule, context));
  if (!candidates.length) return null;

  const weighted = candidates.map(rule => {
    const categoryWeight: Record<CompanionCategory, number> = {
      combination: 5, weather: 3, device: 3, viewport: 2.4, page: 3,
      return: 2, location: 1.6, time: 1.2, browser: 1, playful: 1,
    };
    const repetitionPenalty = rule.category === previousCategory ? 0.1 : 1;
    return { rule, weight: rule.weight * categoryWeight[rule.category] * repetitionPenalty };
  });
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let threshold = Math.max(0, Math.min(0.999999, random())) * total;
  let selected = weighted[weighted.length - 1].rule;
  for (const item of weighted) {
    threshold -= item.weight;
    if (threshold < 0) { selected = item.rule; break; }
  }
  return {
    id: selected.id,
    category: selected.category,
    text: fillTemplate(context.lang === "en" ? selected.en : selected.pl, context),
    intent: selected.intent,

  };
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
