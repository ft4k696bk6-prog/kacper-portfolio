"use client";

import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, Eye, Loader2, MessageCircle, Mic, MicOff, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEFAULT_BOOKING_TIME_ZONE, formatSlotDate } from "@/lib/booking";
import type { AvailableBookingDay } from "@/lib/calcom";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_KEY, type CookieConsentState } from "@/lib/preferences";

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

type LocalAction = "projects" | "bcrm" | "book" | "contact";
type MascotMood = "idle" | "walking" | "curious" | "joking" | "listening" | "thinking";

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
const GREETED_KEY = "ai-mascot-greeted";
const NUDGE_COOLDOWN_KEY = "ai-mascot-nudge-last-at";
const NUDGE_COOLDOWN_MS = 24 * 1000;
const LINE_COOLDOWN_MS = 12 * 1000;
const OPEN_NUDGE_DELAY_MS = 2200;
const IDLE_NUDGE_DELAY_MS = 28 * 1000;

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
  const wantsNavigation =
    /\b(show|open|go|take|jump|przejdz|pokaz|otworz|sprawdz|wyswietl|zobacz)\b/.test(value);

  if (/\b(book|schedule|meeting|call|umow|spotkanie|rozmow)\b/.test(value)) {
    return "book";
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

function pickRandom(items: string[], fallback: string) {
  if (!items.length) return fallback;
  return items[Math.floor(Math.random() * items.length)] || fallback;
}

function canShowTimedNudge() {
  const lastShownAt = Number(localStorage.getItem(NUDGE_COOLDOWN_KEY) || 0);
  return !Number.isFinite(lastShownAt) || Date.now() - lastShownAt > NUDGE_COOLDOWN_MS;
}

function markTimedNudgeShown(markSession = false) {
  localStorage.setItem(NUDGE_COOLDOWN_KEY, String(Date.now()));
  if (markSession) {
    sessionStorage.setItem(GREETED_KEY, "true");
  }
}

function getAssistantRuntimeCopy(lang: "en" | "pl") {
  if (lang === "pl") {
    return {
      retryLabel: "Ponow odpowiedz",
      openerNudges: [
        "Ej, tu zywy przewodnik. Pokazac B-CRM czy od razu wejsc w konkrety?",
        "Chodze po tej stronie i pilnuje, zeby nikt nie zgubil najlepszego projektu.",
        "Mozesz mnie zapytac o stack, projekty albo kod. Ja nie gryze, najwyzej poprawie UX.",
      ],
      idleNudges: [
        "Moge porownac projekty albo wskazac najlepszy dowod techniczny.",
        "Dobry nastepny ruch: B-CRM. Tam jest najwiecej miesa.",
        "Jak chcesz, moge zrobic szybka trase po portfolio. Bez przewodnickiego tonu z muzeum.",
      ],
      movementNudges: [
        "Patrol portfolio trwa. Podejrzanie duzo Reacta, ale w dobrym sensie.",
        "O, tu warto kliknac projekty. Ja tylko subtelnie macham neonowym drogowskazem.",
        "Przechadzam sie, bo statyczny chatbot to juz troche muzeum internetu.",
      ],
      hoverNudges: [
        "Tak, zyje. Prawie. Zapytaj o B-CRM albo kod.",
        "Kliknij mnie, a otworze mini wejscie. Bez wielkiego okna, obiecuje.",
        "Masz pytanie techniczne? Dawaj najmniejszy fragment, bez sekretow.",
      ],
    };
  }

  return {
    retryLabel: "Retry answer",
    openerNudges: [
      "Hey, living guide here. Want B-CRM first, or should we go straight to the useful bits?",
      "I wander around this page so nobody misses the strongest project.",
      "Ask me about the stack, projects or code. I do not bite. I may judge bad UX a little.",
    ],
    idleNudges: [
      "I can compare projects or point to the strongest technical proof.",
      "Good next move: B-CRM. That is where the useful evidence lives.",
      "I can give you a fast route through the portfolio. No museum-guide monologue.",
    ],
    movementNudges: [
      "Portfolio patrol continues. Suspicious amount of React, but in a good way.",
      "Projects are worth a click. I am only waving a tasteful little sign.",
      "I move because static chat bubbles are basically internet furniture.",
    ],
    hoverNudges: [
      "Yep, alive. Almost. Ask me about B-CRM or code.",
      "Click me and I will open the tiny input. No giant chat wall.",
      "Technical question? Paste the smallest snippet, no secrets.",
    ],
  };
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
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [nudgeText, setNudgeText] = useState(t.aiMascot.greeting);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", t.aiMascot.initialMessage),
  ]);
  const [input, setInput] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastFailedQuestion, setLastFailedQuestion] = useState("");
  const [dictationSupported, setDictationSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [behavior, setBehavior] = useState<MascotBehaviorState>({ mood: "idle" });
  const [booking, setBooking] = useState<BookingState>(defaultBookingState);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingTopic, setBookingTopic] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const lastLineAtRef = useRef(0);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const timeZone = process.env.NEXT_PUBLIC_CALENDAR_TIMEZONE || DEFAULT_BOOKING_TIME_ZONE;
  const restorePositionClass = cookieBannerVisible
    ? "bottom-[14.5rem] right-4 md:bottom-4"
    : "bottom-4 right-4";
  const companionPanelPositionClass = isCompactViewport
    ? "bottom-[calc(100%+0.8rem)] right-0 w-[min(22rem,calc(100vw-1.5rem))]"
    : "bottom-[calc(100%+0.9rem)] right-0 w-[23rem]";
  const nudgePositionClass = isCompactViewport
    ? "bottom-[calc(100%+0.75rem)] right-0 w-[min(18rem,calc(100vw-1.5rem))]"
    : "bottom-[calc(100%+0.85rem)] right-0 w-72";
  const mascotMood: MascotMood = listening ? "listening" : loading ? "thinking" : behavior.mood;
  const assistantStatusLabel = listening
    ? t.aiMascot.dictationListeningLabel
    : loading
      ? t.aiMascot.thinkingLabel
      : t.aiMascot.dictationReadyLabel;
  const showCompanionLine = useCallback(
    (lines: string[], fallback: string, mood: MascotMood = "joking") => {
      if (open) return;
      const now = Date.now();
      if (now - lastLineAtRef.current < LINE_COOLDOWN_MS) return;

      lastLineAtRef.current = now;
      setNudgeText(pickRandom(lines, fallback));
      setNudgeVisible(true);
      setBehavior({ mood });
      window.setTimeout(() => setNudgeVisible(false), 6200);
    },
    [open],
  );

  useEffect(() => {
    setMounted(true);
    const hiddenUntil = Number(localStorage.getItem(HIDDEN_UNTIL_KEY) || 0);
    setHidden(Number.isFinite(hiddenUntil) && hiddenUntil > Date.now());
    syncCookieBannerVisibility();
    setDictationSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactQuery = window.matchMedia("(max-width: 767px)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
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

    syncMotion();
    syncCompactViewport();
    motionQuery.addEventListener("change", syncMotion);
    compactQuery.addEventListener("change", syncCompactViewport);
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      compactQuery.removeEventListener("change", syncCompactViewport);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0].role === "assistant"
        ? [createMessage("assistant", t.aiMascot.initialMessage)]
        : current,
    );
    setNudgeText(t.aiMascot.greeting);
  }, [t.aiMascot.greeting, t.aiMascot.initialMessage]);

  useEffect(() => {
    if (!mounted || hidden || open || sessionStorage.getItem(GREETED_KEY) || !canShowTimedNudge()) {
      return;
    }

    const showTimer = window.setTimeout(() => {
      if (!canShowTimedNudge()) return;
      setNudgeText(pickRandom(assistantRuntimeCopy.openerNudges, t.aiMascot.greeting));
      setNudgeVisible(true);
      setBehavior({ mood: "curious" });
      markTimedNudgeShown(true);
    }, OPEN_NUDGE_DELAY_MS);
    const hideTimer = window.setTimeout(
      () => setNudgeVisible(false),
      OPEN_NUDGE_DELAY_MS + 9000,
    );

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [assistantRuntimeCopy, hidden, mounted, open, t.aiMascot.greeting]);

  useEffect(() => {
    if (!mounted || hidden || loading || listening || booking.step !== "idle") return;

    const idleTimer = window.setTimeout(() => {
      if (!canShowTimedNudge()) return;
      const idleMessage = pickRandom(assistantRuntimeCopy.idleNudges, t.aiMascot.greeting);
      if (open) {
        setMessages((current) => [...current, createMessage("assistant", idleMessage)]);
      } else {
        setNudgeText(idleMessage);
        setNudgeVisible(true);
        window.setTimeout(() => setNudgeVisible(false), 7200);
      }
      setBehavior({ mood: "joking" });
      markTimedNudgeShown();
    }, IDLE_NUDGE_DELAY_MS);

    return () => window.clearTimeout(idleTimer);
  }, [
    assistantRuntimeCopy,
    booking.step,
    hidden,
    listening,
    loading,
    messages.length,
    mounted,
    open,
    t.aiMascot.greeting,
  ]);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, booking.step, loading]);

  function openChat(prefill?: string) {
    setHidden(false);
    setNudgeVisible(false);
    setOpen(true);
    setBehavior({ mood: "curious" });
    if (prefill) {
      setInput(prefill);
    }
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }

  function hideMascot() {
    localStorage.setItem(HIDDEN_UNTIL_KEY, String(Date.now() + HIDE_DURATION_MS));
    setOpen(false);
    setHidden(true);
    setNudgeVisible(false);
  }

  function restoreMascot() {
    localStorage.removeItem(HIDDEN_UNTIL_KEY);
    setHidden(false);
    setOpen(true);
    setBehavior({ mood: "curious" });
    window.setTimeout(() => inputRef.current?.focus(), 80);
  }

  function scrollToStaticSection(hash: "#projects" | "#contact") {
    setOpen(false);

    if (pathname !== "/static") {
      router.push(`/static${hash}`);
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

    if (localAction && !options.retry) {
      window.setTimeout(() => handleQuickAction(localAction), 0);
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

  function handleQuickAction(action: "projects" | "bcrm" | "book" | "contact" | "code") {
    setError("");
    setBehavior((current) => ({ ...current, mood: "joking" }));

    if (action === "projects") {
      setMessages((current) => [...current, createMessage("assistant", t.aiMascot.actionReplies.projects)]);
      scrollToStaticSection("#projects");
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
          website,
          start: booking.selectedSlot.start,
          turnstileToken,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
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

  function handleMascotInterest() {
    if (loading || listening) return;
    setBehavior({ mood: "curious" });
    showCompanionLine(assistantRuntimeCopy.hoverNudges, t.aiMascot.greeting, "curious");
  }

  const quickActions = useMemo(
    () => [
      { key: "projects" as const, label: t.aiMascot.quickActions.projects },
      { key: "bcrm" as const, label: t.aiMascot.quickActions.bcrm },
      { key: "book" as const, label: t.aiMascot.quickActions.book },
      { key: "contact" as const, label: t.aiMascot.quickActions.contact },
      { key: "code" as const, label: t.aiMascot.quickActions.code },
    ],
    [t.aiMascot.quickActions],
  );

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {hidden ? (
          <motion.button
            type="button"
            onClick={restoreMascot}
            className={`fixed z-[75] inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#090909]/90 px-4 py-3 text-sm text-[#f5dfae] shadow-[0_18px_55px_rgba(0,0,0,0.42)] backdrop-blur-xl transition hover:border-[#d7b46a]/45 ${restorePositionClass}`}
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
                {nudgeVisible && !open ? (
                  <motion.button
                    type="button"
                    onClick={() => openChat()}
                    aria-live="polite"
                    className={`absolute z-20 rounded-2xl border border-white/10 bg-[#090909]/95 px-4 py-3 text-left text-sm leading-6 text-zinc-100 shadow-[0_22px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl ${nudgePositionClass}`}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  >
                    {nudgeText}
                  </motion.button>
                ) : null}
              </AnimatePresence>

              <AnimatePresence>
                {open ? (
                  <motion.aside
                    role="dialog"
                    aria-label={t.aiMascot.chatTitle}
                    className={`absolute z-30 flex max-h-[min(29rem,calc(100vh-1rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#080808]/95 shadow-[0_28px_90px_rgba(0,0,0,0.58)] backdrop-blur-2xl ${companionPanelPositionClass}`}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{t.aiMascot.chatTitle}</p>
                        <p className="mt-0.5 text-xs text-zinc-400">{assistantStatusLabel}</p>
                        <p className="mt-1 text-[0.66rem] uppercase tracking-[0.18em] text-[#d7b46a]/80">
                          {t.aiMascot.personaLabel}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={hideMascot}
                          aria-label={t.aiMascot.hideLabel}
                          className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 transition hover:bg-white/[0.08] hover:text-[#f5dfae]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          aria-label={t.aiMascot.closeLabel}
                          className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      ref={scrollAreaRef}
                      aria-live="polite"
                      className="max-h-56 flex-1 space-y-2 overflow-y-auto px-4 py-3"
                    >
                      {messages.slice(booking.step === "idle" ? -5 : -3).map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[92%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                            message.role === "user"
                              ? "ml-auto rounded-br-md bg-[#d7b46a] text-black shadow-[0_10px_28px_rgba(215,180,106,0.16)]"
                              : "rounded-bl-md border border-white/[0.08] bg-white/[0.045] text-zinc-100"
                          }`}
                        >
                          {message.content}
                        </div>
                      ))}

                      {loading ? (
                        <div
                          role="status"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-zinc-300"
                        >
                          <Loader2 className="h-4 w-4 animate-spin text-[#d7b46a]" />
                          {t.aiMascot.thinkingLabel}
                        </div>
                      ) : null}

                      {booking.step !== "idle" ? renderBookingPanel() : null}

                      {error ? (
                        <div
                          role="alert"
                          className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                        >
                          <p>{error}</p>
                          {lastFailedQuestion ? (
                            <button
                              type="button"
                              onClick={() => void sendMessage(lastFailedQuestion, { retry: true })}
                              disabled={loading}
                              className="mt-3 inline-flex items-center gap-2 rounded-full border border-red-200/25 px-3 py-2 text-xs text-red-50 transition hover:border-red-100/50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              {assistantRuntimeCopy.retryLabel}
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="border-t border-white/[0.07] bg-black/18 px-3.5 py-3">
                      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {quickActions.map((action) => (
                          <button
                            key={action.key}
                            type="button"
                            onClick={() => handleQuickAction(action.key)}
                            className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-200 transition hover:border-[#d7b46a]/45 hover:text-[#f5dfae]"
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
                            maxLength={1400}
                            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-zinc-500"
                          />
                          {dictationSupported ? (
                            <button
                              type="button"
                              onClick={listening ? stopDictation : startDictation}
                              aria-label={listening ? t.aiMascot.stopMicLabel : t.aiMascot.micLabel}
                              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
                                listening
                                  ? "bg-red-400/20 text-red-100"
                                  : "bg-white/[0.06] text-zinc-200 hover:bg-white/[0.1]"
                              }`}
                            >
                              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                            </button>
                          ) : null}
                          <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            aria-label={t.aiMascot.sendLabel}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d7b46a] text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                          {dictationSupported ? t.aiMascot.dictationHint : t.aiMascot.dictationUnsupported}
                        </p>
                      </form>
                    </div>
                  </motion.aside>
                ) : null}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={() => openChat()}
                onMouseEnter={handleMascotInterest}
                onFocus={handleMascotInterest}
                aria-label={t.aiMascot.openLabel}
                data-testid="ai-mascot-open"
                className="group relative grid h-16 w-16 place-items-center rounded-[1.35rem] border border-[#f5dfae]/45 bg-[#d7b46a] text-black shadow-[0_18px_58px_rgba(0,0,0,0.48)] outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#d7b46a]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:h-20 md:w-20 after:absolute after:-bottom-1 after:right-4 after:h-4 after:w-4 after:rotate-45 after:rounded-[0.18rem] after:bg-[#d7b46a] after:shadow-[8px_8px_30px_rgba(0,0,0,0.2)]"
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        y: mascotMood === "thinking" ? [0, -4, 0] : [0, -3, 0],
                        rotate: mascotMood === "curious" ? [0, -4, 3, 0] : 0,
                      }
                }
                transition={{
                  y: { duration: mascotMood === "thinking" ? 1.4 : 3.8, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 1.4, ease: "easeInOut" },
                }}
              >
                <span className="absolute -inset-2 rounded-[1.65rem] bg-[#d7b46a]/20 blur-xl transition group-hover:bg-[#d7b46a]/32" />
                <span className="absolute inset-0 rounded-[1.35rem] bg-gradient-to-br from-[#f5dfae] via-[#d7b46a] to-[#9c7732]" />
                <span className="relative z-10 grid h-10 w-10 place-items-center rounded-2xl bg-black/15 text-black shadow-inner md:h-12 md:w-12">
                  <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
                  <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-white" />
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
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm text-zinc-300">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-[#d7b46a]" />
          {t.aiMascot.booking.loadingDays}
        </div>
      );
    }

    if (booking.step === "error") {
      return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {booking.message}
        </div>
      );
    }

    if (booking.step === "days") {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#d7b46a]">
            {t.aiMascot.booking.chooseDay}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {booking.days.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => void selectBookingDay(day)}
                className="rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-left text-sm text-zinc-100 transition hover:border-[#d7b46a]/50"
              >
                <span className="block text-[0.65rem] uppercase tracking-[0.14em] text-zinc-500">
                  {day.weekday}
                </span>
                <span className="text-lg text-white">{day.day}</span>{" "}
                <span className="text-xs uppercase text-zinc-400">{day.month}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (booking.step === "loading-slots") {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm text-zinc-300">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin text-[#d7b46a]" />
          {t.aiMascot.booking.loadingSlots}
        </div>
      );
    }

    if (booking.step === "slots") {
      return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="mb-1 text-sm text-white">{booking.selectedDayLabel}</p>
          <p className="mb-3 text-xs text-zinc-500">{timeZone}</p>
          <div className="grid grid-cols-3 gap-2">
            {booking.slots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                onClick={() => selectBookingSlot(slot)}
                className="rounded-full border border-white/10 bg-black/25 px-3 py-2 text-sm text-zinc-100 transition hover:border-[#d7b46a]/50 hover:text-[#f5dfae]"
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
        <form onSubmit={submitBooking} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
          <p className="mb-3 text-sm text-zinc-200">
            {formatSlotDate(booking.selectedSlot.start, timeZone, locale)} ·{" "}
            <span className="text-[#f5dfae]">{booking.selectedSlot.label}</span>
          </p>
          <div className="grid gap-2">
            <input
              value={bookingName}
              onChange={(event) => setBookingName(event.target.value)}
              placeholder={t.aiMascot.booking.name}
              className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d7b46a]/60"
            />
            <input
              value={bookingEmail}
              onChange={(event) => setBookingEmail(event.target.value)}
              placeholder={t.aiMascot.booking.email}
              type="email"
              className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d7b46a]/60"
            />
            <textarea
              value={bookingTopic}
              onChange={(event) => setBookingTopic(event.target.value)}
              placeholder={t.aiMascot.booking.topic}
              rows={2}
              className="resize-none rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#d7b46a]/60"
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
            <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">
              {booking.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={bookingDisabled}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#d7b46a] px-4 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {booking.step === "booking" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}
            {t.aiMascot.booking.submit}
          </button>
        </form>
      );
    }

    if (booking.step === "success") {
      return (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          {booking.message}
        </div>
      );
    }

    return null;
  }
}
