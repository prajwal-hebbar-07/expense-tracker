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
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
        No transactions yet. Add your first one on the left.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white shadow-sm dark:bg-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-border last:border-0">
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                {formatDate(tx.date)}
              </td>
              <td className="px-4 py-3">{tx.description}</td>
              <td className="px-4 py-3">
                {tx.category ? (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {tx.category}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">pending AI</span>
                )}
              </td>
              <td
                className={`whitespace-nowrap px-4 py-3 text-right font-semibold ${
                  tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'
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
                  className="text-muted-foreground transition hover:text-red-600 disabled:opacity-50"
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
