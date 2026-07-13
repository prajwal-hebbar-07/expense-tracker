# Ledger

Ledger is a private, transaction-first expense tracker for recording income and
expenses across multiple bank accounts. It includes consolidated balances,
per-bank spending, weekly analytics, monthly reports, and optional AI-powered
categorization and savings advice through Ollama.

The application runs locally, uses SQLite, and does not require user accounts or
authentication. It is intended for personal, single-user use.

## Requirements

- Node.js 20 or newer
- [pnpm](https://pnpm.io/) 11.x
- Ollama, only if AI categorization or advice is required

The repository declares its pnpm version in `package.json`. Corepack can install
and activate the correct version:

```bash
corepack enable
corepack prepare pnpm@11.11.0 --activate
```

## Quick start

Install dependencies from the repository root:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The root URL redirects to
the dedicated Add transaction page.

For a clean first run:

1. Open **Settings** and add at least one bank account.
2. Enter the account's current balance.
3. Return to **Transactions** and record an expense or income entry.

## Commands

Run these commands from the repository root unless stated otherwise.

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install all workspace dependencies. |
| `pnpm dev` | Start the web application in development mode. |
| `pnpm build` | Create a production build for all workspace packages. Stop the development server first. |
| `pnpm lint` | Run the configured lint task for workspace packages. |
| `pnpm seed` | Insert sample transactions when the database has no transactions. |
| `pnpm db:reset` | Permanently remove all transactions, bank accounts, categories, and their ID sequences. |
| `pnpm --filter @expense-tracker/db db:push` | Push the Drizzle schema to the configured SQLite database. |
| `pnpm --filter @expense-tracker/web dev` | Start only the Next.js web package. |
| `pnpm --filter @expense-tracker/web build` | Build only the Next.js web package. |

### Building while development is running

Next.js normally writes development and production assets to the same `.next`
directory. This project supports a separate directory for verification builds:

```bash
NEXT_DIST_DIR=.next-build pnpm --filter @expense-tracker/web build
```

This prevents a production build from replacing the CSS and JavaScript used by
an active development server. The `.next-build` directory is generated output
and can be deleted after verification.

## Using Ledger

### Bank accounts

Open **Settings** to add accounts such as SBI or HDFC. Each account has a name
and an opening balance. Ledger calculates its current balance as:

```text
current balance = opening balance + recorded income - recorded expenses
```

Editing the displayed balance updates the account's opening balance so that the
calculated current balance matches the value entered. Deleting an account does
not delete its transactions; those transactions remain in consolidated figures
and become unassigned.

### Transactions

The **Add transaction** page is the focused entry workspace. Adding transactions
is kept separate from browsing and maintaining transaction history. A
transaction contains:

- Type: expense or income
- Amount
- Description
- Bank account
- Date
- Category, when assigned by AI

The bank with the most recorded transactions is selected by default. The
selected bank remains active after saving so repeated entries are quicker.

The **Transactions** page contains only balances and transaction history.
Existing transactions can be filtered by type, bank, and date range. Their bank
can also be reassigned from the transaction list. Deleting a transaction updates
all balances, summaries, analytics, and reports immediately.

### Analytics

**Analytics** groups expenses by category and displays each category's value,
share of spending, and transaction count. Opening this page reads local SQLite
data only and does not call an AI model.

### Reports

**Reports** provides:

- Total income, total spending, net cash flow, and savings rate
- Combined current bank balance
- Month-by-month income and spending
- Spending by category
- Income, spending, and balance for each bank
- Consolidated totals and the five largest expenses

Opening this page reads local SQLite data only and does not call an AI model.

### Advice

**Advice** generates a personalized overview and actionable savings suggestions
from recorded spending. Opening the page does not call AI. Pressing **Get
advice** or **Regenerate** makes one Ollama request each time.

### AI categorization

Transactions start without a category. The **Categorize with AI** action sends
all currently uncategorized transactions in one batch to Ollama. Therefore:

- Opening Transactions, Analytics, Reports, or Advice: **0 AI calls**
- Categorizing any number of pending transactions: **1 AI call**
- Categorizing when nothing is pending: **0 AI calls**
- Getting or regenerating advice: **1 AI call**

Supported categories are Food & Dining, Groceries, Transport, Entertainment,
Subscriptions, Shopping, Utilities, Health, Travel, Income, and Other.

## Ollama configuration

AI features use Ollama's chat API. The defaults are:

```text
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=minimax-m3:cloud
```

Start Ollama before using AI features. If the configured cloud model reports an
authorization error, authenticate with:

```bash
ollama signin
```

To use another local or cloud model, set the environment variable when starting
the application:

```bash
OLLAMA_MODEL=your-model-name pnpm dev
```

To use an Ollama server at another address:

```bash
OLLAMA_URL=http://192.168.1.10:11434 pnpm dev
```

The rest of Ledger works without Ollama. Only categorization and advice require
it.

## Database

Ledger stores data in `expense.db` at the workspace root. Tables and compatible
schema updates are created automatically when the database package starts.

To use a different SQLite file, provide an absolute `DATABASE_URL`:

```bash
DATABASE_URL=file:/absolute/path/to/ledger.db pnpm dev
```

The database enables foreign keys and SQLite WAL mode. Bank deletion uses
`ON DELETE SET NULL`, which preserves transaction history.

### Reset all data

Stop the development server before resetting the database, then run:

```bash
pnpm db:reset
```

This operation cannot be undone. It removes:

- All transactions
- All bank accounts
- All categories
- SQLite auto-increment sequences for those tables

It keeps the SQLite file and schema in place, ready for a fresh start.

### Add sample data

```bash
pnpm seed
```

The seed command adds 12 sample transactions only when no transactions exist.
It does not create bank accounts, so seeded transactions appear as unassigned.
Running it again while transactions exist safely skips the seed.

To rebuild a sample database from scratch:

```bash
pnpm db:reset
pnpm seed
```

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `DATABASE_URL` | `file:<workspace>/expense.db` | SQLite database location. |
| `NEXT_PUBLIC_CURRENCY` | `INR` | Currency code used to format displayed amounts. |
| `OLLAMA_URL` | `http://localhost:11434` | Ollama server URL. |
| `OLLAMA_MODEL` | `minimax-m3:cloud` | Model used for categorization and advice. |
| `NEXT_DIST_DIR` | `.next` | Next.js output directory; useful for isolated builds. |

Example using a different currency and database:

```bash
NEXT_PUBLIC_CURRENCY=USD \
DATABASE_URL=file:/absolute/path/to/ledger-usd.db \
pnpm dev
```

## Project structure

```text
expense-tracker/
├── apps/
│   └── web/                 Next.js application, pages, components, and APIs
├── packages/
│   └── db/                  SQLite connection, Drizzle schema, seed, and reset
├── expense.db               Local SQLite data, created at runtime
├── package.json             Root workspace commands
├── pnpm-workspace.yaml      Workspace package definition
└── turbo.json               Turborepo task configuration
```

Important application routes:

| Route | Purpose |
| --- | --- |
| `/add` | Record a new expense or income entry. |
| `/transactions` | Filter, reassign, and delete transaction history. |
| `/analytics` | Review category-level spending. |
| `/reports` | Review monthly, bank-level, and consolidated reports. |
| `/advice` | Request AI-generated savings guidance. |
| `/settings` | Add, edit, and remove bank accounts. |

## Production

Create a production build:

```bash
pnpm build
```

Start the built web package:

```bash
pnpm --filter @expense-tracker/web start
```

The application has no authentication and is designed for local personal use.
Do not expose it directly to the public internet without adding access controls.

## License

MIT
