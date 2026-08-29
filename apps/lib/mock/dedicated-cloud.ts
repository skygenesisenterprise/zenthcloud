/**
 * Données de démonstration des environnements Dedicated Cloud.
 *
 * Source unique utilisée par la page collection (/dash/bare-metal/dedicated-cloud)
 * et la page détail (/dash/bare-metal/dedicated-cloud/[name]).
 * À remplacer par un appel API réel (routers/api/v1) une fois le backend connecté.
 */

import type { LucideIcon } from "lucide-react";
import { CheckCircle2, AlertTriangle, XCircle, Wrench } from "lucide-react";

export type DcStatus = "operational" | "warning" | "degraded" | "maintenance";

export interface DedicatedCloud {
  id: string;
  name: string;
  environment: string;
  region: string;
  status: DcStatus;
  hosts: number;
  vcpu: number;
  ramGb: number;
  storageTb: number;
  vms: number;
  networks: number;
  publicIps: number;
}

export interface DcHost {
  id: string;
  name: string;
  model: string;
  status: DcStatus;
  vcpu: number;
  ramGb: number;
  storageTb: number;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
}

export interface DcVlan {
  id: number;
  name: string;
  subnet: string;
  purpose: string;
}

export interface DedicatedCloudDetail extends DedicatedCloud {
  version: string;
  managementIp: string;
  gateway: string;
  createdAt: string;
  upgraded: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  hostList: DcHost[];
  vlanList: DcVlan[];
}

export const DEDICATED_CLOUDS: DedicatedCloud[] = [
  {
    id: "dc-lux-01",
    name: "DC-LUX-01",
    environment: "Production · Critical applications",
    region: "Strasbourg (SBG5)",
    status: "operational",
    hosts: 4,
    vcpu: 128,
    ramGb: 768,
    storageTb: 24,
    vms: 26,
    networks: 3,
    publicIps: 12,
  },
  {
    id: "dc-lux-02",
    name: "DC-LUX-02",
    environment: "Staging & pre-production",
    region: "Strasbourg (SBG5)",
    status: "warning",
    hosts: 2,
    vcpu: 64,
    ramGb: 384,
    storageTb: 8,
    vms: 11,
    networks: 2,
    publicIps: 5,
  },
  {
    id: "dc-fra-01",
    name: "DC-FRA-01",
    environment: "Production · ERP & databases",
    region: "Gravelines (GRA7)",
    status: "operational",
    hosts: 6,
    vcpu: 192,
    ramGb: 1152,
    storageTb: 36,
    vms: 38,
    networks: 4,
    publicIps: 20,
  },
  {
    id: "dc-de-01",
    name: "DC-DE-01",
    environment: "Disaster recovery",
    region: "Frankfurt (DE1)",
    status: "maintenance",
    hosts: 3,
    vcpu: 96,
    ramGb: 576,
    storageTb: 18,
    vms: 14,
    networks: 2,
    publicIps: 8,
  },
  {
    id: "dc-uk-01",
    name: "DC-UK-01",
    environment: "Production · Edge services",
    region: "London (UK1)",
    status: "operational",
    hosts: 5,
    vcpu: 160,
    ramGb: 960,
    storageTb: 30,
    vms: 31,
    networks: 3,
    publicIps: 16,
  },
  {
    id: "dc-pl-01",
    name: "DC-PL-01",
    environment: "Analytics & big data",
    region: "Warsaw (WAW1)",
    status: "degraded",
    hosts: 4,
    vcpu: 128,
    ramGb: 512,
    storageTb: 48,
    vms: 9,
    networks: 2,
    publicIps: 6,
  },
  {
    id: "dc-lux-03",
    name: "DC-LUX-03",
    environment: "Sandbox & experiments",
    region: "Strasbourg (SBG5)",
    status: "operational",
    hosts: 1,
    vcpu: 16,
    ramGb: 64,
    storageTb: 2,
    vms: 3,
    networks: 1,
    publicIps: 1,
  },
];

export const STATUS_META: Record<
  DcStatus,
  {
    label: string;
    dot: string;
    badge: string;
    iconClass: string;
    icon: LucideIcon;
  }
