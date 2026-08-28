import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
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
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container as PageContainer } from "@/components/public/Container";
import { DiagramPanel, FlowConnector, FlowHub, FlowNode } from "@/components/public/flow-diagram";

// Prefix internal links with the active locale, mirroring the Header/Footer convention.
function localizeHref(href: string, locale: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#")) return href;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

// Uniform button styling for CTA sections: white background, primary text, no state change on hover.
const WHITE_BUTTON_CLASSES = "bg-white text-primary hover:bg-white hover:text-primary font-semibold";

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

export default async function BackupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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

  const backupLinks = [
    { key: "databaseBackup", icon: Database, href: "/public-cloud/databases" },
    { key: "computeBackup", icon: Server, href: "/public-cloud/compute" },
    { key: "containersBackup", icon: Container, href: "/public-cloud/containers" },
    { key: "storageBackup", icon: HardDrive, href: "/public-cloud/storage" },
  ];

  const crossSellItems = [
    { key: "compute", icon: Server, href: "/public-cloud/compute" },
    { key: "storage", icon: HardDrive, href: "/public-cloud/storage" },
    { key: "databases", icon: Database, href: "/public-cloud/databases" },
    { key: "containers", icon: Container, href: "/public-cloud/containers" },
    { key: "networking", icon: Network, href: "/public-cloud/networking" },
    { key: "gpuAi", icon: Zap, href: "/public-cloud/gpu-and-ai" },
  ];

  const retentionSequence = ["Daily", "7 days", "30 days", "Long-term"];

  return (
    <>
      {/* 1. Hero */}
      <section aria-label={t("hero.title")} className="border-b border-border bg-background">
        <PageContainer className="flex flex-col items-center py-20 text-center md:py-28">
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
                {t("hero.primaryCta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#what-can-protect">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* 2. Ce que vous protégez */}
      <section id="what-can-protect" className="border-y border-border bg-muted py-16 md:py-24 scroll-mt-20">
        <PageContainer>
          <SectionHeader eyebrow={t("whatCanProtect.eyebrow")} title={t("whatCanProtect.title")} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {protectItems.map((item, index) => {
              const icons = [Server, Server, HardDrive, Database, Container, Cloud];
              const Icon = icons[index % icons.length];
              return (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">{t("useCases.title")} :</span>
            {useCaseIcons.map((Icon, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {t(`useCases.items.${index}`)}
              </span>
            ))}
          </div>

          <div className="mt-16 grid gap-5 border-t border-border pt-16 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("humanError.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("humanError.description")}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("infrastructureFailure.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("infrastructureFailure.description")}</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 3. Types de backup & architecture */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader eyebrow={t("backupTypes.eyebrow")} title={t("backupTypes.title")} />

          <div className="grid gap-5 md:grid-cols-3">
            {backupTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
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

          <div className="mt-16 border-t border-border pt-16">
            <div className="mx-auto max-w-2xl">
              <DiagramPanel label={`${t("backupTypes.title")} — ${t("whatCanProtect.title")}`}>
                <FlowNode icon={Server}>Production</FlowNode>
                <FlowConnector />
                <div className="grid grid-cols-3 gap-3">
                  <FlowNode variant="card" icon={Server}>Compute</FlowNode>
                  <FlowNode variant="card" icon={HardDrive}>Storage</FlowNode>
                  <FlowNode variant="card" icon={Database}>Database</FlowNode>
                </div>
                <FlowConnector />
                <FlowHub icon={Archive}>Backup</FlowHub>
                <FlowConnector />
                <FlowNode icon={Cloud}>Backup Storage</FlowNode>
              </DiagramPanel>
            </div>

            <div className="mt-10 rounded-xl border border-border bg-muted p-6 text-center shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("threeTwoOne.eyebrow")}</span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">{t("threeTwoOne.title")}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{t("threeTwoOne.description")}</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 4. Automatisation & rétention */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("automatedBackups.eyebrow")}
                title={t("automatedBackups.title")}
                description={t("automatedBackups.description")}
              />
              <div className="mt-6 grid gap-3">
                {automatedItems.map((item, index) => {
                  const icons = [Clock, Clock, History, Zap, RotateCcw];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("retention.eyebrow")}
                title={t("retention.title")}
                description={t("retention.description")}
              />
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {retentionSequence.map((label, index, steps) => (
                  <React.Fragment key={label}>
                    <FlowNode>{label}</FlowNode>
                    {index < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-16">
            <div className="mx-auto max-w-2xl">
              <DiagramPanel label={`${t("automatedBackups.title")} — ${t("automatedBackups.description")}`}>
                <FlowNode icon={Server}>Production</FlowNode>
                <FlowConnector />
                <FlowHub icon={Settings}>Backup Policy</FlowHub>
                <FlowConnector />
                <div className="grid grid-cols-3 gap-3">
                  <FlowNode variant="card" icon={Clock}>Schedule</FlowNode>
                  <FlowNode variant="card" icon={History}>Retention</FlowNode>
                  <FlowNode variant="card" icon={HardDrive}>Destination</FlowNode>
                </div>
                <FlowConnector />
                <FlowNode icon={Cloud}>Backup Storage</FlowNode>
              </DiagramPanel>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 5. Récupération */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
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
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("recoveryWorkflow.eyebrow")}
                title={t("recoveryWorkflow.title")}
                description={t("recoveryWorkflow.description")}
              />
              <DiagramPanel label={`${t("recoveryWorkflow.title")} — ${t("recoveryWorkflow.description")}`}>
                {workflowSteps.map((step, index) => (
                  <React.Fragment key={step}>
                    <FlowNode>{step}</FlowNode>
                    {index < workflowSteps.length - 1 && <FlowConnector />}
                  </React.Fragment>
                ))}
              </DiagramPanel>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 6. Sécurité, isolation & chiffrement */}
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
              <DiagramPanel label={`${t("isolation.title")} — ${t("isolation.description")}`}>
                <FlowNode icon={Server}>Production</FlowNode>
                <FlowConnector />
                <FlowNode icon={ShieldCheck}>Backup System</FlowNode>
                <FlowConnector />
                <FlowHub icon={Cloud}>Separate Backup Storage</FlowHub>
              </DiagramPanel>
            </div>
            <div>
              <SectionHeader align="left" eyebrow={t("security.eyebrow")} title={t("security.title")} />
              <div className="mt-6 space-y-2">
                {securityItems.map((item, index) => {
                  const icons = [Lock, Lock, Shield, LayoutGrid, Network, Eye, ShieldCheck];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
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

      {/* 7. Surveillance & alertes */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader align="left" eyebrow={t("monitoring.eyebrow")} title={t("monitoring.title")} />
              <div className="mt-6 space-y-2">
                {monitoringItems.map((item, index) => {
                  const icons = [Check, AlertTriangle, Clock, Boxes, HardDrive];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
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
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 8. Gestion & validation */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader eyebrow={t("managed.eyebrow")} title={t("managed.title")} />

          <div className="grid gap-5 md:grid-cols-3">
            {managedLevels.map((level) => {
              const Icon = level.icon;
              const featureCount = t.raw(`managed.${level.key}.features`).length;
              return (
                <div key={level.key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${level.bg} ${level.accent}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{t(`managed.${level.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`managed.${level.key}.description`)}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {Array.from({ length: featureCount }, (_, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {t(`managed.${level.key}.features.${i}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader
              eyebrow={t("backupTesting.eyebrow")}
              title={t("backupTesting.title")}
              description={t("backupTesting.description")}
            />

            <div className="mx-auto max-w-2xl">
              <DiagramPanel label={`${t("backupTesting.title")} — ${t("backupTesting.description")}`}>
                {testingSteps.map((step, index) => (
                  <React.Fragment key={step}>
                    <FlowNode>{step}</FlowNode>
                    {index < testingSteps.length - 1 && <FlowConnector />}
                  </React.Fragment>
                ))}
              </DiagramPanel>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 9. Reprise d'activité */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("disasterRecovery.eyebrow")}
                title={t("disasterRecovery.title")}
                description={t("disasterRecovery.description")}
              />
              <DiagramPanel label={`${t("disasterRecovery.title")} — ${t("disasterRecovery.description")}`}>
                <FlowNode icon={Server}>Primary Infrastructure</FlowNode>
                <FlowConnector />
                <FlowHub icon={Archive}>Backup</FlowHub>
                <FlowConnector />
                <FlowNode icon={RotateCcw}>Recovery Infrastructure</FlowNode>
              </DiagramPanel>
              <div className="mt-6 grid gap-2">
                {drItems.map((item, index) => {
                  const icons = [Archive, RotateCcw, Check];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
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

      {/* 10. Passer à l'action */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader eyebrow={t("ecosystem.eyebrow")} title={t("ecosystem.title")} />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {backupLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={localizeHref(item.href, locale)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{t(`${item.key}.title`)}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t(`${item.key}.description`)}
                  </p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {t(`${item.key}.cta`)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 border-t border-border pt-16">
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
              <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
                <Link href={localizeHref("/pricing", locale)}>
                  {t("pricing.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader eyebrow={t("crossSelling.eyebrow")} title={t("crossSelling.title")} />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {crossSellItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={localizeHref(item.href, locale)}
                    className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">
                        {t(`crossSelling.${item.key}.label`)}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {t(`crossSelling.${item.key}.description`)}
                    </p>
                    <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      {t(`crossSelling.${item.key}.cta`)} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-16 rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold">{t("finalCta.title")}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-primary-foreground/80">
              {t("finalCta.description")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
                <Link href="https://manager.zenthcloud.com" target="_blank" rel="noreferrer">
                  {t("finalCta.primary")}
                </Link>
              </Button>
              <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
                <Link href={localizeHref("/contact", locale)}>
                  {t("finalCta.secondary")}
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
