import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  Cloud,
  Code2,
  Database,
  Globe,
  LayoutGrid,
  Lock,
  Network,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.networking.meta");

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

export default async function NetworkingPage() {
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
      <section
        aria-label={t("hero.badge")}
        className="relative flex flex-col overflow-hidden text-white min-h-112 md:min-h-128"
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #0ea5e9 100%)",
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.16),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(0,0,0,0.08),transparent_40%)]" />

        <Container className="relative flex flex-1 items-center py-16 md:py-24">
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
                  <Link href="/public-cloud/compute">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-8 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-xl">
                      <Network className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <Shield className="h-8 w-8 text-white/90" />
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <Globe className="h-8 w-8 text-white/90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Architecture réseau */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader title={t("architecture.title")} description={t("architecture.description")} />

          <div className="mt-10 rounded-xl border border-border bg-muted p-6 md:p-10 shadow-sm">
            <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
              <NetworkNode>Internet</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>Public Network</NetworkNode>
              <NetworkLine vertical />
              <NetworkNode>Load Balancer</NetworkNode>
              <NetworkLine vertical />
              <div className="grid w-full max-w-lg grid-cols-2 gap-4">
                <NetworkNode>Compute</NetworkNode>
                <NetworkNode>Compute</NetworkNode>
              </div>
              <NetworkLine vertical />
              <NetworkNode>Private Network</NetworkNode>
              <NetworkLine vertical />
              <div className="grid w-full max-w-lg grid-cols-2 gap-4">
                <NetworkNode>Storage</NetworkNode>
                <NetworkNode>Database</NetworkNode>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Piliers Networking */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const itemCount = t.raw(`${pillar.key}.items`).length;
              return (
                <div
                  key={pillar.key}
                  className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
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
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
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
        </Container>
      </section>

      {/* 4. Network for Compute / Storage / Databases */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            {networkFor.map((item) => {
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
                    <h3 className="text-lg font-bold text-foreground">{t(`${item.key}.title`)}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t(`${item.key}.description`)}
                  </p>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={item.href}>
                        {t(`${item.key}.cta`)} <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Firewall diagram */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
                title={t("firewall.title")}
                description={t("firewall.description")}
              />
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/security">
                    {t("security.title")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Internet</NetworkNode>
                <NetworkLine vertical />
                <div className="rounded-lg bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground shadow-sm">
                  Firewall
                </div>
                <NetworkLine vertical />
                <div className="grid w-full max-w-xs grid-cols-1 gap-3">
                  <NetworkNode>HTTPS → Application</NetworkNode>
                  <NetworkNode>SSH → Administration</NetworkNode>
                  <NetworkNode>DENY → Everything else</NetworkNode>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Segmentation diagram */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="order-2 lg:order-1 rounded-xl border border-border bg-muted p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <NetworkNode>Public Zone</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Application Zone</NetworkNode>
                <NetworkLine vertical />
                <NetworkNode>Database Zone</NetworkNode>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader
                centered={false}
                title={t("segmentation.title")}
                description={t("segmentation.description")}
              />
              <ul className="mt-6 space-y-2">
                {t.raw("segmentation.items").map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Automation */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
                title={t("automation.title")}
                description={t("automation.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {automationFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.label} className="flex items-start gap-3 rounded-lg border border-border bg-background p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-6 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-auto text-muted-foreground">api</span>
              </div>
              <pre className="text-muted-foreground leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`curl -X POST https://api.zenthcloud.com/v1/networks \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"prod-vpc","cidr":"10.0.0.0/16"}'`}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Security by architecture */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader title={t("security.title")} description={t("security.description")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("security.responsibility")}
          </p>
        </Container>
      </section>

      {/* 9. Managed Networking */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader title={t("managed.title")} description={t("managed.description")} />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {managedLevels.map((level) => {
              const Icon = level.icon;
              const featureCount = t.raw(`managed.${level.key}.features`).length;
              return (
                <div
                  key={level.key}
                  className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all"
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
        </Container>
      </section>

      {/* 10. Open source */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                centered={false}
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
                      <Icon className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{benefit.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 11. Pricing */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
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
        </Container>
      </section>

      {/* 12. Use cases */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader title={t("useCases.title")} />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* 13. Cross-selling */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader title={t("crossSelling.title")} description={t("crossSelling.description")} />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {crossSellItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="rounded-xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-all"
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
        </Container>
      </section>

      {/* 14. CTA final */}
      <section className="py-16 md:py-24 bg-background">
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
                <Link href="/public-cloud/compute">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
