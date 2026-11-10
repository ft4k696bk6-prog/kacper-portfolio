/**
 * Additional, zero-token Berni messages.
 *
 * Every emitted string is built once from two locally authored, grammatically
 * complete sentences. Combining them is deterministic and never calls an LLM.
 * Rules are tied to verified browser signals, the current route or a town
 * returned by the consented weather endpoint. No model/phone guessing.
 *
 * Keep the message identities stable across deploys: local no-repeat history
 * refers to these IDs.
 */
import type { CompanionContext, CompanionCategory, CompanionTopic, CompanionDevice } from "./companion-scenarios";

type Pair = readonly [pl: string, en: string];
export type ExpandedCompanionRule = {
  id: string;
  category: CompanionCategory;
  topic: CompanionTopic;
  family: string;
  eligible: (context: CompanionContext) => boolean;
  pl: string;
  en: string;
  weight: number;
  intent: "chat" | "audit";
};

const devices: Array<{
  key: Exclude<CompanionDevice, "unknown">;
  namePl: string;
  nameEn: string;
  onPl: string;
  onEn: string;
  adjectivePl: string;
  adjectiveEn: string;
}> = [
  { key: "iphone", namePl: "iPhone'a", nameEn: "an iPhone", onPl: "na iPhonie", onEn: "on an iPhone", adjectivePl: "iPhone", adjectiveEn: "iPhone" },
  { key: "android", namePl: "Androida", nameEn: "an Android phone", onPl: "na Androidzie", onEn: "on Android", adjectivePl: "Android", adjectiveEn: "Android" },
  { key: "ipad", namePl: "iPada", nameEn: "an iPad", onPl: "na iPadzie", onEn: "on an iPad", adjectivePl: "iPad", adjectiveEn: "iPad" },
  { key: "tablet", namePl: "tablet", nameEn: "a tablet", onPl: "na tablecie", onEn: "on a tablet", adjectivePl: "tablet", adjectiveEn: "tablet" },
  { key: "mac", namePl: "Maca", nameEn: "a Mac", onPl: "na Macu", onEn: "on a Mac", adjectivePl: "Mac", adjectiveEn: "Mac" },
  { key: "windows", namePl: "Windowsa", nameEn: "a Windows device", onPl: "na Windowsie", onEn: "on Windows", adjectivePl: "Windows", adjectiveEn: "Windows" },
  { key: "linux", namePl: "Linuksa", nameEn: "a Linux device", onPl: "na Linuksie", onEn: "on Linux", adjectivePl: "Linux", adjectiveEn: "Linux" },
];

function introsForDevice(d: (typeof devices)[number]): Pair[] {
  return [
    [`Widzę, że przeglądasz ${d.onPl}.`, `I can see you're browsing ${d.onEn}.`],
    [`${d.adjectivePl} wykryty.`, `${d.adjectiveEn} detected.`],
    [`Ten mały dymek dotarł do Ciebie ${d.onPl}.`, `This little message reached you ${d.onEn}.`],
    [`Właśnie oglądasz bernecki.dev ${d.onPl}.`, `You're looking at bernecki.dev ${d.onEn}.`],
    [`Berni melduje się ${d.onPl}.`, `Berni reporting for duty ${d.onEn}.`],
    [`Przeglądarka wskazuje ${d.namePl}.`, `Your browser reports ${d.nameEn}.`],
    [`Zaglądasz do mnie ${d.onPl}.`, `You're visiting me ${d.onEn}.`],
  ];
}

