export const FALLBACK_TEXT = "Unknown";
export const NO_DESCRIPTION = "No description available.";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number | null): string {
  return value == null ? FALLBACK_TEXT : currency.format(value);
}

export function formatDate(iso: string | null): string {
  if (!iso) return FALLBACK_TEXT;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return FALLBACK_TEXT;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
