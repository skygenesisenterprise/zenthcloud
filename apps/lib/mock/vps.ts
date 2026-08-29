/**
 * Données de démonstration des VPS.
 *
 * Source unique utilisée par la page collection (/dash/bare-metal/vps) et la
 * page détail (/dash/bare-metal/vps/[name]). À remplacer par un appel API
 * (routers/api/v1) une fois le backend connecté.
 */

export type VpsStatus = "running" | "stopped" | "maintenance" | "warning";

export interface VpsUsage {
  cpu: number;
  ram: number;
  disk: number;
}

/**
 * Serveur dédié associé à un VPS (colonisation / service managé).
 * Absente lorsque le VPS n'est rattaché à aucun serveur dédié.
 */
export interface VpsDedicatedServer {
  name: string;
  reference: string;
  model: string;
  region: string;
  ip: string;
}

export interface Vps {
  id: string;
  name: string;
  status: VpsStatus;
  plan: string;
  flavor: string;
  vcpu: number;
  ramGb: number;
  storageGb: number;
  storageType: "NVMe" | "SSD";
  ip: string;
  ipv6: string;
  os: string;
  region: string;
  uptime: string;
  createdAt: string;
  usage: VpsUsage;
  dedicated?: VpsDedicatedServer;
}

export const VPS_LIST: Vps[] = [
  {
    id: "vps-production-01",
    name: "vps-production-01",
    status: "running",
    plan: "VPS-4",
    flavor: "Elite",
    vcpu: 4,
    ramGb: 16,
    storageGb: 160,
    storageType: "NVMe",
    ip: "203.0.113.10",
    ipv6: "2001:db8:10::1",
    os: "Ubuntu 24.04",
    region: "Frankfurt (DE1)",
    uptime: "34 days",
    createdAt: "Jan 14, 2026",
    usage: { cpu: 38, ram: 62, disk: 41 },
    dedicated: {
      name: "ns5150503.ip-51-161-204.eu",
      reference: "1805904sd",
      model: "RISE-1",
      region: "Frankfurt (DE1)",
      ip: "51.161.204.9",
    },
  },
  {
    id: "vps-production-02",
    name: "vps-production-02",
    status: "running",
    plan: "VPS-8",
    flavor: "Elite",
    vcpu: 8,
    ramGb: 32,
    storageGb: 320,
    storageType: "NVMe",
    ip: "203.0.113.11",
    ipv6: "2001:db8:10::2",
    os: "Ubuntu 24.04",
    region: "Frankfurt (DE1)",
    uptime: "34 days",
    createdAt: "Jan 14, 2026",
    usage: { cpu: 22, ram: 45, disk: 36 },
  },
  {
    id: "vps-api-gateway",
    name: "vps-api-gateway",
    status: "running",
    plan: "VPS-4",
    flavor: "Comfort",
    vcpu: 4,
    ramGb: 16,
    storageGb: 160,
    storageType: "NVMe",
    ip: "198.51.100.24",
    ipv6: "2001:db8:24::1",
    os: "Debian 13",
    region: "Strasbourg (SBG5)",
    uptime: "12 days",
    createdAt: "Mar 02, 2026",
    usage: { cpu: 61, ram: 38, disk: 52 },
    dedicated: {
      name: "ns5034493.ip-145-239-55.eu",
      reference: "1752210sd",
      model: "ADV-2",
      region: "Strasbourg (SBG5)",
      ip: "145.239.55.203",
    },
  },
  {
    id: "vps-worker-eu",
    name: "vps-worker-eu",
    status: "running",
    plan: "VPS-2",
    flavor: "Comfort",
    vcpu: 2,
    ramGb: 8,
    storageGb: 80,
    storageType: "NVMe",
    ip: "198.51.100.25",
    ipv6: "2001:db8:25::1",
    os: "Debian 13",
    region: "Strasbourg (SBG5)",
    uptime: "12 days",
    createdAt: "Mar 02, 2026",
    usage: { cpu: 74, ram: 51, disk: 33 },
  },
  {
    id: "vps-staging-cluster",
    name: "vps-staging-cluster",
    status: "warning",
    plan: "VPS-4",
    flavor: "Comfort",
    vcpu: 4,
    ramGb: 16,
    storageGb: 160,
    storageType: "NVMe",
    ip: "192.0.2.42",
    ipv6: "2001:db8:42::1",
    os: "AlmaLinux 9",
    region: "London (UK1)",
    uptime: "3 days",
    createdAt: "May 18, 2026",
    usage: { cpu: 88, ram: 70, disk: 44 },
  },
  {
    id: "vps-cdn-edge",
    name: "vps-cdn-edge",
    status: "running",
    plan: "VPS-2",
    flavor: "Starter",
    vcpu: 2,
    ramGb: 8,
    storageGb: 80,
    storageType: "NVMe",
    ip: "192.0.2.43",
    ipv6: "2001:db8:43::1",
    os: "Rocky Linux 9",
    region: "London (UK1)",
    uptime: "21 days",
    createdAt: "Apr 11, 2026",
    usage: { cpu: 45, ram: 32, disk: 28 },
  },
  {
    id: "vps-build-runner",
    name: "vps-build-runner",
    status: "running",
    plan: "VPS-8",
    flavor: "Performance",
    vcpu: 8,
    ramGb: 32,
    storageGb: 320,
    storageType: "NVMe",
    ip: "203.0.113.77",
    ipv6: "2001:db8:77::1",
    os: "Ubuntu 24.04",
    region: "Gravelines (GRA7)",
    uptime: "6 days",
    createdAt: "Jun 09, 2026",
    usage: { cpu: 92, ram: 64, disk: 58 },
    dedicated: {
      name: "ns5922291.ip-54-37-129.eu",
      reference: "1802488sd",
      model: "RISE-2",
      region: "Gravelines (GRA7)",
      ip: "54.37.129.44",
    },
  },
  {
    id: "vps-legacy-db",
    name: "vps-legacy-db",
    status: "stopped",
    plan: "VPS-4",
    flavor: "Comfort",
    vcpu: 4,
    ramGb: 16,
    storageGb: 160,
    storageType: "NVMe",
    ip: "198.51.100.88",
    ipv6: "2001:db8:88::1",
    os: "Windows Server 2022",
    region: "Gravelines (GRA7)",
    uptime: "—",
    createdAt: "Nov 22, 2025",
    usage: { cpu: 0, ram: 0, disk: 0 },
    dedicated: {
      name: "ns7427399.ip-54-38-208.eu",
      reference: "1690324sd",
      model: "STOR-2",
      region: "Gravelines (GRA7)",
      ip: "54.38.208.120",
    },
  },
  {
    id: "vps-monitoring",
    name: "vps-monitoring",
    status: "maintenance",
    plan: "VPS-1",
    flavor: "Starter",
    vcpu: 1,
    ramGb: 4,
    storageGb: 40,
    storageType: "NVMe",
    ip: "192.0.2.90",
    ipv6: "2001:db8:90::1",
    os: "Debian 13",
    region: "Warsaw (WAW1)",
    uptime: "—",
    createdAt: "Feb 27, 2026",
    usage: { cpu: 5, ram: 12, disk: 9 },
  },
  {
    id: "vps-sandbox-01",
    name: "vps-sandbox-01",
    status: "stopped",
    plan: "VPS-2",
    flavor: "Starter",
    vcpu: 2,
    ramGb: 8,
    storageGb: 80,
    storageType: "NVMe",
    ip: "198.51.100.91",
    ipv6: "2001:db8:91::1",
    os: "Rocky Linux 9",
    region: "Warsaw (WAW1)",
    uptime: "—",
    createdAt: "Aug 03, 2026",
    usage: { cpu: 0, ram: 0, disk: 0 },
  },
];

