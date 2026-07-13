'use client';

import { Check, ChevronDown, Landmark } from 'lucide-react';
import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

type BankOption = { id: number; name: string };

export function BankSelect({
  accounts,
  value,
  onValueChange,
  name,
  placeholder = 'Choose an account',
  emptyLabel,
  disabled = false,
  compact = false,
  ariaLabel = 'Bank account',
}: {
  accounts: BankOption[];
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  emptyLabel?: string;
  disabled?: boolean;
  compact?: boolean;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const options = [
    ...(emptyLabel ? [{ value: '', label: emptyLabel }] : []),
    ...accounts.map((account) => ({ value: String(account.id), label: account.name })),
  ];
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  function show() {
    if (disabled) return;
    const selectedIndex = options.findIndex((option) => option.value === value);
    setActiveIndex(Math.max(0, selectedIndex));
    setOpen(true);
  }

  function choose(optionValue: string) {
    onValueChange(optionValue);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        show();
        return;
      }
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      setActiveIndex((index) => (index + direction + options.length) % options.length);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) choose(option.value);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={handleKeyDown}
        className={
          compact
            ? 'inline-flex min-w-28 items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-left text-xs font-medium text-slate-400 outline-none transition hover:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20 disabled:opacity-50'
            : 'field flex w-full items-center justify-between gap-3 text-left'
        }
      >
        <span className="flex min-w-0 items-center gap-2">
          <Landmark className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} shrink-0 text-emerald-400`} />
          <span className={`truncate ${selected ? 'text-slate-200' : 'text-slate-600'}`}>
            {selected?.label ?? placeholder}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-600 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 z-50 mt-1.5 max-h-64 min-w-full overflow-y-auto rounded-xl border border-white/[0.1] bg-[#171c25] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <button
                key={option.value || 'empty'}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option.value)}
                className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-sm transition ${
                  isActive ? 'bg-emerald-400/10 text-emerald-200' : 'text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Landmark className="h-4 w-4 text-emerald-400" />
                  {option.label}
                </span>
                {isSelected && <Check className="h-4 w-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
