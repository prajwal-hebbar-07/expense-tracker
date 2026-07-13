import { Landmark, ReceiptText } from 'lucide-react';
import Link from 'next/link';

import { TransactionForm } from '@/components/transaction-form';
import { getAccountOverview } from '@/lib/accounts';
import { formatAmount } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default function AddTransactionPage() {
  const overview = getAccountOverview();

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Quick entry</p>
            <h1 className="page-heading">Add a transaction</h1>
            <p className="page-description">
              Record an expense or income without leaving the entry flow.
            </p>
          </div>
          <Link href="/transactions" className="secondary-button">
            <ReceiptText className="h-4 w-4" />
            View transactions
          </Link>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
          <TransactionForm accounts={overview.accounts} />

          <aside className="surface overflow-hidden">
            <div className="border-b border-white/[0.06] px-5 py-5">
              <p className="text-xs font-medium text-slate-500">Combined balance</p>
              <p className={`mt-1.5 text-2xl font-semibold tracking-tight ${overview.totalBalance >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
                {formatAmount(overview.totalBalance)}
              </p>
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Bank balances</h2>
                <Link href="/settings" className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300">
                  Manage
                </Link>
              </div>

              {overview.accounts.length > 0 ? (
                <ul className="mt-3 divide-y divide-white/[0.05]">
                  {overview.accounts.map((account) => (
                    <li key={account.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-0">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
                        <Landmark className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-300">
                        {account.name}
                      </span>
                      <span className={`text-sm font-semibold ${account.currentBalance >= 0 ? 'text-slate-200' : 'text-rose-400'}`}>
                        {formatAmount(account.currentBalance)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/[0.09] bg-white/[0.02] p-5 text-center">
                  <p className="text-sm text-slate-400">No bank accounts yet.</p>
                  <Link href="/settings" className="mt-2 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                    Add your first account
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
