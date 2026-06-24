"use client";

import Link from "next/link";
import { resetQuote } from "@/lib/store";

export function TopBar() {
  const handleReset = () => {
    const ok =
      typeof window === "undefined" ||
      window.confirm(
        "Reset the prototype to its default mock data? Any edits you've made (quantities, batches, etc.) will be cleared.",
      );
    if (!ok) return;
    resetQuote();
    if (typeof window !== "undefined") window.location.assign("/");
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3 bg-blue-600 py-1.5 text-center text-xs text-white">
        <span>Prototype · Quote-level Production Batches</span>
        <span className="text-blue-200">·</span>
        <button
          onClick={handleReset}
          className="rounded border border-white/40 px-1.5 py-[1px] text-[11px] text-white/95 hover:bg-white/10"
          title="Clear local edits and reload the default mock data"
        >
          ↺ Reset prototype
        </button>
      </div>
      <header className="flex items-center gap-5 border-b border-slate-200 bg-white px-6 py-2.5">
        <Link
          href="/"
          className="text-base font-extrabold tracking-tight text-slate-900"
        >
          Xometry
        </Link>
        <div className="flex-1" />
        <nav className="hidden gap-4 text-[13px] text-slate-700 md:flex">
          <a className="hover:text-slate-900">Dashboard</a>
          <Link href="/" className="hover:text-slate-900">
            Quotes
          </Link>
          <a className="hover:text-slate-900">Orders</a>
          <a className="hover:text-slate-900">My Account ▾</a>
        </nav>
        <button className="rounded-md bg-blue-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-blue-700">
          Start a New Quote
        </button>
      </header>
    </>
  );
}
