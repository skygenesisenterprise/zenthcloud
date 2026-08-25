/**
 * Zenth Cloud — Pricing Catalog
 * =============================
 *
 * SINGLE SOURCE OF TRUTH for every tariff shown on the Public Cloud site.
 * The pricing page, product cards, pricing tables and the cost calculator all
 * read from this catalog and MUST NOT duplicate values elsewhere.
 *
 * Currency / precision
 * --------------------
 * - All amounts are stored in EUR (minor-unit safe, floating precision handled
 *   by `formatPrice` at display time).
 * - A `unitPrice` that is `null` means "price not configured yet" and is
 *   rendered as an explicit "to be announced" placeholder. We never invent
 *   amounts.
 *
 * Precision
 * ---------
 * Calculations run on raw numbers (high internal precision). Formatting applies
 * the display precision so float errors never reach the UI.
 *
 * Versioning
 * ----------
 * `effectiveFrom` / `status` fields prepare the catalog for future price
 * versioning so historic invoices are never broken by a price change.
 */

// ---------------------------------------------------------------------------
// Types — extensible data model
// ---------------------------------------------------------------------------

export type BillingUnit =
  | "hour"
  | "month"
  | "gb_month"
  | "gb"
  | "request"
  | "gpu_hour"
  | "ip_month"
  | "instance_month";

export type CurrencyCode = "EUR" | "USD";

export type CatalogStatus =
  | "available" // Available now, price configured
  | "placeholder" // Available now, price not configured yet
  | "coming_soon"; // Not available yet

export interface UnitPrice {
  /** Amount in `currency` (EUR by default). `null` = price to be announced. */
  amount: number | null;
  unit: BillingUnit;
  currency: CurrencyCode;
}

export interface PricingCategoryLink {
  key: string;
  label: string;
  href: string;
}

export interface CatalogCategory {
  id: string;
  key: string;
  href: string;
  status: CatalogStatus;
}

// --- Compute ----------------------------------------------------------------

export interface ComputeCatalogueOption {
  id: string;
  name: string;
  vcpu: number;
  ramGb: number;
  /** Boot/storage disk in GB (null when unknown). */
  storageGb: number | null;
  networkGbps: number | null;
  /** Hourly unit price. */
  pricePerHour: number | null;
  /** Free quota already included (null = not configured). */
  includedNetworkGb: number | null;
}

export type BillingModelId =
  | "payg"
  | "hourly"
  | "monthly"
  | "per_gb"
  | "per_request"
  | "per_gpu_hour"
  | "per_instance";

// --- Storage ----------------------------------------------------------------

export interface StoragePricing {
  id: string;
  name: string;
  /** Price per GB per month. */
  pricePerGbMonth: number | null;
  /** Minimum billable quantity in GB. */
  minimumGb: number | null;
  /** Included operations / requests, when relevant. */
  includedOperations: string | null;
  status: CatalogStatus;
}

// --- Networking -------------------------------------------------------------

export interface NetworkingPricing {
  id: string;
  name: string;
  unit: BillingUnit;
  price: number | null;
  /** Included quota expressed in GB, hours or whatever applies. */
  included: string | null;
  /** True when this line is charged, false when included by default. */
  charged: boolean;
  status: CatalogStatus;
}

// --- Databases ---------------------------------------------------------------

export interface DatabasePricing {
  id: string;
  engine: "postgresql" | "mysql" | "redis";
  tier: string;
  vcpu: number;
  ramGb: number;
  storageGb: number;
  pricePerHour: number | null;
  highAvailability: boolean;
  status: CatalogStatus;
}

// --- Containers ---------------------------------------------------------------

export interface ContainerPricing {
  id: string;
  tier: string;
  cpuCores: number;
  ramGb: number;
  pricePerHour: number | null;
  status: CatalogStatus;
}

// --- GPU ----------------------------------------------------------------------

export interface GpuPricing {
  id: string;
  gpu: string;
  vramGb: number | null;
  vcpu: number;
  ramGb: number;
  pricePerGpuHour: number | null;
  status: CatalogStatus;
}

// --- Backup -------------------------------------------------------------------

