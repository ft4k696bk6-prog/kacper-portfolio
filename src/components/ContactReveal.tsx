"use client";

import { DustReveal } from "@/components/DustReveal";
import { trackContactInteraction } from "@/lib/lead-analytics";
import { useState } from "react";
import type { ReactNode } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Loader2, Mail, Phone } from "lucide-react";

type RevealTarget = "email" | "phone";

type RevealCopy = {
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
  plain?: boolean;
};

export function ContactReveal({ copy, plain = false }: ContactRevealProps) {
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
      trackContactInteraction("reveal", target);
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
    <div className="contact-reveal-pair">
      <div className="contact-reveal-grid">
        <RevealButton
          plain={plain}
          target="phone"
          icon={<Phone aria-hidden="true" />}
          label={copy.phoneLabel}
          buttonLabel={copy.phoneButton}
          value={revealed.phone}
          href={revealed.phone ? `tel:${revealed.phone.replace(/\s/g, "")}` : undefined}
          loading={state === "checking" && activeTarget === "phone"}
          onClick={() => requestReveal("phone")}
        />
        <RevealButton
          plain={plain}
          target="email"
          icon={<Mail aria-hidden="true" />}
          label={copy.emailLabel}
          buttonLabel={copy.emailButton}
          value={revealed.email}
          href={revealed.email ? `mailto:${revealed.email}` : undefined}
          loading={state === "checking" && activeTarget === "email"}
          onClick={() => requestReveal("email")}
        />
      </div>

      {turnstileSiteKey && humanCheckTarget && !revealed[humanCheckTarget] && (
        <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-3">
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-white/70">
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
        <p className="mt-4 rounded-md border border-[var(--brand-accent)] bg-[var(--brand-black)] p-3 text-sm text-white">
          {message}
        </p>
      )}
    </div>
  );
}

function RevealButton({
  plain,
  target,
  icon,
  label,
  buttonLabel,
  value,
  href,
  loading,
  onClick,
}: {
  plain: boolean;
  target: "phone" | "email";
  icon: ReactNode;
  label: string;
  buttonLabel: string;
  value?: string;
  href?: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="contact-reveal-card">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/70">
        {icon}
        {label}
      </p>
      {value && href ? (
        <a
          href={href}
          onClick={() => trackContactInteraction("click", target)}
          className="contact-revealed-value"
        >
          {!plain && <DustReveal text={value}/>}<span>{value}</span>
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={loading}
          className={"contact-reveal-button" + (plain ? "" : " contact-icon-trigger")}
          aria-label={buttonLabel}
        >
          {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : icon}
          <span className={plain ? undefined : "sr-only"}>{buttonLabel}</span>
        </button>
      )}
    </div>
  );
}