> = {
  operational: {
    label: "Operational",
    dot: "bg-emerald-500",
    badge: "border-emerald-500/25 bg-emerald-500/15 text-emerald-500",
    iconClass: "bg-emerald-500/15 text-emerald-500",
    icon: CheckCircle2,
  },
  warning: {
    label: "Warning",
    dot: "bg-amber-500",
    badge: "border-amber-500/25 bg-amber-500/15 text-amber-500",
    iconClass: "bg-amber-500/15 text-amber-500",
    icon: AlertTriangle,
  },
  degraded: {
    label: "Degraded",
    dot: "bg-red-500",
    badge: "border-red-500/25 bg-red-500/15 text-red-500",
    iconClass: "bg-red-500/15 text-red-500",
    icon: XCircle,
  },
  maintenance: {
    label: "Maintenance",
    dot: "bg-sky-500",
    badge: "border-sky-500/25 bg-sky-500/15 text-sky-500",
    iconClass: "bg-sky-500/15 text-sky-500",
    icon: Wrench,
  },
};

export const REGIONS = Array.from(new Set(DEDICATED_CLOUDS.map((cloud) => cloud.region)));

/* ------------------------------------------------------------------ */
/* Détails par environnement (enrichis pour la vue détail)             */
/* ------------------------------------------------------------------ */

const buildHosts = (id: string, models: string[], base: DcHost | null): DcHost[] => {
  if (base) {
    return models.map((model, index) => ({
      ...base,
      id: `${id}-host-${index + 1}`,
      name: `${id.toUpperCase()}-host-${index + 1}`,
      model,
    }));
  }
  return [];
};

const DEFAULT_HOST: DcHost = {
  id: "",
  name: "",
  model: "Host",
  status: "operational",
  vcpu: 32,
  ramGb: 192,
  storageTb: 6,
  cpuUsage: 42,
  ramUsage: 55,
  diskUsage: 38,
};

