'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const inputClass =
  'field w-full';

export function TransactionForm() {
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
          disabled={submitting}
          className="primary-button mt-1 w-full"
        >
          {submitting ? 'Saving…' : `Add ${type}`}
        </button>
      </div>
    </form>
  );
}
