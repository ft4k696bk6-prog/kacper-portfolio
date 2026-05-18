import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const revealSchema = z.object({
  type: z.enum(["email", "phone"]),
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
  return current.count > 8;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;

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

function getContactValue(type: "email" | "phone") {
  return type === "email"
    ? process.env.CONTACT_REVEAL_EMAIL?.trim() || process.env.CONTACT_TO_EMAIL?.trim()
    : process.env.CONTACT_REVEAL_PHONE?.trim();
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many reveal requests." }, { status: 429 });
  }

  const parsed = revealSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid reveal request." }, { status: 400 });
  }

  const payload = parsed.data;
  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  const isHuman = await verifyTurnstile(payload.turnstileToken, ip);
  if (!isHuman) {
    return NextResponse.json({ message: "Bot check failed." }, { status: 403 });
  }

  const value = getContactValue(payload.type);
  if (!value) {
    return NextResponse.json({ message: "Contact reveal is not configured." }, { status: 503 });
  }

  return NextResponse.json({ ok: true, type: payload.type, value });
}
