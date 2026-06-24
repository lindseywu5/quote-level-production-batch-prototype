# Quote-level Production Batches — Prototype

Clickable Next.js prototype exploring how to express **production batches** at the line-item level of a Xometry quote — letting customers split a total quantity into smaller portions, each with its own requested ship or delivery date.

## Run locally

```bash
cd app
npm install
npm run dev
# open http://localhost:3000
```

## Layout

- `app/` — Next.js 16 + TypeScript + Tailwind v4 application (the prototype)
  - `src/app/` — routes (`/`, `/items/[id]`)
  - `src/components/` — UI (QuoteSummary, ConfigPage, VolumeDiscountsModal, Thumb, Tip, TopBar)
  - `src/lib/` — pricing model, types, in-memory store backed by `localStorage`
- `prototype.html` — original single-file HTML scratch prototype
- `screencapture-*.png` — reference screenshots of the current production quoting UI

## Pricing model

Per-unit price is non-linear (`unitPrice(q) = base * (0.82 + 1.10 / q^0.45)`) so that the item's total price genuinely shifts as production batches are split and resized — bigger batches get a lower per-unit cost. The user-facing copy frames this through "Get Volume Discounts" rather than calling out any single-run surcharge.

## Deploy

The app is configured to deploy on Vercel from the `app/` subdirectory — set **Root Directory** to `app` when importing the project, or run `vercel` from inside `app/`.
