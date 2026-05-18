"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Turnstile } from "@marsidev/react-turnstile";
import { Github, Linkedin, Loader2, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookingCalendar } from "@/components/BookingCalendar";

type SubmitState = "idle" | "sending" | "success" | "error";

export function Contact() {
  const { lang, t } = useLanguage();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          message: formData.get("message"),
          website: formData.get("website"),
          turnstileToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      form.reset();
      setTurnstileToken("");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/10 bg-[#090908] px-5 py-24 md:px-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7b46a]/60 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
            {t.nav.contact}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl leading-tight text-white md:text-5xl">
            {t.contact.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300">
            {t.contact.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-4">
              <MapPin className="h-5 w-5 text-[#d7b46a]" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {t.contact.locationLabel}
                </p>
                <p className="mt-1 text-sm text-zinc-100">{t.contact.location}</p>
              </div>
            </div>
            <a
              href={t.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-[#d7b46a]/45"
            >
              <Github className="h-5 w-5 text-[#d7b46a]" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {t.contact.githubLabel}
                </p>
                <p className="mt-1 text-sm text-zinc-100">ft4k696bk6-prog</p>
              </div>
            </a>
            <a
              href={t.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-[#d7b46a]/45"
            >
              <Linkedin className="h-5 w-5 text-[#d7b46a]" />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {t.contact.linkedinLabel}
                </p>
                <p className="mt-1 text-sm text-zinc-100">kacper-bernecki</p>
              </div>
            </a>
          </div>

          <div className="mt-6">
            <BookingCalendar
              copy={t.contact.booking}
              locale={lang === "pl" ? "pl-PL" : "en-US"}
            />
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-6 hidden overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_50%_70%,rgba(215,180,106,0.12),transparent_40%),rgba(255,255,255,0.035)] lg:block">
            <motion.div
              animate={{ x: [-6, 6, -6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/profile-1-cutout.png"
                alt={t.hero.imageAlt}
                width={1122}
                height={1402}
                className="relative z-0 mx-auto h-auto max-h-[420px] w-auto max-w-full object-contain object-bottom pt-4 drop-shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
              />
            </motion.div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-md border border-white/10 bg-white/[0.035] p-5 md:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-zinc-200">
                {t.contact.nameLabel}
                <input
                  name="name"
                  required
                  minLength={2}
                  className="rounded-md border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#d7b46a]/70"
                />
              </label>
              <label className="grid gap-2 text-sm text-zinc-200">
                {t.contact.emailLabel}
                <input
                  name="email"
                  required
                  type="email"
                  className="rounded-md border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#d7b46a]/70"
                />
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm text-zinc-200">
              {t.contact.companyLabel}
              <input
                name="company"
                className="rounded-md border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#d7b46a]/70"
              />
            </label>

            <label className="mt-4 grid gap-2 text-sm text-zinc-200">
              {t.contact.messageLabel}
              <textarea
                name="message"
                required
                minLength={20}
                rows={6}
                className="resize-none rounded-md border border-white/10 bg-black/30 px-3 py-3 text-sm leading-7 text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-[#d7b46a]/70"
              />
            </label>

            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {turnstileSiteKey && (
              <div className="mt-5">
                <Turnstile
                  siteKey={turnstileSiteKey}
                  onSuccess={setTurnstileToken}
                  onExpire={() => setTurnstileToken("")}
                  options={{ theme: "dark" }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitState === "sending"}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#d7b46a] px-5 py-3 text-sm text-black transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitState === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.contact.sendingLabel}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t.contact.submitLabel}
                </>
              )}
            </button>

            {submitState === "success" && (
              <p className="mt-4 rounded-md border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                {t.contact.successMessage}
              </p>
            )}
            {submitState === "error" && (
              <p className="mt-4 rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">
                {t.contact.errorMessage}
              </p>
            )}

            <p className="mt-5 text-xs leading-6 text-zinc-500">
              {t.contact.privacyNote}
            </p>
          </form>
        </motion.div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-white/10 pt-6 text-sm text-zinc-500">
        {t.contact.copyright}
      </div>
    </section>
  );
}
