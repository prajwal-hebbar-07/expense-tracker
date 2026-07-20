import { db, transactions } from '@expense-tracker/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { AiError, chatJSON, modelInfo } from '@/lib/ai';

const insightsSchema = z.object({
  overview: z.string(),
  suggestions: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      estimatedMonthlySaving: z.number().nullable(),
    }),
  ),
});

const responseFormat = {
  type: 'object',
  properties: {
    overview: { type: 'string' },
    suggestions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          detail: { type: 'string' },
          estimatedMonthlySaving: { type: ['number', 'null'] },
        },
        required: ['title', 'detail', 'estimatedMonthlySaving'],
      },
    },
  },
  required: ['overview', 'suggestions'],
};

export async function POST() {
  const rows = db.select().from(transactions).all();
  const debits = rows.filter((tx) => tx.type === 'debit');

  if (debits.length === 0) {
    return NextResponse.json(
      { error: 'No expenses recorded yet — add some transactions first' },
      { status: 400 },
    );
  }

  const byCategory = new Map<string, { total: number; count: number }>();
  for (const tx of debits) {
    const key = tx.category ?? 'Uncategorized';
    const entry = byCategory.get(key) ?? { total: 0, count: 0 };
    entry.total += tx.amount;
    entry.count += 1;
    byCategory.set(key, entry);
  }

  const totalDebit = debits.reduce((sum, tx) => sum + tx.amount, 0);
  const totalCredit = rows
    .filter((tx) => tx.type === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const categorySummary = [...byCategory.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([name, s]) => `${name}: ${s.total.toFixed(0)} across ${s.count} transactions`)
    .join('\n');

  const recentLines = debits
    .slice(-30)
    .map((tx) => `${tx.date} | ${tx.amount} | ${tx.category ?? '?'} | ${tx.description}`)
    .join('\n');

  try {
    const result = await chatJSON<z.infer<typeof insightsSchema>>({
      system:
        'You are a personal finance advisor. The user tracks personal expenses in INR. ' +
        'Give a short spending overview and 3-5 concrete, actionable suggestions to save ' +
        'money, grounded in the actual numbers provided. Estimate a realistic monthly ' +
        'saving in INR for each suggestion when possible (null when not applicable). ' +
        'Use the reasons stated in transaction descriptions to distinguish necessary ' +
        'expenses from discretionary ones. Be specific to the data, never generic.',
      prompt:
        `Total income: ${totalCredit.toFixed(0)}\n` +
        `Total spending: ${totalDebit.toFixed(0)}\n\n` +
        `Spending by category:\n${categorySummary}\n\n` +
        `Recent transactions:\n${recentLines}`,
      schema: responseFormat,
    });

    const parsed = insightsSchema.safeParse(result);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Model returned unexpected shape' }, { status: 502 });
    }

    return NextResponse.json({ ...parsed.data, model: modelInfo().model });
  } catch (error) {
    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}
