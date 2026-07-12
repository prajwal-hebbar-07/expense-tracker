'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const inputClass =
  'w-full rounded-md border border-border bg-background px-3 py-2 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-ring';

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
      className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-800"
    >
      <h2 className="mb-4 text-lg font-semibold">Add transaction</h2>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-md bg-muted p-1">
        {(['debit', 'credit'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`rounded px-3 py-1.5 text-sm font-medium capitalize transition ${
              type === option
                ? option === 'debit'
                  ? 'bg-red-600 text-white'
                  : 'bg-emerald-600 text-white'
                : 'text-muted-foreground hover:text-foreground'
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
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Saving…' : `Add ${type}`}
        </button>
      </div>
    </form>
  );
}
