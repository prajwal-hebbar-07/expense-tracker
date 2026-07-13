import { formatAmount } from '@/lib/format';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

type Summary = {
  credit: number;
  debit: number;
  balance: number;
  count: number;
};

export function SummaryCards({
  summary,
  balance,
  balanceLabel = 'Balance',
}: {
  summary: Summary;
  balance?: number;
  balanceLabel?: string;
}) {
  const cards = [
    {
      label: 'Money in',
      value: summary.credit,
      tone: 'text-emerald-400',
      icon: ArrowDownLeft,
      iconTone: 'bg-emerald-400/10 text-emerald-400',
    },
    {
      label: 'Money out',
      value: summary.debit,
      tone: 'text-rose-400',
      icon: ArrowUpRight,
      iconTone: 'bg-rose-400/10 text-rose-400',
    },
    {
      label: balanceLabel,
      value: balance ?? summary.balance,
      tone: (balance ?? summary.balance) >= 0 ? 'text-slate-100' : 'text-rose-400',
      icon: Wallet,
      iconTone: 'bg-white/[0.06] text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
        <div
          key={card.label}
          className="surface flex items-center justify-between gap-4 p-4 sm:p-5"
        >
          <div>
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className={`mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl ${card.tone}`}>
              {formatAmount(card.value)}
            </p>
          </div>
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${card.iconTone}`}>
            <Icon className="h-5 w-5" />
          </span>
        </div>
        );
      })}
    </div>
  );
}
