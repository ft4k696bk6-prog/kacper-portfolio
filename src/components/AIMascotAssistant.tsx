"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  CalendarDays,
  Eye,
  Loader2,
  Mic,
  MicOff,
  PhoneCall,
  RotateCcw,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AIMascotCanvas } from "@/components/AIMascotCanvas";
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
const NUDGE_COOLDOWN_MS = 20 * 60 * 1000;
const OPEN_NUDGE_DELAY_MS = 3600;
const IDLE_NUDGE_DELAY_MS = 60 * 1000;

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
        "Moge strescic B-CRM, pokazac projekty albo pomoc z kodem. Bez cyrku, konkretnie.",
        "Potrzebujesz szybkiej sciezki po portfolio? Ja znam skroty.",
        "Chcesz wiedziec, co Kacper dowozi biznesowo? Zacznijmy od B-CRM.",
      ],
      idleNudges: [
        "Jesli chcesz, moge porownac projekty albo wskazac najlepszy dowod techniczny.",
        "Moge tez otworzyc kontakt albo umowic rozmowe. Spokojnie, nie bede klikal bez prosby.",
        "Dobry nastepny krok: zapytaj o stack, role w B-CRM albo wartosc biznesowa.",
      ],
    };
  }

  return {
    retryLabel: "Retry answer",
    openerNudges: [
      "I can summarize B-CRM, point to projects, or help with code. Crisp, no confetti.",
      "Need the fastest route through the portfolio? I know the shortcuts.",
      "Want the business-value version of Kacper's work? B-CRM is a good first stop.",
    ],
    idleNudges: [
      "I can compare projects or point you to the strongest technical proof.",
      "I can also open contact or help book a call. Calmly, only when asked.",
      "Good next step: ask about the stack, B-CRM roles, or business value.",
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
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [booking, setBooking] = useState<BookingState>(defaultBookingState);
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingTopic, setBookingTopic] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const voiceModeRef = useRef(false);
  const voiceMutedRef = useRef(false);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const timeZone = process.env.NEXT_PUBLIC_CALENDAR_TIMEZONE || DEFAULT_BOOKING_TIME_ZONE;
  const mascotMood = listening ? "listening" : loading ? "thinking" : speaking ? "speaking" : "idle";
  const voiceStatusLabel = !voiceSupported
    ? t.aiMascot.voiceUnavailableLabel
    : voiceMode
      ? listening
        ? t.aiMascot.voiceListeningLabel
        : speaking
          ? t.aiMascot.voiceSpeakingLabel
          : loading
            ? t.aiMascot.voiceThinkingLabel
            : voiceMuted
              ? t.aiMascot.voiceMutedLabel
              : t.aiMascot.voiceReadyLabel
      : t.aiMascot.voiceIdleLabel;
  const mascotPositionClass = cookieBannerVisible
    ? "bottom-[14.5rem] right-4 md:bottom-8 md:right-8"
    : "bottom-5 right-4 md:bottom-8 md:right-8";
  const restorePositionClass = cookieBannerVisible
    ? "bottom-[14.5rem] right-4 md:bottom-4"
    : "bottom-4 right-4";
  const chatPositionClass = cookieBannerVisible
    ? "bottom-[16rem] right-4 max-h-[calc(100vh-17.5rem)] md:bottom-40 md:right-8 md:max-h-[calc(100vh-9rem)]"
    : "bottom-32 right-4 max-h-[calc(100vh-9rem)] md:bottom-40 md:right-8";

  useEffect(() => {
    setMounted(true);
    const hiddenUntil = Number(localStorage.getItem(HIDDEN_UNTIL_KEY) || 0);
    setHidden(Number.isFinite(hiddenUntil) && hiddenUntil > Date.now());
    syncCookieBannerVisibility();
    setVoiceSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(mediaQuery.matches);
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
    mediaQuery.addEventListener("change", syncMotion);
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      mediaQuery.removeEventListener("change", syncMotion);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    voiceMutedRef.current = voiceMuted;
    if (voiceMuted && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [voiceMuted]);

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
      markTimedNudgeShown(true);
    }, OPEN_NUDGE_DELAY_MS);
    const hideTimer = window.setTimeout(
      () => setNudgeVisible(false),
      OPEN_NUDGE_DELAY_MS + 12000,
    );

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [assistantRuntimeCopy, hidden, mounted, open, t.aiMascot.greeting]);

  useEffect(() => {
    if (!mounted || hidden || !open || loading || listening || booking.step !== "idle") return;

    const idleTimer = window.setTimeout(() => {
      if (!canShowTimedNudge()) return;
      const idleMessage = pickRandom(assistantRuntimeCopy.idleNudges, t.aiMascot.greeting);
      setMessages((current) => [...current, createMessage("assistant", idleMessage)]);
      markTimedNudgeShown();
    }, IDLE_NUDGE_DELAY_MS);

    return () => window.clearTimeout(idleTimer);
  }, [assistantRuntimeCopy, booking.step, hidden, listening, loading, messages.length, mounted, open, t.aiMascot.greeting]);

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

  function resumeVoiceLoop() {
    if (!voiceModeRef.current || !voiceSupported) return;
    window.setTimeout(() => {
      if (voiceModeRef.current && !loading && !listening && !speaking) {
        startVoiceInput();
      }
    }, 420);
  }

  function speakAnswer(answer: string, options: { resumeListening?: boolean } = {}) {
    if (!("speechSynthesis" in window) || voiceMutedRef.current) {
      if (options.resumeListening) resumeVoiceLoop();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = lang === "pl" ? "pl-PL" : "en-US";
    utterance.rate = 1.02;
    utterance.pitch = 1.04;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      if (options.resumeListening) resumeVoiceLoop();
    };
    utterance.onerror = () => {
      setSpeaking(false);
      if (options.resumeListening) resumeVoiceLoop();
    };
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(
    nextInput?: string,
    options: { speak?: boolean; retry?: boolean } = {},
  ) {
    const question = (nextInput ?? input).trim();
    if (!question || loading) return;

    const nextMessages = options.retry ? messages : [...messages, createMessage("user", question)];
    const localAction = detectLocalAction(question);
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLastFailedQuestion("");

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

      const answer = result.answer ?? "";
      setMessages((current) => [...current, createMessage("assistant", answer)]);
      const shouldContinueVoice = voiceModeRef.current && !options.retry;
      if ((options.speak || shouldContinueVoice) && answer) {
        speakAnswer(answer, { resumeListening: shouldContinueVoice });
      } else if (shouldContinueVoice) {
        resumeVoiceLoop();
      }
    } catch (caughtError) {
      setLastFailedQuestion(question);
      setError(caughtError instanceof Error ? caughtError.message : t.aiMascot.errorMessage);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function startVoiceInput() {
    if (!voiceSupported || listening || loading || speaking) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t.aiMascot.voiceUnsupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === "pl" ? "pl-PL" : "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;
    setError("");
    setListening(true);

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
        recognition.stop();
        void sendMessage(cleanFinal, { speak: voiceModeRef.current || !voiceMutedRef.current });
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setError(t.aiMascot.voicePermissionError);
    };
    recognition.onend = () => setListening(false);

    try {
      recognition.start();
    } catch {
      setListening(false);
      setError(t.aiMascot.voicePermissionError);
    }
  }

  function stopVoiceInput() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  function startVoiceCall() {
    if (!voiceSupported) {
      setError(t.aiMascot.voiceUnsupported);
      return;
    }

    openChat();
    setVoiceMode(true);
    voiceModeRef.current = true;
    setVoiceMuted(false);
    voiceMutedRef.current = false;
    setError("");
    setMessages((current) =>
      current.some((message) => message.content === t.aiMascot.voiceCallIntro)
        ? current
        : [...current, createMessage("assistant", t.aiMascot.voiceCallIntro)],
    );
    window.setTimeout(() => startVoiceInput(), 180);
  }

  function endVoiceCall() {
    setVoiceMode(false);
    voiceModeRef.current = false;
    stopVoiceInput();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }

  function toggleVoiceMute() {
    setVoiceMuted((current) => !current);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleQuickAction(action: "projects" | "bcrm" | "book" | "contact" | "code") {
    setError("");

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
            <Bot className="h-4 w-4" />
            {t.aiMascot.restoreLabel}
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!hidden ? (
          <motion.div
            className={`fixed z-[75] ${mascotPositionClass}`}
            initial={{ opacity: 0, scale: 0.78, y: 24 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: reducedMotion ? 0 : [0, -18, 12, -8, 0],
              y: reducedMotion ? 0 : [0, -28, -8, -18, 0],
            }}
            exit={{ opacity: 0, scale: 0.82, y: 20 }}
            transition={{
              opacity: { duration: 0.25 },
              scale: { duration: 0.25 },
              x: { duration: 18, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 18, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <div className="relative">
              <AnimatePresence>
                {nudgeVisible && !open ? (
                  <motion.button
                    type="button"
                    onClick={() => openChat()}
                    className="absolute bottom-[7.2rem] right-0 w-[min(17rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#0a0a0a]/95 px-4 py-3 text-left text-sm leading-6 text-zinc-100 shadow-[0_20px_70px_rgba(0,0,0,0.46)] backdrop-blur-xl md:bottom-[9.8rem]"
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  >
                    {nudgeText}
                  </motion.button>
                ) : null}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => openChat()}
                aria-label={t.aiMascot.openLabel}
                data-testid="ai-mascot-open"
                className="group relative h-28 w-28 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-[#d7b46a]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:h-40 md:w-40"
              >
                <span className="absolute inset-2 rounded-full bg-[#d7b46a]/16 blur-2xl transition group-hover:bg-[#d7b46a]/28" />
                <span className="absolute inset-0 rounded-full border border-white/10 bg-black/20 shadow-[0_22px_80px_rgba(0,0,0,0.48)] backdrop-blur-sm" />
                <span className="relative block h-full w-full">
                  <AIMascotCanvas mood={mascotMood} reducedMotion={reducedMotion} />
                </span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open && !hidden ? (
          <motion.aside
            role="dialog"
            aria-label={t.aiMascot.chatTitle}
            className={`fixed z-[90] flex w-[min(26.5rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#080808]/94 shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl ${chatPositionClass}`}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <div className="border-b border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] px-4 pb-3 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-16 w-16 shrink-0 rounded-2xl border border-white/10 bg-black/25 shadow-[0_14px_45px_rgba(0,0,0,0.35)]">
                    <AIMascotCanvas mood={mascotMood} reducedMotion={reducedMotion} />
                    <span
                      className={`absolute bottom-1.5 right-1.5 h-2.5 w-2.5 rounded-full border border-black ${
                        listening
                          ? "bg-emerald-300"
                          : speaking
                            ? "bg-[#d7b46a]"
                            : loading
                              ? "bg-sky-300"
                              : "bg-zinc-500"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{t.aiMascot.chatTitle}</p>
                    <p className="mt-0.5 text-xs text-zinc-400">{voiceStatusLabel}</p>
                    <p className="mt-1 text-[0.68rem] uppercase tracking-[0.18em] text-[#d7b46a]/80">
                      {t.aiMascot.personaLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={voiceMode ? endVoiceCall : startVoiceCall}
                    aria-label={voiceMode ? t.aiMascot.endCallLabel : t.aiMascot.voiceCallLabel}
                    className={`grid h-9 w-9 place-items-center rounded-full transition ${
                      voiceMode
                        ? "bg-[#d7b46a] text-black"
                        : "text-zinc-300 hover:bg-white/[0.08] hover:text-[#f5dfae]"
                    }`}
                  >
                    <PhoneCall className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={hideMascot}
                    aria-label={t.aiMascot.hideLabel}
                    className="grid h-9 w-9 place-items-center rounded-full text-zinc-400 transition hover:bg-white/[0.08] hover:text-[#f5dfae]"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t.aiMascot.closeLabel}
                    className="grid h-9 w-9 place-items-center rounded-full text-zinc-400 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={scrollAreaRef}
              aria-live="polite"
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.slice(-8).map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
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

            <div className="border-t border-white/[0.07] bg-black/18 px-4 py-3">
              <div className="mb-3 flex items-center justify-between gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-xs text-zinc-400">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      voiceMode ? "bg-emerald-300" : voiceSupported ? "bg-[#d7b46a]" : "bg-zinc-600"
                    }`}
                  />
                  <span className="truncate">{voiceStatusLabel}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={voiceMode ? endVoiceCall : startVoiceCall}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs transition ${
                      voiceMode
                        ? "bg-[#d7b46a] text-black"
                        : "bg-white/[0.06] text-zinc-100 hover:bg-white/[0.1]"
                    }`}
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    {voiceMode ? t.aiMascot.endCallLabel : t.aiMascot.voiceCallLabel}
                  </button>
                  {voiceMode ? (
                    <button
                      type="button"
                      onClick={toggleVoiceMute}
                      aria-label={voiceMuted ? t.aiMascot.unmuteLabel : t.aiMascot.muteLabel}
                      className="grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] text-zinc-200 transition hover:bg-white/[0.1]"
                    >
                      {voiceMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    </button>
                  ) : null}
                </span>
              </div>
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
                    placeholder={voiceSupported ? t.aiMascot.placeholderVoice : t.aiMascot.placeholder}
                    rows={1}
                    maxLength={1400}
                    className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-white outline-none placeholder:text-zinc-500"
                  />
                  {voiceSupported ? (
                    <button
                      type="button"
                      onClick={listening ? stopVoiceInput : startVoiceInput}
                      aria-label={listening ? t.aiMascot.stopMicLabel : t.aiMascot.micLabel}
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
                        listening
                          ? "bg-red-400/20 text-red-100"
                          : voiceMode
                            ? "bg-emerald-300/15 text-emerald-100 hover:bg-emerald-300/20"
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
                <p className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                  {voiceMuted ? (
                    <VolumeX className="h-3.5 w-3.5 text-zinc-500" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5 text-[#d7b46a]" />
                  )}
                  {voiceSupported
                    ? voiceMode
                      ? t.aiMascot.voiceCallHint
                      : t.aiMascot.voiceHint
                    : t.aiMascot.voiceUnsupported}
                </p>
              </form>
            </div>
          </motion.aside>
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
