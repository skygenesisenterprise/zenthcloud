"use client";

import * as React from "react";
import Link from "next/link";
import { Activity, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityEvent } from "@/lib/mock/overview";

const EVENT_ICONS = {
  success: { icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-500" },
  warning: { icon: AlertTriangle, className: "bg-amber-500/10 text-amber-500" },
  info: { icon: Info, className: "bg-primary/10 text-primary" },
} as const;

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Activité récente</p>
          <p className="mt-1 text-xs text-muted-foreground">Derniers événements du workspace</p>
        </div>
        <Activity className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {events.map((event) => {
          const meta = EVENT_ICONS[event.type];
          const Icon = meta.icon;
          return (
            <div className="flex gap-3" key={event.id}>
              <div
                className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full",
                  meta.className
                )}
              >
                <Icon className="size-3" />
              </div>
              <div className="min-w-0">
                <p className="text-sm">{event.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{event.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      <Link
        href="/dash/iam/account-logs"
        className="mt-5 block w-full border-t border-border pt-4 text-left text-sm font-medium text-primary hover:underline"
      >
        Voir toute l&apos;activité
      </Link>
    </section>
  );
}
