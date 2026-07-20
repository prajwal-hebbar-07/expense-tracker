import { db, transactions } from '@expense-tracker/db';
import { eq, isNull } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { AiError, CATEGORIES, chatJSON, modelInfo } from '@/lib/ai';

const assignmentSchema = z.object({
  assignments: z.array(
    z.object({
      id: z.number().int(),
      category: z.enum(CATEGORIES),
    }),
  ),
});

const responseFormat = {
  type: 'object',
  properties: {
    assignments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          category: { type: 'string', enum: [...CATEGORIES] },
        },
        required: ['id', 'category'],
      },
    },
  },
  required: ['assignments'],
};

export async function POST() {
  const pending = db
    .select()
    .from(transactions)
    .where(isNull(transactions.category))
    .all();

  if (pending.length === 0) {
    return NextResponse.json({ categorized: 0, message: 'Nothing to categorize' });
  }

  const lines = pending
    .map((tx) => `id=${tx.id} | ${tx.type} | ${tx.amount} | ${tx.title} | ${tx.description}`)
    .join('\n');

  try {
    const result = await chatJSON<z.infer<typeof assignmentSchema>>({
      system:
        'You are an expense categorization agent. Assign exactly one category to every ' +
        `transaction. Allowed categories: ${CATEGORIES.join(', ')}. ` +
        'Credits (money received) are usually Income. Base your choice on the description.',
      prompt:
        'Categorize every one of these transactions and return an assignment for each id:\n' +
        lines,
      schema: responseFormat,
    });

    const parsed = assignmentSchema.safeParse(result);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Model returned unexpected shape' }, { status: 502 });
    }

    const pendingIds = new Set(pending.map((tx) => tx.id));
    let categorized = 0;
    for (const { id, category } of parsed.data.assignments) {
      if (!pendingIds.has(id)) continue;
      db.update(transactions)
        .set({ category })
        .where(eq(transactions.id, id))
        .run();
      categorized += 1;
    }

    return NextResponse.json({
      categorized,
      remaining: pending.length - categorized,
      model: modelInfo().model,
    });
  } catch (error) {
    if (error instanceof AiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }
}
