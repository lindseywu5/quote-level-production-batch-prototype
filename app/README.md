# Quote-level Production Batches — Prototype

Clickable prototype (Next.js 16 + TypeScript + Tailwind v4) demonstrating
production batches at the line-item level of a quote.

## Run locally

```bash
cd app
npm install
npm run dev
# open http://localhost:3000
```

## What it shows

- **Quote summary page** (`/`) — three line items mimicking Xometry's
  quote layout, with Economy / Standard / Fastest price options and an
  inline strip showing any production batches.
- **Quote configuration page** (`/items/[id]`) — drill in to manage
  production batches for a single item.

### Production batches

- Create / View / Edit / Delete batches; rows are read-only until you hit
  **Edit**.
- Each batch has a **quantity**, a **requested due date**, and a
  **due-date type** (Ship date vs. Delivery date).
- Sorted ascending by due date.
- Validation enforces that the sum of batch quantities equals the item's
  total quantity before **Save Configuration** is enabled.
- 0–100 batches per item.

### Pricing (economies of scale)

Per-unit price is non-linear:

```
unitPrice(q) = base * (0.82 + 1.10 / q^0.45)
```

Item price = sum of `unitPrice(batch.qty) * batch.qty` across batches.
The config page shows a `+$X vs. single run` annotation, a customer-
friendly explanation banner, and a tooltip on **Item Price** explaining
why splitting into smaller batches can shift per-unit pricing.

State is persisted to `localStorage` so edits survive a refresh.

## Deploy

### Vercel

```bash
# from inside /app
npx vercel link
npx vercel --prod
```

Or push to GitHub and import the repo in the Vercel dashboard — Vercel
will auto-detect Next.js. No environment variables required.

### GitHub

```bash
cd ..        # repo root
git init     # if not already a repo
git add .
git commit -m "feat: production-batches prototype"
git remote add origin git@github.com:<you>/<repo>.git
git push -u origin main
```

> Note: `create-next-app` already initialized a git repo inside `app/`.
> If you'd rather have a single repo at the workspace root, delete
> `app/.git` before running `git init` at the root.
