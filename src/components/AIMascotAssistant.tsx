"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Eye, Loader2, RotateCcw, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEFAULT_BOOKING_TIME_ZONE, formatSlotDate } from "@/lib/booking";
import type { AvailableBookingDay } from "@/lib/calcom";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY, type CookieConsentState } from "@/lib/preferences";
import { localizedToolPath } from "@/lib/toolbox-en";
import { BerniCompanion } from "@/components/BerniCompanion";
import { BerniRobot } from "@/components/BerniRobot";
import { verifyCompanionIpCity } from "@/lib/companion-verified-location";
import {
  getCompanionContext,
  pickCompanionNudge,
  type CompanionNudge,
  type CompanionTopic,
  type CompanionServerContext,
} from "@/lib/companion-scenarios";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Slot = {
  start: string;
  label: string;
};

type BookingStep =
  | "idle"
  | "loading-days"
  | "days"
  | "loading-slots"
  | "slots"
  | "details"
  | "booking"
  | "success"
  | "error";

type BookingState = {
  step: BookingStep;
  days: AvailableBookingDay[];
  selectedDate: string;
  selectedDayLabel: string;
  slots: Slot[];
  selectedSlot: Slot | null;
  message: string;
};

type LocalAction = "projects" | "services" | "bcrm" | "book" | "contact" | "audit";
type MascotMood = "idle" | "curious" | "joking" | "thinking";

type MascotBehaviorState = {
  mood: MascotMood;
};

const HIDE_DURATION_MS = 48 * 60 * 60 * 1000;
const HIDDEN_UNTIL_KEY = "ai-mascot-hidden-until";
const NUDGE_OPT_OUT_KEY = "kb-companion-nudges-off";
const NUDGE_HISTORY_KEY = "kb-companion-recent-v1";
const NUDGE_LAST_TOPIC_KEY = "kb-companion-last-topic-v2";
const NUDGE_RETURNING_KEY = "kb-companion-returning";
const NUDGE_RETURNING_SESSION_KEY = "kb-companion-returning-this-session";
const NUDGE_SESSION_COUNT_KEY = "kb-companion-session-count";
const NUDGE_MEMORY_KEY = "kb-companion-memory-v3";

// Contains only already displayed message IDs/phrases and coarse categories.
// It stores no names, addresses, IPs, device fingerprint or unique user ID.
type NudgeMemory = {
  ids: string[];
  topics: CompanionTopic[];
  families: string[];
  texts: string[];
};
function readNudgeMemory(): NudgeMemory {
  const empty: NudgeMemory = { ids: [], topics: [], families: [], texts: [] };
  try {
    const value = JSON.parse(localStorage.getItem(NUDGE_MEMORY_KEY) || sessionStorage.getItem(NUDGE_MEMORY_KEY) || "null") as Partial<NudgeMemory> | null;
    if (!value || !Array.isArray(value.ids)) {
      // Reuse old opt-in memory so the update does not restart the same texts.
      const legacy = JSON.parse(localStorage.getItem(NUDGE_HISTORY_KEY) || "[]") as unknown;
      return { ...empty, ids: Array.isArray(legacy) ? legacy.filter((x): x is string => typeof x === "string").slice(-1200) : [] };
    }
    const strings = (input: unknown, cap: number) =>
      Array.isArray(input) ? input.filter((x): x is string => typeof x === "string").slice(-cap) : [];
    return {
      ids: strings(value.ids, 1200),
      topics: strings(value.topics, 6) as CompanionTopic[],
      families: strings(value.families, 8),
      texts: strings(value.texts, 150),
    };
  } catch {
    return empty;
  }
}
function writeNudgeMemory(memory: NudgeMemory, selected: CompanionNudge) {
  try {
    localStorage.setItem(NUDGE_MEMORY_KEY, JSON.stringify({
      ids: [...memory.ids, selected.id].slice(-1200),
      topics: [...memory.topics, selected.topic].slice(-6),
      families: [...memory.families, selected.family].slice(-8),
      texts: [...memory.texts, selected.text].slice(-150),
    } satisfies NudgeMemory));
  } catch {
    // Storage may be disabled; session history still prevents duplicate messages.
    try { sessionStorage.setItem(NUDGE_MEMORY_KEY, JSON.stringify({
      ids: [...memory.ids, selected.id].slice(-120),
      topics: [...memory.topics, selected.topic].slice(-6),
      families: [...memory.families, selected.family].slice(-8),
      texts: [...memory.texts, selected.text].slice(-30),
    } satisfies NudgeMemory)); } catch {}
  }
}



function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
  };
}

