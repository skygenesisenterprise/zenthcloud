import * as React from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  /** Optional className for the header/th. */
  className?: string;
  render: (row: T) => React.ReactNode;
}

/**
 * A responsive pricing table.
 *
 * On large screens it renders as a real <table> (accessible to screen readers,
 * sortable cells). On small screens it collapses into stacked "cards" so the
 * principal price stays near the top and reading order is preserved. This
 * satisfies the mobile requirement without forcing horizontal scroll.
 */
export function PricingTable<T extends { id: string }>({
  title,
  ariaLabel,
  columns,
  rows,
  highlightFirst = false,
  emptyLabel,
}: {
  title: string;
  ariaLabel: string;
  columns: Column<T>[];
  rows: T[];
  highlightFirst?: boolean;
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div aria-label={ariaLabel}>
      <h3 className="sr-only">{title}</h3>

      {/* Desktop table */}
      <table className="hidden w-full border-collapse text-left md:table">
        <caption className="sr-only">{ariaLabel}</caption>
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={cn(
                "border-b border-border/60 transition-colors hover:bg-muted/60",
                highlightFirst && row.id === rows[0].id && "bg-muted/40"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn("px-4 py-4 text-sm text-foreground", col.className)}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <div className="grid gap-4 md:hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-3">
                {columns.slice(0, 2).map((col) => (
                  <div key={col.key}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {col.header}
                    </p>
                    <div className="mt-0.5 text-sm font-medium text-foreground">
                      {col.render(row)}
                    </div>
                  </div>
                ))}
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
            <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
              {columns.slice(2).map((col) => (
                <div
                  key={col.key}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="text-muted-foreground">{col.header}</span>
                  <span className="text-right font-medium text-foreground">
                    {col.render(row)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}