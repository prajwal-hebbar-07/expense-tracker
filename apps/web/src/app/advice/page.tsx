import { db, transactions } from '@expense-tracker/db';

import { CategorizeButton } from '@/components/categorize-button';
import { InsightsPanel } from '@/components/insights-panel';

export const dynamic = 'force-dynamic';

export default function AdvicePage() {
  const rows = db.select().from(transactions).all();
  const pendingCount = rows.filter((tx) => tx.category === null).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Advice</h1>
            <p className="mt-1 text-muted-foreground">
              AI-powered suggestions to change your spending cycle and save more
            </p>
          </div>
          <CategorizeButton pendingCount={pendingCount} />
        </div>

        <InsightsPanel />
      </div>
    </div>
  );
}
