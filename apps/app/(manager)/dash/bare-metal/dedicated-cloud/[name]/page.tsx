"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeft,
  Boxes,
  Copy,
  Cpu,
  HardDrive,
  Layers,
  MemoryStick,
  MoreHorizontal,
  Network,
  Plus,
  RefreshCw,
  RotateCcw,
  Server,
  Settings,
  Terminal,
  Wrench,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  STATUS_META,
  fetchDedicatedCloud,
  type DcHost,
  type DcStatus,
  type DedicatedCloudDetail,
} from "@/lib/mock/dedicated-cloud";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Sections de l'espace de gestion Dedicated Cloud                     */
/* ------------------------------------------------------------------ */

const CLOUD_TABS = [
  "overview",
  "hosts",
  "virtual-machines",
  "storage",
  "networking",
  "backups",
  "monitoring",
  "settings",
] as const;

const formatTabLabel = (tab: string) =>
  tab
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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

function UsageRow({
  label,
  value,
  barClass,
}: {
  label: string;
  value: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", barClass)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

const usageBarClass = (value: number) =>
  value > 85 ? "bg-red-500" : value > 70 ? "bg-amber-500" : "bg-primary";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}

interface CopyRowProps {
  label: string;
  value: string;
  onCopy: (message: string) => void;
}

function CopyRow({ label, value, onCopy }: CopyRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate font-mono text-sm">{value}</p>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onCopy(`${label} ${value} copied`)}
        aria-label={`Copy ${label}`}
        title="Copy"
      >
        <Copy className="size-3.5" />
      </Button>
    </div>
  );
}

interface HostCardProps {
  host: DcHost;
}

function HostCard({ host }: HostCardProps) {
  const meta = STATUS_META[host.status];
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center gap-2">
        <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-md", meta.iconClass)}>
          <Server className="size-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{host.name}</p>
          <p className="truncate text-xs text-muted-foreground">{host.model}</p>
        </div>
        <StatusBadge status={host.status} />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <UsageRow label="CPU" value={host.cpuUsage} barClass={usageBarClass(host.cpuUsage)} />
        <UsageRow label="RAM" value={host.ramUsage} barClass={usageBarClass(host.ramUsage)} />
        <UsageRow label="Disk" value={host.diskUsage} barClass={usageBarClass(host.diskUsage)} />
      </div>
      <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          <Cpu className="mr-1 inline size-3" aria-hidden="true" />
          {host.vcpu} vCPU
        </span>
        <span>
          <MemoryStick className="mr-1 inline size-3" aria-hidden="true" />
          {host.ramGb} GB
        </span>
        <span>
          <HardDrive className="mr-1 inline size-3" aria-hidden="true" />
          {host.storageTb} TB
        </span>
      </p>
    </div>
  );
}

interface ComingSoonProps {
  label: string;
  onBack: () => void;
}

