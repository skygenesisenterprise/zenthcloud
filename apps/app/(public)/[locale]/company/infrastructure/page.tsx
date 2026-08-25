import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Box,
  Boxes,
  Brain,
  Briefcase,
  Building2,
  Check,
  Cloud,
  Code2,
  Container as ContainerIcon,
  Cpu,
  Database,
  Eye,
  FileText,
  GitFork,
  Globe,
  Gauge,
  HardDrive,
  Hash,
  HeartHandshake,
  KeyRound,
  Layers,
  LifeBuoy,
  Lock,
  MapPin,
  MemoryStick,
  Network,
  Package,
  PieChart,
  Puzzle,
  Radar,
  Receipt,
  RefreshCcw,
  Repeat,
  Rocket,
  Radio,
  Route,
  Scale,
  Send,
  Server,
  Settings,
  Settings2,
  Shield,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Split,
  Terminal,
  TrendingUp,
  Waypoints,
  Wifi,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.infrastructure.meta");

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

export default async function InfrastructurePage() {
  const t = await getTranslations("Public.infrastructure");

  const glanceColumns = t.raw("glance.columns") as Array<{ title: string; description: string; items: string[] }>;
  const glanceIcons = [Server, Layers, LifeBuoy];

  const hardwareLayers = t.raw("hardwareToCloud.layers") as Array<{ title: string; description: string }>;
  const hardwareChainIcons = [Building2, Cpu, Network, Server, HardDrive, Boxes, Settings, Terminal, Briefcase];

  const ownershipItems = t.raw("hardwareToCloud.ownershipItems") as Array<{ title: string; description: string }>;
  const ownershipIcons = [Activity, Wrench, Puzzle, HeartHandshake];

  const dcItems = t.raw("datacenters.items") as Array<{ title: string; description: string }>;
  const dcIcons = [Zap, Snowflake, Lock, Globe, Layers, Server];

  const regionItems = t.raw("datacenters.architectureItems") as string[];
  const regionIcons = [Building2, Cpu, HardDrive, Network, Boxes];

  const hardwareItems = t.raw("hardware.items") as Array<{ title: string; description: string }>;
  const hardwareIcons = [Cpu, HardDrive, Network, Brain, Archive];

  const computeSteps = t.raw("compute.steps") as string[];
  const computeIcons = [Server, Layers, Boxes, Briefcase];

  const storageTypes = t.raw("storage.types") as Array<{ title: string; description: string }>;
  const storageTypeIcons = [Box, Package, HardDrive, Archive];

  const storageConcepts = t.raw("storage.concepts") as Array<{ title: string; description: string }>;
  const storageConceptIcons = [ShieldCheck, Activity, Zap, Repeat, Archive];

  const networkSteps = t.raw("network.steps") as string[];
  const networkStepIcons = [Globe, Radar, Waypoints];

  const networkPlanes = t.raw("network.networks") as Array<{ title: string; description: string }>;
  const networkPlaneIcons = [Globe, Lock, Settings, HardDrive];

  const networkItems = t.raw("network.items") as Array<{ title: string; description: string }>;
  const networkItemIcons = [Route, ArrowLeftRight, Shield, Lock, Split, Scale, Wifi, Hash];

  const cpResponsibilities = t.raw("controlPlane.responsibilities") as Array<{ title: string; description: string }>;
  const cpIcons = [Rocket, RefreshCcw, PieChart, Network, KeyRound, Activity, Receipt];

  const automationSteps = t.raw("automation.steps") as string[];
  const automationStepIcons = [Boxes, Code2, Settings, Server];

  const automationItems = t.raw("automation.items") as Array<{ title: string; description: string }>;
  const automationIcons = [Rocket, Send, TrendingUp, Settings2, Archive, Activity, RefreshCcw];

  const resourceSteps = t.raw("resourceManagement.steps") as string[];
  const resourceStepIcons = [Cpu, Gauge, Server, Workflow];

  const resources = t.raw("resourceManagement.resources") as string[];
  const resourceIcons = [Cpu, MemoryStick, HardDrive, Network, Brain];

  const tenancyItems = t.raw("multiTenancy.items") as Array<{ title: string; description: string }>;
  const tenancyIcons = [Shield, SlidersHorizontal, KeyRound, Network, Scale];

  const dedicatedModels = t.raw("dedicated.models") as Array<{ title: string; description: string; label: string }>;
  const dedicatedIcons = [Cloud, Server, Building2];

  const serviceItems = t.raw("services.items") as Array<{ title: string; description: string; chain: string; cta: string; href: string }>;
  const serviceIcons = [ContainerIcon, Database, Brain, Archive];

  const securityLayers = t.raw("security.layers") as string[];
  const securityLayerIcons = [Building2, Network, Layers, KeyRound, Boxes, Database, Archive];

  const observabilitySteps = t.raw("observability.steps") as string[];
  const observabilityIcons = [Server, Radio, FileText, Eye, Bell];

  const operationsItems = t.raw("operations.items") as Array<{ title: string; description: string }>;
  const operationsIcons = [Activity, Wrench, TrendingUp, Siren, ShieldCheck, RefreshCcw, Server];

  const resilienceCards = t.raw("resilience.cards") as Array<{ title: string; description: string; steps: string[] }>;
  const resilienceIcons = [Layers, RefreshCcw, TrendingUp, Workflow];

  const transformationSteps = t.raw("transformation.steps") as string[];
  const transformationIcons = [Server, Layers, Cloud, Boxes, Briefcase];

  const principles = t.raw("principles.items") as Array<{ title: string; description: string }>;
  const principleIcons = [Zap, Eye, ShieldCheck, Layers, Code2, Globe];

  const openTechItems = t.raw("openTechnologies.items") as Array<{ title: string; description: string }>;
  const openTechIcons = [Terminal, GitFork, Globe, Code2, ContainerIcon, Boxes, Zap];

  const transparencyItems = t.raw("transparency.items") as Array<{ title: string; description: string }>;
  const transparencyIcons = [FileText, Activity, Siren, Wrench, MapPin, BookOpen, ShieldCheck];

  const currentItems = t.raw("evolution.current.items") as string[];
  const roadmapItems = t.raw("evolution.roadmap.items") as string[];

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
                  <Link href="#architecture">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-6 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-white/15 border border-white/20 px-5 py-2.5">
                      <Cloud className="h-5 w-5 text-white" />
                      <span className="text-sm font-semibold text-white">Zenth Cloud</span>
                    </div>
                    <div className="h-6 w-px bg-white/30" aria-hidden="true" />
                    {glanceColumns.map((column) => (
                      <div
                        key={column.title}
                        className="w-full rounded-lg bg-white/10 border border-white/15 px-4 py-3 text-center"
                      >
                        <span className="text-xs font-semibold text-white">{column.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Infrastructure at a glance */}
      <section id="architecture" className="scroll-mt-20 py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("glance.eyebrow")}
            title={t("glance.title")}
            description={t("glance.description")}
          />

          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground leading-relaxed">
            {t("glance.intro")}
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            {glanceColumns.map((column, index) => {
              const Icon = glanceIcons[index];
              return (
                <div
                  key={column.title}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="h-1.5 rounded-t-xl bg-primary" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">{column.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {column.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {column.items.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <div className="rounded-lg border border-border bg-muted px-5 py-2.5 text-sm font-semibold text-foreground">
              {t("transformation.message")}
            </div>
          </div>
        </Container>
      </section>

      {/* 3. From hardware to cloud */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("hardwareToCloud.eyebrow")}
                title={t("hardwareToCloud.title")}
                description={t("hardwareToCloud.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                {t("hardwareToCloud.message")}
              </blockquote>

              <h3 className="mt-10 text-base font-bold text-foreground">
                {t("hardwareToCloud.ownershipTitle")}
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ownershipItems.map((item, index) => {
                  const Icon = ownershipIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
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
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-primary/5 blur-2xl" aria-hidden="true" />
              <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <p className="mb-6 font-mono text-xs text-muted-foreground">
                  <span className="text-primary">$</span> zenthcloud stack
                </p>
                <ol className="relative space-y-4 border-l border-border pl-8">
                  {hardwareLayers.map((layer, index) => {
                    const Icon = hardwareChainIcons[index];
                    return (
                      <li key={layer.title} className="relative">
                        <span
                          className={`absolute -left-9.25 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border-2 ${
                            index === hardwareLayers.length - 1
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background"
                          }`}
                        >
                          {index === hardwareLayers.length - 1 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </span>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 shadow-sm transition-colors hover:border-primary/40">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground">{layer.title}</p>
                            <p className="text-xs text-muted-foreground">{layer.description}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Datacenters */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("datacenters.eyebrow")}
            title={t("datacenters.title")}
            description={t("datacenters.description")}
          />

          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground leading-relaxed">
            {t("datacenters.intro")}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dcItems.map((item, index) => {
              const Icon = dcIcons[index];
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

          <div className="mx-auto mt-12 max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <p className="mb-6 text-center text-sm font-bold text-foreground">
              {t("datacenters.architectureTitle")}
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary">
                <MapPin className="h-4 w-4" />
                Region
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-5">
                {regionItems.map((item, index) => {
                  const Icon = regionIcons[index];
                  return (
                    <div key={item} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Hardware */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("hardware.eyebrow")}
            title={t("hardware.title")}
            description={t("hardware.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {hardwareItems.map((item, index) => {
              const Icon = hardwareIcons[index];
              return (
                <div key={item.title} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Compute */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("compute.eyebrow")}
                title={t("compute.title")}
                description={t("compute.description")}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("compute.note")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/public-cloud/compute">
                    {t("compute.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/private-cloud/dedicated-cloud">
                    {t("dedicated.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                {computeSteps.map((step, index) => {
                  const Icon = computeIcons[index];
                  return (
                    <React.Fragment key={step}>
                      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{step}</span>
                      </div>
                      {index < computeSteps.length - 1 && (
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

      {/* 7. Storage */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("storage.eyebrow")}
            title={t("storage.title")}
            description={t("storage.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {storageTypes.map((type, index) => {
              const Icon = storageTypeIcons[index];
              return (
                <div key={type.title} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{type.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{type.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {storageConcepts.map((concept, index) => {
              const Icon = storageConceptIcons[index];
              return (
                <div key={concept.title} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 shadow-sm">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{concept.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{concept.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/public-cloud/storage">
                {t("storage.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 8. Network */}
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
                {networkItems.map((item, index) => {
                  const Icon = networkItemIcons[index];
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
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/networking">
                    {t("network.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                {networkSteps.map((step, index) => {
                  const Icon = networkStepIcons[index];
                  return (
                    <React.Fragment key={step}>
                      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{step}</span>
                      </div>
                      {index < networkSteps.length - 1 && (
                        <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      )}
                    </React.Fragment>
                  );
                })}
                <div className="h-6 w-px bg-border" aria-hidden="true" />
                <div className="grid w-full grid-cols-2 gap-3">
                  {networkPlanes.map((plane, planeIndex) => {
                    const Icon = networkPlaneIcons[planeIndex];
                    return (
                      <div key={plane.title} className="rounded-lg border border-border bg-muted p-3 text-center">
                        <Icon className="mx-auto h-4 w-4 text-primary" />
                        <span className="mt-1.5 block text-xs font-semibold text-foreground">{plane.title}</span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground leading-snug">{plane.description}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Control plane */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("controlPlane.eyebrow")}
                title={t("controlPlane.title")}
                description={t("controlPlane.description")}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("controlPlane.intro")}
              </p>

              <h3 className="mt-8 text-base font-bold text-foreground">{t("controlPlane.responsibilitiesLabel")}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {cpResponsibilities.map((item, index) => {
                  const Icon = cpIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
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
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <DiagramNode accent>Customer</DiagramNode>
                <DiagramDivider />
                <div className="w-full rounded-lg bg-primary/10 px-4 py-2.5 text-center text-sm font-semibold text-primary">
                  Web Console
                </div>
                <div className="w-full rounded-lg bg-primary/10 px-4 py-2.5 text-center text-sm font-semibold text-primary">
                  CLI / API
                </div>
                <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <div className="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                  Control Plane
                </div>
                <div className="grid w-full grid-cols-3 gap-3">
                  {["Compute", "Network", "Storage"].map((label) => (
                    <div key={label} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                      {label}
                    </div>
                  ))}
                </div>
                <div className="h-6 w-px bg-border" aria-hidden="true" />
                <div className="w-full rounded-lg bg-muted px-4 py-2.5 text-center text-sm font-semibold text-foreground">
                  Infrastructure
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. API-first infrastructure */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("apiFirst.eyebrow")}
            title={t("apiFirst.title")}
            description={t("apiFirst.description")}
          />
          <blockquote className="mx-auto max-w-2xl border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
            {t("apiFirst.message")}
          </blockquote>

          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                Control Plane
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Web</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">CLI</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">API</span>
                </div>
              </div>
              <DiagramDivider />
              <div className="w-full rounded-lg bg-muted px-4 py-2.5 text-center text-sm font-semibold text-foreground">
                Infrastructure
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 11. Automation */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("automation.eyebrow")}
                title={t("automation.title")}
                description={t("automation.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {automationItems.map((item, index) => {
                  const Icon = automationIcons[index];
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

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                {automationSteps.map((step, index) => {
                  const Icon = automationStepIcons[index];
                  return (
                    <React.Fragment key={step}>
                      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{step}</span>
                      </div>
                      {index < automationSteps.length - 1 && (
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

      {/* 12. Resource management */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("resourceManagement.eyebrow")}
            title={t("resourceManagement.title")}
            description={t("resourceManagement.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              {resourceSteps.map((step, index) => {
                const Icon = resourceStepIcons[index];
                return (
                  <React.Fragment key={step}>
                    <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{step}</span>
                    </div>
                    {index < resourceSteps.length - 1 && (
                      <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {resources.map((resource, index) => {
              const Icon = resourceIcons[index];
              return (
                <span
                  key={resource}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {resource}
                </span>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 13. Multi-tenancy */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("multiTenancy.eyebrow")}
            title={t("multiTenancy.title")}
            description={t("multiTenancy.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {tenancyItems.map((item, index) => {
              const Icon = tenancyIcons[index];
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

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Boxes className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold text-foreground">{t("multiTenancy.logical.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("multiTenancy.logical.description")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Server className="h-5 w-5" />
                </span>
                <h3 className="text-base font-bold text-foreground">{t("multiTenancy.physical.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("multiTenancy.physical.description")}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-full rounded-lg bg-primary/10 px-4 py-2.5 text-center text-sm font-semibold text-primary">
                Physical Infrastructure
              </div>
              <DiagramDivider />
              <div className="w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                Platform
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {["Tenant A", "Tenant B", "Tenant C"].map((tenant) => (
                  <div key={tenant} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    {tenant}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 14. Dedicated infrastructure */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("dedicated.eyebrow")}
            title={t("dedicated.title")}
            description={t("dedicated.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {dedicatedModels.map((model, index) => {
              const Icon = dedicatedIcons[index];
              return (
                <div
                  key={model.title}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="h-1.5 rounded-t-xl bg-primary" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">{model.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {model.description}
                    </p>
                    <div className="mt-auto pt-5">
                      <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                        {model.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/private-cloud/dedicated-cloud">
                {t("dedicated.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 15. Services on infrastructure */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("services.eyebrow")}
            title={t("services.title")}
            description={t("services.description")}
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {serviceItems.map((item, index) => {
              const Icon = serviceIcons[index];
              return (
                <div key={item.title} className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                    {item.chain}
                  </div>
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

      {/* 16. Security architecture */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("security.eyebrow")}
                title={t("security.title")}
                description={t("security.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-base font-medium text-foreground leading-relaxed">
                {t("security.message")}
              </blockquote>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/security">
                    {t("security.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-primary/5 blur-2xl" aria-hidden="true" />
              <div className="relative rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <p className="mb-6 font-mono text-xs text-muted-foreground">
                  <span className="text-primary">$</span> defense-in-depth
                </p>
                <ol className="relative space-y-4 border-l border-border pl-8">
                  {securityLayers.map((layer, index) => {
                    const Icon = securityLayerIcons[index];
                    return (
                      <li key={layer} className="relative">
                        <span
                          className={`absolute -left-9.25 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border-2 ${
                            index === securityLayers.length - 1
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background"
                          }`}
                        >
                          {index === securityLayers.length - 1 && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </span>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 shadow-sm transition-colors hover:border-primary/40">
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="text-sm font-medium text-foreground">{layer}</span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 17. Observability */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("observability.eyebrow")}
                title={t("observability.title")}
                description={t("observability.description")}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("observability.note")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                {observabilitySteps.map((step, index) => {
                  const Icon = observabilityIcons[index];
                  return (
                    <React.Fragment key={step}>
                      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{step}</span>
                      </div>
                      {index < observabilitySteps.length - 1 && (
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

      {/* 18. Operations */}
      <section className="py-16 md:py-24 bg-background">
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
            {operationsItems.map((item, index) => {
              const Icon = operationsIcons[index];
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

      {/* 19. Resilience */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("resilience.eyebrow")}
            title={t("resilience.title")}
            description={t("resilience.description")}
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
        </Container>
      </section>

      {/* 20. From hardware to service */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("transformation.eyebrow")}
            title={t("transformation.title")}
            description={t("transformation.description")}
          />

          <blockquote className="mx-auto max-w-2xl border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
            {t("transformation.message")}
          </blockquote>

          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              {transformationSteps.map((step, index) => {
                const Icon = transformationIcons[index];
                return (
                  <React.Fragment key={step}>
                    <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold text-foreground">{step}</span>
                    </div>
                    {index < transformationSteps.length - 1 && (
                      <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 21. Infrastructure principles */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("principles.eyebrow")}
            title={t("principles.title")}
            description={t("principles.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principleIcons[index];
              return (
                <div
                  key={principle.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{principle.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 22. Open technologies */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("openTechnologies.eyebrow")}
            title={t("openTechnologies.title")}
            description={t("openTechnologies.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {openTechItems.map((item, index) => {
              const Icon = openTechIcons[index];
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

      {/* 23. Infrastructure transparency */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("transparency.eyebrow")}
            title={t("transparency.title")}
            description={t("transparency.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="https://docs.zenthcloud.com" target="_blank" rel="noreferrer">
                {t("transparency.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 24. Architecture evolution */}
      <section className="py-16 md:py-24 bg-background">
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

      {/* 25. CTA final */}
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
                <Link href="/solutions">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
