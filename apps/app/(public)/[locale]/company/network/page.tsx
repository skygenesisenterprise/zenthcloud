import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bell,
  Boxes,
  Briefcase,
  Building2,
  Check,
  Cloud,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  Eye,
  FileText,
  Gauge,
  Globe,
  HardDrive,
  Hash,
  KeyRound,
  Layers,
  LifeBuoy,
  Lock,
  MapPin,
  Network,
  Radar,
  RefreshCcw,
  Rocket,
  Route,
  Scale,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Siren,
  Sparkles,
  Split,
  Terminal,
  TrendingUp,
  Upload,
  Users,
  Waypoints,
  Wifi,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.network.meta");

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
  accent?: boolean;
}

function DiagramNode({ children, accent = false }: DiagramNodeProps) {
  return (
    <div
      className={`rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
        accent ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
      }`}
    >
      {children}
    </div>
  );
}

function DiagramDivider() {
  return <div className="h-6 w-px bg-border" aria-hidden="true" />;
}

function StepChain({ steps, icons }: { steps: string[]; icons: React.ComponentType<{ className?: string }>[] }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {steps.map((step, index) => {
        const Icon = icons[index];
        return (
          <React.Fragment key={step}>
            <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default async function NetworkPage() {
  const t = await getTranslations("Public.network");

  const whyItems = t.raw("why.items") as Array<{ title: string; description: string }>;
  const whyIcons = [Zap, Activity, ShieldCheck, Gauge, TrendingUp, Lock, Database];

  const layers = t.raw("layers.items") as string[];
  const layerIcons = [Globe, Radar, Waypoints, Server, Lock, Layers, Briefcase, Boxes];

  const edgeItems = t.raw("edge.items") as Array<{ title: string; description: string }>;
  const edgeIcons = [Download, Upload, Route, ShieldCheck, Shield, Scale];

  const coreObjectives = t.raw("core.objectives") as Array<{ title: string; description: string }>;
  const coreIcons = [Globe, Layers, Route, TrendingUp];

  const dcItems = t.raw("dcNetwork.items") as Array<{ title: string; description: string }>;
  const dcIcons = [ArrowLeftRight, Route, Split, ArrowUp, Settings];

  const publicNetItems = t.raw("publicNet.items") as Array<{ title: string; description: string }>;
  const publicNetIcons = [Globe, Download, Upload, Route, Shield];
  const publicNetSteps = t.raw("publicNet.steps") as string[];
  const publicNetStepIcons = [Users, Globe, Radar, Wifi, Cloud];

  const privateNetItems = t.raw("privateNet.items") as Array<{ title: string; description: string }>;
  const privateNetIcons = [ArrowLeftRight, Lock, Split, Hash];

  const managementSteps = t.raw("managementNet.steps") as string[];
  const managementIcons = [Settings, Server, Layers];

  const storageItems = t.raw("storageNet.items") as Array<{ title: string; description: string }>;
  const storageIcons = [Gauge, Zap, Lock, ShieldCheck];

  const interRegionUses = t.raw("interRegion.uses") as Array<{ title: string; description: string }>;
  const interRegionIcons = [Copy, Archive, LifeBuoy, Globe, Briefcase];

  const segmentationObjectives = t.raw("segmentation.objectives") as Array<{ title: string; description: string }>;
  const segmentationIcons = [Lock, ShieldCheck, Workflow, Layers];

  const securitySteps = t.raw("security.steps") as string[];
  const securityIcons = [Globe, Radar, Shield, Split, Lock, Briefcase];

  const securityItems = t.raw("security.items") as Array<{ title: string; description: string }>;
  const securityItemIcons = [Shield, FileText, Boxes, Route, Lock];

  const routingItems = t.raw("routing.items") as string[];
  const routingIcons = [Globe, Lock, MapPin, Settings];

  const ipSteps = t.raw("ipAddressing.steps") as string[];
  const ipStepIcons = [Globe, Radar, Lock, Briefcase];

  const ipItems = t.raw("ipAddressing.items") as Array<{ title: string; description: string }>;
  const ipItemIcons = [Globe, Lock, Server];

  const automationSteps = t.raw("automation.steps") as string[];
  const automationStepIcons = [Users, Code2, Settings, Network];

  const automationUses = t.raw("automation.uses") as Array<{ title: string; description: string }>;
  const automationUsesIcons = [Rocket, Route, Lock, Shield, Hash, Scale];

  const controlPlaneSteps = t.raw("controlPlane.steps") as string[];
  const controlPlaneIcons = [Code2, Settings, Layers, Network];

  const observabilitySteps = t.raw("observability.steps") as string[];
  const observabilityIcons = [Network, FileText, Eye, Bell];

  const opsItems = t.raw("operations.items") as Array<{ title: string; description: string }>;
  const opsIcons = [Activity, Wrench, Settings, Siren, TrendingUp, Search, Rocket];

  const resilienceCards = t.raw("resilience.cards") as Array<{ title: string; description: string; steps: string[] }>;
  const resilienceIcons = [Layers, RefreshCcw, TrendingUp];

  const latencySteps = t.raw("latency.steps") as string[];
  const latencyIcons = [Users, MapPin, Briefcase];

  const devItems = t.raw("audiences.developers.items") as Array<{ title: string; description: string }>;
  const devIcons = [Lock, Globe, Shield, Scale, Globe, Code2];

  const enterpriseItems = t.raw("audiences.enterprise.items") as Array<{ title: string; description: string }>;
  const enterpriseIcons = [Split, Lock, Route, KeyRound, Layers, Network];

  const hybridSteps = t.raw("hybrid.steps") as string[];
  const hybridIcons = [Building2, Lock, Cloud, Briefcase];

  const openNetItems = t.raw("openNetworking.items") as Array<{ title: string; description: string }>;
  const openNetIcons = [Globe, Terminal, Zap, Code2, Network, Boxes];

  const flow1Steps = t.raw("traffic.flow1.steps") as string[];
  const flow1Icons = [Users, Globe, Radar, Scale, Boxes, Database];
  const flow2Steps = t.raw("traffic.flow2.steps") as string[];
  const flow2Icons = [Boxes, Lock, Database];

  const currentItems = t.raw("evolution.current.items") as string[];
  const roadmapItems = t.raw("evolution.roadmap.items") as string[];

  const transparencyItems = t.raw("transparency.items") as Array<{ title: string; description: string }>;
  const transparencyIcons = [Activity, Siren, Wrench, FileText, MapPin, Globe];

  const relationItems = t.raw("relations.items") as Array<{ title: string; description: string; cta: string; href: string }>;
  const relationIcons = [Building2, Server, Network];

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
                  <Link href="/public-cloud">
                    {t("hero.primaryCta")}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/company/infrastructure">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center gap-4">
                    <div className="flex items-center gap-2 rounded-lg bg-white/15 border border-white/20 px-5 py-2.5">
                      <Network className="h-5 w-5 text-white" />
                      <span className="text-sm font-semibold text-white">Zenth Cloud Network</span>
                    </div>
                    <div className="h-6 w-px bg-white/30" aria-hidden="true" />
                    <div className="grid w-full grid-cols-3 gap-2">
                      {[
                        { label: "Edge", icon: Radar },
                        { label: "Core", icon: Waypoints },
                        { label: "Regions", icon: MapPin },
                      ].map((node) => {
                        const Icon = node.icon;
                        return (
                          <div
                            key={node.label}
                            className="flex flex-col items-center gap-1.5 rounded-lg bg-white/10 border border-white/15 px-2 py-3"
                          >
                            <Icon className="h-4 w-4 text-white/90" />
                            <span className="text-xs font-medium text-white/90">{node.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-6 w-px bg-white/30" aria-hidden="true" />
                    <div className="grid w-full grid-cols-3 gap-2">
                      {[
                        { label: "Compute", icon: Cpu },
                        { label: "Storage", icon: HardDrive },
                        { label: "Services", icon: Cloud },
                      ].map((node) => {
                        const Icon = node.icon;
                        return (
                          <div
                            key={node.label}
                            className="flex flex-col items-center gap-1.5 rounded-lg bg-white/10 border border-white/15 px-2 py-3"
                          >
                            <Icon className="h-4 w-4 text-white/90" />
                            <span className="text-xs font-medium text-white/90">{node.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. The network at a glance */}
      <section id="network" className="scroll-mt-20 py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("glance.eyebrow")}
            title={t("glance.title")}
            description={t("glance.description")}
          />

          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground leading-relaxed">
            {t("glance.intro")}
          </p>

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <DiagramNode accent>Internet</DiagramNode>
              <DiagramDivider />
              <DiagramNode>Edge</DiagramNode>
              <DiagramDivider />
              <DiagramNode>Core Network</DiagramNode>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    Region
                  </div>
                ))}
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    Data Center
                  </div>
                ))}
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[
                  { label: "Compute", icon: Cpu },
                  { label: "Storage", icon: HardDrive },
                  { label: "Network", icon: Network },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-lg border border-border bg-muted p-3 text-center">
                      <Icon className="mx-auto h-4 w-4 text-primary" />
                      <span className="mt-1 block text-xs font-medium text-foreground">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Why network matters */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("why.eyebrow")}
            title={t("why.title")}
            description={t("why.description")}
          />

          <blockquote className="mx-auto max-w-2xl border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
            {t("why.message")}
          </blockquote>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item, index) => {
              const Icon = whyIcons[index];
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Network layers */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("layers.eyebrow")}
            title={t("layers.title")}
            description={t("layers.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              {layers.map((layer, index) => {
                const Icon = layerIcons[index];
                return (
                  <React.Fragment key={layer}>
                    <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{layer}</span>
                    </div>
                    {index < layers.length - 1 && (
                      <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Edge network */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("edge.eyebrow")}
                title={t("edge.title")}
                description={t("edge.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {edgeItems.map((item, index) => {
                  const Icon = edgeIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("edge.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <DiagramNode accent>Internet</DiagramNode>
                <DiagramDivider />
                <DiagramNode>Edge</DiagramNode>
                <DiagramDivider />
                <DiagramNode>Zenth Cloud</DiagramNode>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Core network */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("core.eyebrow")}
            title={t("core.title")}
            description={t("core.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <DiagramNode accent>Core Network</DiagramNode>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {["Region", "Region", "Services"].map((label, index) => (
                  <div key={`core-${index}`} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    {label}
                  </div>
                ))}
              </div>
              <DiagramDivider />
              <DiagramNode>Backbone</DiagramNode>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreObjectives.map((item, index) => {
              const Icon = coreIcons[index];
              return (
                <div key={item.title} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 7. Data center network */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("dcNetwork.eyebrow")}
                title={t("dcNetwork.title")}
                description={t("dcNetwork.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {dcItems.map((item, index) => {
                  const Icon = dcIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/company/data-centers">
                    {t("dcNetwork.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <h3 className="mb-6 text-center text-sm font-bold text-foreground">{t("dcNetwork.fabricTitle")}</h3>
                <div className="flex flex-col items-center gap-3">
                  <DiagramNode accent>Spine</DiagramNode>
                  <DiagramDivider />
                  <div className="grid w-full grid-cols-3 gap-3">
                    {["Leaf", "Leaf", "Leaf"].map((label, index) => (
                      <div key={`leaf-${index}`} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                        {label}
                      </div>
                    ))}
                  </div>
                  <DiagramDivider />
                  <div className="grid w-full grid-cols-3 gap-3">
                    {["Compute", "Storage", "Services"].map((label) => (
                      <div key={label} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-medium text-foreground">
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("dcNetwork.fabricNote")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Public network */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("publicNet.eyebrow")}
                title={t("publicNet.title")}
                description={t("publicNet.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {publicNetItems.map((item, index) => {
                  const Icon = publicNetIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/networking">
                    {t("publicNet.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <StepChain steps={publicNetSteps} icons={publicNetStepIcons} />
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Private network */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("privateNet.eyebrow")}
                title={t("privateNet.title")}
                description={t("privateNet.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {privateNetItems.map((item, index) => {
                  const Icon = privateNetIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("privateNet.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <DiagramNode accent>Workloads client</DiagramNode>
                <DiagramDivider />
                <DiagramNode>Réseau privé</DiagramNode>
                <DiagramDivider />
                <div className="grid w-full grid-cols-3 gap-3">
                  {["VM", "VM", "Service"].map((label, index) => (
                    <div key={`vm-${index}`} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. Management & storage networks */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("managementNet.eyebrow")}
                title={t("managementNet.title")}
                description={t("managementNet.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={managementSteps} icons={managementIcons} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("managementNet.note")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("storageNet.eyebrow")}
                title={t("storageNet.title")}
                description={t("storageNet.description")}
              />
              <div className="grid gap-3">
                {storageItems.map((item, index) => {
                  const Icon = storageIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 11. Inter-region network */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("interRegion.eyebrow")}
                title={t("interRegion.title")}
                description={t("interRegion.description")}
              />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {interRegionUses.map((use, index) => {
                  const Icon = interRegionIcons[index];
                  return (
                    <div key={use.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{use.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{use.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("interRegion.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <DiagramNode>Region A</DiagramNode>
                <DiagramDivider />
                <div className="w-full rounded-lg bg-primary/10 px-4 py-2.5 text-center text-sm font-semibold text-primary">
                  {t("interRegion.eyebrow")}
                </div>
                <DiagramDivider />
                <DiagramNode>Region B</DiagramNode>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 12. Network segmentation */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("segmentation.eyebrow")}
            title={t("segmentation.title")}
            description={t("segmentation.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <DiagramNode accent>Network</DiagramNode>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {["Public", "Private", "Management"].map((label) => (
                  <div key={label} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {segmentationObjectives.map((item, index) => {
              const Icon = segmentationIcons[index];
              return (
                <div key={item.title} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 13. Network security */}
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
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {securityItems.map((item, index) => {
                  const Icon = securityItemIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("security.note")}</p>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/security">
                    {t("security.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <StepChain steps={securitySteps} icons={securityIcons} />
            </div>
          </div>
        </Container>
      </section>

      {/* 14. Traffic flows */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("traffic.eyebrow")}
            title={t("traffic.title")}
            description={t("traffic.description")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 text-center text-base font-bold text-foreground">{t("traffic.flow1.title")}</h3>
              <div className="flex flex-col items-center gap-3">
                {flow1Steps.map((step, index) => {
                  const Icon = flow1Icons[index];
                  return (
                    <React.Fragment key={step}>
                      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{step}</span>
                      </div>
                      {index < flow1Steps.length - 1 && (
                        <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 text-center text-base font-bold text-foreground">{t("traffic.flow2.title")}</h3>
              <div className="flex flex-col items-center gap-3">
                {flow2Steps.map((step, index) => {
                  const Icon = flow2Icons[index];
                  return (
                    <React.Fragment key={step}>
                      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{step}</span>
                      </div>
                      {index < flow2Steps.length - 1 && (
                        <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 15. Load balancing */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("loadBalancing.eyebrow")}
                title={t("loadBalancing.title")}
                description={t("loadBalancing.description")}
              />
              <div className="mt-8 grid gap-3">
                {(t.raw("loadBalancing.items") as Array<{ title: string; description: string }>).map((item, index) => {
                  const Icon = [Scale, Activity, TrendingUp][index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("loadBalancing.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <DiagramNode accent>Trafic</DiagramNode>
                <DiagramDivider />
                <DiagramNode>Load Balancer</DiagramNode>
                <DiagramDivider />
                <div className="grid w-full grid-cols-3 gap-3">
                  {["App", "App", "App"].map((label, index) => (
                    <div key={`app-${index}`} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 16. Routing & IP addressing */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("routing.eyebrow")}
                title={t("routing.title")}
                description={t("routing.description")}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {routingItems.map((item, index) => {
                  const Icon = routingIcons[index];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("routing.note")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("ipAddressing.eyebrow")}
                title={t("ipAddressing.title")}
                description={t("ipAddressing.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={ipSteps} icons={ipStepIcons} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {ipItems.map((item, index) => {
                  const Icon = ipItemIcons[index];
                  return (
                    <div key={item.title} className="flex flex-col rounded-lg border border-border bg-card p-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 17. Automation & control plane */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("automation.eyebrow")}
                title={t("automation.title")}
                description={t("automation.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={automationSteps} icons={automationStepIcons} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {automationUses.map((use, index) => {
                  const Icon = automationUsesIcons[index];
                  return (
                    <div key={use.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{use.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("controlPlane.eyebrow")}
                title={t("controlPlane.title")}
                description={t("controlPlane.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={controlPlaneSteps} icons={controlPlaneIcons} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 18. Observability */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("observability.eyebrow")}
                title={t("observability.title")}
                description={t("observability.description")}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">{t("observability.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <StepChain steps={observabilitySteps} icons={observabilityIcons} />
            </div>
          </div>
        </Container>
      </section>

      {/* 19. Network operations */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("operations.eyebrow")}
            title={t("operations.title")}
            description={t("operations.description")}
          />

          <blockquote className="mx-auto max-w-2xl border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
            {t("operations.message")}
          </blockquote>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {opsItems.map((item, index) => {
              const Icon = opsIcons[index];
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 20. Resilience */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("resilience.eyebrow")}
            title={t("resilience.title")}
            description={t("resilience.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {resilienceCards.map((card, index) => {
              const Icon = resilienceIcons[index];
              return (
                <div key={card.title} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  <ol className="mt-4 space-y-1.5">
                    {card.steps.map((step, stepIndex) => (
                      <li key={`${card.title}-${stepIndex}`} className="flex items-center gap-2.5 text-xs text-foreground">
                        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-primary">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">{t("resilience.note")}</p>
        </Container>
      </section>

      {/* 21. Latency */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("latency.eyebrow")}
            title={t("latency.title")}
            description={t("latency.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <StepChain steps={latencySteps} icons={latencyIcons} />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground leading-relaxed">
            {t("latency.note")}
          </p>
        </Container>
      </section>

      {/* 22. For developers & enterprises */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("audiences.eyebrow")}
            title={t("audiences.title")}
            description={t("audiences.description")}
          />

          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h3 className="text-lg font-bold text-foreground">{t("audiences.developers.title")}</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {devItems.map((item, index) => {
                  const Icon = devIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-foreground">{t("audiences.enterprise.title")}</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {enterpriseItems.map((item, index) => {
                  const Icon = enterpriseIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("audiences.enterprise.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 23. Hybrid connectivity */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("hybrid.eyebrow")}
            title={t("hybrid.title")}
            description={t("hybrid.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <StepChain steps={hybridSteps} icons={hybridIcons} />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground leading-relaxed">
            {t("hybrid.note")}
          </p>
        </Container>
      </section>

      {/* 24. Open networking */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("openNetworking.eyebrow")}
            title={t("openNetworking.title")}
            description={t("openNetworking.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openNetItems.map((item, index) => {
              const Icon = openNetIcons[index];
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 25. Network evolution */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("evolution.eyebrow")}
            title={t("evolution.title")}
            description={t("evolution.description")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">{t("evolution.current.title")}</h3>
              <ul className="mt-4 space-y-2.5">
                {currentItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">{t("evolution.roadmap.title")}</h3>
              <ul className="mt-4 space-y-2.5">
                {roadmapItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 26. Transparency */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("transparency.eyebrow")}
            title={t("transparency.title")}
            description={t("transparency.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {transparencyItems.map((item, index) => {
              const Icon = transparencyIcons[index];
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 27. Relations */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("relations.eyebrow")}
            title={t("relations.title")}
            description={t("relations.description")}
          />

          <blockquote className="mx-auto max-w-2xl border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
            {t("relations.message")}
          </blockquote>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
            {relationItems.map((item, index) => {
              const Icon = relationIcons[index];
              return (
                <div key={item.title} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <div className="mt-auto pt-5">
                    <Link href={item.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      {item.cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 28. Network architecture */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("architecture.eyebrow")}
            title={t("architecture.title")}
            description={t("architecture.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <DiagramNode accent>Internet</DiagramNode>
              <DiagramDivider />
              <DiagramNode>Edge</DiagramNode>
              <DiagramDivider />
              <DiagramNode>Core / Backbone</DiagramNode>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    Region
                  </div>
                ))}
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    Data Center
                  </div>
                ))}
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[
                  { label: "Compute", icon: Cpu },
                  { label: "Storage", icon: HardDrive },
                  { label: "Services", icon: Cloud },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-lg border border-border bg-muted p-3 text-center">
                      <Icon className="mx-auto h-4 w-4 text-primary" />
                      <span className="mt-1 block text-xs font-medium text-foreground">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <DiagramDivider />
              <DiagramNode>Réseaux privés</DiagramNode>
              <DiagramDivider />
              <DiagramNode accent>Workloads</DiagramNode>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">{t("architecture.note")}</p>
        </Container>
      </section>

      {/* 29. CTA final */}
      <section className="border-t border-border py-16 md:py-24 bg-muted">
        <Container>
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-bold">{t("finalCta.title")}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-primary-foreground/80">{t("finalCta.description")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link href="/public-cloud">{t("finalCta.primary")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                <Link href="/public-cloud/networking">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
