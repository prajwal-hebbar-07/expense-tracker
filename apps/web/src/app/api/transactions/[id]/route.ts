import { bankAccounts, db, transactions } from '@expense-tracker/db';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

function parseId(id: string): number | null {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const numericId = parseId((await params).id);
  if (numericId === null) {
    return NextResponse.json({ error: 'Invalid transaction id' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const value = (body as { accountId?: unknown } | null)?.accountId;
  const accountId = value === null ? null : Number(value);
  if (accountId !== null && (!Number.isInteger(accountId) || accountId <= 0)) {
    return NextResponse.json({ error: 'Invalid bank account' }, { status: 400 });
  }

  if (accountId !== null) {
    const account = db
      .select({ id: bankAccounts.id })
      .from(bankAccounts)
      .where(eq(bankAccounts.id, accountId))
      .get();
    if (!account) {
      return NextResponse.json({ error: 'Bank account not found' }, { status: 400 });
    }
  }

  const [updated] = await db
    .update(transactions)
    .set({ accountId })
    .where(eq(transactions.id, numericId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  return NextResponse.json({ transaction: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) {
    return NextResponse.json({ error: 'Invalid transaction id' }, { status: 400 });
  }

  const [deleted] = await db
    .delete(transactions)
    .where(eq(transactions.id, numericId))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  return NextResponse.json({ transaction: deleted });
}
