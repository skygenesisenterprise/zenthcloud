"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function DeploymentCard() {
  return (
    <div className="rounded-lg border border-primary/25 bg-primary/5 p-5 md:col-span-2">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="font-semibold">Préparez votre prochain déploiement</p>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Configurez des sauvegardes automatisées et des alertes de santé pour vos serveurs de
            production. Gardez votre équipe concentrée pendant que ZenthCloud surveille
            l&apos;essentiel.
          </p>
          <button
            onClick={() => toast.info("Ouverture des recommandations…")}
            className="mt-4 text-sm font-semibold text-primary hover:underline"
          >
            Voir les recommandations <ArrowUpRight className="ml-1 inline size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SecurityCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <ShieldCheck className="size-5 text-primary" />
      <p className="mt-4 font-semibold">Centre de sécurité</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Votre espace est protégé par la double authentification et le contrôle d&apos;accès par
        rôles.
      </p>
      <Link
        href="/dash/iam/identities"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Réviser les accès
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}
