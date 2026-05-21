"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  CalendarDays,
  Code2,
  Eye,
  Loader2,
  Mail,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AIMascotCanvas } from "@/components/AIMascotCanvas";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEFAULT_BOOKING_TIME_ZONE, formatSlotDate } from "@/lib/booking";
import type { AvailableBookingDay } from "@/lib/calcom";

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
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [nudgeVisible, setNudgeVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", t.aiMascot.initialMessage),
  ]);
  const [input, setInput] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
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
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const locale = lang === "pl" ? "pl-PL" : "en-US";
  const timeZone = process.env.NEXT_PUBLIC_CALENDAR_TIMEZONE || DEFAULT_BOOKING_TIME_ZONE;
  const mascotMood = listening ? "listening" : loading ? "thinking" : speaking ? "speaking" : "idle";

  useEffect(() => {
    setMounted(true);
    const hiddenUntil = Number(localStorage.getItem(HIDDEN_UNTIL_KEY) || 0);
    setHidden(Number.isFinite(hiddenUntil) && hiddenUntil > Date.now());
    setVoiceSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(mediaQuery.matches);
    syncMotion();
    mediaQuery.addEventListener("change", syncMotion);

    return () => {
      mediaQuery.removeEventListener("change", syncMotion);
    };
  }, []);

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0].role === "assistant"
        ? [createMessage("assistant", t.aiMascot.initialMessage)]
        : current,
    );
  }, [t.aiMascot.initialMessage]);

  useEffect(() => {
    if (!mounted || hidden || open || sessionStorage.getItem(GREETED_KEY)) return;

    const showTimer = window.setTimeout(() => {
      setNudgeVisible(true);
      sessionStorage.setItem(GREETED_KEY, "true");
    }, 3600);
    const hideTimer = window.setTimeout(() => setNudgeVisible(false), 12000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [hidden, mounted, open]);

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

  function speakAnswer(answer: string) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = lang === "pl" ? "pl-PL" : "en-US";
    utterance.rate = 1;
    utterance.pitch = 1.06;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage(nextInput?: string, options: { speak?: boolean } = {}) {
    const question = (nextInput ?? input).trim();
    if (!question || loading) return;

    const nextMessages = [...messages, createMessage("user", question)];
    const localAction = detectLocalAction(question);
    setMessages(nextMessages);
    setInput("");
    setError("");

    if (localAction) {
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
      if (options.speak && result.answer) {
        speakAnswer(result.answer);
      }
    } catch (caughtError) {
      setMessages((current) => current.slice(0, -1));
      setInput(question);
      setError(caughtError instanceof Error ? caughtError.message : t.aiMascot.errorMessage);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function startVoiceInput() {
    if (!voiceSupported || listening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

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
        void sendMessage(cleanFinal, { speak: true });
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
            className="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full border border-[#d7b46a]/40 bg-[#11110f]/90 px-4 py-3 text-sm text-[#f5dfae] shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-[#d7b46a]/70"
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
            className="fixed bottom-5 right-4 z-[68] md:bottom-8 md:right-8"
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
                    className="absolute bottom-[5.7rem] right-0 w-[min(18rem,calc(100vw-2rem))] rounded-2xl border border-[#d7b46a]/30 bg-[#11110f]/95 px-4 py-3 text-left text-sm leading-6 text-zinc-100 shadow-[0_20px_70px_rgba(0,0,0,0.5)] backdrop-blur-xl md:bottom-[7.2rem]"
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  >
                    {t.aiMascot.greeting}
                  </motion.button>
                ) : null}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => openChat()}
                aria-label={t.aiMascot.openLabel}
                className="group relative h-24 w-24 rounded-full outline-none transition focus-visible:ring-2 focus-visible:ring-[#d7b46a]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:h-32 md:w-32"
              >
                <span className="absolute inset-3 rounded-full bg-[#d7b46a]/20 blur-2xl transition group-hover:bg-[#d7b46a]/35" />
                <span className="absolute inset-0 rounded-full border border-[#d7b46a]/25 bg-[#d7b46a]/5 shadow-[0_20px_70px_rgba(0,0,0,0.42)] backdrop-blur-sm" />
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
            className="fixed bottom-32 right-4 z-[80] flex max-h-[calc(100vh-9rem)] w-[min(28rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.6rem] border border-[#d7b46a]/30 bg-[#0e0e0d]/95 shadow-[0_30px_100px_rgba(0,0,0,0.58)] backdrop-blur-2xl md:bottom-40 md:right-8"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.035] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full border border-[#d7b46a]/35 bg-[#d7b46a]/15 text-[#f5dfae]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.aiMascot.chatTitle}</p>
                  <p className="text-xs text-zinc-400">{listening ? t.aiMascot.listeningLabel : t.aiMascot.chatSubtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={hideMascot}
                  aria-label={t.aiMascot.hideLabel}
                  className="grid h-9 w-9 place-items-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-[#f5dfae]"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.aiMascot.closeLabel}
                  className="grid h-9 w-9 place-items-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={scrollAreaRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.slice(-8).map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] whitespace-pre-line rounded-[1.25rem] px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "ml-auto rounded-br-md bg-[#d7b46a] text-black"
                      : "rounded-bl-md border border-white/10 bg-white/[0.055] text-zinc-100"
                  }`}
                >
                  {message.content}
                </div>
              ))}

              {loading ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-zinc-300">
                  <Loader2 className="h-4 w-4 animate-spin text-[#d7b46a]" />
                  {t.aiMascot.thinkingLabel}
                </div>
              ) : null}

              {booking.step !== "idle" ? renderBookingPanel() : null}

              {error ? (
                <p className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
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
                <div className="flex items-end gap-2 rounded-[1.35rem] border border-white/10 bg-black/35 p-2">
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
                  <Volume2 className="h-3.5 w-3.5 text-[#d7b46a]" />
                  {voiceSupported ? t.aiMascot.voiceHint : t.aiMascot.voiceUnsupported}
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
