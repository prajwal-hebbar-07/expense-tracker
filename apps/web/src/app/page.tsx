import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Expense Tracker
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Track your spending and get AI-powered insights to save more money
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/transactions"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Get Started
            </Link>
            <Link
              href="/analytics"
              className="px-8 py-3 bg-secondary text-secondary-foreground border border-border rounded-lg font-semibold hover:bg-muted transition"
            >
              View Analytics
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="text-lg font-semibold mb-2">Add Expenses</h3>
            <p className="text-muted-foreground">
              Easily record your income and expenses with just a description and amount
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI Categorization</h3>
            <p className="text-muted-foreground">
              Automatic categorization powered by AI analyzes your transactions
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
            <p className="text-muted-foreground">
              Get insights and suggestions to reduce spending and save more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
