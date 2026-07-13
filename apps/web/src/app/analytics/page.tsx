import { db, transactions } from '@expense-tracker/db';
import Link from 'next/link';

import { CategoryBars, type CategoryTotal } from '@/components/category-bars';
import { CategorizeButton } from '@/components/categorize-button';

export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  const rows = db.select().from(transactions).all();
  const debits = rows.filter((tx) => tx.type === 'debit');
  const pendingCount = rows.filter((tx) => tx.category === null).length;

  const byCategory = new Map<string, CategoryTotal>();
  for (const tx of debits) {
    const name = tx.category ?? 'Uncategorized';
    const entry = byCategory.get(name) ?? { name, total: 0, count: 0 };
    entry.total += tx.amount;
    entry.count += 1;
    byCategory.set(name, entry);
  }
  const items = [...byCategory.values()].sort((a, b) => b.total - a.total);

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Weekly review</p>
            <h1 className="page-heading">Analytics & insights</h1>
            <p className="page-description">
              Where your money goes, and how to keep more of it
            </p>
          </div>
          <CategorizeButton pendingCount={pendingCount} />
        </div>

        <CategoryBars items={items} />

        <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.06] px-4 py-3 text-sm text-slate-400">
          Looking for the full picture? See{' '}
          <Link href="/reports" className="font-semibold text-emerald-300 underline decoration-emerald-400/40 underline-offset-4">
            Reports
          </Link>{' '}
          for month-by-month numbers, or{' '}
          <Link href="/advice" className="font-semibold text-emerald-300 underline decoration-emerald-400/40 underline-offset-4">
            Advice
          </Link>{' '}
          for AI savings suggestions.
        </div>
      </div>
    </div>
  );
}