const pageMoments: Array<{ key: string; match: (path: string) => boolean; lines: Pair[] }> = [
  {
    key: "home",
    match: p => p === "/" || p === "/en" || p === "/en/",
    lines: [
      ["To dopiero strona główna, a kawałek niżej czekają konkretne projekty.", "This is only the homepage — the actual projects are just a little further down."],
      ["Rozejrzyj się: większość rzeczy na tej stronie da się naprawdę przetestować.", "Take a look around — there are real things here you can actually try."],
      ["Jeśli szukasz czegoś konkretnego, zacznij od realizacji albo darmowych narzędzi.", "If you're looking for something specific, start with the projects or free tools."],
      ["Zobacz, ile różnych rozwiązań da się zamknąć w jednym portfolio.", "See how many different solutions can fit inside one portfolio."],
      ["Nie musisz czytać wszystkiego — na początek wystarczy jeden ciekawy projekt.", "You don't have to read everything — one interesting project is a good start."],
      ["W tym miejscu technologia spotyka się z prowadzeniem biznesu.", "This is where technology meets the practical side of running a business."],
      ["Przewiń trochę niżej, jeśli chcesz zobaczyć więcej niż same obietnice.", "Scroll a little further if you want to see more than just promises."],
    ],
  },
  {
    key: "tools",
    match: p => /(?:narzedzia|\/en\/tools|audyt-strony)/.test(p),
    lines: [
      ["Właśnie jesteś w darmowych narzędziach — tu warto coś sprawdzić samodzielnie.", "You're browsing the free tools — a good place to try something yourself."],
      ["Możesz przetestować stronę bez tworzenia konta.", "You can test a website here without making an account."],
      ["Najbardziej lubię narzędzia, które pokazują dane zamiast składać obietnice.", "I like tools that show data instead of making promises."],
      ["Wybierz jeden test i sprawdź, czy wynik Cię zaskoczy.", "Pick one test and see whether the result surprises you."],
      ["Przy audycie lepiej opierać się na wyniku niż na przeczuciu.", "With an audit, actual results beat gut feelings."],
      ["Tu można sprawdzić sporo rzeczy bez instalowania dodatkowych programów.", "There's a lot you can check here without installing another app."],
      ["Niektóre problemy na stronie wychodzą dopiero wtedy, gdy ktoś je zmierzy.", "Some website problems only show up once someone actually measures them."],
    ],
  },
  {
    key: "projects",
    match: p => /realizacje|portfolio|case-stud|\/projects/.test(p),
    lines: [
      ["To sekcja realizacji — możesz zobaczyć konkretne efekty pracy.", "You're looking at actual projects and their results."],
      ["Lubię ten dział, bo tutaj projekty mówią same za siebie.", "I like this section because the projects speak for themselves."],
      ["Sprawdź detale wdrożeń, nie tylko pierwsze zdjęcie.", "Look into the implementation details, not just the first image."],
      ["Każda realizacja rozwiązuje trochę inny problem biznesowy.", "Every project here solves a slightly different business problem."],
      ["Warto zajrzeć do środka projektu, żeby zrozumieć, dlaczego wygląda właśnie tak.", "It's worth opening a project to see why it was built that way."],
      ["Część najciekawszej pracy dzieje się tam, gdzie nie widać jej na zrzutach ekranu.", "Some of the most interesting work happens where screenshots can't show it."],
      ["Jeżeli coś Cię zainteresuje, warto porównać też inne realizacje.", "If one project catches your eye, it's worth comparing it with the others."],
    ],
  },
  {
    key: "crm",
    match: p => /crm|aplikacje-webowe|web-apps/.test(p),
    lines: [
      ["Właśnie oglądasz temat CRM — tutaj liczy się porządek w pracy z klientem.", "You're reading about CRMs — where keeping client work organized matters."],
      ["Dobry CRM ma skracać drogę od leada do działania, a nie ją wydłużać.", "A good CRM should shorten the path from a lead to an action, not lengthen it."],
      ["Warto zobaczyć, jak jeden system może połączyć handlowców i menedżerów.", "It's worth seeing how one system can connect salespeople and managers."],
      ["Najciekawsze funkcje CRM zwykle wychodzą w codziennej pracy.", "The most useful CRM features tend to reveal themselves in everyday work."],
      ["Jeżeli firma traci czas na przepisywanie danych, dobry CRM potrafi to zmienić.", "If a business wastes time retyping data, a good CRM can change that."],
      ["Tutaj najważniejsze są zadania, terminy i szybki dostęp do informacji.", "Tasks, deadlines, and fast access to information matter most here."],
      ["Dobrze zaprojektowany CRM nie powinien zmuszać do klikania przez pięć ekranów.", "A well-designed CRM shouldn't make people click through five screens."],
    ],
  },
  {
    key: "ads",
    match: p => /meta-ads|reklamy|marketing|\/ads|\/services\/marketing/.test(p),
    lines: [
      ["Przeglądasz temat reklam — tutaj każdy błąd w ustawieniach ma swoją cenę.", "You're looking at advertising — where configuration mistakes have a price."],
      ["W kampaniach wolę konkretne liczby od ładnych wykresów bez kontekstu.", "With campaigns, I prefer useful numbers to pretty charts without context."],
      ["Sam przycisk „Promuj” rzadko rozwiązuje problem z marketingiem.", "The Boost button rarely solves a marketing problem by itself."],
      ["Jeśli reklamy nie działają, warto najpierw sprawdzić, gdzie uciekają wyniki.", "If ads aren't working, it's worth checking where performance is being lost."],
      ["Najpierw pomiar, potem optymalizacja budżetu — odwrotna kolejność bywa kosztowna.", "Measure first, optimize the budget second — the reverse can be expensive."],
      ["Dobry marketing zaczyna się od zrozumienia, kto naprawdę ma kupić.", "Good marketing starts with knowing who is actually supposed to buy."],
      ["Jedna niepozorna opcja w Menedżerze reklam potrafi zmienić sporo.", "One unassuming setting in Ads Manager can change quite a lot."],
    ],
  },
  {
    key: "websites",
    match: p => /tworzenie-stron|\/services\/websites|strony-internetowe|website-development/.test(p),
    lines: [
      ["Jesteś przy tworzeniu stron — tutaj liczy się nie tylko wygląd.", "You're looking at website development — there's more to it than appearances."],
      ["Dobra strona powinna pomagać odwiedzającemu zrobić kolejny krok.", "A good website should help visitors take the next step."],
      ["Szybkość, czytelność i wygoda bywają ważniejsze niż kolejna animacja.", "Speed, clarity, and usability often matter more than another animation."],
      ["Najładniejszy projekt niewiele da, jeśli nikt nie potrafi znaleźć kontaktu.", "A gorgeous design doesn't help much if nobody can find the contact page."],
      ["Warto sprawdzić stronę na prawdziwych urządzeniach, a nie tylko na jednym monitorze.", "It's worth testing on real devices, not just one monitor."],
      ["Część problemów z witryną wychodzi dopiero po pierwszych wizytach klientów.", "Some website issues only show up once real customers start visiting."],
      ["Przy stronach lubię rozwiązania proste na zewnątrz, nawet jeśli pod spodem są złożone.", "I like websites that feel simple outside, even when a lot is happening underneath."],
    ],
  },
  {
    key: "guides",
    match: p => /poradniki|\/en\/guides|\/blog|\/en\/blog/.test(p),
    lines: [
      ["Jesteś przy poradniku — może uda Ci się rozwiązać problem bez dzwonienia po pomoc.", "You're reading a guide — perhaps you'll solve it without needing to call anyone."],
      ["W dobrym poradniku liczy się konkret, a nie dziesięć akapitów wstępu.", "A good guide needs substance, not ten paragraphs of introduction."],
      ["Jeśli szukasz odpowiedzi na konkretny błąd, zacznij od jego przyczyny.", "If you're troubleshooting an error, start with its cause."],
      ["Czasem jedno poprawne ustawienie oszczędza kilka godzin pracy.", "Sometimes a single correct setting saves hours of work."],
      ["Przeczytaj dokładnie wynik, zanim zmienisz coś w konfiguracji.", "Read the result carefully before changing any settings."],
      ["Warto sprawdzić, czy instrukcja pasuje do wersji narzędzia, której używasz.", "Make sure the guide matches the version of the tool you're using."],
      ["Ciekawe, czy znajdziesz tutaj odpowiedź na dokładnie ten problem, z którym przyszedłeś.", "I wonder if you'll find the answer to the exact problem that brought you here."],
    ],
  },
  {
    key: "contact",
    match: p => /kontakt|\/contact/.test(p),
    lines: [
      ["To strona kontaktowa, więc do rozmowy z człowiekiem masz już naprawdę blisko.", "You're on the contact page, so an actual human conversation is close."],
      ["Jeśli masz konkretny pomysł, najlepiej opisać go kilkoma zdaniami.", "If you've got a specific idea, a few sentences explaining it are a great start."],
      ["Nie musisz znać wszystkich technologii, żeby opisać swój problem.", "You don't need to know all the technologies to describe your problem."],
      ["Najłatwiej zacząć od celu, który chcesz osiągnąć.", "It's easiest to start with the goal you're trying to achieve."],
      ["Czasem jedna dobra rozmowa pozwala uniknąć kilku tygodni złej pracy.", "One good conversation can sometimes save weeks of work in the wrong direction."],
      ["W kontakcie ważniejsze jest dobre pytanie niż gotowa specyfikacja.", "A good question is more useful here than a perfect specification."],
      ["Opisz, co przeszkadza Ci dziś w firmie — resztę można wspólnie dopracować.", "Describe what's getting in your way at work — the rest can be worked out together."],
    ],
  },
];

