import * as React from "react";
import { Monitor, ShieldCheck, Lock, MessageSquare, Cloud, Cpu, HardDrive, Network } from "lucide-react";

interface NetworkDiagramProps {
  users: string;
  items: Array<{ title: string; description: string }>;
  compute: string;
  storage: string;
  privateCloud: string;
}

const serviceIcons = [Monitor, ShieldCheck, Lock, MessageSquare];

export function NetworkDiagram({ users, items, compute, storage, privateCloud }: NetworkDiagramProps) {
  return (
    <div
      className="relative rounded-2xl border border-border bg-card p-5 shadow-md sm:p-7"
      role="img"
      aria-label={`${users} → ${items.map((i) => i.title).join(", ")} → ZenthCloud → ${compute}, ${storage}, ${privateCloud}`}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
        <g className="stroke-primary/20" strokeWidth="0.5" fill="none">
          {/* Users -> services */}
          <path d="M50 7 L22 28" />
          <path d="M50 7 L39 29" />
          <path d="M50 7 L61 29" />
          <path d="M50 7 L78 28" />
          {/* services -> hub */}
          <path d="M22 28 L50 62" />
          <path d="M39 29 L50 62" />
          <path d="M61 29 L50 62" />
          <path d="M78 28 L50 62" />
          {/* hub -> dest */}
          <path d="M50 62 L16 88" />
          <path d="M50 62 L50 88" />
          <path d="M50 62 L84 88" />
        </g>
      </svg>

      {/* Users */}
      <div className="relative flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 shadow-sm">
          <Monitor className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground sm:text-sm">{users}</span>
        </div>
      </div>

      {/* Access services 2x2 */}
      <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.slice(0, 4).map((item, index) => {
          const Icon = serviceIcons[index];
          return (
            <div key={item.title} className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2.5 text-center shadow-sm">
              <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-[11px] font-semibold leading-tight text-foreground">{item.title}</span>
            </div>
          );
        })}
      </div>

      {/* Hub */}
      <div className="relative mt-8 flex justify-center">
        <div className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-4 py-2 shadow-sm">
          <Cloud className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-bold tracking-tight text-foreground">ZenthCloud</span>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        </div>
      </div>

      {/* Destinations */}
      <div className="relative mt-8 grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2.5 text-center shadow-sm">
          <Cpu className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-foreground">{compute}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2.5 text-center shadow-sm">
          <HardDrive className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-foreground">{storage}</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-background px-2 py-2.5 text-center shadow-sm">
          <Network className="h-4 w-4 text-primary" aria-hidden="true" />
          <span className="text-[11px] font-semibold text-foreground">{privateCloud}</span>
        </div>
      </div>
    </div>
  );
}