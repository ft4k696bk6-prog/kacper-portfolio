"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TerminalToast } from "@/components/ui/terminal-toast";
import { Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEND_CONTACT_MESSAGE_MUTATION } from "@/lib/graphql/operations";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  // Honeypot — must stay empty
  companyWebsite: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SendResult = {
  sendContactMessage: { ok: boolean; message?: string | null };
};

type CalGlobal = ((...args: unknown[]) => void) & {
  q?: unknown[][];
  ns?: Record<string, CalGlobal>;
  loaded?: boolean;
};

declare global {
  interface Window {
    Cal?: CalGlobal;
  }
}

export function ContactForm({ open, onOpenChange }: ContactFormProps) {
  const { t } = useLanguage();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [calReady, setCalReady] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const calContainerRef = useRef<HTMLDivElement>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      companyWebsite: "",
    },
  });

  const handleEmailBlur = useCallback(
    (email: string) => {
      if (!email || form.getValues("name")) return;
      const local = email.split("@")[0];
      const name = local
        .split(/[._\-+]/)
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(" ");
      if (name.length >= 2) form.setValue("name", name);
    },
    [form]
  );

  const [sendMessage, { loading }] = useMutation<SendResult>(
    SEND_CONTACT_MESSAGE_MUTATION
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.Cal) {
      ((C: Window, A: string, L: string) => {
        const p = (a: CalGlobal, ar: unknown[]) => {
          a.q = a.q ?? [];
          a.q.push(ar);
        };

        const d = C.document;

        C.Cal = C.Cal || (((...ar: unknown[]) => {
          const cal = C.Cal as CalGlobal;

          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            const script = d.createElement("script");
            script.src = A;
            script.async = true;
            d.head.appendChild(script);
            cal.loaded = true;
          }

          if (ar[0] === L) {
            const api: CalGlobal = ((...inner: unknown[]) => p(api, inner)) as CalGlobal;
            api.q = api.q || [];

            const namespace = ar[1];
            if (typeof namespace === "string") {
              cal.ns = cal.ns || {};
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }

          p(cal, ar);
        }) as CalGlobal);
      })(window, "https://cal.sagan.dev/embed/embed.js", "init");
    }

    window.Cal?.("init", "sagan-short", { origin: "https://cal.sagan.dev" });
    setCalReady(true);
  }, []);

  useEffect(() => {
    if (!open || !calReady || !window.Cal || !calContainerRef.current) return;

    const container = calContainerRef.current;
    container.innerHTML = "";

    const calInline = document.createElement("cal-inline");
    calInline.setAttribute("data-cal-link", "michal/short");
    calInline.setAttribute("data-cal-origin", "https://cal.sagan.dev");
    calInline.setAttribute("data-theme", "dark");
    calInline.setAttribute("data-layout", "month_view");
    calInline.style.display = "block";
    calInline.style.width = "100%";
    calInline.style.minHeight = "650px";

    container.appendChild(calInline);

    return () => {
      container.innerHTML = "";
    };
  }, [open, calReady]);

  async function onSubmit(values: FormValues) {
    if (!turnstileToken) return;

    try {
      const { data } = await sendMessage({
        variables: {
          input: {
            name: values.name,
            email: values.email,
            message: values.message,
            companyWebsite: values.companyWebsite ?? "",
            turnstileToken,
          },
        },
      });

      const result = data?.sendContactMessage;

      if (result?.ok) {
        window.dataLayer?.push({
          event: "contact_form_submitted",
          form_status: "success",
        });
        form.reset();
        handleOpenChange(false);
        setToastMessage(result.message ?? t.contact.formSuccess);
        setToastVisible(true);
      } else {
        setSubmitStatus("error");
        setServerMessage(result?.message ?? t.contact.formError);
        window.dataLayer?.push({
          event: "contact_form_error",
          error_message: result?.message,
        });
        turnstileRef.current?.reset();
        setTurnstileToken(null);
      }
    } catch {
      setSubmitStatus("error");
      setServerMessage(t.contact.formError);
      window.dataLayer?.push({
        event: "contact_form_error",
        error_message: "network_error",
      });
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      setSubmitStatus("idle");
      setServerMessage("");
    }
    onOpenChange(value);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[96vw] max-w-[96vw] bg-slate-900 border-slate-700 text-white">
          <DialogHeader className="sr-only">
            <DialogTitle>{t.contact.formTitle}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <aside className="order-1 lg:order-2 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <h3 className="text-xl text-white">{t.contact.scheduleTitle}</h3>
              <p className="mt-3 text-slate-300 leading-relaxed">
                {t.contact.scheduleDescription}
              </p>
              <div className="mt-5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
                <p className="text-sm text-cyan-100">{t.contact.scheduleSlotInfo}</p>
              </div>
              <div
                ref={calContainerRef}
                className="mt-5 w-full min-h-[650px] rounded-lg overflow-hidden bg-slate-950/70"
              />
              <div className="mt-5">
                <a
                  href="https://cal.sagan.dev/michal/short"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-cyan-500/40"
                >
                  {t.contact.scheduleFallbackLink}
                </a>
              </div>
            </aside>

            <div className="order-2 lg:order-1 rounded-xl border border-slate-700 bg-slate-800/40 p-4">
              <h3 className="text-xl text-white">{t.contact.formTitle}</h3>
              <p className="text-sm text-slate-400 mt-2 mb-4">
                Or reach me at{" "}
                <a
                  href="mailto:michal@sagan.dev"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  michal@sagan.dev
                </a>
              </p>

              <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
              {/* Honeypot — hidden from real users */}
              <div className="hidden" aria-hidden="true">
                <FormField
                  control={form.control}
                  name="companyWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      {t.contact.formEmail}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t.contact.formEmailPlaceholder}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        autoFocus
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          handleEmailBlur(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      {t.contact.formName}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.contact.formNamePlaceholder}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">
                      {t.contact.formMessage}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.contact.formMessagePlaceholder}
                        rows={12}
                        className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500 resize-y min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {siteKey && (
                <div className="flex justify-center">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={siteKey}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => setTurnstileToken(null)}
                    options={{ theme: "dark" }}
                    scriptOptions={{ appendTo: "head" }}
                  />
                </div>
              )}

              {submitStatus === "error" && serverMessage && (
                <div className="text-sm text-red-400 text-center space-y-1">
                  <p>{serverMessage}</p>
                  <p>
                    <a
                      href="mailto:michal@sagan.dev?bcc=m+resend-issue@sagan.dev"
                      className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                    >
                      Send directly via email →
                    </a>
                  </p>
                </div>
              )}

                <div className="flex justify-start">
                  <Button
                    type="submit"
                    disabled={loading || (!!siteKey && !turnstileToken)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 text-white px-8 py-6 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? t.contact.formSending : t.contact.formSubmit}
                  </Button>
                </div>
              </form>
              </Form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TerminalToast
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
        type="success"
        message={toastMessage}
      />
    </>
  );
}