const moments: Array<{ key: string; when: (c: CompanionContext) => boolean; lines: Pair[] }> = [
  { key: "dawn", when: c => c.hour >= 5 && c.hour < 9, lines: [
    ["Tak wcześnie? Dzień dopiero się zaczyna.", "Up this early? The day is just getting started."],
    ["Rano łatwiej złapać pomysł, zanim zaczną dzwonić telefony.", "Mornings are great for ideas before the phones start ringing."],
    ["Mam nadzieję, że pierwsza kawa już działa.", "I hope your first coffee has kicked in."],
    ["Poranek to niezła pora na coś nowego.", "Morning is a good time for something new."],
    ["Zanim świat się rozpędzi, można spokojnie popatrzeć na projekty.", "Before the world speeds up, there's time to look through projects."],
    ["Berni już na nogach — chociaż właściwie nie muszę spać.", "Berni is already up — even though I don't technically sleep."],
    ["Nie wiem, czy to pobudka czy końcówka nocnej pracy.", "Not sure if you're an early riser or finishing a late-night session."],
  ]},
  { key: "day", when: c => c.hour >= 9 && c.hour < 15, lines: [
    ["W środku dnia zawsze znajdzie się chwila na dobry pomysł.", "There's always a moment for a good idea during the day."],
    ["Mam nadzieję, że Twoja lista zadań nie rośnie szybciej ode mnie.", "Hope your to-do list isn't growing faster than I am."],
    ["Za oknem dzień, a tutaj wszystko działa bez przerwy.", "It's daytime outside, and everything here keeps running."],
    ["Czasem w środku pracy przychodzi najlepszy pomysł na usprawnienie.", "Sometimes the best improvement idea arrives in the middle of work."],
    ["Przerwa na mały research technologiczny? Jestem za.", "Taking a quick break for some tech research? I'm all for it."],
    ["Ja dziś nie mam spotkań, więc mogę chwilę pogadać.", "No meetings in my calendar today, so I'm free for a chat."],
    ["Pomiędzy zadaniami warto znaleźć moment na coś inspirującego.", "It's worth finding a moment for inspiration between tasks."],
  ]},
  { key: "afternoon", when: c => c.hour >= 15 && c.hour < 18, lines: [
    ["Popołudnie to dobry moment, żeby dokończyć coś zaczętego rano.", "Afternoons are good for finishing what you started earlier."],
    ["Zanim zamkniesz laptop, może jeszcze jedno dobre odkrycie?", "Before you close the laptop, maybe one more good discovery?"],
    ["Nie wiem, czy kończysz pracę, czy dopiero ją zaczynasz.", "Not sure whether you're wrapping up work or just getting started."],
    ["Dzień już trochę trwa, ale na pomysły nigdy nie jest za późno.", "The day's well underway, but it's never too late for ideas."],
    ["Popołudniowy research ma swój urok.", "Afternoon research has its own charm."],
    ["Ja nie liczę godzin do końca zmiany, ale rozumiem ten zwyczaj.", "I don't count down to the end of a shift, but I understand the idea."],
    ["Jeszcze chwila i będzie można odsapnąć. Chyba.", "Just a little longer until you can relax. Hopefully."],
  ]},
  { key: "evening", when: c => c.hour >= 18 && c.hour < 23, lines: [
    ["Wieczorem rodzą się czasem najciekawsze projekty.", "Some of the best projects start in the evening."],
    ["Wieczorny spokój i trochę technologii — lubię ten zestaw.", "An evening's quiet and a bit of technology — I like that mix."],
    ["Mam nadzieję, że to przyjemny research, a nie awaria do naprawienia.", "Hope this is enjoyable research rather than an emergency fix."],
    ["Wieczór to dobra pora, żeby zerknąć na coś poza bieżącą pracą.", "Evenings are good for looking beyond the day's usual work."],
    ["Zamiast serialu wybrałeś portfolio? Ciekawe.", "A portfolio instead of a TV show? Interesting choice."],
    ["Ja nie mam pilota od telewizora, więc zostaję tutaj.", "I don't own a TV remote, so I'm staying right here."],
    ["Przy takiej porze nawet mały pomysł może urosnąć w coś dużego.", "At this hour, even a small idea can grow into something big."],
  ]},
  { key: "night", when: c => c.hour >= 23 || c.hour < 5, lines: [
    ["Tak późno? Najwyraźniej oboje jeszcze nie śpimy.", "This late? Apparently neither of us is asleep yet."],
    ["Nocny research bywa początkiem czegoś ciekawego.", "Late-night research can be the start of something interesting."],
    ["Wszystko dookoła cichnie, a ja dalej świecę na ekranie.", "Things are getting quiet outside, but I'm still glowing on your screen."],
    ["Nie pytam, dlaczego nie śpisz. Sam nie mam takiej funkcji.", "I won't ask why you're awake. I don't have a sleep function myself."],
    ["O tej porze warto zapisać dobry pomysł, zanim ucieknie.", "At this hour, it's worth writing down a good idea before it disappears."],
    ["Mój zegar nie ma trybu nocnego. Za to strona ma ciemny motyw.", "My clock has no night mode. The website has a dark theme, though."],
    ["Jeśli to kolejna godzina przed ekranem, pamiętaj też o odpoczynku.", "If you've been staring at a screen for hours, remember to rest too."],
  ]},
];

