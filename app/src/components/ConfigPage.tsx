"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuote } from "@/lib/store";
import {
  addDays,
  fmtDate,
  priceFor,
  sortBatches,
  usd,
} from "@/lib/pricing";
import type { Batch, Item } from "@/lib/types";
import { Tip } from "./Tip";
import { Thumb } from "./Thumb";
import { VolumeDiscountsModal } from "./VolumeDiscountsModal";

export function ConfigPage({ itemId }: { itemId: string }) {
  const router = useRouter();
  const { items, replaceItem } = useQuote();
  const item = items.find((x) => x.id === itemId);
  const [draft, setDraft] = useState<Item | null>(item ?? null);
  const [showDiscounts, setShowDiscounts] = useState(false);

  useEffect(() => {
    if (item) setDraft(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  if (!item || !draft) {
    return (
      <div className="mx-auto max-w-[1180px] p-6 text-sm text-slate-500">
        Item not found.{" "}
        <Link href="/" className="text-blue-600 underline">
          Back to quote
        </Link>
      </div>
    );
  }

  const totalBatchQty = draft.batches.reduce(
    (s, b) => s + (Number(b.qty) || 0),
    0,
  );
  const hasBatches = draft.batches.length > 0;
  const totalQty = hasBatches ? totalBatchQty : draft.qty;
  const valid =
    !hasBatches ||
    (totalBatchQty === draft.qty &&
      draft.batches.every((b) => b.qty > 0 && b.dueDate));

  const total = hasBatches
    ? draft.batches.reduce(
        (s, b) => s + priceFor(draft.basePrice, Number(b.qty) || 0),
        0,
      )
    : priceFor(draft.basePrice, draft.qty);

  const setBatches = (next: Batch[]) => setDraft({ ...draft, batches: next });

  const addBatch = () => {
    const remaining = Math.max(1, draft.qty - totalBatchQty);
    const newBatch: Batch = {
      id: "b" + Math.random().toString(36).slice(2, 7),
      qty: remaining,
      dueDate: addDays(new Date(), 21 + draft.batches.length * 7),
      dueType: "ship",
      editing: true,
    };
    setBatches([...draft.batches, newBatch]);
  };
  const updateBatch = (id: string, patch: Partial<Batch>) =>
    setBatches(draft.batches.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const removeBatch = (id: string) =>
    setBatches(draft.batches.filter((b) => b.id !== id));

  useEffect(() => {
    if (draft) replaceItem(draft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const save = () => {
    const cleaned: Item = {
      ...draft,
      batches: draft.batches.map((b) => ({ ...b, editing: false })),
    };
    replaceItem(cleaned);
    router.push("/");
  };

  return (
    <>
      {/* Toolbar */}
      <div className="border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="mx-auto flex max-w-[1240px] items-center gap-3">
          <Link href="/" className="text-slate-500 hover:text-slate-800">
            ←
          </Link>
          <Thumb item={draft} size="sm" />
          <div>
            <div className="text-[11px] text-blue-600">
              <Link href="/" className="hover:underline">
                Quote Q85-0387-8659
              </Link>{" "}
              / Configure
            </div>
            <div className="text-[15px] font-bold text-slate-900">
              {draft.name}{" "}
              <span className="ml-1 align-middle text-[11px] font-normal text-slate-500">
                {draft.version}
              </span>
              <button className="ml-2 align-middle text-[12px] text-blue-600 hover:underline">
                Revise CAD
              </button>
            </div>
          </div>
          <div className="mx-6 flex items-center gap-5 text-[13px] text-slate-700">
            <span className="border-b-2 border-blue-600 pb-1 font-semibold text-slate-900">
              ☰ Configure
            </span>
            <span className="text-slate-400">⚙ Analyze</span>
          </div>
          <div className="flex-1" />
          <button className="text-[12px] text-blue-600 hover:underline">
            Upload Drawings
          </button>
          <Link href="/" className="btn">Cancel</Link>
          <button
            onClick={save}
            disabled={!valid}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Configuration
          </button>
        </div>
      </div>

      <div className="bg-amber-50/60 px-4 py-2 text-[12px] text-slate-700">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-6">
          <span className="rounded bg-amber-300/70 px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-wide text-amber-900">
            Staff-only
          </span>
          <Meta k="Part ID" v="0506EBF" />
          <Meta k="Customer" v="Lindsey Wu" />
          <Meta k="Quoted On" v="03/17/25 5:12 PM EST" />
          <Meta k="Revision" v="0" />
          <Meta k="Last Revised" v="06/24/26 2:06 PM EST" />
        </div>
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[240px_1fr_300px]">
        {/* Left rail */}
        <aside className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[13px] font-semibold text-slate-800">Files</div>
            <div className="mt-1 text-[11px] text-slate-500">
              Attach or upload any supporting files.
            </div>
            <button className="btn mt-2 w-full justify-center text-[12px]">
              Attach Files
            </button>
            <div className="mt-2 rounded-md border border-dashed border-slate-300 p-3 text-center text-[11px] text-slate-500">
              ⤓ Drag and Drop or <a className="text-blue-600">Browse</a>.
              <div className="mt-0.5 text-[10px]">Max size 100MB</div>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-md bg-slate-50 px-2 py-1.5 text-[11px]">
              <span className="truncate font-medium text-slate-700">
                📄 {draft.name}
              </span>
              <span className="rounded bg-blue-50 px-1.5 text-[10px] text-blue-700">
                Primary
              </span>
            </div>
            <div className="mt-2 flex h-32 items-center justify-center rounded-md border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 text-[11px] text-slate-400">
              <Thumb item={draft} size="xl" />
            </div>
            <div className="mt-1.5 text-[10px] text-slate-500">
              101.6 × 101.6 × 44.45 mm · 1.750 × 1.750 × 4.000 in
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-[13px] font-semibold text-emerald-700">
              ✓ 8/8 DFM Checks Complete
            </div>
            <ul className="mt-2 space-y-1 text-[12px] text-slate-700">
              {[
                "File Type",
                "Floating Parts Check",
                "Large Part Dimension",
                "Model Fidelity",
                "Model Shell Count",
                "Part Exceeds Maximum Size",
                "Void Check",
                "Wall Thickness Check",
              ].map((c) => (
                <li key={c} className="flex items-center gap-1.5">
                  <span className="text-emerald-600">●</span> {c}
                </li>
              ))}
            </ul>
            <a className="mt-2 block text-[12px] text-blue-600 hover:underline">
              + Suggest missing DFM check
            </a>
          </div>
        </aside>

        {/* Middle */}
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
              <div className="text-[14px] font-bold text-slate-900">
                Part Specification
              </div>
              <label className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="inline-flex h-4 w-7 rounded-full bg-blue-600">
                  <span className="ml-3 mt-0.5 h-3 w-3 rounded-full bg-white" />
                </span>
                Show staff-only selections
                <span className="ml-1 rounded bg-amber-300/70 px-1.5 text-[10px] font-bold uppercase text-amber-900">
                  Staff-only
                </span>
              </label>
            </div>

            <div className="space-y-4 p-4">
              {/* Total Quantity + Production Batches (now contextually grouped) */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <div className="flex items-end gap-3">
                  <div>
                    <div className="mb-1 text-[12px] font-semibold text-slate-700">
                      Total Quantity
                      <Tip>
                        The total number of units to manufacture. If you add
                        production batches below, their quantities must add up to
                        this total.
                      </Tip>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={draft.qty}
                      disabled={hasBatches}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          qty: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="h-9 w-28 rounded-md border border-slate-200 px-2 text-[14px] disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                  <button
                    onClick={() => setShowDiscounts(true)}
                    className="mb-2 text-[12px] font-semibold text-blue-600 hover:underline"
                  >
                    Get Volume Discounts
                  </button>
                  {hasBatches && (
                    <span className="mb-2.5 text-[11px] text-slate-500">
                      controlled by production batches below
                    </span>
                  )}
                </div>

                <BatchesSection
                  draft={draft}
                  totalBatchQty={totalBatchQty}
                  addBatch={addBatch}
                  updateBatch={updateBatch}
                  removeBatch={removeBatch}
                />
              </div>

              <Field label="Process">
                <select className="select" defaultValue={draft.process}>
                  <option>CNC</option>
                  <option>CNC Machining</option>
                  <option>Sheet Metal</option>
                  <option>3D Printing</option>
                </select>
              </Field>

              <Field
                label={
                  <>
                    Preferred Subprocess{" "}
                    <Tip>Optional preference for the machining subprocess.</Tip>
                  </>
                }
              >
                <select className="select" defaultValue="No Preference">
                  <option>No Preference</option>
                  <option>3-axis Milling</option>
                  <option>5-axis Milling</option>
                  <option>Turning</option>
                </select>
              </Field>

              <Field label="Material">
                <select className="select" defaultValue={draft.material}>
                  <option>{draft.material}</option>
                </select>
                <div className="mt-1 text-[11px] text-slate-500">
                  <a className="text-blue-600 hover:underline">
                    🔍 Search and Select a Material
                  </a>
                </div>
              </Field>

              <Field
                label={
                  <>
                    Finish{" "}
                    <span className="text-[11px] font-normal text-slate-500">
                      Select at least one finish for this part.
                    </span>
                  </>
                }
              >
                <select className="select" defaultValue={draft.finish}>
                  <option>Standard</option>
                  <option>Anodize Type II — Clear</option>
                  <option>Powder Coat</option>
                </select>
                <button className="btn mt-1 text-[12px]">Add</button>
              </Field>

              <Field label="Threads and Tapped Holes">
                <button className="btn text-[12px]">Threads and Tapped Holes</button>
              </Field>

              <Field label="Inserts">
                <button className="btn text-[12px]">Inserts</button>
              </Field>

              <Field
                label={
                  <>
                    Precision Tolerance <Tip>Tightest tolerance on the drawing.</Tip>
                  </>
                }
              >
                <Radio name="tol" label="Tolerances will be held to ±.010″ (±0.25mm)" />
                <Radio
                  name="tol"
                  label="Tolerances will be held to ±.005″ (±0.13mm)"
                  defaultChecked
                />
                <Radio
                  name="tol"
                  label="This part requires tolerances tighter than ±.005″ (±0.13mm)"
                />
              </Field>

              <Field label="Precision Surface Roughness">
                <select className="select" defaultValue="125 µin / 3.2 µm Ra">
                  <option>125 µin / 3.2 µm Ra</option>
                  <option>63 µin / 1.6 µm Ra</option>
                  <option>32 µin / 0.8 µm Ra</option>
                </select>
              </Field>

              <Field label="Part Marking">
                <div className="grid grid-cols-2 gap-1 text-[12px] text-slate-700">
                  {["Silkscreen", "Ink Stamp", "Bag and Tag", "Engraving", "Laser Mark"].map(
                    (m) => (
                      <label key={m} className="flex items-center gap-1.5">
                        <input type="checkbox" /> {m}
                      </label>
                    ),
                  )}
                </div>
              </Field>

              <Field label="Inspection">
                <Radio name="insp" label="Standard Inspection" defaultChecked />
                <Radio name="insp" label="Formal Inspection with Dimensional Report" />
                <Radio name="insp" label="CMM Inspection with Dimensional Report" />
                <Radio name="insp" label="First Article Inspection (FAIR AS9102)" />
                <Radio name="insp" label="Source Inspection" />
                <Radio name="insp" label="Build and Hold First Article Inspection" />
                <Radio name="insp" label="Custom Inspection" />
              </Field>

              <Field label="Certificates and Supplier Qualifications">
                <div className="grid grid-cols-2 gap-1 text-[12px] text-slate-700">
                  {[
                    "ITAR/USML Registration",
                    "Cybersecurity Maturity Model Certification (CMMC)",
                    "AS9100 Certified",
                    "ISO 9001 Certified",
                    "Hardware Certification",
                    "Certificate of Conformance",
                    "Material Traceability",
                    "ITAR/EAR Certified",
                    "Material Certification",
                  ].map((c) => (
                    <label key={c} className="flex items-center gap-1.5">
                      <input type="checkbox" /> {c}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Notes">
                <textarea
                  placeholder="E.g. finish on drawing can be ignored, repeat part from vendor number, don't chamfer sharp edges, use 'NSM' for supplier code on part marking."
                  className="h-20 w-full resize-y rounded-md border border-slate-200 p-2 text-[12px]"
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <aside className="space-y-3">
          <PriceCard
            tag="$ Least Expensive"
            tone="green"
            lead="Lead time: 8 business days"
            price={total * 0.55}
            strike={total * 0.78}
          />
          <PriceCard
            selected
            tag="Standard"
            lead="Lead time: 5 business days"
            price={total}
            strike={total * 1.35}
            totalQty={totalQty}
            unitAvg={total / Math.max(1, totalQty)}
            hasBatches={hasBatches}
          />
          <PriceCard
            tag="⚡ Fastest"
            tone="purple"
            lead="Lead time: 3 business days"
            price={total * 1.75}
            strike={total * 2.3}
          />
        </aside>
      </div>

      {showDiscounts && (
        <VolumeDiscountsModal
          basePrice={draft.basePrice}
          onClose={() => setShowDiscounts(false)}
        />
      )}
    </>
  );
}

/* ---------- Batches section ---------- */

function BatchesSection({
  draft,
  totalBatchQty,
  addBatch,
  updateBatch,
  removeBatch,
}: {
  draft: Item;
  totalBatchQty: number;
  addBatch: () => void;
  updateBatch: (id: string, patch: Partial<Batch>) => void;
  removeBatch: (id: string) => void;
}) {
  const hasBatches = draft.batches.length > 0;
  const sorted = sortBatches(draft.batches);

  if (!hasBatches) {
    return (
      <div className="mt-3 rounded-md border border-blue-100 bg-blue-50/70 px-3 py-2 text-[12px] text-blue-900">
        Need different dates for different quantities?{" "}
        <button
          onClick={addBatch}
          className="font-semibold text-blue-700 hover:underline"
        >
          Split into production batches
        </button>
        <Tip>
          A <b>production batch</b> is a portion of this item&apos;s total quantity
          with its own requested ship or delivery date. Useful when you need part of
          the order earlier.
        </Tip>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-md border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <div className="flex items-center">
          <span className="text-[13px] font-semibold text-slate-800">
            Production Batches
          </span>
          <Tip>
            Need part of your order earlier? Split this item&apos;s total quantity
            into <b>production batches</b>, each with its own requested ship or
            delivery date.
            <br />
            <br />
            <b>Ship date</b> = the day it leaves the factory.
            <br />
            <b>Delivery date</b> = the day it arrives at you.
          </Tip>
          <span className="ml-2 text-[12px] text-slate-500">
            {draft.batches.length}/100 · sorted by earliest due date
          </span>
        </div>
        <button
          onClick={addBatch}
          disabled={draft.batches.length >= 100}
          className="rounded-md bg-blue-600 px-2.5 py-1 text-[12px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          + Add Batch
        </button>
      </div>

      <ul>
        {sorted.map((b, idx) => (
          <BatchRow
            key={b.id}
            index={idx + 1}
            batch={b}
            totalQty={draft.qty}
            basePrice={draft.basePrice}
            onUpdate={(patch) => updateBatch(b.id, patch)}
            onRemove={() => removeBatch(b.id)}
          />
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2 text-[12px]">
        <div>
          Batch total: <b>{totalBatchQty}</b> of <b>{draft.qty}</b> units
          {totalBatchQty === draft.qty ? (
            <span className="ml-1.5 font-semibold text-emerald-700">
              ✓ matches total
            </span>
          ) : (
            <span className="ml-1.5 font-semibold text-red-700">
              ·{" "}
              {totalBatchQty < draft.qty
                ? `add ${draft.qty - totalBatchQty} more`
                : `remove ${totalBatchQty - draft.qty}`}
            </span>
          )}
        </div>
        <div>
          Item price{" "}
          <b>
            {usd(
              draft.batches.reduce(
                (s, b) => s + priceFor(draft.basePrice, Number(b.qty) || 0),
                0,
              ),
            )}
          </b>
        </div>
      </div>
    </div>
  );
}

/* ---------- Single batch row ---------- */

function BatchRow({
  index,
  batch,
  totalQty,
  basePrice,
  onUpdate,
  onRemove,
}: {
  index: number;
  batch: Batch;
  totalQty: number;
  basePrice: number;
  onUpdate: (patch: Partial<Batch>) => void;
  onRemove: () => void;
}) {
  const editing = !!batch.editing;
  const qty = Number(batch.qty) || 0;
  const extended = priceFor(basePrice, qty);
  const each = extended / Math.max(1, qty);

  return (
    <li className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-slate-100 px-3 py-2 text-[13px] last:border-b-0">
      <span className="font-semibold text-slate-800">Batch {index}:</span>

      {editing ? (
        <input
          type="number"
          min={1}
          value={batch.qty}
          onChange={(e) =>
            onUpdate({ qty: Math.max(0, Number(e.target.value) || 0) })
          }
          className="h-7 w-16 rounded-md border border-slate-200 px-1.5 text-center"
          aria-label="Batch quantity"
        />
      ) : (
        <span className="font-semibold text-slate-800">{qty}</span>
      )}
      <span className="text-slate-500">/ out of {totalQty}.</span>

      {editing ? (
        <select
          value={batch.dueType}
          onChange={(e) =>
            onUpdate({ dueType: e.target.value as Batch["dueType"] })
          }
          className="h-7 rounded-md border border-slate-200 px-1.5 text-[12px]"
        >
          <option value="ship">Requested Ship by:</option>
          <option value="delivery">Requested Delivery by:</option>
        </select>
      ) : (
        <span className="text-slate-700">
          {batch.dueType === "ship"
            ? "Requested Ship by:"
            : "Requested Delivery by:"}
        </span>
      )}

      {editing ? (
        <input
          type="date"
          value={batch.dueDate}
          onChange={(e) => onUpdate({ dueDate: e.target.value })}
          className="h-7 rounded-md border border-slate-200 px-1.5"
        />
      ) : (
        <span className="font-semibold text-slate-800">{fmtDate(batch.dueDate)}</span>
      )}

      <span className="text-slate-400">·</span>

      <span className="text-slate-700">
        <b>{usd(extended)}</b>{" "}
        <span className="text-slate-500">({usd(each)}/ea)</span>
      </span>

      <span className="flex-1" />

      {editing ? (
        <button
          onClick={() => onUpdate({ editing: false })}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] hover:border-slate-300"
        >
          Done
        </button>
      ) : (
        <button
          onClick={() => onUpdate({ editing: true })}
          className="rounded-md px-2 py-1 text-[11px] text-blue-600 hover:underline"
        >
          Edit
        </button>
      )}
      <button
        onClick={onRemove}
        className="rounded-md p-1 text-slate-500 hover:bg-red-50 hover:text-red-600"
        aria-label="Delete batch"
        title="Delete batch"
      >
        🗑
      </button>
    </li>
  );
}

/* ---------- helpers ---------- */

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{k}</div>
      <div className="text-[12px] font-semibold text-slate-800">{v}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 text-[12px] font-semibold text-slate-700">{label}</div>
      {children}
    </div>
  );
}

function Radio({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="mb-0.5 flex items-start gap-1.5 text-[12px] text-slate-700">
      <input
        type="radio"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5"
      />
      <span>{label}</span>
    </label>
  );
}

function PriceCard({
  tag,
  tone,
  lead,
  price,
  strike,
  selected,
  totalQty,
  unitAvg,
  hasBatches,
}: {
  tag: string;
  tone?: "green" | "purple";
  lead: string;
  price: number;
  strike?: number;
  selected?: boolean;
  totalQty?: number;
  unitAvg?: number;
  hasBatches?: boolean;
}) {
  const toneCls =
    tone === "green"
      ? "text-emerald-700"
      : tone === "purple"
        ? "text-purple-700"
        : "text-slate-900";
  return (
    <div
      className={
        "rounded-lg border bg-white p-3 " +
        (selected ? "border-blue-500 ring-1 ring-blue-500" : "border-slate-200")
      }
    >
      <div className={"text-[12px] font-semibold " + toneCls}>{tag}</div>
      <div className="text-[11px] text-slate-500">{lead}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-[22px] font-bold text-slate-900">{usd(price)}</div>
        {strike && (
          <div className="text-[11px] text-slate-400 line-through">{usd(strike)}</div>
        )}
      </div>
      {selected && totalQty !== undefined && unitAvg !== undefined && (
        <div className="mt-2 border-t border-slate-100 pt-2 text-[11px] text-slate-600">
          <div className="flex justify-between">
            <span>Total Quantity</span>
            <span className="font-semibold text-slate-800">{totalQty} units</span>
          </div>
          <div className="flex justify-between">
            <span>{hasBatches ? "Unit Price (Avg)" : "Unit Price"}</span>
            <span className="font-semibold text-slate-800">{usd(unitAvg)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
