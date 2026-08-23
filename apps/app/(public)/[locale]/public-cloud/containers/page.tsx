import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  Cloud,
  Code2,
  Container,
  Database,
  GitBranch,
  Globe,
  HardDrive,
  LayoutGrid,
  Lock,
  Network,
  RotateCcw,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container as PageContainer } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.containers.meta");

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

export default async function ContainersPage() {
  const t = await getTranslations("Public.containers");

  const envItems = [
    { label: t("envConfig.items.0"), icon: Terminal },
    { label: t("envConfig.items.1"), icon: Lock },
    { label: t("envConfig.items.2"), icon: Settings },
    { label: t("envConfig.items.3"), icon: Network },
    { label: t("envConfig.items.4"), icon: Zap },
  ];

  const scalingItems = [
    { label: t("scaling.items.0"), icon: ArrowUpRight },
    { label: t("scaling.items.1"), icon: ArrowDownToLine },
    { label: t("scaling.items.2"), icon: Boxes },
    { label: t("scaling.items.3"), icon: Zap },
    { label: t("scaling.items.4"), icon: RotateCcw },
  ];

  const logsItems = [
    { label: t("logsMonitoring.items.0"), icon: Terminal },
    { label: t("logsMonitoring.items.1"), icon: Activity },
    { label: t("logsMonitoring.items.2"), icon: Activity },
    { label: t("logsMonitoring.items.3"), icon: Network },
    { label: t("logsMonitoring.items.4"), icon: RotateCcw },
    { label: t("logsMonitoring.items.5"), icon: ShieldCheck },
    { label: t("logsMonitoring.items.6"), icon: Check },
  ];

  const healthItems = [
    { label: t("healthChecks.items.0"), icon: Check },
    { label: t("healthChecks.items.1"), icon: Activity },
    { label: t("healthChecks.items.2"), icon: RotateCcw },
  ];

  const developerFeatures = [
    { label: t("developers.features.0"), icon: GitBranch },
    { label: t("developers.features.1"), icon: RotateCcw },
    { label: t("developers.features.2"), icon: Code2 },
    { label: t("developers.features.3"), icon: Terminal },
    { label: t("developers.features.4"), icon: Boxes },
    { label: t("developers.features.5"), icon: Zap },
  ];

  const openSourceBenefits = [
    { label: t("openSource.benefits.0"), icon: Boxes },
    { label: t("openSource.benefits.1"), icon: Cloud },
    { label: t("openSource.benefits.2"), icon: Globe },
    { label: t("openSource.benefits.3"), icon: ArrowUpRight },
    { label: t("openSource.benefits.4"), icon: Lock },
  ];

  const managedLevels = [
    { key: "self", icon: Server, accent: "text-primary", bg: "bg-primary/10" },
    { key: "platform", icon: Container, accent: "text-chart-4", bg: "bg-chart-4/10" },
    { key: "managed", icon: Settings, accent: "text-chart-5", bg: "bg-chart-5/10" },
  ];

  const securityItems = [
    { label: t("security.items.0"), icon: LayoutGrid },
    { label: t("security.items.1"), icon: Shield },
    { label: t("security.items.2"), icon: Network },
    { label: t("security.items.3"), icon: Lock },
    { label: t("security.items.4"), icon: Lock },
    { label: t("security.items.5"), icon: ShieldCheck },
    { label: t("security.items.6"), icon: Cloud },
    { label: t("security.items.7"), icon: Activity },
  ];

  const useCaseIcons = [
    Globe,
    Code2,
    RotateCcw,
    GitBranch,
    Boxes,
  ];

  const crossSellItems = [
    { key: "compute", icon: Server, href: "/public-cloud/compute" },
    { key: "storage", icon: HardDrive, href: "/public-cloud/storage" },
    { key: "networking", icon: Network, href: "/public-cloud/networking" },
    { key: "databases", icon: Database, href: "/public-cloud/databases" },
    { key: "kubernetes", icon: Boxes, href: "/public-cloud/containers" },
    { key: "backup", icon: ShieldCheck, href: "/public-cloud/backup" },
  ];

  return (
    <>
      {/* 1. Hero */}
      <section
        aria-label={t("hero.badge")}
        className="relative flex flex-col overflow-hidden text-white min-h-112 md:min-h-128"
        style={{
          background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #ea580c 100%)",
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
                  <Link href="#deploy">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-8 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-xl">
                      <Container className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <Boxes className="h-8 w-8 text-white/90" />
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <GitBranch className="h-8 w-8 text-white/90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 2. From code to running application */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("codeToApp.title")} />

          <div className="mt-10 rounded-xl border border-border bg-muted p-6 md:p-10 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <NetworkNode>Code</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>Container Image</NetworkNode>
              <NetworkLine vertical />
              <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                Zenth Cloud
              </div>
              <NetworkLine vertical />
              <div className="grid w-full max-w-md grid-cols-2 gap-3">
                <NetworkNode>Compute</NetworkNode>
                <NetworkNode>Networking</NetworkNode>
                <NetworkNode>Storage</NetworkNode>
                <NetworkNode>Monitoring</NetworkNode>
              </div>
              <NetworkLine vertical />
              <NetworkNode>Running Application</NetworkNode>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 3. Deploy your containers */}
      <section id="deploy" className="border-y border-border bg-muted py-16 md:py-24 scroll-mt-20">
        <PageContainer>
          <SectionHeader title={t("deploy.title")} description={t("deploy.description")} />

          <div className="mt-10 rounded-xl border border-border bg-background p-6 md:p-10 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <NetworkNode>Container Image</NetworkNode>
              <NetworkLine vertical />
              <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                Deploy
              </div>
              <NetworkLine vertical />
              <NetworkNode>Container Instance</NetworkNode>
              <NetworkLine vertical />
              <div className="grid w-full max-w-md grid-cols-2 gap-3">
                <NetworkNode>CPU / RAM</NetworkNode>
                <NetworkNode>Network</NetworkNode>
                <NetworkNode>Storage</NetworkNode>
                <NetworkNode>Logs</NetworkNode>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 4. Docker & OCI + Registry */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Container className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("dockerOci.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("dockerOci.description")}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Cloud className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("registry.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("registry.description")}
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 5. Persistent Storage + Networking */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
                title={t("persistentStorage.title")}
                description={t("persistentStorage.description")}
              />
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/storage">
                    {t("persistentStorage.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Container</NetworkNode>
                <NetworkLine vertical />
                <div className="grid w-full max-w-xs grid-cols-1 gap-3">
                  <NetworkNode>Ephemeral filesystem</NetworkNode>
                  <NetworkNode>Persistent Volume</NetworkNode>
                </div>
                <NetworkLine vertical />
                <NetworkNode>Storage</NetworkNode>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 6. Networking */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Internet</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Ingress / Load Balancer</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Container</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Private Network</NetworkNode>
                <NetworkLine vertical />
                <div className="grid w-full max-w-xs grid-cols-2 gap-3">
                  <NetworkNode>Database</NetworkNode>
                  <NetworkNode>Storage</NetworkNode>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader
                centered={false}
                title={t("networking.title")}
                description={t("networking.description")}
              />
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/networking">
                    {t("networking.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 7. Environment configuration */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("envConfig.title")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {envItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 8. Scaling */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("scaling.title")} description={t("scaling.description")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {scalingItems.map((item) => {
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

          <p className="mt-8 text-center text-sm text-muted-foreground">{t("scaling.note")}</p>
        </PageContainer>
      </section>

      {/* 9. Safer deployments */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
                title={t("zeroDowntime.title")}
                description={t("zeroDowntime.description")}
              />
              <p className="mt-4 text-sm text-muted-foreground">{t("zeroDowntime.note")}</p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Version A</NetworkNode>
                <div className="text-xs text-muted-foreground">Running</div>
                <NetworkLine vertical />
                <NetworkNode>Version B</NetworkNode>
                <div className="text-xs text-muted-foreground">Starting</div>
                <NetworkLine vertical />
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  Traffic switch
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 10. Logs & Monitoring + Health checks */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                centered={false}
                title={t("logsMonitoring.title")}
                description={t("logsMonitoring.description")}
              />
              <div className="mt-6 grid gap-3">
                {logsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <SectionHeader
                centered={false}
                title={t("healthChecks.title")}
                description={t("healthChecks.description")}
              />
              <div className="mt-6 grid gap-3">
                {healthItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 11. Comparison */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("comparison.title")} />

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-160 border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left font-semibold text-foreground">{t("comparison.title")}</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">VPS</th>
                  <th className="px-4 py-3 text-left font-semibold text-primary">Containers</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Kubernetes</th>
                </tr>
              </thead>
              <tbody>
                {t.raw("comparison.rows").map((row: string, index: number) => (
                  <tr key={row} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t(`comparison.vps.${index}`)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t(`comparison.containers.${index}`)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t(`comparison.kubernetes.${index}`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageContainer>
      </section>

      {/* 12. Developers */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
                title={t("developers.title")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {developerFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted p-6 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-auto text-muted-foreground">cli</span>
              </div>
              <pre className="text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`zenthcloud containers deploy \\
  --image registry.zenthcloud.com/myapp:v1.2.0 \\
  --name api-prod \\
  --port 8080 \\
  --env NODE_ENV=production`}
              </pre>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 13. Open source */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
                title={t("openSource.title")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                Open standards. Portable workloads.
              </blockquote>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {openSourceBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.label} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{benefit.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 14. Managed Containers */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("managed.title")} description={t("managed.description")} />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {managedLevels.map((level) => {
              const Icon = level.icon;
              const featureCount = t.raw(`managed.${level.key}.features`).length;
              return (
                <div
                  key={level.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${level.bg} ${level.accent}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {t(`managed.${level.key}.title`)}
                  </h3>
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

      {/* 15. Security */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("security.title")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {securityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm">
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
        </PageContainer>
      </section>

      {/* 16. Pricing */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader title={t("pricing.title")} description={t("pricing.description")} />

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {t.raw("pricing.items").map((item: string) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
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

      {/* 17. Use cases */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader title={t("useCases.title")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                <Link href="/public-cloud/containers">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
