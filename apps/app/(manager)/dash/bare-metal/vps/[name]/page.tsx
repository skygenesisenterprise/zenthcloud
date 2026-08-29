"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeft,
  Bell,
  Clock,
  Copy,
  Cpu,
  Download,
  Folder,
  Gauge,
  HardDrive,
  KeyRound,
  Lock,
  MemoryStick,
  MoreHorizontal,
  Network,
  Play,
  Plus,
  Power,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Save,
  Server,
  Settings,
  Shield,
  Square,
  Terminal,
  Trash2,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STATUS_META, fetchVps, type Vps, type VpsStatus } from "@/lib/mock/vps";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Sections futures de l'espace de gestion VPS                         */
/* ------------------------------------------------------------------ */

const VPS_TABS = [
  "overview",
  "console",
  "compute",
  "storage",
  "networking",
  "snapshots",
  "backups",
  "monitoring",
  "security",
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

function StatusBadge({ status }: { status: VpsStatus }) {
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

interface IpRowProps {
  label: string;
  value: string;
  onCopy: (message: string) => void;
}

function IpRow({ label, value, onCopy }: IpRowProps) {
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

interface SectionCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

function SectionCard({ title, subtitle, icon: Icon, children, className }: SectionCardProps) {
  return (
    <section
      className={cn("rounded-lg border border-border bg-card p-5", className)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
        </div>
        {Icon ? <Icon className="size-4 text-muted-foreground" aria-hidden="true" /> : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Panels de gestion utilisables                                       */
/* ------------------------------------------------------------------ */

interface PanelProps {
  vps: Vps;
  onNotice: (message: string) => void;
}

function ConsolePanel({ vps, onNotice }: PanelProps) {
  const [connected, setConnected] = React.useState(true);
  const [input, setInput] = React.useState("");
  const [lines, setLines] = React.useState<string[]>([
    `${vps.os} 6.8.0-51-generic`,
    "Welcome to your virtual private server",
    `${vps.name} login: __`,// connected
  ]);

  const runCommand = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim();
    if (!command) return;
    setLines((prev) => [
      ...prev,
      `root@${vps.name}:~# ${command}`,
      `[demo] command executed on ${vps.os} — no output (simulation).`,
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Console" subtitle={`Web terminal for ${vps.name}`} icon={Terminal}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn("size-2 rounded-full", connected ? "bg-emerald-500" : "bg-muted-foreground")}
              aria-hidden="true"
            />
            {connected ? "Connected" : "Disconnected"}
          </div>
          <Button
            size="sm"
            variant={connected ? "outline" : "default"}
            onClick={() => {
              setConnected((value) => !value);
              onNotice(
                connected
                  ? `Disconnecting from ${vps.name}… (demo action)`
                  : `Connecting to ${vps.name}… (demo action)`,
              );
            }}
          >
            <Power className="size-4" />
            {connected ? "Disconnect" : "Connect"}
          </Button>
        </div>

        <div className="mt-4 rounded-md border border-border bg-[#0b0f19] p-3 font-mono text-xs text-emerald-300">
          <div className="flex h-56 flex-col justify-end gap-1 overflow-y-auto">
            {lines.map((line, index) => (
              <pre key={index} className="whitespace-pre-wrap wrap-break-words">
                {line}
              </pre>
            ))}
          </div>
          <form onSubmit={runCommand} className="mt-2 flex items-center gap-2">
            <span className="shrink-0">root@{vps.name}:~#</span>
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={!connected}
              placeholder={connected ? "Type a command and press Enter" : "Reconnect to type"}
              aria-label="Console command"
              className="h-7 border-transparent bg-transparent font-mono text-emerald-300 placeholder:text-emerald-300/40 focus:border-transparent focus-visible:ring-0"
            />
          </form>
        </div>
      </SectionCard>
    </div>
  );
}

function ComputePanel({ vps, onNotice }: PanelProps) {
  const [vcpu, setVcpu] = React.useState(String(vps.vcpu));
  const [ram, setRam] = React.useState(String(vps.ramGb));
  const [disk, setDisk] = React.useState(String(vps.storageGb));

  const apply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNotice(
      `Resizing ${vps.name} to ${vcpu} vCPU · ${ram} GB RAM · ${disk} GB — a reboot will be scheduled (demo action).`,
    );
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard title="Compute resources" subtitle="Adjust vCPU, RAM and disk" icon={Cpu}>
        <form onSubmit={apply} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>vCPU</Label>
            <Select value={vcpu} onValueChange={setVcpu}>
              <SelectTrigger className="w-full" aria-label="vCPU">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 4, 6, 8, 12, 16].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value} vCPU
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>RAM</Label>
            <Select value={ram} onValueChange={setRam}>
              <SelectTrigger className="w-full" aria-label="RAM">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[4, 8, 16, 32, 64].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value} GB
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Disk</Label>
            <Select value={disk} onValueChange={setDisk}>
              <SelectTrigger className="w-full" aria-label="Disk size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[80, 160, 320, 480, 640].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value} GB {vps.storageType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">Changes require a reboot.</p>
            <Button type="submit">
              <Save className="size-4" />
              Apply changes
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Current usage" subtitle="Live resource load" icon={Activity}>
        <div className="flex flex-col gap-4">
          <UsageRow label={`CPU · ${vps.vcpu} vCPU`} value={vps.usage.cpu} barClass={usageBarClass(vps.usage.cpu)} />
          <UsageRow label={`RAM · ${vps.ramGb} GB`} value={vps.usage.ram} barClass={usageBarClass(vps.usage.ram)} />
          <UsageRow
            label={`Disk · ${vps.storageGb} GB ${vps.storageType}`}
            value={vps.usage.disk}
            barClass={usageBarClass(vps.usage.disk)}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function StoragePanel({ vps, onNotice }: PanelProps) {
  const volumes = [
    { id: "system", label: "System volume", size: `${vps.storageGb} GB ${vps.storageType}`, usage: vps.usage.disk },
    { id: "additional", label: "Additional volume", size: "40 GB NVMe", usage: 22 },
  ];
  const [newSize, setNewSize] = React.useState(String(vps.storageGb));

  const resize = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNotice(`Expanding the system volume of ${vps.name} to ${newSize} GB… (demo action)`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard title="Storage" subtitle="Attached volumes" icon={HardDrive}>
        <ul className="flex flex-col gap-3">
          {volumes.map((volume) => (
            <li
              key={volume.id}
              className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Folder className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{volume.label}</p>
                  <p className="text-xs text-muted-foreground">{volume.size} · {volume.usage}% used</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Actions for ${volume.label}`}
                    title={`Actions for ${volume.label}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      onNotice(`Formatting ${volume.label} requires confirmation — destructive (demo action)`);
                    }}
                  >
                    <RotateCw className="size-4 text-muted-foreground" />
                    Format
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      onNotice(`Detaching ${volume.label} from ${vps.name} (demo action)`);
                    }}
                  >
                    <Trash2 className="size-4 text-muted-foreground" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => onNotice(`Attaching a new volume to ${vps.name}… (demo action)`)}
        >
          <Plus className="size-4" />
          Add volume
        </Button>
      </SectionCard>

      <SectionCard title="Expand storage" subtitle="Resize the system volume" icon={Save}>
        <form onSubmit={resize} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>New size</Label>
            <Select value={newSize} onValueChange={setNewSize}>
              <SelectTrigger className="w-full" aria-label="New disk size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[80, 160, 320, 480, 640].map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value} GB {vps.storageType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Expansion is applied on the next reboot.</p>
          </div>
          <Button type="submit">
            <Save className="size-4" />
            Resize
          </Button>
        </form>
      </SectionCard>
    </div>
  );
}

function NetworkingPanel({ vps, onNotice }: PanelProps) {
  const gateway = vps.ip.split(".").slice(0, 3).join(".") + ".1";
  const [rules, setRules] = React.useState([
    { id: "r1", port: "22", src: "0.0.0.0/0", action: "Allow", enabled: true },
    { id: "r2", port: "80/443", src: "0.0.0.0/0", action: "Allow", enabled: true },
    { id: "r3", port: "3306", src: "192.168.1.0/24", action: "Allow", enabled: false },
  ]);

  const toggleRule = (id: string) =>
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Public addressing" subtitle="IP addresses of this VPS" icon={Network}>
        <div className="flex flex-col gap-1">
          <IpRow label="IPv4" value={vps.ip} onCopy={onNotice} />
          <IpRow label="IPv6" value={vps.ipv6} onCopy={onNotice} />
          <IpRow label="Gateway" value={gateway} onCopy={onNotice} />
        </div>
        <div className="mt-3 border-t border-border pt-4 text-xs text-muted-foreground">
          DNS servers: <span className="font-mono">1.1.1.1</span> ·{" "}
          <span className="font-mono">9.9.9.9</span>
        </div>
      </SectionCard>

      <SectionCard title="Firewall" subtitle="Inbound rules — toggle on the fly" icon={Shield}>
        <ul className="flex flex-col gap-2">
          {rules.map((rule) => (
            <li key={rule.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">
                  <span className="font-mono">{rule.port}</span>{" "}
                  <span className="text-muted-foreground">← {rule.src}</span>
                </p>
                <p className="text-xs text-muted-foreground">{rule.action} inbound</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete rule for port ${rule.port}`}
                  onClick={() => onNotice(`Firewall rule for port ${rule.port} deleted (demo action)`)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => onNotice(`Adding a firewall rule for ${vps.name}… (demo action)`)}
        >
          <Plus className="size-4" />
          Add rule
        </Button>
      </SectionCard>
    </div>
  );
}

function SnapshotsPanel({ vps, onNotice }: PanelProps) {
  const [snapshots, setSnapshots] = React.useState([
    { id: "s1", name: "before-upgrade", created: "2 days ago", size: "4 GB" },
    { id: "s2", name: "daily-2026-08-28", created: "1 day ago", size: "4 GB" },
  ]);

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Snapshots" subtitle="Point-in-time copies of the system disk" icon={RotateCcw}>
        <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
          <p className="text-xs text-muted-foreground">{snapshots.length} snapshot(s) stored</p>
          <Button
            onClick={() => {
              setSnapshots((prev) => [
                { id: `s${Date.now()}`, name: `manual-${new Date().toISOString().slice(0, 10)}`, created: "just now", size: "4 GB" },
                ...prev,
              ]);
              onNotice(`Creating a snapshot of ${vps.name}… (demo action)`);
            }}
          >
            <Plus className="size-4" />
            Create snapshot
          </Button>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {snapshots.map((snapshot) => (
            <li key={snapshot.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{snapshot.name}</p>
                <p className="text-xs text-muted-foreground">{snapshot.created} · {snapshot.size}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNotice(`Restoring snapshot ${snapshot.name} on ${vps.name}… (demo action)`)}
                >
                  <RotateCw className="size-3.5" />
                  Restore
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete snapshot ${snapshot.name}`}
                  onClick={() => {
                    setSnapshots((prev) => prev.filter((item) => item.id !== snapshot.id));
                    onNotice(`Snapshot ${snapshot.name} deleted (demo action)`);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}

function BackupsPanel({ vps, onNotice }: PanelProps) {
  const [enabled, setEnabled] = React.useState(true);
  const [schedule, setSchedule] = React.useState("daily");
  const [retention, setRetention] = React.useState("7");

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Automated backups" subtitle={`Snapshot schedule & retention for ${vps.name}`} icon={Archive}>
        <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
          <div>
            <p className="text-sm font-medium">Automated backups</p>
            <p className="text-xs text-muted-foreground">{enabled ? "Enabled" : "Disabled"}</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Schedule</Label>
            <Select value={schedule} onValueChange={setSchedule}>
              <SelectTrigger className="w-full" aria-label="Backup schedule">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "never", label: "Never" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Retention</Label>
            <Select value={retention} onValueChange={setRetention}>
              <SelectTrigger className="w-full" aria-label="Backup retention">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["3", "7", "14", "30"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value} days
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="mt-4"
          onClick={() => onNotice(`Running a manual backup of ${vps.name}… (demo action)`)}
        >
          <Download className="size-4" />
          Back up now
        </Button>
      </SectionCard>
    </div>
  );
}

function MonitoringPanel({ vps, onNotice }: PanelProps) {
  const [email, setEmail] = React.useState("admin@example.com");
  const [cpuThreshold, setCpuThreshold] = React.useState("90");

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Live usage" subtitle="Sampled every 5 minutes, kept for 24 hours" icon={Gauge}>
        <div className="flex flex-col gap-4">
          <UsageRow label={`CPU · ${vps.vcpu} vCPU`} value={vps.usage.cpu} barClass={usageBarClass(vps.usage.cpu)} />
          <UsageRow label={`RAM · ${vps.ramGb} GB`} value={vps.usage.ram} barClass={usageBarClass(vps.usage.ram)} />
          <UsageRow
            label={`Disk · ${vps.storageGb} GB ${vps.storageType}`}
            value={vps.usage.disk}
            barClass={usageBarClass(vps.usage.disk)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Alerts" subtitle="Notify me when a metric is exceeded" icon={Bell}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="alert@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>CPU threshold</Label>
            <Select value={cpuThreshold} onValueChange={setCpuThreshold}>
              <SelectTrigger className="w-full" aria-label="CPU alert threshold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["70", "80", "90", "95"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="mt-4"
          onClick={() => onNotice(`Alert rule saved — email ${email}, CPU > ${cpuThreshold}% (demo action)`)}
        >
          <Save className="size-4" />
          Save alerts
        </Button>
      </SectionCard>
    </div>
  );
}

function SecurityPanel({ vps, onNotice }: PanelProps) {
  const [rootLogin, setRootLogin] = React.useState(false);
  const [passwordAuth, setPasswordAuth] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(true);
  const keys = [
    { id: "k1", name: "work-laptop", fingerprint: "SHA256:aj2b…c9" , added: "3 months ago" },
    { id: "k2", name: "ci-runner", fingerprint: "SHA256:q5qk…d1" , added: "1 month ago" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="SSH keys" subtitle="Authorized keys for root access" icon={KeyRound}>
        <ul className="flex flex-col gap-2">
          {keys.map((key) => (
            <li key={key.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{key.name}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">{key.fingerprint}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-muted-foreground sm:inline">{key.added}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove SSH key ${key.name}`}
                  onClick={() => onNotice(`Removing SSH key ${key.name}… (demo action)`)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => onNotice(`Adding an SSH key to ${vps.name}… (demo action)`)}
        >
          <Plus className="size-4" />
          Add SSH key
        </Button>
      </SectionCard>

      <SectionCard title="Access control" subtitle="Tune how credentials are handled" icon={Lock}>
        {[
          { id: "root", label: "Root SSH login", desc: "Allow direct root via SSH", enabled: rootLogin, set: setRootLogin },
          { id: "pwd", label: "Password authentication", desc: "Permit password-based logins", enabled: passwordAuth, set: setPasswordAuth },
          { id: "2fa", label: "Two-factor authentication", desc: "Require 2FA on the web console", enabled: twoFactor, set: setTwoFactor },
        ].map((option) => (
          <div
            key={option.id}
            className="flex items-center justify-between gap-3 border-b border-border py-3"
          >
            <div>
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.desc}</p>
            </div>
            <Switch checked={option.enabled} onCheckedChange={option.set} />
          </div>
        ))}
      </SectionCard>
    </div>
  );
}

function SettingsPanel({ vps, onNotice }: PanelProps) {
  const [newName, setNewName] = React.useState(vps.name);
  const [kernelReboot, setKernelReboot] = React.useState(false);

  const rename = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNotice(`Renaming ${vps.name} to ${newName.trim() || vps.name}… (demo action)`);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="General" subtitle="Rename or reconfigure this VPS" icon={Settings}>
        <form onSubmit={rename} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="vps-rename">Name</Label>
            <Input id="vps-rename" value={newName} onChange={(event) => setNewName(event.target.value)} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
            <div>
              <p className="text-sm font-medium">Reboot on kernel upgrade</p>
              <p className="text-xs text-muted-foreground">Automatically reboot after a kernel update</p>
            </div>
            <Switch checked={kernelReboot} onCheckedChange={setKernelReboot} />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNotice(`Reinstalling ${vps.name} requires confirmation — destructive (demo action)`)}
            >
              <RotateCw className="size-4" />
              Reinstall OS
            </Button>
            <Button type="submit">
              <Save className="size-4" />
              Save
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        title="Danger zone"
        subtitle="Irreversible actions"
        icon={AlertTriangle}
        className="border-red-500/30"
      >
        <div className="flex items-center justify-between gap-3 rounded-md border border-red-500/30 bg-red-500/5 p-3">
          <div>
            <p className="text-sm font-medium text-red-500">Delete this VPS</p>
            <p className="text-xs text-muted-foreground">This permanently removes {vps.name} and its data.</p>
          </div>
          <Button
            variant="destructive"
            onClick={() => onNotice(`Deleting ${vps.name} requires confirmation — destructive (demo action)`)}
          >
            Delete VPS
          </Button>
        </div>
      </SectionCard>
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
        <Skeleton className="mt-4 h-24 w-full rounded-md" />
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
          <EmptyTitle>Unable to load this VPS</EmptyTitle>
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

export default function VpsDetailPage() {
  const params = useParams<{ name: string }>();
  const name = params.name ?? "";

  const [phase, setPhase] = React.useState<Phase>("loading");
  const [vps, setVps] = React.useState<Vps | null>(null);
  const [status, setStatus] = React.useState<VpsStatus>("running");
  const [tab, setTab] = React.useState("overview");
  const [notice, setNotice] = React.useState("");

  const showNotice = React.useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }, []);

  const load = React.useCallback(async () => {
    setPhase("loading");
    try {
      const result = await fetchVps(name);
      if (!result) {
        setPhase("not-found");
        return;
      }
      setVps(result);
      setStatus(result.status);
      setPhase("ready");
    } catch {
      setPhase("error");
    }
  }, [name]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const handleTogglePower = () => {
    if (!vps) return;
    if (status === "running") {
      setStatus("stopped");
      showNotice(`Stopping ${vps.name}… (demo action)`);
    } else {
      setStatus("running");
      showNotice(`Starting ${vps.name}… (demo action)`);
    }
  };

  const handleRestart = () => {
    if (!vps) return;
    showNotice(`Restarting ${vps.name}… (demo action)`);
  };

  const handleOpenConsole = () => {
    if (!vps) return;
    showNotice(`Opening the console for ${vps.name}… (demo action)`);
  };

  const handleReinstall = () => {
    if (!vps) return;
    showNotice(`Reinstalling ${vps.name} requires confirmation — available in the OS tab.`);
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

  if (phase === "not-found" || !vps) {
    return (
      <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
        <div className="rounded-lg border border-border bg-card">
          <Empty className="px-6 py-16">
            <EmptyMedia variant="icon">
              <Server className="size-6" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>VPS not found</EmptyTitle>
              <EmptyDescription>
                The VPS &quot;{name}&quot; does not exist or has been deleted.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/dash/bare-metal/vps">Back to all VPS</Link>
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </main>
    );
  }

  const meta = STATUS_META[status];
  const gateway = vps.ip.split(".").slice(0, 3).join(".") + ".1";

  const quickStats = [
    { label: "vCPU", value: String(vps.vcpu), icon: Cpu },
    { label: "RAM", value: `${vps.ramGb} GB`, icon: MemoryStick },
    { label: "Storage", value: `${vps.storageGb} GB ${vps.storageType}`, icon: HardDrive },
    { label: "Uptime", value: vps.uptime, icon: Clock },
  ];

  const activity = [
    {
      id: "act-1",
      icon: RotateCcw,
      title: "VM reboot",
      time: "3 days ago",
      iconClass: "bg-primary/10 text-primary",
    },
    {
      id: "act-2",
      icon: Archive,
      title: "Backup completed — weekly snapshot",
      time: "2 days ago",
      iconClass: "bg-emerald-500/15 text-emerald-500",
    },
    {
      id: "act-3",
      icon: Settings,
      title: "Firewall rule updated",
      time: "5 days ago",
      iconClass: "bg-sky-500/15 text-sky-500",
    },
    {
      id: "act-4",
      icon: RefreshCw,
      title: "OS packages updated",
      time: "8 days ago",
      iconClass: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
      {/* Retour à la liste */}
      <Link
        href="/dash/bare-metal/vps"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        All VPS
      </Link>

      {/* Fil d'Ariane */}
      <Breadcrumb className="mt-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <span className="text-sm text-muted-foreground">Bare Metal</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/dash/bare-metal/vps" className="text-sm hover:text-foreground">
              VPS
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{vps.name}</BreadcrumbPage>
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
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{vps.name}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {vps.os} · {vps.region} · <span className="font-mono text-xs">{vps.ip}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleOpenConsole}
            disabled={status === "stopped"}
            title={status === "stopped" ? "Start the VPS to open the console" : undefined}
          >
            <Terminal className="size-4" />
            Open Console
          </Button>
          <Button
            variant="outline"
            onClick={handleRestart}
            disabled={status === "stopped"}
            title={status === "stopped" ? "Start the VPS to restart it" : undefined}
          >
            <RotateCcw className="size-4" />
            Restart
          </Button>
          <Button
            variant={status === "running" ? "outline" : "default"}
            onClick={handleTogglePower}
          >
            {status === "running" ? (
              <>
                <Square className="size-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="size-4" />
                Start
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`More actions for ${vps.name}`}
                title={`More actions for ${vps.name}`}
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{vps.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  handleReinstall();
                }}
              >
                <RefreshCw className="size-4 text-muted-foreground" />
                Reinstall
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={status === "stopped"}
                onSelect={(event) => {
                  event.preventDefault();
                  handleOpenConsole();
                }}
              >
                <Terminal className="size-4 text-muted-foreground" />
                Open Console
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
      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="VPS resources">
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
          {VPS_TABS.map((item) => (
            <TabsTrigger key={item} value={item} className="h-8 flex-none">
              {formatTabLabel(item)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-2">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
            <div className="flex flex-col gap-6">
              {/* Utilisation des ressources */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="Resource usage">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Resource usage</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Current load on {vps.name}
                    </p>
                  </div>
                  <Activity className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  <UsageRow
                    label={`CPU · ${vps.vcpu} vCPU`}
                    value={vps.usage.cpu}
                    barClass={usageBarClass(vps.usage.cpu)}
                  />
                  <UsageRow
                    label={`RAM · ${vps.ramGb} GB`}
                    value={vps.usage.ram}
                    barClass={usageBarClass(vps.usage.ram)}
                  />
                  <UsageRow
                    label={`Disk · ${vps.storageGb} GB ${vps.storageType}`}
                    value={vps.usage.disk}
                    barClass={usageBarClass(vps.usage.disk)}
                  />
                </div>
                <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                  Usage is sampled every 5 minutes and kept for 24 hours.
                </p>
              </section>

              {/* Détails de la configuration */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="Configuration details">
                <h2 className="text-sm font-semibold">Details</h2>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <DetailRow
                    label="Plan"
                    value={
                      <>
                        {vps.plan}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          {vps.flavor}
                        </span>
                      </>
                    }
                  />
                  <DetailRow label="Operating System" value={vps.os} />
                  <DetailRow label="Region" value={vps.region} />
                  <DetailRow label="Storage" value={`${vps.storageGb} GB ${vps.storageType}`} />
                  <DetailRow label="Uptime" value={vps.uptime} />
                  <DetailRow label="Created" value={vps.createdAt} />
                </dl>
              </section>
            </div>

            <div className="flex flex-col gap-6">
              {/* Serveur dédié associé */}
              {vps.dedicated ? (
                <section
                  className="rounded-lg border border-border bg-card p-5"
                  aria-label="Associated dedicated server"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-semibold">Dedicated Server</h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        This VPS is provisioned on your dedicated server
                      </p>
                    </div>
                    <Server className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="mt-4 truncate text-sm font-semibold">{vps.dedicated.name}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <DetailRow label="Model" value={vps.dedicated.model} />
                    <DetailRow label="Reference" value={vps.dedicated.reference} />
                    <DetailRow label="Region" value={vps.dedicated.region} />
                    <DetailRow label="Server IP" value={vps.dedicated.ip} />
                  </dl>
                </section>
              ) : null}

              {/* Adresses IP */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="IP addresses">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Network</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Public addressing</p>
                  </div>
                  <Network className="size-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="mt-4 flex flex-col gap-1">
                  <IpRow label="IPv4" value={vps.ip} onCopy={showNotice} />
                  <IpRow label="IPv6" value={vps.ipv6} onCopy={showNotice} />
                  <IpRow label="Gateway" value={gateway} onCopy={showNotice} />
                </div>
                <div className="mt-3 border-t border-border pt-4 text-xs text-muted-foreground">
                  DNS servers: <span className="font-mono">1.1.1.1</span> ·{" "}
                  <span className="font-mono">9.9.9.9</span>
                </div>
              </section>

              {/* Activité récente */}
              <section className="rounded-lg border border-border bg-card p-5" aria-label="Recent activity">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Recent Activity</h2>
                    <p className="mt-1 text-xs text-muted-foreground">Events on this VPS</p>
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
                      "The full activity log for this VPS will be available in the Monitoring section.",
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

        <TabsContent value="console" className="mt-2">
          <ConsolePanel vps={vps} onNotice={showNotice} />
        </TabsContent>
        <TabsContent value="compute" className="mt-2">
          <ComputePanel vps={vps} onNotice={showNotice} />
        </TabsContent>
        <TabsContent value="storage" className="mt-2">
          <StoragePanel vps={vps} onNotice={showNotice} />
        </TabsContent>
        <TabsContent value="networking" className="mt-2">
          <NetworkingPanel vps={vps} onNotice={showNotice} />
        </TabsContent>
        <TabsContent value="snapshots" className="mt-2">
          <SnapshotsPanel vps={vps} onNotice={showNotice} />
        </TabsContent>
        <TabsContent value="backups" className="mt-2">
          <BackupsPanel vps={vps} onNotice={showNotice} />
        </TabsContent>
        <TabsContent value="monitoring" className="mt-2">
          <MonitoringPanel vps={vps} onNotice={showNotice} />
        </TabsContent>
        <TabsContent value="security" className="mt-2">
          <SecurityPanel vps={vps} onNotice={showNotice} />
        </TabsContent>
        <TabsContent value="settings" className="mt-2">
          <SettingsPanel vps={vps} onNotice={showNotice} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
