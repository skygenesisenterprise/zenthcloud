import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Check,
  ArrowRight,
  ArrowUpRight,
  Server,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Shield,
  Database,
  Brain,
  Zap,
  Boxes,
  Container as ContainerIcon,
  Terminal,
  GitBranch,
  Activity,
  Archive,
  RotateCcw,
  Settings,
  Users,
  Building2,
  Layers,
  Globe,
  MapPin,
  Wifi,
  Waypoints,
  LayoutGrid,
  FileText,
  MemoryStick,
  Gauge,
  KeyRound,
  Flame,
  Code2,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.dedicatedCloud.meta");

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

export default async function DedicatedCloudPage() {
  const t = await getTranslations("Public.dedicatedCloud");

  const resourceItems = [
    { label: t("resources.items.0"), icon: Cpu },
    { label: t("resources.items.1"), icon: MemoryStick },
    { label: t("resources.items.2"), icon: HardDrive },
    { label: t("resources.items.3"), icon: Flame },
    { label: t("resources.items.4"), icon: Network },
    { label: t("resources.items.5"), icon: Gauge },
    { label: t("resources.items.6"), icon: Database },
    { label: t("resources.items.7"), icon: Layers },
  ];

  const hardwareProfiles = [
    { key: "compute", icon: Cpu, accent: "bg-primary" },
    { key: "memory", icon: MemoryStick, accent: "bg-chart-2" },
    { key: "storage", icon: HardDrive, accent: "bg-chart-4" },
    { key: "gpu", icon: Flame, accent: "bg-chart-5" },
  ];

  const managementItems = [
    { label: t("management.items.0"), icon: Zap },
    { label: t("management.items.1"), icon: Settings },
    { label: t("management.items.2"), icon: Activity },
    { label: t("management.items.3"), icon: Network },
    { label: t("management.items.4"), icon: HardDrive },
    { label: t("management.items.5"), icon: RotateCcw },
    { label: t("management.items.6"), icon: Code2 },
    { label: t("management.items.7"), icon: Terminal },
    { label: t("management.items.8"), icon: GitBranch },
  ];

  const controlItems = [
    { label: t("control.items.0"), icon: Cpu },
    { label: t("control.items.1"), icon: Layers },
    { label: t("control.items.2"), icon: Network },
    { label: t("control.items.3"), icon: HardDrive },
    { label: t("control.items.4"), icon: Shield },
    { label: t("control.items.5"), icon: Lock },
    { label: t("control.items.6"), icon: MapPin },
  ];

  const isolationBenefits = [
    { label: t("isolation.benefits.0"), icon: Lock },
    { label: t("isolation.benefits.1"), icon: Gauge },
    { label: t("isolation.benefits.2"), icon: FileText },
    { label: t("isolation.benefits.3"), icon: Layers },
  ];

  const networkingItems = [
    { label: t("networking.items.0"), icon: Wifi },
    { label: t("networking.items.1"), icon: Lock },
    { label: t("networking.items.2"), icon: LayoutGrid },
    { label: t("networking.items.3"), icon: Shield },
    { label: t("networking.items.4"), icon: Zap },
    { label: t("networking.items.5"), icon: Waypoints },
    { label: t("networking.items.6"), icon: Globe },
    { label: t("networking.items.7"), icon: Gauge },
  ];

  const storageItems = [
    { label: t("storage.items.0"), icon: Zap },
    { label: t("storage.items.1"), icon: HardDrive },
    { label: t("storage.items.2"), icon: Server },
    { label: t("storage.items.3"), icon: Network },
    { label: t("storage.items.4"), icon: Archive },
  ];

  const securityItems = [
    { label: t("security.items.0"), icon: Server },
    { label: t("security.items.1"), icon: Network },
    { label: t("security.items.2"), icon: Shield },
    { label: t("security.items.3"), icon: KeyRound },
    { label: t("security.items.4"), icon: Activity },
    { label: t("security.items.5"), icon: Archive },
  ];

  const managedLevels = [
    { key: "self", icon: Users, accent: "text-primary", bg: "bg-primary/10" },
    { key: "managed", icon: Settings, accent: "text-chart-4", bg: "bg-chart-4/10" },
    { key: "fullyManaged", icon: Building2, accent: "text-chart-5", bg: "bg-chart-5/10" },
  ];

  const useCaseIcons = [
    Building2,
    Database,
    Boxes,
    Brain,
    Zap,
    FileText,
    Server,
  ];

  const openInfraItems = [
    { label: t("openInfrastructure.items.0"), icon: Code2 },
    { label: t("openInfrastructure.items.1"), icon: Globe },
    { label: t("openInfrastructure.items.2"), icon: Terminal },
    { label: t("openInfrastructure.items.3"), icon: Container },
    { label: t("openInfrastructure.items.4"), icon: Layers },
    { label: t("openInfrastructure.items.5"), icon: KeyRound },
    { label: t("openInfrastructure.items.6"), icon: Boxes },
  ];

  const developerItems = [
    { label: t("developers.items.0"), icon: Code2 },
    { label: t("developers.items.1"), icon: Terminal },
    { label: t("developers.items.2"), icon: Boxes },
    { label: t("developers.items.3"), icon: Zap },
    { label: t("developers.items.4"), icon: GitBranch },
    { label: t("developers.items.5"), icon: Container },
    { label: t("developers.items.6"), icon: Layers },
  ];

  const enterpriseItems = [
    { label: t("enterprise.items.0"), icon: Settings },
    { label: t("enterprise.items.1"), icon: Users },
    { label: t("enterprise.items.2"), icon: FileText },
    { label: t("enterprise.items.3"), icon: Network },
    { label: t("enterprise.items.4"), icon: Archive },
    { label: t("enterprise.items.5"), icon: Activity },
    { label: t("enterprise.items.6"), icon: Headphones },
    { label: t("enterprise.items.7"), icon: Server },
  ];

  const comparisonRows = t.raw("comparison.rows") as Array<{
    label: string;
    public: string;
    dedicated: string;
  }>;

  const vsServerRows = t.raw("vsDedicatedServer.rows") as Array<{
    label: string;
    server: string;
    cloud: string;
  }>;

  const whatIsLayers = t.raw("whatIs.layers") as Array<{
    key: string;
    title: string;
    description: string;
  }>;

  const vsPrivateSteps = t.raw("vsPrivateCloud.steps") as Array<{
    title: string;
    description: string;
  }>;

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
              <Link href="/contact">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 2. Public Cloud vs Dedicated Cloud */}
      <section className="py-16 md:py-24 bg-background">
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
                  <th className="px-4 py-3 text-left font-semibold text-primary">{t("comparison.dedicatedLabel")}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.public}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{row.dedicated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("comparison.note")}</p>
        </Container>
      </section>

      {/* 3. What is Dedicated Cloud */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("whatIs.eyebrow")}
                title={t("whatIs.title")}
                description={t("whatIs.description")}
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                {whatIsLayers.map((layer, index) => (
                  <React.Fragment key={layer.key}>
                    <div className="w-full max-w-sm rounded-lg border border-border bg-muted px-4 py-3">
                      <p className="text-sm font-bold text-foreground">{layer.title}</p>
                      <p className="text-xs text-muted-foreground">{layer.description}</p>
                    </div>
                    {index < whatIsLayers.length - 1 && <NetworkLine vertical />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Dedicated resources */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("resources.eyebrow")}
            title={t("resources.title")}
            description={t("resources.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resourceItems.map((item) => {
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

      {/* 5. Hardware choices */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("hardware.eyebrow")}
            title={t("hardware.title")}
            description={t("hardware.description")}
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {hardwareProfiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <div
                  key={profile.key}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`h-1.5 rounded-t-xl ${profile.accent}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-foreground">{t(`hardware.${profile.key}.title`)}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t(`hardware.${profile.key}.description`)}
                    </p>
                    <p className="mt-4 text-xs text-muted-foreground">{t(`hardware.${profile.key}.useCases`)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Architecture */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("architecture.eyebrow")}
                title={t("architecture.title")}
                description={t("architecture.description")}
              />
            </div>

            <div className="rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Zenth Cloud Control Plane</NetworkNode>
                <NetworkLine vertical />
                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  <NetworkNode className="text-xs">Compute</NetworkNode>
                  <NetworkNode className="text-xs">Network</NetworkNode>
                  <NetworkNode className="text-xs">Storage</NetworkNode>
                </div>
                <NetworkLine vertical />
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  Dedicated Hardware
                </div>
                <NetworkLine vertical />
                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  <NetworkNode className="text-xs">VM</NetworkNode>
                  <NetworkNode className="text-xs">VM</NetworkNode>
                  <NetworkNode className="text-xs">Container</NetworkNode>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Cloud Management */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("management.eyebrow")}
                title={t("management.title")}
                description={t("management.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {managementItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="https://manager.zenthcloud.com" target="_blank" rel="noreferrer">
                    {t("management.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-slate-950 p-6 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-auto text-slate-400">zenthcloud-cli</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`$ zenthcloud dedicated-cloud create \\
    --profile compute-optimized \\
    --region eu-west \\
    --network prod-vpc

Creating dedicated cloud...
Dedicated cloud ready.`}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Full infrastructure control */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("control.eyebrow")}
            title={t("control.title")}
            description={t("control.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {controlItems.map((item) => {
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

      {/* 9. Isolation */}
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
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {isolationBenefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{benefit.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <div className="grid w-full max-w-sm grid-cols-2 gap-4">
                  <NetworkNode>Customer A</NetworkNode>
                  <NetworkNode>Customer B</NetworkNode>
                </div>
                <NetworkLine vertical />
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  Dedicated Hardware
                </div>
                <p className="text-xs text-muted-foreground">Customer A · matériel réservé</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. Performance predictability */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("performance.eyebrow")}
                title={t("performance.title")}
                description={t("performance.description")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground">{t("performance.sharedLabel")}</p>
                <svg viewBox="0 0 200 60" className="mt-4 h-16 w-full" aria-hidden="true">
                  <path
                    d="M0,40 L30,40 L40,10 L55,40 L70,25 L85,45 L100,15 L115,40 L130,30 L145,42 L160,20 L175,38 L200,38"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-chart-4"
                  />
                </svg>
              </div>
              <div className="rounded-xl border border-primary bg-primary/5 p-6 shadow-sm">
                <p className="text-sm font-semibold text-foreground">{t("performance.dedicatedLabel")}</p>
                <svg viewBox="0 0 200 60" className="mt-4 h-16 w-full" aria-hidden="true">
                  <path
                    d="M0,25 L200,25"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 11. Networking + Storage */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("networking.eyebrow")}
                title={t("networking.title")}
                description={t("networking.description")}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {networkingItems.map((item) => {
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
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/networking">
                    {t("networking.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("storage.eyebrow")}
                title={t("storage.title")}
                description={t("storage.description")}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {storageItems.map((item) => {
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
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/storage">
                    {t("storage.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 12. Virtualization */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("virtualization.eyebrow")}
                title={t("virtualization.title")}
                description={t("virtualization.description")}
              />
              <p className="text-sm text-muted-foreground">{t("virtualization.note")}</p>
            </div>

            <div className="rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Dedicated Server</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Hypervisor</NetworkNode>
                <NetworkLine vertical />
                <div className="grid w-full max-w-sm grid-cols-3 gap-3">
                  <NetworkNode className="text-xs">VM</NetworkNode>
                  <NetworkNode className="text-xs">VM</NetworkNode>
                  <NetworkNode className="text-xs">VM</NetworkNode>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 13. Containers + Kubernetes + GPU */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("workloads.eyebrow")}
            title={t("workloads.title")}
            description={t("workloads.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { key: "containers", icon: ContainerIcon, href: "/public-cloud/containers" },
              { key: "kubernetes", icon: Boxes, href: "/public-cloud/containers" },
              { key: "gpuAi", icon: Flame, href: "/public-cloud/gpu-and-ai" },
            ].map((item) => {
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
                    <h3 className="text-lg font-bold text-foreground">{t(`workloads.${item.key}.title`)}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t(`workloads.${item.key}.description`)}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      {t(`workloads.${item.key}.cta`)} <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 14. Security + Backup */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("security.eyebrow")}
                title={t("security.title")}
                description={t("security.description")}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/security">
                    {t("security.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("backup.eyebrow")}
                title={t("backup.title")}
                description={t("backup.description")}
              />
              <div className="mt-6 rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
                <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                  <NetworkNode>Dedicated Infrastructure</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>Backup</NetworkNode>
                  <NetworkLine vertical />
                  <NetworkNode>Recovery Environment</NetworkNode>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/backup">
                    {t("backup.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 15. Managed vs Self-managed */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("managed.eyebrow")}
            title={t("managed.title")}
            description={t("managed.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {managedLevels.map((level) => {
              const Icon = level.icon;
              const features = t.raw(`managed.${level.key}.features`) as string[];
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
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 16. Dedicated Cloud vs Dedicated Server */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("vsDedicatedServer.eyebrow")}
            title={t("vsDedicatedServer.title")}
            description={t("vsDedicatedServer.description")}
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-xl border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left font-semibold text-foreground" />
                  <th className="px-4 py-3 text-left font-semibold text-foreground">{t("vsDedicatedServer.serverLabel")}</th>
                  <th className="px-4 py-3 text-left font-semibold text-primary">{t("vsDedicatedServer.cloudLabel")}</th>
                </tr>
              </thead>
              <tbody>
                {vsServerRows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.server}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{row.cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-bold text-foreground">{t("vsDedicatedServer.serverLabel")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("vsDedicatedServer.serverMessage")}</p>
            </div>
            <div className="rounded-xl border border-primary bg-primary/5 p-6 shadow-sm">
              <p className="text-sm font-bold text-foreground">{t("vsDedicatedServer.cloudLabel")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("vsDedicatedServer.cloudMessage")}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 17. Dedicated Cloud vs Private Cloud */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("vsPrivateCloud.eyebrow")}
                title={t("vsPrivateCloud.title")}
                description={t("vsPrivateCloud.description")}
              />
            </div>

            <ol className="relative space-y-4 border-l border-border pl-8">
              {vsPrivateSteps.map((step, index) => (
                <li key={step.title} className="relative">
                  <span
                    className={`absolute -left-9.25 top-4 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border-2 ${
                      index === 1
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background"
                    }`}
                  >
                    {index === 1 && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                  </span>
                  <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 18. Use cases */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("useCases.eyebrow")}
            title={t("useCases.title")}
            description={t("useCases.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* 19. Lifecycle */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("lifecycle.eyebrow")}
            title={t("lifecycle.title")}
            description={t("lifecycle.description")}
          />

          <div className="flex flex-col items-center gap-4">
            {(t.raw("lifecycle.steps") as string[]).map((step, index, steps) => (
              <React.Fragment key={step}>
                <div className="rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground shadow-sm">
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <ArrowUpRight className="h-5 w-5 rotate-90 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </Container>
      </section>

      {/* 20. Upgrade path */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("upgradePath.eyebrow")}
            title={t("upgradePath.title")}
            description={t("upgradePath.description")}
          />

          <div className="flex flex-wrap justify-center gap-2">
            {(t.raw("upgradePath.upgrades") as string[]).map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* 21. Pricing */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("pricing.eyebrow")}
            title={t("pricing.title")}
            description={t("pricing.description")}
          />

          <div className="flex flex-wrap justify-center gap-2">
            {(t.raw("pricing.items") as string[]).map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("pricing.note")}</p>
        </Container>
      </section>

      {/* 22. Open infrastructure */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("openInfrastructure.eyebrow")}
            title={t("openInfrastructure.title")}
            description={t("openInfrastructure.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {openInfraItems.map((item) => {
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

      {/* 23. Developer experience */}
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
                {developerItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
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
                <span className="ml-auto text-slate-400">zenthcloud-cli</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`$ zenthcloud dedicated-cloud node add \\
    --profile memory-optimized \\
    --count 2

Adding nodes...
Nodes available.`}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* 24. Enterprise experience */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("enterprise.eyebrow")}
            title={t("enterprise.title")}
            description={t("enterprise.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {enterpriseItems.map((item) => {
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

      {/* 25. CTA final */}
      <section className="border-t border-border py-16 md:py-24 bg-muted">
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
