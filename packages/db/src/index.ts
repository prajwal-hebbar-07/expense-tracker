import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { bankAccounts, categories, transactions } from './schema';

// Resolve the SQLite file to the workspace root so every package
// (web dev server, seed script, drizzle-kit) hits the same database
// no matter which directory it runs from.
function defaultDbPath(): string {
  let dir = process.cwd();
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return join(dir, 'expense.db');
    }
    const parent = dirname(dir);
    if (parent === dir) return join(process.cwd(), 'expense.db');
    dir = parent;
  }
}

function createDb(): BetterSQLite3Database {
  const url = process.env.DATABASE_URL;
  const path = url ? url.replace(/^file:/, '') : defaultDbPath();
  const sqlite = new Database(path);
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('journal_mode = WAL');
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      opening_balance REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      account_id INTEGER REFERENCES bank_accounts(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const transactionColumns = sqlite
    .prepare('PRAGMA table_info(transactions)')
    .all() as { name: string }[];
  if (!transactionColumns.some((column) => column.name === 'account_id')) {
    try {
      sqlite.exec(
        'ALTER TABLE transactions ADD COLUMN account_id INTEGER REFERENCES bank_accounts(id) ON DELETE SET NULL',
      );
    } catch (error) {
      if (!(error instanceof Error) || !error.message.includes('duplicate column name')) {
        throw error;
      }
    }
  }
  return drizzle(sqlite);
}

// Reuse one connection across Next.js dev hot reloads.
const globalForDb = globalThis as unknown as { __expenseDb?: BetterSQLite3Database };

export const db = globalForDb.__expenseDb ?? createDb();
if (process.env.NODE_ENV !== 'production') {
  globalForDb.__expenseDb = db;
}

export { bankAccounts, categories, transactions };
export type {
  BankAccount,
  Category,
  NewBankAccount,
  NewCategory,
  NewTransaction,
  Transaction,
} from './schema';
