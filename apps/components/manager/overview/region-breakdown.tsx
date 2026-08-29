"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import type { RegionUsage } from "@/lib/mock/overview";

export function RegionBreakdown({ regions }: { regions: RegionUsage[] }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Répartition par région</p>
          <p className="mt-1 text-xs text-muted-foreground">Ressources déployées</p>
        </div>
        <MapPin className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-5 flex flex-col gap-3.5">
        {regions.map((region) => (
          <div key={region.region}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{region.region}</span>
              <span className="font-medium">{region.share} %</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${region.share}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
