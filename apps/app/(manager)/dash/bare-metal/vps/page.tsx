"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Cpu,
  Database,
  Gamepad2,
  Globe,
  HardDrive,
  MapPin,
  MemoryStick,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Shield,
  Square,
  Swords,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  OPERATING_SYSTEMS,
  PLANS,
  REGIONS,
  STATUS_META,
  fetchVpsList,
  type Vps,
  type VpsDedicatedServer,
  type VpsStatus,
  type VpsUsage,
} from "@/lib/mock/vps";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Routes (préparées pour l'intégration future)                        */
/* ------------------------------------------------------------------ */

// Page collection : /dash/bare-metal/vps
// Espace de gestion détaillé (à venir) : /dash/bare-metal/vps/[id]
// Sections futures de chaque VPS : [id]/overview, [id]/console,
// [id]/compute, [id]/storage, [id]/networking, [id]/snapshots,
// [id]/backups, [id]/monitoring, [id]/security, [id]/settings
const VPS_DETAIL_BASE = "/dash/bare-metal/vps";

const vpsDetailHref = (vpsId: string) => `${VPS_DETAIL_BASE}/${vpsId}`;

type SortKey = "name-asc" | "name-desc" | "vcpu-asc" | "vcpu-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "vcpu-asc", label: "vCPU (low to high)" },
  { value: "vcpu-desc", label: "vCPU (high to low)" },
];

const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

const formatNumber = (value: number) => numberFormatter.format(value);

/* ------------------------------------------------------------------ */
/* Sous-composants                                                     */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: VpsStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge className={cn("gap-1.5", meta.badge)}>
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

function UsageIndicator({ usage }: { usage: VpsUsage }) {
  const rows: { label: string; value: number }[] = [
    { label: "CPU", value: usage.cpu },
    { label: "RAM", value: usage.ram },
    { label: "Disk", value: usage.disk },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-2">
          <span className="w-6 text-[10px] font-medium text-muted-foreground">{row.label}</span>
          <div className="h-1 w-14 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full",
                row.value > 85 ? "bg-red-500" : row.value > 70 ? "bg-amber-500" : "bg-primary",
              )}
              style={{ width: `${row.value}%` }}
            />
          </div>
          <span className="w-7 text-right text-[10px] text-muted-foreground tabular-nums">
            {row.value}%
          </span>
        </div>
      ))}
    </div>
  );
}

interface VpsKebabMenuProps {
  vps: Vps;
  onNotice: (message: string) => void;
}

