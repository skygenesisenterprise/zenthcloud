"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowRight,
  Boxes,
  Check,
  Cpu,
  HardDrive,
  MapPin,
  MemoryStick,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Wrench,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEDICATED_CLOUDS,
  REGIONS,
  STATUS_META,
  type DcStatus,
  type DedicatedCloud,
} from "@/lib/mock/dedicated-cloud";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Routes (préparées pour l'intégration future)                        */
/* ------------------------------------------------------------------ */

// Page collection : /dash/bare-metal/dedicated-cloud
// Espace de gestion détaillé (à venir) : /dash/bare-metal/dedicated-cloud/[id]
// Sections futures de chaque environnement : [id]/overview, [id]/hosts,
// [id]/virtual-machines, [id]/storage, [id]/networking, [id]/backups,
// [id]/monitoring, [id]/settings
const CLOUD_DETAIL_BASE = "/dash/bare-metal/dedicated-cloud";

const cloudDetailHref = (cloudId: string) => `${CLOUD_DETAIL_BASE}/${cloudId}`;
const cloudSectionHref = (cloudId: string, section: string) =>
  `${CLOUD_DETAIL_BASE}/${cloudId}/${section}`;

const CLOUD_SECTIONS = [
  "overview",
  "hosts",
  "virtual-machines",
  "storage",
  "networking",
  "backups",
  "monitoring",
  "settings",
] as const;

const formatSectionLabel = (section: string) =>
  section
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/* ------------------------------------------------------------------ */
/* Données de démonstration (partagées depuis @/lib/mock)               */
/* DEDICATED_CLOUDS, STATUS_META, REGIONS, types depuis                 */
/* @/lib/mock/dedicated-cloud                                           */
/* ------------------------------------------------------------------ */

interface CapacityItem {
  key: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  used: number;
  total: number;
  unit: string;
  bar: string;
}

const CAPACITY: CapacityItem[] = [
  { key: "compute", label: "Compute", sublabel: "vCPU", icon: Cpu, used: 512, total: 784, unit: "vCPU", bar: "bg-primary" },
  { key: "memory", label: "Memory", sublabel: "RAM", icon: MemoryStick, used: 3.2, total: 4.4, unit: "TB", bar: "bg-chart-2" },
  { key: "storage", label: "Storage", sublabel: "Total usable", icon: HardDrive, used: 92, total: 166, unit: "TB", bar: "bg-chart-4" },
  { key: "network", label: "Network", sublabel: "Bandwidth", icon: Network, used: 26, total: 60, unit: "Gbps", bar: "bg-chart-5" },
];

interface ActivityEvent {
  id: string;
  icon: LucideIcon;
  title: string;
  cloud: string;
  time: string;
  iconClass: string;
}

const ACTIVITY: ActivityEvent[] = [
  {
    id: "a1",
    icon: RotateCcw,
    title: "VM restart — db-prod-03",
    cloud: "DC-FRA-01",
    time: "22 min ago",
    iconClass: "bg-primary/10 text-primary",
  },
  {
    id: "a2",
    icon: Archive,
    title: "Backup completed — nightly job (18 VMs)",
    cloud: "DC-LUX-01",
    time: "2 h ago",
    iconClass: "bg-emerald-500/15 text-emerald-500",
  },
  {
    id: "a3",
    icon: Wrench,
    title: "Host maintenance scheduled",
    cloud: "DC-DE-01",
    time: "5 h ago",
    iconClass: "bg-amber-500/15 text-amber-500",
  },
  {
    id: "a4",
    icon: Network,
    title: "Network configuration change — VLAN 120",
    cloud: "DC-UK-01",
    time: "Yesterday, 16:42",
    iconClass: "bg-sky-500/15 text-sky-500",
  },
];

interface ManagerData {
  clouds: DedicatedCloud[];
  capacity: CapacityItem[];
  activity: ActivityEvent[];
}

/* ------------------------------------------------------------------ */
/* API mockée (à remplacer par l'appel backend)                        */
/* ------------------------------------------------------------------ */

function fetchManagerData(): Promise<ManagerData> {
  return new Promise((resolve) => {
    window.setTimeout(
      () =>
        resolve({
          clouds: DEDICATED_CLOUDS,
          capacity: CAPACITY,
          activity: ACTIVITY,
        }),
      900,
    );
  });
}

const numberFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

const formatNumber = (value: number) => numberFormatter.format(value);

/* ------------------------------------------------------------------ */
/* Sous-composants                                                     */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: DcStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge className={cn("gap-1.5", meta.badge)}>
      <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden="true" />
      {meta.label}
    </Badge>
  );
}

