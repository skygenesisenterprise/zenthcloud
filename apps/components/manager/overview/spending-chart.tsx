"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { SpendingPoint } from "@/lib/mock/overview";

const chartConfig = {
  amount: {
    label: "Dépenses",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function SpendingChart({ points, total }: { points: SpendingPoint[]; total: string }) {
  return (
    <section className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h3 className="font-semibold">Dépenses sur 12 mois</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Cumul des services, toutes régions confondues
          </p>
        </div>
        <p className="text-2xl font-semibold tracking-tight">{total}</p>
      </div>
      <div className="p-5">
        <ChartContainer config={chartConfig} className="aspect-[16/7]">
          <AreaChart data={points} margin={{ left: 4, right: 4, top: 4 }}>
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(label) => `Dépenses — ${label}`}
                  formatter={(value) => `${Number(value).toFixed(2).replace(".", ",")} €`}
                />
              }
            />
            <Area
              dataKey="amount"
              type="monotone"
              fill="url(#fillAmount)"
              stroke="var(--color-amount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
      <div className="border-t border-border px-5 py-4">
        <button
          onClick={() => toast.info("Ouverture des détails de facturation…")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Voir le détail des dépenses
          <ArrowUpRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
