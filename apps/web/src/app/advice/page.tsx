import { db, transactions } from '@expense-tracker/db';

import { CategorizeButton } from '@/components/categorize-button';
import { InsightsPanel } from '@/components/insights-panel';

export const dynamic = 'force-dynamic';

export default function AdvicePage() {
  const rows = db.select().from(transactions).all();
  const pendingCount = rows.filter((tx) => tx.category === null).length;

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Occasional review</p>
            <h1 className="page-heading">Savings advice</h1>
            <p className="page-description">
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
