import { CategoryBars } from '@/components/category-bars';
import { CategorizeButton } from '@/components/categorize-button';
import { formatAmount, formatDate } from '@/lib/format';
import { buildReport } from '@/lib/report';

export const dynamic = 'force-dynamic';

function formatMonth(month: string): string {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

export default function ReportsPage() {
  const report = buildReport();
  const { totals } = report;

  if (totals.count === 0 && report.accounts.length === 0) {
    return (
      <div className="page-shell">
        <div className="mx-auto max-w-5xl">
          <h1 className="page-heading">Reports</h1>
          <p className="mt-4 text-muted-foreground">
            No transactions yet — add some on the Transactions page and your
            reports will appear here.
          </p>
        </div>
      </div>
    );
  }

  const tiles = [
    { label: 'Total income', value: formatAmount(totals.credit), tone: 'text-emerald-400' },
    { label: 'Total spending', value: formatAmount(totals.debit), tone: 'text-rose-400' },
    {
      label: 'Net',
      value: formatAmount(totals.net),
      tone: totals.net >= 0 ? 'text-emerald-400' : 'text-rose-400',
    },
    {
      label: 'Savings rate',
      value: totals.savingsRate === null ? '—' : `${totals.savingsRate.toFixed(0)}%`,
      tone: 'text-foreground',
    },
    {
      label: 'Combined bank balance',
      value: formatAmount(report.totalBankBalance),
      tone: 'text-foreground',
    },
  ];

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl space-y-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Monthly review</p>
            <h1 className="page-heading">Reports</h1>
            <p className="page-description">
              Your complete spending picture, {totals.count} transactions
            </p>
          </div>
          <CategorizeButton pendingCount={report.uncategorized} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="surface p-4 sm:p-5"
            >
              <p className="min-h-8 text-xs font-medium leading-4 text-slate-500">{tile.label}</p>
              <p className={`mt-2 text-lg font-semibold tracking-tight ${tile.tone}`}>{tile.value}</p>
            </div>
          ))}
        </div>

        <div className="surface overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-slate-100">Month by month</h2>
            <p className="mt-1 text-sm text-slate-500">Income and outgoings over time</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-heading">
                  <th className="px-6 py-3 font-medium">Month</th>
                  <th className="px-6 py-3 text-right font-medium">Income</th>
                  <th className="px-6 py-3 text-right font-medium">Spending</th>
                  <th className="px-6 py-3 text-right font-medium">Net</th>
                </tr>
              </thead>
              <tbody>
                {report.months.map((row) => (
                  <tr key={row.month} className="border-b border-white/[0.05] transition hover:bg-white/[0.02] last:border-0">
                    <td className="px-6 py-4 font-medium text-slate-200">{formatMonth(row.month)}</td>
                    <td className="px-6 py-4 text-right text-emerald-400">
                      {formatAmount(row.credit)}
                    </td>
                    <td className="px-6 py-4 text-right text-rose-400">
                      {formatAmount(row.debit)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        row.net >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatAmount(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CategoryBars items={report.categories} />

        <div className="surface overflow-hidden">
          <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-slate-100">Spending by bank</h2>
            <p className="mt-1 text-sm text-slate-500">
              Individual account activity and consolidated balances
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-heading">
                  <th className="px-6 py-3 font-medium">Bank</th>
                  <th className="px-6 py-3 text-right font-medium">Money in</th>
                  <th className="px-6 py-3 text-right font-medium">Spent</th>
                  <th className="px-6 py-3 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {report.accounts.map((account) => (
                  <tr key={account.id ?? 'unassigned'} className="border-b border-white/[0.05] transition hover:bg-white/[0.02] last:border-0">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-200">{account.name}</span>
                      <span className="ml-2 text-xs text-slate-600">
                        {account.count} transaction{account.count === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-emerald-400">
                      {formatAmount(account.credit)}
                    </td>
                    <td className="px-6 py-4 text-right text-rose-400">
                      {formatAmount(account.debit)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-100">
                      {account.currentBalance === null ? '—' : formatAmount(account.currentBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-emerald-400/[0.07] font-semibold text-emerald-300">
                  <td className="px-6 py-4">Consolidated</td>
                  <td className="px-6 py-4 text-right">{formatAmount(totals.credit)}</td>
                  <td className="px-6 py-4 text-right">{formatAmount(totals.debit)}</td>
                  <td className="px-6 py-4 text-right">{formatAmount(report.totalBankBalance)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="surface p-5 sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-100">Largest expenses</h2>
          <ul>
            {report.topExpenses.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between gap-4 border-b border-white/[0.05] py-3 text-sm first:pt-0 last:border-0 last:pb-0"
              >
                <div>
                  <span className="font-medium">{tx.description}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatDate(tx.date)}
                    {tx.category ? ` · ${tx.category}` : ''}
                  </span>
                </div>
                <span className="whitespace-nowrap font-semibold text-rose-400">
                  {formatAmount(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
