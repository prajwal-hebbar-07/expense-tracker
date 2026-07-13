'use client';

import { Check, Landmark, Pencil, Plus, Trash2, WalletCards, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import type { AccountOverview, AccountWithStats } from '@/lib/accounts';
import { formatAmount } from '@/lib/format';

function apiError(body: unknown, fallback: string): string {
  if (body && typeof body === 'object') {
    const value = body as { error?: string; details?: Record<string, string[]> };
    if (value.details) {
      const detail = Object.values(value.details).flat().at(0);
      if (detail) return detail;
    }
    if (value.error) return value.error;
  }
  return fallback;
}

export function AccountManager({ overview }: { overview: AccountOverview }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);

    const response = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.get('name'), balance: data.get('balance') }),
    });
    const body = await response.json().catch(() => null);
    setBusy(false);

    if (!response.ok) {
      setError(apiError(body, 'Could not add account'));
      return;
    }

    form.reset();
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <OverviewCard label="Combined balance" value={formatAmount(overview.totalBalance)} />
        <OverviewCard label="Total money in" value={formatAmount(overview.totalIncome)} tone="text-emerald-700" />
        <OverviewCard label="Total spent" value={formatAmount(overview.totalSpending)} tone="text-rose-600" />
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="surface overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-slate-950">Bank accounts</h2>
            <p className="mt-1 text-sm text-slate-500">
              Balances update automatically as you add transactions.
            </p>
          </div>

          {overview.accounts.length === 0 ? (
            <div className="grid min-h-64 place-items-center px-6 py-12 text-center">
              <div>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Landmark className="h-6 w-6" />
                </span>
                <p className="mt-4 font-medium text-slate-800">Add your first bank account</p>
                <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
                  Start with SBI, HDFC, or whichever account you use most often.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {overview.accounts.map((account) => (
                <AccountRow key={account.id} account={account} />
              ))}
            </div>
          )}

          {overview.unassignedCount > 0 && (
            <div className="border-t border-amber-100 bg-amber-50/70 px-5 py-3 text-sm text-amber-800 sm:px-6">
              {overview.unassignedCount} older transaction{overview.unassignedCount === 1 ? '' : 's'}{' '}
              remain unassigned ({formatAmount(overview.unassignedSpending)} spent). Assign them from
              the Transactions table.
            </div>
          )}
        </section>

        <form onSubmit={addAccount} className="surface p-5 sm:p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Plus className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-950">Add account</h2>
              <p className="mt-0.5 text-sm text-slate-500">Connect a bank to your ledger.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Bank name
              <input
                name="name"
                required
                maxLength={80}
                placeholder="e.g. SBI"
                className="field mt-1.5 w-full"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Current balance
              <input
                name="balance"
                type="number"
                inputMode="decimal"
                step="0.01"
                required
                placeholder="0.00"
                className="field mt-1.5 w-full"
              />
            </label>
            <p className="text-xs leading-5 text-slate-500">
              Future credits and debits will adjust this balance automatically.
            </p>
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button type="submit" disabled={busy} className="primary-button w-full">
              <Plus className="h-4 w-4" />
              {busy ? 'Adding…' : 'Add bank account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OverviewCard({ label, value, tone = 'text-slate-950' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="surface flex items-center justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className={`mt-1.5 text-2xl font-semibold tracking-tight ${tone}`}>{value}</p>
      </div>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
        <WalletCards className="h-5 w-5" />
      </span>
    </div>
  );
}

function AccountRow({ account }: { account: AccountWithStats }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/accounts/${account.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.get('name'), balance: data.get('balance') }),
    });
    const body = await response.json().catch(() => null);
    setBusy(false);
    if (!response.ok) {
      setError(apiError(body, 'Could not update account'));
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function remove() {
    const confirmed = window.confirm(
      `Remove ${account.name}? Its transactions will remain in your consolidated reports as unassigned.`,
    );
    if (!confirmed) return;
    setBusy(true);
    setError(null);
    const response = await fetch(`/api/accounts/${account.id}`, { method: 'DELETE' });
    const body = await response.json().catch(() => null);
    setBusy(false);
    if (!response.ok) {
      setError(apiError(body, 'Could not remove account'));
      return;
    }
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={save} className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <input name="name" defaultValue={account.name} required className="field w-full" aria-label="Bank name" />
          <input
            name="balance"
            type="number"
            step="0.01"
            defaultValue={account.currentBalance}
            required
            className="field w-full"
            aria-label="Current balance"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="primary-button !px-3" aria-label="Save account">
              <Check className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setEditing(false)} className="secondary-button !px-3" aria-label="Cancel editing">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 p-5 sm:flex-nowrap sm:p-6">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
        <Landmark className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{account.name}</p>
        <p className="mt-1 text-xs text-slate-500">
          {account.transactionCount} transaction{account.transactionCount === 1 ? '' : 's'} ·{' '}
          {formatAmount(account.debit)} spent
        </p>
        {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
      </div>
      <div className="ml-[60px] sm:ml-0 sm:text-right">
        <p className="text-xs font-medium text-slate-500">Current balance</p>
        <p className={`mt-1 font-semibold ${account.currentBalance >= 0 ? 'text-slate-950' : 'text-rose-600'}`}>
          {formatAmount(account.currentBalance)}
        </p>
      </div>
      <div className="ml-auto flex gap-1">
        <button type="button" onClick={() => setEditing(true)} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={`Edit ${account.name}`}>
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={remove} disabled={busy} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50" aria-label={`Remove ${account.name}`}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
