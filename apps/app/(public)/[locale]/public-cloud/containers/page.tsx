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
  Cpu,
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
  const t = await getTranslations("Public.containers.meta");

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

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  items?: ReadonlyArray<{ label: string }>;
  note?: string;
}

function FeatureCard({ icon: Icon, title, description, items, note }: FeatureCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      {description && (
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
      {items && items.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground"
            >
              <Check className="h-3 w-3 text-primary" aria-hidden="true" />
              {item.label}
            </span>
          ))}
        </div>
      )}
      {note && <p className="mt-4 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

export default async function ContainersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
              <Link href="#deploy">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* 2. Du code à la production */}
      <section id="deploy" className="border-y border-border bg-muted py-16 md:py-24 scroll-mt-20">
        <PageContainer>
          <SectionHeader
            eyebrow={t("workflow.eyebrow")}
            title={t("workflow.title")}
            description={t("workflow.description")}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-bold text-foreground">{t("deploy.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t("deploy.description")}
                </p>
              </div>
              <DiagramPanel label={`${t("deploy.title")} — ${t("workflow.title")}`}>
                <FlowNode icon={Code2}>Code</FlowNode>
                <FlowConnector />
                <FlowNode icon={Container}>Container Image</FlowNode>
                <FlowConnector />
                <FlowHub icon={Zap}>Deploy</FlowHub>
                <FlowConnector />
                <FlowNode icon={Container}>Container Instance</FlowNode>
                <FlowConnector />
                <div className="grid grid-cols-2 gap-3">
                  <FlowNode variant="card" icon={Cpu}>CPU / RAM</FlowNode>
                  <FlowNode variant="card" icon={Network}>Network</FlowNode>
                  <FlowNode variant="card" icon={HardDrive}>Storage</FlowNode>
                  <FlowNode variant="card" icon={Activity}>Logs</FlowNode>
                </div>
                <FlowConnector />
                <FlowNode icon={Boxes}>Running Application</FlowNode>
              </DiagramPanel>
            </div>

            <div className="flex flex-col">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-bold text-foreground">{t("zeroDowntime.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {t("zeroDowntime.description")}
                </p>
              </div>
              <DiagramPanel label={`${t("zeroDowntime.title")} — ${t("zeroDowntime.description")}`}>
                <FlowNode sub="Running">Version A</FlowNode>
                <FlowConnector />
                <FlowNode sub="Starting">Version B</FlowNode>
                <FlowConnector />
                <FlowHub icon={RotateCcw}>Traffic switch</FlowHub>
              </DiagramPanel>
              <p className="mt-4 text-center text-xs text-muted-foreground">{t("zeroDowntime.note")}</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 3. Fonctionnalités clés */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader
            eyebrow={t("features.eyebrow")}
            title={t("features.title")}
            description={t("features.description")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FeatureCard icon={Container} title={t("dockerOci.title")} description={t("dockerOci.description")} />
            <FeatureCard icon={Cloud} title={t("registry.title")} description={t("registry.description")} />
            <FeatureCard icon={Settings} title={t("envConfig.title")} items={envItems} />
            <FeatureCard icon={ArrowUpRight} title={t("scaling.title")} items={scalingItems} note={t("scaling.note")} />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">{t("useCases.title")} :</span>
            {useCaseIcons.map((Icon, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {t(`useCases.items.${index}`)}
              </span>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* 4. Stockage & Réseau */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("persistentStorage.eyebrow")}
                title={t("persistentStorage.title")}
                description={t("persistentStorage.description")}
              />
              <Button asChild className={WHITE_BUTTON_CLASSES}>
                <Link href={localizeHref("/public-cloud/storage", locale)}>
                  {t("persistentStorage.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <div className="mt-8">
                <DiagramPanel label={`${t("persistentStorage.title")} — ${t("persistentStorage.description")}`}>
                  <FlowNode icon={Container}>Container</FlowNode>
                  <FlowConnector />
                  <div className="grid grid-cols-2 gap-3">
                    <FlowNode variant="card" icon={HardDrive}>Ephemeral filesystem</FlowNode>
                    <FlowNode variant="card" icon={HardDrive}>Persistent Volume</FlowNode>
                  </div>
                  <FlowConnector />
                  <FlowHub icon={Cloud}>Storage</FlowHub>
                </DiagramPanel>
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("networking.eyebrow")}
                title={t("networking.title")}
                description={t("networking.description")}
              />
              <Button asChild className={WHITE_BUTTON_CLASSES}>
                <Link href={localizeHref("/public-cloud/networking", locale)}>
                  {t("networking.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <div className="mt-8">
                <DiagramPanel label={`${t("networking.title")} — ${t("networking.description")}`}>
                  <FlowNode icon={Globe}>Internet</FlowNode>
                  <FlowConnector />
                  <FlowNode icon={Network}>Ingress / Load Balancer</FlowNode>
                  <FlowConnector />
                  <FlowHub icon={Container}>Container</FlowHub>
                  <FlowConnector />
                  <FlowNode icon={Lock}>Private Network</FlowNode>
                  <FlowConnector />
                  <div className="grid grid-cols-2 gap-3">
                    <FlowNode variant="card" icon={Database}>Database</FlowNode>
                    <FlowNode variant="card" icon={HardDrive}>Storage</FlowNode>
                  </div>
                </DiagramPanel>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 5. Observabilité */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("logsMonitoring.eyebrow")}
                title={t("logsMonitoring.title")}
                description={t("logsMonitoring.description")}
              />
              <div className="mt-6 grid gap-3">
                {logsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("healthChecks.eyebrow")}
                title={t("healthChecks.title")}
                description={t("healthChecks.description")}
              />
              <div className="mt-6 grid gap-3">
                {healthItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 6. Sécurité */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader eyebrow={t("security.eyebrow")} title={t("security.title")} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {securityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
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

      {/* 7. Niveaux de gestion */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader
            eyebrow={t("managed.eyebrow")}
            title={t("managed.title")}
            description={t("managed.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {managedLevels.map((level) => {
              const Icon = level.icon;
              const featureCount = t.raw(`managed.${level.key}.features`).length;
              return (
                <div
                  key={level.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${level.bg} ${level.accent}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
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
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
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

      {/* 8. Comparatif */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader eyebrow={t("comparison.eyebrow")} title={t("comparison.title")} />

          <div className="overflow-x-auto">
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

      {/* 9. Développeurs & Open source */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("developers.eyebrow")}
                title={t("developers.title")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {developerFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 rounded-xl border border-border bg-slate-950 p-6 font-mono text-xs shadow-sm">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="ml-auto text-slate-400">cli</span>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`zenthcloud containers deploy \\\\
  --image registry.zenthcloud.com/myapp:v1.2.0 \\\\
  --name api-prod \\\\
  --port 8080 \\\\
  --env NODE_ENV=production`}
                </pre>
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("openSource.eyebrow")}
                title={t("openSource.title")}
              />
              <blockquote className="mt-8 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                Open standards. Portable workloads.
              </blockquote>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {openSourceBenefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{benefit.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 10. Passer à l'action */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
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
                <Link href={localizeHref("/public-cloud/containers", locale)}>
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
