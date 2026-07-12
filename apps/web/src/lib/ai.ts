const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'minimax-m3:cloud';

export const CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transport',
  'Entertainment',
  'Subscriptions',
  'Shopping',
  'Utilities',
  'Health',
  'Travel',
  'Income',
  'Other',
] as const;

export class AiError extends Error {
  constructor(
    message: string,
    public readonly status: number = 502,
  ) {
    super(message);
  }
}

type JsonSchema = Record<string, unknown>;

/**
 * Extract a JSON object from a model reply. Cloud models proxied through
 * Ollama may ignore the `format` schema parameter and wrap JSON in prose
 * or markdown fences, so parse defensively.
 */
function extractJSON(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    /* fall through to extraction */
  }
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {
      /* fall through to brace extraction */
    }
  }
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(content.slice(start, end + 1));
    } catch {
      /* give up below */
    }
  }
  throw new AiError('Model returned invalid JSON');
}

/**
 * Call Ollama's chat API and get structured output back. Sends the JSON
 * schema via `format` AND spells it out in the system prompt, because
 * cloud-proxied models do not reliably honor `format`. Throws AiError with
 * a user-facing message when Ollama is unreachable, unauthorized, or
 * returns garbage.
 */
export async function chatJSON<T>(options: {
  system: string;
  prompt: string;
  schema: JsonSchema;
}): Promise<T> {
  const system =
    `${options.system}\n\n` +
    'Respond with ONLY a single JSON object — no markdown, no tables, no ' +
    'explanations, no text before or after it. The object must match this ' +
    `JSON schema exactly:\n${JSON.stringify(options.schema)}`;

  let response: Response;
  try {
    response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        format: options.schema,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: options.prompt },
        ],
      }),
    });
  } catch {
    throw new AiError(
      `Cannot reach Ollama at ${OLLAMA_URL}. Is it running?`,
      503,
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok || body?.error) {
    const detail = body?.error ?? `HTTP ${response.status}`;
    if (String(detail).toLowerCase().includes('unauthorized')) {
      throw new AiError(
        `Ollama cloud rejected the request (${detail}). Run "ollama signin" to use ${OLLAMA_MODEL}.`,
        401,
      );
    }
    throw new AiError(`Ollama request failed: ${detail}`);
  }

  const content = body?.message?.content;
  if (typeof content !== 'string' || content.trim() === '') {
    throw new AiError('Ollama returned an empty response');
  }

  return extractJSON(content) as T;
}

export function modelInfo() {
  return { url: OLLAMA_URL, model: OLLAMA_MODEL };
}
