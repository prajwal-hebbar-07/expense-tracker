'use client';

import type { Transaction } from '@expense-tracker/db';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { formatAmount, formatDate } from '@/lib/format';

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setDeletingId(id);
    const response = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    if (response.ok) router.refresh();
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        No transactions yet. Add your first one on the left.
      </div>
    );
  }

  return (
    <div className="surface max-w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3.5 font-medium">Date</th>
            <th className="px-4 py-3.5 font-medium">Description</th>
            <th className="px-4 py-3.5 font-medium">Category</th>
            <th className="px-4 py-3.5 text-right font-medium">Amount</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="group border-b border-slate-100 transition hover:bg-slate-50/60 last:border-0">
              <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">
                {formatDate(tx.date)}
              </td>
              <td className="min-w-48 px-4 py-3.5 font-medium text-slate-800">{tx.description}</td>
              <td className="px-4 py-3.5">
                {tx.category ? (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {tx.category}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Pending AI</span>
                )}
              </td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                  tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                }`}
              >
                {tx.type === 'credit' ? '+' : '−'}
                {formatAmount(tx.amount)}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => handleDelete(tx.id)}
                  disabled={deletingId === tx.id}
                  aria-label={`Delete ${tx.description}`}
                  className="rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 group-hover:opacity-100 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
