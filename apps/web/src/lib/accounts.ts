import { bankAccounts, db, transactions, type BankAccount } from '@expense-tracker/db';
import { asc } from 'drizzle-orm';
import { z } from 'zod';

export const newAccountSchema = z.object({
  name: z.string().trim().min(2, 'Bank name is required').max(80),
  balance: z.coerce.number().finite('Balance must be a valid number'),
});

export const updateAccountSchema = newAccountSchema.partial().refine(
  (data) => data.name !== undefined || data.balance !== undefined,
  'Provide a name or balance to update',
);

export type AccountWithStats = BankAccount & {
  credit: number;
  debit: number;
  currentBalance: number;
  transactionCount: number;
};

export type AccountOverview = {
  accounts: AccountWithStats[];
  totalBalance: number;
  totalSpending: number;
  totalIncome: number;
  unassignedCount: number;
  unassignedSpending: number;
};

export function getAccountOverview(): AccountOverview {
  const accounts = db.select().from(bankAccounts).orderBy(asc(bankAccounts.name)).all();
  const rows = db.select().from(transactions).all();
  const totals = new Map<number, { credit: number; debit: number; count: number }>();
  let unassignedCount = 0;
  let unassignedSpending = 0;

  for (const transaction of rows) {
    if (transaction.accountId === null) {
      unassignedCount += 1;
      if (transaction.type === 'debit') unassignedSpending += transaction.amount;
      continue;
    }

    const current = totals.get(transaction.accountId) ?? { credit: 0, debit: 0, count: 0 };
    if (transaction.type === 'credit') current.credit += transaction.amount;
    else current.debit += transaction.amount;
    current.count += 1;
    totals.set(transaction.accountId, current);
  }

  const withStats = accounts.map((account) => {
    const activity = totals.get(account.id) ?? { credit: 0, debit: 0, count: 0 };
    return {
      ...account,
      credit: activity.credit,
      debit: activity.debit,
      currentBalance: account.openingBalance + activity.credit - activity.debit,
      transactionCount: activity.count,
    };
  });

  return {
    accounts: withStats,
    totalBalance: withStats.reduce((sum, account) => sum + account.currentBalance, 0),
    totalSpending: rows
      .filter((transaction) => transaction.type === 'debit')
      .reduce((sum, transaction) => sum + transaction.amount, 0),
    totalIncome: rows
      .filter((transaction) => transaction.type === 'credit')
      .reduce((sum, transaction) => sum + transaction.amount, 0),
    unassignedCount,
    unassignedSpending,
  };
}
