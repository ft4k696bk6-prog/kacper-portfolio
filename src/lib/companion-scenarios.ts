export type CompanionLocale = "pl" | "en";
export type CompanionDevice = "iphone" | "ipad" | "android" | "tablet" | "mac" | "windows" | "linux" | "mobile" | "desktop";
export type CompanionBrowser = "safari" | "chrome" | "firefox" | "edge" | "other";
export type CompanionCategory = "weather" | "device" | "time" | "location" | "browser" | "page" | "return" | "combination" | "playful";

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
  weatherCredit: boolean;
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
const hasWeather = (c: CompanionContext) => c.weather !== null;
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
const phone = (c: CompanionContext) => ["iphone", "android", "mobile"].includes(c.device);
const night = (c: CompanionContext) => c.hour >= 23 || c.hour < 5;
const evening = (c: CompanionContext) => c.hour >= 18 && c.hour < 23;
const isAudit = (c: CompanionContext) => /narzedzia|tools|audyt|audit/.test(c.pathname);
const isAds = (c: CompanionContext) => /meta-ads|marketing|reklamy|ads/.test(c.pathname);
const isCrm = (c: CompanionContext) => /crm|aplikacje-webowe|web-apps/.test(c.pathname);
const isServices = (c: CompanionContext) => /uslugi|services|tworzenie-stron|website/.test(c.pathname);
const isWork = (c: CompanionContext) => /realizacje|projects|case-stud|portfolio/.test(c.pathname);
const isGuide = (c: CompanionContext) => /poradniki|blog|guides/.test(c.pathname);

