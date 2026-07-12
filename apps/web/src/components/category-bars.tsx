import { formatAmount } from '@/lib/format';

export type CategoryTotal = {
  name: string;
  total: number;
  count: number;
};

export function CategoryBars({ items }: { items: CategoryTotal[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
        No expenses to break down yet.
      </div>
    );
  }

  const max = Math.max(...items.map((item) => item.total));
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-800">
      <h2 className="mb-1 text-lg font-semibold">Spending by category</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        {formatAmount(grandTotal)} total across {items.length} categories
      </p>
      <ul className="space-y-4">
        {items.map((item) => {
          const share = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
          return (
            <li
              key={item.name}
              title={`${item.name}: ${formatAmount(item.total)} — ${item.count} transaction${item.count === 1 ? '' : 's'} (${share.toFixed(1)}%)`}
            >
              <div className="mb-1 flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="whitespace-nowrap text-muted-foreground">
                  {formatAmount(item.total)}
                  <span className="ml-2 tabular-nums">{share.toFixed(0)}%</span>
                </span>
              </div>
              <div className="h-2 rounded bg-muted">
                <div
                  className="h-2 rounded bg-[#2a78d6] dark:bg-[#3987e5]"
                  style={{ width: `${(item.total / max) * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