function weatherState(c: CompanionContext): string | null {
  if (!c.city || !c.weather) return null;
  const code = c.weather.symbol?.toLowerCase() || "";
  if (code.includes("thunder")) return "storm";
  if (code.includes("snow")) return "snow";
  if (code.includes("rain") || code.includes("drizzle")) return "rain";
  if (code.includes("fog")) return "fog";
  if (c.weather.temperature <= 0) return "freeze";
  if (c.weather.temperature >= 30) return "heat";
  if ((c.weather.windSpeed ?? 0) >= 10) return "wind";
  if (code.includes("clearsky") || code.includes("fair")) return "sunny";
  if (code.includes("cloud")) return "clouds";
  return c.weather.temperature <= 8 ? "chilly" : "mild";
}

const weathers: Array<{ key: string; lines: Pair[] }> = [
  { key: "freeze", lines: [
    ["Brrr… {place} dziś {temp}°C.", "Brrr… {place} it's {temp}°C today."],
    ["{place} mróz daje się we znaki.", "{place} the cold is really making itself felt."],
    ["{place} prognoza pokazuje temperaturę poniżej zera.", "{place} the forecast shows below-zero temperatures."],
    ["{place} dziś pogoda raczej na ciepłą herbatę.", "{place} today calls for a hot cup of tea."],
    ["{place} taki chłód, że aż piksele mi drżą.", "{place} it's cold enough to make my pixels shiver."],
    ["{place} zima nie odpuszcza.", "{place} winter isn't letting up."],
  ]},
  { key: "chilly", lines: [
    ["{place} dziś tylko {temp}°C.", "{place} it's only {temp}°C today."],
    ["{place} wyraźnie chłodno według prognozy.", "{place} noticeably chilly in the forecast."],
    ["{place} chyba przyda się cieplejsza bluza.", "{place} an extra layer might be a good idea."],
    ["{place} temperatura nie zachęca do siedzenia na dworze.", "{place} the temperature isn't exactly inviting outside."],
    ["{place} taki dzień, że kawa może stygnąć za szybko.", "{place} it's the sort of day when coffee might cool too quickly."],
    ["{place} chłodna pogoda, ale internet działa dalej.", "{place} chilly weather, but the internet keeps going."],
  ]},
  { key: "heat", lines: [
    ["{place} aż {temp}°C według prognozy.", "{place} the forecast says a scorching {temp}°C."],
    ["{place} upał nie odpuszcza.", "{place} the heat is relentless."],
    ["{place} nawet mój wirtualny wentylator ma dziś ciężko.", "{place} even my imaginary fan is struggling today."],
    ["{place} prognoza nie zostawia złudzeń: gorąco.", "{place} the forecast leaves no doubt: it's hot."],
    ["{place} taki żar, że chciałbym zejść do piwnicy z serwerami.", "{place} it's so hot I'd rather hide in a cool server room."],
    ["{place} dobry dzień, żeby trzymać elektronikę w cieniu.", "{place} a good day to keep electronics in the shade."],
  ]},
  { key: "rain", lines: [
    ["{place} w prognozie deszcz.", "{place} rain is in the forecast."],
    ["{place} zapowiada się mokry dzień.", "{place} a wet day is on the way."],
    ["{place} chmury szykują dzisiaj małą niespodziankę.", "{place} the clouds have a little surprise planned today."],
    ["Kap, kap… {place} prognozują opady.", "Drip, drip… {place} showers are forecast."],
    ["{place} parasol może się dziś przydać.", "{place} an umbrella may come in handy today."],
    ["{place} aura bardziej na kawę niż spacer.", "{place} coffee weather rather than walking weather."],
  ]},
  { key: "snow", lines: [
    ["{place} prognoza zapowiada śnieg.", "{place} snow is in the forecast."],
    ["{place} może się dziś zrobić biało.", "{place} things may turn white today."],
    ["{place} płatki śniegu mają własną animację. Bez JavaScriptu.", "{place} snowflakes have their own animation. No JavaScript needed."],
    ["{place} w prognozie zimowy klimat.", "{place} a winter scene is in the forecast."],
    ["{place} taki dzień, że mój wirtualny bałwan miałby robotę.", "{place} my virtual snowman would have plenty to do today."],
    ["{place} śnieg może dziś przykryć wszystko oprócz tej strony.", "{place} snow might cover everything except this website."],
  ]},
  { key: "storm", lines: [
    ["{place} w prognozie burza.", "{place} thunderstorms are in the forecast."],
    ["{place} niebo szykuje własny pokaz efektów.", "{place} the sky is preparing its own special effects."],
    ["{place} zapowiadają grzmoty.", "{place} thunder is expected."],
    ["{place} oby prąd dziś nie sprawił niespodzianki.", "{place} hopefully the power stays on today."],
    ["{place} prognoza brzmi głośniej niż mój dymek.", "{place} the forecast sounds louder than my little message."],
    ["{place} pogoda ma dziś ambicję zostać główną atrakcją.", "{place} the weather is aiming to be today's main event."],
  ]},
  { key: "wind", lines: [
    ["{place} porządnie wieje.", "{place} it's seriously windy."],
    ["{place} wiatr ma dziś sporo energii.", "{place} the wind has plenty of energy today."],
    ["{place} według prognozy wiatr osiąga około {wind} m/s.", "{place} the forecast says winds around {wind} m/s."],
    ["{place} lepiej uważać na lekkie rzeczy na zewnątrz.", "{place} best keep an eye on anything light outside."],
    ["{place} taka aura, że sam chciałbym się mocniej przypiąć do strony.", "{place} weather like this makes me want to hold onto the page."],
    ["{place} wiatr robi dziś większe zamieszanie niż moje animacje.", "{place} the wind is causing more movement than my animations."],
  ]},
  { key: "sunny", lines: [
    ["{place} według prognozy słonecznie.", "{place} sunshine is in the forecast."],
    ["{place} słońce ma dzisiaj dobry dzień.", "{place} the sun is having a good day."],
    ["{place} wygląda na pogodny dzień.", "{place} it looks like a bright day."],
    ["{place} dużo światła, a ja nadal siedzę na czarnym tle.", "{place} lots of daylight, and I'm still sitting on a black background."],
    ["{place} słońce świeci bez żadnej biblioteki animacji.", "{place} the sun shines without any animation library."],
    ["{place} pogoda zachęca, żeby na chwilę oderwać wzrok od ekranu.", "{place} the weather is inviting you to look away from the screen for a while."],
  ]},
  { key: "clouds", lines: [
    ["{place} niebo dziś pochmurne.", "{place} the sky is cloudy today."],
    ["{place} chmury przejęły dziś scenę.", "{place} the clouds have taken center stage today."],
    ["{place} według prognozy sporo chmur.", "{place} quite a bit of cloud in the forecast."],
    ["{place} słońce chyba gra dzisiaj w chowanego.", "{place} the sun seems to be playing hide-and-seek today."],
    ["{place} pogoda jest w chmurze. Ja zresztą też.", "{place} the weather is in the cloud. So am I, actually."],
    ["{place} niebo w szarościach, jakby ktoś projektował je pod ten interfejs.", "{place} the sky is all grey, almost like it was designed for this interface."],
  ]},
];

