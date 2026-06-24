import type { Item } from "./types";

/**
 * Non-linear per-unit price reflecting manufacturing economies of scale.
 * Tuned so that:
 *   q=1   -> ~1.92 * base   (very small runs are pricey per unit)
 *   q=10  -> ~1.21 * base
 *   q=30  -> ~1.05 * base
 *   q=100 -> ~0.94 * base
 *   q=300 -> ~0.89 * base
 */
export function unitPrice(base: number, q: number): number {
  if (q <= 0) return 0;
  const a = 0.82;
  const b = 1.1;
  const k = 0.45;
  return base * (a + b / Math.pow(q, k));
}

export function priceFor(base: number, q: number): number {
  return unitPrice(base, q) * q;
}

export function itemQty(item: Item): number {
  return item.batches.length
    ? item.batches.reduce((s, b) => s + (Number(b.qty) || 0), 0)
    : item.qty;
}

export function itemPrice(item: Item): number {
  if (item.batches.length === 0) return priceFor(item.basePrice, item.qty);
  return item.batches.reduce(
    (s, b) => s + priceFor(item.basePrice, Number(b.qty) || 0),
    0,
  );
}

export function unbatchedPriceAtTotal(item: Item): number {
  return priceFor(item.basePrice, itemQty(item));
}

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const fmtDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export function addDays(date: Date, n: number): string {
  const x = new Date(date);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
}

export function sortBatches<T extends { dueDate: string }>(batches: T[]): T[] {
  return [...batches].sort((a, b) =>
    (a.dueDate || "").localeCompare(b.dueDate || ""),
  );
}
