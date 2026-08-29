"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Server, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_META } from "@/lib/mock/vps";
import type { InstanceOverview } from "@/lib/mock/overview";

function UtilizationBar({
  label,
  used,
  total,
  percent,
}: {
  label: string;
  used: number;
  total: number;
  percent: number;
}) {
  const unit = label === "CPU" ? "%" : " Go";
  const usedLabel = label === "CPU" ? `${percent}%` : `${used.toFixed(1).replace(".", ",")}${unit}`;
  const totalLabel = label === "CPU" ? "—" : `${total}${unit}`;
  const over = percent >= 85;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">{label}</p>
        <p className="tabular-nums">
          {usedLabel}
          {label !== "CPU" && <span className="text-muted-foreground"> / {totalLabel}</span>}
        </p>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", over ? "bg-amber-500" : "bg-primary")}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function InstancesOverview({ instances }: { instances: InstanceOverview[] }) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-semibold">Instances cloud</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {instances.length} instances actives dans {new Set(instances.map((i) => i.region)).size}{" "}
            régions
          </p>
        </div>
        <Link
          href="/dash/public-cloud/compute"
          className="text-sm font-medium text-primary hover:underline"
        >
          Voir tout
        </Link>
      </div>
      <div className="divide-y divide-border">
        {instances.map((instance) => {
          const meta = STATUS_META[instance.status];
          const ramPercent = Math.round((instance.ramUsed / instance.ramTotal) * 100);
          const diskPercent = Math.round((instance.diskUsed / instance.diskTotal) * 100);
          return (
            <div
              className="flex flex-col gap-4 px-5 py-5 xl:flex-row xl:items-center xl:justify-between"
              key={instance.id}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md",
                    meta.iconClass
                  )}
                >
                  <Server className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{instance.name}</p>
                    <span className={cn("size-1.5 shrink-0 rounded-full", meta.dot)} />
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {instance.plan} · {instance.region}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-xs xl:min-w-72">
                <UtilizationBar label="CPU" used={instance.cpu} total={0} percent={instance.cpu} />
                <UtilizationBar
                  label="RAM"
                  used={instance.ramUsed}
                  total={instance.ramTotal}
                  percent={ramPercent}
                />
                <UtilizationBar
                  label="Disque"
                  used={instance.diskUsed}
                  total={instance.diskTotal}
                  percent={diskPercent}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border px-5 py-4">
        <a
          href="https://docs.zenthcloud.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Terminal className="size-4" />
          Ouvrir le terminal cloud <ExternalLink className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