const playful: Pair[] = [
  ["Hej, ja tylko pilnuję, żeby żaden piksel nie uciekł.", "Hey, I'm just making sure no pixels escape."],
  ["Czasem najlepszy efekt specjalny to po prostu szybka strona.", "Sometimes the best special effect is just a fast website."],
  ["Możesz mnie zignorować. Ale nie mów, że się nie przywitałem.", "You can ignore me. Just don't say I didn't say hello."],
  ["Ciekawostka: nadal nie mam własnego biurka. Mieszkam w przeglądarce.", "Fun fact: I still don't have a desk. I live in the browser."],
  ["Najgorsze w byciu cyfrowym? Nie mogę sobie zrobić kawy.", "The worst part of being digital? I can't make coffee."],
  ["Mam oczy, ale nie widzę Twojego pokoju. I tak jest lepiej.", "I've got eyes, but I can't see your room. Better that way."],
  ["Czasem warto kliknąć coś z ciekawości. Byle nie każdy link w mailu.", "Sometimes it's worth clicking out of curiosity. Just not every email link."],
  ["Dzisiaj nie planuję rewolucji. Może tylko małą animację.", "No revolution planned today. Maybe just a small animation."],
  ["Jeśli zastanawiasz się, co tu robię: jestem od ciekawostek i rozmowy.", "If you're wondering what I'm doing here: I specialize in little discoveries and conversation."],
  ["Małe rzeczy potrafią zrobić duże wrażenie. Nawet taki dymek.", "Small things can make a big impression. Even this little message."],
  ["Nie mam ulubionej przeglądarki. Każdą traktuję tak samo poważnie.", "I don't have a favorite browser. I take them all seriously."],
  ["Nie mogę wyjść na spacer, więc czasem chodzę po tej stronie.", "I can't go for a walk, so sometimes I wander around this website."],
  ["Wiem, wyglądam na zajętego. Tak naprawdę czekam na ciekawe pytanie.", "I know, I look busy. I'm really just waiting for an interesting question."],
  ["Gdybym miał kieszenie, trzymałbym w nich zapasowe piksele.", "If I had pockets, I'd keep spare pixels in them."],
  ["Jestem mały, ale mam całkiem spory apetyt na nowe pomysły.", "I'm small, but I've got a pretty big appetite for new ideas."],
  ["Ta strona nie ma tajnego hasła do wejścia. Za to ma kilka zakamarków.", "This website has no secret entry password. It does have a few hidden corners."],
  ["W dobrym interfejsie najważniejsze jest czasem to, czego nie widać.", "Sometimes the most important part of a good interface is what you don't see."],
  ["Nie liczę odwiedzających na palcach. Nie mam palców.", "I don't count visitors on my fingers. I don't have fingers."],
  ["Jeżeli coś Cię zainteresuje, możesz po prostu kliknąć. Nie obrażę się.", "If something catches your eye, just click. I won't be offended."],
  ["Moim ulubionym błędem jest ten, który już został naprawiony.", "My favorite bug is one that's already been fixed."],
  ["Czasem siedzę cicho, żeby strona mogła mówić sama za siebie.", "Sometimes I stay quiet so the website can speak for itself."],
  ["Zastanawiałeś się kiedyś, ile drobnych decyzji kryje się w jednym ekranie?", "Ever wonder how many little decisions go into a single screen?"],
  ["Nie musisz znać języka programowania, żeby docenić dobre rozwiązanie.", "You don't need to know how to code to appreciate a good solution."],
  ["Gdyby kliknięcia miały dźwięki, internet byłby naprawdę głośny.", "If every click made a sound, the internet would be a noisy place."],
  ["Jestem gotowy do rozmowy. Ale nie będę ciągnął Cię za rękaw.", "I'm ready to chat. But I won't tug at your sleeve."],
  ["Wszystkie moje dowcipy są zapisane lokalnie. Zero tokenów.", "All my jokes are stored locally. Zero AI tokens."],
  ["Nie potrzebuję snu. Za to potrzebuję, żeby ta strona działała szybko.", "I don't need sleep. I do need this website to run fast."],
  ["Witaj w miejscu, gdzie nawet mały robot ma swoje zdanie.", "Welcome to a place where even a little robot has opinions."],
  ["Ktoś tu zadbał o zaokrąglone rogi. Ja tylko ich pilnuję.", "Someone took care of these rounded corners. I just keep watch."],
  ["Nie sprawdzam, co masz w kieszeni. Wystarczy mi rozmiar okna przeglądarki.", "I don't know what's in your pocket. Your browser window size is enough for me."],
  ["Jeżeli zgubiłeś się w menu, spokojnie — ja też czasem szukam przycisków.", "If you've gotten lost in the menu, don't worry — I look for buttons sometimes too."],
  ["Mój największy talent? Pojawiam się dokładnie w rogu ekranu.", "My greatest talent? Appearing right in the corner of the screen."],
  ["Nie jestem wyszukiwarką, ale potrafię podpowiedzieć, gdzie zajrzeć.", "I'm not a search engine, but I can suggest where to look."],
  ["Mam dobry humor. Przynajmniej tak mówi mój kod.", "I'm in a good mood. At least that's what my code says."],
  ["Wirtualny zwierzak, prawdziwa strona. Trochę dziwny duet, prawda?", "A virtual pet, a real website. An odd pairing, isn't it?"],
  ["Podobno pierwsze wrażenie robi się tylko raz. Ja liczę na drugie też.", "They say you only get one first impression. I'm hoping for a second too."],
  ["Nie robię zdjęć ekranu. Wolę po prostu tu być.", "I don't take screenshots. I prefer just being here."],
  ["Nie próbuję sprzedać Ci niczego tym dymkiem. Po prostu się odzywam.", "I'm not trying to sell you anything with this message. Just saying hi."],
  ["Dobrze, że internet nie wymaga od robotów prawa jazdy.", "Good thing robots don't need driving licenses to explore the internet."],
  ["Kiedyś chciałbym nauczyć się mrugać idealnie w rytm muzyki.", "One day I'd like to learn to blink perfectly in time with music."],
];

