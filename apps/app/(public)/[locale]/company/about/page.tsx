import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Brain,
  Briefcase,
  Building2,
  Check,
  Clock,
  Cloud,
  Code2,
  Container as ContainerIcon,
  Cpu,
  Database,
  Euro,
  Eye,
  FileText,
  GitBranch,
  Globe,
  GraduationCap,
  HardDrive,
  Headphones,
  HeartHandshake,
  Landmark,
  Layers,
  LifeBuoy,
  Lock,
  MapPin,
  MessageSquare,
  Network,
  Newspaper,
  Puzzle,
  Radio,
  RefreshCcw,
  Repeat,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";

export async function generateMetadata() {
  const t = await getTranslations("Public.about.meta");

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

export default async function AboutPage() {
  const t = await getTranslations("Public.about");

  const platforms = t.raw("whatIs.platforms") as Array<{ title: string; description: string }>;
  const platformIcons = [Cloud, Server, Cpu];
  const capabilities = t.raw("whatIs.capabilities") as string[];
  const capabilityIcons = [Network, Cpu, HardDrive, Database, ContainerIcon, Brain, Archive, ShieldCheck];

  const problems = t.raw("whyExists.problems") as Array<{ title: string; description: string }>;
  const problemIcons = [Boxes, Lock, Eye, Puzzle, Code2];

  const principles = t.raw("philosophy.principles") as Array<{ title: string; description: string }>;
  const principleIcons = [Eye, Zap, Globe, ShieldCheck, Code2, SlidersHorizontal];

  const approachLayers = t.raw("approach.layers") as Array<{ title: string; description: string }>;
  const approachIcons = [Cpu, Server, Boxes, Layers, Terminal];

  const hardwareLayers = t.raw("hardwareToCloud.layers") as Array<{ title: string; description: string }>;
  const hardwareChainIcons = [Building2, Network, Cpu, HardDrive, Boxes, Settings, Terminal, Briefcase];

  const buildingItems = t.raw("buildingInfrastructure.items") as Array<{ title: string; description: string }>;
  const buildingIcons = [Cpu, Network, Boxes, HardDrive, ContainerIcon, Settings, Zap, Activity];

  const openSourceBenefits = t.raw("openSource.benefits") as Array<{ title: string; description: string }>;
  const openSourceIcons = [Eye, Search, Users, Repeat, Rocket, SlidersHorizontal];

  const devFeatures = t.raw("developerFirst.features") as Array<{ title: string; description: string }>;
  const devToolIcons = [Code2, Zap, Terminal, Boxes, GitBranch, Activity];

  const ecosystemDomains = t.raw("ecosystem.domains") as Array<{ title: string; description: string; items: string[] }>;
  const ecosystemIcons = [Server, Layers, LifeBuoy];

  const sgeEntities = t.raw("sge.entities") as Array<{ name: string; description: string }>;
  const sgeIcons = [Cloud, Radio, Building2];

  const europeThemes = t.raw("europe.themes") as Array<{ title: string; description: string }>;
  const europeIcons = [MapPin, Landmark, Shield, Building2, Globe, TrendingUp];

  const transparencyItems = t.raw("transparency.items") as Array<{ title: string; description: string }>;
  const transparencyLinks = [
    { href: "https://docs.zenthcloud.com", external: true },
    { href: "/company/security", external: false },
    { href: "/company/reliability", external: false },
    { href: "/company/infrastructure", external: false },
  ];
  const transparencyIcons = [FileText, ShieldCheck, Activity, Server];

  const reliabilityPillars = t.raw("reliability.pillars") as Array<{ title: string; description: string }>;
  const reliabilityIcons = [Layers, Activity, Archive, RefreshCcw, Zap, Siren];

  const visionSteps = t.raw("vision.steps") as Array<{ title: string; description: string }>;
  const todayItems = t.raw("vision.today.items") as string[];
  const ambitionItems = t.raw("vision.ambition.items") as string[];

  const longTermItems = t.raw("longTerm.items") as Array<{ title: string; description: string }>;
  const longTermIcons = [Cpu, HardDrive, Network, ShieldCheck, Zap, Cloud];

  const teams = t.raw("people.teams") as Array<{ title: string; description: string }>;
  const teamIcons = [Code2, Terminal, Server, ShieldCheck, Headphones, Rocket];

  const careerDomains = t.raw("careers.domains") as Array<{ title: string; description: string }>;
  const careersIcons = [Code2, Cloud, Server, Network, ShieldCheck, GitBranch, Rocket, Headphones];

  const customerItems = t.raw("customers.items") as Array<{ title: string; description: string }>;
  const customerIcons = [MessageSquare, FileText, Users];

  const partnerItems = t.raw("partners.items") as Array<{ title: string; description: string }>;
  const partnerIcons = [Cpu, Server, GraduationCap, Users];

  const factItems = t.raw("facts.items") as Array<{ label: string; value: string }>;
  const factsIcons = [Building2, Activity, Landmark, MapPin];

  const contactCategories = t.raw("contact.categories") as Array<{ title: string; description: string }>;
  const contactIcons = [Euro, Code2, HeartHandshake, Newspaper, Briefcase];

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
                  <Link href="#vision">{t("hero.secondaryCta")}</Link>
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
                    <div className="grid w-full grid-cols-3 gap-2">
                      {platforms.map((platform) => (
                        <div
                          key={platform.title}
                          className="rounded-lg bg-white/10 border border-white/15 px-1 py-3 text-center text-xs font-medium text-white/90"
                        >
                          {platform.title}
                        </div>
                      ))}
                    </div>
                    <div className="h-6 w-px bg-white/30" aria-hidden="true" />
                    <div className="rounded-lg bg-white/15 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
                      {ecosystemDomains[0].title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. What is Zenth Cloud */}
      <section id="what-is" className="scroll-mt-20 py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("whatIs.eyebrow")}
            title={t("whatIs.title")}
            description={t("whatIs.description")}
          />

          <p className="mx-auto mb-12 max-w-3xl text-center text-muted-foreground leading-relaxed">
            {t("whatIs.intro")}
          </p>

          <div className="grid gap-5 md:grid-cols-3">
            {platforms.map((platform, index) => {
              const Icon = platformIcons[index];
              return (
                <div
                  key={platform.title}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="h-1.5 rounded-t-xl bg-primary" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">{platform.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {platform.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <ArrowDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <div className="rounded-lg border border-border bg-muted px-5 py-2.5 text-sm font-semibold text-foreground">
              {t("hardwareToCloud.title")}
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilityIcons.map((Icon, index) => (
              <div
                key={capabilities[index]}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-foreground">{capabilities[index]}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Why Zenth Cloud exists */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("whyExists.eyebrow")}
            title={t("whyExists.title")}
            description={t("whyExists.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem, index) => {
              const Icon = problemIcons[index];
              return (
                <div
                  key={problem.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{problem.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Our philosophy */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("philosophy.eyebrow")}
            title={t("philosophy.title")}
            description={t("philosophy.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principleIcons[index];
              return (
                <div
                  key={principle.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
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

      {/* 5. Our approach */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("approach.eyebrow")}
            title={t("approach.title")}
            description={t("approach.description")}
          />

          <div className="mx-auto max-w-2xl">
            {approachLayers.map((layer, index) => {
              const Icon = approachIcons[index];
              return (
                <React.Fragment key={layer.title}>
                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{layer.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{layer.description}</p>
                    </div>
                  </div>
                  {index < approachLayers.length - 1 && (
                    <ArrowDown className="mx-auto my-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. From hardware to cloud */}
      <section className="py-16 md:py-24 bg-background">
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

      {/* 7. Building our own infrastructure */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("buildingInfrastructure.eyebrow")}
            title={t("buildingInfrastructure.title")}
            description={t("buildingInfrastructure.description")}
          />

          <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground leading-relaxed">
            {t("buildingInfrastructure.message")}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {buildingItems.map((item, index) => {
              const Icon = buildingIcons[index];
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 8. Open source */}
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
                {t("openSource.quote")}
              </blockquote>
              <div className="mt-8">
                <Button asChild>
                  <Link href="https://github.com/skygenesisenterprise/zenthcloud" target="_blank" rel="noreferrer">
                    {t("openSource.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {openSourceBenefits.map((benefit, index) => {
                const Icon = openSourceIcons[index];
                return (
                  <div key={benefit.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 9. Developer first */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("developerFirst.eyebrow")}
                title={t("developerFirst.title")}
                description={t("developerFirst.description")}
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {devFeatures.map((feature, index) => {
                  const Icon = devToolIcons[index];
                  return (
                    <div key={feature.title} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{feature.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="https://docs.zenthcloud.com" target="_blank" rel="noreferrer">
                    {t("developerFirst.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-4 text-sm font-semibold text-foreground">
                <div className="rounded-lg bg-primary/10 px-5 py-2 text-primary">Developer</div>
                <div className="h-6 w-px bg-border" aria-hidden="true" />
                <div className="grid w-full grid-cols-2 gap-3">
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-xs">Web Console</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                    <Terminal className="h-4 w-4 text-primary" />
                    <span className="text-xs">CLI</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                    <Code2 className="h-4 w-4 text-primary" />
                    <span className="text-xs">API</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-border bg-muted p-3 text-center">
                    <Boxes className="h-4 w-4 text-primary" />
                    <span className="text-xs">Infrastructure as Code</span>
                  </div>
                </div>
                <div className="h-6 w-px bg-border" aria-hidden="true" />
                <div className="rounded-lg bg-primary px-6 py-2 text-primary-foreground">Zenth Cloud</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. The ecosystem */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("ecosystem.eyebrow")}
            title={t("ecosystem.title")}
            description={t("ecosystem.description")}
          />

          <div className="grid gap-5 md:grid-cols-3">
            {ecosystemDomains.map((domain, index) => {
              const Icon = ecosystemIcons[index];
              return (
                <div
                  key={domain.title}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="h-1.5 rounded-t-xl bg-primary" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">{domain.title}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {domain.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {domain.items.map((item) => (
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
        </Container>
      </section>

      {/* 11. Relationship with SGE */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("sge.eyebrow")}
                title={t("sge.title")}
                description={t("sge.description")}
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sge.intro")}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {t("sge.note")}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-lg bg-primary/10 px-5 py-2.5 text-sm font-bold text-primary">
                  Sky Genesis Enterprise
                </div>
                <div className="h-6 w-px bg-border" aria-hidden="true" />
                <div className="grid w-full gap-3">
                  {sgeEntities.map((entity, index) => {
                    const Icon = sgeIcons[index];
                    return (
                      <div key={entity.name} className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{entity.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{entity.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 12. Why Europe */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("europe.eyebrow")}
            title={t("europe.title")}
            description={t("europe.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {europeThemes.map((theme, index) => {
              const Icon = europeIcons[index];
              return (
                <div
                  key={theme.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{theme.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{theme.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 13. Transparency */}
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
              const link = transparencyLinks[index];
              return (
                <Link
                  key={item.title}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </Link>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("transparency.upcoming")}
          </p>
        </Container>
      </section>

      {/* 14. Reliability & Security */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Reliability */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("reliability.eyebrow")}</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {t("reliability.title")}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("reliability.description")}
              </p>
              <ul className="mt-6 space-y-2.5">
                {reliabilityPillars.map((pillar, index) => {
                  const Icon = reliabilityIcons[index];
                  return (
                    <li key={pillar.title} className="flex items-start gap-3 rounded-lg border border-border bg-muted p-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{pillar.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/public-cloud/backup">
                    {t("reliability.backupCta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/public-cloud/security">
                    {t("reliability.securityCta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Security */}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("security.eyebrow")}</span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {t("security.title")}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {t("security.description")}
              </p>
              <div className="mt-6 flex flex-1 items-center">
                <div className="w-full rounded-xl border border-border bg-muted p-6">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <blockquote className="mt-4 border-l-4 border-primary pl-4 text-base font-medium text-foreground leading-relaxed">
                    {t("security.message")}
                  </blockquote>
                </div>
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/public-cloud/security">
                    {t("security.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 15. Our vision */}
      <section id="vision" className="scroll-mt-20 border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("vision.eyebrow")}
            title={t("vision.title")}
            description={t("vision.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visionSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">{t("vision.today.title")}</h3>
              <ul className="mt-4 space-y-2.5">
                {todayItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">{t("vision.ambition.title")}</h3>
              <ul className="mt-4 space-y-2.5">
                {ambitionItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-chart-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 16. Long-term infrastructure vision */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("longTerm.eyebrow")}
                title={t("longTerm.title")}
                description={t("longTerm.description")}
              />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                {t("longTerm.message")}
              </blockquote>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {longTermItems.map((item, index) => {
                const Icon = longTermIcons[index];
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
          </div>
        </Container>
      </section>

      {/* 17. People */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("people.eyebrow")}
            title={t("people.title")}
            description={t("people.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team, index) => {
              const Icon = teamIcons[index];
              return (
                <div
                  key={team.title}
                  className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{team.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{team.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 18. Careers */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("careers.eyebrow")}
            title={t("careers.title")}
            description={t("careers.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {careerDomains.map((domain, index) => {
              const Icon = careersIcons[index];
              return (
                <div key={domain.title} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{domain.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{domain.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/company/careers">
                {t("careers.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 19. Customers & Partners */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Customers */}
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("customers.eyebrow")}
                title={t("customers.title")}
                description={t("customers.description")}
              />
              <div className="space-y-4">
                {customerItems.map((item, index) => {
                  const Icon = customerIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Partners */}
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("partners.eyebrow")}
                title={t("partners.title")}
                description={t("partners.description")}
              />
              <div className="space-y-4">
                {partnerItems.map((item, index) => {
                  const Icon = partnerIcons[index];
                  return (
                    <div key={item.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/company/partners">
                    {t("partners.cta")} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 20. Timeline — Building step by step */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("timeline.eyebrow")}
            title={t("timeline.title")}
            description={t("timeline.description")}
          />
          <div className="mx-auto flex max-w-xl items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Clock className="h-5 w-5" />
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("timeline.description")}
            </p>
          </div>
        </Container>
      </section>

      {/* 21. Company facts */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <SectionHeader
            eyebrow={t("facts.eyebrow")}
            title={t("facts.title")}
            description={t("facts.description")}
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {factItems.map((fact, index) => {
              const Icon = factsIcons[index];
              return (
                <div key={fact.label} className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {fact.label}
                  </p>
                  <p className="mt-1 text-base font-bold text-foreground">{fact.value}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 22. Contact */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <SectionHeader
            eyebrow={t("contact.eyebrow")}
            title={t("contact.title")}
            description={t("contact.description")}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {contactCategories.map((category, index) => {
              const Icon = contactIcons[index];
              return (
                <div key={category.title} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-foreground">{category.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{category.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/company/contact">
                {t("contact.cta")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
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
                <Link href="/company/contact">{t("finalCta.secondary")}</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
