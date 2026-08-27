import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  ArrowUpRight,
  Archive,
  Check,
  Container as ContainerIcon,
  Cpu,
  Database,
  HardDrive,
  Network,
  Shield,
  Sparkles,
  Braces,
  CircleDollarSign,
  Info,
  BadgeEuro,
  ShieldCheck,
  Gauge,
  Wallet,
  Clock,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";
import { Price } from "@/components/public/pricing/price";
import { PricingTable } from "@/components/public/pricing/pricing-table";
import { StatusBadge, CostClassBadge } from "@/components/public/pricing/status-badge";
import { PricingCalculator } from "@/components/public/pricing/calculator";

import {
  catalogCategories,
  computePlans,
  storagePricing,
  networkingPricing,
  databasePricing,
  containerPricing,
  gpuPricing,
  backupPricing,
  securityPricing,
  serviceComparison,
  HOURS_PER_MONTH,
  type BillingUnit,
} from "@/lib/pricing/catalog";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

function SectionHeader({ eyebrow, title, description, align = "center" }: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto mb-12 max-w-2xl text-center" : "mb-10 max-w-2xl"}>
      <span className="text-xs font-bold uppercase tracking-wider text-primary">{eyebrow}</span>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}

const CATEGORY_ICONS = {
  compute: Cpu,
  storage: HardDrive,
  networking: Network,
  databases: Database,
  containers: ContainerIcon,
  gpu: Sparkles,
  backup: Archive,
  security: Shield,
} as const;

