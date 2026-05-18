"use client";

import { FormEvent, useMemo, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { CalendarCheck2, CalendarDays, Check, Clock3, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  DEFAULT_BOOKING_TIME_ZONE,
  formatSlotDate,
  getBookingDays,
  type BookingDay,
} from "@/lib/booking";

type BookingState = "idle" | "loading-slots" | "booking" | "success" | "error";

type Slot = {
  start: string;
  label: string;
};

type BookingCopy = {
  title: string;
  description: string;
  meetLabel: string;
  timezoneLabel: string;
  chooseDayLabel: string;
  chooseTimeLabel: string;
  unavailableLabel: string;
  noSlotsLabel: string;
  bookingNameLabel: string;
  bookingEmailLabel: string;
  bookingCompanyLabel: string;
  bookingMessageLabel: string;
  bookingSubmitLabel: string;
  bookingSendingLabel: string;
  bookingSuccessLabel: string;
  bookingErrorLabel: string;
  configErrorLabel: string;
  blockedWeekendLabel: string;
  blockedMondayLabel: string;
  blockedVacationLabel: string;
};

type BookingCalendarProps = {
  copy: BookingCopy;
  locale: "pl-PL" | "en-US";
};

function disabledLabel(day: BookingDay, copy: BookingCopy) {
  if (day.reason === "vacation") return copy.blockedVacationLabel;
  if (day.reason === "monday") return copy.blockedMondayLabel;
  if (day.reason === "weekend") return copy.blockedWeekendLabel;
  return copy.unavailableLabel;
}

export function BookingCalendar({ copy, locale }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [state, setState] = useState<BookingState>("idle");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const timeZone = process.env.NEXT_PUBLIC_CALENDAR_TIMEZONE || DEFAULT_BOOKING_TIME_ZONE;
  const days = useMemo(() => getBookingDays({ locale, timeZone }), [locale, timeZone]);

  async function selectDay(day: BookingDay) {
    if (day.blocked) return;

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
        throw new Error(
          response.status === 503
            ? copy.configErrorLabel
            : payload.message || copy.bookingErrorLabel,
        );
      }

      setSlots(payload.slots ?? []);
      setState("idle");
    } catch (error) {
      setSlots([]);
      setState("error");
      setMessage(error instanceof Error ? error.message : copy.bookingErrorLabel);
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
        throw new Error(
          response.status === 503
            ? copy.configErrorLabel
            : payload.message || copy.bookingErrorLabel,
        );
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

  return (
    <motion.div
      className="rounded-md border border-[#d7b46a]/25 bg-[linear-gradient(145deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.08 }}
    >
      <div className="flex items-start gap-4">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-[1.05rem] border border-[#f5dfae]/45 bg-[#d7b46a]/25 text-[#f9e7b9] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_14px_34px_rgba(215,180,106,0.18)]">
          <CalendarDays className="h-5 w-5" />
          <span className="absolute left-3 top-1.5 h-1.5 w-1.5 rounded-full bg-[#fff4cf]" />
          <span className="absolute right-3 top-1.5 h-1.5 w-1.5 rounded-full bg-[#fff4cf]" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#f5dfae]">
            {copy.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{copy.description}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
          <CalendarCheck2 className="h-4 w-4 text-[#d7b46a]" />
          {copy.chooseDayLabel}
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-7">
          {days.map((day) => (
            <button
              key={day.date}
              type="button"
              disabled={day.blocked}
              onClick={() => void selectDay(day)}
              aria-label={
                day.blocked
                  ? `${day.date}: ${disabledLabel(day, copy)}`
                  : `${copy.chooseDayLabel}: ${day.date}`
              }
              className={[
                "min-h-[74px] rounded-md border p-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b46a]/70",
                selectedDate === day.date
                  ? "border-[#d7b46a] bg-[#d7b46a]/18 text-white shadow-[0_14px_34px_rgba(215,180,106,0.12)]"
                  : "border-white/10 bg-black/20 text-zinc-200 hover:border-[#d7b46a]/45 hover:bg-white/[0.055]",
                day.blocked
                  ? "cursor-not-allowed border-white/5 bg-white/[0.025] text-zinc-600 hover:border-white/5 hover:bg-white/[0.025]"
                  : "",
              ].join(" ")}
            >
              <span className="block text-[0.68rem] uppercase tracking-[0.16em]">
                {day.weekday}
              </span>
              <span className="mt-1 block text-xl leading-none">{day.day}</span>
              <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.12em] text-zinc-500">
                {day.month}
              </span>
            </button>
          ))}
        </div>
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
            <div className="flex min-h-[96px] items-center justify-center rounded-md border border-white/10 bg-black/20 text-sm text-zinc-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {copy.bookingSendingLabel}
            </div>
          ) : slots.length > 0 ? (
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
          ) : (
            <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
              {state === "error" && message ? message : copy.noSlotsLabel}
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
