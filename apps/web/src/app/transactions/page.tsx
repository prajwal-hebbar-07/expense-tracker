import { CategorizeButton } from '@/components/categorize-button';
import { FilterBar } from '@/components/filter-bar';
import { SummaryCards } from '@/components/summary-cards';
import { TransactionForm } from '@/components/transaction-form';
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
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Cash flow
            </p>
            <h1 className="page-heading">Transactions</h1>
            <p className="page-description">
            {summary.count} transaction{summary.count === 1 ? '' : 's'}
            {filters.type || filters.account || filters.from || filters.to ? ' (filtered)' : ''}
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

        <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <TransactionForm accounts={accountOverview.accounts} />
          <div className="min-w-0 space-y-4">
            <div className="surface flex flex-wrap items-center justify-between gap-3 p-3">
              <FilterBar accounts={accountOverview.accounts} />
            </div>
            <TransactionList transactions={rows} accounts={accountOverview.accounts} />
          </div>
        </div>
      </div>
    </div>
  );
}
