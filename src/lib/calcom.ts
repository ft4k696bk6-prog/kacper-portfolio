import {
  DEFAULT_BOOKING_TIME_ZONE,
  BOOKING_DAY_COUNT,
  addDays,
  formatBookingDay,
  formatSlotTime,
  getBookingCandidateDates,
  getBookingDateStatus,
  getDateKeyInTimeZone,
} from "@/lib/booking";

const CAL_API_BASE = "https://api.cal.com/v2";
const CAL_SLOTS_API_VERSION = "2024-09-04";
const CAL_BOOKINGS_API_VERSION = "2026-02-25";

type CalSlotValue = string | { start?: string; time?: string };

type CalSlotsResponse = {
  status?: string;
  data?: Record<string, CalSlotValue[]>;
  message?: string;
  error?: { message?: string };
};

type CalPublicScheduleResponse = {
  result?: {
    data?: {
      json?: {
        slots?: Record<string, CalSlotValue[]>;
      };
    };
  };
};

type CalBookingResponse = {
  status?: string;
  data?: {
    uid?: string;
    start?: string;
  };
  message?: string;
  error?: { message?: string };
};

export type NormalizedSlot = {
  start: string;
  label: string;
};

export type AvailableBookingDay = ReturnType<typeof formatBookingDay> & {
  slotCount: number;
};

export type CalEventConfig =
  | {
      ok: true;
      apiKey?: string;
      eventTypeId?: number;
      eventTypeSlug?: string;
      username?: string;
    }
  | {
      ok: false;
      message: string;
    };

export class CalComError extends Error {
  constructor(
    message: string,
    public readonly status = 502,
  ) {
    super(message);
  }
}

export function getCalendarTimeZone() {
  return process.env.NEXT_PUBLIC_CALENDAR_TIMEZONE || DEFAULT_BOOKING_TIME_ZONE;
}

export function getCalEventConfig(): CalEventConfig {
  const apiKey = process.env.CAL_API_KEY?.trim();
  const eventTypeId = process.env.CAL_EVENT_TYPE_ID?.trim();
  const eventTypeSlug = process.env.CAL_EVENT_TYPE_SLUG?.trim();
  const username = process.env.CAL_USERNAME?.trim();

  if (eventTypeId && Number.isFinite(Number(eventTypeId))) {
    if (!apiKey) {
      return { ok: false, message: "Booking calendar API key is not configured." };
    }

    return { ok: true, apiKey, eventTypeId: Number(eventTypeId) };
  }

  if (eventTypeSlug && username) {
    return { ok: true, apiKey, eventTypeSlug, username };
  }

  return { ok: false, message: "Cal.com event type is not configured." };
}

function applyEventParams(
  params: URLSearchParams,
  config: Extract<CalEventConfig, { ok: true }>,
) {
  if (config.eventTypeId) {
    params.set("eventTypeId", String(config.eventTypeId));
    return;
  }

  if (config.eventTypeSlug && config.username) {
    params.set("eventTypeSlug", config.eventTypeSlug);
    params.set("username", config.username);
  }
}

function applyEventBody(
  body: Record<string, unknown>,
  config: Extract<CalEventConfig, { ok: true }>,
) {
  if (config.eventTypeId) {
    body.eventTypeId = config.eventTypeId;
    return;
  }

  body.eventTypeSlug = config.eventTypeSlug;
  body.username = config.username;
}

function getCalHeaders(config: Extract<CalEventConfig, { ok: true }>, version: string) {
  const headers: Record<string, string> = {
    "cal-api-version": version,
  };

  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  return headers;
}

function normalizeCalError(response: CalSlotsResponse | CalBookingResponse) {
  return response.error?.message || response.message || "Cal.com request failed.";
}

function normalizeSlots(rawSlots: CalSlotValue[] | undefined, timeZone: string) {
  const now = Date.now();

  return (rawSlots ?? [])
    .map((slot) => (typeof slot === "string" ? slot : slot.start || slot.time))
    .filter((start): start is string => Boolean(start))
    .filter((start) => Date.parse(start) > now)
    .map((start) => ({
      start,
      label: formatSlotTime(start, timeZone),
    }));
}

function toUtcDayStart(date: string) {
  return new Date(`${date}T00:00:00.000Z`).toISOString();
}

function toUtcDayEnd(date: string) {
  return new Date(`${date}T23:59:59.999Z`).toISOString();
}

function getPublicScheduleUrl({
  start,
  end,
  config,
  timeZone,
}: {
  start: string;
  end: string;
  config: Extract<CalEventConfig, { ok: true }>;
  timeZone: string;
}) {
  if (!config.eventTypeSlug || !config.username) {
    throw new CalComError("Public Cal.com schedule requires username and event slug.", 503);
  }

  const input = {
    json: {
      isTeamEvent: false,
      usernameList: [config.username],
      eventTypeSlug: config.eventTypeSlug,
      startTime: toUtcDayStart(start),
      endTime: toUtcDayEnd(end),
      timeZone,
      duration: null,
      rescheduleUid: null,
      orgSlug: null,
      teamMemberEmail: null,
      routedTeamMemberIds: null,
      skipContactOwner: false,
      routingFormResponseId: null,
      email: null,
      embedConnectVersion: "0",
      _isDryRun: false,
      _bookerCorrelationId: "kacper-portfolio",
    },
    meta: {
      values: {
        duration: ["undefined"],
        orgSlug: ["undefined"],
        teamMemberEmail: ["undefined"],
        routingFormResponseId: ["undefined"],
      },
    },
  };
  const url = new URL("https://cal.com/api/trpc/slots/getSchedule");
  url.searchParams.set("input", JSON.stringify(input));
  return url;
}

