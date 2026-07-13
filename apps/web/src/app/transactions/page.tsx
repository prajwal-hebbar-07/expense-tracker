import { CategorizeButton } from '@/components/categorize-button';
import { FilterBar } from '@/components/filter-bar';
import { SummaryCards } from '@/components/summary-cards';
import { TransactionList } from '@/components/transaction-list';
import { getAccountOverview } from '@/lib/accounts';
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
  const accountOverview = getAccountOverview();
  const pendingCount = getTransactions({}).filter((tx) => tx.category === null).length;
  const selectedAccount = filters.account
    ? accountOverview.accounts.find((account) => account.id === filters.account)
    : null;

  return (
    <div className="page-shell">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Your ledger</p>
            <h1 className="page-heading">Money, at a glance</h1>
            <p className="page-description">
              {summary.count} transaction{summary.count === 1 ? '' : 's'} recorded
              {filters.type || filters.account || filters.from || filters.to ? ' in this view' : ''}
            </p>
          </div>
          <CategorizeButton pendingCount={pendingCount} />
        </div>

        <SummaryCards
          summary={summary}
          balance={
            accountOverview.accounts.length > 0
              ? selectedAccount?.currentBalance ?? accountOverview.totalBalance
              : undefined
          }
          balanceLabel={selectedAccount ? `${selectedAccount.name} balance` : 'Combined balance'}
        />

        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Transaction history</h2>
              <p className="mt-0.5 text-xs text-slate-500">Filter, reassign, or remove recorded transactions</p>
            </div>
          </div>
          <div className="surface flex flex-wrap items-center justify-between gap-3 p-3">
            <FilterBar accounts={accountOverview.accounts} />
          </div>
          <TransactionList transactions={rows} accounts={accountOverview.accounts} />
        </section>
      </div>
    </div>
  );
}
