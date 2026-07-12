import { db, transactions } from '@expense-tracker/db';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
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
