"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, Code2, Loader2, MessageCircle, Send, Sparkles, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function AIConsultant() {
  const { lang, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: t.aiConsultant.initialMessage },
  ]);
  const [input, setInput] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0].role === "assistant"
        ? [{ role: "assistant", content: t.aiConsultant.initialMessage }]
        : current,
    );
  }, [t.aiConsultant.initialMessage]);

  const visibleMessages = useMemo(() => messages.slice(-5), [messages]);

  async function sendMessage(nextInput?: string) {
    const question = (nextInput ?? input).trim();
    if (!question || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: lang,
          website,
          messages: nextMessages
            .filter((message, index) => !(index === 0 && message.role === "assistant"))
            .slice(-8),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { answer?: string; message?: string }
        | null;

      if (!response.ok || !result?.answer) {
        throw new Error(result?.message || t.aiConsultant.errorMessage);
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: result.answer ?? t.aiConsultant.errorMessage },
      ]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t.aiConsultant.errorMessage);
      setMessages((current) => current.slice(0, -1));
      setInput(question);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  return (
    <section
      id="ai-consultant"
      className="relative overflow-hidden border-t border-white/10 bg-[#070707] px-5 py-24 md:px-8"
    >
      <div className="absolute left-[-12rem] top-16 h-80 w-80 bg-[#d7b46a]/10 blur-3xl" />
      <div className="absolute right-[-10rem] bottom-10 h-72 w-72 bg-[#f5dfae]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(215,180,106,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(215,180,106,0.12)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-md border border-[#d7b46a]/25 bg-[#d7b46a]/10 px-3 py-2 text-xs uppercase tracking-[0.22em] text-[#f5dfae]">
            <Sparkles className="h-4 w-4" />
            {t.aiConsultant.eyebrow}
          </div>
          <h2 className="mt-5 text-4xl leading-tight text-white md:text-5xl">
            {t.aiConsultant.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300">
            {t.aiConsultant.description}
          </p>
          <div className="mt-6 grid max-w-xl gap-3 sm:grid-cols-3">
            {t.aiConsultant.badges.map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-xs uppercase tracking-[0.16em] text-zinc-300"
              >
                {badge}
              </motion.div>
            ))}
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {t.aiConsultant.prompts.map((prompt, index) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={loading}
                className="group rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm leading-6 text-zinc-200 transition hover:-translate-y-0.5 hover:border-[#d7b46a]/50 hover:bg-[#d7b46a]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="mb-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#d7b46a]/25 bg-[#d7b46a]/10 text-[11px] text-[#f5dfae] transition group-hover:border-[#d7b46a]/60">
                  {index + 1}
                </span>
                <span className="block">{prompt}</span>
              </button>
            ))}
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500">
            {t.aiConsultant.safetyNote}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-md border border-[#d7b46a]/25 bg-[#11110f]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-5"
        >
          <motion.div
            className="pointer-events-none absolute right-6 top-6 h-28 w-28 rounded-full bg-[#d7b46a]/10 blur-2xl"
            animate={{ scale: [1, 1.16, 1], opacity: [0.45, 0.78, 0.45] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-md border border-[#d7b46a]/35 bg-[#d7b46a]/15 text-[#f5dfae] shadow-[0_0_28px_rgba(215,180,106,0.18)]"
                animate={{ y: [0, -4, 0], rotate: [0, 1.2, 0] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot className="h-5 w-5" />
              </motion.div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#d7b46a]">
                  {t.aiConsultant.panelTitle}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{t.aiConsultant.panelSubtitle}</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
              {t.aiConsultant.statusLabel}
            </div>
          </div>

          <div className="relative mt-5 flex max-h-[410px] min-h-[310px] flex-col gap-3 overflow-y-auto pr-1">
            {visibleMessages.map((message, index) => (
              <motion.div
                key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.22 }}
                className={`max-w-[92%] whitespace-pre-line rounded-md border px-4 py-3 text-sm leading-7 ${
                  message.role === "user"
                    ? "ml-auto border-[#d7b46a]/35 bg-[#d7b46a]/15 text-[#f8e5b5]"
                    : "border-white/10 bg-black/25 text-zinc-300 shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                }`}
              >
                {message.content}
              </motion.div>
            ))}
            {loading ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex max-w-max items-center gap-3 rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-300"
              >
                <span className="flex gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-2 w-2 rounded-full bg-[#d7b46a]"
                      animate={{ y: [0, -5, 0], opacity: [0.45, 1, 0.45] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: dot * 0.12,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </span>
                {t.aiConsultant.loadingLabel}
              </motion.div>
            ) : null}
          </div>

          {error ? (
            <p className="mt-4 rounded-md border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-5">
            <label htmlFor="ai-consultant-message" className="sr-only">
              {t.aiConsultant.inputLabel}
            </label>
            <input
              type="text"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                ref={inputRef}
                id="ai-consultant-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder={t.aiConsultant.placeholder}
                rows={2}
                maxLength={900}
                className="min-h-[58px] flex-1 resize-none rounded-md border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-[#d7b46a]/70"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="inline-flex min-h-[58px] items-center justify-center gap-2 rounded-md bg-[#d7b46a] px-5 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {t.aiConsultant.sendLabel}
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2 text-xs leading-5 text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-[#d7b46a]" />
                {t.aiConsultant.codeHelpLabel}
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-[#d7b46a]" />
                {t.aiConsultant.enterHint}
              </span>
            </div>
          </form>
          <div className="pointer-events-none absolute bottom-4 right-4 hidden text-[#d7b46a]/15 md:block">
            <WandSparkles className="h-16 w-16" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
