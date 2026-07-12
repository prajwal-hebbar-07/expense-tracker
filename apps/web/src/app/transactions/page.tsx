import { CategorizeButton } from '@/components/categorize-button';
import { FilterBar } from '@/components/filter-bar';
import { SummaryCards } from '@/components/summary-cards';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionList } from '@/components/transaction-list';
import { getTransactions, summarize, transactionFilterSchema } from '@/lib/transactions';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = transactionFilterSchema.safeParse(params);
  const filters = parsed.success ? parsed.data : {};

  const rows = getTransactions(filters);
  const summary = summarize(rows);
  const pendingCount = getTransactions({}).filter((tx) => tx.category === null).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="mt-1 text-muted-foreground">
            {summary.count} transaction{summary.count === 1 ? '' : 's'}
            {filters.type || filters.from || filters.to ? ' (filtered)' : ''}
          </p>
        </div>

        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <TransactionForm />
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FilterBar />
              <CategorizeButton pendingCount={pendingCount} />
            </div>
            <TransactionList transactions={rows} />
          </div>
        </div>
      </div>
    </div>
  );
}
