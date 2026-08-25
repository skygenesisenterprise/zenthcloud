import * as React from "react";

import { formatPrice, type CurrencyCode } from "@/lib/pricing/catalog";

/**
 * Formatting precision for a given billing unit. Computations keep full
 * precision internally; only the *display* is rounded.
 */
const DISPLAY_PRECISION: Record<string, number> = {
  hour: 4,
  month: 2,
  gb_month: 3,
  gb: 3,
  request: 4,
  gpu_hour: 2,
  ip_month: 2,
  instance_month: 2,
};

/**
 * Renders a monetary amount for a given billing unit, or a clear placeholder
 * when the amount is not configured yet (`null`). We never invent a figure.
 */
export function Price({
  amount,
  unit,
  currency = "EUR",
  placeholderLabel,
  className,
}: {
  amount: number | null;
  unit: string;
  currency?: CurrencyCode;
  placeholderLabel: string;
  className?: string;
}) {
  if (amount === null) {
    return (
      <span
        className={className}
        title="Pricing not configured — shown as a technical placeholder"
        aria-label={placeholderLabel}
      >
        {placeholderLabel}
      </span>
    );
  }

  const digits = DISPLAY_PRECISION[unit] ?? 2;
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(amount);

  return <span className={className}>{formatted}</span>;
}

/** Re-export the shared convention so consumers don't need the lib import. */
export { formatPrice };