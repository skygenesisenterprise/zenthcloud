"use client";

import * as React from "react";
import {
  Boxes,
  Cpu,
  Layers,
  Server,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExplorerLayer {
  key: string;
  label: string;
  role: string;
  resources: string;
  responsibilities: string;
  dependencies: string;
}

interface ExplorerCopy {
  role: string;
  resources: string;
  responsibilities: string;
  dependencies: string;
}

interface VirtualizationLayerExplorerProps {
  layers: ExplorerLayer[];
  copy: ExplorerCopy;
}

const LAYER_ICONS: Record<string, LucideIcon> = {
  physical: Server,
  virtualization: Layers,
  pool: Workflow,
  vm: Cpu,
  application: Boxes,
};

/**
 * Interactive exploration of the virtualization stack: pick a layer
 * (physical hardware → application) and read its role, resources,
 * responsibilities and dependencies.
 */
export function VirtualizationLayerExplorer({ layers, copy }: VirtualizationLayerExplorerProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  if (layers.length === 0) return null;

  const active = layers[Math.min(activeIndex, layers.length - 1)];
  const ActiveIcon = LAYER_ICONS[active.key] ?? Layers;

  const details: Array<{ key: string; label: string; value: string }> = [
    { key: "role", label: copy.role, value: active.role },
    { key: "resources", label: copy.resources, value: active.resources },
    { key: "responsibilities", label: copy.responsibilities, value: active.responsibilities },
    { key: "dependencies", label: copy.dependencies, value: active.dependencies },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-stretch">
      {/* Layer selector */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <ol className="flex h-full flex-col justify-center gap-3">
          {layers.map((layer, index) => {
            const Icon = LAYER_ICONS[layer.key] ?? Layers;
            const isActive = index === Math.min(activeIndex, layers.length - 1);
            const isLast = index === layers.length - 1;
            return (
              <li key={layer.key}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors",
                    isActive
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{layer.label}</span>
                </button>
                {!isLast && <div className="mx-auto h-3 w-px bg-border" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Detail panel */}
      <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
            <ActiveIcon className="h-5 w-5" />
          </span>
          <h3 className="text-lg font-bold text-foreground">{active.label}</h3>
        </div>
        <dl className="mt-6 space-y-4">
          {details.map((detail) => (
            <div key={detail.key} className="rounded-lg border border-border bg-muted/60 p-4">
              <dt className="text-xs font-bold uppercase tracking-wider text-primary">
                {detail.label}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-foreground">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