export const STATUS_META: Record<
  VpsStatus,
  { label: string; dot: string; badge: string; iconClass: string }
> = {
  running: {
    label: "Running",
    dot: "bg-emerald-500",
    badge: "border-emerald-500/25 bg-emerald-500/15 text-emerald-500",
    iconClass: "bg-emerald-500/15 text-emerald-500",
  },
  warning: {
    label: "Warning",
    dot: "bg-amber-500",
    badge: "border-amber-500/25 bg-amber-500/15 text-amber-500",
    iconClass: "bg-amber-500/15 text-amber-500",
  },
  stopped: {
    label: "Stopped",
    dot: "bg-muted-foreground",
    badge: "border-border bg-muted text-muted-foreground",
    iconClass: "bg-muted text-muted-foreground",
  },
  maintenance: {
    label: "Maintenance",
    dot: "bg-sky-500",
    badge: "border-sky-500/25 bg-sky-500/15 text-sky-500",
    iconClass: "bg-sky-500/15 text-sky-500",
  },
};

export const REGIONS = Array.from(new Set(VPS_LIST.map((vps) => vps.region)));
export const OPERATING_SYSTEMS = Array.from(new Set(VPS_LIST.map((vps) => vps.os)));
export const PLANS = Array.from(new Set(VPS_LIST.map((vps) => vps.plan)));

/* ------------------------------------------------------------------ */
/* API mockée (à remplacer par l'appel backend)                        */
/* ------------------------------------------------------------------ */

export function fetchVpsList(): Promise<Vps[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(VPS_LIST), 900);
  });
}

export function fetchVps(name: string): Promise<Vps | undefined> {
  return new Promise((resolve) => {
    window.setTimeout(
      () => resolve(VPS_LIST.find((vps) => vps.id === name || vps.name === name)),
      600,
    );
  });
}