interface DedicatedCloudRowProps {
  cloud: DedicatedCloud;
  onNotice: (message: string) => void;
}

function DedicatedCloudRow({ cloud, onNotice }: DedicatedCloudRowProps) {
  const meta = STATUS_META[cloud.status];

  const metrics = [
    { label: "Hosts", value: formatNumber(cloud.hosts) },
    { label: "vCPU", value: formatNumber(cloud.vcpu) },
    { label: "RAM", value: `${formatNumber(cloud.ramGb)} GB` },
    { label: "Storage", value: `${formatNumber(cloud.storageTb)} TB` },
    { label: "VMs", value: formatNumber(cloud.vms) },
    { label: "Networks", value: formatNumber(cloud.networks) },
    { label: "Public IPs", value: formatNumber(cloud.publicIps) },
  ];

  return (
    <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center">
      {/* Identité de l'environnement */}
      <div className="flex min-w-0 items-start gap-3 lg:w-60 lg:shrink-0">
        <span
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md",
            meta.iconClass,
          )}
        >
          <Server className="size-4.5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={cloudDetailHref(cloud.id)}
              className="truncate text-sm font-semibold hover:underline"
            >
              {cloud.name}
            </Link>
            <span className={cn("size-1.5 shrink-0 rounded-full", meta.dot)} aria-hidden="true" />
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{cloud.environment}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            {cloud.region}
          </p>
        </div>
      </div>

      {/* Métriques de capacité */}
      <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 xl:grid-cols-7">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {metric.label}
            </p>
            <p className="mt-1 text-sm font-medium tabular-nums">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Statut & actions */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
        <StatusBadge status={cloud.status} />
        <Button asChild variant="outline" size="sm">
          <Link href={cloudDetailHref(cloud.id)}>
            Manage <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${cloud.name}`}
              title={`Actions for ${cloud.name}`}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{cloud.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CLOUD_SECTIONS.map((section) => (
              <DropdownMenuItem
                key={section}
                onSelect={(event) => {
                  event.preventDefault();
                  onNotice(
                    `The ${formatSectionLabel(section)} view of ${cloud.name} will open in the dedicated cloud manager.`,
                  );
                }}
              >
                {formatSectionLabel(section)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* États de chargement, d'erreur et vide                               */
/* ------------------------------------------------------------------ */

function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Capacité */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-4 rounded-sm" />
            </div>
            <Skeleton className="mt-4 h-6 w-32" />
            <Skeleton className="mt-4 h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Liste des environnements */}
      <div className="rounded-lg border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-3 w-56" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center">
              <div className="flex items-center gap-3 lg:w-60">
                <Skeleton className="size-9 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="mt-2 h-3 w-44" />
                </div>
              </div>
              <div className="grid flex-1 grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((__, metricIndex) => (
                  <div key={metricIndex}>
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="mt-2 h-4 w-16" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-8 w-28 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Résumé infrastructure */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="size-9 rounded-md" />
            <Skeleton className="mt-4 h-7 w-20" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
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
          <EmptyTitle>Unable to load your dedicated clouds</EmptyTitle>
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

type Phase = "loading" | "ready" | "error";

export default function DedicatedCloudPage() {
  const [phase, setPhase] = React.useState<Phase>("loading");
  const [data, setData] = React.useState<ManagerData | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [regionFilter, setRegionFilter] = React.useState<string>("all");
  const [notice, setNotice] = React.useState("");

  const showNotice = React.useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }, []);

  const load = React.useCallback(async (silent = false) => {
    if (!silent) setPhase("loading");
    try {
      const result = await fetchManagerData();
      setData(result);
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
  };

  const clouds = data?.clouds ?? [];
  const capacity = data?.capacity ?? [];
  const activity = data?.activity ?? [];

  const normalizedQuery = query.trim().toLowerCase();
  const filteredClouds = clouds.filter((cloud) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [cloud.name, cloud.environment, cloud.region, cloud.id]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    const matchesStatus = statusFilter === "all" || cloud.status === statusFilter;
    const matchesRegion = regionFilter === "all" || cloud.region === regionFilter;
    return matchesQuery && matchesStatus && matchesRegion;
  });

  const hostsTotal = clouds.reduce((sum, cloud) => sum + cloud.hosts, 0);
  const vmsTotal = clouds.reduce((sum, cloud) => sum + cloud.vms, 0);
  const storageTotal = clouds.reduce((sum, cloud) => sum + cloud.storageTb, 0);
  const networksTotal = clouds.reduce((sum, cloud) => sum + cloud.networks, 0);
  const firstCloud = clouds[0];

  const summaryTiles = [
    {
      label: "Hosts",
      value: formatNumber(hostsTotal),
      description: "Across all dedicated clouds",
      icon: Server,
      href: firstCloud ? cloudSectionHref(firstCloud.id, "hosts") : null,
    },
    {
      label: "Virtual Machines",
      value: formatNumber(vmsTotal),
      description: "Total provisioned",
      icon: Boxes,
      href: firstCloud ? cloudSectionHref(firstCloud.id, "virtual-machines") : null,
    },
    {
      label: "Storage",
      value: `${formatNumber(storageTotal)} TB`,
      description: "Raw usable capacity",
      icon: HardDrive,
      href: firstCloud ? cloudSectionHref(firstCloud.id, "storage") : null,
    },
    {
      label: "Networks",
      value: formatNumber(networksTotal),
      description: "Private networks & VLANs",
      icon: Network,
      href: firstCloud ? cloudSectionHref(firstCloud.id, "networking") : null,
    },
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
            <BreadcrumbPage>Dedicated Cloud</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* En-tête de la page */}
      <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Dedicated Cloud</h1>
        </div>
        <Button asChild>
          <Link href="/order/check-in">
            <Plus className="size-4" />
            Create Dedicated Cloud
          </Link>
        </Button>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
        >
          <Check className="size-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Barre d'outils : recherche & filtres */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, environment or region…"
            aria-label="Search dedicated clouds"
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" aria-label="Filter by status">
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
            <SelectTrigger className="w-48" aria-label="Filter by region">
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

          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleRefresh}
            disabled={phase === "loading"}
            aria-label="Refresh dedicated clouds"
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
          {/* Aperçu de la capacité globale */}
          <section className="mt-6" aria-label="Capacity overview">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {capacity.map((item) => {
                const Icon = item.icon;
                const percent = Math.round((item.used / item.total) * 100);
                return (
                  <div key={item.key} className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground/70">{item.sublabel}</p>
                      </div>
                      <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <p className="mt-3 text-xl font-semibold tracking-tight tabular-nums">
                      {formatNumber(item.used)}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / {formatNumber(item.total)} {item.unit}
                      </span>
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full", item.bar)}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>{percent}% used</span>
                      <span>
                        {formatNumber(item.total - item.used)} {item.unit} available
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Liste des environnements Dedicated Cloud */}
          <section className="mt-6" aria-label="Dedicated clouds">
            <div className="rounded-lg border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-semibold">Dedicated Clouds</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {filteredClouds.length} of {clouds.length} environments · {hostsTotal} hosts
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Operational
                </span>
              </div>

              {filteredClouds.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredClouds.map((cloud) => (
                    <DedicatedCloudRow key={cloud.id} cloud={cloud} onNotice={showNotice} />
                  ))}
                </div>
              ) : (
                <Empty className="px-6 py-14">
                  <EmptyMedia variant="icon">
                    <Search className="size-6" />
                  </EmptyMedia>
                  <EmptyHeader>
                    <EmptyTitle>No dedicated clouds match your filters</EmptyTitle>
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
              )}
            </div>
          </section>

          {/* Résumé de l'infrastructure */}
          <section className="mt-8" aria-label="Infrastructure summary">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Infrastructure Summary</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aggregated view of your dedicated cloud estate
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {summaryTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <div key={tile.label} className="rounded-lg border border-border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <span className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="size-4.5" aria-hidden="true" />
                      </span>
                      {tile.href ? (
                        <Link
                          href={tile.href}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View
                        </Link>
                      ) : null}
                    </div>
                    <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums">
                      {tile.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{tile.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">{tile.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Activité récente */}
          <section className="mt-8" aria-label="Recent activity">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Recent Activity</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Latest infrastructure events across your environments
                  </p>
                </div>
                <Activity className="size-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <ul className="mt-5 flex flex-col gap-4">
                {activity.map((event) => (
                  <li key={event.id} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
                        event.iconClass,
                      )}
                    >
                      <event.icon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm">{event.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {event.cloud} · {event.time}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  showNotice(
                    "The full activity log will be available in the dedicated cloud manager.",
                  )
                }
                className="mt-5 flex w-full items-center justify-between border-t border-border pt-4 text-left text-sm font-medium text-primary hover:underline"
              >
                View activity
                <ArrowRight className="size-4" />
              </button>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
