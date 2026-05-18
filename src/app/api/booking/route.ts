import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CalComError, createBooking } from "@/lib/calcom";

const bookingSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  company: z.string().trim().max(160).optional().default(""),
  message: z.string().trim().max(1200).optional().default(""),
  start: z.string().trim().datetime({ offset: true }),
  website: z.string().trim().max(200).optional().default(""),
  turnstileToken: z.string().trim().optional().default(""),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const current = rateLimit.get(ip);

  if (!current || current.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }

  current.count += 1;
  return current.count > 5;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip !== "unknown") formData.append("remoteip", ip);

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as { success?: boolean };

  return Boolean(result.success);
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many booking requests." }, { status: 429 });
  }

  const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid booking request." }, { status: 400 });
  }

  const payload = parsed.data;
  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  const isHuman = await verifyTurnstile(payload.turnstileToken, ip);
  if (!isHuman) {
    return NextResponse.json({ message: "Bot check failed." }, { status: 403 });
  }

  try {
    const booking = await createBooking(payload);
    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof CalComError) {
      const status = error.status === 400 ? 409 : error.status;
      return NextResponse.json({ message: error.message }, { status });
    }

    return NextResponse.json(
      { message: "Booking could not be created." },
      { status: 502 },
    );
  }
}
