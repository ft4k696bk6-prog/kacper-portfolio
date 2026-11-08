"use client";

export function PrintChecklistButton() {
  return (
    <button type="button" onClick={() => window.print()}
      className="print:hidden rounded-lg border border-white/25 px-5 py-3 text-sm font-medium text-white hover:border-white/60">
      Drukuj / zapisz jako PDF
    </button>
  );
}
