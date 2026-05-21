import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  AI_CONSULTANT_LIMITS,
  buildAiConsultantSystemPrompt,
  getNvidiaApiBaseUrl,
  getNvidiaApiKey,
  getNvidiaModel,
  sanitizeAiMessages,
} from "@/lib/ai-consultant";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(AI_CONSULTANT_LIMITS.maxMessageLength),
});

const consultantSchema = z.object({
  language: z.enum(["en", "pl"]).default("en"),
  messages: z.array(messageSchema).min(1).max(AI_CONSULTANT_LIMITS.maxMessages),
  website: z.string().trim().max(200).optional().default(""),
});

const rateLimit = new Map<string, { count: number; resetAt: number }>();

type NvidiaChatResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
  error?: {
    message?: string;
  };
  message?: string;
};

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
  return current.count > 12;
}

function normalizeNvidiaContent(content: unknown) {
  if (typeof content === "string") return content.trim();

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object" && "text" in item) {
          return String(item.text);
        }
        return "";
      })
      .join("")
      .trim();
  }

  return "";
}

function normalizeNvidiaError(payload: NvidiaChatResponse) {
  return payload.error?.message || payload.message || "NVIDIA AI request failed.";
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ message: "Too many AI consultant requests." }, { status: 429 });
  }

  const parsed = consultantSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid AI consultant request." }, { status: 400 });
  }

  const payload = parsed.data;
  if (payload.website) {
    return NextResponse.json({ ok: true, answer: "" });
  }

  const apiKey = getNvidiaApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { message: "AI consultant is not configured yet." },
      { status: 503 },
    );
  }

  const messages = sanitizeAiMessages(payload.messages);
  if (!messages.length) {
    return NextResponse.json({ message: "Question is empty." }, { status: 400 });
  }

  const response = await fetch(`${getNvidiaApiBaseUrl()}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getNvidiaModel(),
      messages: [
        { role: "system", content: buildAiConsultantSystemPrompt(payload.language) },
        ...messages,
      ],
      max_tokens: AI_CONSULTANT_LIMITS.maxResponseTokens,
      temperature: 0.25,
      top_p: 0.8,
      stream: false,
    }),
  });

  const result = (await response.json().catch(() => ({}))) as NvidiaChatResponse;
  if (!response.ok) {
    return NextResponse.json(
      { message: normalizeNvidiaError(result) },
      { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
    );
  }

  const answer = normalizeNvidiaContent(result.choices?.[0]?.message?.content);
  if (!answer) {
    return NextResponse.json({ message: "AI consultant returned an empty answer." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, answer });
}
