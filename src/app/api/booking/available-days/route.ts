import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CalComError,
  getAvailableBookingDays,
  getCalendarTimeZone,
} from "@/lib/calcom";

const availableDaysQuerySchema = z.object({
  locale: z.enum(["pl-PL", "en-US"]).optional().default("pl-PL"),
  limit: z.coerce.number().int().min(1).max(12).optional().default(12),
});

export async function GET(request: NextRequest) {
  const parsed = availableDaysQuerySchema.safeParse({
    locale: request.nextUrl.searchParams.get("locale") ?? undefined,
    limit: request.nextUrl.searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid available days request." }, { status: 400 });
  }

  const timeZone = getCalendarTimeZone();

  try {
    const days = await getAvailableBookingDays({
      count: parsed.data.limit,
      locale: parsed.data.locale,
    });

    return NextResponse.json({ days, timeZone, configured: true });
  } catch (error) {
    if (error instanceof CalComError && error.status === 503) {
      return NextResponse.json({ days: [], timeZone, configured: false });
    }

    return NextResponse.json(
      { days: [], timeZone, configured: true, message: "Available days are temporarily unavailable." },
      { status: 502 },
    );
  }
}
