import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  Archive,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Box,
  Boxes,
  Building2,
  Camera,
  Check,
  Clock,
  Cloud,
  Code2,
  Database,
  Eye,
  GitBranch,
  Globe,
  Key,
  Layers,
  Lock,
  Network,
  RotateCcw,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.databases.meta");

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

export default async function DatabasesPage() {
  const t = await getTranslations("Public.databases");

  const engines = [
    { key: "postgresql", icon: Database },
    { key: "mysql", icon: Database },
    { key: "redis", icon: Zap },
  ];

  const whyManagedItems = [
    { label: t("whyManaged.items.0"), icon: Zap },
    { label: t("whyManaged.items.1"), icon: Settings },
    { label: t("whyManaged.items.2"), icon: Archive },
    { label: t("whyManaged.items.3"), icon: Activity },
    { label: t("whyManaged.items.4"), icon: Shield },
    { label: t("whyManaged.items.5"), icon: ArrowUpRight },
    { label: t("whyManaged.items.6"), icon: RotateCcw },
  ];

  const workloads = [
    { key: "webApplications", icon: Globe },
    { key: "saas", icon: Cloud },
    { key: "enterprise", icon: Building2 },
    { key: "development", icon: Code2 },
    { key: "analytics", icon: BarChart3 },
  ];

  const securityItems = [
    { label: t("security.items.0"), icon: Network },
    { label: t("security.items.1"), icon: Shield },
    { label: t("security.items.2"), icon: Users },
    { label: t("security.items.3"), icon: Key },
    { label: t("security.items.4"), icon: Lock },
    { label: t("security.items.5"), icon: Lock },
    { label: t("security.items.6"), icon: Server },
    { label: t("security.items.7"), icon: Activity },
    { label: t("security.items.8"), icon: Activity },
    { label: t("security.items.9"), icon: Eye },
  ];

  const backupsItems = [
    { label: t("backups.items.0"), icon: Archive },
    { label: t("backups.items.1"), icon: Camera },
    { label: t("backups.items.2"), icon: Clock },
    { label: t("backups.items.3"), icon: RotateCcw },
    { label: t("backups.items.4"), icon: ShieldCheck },
  ];

  const monitoringMetrics = [
    { label: t("monitoring.metrics.0"), icon: Activity },
    { label: t("monitoring.metrics.1"), icon: Activity },
    { label: t("monitoring.metrics.2"), icon: Database },
    { label: t("monitoring.metrics.3"), icon: Zap },
    { label: t("monitoring.metrics.4"), icon: Users },
    { label: t("monitoring.metrics.5"), icon: Terminal },
    { label: t("monitoring.metrics.6"), icon: Zap },
    { label: t("monitoring.metrics.7"), icon: ShieldCheck },
  ];

  const developerFeatures = [
    { label: t("developers.features.0"), icon: Code2 },
    { label: t("developers.features.1"), icon: Zap },
    { label: t("developers.features.2"), icon: Boxes },
    { label: t("developers.features.3"), icon: GitBranch },
    { label: t("developers.features.4"), icon: Clock },
    { label: t("developers.features.5"), icon: Layers },
  ];

  const openSourceBenefits = [
    { label: t("openSource.benefits.0"), icon: Eye },
    { label: t("openSource.benefits.1"), icon: Globe },
    { label: t("openSource.benefits.2"), icon: Box },
    { label: t("openSource.benefits.3"), icon: Lock },
    { label: t("openSource.benefits.4"), icon: Users },
  ];

  const useCaseIcons = [
    Cloud,
    ShoppingCart,
    Layers,
    Boxes,
  ];

  const crossSellItems = [
    { key: "compute", icon: Server, href: "/public-cloud/compute" },
    { key: "storage", icon: Database, href: "/public-cloud/storage" },
    { key: "networking", icon: Network, href: "/public-cloud/networking" },
    { key: "backup", icon: ShieldCheck, href: "/public-cloud/backup" },
    { key: "security", icon: Shield, href: "/public-cloud/security" },
  ];

  const migrationCases = [
    { label: t("migration.cases.0"), icon: Server },
    { label: t("migration.cases.1"), icon: Server },
    { label: t("migration.cases.2"), icon: Cloud },
    { label: t("migration.cases.3"), icon: Building2 },
  ];

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
              <Link href="https://manager.zenthcloud.com" target="_blank" rel="noreferrer">
                {t("hero.primaryCta")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#engines">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 2. Engines */}
      <section id="engines" className="py-16 md:py-24 bg-background scroll-mt-20">
        <Container>
          <SectionHeader
            eyebrow={t("engines.eyebrow")}
            title={t("engines.title")}
            description={t("engines.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {engines.map((engine) => {
              const Icon = engine.icon;
              return (
                <div
                  key={engine.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{t(`engines.${engine.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`engines.${engine.key}.description`)}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t(`engines.${engine.key}.useCases`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Why managed */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader eyebrow={t("whyManaged.eyebrow")} title={t("whyManaged.title")} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyManagedItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Workloads */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader eyebrow={t("workloads.eyebrow")} title={t("workloads.title")} />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {workloads.map((workload) => {
              const Icon = workload.icon;
              return (
                <div
                  key={workload.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {t(`workloads.${workload.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`workloads.${workload.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Database + Compute */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("computeIntegration.eyebrow")}
                title={t("computeIntegration.title")}
                description={t("computeIntegration.description")}
              />
              <div className="mt-8">
                <Button asChild>
                  <Link href="/public-cloud/compute">
                    {t("computeIntegration.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Internet</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Compute</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Private Network</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Database</NetworkNode>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Database + Networking */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Internet</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Application</NetworkNode>
                <NetworkLine vertical />
                <div className="text-xs text-muted-foreground">Private Network</div>
                <NetworkLine vertical />
                <NetworkNode>Database</NetworkNode>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader
                align="left"
                eyebrow={t("networkingIntegration.eyebrow")}
                title={t("networkingIntegration.title")}
                description={t("networkingIntegration.description")}
              />
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/networking">
                    {t("networkingIntegration.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Security */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader eyebrow={t("security.eyebrow")} title={t("security.title")} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {securityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("security.responsibility")}
          </p>
        </Container>
      </section>

      {/* 8. Backups & Recovery */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("backups.eyebrow")}
                title={t("backups.title")}
                description={t("backups.description")}
              />
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/backup">
                    {t("backups.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Database</NetworkNode>
                <NetworkLine vertical />
                <div className="grid w-full max-w-xs grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-3">
                    <Archive className="h-4 w-4 text-primary" />
                    <span className="text-xs">Backup</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-3">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    <span className="text-xs">Restore</span>
                  </div>
                </div>
                <NetworkLine vertical />
                <NetworkNode>Backup Storage</NetworkNode>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Scaling */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("scaling.eyebrow")}
            title={t("scaling.title")}
            description={t("scaling.description")}
          />

          <div className="flex flex-col items-center gap-4">
            {t.raw("scaling.steps").map((step: string, index: number, steps: string[]) => (
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
        </Container>
      </section>

      {/* 10. High Availability */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("highAvailability.eyebrow")}
            title={t("highAvailability.title")}
            description={t("highAvailability.description")}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {t.raw("highAvailability.items").map((item: string, index: number) => {
              const icons = [ShieldCheck, Boxes, Shield];
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("highAvailability.note")}
          </p>
        </Container>
      </section>

      {/* 11. Monitoring */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("monitoring.eyebrow")}
            title={t("monitoring.title")}
            description={t("monitoring.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {monitoringMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{metric.label}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 12. Managed vs Self-managed */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader eyebrow={t("managedVsSelf.eyebrow")} title={t("managedVsSelf.title")} />

          <div className="overflow-x-auto">
            <table className="w-full min-w-xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left font-semibold text-foreground">{t("managedVsSelf.title")}</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Self-managed</th>
                  <th className="px-4 py-3 text-left font-semibold text-primary">Managed Database</th>
                </tr>
              </thead>
              <tbody>
                {t.raw("managedVsSelf.rows").map((row: string, index: number) => (
                  <tr key={row} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t(`managedVsSelf.self.${index}`)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t(`managedVsSelf.managed.${index}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* 13. Developers */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("developers.eyebrow")}
                title={t("developers.title")}
                description={t("developers.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {developerFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-slate-950 p-6 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-auto text-slate-400">api</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`curl -X POST https://api.zenthcloud.com/v1/databases \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"engine":"postgresql","name":"prod-db","region":"eu-west"}'`}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* 14. Open source */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("openSource.eyebrow")}
                title={t("openSource.title")}
                description={t("openSource.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                Open source engines. Managed infrastructure.
              </blockquote>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {openSourceBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.label} className="flex items-start gap-3 rounded-xl border border-border bg-muted p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{benefit.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 15. Pricing */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
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
        </Container>
      </section>

      {/* 16. Migration */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("migration.eyebrow")}
                title={t("migration.title")}
                description={t("migration.description")}
              />
              <div className="mt-8">
                <Button asChild>
                  <Link href="/contact">
                    {t("migration.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {migrationCases.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-muted p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  </div>
                );
              })}
              {t.raw("migration.services").map((service: string, index: number) => (
                <div key={service} className="flex items-center gap-3 rounded-xl border border-border bg-muted p-4">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{service}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 17. Use cases */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader eyebrow={t("useCases.eyebrow")} title={t("useCases.title")} />

          <div className="grid gap-4 sm:grid-cols-2">
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
        </Container>
      </section>

      {/* 18. Cross-selling */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
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
        </Container>
      </section>

      {/* 19. CTA final */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
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
        </Container>
      </section>
    </>
  );
}
