import { formatAmount } from '@/lib/format';

type Summary = {
  credit: number;
  debit: number;
  balance: number;
  count: number;
};

export function SummaryCards({ summary }: { summary: Summary }) {
  const cards = [
    { label: 'Credits', value: summary.credit, tone: 'text-emerald-600' },
    { label: 'Debits', value: summary.debit, tone: 'text-red-600' },
    {
      label: 'Balance',
      value: summary.balance,
      tone: summary.balance >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-border bg-white p-4 shadow-sm dark:bg-slate-800"
        >
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className={`mt-1 text-2xl font-bold ${card.tone}`}>
            {formatAmount(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
