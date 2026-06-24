"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Item } from "./types";

const initialItems: Item[] = [
  {
    id: "i1",
    name: "Enclosure Body.STEP",
    version: "v1",
    process: "CNC Machining",
    material: "Aluminum 6061-T6 (Best Available)",
    finish: "Standard",
    inspection: "Standard Inspection",
    qty: 30,
    basePrice: 55,
    thumb: "📦",
    thumbBg: "from-slate-200 to-slate-300",
    batches: [
      { id: "b1a", qty: 18, dueDate: "2026-07-22", dueType: "ship" },
      { id: "b1b", qty: 12, dueDate: "2026-07-15", dueType: "delivery" },
    ],
  },
  {
    id: "i2",
    name: "Fly Wheel.step",
    version: "v1",
    process: "CNC Machining",
    material: "Aluminum 6061-T6 (Best Available)",
    finish: "Standard",
    inspection: "Standard Inspection",
    qty: 10,
    basePrice: 27,
    thumb: "⚙️",
    thumbBg: "from-amber-100 to-amber-200",
    batches: [],
  },
  {
    id: "i3",
    name: "Mill Sample Part.step",
    version: "v1",
    process: "CNC Machining",
    material: "Aluminum 6061-T6 (Best Available)",
    finish: "Standard",
    inspection: "Standard Inspection",
    qty: 10,
    basePrice: 22,
    thumb: "🔩",
    thumbBg: "from-zinc-200 to-zinc-300",
    batches: [],
  },
];

interface Ctx {
  items: Item[];
  setItems: (next: Item[]) => void;
  updateItem: (id: string, patch: Partial<Item>) => void;
  replaceItem: (next: Item) => void;
}

const QuoteCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "quote-batches-prototype-v2";

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<Ctx>(
    () => ({
      items,
      setItems,
      updateItem: (id, patch) =>
        setItems(items.map((x) => (x.id === id ? { ...x, ...patch } : x))),
      replaceItem: (next) =>
        setItems(items.map((x) => (x.id === next.id ? next : x))),
    }),
    [items],
  );

  return <QuoteCtx.Provider value={value}>{children}</QuoteCtx.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteCtx);
  if (!ctx) throw new Error("useQuote must be inside QuoteProvider");
  return ctx;
}

export function resetQuote() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
