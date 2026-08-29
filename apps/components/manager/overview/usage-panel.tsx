"use client";

import * as React from "react";
import { ArrowUpRight, CircleHelp } from "lucide-react";
import { toast } from "sonner";
import type { BudgetState } from "@/lib/mock/overview";

export function UsagePanel({ budget }: { budget: BudgetState }) {
  const spentLabel = `${budget.spent.toFixed(2).replace(".", ",")} €`;
  const budgetLabel = `${budget.budget.toFixed(0).replace(".", ",")} €`;

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold">Usage du mois</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {spentLabel} sur {budgetLabel} de budget
          </p>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground"
          aria-label="Aide sur l'usage"
          onClick={() => toast.info("Détails de l'usage disponibles dans la facturation.")}
        >
          <CircleHelp className="size-4" />
        </button>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${budget.usedPercent}%` }}
        />
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>{budget.usedPercent} % utilisé</span>
        <span>Réinitialisation dans {budget.resetInDays} jours</span>
      </div>
      <button
        onClick={() => toast.info("Ouverture de la facturation…")}
        className="mt-5 flex w-full items-center justify-between border-t border-border pt-4 text-sm font-medium hover:text-primary"
      >
        <span>Voir les détails de facturation</span>
        <ArrowUpRight className="size-4" />
      </button>
    </section>
  );
}
