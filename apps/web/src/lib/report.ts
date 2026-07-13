import { db, transactions, type Transaction } from '@expense-tracker/db';
import { desc } from 'drizzle-orm';

import { getAccountOverview } from '@/lib/accounts';

export type MonthRow = {
  month: string; // YYYY-MM
  credit: number;
  debit: number;
  net: number;
  count: number;
};

export type Report = {
  totals: {
    credit: number;
    debit: number;
    net: number;
    count: number;
    avgDailySpend: number;
    savingsRate: number | null; // null when no income recorded
    topCategory: { name: string; total: number } | null;
  };
  months: MonthRow[];
  categories: { name: string; total: number; count: number }[];
  topExpenses: Transaction[];
  accounts: {
    id: number | null;
    name: string;
    currentBalance: number | null;
    credit: number;
    debit: number;
    count: number;
  }[];
  totalBankBalance: number;
  uncategorized: number;
};

export function buildReport(): Report {
  const rows = db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.date), desc(transactions.id))
    .all();

  const debits = rows.filter((tx) => tx.type === 'debit');
  const credit = rows
    .filter((tx) => tx.type === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const debit = debits.reduce((sum, tx) => sum + tx.amount, 0);

  const byMonth = new Map<string, MonthRow>();
  for (const tx of rows) {
    const month = tx.date.slice(0, 7);
    const entry =
      byMonth.get(month) ?? { month, credit: 0, debit: 0, net: 0, count: 0 };
    if (tx.type === 'credit') entry.credit += tx.amount;
    else entry.debit += tx.amount;
    entry.net = entry.credit - entry.debit;
    entry.count += 1;
    byMonth.set(month, entry);
  }

  const byCategory = new Map<string, { name: string; total: number; count: number }>();
  for (const tx of debits) {
    const name = tx.category ?? 'Uncategorized';
    const entry = byCategory.get(name) ?? { name, total: 0, count: 0 };
    entry.total += tx.amount;
    entry.count += 1;
    byCategory.set(name, entry);
  }
  const categories = [...byCategory.values()].sort((a, b) => b.total - a.total);

  const spendDays = new Set(debits.map((tx) => tx.date)).size;
  const accountOverview = getAccountOverview();
  const accountRows: Report['accounts'] = accountOverview.accounts.map((account) => ({
    id: account.id,
    name: account.name,
    currentBalance: account.currentBalance,
    credit: account.credit,
    debit: account.debit,
    count: account.transactionCount,
  }));
  const unassigned = rows.filter((transaction) => transaction.accountId === null);
  if (unassigned.length > 0) {
    accountRows.push({
      id: null,
      name: 'Unassigned',
      currentBalance: null,
      credit: unassigned
        .filter((transaction) => transaction.type === 'credit')
        .reduce((sum, transaction) => sum + transaction.amount, 0),
      debit: unassigned
        .filter((transaction) => transaction.type === 'debit')
        .reduce((sum, transaction) => sum + transaction.amount, 0),
      count: unassigned.length,
    });
  }

  return {
    totals: {
      credit,
      debit,
      net: credit - debit,
      count: rows.length,
      avgDailySpend: spendDays > 0 ? debit / spendDays : 0,
      savingsRate: credit > 0 ? ((credit - debit) / credit) * 100 : null,
      topCategory: categories[0]
        ? { name: categories[0].name, total: categories[0].total }
        : null,
    },
    months: [...byMonth.values()].sort((a, b) => b.month.localeCompare(a.month)),
    categories,
    topExpenses: [...debits].sort((a, b) => b.amount - a.amount).slice(0, 5),
    accounts: accountRows,
    totalBankBalance: accountOverview.totalBalance,
    uncategorized: rows.filter((tx) => tx.category === null).length,
  };
}
