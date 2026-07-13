'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';

import type { AccountWithStats } from '@/lib/accounts';
import { BankSelect } from '@/components/bank-select';

const inputClass = 'field w-full';

export function TransactionForm({ accounts }: { accounts: AccountWithStats[] }) {
  const router = useRouter();
  const preferredAccount = accounts.reduce<AccountWithStats | null>(
    (current, account) => !current || account.transactionCount > current.transactionCount ? account : current,
    null,
  );
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [accountId, setAccountId] = useState(preferredAccount ? String(preferredAccount.id) : '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setError(null);
    setSaved(null);

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
    setSaved(type === 'debit' ? 'Expense added successfully.' : 'Income added successfully.');
    setType('debit');
    requestAnimationFrame(() => form.querySelector<HTMLInputElement>('#amount')?.focus());
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="surface overflow-hidden"
    >
      <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <Plus className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-50">Record transaction</h2>
            <p className="mt-0.5 text-xs text-slate-500">Usually takes less than 10 seconds</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-black/25 p-1">
        {(['debit', 'credit'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              type === option
                ? option === 'debit'
                  ? 'bg-[#1b2029] text-rose-400 shadow-sm'
                  : 'bg-[#1b2029] text-emerald-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-300'
            }`}
          >
            {option === 'debit' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
            {option === 'debit' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        <div>
          <label htmlFor="amount" className="mb-1.5 block text-xs font-medium text-slate-400">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-medium text-slate-600">₹</span>
            <input
              id="amount"
              name="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              required
              autoFocus
              placeholder="0.00"
              className="field w-full !py-3.5 !pl-9 text-xl font-semibold tracking-tight"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-xs font-medium text-slate-400">
            What was it for?
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            maxLength={500}
            placeholder="Groceries, fuel, rent…"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_145px] gap-3">
          <div className="min-w-0">
            <label htmlFor="accountId" className="mb-1.5 block text-xs font-medium text-slate-400">Paid with</label>
            {accounts.length > 0 ? (
              <BankSelect accounts={accounts} value={accountId} onValueChange={setAccountId} name="accountId" ariaLabel="Bank account for new transaction" />
            ) : (
              <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.07] p-3 text-sm text-amber-300">
                Add an account in <Link href="/settings" className="font-semibold underline underline-offset-4">Settings</Link> first.
              </div>
            )}
          </div>
          <div>
            <label htmlFor="date" className="mb-1.5 block text-xs font-medium text-slate-400">Date</label>
            <input id="date" name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className={inputClass} />
          </div>
        </div>

        {error && <p className="text-sm text-rose-400">{error}</p>}
        {saved && <p role="status" className="text-sm text-emerald-400">{saved}</p>}

        <button
          type="submit"
          disabled={submitting || accounts.length === 0 || !accountId}
          className="primary-button mt-1 w-full !py-3"
        >
          <Plus className="h-4 w-4" />
          {submitting ? 'Saving…' : type === 'debit' ? 'Add expense' : 'Add income'}
        </button>
      </div>
      </div>
    </form>
  );
}
