import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  AlertTriangle,
  Archive,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Camera,
  Check,
  Clock,
  Cloud,
  Container,
  Database,
  Eye,
  FileText,
  HardDrive,
  History,
  LayoutGrid,
  Lock,
  Network,
  RotateCcw,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container as PageContainer } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.backup.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

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

function NetworkNode({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border border-border bg-muted px-4 py-3 text-center text-sm font-semibold text-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function NetworkLine({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      className={`bg-border ${vertical ? "h-6 w-px mx-auto" : "h-px w-8"}`}
      aria-hidden="true"
    />
  );
}

export default async function BackupPage() {
  const t = await getTranslations("Public.backup");

  const protectItems = t.raw("whatCanProtect.items") as string[];

  const backupTypes = [
    { key: "snapshot", icon: Camera },
    { key: "backup", icon: Archive },
    { key: "archive", icon: History },
  ];

  const automatedItems = t.raw("automatedBackups.items") as string[];

  const recoveryItems = t.raw("recovery.items") as string[];

  const workflowSteps = t.raw("recoveryWorkflow.steps") as string[];

  const securityItems = t.raw("security.items") as string[];

  const monitoringItems = t.raw("monitoring.items") as string[];

  const alertItems = t.raw("alerts.items") as string[];

  const managedLevels = [
    { key: "self", icon: Server, accent: "text-primary", bg: "bg-primary/10" },
    { key: "assisted", icon: Settings, accent: "text-chart-4", bg: "bg-chart-4/10" },
    { key: "managed", icon: ShieldCheck, accent: "text-chart-5", bg: "bg-chart-5/10" },
  ];

  const testingSteps = t.raw("backupTesting.steps") as string[];

  const drItems = t.raw("disasterRecovery.items") as string[];

  const useCaseIcons = [
    Server,
    Database,
    AlertTriangle,
    ArrowRight,
    RotateCcw,
  ];

  const crossSellItems = [
    { key: "compute", icon: Server, href: "/public-cloud/compute" },
    { key: "storage", icon: HardDrive, href: "/public-cloud/storage" },
    { key: "databases", icon: Database, href: "/public-cloud/databases" },
    { key: "containers", icon: Container, href: "/public-cloud/containers" },
    { key: "networking", icon: Network, href: "/public-cloud/networking" },
    { key: "gpuAi", icon: Zap, href: "/public-cloud/gpu-and-ai" },
  ];

  return (
    <>
      {/* 1. Hero */}
      <section
        aria-label={t("hero.badge")}
        className="relative flex flex-col overflow-hidden text-white min-h-112 md:min-h-128"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #c026d3 35%, #f97316 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.18),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.08),transparent_40%)]" />

        <PageContainer className="relative flex flex-1 items-center py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center w-full">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                {t("hero.badge")}
              </span>
              <h1 className="mt-6 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-balance">
                {t("hero.title")}
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  <Link href="https://manager.zenthcloud.com" target="_blank" rel="noreferrer">
                    {t("hero.primaryCta")}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                  <Link href="#what-can-protect">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-8 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-xl">
                      <ShieldCheck className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <RotateCcw className="h-8 w-8 text-white/90" />
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <Archive className="h-8 w-8 text-white/90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 2. What can you protect */}
      <section id="what-can-protect" className="py-16 md:py-24 bg-background scroll-mt-20">
        <PageContainer>
          <SectionHeader eyebrow={t("whatCanProtect.eyebrow")} title={t("whatCanProtect.title")} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {protectItems.map((item, index) => {
              const icons = [Server, Server, HardDrive, Database, Container, Cloud];
              const Icon = icons[index % icons.length];
              return (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 3. Backup types */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader eyebrow={t("backupTypes.eyebrow")} title={t("backupTypes.title")} />

          <div className="grid gap-5 md:grid-cols-3">
            {backupTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{t(`backupTypes.${type.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`backupTypes.${type.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("backupTypes.difference")}
          </p>
        </PageContainer>
      </section>

      {/* 4. Architecture Backup */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="rounded-xl border border-border bg-muted p-6 md:p-10 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <NetworkNode>Production</NetworkNode>
              <NetworkLine vertical />
              <div className="grid w-full max-w-lg grid-cols-3 gap-3">
                <NetworkNode>Compute</NetworkNode>
                <NetworkNode>Storage</NetworkNode>
                <NetworkNode>Database</NetworkNode>
              </div>
              <NetworkLine vertical />
              <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                Backup
              </div>
              <NetworkLine vertical />
              <NetworkNode>Backup Storage</NetworkNode>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 5. Automated backups */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader
            eyebrow={t("automatedBackups.eyebrow")}
            title={t("automatedBackups.title")}
            description={t("automatedBackups.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {automatedItems.map((item, index) => {
              const icons = [Clock, Clock, History, Zap, RotateCcw];
              const Icon = icons[index % icons.length];
              return (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <NetworkNode>Production</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>Backup Policy</NetworkNode>
              <NetworkLine vertical />
              <div className="grid w-full max-w-xs grid-cols-1 gap-3">
                <NetworkNode>Schedule</NetworkNode>
                <NetworkNode>Retention</NetworkNode>
                <NetworkNode>Destination</NetworkNode>
              </div>
              <NetworkLine vertical />
              <NetworkNode>Backup Storage</NetworkNode>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 6. Retention + Recovery */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("retention.eyebrow")}
                title={t("retention.title")}
                description={t("retention.description")}
              />
              <div className="mt-6 rounded-xl border border-border bg-muted p-6 shadow-sm">
                <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                  <NetworkNode>Daily</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>7 days</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>30 days</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>Long-term</NetworkNode>
                </div>
              </div>
            </div>
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("recovery.eyebrow")}
                title={t("recovery.title")}
                description={t("recovery.description")}
              />
              <div className="mt-6 space-y-2">
                {recoveryItems.map((item, index) => {
                  const icons = [FileText, HardDrive, Server, Database, Boxes];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 7. Recovery workflow */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader
            eyebrow={t("recoveryWorkflow.eyebrow")}
            title={t("recoveryWorkflow.title")}
            description={t("recoveryWorkflow.description")}
          />

          <div className="flex flex-col items-center gap-4">
            {workflowSteps.map((step, index, steps) => (
              <React.Fragment key={step}>
                <div className="rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground shadow-sm">
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <ArrowDownToLine className="h-5 w-5 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 8. Human error + Infrastructure failure */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">{t("humanError.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("humanError.description")}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">{t("infrastructureFailure.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("infrastructureFailure.description")}</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 9. Isolation + Security + Encryption */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-3">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("isolation.eyebrow")}
                title={t("isolation.title")}
                description={t("isolation.description")}
              />
              <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                  <NetworkNode>Production</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>Backup System</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>Separate Backup Storage</NetworkNode>
                </div>
              </div>
            </div>
            <div>
              <SectionHeader align="left" eyebrow={t("security.eyebrow")} title={t("security.title")} />
              <div className="mt-6 space-y-2">
                {securityItems.map((item, index) => {
                  const icons = [Lock, Lock, Shield, LayoutGrid, Network, Eye, ShieldCheck];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <SectionHeader align="left" eyebrow={t("encryption.eyebrow")} title={t("encryption.title")} />
              <div className="mt-6 space-y-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-sm font-bold text-foreground">Encryption in transit</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{t("encryption.inTransit")}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-sm font-bold text-foreground">Encryption at rest</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{t("encryption.atRest")}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-sm font-bold text-foreground">Key management</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{t("encryption.keyManagement")}</p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 10. Cross-product links */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-lg font-bold text-foreground">{t("databaseBackup.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("databaseBackup.description")}</p>
              <div className="mt-4">
                <Link href="/public-cloud/databases" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  {t("databaseBackup.cta")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-lg font-bold text-foreground">{t("computeBackup.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("computeBackup.description")}</p>
              <div className="mt-4">
                <Link href="/public-cloud/compute" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  {t("computeBackup.cta")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-lg font-bold text-foreground">{t("containersBackup.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("containersBackup.description")}</p>
              <div className="mt-4">
                <Link href="/public-cloud/containers" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  {t("containersBackup.cta")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="text-lg font-bold text-foreground">{t("storageBackup.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("storageBackup.description")}</p>
              <div className="mt-4">
                <Link href="/public-cloud/storage" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  {t("storageBackup.cta")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 11. 3-2-1 + Monitoring + Alerts */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-3">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("threeTwoOne.eyebrow")}
                title={t("threeTwoOne.title")}
                description={t("threeTwoOne.description")}
              />
            </div>
            <div>
              <SectionHeader align="left" eyebrow={t("monitoring.eyebrow")} title={t("monitoring.title")} />
              <div className="mt-6 space-y-2">
                {monitoringItems.map((item, index) => {
                  const icons = [Check, AlertTriangle, Clock, Boxes, HardDrive];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("alerts.eyebrow")}
                title={t("alerts.title")}
                description={t("alerts.description")}
              />
              <div className="mt-6 space-y-2">
                {alertItems.map((item, index) => {
                  const icons = [AlertTriangle, HardDrive, AlertTriangle, RotateCcw];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 12. Managed Backup */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader eyebrow={t("managed.eyebrow")} title={t("managed.title")} />

          <div className="grid gap-5 md:grid-cols-3">
            {managedLevels.map((level) => {
              const Icon = level.icon;
              const featureCount = t.raw(`managed.${level.key}.features`).length;
              return (
                <div
                  key={level.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${level.bg} ${level.accent}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{t(`managed.${level.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`managed.${level.key}.description`)}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {Array.from({ length: featureCount }, (_, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {t(`managed.${level.key}.features.${i}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 13. Backup testing */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader
            eyebrow={t("backupTesting.eyebrow")}
            title={t("backupTesting.title")}
            description={t("backupTesting.description")}
          />

          <div className="flex flex-col items-center gap-4">
            {testingSteps.map((step, index, steps) => (
              <React.Fragment key={step}>
                <div className="rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground shadow-sm">
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <ArrowDownToLine className="h-5 w-5 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 14. Disaster Recovery + RPO/RTO */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("disasterRecovery.eyebrow")}
                title={t("disasterRecovery.title")}
                description={t("disasterRecovery.description")}
              />
              <div className="mt-6 rounded-xl border border-border bg-muted p-6 shadow-sm">
                <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                  <NetworkNode>Primary Infrastructure</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>Backup</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>Recovery Infrastructure</NetworkNode>
                </div>
              </div>
              <div className="mt-6 grid gap-2">
                {drItems.map((item, index) => {
                  const icons = [Archive, RotateCcw, Check];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <SectionHeader align="left" eyebrow={t("rpoRto.eyebrow")} title={t("rpoRto.title")} />
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-border bg-muted p-4">
                  <h4 className="text-sm font-bold text-foreground">RPO</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{t("rpoRto.rpo")}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-4">
                  <h4 className="text-sm font-bold text-foreground">RTO</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{t("rpoRto.rto")}</p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 15. Pricing */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader
            eyebrow={t("pricing.eyebrow")}
            title={t("pricing.title")}
            description={t("pricing.description")}
          />

          <div className="flex flex-wrap justify-center gap-2">
            {t.raw("pricing.items").map((item: string) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">{t("pricing.cta")}</Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* 16. Use cases */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader eyebrow={t("useCases.eyebrow")} title={t("useCases.title")} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCaseIcons.map((Icon, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold text-foreground">{t(`useCases.items.${index}`)}</p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 17. Cross-selling */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader eyebrow={t("crossSelling.eyebrow")} title={t("crossSelling.title")} />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {crossSellItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">
                      {t(`crossSelling.${item.key}.label`)}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t(`crossSelling.${item.key}.description`)}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      {t(`crossSelling.${item.key}.cta`)} <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 18. CTA final */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-bold">{t("finalCta.title")}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-primary-foreground/80">
              {t("finalCta.description")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link href="https://manager.zenthcloud.com" target="_blank" rel="noreferrer">
                  {t("finalCta.primary")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                <Link href="/contact">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
