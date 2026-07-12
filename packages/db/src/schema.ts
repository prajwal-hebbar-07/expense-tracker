import { integer, real, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  amount: real('amount').notNull(),
  type: text('type', { enum: ['debit', 'credit'] }).notNull(),
  description: text('description').notNull(),
  date: text('date').notNull(),
  category: text('category'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  color: text('color'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
