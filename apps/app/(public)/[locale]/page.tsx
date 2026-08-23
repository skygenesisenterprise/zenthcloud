import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Check,
  ArrowRight,
  Cloud,
  Server,
  Wifi,
  Shield,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Container as ContainerIcon,
  Brain,
  Zap,
  MapPin,
  Activity,
  Code2,
  Terminal,
  Boxes,
  FileText,
  Globe,
  Gamepad2,
  Building2,
  ServerOff,
  ChevronRight,
  Leaf,
  Euro,
  Headphones,
  Landmark,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/public/Container";
import { HeroCarousel } from "@/components/public/HeroCarousel";

export default async function HomePage() {
  const t = await getTranslations("Public.home");

  const heroSlides = [
    {
      title: t("hero.slides.0.title"),
      subtitle: t("hero.slides.0.subtitle"),
      bullet1: t("hero.slides.0.bullet1"),
      bullet2: t("hero.slides.0.bullet2"),
      bullet3: t("hero.slides.0.bullet3"),
      oldPrice: t("hero.slides.0.oldPrice"),
      price: t("hero.slides.0.price"),
      tagline: t("hero.slides.0.tagline"),
    },
    {
      title: t("hero.slides.1.title"),
      subtitle: t("hero.slides.1.subtitle"),
      bullet1: t("hero.slides.1.bullet1"),
      bullet2: t("hero.slides.1.bullet2"),
      bullet3: t("hero.slides.1.bullet3"),
      oldPrice: t("hero.slides.1.oldPrice"),
      price: t("hero.slides.1.price"),
      priceTtc: t("hero.slides.1.priceTtc"),
      tagline: t("hero.slides.1.tagline"),
    },
    {
      title: t("hero.slides.2.title"),
      subtitle: t("hero.slides.2.subtitle"),
      bullet1: t("hero.slides.2.bullet1"),
      bullet2: t("hero.slides.2.bullet2"),
      bullet3: t("hero.slides.2.bullet3"),
      oldPrice: t("hero.slides.2.oldPrice"),
      price: t("hero.slides.2.price"),
      tagline: t("hero.slides.2.tagline"),
    },
    {
      title: t("hero.slides.3.title"),
      subtitle: t("hero.slides.3.subtitle"),
      bullet1: t("hero.slides.3.bullet1"),
      bullet2: t("hero.slides.3.bullet2"),
      bullet3: t("hero.slides.3.bullet3"),
      oldPrice: t("hero.slides.3.oldPrice"),
      price: t("hero.slides.3.price"),
      tagline: t("hero.slides.3.tagline"),
    },
    {
      title: t("hero.slides.4.title"),
      subtitle: t("hero.slides.4.subtitle"),
      bullet1: t("hero.slides.4.bullet1"),
      bullet2: t("hero.slides.4.bullet2"),
      bullet3: t("hero.slides.4.bullet3"),
      oldPrice: t("hero.slides.4.oldPrice"),
      price: t("hero.slides.4.price"),
      tagline: t("hero.slides.4.tagline"),
    },
  ];

  const universes = [
    {
      key: "publicCloud",
      href: "/public-cloud",
      icon: Cloud,
      accent: "bg-primary",
      links: [
        { href: "/public-cloud/compute", label: t("productUniverse.publicCloud.link1") },
        { href: "/public-cloud/containers", label: t("productUniverse.publicCloud.link2") },
        { href: "/public-cloud/storage", label: t("productUniverse.publicCloud.link3") },
        { href: "/public-cloud/networking", label: t("productUniverse.publicCloud.link4") },
        { href: "/public-cloud/databases", label: t("productUniverse.publicCloud.link5") },
        { href: "/public-cloud/gpu-and-ai", label: t("productUniverse.publicCloud.link6") },
      ],
    },
    {
      key: "privateCloud",
      href: "/private-cloud",
      icon: Server,
      accent: "bg-primary",
      links: [
        { href: "/private-cloud/dedicated-cloud", label: t("productUniverse.privateCloud.link1") },
        { href: "/private-cloud/virtualization", label: t("productUniverse.privateCloud.link2") },
        { href: "/private-cloud/private-networking", label: t("productUniverse.privateCloud.link3") },
        { href: "/private-cloud/storage", label: t("productUniverse.privateCloud.link4") },
        { href: "/private-cloud/kubernetes", label: t("productUniverse.privateCloud.link5") },
        { href: "/private-cloud/backup", label: t("productUniverse.privateCloud.link6") },
      ],
    },
    {
      key: "servers",
      href: "/dedicated-servers",
      icon: Cpu,
      accent: "bg-chart-4",
      links: [
        { href: "/bare-metal/dedicated-servers", label: t("productUniverse.servers.link1") },
        { href: "/dedicated-servers", label: t("productUniverse.servers.link2") },
        { href: "/bare-metal/compute", label: t("productUniverse.servers.link3") },
        { href: "/bare-metal/high-memory", label: t("productUniverse.servers.link4") },
        { href: "/bare-metal/gpu-servers", label: t("productUniverse.servers.link5") },
        { href: "/bare-metal/ddos-protection", label: t("productUniverse.servers.link6") },
      ],
    },
    {
      key: "connectivity",
      href: "/telecom",
      icon: Wifi,
      accent: "bg-chart-5",
      links: [
        { href: "/telecom", label: t("productUniverse.connectivity.link1") },
        { href: "/telecom", label: t("productUniverse.connectivity.link2") },
        { href: "/telecom", label: t("productUniverse.connectivity.link3") },
        { href: "/web-hosting/web-hosting", label: t("productUniverse.connectivity.link4") },
        { href: "/web-hosting/domains", label: t("productUniverse.connectivity.link5") },
        { href: "/web-hosting/email", label: t("productUniverse.connectivity.link6") },
      ],
    },
  ];

  const promoCards = [
    {
      eyebrow: t("products.publicCloud.eyebrow"),
      badge: t("products.publicCloud.badge"),
      title: t("products.publicCloud.title"),
      description: t("products.publicCloud.description"),
      bullets: [t("products.publicCloud.bullet1"), t("products.publicCloud.bullet2"), t("products.publicCloud.bullet3")],
      cta: t("products.publicCloud.cta"),
      href: "/public-cloud",
      icon: Cloud,
      accent: "bg-primary",
    },
    {
      eyebrow: t("products.privateCloud.eyebrow"),
      badge: t("products.privateCloud.badge"),
      title: t("products.privateCloud.title"),
      description: t("products.privateCloud.description"),
      bullets: [t("products.privateCloud.bullet1"), t("products.privateCloud.bullet2"), t("products.privateCloud.bullet3")],
      cta: t("products.privateCloud.cta"),
      href: "/private-cloud",
      icon: Server,
      accent: "bg-primary",
    },
    {
      eyebrow: t("products.dedicatedVps.eyebrow"),
      badge: t("products.dedicatedVps.badge"),
      title: t("products.dedicatedVps.title"),
      description: t("products.dedicatedVps.description"),
      bullets: [t("products.dedicatedVps.bullet1"), t("products.dedicatedVps.bullet2"), t("products.dedicatedVps.bullet3")],
      cta: t("products.dedicatedVps.cta"),
      href: "/dedicated-servers",
      icon: Cpu,
      accent: "bg-chart-4",
    },
    {
      eyebrow: t("products.telecom.eyebrow"),
      badge: t("products.telecom.badge"),
      title: t("products.telecom.title"),
      description: t("products.telecom.description"),
      bullets: [t("products.telecom.bullet1"), t("products.telecom.bullet2"), t("products.telecom.bullet3")],
      cta: t("products.telecom.cta"),
      href: "/telecom",
      icon: Wifi,
      accent: "bg-chart-5",
    },
  ];

  const whyCards = [
    { key: "sovereignty", icon: Landmark, accent: "text-primary", bg: "bg-primary/10" },
    { key: "pricing", icon: Euro, accent: "text-emerald-500", bg: "bg-emerald-500/10" },
    { key: "ecology", icon: Leaf, accent: "text-chart-4", bg: "bg-chart-4/10" },
    { key: "support", icon: Headphones, accent: "text-primary", bg: "bg-primary/10" },
  ];

  const infraCapabilities = [
    { label: t("infrastructure.compute"), icon: Cpu },
    { label: t("infrastructure.nvmeStorage"), icon: HardDrive },
    { label: t("infrastructure.networking"), icon: Network },
    { label: t("infrastructure.privateNetworks"), icon: Lock },
    { label: t("infrastructure.dataCenters"), icon: MapPin },
    { label: t("infrastructure.redundancy"), icon: Zap },
    { label: t("infrastructure.security"), icon: Shield },
    { label: t("infrastructure.monitoring"), icon: Activity },
  ];

  const infraStats = [
    { value: "99.99%", label: t("infrastructure.statUptime") },
    { value: "25 Gbps+", label: t("infrastructure.statBandwidth") },
    { value: "Europe", label: t("infrastructure.statRegions") },
    { value: "24/7", label: t("infrastructure.statSupport") },
  ];

  const solutions = [
    { title: t("solutions.developers"), description: t("solutions.developersDescription"), icon: Code2, href: "/solutions/developers" },
    { title: t("solutions.business"), description: t("solutions.businessDescription"), icon: Building2, href: "/solutions/business" },
    { title: t("solutions.enterprise"), description: t("solutions.enterpriseDescription"), icon: Server, href: "/solutions/enterprise" },
    { title: t("solutions.gaming"), description: t("solutions.gamingDescription"), icon: Gamepad2, href: "/solutions/gaming" },
    { title: t("solutions.ai"), description: t("solutions.aiDescription"), icon: Brain, href: "/solutions/ai-gpu" },
    { title: t("solutions.web"), description: t("solutions.webDescription"), icon: Globe, href: "/solutions/web-ecommerce" },
    { title: t("solutions.infrastructure"), description: t("solutions.infrastructureDescription"), icon: Network, href: "/solutions/infrastructure" },
    { title: t("solutions.disasterRecovery"), description: t("solutions.disasterRecoveryDescription"), icon: ServerOff, href: "/solutions/backup-disaster-recovery" },
  ];

  const pricingTiers = [
    { name: t("pricing.computeTitle"), description: t("pricing.computeDescription"), price: t("pricing.computePrice"), unit: "/ mois", cta: t("pricing.computeCta"), featured: false },
    { name: t("pricing.vpsTitle"), description: t("pricing.vpsDescription"), price: t("pricing.vpsPrice"), unit: "/ mois", cta: t("pricing.vpsCta"), featured: true },
    { name: t("pricing.dedicatedTitle"), description: t("pricing.dedicatedDescription"), price: t("pricing.dedicatedPrice"), unit: "", cta: t("pricing.dedicatedCta"), featured: false },
  ];

  const devTools = [
    { label: t("developers.api"), description: t("developers.apiDescription"), icon: Code2 },
    { label: t("developers.cli"), description: t("developers.cliDescription"), icon: Terminal },
    { label: t("developers.terraform"), description: t("developers.terraformDescription"), icon: Boxes },
    { label: t("developers.kubernetes"), description: t("developers.kubernetesDescription"), icon: ContainerIcon },
    { label: t("developers.documentation"), description: t("developers.documentationDescription"), icon: FileText },
    { label: t("developers.automation"), description: t("developers.automationDescription"), icon: Zap },
  ];

  return (
    <>
      {/* 1. Hero */}
      <HeroCarousel
        badge={t("hero.badge")}
        priceLabel={t("hero.priceLabel")}
        pricePeriod={t("hero.pricePeriod")}
        primaryCta={t("hero.primaryCta")}
        slides={heroSlides}
      />

      {/* 2. Promos sous le hero */}
      <section className="border-y border-border bg-background py-10 md:py-14">
        <Container>
          <div className="grid gap-5 md:grid-cols-3 items-stretch">
            {/* Public Cloud */}
            <div className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all h-full">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-bold text-primary">{t("heroPromos.publicCloud.eyebrow")}</span>
                  <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    {t("heroPromos.publicCloud.badge")}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">{t("heroPromos.publicCloud.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("heroPromos.publicCloud.description")}</p>
                <ul className="mt-3 space-y-1.5">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {t(`heroPromos.publicCloud.bullet${i}`)}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("heroPromos.publicCloud.extra")}</p>
              </div>
              <div className="mt-auto pt-6">
                <Link href="/public-cloud" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  {t("heroPromos.publicCloud.cta")}
                </Link>
              </div>
            </div>

            {/* Serveurs Rise et Game */}
            <div className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all h-full">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-bold text-primary">{t("heroPromos.riseAndGame.eyebrow")}</span>
                  <span className="inline-flex items-center rounded-full bg-chart-4 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                    {t("heroPromos.riseAndGame.badge")}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">{t("heroPromos.riseAndGame.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("heroPromos.riseAndGame.description")}</p>
                <ul className="mt-3 space-y-1.5">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {t(`heroPromos.riseAndGame.bullet${i}`)}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold text-foreground">{t("heroPromos.riseAndGame.offerEnd")}</p>
              </div>
              <div className="mt-auto pt-6">
                <Link href="/dedicated-servers" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  {t("heroPromos.riseAndGame.cta")}
                </Link>
              </div>
            </div>

            {/* Advance AMD EPYC */}
            <div className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all h-full">
              <div>
                <span className="text-sm font-bold text-primary">{t("heroPromos.advanceAmd.eyebrow")}</span>
                <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">{t("heroPromos.advanceAmd.title")}</h3>
                <p className="mt-2 text-sm font-semibold text-foreground">{t("heroPromos.advanceAmd.subtitle")}</p>
                <ul className="mt-3 space-y-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {t(`heroPromos.advanceAmd.bullet${i}`)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-6">
                <Link href="/dedicated-servers" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  {t("heroPromos.advanceAmd.cta")}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Univers produits */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("productUniverse.title")}</span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">{t("productUniverse.title")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{t("productUniverse.description")}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {universes.map((universe) => {
              const Icon = universe.icon;
              return (
                <div
                  key={universe.key}
                  className="group flex flex-col rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className={`h-1.5 ${universe.accent}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${universe.accent.replace("bg-", "bg-")}/10 text-primary`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">{t(`productUniverse.${universe.key}.title`)}</h3>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {t(`productUniverse.${universe.key}.description`)}
                    </p>
                    <ul className="mt-5 grid grid-cols-1 gap-2">
                      {universe.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="group/link inline-flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors"
                          >
                            {link.label}
                            <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <Link
                        href={universe.href}
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        {t(`productUniverse.${universe.key}.cta`)} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 4. Offres du moment */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("products.title")}</span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">{t("products.title")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{t("products.description")}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {promoCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="group flex flex-col rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-all overflow-hidden">
                  <div className={`h-1.5 ${card.accent}`} />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">{card.eyebrow}</span>
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug">{card.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                    <ul className="mt-4 space-y-2">
                      {card.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <Link href={card.href} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                        {card.cta} <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Pourquoi ZenthCloud */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("why.title")}</span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">{t("why.title")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{t("why.description")}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.key} className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${card.bg} ${card.accent}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground">{t(`why.${card.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`why.${card.key}.description`)}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 6. Infrastructure */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("infrastructure.title")}</span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">{t("infrastructure.subtitle")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("infrastructure.description")}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {infraCapabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{cap.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {infraStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-background p-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/company/infrastructure">{t("infrastructure.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* 7. Solutions */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("solutions.title")}</span>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">{t("solutions.subtitle")}</h2>
              <p className="mt-2 text-muted-foreground max-w-2xl">{t("solutions.description")}</p>
            </div>
            <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5">
              <Link href="/solutions">{t("solutions.allSolutions")} <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <Link key={solution.title} href={solution.href} className="group rounded-xl border border-border bg-card p-5 hover:border-primary hover:shadow-md transition-all">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-primary transition-colors">{solution.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{solution.description}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 8. Tarification */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <Container>
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("pricing.title")}</span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">{t("pricing.subtitle")}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{t("pricing.description")}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div key={tier.name} className={`relative rounded-xl border p-6 ${tier.featured ? "border-primary bg-background shadow-lg" : "border-border bg-background shadow-sm"}`}>
                {tier.featured && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{t("pricing.popular")}</span>}
                <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-foreground">{tier.price}</span>
                  {tier.unit && <span className="text-sm text-muted-foreground">{tier.unit}</span>}
                </div>
                <Button asChild className="mt-6 w-full" variant={tier.featured ? "default" : "outline"}>
                  <Link href="/pricing">{tier.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 9. Développeurs */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">{t("developers.title")}</span>
              <h2 className="mt-3 text-2xl md:text-3xl font-bold text-foreground">{t("developers.subtitle")}</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">{t("developers.description")}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {devTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div key={tool.label} className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{tool.label}</p>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="https://docs.zenthcloud.com" target="_blank" rel="noreferrer">{t("developers.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted p-6 font-mono text-xs shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="ml-auto text-muted-foreground">{t("developers.terminalTitle")}</span>
              </div>
              <pre className="text-muted-foreground leading-relaxed overflow-x-auto">
{`$ zenthcloud compute create \\
    --name web-prod-01 \\
    --region eu-west \\
    --type c4m8 \\
    --image ubuntu-24.04

Creating instance web-prod-01...
Instance web-prod-01 is running.
Public IP: 185.x.x.x

$ zenthcloud network list
NAME          REGION     CIDR
prod-vpc      eu-west    10.0.0.0/16
staging-vpc   eu-central 10.1.0.0/16`}
              </pre>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. CTA */}
      <section className="border-t border-border py-16 md:py-24 bg-muted">
        <Container>
          <div className="rounded-2xl bg-primary p-8 md:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl md:text-3xl font-bold">{t("cta.title")}</h2>
            <p className="mt-4 mx-auto max-w-2xl text-primary-foreground/80">{t("cta.description")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Link href="https://manager.zenthcloud.com/signup" target="_blank" rel="noreferrer">{t("cta.primary")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white">
                <Link href="/contact">{t("cta.secondary")}</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-primary-foreground/70">{t("cta.websites")}</p>
          </div>
        </Container>
      </section>
    </>
  );
}
