"use client";

import * as React from "react";
import { Calculator } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  HOURS_PER_MONTH,
  formatPrice,
  type ComputeCatalogueOption,
  type StoragePricing,
} from "@/lib/pricing/catalog";

interface CalculatorCopy {
  title: string;
  subtitle: string;
  computeLabel: string;
  storageLabel: string;
  networkLabel: string;
  estimateTitle: string;
  hourly: string;
  daily: string;
  monthly: string;
  annual: string;
  notConfigured: string;
  dependsOnUsage: string;
  computeNoneLabel: string;
  storageNoneLabel: string;
}

interface CalculatorProps {
  computePlans: ComputeCatalogueOption[];
  storagePlans: StoragePricing[];
  copy: CalculatorCopy;
}

type StorageSelection =
  | { kind: "none" }
  | { kind: "plan"; id: string; amountGb: number }
  | { kind: "custom"; amountGb: number };

/**
 * Cost estimator. It reads every unit price from the catalog entry passed in
 * from the server page (single source of truth — the cards and this calculator
 * share the exact same data). Selections recompute the estimate immediately,
 * with no reload.
 *
 * When a unit price is not configured yet (`null`) the estimate shows an honest
 * "to be announced" state instead of inventing a figure.
 */
export function PricingCalculator({ computePlans, storagePlans, copy }: CalculatorProps) {
  const [computeId, setComputeId] = React.useState<string>(
    computePlans.find((p) => p.pricePerHour !== null)?.id ?? (computePlans[0]?.id ?? "")
  );
  const [storage, setStorage] = React.useState<StorageSelection>({ kind: "none" });
  const [customGbs, setCustomGbs] = React.useState<number>(100);
  const [networkGbs, setNetworkGbs] = React.useState<number>(50);

  const compute = React.useMemo(
    () => computePlans.find((p) => p.id === computeId) ?? null,
    [computePlans, computeId]
  );

  const storagePlan =
    storage.kind === "plan"
      ? storagePlans.find((p) => p.id === storage.id) ?? null
      : null;

  // All figures are nullable: a null amount means "price not configured".
  const computeAmount = compute?.pricePerHour ?? null;
  const storageAmount =
    storage.kind === "plan"
      ? (storagePlan?.pricePerGbMonth ?? null)
      : storage.kind === "custom"
        ? (storagePlans[0]?.pricePerGbMonth ?? null)
        : null;

  const hasConfigurablePrices =
    computeAmount !== null || storageAmount !== null;

  // Raw (full precision) monthly estimate before display rounding.
  const computeMonthly = computeAmount !== null ? computeAmount * HOURS_PER_MONTH : null;
  const storageMonthly =
    storageAmount !== null
      ? storageAmount * (storage.kind === "custom" ? customGbs : storagePlan?.minimumGb ?? 100)
      : null;

  const hourlyTotal = computeAmount !== null ? computeAmount : null;
  const monthlyTotal =
    computeMonthly !== null || storageMonthly !== null
      ? (computeMonthly ?? 0) + (storageMonthly ?? 0)
      : null;

  const estimates = {
    hourly: hourlyTotal,
    daily: hourlyTotal !== null ? hourlyTotal * 24 : null,
    monthly: monthlyTotal,
    annual: monthlyTotal !== null ? monthlyTotal * 12 : null,
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* Configuration */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
            <Calculator className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-foreground">{copy.title}</h3>
            <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Compute */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {copy.computeLabel}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {computePlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setComputeId(plan.id)}
                  aria-pressed={computeId === plan.id}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                    computeId === plan.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <span className="font-semibold text-foreground">{plan.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {plan.vcpu} vCPU · {plan.ramGb} GB RAM
                  </span>
                </button>
              ))}
            </div>
            {!compute && <p className="text-xs text-muted-foreground">{copy.computeNoneLabel}</p>}
          </fieldset>

          {/* Storage */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {copy.storageLabel}
            </legend>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <select
                value={storage.kind === "none" ? "none" : storage.kind === "custom" ? "custom" : storage.id}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "none") setStorage({ kind: "none" });
                  else if (v === "custom") setStorage({ kind: "custom", amountGb: customGbs });
                  else setStorage({ kind: "plan", id: v, amountGb: 100 });
                }}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                aria-label={copy.storageLabel}
              >
                <option value="none">{copy.storageNoneLabel}</option>
                {storagePlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>
              {(storage.kind === "custom" || storage.kind === "plan") && (
                <label className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">GB</span>
                  <input
                    type="number"
                    min={1}
                    value={storage.kind === "custom" ? customGbs : storage.amountGb}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 0;
                      setCustomGbs(v);
                      if (storage.kind === "plan") setStorage({ kind: "plan", id: storage.id, amountGb: v });
                      else if (storage.kind === "custom") setStorage({ kind: "custom", amountGb: v });
                    }}
                    className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
                    aria-label="Storage amount (GB)"
                  />
                </label>
              )}
            </div>
          </fieldset>

          {/* Network */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {copy.networkLabel}
            </legend>
            <div className="flex items-center gap-2 text-sm">
              <input
                type="number"
                min={0}
                value={networkGbs}
                onChange={(e) => setNetworkGbs(Number(e.target.value) || 0)}
                className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm"
                aria-label={copy.networkLabel}
              />
              <span className="text-muted-foreground">GB / month</span>
            </div>
          </fieldset>

          {!hasConfigurablePrices && (
            <p className="rounded-lg border border-dashed border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
              {copy.notConfigured}
            </p>
          )}
        </div>
      </div>

      {/* Estimate */}
      <aside className="rounded-xl border border-primary/30 bg-muted p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          {copy.estimateTitle}
        </p>
        <dl className="mt-5 space-y-3">
          {(
            [
              ["hourly", copy.hourly, estimates.hourly],
              ["daily", copy.daily, estimates.daily],
              ["monthly", copy.monthly, estimates.monthly],
              ["annual", copy.annual, estimates.annual],
            ] as const
          ).map(([key, label, value]) => (
            <div
              key={key}
              className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0"
            >
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="text-base font-bold text-foreground">
                {value === null ? (
                  <span className="text-sm font-medium text-muted-foreground">
                    {copy.notConfigured}
                  </span>
                ) : (
                  formatPrice(value)
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
          {copy.dependsOnUsage}
        </p>
      </aside>
    </div>
  );
}