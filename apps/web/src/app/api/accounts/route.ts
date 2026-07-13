import { bankAccounts, db } from '@expense-tracker/db';
import { NextRequest, NextResponse } from 'next/server';

import { getAccountOverview, newAccountSchema } from '@/lib/accounts';

export function GET() {
  return NextResponse.json(getAccountOverview());
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = newAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid account', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const [created] = await db
      .insert(bankAccounts)
      .values({ name: parsed.data.name, openingBalance: parsed.data.balance })
      .returning();
    return NextResponse.json({ account: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) {
      return NextResponse.json({ error: 'An account with this name already exists' }, { status: 409 });
    }
    throw error;
  }
}
