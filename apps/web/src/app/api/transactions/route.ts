import { bankAccounts, db, transactions } from '@expense-tracker/db';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import {
  getTransactions,
  newTransactionSchema,
  transactionFilterSchema,
} from '@/lib/transactions';

export function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const filters = transactionFilterSchema.safeParse(params);
  if (!filters.success) {
    return NextResponse.json(
      { error: 'Invalid filters', details: filters.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  return NextResponse.json({ transactions: getTransactions(filters.data) });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = newTransactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid transaction', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const account = db
    .select({ id: bankAccounts.id })
    .from(bankAccounts)
    .where(eq(bankAccounts.id, parsed.data.accountId))
    .get();
  if (!account) {
    return NextResponse.json({ error: 'Bank account not found' }, { status: 400 });
  }

  const [created] = await db.insert(transactions).values(parsed.data).returning();
  return NextResponse.json({ transaction: created }, { status: 201 });
}
