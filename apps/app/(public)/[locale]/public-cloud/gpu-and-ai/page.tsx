import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
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
  GitBranch,
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

export async function generateMetadata() {
  const t = await getTranslations("Public.gpuAi.meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

function SectionHeader({ eyebrow, title, description, centered = true }: SectionHeaderProps) {
  return (
    <div className={centered ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
      {description && (
        <p className="mt-4 text-muted-foreground leading-relaxed">{description}</p>
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

export default async function GpuAiPage() {
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
      <section
        aria-label={t("hero.badge")}
        className="relative flex flex-col overflow-hidden text-white min-h-112 md:min-h-112"
        style={{
          background: "linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #7c3aed 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.16),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.08),transparent_40%)]" />

        <PageContainer className="relative flex flex-1 items-center py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center w-full">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
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
                  <Link href="#ai-workloads">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-8 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-xl">
                      <Brain className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <Flame className="h-8 w-8 text-white/90" />
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <Layers className="h-8 w-8 text-white/90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 2. Why GPU */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("whyGpu.title")} description={t("whyGpu.description")} />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">CPU</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> General purpose</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Sequential workloads</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Broad flexibility</li>
              </ul>
            </div>
            <div className="rounded-xl border border-primary bg-primary/5 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">GPU</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Massive parallelism</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Matrix operations</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> AI workloads</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Accelerated computing</li>
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 3. GPU profiles */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("gpuProfiles.title")} description={t("gpuProfiles.description")} />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {gpuProfiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <div
                  key={profile.key}
                  className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{t(`gpuProfiles.${profile.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`gpuProfiles.${profile.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 4. GPU types */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("gpuTypes.title")} />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {gpuTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{t(`gpuTypes.${type.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`gpuTypes.${type.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 5. AI workloads */}
      <section id="ai-workloads" className="border-y border-border bg-muted py-16 md:py-24 scroll-mt-20">
        <PageContainer>
          <SectionHeader title={t("aiWorkloads.title")} />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {aiWorkloads.map((workload) => {
              const Icon = workload.icon;
              return (
                <div
                  key={workload.key}
                  className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
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
        </PageContainer>
      </section>

      {/* 6. Generative AI */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("genAi.title")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {genAiItems.map((item, index) => {
              const icons = [Brain, Box, Activity, Layers, Database, Eye];
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

          <div className="mt-10 rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <NetworkNode>Application</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>AI API</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>GPU Compute</NetworkNode>
              <NetworkLine vertical />
              <div className="grid w-full max-w-xs grid-cols-2 gap-3">
                <NetworkNode>Model</NetworkNode>
                <NetworkNode>Vector DB</NetworkNode>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 7. Training + Containers + Storage + Networking */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
                title={t("training.title")}
                description={t("training.description")}
              />
            </div>
            <div className="rounded-xl border border-border bg-background p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Dataset</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Storage</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>GPU Compute</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Training</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Model</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Inference</NetworkNode>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Container className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("containers.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("containers.description")}
              </p>
              <div className="mt-4">
                <Link href="/public-cloud/containers" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  {t("containers.cta")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <HardDrive className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("storage.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("storage.description")}
              </p>
              <div className="mt-4">
                <Link href="/public-cloud/storage" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  {t("storage.cta")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Network className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("networking.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("networking.description")}
              </p>
              <div className="mt-4">
                <Link href="/public-cloud/networking" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  {t("networking.cta")} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 8. AI inference */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("aiInference.title")} description={t("aiInference.description")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiInferenceItems.map((item, index) => {
              const icons = [Boxes, Boxes, Network, Server, Activity, Zap];
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

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("aiInference.note")}</p>

          <div className="mt-10 rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <NetworkNode>User Request</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>API Layer</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>GPU Inference</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>Model Output</NetworkNode>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 9. Developers + Preconfigured + Monitoring */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-3">
            <div>
              <SectionHeader centered={false} title={t("developers.title")} />
              <ul className="mt-6 space-y-2">
                {developerItems.map((item, index) => {
                  const icons = [Terminal, Container, Flame, Flame, Code2, Box, Code2, Terminal, Boxes];
                  const Icon = icons[index % icons.length];
                  return (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <SectionHeader centered={false} title={t("preconfigured.title")} />
              <ul className="mt-6 space-y-2">
                {preconfiguredItems.map((item, index) => {
                  const icons = [Code2, Brain, Flame, BarChart3];
                  const Icon = icons[index % icons.length];
                  return (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <SectionHeader centered={false} title={t("monitoring.title")} />
              <ul className="mt-6 space-y-2">
                {monitoringMetrics.map((item, index) => {
                  const icons = [Activity, Database, Flame, Zap, Cpu, Activity, Network, HardDrive];
                  const Icon = icons[index % icons.length];
                  return (
                    <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 10. Cost efficiency + Consumption models */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader centered={false} title={t("costEfficiency.title")} />
              <div className="mt-6 grid gap-3">
                {costEfficiencyItems.map((item, index) => {
                  const icons = [Code2, Brain, Flame, Server];
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
              <SectionHeader centered={false} title={t("consumptionModels.title")} />
              <div className="mt-6 space-y-4">
                {consumptionModels.map((model) => {
                  const Icon = model.icon;
                  return (
                    <div key={model.key} className="rounded-lg border border-border bg-muted p-4">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-bold text-foreground">{t(`consumptionModels.${model.key}.title`)}</h4>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{t(`consumptionModels.${model.key}.description`)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 11. Security */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("security.title")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {securityItems.map((item, index) => {
              const icons = [LayoutGrid, Network, Shield, Lock, Lock, ShieldCheck, Activity, LayoutGrid];
              const Icon = icons[index % icons.length];
              return (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("security.responsibility")}</p>
        </PageContainer>
      </section>

      {/* 12. Open source */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader centered={false} title={t("openSource.title")} description={t("openSource.description")} />
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
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 13. Managed AI Infrastructure */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("managed.title")} />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {managedLevels.map((level) => {
              const Icon = level.icon;
              const featureCount = t.raw(`managed.${level.key}.features`)?.length ?? 0;
              return (
                <div
                  key={level.key}
                  className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${level.bg} ${level.accent}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{t(`managed.${level.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`managed.${level.key}.description`)}
                  </p>
                  {featureCount > 0 && (
                    <ul className="mt-4 space-y-2">
                      {Array.from({ length: featureCount }, (_, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {t(`managed.${level.key}.features.${i}`)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 14. GPU + Kubernetes */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Kubernetes</NetworkNode>
                <NetworkLine vertical />
                <div className="grid w-full max-w-md grid-cols-3 gap-3">
                  <NetworkNode>CPU Pod</NetworkNode>
                  <NetworkNode>GPU Pod</NetworkNode>
                  <NetworkNode>GPU Pod</NetworkNode>
                </div>
                <NetworkLine vertical />
                <NetworkNode>Storage</NetworkNode>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader
                centered={false}
                title={t("kubernetes.title")}
                description={t("kubernetes.description")}
              />
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/containers">
                    {t("kubernetes.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 15. Pricing */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("pricing.title")} description={t("pricing.description")} />

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {t.raw("pricing.items").map((item: string) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
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

      {/* 16. Migration */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
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
        </PageContainer>
      </section>

      {/* 17. Use cases */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("useCases.title")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCaseIcons.map((Icon, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm"
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

      {/* 18. Cross-selling */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("crossSelling.title")} />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {crossSellItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all"
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

      {/* 19. CTA final */}
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