async function fetchPublicSlotsRange(
  start: string,
  end: string,
  config: Extract<CalEventConfig, { ok: true }>,
) {
  const timeZone = getCalendarTimeZone();
  const response = await fetch(getPublicScheduleUrl({ start, end, config, timeZone }), {
    headers: {
      Accept: "application/json",
      "User-Agent": "kacper-portfolio",
    },
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as CalPublicScheduleResponse;

  if (!response.ok) {
    throw new CalComError("Public Cal.com schedule request failed.", response.status || 502);
  }

  return body.result?.data?.json?.slots ?? {};
}

function getSlotsUrl({
  start,
  end,
  config,
  timeZone,
}: {
  start: string;
  end: string;
  config: Extract<CalEventConfig, { ok: true }>;
  timeZone: string;
}) {
  const url = new URL(`${CAL_API_BASE}/slots`);
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);
  url.searchParams.set("timeZone", timeZone);
  url.searchParams.set("duration", "30");
  applyEventParams(url.searchParams, config);
  return url;
}

async function fetchSlotsRange(start: string, end: string) {
  const timeZone = getCalendarTimeZone();
  const config = getCalEventConfig();

  if (!config.ok) {
    throw new CalComError(config.message, 503);
  }

  if (!config.apiKey) {
    return fetchPublicSlotsRange(start, end, config);
  }

  const response = await fetch(getSlotsUrl({ start, end, config, timeZone }), {
    headers: getCalHeaders(config, CAL_SLOTS_API_VERSION),
    cache: "no-store",
  });
  const body = (await response.json().catch(() => ({}))) as CalSlotsResponse;

  if (!response.ok || body.status === "error") {
    if (config.eventTypeSlug && config.username) {
      return fetchPublicSlotsRange(start, end, config);
    }

    throw new CalComError(normalizeCalError(body), response.status || 502);
  }

  return body.data ?? {};
}

export async function getAvailableSlots(date: string): Promise<NormalizedSlot[]> {
  const timeZone = getCalendarTimeZone();
  const todayKey = getDateKeyInTimeZone(new Date(), timeZone);
  const status = getBookingDateStatus(date, todayKey);

  if (status.blocked) {
    return [];
  }

  const data = await fetchSlotsRange(date, date);
  return normalizeSlots(data[date], timeZone);
}

export async function getAvailableBookingDays({
  count = BOOKING_DAY_COUNT,
  horizonDays = 120,
  locale = "pl-PL",
  now = new Date(),
}: {
  count?: number;
  horizonDays?: number;
  locale?: string;
  now?: Date;
} = {}): Promise<AvailableBookingDay[]> {
  const timeZone = getCalendarTimeZone();
  const todayKey = getDateKeyInTimeZone(now, timeZone);
  const rangeEnd = addDays(todayKey, horizonDays);
  const data = await fetchSlotsRange(todayKey, rangeEnd);
  const candidateDates = getBookingCandidateDates({ horizonDays, now, timeZone });
  const days: AvailableBookingDay[] = [];

  for (const date of candidateDates) {
    const slots = normalizeSlots(data[date], timeZone);

    if (slots.length === 0) {
      continue;
    }

    days.push({
      ...formatBookingDay(date, { locale, now, timeZone }),
      slotCount: slots.length,
    });

    if (days.length >= count) {
      break;
    }
  }

  return days;
}

export async function createBooking({
  start,
  name,
  email,
  company,
  message,
}: {
  start: string;
  name: string;
  email: string;
  company?: string;
  message?: string;
}) {
  const timeZone = getCalendarTimeZone();
  const selectedDate = getDateKeyInTimeZone(new Date(start), timeZone);
  const todayKey = getDateKeyInTimeZone(new Date(), timeZone);
  const status = getBookingDateStatus(selectedDate, todayKey);

  if (status.blocked) {
    throw new CalComError("Selected date is unavailable.", 400);
  }

  if (Date.parse(start) <= Date.now()) {
    throw new CalComError("Selected time is no longer available.", 400);
  }

  const config = getCalEventConfig();
  if (!config.ok) {
    throw new CalComError(config.message, 503);
  }

  const bookingStart = new Date(start).toISOString();
  const body: Record<string, unknown> = {
    start: bookingStart,
    attendee: {
      name,
      email,
      timeZone,
      language: "pl",
    },
    metadata: {
      source: "kacper-portfolio",
      company: company || undefined,
      message: message || undefined,
    },
  };
  applyEventBody(body, config);

  const response = await fetch(`${CAL_API_BASE}/bookings`, {
    method: "POST",
    headers: {
      ...(config.eventTypeId
        ? getCalHeaders(config, CAL_BOOKINGS_API_VERSION)
        : { "cal-api-version": CAL_BOOKINGS_API_VERSION }),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const responseBody = (await response.json().catch(() => ({}))) as CalBookingResponse;

  if (!response.ok || responseBody.status === "error") {
    throw new CalComError(normalizeCalError(responseBody), response.status || 502);
  }

  return {
    uid: responseBody.data?.uid,
    start: responseBody.data?.start ?? bookingStart,
  };
}
