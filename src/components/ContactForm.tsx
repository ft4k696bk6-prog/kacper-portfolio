"use client";

import { useRef, useState, useCallback } from "react";
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

export function ContactForm({ open, onOpenChange }: ContactFormProps) {
  const { t } = useLanguage();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance>(null);

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
        setSubmitStatus("success");
        setServerMessage(result.message ?? t.contact.formSuccess);
        window.dataLayer?.push({
          event: "contact_form_submitted",
          form_status: "success",
        });
        form.reset();
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {t.contact.formTitle}
          </DialogTitle>
          <p className="text-sm text-slate-400 mt-2">
            Or reach me at{" "}
            <a
              href="mailto:michal@sagan.dev"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              michal@sagan.dev
            </a>
          </p>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="py-8 text-center space-y-4">
            <p className="text-cyan-400 text-lg">{serverMessage}</p>
            <Button
              onClick={() => handleOpenChange(false)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Close
            </Button>
          </div>
        ) : (
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
                  />
                </div>
              )}

              {submitStatus === "error" && serverMessage && (
                <p className="text-sm text-red-400 text-center">
                  {serverMessage}
                </p>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
