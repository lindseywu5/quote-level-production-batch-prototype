"use client";

import { resetQuote } from "@/lib/store";

export function ResetButton() {
  const handleReset = () => {
    const ok = window.confirm(
      "Reset the prototype to its default mock data? Any edits you've made (quantities, batches, etc.) will be cleared.",
    );
    if (!ok) return;
    resetQuote();
    window.location.assign("/");
  };

  return (
    <button
      onClick={handleReset}
      title="Clear local edits and reload the default mock data"
      className="fixed bottom-5 left-5 z-30 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-700 shadow-lg hover:border-slate-300 hover:text-slate-900"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3.5 w-3.5"
      >
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
      Reset prototype
    </button>
  );
}
