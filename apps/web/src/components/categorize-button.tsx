'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CategorizeButton({ pendingCount }: { pendingCount: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch('/api/categorize', { method: 'POST' });
      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setMessage(body?.error ?? 'Categorization failed');
        return;
      }
      setMessage(
        body.categorized > 0
          ? `Categorized ${body.categorized} transaction${body.categorized === 1 ? '' : 's'}`
          : 'Nothing to categorize',
      );
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (pendingCount === 0 && !message) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || pendingCount === 0}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        <Sparkles className="h-4 w-4" />
        {busy
          ? 'Categorizing…'
          : `Categorize ${pendingCount} with AI`}
      </button>
      {message && <span className="text-sm text-muted-foreground">{message}</span>}
    </div>
  );
}
