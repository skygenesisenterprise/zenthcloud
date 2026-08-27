import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cloud,
  Cpu,
  Server,
  HardDrive,
  Network,
  Database,
  Boxes,
  Lock,
  ShieldCheck,
  Building2,
  Gamepad2,
  Monitor,
  Code2,
  Zap,
  Settings,
  MonitorUp,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";
import { ArchitectureDiagram } from "@/components/public/home/architecture-diagram";
import { NetworkDiagram } from "@/components/public/home/network-diagram";
import { ConsolePreview } from "@/components/public/home/console-preview";
import { getDomainUrl } from "@/lib/domains";

// Prefix internal links with the active locale, mirroring the Header/Footer convention.
function localizeHref(href: string, locale: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#")) return href;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

// Uniform button styling for the homepage: white background, blue text, no state change on hover.
const WHITE_BUTTON_CLASSES = "bg-white text-primary hover:bg-white hover:text-primary font-semibold";

export async function generateMetadata() {
  const t = await getTranslations("Public.homeRedesign.meta");
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

interface CardLink {
  title: string;
  description: string;
  cta: string;
  href: string;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Public.homeRedesign");

  const socialStats = t.raw("socialProof.stats") as Array<{ value: string; label: string }>;
  const partners = t.raw("socialProof.partners") as string[];
  const platformCards = t.raw("platform.cards") as Record<string, CardLink>;
  const consoleItems = t.raw("console.items") as Array<{ title: string; icon: string }>;
  const connectivityItems = t.raw("connectivity.items") as Array<{ title: string; description: string }>;
  const whyReasons = t.raw("why.reasons") as Array<{ title: string; description: string }>;
  const serverCards = t.raw("servers.items") as Array<{
    title: string;
    description: string;
    points: string[];
    cta: string;
    href: string;
  }>;
  const publicFeatures = {
    compute: { title: t("publicCloud.features.compute.title"), description: t("publicCloud.features.compute.description"), icon: Cpu, href: "/public-cloud/compute" },
    storage: { title: t("publicCloud.features.storage.title"), description: t("publicCloud.features.storage.description"), icon: HardDrive, href: "/public-cloud/storage" },
    networking: { title: t("publicCloud.features.networking.title"), description: t("publicCloud.features.networking.description"), icon: Network, href: "/public-cloud/networking" },
    databases: { title: t("publicCloud.features.databases.title"), description: t("publicCloud.features.databases.description"), icon: Database, href: "/public-cloud/databases" },
  };
  const privateHighlights = t.raw("privateCloud.highlights") as Array<{ title: string; description: string }>;
  const privateValues = t.raw("privateCloud.values") as string[];
  const privateItems = t.raw("privateCloud.items") as Array<{ title: string; description: string }>;
  const cloudPcUseCases = t.raw("cloudPcs.useCases") as Record<string, { title: string; description: string }>;
  const profiles = t.raw("builtFor.profiles") as Record<string, { title: string; description: string; cta: string; href: string }>;
  const archLabels = {
    platform: t("architecture.platform"),
    compute: t("architecture.compute"),
    storage: t("architecture.storage"),
    network: t("architecture.network"),
    virtualization: t("architecture.virtualization"),
    infrastructure: t("architecture.infrastructure"),
    datacenters: t("architecture.datacenters"),
  };

  const platformCardList: Array<{ key: string; icon: LucideIcon }> = [
    { key: "publicCloud", icon: Cloud },
    { key: "privateCloud", icon: Server },
    { key: "vpsBareMetal", icon: Cpu },
    { key: "cloudPcs", icon: Monitor },
  ];

  return (
    <>
      {/* 1. Hero */}
      <section aria-label={t("hero.title")} className="border-b border-border bg-background">
        <Container className="flex flex-col items-center py-20 text-center md:py-28">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {t("hero.eyebrow")}
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("hero.subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href={localizeHref(t("hero.primaryHref"), locale)}>
                {t("hero.primaryCta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={localizeHref(t("hero.secondaryHref"), locale)}>
                {t("hero.secondaryCta")}
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Preuve sociale */}
      <section className="flex min-h-70 md:min-h-90 items-center border-b border-border bg-muted">
        <Container className="py-10 md:py-14">
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
              “{t("socialProof.quote")}”
            </p>
            <footer className="mt-3 text-sm font-semibold text-muted-foreground">
              {t("socialProof.quoteAuthor")}
            </footer>
          </blockquote>

          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {socialStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("socialProof.partnersLabel")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {partners.map((name) => (
                <span key={name} className="font-mono text-sm font-semibold text-foreground/45">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Platform */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            align="left"
            eyebrow={t("platform.eyebrow")}
            title={t("platform.title")}
            description={t("platform.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {platformCardList.map(({ key, icon: Icon }) => {
              const card = platformCards[key];
              return (
                <Link
                  key={key}
                  href={localizeHref(card.href, locale)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {card.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 3. Public Cloud */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            align="left"
            eyebrow={t("publicCloud.eyebrow")}
            title={t("publicCloud.title")}
            description={t("publicCloud.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(publicFeatures).map(([key, feature]) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={key}
                  href={localizeHref(feature.href, locale)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  <ArrowUpRight className="mt-auto pt-4 h-4 w-4 self-end text-muted-foreground" aria-hidden="true" />
                </Link>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
              <Link href={localizeHref("/public-cloud/compute", locale)}>
                {t("publicCloud.cta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 4. Private Cloud & Virtualization */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("privateCloud.eyebrow")}
                title={t("privateCloud.title")}
                description={t("privateCloud.description")}
              />
              <ul className="space-y-3">
                {privateHighlights.map((item) => (
                  <li key={item.title} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {privateValues.map((value) => (
                  <span
                    key={value}
                    className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                  >
                    {value}
                  </span>
                ))}
              </div>
              <div className="mt-8">
                <Button asChild className={WHITE_BUTTON_CLASSES}>
                  <Link href={localizeHref("/private-cloud", locale)}>
                    {t("privateCloud.cta")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {privateItems.map((item, index) => {
                const icons = [Lock, Settings, Building2, Boxes];
                const Icon = icons[index] ?? Server;
                return (
                  <div key={item.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. VPS & Bare Metal */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            align="left"
            eyebrow={t("servers.eyebrow")}
            title={t("servers.title")}
            description={t("servers.description")}
          />

          <div className="grid gap-5 md:grid-cols-2">
            {serverCards.map((card, index) => {
              const icons = [MonitorUp, Server];
              const Icon = icons[index] ?? Server;
              return (
                <Link
                  key={card.title}
                  href={localizeHref(card.href, locale)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-7 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">{card.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  <ul className="mt-5 space-y-2">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {card.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Cloud PCs */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("cloudPcs.eyebrow")}</span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">{t("cloudPcs.title")}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{t("cloudPcs.subtitle")}</p>
            <p className="mt-4 border-l-2 border-primary pl-4 text-left text-base font-medium text-foreground">
              {t("cloudPcs.concept")}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(cloudPcUseCases).map(([key, useCase], index) => {
              const icons = [Monitor, Gamepad2, Code2, Building2];
              const Icon = icons[index] ?? Monitor;
              return (
                <div key={key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{useCase.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 7. Networking & Telecom */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("connectivity.eyebrow")}
                title={t("connectivity.title")}
                description={t("connectivity.description")}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                {connectivityItems.map((item) => (
                  <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild className={WHITE_BUTTON_CLASSES}>
                  <Link href={localizeHref("/telecom", locale)}>
                    {t("connectivity.cta")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <NetworkDiagram
              users={t("connectivity.users")}
              items={connectivityItems}
              compute={publicFeatures.compute.title}
              storage={publicFeatures.storage.title}
              privateCloud={t("platform.cards.privateCloud.title")}
            />
          </div>
        </Container>
      </section>

      {/* 8. Console */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("console.eyebrow")}
            title={t("console.title")}
            description={t("console.description")}
          />

          <ConsolePreview items={consoleItems} />

          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
              <Link href={getDomainUrl("console")} target="_blank" rel="noreferrer">
                {t("console.cta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 9. Built for + Architecture */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            align="left"
            eyebrow={t("builtFor.eyebrow")}
            title={t("builtFor.title")}
            description={t("builtFor.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(profiles).map(([key, profile], index) => {
              const icons = [Code2, Building2, ShieldCheck, Zap];
              const Icon = icons[index] ?? Server;
              return (
                <Link
                  key={key}
                  href={localizeHref(profile.href, locale)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{profile.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{profile.description}</p>
                  <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {profile.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("architecture.eyebrow")}</span>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">{t("architecture.title")}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{t("architecture.description")}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Cpu, label: archLabels.compute },
                  { icon: HardDrive, label: archLabels.storage },
                  { icon: Network, label: archLabels.network },
                  { icon: Boxes, label: archLabels.virtualization },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <ArchitectureDiagram {...archLabels} />
          </div>
        </Container>
      </section>

      {/* 10. Why + CTA final */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader eyebrow={t("why.eyebrow")} title={t("why.title")} />
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {whyReasons.map((reason) => (
              <div key={reason.title} className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-4 text-sm font-bold text-foreground">{reason.title}</p>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">{t("finalCta.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">{t("finalCta.subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
                <Link href={getDomainUrl("console", "/signup")} target="_blank" rel="noreferrer">
                  {t("finalCta.primary")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
                <Link href={localizeHref("/company/contact", locale)}>{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}