export interface BackupPricing {
  id: string;
  tier: string;
  pricePerGbMonth: number | null;
  minimumGb: number | null;
  status: CatalogStatus;
}

// --- Security ------------------------------------------------------------------

export type CostClass = "included" | "optional" | "usage_based";

export interface SecurityPricing {
  id: string;
  name: string;
  costClass: CostClass;
  unit: BillingUnit;
  price: number | null;
  included: string | null;
  status: CatalogStatus;
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

const EUR: CurrencyCode = "EUR";

/**
 * Free / included services. Labels, the included quota and the additional-usage
 * description live in i18n (`Public.pricing.freeServices.items`); this array
 * only defines the stable ids and ordering so the page iterates deterministically.
 */
export const includedServices: { id: string }[] = [
  { id: "api" },
  { id: "console" },
  { id: "basicNetworking" },
  { id: "monitoring" },
  { id: "firewall" },
  { id: "ipv6" },
];

export const catalogCategories: CatalogCategory[] = [
  { id: "compute", key: "compute", href: "/public-cloud/compute", status: "available" },
  { id: "storage", key: "storage", href: "/public-cloud/storage", status: "available" },
  { id: "networking", key: "networking", href: "/public-cloud/networking", status: "available" },
  { id: "databases", key: "databases", href: "/public-cloud/databases", status: "available" },
  { id: "containers", key: "containers", href: "/public-cloud/containers", status: "available" },
  { id: "gpu", key: "gpu", href: "/public-cloud/gpu-and-ai", status: "coming_soon" },
  { id: "backup", key: "backup", href: "/public-cloud/backup", status: "available" },
  { id: "security", key: "security", href: "/public-cloud/security", status: "available" },
];

/**
 * Compute instances. Configurations are indicative placeholders until the real
 * catalogue is published — `pricePerHour: null` renders as "to be announced".
 */
export const computePlans: ComputeCatalogueOption[] = [
  { id: "c1m1", name: "Compute S", vcpu: 1, ramGb: 1, storageGb: 20, networkGbps: null, pricePerHour: null, includedNetworkGb: null },
  { id: "c2m4", name: "Compute M", vcpu: 2, ramGb: 4, storageGb: 40, networkGbps: null, pricePerHour: null, includedNetworkGb: null },
  { id: "c4m8", name: "Compute L", vcpu: 4, ramGb: 8, storageGb: 80, networkGbps: null, pricePerHour: null, includedNetworkGb: null },
  { id: "c8m16", name: "Compute XL", vcpu: 8, ramGb: 16, storageGb: 160, networkGbps: null, pricePerHour: null, includedNetworkGb: null },
  { id: "c16m32", name: "Compute 2XL", vcpu: 16, ramGb: 32, storageGb: 320, networkGbps: null, pricePerHour: null, includedNetworkGb: null },
];

/** Billing models actually used by Zenth Cloud. */
export const billingModels: { id: BillingModelId; unit: BillingUnit }[] = [
  { id: "payg", unit: "hour" },
  { id: "hourly", unit: "hour" },
  { id: "monthly", unit: "month" },
  { id: "per_gb", unit: "gb_month" },
  { id: "per_request", unit: "request" },
  { id: "per_gpu_hour", unit: "gpu_hour" },
  { id: "per_instance", unit: "instance_month" },
];

export const storagePricing: StoragePricing[] = [
  { id: "block", name: "Block Storage", pricePerGbMonth: null, minimumGb: null, includedOperations: null, status: "placeholder" },
  { id: "object", name: "Object Storage", pricePerGbMonth: null, minimumGb: null, includedOperations: null, status: "placeholder" },
  { id: "backup", name: "Backup Storage", pricePerGbMonth: null, minimumGb: null, includedOperations: null, status: "placeholder" },
];

export const networkingPricing: NetworkingPricing[] = [
  { id: "inbound", name: "Inbound traffic", unit: "gb", price: null, included: "Included within the plan", charged: false, status: "placeholder" },
  { id: "outbound", name: "Outbound traffic", unit: "gb", price: null, included: "", charged: true, status: "placeholder" },
  { id: "publicIp", name: "Public IPv4 address", unit: "ip_month", price: null, included: "1 included per instance", charged: false, status: "placeholder" },
  { id: "privateNetworking", name: "Private networking (VPC)", unit: "month", price: null, included: "Included", charged: false, status: "placeholder" },
  { id: "loadBalancing", name: "Load balancer", unit: "month", price: null, included: "", charged: true, status: "placeholder" },
];

export const databasePricing: DatabasePricing[] = [
  { id: "db-s", engine: "postgresql", tier: "Small", vcpu: 1, ramGb: 2, storageGb: 20, pricePerHour: null, highAvailability: false, status: "placeholder" },
  { id: "db-m", engine: "postgresql", tier: "Medium", vcpu: 2, ramGb: 4, storageGb: 50, pricePerHour: null, highAvailability: false, status: "placeholder" },
  { id: "db-l", engine: "postgresql", tier: "Large", vcpu: 4, ramGb: 8, storageGb: 100, pricePerHour: null, highAvailability: false, status: "placeholder" },
];

export const containerPricing: ContainerPricing[] = [
  { id: "ct-s", tier: "Small", cpuCores: 1, ramGb: 0.5, pricePerHour: null, status: "placeholder" },
  { id: "ct-m", tier: "Medium", cpuCores: 1, ramGb: 1, pricePerHour: null, status: "placeholder" },
  { id: "ct-l", tier: "Large", cpuCores: 2, ramGb: 2, pricePerHour: null, status: "placeholder" },
];

export const gpuPricing: GpuPricing[] = [
  { id: "gpu-entry", gpu: "Entry GPU", vramGb: null, vcpu: 8, ramGb: 32, pricePerGpuHour: null, status: "coming_soon" },
];

export const backupPricing: BackupPricing[] = [
  { id: "bk-standard", tier: "Standard", pricePerGbMonth: null, minimumGb: null, status: "placeholder" },
];

export const securityPricing: SecurityPricing[] = [
  { id: "sec-firewall", name: "Firewall", costClass: "included", unit: "month", price: null, included: "Basic included", status: "available" },
  { id: "sec-ddos", name: "DDoS Protection", costClass: "included", unit: "month", price: null, included: "Included at network edge", status: "available" },
  { id: "sec-managed", name: "Managed security services", costClass: "optional", unit: "month", price: null, included: "", status: "coming_soon" },
  { id: "sec-advanced", name: "Advanced IP / network protection", costClass: "usage_based", unit: "month", price: null, included: "", status: "coming_soon" },
];

/**
 * Convenience "compare services" view — a non-normative summary of the billing
 * unit of each family. Amounts are not stored here: they live in the entries
 * above and are looked up by id, so there is still a single source of truth.
 */
export const serviceComparison: {
  id: string;
  categoryId: string;
  billingUnit: BillingUnit;
  usageBased: boolean;
  available: boolean;
}[] = [
  { id: "cmp-compute", categoryId: "compute", billingUnit: "hour", usageBased: true, available: true },
  { id: "cmp-storage", categoryId: "storage", billingUnit: "gb_month", usageBased: true, available: true },
  { id: "cmp-networking", categoryId: "networking", billingUnit: "gb", usageBased: true, available: true },
  { id: "cmp-databases", categoryId: "databases", billingUnit: "hour", usageBased: true, available: true },
  { id: "cmp-containers", categoryId: "containers", billingUnit: "hour", usageBased: true, available: true },
  { id: "cmp-gpu", categoryId: "gpu", billingUnit: "gpu_hour", usageBased: true, available: false },
  { id: "cmp-backup", categoryId: "backup", billingUnit: "gb_month", usageBased: true, available: true },
  { id: "cmp-security", categoryId: "security", billingUnit: "month", usageBased: false, available: true },
];

// ---------------------------------------------------------------------------
// Pricing conventions
// ---------------------------------------------------------------------------

/**
 * Number of hours used to estimate a monthly price. Kept in one place so every
 * "per month" estimate across the site uses the same rule.
 */
export const HOURS_PER_MONTH = 730;

/**
 * Formatting / precision. Computations always use raw numbers; only formatting
 * rounds — so float errors never leak into prices.
 */
export function formatPrice(
  amount: number,
  currency: CurrencyCode = EUR,
): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 4,
  }).format(amount);
}