function normalizeCommand(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectLocalAction(question: string): LocalAction | null {
  const value = normalizeCommand(question);
  if (/(audyt|audit|przeanalizuj|analizuj|analy[sz]e|sprawdz|check|scan)/.test(value) && /(stron|site|web|seo|witryn)/.test(value)) return "audit";
  const wantsNavigation =
    /\b(show|open|go|take|jump|przejdz|pokaz|otworz|sprawdz|wyswietl|zobacz)\b/.test(value);

  if (/\b(book|schedule|meeting|call|umow|spotkanie|rozmow)\b/.test(value)) {
    return "book";
  }

  if (wantsNavigation && /\b(service|services|uslug|ofert)\b/.test(value)) {
    return "services";
  }
  if (wantsNavigation && /\b(projects|projekty|realizacje)\b/.test(value)) {
    return "projects";
  }

  if (wantsNavigation && /\b(b-?crm|case study|studium|crm)\b/.test(value)) {
    return "bcrm";
  }

  if (wantsNavigation && /\b(contact|kontakt|email|mail|phone|telefon)\b/.test(value)) {
    return "contact";
  }

  return null;
}

function getAssistantRuntimeCopy(lang: "en" | "pl") {
  return { retryLabel: lang === "pl" ? "Ponów odpowiedź" : "Retry answer" };
}


function extractWebsiteUrl(message:string):string|null {
 const match=message.match(/(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?::(?:80|443))?(?:\/[^\s<>"']*)?/i);
 if(!match)return null;
 const raw=match[0].replace(/[.,;!?)]*$/,"");
 try{const url=new URL(/^https?:\/\//i.test(raw)?raw:"https://"+raw);
  if(!["https:","http:"].includes(url.protocol)||url.username||url.password)return null;
  return url.href;
 }catch{return null;}
}

function toolSuggestionForQuestion(text:string):string|null{
 const normalized=normalizeCommand(text);
 const entries:[RegExp,string][]=[
  [/\b(roas|return on ad spend)\b/,"kalkulator-roas"],
  [/\b(cpl|cost per lead|koszt lead)/,"kalkulator-cpl"],
  [/\b(cpc|cost per click)\b/,"kalkulator-cpc"],
  [/\b(cpm|cost per mille)\b/,"kalkulator-cpm"],
  [/\b(utm|campaign tracking link|parametr.*utm)/,"generator-utm"],
  [/meta ads.*(error|problem|odrzucon|nieaktywn|rejected|inactive|not spending)|\b(zestaw reklam|reklam.*odrzucon)/,"diagnostyka-meta-ads"],
  [/(meta pixel|facebook pixel|piksel meta|pixel tracking)/,"tester-meta-pixel"],
  [/(google tag manager|\bgtm\b)/,"tester-google-tag-manager"],
  [/(spf|dmarc|dns poczt|email authentication)/,"test-spf-dmarc"],
  [/(ssl|tls|certyfikat)/,"sprawdzanie-certyfikatu-ssl"],
  [/(\bjwt\b|token decoder)/,"dekoder-jwt"],
  [/(formatter json|walidator json|validate json|json formatter)/,"formatter-json"],
  [/(sitemap|mapa strony)/,"walidator-sitemap-xml"],
  [/(robots\.txt|robots txt)/,"walidator-robots-txt"],
  [/(schema\.org|json-ld|structured data|dane strukturalne)/,"walidator-schema-org"],
  [/(kolor.*kontrast|color contrast|wcag contrast)/,"tester-kontrastu-kolorow"],
  [/(ile kosztuje strona|website price|website cost|koszt strony)/,"kalkulator-kosztu-strony"],
  [/(automatyzacj.*oszczed|automation savings)/,"kalkulator-oszczednosci-automatyzacji"],
  [/(roi crm|zwrot.*crm)/,"kalkulator-roi-crm"],
  [/(pozyskani.*klient|customer acquisition cost|\bcac\b)/,"kalkulator-cac"],
  [/(backlink|seo|audyt stron|website audit)/,"audyt-strony"]
 ];
 return entries.find(([pattern])=>pattern.test(normalized))?.[1]||null;
}

function renderLinkedMessage(content:string){
 return content.split(/(https:\/\/bernecki\.dev\/[a-z0-9/_-]+(?:\?[^\s]+)?)/gi).map((part,index)=>
  /^https:\/\/bernecki\.dev\/[a-z0-9/_-]+/i.test(part)
  ? <a key={index} href={part} className="break-all underline underline-offset-4 hover:text-white/80">{part}</a>
  : <span key={index}>{part}</span>);
}

const defaultBookingState: BookingState = {
  step: "idle",
  days: [],
  selectedDate: "",
  selectedDayLabel: "",
  slots: [],
  selectedSlot: null,
  message: "",
};

export function AIMascotAssistant() {
  const { lang, t } = useLanguage();
  const assistantRuntimeCopy = useMemo(() => getAssistantRuntimeCopy(lang), [lang]);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState<CompanionNudge | null>(null);
  const [nudgesDisabled, setNudgesDisabled] = useState(false);
  const [nudgeSettingsLoaded, setNudgeSettingsLoaded] = useState(false);
  const [serverContext, setServerContext] = useState<CompanionServerContext | null>(null);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [dragPlacement, setDragPlacement] = useState<{
    below: boolean;
    offsetX: number;
    room: number;
    nudgeOffsetX: number;
  } | null>(null);
  const handleBerniDragEnd = useCallback((bounds: { x: number; y: number; width: number; height: number }) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const belowRoom = Math.max(0, vh - bounds.y - bounds.height - 14);
    const aboveRoom = Math.max(0, bounds.y - 14);
    const below = belowRoom > aboveRoom;
    const panelWidth = Math.min(isCompactViewport ? 344 : 384, vw - 20);
    const panelLeft = Math.max(10, Math.min(vw - panelWidth - 10, bounds.x));
    const nudgeWidth = Math.min(304, vw - 20);
    const nudgeLeft = Math.max(10, Math.min(vw - nudgeWidth - 10, bounds.x));
    setDragPlacement({
      below,
      offsetX: Math.round(panelLeft - bounds.x),
      room: Math.max(150, below ? belowRoom : aboveRoom),
      nudgeOffsetX: Math.round(nudgeLeft - bounds.x),
    });
  }, [isCompactViewport]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", t.aiMascot.initialMessage),
  ]);
  const [input, setInput] = useState("");
  const [website, setWebsite] = useState("");
  const [awaitingAuditUrl, setAwaitingAuditUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFailedQuestion, setLastFailedQuestion] = useState("");
  const [behavior, setBehavior] = useState<MascotBehaviorState>({ mood: "idle" });
  const [booking, setBooking] = useState<BookingState>(defaultBookingState);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingTopic, setBookingTopic] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const timeZone = process.env.NEXT_PUBLIC_CALENDAR_TIMEZONE || DEFAULT_BOOKING_TIME_ZONE;
  const restorePositionClass = cookieBannerVisible
    ? "bottom-[14.5rem] right-4 md:bottom-4"
    : "bottom-4 right-4";
  const companionPanelPositionClass = dragPlacement
    ? `${dragPlacement.below ? "top-[calc(100%+0.7rem)]" : "bottom-[calc(100%+0.7rem)]"} ${isCompactViewport ? "w-[min(21.5rem,calc(100vw-1.25rem))]" : "w-[24rem]"}`
    : isCompactViewport
      ? "bottom-[calc(100%+0.7rem)] right-0 w-[min(21.5rem,calc(100vw-1.25rem))]"
      : "bottom-[calc(100%+0.9rem)] right-0 w-[24rem]";
  const companionPanelSizeClass = isCompactViewport
    ? "h-[min(36rem,calc(100dvh-9.5rem))]"
    : "h-[min(36rem,calc(100dvh-10rem))]";
  useEffect(() => {
    setMounted(true);
    const hiddenUntil = Number(localStorage.getItem(HIDDEN_UNTIL_KEY) || 0);
    setHidden(Number.isFinite(hiddenUntil) && hiddenUntil > Date.now());
    setNudgesDisabled(localStorage.getItem(NUDGE_OPT_OUT_KEY) === "1");
    if (sessionStorage.getItem(NUDGE_RETURNING_SESSION_KEY) === null) {
      sessionStorage.setItem(
        NUDGE_RETURNING_SESSION_KEY,
        localStorage.getItem(NUDGE_RETURNING_KEY) === "1" ? "1" : "0",
      );
    }
    setNudgeSettingsLoaded(true);
    syncCookieBannerVisibility();

    const compactQuery = window.matchMedia("(max-width: 767px)");
    const syncCompactViewport = () => setIsCompactViewport(compactQuery.matches);
    const handleConsentChange = (event: Event) => {
      const nextConsent = (event as CustomEvent<{ consent?: CookieConsentState | null }>).detail?.consent;

      if (nextConsent === null) {
        setCookieBannerVisible(true);
        return;
      }

      syncCookieBannerVisibility();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === COOKIE_CONSENT_KEY) {
        syncCookieBannerVisibility();
      }
    };
    function syncCookieBannerVisibility() {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      setCookieBannerVisible(stored !== "accepted" && stored !== "rejected");
    }

    syncCompactViewport();
    compactQuery.addEventListener("change", syncCompactViewport);
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      compactQuery.removeEventListener("change", syncCompactViewport);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Render Berni only after the actual intro finishes; no arbitrary delay.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const phase = root.dataset.homeIntro;
      setIntroFinished(phase !== "armed" && phase !== "running");
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-home-intro"] });
    return () => observer.disconnect();
  }, [pathname]);

  // IP city is merely a guess. Only use it when the visitor has already
  // granted browser location AND that position agrees with the IP estimate.
  // No location permission prompts are initiated by this component.
  useEffect(() => {
    setServerContext(null);
    if (!mounted || cookieBannerVisible || nudgesDisabled) return;
    if (localStorage.getItem(COOKIE_CONSENT_KEY) !== "accepted") return;
    if (!navigator.permissions?.query || !navigator.geolocation) return;
    let cancelled = false;
    const controller = new AbortController();
    async function load() {
      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (permission.state !== "granted" || cancelled) return;
        const position = await new Promise<GeolocationPosition | null>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            resolve, () => resolve(null),
            { enableHighAccuracy: false, maximumAge: 300000, timeout: 5000 },
          );
        });
        if (!position || cancelled) return;
        const response = await fetch("/api/companion-context", { signal: controller.signal, cache: "no-store" });
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as CompanionServerContext;
        const verified = verifyCompanionIpCity(data, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        if (!cancelled) setServerContext(verified);
      } catch {
        // If the two independent signals cannot agree, do not name a city.
      }
    }
    void load();
    return () => { cancelled = true; controller.abort(); };
  }, [mounted, cookieBannerVisible, nudgesDisabled]);

  useEffect(() => {
    if (!mounted || !introFinished || !nudgeSettingsLoaded || cookieBannerVisible || hidden || open || nudge || nudgesDisabled) return;
    const alreadyShown = Number(sessionStorage.getItem(NUDGE_SESSION_COUNT_KEY) || 0);
    if (alreadyShown >= 2) return;

    // First greeting after intro; a second message requires 2+ minutes more.
    let timer: number;
    function maybeShow() {
      const introState = document.documentElement.dataset.homeIntro;
      const target = document.activeElement;
      const isTyping = target instanceof HTMLElement
        && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable);
      if (
        document.visibilityState !== "visible" ||
        introState === "armed" || introState === "running" ||
        isTyping
      ) {
        timer = window.setTimeout(maybeShow, 1800);
        return;
      }

      const consentAccepted = localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
      // Shuffle-bag history is strictly functional: it cannot identify visitors
      // and never leaves the browser. Weather/IP data remains consent-gated.
      const history = readNudgeMemory();
      const previous = history.topics.at(-1);
      const returning = consentAccepted && sessionStorage.getItem(NUDGE_RETURNING_SESSION_KEY) === "1";
      const language = pathname.startsWith("/en") ? "en" : lang;
      const context = getCompanionContext(language, pathname, consentAccepted ? serverContext : null, returning);
      const selected = pickCompanionNudge(context, history.ids, previous, Math.random, {
        recentTopics: history.topics,
        recentFamilies: history.families,
        recentTexts: history.texts,
      });
      if (!selected) return;

      setNudge(selected);
      sessionStorage.setItem(NUDGE_SESSION_COUNT_KEY, String(alreadyShown + 1));
      writeNudgeMemory(history, selected);
      if (consentAccepted) {
        localStorage.setItem(NUDGE_RETURNING_KEY, "1");
      }
    }
    timer = window.setTimeout(maybeShow, alreadyShown === 0 ? 10500 : 120000);
    return () => window.clearTimeout(timer);
  }, [mounted, introFinished, nudgeSettingsLoaded, cookieBannerVisible, hidden, open, nudge, nudgesDisabled, pathname, lang, serverContext]);

  useEffect(() => {
    if (!nudge) return;
    const timer = window.setTimeout(() => setNudge(null), 12500);
    return () => window.clearTimeout(timer);
  }, [nudge]);

  function disableNudges() {
    localStorage.setItem(NUDGE_OPT_OUT_KEY, "1");
    setNudgesDisabled(true);
    setNudge(null);
  }

  function enableNudges() {
    localStorage.removeItem(NUDGE_OPT_OUT_KEY);
    setNudgesDisabled(false);
  }

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0].role === "assistant"
        ? [createMessage("assistant", t.aiMascot.initialMessage)]
        : current,
    );
  }, [t.aiMascot.initialMessage]);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, booking.step, loading]);

  function openChat(prefill?: string) {
    setNudge(null);
    setHidden(false);
    setOpen(true);
    setBehavior({ mood: "curious" });
    if (prefill) {
      setInput(prefill);
    }
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }

  function hideMascot() {
    setNudge(null);
    localStorage.setItem(HIDDEN_UNTIL_KEY, String(Date.now() + HIDE_DURATION_MS));
    setOpen(false);
    setHidden(true);
  }

  function restoreMascot() {
    setNudge(null);
    localStorage.removeItem(HIDDEN_UNTIL_KEY);
    setHidden(false);
    setOpen(true);
    setBehavior({ mood: "curious" });
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }

  function scrollToStaticSection(hash: "#projects" | "#services" | "#contact") {
    setOpen(false);

    if (pathname !== "/") {
      router.push(`/${hash}`);
      return;
    }

    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", hash);
  }

  async function sendMessage(nextInput?: string, options: { retry?: boolean } = {}) {
    const question = (nextInput ?? input).trim();
    if (!question || loading) return;

    const nextMessages = options.retry ? messages : [...messages, createMessage("user", question)];
    const localAction = detectLocalAction(question);
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLastFailedQuestion("");
    setBehavior({ mood: localAction ? "curious" : "thinking" });

    const websiteUrl=extractWebsiteUrl(question);
    if((awaitingAuditUrl||localAction==="audit")&&!options.retry){
      if(!websiteUrl){
        setAwaitingAuditUrl(true);
        setMessages(current=>[...current,createMessage("assistant",lang==="pl"
          ?"Podaj publiczny adres strony (np. https://example.com), a przeprowadzę automatyczny audyt SEO, SSL, DNS i podstron. Bez rejestracji."
          :"Paste a public website URL (e.g. https://example.com). I'll run an SEO, SSL, DNS and multi-page audit without registration.")]);
        setBehavior({mood:"curious"});
        return;
      }
      setAwaitingAuditUrl(false);
      setLoading(true);
      try{
        const response=await fetch("/api/tools/inspect",{
          method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode:"full",url:websiteUrl}),
          signal:AbortSignal.timeout(55000)
        });
        const data=await response.json() as {summary?:{critical:number;warning:number;info:number;scanned:number};error?:string};
        if(!response.ok||!data.summary)throw new Error("Audit request failed");
        const reportLink="https://bernecki.dev"+localizedToolPath("audyt-strony",lang)+"?url="+encodeURIComponent(websiteUrl);
        const summary=lang==="pl"
          ?"Przeanalizowałem "+data.summary.scanned+" publicznych podstron. Wykryłem "+data.summary.critical+" problemów krytycznych, "+data.summary.warning+" do poprawy i "+data.summary.info+" do weryfikacji. To próbka, nie pełna analiza witryny."
          :"I scanned "+data.summary.scanned+" public pages and found "+data.summary.critical+" critical issues, "+data.summary.warning+" issues to fix and "+data.summary.info+" items to review. This is a sample, not a full-site crawl.";
        setMessages(current=>[...current,createMessage("assistant",summary+"\n"+(lang==="pl"?"Zobacz pełny raport: ":"View the full report: ")+reportLink)]);
        setBehavior({mood:"joking"});
      }catch{
        setMessages(current=>[...current,createMessage("assistant",lang==="pl"
          ?"Skanowanie nie powiodło się. Spróbuj bezpośrednio: https://bernecki.dev/narzedzia/audyt-strony"
          :"The scan failed. Try it directly: https://bernecki.dev/en/tools/free-website-audit")]);
      }finally{setLoading(false);}
      return;
    }
    if(localAction&&!options.retry){
      window.setTimeout(()=>handleQuickAction(localAction),0);
      return;
    }
    // Deterministic tool navigation needs no AI request or hallucinated analysis.
    const suggestedTool=toolSuggestionForQuestion(question);
    if(suggestedTool&&!options.retry){
      const link="https://bernecki.dev"+localizedToolPath(suggestedTool,lang);
      const answer=lang==="pl"
       ?"Mam do tego darmowe narzędzie. Uruchom je tutaj: "+link
       :"There is a free tool for that. Open it here: "+link;
      setMessages(current=>[...current,createMessage("assistant",answer)]);
      setBehavior({mood:"curious"});
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          website,
          messages: nextMessages.slice(-8),
        }),
      });
      const result = (await response.json().catch(() => null)) as
        | { answer?: string; message?: string }
        | null;

      if (!response.ok || !result?.answer) {
        throw new Error(result?.message || t.aiMascot.errorMessage);
      }

      setMessages((current) => [...current, createMessage("assistant", result.answer ?? "")]);
      setBehavior((current) => ({ ...current, mood: "joking" }));
    } catch (caughtError) {
      setLastFailedQuestion(question);
      setError(caughtError instanceof Error ? caughtError.message : t.aiMascot.errorMessage);
      setBehavior((current) => ({ ...current, mood: "curious" }));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleQuickAction(action: "projects" | "services" | "bcrm" | "book" | "contact" | "code" | "audit") {
    setError("");
    setBehavior((current) => ({ ...current, mood: "joking" }));

    if(action==="audit"){
      setOpen(true);
      setAwaitingAuditUrl(true);
      setMessages(current=>[...current,createMessage("assistant",lang==="pl"
        ?"Wklej adres strony, którą mam przeanalizować (np. https://example.com). Sprawdzę próbkę podstron, SEO, SSL, DNS i analitykę — za darmo."
        :"Paste the website URL to audit (e.g. https://example.com). I'll check a sample of pages, SEO, SSL, DNS and analytics for free.")]);
      window.setTimeout(()=>inputRef.current?.focus(),80);
      return;
    }
    if (action === "projects") {
      setMessages((current) => [...current, createMessage("assistant", t.aiMascot.actionReplies.projects)]);
      scrollToStaticSection("#projects");
      return;
    }

    if (action === "services") {
      setMessages((current) => [...current, createMessage("assistant", lang==="pl"?"Pokazuję zakres usług. Możesz opisać mi też własny pomysł.":"Here are the available services. You can also describe your project.")]);
      scrollToStaticSection("#services");
      return;
    }

    if (action === "bcrm") {
      setMessages((current) => [...current, createMessage("assistant", t.aiMascot.actionReplies.bcrm)]);
      setOpen(false);
      router.push("/case-studies/b-crm");
      return;
    }

    if (action === "contact") {
      setMessages((current) => [...current, createMessage("assistant", t.aiMascot.actionReplies.contact)]);
      scrollToStaticSection("#contact");
      return;
    }

    if (action === "code") {
      openChat(t.aiMascot.codePrompt);
      return;
    }

    void startBookingFlow();
  }

  async function startBookingFlow() {
    setOpen(true);
    setMessages((current) => [...current, createMessage("assistant", t.aiMascot.actionReplies.book)]);
    setBooking({ ...defaultBookingState, step: "loading-days" });
    setTurnstileToken("");
    setError("");

    try {
      const response = await fetch(`/api/booking/available-days?locale=${locale}&limit=8`);
      const payload = (await response.json()) as { days?: AvailableBookingDay[]; configured?: boolean };

      if (!response.ok || payload.configured === false || !payload.days?.length) {
        throw new Error(t.aiMascot.booking.unavailable);
      }

      setBooking({
        ...defaultBookingState,
        step: "days",
        days: payload.days,
      });
    } catch {
      setBooking({
        ...defaultBookingState,
        step: "error",
        message: t.aiMascot.booking.unavailable,
      });
    }
  }

  async function selectBookingDay(day: AvailableBookingDay) {
    setBooking((current) => ({
      ...current,
      step: "loading-slots",
      selectedDate: day.date,
      selectedDayLabel: `${day.weekday} ${day.day} ${day.month}`,
      selectedSlot: null,
      slots: [],
      message: "",
    }));

    try {
      const response = await fetch(`/api/booking/slots?date=${day.date}`);
      const payload = (await response.json()) as { slots?: Slot[]; message?: string };

      if (!response.ok || !payload.slots?.length) {
        throw new Error(payload.message || t.aiMascot.booking.unavailable);
      }

      setBooking((current) => ({
        ...current,
        step: "slots",
        slots: payload.slots ?? [],
      }));
    } catch {
      setBooking((current) => ({
        ...current,
        step: "days",
        days: current.days.filter((item) => item.date !== day.date),
        selectedDate: "",
        selectedDayLabel: "",
        message: "",
      }));
    }
  }

  function selectBookingSlot(slot: Slot) {
    setBooking((current) => ({
      ...current,
      step: "details",
      selectedSlot: slot,
      message: "",
    }));
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!booking.selectedSlot) return;

    setBooking((current) => ({ ...current, step: "booking", message: "" }));

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookingName,
          email: bookingEmail,
          company: "",
          message: bookingTopic,
          bookingTrap: website,
          start: booking.selectedSlot.start,
          turnstileToken,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        booking?: { start?: string };
        message?: string;
      };

      if (!response.ok || !payload.booking?.start) {
        throw new Error(payload.message || t.aiMascot.booking.error);
      }

      setBooking((current) => ({
        ...current,
        step: "success",
        message: t.aiMascot.booking.success,
      }));
      setMessages((current) => [...current, createMessage("assistant", t.aiMascot.booking.success)]);
      setBookingName("");
      setBookingEmail("");
      setBookingTopic("");
      setTurnstileToken("");
    } catch (caughtError) {
      setBooking((current) => ({
        ...current,
        step: "details",
        message: caughtError instanceof Error ? caughtError.message : t.aiMascot.booking.error,
      }));
    }
  }

  const quickActions = useMemo(
    () => [
      { key: "audit" as const, label: lang==="pl"?"Przeanalizuj moją stronę":"Analyze my website" },
      { key: "projects" as const, label: t.aiMascot.quickActions.projects },
      { key: "services" as const, label: lang==="pl"?"Dostępne usługi":"Services" },
      { key: "book" as const, label: t.aiMascot.quickActions.book },
    ],
    [t.aiMascot.quickActions,lang],
  );

  if (!mounted || cookieBannerVisible || !introFinished) return null;

  return (
    <>
      <AnimatePresence>
        {hidden ? (
          <motion.button
            type="button"
            onClick={restoreMascot}
            className={`fixed z-[75] inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--brand-black)]/90 px-4 py-3 text-sm text-white shadow-[0_18px_55px_rgba(0,0,0,0.42)] backdrop-blur-xl transition hover:border-[var(--brand-accent)] ${restorePositionClass}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <span className="inline-block h-7 w-7"><BerniRobot mood="sleeping" lang={lang} compact /></span>
            {t.aiMascot.restoreLabel}
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!hidden ? (
          <motion.div
            className={`fixed z-[75] ${restorePositionClass}`}
            data-berni-floating
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.82 }}
            transition={{ opacity: { duration: 0.22 }, scale: { duration: 0.22 } }}
          >
            <div className="relative">
              <AnimatePresence>
                {open ? (
                  <motion.aside
                    role="dialog"
                    aria-label={t.aiMascot.chatTitle}
                    className={`absolute z-30 flex max-h-[min(36rem,calc(100dvh-7rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/95 shadow-[0_28px_90px_rgba(0,0,0,0.58)] backdrop-blur-2xl ${companionPanelPositionClass} ${companionPanelSizeClass}`}
                    style={dragPlacement ? { left: dragPlacement.offsetX, right: "auto", maxHeight: dragPlacement.room } : undefined}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-8 w-8 shrink-0"><BerniRobot mood={loading ? "thinking" : input.trim() ? "typing" : "happy"} lang={lang} compact /></span>
                          <p className="truncate text-sm font-medium text-white">Berni · {lang === "pl" ? "Asystent AI" : "AI assistant"}</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={hideMascot}
                          aria-label={t.aiMascot.hideLabel}
                          className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-[var(--brand-black)] hover:text-white"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          aria-label={t.aiMascot.closeLabel}
                          className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-[var(--brand-black)] hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={scrollAreaRef}
                      aria-live="polite"
                      className="min-h-0 max-h-80 flex-1 space-y-2 overflow-y-auto px-4 py-3"
                    >
                      {messages.slice(booking.step === "idle" ? -5 : -3).map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[92%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                            message.role === "user"
                              ? "ml-auto rounded-br-md border border-[var(--brand-accent)] bg-[var(--brand-black)] text-white"
                              : "rounded-bl-md border border-white/[0.08] bg-[var(--brand-black)] text-white"
                          }`}
                        >
                          {renderLinkedMessage(message.content)}
                        </div>
                      ))}

                      {loading ? (
                        <div
                          role="status"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--brand-black)] px-4 py-3 text-sm text-white"
                        >
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          {t.aiMascot.thinkingLabel}
                        </div>
                      ) : null}

                      {booking.step !== "idle" ? renderBookingPanel() : null}

                      {error ? (
                        <div
                          role="alert"
                          className="rounded-2xl border border-[var(--brand-accent)] bg-[var(--brand-black)] px-4 py-3 text-sm text-white"
                        >
                          <p>{error}</p>
                          {lastFailedQuestion ? (
                            <button
                              type="button"
                              onClick={() => void sendMessage(lastFailedQuestion, { retry: true })}
                              disabled={loading}
                              className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--brand-accent)] px-3 py-2 text-xs text-white transition hover:border-[var(--brand-accent)] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              {assistantRuntimeCopy.retryLabel}
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="border-t border-white/[0.07] bg-black/18 px-3.5 py-3">
                      <button
                        type="button"
                        onClick={nudgesDisabled ? enableNudges : disableNudges}
                        className="mb-2 text-left text-[11px] text-white/55 underline-offset-2 transition hover:text-white hover:underline"
                      >
                        {nudgesDisabled
                          ? (lang === "pl" ? "Włącz automatyczne podpowiedzi" : "Enable occasional tips")
                          : (lang === "pl" ? "Wyłącz automatyczne podpowiedzi" : "Turn off occasional tips")}
                      </button>
                      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {quickActions.map((action) => (
                          <button
                            key={action.key}
                            type="button"
                            onClick={() => handleQuickAction(action.key)}
                            className="shrink-0 rounded-full border border-white/10 bg-[var(--brand-black)] px-3 py-2 text-xs text-white transition hover:border-[var(--brand-accent)] hover:text-white"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit}>
                        <label htmlFor="ai-mascot-message" className="sr-only">
                          {t.aiMascot.inputLabel}
                        </label>
                        <input
                          type="text"
                          value={website}
                          onChange={(event) => setWebsite(event.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                          className="hidden"
                          aria-hidden="true"
                        />
                        <div className="flex items-end gap-2 rounded-2xl border border-white/[0.09] bg-black/35 p-2">
                          <textarea
                            ref={inputRef}
                            id="ai-mascot-message"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" && !event.shiftKey) {
                                event.preventDefault();
                                void sendMessage();
                              }
                            }}
                            placeholder={t.aiMascot.placeholder}
                            rows={1}
                            maxLength={250}
                            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/70"
                          />
                          <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            aria-label={t.aiMascot.sendLabel}
                            className="brand-action grid h-10 w-10 shrink-0 place-items-center rounded-full  text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.aside>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {!open && nudge && !nudgesDisabled ? (
                  <motion.div
                    role="status"
                    aria-live="polite"
                    data-testid="ai-mascot-nudge"
                    style={dragPlacement ? { left: dragPlacement.nudgeOffsetX, right: "auto" } : undefined}
                    className="absolute bottom-[calc(100%+0.7rem)] right-0 z-40 w-[min(19rem,calc(100vw-1.25rem))] overflow-hidden rounded-2xl border border-white/15 bg-[#121317]/95 text-white shadow-[0_18px_48px_rgba(0,0,0,0.38)] backdrop-blur-xl"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <p className="px-3.5 pb-2 pt-3.5 text-[13px] leading-[1.55] text-white/95">
                      {nudge.text}
                    </p>
                    <div className="flex justify-end px-3.5 pb-2.5">
                      <button
                        type="button"
                        onClick={disableNudges}
                        data-testid="ai-mascot-nudge-opt-out"
                        className="text-[11px] text-white/65 underline-offset-2 transition hover:text-white hover:underline focus-visible:underline"
                      >
                        {lang === "en" || pathname.startsWith("/en") ? "Don't show again" : "Nie pokazuj więcej"}
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <BerniCompanion
                lang={lang}
                mood={behavior.mood}
                input={input}
                loading={loading}
                open={open}
                lastReply={messages[messages.length - 1]?.role === "assistant" ? messages[messages.length - 1].content : ""}
                nudgeText={nudge?.text ?? ""}
                weatherContext={serverContext?.weather ?? null}
                onOpen={() => openChat()}
                onDragEnd={handleBerniDragEnd}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );

  function renderBookingPanel() {
    if (booking.step === "loading-days") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[var(--brand-black)] p-4 text-sm text-white">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-white" />
          {t.aiMascot.booking.loadingDays}
        </div>
      );
    }

    if (booking.step === "error") {
      return (
        <div className="rounded-2xl border border-[var(--brand-accent)] bg-[var(--brand-black)] p-4 text-sm text-white">
          {booking.message}
        </div>
      );
    }

    if (booking.step === "days") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[var(--brand-black)] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white">
            {t.aiMascot.booking.chooseDay}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {booking.days.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => void selectBookingDay(day)}
                className="rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-left text-sm text-white transition hover:border-[var(--brand-accent)]"
              >
                <span className="block text-[0.65rem] uppercase tracking-[0.14em] text-white/70">
                  {day.weekday}
                </span>
                <span className="text-lg text-white">{day.day}</span>{" "}
                <span className="text-xs uppercase text-white/70">{day.month}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (booking.step === "loading-slots") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[var(--brand-black)] p-4 text-sm text-white">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-white" />
          {t.aiMascot.booking.loadingSlots}
        </div>
      );
    }

    if (booking.step === "slots") {
      return (
        <div className="rounded-2xl border border-white/10 bg-[var(--brand-black)] p-4">
          <p className="mb-1 text-sm text-white">{booking.selectedDayLabel}</p>
          <p className="mb-3 text-xs text-white/70">{timeZone}</p>
          <div className="grid grid-cols-3 gap-2">
            {booking.slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                onClick={() => selectBookingSlot(slot)}
                className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition hover:border-[var(--brand-accent)] hover:text-white"
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if ((booking.step === "details" || booking.step === "booking") && booking.selectedSlot) {
      const bookingDisabled =
        booking.step === "booking" ||
        !bookingName.trim() ||
        !bookingEmail.trim() ||
        Boolean(turnstileSiteKey && !turnstileToken);

      return (
        <form onSubmit={submitBooking} className="rounded-2xl border border-white/10 bg-[var(--brand-black)] p-4">
          <p className="mb-3 text-sm text-white">
            {formatSlotDate(booking.selectedSlot.start, timeZone, locale)} ·{" "}
            <span className="text-white">{booking.selectedSlot.label}</span>
          </p>
          <div className="grid gap-2">
            <input
              value={bookingName}
              onChange={(event) => setBookingName(event.target.value)}
              placeholder={t.aiMascot.booking.name}
              className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-accent)]"
            />
            <input
              value={bookingEmail}
              onChange={(event) => setBookingEmail(event.target.value)}
              placeholder={t.aiMascot.booking.email}
              type="email"
              className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-accent)]"
            />
            <textarea
              value={bookingTopic}
              onChange={(event) => setBookingTopic(event.target.value)}
              placeholder={t.aiMascot.booking.topic}
              rows={2}
              className="resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--brand-accent)]"
            />
          </div>
          {turnstileSiteKey ? (
            <div className="mt-3">
              <Turnstile
                siteKey={turnstileSiteKey}
                onSuccess={setTurnstileToken}
                onExpire={() => setTurnstileToken("")}
                options={{ theme: "dark" }}
              />
            </div>
          ) : null}
          {booking.message ? (
            <p className="mt-3 rounded-2xl border border-[var(--brand-accent)] bg-[var(--brand-black)] p-3 text-sm text-white">
              {booking.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={bookingDisabled}
            className="brand-action mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full  px-4 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {booking.step === "booking" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}
            {t.aiMascot.booking.submit}
          </button>
        </form>
      );
    }

    if (booking.step === "success") {
      return (
        <div className="rounded-2xl border border-[var(--brand-accent)] bg-[var(--brand-black)] p-4 text-sm text-white">
          {booking.message}
        </div>
      );
    }

    return null;
  }
}
