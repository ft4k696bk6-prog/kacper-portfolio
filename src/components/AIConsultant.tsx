"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
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
      <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
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
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {t.aiConsultant.prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                disabled={loading}
                className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm leading-6 text-zinc-200 transition hover:border-[#d7b46a]/50 hover:bg-[#d7b46a]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {prompt}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-md border border-[#d7b46a]/25 bg-[#11110f]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-5"
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#d7b46a]/35 bg-[#d7b46a]/15 text-[#f5dfae]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#d7b46a]">
                {t.aiConsultant.panelTitle}
              </p>
              <p className="mt-1 text-sm text-zinc-400">{t.aiConsultant.panelSubtitle}</p>
            </div>
          </div>

          <div className="mt-5 flex max-h-[380px] min-h-[280px] flex-col gap-3 overflow-y-auto pr-1">
            {visibleMessages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                className={`max-w-[92%] rounded-md border px-4 py-3 text-sm leading-7 ${
                  message.role === "user"
                    ? "ml-auto border-[#d7b46a]/35 bg-[#d7b46a]/15 text-[#f8e5b5]"
                    : "border-white/10 bg-black/25 text-zinc-300"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="inline-flex max-w-max items-center gap-2 rounded-md border border-white/10 bg-black/25 px-4 py-3 text-sm text-zinc-300">
                <Loader2 className="h-4 w-4 animate-spin text-[#d7b46a]" />
                {t.aiConsultant.loadingLabel}
              </div>
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
          </form>
        </motion.div>
      </div>
    </section>
  );
}
