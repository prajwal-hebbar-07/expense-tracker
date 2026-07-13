'use client';

import {
  ChartNoAxesCombined,
  FileText,
  Lightbulb,
  ReceiptText,
  WalletCards,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/transactions', label: 'Transactions', icon: ReceiptText },
  { href: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/advice', label: 'Advice', icon: Lightbulb },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href="/transactions"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Ledger transactions"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <WalletCards className="h-[18px] w-[18px]" strokeWidth={2.2} />
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight text-slate-950 sm:block">
            Ledger
          </span>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" aria-label="Main navigation">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/transactions"
          className="primary-button hidden shrink-0 !px-3.5 !py-2 sm:inline-flex"
        >
          Add transaction
        </Link>
      </div>
    </header>
  );
}
