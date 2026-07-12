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
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Insights</h1>
            <p className="mt-1 text-muted-foreground">
              Where your money goes, and how to keep more of it
            </p>
          </div>
          <CategorizeButton pendingCount={pendingCount} />
        </div>

        <CategoryBars items={items} />

        <p className="text-sm text-muted-foreground">
          Looking for the full picture? See{' '}
          <Link href="/reports" className="underline hover:text-foreground">
            Reports
          </Link>{' '}
          for month-by-month numbers, or{' '}
          <Link href="/advice" className="underline hover:text-foreground">
            Advice
          </Link>{' '}
          for AI savings suggestions.
        </p>
      </div>
    </div>
  );
}