function ComingSoon({ label, onBack }: ComingSoonProps) {
  return (
    <div className="mt-2 rounded-lg border border-border bg-card">
      <Empty className="px-6 py-16">
        <EmptyMedia variant="icon">
          <Wrench className="size-6" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>{label} is coming soon</EmptyTitle>
          <EmptyDescription>
            This section will be available in the next iteration of the Dedicated Cloud manager.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={onBack}>
            Back to Overview
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-64" />
        <div className="mt-4 flex items-center gap-3">
          <Skeleton className="size-10 rounded-md" />
          <div>
            <Skeleton className="h-7 w-44" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-3 h-7 w-24" />
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-40 w-full rounded-md" />
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
          <EmptyTitle>Unable to load this Dedicated Cloud</EmptyTitle>
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

type Phase = "loading" | "ready" | "error" | "not-found";

export default function DedicatedCloudDetailPage() {
  const params = useParams<{ name: string }>();
  const name = params.name ?? "";

  const [phase, setPhase] = React.useState<Phase>("loading");
  const [cloud, setCloud] = React.useState<DedicatedCloudDetail | null>(null);
  const [tab, setTab] = React.useState("overview");
  const [notice, setNotice] = React.useState("");

  const showNotice = React.useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }, []);

  const load = React.useCallback(async () => {
    setPhase("loading");
    try {
      const result = await fetchDedicatedCloud(name);
      if (!result) {
        setPhase("not-found");
        return;
      }
      setCloud(result);
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }, [name]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleRefresh = () => {
    if (!cloud) return;
    void load();
    showNotice(`Refreshing ${cloud.name}…`);
  };

  if (phase === "loading") {
    return (
      <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
        <PageSkeleton />
      </main>
    );
  }

  if (phase === "error") {
    return (
      <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
        <ErrorState onRetry={() => void load()} />
      </main>
    );
  }

  if (phase === "not-found" || !cloud) {
    return (
      <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
        <div className="rounded-lg border border-border bg-card">
          <Empty className="px-6 py-16">
            <EmptyMedia variant="icon">
              <Server className="size-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Dedicated Cloud not found</EmptyTitle>
              <EmptyDescription>
                The environment &quot;{name}&quot; does not exist or has been deleted.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/dash/bare-metal/dedicated-cloud">Back to all Dedicated Clouds</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </main>
    );
  }

  const meta = STATUS_META[cloud.status];

  const quickStats = [
    { label: "vCPU", value: String(cloud.vcpu), icon: Cpu },
    { label: "RAM", value: `${cloud.ramGb} GB`, icon: MemoryStick },
    { label: "Storage", value: `${cloud.storageTb} TB`, icon: HardDrive },
    { label: "Virtual Machines", value: String(cloud.vms), icon: Boxes },
  ];

  const activity = [
    {
      id: "act-1",
      icon: RotateCcw,
      title: "VM restart — db-prod-03",
      time: "22 min ago",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      id: "act-2",
      icon: Archive,
      title: "Backup completed — nightly job (18 VMs)",
      time: "2 h ago",
      iconClass: "bg-emerald-500/15 text-emerald-500",
    },
    {
      id: "act-3",
      icon: Settings,
      title: "VLAN configuration changed — VLAN 120",
      time: "Yesterday, 16:42",
      iconClass: "bg-sky-500/15 text-sky-500",
    },
    {
      id: "act-4",
      icon: Network,
      title: "Host maintenance scheduled",
      time: "5 h ago",
      iconClass: "bg-amber-500/15 text-amber-500",
    },
  ];

  return (
    <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
      {/* Retour à la liste */}
      <Link
        href="/dash/bare-metal/dedicated-cloud"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All Dedicated Clouds
      </Link>

      {/* Fil d'Ariane */}
      <Breadcrumb className="mt-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <span className="text-sm text-muted-foreground">Bare Metal</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link
              href="/dash/bare-metal/dedicated-cloud"
              className="text-sm hover:text-foreground"
            >
              Dedicated Cloud
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{cloud.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* En-tête */}
      <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-md",
              meta.iconClass,
            )}
          >
            <Server className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{cloud.name}</h1>
              <StatusBadge status={cloud.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {cloud.environment} · {cloud.region}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Version {cloud.version} · Management{" "}
              <span className="font-mono">{cloud.managementIp}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`More actions for ${cloud.name}`}
                title={`More actions for ${cloud.name}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{cloud.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  showNotice(`Adding a host to ${cloud.name} requires confirmation.`);
                }}
              >
                <Plus className="size-4 text-muted-foreground" />
                Add a host
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  showNotice(`Opening the console for ${cloud.name}… (demo action)`);
                }}
              >
                <Terminal className="size-4 text-muted-foreground" />
                Open console
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  showNotice(`Scheduling a maintenance window for ${cloud.name}.`);
                }}
              >
                <Wrench className="size-4 text-muted-foreground" />
                Schedule maintenance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-5 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
        >
          <Activity className="size-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Indicateurs rapides */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Environment resources">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="mt-3 text-xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
            </div>
          );
        })}
      </section>

      {/* Navigation par sections */}
      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-lg p-1">
          {CLOUD_TABS.map((item) => (
            <TabsTrigger key={item} value={item} className="h-8 flex-none">
              {formatTabLabel(item)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-2">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
            <div className="flex flex-col gap-6">
              {/* Utilisation globale des ressources */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="Resource usage">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Resource usage</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Aggregated load across {cloud.hosts} hosts
                    </p>
                  </div>
                  <Activity className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  <UsageRow
                    label={`CPU · ${cloud.vcpu} vCPU`}
                    value={cloud.cpuUsage}
                    barClass={usageBarClass(cloud.cpuUsage)}
                  />
                  <UsageRow
                    label={`RAM · ${cloud.ramGb} GB`}
                    value={cloud.ramUsage}
                    barClass={usageBarClass(cloud.ramUsage)}
                  />
                  <UsageRow
                    label={`Storage · ${cloud.storageTb} TB`}
                    value={cloud.diskUsage}
                    barClass={usageBarClass(cloud.diskUsage)}
                  />
                </div>
                <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  Usage is sampled every 5 minutes and kept for 24 hours.
                </p>
              </section>

              {/* Hôtes */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="Hosts">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Hosts</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cloud.hostList.length} physical hosts in this environment
                    </p>
                  </div>
                  <Server className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {cloud.hostList.map((host) => (
                    <HostCard key={host.id} host={host} />
                  ))}
                </div>
              </section>

              {/* Détails de la configuration */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="Configuration details">
                <h2 className="text-sm font-semibold">Details</h2>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <DetailRow label="Environment" value={cloud.environment} />
                  <DetailRow label="Region" value={cloud.region} />
                  <DetailRow label="Platform version" value={`${cloud.version} · ${cloud.upgraded}`} />
                  <DetailRow label="Hosts" value={`${cloud.hosts} physical`} />
                  <DetailRow label="Virtual Machines" value={String(cloud.vms)} />
                  <DetailRow label="Created" value={cloud.createdAt} />
                </dl>
              </section>
            </div>

            <div className="flex flex-col gap-6">
              {/* Réseau */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="Network">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Network</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Management & VLANs</p>
                  </div>
                  <Network className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <CopyRow label="Management" value={cloud.managementIp} onCopy={showNotice} />
                  <CopyRow label="Gateway" value={cloud.gateway} onCopy={showNotice} />
                  <CopyRow label="Public IPs" value={`${cloud.publicIps} assigned`} onCopy={showNotice} />
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-medium text-muted-foreground">VLANs</p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {cloud.vlanList.map((vlan) => (
                      <li key={vlan.id} className="flex items-center gap-2 text-sm">
                        <Layers className="size-3.5 text-muted-foreground" aria-hidden="true" />
                        <span className="font-mono">VLAN {vlan.id}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="truncate text-muted-foreground">{vlan.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Activité récente */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="Recent activity">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Recent Activity</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Events on this environment</p>
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
                        <p className="mt-0.5 text-xs text-muted-foreground">{event.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() =>
                    showNotice(
                      "The full activity log will be available in the Monitoring section.",
                    )
                  }
                  className="mt-5 w-full border-t border-border pt-4 text-left text-sm font-medium text-primary hover:underline"
                >
                  View activity
                </button>
              </section>
            </div>
          </div>
        </TabsContent>

        {CLOUD_TABS.filter((item) => item !== "overview").map((item) => (
          <TabsContent key={item} value={item} className="mt-2">
            <ComingSoon label={formatTabLabel(item)} onBack={() => setTab("overview")} />
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}