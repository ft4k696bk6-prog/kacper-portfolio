"use client";

import { clearStoredConsent } from "@/services/consent";

export function ResetConsentButton() {
  function reset() {
    clearStoredConsent();
    window.location.reload();
  }

  return (
    <button
      onClick={reset}
      className="px-5 py-2.5 text-sm border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-white rounded-lg transition-colors"
    >
      Reset cookie preferences
    </button>
  );
}