function VpsKebabMenu({ vps, onNotice }: VpsKebabMenuProps) {
  const actions: {
    key: string;
    label: string;
    icon: LucideIcon;
    disabled?: boolean;
  }[] = [
    { key: "start", label: "Start", icon: Play, disabled: vps.status === "running" },
    { key: "stop", label: "Stop", icon: Square, disabled: vps.status === "stopped" },
    { key: "restart", label: "Restart", icon: RotateCcw, disabled: vps.status === "stopped" },
    { key: "reinstall", label: "Reinstall", icon: RefreshCw },
    { key: "console", label: "Open Console", icon: Terminal },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Actions for ${vps.name}`}
          title={`Actions for ${vps.name}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{vps.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.key}
            disabled={action.disabled}
            onSelect={(event) => {
              event.preventDefault();
              if (action.disabled) return;
              const verb =
                action.key === "start"
                  ? "Starting"
                  : action.key === "stop"
                    ? "Stopping"
                    : action.key === "restart"
                      ? "Restarting"
                      : action.key === "reinstall"
                        ? "Reinstalling"
                        : "Opening the console for";
              onNotice(`${verb} ${vps.name}… (demo action)`);
            }}
          >
            <action.icon className="size-4 text-muted-foreground" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ManageButton({ vps }: { vps: Vps }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={vpsDetailHref(vps.id)}>
        Manage <ArrowRight className="size-3.5" />
      </Link>
    </Button>
  );
}

interface VpsListProps {
  vpsList: Vps[];
  onNotice: (message: string) => void;
}

function VpsDesktopTable({ vpsList, onNotice }: VpsListProps) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>VPS</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>vCPU</TableHead>
            <TableHead>RAM</TableHead>
            <TableHead>Storage</TableHead>
            <TableHead>IP address</TableHead>
            <TableHead>Operating System</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Dedicated Server</TableHead>
            <TableHead>Uptime</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vpsList.map((vps) => (
            <TableRow key={vps.id}>
              <TableCell>
                <Link href={vpsDetailHref(vps.id)} className="font-medium hover:underline">
                  {vps.name}
                </Link>
              </TableCell>
              <TableCell>
                <StatusBadge status={vps.status} />
              </TableCell>
              <TableCell>
                <p className="font-medium">{vps.plan}</p>
                <p className="text-xs text-muted-foreground">{vps.flavor}</p>
              </TableCell>
              <TableCell className="tabular-nums">{vps.vcpu}</TableCell>
              <TableCell className="tabular-nums">{vps.ramGb} GB</TableCell>
              <TableCell className="tabular-nums">
                {vps.storageGb} GB{" "}
                <span className="text-xs text-muted-foreground">{vps.storageType}</span>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs">{vps.ip}</span>
              </TableCell>
              <TableCell>{vps.os}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{vps.region}</TableCell>
              <TableCell>
                {vps.dedicated ? (
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="truncate text-xs font-medium">{vps.dedicated.name}</span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="tabular-nums">{vps.uptime}</TableCell>
              <TableCell>
                <UsageIndicator usage={vps.usage} />
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1.5">
                  <ManageButton vps={vps} />
                  <VpsKebabMenu vps={vps} onNotice={onNotice} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function VpsMobileCards({ vpsList, onNotice }: VpsListProps) {
  return (
    <div className="grid gap-3 p-4 md:hidden">
      {vpsList.map((vps) => (
        <div key={vps.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link href={vpsDetailHref(vps.id)} className="font-semibold hover:underline">
                {vps.name}
              </Link>
              <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" aria-hidden="true" />
                {vps.region}
              </p>
            </div>
            <StatusBadge status={vps.status} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Plan
              </p>
              <p className="mt-0.5 font-medium">
                {vps.plan} <span className="text-xs font-normal text-muted-foreground">{vps.flavor}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Operating System
              </p>
              <p className="mt-0.5">{vps.os}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Resources
              </p>
              <p className="mt-0.5 tabular-nums">
                {vps.vcpu} vCPU · {vps.ramGb} GB RAM · {vps.storageGb} GB {vps.storageType}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                IP address
              </p>
              <p className="mt-0.5 font-mono text-xs">{vps.ip}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Uptime
              </p>
              <p className="mt-0.5 tabular-nums">{vps.uptime}</p>
            </div>
            {vps.dedicated ? (
              <div className="col-span-2">
                <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Dedicated Server
                </p>
                <p className="mt-0.5 truncate text-xs font-medium">{vps.dedicated.name}</p>
              </div>
            ) : null}
          </div>

          <div className="mt-3 border-t border-border pt-3">
            <UsageIndicator usage={vps.usage} />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <ManageButton vps={vps} />
            <VpsKebabMenu vps={vps} onNotice={onNotice} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* États de chargement et d'erreur                                     */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-4 rounded-sm" />
            </div>
            <Skeleton className="mt-4 h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Capacité globale */}
      <div className="rounded-lg border border-border bg-card">
        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="px-5 py-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-5 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-3 w-48" />
        </div>
        <div className="p-5">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="mt-3 h-8 w-full rounded-md" />
          <Skeleton className="mt-3 h-8 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Empty className="px-6 py-16">
        <EmptyMedia variant="icon">
          <AlertTriangle className="size-6" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Unable to load your VPS</EmptyTitle>
          <EmptyDescription>
            We couldn&apos;t reach the infrastructure API. Please try again in a moment.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={onRetry}>
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Création de VPS (dialog)                                             */
/* ------------------------------------------------------------------ */

const CREATE_TEMPLATES = [
  {
    value: "minecraft",
    label: "Game server — Minecraft",
    description: "OpenJDK tuned for your survival worlds",
    icon: Gamepad2,
    plan: "VPS-4",
    flavor: "Elite",
  },
  {
    value: "palworld",
    label: "Game server — Palworld",
    description: "Dedicated session with auto-restart",
    icon: Swords,
    plan: "VPS-8",
    flavor: "Performance",
  },
  {
    value: "web",
    label: "Web / App",
    description: "Reverse proxy & containers ready",
    icon: Globe,
    plan: "VPS-2",
    flavor: "Comfort",
  },
  {
    value: "database",
    label: "Database",
    description: "Optimized for MySQL / PostgreSQL",
    icon: Database,
    plan: "VPS-4",
    flavor: "Comfort",
  },
  {
    value: "vpn",
    label: "VPN",
    description: "WireGuard / OpenVPN gateway",
    icon: Shield,
    plan: "VPS-1",
    flavor: "Starter",
  },
  {
    value: "general",
    label: "General purpose",
    description: "Balanced resources, no preset",
    icon: Server,
    plan: "VPS-2",
    flavor: "Starter",
  },
] as const;

/**
 * Jeu de données : images système disponibles pour provisionner la machine.
 */
const OS_DESCRIPTIONS: Record<string, string> = {
  "Ubuntu 24.04": "LTS — a great all-round choice",
  "Debian 13": "Minimal and stable base image",
  "AlmaLinux 9": "Enterprise-grade, RHEL compatible",
  "Rocky Linux 9": "Community-driven RHEL build",
  "Windows Server 2022": "For .NET & Windows workloads",
};

const DEFAULT_OS = OPERATING_SYSTEMS[0];

interface CreateVpsDialogProps {
  dedicatedServers: VpsDedicatedServer[];
  onNotice: (message: string) => void;
}

function CreateVpsDialog({ dedicatedServers, onNotice }: CreateVpsDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [region, setRegion] = React.useState(REGIONS[0]);
  const [templateValue, setTemplateValue] = React.useState<string>(CREATE_TEMPLATES[0].value);
  const [os, setOs] = React.useState<string>(DEFAULT_OS);
  const [dedicated, setDedicated] = React.useState("none");

  const template =
    CREATE_TEMPLATES.find((item) => item.value === templateValue) ?? CREATE_TEMPLATES[0];
  const TemplateIcon = template.icon;

  const availableServers = dedicatedServers.filter((server) => server.region === region);

  const osDescription = OS_DESCRIPTIONS[os] ?? "Deploy this system image on the new VPS.";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const serverLabel =
      dedicated !== "none" ? `, associated to dedicated server ${dedicated}` : "";
    onNotice(
      `Creating VPS ${name.trim() || template.label} with OS ${os} (${template.plan} · ${template.flavor})${serverLabel}… (demo action)`,
    );
    setOpen(false);
    setName("");
    setOs(DEFAULT_OS);
    setDedicated("none");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create VPS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a VPS</DialogTitle>
          <DialogDescription>
            Pick a template and, if available, associate the machine with one of your dedicated
            servers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vps-name">Name</Label>
            <Input
              id="vps-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. vps-minecraft-01"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label>Template</Label>
              <Select value={templateValue} onValueChange={setTemplateValue}>
                <SelectTrigger className="w-full" aria-label="VPS template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CREATE_TEMPLATES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Region</Label>
              <Select
                value={region}
                onValueChange={(value) => {
                  setRegion(value);
                  setDedicated("none");
                }}
              >
                <SelectTrigger className="w-full" aria-label="Region">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Aperçu du template sélectionné */}
          <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <TemplateIcon className="size-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{template.label}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {template.description}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Recommended plan: {template.plan} · {template.flavor}
              </p>
            </div>
          </div>

          {/* Jeu de données : choix de l'OS à installer */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vps-os">Operating system</Label>
            <Select value={os} onValueChange={setOs}>
              <SelectTrigger id="vps-os" className="w-full" aria-label="Operating system">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPERATING_SYSTEMS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{osDescription}</p>
          </div>

          {/* Serveur dédié associé (si présent) */}
          <div className="flex flex-col gap-1.5">
            <Label>Dedicated server</Label>
            <Select value={dedicated} onValueChange={setDedicated}>
              <SelectTrigger className="w-full" aria-label="Dedicated server">
                <SelectValue placeholder="No dedicated server" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No dedicated server</SelectItem>
                {availableServers.map((server) => (
                  <SelectItem key={server.name} value={server.name}>
                    {server.name} · {server.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableServers.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No dedicated servers available in {region}.
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="submit">Create VPS</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

type Phase = "loading" | "ready" | "error";

export default function VpsPage() {
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [vpsList, setVpsList] = React.useState<Vps[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [regionFilter, setRegionFilter] = React.useState<string>("all");
  const [osFilter, setOsFilter] = React.useState<string>("all");
  const [planFilter, setPlanFilter] = React.useState<string>("all");
  const [sortKey, setSortKey] = React.useState<SortKey>("name-asc");
  const [notice, setNotice] = React.useState("");

  const showNotice = React.useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }, []);

  const load = React.useCallback(async (silent = false) => {
    if (!silent) setPhase("loading");
    try {
      const result = await fetchVpsList();
      setVpsList(result);
      setPhase("ready");
    } catch {
      setPhase("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleRefresh = () => {
    setRefreshing(true);
    void load(true);
  };

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setRegionFilter("all");
    setOsFilter("all");
    setPlanFilter("all");
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredVps = vpsList
    .filter((vps) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [vps.name, vps.os, vps.region, vps.plan, vps.flavor, vps.ip, vps.dedicated?.name]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || vps.status === statusFilter;
      const matchesRegion = regionFilter === "all" || vps.region === regionFilter;
      const matchesOs = osFilter === "all" || vps.os === osFilter;
      const matchesPlan = planFilter === "all" || vps.plan === planFilter;
      return matchesQuery && matchesStatus && matchesRegion && matchesOs && matchesPlan;
    })
    .sort((a, b) => {
      switch (sortKey) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "vcpu-asc":
          return a.vcpu - b.vcpu;
        case "vcpu-desc":
          return b.vcpu - a.vcpu;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const runningCount = vpsList.filter((vps) => vps.status === "running").length;
  const stoppedCount = vpsList.filter((vps) => vps.status === "stopped").length;
  const attentionCount = vpsList.filter(
    (vps) => vps.status === "maintenance" || vps.status === "warning",
  ).length;
  const vcpuTotal = vpsList.reduce((sum, vps) => sum + vps.vcpu, 0);
  const ramTotal = vpsList.reduce((sum, vps) => sum + vps.ramGb, 0);
  const storageTotal = vpsList.reduce((sum, vps) => sum + vps.storageGb, 0);

  const dedicatedServers = Array.from(
    new Map(
      vpsList
        .map((vps) => vps.dedicated)
        .filter((server): server is VpsDedicatedServer => Boolean(server))
        .map((server) => [server.name, server]),
    ).values(),
  );

  const statTiles: {
    label: string;
    value: string;
    icon: LucideIcon;
    iconClass?: string;
  }[] = [
    { label: "Total VPS", value: formatNumber(vpsList.length), icon: Server },
    { label: "Running", value: formatNumber(runningCount), icon: CheckCircle2, iconClass: "text-emerald-500" },
    { label: "Stopped", value: formatNumber(stoppedCount), icon: Circle, iconClass: "text-muted-foreground" },
    { label: "Maintenance / Warning", value: formatNumber(attentionCount), icon: AlertTriangle, iconClass: "text-amber-500" },
  ];

  const capacityItems = [
    { label: "vCPU allocated", value: formatNumber(vcpuTotal), unit: "vCPU", icon: Cpu },
    { label: "RAM allocated", value: formatNumber(ramTotal), unit: "GB", icon: MemoryStick },
    { label: "Storage allocated", value: formatNumber(storageTotal), unit: "GB NVMe", icon: HardDrive },
  ];

  return (
    <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
      {/* Fil d'Ariane */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <span className="text-sm text-muted-foreground">Bare Metal</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>VPS</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* En-tête de la page */}
      <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your virtual private servers
          </p>
        </div>
        <CreateVpsDialog dedicatedServers={dedicatedServers} onNotice={showNotice} />
      </div>

      {notice && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Résumé */}
      <section className="mt-6" aria-label="VPS summary">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div key={tile.label} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{tile.label}</p>
                  <Icon
                    className={cn("size-4 text-muted-foreground", tile.iconClass)}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                  {tile.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Capacité globale (secondaire) */}
        <div className="mt-4 rounded-lg border border-border bg-card">
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {capacityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 px-5 py-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold tabular-nums">
                      {item.value} <span className="text-xs font-normal text-muted-foreground">{item.unit}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Barre d'outils : recherche, filtres & tri */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search VPS, IP, OS…"
            aria-label="Search VPS"
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {Object.entries(STATUS_META).map(([value, meta]) => (
                <SelectItem key={value} value={value}>
                  {meta.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-44" aria-label="Filter by region">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={osFilter} onValueChange={setOsFilter}>
            <SelectTrigger className="w-44" aria-label="Filter by operating system">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All OS</SelectItem>
              {OPERATING_SYSTEMS.map((os) => (
                <SelectItem key={os} value={os}>
                  {os}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-32" aria-label="Filter by plan">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              {PLANS.map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {plan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
            <SelectTrigger className="w-40" aria-label="Sort VPS">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleRefresh}
            disabled={phase === "loading"}
            aria-label="Refresh VPS list"
            title="Refresh"
          >
            <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
          </Button>
        </div>
      </div>

      {phase === "loading" ? (
        <div className="mt-6">
          <PageSkeleton />
        </div>
      ) : phase === "error" ? (
        <div className="mt-6">
          <ErrorState onRetry={() => void load()} />
        </div>
      ) : (
        <>
          {/* Liste des VPS */}
          <section className="mt-6" aria-label="VPS list">
            <div className="rounded-lg border border-border bg-card">
              {vpsList.length === 0 ? (
                <Empty className="px-6 py-14">
                  <EmptyMedia variant="icon">
                    <Server className="size-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No VPS yet</EmptyTitle>
                    <EmptyDescription>
                      Create your first virtual private server to get started.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild>
                      <Link href="/order/check-in">
                        <Plus className="size-4" />
                        Create VPS
                      </Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : filteredVps.length === 0 ? (
                <Empty className="px-6 py-14">
                  <EmptyMedia variant="icon">
                    <Search className="size-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No VPS match your filters</EmptyTitle>
                    <EmptyDescription>
                      Try adjusting your search or filters to find what you&apos;re looking for.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  </EmptyContent>
                </Empty>
              ) : (
                <>
                  <VpsDesktopTable vpsList={filteredVps} onNotice={showNotice} />
                  <VpsMobileCards vpsList={filteredVps} onNotice={showNotice} />
                </>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
