import { afterEach, describe, expect, it } from "vitest";
import {
  buildAiConsultantSystemPrompt,
  getNvidiaApiBaseUrl,
  getNvidiaApiKey,
  getNvidiaModel,
  sanitizeAiMessages,
} from "./ai-consultant";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("AI consultant helpers", () => {
  it("supports the existing lowercase NVIDIA env name without exposing it to the client", () => {
    delete process.env.NVIDIA_API_KEY;
    process.env.nvidia = "test-key";

    expect(getNvidiaApiKey()).toBe("test-key");
  });

  it("uses safe NVIDIA defaults with env overrides", () => {
    delete process.env.NVIDIA_API_BASE_URL;
    delete process.env.NVIDIA_MODEL;

    expect(getNvidiaApiBaseUrl()).toBe("https://integrate.api.nvidia.com/v1");
    expect(getNvidiaModel()).toBe("meta/llama-3.1-70b-instruct");

    process.env.NVIDIA_API_BASE_URL = "https://example.com/v1/";
    process.env.NVIDIA_MODEL = "custom/model";

    expect(getNvidiaApiBaseUrl()).toBe("https://example.com/v1");
    expect(getNvidiaModel()).toBe("custom/model");
  });

  it("keeps the prompt specific to portfolio evidence", () => {
    const prompt = buildAiConsultantSystemPrompt("en");

    expect(prompt).toContain("B-CRM");
    expect(prompt).toContain("React, TypeScript, Next.js");
    expect(prompt).toContain("Do not use the word");
  });

  it("trims and limits chat history", () => {
    const messages = Array.from({ length: 12 }, (_, index) => ({
      role: "user" as const,
      content: ` message ${index} `,
    }));

    const sanitized = sanitizeAiMessages(messages);

    expect(sanitized).toHaveLength(8);
    expect(sanitized[0].content).toBe("message 4");
    expect(sanitized.at(-1)?.content).toBe("message 11");
  });
});
