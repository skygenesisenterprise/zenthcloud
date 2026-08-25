import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Boxes,
  Brain,
  Briefcase,
  Building2,
  Check,
  ClipboardList,
  Cloud,
  Copy,
  Cpu,
  Database,
  Euro,
  Flame,
  Globe,
  HardDrive,
  KeyRound,
  Layers,
  Leaf,
  LifeBuoy,
  Lock,
  MapPin,
  Merge,
  Move,
  Network,
  PieChart,
  Radar,
  RefreshCcw,
  Rocket,
  Scale,
  Server,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Siren,
  Snowflake,
  Sparkles,
  Thermometer,
  Trash2,
  TrendingUp,
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
  const t = await getTranslations("Public.dataCenters.meta");

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

export default async function DataCentersPage() {
  const t = await getTranslations("Public.dataCenters");

  const insideItems = t.raw("inside.items") as Array<{ title: string; description: string }>;
  const insideIcons = [Zap, Snowflake, Network, Server, Lock, Wrench];

  const powerSteps = t.raw("power.steps") as string[];
  const powerIcons = [Zap, Settings, BatteryCharging, Server, Cpu];

  const coolingSteps = t.raw("cooling.steps") as string[];
  const coolingIcons = [Server, Flame, Snowflake, Thermometer];

  const coolingReasons = t.raw("cooling.items") as Array<{ title: string; description: string }>;
  const coolingReasonIcons = [Cpu, Brain, HardDrive, Network];

  const connectivitySteps = t.raw("connectivity.steps") as string[];
  const connectivityIcons = [Globe, Wifi, Radar, Server];

  const connectivityItems = t.raw("connectivity.items") as Array<{ title: string; description: string }>;
  const connectivityItemIcons = [Globe, Wifi, Lock, Waypoints, Merge, Layers];

  const interDCUses = t.raw("interDC.uses") as Array<{ title: string; description: string }>;
  const interDCIcons = [Copy, Archive, Move, LifeBuoy, RefreshCcw];

  const securitySteps = t.raw("physicalSecurity.steps") as string[];
  const securityIcons = [Building2, KeyRound, Server, ShieldCheck];

  const rackItems = t.raw("racks.items") as string[];
  const rackIcons = [Network, Cpu, HardDrive, Zap, Settings];

  const capacityItems = t.raw("capacity.items") as Array<{ key: string; title: string; description: string; steps: string[]; cta: string; href: string }>;
  const capacityIcons = [Cpu, HardDrive, Brain];

  const residencyItems = t.raw("residency.items") as Array<{ title: string; description: string }>;
  const residencyIcons = [MapPin, Scale, Database, Workflow, ClipboardList];

  const placementSteps = t.raw("placement.steps") as string[];
  const placementIcons = [Users, MapPin, Building2, Boxes, Briefcase];

  const availabilityItems = t.raw("availability.items") as Array<{ title: string; description: string }>;
  const availabilityIcons = [Layers, Activity, LifeBuoy];

  const drSteps = t.raw("disasterRecovery.steps") as string[];
  const drIcons = [Server, Archive, Building2, RefreshCcw];

  const opsSteps = t.raw("operations.steps") as string[];
  const opsStepIcons = [ClipboardList, Rocket, Settings, Activity, Wrench, TrendingUp];

  const opsItems = t.raw("operations.items") as Array<{ title: string; description: string }>;
  const opsIcons = [Server, Wrench, Activity, TrendingUp, RefreshCcw, Network, Siren];

  const monitoringSteps = t.raw("monitoring.steps") as string[];
  const monitoringIcons = [Building2, Zap, Snowflake, Network, Cpu, Layers, Globe];

  const lifecycleSteps = t.raw("lifecycle.steps") as string[];
  const lifecycleIcons = [ShoppingCart, Rocket, Settings, Server, Wrench, TrendingUp, Trash2];

  const sustainabilityItems = t.raw("sustainability.items") as Array<{ title: string; description: string }>;
  const sustainabilityIcons = [Leaf, RefreshCcw, Boxes, PieChart, Snowflake];

  const europeItems = t.raw("europe.items") as Array<{ title: string; description: string }>;
  const europeIcons = [Building2, Waypoints, Database, Cloud];

  const expansionSteps = t.raw("expansion.steps") as string[];
  const expansionIcons = [Check, PieChart, Cpu, Server, Building2, MapPin];

  const rackToCloudSteps = t.raw("fromRackToCloud.steps") as string[];
  const rackToCloudIcons = [Server, Boxes, Layers, Building2, MapPin, Cloud];

  const locationItems = t.raw("location.items") as Array<{ title: string; description: string }>;
  const locationIcons = [Zap, Database, Activity, Wifi, LifeBuoy, Euro, Workflow];

  const choosingItems = t.raw("choosing.items") as string[];
  const choosingIcons = [MapPin, Zap, Globe, Activity, Scale];

  const transparencyItems = t.raw("transparency.items") as Array<{ title: string; description: string }>;
  const transparencyIcons = [Activity, Wrench, Siren, MapPin, Globe, TrendingUp];

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
                      <Cloud className="h-5 w-5 text-white" />
                      <span className="text-sm font-semibold text-white">Zenth Cloud</span>
                    </div>
                    <div className="h-6 w-px bg-white/30" aria-hidden="true" />
                    <div className="grid w-full grid-cols-3 gap-2">
                      {[
                        { label: t("network.regionLabel"), icon: MapPin },
                        { label: t("network.datacenterLabel"), icon: Building2 },
                        { label: "Network", icon: Network },
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
                    <div className="w-full rounded-lg bg-white/15 border border-white/20 px-4 py-2.5 text-center text-xs font-semibold text-white">
                      {t("network.regionsTitle")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Our data center network */}
      <section id="network" className="scroll-mt-20 py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("network.eyebrow")}
            title={t("network.title")}
            description={t("network.description")}
          />

          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground leading-relaxed">
            {t("network.intro")}
          </p>

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary">
                <Cloud className="h-4 w-4" />
                Zenth Cloud
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted p-4 text-center">
                    <MapPin className="mx-auto h-4 w-4 text-primary" />
                    <span className="mt-1.5 block text-xs font-semibold text-foreground">
                      {t("network.regionLabel")}
                    </span>
                  </div>
                ))}
              </div>
              <DiagramDivider />
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary">
                <Building2 className="h-4 w-4" />
                {t("network.datacenterLabel")}
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

      {/* 3. Region vs Data Center */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("regionVsDC.eyebrow")}
            title={t("regionVsDC.title")}
            description={t("regionVsDC.description")}
          />

          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("regionVsDC.region.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("regionVsDC.region.description")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Building2 className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("regionVsDC.datacenter.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("regionVsDC.datacenter.description")}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <DiagramNode>{t("network.regionLabel")}</DiagramNode>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {["Data Center A", "Data Center B", "Network"].map((label) => (
                  <div key={label} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Inside a data center */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("inside.eyebrow")}
            title={t("inside.title")}
            description={t("inside.description")}
          />

          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center gap-3">
              <DiagramNode accent>Data Center</DiagramNode>
              <DiagramDivider />
              <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {insideItems.map((item, index) => {
                  const Icon = insideIcons[index];
                  return (
                    <div key={item.title} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                  <Server className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">Racks</span>
              </div>
              <div className="grid w-full grid-cols-3 gap-3">
                {(t.raw("inside.rackItems") as string[]).map((item) => (
                  <div key={item} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Power & Cooling */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("power.eyebrow")}
                title={t("power.title")}
                description={t("power.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={powerSteps} icons={powerIcons} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("power.note")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("cooling.eyebrow")}
                title={t("cooling.title")}
                description={t("cooling.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={coolingSteps} icons={coolingIcons} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {coolingReasons.map((reason, index) => {
                  const Icon = coolingReasonIcons[index];
                  return (
                    <div key={reason.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{reason.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{reason.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("cooling.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Network connectivity */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("connectivity.eyebrow")}
                title={t("connectivity.title")}
                description={t("connectivity.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {connectivityItems.map((item, index) => {
                  const Icon = connectivityItemIcons[index];
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
                {connectivitySteps.map((step, index) => {
                  const Icon = connectivityIcons[index];
                  return (
                    <React.Fragment key={step}>
                      <div className="flex w-full items-center gap-3 rounded-lg border border-border bg-muted px-4 py-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold text-foreground">{step}</span>
                      </div>
                      {index < connectivitySteps.length - 1 && (
                        <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                      )}
                    </React.Fragment>
                  );
                })}
                <div className="h-6 w-px bg-border" aria-hidden="true" />
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
          </div>
        </Container>
      </section>

      {/* 7. Inter-data center network */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("interDC.eyebrow")}
                title={t("interDC.title")}
                description={t("interDC.description")}
              />
              <h3 className="mt-8 text-base font-bold text-foreground">{t("interDC.usesLabel")}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {interDCUses.map((use, index) => {
                  const Icon = interDCIcons[index];
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
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("interDC.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <DiagramNode>Data Center A</DiagramNode>
                <DiagramDivider />
                <div className="flex w-full items-center gap-3 rounded-lg bg-primary/10 px-4 py-3">
                  <Waypoints className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-semibold text-primary">{t("interDC.steps.1")}</span>
                </div>
                <DiagramDivider />
                <DiagramNode>Data Center B</DiagramNode>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Physical security & Racks */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("physicalSecurity.eyebrow")}
                title={t("physicalSecurity.title")}
                description={t("physicalSecurity.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={securitySteps} icons={securityIcons} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("physicalSecurity.note")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("racks.eyebrow")}
                title={t("racks.title")}
                description={t("racks.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-3">
                  <DiagramNode accent>42U Rack</DiagramNode>
                  <DiagramDivider />
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {rackItems.map((item, index) => {
                      const Icon = rackIcons[index];
                      return (
                        <div key={item} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-[11px] font-medium text-foreground">{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("racks.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Capacity */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("capacity.eyebrow")}
            title={t("capacity.title")}
            description={t("capacity.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {capacityItems.map((item, index) => {
              const Icon = capacityIcons[index];
              return (
                <div key={item.key} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <div className="mt-4 rounded-lg border border-border bg-muted p-4">
                    <ol className="space-y-2">
                      {item.steps.map((step, stepIndex) => (
                        <li key={step} className="flex items-center gap-2.5 text-xs text-foreground">
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-primary">
                            {stepIndex + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
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

          <p className="mt-8 text-center text-xs text-muted-foreground">{t("capacity.note")}</p>
        </Container>
      </section>

      {/* 10. Data residency & Workload placement */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("residency.eyebrow")}
                title={t("residency.title")}
                description={t("residency.description")}
              />
              <blockquote className="mt-2 border-l-4 border-primary pl-5 text-base font-medium text-foreground leading-relaxed">
                {t("residency.message")}
              </blockquote>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {residencyItems.map((item, index) => {
                  const Icon = residencyIcons[index];
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
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("residency.note")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("placement.eyebrow")}
                title={t("placement.title")}
                description={t("placement.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={placementSteps} icons={placementIcons} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("placement.note")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 11. Availability & Disaster recovery */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("availability.eyebrow")}
                title={t("availability.title")}
                description={t("availability.description")}
              />
              <div className="grid gap-3">
                {availabilityItems.map((item, index) => {
                  const Icon = availabilityIcons[index];
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
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">{t("availability.note")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("disasterRecovery.eyebrow")}
                title={t("disasterRecovery.title")}
                description={t("disasterRecovery.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <StepChain steps={drSteps} icons={drIcons} />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/backup">
                    {t("disasterRecovery.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground leading-relaxed">{t("disasterRecovery.note")}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 12. Data center operations */}
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

          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <StepChain steps={opsSteps} icons={opsStepIcons} />
          </div>

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

      {/* 13. Monitoring */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("monitoring.eyebrow")}
                title={t("monitoring.title")}
                description={t("monitoring.description")}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">{t("monitoring.note")}</p>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/company/infrastructure">
                    {t("monitoring.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <StepChain steps={monitoringSteps} icons={monitoringIcons} />
            </div>
          </div>
        </Container>
      </section>

      {/* 14. Hardware lifecycle */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("lifecycle.eyebrow")}
            title={t("lifecycle.title")}
            description={t("lifecycle.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <StepChain steps={lifecycleSteps} icons={lifecycleIcons} />
          </div>
        </Container>
      </section>

      {/* 15. Sustainability */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("sustainability.eyebrow")}
            title={t("sustainability.title")}
            description={t("sustainability.description")}
          />

          <blockquote className="mx-auto max-w-2xl border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
            {t("sustainability.message")}
          </blockquote>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {sustainabilityItems.map((item, index) => {
              const Icon = sustainabilityIcons[index];
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

          <p className="mt-8 text-center text-xs text-muted-foreground">{t("sustainability.note")}</p>
        </Container>
      </section>

      {/* 16. European infrastructure */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("europe.eyebrow")}
            title={t("europe.title")}
            description={t("europe.description")}
          />

          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {europeItems.map((item, index) => {
              const Icon = europeIcons[index];
              return (
                <div key={item.title} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">{t("europe.note")}</p>
        </Container>
      </section>

      {/* 17. Infrastructure expansion */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("expansion.eyebrow")}
            title={t("expansion.title")}
            description={t("expansion.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <StepChain steps={expansionSteps} icons={expansionIcons} />
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground leading-relaxed">
            {t("expansion.note")}
          </p>
        </Container>
      </section>

      {/* 18. From one rack to a cloud */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("fromRackToCloud.eyebrow")}
            title={t("fromRackToCloud.title")}
            description={t("fromRackToCloud.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <StepChain steps={rackToCloudSteps} icons={rackToCloudIcons} />
          </div>
        </Container>
      </section>

      {/* 19. Why location matters */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("location.eyebrow")}
            title={t("location.title")}
            description={t("location.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {locationItems.map((item, index) => {
              const Icon = locationIcons[index];
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

      {/* 20. Choosing a region */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("choosing.eyebrow")}
            title={t("choosing.title")}
            description={t("choosing.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <DiagramNode>{t("network.regionLabel")}</DiagramNode>
              <DiagramDivider />
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {choosingItems.map((item, index) => {
                  const Icon = choosingIcons[index];
                  return (
                    <div key={item} className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-[11px] font-medium text-foreground">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">{t("choosing.note")}</p>
        </Container>
      </section>

      {/* 21. Transparency */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
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

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild>
              <Link href="/company/infrastructure">
                {t("transparency.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://docs.zenthcloud.com" target="_blank" rel="noreferrer">
                Documentation <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 22. Architecture */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("architecture.eyebrow")}
            title={t("architecture.title")}
            description={t("architecture.description")}
          />

          <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <DiagramNode accent>Zenth Cloud</DiagramNode>
              <DiagramDivider />
              <DiagramNode>Cloud Platform</DiagramNode>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    {t("network.regionLabel")}
                  </div>
                ))}
              </div>
              <DiagramDivider />
              <div className="grid w-full grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-lg border border-border bg-muted p-3 text-center text-xs font-semibold text-foreground">
                    {t("network.datacenterLabel")}
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

          <p className="mt-8 text-center text-xs text-muted-foreground">{t("architecture.note")}</p>
        </Container>
      </section>

      {/* 23. CTA final */}
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
                <Link href="/company/infrastructure">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
