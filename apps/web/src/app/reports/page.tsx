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

  if (totals.count === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="mt-4 text-muted-foreground">
            No transactions yet — add some on the Transactions page and your
            reports will appear here.
          </p>
        </div>
      </div>
    );
  }

  const tiles = [
    { label: 'Total income', value: formatAmount(totals.credit), tone: 'text-emerald-600' },
    { label: 'Total spending', value: formatAmount(totals.debit), tone: 'text-red-600' },
    {
      label: 'Net',
      value: formatAmount(totals.net),
      tone: totals.net >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
    {
      label: 'Savings rate',
      value: totals.savingsRate === null ? '—' : `${totals.savingsRate.toFixed(0)}%`,
      tone: 'text-foreground',
    },
    {
      label: 'Avg spend per active day',
      value: formatAmount(totals.avgDailySpend),
      tone: 'text-foreground',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="mt-1 text-muted-foreground">
              Your complete spending picture, {totals.count} transactions
            </p>
          </div>
          <CategorizeButton pendingCount={report.uncategorized} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="rounded-lg border border-border bg-white p-4 shadow-sm dark:bg-slate-800"
            >
              <p className="text-xs text-muted-foreground">{tile.label}</p>
              <p className={`mt-1 text-lg font-bold ${tile.tone}`}>{tile.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">Month by month</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4 font-medium">Month</th>
                  <th className="py-2 pr-4 text-right font-medium">Income</th>
                  <th className="py-2 pr-4 text-right font-medium">Spending</th>
                  <th className="py-2 text-right font-medium">Net</th>
                </tr>
              </thead>
              <tbody>
                {report.months.map((row) => (
                  <tr key={row.month} className="border-b border-border last:border-0">
                    <td className="py-2 pr-4 font-medium">{formatMonth(row.month)}</td>
                    <td className="py-2 pr-4 text-right text-emerald-600">
                      {formatAmount(row.credit)}
                    </td>
                    <td className="py-2 pr-4 text-right text-red-600">
                      {formatAmount(row.debit)}
                    </td>
                    <td
                      className={`py-2 text-right font-semibold ${
                        row.net >= 0 ? 'text-emerald-600' : 'text-red-600'
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

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-800">
          <h2 className="mb-4 text-lg font-semibold">Largest expenses</h2>
          <ul className="space-y-2">
            {report.topExpenses.map((tx) => (
              <li
                key={tx.id}
                className="flex items-baseline justify-between gap-4 border-b border-border pb-2 text-sm last:border-0"
              >
                <div>
                  <span className="font-medium">{tx.description}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {formatDate(tx.date)}
                    {tx.category ? ` · ${tx.category}` : ''}
                  </span>
                </div>
                <span className="whitespace-nowrap font-semibold text-red-600">
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
