"use client";

import { FormEvent, useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { CalendarDays, Check, Clock3, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  DEFAULT_BOOKING_TIME_ZONE,
  formatBookingDay,
  formatSlotDate,
} from "@/lib/booking";
import type { AvailableBookingDay } from "@/lib/calcom";

type BookingState =
  | "loading-days"
  | "idle"
  | "loading-slots"
  | "booking"
  | "success"
  | "error";

type Slot = {
  start: string;
  label: string;
};

type BookingCopy = {
  title: string;
  timezoneLabel: string;
  chooseDayLabel: string;
  chooseTimeLabel: string;
  bookingNameLabel: string;
  bookingEmailLabel: string;
  bookingCompanyLabel: string;
  bookingMessageLabel: string;
  bookingSubmitLabel: string;
  bookingSendingLabel: string;
  bookingSuccessLabel: string;
  bookingErrorLabel: string;
};

type BookingCalendarProps = {
  copy: BookingCopy;
  locale: "pl-PL" | "en-US";
};

export function BookingCalendar({ copy, locale }: BookingCalendarProps) {
  const [days, setDays] = useState<AvailableBookingDay[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [state, setState] = useState<BookingState>("loading-days");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const timeZone = process.env.NEXT_PUBLIC_CALENDAR_TIMEZONE || DEFAULT_BOOKING_TIME_ZONE;

  useEffect(() => {
    const controller = new AbortController();

    async function loadAvailableDays() {
      setState("loading-days");
      setMessage("");

      try {
        const response = await fetch(
          `/api/booking/available-days?locale=${locale}&limit=12`,
          { signal: controller.signal },
        );
        const payload = (await response.json()) as {
          days?: AvailableBookingDay[];
        };

        if (!response.ok) {
          throw new Error(copy.bookingErrorLabel);
        }

        setDays(payload.days ?? []);
        setState("idle");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setDays([]);
        setState("idle");
      }
    }

    void loadAvailableDays();

    return () => controller.abort();
  }, [copy.bookingErrorLabel, locale]);

  async function selectDay(day: AvailableBookingDay) {
    setSelectedDate(day.date);
    setSelectedSlot(null);
    setSlots([]);
    setMessage("");
    setState("loading-slots");

    try {
      const response = await fetch(`/api/booking/slots?date=${day.date}`);
      const payload = (await response.json()) as {
        slots?: Slot[];
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message || copy.bookingErrorLabel);
      }

      const nextSlots = payload.slots ?? [];

      if (nextSlots.length === 0) {
        setDays((currentDays) => currentDays.filter((item) => item.date !== day.date));
        setSelectedDate("");
        setState("idle");
        return;
      }

      setSlots(nextSlots);
      setState("idle");
    } catch {
      setDays((currentDays) => currentDays.filter((item) => item.date !== day.date));
      setSelectedDate("");
      setSlots([]);
      setState("idle");
    }
  }

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedSlot) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("booking");
    setMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("bookingName"),
          email: formData.get("bookingEmail"),
          company: formData.get("bookingCompany"),
          message: formData.get("bookingMessage"),
          website: formData.get("bookingWebsite"),
          start: selectedSlot.start,
          turnstileToken,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || copy.bookingErrorLabel);
      }

      form.reset();
      setTurnstileToken("");
      setState("success");
      setMessage(copy.bookingSuccessLabel);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : copy.bookingErrorLabel);
    }
  }

  if (state !== "loading-days" && days.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="rounded-md border border-[#d7b46a]/25 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.3)] md:p-5"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.08 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-[1rem] border border-[#f5dfae]/45 bg-[#d7b46a]/25 text-[#f9e7b9] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_14px_34px_rgba(215,180,106,0.18)]">
          <CalendarDays className="h-5 w-5" />
          <span className="absolute left-2.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#fff4cf]" />
          <span className="absolute right-2.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#fff4cf]" />
        </div>
        <p className="text-sm uppercase tracking-[0.18em] text-[#f5dfae]">
          {copy.title}
        </p>
      </div>

      <div className="mt-5">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
          {copy.chooseDayLabel}
        </div>

        {state === "loading-days" ? (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="min-h-[76px] animate-pulse rounded-md border border-white/10 bg-white/[0.04]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {days.map((day) => {
              const formattedDay = formatBookingDay(day.date, { locale, timeZone });

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => void selectDay(day)}
                  aria-label={`${copy.chooseDayLabel}: ${day.date}`}
                  className={[
                    "min-h-[76px] rounded-md border p-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b46a]/70",
                    selectedDate === day.date
                      ? "border-[#d7b46a] bg-[#d7b46a]/18 text-white shadow-[0_14px_34px_rgba(215,180,106,0.12)]"
                      : "border-white/10 bg-black/20 text-zinc-200 hover:border-[#d7b46a]/45 hover:bg-white/[0.055]",
                  ].join(" ")}
                >
                  <span className="block text-[0.65rem] uppercase tracking-[0.14em]">
                    {formattedDay.weekday}
                  </span>
                  <span className="mt-1 block text-xl leading-none">{formattedDay.day}</span>
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.11em] text-zinc-500">
                    {formattedDay.month}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedDate && (
        <div className="mt-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <Clock3 className="h-4 w-4 text-[#d7b46a]" />
              {copy.chooseTimeLabel}
            </div>
            <p className="text-xs text-zinc-500">{copy.timezoneLabel}</p>
          </div>

          {state === "loading-slots" ? (
            <div className="flex min-h-[84px] items-center justify-center rounded-md border border-white/10 bg-black/20 text-sm text-zinc-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {copy.bookingSendingLabel}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {slots.map((slot) => (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() => {
                    setSelectedSlot(slot);
                    setMessage("");
                    setState("idle");
                  }}
                  className={[
                    "rounded-md border px-3 py-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b46a]/70",
                    selectedSlot?.start === slot.start
                      ? "border-[#d7b46a] bg-[#d7b46a] text-black"
                      : "border-white/10 bg-black/20 text-zinc-100 hover:border-[#d7b46a]/45",
                  ].join(" ")}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedSlot && state !== "success" && (
        <form onSubmit={handleBooking} className="mt-6 rounded-md border border-white/10 bg-black/20 p-4">
          <p className="mb-4 text-sm text-zinc-300">
            {formatSlotDate(selectedSlot.start, timeZone, locale)} ·{" "}
            <span className="text-[#f5dfae]">{selectedSlot.label}</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-zinc-200">
              {copy.bookingNameLabel}
              <input
                name="bookingName"
                required
                minLength={2}
                className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-[#d7b46a]/70"
              />
            </label>
            <label className="grid gap-2 text-sm text-zinc-200">
              {copy.bookingEmailLabel}
              <input
                name="bookingEmail"
                required
                type="email"
                className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-[#d7b46a]/70"
              />
            </label>
          </div>
          <label className="mt-3 grid gap-2 text-sm text-zinc-200">
            {copy.bookingCompanyLabel}
            <input
              name="bookingCompany"
              className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-[#d7b46a]/70"
            />
          </label>
          <label className="mt-3 grid gap-2 text-sm text-zinc-200">
            {copy.bookingMessageLabel}
            <textarea
              name="bookingMessage"
              rows={3}
              className="resize-none rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm leading-6 text-white outline-none transition-colors focus:border-[#d7b46a]/70"
            />
          </label>
          <input
            type="text"
            name="bookingWebsite"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {turnstileSiteKey && (
            <div className="mt-4">
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
            disabled={state === "booking"}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#d7b46a] px-5 py-3 text-sm text-black transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state === "booking" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {copy.bookingSendingLabel}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {copy.bookingSubmitLabel}
              </>
            )}
          </button>
        </form>
      )}

      {message && state !== "loading-slots" && (
        <p
          className={[
            "mt-4 rounded-md border p-3 text-sm",
            state === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/20 bg-red-400/10 text-red-100",
          ].join(" ")}
        >
          {message}
        </p>
      )}
    </motion.div>
  );
}
