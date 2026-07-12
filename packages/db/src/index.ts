import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { transactions, categories } from './schema';

const dbPath = process.env.DATABASE_URL || 'file:./expense.db';
const sqliteDb = new Database(dbPath.replace('file:', ''));

export const db = drizzle(sqliteDb);

export { transactions, categories };
export type * from './types';
