/**
 * Données de démonstration de la page Vue d'ensemble (/dash).
 *
 * Source unique utilisée par la page d'accueil du manager. À remplacer par
 * un appel API (routers/api/v1) une fois le backend connecté.
 */

/** Statut d'une instance listée sur la vue d'ensemble (aligné sur VpsStatus). */
export type InstanceStatus = "running" | "warning" | "stopped" | "maintenance";

export interface InstanceOverview {
  id: string;
  name: string;
  region: string;
  plan: string;
  status: InstanceStatus;
  cpu: number;
  ramUsed: number; // en Go
  ramTotal: number; // en Go
  diskUsed: number; // en Go
  diskTotal: number; // en Go
}

export type KpiIcon = "spending" | "resources" | "traffic" | "uptime";

export interface KpiStat {
  id: string;
  label: string;
  value: string;
  meta: string;
  trendUp: boolean;
  icon: KpiIcon;
  sparkline: number[];
}

export interface SpendingPoint {
  month: string;
  amount: number;
}

export interface RegionUsage {
  region: string;
  share: number; // pourcentage
}

export type ActivityType = "success" | "warning" | "info";

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  label: string;
  time: string;
}

export interface BudgetState {
  spent: number;
  budget: number;
  usedPercent: number;
  resetInDays: number;
}

export interface OverviewData {
  stats: KpiStat[];
  spending: SpendingPoint[];
  totalSpent: string;
  instances: InstanceOverview[];
  budget: BudgetState;
  regions: RegionUsage[];
  activity: ActivityEvent[];
}

export const OVERVIEW_DATA: OverviewData = {
  stats: [
    {
      id: "spending",
      label: "Dépenses mensuelles",
      value: "184,60 €",
      meta: "+8,4 % vs le mois dernier",
      trendUp: true,
      icon: "spending",
      sparkline: [118, 134, 142, 139, 156, 168, 172, 181, 184.6],
    },
    {
      id: "resources",
      label: "Ressources actives",
      value: "12",
      meta: "3 services surveillés",
      trendUp: true,
      icon: "resources",
      sparkline: [8, 9, 9, 10, 10, 11, 11, 12, 12],
    },
    {
      id: "traffic",
      label: "Trafic réseau",
      value: "1,84 To",
      meta: "Toutes régions confondues",
      trendUp: true,
      icon: "traffic",
      sparkline: [0.9, 1.1, 1.05, 1.3, 1.42, 1.38, 1.6, 1.71, 1.84],
    },
    {
      id: "uptime",
      label: "Disponibilité ce mois",
      value: "99,98 %",
      meta: "Fiabilité excellente",
      trendUp: true,
      icon: "uptime",
      sparkline: [99.9, 99.95, 99.93, 99.97, 99.96, 99.98, 99.97, 99.98, 99.98],
    },
  ],
  spending: [
    { month: "Sep", amount: 96 },
    { month: "Oct", amount: 108 },
    { month: "Nov", amount: 121 },
    { month: "Déc", amount: 118 },
    { month: "Jan", amount: 134 },
    { month: "Fév", amount: 142 },
    { month: "Mar", amount: 139 },
    { month: "Avr", amount: 156 },
    { month: "Mai", amount: 168 },
    { month: "Juin", amount: 172 },
    { month: "Juil", amount: 181 },
    { month: "Août", amount: 184.6 },
  ],
  totalSpent: "1 719,60 €",
  instances: [
    {
      id: "api-production-01",
      name: "api-production-01",
      region: "Strasbourg (SBG5)",
      plan: "VPS Comfort",
      status: "running",
      cpu: 12,
      ramUsed: 3.2,
      ramTotal: 8,
      diskUsed: 42,
      diskTotal: 160,
    },
    {
      id: "worker-eu-west",
      name: "worker-eu-west",
      region: "Francfort (DE)",
      plan: "VPS Elite",
      status: "running",
      cpu: 38,
      ramUsed: 6.8,
      ramTotal: 16,
      diskUsed: 88,
      diskTotal: 320,
    },
    {
      id: "staging-cluster",
      name: "staging-cluster",
      region: "Londres (UK)",
      plan: "VPS Comfort",
      status: "warning",
      cpu: 7,
      ramUsed: 2.1,
      ramTotal: 8,
      diskUsed: 31,
      diskTotal: 160,
    },
    {
      id: "db-replica-01",
      name: "db-replica-01",
      region: "Strasbourg (SBG5)",
      plan: "VPS Elite",
      status: "running",
      cpu: 41,
      ramUsed: 12.4,
      ramTotal: 16,
      diskUsed: 210,
      diskTotal: 320,
    },
    {
      id: "build-runner",
      name: "build-runner",
      region: "Gravelines (GRA7)",
      plan: "VPS Performance",
      status: "running",
      cpu: 92,
      ramUsed: 20.5,
      ramTotal: 32,
      diskUsed: 186,
      diskTotal: 320,
    },
    {
      id: "legacy-sandbox",
      name: "legacy-sandbox",
      region: "Varsovie (WAW1)",
      plan: "VPS Starter",
      status: "stopped",
      cpu: 0,
      ramUsed: 0,
      ramTotal: 4,
      diskUsed: 12,
      diskTotal: 80,
    },
  ],
  budget: {
    spent: 184.6,
    budget: 250,
    usedPercent: 74,
    resetInDays: 12,
  },
  regions: [
    { region: "Strasbourg (SBG5)", share: 32 },
    { region: "Francfort (DE)", share: 28 },
    { region: "Londres (UK)", share: 18 },
    { region: "Gravelines (GRA7)", share: 14 },
    { region: "Varsovie (WAW1)", share: 8 },
  ],
  activity: [
    {
      id: "a1",
      type: "success",
      label: "Redémarrage du serveur api-production-01",
      time: "Il y a 18 minutes",
    },
    {
      id: "a2",
      type: "success",
      label: "Facture #F-2026-0841 payée",
      time: "Hier à 09:42",
    },
    {
      id: "a3",
      type: "warning",
      label: "CPU élevé sur build-runner (92 %)",
      time: "Hier à 16:20",
    },
    {
      id: "a4",
      type: "info",
      label: "Règle de pare-feu mise à jour",
      time: "16 juin, 14:08",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* API mockée (à remplacer par l'appel backend)                        */
/* ------------------------------------------------------------------ */

export function fetchOverview(): Promise<OverviewData> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(OVERVIEW_DATA), 900);
  });
}
