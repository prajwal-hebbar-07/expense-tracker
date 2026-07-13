'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { AccountWithStats } from '@/lib/accounts';
import { BankSelect } from '@/components/bank-select';

const fieldClass =
  'field !py-2';

export function FilterBar({ accounts }: { accounts: AccountWithStats[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const hasFilters = ['type', 'account', 'from', 'to'].some((key) => searchParams.has(key));

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2.5">
      <select
        aria-label="Filter by type"
        value={searchParams.get('type') ?? ''}
        onChange={(e) => setParam('type', e.target.value)}
        className={`${fieldClass} appearance-none pr-8`}
      >
        <option value="">All types</option>
        <option value="debit">Debits</option>
        <option value="credit">Credits</option>
      </select>

      {accounts.length > 0 && (
        <BankSelect
          accounts={accounts}
          value={searchParams.get('account') ?? ''}
          onValueChange={(value) => setParam('account', value)}
          emptyLabel="All banks"
          ariaLabel="Filter by bank account"
          compact
        />
      )}

      <label className="flex items-center gap-2 text-sm text-slate-500">
        <span className="sr-only sm:not-sr-only">From</span>
        <input
          type="date"
          value={searchParams.get('from') ?? ''}
          onChange={(e) => setParam('from', e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-500">
        <span className="sr-only sm:not-sr-only">To</span>
        <input
          type="date"
          value={searchParams.get('to') ?? ''}
          onChange={(e) => setParam('to', e.target.value)}
          className={fieldClass}
        />
      </label>

      {hasFilters && (
        <button
          type="button"
          onClick={() => router.replace(pathname)}
          className="px-2 text-sm font-medium text-slate-500 transition hover:text-slate-200"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
