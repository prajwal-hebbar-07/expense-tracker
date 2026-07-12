const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? 'INR',
  maximumFractionDigits: 2,
});

export function formatAmount(value: number): string {
  return currency.format(value);
}

export function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
