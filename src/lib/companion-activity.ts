import type { CompanionLocale, CompanionNudge } from "./companion-scenarios";

/**
 * Short, contextual Berni messages for actual visitor activity.
 * This is local copy, not an AI request. Keep IDs stable for the no-repeat history.
 */
const copy = {
  reenergy: [
    ["Kręci Cię zielona strona mocy? Czy raczej sam projekt strony Re-Energy?", "Into the green side of power, or here to check out Re-Energy's website?"],
    ["Ekologia czy niższe rachunki za prąd? Przy Re-Energy można pogadać o jednym i drugim.", "Sustainability or lower electricity bills? Re-Energy gives us both to talk about."],
    ["Chcesz wiedzieć więcej o fotowoltaice i magazynach energii, czy oglądasz design?", "Curious about solar panels and energy storage, or just admiring the design?"],
    ["Ta realizacja jest o energii — tej w instalacjach i tej w dobrze zaprojektowanej stronie.", "This project is about energy — both in the installations and in the website design."],
  ],
  starcars: [
    ["Myślisz o aucie zza wielkiej wody, czy obczajasz design StarCars?", "Thinking about a car from across the Atlantic, or checking out StarCars' design?"],
    ["Copart, IAAI, import z USA… a może interesuje Cię tylko to, jak wygląda strona?", "Copart, IAAI, importing from the US… or just interested in the website?"],
    ["Amerykańskie auta mają charakter. Dobra strona do ich importu też powinna go mieć.", "American cars have character. A website for importing them should too."],
    ["Chcesz pogadać o imporcie samochodów czy o tym, jak zaprojektowano StarCars?", "Want to talk car imports, or how the StarCars website was built?"],
  ],
  bcrm: [
    ["CRM nie musi być nudny. Zerknij, jak można ogarnąć leady, zadania i cały zespół.", "A CRM doesn't have to be boring. See how leads, tasks and a whole team can work together."],
    ["Papier, Excel czy własny CRM? Ja mam do tego tematu całkiem konkretne zdanie.", "Paper, spreadsheets or a custom CRM? I've got a few thoughts on that."],
    ["Ten projekt to nie tylko ładny panel — najwięcej dzieje się pod spodem.", "This project isn't just a pretty dashboard — most of the work happens behind the scenes."],
    ["Zastanawiasz się nad CRM dla swojej firmy czy po prostu oglądasz realizację?", "Considering a CRM for your business, or just exploring the project?"],
  ],
  beatmarket: [
    ["Bity, producenci i marketplace. Brzmi jak dobry podkład pod ciekawy projekt, prawda?", "Beats, producers and a marketplace. Sounds like the start of an interesting project, right?"],
    ["Masz ucho do muzyki czy oko do interfejsów? Na BeatMarket przyda się jedno i drugie.", "An ear for music or an eye for interfaces? Both come in handy with BeatMarket."],
    ["Tu nie chodzi tylko o odtwarzacz — liczy się cały proces odkrywania i kupowania bitów.", "It's not just a player — discovering and buying beats is part of the experience."],
    ["Chcesz zobaczyć, jak działa marketplace dla producentów muzycznych?", "Curious how a marketplace for music producers works?"],
  ],
  isto: [
    ["Głodny czy po prostu ciekawy designu Isto Kebab? Obie odpowiedzi są w porządku.", "Hungry, or just curious about Isto Kebab's design? Both are fair answers."],
    ["Tu apetyczny wygląd jest równie ważny jak szybkie znalezienie menu.", "Here, a tempting design matters as much as being able to find the menu quickly."],
    ["Strona restauracji powinna zaostrzać apetyt, a nie cierpliwość.", "A restaurant website should whet your appetite, not test your patience."],
  ],
  motomizer: [
    ["Motoryzacja, światło i klimat wnętrza auta. Zgadniesz, co łączy je w Motomizerze?", "Cars, lights and cabin atmosphere. Can you guess what brings them together at Motomizer?"],
    ["W Motomizerze liczy się detal — tak samo w produkcie, jak i w jego prezentacji.", "With Motomizer, details matter — both in the product and how it's presented."],
    ["Oglądasz Motomizer jako gadżet samochodowy czy projekt marki?", "Looking at Motomizer as a car gadget, or as a branding project?"],
  ],
  gentlemen: [
    ["Dobre cięcie i dobry design mają coś wspólnego: precyzję.", "A good haircut and good design have one thing in common: precision."],
    ["Przeglądasz projekt barbershopu? Tu pierwsze wrażenie naprawdę ma znaczenie.", "Checking out the barbershop project? First impressions really matter here."],
    ["W takim biznesie klimat marki powinien być widoczny od pierwszego kliknięcia.", "For a business like this, its personality should show from the first click."],
  ],
  projects: [
    ["Oglądasz realizacje? Który projekt najbardziej wpadł Ci w oko?", "Browsing the projects? Which one caught your eye?"],
    ["Każda realizacja ma inną historię. Wolisz design, technologię czy wyniki?", "Every project has its own story. More into design, technology or results?"],
    ["Kliknij konkretny projekt — opowiem Ci o nim coś więcej.", "Open any project — I can tell you more about it."],
    ["Portfolio to nie same screeny. Najciekawsze często jest to, co działa pod spodem.", "A portfolio is more than screenshots. The interesting part often happens behind the scenes."],
  ],
  tools: [
    ["Darmowe narzędzia, zero zakładania konta. Od czego zaczynamy?", "Free tools, no account needed. Where should we start?"],
    ["Tu możesz po prostu kliknąć i przetestować narzędzia — bez karty i bez logowania.", "Just pick a tool and try it — no card, no sign-up."],
    ["Masz coś do policzenia, sprawdzenia albo wygenerowania? Dobrze trafiłeś.", "Need to calculate, check or generate something? You're in the right place."],
    ["Wybierz narzędzie. Jeśli nie wiesz które, mogę podpowiedzieć.", "Pick a tool. If you're not sure which, I can help."],
  ],
  games: [
    ["Przerwa od pracy? Mam tu kilka darmowych gierek do sprawdzenia.", "Taking a break? I've got a few free mini-games to try."],
    ["Nie samą pracą człowiek żyje. W co dziś gramy?", "All work and no play? What are we playing today?"],
    ["Trochę retro, trochę zręczności i zero instalowania. Wybierz grę.", "A bit of retro, a bit of skill and nothing to install. Pick a game."],
    ["Uwaga: miałeś zajrzeć na minutę, a tu jeszcze jedna runda…", "Careful: you came for a minute, and now it's just one more round…"],
  ],
  contact: [
    ["Masz pomysł na stronę lub aplikację? Możesz go po prostu opisać — bez technicznego żargonu.", "Have a website or app idea? Just describe it — no technical jargon needed."],
    ["Wolisz formularz czy krótką rozmowę? Tutaj znajdziesz drogę do obu.", "Prefer a form or a quick call? You can find both here."],
    ["Nie masz jeszcze gotowej specyfikacji? Spokojnie, wystarczy opisać cel.", "Don't have a full spec yet? A clear goal is enough to start."],
    ["Jeżeli jakiś projekt Ci się spodobał, można zrobić coś podobnie przemyślanego dla Ciebie.", "If a project caught your eye, you can build something equally thoughtful for your business."],
  ],
  services: [
    ["Projekt strony, CRM, reklamy czy automatyzacja — co chcesz usprawnić?", "Website, CRM, ads or automation — what do you want to improve?"],
    ["Szukasz konkretnej usługi czy sprawdzasz, co można połączyć w jednym wdrożeniu?", "Looking for a specific service, or seeing what can be combined into one solution?"],
    ["Dobra technologia powinna ułatwiać życie, a nie dokładać kolejnych paneli.", "Good technology should make life easier, not add more dashboards."],
  ],
  signature: [
    ["Obczaj moje dynamiczne stopki mailowe. Tak, mogą się naprawdę ruszać.", "Check out my animated email signatures. Yes, they can actually move."],
    ["Zwykła stopka czy coś z efektem wow? W generatorze wybierasz sam.", "A classic signature or something with a wow factor? Your choice."],
    ["Logo, social media, linki i odrobina animacji. Zrobisz tu stopkę za darmo.", "Logo, socials, links and a little motion. Build your signature here for free."],
    ["Twoja stopka nie musi wyglądać jak tekst skopiowany z Excela. Zobacz szablony.", "Your email signature doesn't have to look copied from a spreadsheet. See the templates."],
  ],
  audit: [
    ["Masz własną stronę? Wklej adres, a sprawdzimy, co da się poprawić.", "Have a website? Paste its URL and let's see what could be improved."],
    ["SEO, SSL i techniczne drobiazgi — lepiej je sprawdzić niż zgadywać.", "SEO, SSL and technical details — better to check than guess."],
    ["Darmowy audyt strony bez konta i bez karty. Zobaczymy, co wyjdzie?", "A free website audit without an account or credit card. Shall we see the results?"],
    ["Nie każdy problem widać gołym okiem. Właśnie po to jest ten audyt.", "Not every issue is visible at first glance. That's what this audit is for."],
  ],
  pdf: [
    ["PDF do poprawienia? Możesz dodać tekst, podpis i obrazy bez zakładania konta.", "Need to edit a PDF? Add text, signatures and images without signing up."],
    ["Nie musisz instalować osobnego programu, żeby nanieść poprawki w PDF.", "You don't need to install another program for simple PDF changes."],
    ["Zobacz darmowy edytor PDF — pamiętaj tylko, że to nie pełna edycja tekstu jak w Wordzie.", "Try the free PDF editor — just remember it doesn't fully replace editing text in Word."],
  ],
  vat: [
    ["Netto na brutto czy brutto na netto? Wybierz 8% albo 23% i gotowe.", "Net to gross, or gross to net? Pick 8% or 23% VAT and you're set."],
    ["VAT bez liczenia na kartce? Ten kalkulator zrobi to od ręki.", "VAT without doing the math on paper? This calculator has you covered."],
    ["Podaj kwotę, a pokażę Ci netto, podatek i brutto. Bez kombinowania.", "Enter an amount and see net, VAT and gross. Simple."],
  ],
  aiimage: [
    ["To zdjęcie jest prawdziwe czy wygenerowane przez AI? Sprawdź, co mówi analiza.", "Is that image real or AI-generated? See what the analysis says."],
    ["AI coraz lepiej robi zdjęcia. Myślisz, że rozpoznasz wszystkie?", "AI images are getting better. Think you can spot every one?"],
    ["Sprawdź obraz, ale pamiętaj: wykrywanie AI to wskazówka, nie stuprocentowy dowód.", "Check the image, but remember: AI detection is a clue, not definitive proof."],
  ],
  aitext: [
    ["Podejrzewasz ukryte znaki AI w tekście? Zobacz, co da się wykryć.", "Suspect hidden AI characters in a text? See what can be detected."],
    ["Niewidoczne znaki potrafią namieszać. Sprawdź tekst przed publikacją.", "Invisible characters can cause trouble. Check your text before publishing."],
    ["Nie zgaduję, kto napisał tekst — sprawdzam konkretne, ukryte znaki.", "I don't guess who wrote a text — I check for actual hidden characters."],
  ],
  imageconvert: [
    ["JPG, PNG czy WebP? Przekonwertuj zdjęcie bez instalowania programu.", "JPG, PNG or WebP? Convert an image without installing anything."],
    ["Zmiana formatu zdjęcia nie powinna być skomplikowana. Tutaj jest szybka.", "Changing an image format shouldn't be complicated. Here it's quick."],
    ["Masz zdjęcie w złym formacie? Zaraz to ogarniemy.", "Got an image in the wrong format? Let's fix that."],
  ],
  jwt: [
    ["Ciekawi Cię, co siedzi w tokenie JWT? Zajrzyj do nagłówka i payloadu.", "Curious what's inside a JWT? Inspect its header and payload."],
    ["Dekodowanie to nie weryfikacja podpisu. Warto znać tę różnicę.", "Decoding isn't signature verification. It's worth knowing the difference."],
    ["Darmowy dekoder JWT działa lokalnie — nie trzeba wysyłać tokenu na serwer.", "The free JWT decoder works locally — no need to send your token to a server."],
  ],
  roas: [
    ["Reklamy się zwracają? Wpisz przychód i wydatki, a policzymy ROAS.", "Are your ads paying off? Enter revenue and spend to calculate ROAS."],
    ["Duży ROAS wygląda dobrze, ale warto też znać prawdziwą marżę.", "A high ROAS looks great, but your actual margin matters too."],
    ["Tutaj nie trzeba zgadywać wyniku kampanii. Policzmy go.", "No need to guess campaign performance. Let's calculate it."],
  ],
  maze: [
    ["Pac-Man w nowym wydaniu? Uważaj na duchy i wyczyść labirynt.", "A fresh take on Pac-Man? Dodge the ghosts and clear the maze."],
    ["Masz plan na labirynt czy idziesz na żywioł?", "Got a maze strategy, or going with your instincts?"],
    ["Jeszcze jedna kropka… i jeszcze jeden duch za rogiem.", "One more dot… and another ghost around the corner."],
  ],
  fps: [
    ["Retro klimat Dooma bez instalowania gry. Gotowy na rundę?", "Doom-style retro action without installing a game. Ready for a round?"],
    ["Piksele, labirynt i strzelanie. Trochę starej szkoły w przeglądarce.", "Pixels, a maze and shooting. A bit of old-school action in your browser."],
    ["Klawiatura czy ekran telefonu? Sprawdź, jak radzisz sobie w Retro FPS.", "Keyboard or phone screen? See how you handle this retro FPS."],
  ],
  galaxy: [
    ["Klawiaturowa galaktyka rusza! Ile gwiazd uda Ci się wywołać?", "Keyboard Galaxy is live! How many stars can you bring out?"],
    ["Piszesz, a kosmos reaguje. To dopiero klawiatura z efektem specjalnym.", "You type and space reacts. That's a keyboard with special effects."],
    ["Pobaw się literami. Tutaj każde naciśnięcie ma swój mały kosmos.", "Play with letters. Every keypress has its own little universe."],
  ],
  memory: [
    ["Pamiętasz, gdzie leżała ta karta? Zaraz się przekonamy.", "Remember where that card was? Let's find out."],
    ["Memory wygląda niewinnie — dopóki nie zaczynasz mylić ostatnich dwóch par.", "Memory looks easy — until you start mixing up the last two pairs."],
    ["Dwanaście kart, sześć par. Ile ruchów potrzebujesz?", "Twelve cards, six pairs. How many moves will you need?"],
  ],
  merge: [
    ["Dwie dwójki, potem czwórki… dojdziesz dziś do 2048?", "Two twos, then fours… can you reach 2048 today?"],
    ["W 2048 każdy ruch ma znaczenie. Nie zapchaj całej planszy.", "Every move counts in 2048. Don't fill up the whole board."],
    ["Ta gra wygląda prosto, ale potrafi wciągnąć na dłużej.", "This game looks simple, but it can keep you hooked."],
  ],
  snake: [
    ["Klasyczny Snake! Tylko nie uderz w ścianę.", "Classic Snake! Just don't hit the wall."],
    ["Rośniesz, rośniesz… aż nagle robi się ciasno.", "Grow, grow… and suddenly things get tight."],
    ["Ile punktów wyciągniesz, zanim skończy Ci się miejsce?", "How many points can you get before you run out of space?"],
  ],
  mines: [
    ["Saper: trochę logiki, trochę nerwów. Gdzie klikniesz najpierw?", "Minesweeper: a bit of logic, a bit of nerves. Where will you click first?"],
    ["Nie wszystko, co ukryte, warto od razu odkrywać. Zwłaszcza miny.", "Not everything hidden should be revealed immediately. Especially mines."],
    ["Liczby to podpowiedzi. W Saperze bardziej opłaca się myśleć niż zgadywać.", "Numbers are clues. In Minesweeper, thinking beats guessing."],
  ],
  tictactoe: [
    ["Kółko czy krzyżyk? Zobaczymy, kto lepiej planuje ruchy.", "X or O? Let's see who's better at planning moves."],
    ["Trzy w rzędzie. Prosty plan, nie zawsze proste wykonanie.", "Three in a row. Simple plan, not always easy to pull off."],
    ["Zagraj z komputerem. Tylko nie zostaw mu wolnego rogu.", "Challenge the computer. Just don't leave it an easy corner."],
  ],
  math: [
    ["Szybka matematyka! Dziesięć pytań i ani chwili na kalkulator.", "Quick maths! Ten questions and no time for a calculator."],
    ["Sprawdzimy refleks i głowę jednocześnie. Gotowy?", "Let's test your speed and your head at the same time. Ready?"],
    ["Liczenie na czas potrafi zaskoczyć. Ile trafisz bez błędu?", "Timed maths can be surprising. How many can you get right?"],
  ],
  reflex: [
    ["Teraz test refleksu. Tylko nie klikaj przed sygnałem.", "Reaction time test. Just don't click before the signal."],
    ["Myślisz, że masz szybki refleks? Sprawdzimy to.", "Think your reactions are fast? Let's test that."],
    ["W tej grze liczą się milisekundy, nie wymówki.", "In this game, milliseconds matter more than excuses."],
  ],
  guess: [
    ["Zgadnij liczbę od 1 do 100. Masz jakiś system?", "Guess a number from 1 to 100. Got a strategy?"],
    ["Trochę za wysoko, trochę za nisko… tak działa dobra eliminacja.", "Too high, too low… that's how you narrow it down."],
    ["Tajemnicza liczba czeka. Ile prób potrzebujesz?", "A secret number awaits. How many guesses will it take?"],
  ],
  target: [
    ["Łap cel! Tu liczy się celność i szybki palec.", "Target Rush! This one's about accuracy and a quick finger."],
    ["Dwadzieścia sekund. Ile celów dasz radę trafić?", "Twenty seconds. How many targets can you hit?"],
    ["Cel pojawia się tylko na chwilę. Lepiej nie mrugać.", "The target only appears for a moment. Better not blink."],
  ],
} as const satisfies Record<string, ReadonlyArray<readonly [string, string]>>;

