"use client";

import * as React from "react";
import { ArrowRight, CheckCircle2, CreditCard, Download, FileText, Landmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* Données de démonstration (à remplacer par l'appel API de facturation). */
const BILLING = {
  monthSpent: "184,60 €",
  budget: "250 €",
  lastInvoice: {
    reference: "#F-2026-0841",
    amount: "184,60 €",
    date: "1 août 2026",
  },
  nextInvoice: "1 septembre 2026",
  paymentMethod: "Visa •••• 4242",
  paymentStatus: "À jour",
};

export function BillingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Facturation</DialogTitle>
          <DialogDescription>
            Récapitulatif de vos dépenses, factures et moyens de paiement.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Solde du mois */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-4">
            <div>
              <p className="text-xs text-muted-foreground">Dépenses du mois</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{BILLING.monthSpent}</p>
              <p className="text-xs text-muted-foreground">sur {BILLING.budget} de budget</p>
            </div>
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CreditCard className="size-5" />
            </div>
          </div>

          {/* Détails */}
          <dl className="flex flex-col divide-y divide-border text-sm">
            <div className="flex items-center justify-between py-2.5">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <FileText className="size-4" />
                Dernière facture
              </dt>
              <dd className="text-right">
                <span className="font-medium">
                  {BILLING.lastInvoice.reference} · {BILLING.lastInvoice.amount}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {BILLING.lastInvoice.date}
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <Landmark className="size-4" />
                Prochaine échéance
              </dt>
              <dd className="font-medium">{BILLING.nextInvoice}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="size-4" />
                Moyen de paiement
              </dt>
              <dd className="flex items-center gap-1.5 font-medium">
                {BILLING.paymentMethod}
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-500">
                  <CheckCircle2 className="size-3" />
                  {BILLING.paymentStatus}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => toast.success("Téléchargement de la facture en cours…")}
          >
            <Download />
            Télécharger la facture
          </Button>
          <Button onClick={() => toast.info("Ouverture de la gestion du paiement…")}>
            Gérer le paiement
            <ArrowRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
