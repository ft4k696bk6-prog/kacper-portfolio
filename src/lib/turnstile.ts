const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<{ success: boolean; errorCodes?: string[] }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not set");
    return { success: false, errorCodes: ["missing-secret-key"] };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!res.ok) {
    return { success: false, errorCodes: ["turnstile-network-error"] };
  }

  const data = (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };

  return { success: data.success, errorCodes: data["error-codes"] };
}
