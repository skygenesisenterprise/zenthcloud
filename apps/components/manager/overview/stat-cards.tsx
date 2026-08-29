"use client";

import * as React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  BarChart3,
  CreditCard,
  Gauge,
  TrendingDown,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { KpiStat } from "@/lib/mock/overview";

const STAT_ICONS: Record<KpiStat["icon"], LucideIcon> = {
  spending: CreditCard,
  resources: Zap,
  traffic: BarChart3,
  uptime: Gauge,
};

function Sparkline({ data }: { data: number[] }) {
  const points = data.map((value, index) => ({ index, value }));
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-sparkline)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-sparkline)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-sparkline)"
            strokeWidth={1.5}
            fill="url(#sparkline-fill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatCards({ stats }: { stats: KpiStat[] }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Résumé du compte">
      {stats.map((stat) => {
        const Icon = STAT_ICONS[stat.icon];
        const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
        return (
          <div
            key={stat.id}
            className="rounded-lg border border-border bg-card p-5"
            style={{ "--color-sparkline": "hsl(var(--primary))" } as React.CSSProperties}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight">{stat.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendIcon
                className={stat.trendUp ? "size-3 text-emerald-500" : "size-3 text-red-500"}
              />
              {stat.meta}
            </p>
            <div className="mt-3">
              <Sparkline data={stat.sparkline} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
