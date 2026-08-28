import * as React from "react";

// Flow diagram building blocks shared across product pages,
// mirroring the homepage diagram components (architecture/network diagrams).

interface FlowNodeProps {
  icon?: React.ComponentType<{ className?: string }>;
  sub?: string;
  variant?: "row" | "card";
  children: React.ReactNode;
}

export function FlowNode({ icon: Icon, sub, variant = "row", children }: FlowNodeProps) {
  if (variant === "card") {
    return (
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2.5 text-center shadow-sm">
        {Icon && <Icon className="h-4 w-4 text-primary" aria-hidden="true" />}
        <span className="text-[11px] font-semibold leading-tight text-foreground">{children}</span>
        {sub && <span className="text-[10px] text-muted-foreground">{sub}</span>}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
      {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
      <span className="text-sm font-semibold text-foreground">{children}</span>
      {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
    </div>
  );
}

export function FlowConnector() {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <svg width="12" height="16" viewBox="0 0 12 16">
        <path d="M6 0v16" className="stroke-border" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="6" cy="0" r="2.4" className="fill-primary/40" />
      </svg>
    </div>
  );
}

export function FlowHub({
  icon: Icon,
  children,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 shadow-sm">
      {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
      <span className="text-sm font-bold tracking-tight text-primary">{children}</span>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
    </div>
  );
}

export function DiagramPanel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-md sm:p-8"
      role="img"
      aria-label={label}
    >
      <div
        className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--primary-rgb,59,130,246)/0.12),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="relative space-y-3">{children}</div>
    </div>
  );
}
