"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Eye, Loader2, MessageCircle, Mic, MicOff, RotateCcw, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEFAULT_BOOKING_TIME_ZONE, formatSlotDate } from "@/lib/booking";
import type { AvailableBookingDay } from "@/lib/calcom";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY, type CookieConsentState } from "@/lib/preferences";
import { localizedToolPath } from "@/lib/toolbox-en";
import {
  getCompanionContext,
  pickCompanionNudge,
  type CompanionNudge,
  type CompanionCategory,
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
type MascotMood = "idle" | "curious" | "joking" | "listening" | "thinking";

type MascotBehaviorState = {
  mood: MascotMood;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const HIDE_DURATION_MS = 48 * 60 * 60 * 1000;
const HIDDEN_UNTIL_KEY = "ai-mascot-hidden-until";
const NUDGE_OPT_OUT_KEY = "kb-companion-nudges-off";
const NUDGE_HISTORY_KEY = "kb-companion-recent-v1";
const NUDGE_LAST_CATEGORY_KEY = "kb-companion-last-category";
const NUDGE_RETURNING_KEY = "kb-companion-returning";
const NUDGE_SESSION_COUNT_KEY = "kb-companion-session-count";

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
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState<CompanionNudge | null>(null);
  const [nudgesDisabled, setNudgesDisabled] = useState(false);
  const [nudgeSettingsLoaded, setNudgeSettingsLoaded] = useState(false);
  const [serverContext, setServerContext] = useState<CompanionServerContext | null>(null);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", t.aiMascot.initialMessage),
  ]);
  const [input, setInput] = useState("");
  const [website, setWebsite] = useState("");
  const [awaitingAuditUrl, setAwaitingAuditUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFailedQuestion, setLastFailedQuestion] = useState("");
  const [dictationSupported, setDictationSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [behavior, setBehavior] = useState<MascotBehaviorState>({ mood: "idle" });
  const [booking, setBooking] = useState<BookingState>(defaultBookingState);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingTopic, setBookingTopic] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const timeZone = process.env.NEXT_PUBLIC_CALENDAR_TIMEZONE || DEFAULT_BOOKING_TIME_ZONE;
  const restorePositionClass = cookieBannerVisible
    ? "bottom-[14.5rem] right-4 md:bottom-4"
    : "bottom-4 right-4";
  const companionPanelPositionClass = isCompactViewport
    ? "bottom-[calc(100%+0.7rem)] right-0 w-[min(21.5rem,calc(100vw-1.25rem))]"
    : "bottom-[calc(100%+0.9rem)] right-0 w-[24rem]";
  const companionPanelSizeClass = isCompactViewport
    ? "h-[min(36rem,calc(100dvh-8.5rem))]"
    : "h-[min(36rem,calc(100dvh-7rem))]";
  useEffect(() => {
    setMounted(true);
    const hiddenUntil = Number(localStorage.getItem(HIDDEN_UNTIL_KEY) || 0);
    setHidden(Number.isFinite(hiddenUntil) && hiddenUntil > Date.now());
    setNudgesDisabled(localStorage.getItem(NUDGE_OPT_OUT_KEY) === "1");
    setNudgeSettingsLoaded(true);
    syncCookieBannerVisibility();
    setDictationSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

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

  // Public, zero-token messages. IP-based weather is optional and never needed
  // for the chat itself. Only request location context after consent is accepted.
  useEffect(() => {
    if (!mounted || cookieBannerVisible || nudgesDisabled) return;
    if (localStorage.getItem(COOKIE_CONSENT_KEY) !== "accepted") return;
    const controller = new AbortController();
    fetch("/api/companion-context", { signal: controller.signal, cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then((data: CompanionServerContext | null) => {
        if (!controller.signal.aborted && data) setServerContext(data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [mounted, cookieBannerVisible, nudgesDisabled]);

  useEffect(() => {
    if (!mounted || !nudgeSettingsLoaded || cookieBannerVisible || hidden || open || nudge || nudgesDisabled) return;
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
      const history = consentAccepted ? (() => {
        try {
          const saved = JSON.parse(localStorage.getItem(NUDGE_HISTORY_KEY) || "[]");
          return Array.isArray(saved) ? saved.filter((item): item is string => typeof item === "string").slice(-45) : [];
        } catch { return [] as string[]; }
      })() : [];
      const previous = consentAccepted
        ? localStorage.getItem(NUDGE_LAST_CATEGORY_KEY) as CompanionCategory | null
        : null;
      const returning = consentAccepted && localStorage.getItem(NUDGE_RETURNING_KEY) === "1";
      const language = pathname.startsWith("/en") ? "en" : lang;
      const context = getCompanionContext(language, pathname, consentAccepted ? serverContext : null, returning);
      const selected = pickCompanionNudge(context, history, previous ?? undefined);
      if (!selected) return;

      setNudge(selected);
      sessionStorage.setItem(NUDGE_SESSION_COUNT_KEY, String(alreadyShown + 1));
      if (consentAccepted) {
        localStorage.setItem(NUDGE_HISTORY_KEY, JSON.stringify([...history, selected.id].slice(-45)));
        localStorage.setItem(NUDGE_LAST_CATEGORY_KEY, selected.category);
        localStorage.setItem(NUDGE_RETURNING_KEY, "1");
      }
    }
    timer = window.setTimeout(maybeShow, alreadyShown === 0 ? 10500 : 120000);
    return () => window.clearTimeout(timer);
  }, [mounted, nudgeSettingsLoaded, cookieBannerVisible, hidden, open, nudge, nudgesDisabled, pathname, lang, serverContext]);

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

  function startDictation() {
    if (!dictationSupported || listening || loading) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t.aiMascot.dictationUnsupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === "pl" ? "pl-PL" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    setError("");
    setListening(true);
    setBehavior((current) => ({ ...current, mood: "listening" }));

    recognition.onresult = (event) => {
      let transcript = "";
      let finalTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalTranscript += event.results[index][0].transcript;
        }
      }

      const cleanTranscript = transcript.trim();
      if (cleanTranscript) setInput(cleanTranscript);

      const cleanFinal = finalTranscript.trim();
      if (cleanFinal) {
        setInput(cleanFinal);
        recognition.stop();
        window.setTimeout(() => inputRef.current?.focus(), 80);
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setError(t.aiMascot.dictationPermissionError);
      setBehavior((current) => ({ ...current, mood: "curious" }));
    };
    recognition.onend = () => {
      setListening(false);
      setBehavior((current) => ({ ...current, mood: "idle" }));
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setError(t.aiMascot.dictationPermissionError);
      setBehavior((current) => ({ ...current, mood: "curious" }));
    }
  }

  function stopDictation() {
    recognitionRef.current?.stop();
    setListening(false);
    setBehavior((current) => ({ ...current, mood: "idle" }));
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

  if (!mounted || cookieBannerVisible) return null;

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
            <MessageCircle className="h-4 w-4" />
            {t.aiMascot.restoreLabel}
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!hidden ? (
          <motion.div
            className={`fixed z-[75] ${restorePositionClass}`}
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
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{t.aiMascot.chatTitle}</p>
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
                            placeholder={dictationSupported ? t.aiMascot.placeholderDictation : t.aiMascot.placeholder}
                            rows={1}
                            maxLength={250}
                            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-white/70"
                          />
                          {dictationSupported ? (
                            <button
                              type="button"
                              onClick={listening ? stopDictation : startDictation}
                              aria-label={listening ? t.aiMascot.stopMicLabel : t.aiMascot.micLabel}
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
                                listening
                                  ? "bg-[var(--brand-black)] text-white"
                                  : "bg-[var(--brand-black)] text-white hover:bg-[var(--brand-black)]"
                              }`}
                            >
                              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </button>
                          ) : null}
                          <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            aria-label={t.aiMascot.sendLabel}
                            className="brand-action grid h-10 w-10 shrink-0 place-items-center rounded-full  text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-white/70">
                          {dictationSupported ? t.aiMascot.dictationHint : t.aiMascot.dictationUnsupported}
                        </p>
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
                        {lang === "pl" ? "Nie pokazuj więcej" : "Don't show again"}
                      </button>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={() => openChat()}
                aria-label={t.aiMascot.openLabel}
                data-testid="ai-mascot-open"
                data-mood={behavior.mood}
                className="brand-outline group relative grid h-12 w-12 place-items-center rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-black md:h-14 md:w-14"
              >
                <span className="brand-action absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border border-[#111111]  px-1 text-[9px] font-semibold tracking-wide text-black">
                  AI
                </span>
                <span className="relative z-10 grid h-8 w-8 place-items-center md:h-9 md:w-9">
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                </span>
              </motion.button>
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
