import { formatAmount } from '@/lib/format';

export type CategoryTotal = {
  name: string;
  total: number;
  count: number;
};

export function CategoryBars({ items }: { items: CategoryTotal[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-10 text-center text-slate-500">
        No expenses to break down yet.
      </div>
    );
  }

  const max = Math.max(...items.map((item) => item.total));
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Spending by category</h2>
          <p className="mt-1 text-sm text-slate-500">
        {formatAmount(grandTotal)} total across {items.length} categories
          </p>
        </div>
        <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-medium text-slate-400">
          {items.reduce((sum, item) => sum + item.count, 0)} expenses
        </span>
      </div>
      <ul className="mt-7 space-y-5">
        {items.map((item, index) => {
          const share = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
          const barTones = ['bg-emerald-400', 'bg-teal-400', 'bg-cyan-400', 'bg-sky-400', 'bg-indigo-400', 'bg-slate-500'];
          return (
            <li
              key={item.name}
              title={`${item.name}: ${formatAmount(item.total)} — ${item.count} transaction${item.count === 1 ? '' : 's'} (${share.toFixed(1)}%)`}
            >
              <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium text-slate-300">{item.name}</span>
                <span className="whitespace-nowrap text-slate-500">
                  {formatAmount(item.total)}
                  <span className="ml-2 font-medium tabular-nums text-slate-300">{share.toFixed(0)}%</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full ${barTones[index % barTones.length]}`}
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
