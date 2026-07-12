import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { categories, transactions } from './schema';

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
  sqlite.pragma('journal_mode = WAL');
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return drizzle(sqlite);
}

// Reuse one connection across Next.js dev hot reloads.
const globalForDb = globalThis as unknown as { __expenseDb?: BetterSQLite3Database };

export const db = globalForDb.__expenseDb ?? createDb();
if (process.env.NODE_ENV !== 'production') {
  globalForDb.__expenseDb = db;
}

export { transactions, categories };
export type { Transaction, NewTransaction, Category, NewCategory } from './schema';
