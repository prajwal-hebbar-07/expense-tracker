'use client';

import {
  BarChart3,
  FileText,
  Lightbulb,
  Plus,
  ReceiptText,
  Settings2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const dailyLinks = [{ href: '/transactions', label: 'Transactions', icon: ReceiptText }];
const reviewLinks = [
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/advice', label: 'Advice', icon: Lightbulb },
];
const mobileLinks = [...dailyLinks, ...reviewLinks, { href: '/settings', label: 'Settings', icon: Settings2 }];

function NavLink({ href, label, icon: Icon, active }: (typeof mobileLinks)[number] & { active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? 'bg-emerald-400/10 text-emerald-300'
          : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
      }`}
    >
      <Icon className={`h-[18px] w-[18px] ${active ? 'text-emerald-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
      {label}
    </Link>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const adding = pathname.startsWith('/add');

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-[#090d13]/95 px-4 py-5 backdrop-blur-xl lg:flex">
        <Link href="/transactions" className="flex items-center gap-3 px-2" aria-label="Ledger transactions">
          <Image src="/ledger.svg" alt="" width={36} height={36} className="shadow-[0_0_28px_rgba(52,211,153,0.16)]" />
          <span>
            <span className="block text-[15px] font-semibold tracking-tight text-slate-50">Ledger</span>
            <span className="block text-[11px] text-slate-600">Personal finance</span>
          </span>
        </Link>

        <Link href="/add" aria-current={adding ? 'page' : undefined} className="primary-button mt-7 w-full">
          <Plus className="h-4 w-4" />
          New expense
        </Link>

        <nav className="mt-7 flex flex-1 flex-col" aria-label="Main navigation">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">Everyday</p>
          <div className="mt-2 space-y-1">
            {dailyLinks.map((link) => <NavLink key={link.href} {...link} active={pathname.startsWith(link.href)} />)}
          </div>

          <p className="mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700">Review</p>
          <div className="mt-2 space-y-1">
            {reviewLinks.map((link) => <NavLink key={link.href} {...link} active={pathname.startsWith(link.href)} />)}
          </div>
        </nav>

        <div className="border-t border-white/[0.06] pt-3">
          <NavLink href="/settings" label="Settings" icon={Settings2} active={pathname.startsWith('/settings')} />
        </div>
      </aside>

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#090d13]/90 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/transactions" className="flex items-center gap-2.5">
          <Image src="/ledger.svg" alt="" width={32} height={32} />
          <span className="text-sm font-semibold text-slate-50">Ledger</span>
        </Link>
        <Link href={adding ? '/transactions' : '/add'} className={adding ? 'secondary-button !px-3 !py-2' : 'primary-button !px-3 !py-2'}>
          {adding ? <ReceiptText className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {adding ? 'Transactions' : 'Add'}
        </Link>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-2xl border border-white/[0.08] bg-[#10151d]/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
        {mobileLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition ${active ? 'bg-emerald-400/10 text-emerald-300' : 'text-slate-600'}`}>
              <Icon className="h-[18px] w-[18px]" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
