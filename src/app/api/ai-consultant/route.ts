import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  buildPortfolioOpenRouterPrompt,
  isPortfolioTopic,
  offlinePortfolioAnswer,
  outsideScopeAnswer,
  PORTFOLIO_AI_MAX_QUESTION_LENGTH,
  PORTFOLIO_AI_MAX_RESPONSE_TOKENS,
  PORTFOLIO_AI_MODEL,
} from "@/lib/portfolio-openrouter";

// Keep the request/response shape unchanged: the existing mascot, booking
// panel, quick actions and frontend do not need to change.
const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2200),
});
const consultantSchema = z.object({
  language: z.enum(["en", "pl"]).default("en"),
  messages: z.array(messageSchema).min(1).max(8),
  website: z.string().trim().max(200).optional().default(""),
});

type ProviderResponse = {
  choices?: Array<{ message?: { content?: unknown } }>;
};

// These counters are only a defense-in-depth best effort: serverless instances
// do NOT share memory. Enforce a real spend cap at OpenRouter key level and
// add a Vercel Firewall rate-limit for /api/ai-consultant before going live.
const perIp = new Map<string, { count: number; resetAt: number }>();
let dailyWindow = { day: "", count: 0 };

function isRateLimited(request: NextRequest) {
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);
  if (dailyWindow.day !== day) dailyWindow = { day, count: 0 };

  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Keep the in-memory map bounded even under randomized IP abuse.
  for (const [key, entry] of perIp) {
    if (entry.resetAt <= now) perIp.delete(key);
  }
  if (!perIp.has(ip) && perIp.size >= 4096) return true;

  const previous = perIp.get(ip);
  const entry =
    !previous || previous.resetAt <= now
      ? { count: 0, resetAt: now + 10 * 60_000 }
      : previous;
  entry.count += 1;
  perIp.set(ip, entry);
  dailyWindow.count += 1;
  return entry.count > 5 || dailyWindow.count > 100;
}

function extractAnswer(content: unknown) {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        part && typeof part === "object" && "text" in part && typeof part.text === "string"
          ? part.text
          : "",
      )
      .join("")
      .trim();
  }
  return "";
}

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { message: "AI assistant request limit reached." },
      { status: 429 },
    );
  }

  if (Number(request.headers.get("content-length")) > 12_000) {
    return NextResponse.json({ message: "Request too large." }, { status: 413 });
  }

  const parsed = consultantSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid AI assistant request." }, { status: 400 });
  }

  const { language, messages, website } = parsed.data;
  // Keep the existing honeypot contract; never send suspected spam to AI.
  if (website) {
    return NextResponse.json({ ok: true, answer: outsideScopeAnswer(language) });
  }

  // The existing UI sends up to eight chat messages. We never pass their history
  // to OpenRouter: only one bounded user question can incur paid tokens.
  const question = [...messages].reverse().find((item) => item.role === "user")?.content.trim() || "";
  if (!question || question.length > PORTFOLIO_AI_MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { message: "Please ask a question of up to 250 characters." },
      { status: 400 },
    );
  }

  if (!isPortfolioTopic(question)) {
    return NextResponse.json({ ok: true, answer: outsideScopeAnswer(language), fallback: true });
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    // Explicitly do NOT fall back to a potentially expensive NVIDIA key.
    return NextResponse.json({
      ok: true,
      answer: offlinePortfolioAnswer(language),
      configured: false,
      fallback: true,
    });
  }

  try {
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(13_000),
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://bernecki.dev",
        "X-Title": "Berni Portfolio",
      },
      body: JSON.stringify({
        model: PORTFOLIO_AI_MODEL,
        messages: [
          { role: "system", content: buildPortfolioOpenRouterPrompt(language) },
          { role: "user", content: question },
        ],
        max_completion_tokens: PORTFOLIO_AI_MAX_RESPONSE_TOKENS,
        reasoning: { effort: "low", exclude: true },
        stream: false,
      }),
    });

    if (!upstream.ok) {
      // Do not leak provider/account errors or credentials into visitor UI.
      return NextResponse.json(
        { message: "Portfolio assistant temporarily unavailable." },
        { status: 503 },
      );
    }

    const payload = (await upstream.json()) as ProviderResponse;
    const answer = extractAnswer(payload.choices?.[0]?.message?.content);
    if (!answer) {
      return NextResponse.json(
        { message: "Portfolio assistant returned no answer." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { ok: true, answer: answer.slice(0, 850), configured: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Portfolio assistant temporarily unavailable." },
      { status: 503 },
    );
  }
}
