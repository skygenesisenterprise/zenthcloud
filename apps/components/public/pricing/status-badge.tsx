import * as React from "react";

import { cn } from "@/lib/utils";
import type { CatalogStatus, CostClass } from "@/lib/pricing/catalog";

const STATUS_STYLES: Record<CatalogStatus, string> = {
  available: "bg-emerald-500/10 text-emerald-600",
  placeholder: "bg-amber-500/10 text-amber-600",
  coming_soon: "bg-muted text-muted-foreground",
};

/**
 * AVAILABLE NOW / PRICING TO BE ANNOUNCED / COMING SOON
 * Separates current reality from future work — we never sell a future offer
 * as if it were live.
 */
export function StatusBadge({
  status,
  availableLabel,
  placeholderLabel,
  comingSoonLabel,
}: {
  status: CatalogStatus;
  availableLabel: string;
  placeholderLabel: string;
  comingSoonLabel: string;
}) {
  const label =
    status === "available"
      ? availableLabel
      : status === "placeholder"
        ? placeholderLabel
        : comingSoonLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        STATUS_STYLES[status]
      )}
    >
      {label}
    </span>
  );
}

const COST_CLASS_STYLES: Record<CostClass, string> = {
  included: "bg-emerald-500/10 text-emerald-600",
  optional: "bg-chart-5/10 text-chart-5",
  usage_based: "bg-primary/10 text-primary",
};

/**
 * INCLUDED / OPTIONAL / USAGE-BASED for the security and included-vs-extra
 * sections.
 */
export function CostClassBadge({
  costClass,
  includedLabel,
  optionalLabel,
  usageBasedLabel,
}: {
  costClass: CostClass;
  includedLabel: string;
  optionalLabel: string;
  usageBasedLabel: string;
}) {
  const label =
    costClass === "included"
      ? includedLabel
      : costClass === "optional"
        ? optionalLabel
        : usageBasedLabel;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        COST_CLASS_STYLES[costClass]
      )}
    >
      {label}
    </span>
  );
}