export async function generateMetadata() {
  const t = await getTranslations("Public.pricing.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PricingPage() {
  const t = await getTranslations("Public.pricing");
  const tbd = t("placeholders.tbd");

  const categories = catalogCategories.map((cat) => ({
    ...cat,
    label: t(`overview.categories.${cat.key}`),
  }));

  return (
    <>
      {/* 1. Hero */}
      <section aria-label={t("hero.badge")} className="border-b border-border bg-background">
        <Container className="flex flex-col items-center py-20 text-center md:py-28">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {t("hero.badge")}
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/public-cloud/compute">
                {t("hero.primaryCta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#calculator">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{t("hero.note")}</p>
        </Container>
      </section>

      {/* 2. Pricing overview — families */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("overview.eyebrow")}
            title={t("overview.title")}
            description={t("overview.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.key as keyof typeof CATEGORY_ICONS];
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className={`h-1.5 rounded-t-xl ${cat.key === "gpu" ? "bg-chart-4" : "bg-primary"}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <StatusBadge
                        status={cat.status}
                        availableLabel={t("compare.available")}
                        placeholderLabel={t("placeholders.notPublished")}
                        comingSoonLabel={t("compare.comingSoon")}
                      />
                    </div>
                    <h3 className="mt-4 text-base font-bold text-foreground">{cat.label}</h3>
                    <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      {t("overview.cta")} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. How pricing works */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("howPricingWorks.eyebrow")}
            title={t("howPricingWorks.title")}
            description={t("howPricingWorks.description")}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(t.raw("howPricingWorks.items") as { title: string; description: string }[]).map(
              (item, index) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <CircleDollarSign className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              )
            )}
          </div>

          {/* Pricing units */}
          <div className="mt-12 rounded-xl border border-border bg-background p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("pricingUnits.eyebrow")}</span>
                <h3 className="mt-2 text-xl font-bold text-foreground">{t("pricingUnits.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t("pricingUnits.description")}</p>
              </div>
              <div className="flex flex-wrap content-start gap-3">
                {(t.raw("pricingUnits.items") as string[]).map((unit) => (
                  <span
                    key={unit}
                    className="inline-flex items-center rounded-lg border border-border bg-muted px-3 py-1.5 font-mono text-sm text-foreground"
                  >
                    {unit}
                  </span>
                ))}
                <p className="mt-2 w-full text-xs text-muted-foreground">{t("pricingUnits.taxNote")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Compute pricing + calculator */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("compute.eyebrow")}
            title={t("compute.title")}
            description={t("compute.description")}
          />

          <PricingTable
            title={t("compute.title")}
            ariaLabel={t("compute.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={computePlans}
            highlightFirst
            columns={[
              {
                key: "name",
                header: t("compute.columns.plan"),
                render: (row) => <span className="font-semibold">{row.name}</span>,
              },
              { key: "vcpu", header: t("compute.columns.vcpu"), render: (row) => row.vcpu },
              { key: "ram", header: t("compute.columns.ram"), render: (row) => `${row.ramGb} GB` },
              {
                key: "storage",
                header: t("compute.columns.storage"),
                render: (row) => (row.storageGb ? `${row.storageGb} GB` : "—"),
              },
              {
                key: "pricePerHour",
                header: t("compute.columns.pricePerHour"),
                className: "font-semibold",
                render: (row) => (
                  <Price amount={row.pricePerHour} unit="hour" placeholderLabel={tbd} />
                ),
              },
              {
                key: "estimatedMonthly",
                header: t("compute.columns.estimatedMonthly"),
                render: (row) =>
                  row.pricePerHour === null ? (
                    tbd
                  ) : (
                    <span>
                      <Price amount={row.pricePerHour * HOURS_PER_MONTH} unit="month" placeholderLabel={tbd} />{" "}
                      <span className="text-xs text-muted-foreground">{t("estimate.perMonth")}</span>
                    </span>
                  ),
              },
            ]}
          />

          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("compute.note")}
          </p>

          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/public-cloud/compute">{t("compute.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 5. Calculator (client) */}
      <section id="calculator" className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("calculator.eyebrow")}
            title={t("calculator.title")}
            description={t("calculator.description")}
          />
          <PricingCalculator
            computePlans={computePlans}
            storagePlans={storagePricing}
            copy={{
              title: t("calculator.calcTitle"),
              subtitle: t("calculator.calcSubtitle"),
              computeLabel: t("calculator.computeLabel"),
              storageLabel: t("calculator.storageLabel"),
              networkLabel: t("calculator.networkLabel"),
              estimateTitle: t("calculator.estimateTitle"),
              hourly: t("calculator.perHour"),
              daily: t("calculator.perDay"),
              monthly: t("calculator.perMonth"),
              annual: t("calculator.perYear"),
              notConfigured: t("calculator.notConfigured"),
              dependsOnUsage: t("calculator.dependsOnUsage"),
              computeNoneLabel: t("calculator.computeNone"),
              storageNoneLabel: t("calculator.storageNone"),
            }}
          />
        </Container>
      </section>

      {/* 6. Storage */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("storage.eyebrow")}
            title={t("storage.title")}
            description={t("storage.description")}
          />
          <PricingTable
            title={t("storage.title")}
            ariaLabel={t("storage.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={storagePricing}
            columns={[
              {
                key: "name",
                header: t("storage.columns.type"),
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{row.name}</span>
                    <StatusBadge
                      status={row.status}
                      availableLabel={t("compare.available")}
                      placeholderLabel={t("compare.comingSoon")}
                      comingSoonLabel={t("compare.comingSoon")}
                    />
                  </div>
                ),
              },
              {
                key: "price",
                header: t("storage.columns.pricePerGb"),
                className: "font-semibold",
                render: (row) => (
                  <Price amount={row.pricePerGbMonth} unit="gb_month" placeholderLabel={tbd} />
                ),
              },
              {
                key: "minimum",
                header: t("storage.columns.minimum"),
                render: (row) => (row.minimumGb ? `${row.minimumGb} GB` : "—"),
              },
              {
                key: "includedOps",
                header: t("storage.columns.includedOps"),
                render: (row) => row.includedOperations ?? "—",
              },
            ]}
          />
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("storage.note")}
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/public-cloud/storage">{t("storage.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 7. Networking */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("networking.eyebrow")}
            title={t("networking.title")}
            description={t("networking.description")}
          />
          <PricingTable
            title={t("networking.title")}
            ariaLabel={t("networking.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={networkingPricing}
            columns={[
              {
                key: "name",
                header: t("networking.columns.item"),
                render: (row) => <span className="font-semibold">{row.name}</span>,
              },
              {
                key: "unit",
                header: t("networking.columns.unit"),
                render: (row) => (
                  <span className="font-mono text-xs">{BILLING_UNIT_LABELS[row.unit]}</span>
                ),
              },
              {
                key: "status",
                header: t("networking.columns.status"),
                render: (row) => (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      row.charged
                        ? "bg-primary/10 text-primary"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {row.charged ? t("networking.chargedLabel") : t("networking.includedLabel")}
                  </span>
                ),
              },
              {
                key: "price",
                header: t("networking.columns.price"),
                className: "font-semibold",
                render: (row) =>
                  row.charged ? (
                    <Price amount={row.price} unit={row.unit} placeholderLabel={tbd} />
                  ) : (
                    t("networking.includedLabel")
                  ),
              },
            ]}
          />
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("networking.note")}
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/public-cloud/networking">{t("networking.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 8. Databases */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("databases.eyebrow")}
            title={t("databases.title")}
            description={t("databases.description")}
          />
          <PricingTable
            title={t("databases.title")}
            ariaLabel={t("databases.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={databasePricing}
            columns={[
              {
                key: "engine",
                header: t("databases.columns.engine"),
                render: (row) => <span className="font-semibold uppercase text-xs">{row.engine}</span>,
              },
              {
                key: "tier",
                header: t("databases.columns.tier"),
                render: (row) => row.tier,
              },
              { key: "vcpu", header: t("databases.columns.vcpu"), render: (row) => row.vcpu },
              { key: "ram", header: t("databases.columns.ram"), render: (row) => `${row.ramGb} GB` },
              { key: "storage", header: t("databases.columns.storage"), render: (row) => `${row.storageGb} GB` },
              {
                key: "ha",
                header: t("databases.columns.ha"),
                render: (row) => (row.highAvailability ? <Check className="h-4 w-4 text-primary" /> : "—"),
              },
              {
                key: "price",
                header: t("databases.columns.pricePerHour"),
                className: "font-semibold",
                render: (row) => <Price amount={row.pricePerHour} unit="hour" placeholderLabel={tbd} />,
              },
            ]}
          />
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("databases.note")}
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/public-cloud/databases">{t("databases.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 9. Containers */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("containers.eyebrow")}
            title={t("containers.title")}
            description={t("containers.description")}
          />
          <PricingTable
            title={t("containers.title")}
            ariaLabel={t("containers.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={containerPricing}
            columns={[
              {
                key: "tier",
                header: t("containers.columns.tier"),
                render: (row) => <span className="font-semibold">{row.tier}</span>,
              },
              { key: "cpu", header: t("containers.columns.cpu"), render: (row) => `${row.cpuCores} vCPU` },
              { key: "ram", header: t("containers.columns.ram"), render: (row) => `${row.ramGb} GB` },
              {
                key: "price",
                header: t("containers.columns.pricePerHour"),
                className: "font-semibold",
                render: (row) => <Price amount={row.pricePerHour} unit="hour" placeholderLabel={tbd} />,
              },
            ]}
          />
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("containers.note")}
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/public-cloud/containers">{t("containers.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 10. GPU & AI */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("gpu.eyebrow")}
            title={t("gpu.title")}
            description={t("gpu.description")}
          />
          <PricingTable
            title={t("gpu.title")}
            ariaLabel={t("gpu.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={gpuPricing}
            columns={[
              {
                key: "gpu",
                header: t("gpu.columns.gpu"),
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{row.gpu}</span>
                    <StatusBadge
                      status={row.status}
                      availableLabel={t("compare.available")}
                      placeholderLabel={t("gpu.comingSoon")}
                      comingSoonLabel={t("gpu.comingSoon")}
                    />
                  </div>
                ),
              },
              {
                key: "vram",
                header: t("gpu.columns.vram"),
                render: (row) => (row.vramGb ? `${row.vramGb} GB` : "—"),
              },
              { key: "vcpu", header: t("gpu.columns.vcpu"), render: (row) => row.vcpu },
              { key: "ram", header: t("gpu.columns.ram"), render: (row) => `${row.ramGb} GB` },
              {
                key: "price",
                header: t("gpu.columns.pricePerGpuHour"),
                className: "font-semibold",
                render: (row) => (
                  <Price amount={row.pricePerGpuHour} unit="gpu_hour" placeholderLabel={tbd} />
                ),
              },
            ]}
          />
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("gpu.note")}
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/public-cloud/gpu-and-ai">{t("gpu.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 11. Backup */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("backup.eyebrow")}
            title={t("backup.title")}
            description={t("backup.description")}
          />
          <PricingTable
            title={t("backup.title")}
            ariaLabel={t("backup.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={backupPricing}
            columns={[
              {
                key: "tier",
                header: t("backup.columns.tier"),
                render: (row) => <span className="font-semibold">{row.tier}</span>,
              },
              {
                key: "price",
                header: t("backup.columns.pricePerGb"),
                className: "font-semibold",
                render: (row) => <Price amount={row.pricePerGbMonth} unit="gb_month" placeholderLabel={tbd} />,
              },
              {
                key: "minimum",
                header: t("backup.columns.minimum"),
                render: (row) => (row.minimumGb ? `${row.minimumGb} GB` : "—"),
              },
              {
                key: "retention",
                header: t("backup.columns.retention"),
                render: () => "—",
              },
            ]}
          />
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("backup.note")}
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/public-cloud/backup">{t("backup.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 12. Security */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("security.eyebrow")}
            title={t("security.title")}
            description={t("security.description")}
          />
          <PricingTable
            title={t("security.title")}
            ariaLabel={t("security.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={securityPricing}
            columns={[
              {
                key: "name",
                header: t("security.columns.item"),
                render: (row) => <span className="font-semibold">{row.name}</span>,
              },
              {
                key: "class",
                header: t("security.columns.class"),
                render: (row) => (
                  <CostClassBadge
                    costClass={row.costClass}
                    includedLabel={t("security.included")}
                    optionalLabel={t("security.optional")}
                    usageBasedLabel={t("security.usageBased")}
                  />
                ),
              },
              {
                key: "included",
                header: t("security.columns.included"),
                render: (row) => row.included ?? "—",
              },
              {
                key: "price",
                header: t("security.columns.price"),
                className: "font-semibold",
                render: (row) =>
                  row.costClass === "included" ? t("security.included") : <Price amount={row.price} unit={row.unit} placeholderLabel={tbd} />,
              },
            ]}
          />
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("security.note")}
          </p>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/public-cloud/security">{t("security.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 13. Included vs extra */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("includedVsExtra.eyebrow")}
            title={t("includedVsExtra.title")}
            description={t("includedVsExtra.description")}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {(["included", "optional", "usageBased"] as const).map((kind) => {
              const Icon = kind === "included" ? Check : kind === "optional" ? Plus : Network;
              const tone =
                kind === "included"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : kind === "optional"
                    ? "bg-chart-5/10 text-chart-5"
                    : "bg-primary/10 text-primary";
              const items = t.raw(`includedVsExtra.${kind}.items`) as string[];
              return (
                <div
                  key={kind}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {t(`includedVsExtra.${kind}.title`)}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                        {kind === "included" && <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                        {kind === "optional" && <span className="mt-0.5 h-4 w-4 shrink-0 text-center text-chart-5">+</span>}
                        {kind === "usageBased" && <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 14. Free / included services */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("freeServices.eyebrow")}
            title={t("freeServices.title")}
            description={t("freeServices.description")}
          />
          <PricingTable
            title={t("freeServices.title")}
            ariaLabel={t("freeServices.title")}
            emptyLabel={t("placeholders.notPublished")}
            rows={(t.raw("freeServices.items") as { id: string; label: string; included: string; additional: string }[]).map(
              (s) => ({ id: s.id, label: s.label, included: s.included, additional: s.additional })
            )}
            columns={[
              {
                key: "label",
                header: t("freeServices.columns.service"),
                render: (row) => (
                  <span className="inline-flex items-center gap-2">
                    <Braces className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{row.label}</span>
                  </span>
                ),
              },
              {
                key: "included",
                header: t("freeServices.columns.included"),
                render: (row) => row.included,
              },
              {
                key: "additional",
                header: t("freeServices.columns.additional"),
                render: (row) => row.additional || "—",
              },
            ]}
          />
          <p className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("freeServices.note")}
          </p>
        </Container>
      </section>

      {/* 15. Compare services */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("compare.eyebrow")}
            title={t("compare.title")}
            description={t("compare.description")}
          />
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("compare.columns.service")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("compare.columns.unit")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("compare.columns.usageBased")}
                    </th>
                    <th scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("compare.columns.service")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {serviceComparison.map((row) => {
                    const cat = categories.find((c) => c.id === row.categoryId);
                    return (
                      <tr key={row.id} className="border-b border-border/60 transition-colors hover:bg-muted/60 last:border-0">
                        <td className="px-4 py-3">
                          <Link
                            href={cat?.href ?? "/public-cloud"}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
                          >
                            {cat?.label ?? row.categoryId}
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                          {!row.available && (
                            <StatusBadge
                              status="coming_soon"
                              availableLabel={t("compare.available")}
                              placeholderLabel={t("compare.comingSoon")}
                              comingSoonLabel={t("compare.comingSoon")}
                            />
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-foreground">
                            {BILLING_UNIT_LABELS[row.billingUnit]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {row.usageBased ? t("compare.yes") : t("compare.no")}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {row.available ? t("compare.available") : t("compare.comingSoon")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      {/* 16. Monthly estimate illustration */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("estimate.eyebrow")}
            title={t("estimate.title")}
            description={t("estimate.description")}
          />
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
            <ul className="space-y-3">
              {(
                [
                  ["compute", t("estimate.compute")],
                  ["storage", t("estimate.storage")],
                  ["network", t("estimate.network")],
                  ["backup", t("estimate.backup")],
                ] as const
              ).map(([key, label]) => (
                <li key={key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-mono text-foreground">{tbd}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("estimate.total")}</span>
              <span className="font-mono text-lg font-bold text-foreground">{tbd} {t("estimate.perMonth")}</span>
            </div>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              {t("estimate.note")}
            </p>
          </div>
        </Container>
      </section>

      {/* 17. Billing transparency + taxes */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("billingTransparency.eyebrow")}
            title={t("billingTransparency.title")}
            description={t("billingTransparency.description")}
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("billingTransparency.title")}</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {(t.raw("billingTransparency.items") as string[]).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">{t("billingTransparency.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <BadgeEuro className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("taxCurrency.title")}</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {[t("taxCurrency.currency"), t("taxCurrency.taxes"), t("taxCurrency.billingPeriod"), t("taxCurrency.rounding")].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 18. Cost control */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("costControl.eyebrow")}
            title={t("costControl.title")}
            description={t("costControl.description")}
          />
          <div className="grid gap-5 md:grid-cols-2">
            {(["availableNow", "comingSoon"] as const).map((kind) => {
              const Icon = kind === "availableNow" ? Gauge : Clock;
              const border = kind === "availableNow" ? "border-border" : "border-dashed border-border";
              return (
                <div key={kind} className={`rounded-xl border ${border} bg-card p-6 shadow-sm`}>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{t(`costControl.${kind}.title`)}</h3>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {(t.raw(`costControl.${kind}.items`) as string[]).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 19. Final CTA */}
      <section className="border-t border-border py-16 md:py-24 bg-muted">
        <Container>
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-bold">{t("finalCta.title")}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-primary-foreground/80">{t("finalCta.description")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link href="https://manager.zenthcloud.com" target="_blank" rel="noreferrer">
                  {t("finalCta.primary")} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                <Link href="/public-cloud">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

/** Human labels for the billing-unit codes used in the catalog. */
const BILLING_UNIT_LABELS: Record<BillingUnit, string> = {
  hour: "€/heure",
  month: "€/mois",
  gb_month: "€/Go/mois",
  gb: "€/Go",
  request: "€/requête",
  gpu_hour: "€/heure GPU",
  ip_month: "€/IP/mois",
  instance_month: "€/instance/mois",
};