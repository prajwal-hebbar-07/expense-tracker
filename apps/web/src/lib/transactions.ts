import { db, transactions, type Transaction } from '@expense-tracker/db';
import { and, desc, eq, gte, lte, type SQL } from 'drizzle-orm';
import { z } from 'zod';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');

export const transactionFilterSchema = z.object({
  type: z.enum(['debit', 'credit']).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
});

export const newTransactionSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  type: z.enum(['debit', 'credit']),
  description: z.string().trim().min(1, 'Description is required').max(500),
  date: isoDate.default(() => new Date().toISOString().slice(0, 10)),
});

export type TransactionFilters = z.infer<typeof transactionFilterSchema>;

export function getTransactions(filters: TransactionFilters): Transaction[] {
  const conditions: SQL[] = [];
  if (filters.type) conditions.push(eq(transactions.type, filters.type));
  if (filters.from) conditions.push(gte(transactions.date, filters.from));
  if (filters.to) conditions.push(lte(transactions.date, filters.to));

  return db
    .select()
    .from(transactions)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(transactions.date), desc(transactions.id))
    .all();
}

export function summarize(rows: Transaction[]) {
  let credit = 0;
  let debit = 0;
  for (const row of rows) {
    if (row.type === 'credit') credit += row.amount;
    else debit += row.amount;
  }
  return { credit, debit, balance: credit - debit, count: rows.length };
}