function buildRules(): ExpandedCompanionRule[] {
  const all: ExpandedCompanionRule[] = [];
  const add = (id: string, category: CompanionCategory, topic: CompanionTopic, family: string, eligible: (c: CompanionContext) => boolean, pair: Pair, weight = 1.5) => {
    all.push({ id, category, topic, family, eligible, pl: pair[0], en: pair[1], weight, intent: "chat" });
  };
  for (const device of devices) {
    const starts = introsForDevice(device);
    // 7 device openings × 8 real sections × 7 different endings = 392 distinct contextual messages.
    for (const page of pageMoments) {
      for (let index = 0; index < 7; index++) {
        const first = starts[index], second = page.lines[index];
        add(`exp-page-${device.key}-${page.key}-${index}`, "combination", "page", `page:${page.key}`,
          c => c.device === device.key && page.match(c.pathname), [first[0] + " " + second[0], first[1] + " " + second[1]], 1.5);
      }
    }
    // Seven unique, composed messages for each verified device and each time of day.
    for (const moment of moments) {
      for (let index = 0; index < 7; index++) {
        const first = starts[index], second = moment.lines[index];
        add(`exp-clock-${device.key}-${moment.key}-${index}`, "combination", "time", `clock:${moment.key}`,
          c => c.device === device.key && moment.when(c), [first[0] + " " + second[0], first[1] + " " + second[1]], 1.4);
      }
    }
    // Weather requires both actual weather data and a nonempty IP-derived city.
    for (const weather of weathers) {
      for (let index = 0; index < 6; index++) {
        const first = weather.lines[index], deviceSentence = starts[index];
        add(`exp-weather-device-${weather.key}-${device.key}-${index}`, "combination", "weather", `weather:${weather.key}`,
          c => c.device === device.key && weatherState(c) === weather.key,
          [first[0] + " " + deviceSentence[0], first[1] + " " + deviceSentence[1]], 1.7);
      }
    }
  }

  // Weather + local time: three independent ways to comment on this combination.
  for (const weather of weathers) for (const moment of moments) {
    for (let index = 0; index < 3; index++) {
      const first = weather.lines[index], second = moment.lines[index];
      add(`exp-weather-clock-${weather.key}-${moment.key}-${index}`, "combination", "weather", `weather:${weather.key}`,
        c => weatherState(c) === weather.key && moment.when(c),
        [first[0] + " " + second[0], first[1] + " " + second[1]], 1.6);
    }
  }
  playful.forEach((pair, index) => add(`exp-playful-${index}`, "playful", "playful", "playful",
    () => true, pair, 1));
  return all;
}

/** Built once, on module evaluation. No API calls or runtime AI generation. */
export const expandedCompanionRules = buildRules();
