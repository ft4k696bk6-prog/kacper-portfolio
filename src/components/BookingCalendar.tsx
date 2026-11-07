"use client";

import { FormEvent, useEffect, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { ArrowLeft, CalendarDays, Check, Clock3, Loader2 } from "lucide-react";
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
  backToDaysLabel: string;
  selectedDayLabel: string;
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
  const selectedDayLabel = selectedDate
    ? formatSlotDate(`${selectedDate}T12:00:00.000Z`, timeZone, locale)
    : "";

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

  function backToDays() {
    setSelectedDate("");
    setSelectedSlot(null);
    setSlots([]);
    setMessage("");
    setState("idle");
    setTurnstileToken("");
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
          bookingTrap: formData.get("bookingAntiSpam"),
          start: selectedSlot.start,
          turnstileToken,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        booking?: { start?: string };
        message?: string;
      };

      if (!response.ok || !payload.booking?.start) {
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
      className="ui-panel rounded-md p-4 md:p-5"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.08 }}
    >
      <div className="flex items-center gap-3">
        <div className="ui-icon grid h-11 w-11 shrink-0 place-items-center rounded-md">
          <CalendarDays className="h-5 w-5" />
        </div>
        <p className="text-sm uppercase tracking-[0.18em] text-white">
          {copy.title}
        </p>
      </div>

      <div className="mt-5">
        {state === "loading-days" ? (
          <>
            <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/70">
              {copy.chooseDayLabel}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="min-h-[76px] animate-pulse rounded-md border border-white/10 bg-[var(--brand-black)]"
                />
              ))}
            </div>
          </>
        ) : !selectedDate ? (
          <>
            <div className="mb-3 text-xs uppercase tracking-[0.18em] text-white/70">
              {copy.chooseDayLabel}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {days.map((day) => {
                const formattedDay = formatBookingDay(day.date, { locale, timeZone });

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => void selectDay(day)}
                    aria-label={`${copy.chooseDayLabel}: ${day.date}`}
                    className="glass-action min-h-[76px] rounded-md border border-white/10 bg-black/20 p-2 text-left text-white transition-all hover:border-[var(--brand-accent)] hover:bg-[var(--brand-black)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
                  >
                    <span className="block text-[0.65rem] uppercase tracking-[0.14em]">
                      {formattedDay.weekday}
                    </span>
                    <span className="mt-1 block text-xl leading-none">{formattedDay.day}</span>
                    <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.11em] text-white/70">
                      {formattedDay.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-black/20 p-3">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/70">
                  {copy.selectedDayLabel}
                </p>
                <p className="mt-1 text-base text-white">{selectedDayLabel}</p>
              </div>
              <button
                type="button"
                onClick={backToDays}
                className="glass-action inline-flex items-center gap-2 rounded-md border border-white/10 bg-[var(--brand-black)] px-3 py-2 text-sm text-white transition-colors hover:border-[var(--brand-accent)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
              >
                <ArrowLeft className="h-4 w-4 text-white" />
                {copy.backToDaysLabel}
              </button>
            </div>

            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/70">
                <Clock3 className="h-4 w-4 text-white" />
                {copy.chooseTimeLabel}
              </div>
              <p className="text-xs text-white/70">{copy.timezoneLabel}</p>
            </div>

            {state === "loading-slots" ? (
              <div className="flex min-h-[120px] items-center justify-center rounded-md border border-white/10 bg-black/20 text-sm text-white/70">
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
                      "rounded-md border px-3 py-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]",
                      selectedSlot?.start === slot.start
                        ? "brand-action"
                        : "border-white/10 bg-black/20 text-white hover:border-[var(--brand-accent)]",
                    ].join(" ")}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selectedSlot && state !== "success" && (
        <form onSubmit={handleBooking} className="mt-6 rounded-md border border-white/10 bg-black/20 p-4">
          <p className="mb-4 text-sm text-white">
            {formatSlotDate(selectedSlot.start, timeZone, locale)} ·{" "}
            <span className="text-white">{selectedSlot.label}</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-white">
              {copy.bookingNameLabel}
              <input
                name="bookingName"
                required
                minLength={2}
                className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-[var(--brand-accent)]"
              />
            </label>
            <label className="grid gap-2 text-sm text-white">
              {copy.bookingEmailLabel}
              <input
                name="bookingEmail"
                required
                type="email"
                className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-[var(--brand-accent)]"
              />
            </label>
          </div>
          <label className="mt-3 grid gap-2 text-sm text-white">
            {copy.bookingCompanyLabel}
            <input
              name="bookingCompany"
              className="rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm text-white outline-none transition-colors focus:border-[var(--brand-accent)]"
            />
          </label>
          <label className="mt-3 grid gap-2 text-sm text-white">
            {copy.bookingMessageLabel}
            <textarea
              name="bookingMessage"
              rows={3}
              className="resize-none rounded-md border border-white/10 bg-black/35 px-3 py-3 text-sm leading-6 text-white outline-none transition-colors focus:border-[var(--brand-accent)]"
            />
          </label>
          <input
            type="text"
            name="bookingAntiSpam"
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
            className="brand-action glass-action mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md  px-5 py-3 text-sm text-black transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
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
              ? "border-[var(--brand-accent)] bg-[var(--brand-black)] text-white"
              : "border-white/40 bg-[var(--brand-black)] text-white",
          ].join(" ")}
        >
          {message}
        </p>
      )}
    </motion.div>
  );
}
