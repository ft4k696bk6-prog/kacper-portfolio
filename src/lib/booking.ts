export const DEFAULT_BOOKING_TIME_ZONE = "Europe/Warsaw";
export const BOOKING_DAY_COUNT = 12;
export const VACATION_START_DATE = "2026-05-27";
export const VACATION_END_DATE = "2026-06-04";

export type BookingDateStatus = {
  blocked: boolean;
  reason?: "weekend" | "monday" | "vacation" | "past";
};

export type BookingDay = {
  date: string;
  day: string;
  weekday: string;
  month: string;
  blocked: boolean;
  reason?: BookingDateStatus["reason"];
  today: boolean;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function dateKeyFromParts(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function getDateKeyInTimeZone(date: Date, timeZone = DEFAULT_BOOKING_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return dateKeyFromParts(
    Number(values.year),
    Number(values.month),
    Number(values.day),
  );
}

export function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 12));
  return date.toISOString().slice(0, 10);
}

export function getWeekdayIndex(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay();
}

export function getBookingDateStatus(
  dateKey: string,
  todayKey = getDateKeyInTimeZone(new Date()),
): BookingDateStatus {
  if (dateKey < todayKey) {
    return { blocked: true, reason: "past" };
  }

  if (dateKey >= VACATION_START_DATE && dateKey <= VACATION_END_DATE) {
    return { blocked: true, reason: "vacation" };
  }

  const weekday = getWeekdayIndex(dateKey);

  if (weekday === 1) {
    return { blocked: true, reason: "monday" };
  }

  if (weekday === 0 || weekday === 6) {
    return { blocked: true, reason: "weekend" };
  }

  return { blocked: false };
}

export function getBookingDays({
  count = BOOKING_DAY_COUNT,
  now = new Date(),
  locale = "pl-PL",
  timeZone = DEFAULT_BOOKING_TIME_ZONE,
}: {
  count?: number;
  now?: Date;
  locale?: string;
  timeZone?: string;
} = {}): BookingDay[] {
  const todayKey = getDateKeyInTimeZone(now, timeZone);
  const weekdayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone,
  });
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone,
  });
  const days: BookingDay[] = [];
  let offset = 0;

  while (days.length < count && offset < 120) {
    const date = addDays(todayKey, offset);
    const status = getBookingDateStatus(date, todayKey);
    offset += 1;

    if (status.blocked) {
      continue;
    }

    const utcDate = new Date(`${date}T12:00:00.000Z`);
    days.push({
      date,
      day: date.slice(-2),
      weekday: weekdayFormatter.format(utcDate).replace(".", ""),
      month: monthFormatter.format(utcDate).replace(".", ""),
      blocked: false,
      today: date === todayKey,
    });
  }

  return days;
}

export function formatSlotTime(start: string, timeZone = DEFAULT_BOOKING_TIME_ZONE) {
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date(start));
}

export function formatSlotDate(
  start: string,
  timeZone = DEFAULT_BOOKING_TIME_ZONE,
  locale = "pl-PL",
) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone,
  }).format(new Date(start));
}
