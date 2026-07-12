
# Expense Tracker: Monorepo Setup & MVP

Status: reviewed (round 1) — 2026-07-12

## Goal

Build a Turborepo-based monorepo with a Next.js frontend for recording expense transactions (credits/debits). Uses Drizzle ORM + SQLite for a lightweight, single-user setup. Phase 1 focuses on infrastructure, database schema, and basic UI for transaction entry/viewing. AI agent integration for auto-categorization and spending analytics deferred to Phase 2.

## Shape

```
expense-tracker/ (root)
├── apps/
│   └── web/                    (Next.js frontend)
│       ├── src/
│       │   ├── app/            (Next.js App Router)
│       │   ├── components/     (Reusable UI)
│       │   └── lib/            (Utilities, API calls)
│       └── package.json
├── packages/
│   ├── db/                     (Drizzle schema & migrations)
│   │   ├── src/
│   │   │   ├── schema.ts       (Drizzle table definitions)
│   │   │   └── index.ts        (Client export)
│   │   └── package.json
│   └── ui/                     (Shared UI components—optional phase 2)
├── turbo.json                  (Turborepo config)
├── pnpm-workspace.yaml         (pnpm monorepo root)
├── package.json                (root workspace)
├── expense.db                  (SQLite database file—git ignored)
└── .gitignore, .env.example

Database (SQLite):
  ├── transactions (id, amount, type: debit|credit, description, date)
  └── categories (id, name, color—populated by agent later)
```

## Plan

### Phase 1: Infrastructure & Schema (This Phase)

- **apps/web/**: Initialize Next.js 15 project with TypeScript, Tailwind CSS, shadcn/ui
- **packages/db/**: Set up Drizzle ORM + SQLite
  - `packages/db/src/schema.ts`: Define `transactions` and placeholder `categories` tables
  - `packages/db/src/index.ts`: Export database client for server components
  - SQLite database file: `expense.db` (git-ignored)
- **Root workspace**: Configure Turborepo, pnpm workspaces
  - `turbo.json` with build/dev/lint tasks
  - Root `package.json` with workspace definition
  - `.env.example` (minimal—SQLite file path is predictable)
- **CI/DX Setup**: Add `.gitignore` (node_modules, .next, .env.local, `*.db`), basic GitHub Actions (optional—defer if not needed)

### Phase 2: Transaction UI & API Routes (Next Phase)

- **Frontend**: Create transaction form (amount, type, description, date)
- **API routes** (`apps/web/src/app/api/`): POST `/transactions`, GET `/transactions`
- **Database**: Seed dummy data for testing
- **List view**: Display all transactions with filters (date range, type)

### Phase 3: AI Agent Integration (Future)

- Integrate Claude API for auto-categorization
- Categorization logic: analyze description → assign category
- Spending analytics view (by category, over time)
- Spending reduction suggestions (based on patterns)

## Edge cases & risks

- **Database access**: Ensure `packages/db` is only imported on server side; Next.js Server Components prevent accidental client-side DB access
- **SQLite concurrency**: SQLite has write-locking; if load grows, may need to scale to PostgreSQL later
- **Monorepo complexity**: pnpm workspaces + Turborepo may add overhead for a small project—revisit if it slows development

## Decisions locked in

- **Database**: SQLite + Drizzle ORM (lightweight, single-user, no server setup)
- **Authentication**: Omitted (single-user app, no auth logic needed)
- **API routes**: In `apps/web/src/app/api/` (Next.js handles backend)
- **UI**: Next.js, Tailwind CSS, shadcn/ui

## Review changelog

### Round 1 — 2026-07-12
- Switched from PostgreSQL + Prisma to SQLite + Drizzle (lighter for single user)
- Removed `users` table; simplified `transactions` schema (no userId field)
- API routes consolidated in `apps/web` (no separate backend service)
- Omitted authentication entirely (single-user app)
- Confirmed UI stack: Next.js, Tailwind, shadcn/ui
