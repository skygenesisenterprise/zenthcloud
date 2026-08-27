import * as React from "react";
import {
  Server,
  Cloud,
  Network,
  Shield,
  Activity,
  CreditCard,
  Phone,
  Code2,
  Zap,
  Search,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsolePreviewProps {
  items: Array<{ title: string; icon: string }>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  server: Server,
  cloud: Cloud,
  network: Network,
  shield: Shield,
  activity: Activity,
  billing: CreditCard,
  phone: Phone,
  code: Code2,
  zap: Zap,
};

const navLabels = ["Overview", "Instances", "Storage", "Networks"];

const instances = [
  { name: "web-prod-01", cpu: "c4m8", region: "eu-west", status: "Online" },
  { name: "db-primary", cpu: "c8m32", region: "eu-central", status: "Online" },
  { name: "worker-3", cpu: "c2m4", region: "eu-west", status: "Stopped" },
];

const bars = [42, 58, 36, 72, 55, 48, 81, 66, 51, 74, 60, 47];

export function ConsolePreview({ items }: ConsolePreviewProps) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      role="img"
      aria-label="ZenthCloud Console"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/70 bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-xs font-semibold text-foreground">ZenthCloud Console</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 py-1 text-xs text-muted-foreground sm:flex">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            Ctrl+K
          </span>
          <span className="hidden h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-background text-muted-foreground sm:inline-flex">
            <Bell className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
        {/* Sidebar */}
        <aside className="border-b border-border/70 bg-muted/20 sm:border-b-0 sm:border-r">
          <nav className="flex flex-row gap-1 overflow-x-auto px-3 py-3 sm:flex-col sm:p-3">
            {items.map((item, index) => {
              const Icon = iconMap[item.icon] ?? Server;
              const active = index === 0;
              return (
                <span
                  key={item.title}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">{item.title}</span>
                </span>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Overview</h3>
              <p className="text-xs text-muted-foreground">eu-west · eu-central</p>
            </div>
            <div className="flex gap-1.5">
              {navLabels.map((label, i) => (
                <span
                  key={label}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium",
                    i === 2 ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Instances", value: "12" },
              { label: "Regions", value: "2" },
              { label: "Volumes", value: "8" },
              { label: "Costs / month", value: "€412" },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-border bg-background p-3">
                <p className="text-[11px] text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-lg font-bold text-foreground">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Chart + instances */}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">Usage</p>
                <span className="text-[11px] text-muted-foreground">30 days</span>
              </div>
              <div className="mt-4 flex h-24 items-end gap-1.5">
                {bars.map((height, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-primary/25" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-xs font-semibold text-foreground">Instances</p>
              <div className="mt-3 space-y-2">
                {instances.map((inst) => (
                  <div key={inst.name} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{inst.name}</span>
                    <span className="text-muted-foreground">{inst.cpu} · {inst.region}</span>
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", inst.status === "Online" ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>
                      {inst.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}