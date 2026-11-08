import { COOKIE_CONSENT_KEY } from "@/lib/preferences";

/** Anonymous UI interactions only — no phone numbers, emails, names or message bodies. */
export function trackContactInteraction(action: "reveal" | "click", method: "phone" | "email") {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(COOKIE_CONSENT_KEY) !== "accepted") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", action === "reveal" ? "contact_reveal" : "contact_click", {
    contact_method: method,
    page_path: window.location.pathname,
  });
}
