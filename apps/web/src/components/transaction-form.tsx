'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import type { AccountWithStats } from '@/lib/accounts';

const inputClass = 'field w-full';

export function TransactionForm({ accounts }: { accounts: AccountWithStats[] }) {
  const router = useRouter();
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setError(null);

    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: data.get('amount'),
        type,
        accountId: data.get('accountId'),
        description: data.get('description'),
        date: data.get('date'),
      }),
    });

    setSubmitting(false);
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const details = body?.details
        ? Object.values<string[]>(body.details).flat().join('; ')
        : null;
      setError(details || body?.error || 'Failed to save transaction');
      return;
    }

    form.reset();
    setType('debit');
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface p-5 sm:p-6 lg:sticky lg:top-24"
    >
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-950">Add transaction</h2>
        <p className="mt-1 text-sm text-slate-500">Record money in or out of your account.</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        {(['debit', 'credit'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${
              type === option
                ? option === 'debit'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="accountId" className="mb-1 block text-sm font-medium">
            Bank account
          </label>
          {accounts.length > 0 ? (
            <select id="accountId" name="accountId" required className={inputClass} defaultValue="">
              <option value="" disabled>Choose an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Add a bank account in{' '}
              <Link href="/settings" className="font-semibold underline underline-offset-4">Settings</Link>{' '}
              before recording transactions.
            </div>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="mb-1 block text-sm font-medium">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            maxLength={500}
            placeholder="e.g. Groceries at DMart"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || accounts.length === 0}
          className="primary-button mt-1 w-full"
        >
          {submitting ? 'Saving…' : `Add ${type}`}
        </button>
      </div>
    </form>
  );
}
