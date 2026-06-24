"use client";

import { useEffect } from "react";
import { priceFor, unitPrice, usd } from "@/lib/pricing";

const TIERS = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 100];

export function VolumeDiscountsModal({
  basePrice,
  onClose,
}: {
  basePrice: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const baselineUnit = unitPrice(basePrice, 1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div className="text-[15px] font-semibold text-slate-900">
            Savings By Quantity
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-3">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2 font-semibold">Qty</th>
                <th className="py-2 font-semibold">Unit Price</th>
                <th className="py-2 font-semibold">Subtotal</th>
                <th className="py-2 text-right font-semibold">Savings</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((q) => {
                const u = unitPrice(basePrice, q);
                const sub = priceFor(basePrice, q);
                const savings = (baselineUnit - u) * q;
                return (
                  <tr key={q} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-2 text-slate-800">{q}</td>
                    <td className="py-2 text-slate-800">{usd(u)}</td>
                    <td className="py-2 text-slate-800">{usd(sub)}</td>
                    <td className="py-2 text-right font-semibold text-blue-600">
                      {savings > 0.5 ? usd(savings) : usd(0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-3 text-[12px] text-slate-500">
            Additional discounts or coupons may be applied on the Quote Summary
            page or during Checkout.
          </div>
        </div>
      </div>
    </div>
  );
}
