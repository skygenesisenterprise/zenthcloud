import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Box,
  Boxes,
  Brain,
  Check,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  Eye,
  Flame,
  Globe,
  HardDrive,
  Layers,
  LayoutGrid,
  Lock,
  Network,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
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
  const t = await getTranslations("Public.gpuAi.meta");

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

export default async function GpuAiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Public.gpuAi");

  const gpuProfiles = [
    { key: "entry", icon: Zap },
    { key: "performance", icon: Flame },
    { key: "enterprise", icon: Server },
  ];

  const gpuTypes = [
    { key: "shared", icon: Boxes },
    { key: "dedicated", icon: Server },
    { key: "server", icon: Server },
  ];

  const aiWorkloads = [
    { key: "inference", icon: Brain },
    { key: "fineTuning", icon: Activity },
    { key: "training", icon: Flame },
    { key: "embeddings", icon: Database },
    { key: "agents", icon: Boxes },
  ];

  const genAiItems = t.raw("genAi.items") as string[];

  const aiInferenceItems = t.raw("aiInference.items") as string[];

  const developerItems = t.raw("developers.items") as string[];

  const preconfiguredItems = t.raw("preconfigured.items") as string[];

  const monitoringMetrics = t.raw("monitoring.metrics") as string[];

  const costEfficiencyItems = t.raw("costEfficiency.items") as string[];

  const consumptionModels = [
    { key: "onDemand", icon: Zap },
    { key: "dedicated", icon: Server },
    { key: "reserved", icon: Lock },
  ];

  const securityItems = t.raw("security.items") as string[];

  const openSourceBenefits = t.raw("openSource.benefits") as string[];

  const managedLevels = [
    { key: "infrastructureOnly", icon: Server, accent: "text-primary", bg: "bg-primary/10" },
    { key: "assisted", icon: Code2, accent: "text-chart-4", bg: "bg-chart-4/10" },
    { key: "managedAi", icon: ShieldCheck, accent: "text-chart-5", bg: "bg-chart-5/10" },
  ];

  const useCaseIcons = [
    Brain,
    BarChart3,
    Sparkles,
    Box,
    Globe,
    Database,
    Code2,
    Eye,
  ];

  const ecosystemLinks = [
    { key: "containers", icon: Container, href: "/public-cloud/containers" },
    { key: "storage", icon: HardDrive, href: "/public-cloud/storage" },
    { key: "networking", icon: Network, href: "/public-cloud/networking" },
  ];

  const crossSellItems = [
    { key: "compute", icon: Cpu, href: "/public-cloud/compute" },
    { key: "storage", icon: HardDrive, href: "/public-cloud/storage" },
    { key: "networking", icon: Network, href: "/public-cloud/networking" },
    { key: "containers", icon: Container, href: "/public-cloud/containers" },
    { key: "kubernetes", icon: Boxes, href: "/public-cloud/containers" },
    { key: "databases", icon: Database, href: "/public-cloud/databases" },
    { key: "backup", icon: ShieldCheck, href: "/public-cloud/backup" },
  ];

  const migrationCases = [
    { label: t("migration.cases.0"), icon: Server },
    { label: t("migration.cases.1"), icon: Server },
    { label: t("migration.cases.2"), icon: Cloud },
    { label: t("migration.cases.3"), icon: Box },
  ];

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
              <Link href="#ai-workloads">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* 2. Pourquoi le GPU */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader
            eyebrow={t("whyGpu.eyebrow")}
            title={t("whyGpu.title")}
            description={t("whyGpu.description")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Cpu className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-foreground">CPU</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" /> General purpose
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" /> Sequential workloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" /> Broad flexibility
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-primary bg-primary/5 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-foreground">GPU</h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" /> Massive parallelism
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" /> Matrix operations
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" /> AI workloads
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" /> Accelerated computing
                </li>
              </ul>
            </div>
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
        </PageContainer>
      </section>

      {/* 3. Profils & types de GPU */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader
            eyebrow={t("gpuProfiles.eyebrow")}
            title={t("gpuProfiles.title")}
            description={t("gpuProfiles.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {gpuProfiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <div key={profile.key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{t(`gpuProfiles.${profile.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`gpuProfiles.${profile.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader eyebrow={t("gpuTypes.eyebrow")} title={t("gpuTypes.title")} />

            <div className="grid gap-5 md:grid-cols-3">
              {gpuTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-foreground">{t(`gpuTypes.${type.key}.title`)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t(`gpuTypes.${type.key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 4. AI workloads & IA générative */}
      <section id="ai-workloads" className="border-y border-border bg-muted py-16 md:py-24 scroll-mt-20">
        <PageContainer>
          <SectionHeader eyebrow={t("aiWorkloads.eyebrow")} title={t("aiWorkloads.title")} />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {aiWorkloads.map((workload) => {
              const Icon = workload.icon;
              return (
                <div key={workload.key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {t(`aiWorkloads.${workload.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`aiWorkloads.${workload.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">{t("genAi.eyebrow")} :</span>
            {genAiItems.map((item, index) => {
              const icons = [Brain, Box, Activity, Layers, Database, Eye];
              const Icon = icons[index % icons.length];
              return (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {item}
                </span>
              );
            })}
          </div>

          <div className="mt-10 mx-auto max-w-2xl">
            <DiagramPanel label={`${t("genAi.title")} — ${t("genAi.eyebrow")}`}>
              <FlowNode icon={Code2}>Application</FlowNode>
              <FlowConnector />
              <FlowNode icon={Sparkles}>AI API</FlowNode>
              <FlowConnector />
              <FlowHub icon={Zap}>GPU Compute</FlowHub>
              <FlowConnector />
              <div className="grid grid-cols-2 gap-3">
                <FlowNode variant="card" icon={Brain}>Model</FlowNode>
                <FlowNode variant="card" icon={Database}>Vector DB</FlowNode>
              </div>
            </DiagramPanel>
          </div>
        </PageContainer>
      </section>

      {/* 5. Training & inférence */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("training.eyebrow")}
                title={t("training.title")}
                description={t("training.description")}
              />
              <DiagramPanel label={`${t("training.title")} — ${t("training.description")}`}>
                <FlowNode icon={Database}>Dataset</FlowNode>
                <FlowConnector />
                <FlowNode icon={HardDrive}>Storage</FlowNode>
                <FlowConnector />
                <FlowHub icon={Zap}>GPU Compute</FlowHub>
                <FlowConnector />
                <FlowNode icon={Flame}>Training</FlowNode>
                <FlowConnector />
                <FlowNode icon={Brain}>Model</FlowNode>
                <FlowConnector />
                <FlowNode icon={Sparkles}>Inference</FlowNode>
              </DiagramPanel>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("aiInference.eyebrow")}
                title={t("aiInference.title")}
                description={t("aiInference.description")}
              />
              <DiagramPanel label={`${t("aiInference.title")} — ${t("aiInference.description")}`}>
                <FlowNode icon={Code2}>User Request</FlowNode>
                <FlowConnector />
                <FlowNode icon={Layers}>API Layer</FlowNode>
                <FlowConnector />
                <FlowHub icon={Zap}>GPU Inference</FlowHub>
                <FlowConnector />
                <FlowNode icon={Box}>Model Output</FlowNode>
              </DiagramPanel>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiInferenceItems.map((item, index) => {
              const icons = [Boxes, Boxes, Network, Server, Activity, Zap];
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

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("aiInference.note")}</p>
        </PageContainer>
      </section>

      {/* 6. Écosystème */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader eyebrow={t("ecosystem.eyebrow")} title={t("ecosystem.title")} />

          <div className="grid gap-5 md:grid-cols-3">
            {ecosystemLinks.map((item) => {
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

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2 lg:items-center">
            <DiagramPanel label={`${t("kubernetes.title")} — ${t("kubernetes.description")}`}>
              <FlowNode icon={Boxes}>Kubernetes</FlowNode>
              <FlowConnector />
              <div className="grid grid-cols-3 gap-3">
                <FlowNode variant="card" icon={Cpu}>CPU Pod</FlowNode>
                <FlowNode variant="card" icon={Zap}>GPU Pod</FlowNode>
                <FlowNode variant="card" icon={Zap}>GPU Pod</FlowNode>
              </div>
              <FlowConnector />
              <FlowHub icon={HardDrive}>Storage</FlowHub>
            </DiagramPanel>
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("kubernetes.eyebrow")}
                title={t("kubernetes.title")}
                description={t("kubernetes.description")}
              />
              <div className="mt-8">
                <Button asChild className={WHITE_BUTTON_CLASSES}>
                  <Link href={localizeHref("/public-cloud/containers", locale)}>
                    {t("kubernetes.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 7. Développeurs & open source */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-3">
            <div>
              <SectionHeader align="left" eyebrow={t("developers.eyebrow")} title={t("developers.title")} />
              <ul className="mt-6 space-y-2">
                {developerItems.map((item, index) => {
                  const icons = [Terminal, Container, Flame, Flame, Code2, Box, Code2, Terminal, Boxes];
                  const Icon = icons[index % icons.length];
                  return (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <SectionHeader align="left" eyebrow={t("preconfigured.eyebrow")} title={t("preconfigured.title")} />
              <ul className="mt-6 space-y-2">
                {preconfiguredItems.map((item, index) => {
                  const icons = [Code2, Brain, Flame, BarChart3];
                  const Icon = icons[index % icons.length];
                  return (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <SectionHeader align="left" eyebrow={t("monitoring.eyebrow")} title={t("monitoring.title")} />
              <ul className="mt-6 space-y-2">
                {monitoringMetrics.map((item, index) => {
                  const icons = [Activity, Database, Flame, Zap, Cpu, Activity, Network, HardDrive];
                  const Icon = icons[index % icons.length];
                  return (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("openSource.eyebrow")}
                title={t("openSource.title")}
                description={t("openSource.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                Zenth Cloud provides the infrastructure. You choose what runs on it.
              </blockquote>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {openSourceBenefits.map((item, index) => {
                const icons = [Brain, Code2, Container, Box, Server, Code2];
                const Icon = icons[index % icons.length];
                return (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-muted p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 8. Coûts & tarifs */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader align="left" eyebrow={t("costEfficiency.eyebrow")} title={t("costEfficiency.title")} />
              <div className="mt-6 grid gap-3">
                {costEfficiencyItems.map((item, index) => {
                  const icons = [Code2, Brain, Flame, Server];
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
              <SectionHeader align="left" eyebrow={t("consumptionModels.eyebrow")} title={t("consumptionModels.title")} />
              <div className="mt-6 space-y-4">
                {consumptionModels.map((model) => {
                  const Icon = model.icon;
                  return (
                    <div key={model.key} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        <h4 className="text-sm font-bold text-foreground">{t(`consumptionModels.${model.key}.title`)}</h4>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{t(`consumptionModels.${model.key}.description`)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
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
        </PageContainer>
      </section>

      {/* 9. Sécurité & gestion */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader eyebrow={t("security.eyebrow")} title={t("security.title")} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {securityItems.map((item, index) => {
              const icons = [LayoutGrid, Network, Shield, Lock, Lock, ShieldCheck, Activity, LayoutGrid];
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

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("security.responsibility")}</p>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader eyebrow={t("managed.eyebrow")} title={t("managed.title")} />

            <div className="grid gap-5 md:grid-cols-3">
              {managedLevels.map((level) => {
                const Icon = level.icon;
                const featureCount = t.raw(`managed.${level.key}.features`)?.length ?? 0;
                return (
                  <div key={level.key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${level.bg} ${level.accent}`}>
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-foreground">{t(`managed.${level.key}.title`)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t(`managed.${level.key}.description`)}
                    </p>
                    {featureCount > 0 && (
                      <ul className="mt-4 space-y-2">
                        {Array.from({ length: featureCount }, (_, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                            {t(`managed.${level.key}.features.${i}`)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 10. Passer à l'action */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("migration.eyebrow")}
                title={t("migration.title")}
                description={t("migration.description")}
              />
              <div className="mt-8">
                <Button asChild className={WHITE_BUTTON_CLASSES}>
                  <Link href={localizeHref("/contact", locale)}>
                    {t("migration.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {migrationCases.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  </div>
                );
              })}
              {t.raw("migration.services").map((service: string, index: number) => (
                <div key={service} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{service}</p>
                </div>
              ))}
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
