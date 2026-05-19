"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Eye, Loader2, Mail, Phone } from "lucide-react";

type RevealTarget = "email" | "phone";

type RevealCopy = {
  title: string;
  description: string;
  emailButton: string;
  phoneButton: string;
  emailLabel: string;
  phoneLabel: string;
  humanCheckLabel: string;
  errorMessage: string;
};

type RevealState = "idle" | "checking" | "error";

type ContactRevealProps = {
  copy: RevealCopy;
};

export function ContactReveal({ copy }: ContactRevealProps) {
  const [activeTarget, setActiveTarget] = useState<RevealTarget | null>(null);
  const [humanCheckTarget, setHumanCheckTarget] = useState<RevealTarget | null>(null);
  const [revealed, setRevealed] = useState<Partial<Record<RevealTarget, string>>>({});
  const [state, setState] = useState<RevealState>("idle");
  const [message, setMessage] = useState("");
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function reveal(target: RevealTarget, turnstileToken = "") {
    setState("checking");
    setMessage("");

    try {
      const response = await fetch("/api/contact/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: target,
          website: "",
          turnstileToken,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        value?: string;
      };

      if (response.status === 403 && turnstileSiteKey && !turnstileToken) {
        setState("idle");
        setActiveTarget(null);
        setHumanCheckTarget(target);
        return;
      }

      if (!response.ok || !payload.value) {
        throw new Error(copy.errorMessage);
      }

      setRevealed((current) => ({ ...current, [target]: payload.value }));
      setState("idle");
      setActiveTarget(null);
      setHumanCheckTarget(null);
    } catch {
      setState("error");
      setActiveTarget(null);
      setMessage(copy.errorMessage);
    }
  }

  function requestReveal(target: RevealTarget) {
    if (revealed[target]) return;
    setActiveTarget(target);
    setHumanCheckTarget(null);
    setMessage("");
    void reveal(target);
  }

  return (
    <div className="rounded-md border border-white/10 bg-white/[0.035] p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg text-white">{copy.title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{copy.description}</p>
        </div>
        <Eye className="mt-1 h-5 w-5 shrink-0 text-[#d7b46a]" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <RevealButton
          icon={<Mail className="h-4 w-4" />}
          label={copy.emailLabel}
          buttonLabel={copy.emailButton}
          value={revealed.email}
          href={revealed.email ? `mailto:${revealed.email}` : undefined}
          loading={state === "checking" && activeTarget === "email"}
          onClick={() => requestReveal("email")}
        />
        <RevealButton
          icon={<Phone className="h-4 w-4" />}
          label={copy.phoneLabel}
          buttonLabel={copy.phoneButton}
          value={revealed.phone}
          href={revealed.phone ? `tel:${revealed.phone.replace(/\s/g, "")}` : undefined}
          loading={state === "checking" && activeTarget === "phone"}
          onClick={() => requestReveal("phone")}
        />
      </div>

      {turnstileSiteKey && humanCheckTarget && !revealed[humanCheckTarget] && (
        <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-3">
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-zinc-500">
            {copy.humanCheckLabel}
          </p>
          <Turnstile
            siteKey={turnstileSiteKey}
            onSuccess={(token) => void reveal(humanCheckTarget, token)}
            onExpire={() => setState("idle")}
            options={{ theme: "dark" }}
          />
        </div>
      )}

      {message && state === "error" && (
        <p className="mt-4 rounded-md border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">
          {message}
        </p>
      )}
    </div>
  );
}

function RevealButton({
  icon,
  label,
  buttonLabel,
  value,
  href,
  loading,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  buttonLabel: string;
  value?: string;
  href?: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
        {icon}
        {label}
      </p>
      {value && href ? (
        <a
          href={href}
          className="mt-2 block break-all text-sm text-[#f5dfae] transition-colors hover:text-white"
        >
          {value}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#d7b46a]/35 bg-[#d7b46a]/10 px-3 py-2.5 text-sm text-[#f5dfae] transition-all hover:border-[#d7b46a]/70 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
