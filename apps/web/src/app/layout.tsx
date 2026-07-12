import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track and categorize your expenses with AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-border bg-white dark:bg-slate-900">
          <nav className="container mx-auto flex items-center gap-6 px-4 py-3">
            <Link href="/" className="font-bold">
              💸 Expense Tracker
            </Link>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/transactions" className="transition hover:text-foreground">
                Transactions
              </Link>
              <Link href="/analytics" className="transition hover:text-foreground">
                Analytics
              </Link>
              <Link href="/reports" className="transition hover:text-foreground">
                Reports
              </Link>
              <Link href="/advice" className="transition hover:text-foreground">
                Advice
              </Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
