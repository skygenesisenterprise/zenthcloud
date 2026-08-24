import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Archive,
  Boxes,
  Briefcase,
  Building2,
  Camera,
  Check,
  Cloud,
  Code2,
  Cpu,
  Database,
  Eye,
  Gamepad2,
  GitBranch,
  Globe,
  HardDrive,
  Lock,
  Network,
  Puzzle,
  Rocket,
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
  const t = await getTranslations("Public.compute.meta");

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

export default async function ComputePage() {
  const t = await getTranslations("Public.compute");

  const computeTypes = [
    {
      key: "vps",
      icon: Cloud,
      accent: "bg-primary",
    },
    {
      key: "dedicated",
      icon: Server,
      accent: "bg-chart-4",
    },
    {
      key: "enterprise",
      icon: Building2,
      accent: "bg-chart-5",
    },
  ];

  const workloads = [
    {
      key: "generalPurpose",
      icon: Server,
    },
    {
      key: "computeOptimized",
      icon: Cpu,
    },
    {
      key: "memoryOptimized",
      icon: Database,
    },
    {
      key: "storageOptimized",
      icon: HardDrive,
    },
  ];

  const infraItems = [
    { label: t("infrastructure.items.0"), icon: Cpu },
    { label: t("infrastructure.items.1"), icon: Database },
    { label: t("infrastructure.items.2"), icon: HardDrive },
    { label: t("infrastructure.items.3"), icon: Network },
    { label: t("infrastructure.items.4"), icon: Globe },
    { label: t("infrastructure.items.5"), icon: Shield },
    { label: t("infrastructure.items.6"), icon: Boxes },
    { label: t("infrastructure.items.7"), icon: Zap },
    { label: t("infrastructure.items.8"), icon: Camera },
    { label: t("infrastructure.items.9"), icon: Archive },
  ];

  const openSourceBenefits = [
    { label: t("openSource.benefits.0"), icon: Lock },
    { label: t("openSource.benefits.1"), icon: Eye },
    { label: t("openSource.benefits.2"), icon: Puzzle },
    { label: t("openSource.benefits.3"), icon: Rocket },
    { label: t("openSource.benefits.4"), icon: Users },
    { label: t("openSource.benefits.5"), icon: Code2 },
  ];

  const managementLevels = [
    {
      key: "self",
      icon: Users,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      key: "assisted",
      icon: Code2,
      accent: "text-chart-4",
      bg: "bg-chart-4/10",
    },
    {
      key: "managed",
      icon: Settings,
      accent: "text-chart-5",
      bg: "bg-chart-5/10",
    },
  ];

  const automationFeatures = [
    { label: t("automation.features.0"), icon: Code2 },
    { label: t("automation.features.1"), icon: Boxes },
    { label: t("automation.features.2"), icon: Zap },
    { label: t("automation.features.3"), icon: GitBranch },
    { label: t("automation.features.4"), icon: Terminal },
  ];

  const securityFeatures = [
    { label: t("security.features.0"), icon: Lock },
    { label: t("security.features.1"), icon: Shield },
    { label: t("security.features.2"), icon: Network },
    { label: t("security.features.3"), icon: ShieldCheck },
    { label: t("security.features.4"), icon: Users },
    { label: t("security.features.5"), icon: Zap },
    { label: t("security.features.6"), icon: Archive },
    { label: t("security.features.7"), icon: Camera },
  ];

  const pricingTiers = [
    { key: "vps", featured: true },
    { key: "dedicated", featured: false },
    { key: "managed", featured: false },
  ];

  const useCaseIcons = [
    Globe,
    Cloud,
    Code2,
    Database,
    GitBranch,
    Terminal,
    Gamepad2,
    Boxes,
    Briefcase,
  ];

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
                  <Link href="https://manager.zenthcloud.com" target="_blank" rel="noreferrer">
                    {t("hero.primaryCta")}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/pricing">{t("hero.secondaryCta")}</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
                <div className="relative h-full w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-8 shadow-2xl">
                  <div className="flex h-full flex-col items-center justify-center gap-6">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-xl">
                      <Cloud className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <Server className="h-8 w-8 text-white/90" />
                      </div>
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 border border-white/15">
                        <Cpu className="h-8 w-8 text-white/90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Choisissez votre Compute */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("computeTypes.eyebrow")}
            title={t("computeTypes.title")}
            description={t("computeTypes.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {computeTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.key}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`h-1.5 rounded-t-xl ${type.accent}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">
                        {t(`computeTypes.${type.key}.title`)}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {t(`computeTypes.${type.key}.description`)}
                    </p>
                    <p className="mt-4 text-sm text-foreground">
                      {t(`computeTypes.${type.key}.useCases`)}
                    </p>
                    <div className="mt-auto pt-6">
                      <Link
                        href="/pricing"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                      >
                        {t("hero.secondaryCta")} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Workloads */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("workloads.eyebrow")}
            title={t("workloads.title")}
            description={t("workloads.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {workloads.map((workload) => {
              const Icon = workload.icon;
              return (
                <div
                  key={workload.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {t(`workloads.${workload.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`workloads.${workload.key}.description`)}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t(`workloads.${workload.key}.useCases`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Infrastructure */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("infrastructure.eyebrow")}
            title={t("infrastructure.title")}
            description={t("infrastructure.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {infraItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/company/infrastructure">
                {t("infrastructure.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 5. Open source by design */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("openSource.eyebrow")}
                title={t("openSource.title")}
                description={t("openSource.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                {t("openSource.quote")}
              </blockquote>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {openSourceBenefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
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

      {/* 6. Software & Licenses */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("software.eyebrow")}
            title={t("software.title")}
            description={t("software.description")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Check className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("software.included.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("software.included.description")}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {t(`software.included.list.${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Shield className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{t("software.commercial.title")}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("software.commercial.description")}
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-2">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {t(`software.commercial.list.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Self-managed / Assisted / Managed */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("management.eyebrow")}
            title={t("management.title")}
            description={t("management.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {managementLevels.map((level) => {
              const Icon = level.icon;
              const featureCount = level.key === "self" ? 5 : level.key === "assisted" ? 5 : 7;
              return (
                <div
                  key={level.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${level.bg} ${level.accent}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {t(`management.${level.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`management.${level.key}.description`)}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {Array.from({ length: featureCount }, (_, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {t(`management.${level.key}.features.${i}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 8. Built for automation */}
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
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {automationFeatures.map((feature) => {
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
              <div className="mt-8">
                <Button asChild>
                  <Link href="/developers" target="_blank" rel="noreferrer">
                    {t("infrastructure.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-slate-950 p-6 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-auto text-slate-400">{t("automation.terminalTitle")}</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {t("automation.terminalExample")}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Security */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("security.eyebrow")}
            title={t("security.title")}
            description={t("security.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {securityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/public-cloud/security">
                {t("infrastructure.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 10. Pricing */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("pricing.eyebrow")}
            title={t("pricing.title")}
            description={t("pricing.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.key}
                className={`relative rounded-xl border p-6 transition-all hover:-translate-y-0.5 ${
                  tier.featured
                    ? "border-primary bg-card shadow-lg"
                    : "border-border bg-card shadow-sm hover:shadow-md"
                }`}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {t("pricing.tabs.0")}
                  </span>
                )}
                <h3 className="text-lg font-bold text-foreground">{t(`pricing.${tier.key}.label`)}</h3>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {t(`pricing.${tier.key}.price`)}
                  </span>
                </div>
                <Button asChild className="mt-6 w-full" variant={tier.featured ? "default" : "outline"}>
                  <Link href="/pricing">{t(`pricing.${tier.key}.cta`)}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {t.raw("pricing.tabs").map((tab: string, index: number) => (
              <span
                key={tab}
                className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tab}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* 11. Use cases */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("useCases.eyebrow")}
            title={t("useCases.title")}
            description={t("useCases.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* 12. CTA final */}
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
                <Link href="/contact">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Liens contextuels vers les autres produits Public Cloud */}
      <section className="border-t border-border py-12 bg-background">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">{t("infrastructure.cta")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/public-cloud/storage">Stockage</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/public-cloud/networking">Réseau</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/public-cloud/backup">Backup</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/public-cloud/databases">Bases de données</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/public-cloud/security">Sécurité</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
