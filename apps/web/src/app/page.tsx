import { ArrowRight, ChartNoAxesCombined, CircleCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: CircleCheck,
    title: 'Effortless tracking',
    copy: 'Record income and expenses in seconds, without a complicated setup.',
  },
  {
    icon: Sparkles,
    title: 'Automatic categories',
    copy: 'Let AI organize your transactions so your reports stay useful.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'Useful insights',
    copy: 'See where your money goes and find practical opportunities to save.',
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-slate-200/80 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(16,185,129,0.10),transparent_32%)]" />
        <div className="page-shell relative grid min-h-[570px] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" />
              AI-assisted personal finance
            </div>
            <h1 className="text-5xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-7xl">
              Your money,
              <span className="block text-emerald-700">made clear.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Track everyday spending, understand your habits, and make calmer financial
              decisions—all from one focused dashboard.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/transactions" className="primary-button !px-5 !py-3">
                Start tracking
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/reports" className="secondary-button !px-5 !py-3">
                View reports
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-8 rounded-full bg-emerald-100/70 blur-3xl" />
            <div className="surface relative overflow-hidden p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    This month
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    ₹75,803
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Available balance</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  +87% saved
                </span>
              </div>
              <div className="mt-8 h-32 rounded-2xl bg-gradient-to-b from-emerald-50 to-white p-4">
                <svg viewBox="0 0 400 90" className="h-full w-full" role="img" aria-label="Balance trend rising">
                  <defs>
                    <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#059669" stopOpacity="0.22" />
                      <stop offset="1" stopColor="#059669" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 74 C55 62, 68 70, 118 52 S190 57, 235 38 S315 46, 400 14 V90 H0Z" fill="url(#area)" />
                  <path d="M0 74 C55 62, 68 70, 118 52 S190 57, 235 38 S315 46, 400 14" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Income</p>
                  <p className="mt-1.5 font-semibold text-emerald-700">₹87,500</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Spent</p>
                  <p className="mt-1.5 font-semibold text-slate-900">₹11,697</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-14 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="surface p-6 sm:p-7">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-base font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
