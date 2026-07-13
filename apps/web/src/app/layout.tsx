import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AppHeader } from '@/components/app-header';

import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Ledger — Expense Tracker',
  description: 'A clear, simple view of your everyday finances',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
