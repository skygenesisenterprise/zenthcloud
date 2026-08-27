"use client";

import * as React from "react";
import { Cpu, HardDrive, Network, Boxes, Server, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArchitectureDiagramProps {
  platform: string;
  compute: string;
  storage: string;
  network: string;
  virtualization: string;
  infrastructure: string;
  datacenters: string;
}

export function ArchitectureDiagram({
  platform,
  compute,
  storage,
  network,
  virtualization,
  infrastructure,
  datacenters,
}: ArchitectureDiagramProps) {
  const resourceRow = [
    { icon: Cpu, label: compute },
    { icon: HardDrive, label: storage },
    { icon: Network, label: network },
  ];
  const [reducedMotion] = React.useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md sm:p-8"
      role="img"
      aria-label={`${platform} — ${compute}, ${storage}, ${network}, ${virtualization}, ${infrastructure}, ${datacenters}`}
    >
      <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb,59,130,246)/0.12),transparent_55%)]" aria-hidden="true" />

      <div className="relative space-y-3">
        {/* Platform */}
        <div className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 text-center">
          <p className="text-sm font-bold tracking-tight text-primary" style={{ letterSpacing: "0.14em" }}>
            {platform}
          </p>
        </div>

        {/* Divider with connectors */}
        <div className="flex justify-center" aria-hidden="true">
          <svg width="12" height="16" viewBox="0 0 12 16">
            <path d="M6 0v16" className="stroke-border" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="6" cy="0" r="2.4" className="fill-primary/40" />
          </svg>
        </div>

        {/* Resources row */}
        <div className="grid grid-cols-3 gap-3">
          {resourceRow.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background px-2 py-3 text-center shadow-sm transition-colors hover:border-primary/40"
            >
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold text-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex justify-center" aria-hidden="true">
          <svg width="12" height="16" viewBox="0 0 12 16">
            <path d="M6 0v16" className="stroke-border" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="6" cy="0" r="2.4" className="fill-primary/40" />
          </svg>
        </div>

        {/* Virtualization layer */}
        <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
          <Boxes className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-sm font-semibold text-foreground">{virtualization}</span>
        </div>

        {/* Divider */}
        <div className="flex justify-center" aria-hidden="true">
          <svg width="12" height="16" viewBox="0 0 12 16">
            <path d="M6 0v16" className="stroke-border" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="6" cy="0" r="2.4" className="fill-primary/40" />
          </svg>
        </div>

        {/* Infrastructure + datacenters */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-3 shadow-sm">
            <Server className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">{infrastructure}</span>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-3 shadow-sm">
            <Database className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">{datacenters}</span>
          </div>
        </div>
      </div>

      {/* Subtle animated pulse on the primary node */}
      {!reducedMotion && (
        <span
          className={cn(
            "pointer-events-none absolute bottom-8 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-primary/20",
            "animate-ping"
          )}
          aria-hidden="true"
          style={{ animationDuration: "3s" }}
        />
      )}
    </div>
  );
}