import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Archive,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Box,
  Briefcase,
  Check,
  Code2,
  Database,
  Eye,
  FolderOpen,
  Globe,
  HardDrive,
  Image as LucideImage,
  Lock,
  Network,
  Package,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.storage.meta");

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

export default async function StoragePage() {
  const t = await getTranslations("Public.storage");

  const solutions = [
    { key: "block", icon: Box, accent: "bg-primary" },
    { key: "object", icon: Package, accent: "bg-chart-4" },
    { key: "backup", icon: ShieldCheck, accent: "bg-chart-5" },
  ];

  const workloads = [
    { key: "applications", icon: Globe },
    { key: "databases", icon: Database },
    { key: "media", icon: LucideImage },
    { key: "backups", icon: Archive },
    { key: "archives", icon: FolderOpen },
  ];

  const performanceProfiles = [
    { key: "performance", icon: Zap },
    { key: "balanced", icon: Database },
    { key: "capacity", icon: HardDrive },
  ];

  const objectFeatures = [
    { label: t("objectStorageApi.features.0"), icon: Code2 },
    { label: t("objectStorageApi.features.1"), icon: Zap },
    { label: t("objectStorageApi.features.2"), icon: Box },
    { label: t("objectStorageApi.features.3"), icon: Terminal },
    { label: t("objectStorageApi.features.4"), icon: ShieldCheck },
    { label: t("objectStorageApi.features.5"), icon: LucideImage },
  ];

  const durabilityItems = [
    { label: t("durability.items.0"), icon: Box },
    { label: t("durability.items.1"), icon: ShieldCheck },
    { label: t("durability.items.2"), icon: HardDrive },
    { label: t("durability.items.3"), icon: Zap },
    { label: t("durability.items.4"), icon: Lock },
    { label: t("durability.items.5"), icon: Archive },
  ];

  const securityItems = [
    { label: t("security.items.0"), icon: Users },
    { label: t("security.items.1"), icon: Lock },
    { label: t("security.items.2"), icon: Shield },
    { label: t("security.items.3"), icon: Eye },
    { label: t("security.items.4"), icon: Network },
    { label: t("security.items.5"), icon: Terminal },
    { label: t("security.items.6"), icon: Archive },
    { label: t("security.items.7"), icon: ShieldCheck },
  ];

  const managedLevels = [
    { key: "self", icon: Users, accent: "text-primary", bg: "bg-primary/10" },
    { key: "assisted", icon: Code2, accent: "text-chart-4", bg: "bg-chart-4/10" },
    { key: "managed", icon: Settings, accent: "text-chart-5", bg: "bg-chart-5/10" },
  ];

  const openSourceBenefits = [
    { label: t("openSource.benefits.0"), icon: Eye },
    { label: t("openSource.benefits.1"), icon: Network },
    { label: t("openSource.benefits.2"), icon: Box },
    { label: t("openSource.benefits.3"), icon: Code2 },
    { label: t("openSource.benefits.4"), icon: Lock },
  ];

  const pricingTiers = [
    { key: "block", featured: true },
    { key: "object", featured: false },
    { key: "backup", featured: false },
  ];

  const useCaseIcons = [
    Box,
    Database,
    LucideImage,
    Archive,
    FolderOpen,
    Briefcase,
    Globe,
    Server,
    Code2,
  ];

  const crossSellItems = [
    { key: "compute", icon: Server, href: "/public-cloud/compute" },
    { key: "backup", icon: ShieldCheck, href: "/public-cloud/backup" },
    { key: "network", icon: Network, href: "/public-cloud/networking" },
  ];

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
              <Link href="#solutions">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 2. Solutions */}
      <section id="solutions" className="py-16 md:py-24 bg-background scroll-mt-20">
        <Container>
          <SectionHeader
            eyebrow={t("solutions.eyebrow")}
            title={t("solutions.title")}
            description={t("solutions.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <div
                  key={solution.key}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className={`h-1.5 rounded-t-xl ${solution.accent}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">
                        {t(`solutions.${solution.key}.title`)}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {t(`solutions.${solution.key}.description`)}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {t.raw(`solutions.${solution.key}.features`).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
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

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
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
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Performance */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("performance.eyebrow")}
            title={t("performance.title")}
            description={t("performance.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {performanceProfiles.map((profile) => {
              const Icon = profile.icon;
              return (
                <div
                  key={profile.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">
                    {t(`performance.${profile.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`performance.${profile.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Intégration avec Compute */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("integration.eyebrow")}
                title={t("integration.title")}
                description={t("integration.description")}
              />
              <div className="mt-8">
                <Button asChild>
                  <Link href="/public-cloud/compute">
                    {t("integration.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-4 text-sm font-semibold text-foreground">
                <div className="rounded-lg bg-primary/10 px-4 py-2 text-primary">Zenth Cloud</div>
                <div className="h-6 w-px bg-border" />
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border bg-muted p-4 text-center">
                    <Server className="mx-auto h-5 w-5 text-primary" />
                    <span className="mt-2 block">Compute</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted p-4 text-center">
                    <HardDrive className="mx-auto h-5 w-5 text-primary" />
                    <span className="mt-2 block">Storage</span>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border bg-muted p-3 text-center text-xs text-muted-foreground">
                    VPS / VM
                  </div>
                  <div className="rounded-lg border border-border bg-muted p-3 text-center text-xs text-muted-foreground">
                    Block / Object
                  </div>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="rounded-lg bg-primary/10 px-4 py-2 text-primary">Workload</div>
              </div>
              <p className="mt-6 text-center text-sm font-medium text-foreground">
                {t("integration.example")}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Object Storage / API */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("objectStorageApi.eyebrow")}
                title={t("objectStorageApi.title")}
                description={t("objectStorageApi.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {objectFeatures.map((feature) => {
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
            <div className="rounded-xl border border-border bg-slate-950 p-6 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-auto text-slate-400">{t("objectStorageApi.terminalTitle")}</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {t("objectStorageApi.terminalExample")}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. Durabilité */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("durability.eyebrow")}
            title={t("durability.title")}
            description={t("durability.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {durabilityItems.map((item) => {
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

      {/* 8. Security */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("security.eyebrow")}
            title={t("security.title")}
            description={t("security.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* 9. Backup ≠ Storage */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("backupNotStorage.eyebrow")}
                title={t("backupNotStorage.title")}
                description={t("backupNotStorage.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                {t("backupNotStorage.message")}
              </blockquote>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/backup">
                    {t("backupNotStorage.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3 text-sm font-semibold text-foreground">
                <div className="rounded-lg bg-primary/10 px-4 py-2 text-primary">Application</div>
                <div className="h-6 w-px bg-border" />
                <div className="w-full max-w-xs rounded-lg border border-border bg-muted p-4 text-center">
                  Primary Storage
                </div>
                <div className="grid w-full max-w-xs grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3">
                    <ArrowDownToLine className="h-4 w-4 text-primary" />
                    <span className="text-xs">Snapshot</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3">
                    <Archive className="h-4 w-4 text-primary" />
                    <span className="text-xs">Backup</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="w-full max-w-xs rounded-lg border border-border bg-muted p-4 text-center">
                  Backup Storage
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. Scalability */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("scalability.eyebrow")}
            title={t("scalability.title")}
            description={t("scalability.description")}
          />

          <div className="flex flex-col items-center gap-4">
            {t.raw("scalability.steps").map((step: string, index: number, steps: string[]) => (
              <React.Fragment key={step}>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-base font-bold text-foreground shadow-sm">
                  {step}
                </div>
                {index < steps.length - 1 && (
                  <ArrowDownToLine className="h-5 w-5 text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </div>
        </Container>
      </section>

      {/* 11. Managed Storage */}
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
              const featureCount = level.key === "self" ? 3 : level.key === "assisted" ? 3 : 6;
              return (
                <div
                  key={level.key}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
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

      {/* 12. Open source */}
      <section className="py-16 md:py-24 bg-background">
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
                Built with open technologies. Designed without unnecessary lock-in.
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

      {/* 13. Pricing */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
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
                    Block
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
        </Container>
      </section>

      {/* 14. Use cases */}
      <section className="py-16 md:py-24 bg-background">
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

      {/* 15. Cross-selling */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("crossSelling.eyebrow")}
            title={t("crossSelling.title")}
            description={t("crossSelling.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {crossSellItems.map((item) => {
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

      {/* 16. CTA final */}
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
