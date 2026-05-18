import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CalComError, getAvailableSlots, getCalendarTimeZone } from "@/lib/calcom";
import { getBookingDateStatus, getDateKeyInTimeZone } from "@/lib/booking";

const slotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function GET(request: NextRequest) {
  const parsed = slotsQuerySchema.safeParse({
    date: request.nextUrl.searchParams.get("date"),
  });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid booking date." }, { status: 400 });
  }

  const timeZone = getCalendarTimeZone();
  const todayKey = getDateKeyInTimeZone(new Date(), timeZone);
  const status = getBookingDateStatus(parsed.data.date, todayKey);

  if (status.blocked) {
    return NextResponse.json({
      slots: [],
      timeZone,
      blocked: true,
      reason: status.reason,
    });
  }

  try {
    const slots = await getAvailableSlots(parsed.data.date);
    return NextResponse.json({ slots, timeZone, blocked: false });
  } catch (error) {
    if (error instanceof CalComError) {
      return NextResponse.json(
        { message: error.message, timeZone, code: "CALCOM_ERROR" },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { message: "Booking slots are temporarily unavailable.", timeZone },
      { status: 502 },
    );
  }
}
