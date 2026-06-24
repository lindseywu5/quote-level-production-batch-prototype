"use client";

import Link from "next/link";
import { useQuote } from "@/lib/store";
import { itemPrice, itemQty, sortBatches, usd, fmtDate } from "@/lib/pricing";
import type { Item } from "@/lib/types";
import { Thumb } from "./Thumb";

export function QuoteSummary() {
  const { items, replaceItem } = useQuote();
  const quoteTotal = items.reduce((s, it) => s + itemPrice(it), 0);

  const stepQty = (it: Item, delta: number) => {
    if (it.batches.length) return;
    replaceItem({ ...it, qty: Math.max(1, it.qty + delta) });
  };

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-4 px-4 py-5 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-1.5 text-xs text-slate-500">
          <a className="text-blue-600 hover:underline">Dashboard</a> /{" "}
          <a className="text-blue-600 hover:underline">Quotes</a> / Q85-0387-8659
        </div>
        <div className="mb-2.5 flex items-center justify-between">
          <h1 className="text-[22px] font-bold text-slate-900">Q85-0387-8659</h1>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-[12px] text-slate-600">
              <span className="inline-flex h-4 w-7 rounded-full bg-slate-300">
                <span className="ml-0.5 mt-0.5 h-3 w-3 rounded-full bg-white" />
              </span>
              ITAR/EAR/CUI Controlled Handling
            </label>
            <button className="btn">+ Add Certifications</button>
            <button className="btn">⤓ Download</button>
            <button className="btn">↗ Share</button>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px]">
          <span className="text-slate-600">3 Parts Uploaded</span>
          <div className="flex items-center gap-4">
            <a className="text-blue-600 hover:underline">Recent Activity Log</a>
            <a className="text-blue-600 hover:underline">⌃ Collapse All</a>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((it, idx) => (
            <ItemCard key={it.id} item={it} index={idx + 1} onQty={(d) => stepQty(it, d)} />
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-dashed border-blue-200 bg-blue-50/40 p-6 text-center">
          <div className="mx-auto mb-1 text-[24px]">📁</div>
          <div className="text-[13px] text-slate-700">
            <b>Drag and Drop</b> or <a className="text-blue-600">Choose File</a>
          </div>
          <div className="text-[11px] text-slate-500">
            Upload at least 1 CAD file to get started.
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Accepted file types: STEP · STP · SLDPRT · STL · DXF · IPT · X_T · X_B · 3DXML · CATPART · PRT · SAT · 3MF · JT
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <button className="btn">Recent CAD Files</button>
            <button className="btn">⤴ Browse</button>
          </div>
        </div>
      </div>

      <aside className="space-y-0 self-start rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-3.5">
          <h4 className="mb-2 text-[13px] font-semibold text-slate-500">
            Manufacturing Origin
          </h4>
          <select className="select">
            <option>Global</option>
            <option>USA</option>
          </select>
        </div>
        <PriceBox label="$ Least Expensive" tone="green" lead="Arrives Jul 14" price={quoteTotal * 0.55} />
        <PriceBox selected label="" lead="Arrives Jul 16" price={quoteTotal} />
        <PriceBox label="⚡ Fastest" tone="purple" lead="Arrives Jul 8" price={quoteTotal * 1.75} />
        <div className="border-b border-slate-200 px-3.5 py-3 text-[12px]">
          <div className="rounded-md bg-amber-50 px-2 py-1.5 text-amber-900">
            ⏱ Order within the next 10 hours, 27 minutes (11:59 PM ET) to arrive by Jul 16.
          </div>
          <div className="mt-2 text-slate-500">
            🚚 All CNC, Sheet, Tube, and 3D printing orders are eligible for free shipping.
          </div>
        </div>
        <div className="p-3.5">
          <button className="w-full rounded-md bg-blue-600 px-3 py-2 text-[13px] font-semibold text-white hover:bg-blue-700">
            Continue to Checkout
          </button>
          <button className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-[13px] hover:border-slate-300">
            ↗ Forward to Purchaser
          </button>
          <a className="mt-2 block text-center text-[12px] text-blue-600 hover:underline">
            + Apply Credits or Codes
          </a>
          <div className="mt-2 text-center text-[11px] text-slate-400">
            Carbon Emissions Offset Included
          </div>
        </div>
      </aside>
    </div>
  );
}