const DETAILS: Record<string, Omit<DedicatedCloudDetail, keyof DedicatedCloud>> = {
  "dc-lux-01": {
    version: "8.0.3",
    managementIp: "10.0.30.2",
    gateway: "10.0.30.1",
    createdAt: "Sep 12, 2025",
    upgraded: "Last upgraded May 04, 2026",
    cpuUsage: 58,
    ramUsage: 63,
    diskUsage: 46,
    hostList: buildHosts("dc-lux-01", ["Advance-2", "Advance-2", "Scale-Opt-2", "Scale-Opt-2"], DEFAULT_HOST),
    vlanList: [
      { id: 10, name: "Prod", subnet: "10.10.10.0/24", purpose: "VM production traffic" },
      { id: 20, name: "DB", subnet: "10.10.20.0/24", purpose: "Databases & ERP" },
      { id: 100, name: "vMotion", subnet: "10.20.0.0/24", purpose: "Host migration" },
    ],
  },
  "dc-lux-02": {
    version: "7.0.3",
    managementIp: "10.0.31.2",
    gateway: "10.0.31.1",
    createdAt: "Mar 02, 2026",
    upgraded: "Last upgraded Apr 22, 2026",
    cpuUsage: 71,
    ramUsage: 44,
    diskUsage: 30,
    hostList: buildHosts("dc-lux-02", ["Advance-2", "Advance-2"], DEFAULT_HOST),
    vlanList: [
      { id: 30, name: "Staging", subnet: "10.30.0.0/24", purpose: "Pre-production workloads" },
      { id: 100, name: "vMotion", subnet: "10.20.0.0/24", purpose: "Host migration" },
    ],
  },
  "dc-fra-01": {
    version: "8.0.3",
    managementIp: "10.0.40.2",
    gateway: "10.0.40.1",
    createdAt: "Jun 06, 2025",
    upgraded: "Last upgraded Jan 15, 2026",
    cpuUsage: 49,
    ramUsage: 58,
    diskUsage: 62,
    hostList: buildHosts("dc-fra-01", ["Advance-2", "Advance-2", "Scale-Opt-2", "Scale-Opt-2", "High-Perf-2", "High-Perf-2"], DEFAULT_HOST),
    vlanList: [
      { id: 10, name: "Prod", subnet: "10.40.10.0/24", purpose: "VM production traffic" },
      { id: 20, name: "DB", subnet: "10.40.20.0/24", purpose: "Databases & ERP" },
      { id: 50, name: "DMZ", subnet: "10.40.50.0/24", purpose: "Public edge services" },
      { id: 100, name: "vMotion", subnet: "10.20.0.0/24", purpose: "Host migration" },
    ],
  },
  "dc-de-01": {
    version: "7.0.3",
    managementIp: "10.0.50.2",
    gateway: "10.0.50.1",
    createdAt: "Jan 24, 2026",
    upgraded: "Last upgraded Feb 27, 2026",
    cpuUsage: 22,
    ramUsage: 31,
    diskUsage: 28,
    hostList: buildHosts("dc-de-01", ["Scale-Opt-2", "Scale-Opt-2", "Scale-Opt-2"], DEFAULT_HOST),
    vlanList: [
      { id: 40, name: "DR", subnet: "10.50.0.0/24", purpose: "Disaster recovery replication" },
      { id: 100, name: "vMotion", subnet: "10.20.0.0/24", purpose: "Host migration" },
    ],
  },
  "dc-uk-01": {
    version: "8.0.3",
    managementIp: "10.0.60.2",
    gateway: "10.0.60.1",
    createdAt: "Aug 18, 2025",
    upgraded: "Last upgraded Mar 09, 2026",
    cpuUsage: 66,
    ramUsage: 71,
    diskUsage: 53,
    hostList: buildHosts("dc-uk-01", ["Advance-2", "Advance-2", "Scale-Opt-2", "High-Perf-2", "High-Perf-2"], DEFAULT_HOST),
    vlanList: [
      { id: 10, name: "Prod", subnet: "10.60.10.0/24", purpose: "VM production traffic" },
      { id: 50, name: "DMZ", subnet: "10.60.50.0/24", purpose: "Public edge services" },
      { id: 100, name: "vMotion", subnet: "10.20.0.0/24", purpose: "Host migration" },
    ],
  },
  "dc-pl-01": {
    version: "7.0.3",
    managementIp: "10.0.70.2",
    gateway: "10.0.70.1",
    createdAt: "Dec 04, 2025",
    upgraded: "Last upgraded Nov 11, 2025",
    cpuUsage: 84,
    ramUsage: 77,
    diskUsage: 88,
    hostList: buildHosts("dc-pl-01", ["Scale-Opt-2", "Scale-Opt-2", "Scale-Opt-2", "Scale-Opt-2"], DEFAULT_HOST),
    vlanList: [
      { id: 60, name: "Analytics", subnet: "10.70.0.0/24", purpose: "Big data & analytics" },
      { id: 100, name: "vMotion", subnet: "10.20.0.0/24", purpose: "Host migration" },
    ],
  },
  "dc-lux-03": {
    version: "8.0.3",
    managementIp: "10.0.31.2",
    gateway: "10.0.31.1",
    createdAt: "May 21, 2026",
    upgraded: "Last upgraded Aug 01, 2026",
    cpuUsage: 34,
    ramUsage: 29,
    diskUsage: 18,
    hostList: buildHosts("dc-lux-03", ["Advance-2"], DEFAULT_HOST),
    vlanList: [{ id: 90, name: "Sandbox", subnet: "10.90.0.0/24", purpose: "Experiments" }],
  },
};

/* ------------------------------------------------------------------ */
/* API mockée (à remplacer par l'appel backend)                        */
/* ------------------------------------------------------------------ */

export function fetchDedicatedClouds(): Promise<DedicatedCloud[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(DEDICATED_CLOUDS), 900);
  });
}

export function fetchDedicatedCloud(name: string): Promise<DedicatedCloudDetail | undefined> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const base = DEDICATED_CLOUDS.find((cloud) => cloud.id === name || cloud.name === name);
      if (!base) {
        resolve(undefined);
        return;
      }
      const detail = DETAILS[base.id];
      resolve(detail ? { ...base, ...detail } : undefined);
    }, 600);
  });
}