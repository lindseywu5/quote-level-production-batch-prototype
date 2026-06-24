"use client";

import type { ReactNode } from "react";

export function Tip({ children }: { children: ReactNode }) {
  return (
    <span className="group relative ml-1.5 inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 align-middle">
      i
      <span className="pointer-events-none invisible absolute left-1/2 top-5 z-20 w-64 -translate-x-1/2 rounded-md bg-slate-900 px-3 py-2 text-[11.5px] font-normal leading-snug text-white opacity-0 shadow-lg transition-opacity duration-100 group-hover:visible group-hover:opacity-100">
        {children}
      </span>
    </span>
  );
}
