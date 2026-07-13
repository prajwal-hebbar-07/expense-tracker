'use client';

import type { Transaction } from '@expense-tracker/db';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { AccountWithStats } from '@/lib/accounts';
import { BankSelect } from '@/components/bank-select';
import { formatAmount, formatDate } from '@/lib/format';

export function TransactionList({
  transactions,
  accounts,
}: {
  transactions: Transaction[];
  accounts: AccountWithStats[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setDeletingId(id);
    const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    if (response.ok) router.refresh();
  }

  async function handleAccountChange(id: number, value: string) {
    setUpdatingId(id);
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: value ? Number(value) : null }),
    });
    setUpdatingId(null);
    if (response.ok) router.refresh();
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] p-10 text-center text-slate-500">
        No transactions in this view yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 md:hidden">
        {transactions.map((tx) => (
          <article key={tx.id} className="surface p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">{tx.description}</p>
                <p className="mt-1 text-xs text-slate-600">{formatDate(tx.date)} · {tx.category ?? 'Uncategorized'}</p>
              </div>
              <p className={`whitespace-nowrap text-sm font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'}`}>
                {tx.type === 'credit' ? '+' : '−'}{formatAmount(tx.amount)}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
              {accounts.length > 0 ? (
                <BankSelect accounts={accounts} value={tx.accountId === null ? '' : String(tx.accountId)} onValueChange={(value) => handleAccountChange(tx.id, value)} disabled={updatingId === tx.id} ariaLabel={`Bank account for ${tx.description}`} emptyLabel="Unassigned" compact />
              ) : <span className="text-xs text-slate-600">Unassigned</span>}
              <button type="button" onClick={() => handleDelete(tx.id)} disabled={deletingId === tx.id} aria-label={`Delete ${tx.description}`} className="rounded-lg p-2 text-slate-600 transition hover:bg-rose-400/10 hover:text-rose-400 disabled:opacity-40">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="surface hidden max-w-full overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-heading">
              <th className="px-4 py-3.5 font-medium">Date</th>
              <th className="px-4 py-3.5 font-medium">Description</th>
              <th className="px-4 py-3.5 font-medium">Category</th>
              <th className="px-4 py-3.5 font-medium">Bank</th>
              <th className="px-4 py-3.5 text-right font-medium">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="group border-b border-white/[0.05] transition hover:bg-white/[0.025] last:border-0">
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{formatDate(tx.date)}</td>
                <td className="min-w-48 px-4 py-3.5 font-medium text-slate-200">{tx.description}</td>
                <td className="px-4 py-3.5">
                  {tx.category ? (
                    <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-slate-400">{tx.category}</span>
                  ) : <span className="text-xs text-slate-600">Pending AI</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">
                  {accounts.length > 0 ? (
                    <BankSelect accounts={accounts} value={tx.accountId === null ? '' : String(tx.accountId)} onValueChange={(value) => handleAccountChange(tx.id, value)} disabled={updatingId === tx.id} ariaLabel={`Bank account for ${tx.description}`} emptyLabel="Unassigned" compact />
                  ) : 'Unassigned'}
                </td>
                <td className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {tx.type === 'credit' ? '+' : '−'}{formatAmount(tx.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => handleDelete(tx.id)} disabled={deletingId === tx.id} aria-label={`Delete ${tx.description}`} className="rounded-lg p-1.5 text-slate-700 opacity-0 transition hover:bg-rose-400/10 hover:text-rose-400 focus:opacity-100 group-hover:opacity-100 disabled:opacity-40">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
