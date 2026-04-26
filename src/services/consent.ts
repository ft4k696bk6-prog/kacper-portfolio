/**
 * Google Consent Mode v2 — service helpers.
 * All functions are SSR-safe (guard on typeof window).
 */

export type ConsentValue = "granted" | "denied";

// ─── Global type augmentation ────────────────────────────────────────────────

interface GtagConsentParams {
  analytics_storage?: ConsentValue;
  ad_storage?: ConsentValue;
  ad_user_data?: ConsentValue;
  ad_personalization?: ConsentValue;
  wait_for_update?: number;
}

interface GtagFunction {
  (command: "consent", action: "default" | "update", params: GtagConsentParams): void;
  (command: "event", action: string, params?: Record<string, unknown>): void;
}

declare global {
  interface Window {
    gtag?: GtagFunction;
    dataLayer?: Record<string, unknown>[];
  }
}

// ─── Consent ─────────────────────────────────────────────────────────────────

/**
 * Send a gtag consent update.
 * Called after the user accepts or rejects cookies in the banner.
 */
export function updateConsent(analytics: ConsentValue, ads: ConsentValue): void {
  if (typeof window === "undefined") return;
  window.gtag?.("consent", "update", {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

/**
 * Read the persisted consent choice from localStorage.
 * Returns null if the user has not yet made a choice.
 */
export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("cookie_consent");
  if (stored === "granted") return "granted";
  if (stored === "denied") return "denied";
  return null;
}

/**
 * Persist the consent choice and immediately update Consent Mode.
 */
export function setStoredConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("cookie_consent", value);
  updateConsent(value, value);
}

/**
 * Remove the persisted choice (used by the reset button).
 */
export function clearStoredConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("cookie_consent");
}

// ─── dataLayer ───────────────────────────────────────────────────────────────

/**
 * Push an arbitrary event to the GTM dataLayer.
 * SSR-safe.
 */
export function pushToDataLayer(event: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(event);
}
