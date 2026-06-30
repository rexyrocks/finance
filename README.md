# NetWorth OS

A premium personal net worth and financial health command center, built on the
real figures from your "Networth statement 2025-26" spreadsheet (₹382.43L assets,
₹128.51L liabilities, ₹317.28L insurance cover, ₹253.92L net worth — verified to
match the source sheet exactly).

## Tech stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · Framer Motion ·
Recharts · Prisma · PostgreSQL · NextAuth · the Anthropic SDK for the "ask your
finances" panel.

## What's fully implemented

- **Prisma schema** — `Asset`, `Liability`, `InsurancePolicy`, `AssetHistory`,
  `NetWorthSnapshot`, `AuditLog`, `User` with `Role` (`OWNER`/`EDITOR`/`VIEWER`).
- **Seed script** (`prisma/seed.ts`) — every line item from the spreadsheet,
  correctly categorized, loads with one command.
- **Dashboard** — animated net worth counter, assets vs liabilities, insurance
  cover, liquidity, debt-to-asset ratio, financial health score (0–100, six
  weighted components with real formulas in `src/lib/calculations.ts`), asset
  allocation donut, net worth timeline area chart, AI recommendations, and a
  live "ask your finances" panel wired to Claude.
- **Assets module** — cards grouped by category (stocks, mutual funds, gold,
  real estate, vehicles, bank accounts, PF/NPS, cash, other), each showing
  value, gain/loss, allocation %, and a liquidity badge.
- **Liabilities module** — cards by category with EMI, interest rate,
  remaining tenure, and an animated payoff progress ring.
- **Insurance module** — cards per policy with provider, type, sum assured,
  premium, nominee, expiry, and share-of-cover bar.
- **Analytics** — debt-to-asset, liquidity score, insurance-to-net-worth,
  allocation treemap, a risk meter, and the full health-score component
  breakdown with plain-language detail per metric.
- **CRUD APIs** — `GET/POST /api/assets`, `/api/liabilities`, `/api/insurance`,
  plus `PATCH/DELETE` on `/api/{module}/[id]`, each writing to `AuditLog`.
- **CSV export** — `/api/export/csv?type=assets|liabilities|insurance`.
- **PDF report** — `/api/export/pdf` generates a real one-page summary with
  pdf-lib (not a stub — actually renders your numbers).
- **Auth scaffold** — NextAuth credentials provider against the seeded user;
  swap in Google/GitHub OAuth or bcrypt password checks for production.
- **Dark theme** — ink/gold premium palette tuned for this build (see
  `tailwind.config.ts`); the design intentionally avoids generic SaaS blue/purple.

## What's scaffolded, not finished

These are real architectural pieces with a clear extension point, but not
fully built out — finishing them is straightforward given the patterns
already in the codebase:

- **Light mode** — the theme toggle button exists in the topbar but isn't
  wired to a `data-theme` class switch yet.
- **CSV/Excel *import*** — export works; add a `papaparse`-based upload route
  mirroring the CRUD POST handlers.
- **Role-based access enforcement** — roles exist on `User`, but API routes
  don't yet check `session.role` before writes. Add a `requireRole()` guard
  in each route using `getServerSession(authOptions)`.
- **Audit log UI** — the model and writes are live; add a table page reading
  `prisma.auditLog.findMany()`.
- **Multi-quarter history** — the dashboard timeline currently derives two
  placeholder prior points from the one real snapshot. Log a
  `NetWorthSnapshot` each quarter (a cron job or manual "close quarter"
  button) to get a real trend line.
- **Search and filters** — the topbar search input is currently static; wire
  it to client-side filtering on the assets/liabilities/insurance pages.
- **Sankey diagram** — call out in the brief but not built; Recharts doesn't
  ship one natively, so this needs `d3-sankey` or a dedicated library.

## Setup

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Visit `http://localhost:3000`. The seed creates one user
(`owner@networth.local`); `getCurrentUserId()` in `src/lib/fetchers.ts`
resolves to that user until real session-based auth is wired in.

## Editing your data

The fastest way to see your own numbers reflected is to edit
`prisma/seed.ts` directly and re-run `npm run db:seed` — or use the
dashboard's CRUD APIs once the app is running. `prisma studio`
(`npm run db:studio`) gives a spreadsheet-like GUI over the same tables if
you'd rather edit rows directly.
