"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Turnstile } from "@marsidev/react-turnstile";
import { Github, Linkedin, Loader2, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookingCalendar } from "@/components/BookingCalendar";
import { ContactReveal } from "@/components/ContactReveal";

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
      className="relative overflow-hidden border-t border-white/10 bg-[#090908] px-5 py-14 md:px-8 lg:min-h-[calc(100svh-5rem)] lg:py-16"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7b46a]/60 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.86fr_1.14fr] xl:items-center">
        <motion.div
          className="relative min-h-[420px] overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_44%_22%,rgba(215,180,106,0.18),transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))]"
          initial={{ opacity: 0, x: -44 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute left-6 top-6 z-20 rounded-[1.35rem] rounded-bl-md border border-white/20 bg-white/90 px-4 py-2.5 text-sm text-zinc-950 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur">
            {t.contact.booking.title}
            <span className="absolute -bottom-2 left-5 h-4 w-4 rotate-45 border-b border-r border-white/20 bg-white/90" />
          </div>

          <motion.div
            className="absolute inset-x-0 bottom-0 z-10"
            animate={{ x: [-7, 7, -7] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/profile-1-cutout.png"
              alt={t.hero.imageAlt}
              width={1122}
              height={1402}
              className="mx-auto h-auto max-h-[560px] w-auto max-w-full object-contain object-bottom pt-8 drop-shadow-[0_28px_70px_rgba(0,0,0,0.48)]"
            />
          </motion.div>

          <div className="absolute inset-x-8 bottom-5 z-0 h-px bg-gradient-to-r from-transparent via-[#d7b46a]/80 to-transparent shadow-[0_0_28px_rgba(215,180,106,0.45)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-[#d7b46a]">
              {t.nav.contact}
            </p>
            <h2 className="mt-4 text-4xl leading-tight text-white md:text-5xl">
              {t.contact.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-zinc-300">
              {t.contact.description}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-zinc-300">
              <MapPin className="h-4 w-4 text-[#d7b46a]" />
              {t.contact.location}
            </span>
            <a
              href={t.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-[#d7b46a]/45 hover:text-white"
            >
              <Github className="h-4 w-4 text-[#d7b46a]" />
              {t.contact.githubCta}
            </a>
            <a
              href={t.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-[#d7b46a]/45 hover:text-white"
            >
              <Linkedin className="h-4 w-4 text-[#d7b46a]" />
              {t.contact.linkedinCta}
            </a>
          </div>

          <div className="mt-6 grid gap-5">
            <BookingCalendar
              copy={t.contact.booking}
              locale={lang === "pl" ? "pl-PL" : "en-US"}
            />
            <ContactReveal copy={t.contact.reveal} />

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
                  rows={5}
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
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-sm text-zinc-500">
        {t.contact.copyright}
      </div>
    </section>
  );
}
