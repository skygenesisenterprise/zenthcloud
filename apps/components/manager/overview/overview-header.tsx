"use client";

import * as React from "react";
import { Plus, ReceiptText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BillingDialog } from "@/components/manager/overview/billing-dialog";
import { CreateResourceDialog } from "@/components/manager/overview/create-resource-dialog";

export function OverviewHeader() {
  const [billingOpen, setBillingOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Votre cloud, en un coup d&apos;œil.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Surveillez votre infrastructure, gérez vos ressources et pilotez vos projets depuis un
            seul endroit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => setBillingOpen(true)}>
            <ReceiptText />
            Facturation
          </Button>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus />
            Créer une ressource
          </Button>
        </div>
      </div>

      <BillingDialog open={billingOpen} onOpenChange={setBillingOpen} />
      <CreateResourceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
