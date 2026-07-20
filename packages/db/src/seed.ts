import { db, transactions } from './index';

const today = new Date();

function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const rows = [
  { amount: 85000, type: 'credit', title: 'Monthly salary', description: 'Monthly salary', date: daysAgo(11) },
  { amount: 1200, type: 'debit', title: 'DMart groceries', description: 'Groceries at DMart', date: daysAgo(10) },
  { amount: 450, type: 'debit', title: 'Dinner', description: 'Swiggy dinner order', date: daysAgo(9) },
  { amount: 199, type: 'debit', title: 'Spotify', description: 'Spotify subscription', date: daysAgo(8) },
  { amount: 3500, type: 'debit', title: 'Electricity', description: 'Electricity bill', date: daysAgo(7) },
  { amount: 2500, type: 'credit', title: 'Freelance payment', description: 'Freelance payment', date: daysAgo(6) },
  { amount: 780, type: 'debit', title: 'Uber', description: 'Uber rides', date: daysAgo(5) },
  { amount: 649, type: 'debit', title: 'Netflix', description: 'Netflix subscription', date: daysAgo(4) },
  { amount: 2200, type: 'debit', title: 'Running shoes', description: 'New running shoes', date: daysAgo(3) },
  { amount: 320, type: 'debit', title: 'Coffee', description: 'Coffee with friends', date: daysAgo(2) },
  { amount: 1500, type: 'debit', title: 'Petrol', description: 'Petrol refill', date: daysAgo(1) },
  { amount: 899, type: 'debit', title: 'Books', description: 'Amazon order - books', date: daysAgo(0) },
] as const;

const existing = await db.select().from(transactions);
if (existing.length > 0) {
  console.log(`Database already has ${existing.length} transactions, skipping seed.`);
  process.exit(0);
}

await db.insert(transactions).values(rows.map((r) => ({ ...r })));
console.log(`Seeded ${rows.length} transactions.`);
