import { db, transactions } from './index';

const today = new Date();

function daysAgo(n: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const rows = [
  { amount: 85000, type: 'credit', description: 'Monthly salary', date: daysAgo(11) },
  { amount: 1200, type: 'debit', description: 'Groceries at DMart', date: daysAgo(10) },
  { amount: 450, type: 'debit', description: 'Swiggy dinner order', date: daysAgo(9) },
  { amount: 199, type: 'debit', description: 'Spotify subscription', date: daysAgo(8) },
  { amount: 3500, type: 'debit', description: 'Electricity bill', date: daysAgo(7) },
  { amount: 2500, type: 'credit', description: 'Freelance payment', date: daysAgo(6) },
  { amount: 780, type: 'debit', description: 'Uber rides', date: daysAgo(5) },
  { amount: 649, type: 'debit', description: 'Netflix subscription', date: daysAgo(4) },
  { amount: 2200, type: 'debit', description: 'New running shoes', date: daysAgo(3) },
  { amount: 320, type: 'debit', description: 'Coffee with friends', date: daysAgo(2) },
  { amount: 1500, type: 'debit', description: 'Petrol refill', date: daysAgo(1) },
  { amount: 899, type: 'debit', description: 'Amazon order - books', date: daysAgo(0) },
] as const;

const existing = await db.select().from(transactions);
if (existing.length > 0) {
  console.log(`Database already has ${existing.length} transactions, skipping seed.`);
  process.exit(0);
}

await db.insert(transactions).values(rows.map((r) => ({ ...r })));
console.log(`Seeded ${rows.length} transactions.`);
