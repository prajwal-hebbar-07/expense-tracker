'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const fieldClass =
  'rounded-md border border-border bg-background px-3 py-1.5 text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-ring';

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const hasFilters = ['type', 'from', 'to'].some((key) => searchParams.has(key));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Filter by type"
        value={searchParams.get('type') ?? ''}
        onChange={(e) => setParam('type', e.target.value)}
        className={fieldClass}
      >
        <option value="">All types</option>
        <option value="debit">Debits</option>
        <option value="credit">Credits</option>
      </select>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        From
        <input
          type="date"
          value={searchParams.get('from') ?? ''}
          onChange={(e) => setParam('from', e.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        To
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
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
