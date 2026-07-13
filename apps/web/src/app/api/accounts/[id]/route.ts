import { bankAccounts, db } from '@expense-tracker/db';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { getAccountOverview, updateAccountSchema } from '@/lib/accounts';

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
    return NextResponse.json({ error: 'Invalid account id' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = updateAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid account', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const current = getAccountOverview().accounts.find((account) => account.id === numericId);
  if (!current) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const values: { name?: string; openingBalance?: number } = {};
  if (parsed.data.name !== undefined) values.name = parsed.data.name;
  if (parsed.data.balance !== undefined) {
    values.openingBalance = parsed.data.balance - current.credit + current.debit;
  }

  try {
    const [updated] = await db
      .update(bankAccounts)
      .set(values)
      .where(eq(bankAccounts.id, numericId))
      .returning();
    return NextResponse.json({ account: updated });
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return NextResponse.json({ error: 'An account with this name already exists' }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const numericId = parseId((await params).id);
  if (numericId === null) {
    return NextResponse.json({ error: 'Invalid account id' }, { status: 400 });
  }

  const [deleted] = await db
    .delete(bankAccounts)
    .where(eq(bankAccounts.id, numericId))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json({ account: deleted });
}
