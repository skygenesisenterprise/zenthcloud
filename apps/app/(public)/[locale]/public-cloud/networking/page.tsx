import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Boxes,
  Check,
  Cloud,
  Code2,
  Database,
  Globe,
  HardDrive,
  LayoutGrid,
  Lock,
  Network,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Terminal,
  Users,
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
  const t = await getTranslations("Public.networking.meta");

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

export default async function NetworkingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Public.networking");

  const pillars = [
    { key: "publicNetwork", icon: Globe },
    { key: "privateNetwork", icon: Lock },
    { key: "firewall", icon: Shield },
    { key: "segmentation", icon: LayoutGrid },
    { key: "loadBalancing", icon: Zap },
    { key: "ipv6", icon: Globe },
  ];

  const networkFor = [
    { key: "networkForCompute", icon: Server, href: "/public-cloud/compute" },
    { key: "networkForStorage", icon: Database, href: "/public-cloud/storage" },
    { key: "networkForDatabases", icon: Database, href: "/public-cloud/databases" },
  ];

  const automationFeatures = [
    { label: t("automation.items.0"), icon: Code2 },
    { label: t("automation.items.1"), icon: Zap },
    { label: t("automation.items.2"), icon: Boxes },
    { label: t("automation.items.3"), icon: Terminal },
    { label: t("automation.items.4"), icon: Network },
    { label: t("automation.items.5"), icon: Shield },
  ];

  const securityItems = [
    { label: t("security.items.0"), icon: Lock },
    { label: t("security.items.1"), icon: Shield },
    { label: t("security.items.2"), icon: LayoutGrid },
    { label: t("security.items.3"), icon: Users },
    { label: t("security.items.4"), icon: Network },
    { label: t("security.items.5"), icon: Server },
  ];

  const managedLevels = [
    { key: "self", icon: Users, accent: "text-primary", bg: "bg-primary/10" },
    { key: "assisted", icon: Code2, accent: "text-chart-4", bg: "bg-chart-4/10" },
    { key: "managed", icon: Settings, accent: "text-chart-5", bg: "bg-chart-5/10" },
  ];

  const openSourceBenefits = [
    { label: t("openSource.benefits.0"), icon: ShieldCheck },
    { label: t("openSource.benefits.1"), icon: Network },
    { label: t("openSource.benefits.2"), icon: Zap },
    { label: t("openSource.benefits.3"), icon: Globe },
    { label: t("openSource.benefits.4"), icon: Lock },
  ];

  const useCaseIcons = [
    Globe,
    Cloud,
    Server,
    Database,
    Boxes,
    Shield,
  ];

  const crossSellItems = [
    { key: "compute", icon: Server, href: "/public-cloud/compute" },
    { key: "storage", icon: Database, href: "/public-cloud/storage" },
    { key: "backup", icon: ShieldCheck, href: "/public-cloud/backup" },
    { key: "databases", icon: Database, href: "/public-cloud/databases" },
    { key: "security", icon: Shield, href: "/public-cloud/security" },
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
              <Link href={localizeHref("/public-cloud/compute", locale)}>
                {t("hero.secondaryCta")}
              </Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* 2. Architecture réseau */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader
            eyebrow={t("architecture.eyebrow")}
            title={t("architecture.title")}
            description={t("architecture.description")}
          />

          <div className="mx-auto max-w-2xl">
            <DiagramPanel label={`${t("architecture.title")} — ${t("architecture.description")}`}>
              <FlowNode icon={Globe}>Internet</FlowNode>
              <FlowConnector />
              <FlowNode icon={Network}>Public Network</FlowNode>
              <FlowConnector />
              <FlowHub icon={Zap}>Load Balancer</FlowHub>
              <FlowConnector />
              <div className="grid grid-cols-2 gap-3">
                <FlowNode variant="card" icon={Server}>Compute</FlowNode>
                <FlowNode variant="card" icon={Server}>Compute</FlowNode>
              </div>
              <FlowConnector />
              <FlowNode icon={Lock}>Private Network</FlowNode>
              <FlowConnector />
              <div className="grid grid-cols-2 gap-3">
                <FlowNode variant="card" icon={HardDrive}>Storage</FlowNode>
                <FlowNode variant="card" icon={Database}>Database</FlowNode>
              </div>
            </DiagramPanel>
          </div>
        </PageContainer>
      </section>

      {/* 3. Piliers Networking */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const itemCount = t.raw(`${pillar.key}.items`).length;
              return (
                <div key={pillar.key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {t(`${pillar.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`${pillar.key}.description`)}
                  </p>
                  <ul className="mt-4 grid grid-cols-1 gap-2">
                    {Array.from({ length: itemCount }, (_, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {t(`${pillar.key}.items.${i}`)}
                      </li>
                    ))}
                  </ul>
                  {pillar.key === "loadBalancing" && (
                    <p className="mt-4 text-xs text-muted-foreground">{t("loadBalancing.note")}</p>
                  )}
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 4. Firewall & segmentation */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("firewall.eyebrow")}
                title={t("firewall.title")}
                description={t("firewall.description")}
              />
              <div className="mt-8">
                <Button asChild className={WHITE_BUTTON_CLASSES}>
                  <Link href={localizeHref("/public-cloud/security", locale)}>
                    {t("security.title")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            <DiagramPanel label={`${t("firewall.title")} — ${t("firewall.description")}`}>
              <FlowNode icon={Globe}>Internet</FlowNode>
              <FlowConnector />
              <FlowHub icon={Shield}>Firewall</FlowHub>
              <FlowConnector />
              <div className="grid grid-cols-1 gap-3">
                <FlowNode>HTTPS → Application</FlowNode>
                <FlowNode>SSH → Administration</FlowNode>
                <FlowNode>DENY → Everything else</FlowNode>
              </div>
            </DiagramPanel>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2 lg:items-center">
            <DiagramPanel label={`${t("segmentation.title")} — ${t("segmentation.description")}`}>
              <FlowNode icon={Globe}>Public Zone</FlowNode>
              <FlowConnector />
              <FlowHub icon={Code2}>Application Zone</FlowHub>
              <FlowConnector />
              <FlowNode icon={Database}>Database Zone</FlowNode>
            </DiagramPanel>
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("segmentation.eyebrow")}
                title={t("segmentation.title")}
                description={t("segmentation.description")}
              />
              <ul className="mt-6 space-y-2">
                {t.raw("segmentation.items").map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 5. Réseau pour vos services */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-5 md:grid-cols-3">
            {networkFor.map((item) => {
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

      {/* 6. Automatisation */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("automation.eyebrow")}
                title={t("automation.title")}
                description={t("automation.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {automationFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{feature.label}</p>
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
                <span className="ml-auto text-slate-400">api</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`curl -X POST https://api.zenthcloud.com/v1/networks \\\\
  -H "Authorization: Bearer $TOKEN" \\\\
  -H "Content-Type: application/json" \\\\
  -d '{"name":"prod-vpc","cidr":"10.0.0.0/16"}'`}
              </pre>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 7. Sécurité & transparence */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader
            eyebrow={t("security.eyebrow")}
            title={t("security.title")}
            description={t("security.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("openSource.eyebrow")}
                title={t("openSource.title")}
                description={t("openSource.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                Open technologies. Open architecture. Less lock-in.
              </blockquote>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {openSourceBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.label} className="flex items-start gap-3 rounded-xl border border-border bg-muted p-4">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{benefit.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 8. Niveaux de gestion */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
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
                <div key={level.key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
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

      {/* 9. Tarifs */}
      <section className="py-16 md:py-24 bg-background">
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
                className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
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
        </PageContainer>
      </section>

      {/* 10. Passer à l'action */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader
            eyebrow={t("crossSelling.eyebrow")}
            title={t("crossSelling.title")}
            description={t("crossSelling.description")}
          />

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
                <Link href={localizeHref("/public-cloud/compute", locale)}>
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
