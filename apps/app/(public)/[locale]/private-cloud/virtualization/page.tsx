import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  Cloud,
  Cpu,
  FileText,
  Gauge,
  GitBranch,
  HardDrive,
  KeyRound,
  Layers,
  MemoryStick,
  Network,
  RefreshCcw,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";
import { VirtualizationLayerExplorer } from "@/components/public/VirtualizationLayerExplorer";

export async function generateMetadata() {
  const t = await getTranslations("Public.virtualization.meta");

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

interface DiagramNodeProps {
  children: React.ReactNode;
  className?: string;
}

function DiagramNode({ children, className = "" }: DiagramNodeProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-muted px-4 py-3 text-center text-sm font-semibold text-foreground shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function DiagramDivider({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      className={`bg-border ${vertical ? "h-6 w-px mx-auto" : "h-px w-8"}`}
      aria-hidden="true"
    />
  );
}

interface ExplorerLayer {
  key: string;
  label: string;
  role: string;
  resources: string;
  responsibilities: string;
  dependencies: string;
}

interface ComparisonRow {
  label: string;
  public: string;
  private: string;
}

interface TradeoffItem {
  title: string;
  description: string;
}

export default async function VirtualizationPage() {
  const t = await getTranslations("Public.virtualization");

  const explorerLayers = t.raw("explorer.layers") as ExplorerLayer[];

  const vmComponents = t.raw("vms.components") as Array<{ label: string; description: string }>;

  const abstractionRows = t.raw("abstraction.rows") as Array<{ physical: string; virtual: string }>;

  const clusterObjectives = t.raw("clusters.objectives") as Array<{ title: string; description: string }>;

  const hypervisorItems = t.raw("hypervisor.items") as Array<{ title: string; description: string }>;

  const computeTradeoffs = t.raw("compute.tradeoffs") as TradeoffItem[];

  const memoryConcepts = t.raw("memory.concepts") as TradeoffItem[];

  const storageFeatures = t.raw("storage.features") as Array<{ title: string; description: string }>;

  const networkFeatures = t.raw("network.features") as Array<{ title: string; description: string }>;

  const securityItems = t.raw("security.items") as string[];

  const migrationBenefits = t.raw("migration.benefits") as string[];

  const schedulingCriteria = t.raw("scheduling.criteria") as string[];

  const comparisonRows = t.raw("comparison.rows") as ComparisonRow[];

  const vsBareMetalRows = t.raw("vsBareMetal.rows") as Array<{
    label: string;
    virtualization: string;
    bareMetal: string;
  }>;

  const whenUseItems = t.raw("whenUse.virtualization.items") as string[];
  const whenBareMetalItems = t.raw("whenUse.bareMetal.items") as string[];

  const licenseModels = t.raw("licensing.models") as Array<{ title: string; description: string }>;

  const imageCatalog = t.raw("images.catalog") as string[];

  const templateUseCases = t.raw("templates.useCases") as string[];

  const monitoringMetrics = t.raw("monitoring.metrics") as string[];

  const operationsSteps = t.raw("operations.steps") as string[];
  const lifecycleSteps = t.raw("operations.lifecycle") as string[];

  const efficiencyBenefits = t.raw("efficiency.benefits") as string[];

  const performanceTradeoffs = t.raw("performance.tradeoffs") as string[];

  const stackLayers = t.raw("stack.layers") as Array<{ title: string; description: string }>;

  const customerItems = t.raw("control.customer.items") as string[];
  const zenthItems = t.raw("control.zenth.items") as string[];

  const dedicatedSteps = t.raw("dedicated.steps") as string[];

  const cloudSteps = t.raw("cloudExperience.steps") as string[];

  const devSteps = t.raw("developerTools.steps") as string[];

  const futureItems = t.raw("future.items") as string[];

  const relatedLinks = t.raw("related.links") as Array<{ label: string; href: string }>;

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

        <Container className="relative flex flex-1 items-center py-16 md:py-24">
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
                  <Link href="/private-cloud/dedicated-cloud">
                    {t("hero.primaryCta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/contact">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-sm font-semibold text-white">
                    <div className="rounded-lg bg-white/15 border border-white/20 px-5 py-2.5">
                      <Server className="mr-2 inline h-4 w-4" />
                      {t("hero.visualServer")}
                    </div>
                    <ArrowDown className="h-5 w-5 text-white/70" aria-hidden="true" />
                    <div className="rounded-lg bg-white/20 border border-white/25 px-5 py-2.5">
                      <Layers className="mr-2 inline h-4 w-4" />
                      {t("hero.visualHypervisor")}
                    </div>
                    <ArrowDown className="h-5 w-5 text-white/70" aria-hidden="true" />
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="flex h-14 w-20 flex-col items-center justify-center gap-1 rounded-lg bg-white/10 border border-white/15"
                        >
                          <Cpu className="h-5 w-5 text-white/90" />
                          <span className="text-xs">{t("hero.visualVm")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. From hardware to cloud */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("pipeline.eyebrow")}
            title={t("pipeline.title")}
            description={t("pipeline.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                {t("pipeline.physical")}
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div className="rounded-lg bg-primary/10 px-6 py-3 text-center text-sm font-bold text-primary">
                {t("pipeline.hypervisor")}
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <DiagramNode>{t("pipeline.pools")}</DiagramNode>
              <DiagramDivider vertical />
              <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-muted p-3 text-center">
                  <Cpu className="mx-auto h-4 w-4 text-primary" />
                  <span className="mt-1.5 block text-xs">{t("pipeline.compute")}</span>
                </div>
                <div className="rounded-lg border border-border bg-muted p-3 text-center">
                  <MemoryStick className="mx-auto h-4 w-4 text-primary" />
                  <span className="mt-1.5 block text-xs">{t("pipeline.memory")}</span>
                </div>
                <div className="rounded-lg border border-border bg-muted p-3 text-center">
                  <HardDrive className="mx-auto h-4 w-4 text-primary" />
                  <span className="mt-1.5 block text-xs">{t("pipeline.storage")}</span>
                </div>
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                {t("pipeline.vms")}
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <DiagramNode className="w-full max-w-sm">{t("pipeline.workloads")}</DiagramNode>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("pipeline.note")}</p>
        </Container>
      </section>

      {/* 3. Interactive layer explorer */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("explorer.eyebrow")}
            title={t("explorer.title")}
            description={t("explorer.description")}
          />
          <VirtualizationLayerExplorer
            layers={explorerLayers}
            copy={{
              role: t("explorer.copy.role"),
              resources: t("explorer.copy.resources"),
              responsibilities: t("explorer.copy.responsibilities"),
              dependencies: t("explorer.copy.dependencies"),
            }}
          />
        </Container>
      </section>

      {/* 4. What is virtualization */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("whatIs.eyebrow")}
                title={t("whatIs.title")}
                description={t("whatIs.description")}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("whatIs.intro")}
              </p>
              <ul className="mt-6 space-y-3">
                {(t.raw("whatIs.points") as string[]).map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <DiagramNode className="w-full max-w-sm">{t("whatIs.server")}</DiagramNode>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  {t("whatIs.hypervisor")}
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <DiagramNode key={i} className="text-xs">{t(`whatIs.vm${i + 1}`)}</DiagramNode>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {vmComponents.map((component) => (
                  <div key={component.label} className="rounded-lg border border-border bg-muted p-3 text-center">
                    <p className="text-xs font-bold text-foreground">{component.label}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{component.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Hypervisor */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("hypervisor.eyebrow")}
                title={t("hypervisor.title")}
                description={t("hypervisor.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {hypervisorItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <Settings className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <DiagramNode className="w-full max-w-sm">{t("hypervisor.hardware")}</DiagramNode>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  {t("hypervisor.name")}
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="grid w-full max-w-sm grid-cols-4 gap-3">
                  {[0, 1, 2].map((i) => (
                    <DiagramNode key={i} className="text-xs">{t("hypervisor.vm")}</DiagramNode>
                  ))}
                  <DiagramNode className="text-xs border-dashed">{t("hypervisor.management")}</DiagramNode>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Resource abstraction */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("abstraction.eyebrow")}
                title={t("abstraction.title")}
                description={t("abstraction.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                {t("abstraction.message")}
              </blockquote>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <ul className="space-y-3">
                {abstractionRows.map((row, index) => {
                  const icons = [Cpu, MemoryStick, HardDrive, Network, Server];
                  const Icon = icons[index] ?? Layers;
                  return (
                    <li
                      key={row.physical}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3"
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{row.physical}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-sm font-medium text-muted-foreground">{row.virtual}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Resource pools */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("pools.eyebrow")}
                title={t("pools.title")}
                description={t("pools.description")}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">{t("pools.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <DiagramNode key={i} className="text-xs">{t("pools.host")}</DiagramNode>
                  ))}
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  {t("pools.pool")}
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <DiagramNode key={i} className="text-xs">{t("pools.vm")}</DiagramNode>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Clusters */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("clusters.eyebrow")}
                title={t("clusters.title")}
                description={t("clusters.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {clusterObjectives.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  {t("clusters.cluster")}
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <DiagramNode key={i} className="text-xs">{t(`clusters.host${i + 1}`)}</DiagramNode>
                  ))}
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-lg border border-dashed border-border bg-muted/50 p-2 text-center text-[11px] text-muted-foreground">
                      {t("clusters.vms")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Virtual machines */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("vms.eyebrow")}
            title={t("vms.title")}
            description={t("vms.description")}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {vmComponents.map((component) => (
                <div key={component.label} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm font-bold text-foreground">{component.label}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{component.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-primary/30 bg-card p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">{t("vms.exampleLabel")}</p>
              <div className="mt-4 space-y-3">
                {(t.raw("vms.example") as Array<{ resource: string; value: string }>).map((row) => (
                  <div
                    key={row.resource}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3"
                  >
                    <span className="text-sm font-medium text-muted-foreground">{row.resource}</span>
                    <span className="text-sm font-bold text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("vms.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. VM lifecycle */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("lifecycle.eyebrow")}
            title={t("lifecycle.title")}
            description={t("lifecycle.description")}
          />

          <div className="flex flex-col items-center gap-4">
            {(t.raw("lifecycle.steps") as string[]).map((step, index, steps) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground shadow-sm">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                    {index + 1}
                  </span>
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("lifecycle.note")}</p>
        </Container>
      </section>

      {/* 11. Isolation */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("isolation.eyebrow")}
                title={t("isolation.title")}
                description={t("isolation.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-base font-medium text-foreground leading-relaxed">
                {t("isolation.message")}
              </blockquote>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                {(t.raw("isolation.layers") as string[]).map((layer, index, layers) => (
                  <React.Fragment key={layer}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-3 text-center ${
                        index === layers.length - 1
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted"
                      }`}
                    >
                      {layer}
                    </div>
                    {index < layers.length - 1 && <DiagramDivider vertical />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 12. CPU + Memory virtualization */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Cpu className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("compute.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("compute.description")}</p>
              <div className="mt-5 flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                <DiagramNode className="w-full max-w-xs">{t("compute.physical")}</DiagramNode>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <DiagramNode className="w-full max-w-xs">{t("compute.scheduler")}</DiagramNode>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div className="rounded-lg bg-primary/10 px-4 py-2 text-center text-sm font-bold text-primary">
                  {t("compute.vcpu")}
                </div>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <DiagramNode className="w-full max-w-xs">{t("compute.vm")}</DiagramNode>
              </div>
              <div className="mt-6 space-y-3">
                {computeTradeoffs.map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-muted px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <MemoryStick className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("memory.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("memory.description")}</p>
              <div className="mt-5 flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                <DiagramNode className="w-full max-w-xs">{t("memory.physical")}</DiagramNode>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <DiagramNode className="w-full max-w-xs">{t("memory.management")}</DiagramNode>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div className="rounded-lg bg-primary/10 px-4 py-2 text-center text-sm font-bold text-primary">
                  {t("memory.virtual")}
                </div>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <DiagramNode className="w-full max-w-xs">{t("memory.vm")}</DiagramNode>
              </div>
              <div className="mt-6 space-y-3">
                {memoryConcepts.map((item) => (
                  <div key={item.title} className="rounded-lg border border-border bg-muted px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 13. Storage virtualization */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("storage.eyebrow")}
                title={t("storage.title")}
                description={t("storage.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {storageFeatures.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <HardDrive className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/storage">
                    {t("storage.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <DiagramNode className="w-full max-w-sm">{t("storage.physical")}</DiagramNode>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="rounded-lg bg-primary/10 px-6 py-3 text-center text-sm font-bold text-primary">
                  {t("storage.layer")}
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <DiagramNode className="w-full max-w-sm">{t("storage.disk")}</DiagramNode>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <DiagramNode className="w-full max-w-sm">{t("storage.vm")}</DiagramNode>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 14. Network virtualization + virtual switching */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("network.eyebrow")}
                title={t("network.title")}
                description={t("network.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {networkFeatures.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <Network className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/company/network">
                    {t("network.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-primary">
                  {t("switching.title")}
                </p>
                <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                  <DiagramNode className="w-full max-w-sm">{t("switching.physical")}</DiagramNode>
                  <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <DiagramNode className="w-full max-w-sm">{t("switching.nic")}</DiagramNode>
                  <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                    {t("switching.switch")}
                  </div>
                  <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                    {[0, 1, 2].map((i) => (
                      <DiagramNode key={i} className="text-xs">{t(`switching.vm${i + 1}`)}</DiagramNode>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">{t("switching.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 15. Security */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("security.eyebrow")}
                title={t("security.title")}
                description={t("security.description")}
              />
              <div className="mt-8 flex flex-wrap gap-2">
                {securityItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{t("security.message")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                {(t.raw("security.layers") as string[]).map((layer, index, layers) => (
                  <React.Fragment key={layer}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-3 text-center ${
                        index === layers.length - 1
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted"
                      }`}
                    >
                      {layer}
                    </div>
                    {index < layers.length - 1 && <DiagramDivider vertical />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 16. High availability + Live migration */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("resilience.eyebrow")}
            title={t("resilience.title")}
            description={t("resilience.description")}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Shield className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("ha.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("ha.description")}</p>
              <div className="mt-5 flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                <DiagramNode className="w-full max-w-xs">{t("ha.vm")}</DiagramNode>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <DiagramNode className="w-full max-w-xs border-red-300">{t("ha.failure")}</DiagramNode>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <div className="rounded-lg bg-primary/10 px-4 py-2 text-center text-sm font-bold text-primary">
                  {t("ha.recovery")}
                </div>
                <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <DiagramNode className="w-full max-w-xs">{t("ha.available")}</DiagramNode>
              </div>
              <p className="mt-5 text-xs text-muted-foreground leading-relaxed">{t("ha.note")}</p>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-muted/50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <RefreshCcw className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("migration.title")}</h3>
                <span className="ml-auto inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {t("migration.status")}
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("migration.description")}</p>
              <div className="mt-5 flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                <DiagramNode className="w-full max-w-xs">{t("migration.hostA")}</DiagramNode>
                <div className="flex items-center gap-2 text-primary">
                  <span className="text-xs font-bold uppercase tracking-wide">{t("migration.moving")}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </div>
                <DiagramNode className="w-full max-w-xs">{t("migration.hostB")}</DiagramNode>
              </div>
              <ul className="mt-5 space-y-2">
                {migrationBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("migration.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 17. Resource scheduling */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("scheduling.eyebrow")}
                title={t("scheduling.title")}
                description={t("scheduling.description")}
              />
              <div className="mt-8 flex flex-wrap gap-2">
                {schedulingCriteria.map((criteria) => (
                  <span
                    key={criteria}
                    className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                  >
                    {criteria}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                {(t.raw("scheduling.steps") as string[]).map((step, index, steps) => (
                  <React.Fragment key={step}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-3 text-center ${
                        index === steps.length - 1
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted"
                      }`}
                    >
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 18. Automation + Self-service */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("automation.eyebrow")}
                title={t("automation.title")}
                description={t("automation.description")}
              />
              <div className="mt-8">
                <Button asChild>
                  <Link href="/public-cloud/compute">
                    {t("automation.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-primary">
                  {t("automation.flowLabel")}
                </p>
                <div className="flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                  {(t.raw("automation.steps") as string[]).map((step, index, steps) => (
                    <React.Fragment key={step}>
                      <div className="w-full max-w-sm rounded-lg border border-border bg-muted px-4 py-2.5 text-center">
                        {step}
                      </div>
                      {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-primary">
                  {t("selfService.title")}
                </p>
                <div className="flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                  {(t.raw("selfService.steps") as string[]).map((step, index, steps) => (
                    <React.Fragment key={step}>
                      <div
                        className={`w-full max-w-sm rounded-lg px-4 py-2.5 text-center ${
                          index === steps.length - 1
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-muted"
                        }`}
                      >
                        {step}
                      </div>
                      {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 19. Public Cloud vs Private Cloud */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("comparison.eyebrow")}
            title={t("comparison.title")}
            description={t("comparison.description")}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left font-semibold text-foreground" />
                  <th className="px-4 py-3 text-left font-semibold text-foreground">{t("comparison.publicLabel")}</th>
                  <th className="px-4 py-3 text-left font-semibold text-primary">{t("comparison.privateLabel")}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.public}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{row.private}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("comparison.note")}</p>
        </Container>
      </section>

      {/* 20. Virtualization vs Bare Metal */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("vsBareMetal.eyebrow")}
            title={t("vsBareMetal.title")}
            description={t("vsBareMetal.description")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="mb-4 text-center text-sm font-bold text-foreground">{t("vsBareMetal.virtualizationLabel")}</p>
              <div className="flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                {t.raw("vsBareMetal.virtualizationSteps").map((step: string, index: number, steps: string[]) => (
                  <React.Fragment key={step}>
                    <div className="w-full max-w-xs rounded-lg border border-border bg-muted px-4 py-2.5 text-center">
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="mb-4 text-center text-sm font-bold text-foreground">{t("vsBareMetal.bareMetalLabel")}</p>
              <div className="flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                {t.raw("vsBareMetal.bareMetalSteps").map((step: string, index: number, steps: string[]) => (
                  <React.Fragment key={step}>
                    <div className="w-full max-w-xs rounded-lg border border-border bg-muted px-4 py-2.5 text-center">
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left font-semibold text-foreground" />
                  <th className="px-4 py-3 text-left font-semibold text-primary">{t("vsBareMetal.virtualizationLabel")}</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">{t("vsBareMetal.bareMetalLabel")}</th>
                </tr>
              </thead>
              <tbody>
                {vsBareMetalRows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.virtualization}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.bareMetal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("vsBareMetal.note")}</p>
        </Container>
      </section>

      {/* 21. When to use */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("whenUse.eyebrow")}
            title={t("whenUse.title")}
            description={t("whenUse.description")}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Boxes className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("whenUse.virtualization.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("whenUse.virtualization.description")}
              </p>
              <ul className="mt-4 space-y-2">
                {whenUseItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Server className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("whenUse.bareMetal.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("whenUse.bareMetal.description")}
              </p>
              <ul className="mt-4 space-y-2">
                {whenBareMetalItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button asChild variant="outline" size="sm">
                  <Link href="/private-cloud/dedicated-cloud">
                    {t("whenUse.cta")} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 22. Licensing */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("licensing.eyebrow")}
            title={t("licensing.title")}
            description={t("licensing.description")}
          />

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                {(t.raw("licensing.layers") as string[]).map((layer, index, layers) => (
                  <React.Fragment key={layer}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-3 text-center ${
                        index === layers.length - 1
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted"
                      }`}
                    >
                      {layer}
                    </div>
                    {index < layers.length - 1 && <DiagramDivider vertical />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {licenseModels.map((model, index) => {
                  const icons = [Settings, KeyRound, Check, FileText];
                  const Icon = icons[index] ?? Settings;
                  return (
                    <div key={model.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="mt-3 text-base font-bold text-foreground">{model.title}</h3>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{model.description}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{t("licensing.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 23. OS images + Templates */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("images.eyebrow")}
                title={t("images.title")}
                description={t("images.description")}
              />
              <div className="mt-6 flex flex-col items-center gap-3">
                {(t.raw("images.steps") as string[]).map((step, index, steps) => (
                  <React.Fragment key={step}>
                    <div className="w-full max-w-sm rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-semibold text-foreground shadow-sm">
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {imageCatalog.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-xs text-muted-foreground leading-relaxed">{t("images.note")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("templates.eyebrow")}
                title={t("templates.title")}
                description={t("templates.description")}
              />
              <div className="mt-6 flex flex-col items-center gap-3">
                {(t.raw("templates.steps") as string[]).map((step, index, steps) => (
                  <React.Fragment key={step}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                        index === steps.length - 1
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-card text-foreground shadow-sm"
                      }`}
                    >
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {templateUseCases.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <GitBranch className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 24. Snapshots */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("snapshots.eyebrow")}
                title={t("snapshots.title")}
                description={t("snapshots.description")}
              />
              <div className="mt-6 flex flex-col items-center gap-3">
                <DiagramNode className="w-full max-w-sm">{t("snapshots.vm")}</DiagramNode>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  {t("snapshots.snapshot")}
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                  <DiagramNode className="text-xs">{t("snapshots.state")}</DiagramNode>
                  <DiagramNode className="text-xs">{t("snapshots.clone")}</DiagramNode>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Timer className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-foreground">{t("snapshots.snapshotTitle")}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("snapshots.snapshotDescription")}</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Archive className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-bold text-foreground">{t("snapshots.backupTitle")}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("snapshots.backupDescription")}</p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("snapshots.note")}</p>
              <Button asChild variant="outline">
                <Link href="/public-cloud/backup">
                  {t("snapshots.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 25. Monitoring + Operations */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("monitoring.eyebrow")}
                title={t("monitoring.title")}
                description={t("monitoring.description")}
              />
              <div className="mt-6 flex flex-col items-center gap-2">
                {(t.raw("monitoring.steps") as string[]).map((step, index, steps) => (
                  <React.Fragment key={step}>
                    <div className="w-full max-w-sm rounded-lg border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-foreground shadow-sm">
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {monitoringMetrics.map((metric) => (
                  <span
                    key={metric}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                  >
                    <Activity className="h-3.5 w-3.5 text-primary" />
                    {metric}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("operations.eyebrow")}
                title={t("operations.title")}
                description={t("operations.description")}
              />
              <div className="mt-6 flex flex-col items-center gap-2">
                {operationsSteps.map((step, index, steps) => (
                  <React.Fragment key={step}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                        index === steps.length - 1
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-card text-foreground shadow-sm"
                      }`}
                    >
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {lifecycleSteps.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{t("operations.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 26. Scalability + Efficiency */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("scalability.eyebrow")}
                title={t("scalability.title")}
                description={t("scalability.description")}
              />
              <div className="mt-6 space-y-5">
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="text-base font-bold text-foreground">{t("scalability.vertical.title")}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {t("scalability.vertical.description")}
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-2 text-sm font-semibold text-foreground">
                    <DiagramNode className="w-full max-w-xs">{t("scalability.vertical.vm")}</DiagramNode>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <DiagramNode className="w-full max-w-xs">{t("scalability.vertical.more")}</DiagramNode>
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="text-base font-bold text-foreground">{t("scalability.horizontal.title")}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {t("scalability.horizontal.description")}
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <DiagramNode className="w-full max-w-xs">{t("scalability.horizontal.vm")}</DiagramNode>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <div className="grid w-full max-w-xs grid-cols-3 gap-2">
                      {[0, 1, 2].map((i) => (
                        <DiagramNode key={i} className="text-xs">{t("scalability.horizontal.vm")}</DiagramNode>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("efficiency.eyebrow")}
                title={t("efficiency.title")}
                description={t("efficiency.description")}
              />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {efficiencyBenefits.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                      <Gauge className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-sm font-medium text-foreground leading-relaxed">
                {t("efficiency.message")}
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* 27. Performance */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("performance.eyebrow")}
            title={t("performance.title")}
            description={t("performance.description")}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-bold text-foreground">{t("performance.benefitsLabel")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {performanceTradeoffs.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground"
                  >
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-bold text-foreground">{t("performance.overheadLabel")}</p>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("performance.overheadDescription")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(t.raw("performance.factors") as string[]).map((factor, index) => {
              const icons = [Workflow, Server, Settings, HardDrive, Network];
              const Icon = icons[index] ?? Gauge;
              return (
                <div key={factor} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center shadow-sm">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{factor}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("performance.note")}</p>
        </Container>
      </section>

      {/* 28. Architecture overview */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("architecture.eyebrow")}
            title={t("architecture.title")}
            description={t("architecture.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                {t("architecture.privateCloud")}
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div className="rounded-lg bg-primary/10 px-6 py-3 text-center text-sm font-bold text-primary">
                {t("architecture.controlPlane")}
              </div>
              <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <DiagramNode>{t("architecture.virtualizationLayer")}</DiagramNode>
              <DiagramDivider vertical />
              <div className="grid w-full max-w-md grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <DiagramNode key={i} className="text-xs">{t(`architecture.cluster${i + 1}`)}</DiagramNode>
                ))}
              </div>
              <DiagramDivider vertical />
              <div className="grid w-full max-w-md grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="rounded-lg border border-dashed border-border bg-muted/50 p-2 text-center text-[11px] text-muted-foreground">
                    {t("architecture.vm")}
                  </div>
                ))}
              </div>
              <DiagramDivider vertical />
              <DiagramNode className="w-full max-w-sm">{t("architecture.physical")}</DiagramNode>
            </div>
          </div>
        </Container>
      </section>

      {/* 29. Virtualization stack */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("stack.eyebrow")}
                title={t("stack.title")}
                description={t("stack.description")}
              />
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-primary/5 blur-2xl" aria-hidden="true" />
              <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <p className="mb-6 font-mono text-xs text-muted-foreground">
                  <span className="text-primary">$</span> virtualization-stack
                </p>
                <ol className="relative space-y-4 border-l border-border pl-8">
                  {stackLayers.map((layer, index) => (
                    <li key={layer.title} className="relative">
                      <span
                        className={`absolute -left-9.25 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border-2 ${
                          index === stackLayers.length - 1
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background"
                        }`}
                      >
                        {index === stackLayers.length - 1 && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </span>
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 shadow-sm transition-colors hover:border-primary/40">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Layers className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">{layer.title}</p>
                          <p className="text-xs text-muted-foreground">{layer.description}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 30. Customer control */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("control.eyebrow")}
            title={t("control.title")}
            description={t("control.description")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Users className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("control.customer.title")}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {customerItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Cloud className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("control.zenth.title")}</h3>
              </div>
              <ul className="mt-4 space-y-2">
                {zenthItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("control.note")}</p>
        </Container>
      </section>

      {/* 31. Dedicated private cloud */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("dedicated.eyebrow")}
                title={t("dedicated.title")}
                description={t("dedicated.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                {t("dedicated.message")}
              </blockquote>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/private-cloud/dedicated-cloud">
                    {t("dedicated.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                {dedicatedSteps.map((step, index, steps) => (
                  <React.Fragment key={step}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-3 text-center ${
                        index === steps.length - 1
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-muted"
                      }`}
                    >
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 32. Cloud experience + Developer tools */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("cloudExperience.eyebrow")}
                title={t("cloudExperience.title")}
                description={t("cloudExperience.description")}
              />
              <div className="mt-6 flex flex-col items-center gap-2">
                {cloudSteps.map((step, index, steps) => (
                  <React.Fragment key={step}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                        index === steps.length - 1
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-card text-foreground shadow-sm"
                      }`}
                    >
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-base font-medium text-foreground leading-relaxed">
                {t("cloudExperience.message")}
              </blockquote>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("developerTools.eyebrow")}
                title={t("developerTools.title")}
                description={t("developerTools.description")}
              />
              <div className="mt-6 flex flex-col items-center gap-2">
                {devSteps.map((step, index, steps) => (
                  <React.Fragment key={step}>
                    <div
                      className={`w-full max-w-sm rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                        index === steps.length - 1
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "border border-border bg-card text-foreground shadow-sm"
                      }`}
                    >
                      {step}
                    </div>
                    {index < steps.length - 1 && <ArrowDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-8 rounded-xl border border-border bg-slate-950 p-6 font-mono text-xs shadow-sm">
                <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="ml-auto text-slate-400">{t("developerTools.terminalTitle")}</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-300">
                  {t("developerTools.terminalExample")}
                </pre>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 33. Future architecture */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("future.eyebrow")}
            title={t("future.title")}
            description={t("future.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {futureItems.map((item) => (
              <div key={item} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {t("future.badge")}
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{item}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("future.note")}</p>
        </Container>
      </section>

      {/* 34. Related pages */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("related.eyebrow")}
            title={t("related.title")}
            description={t("related.description")}
          />

          <div className="flex flex-wrap justify-center gap-3">
            {relatedLinks.map((link) => (
              <Button key={link.href} asChild variant="outline" size="sm">
                <Link href={link.href}>
                  {link.label} <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            ))}
          </div>
        </Container>
      </section>

      {/* 35. CTA final */}
      <section className="border-t border-border py-16 md:py-24 bg-muted">
        <Container>
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-bold">{t("finalCta.title")}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-primary-foreground/80">
              {t("finalCta.description")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link href="/private-cloud/dedicated-cloud">
                  {t("finalCta.primary")} <ArrowRight className="ml-1 h-4 w-4" />
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