function ItemCard({
  item,
  index,
  onQty,
}: {
  item: Item;
  index: number;
  onQty: (delta: number) => void;
}) {
  const totalQty = itemQty(item);
  const price = itemPrice(item);
  const hasBatches = item.batches.length > 0;
  const sortedBatches = sortBatches(item.batches);

  const opts: Array<{
    key: string;
    lead: string;
    tag?: string;
    tagClass?: string;
    mult: number;
    selected?: boolean;
  }> = [
    { key: "Economy", lead: "Arrives Jul 14", tag: "$ Least Expensive", tagClass: "text-emerald-700", mult: 0.55 },
    { key: "Standard", lead: "Arrives Jul 16", mult: 1, selected: true },
    { key: "Fastest", lead: "Arrives Jul 8", tag: "⚡ Fastest", tagClass: "text-purple-700", mult: 1.75 },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-3 py-2">
        <input type="checkbox" />
        <span className="text-[12px] font-semibold text-slate-500">{index}</span>
        <Thumb item={item} size="md" />
        <Link
          href={`/items/${item.id}`}
          className="text-[14px] font-semibold text-blue-600 hover:underline"
        >
          {item.name}
        </Link>
        <span className="ml-1 inline-block rounded bg-blue-50 px-1.5 py-[1px] text-[11px] text-blue-700">
          {item.version}
        </span>
        <div className="ml-3 flex items-center gap-1 text-[12px]">
          <button className="btn px-2 py-1">Revise CAD</button>
          <button className="btn px-2 py-1">⤴ Upload Drawings</button>
          <button className="btn px-2 py-1">📎 Attach Files</button>
          <button className="btn px-2 py-1 text-slate-500">✕ Remove Part</button>
        </div>
        <div className="flex-1" />
        <label className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <span className="inline-flex h-4 w-7 rounded-full bg-slate-300">
            <span className="ml-0.5 mt-0.5 h-3 w-3 rounded-full bg-white" />
          </span>
          Repeat Part
        </label>

        <div className="ml-3 flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-slate-500">Quantity</span>
            <div className="inline-flex items-center overflow-hidden rounded-md border border-slate-200">
              <button
                onClick={() => onQty(-1)}
                className="h-7 w-7 bg-white text-base disabled:opacity-40"
                disabled={hasBatches}
                title={hasBatches ? "Total quantity is set by production batches" : ""}
              >
                −
              </button>
              <input
                value={totalQty}
                readOnly
                className="h-7 w-11 border-x border-slate-200 text-center text-[13px]"
              />
              <button
                onClick={() => onQty(+1)}
                className="h-7 w-7 bg-white text-base disabled:opacity-40"
                disabled={hasBatches}
                title={hasBatches ? "Total quantity is set by production batches" : ""}
              >
                +
              </button>
            </div>
          </div>
          {hasBatches && (
            <Link
              href={`/items/${item.id}`}
              className="mt-0.5 text-[11px] text-blue-700 hover:underline"
              title={sortedBatches
                .map(
                  (b, i) =>
                    `Batch ${i + 1}: ${b.qty} units · ${
                      b.dueType === "ship" ? "Ship By" : "Deliver By"
                    } ${fmtDate(b.dueDate)}`,
                )
                .join("\n")}
            >
              in {sortedBatches.length} batches · earliest{" "}
              {fmtDate(sortedBatches[0].dueDate)}
            </Link>
          )}
        </div>
        <button className="ml-1 text-slate-400">⌃</button>
      </div>

      <div className="grid grid-cols-1 gap-4 px-3 py-3 lg:grid-cols-[1fr_360px]">
        <div>
          <Link
            href={`/items/${item.id}`}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-blue-600 hover:border-slate-300"
          >
            ✎ Edit Configuration
          </Link>

          <dl className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-[12px] text-slate-700 md:grid-cols-2">
            <Spec k="Process" v={item.process} />
            <Spec k="Threads and Tapped Holes" v="0" />
            <Spec k="Material" v={item.material} />
            <Spec k="Inserts" v="0" />
            <Spec
              k="Measurement"
              v="101.6 × 101.6 × 44.45 mm | 4.000 × 4.000 × 1.750 in"
            />
            <Spec k="Preferred Subprocess" v="No Preference" />
            <Spec k="Finish" v={item.finish} />
            <Spec k="Precision Tolerance" v="±.005″ (±0.13mm)" />
            <Spec k="Precision Surface Roughness" v="125 µin / 3.2 µm Ra" />
            <Spec k="Inspection" v={item.inspection} />
          </dl>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[12px] font-semibold text-slate-700">Price and Lead Time</div>
          </div>
          <div className="space-y-2">
            {opts.map((o) => {
              const p = price * o.mult;
              const strike = p * 1.35;
              const each = p / Math.max(1, totalQty);
              return (
                <div
                  key={o.key}
                  className={
                    "flex items-center justify-between rounded-md border bg-white px-3 py-2 " +
                    (o.selected
                      ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500"
                      : "border-slate-200 hover:border-slate-300")
                  }
                >
                  <div>
                    {o.tag && (
                      <div className={"text-[11px] font-semibold " + (o.tagClass ?? "")}>
                        {o.tag}
                      </div>
                    )}
                    <div className="text-[12px] text-slate-600">{o.lead}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500">{usd(each)} ea.</div>
                    <div className="text-[16px] font-bold text-slate-900">
                      {usd(p)}{" "}
                      <span className="text-[11px] font-normal text-slate-400 line-through">
                        {usd(strike)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            ⓘ Additional shipping options may be available in checkout.
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-1.5">
      <dt className="text-slate-500">{k}:</dt>
      <dd className="font-semibold text-slate-800">{v}</dd>
    </div>
  );
}

function PriceBox({
  label,
  lead,
  price,
  selected,
  tone,
}: {
  label: string;
  lead: string;
  price: number;
  selected?: boolean;
  tone?: "green" | "purple";
}) {
  const toneCls =
    tone === "green"
      ? "text-emerald-700"
      : tone === "purple"
        ? "text-purple-700"
        : "text-slate-500";
  return (
    <div
      className={
        "border-b border-slate-200 p-3.5 last:border-b-0 " +
        (selected ? "border-l-[3px] border-l-blue-600 bg-blue-50/40" : "")
      }
    >
      {label && <div className={"text-[11px] font-semibold " + toneCls}>{label}</div>}
      <div className="text-[12px] text-slate-500">{lead}</div>
      <div className="text-[20px] font-bold text-slate-900">{usd(price)}</div>
    </div>
  );
}