addSet("wx-freeze", "weather", c => hasWeather(c) && temperature(c) < 0, [
  ["Brrr… prognoza dla Twojej okolicy pokazuje {temp}°C. Aż mi się piksele trzęsą.", "Brrr… the forecast for your area says {temp}°C. Even my pixels are shivering."],
  ["{city}: {temp}°C. Jeśli mój wentylator zamarznie, wiesz dlaczego.", "{city}: {temp}°C. If my fan freezes, you'll know why."],
  ["Tak zimno, że nawet mój kod chciałby założyć kurtkę.", "It's so cold even my code wants to wear a coat."],
  ["Poniżej zera? To nie jest temperatura dla cyfrowego zwierzaka.", "Below freezing? Not ideal weather for a little digital creature."],
], 3);
addSet("wx-extreme-freeze", "weather", c => hasWeather(c) && temperature(c) <= -10, [
  ["{temp}°C?! Czy ktoś przestawił pogodę w tryb ekstremalny?", "{temp}°C?! Did someone switch the weather to extreme mode?"],
  ["Na dworze {temp}°C. Ja zostaję po tej stronie ekranu.", "It's {temp}°C outside in your area. I'm staying on this side of the screen."],
], 4);
addSet("wx-chilly", "weather", c => hasWeather(c) && temperature(c) >= 0 && temperature(c) <= 8, [
  ["Brr… u Was dziś chłodno. Na szczęście do rozmowy ze mną nie potrzebujesz rękawiczek.", "Brr… it's chilly in your area. Luckily, you don't need gloves to chat with me."],
  ["Prognoza: {temp}°C. Lepiej mieć pod ręką coś ciepłego.", "Forecast: {temp}°C. Might be worth having something warm nearby."],
  ["Chłodno dzisiaj. Mnie na szczęście wystarczy trochę energii z serwera.", "Chilly today. Luckily, a bit of server power keeps me going."],
], 2);
addSet("wx-mild", "weather", c => hasWeather(c) && temperature(c) >= 9 && temperature(c) <= 22, [
  ["{temp}°C — całkiem przyjemnie. Nawet mi się nie chce chować do chmury.", "{temp}°C — rather pleasant. Even I don't feel like hiding in the cloud."],
  ["Pogoda całkiem znośna. Dobry moment na nowy pomysł.", "Not bad weather at all. A good time for a fresh idea."],
], 1);
addSet("wx-warm", "weather", c => hasWeather(c) && temperature(c) >= 23 && temperature(c) < 30, [
  ["O, robi się ciepło: {temp}°C. Mój cyfrowy termostat już to zauważył.", "Getting warm: {temp}°C. My digital thermostat has noticed."],
  ["Ciepło u Was. Gdybym miał okulary przeciwsłoneczne, właśnie bym je założył.", "It's warm in your area. If I had sunglasses, I'd be wearing them."],
], 2);
addSet("wx-heat", "weather", c => hasWeather(c) && temperature(c) >= 30, [
  ["Ale żar! {temp}°C według prognozy. Oby komputer miał lepsze chłodzenie ode mnie.", "What a scorcher! The forecast says {temp}°C. Hope your computer has better cooling than I do."],
  ["{temp}°C? Dziś nawet piksele wolą siedzieć w cieniu.", "{temp}°C? Even pixels would rather sit in the shade today."],
  ["Gorąco, co? Dobrze, że mogę udawać, że mam klimatyzację.", "Hot, isn't it? Good thing I can pretend I have air conditioning."],
  ["Temperatura rośnie. Spokojnie, to nie przez tę stronę.", "The temperature is rising. Don't worry, it's not because of this website."],
], 4);
addSet("wx-rain", "weather", rain, [
  ["Kap, kap… prognoza zapowiada deszcz. Ja chyba zostanę pod swoim cyfrowym dachem.", "Drip, drip… rain is in the forecast. I'll stay under my digital roof."],
  ["Deszcz w prognozie. Dobrze, że strony internetowe nie potrzebują parasola.", "Rain in the forecast. Good thing websites don't need umbrellas."],
  ["Pogoda dorzuca dziś własne efekty specjalne. I to bez JavaScriptu.", "The weather has its own special effects today. No JavaScript required."],
  ["Jeśli planujesz spacer, zerknij na prognozę. Wygląda na mokry dzień.", "Planning a walk? Check the forecast. Looks like a wet day."],
], 3);
addSet("wx-snow", "weather", snow, [
  ["Pada śnieg w prognozie! Gdybym miał ręce, już lepiłbym bałwana.", "Snow is in the forecast! If I had hands, I'd be making a snowman."],
  ["Biało się robi. Nawet mój ekran zazdrości tej zimowej estetyki.", "Things are turning white. Even my screen is jealous of that winter look."],
  ["Śnieg! Ciekawe, czy moje piksele też potrafią robić aniołki.", "Snow! I wonder if pixels can make snow angels."],
], 3);
addSet("wx-sleet", "weather", sleet, [
  ["Deszcz ze śniegiem? Nawet pogoda nie może się zdecydować.", "Sleet? Even the weather can't make up its mind."],
  ["Prognoza mówi: trochę śniegu, trochę deszczu. Czyli klasyczny pogodowy kompromis.", "Forecast says a bit of snow, a bit of rain. A classic weather compromise."],
], 3);
addSet("wx-storm", "weather", storm, [
  ["Grzmoty w prognozie. Oby tylko prądu nie zabrakło — mam jeszcze sporo do powiedzenia.", "Thunder in the forecast. Hope the power stays on — I've got more to say."],
  ["Burza? Ja się nie boję. Tylko tak profilaktycznie schowam trochę niżej.", "A thunderstorm? I'm not scared. I'll just move a little lower, just in case."],
  ["Niebo szykuje własny pokaz efektów. Ja dziś nie konkuruję.", "The sky is putting on its own light show. I'm not competing today."],
], 5);
addSet("wx-windy", "weather", windy, [
  ["Ale wieje! Według prognozy wiatr osiąga około {wind} m/s. Trzymaj telefon mocno.", "That's windy! The forecast says about {wind} m/s. Hold on to your phone."],
  ["Wietrznie u Was. Ja na szczęście jestem dobrze przypięty do strony.", "Windy in your area. Luckily, I'm securely attached to the page."],
  ["Gdyby mnie dało się zdmuchnąć z ekranu, dziś byłby ten dzień.", "If I could be blown off the screen, today would be the day."],
], 3);
addSet("wx-sunny", "weather", sunny, [
  ["Słońce w prognozie, a Ty w internecie? Nie oceniam. Sam tu mieszkam.", "Sunshine in the forecast, and you're browsing? No judgment. I live here."],
  ["Wygląda na pogodny dzień. Może po mojej krótkiej wizycie wyjdziesz na spacer?", "Looks like a bright day. Maybe go for a walk after our little chat?"],
  ["Słońce robi dziś świetną robotę. Nawet bez CSS.", "The sun is doing a great job today. Without any CSS."],
], 1);
addSet("wx-clouds", "weather", cloudy, [
  ["Trochę chmur. Dobrze, że ja działam również w chmurze.", "A few clouds around. Luckily, I run in the cloud too."],
  ["Słońce gra dziś z chmurami w chowanego. Ja gram w asystenta.", "The sun's playing hide-and-seek with the clouds. I'm playing assistant."],
  ["Pochmurno? Spokojnie, wewnątrz tej strony zawsze coś się dzieje.", "Cloudy? There's still plenty happening inside this website."],
], 1);
addSet("wx-fog", "weather", fog, [
  ["Mgła w prognozie. Oby Twoje plany były dziś bardziej przejrzyste.", "Fog in the forecast. Hope your plans are a little clearer today."],
  ["Widoczność w pogodzie słaba, ale tutaj wszystko staram się pokazać wyraźnie.", "Poor visibility in the forecast. I'll try to keep everything clear here."],
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
addSet("device-wide", "device", c => c.width >= 1500, [
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
addSet("time-halloween", "time", c => c.month === 9 && c.day >= 0 && new Date().getDate() === 31, [
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
addSet("location-outside", "location", c => Boolean(c.country) && c.country !== "PL", [
  ["O, odwiedziny spoza Polski! Internet naprawdę nie zna granic.", "Oh, a visit from outside Poland! The internet really knows no borders."],
  ["Dzielą nas kilometry, ale ta strona i tak dociera do Ciebie w jednej chwili.", "We might be miles apart, but this page still reaches you in an instant."],
], 2);
addSet("location-none", "location", c => !c.city, [
  ["Nie wiem, skąd mnie odwiedzasz. I wiesz co? Nie muszę. Miło Cię tu widzieć.", "I don't know where you're browsing from. And that's fine. Good to see you."],
], 1);

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
addSet("return-first", "return", c => !c.returning, [
  ["Hej! Chyba jeszcze się nie znamy. Jestem małym mieszkańcem tej strony.", "Hey! I don't think we've met. I'm the little creature living on this site."],
  ["Pierwsza wizyta? Rozgość się. Postaram się nie przeszkadzać.", "First visit? Make yourself at home. I'll try not to get in the way."],
], 1);
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

function fillTemplate(value: string, c: CompanionContext): string {
  const map: Record<string, string> = {
    city: c.city ?? "",
    temp: c.weather ? String(c.weather.temperature) : "",
    wind: c.weather?.windSpeed !== null && c.weather?.windSpeed !== undefined
      ? String(c.weather.windSpeed)
      : "",
  };
  return value.replace(/\\{(city|temp|wind)\\}/g, (_match, key: string) => map[key] || "");
}

function canRender(rule: Rule, c: CompanionContext): boolean {
  if (!rule.eligible(c)) return false;
  const body = c.lang === "en" ? rule.en : rule.pl;
  if (body.includes("{city}") && !c.city) return false;
  if (body.includes("{temp}") && !c.weather) return false;
  if (body.includes("{wind}") && c.weather?.windSpeed == null) return false;
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
      combination: 5, weather: 3, device: 3, page: 3,
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
    weatherCredit: (selected.category === "weather" || selected.category === "combination") && Boolean(context.weather) && (
      selected.id.startsWith("wx-") ||
      selected.id.includes("-rain") || selected.id.includes("-snow") || selected.id.includes("-sleet") ||
      selected.id.includes("-wind") || selected.id.includes("-cold") || selected.id.includes("-heat") ||
      selected.id.includes("-storm") || selected.id.includes("-fog") || selected.id.includes("-sun")
    ),
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
  let device: CompanionDevice = "desktop";
  if (iphone) device = "iphone";
  else if (ipad) device = "ipad";
  else if (android && /Mobile/i.test(ua)) device = "android";
  else if (android) device = "tablet";
  else if (/Macintosh|Mac OS X/i.test(ua)) device = "mac";
  else if (/Windows/i.test(ua)) device = "windows";
  else if (/Linux/i.test(ua)) device = "linux";
  else if (window.innerWidth < 768) device = "mobile";

  let browser: CompanionBrowser = "other";
  if (/Edg\\/|EdgiOS\\//i.test(ua)) browser = "edge";
  else if (/Firefox\\/|FxiOS\\//i.test(ua)) browser = "firefox";
  else if (/Chrome\\/|CriOS\\//i.test(ua)) browser = "chrome";
  else if (/Safari\\//i.test(ua)) browser = "safari";

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
    dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    touch,
    width: window.innerWidth,
    returning,
  };
}