export type CompanionActivity = keyof typeof copy;

const matchers: ReadonlyArray<readonly [CompanionActivity, RegExp]> = [
  ["reenergy", /re-?energy|reenergy|re.?energysystem|fotowoltaik|zielona strona mocy/],
  ["starcars", /star-?cars|import aut|import samochod|samochod.*usa/],
  ["bcrm", /b-?crm|crm-dla-firm-handlowych|crm for sales teams/],
  ["beatmarket", /beat-?market|marketplace.*beat/],
  ["isto", /isto.?kebab/],
  ["motomizer", /motomizer/],
  ["gentlemen", /gentlemen.*barber|barbershop/],
  ["signature", /generator.{0,20}stopk|stopk.{0,20}(email|e-mail|mail)|email.{0,20}signature|signature.{0,20}generator/],
  ["pdf", /edytor-pdf|free-pdf-editor|pdf editor|edytor pdf/],
  ["vat", /kalkulator-vat|vat-calculator|netto.?brutto|brutto.?netto/],
  ["aiimage", /czy.{0,18}zdjecie.{0,12}ai|sprawdz.{0,18}zdjecie.{0,18}ai|ai.{0,10}(photo|image)|zdjecie.{0,18}(sztuczn|wygenerowan)/],
  ["aitext", /ukryte.{0,12}znak|ai.{0,10}text|tekst.{0,14}ai|znakow-ai/],
  ["imageconvert", /konwerter.{0,14}(zdjec|obraz)|image.{0,12}convert|photo.{0,12}convert/],
  ["jwt", /dekoder-jwt|jwt-decoder|token.{0,12}jwt/],
  ["roas", /kalkulator-roas|roas-calculator/],
  ["audit", /audyt-strony|website-audit|przeanalizuj.{0,10}stron|analiz.{0,10}stron/],
  ["maze", /pac.?man|maze.?chomp|labirynt|(?:[?&]game=maze)/],
  ["fps", /retro.?fps|doom|(?:[?&]game=fps)/],
  ["galaxy", /klawiaturowa.?galaktyka|keyboard.?galaxy|(?:[?&]game=kids)/],
  ["memory", /(?:^|[ /?#=&])memory(?:$|[ /&#=])|memory.?pairs/],
  ["merge", /2048|(?:[?&]game=merge)/],
  ["snake", /snake/],
  ["mines", /saper|minesweeper|(?:[?&]game=mines)/],
  ["tictactoe", /kolko i krzyzyk|tic.?tac.?toe|(?:[?&]game=tictactoe)/],
  ["math", /szybka matematyka|quick.?math|(?:[?&]game=math)/],
  ["reflex", /test refleksu|reaction test|(?:[?&]game=reflex)/],
  ["guess", /zgadnij liczbe|guess the number|(?:[?&]game=guess)/],
  ["target", /lap cel|target rush|(?:[?&]game=target)/],
  ["games", /(?:^|[ /#])(?:minigry|gry|arcade|games|mini-games)(?:$|[ /?#])/],
  ["tools", /(?:^|[ /#])(?:narzedzia|tools|toolbox|darmowe narzedzia)(?:$|[ /?#])/],
  ["projects", /(?:^|[ /#])(?:realizacje|projekty|portfolio|projects|case-studies)(?:$|[ /?#])/],
  ["contact", /(?:^|[ /#])(?:kontakt|contact)(?:$|[ /?#])/],
  ["services", /(?:^|[ /#])(?:uslugi|services|oferta)(?:$|[ /?#])/],
];

export function classifyCompanionActivity(value: string): CompanionActivity | null {
  let normalized: string;
  try { normalized = decodeURIComponent(value); }
  catch { normalized = value; }
  normalized = normalized.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ł/g, "l").slice(0, 1400);
  for (const [activity, pattern] of matchers) if (pattern.test(normalized)) return activity;
  return null;
}

/** Select an unseen line from the exact activity rather than general page/weather copy. */
export function pickCompanionActivityNudge(
  activity: CompanionActivity,
  lang: CompanionLocale,
  seenIds: readonly string[] = [],
  seenTexts: readonly string[] = [],
  random: () => number = Math.random,
): CompanionNudge {
  const lines = copy[activity] as ReadonlyArray<readonly [string, string]>;
  const candidates = lines.map((line, index) => ({
    id: "activity-" + activity + "-" + index,
    text: line[lang === "en" ? 1 : 0],
  }));
  const recentIds = new Set(seenIds);
  const recentTexts = new Set(seenTexts);
  const unseen = candidates.filter(item => !recentIds.has(item.id) && !recentTexts.has(item.text));
  const pool = unseen.length ? unseen : candidates.filter(item => !recentTexts.has(item.text));
  const eligible = pool.length ? pool : candidates;
  const index = Math.max(0, Math.min(eligible.length - 1, Math.floor(random() * eligible.length)));
  const chosen = eligible[index];
  return { ...chosen, category: "page", topic: "page", family: "activity:" + activity, intent: "chat" };
}

export const COMPANION_ACTIVITY_COUNT = Object.values(copy).reduce((sum, variants) => sum + variants.length, 0);
