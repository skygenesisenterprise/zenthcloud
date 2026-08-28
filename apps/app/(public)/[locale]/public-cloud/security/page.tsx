import * as React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowRight,
  Boxes,
  Building2,
  Check,
  Clock,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  Eye,
  FileText,
  Fingerprint,
  Globe,
  HardDrive,
  History as HistoryIcon,
  Key,
  Landmark,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Network,
  RotateCcw,
  Search,
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
  const t = await getTranslations("Public.security.meta");

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

function ResponsibilityColumn({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent: "zenth" | "customer";
}) {
  const icon = accent === "zenth" ? Shield : Users;
  const Icon = icon;
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
            accent === "zenth" ? "bg-primary/10 text-primary" : "bg-secondary text-primary"
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Public.security");

  const layerIcons = [Shield, Network, Cpu, Users, Lock, Activity, RotateCcw];
  const layerItems = t.raw("layers.items") as Array<{
    key: string;
    title: string;
    description: string;
  }>;

  const physicalIcons = [Building2, Eye, Zap, Network, Server];
  const physicalItems = t.raw("physical.items") as string[];

  const networkIcons = [Shield, Lock, LayoutGrid, Users, Zap, ArrowRight];
  const networkItems = t.raw("network.items") as string[];

  const identityIcons = [Users, ShieldCheck, Server, Key, Shield];
  const identityItems = t.raw("identity.items") as string[];

  const identityRoles = t.raw("identity.roles.items") as string[];

  const mfaIcons = [Fingerprint, Key, Globe, ShieldCheck];
  const mfaItems = t.raw("mfa.items") as string[];

  const apiIcons = [Key, ShieldCheck, RotateCcw, Server, Zap, Eye];
  const apiItems = t.raw("apiSecurity.items") as string[];

  const secretsIcons = [Key, Lock, FileText, Terminal, FileText];
  const secretsItems = t.raw("secrets.items") as string[];

  const encryptionIcons = [Lock, Network, FileText, Key];
  const encryptionItems = t.raw("encryption.items") as string[];

  const computeIcons = [Server, Cpu, Users, Zap];
  const computeItems = t.raw("computeIsolation.items") as string[];

  const containerIcons = [Container, Eye, Cloud, Lock, Network, Activity];
  const containerItems = t.raw("containerSecurity.items") as string[];

  const k8sIcons = [Users, ShieldCheck, Network, Lock, Server, Activity];
  const k8sItems = t.raw("kubernetesSecurity.items") as string[];

  const databaseIcons = [Database, Users, Key, Lock, RotateCcw, Activity];
  const databaseItems = t.raw("databaseSecurity.items") as string[];

  const backupIcons = [RotateCcw, Clock, HistoryIcon, Server, Cloud];
  const backupItems = t.raw("backup.items") as string[];

  const firewallItems = t.raw("firewall.items") as string[];
  const ddosItems = t.raw("ddos.items") as string[];

  const monitoringIcons = [Activity, Network, Cpu, Shield, AlertTriangle, Eye];
  const monitoringItems = t.raw("monitoring.items") as string[];

  const auditFields = t.raw("audit.fields") as string[];

  const defaultIcons = [ShieldCheck, Lock, Eye, Users, Key, Activity];
  const defaultItems = t.raw("securityByDefault.items") as string[];

  const complianceIcons = [FileText, FileText, Globe, FileText, FileText];
  const complianceItems = t.raw("compliance.items") as string[];

  const sovereigntyIcons = [MapPin, Server, Landmark, Users, Eye];
  const sovereigntyItems = t.raw("sovereignty.items") as string[];

  const openSourceIcons = [Code2, Eye, Search, Users, Globe];
  const openSourceItems = t.raw("openSource.items") as string[];

  const developerIcons = [Code2, Terminal, Boxes, Lock, Key, Zap, Key];
  const developerItems = t.raw("developers.items") as string[];

  const incidentSteps = t.raw("incidentResponse.steps") as string[];

  const trustCenterItems = t.raw("trustCenter.items") as string[];

  const useCaseIcons = [Server, Lock, Database, Container, Cpu, Building2];
  const useCases = t.raw("useCases.items") as string[];

  const comparisonRows = t.raw("comparison.rows") as Array<{
    layer: string;
    zenth: string;
    customer: string;
  }>;

  const includedItems = t.raw("pricing.included.items") as string[];
  const optionalItems = t.raw("pricing.optional.items") as string[];

  const crossSellItems = [
    { key: "compute", icon: Server },
    { key: "networking", icon: Network },
    { key: "containers", icon: Container },
    { key: "databases", icon: Database },
    { key: "backup", icon: RotateCcw },
    { key: "gpuAi", icon: Cpu },
    { key: "kubernetes", icon: Boxes },
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
              <Link href="#shared-responsibility">
                {t("hero.primaryCta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#architecture">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
        </PageContainer>
      </section>

      {/* 2. Responsabilité partagée */}
      <section id="shared-responsibility" className="border-y border-border bg-muted py-16 md:py-24 scroll-mt-20">
        <PageContainer>
          <SectionHeader
            eyebrow={t("sharedResponsibility.eyebrow")}
            title={t("sharedResponsibility.title")}
            description={t("sharedResponsibility.description")}
          />

          <div className="mx-auto max-w-2xl">
            <DiagramPanel label={`${t("sharedResponsibility.title")} — ${t("sharedResponsibility.message")}`}>
              <FlowNode icon={Shield}>Security</FlowNode>
              <FlowConnector />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-4 py-3 shadow-sm">
                  <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-bold tracking-tight text-primary">ZenthCloud</span>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
                  <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                  <span className="text-sm font-bold tracking-tight text-foreground">Client</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <p className="text-center">Infrastructure, core network, hyperviseur, plateforme</p>
                <p className="text-center">Application, code, permissions, secrets, données</p>
              </div>
            </DiagramPanel>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <ResponsibilityColumn
              title={t("sharedResponsibility.zenthTitle")}
              items={t.raw("sharedResponsibility.zenthItems") as string[]}
              accent="zenth"
            />
            <ResponsibilityColumn
              title={t("sharedResponsibility.customerTitle")}
              items={t.raw("sharedResponsibility.customerItems") as string[]}
              accent="customer"
            />
          </div>

          <p className="mt-8 text-center text-sm font-medium text-foreground">
            {t("sharedResponsibility.message")}
          </p>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader
              eyebrow={t("comparison.eyebrow")}
              title={t("comparison.title")}
              description={t("comparison.description")}
            />

            <div className="overflow-x-auto">
              <table className="w-full min-w-160 border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-4 text-left font-semibold text-foreground">
                      {t("comparison.headers.layer")}
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-primary">
                      {t("comparison.headers.zenth")}
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">
                      {t("comparison.headers.customer")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.layer} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4 font-medium text-foreground">{row.layer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.zenth}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 3. Défense en profondeur */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <SectionHeader
            eyebrow={t("layers.eyebrow")}
            title={t("layers.title")}
            description={t("layers.description")}
          />

          <div className="mx-auto max-w-md space-y-1">
            {layerItems.map((layer, index) => {
              const Icon = layerIcons[index % layerIcons.length];
              return (
                <div
                  key={layer.key}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{layer.title}</p>
                    <p className="text-xs text-muted-foreground">{layer.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader
              eyebrow={t("physical.eyebrow")}
              title={t("physical.title")}
              description={t("physical.description")}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {physicalItems.map((item, index) => {
                const Icon = physicalIcons[index % physicalIcons.length];
                return (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item}</p>
                  </div>
                );
              })}
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">{t("physical.note")}</p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">{t("useCases.title")} :</span>
            {useCases.map((item, index) => {
              const Icon = useCaseIcons[index % useCaseIcons.length];
              return (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  {item}
                </span>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* 4. Sécurité réseau */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <SectionHeader
            eyebrow={t("network.eyebrow")}
            title={t("network.title")}
            description={t("network.description")}
          />

          <div className="mx-auto max-w-2xl">
            <DiagramPanel label={`${t("network.title")} — ${t("network.description")}`}>
              <FlowNode icon={Globe}>Internet</FlowNode>
              <FlowConnector />
              <FlowNode icon={Shield}>Edge / Firewall</FlowNode>
              <FlowConnector />
              <FlowNode icon={Network}>Public Network</FlowNode>
              <FlowConnector />
              <FlowHub icon={Lock}>Private Network</FlowHub>
              <FlowConnector />
              <div className="grid grid-cols-3 gap-3">
                <FlowNode variant="card" icon={Server}>Compute</FlowNode>
                <FlowNode variant="card" icon={Database}>Database</FlowNode>
                <FlowNode variant="card" icon={HardDrive}>Storage</FlowNode>
              </div>
            </DiagramPanel>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {networkItems.map((item, index) => {
              const Icon = networkIcons[index % networkIcons.length];
              return (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{item}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
              <Link href={localizeHref("/public-cloud/networking", locale)}>
                {t("network.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("networkIsolation.eyebrow")}
                title={t("networkIsolation.title")}
                description={t("networkIsolation.description")}
              />
              <DiagramPanel label={`${t("networkIsolation.title")} — ${t("networkIsolation.message")}`}>
                <FlowNode icon={Globe}>Internet</FlowNode>
                <FlowConnector />
                <FlowNode icon={Network}>Public Endpoint</FlowNode>
                <FlowConnector />
                <FlowNode icon={Network}>Load Balancer</FlowNode>
                <FlowConnector />
                <FlowHub icon={Lock}>Private Network</FlowHub>
                <FlowConnector />
                <div className="grid grid-cols-3 gap-3">
                  <FlowNode variant="card" icon={Code2}>API</FlowNode>
                  <FlowNode variant="card" icon={Database}>DB</FlowNode>
                  <FlowNode variant="card" icon={Cpu}>Worker</FlowNode>
                </div>
              </DiagramPanel>
              <p className="mt-6 text-center text-sm font-medium text-foreground">
                {t("networkIsolation.message")}
              </p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("firewall.eyebrow")}
                title={t("firewall.title")}
                description={t("firewall.description")}
              />
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h4 className="text-sm font-bold text-foreground">{t("firewall.mockup.title")}</h4>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Inbound</p>
                    <ul className="mt-2 space-y-1 text-sm text-foreground">
                      {(t.raw("firewall.mockup.inbound") as string[]).map((rule) => (
                        <li key={rule} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Outbound</p>
                    <ul className="mt-2 space-y-1 text-sm text-foreground">
                      {(t.raw("firewall.mockup.outbound") as string[]).map((rule) => (
                        <li key={rule} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <ul className="mt-6 space-y-2">
                {firewallItems.map((item, index) => {
                  const Icon = [Shield, Lock, LayoutGrid, Users, Network][index % 5];
                  return (
                    <li key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("ddos.eyebrow")}
                title={t("ddos.title")}
                description={t("ddos.description")}
              />
              <div className="mt-6 grid gap-2">
                {ddosItems.map((item, index) => {
                  const Icon = [Shield, Network, Fingerprint, Zap][index % 4];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("ddos.message")}</p>
            </div>

            <DiagramPanel label={`${t("ddos.title")} — ${t("ddos.description")}`}>
              <FlowNode icon={Globe}>Internet</FlowNode>
              <FlowConnector />
              <FlowHub icon={Shield}>DDoS Protection</FlowHub>
              <FlowConnector />
              <div className="grid grid-cols-1 gap-3">
                <FlowNode>Malicious Traffic → Block</FlowNode>
                <FlowNode>Legitimate Traffic → ZenthCloud</FlowNode>
              </div>
            </DiagramPanel>
          </div>
        </PageContainer>
      </section>

      {/* 5. Identité & accès */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("identity.eyebrow")}
                title={t("identity.title")}
                description={t("identity.description")}
              />
              <div className="mt-6 grid gap-2">
                {identityItems.map((item, index) => {
                  const Icon = identityIcons[index % identityIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("identity.eyebrow")}
                title={t("identity.roles.title")}
              />
              <DiagramPanel label={t("identity.roles.title")}>
                <FlowNode icon={Users}>Organization</FlowNode>
                <FlowConnector />
                <div className="grid grid-cols-1 gap-2">
                  {identityRoles.map((role) => (
                    <FlowNode key={role}>{role}</FlowNode>
                  ))}
                </div>
              </DiagramPanel>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("mfa.eyebrow")}
                title={t("mfa.title")}
                description={t("mfa.description")}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {mfaItems.map((item, index) => {
                  const Icon = mfaIcons[index % mfaIcons.length];
                  return (
                    <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-6 text-sm font-medium text-foreground">{t("mfa.message")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("apiSecurity.eyebrow")}
                title={t("apiSecurity.title")}
                description={t("apiSecurity.description")}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {apiItems.map((item, index) => {
                  const Icon = apiIcons[index % apiIcons.length];
                  return (
                    <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 rounded-xl border border-border bg-slate-950 p-6 font-mono text-xs shadow-sm">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="ml-auto text-slate-400">{t("apiSecurity.terminalTitle")}</span>
                </div>
                <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {t("apiSecurity.terminalExample")}
                </pre>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 6. Protection des données */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-3">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("secrets.eyebrow")}
                title={t("secrets.title")}
                description={t("secrets.description")}
              />
              <div className="mt-6 space-y-2">
                {secretsItems.map((item, index) => {
                  const Icon = secretsIcons[index % secretsIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">{t("secrets.message")}</p>
            </div>

            <div>
              <SectionHeader align="left" eyebrow={t("dataSecurity.eyebrow")} title={t("dataSecurity.title")} description={t("dataSecurity.description")} />
              <div className="mt-6 space-y-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-sm font-bold text-foreground">{t("dataSecurity.atRest.title")}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{t("dataSecurity.atRest.description")}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-sm font-bold text-foreground">{t("dataSecurity.inTransit.title")}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{t("dataSecurity.inTransit.description")}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-sm font-bold text-foreground">{t("dataSecurity.inUse.title")}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{t("dataSecurity.inUse.description")}</p>
                </div>
              </div>
            </div>

            <div>
              <SectionHeader align="left" eyebrow={t("encryption.eyebrow")} title={t("encryption.title")} description={t("encryption.description")} />
              <div className="mt-6 space-y-2">
                {encryptionItems.map((item, index) => {
                  const Icon = encryptionIcons[index % encryptionIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("encryption.note")}</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 7. Sécurité des workloads */}
      <section className="py-16 md:py-24 bg-background">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("computeIsolation.eyebrow")}
                title={t("computeIsolation.title")}
                description={t("computeIsolation.description")}
              />
              <DiagramPanel label={`${t("computeIsolation.title")} — ${t("computeIsolation.description")}`}>
                <FlowNode icon={Server}>Physical Host</FlowNode>
                <FlowConnector />
                <FlowNode icon={Boxes}>Virtualization / Platform</FlowNode>
                <FlowConnector />
                <div className="grid grid-cols-3 gap-3">
                  <FlowNode variant="card" icon={Cpu}>VM-A</FlowNode>
                  <FlowNode variant="card" icon={Cpu}>VM-B</FlowNode>
                  <FlowNode variant="card" icon={Cpu}>VM-C</FlowNode>
                </div>
              </DiagramPanel>
              <div className="mt-6 grid gap-2">
                {computeItems.map((item, index) => {
                  const Icon = computeIcons[index % computeIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">{t("computeIsolation.dedicatedNote")}</p>
            </div>

            <div className="space-y-12">
              <div>
                <SectionHeader
                  align="left"
                  eyebrow={t("containerSecurity.eyebrow")}
                  title={t("containerSecurity.title")}
                  description={t("containerSecurity.description")}
                />
                <div className="mt-6 grid gap-2">
                  {containerItems.map((item, index) => {
                    const Icon = containerIcons[index % containerIcons.length];
                    return (
                      <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        <p className="text-sm font-semibold text-foreground">{item}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{t("containerSecurity.message")}</p>
                <div className="mt-4">
                  <Link
                    href={localizeHref("/public-cloud/containers", locale)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    {t("containerSecurity.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <div>
                <SectionHeader
                  align="left"
                  eyebrow={t("kubernetesSecurity.eyebrow")}
                  title={t("kubernetesSecurity.title")}
                  description={t("kubernetesSecurity.description")}
                />
                <div className="mt-6 grid gap-2">
                  {k8sItems.map((item, index) => {
                    const Icon = k8sIcons[index % k8sIcons.length];
                    return (
                      <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                        <p className="text-sm font-semibold text-foreground">{item}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4">
                  <Link
                    href={localizeHref("/public-cloud/containers", locale)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    {t("kubernetesSecurity.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("databaseSecurity.eyebrow")}
                title={t("databaseSecurity.title")}
                description={t("databaseSecurity.description")}
              />
              <DiagramPanel label={`${t("databaseSecurity.title")} — ${t("databaseSecurity.description")}`}>
                <FlowNode icon={Code2}>Application</FlowNode>
                <FlowConnector />
                <FlowNode icon={Lock}>Private Network</FlowNode>
                <FlowConnector />
                <FlowHub icon={Database}>Database</FlowHub>
                <FlowConnector />
                <div className="grid grid-cols-1 gap-2">
                  <FlowNode>Access Control</FlowNode>
                  <FlowNode>Encryption</FlowNode>
                  <FlowNode>Backup</FlowNode>
                </div>
              </DiagramPanel>
              <div className="mt-6 grid gap-2">
                {databaseItems.map((item, index) => {
                  const Icon = databaseIcons[index % databaseIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <Link
                  href={localizeHref("/public-cloud/databases", locale)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  {t("databaseSecurity.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("backup.eyebrow")}
                title={t("backup.title")}
                description={t("backup.description")}
              />
              <DiagramPanel label={`${t("backup.title")} — ${t("backup.description")}`}>
                <FlowNode icon={Server}>Production</FlowNode>
                <FlowConnector />
                <FlowHub icon={Archive}>Backup</FlowHub>
                <FlowConnector />
                <FlowNode icon={HistoryIcon}>Recovery Point</FlowNode>
                <FlowConnector />
                <FlowNode icon={RotateCcw}>Restore</FlowNode>
              </DiagramPanel>
              <div className="mt-6 grid gap-2">
                {backupItems.map((item, index) => {
                  const Icon = backupIcons[index % backupIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4">
                <Link
                  href={localizeHref("/public-cloud/backup", locale)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  {t("backup.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 8. Surveillance, audit & mises à jour */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("monitoring.eyebrow")}
                title={t("monitoring.title")}
                description={t("monitoring.description")}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {monitoringItems.map((item, index) => {
                  const Icon = monitoringIcons[index % monitoringIcons.length];
                  return (
                    <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("audit.eyebrow")}
                title={t("audit.title")}
                description={t("audit.description")}
              />
              <div className="mt-6 rounded-xl border border-border bg-card p-6 font-mono text-xs shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                  <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span className="ml-auto text-muted-foreground">audit</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <p>{t("audit.example.timestamp")}</p>
                  <p>User: {t("audit.example.user")}</p>
                  <p>Action: {t("audit.example.action")}</p>
                  <p>Resource: {t("audit.example.resource")}</p>
                  <p>Result: {t("audit.example.result")}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-2">
                {auditFields.map((field, index) => {
                  const Icon = [Users, FileText, Clock, Server, Check][index % 5];
                  return (
                    <div key={field} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{field}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("patchManagement.eyebrow")}
                title={t("patchManagement.title")}
                description={t("patchManagement.description")}
              />
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h4 className="text-base font-bold text-foreground">{t("patchManagement.zenthTitle")}</h4>
                  <ul className="mt-4 space-y-2">
                    {(t.raw("patchManagement.zenthItems") as string[]).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h4 className="text-base font-bold text-foreground">{t("patchManagement.customerTitle")}</h4>
                  <ul className="mt-4 space-y-2">
                    {(t.raw("patchManagement.customerItems") as string[]).map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-sm font-medium text-foreground">{t("patchManagement.message")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("securityUpdates.eyebrow")}
                title={t("securityUpdates.title")}
                description={t("securityUpdates.description")}
              />
              <div className="mt-6 grid gap-2">
                {(t.raw("securityUpdates.items") as string[]).map((item, index) => {
                  const Icon = [Server, Cpu, Cloud, ShieldCheck][index % 4];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("securityUpdates.note")}</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 9. Confiance & transparence */}
      <section id="architecture" className="py-16 md:py-24 bg-background scroll-mt-20">
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
              <FlowNode icon={Shield}>Edge Protection</FlowNode>
              <FlowConnector />
              <FlowNode icon={ShieldCheck}>Firewall</FlowNode>
              <FlowConnector />
              <div className="grid grid-cols-2 gap-4">
                <FlowNode>Public Network</FlowNode>
                <FlowNode>Private Network</FlowNode>
              </div>
              <FlowConnector />
              <div className="grid grid-cols-2 gap-4">
                <FlowNode>Load Balancer</FlowNode>
                <div className="grid grid-cols-3 gap-2">
                  <FlowNode variant="card" icon={Server}>Compute</FlowNode>
                  <FlowNode variant="card" icon={Database}>Database</FlowNode>
                  <FlowNode variant="card" icon={HardDrive}>Storage</FlowNode>
                </div>
              </div>
              <FlowConnector />
              <FlowNode icon={Code2}>Application</FlowNode>
              <FlowConnector />
              <div className="grid grid-cols-2 gap-3">
                <FlowNode variant="card" icon={Archive}>Backup</FlowNode>
                <FlowNode variant="card" icon={Activity}>Monitoring</FlowNode>
              </div>
            </DiagramPanel>
          </div>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader
              eyebrow={t("securityByDefault.eyebrow")}
              title={t("securityByDefault.title")}
              description={t("securityByDefault.description")}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {defaultItems.map((item, index) => {
                const Icon = defaultIcons[index % defaultIcons.length];
                return (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-semibold text-foreground">{item}</p>
                  </div>
                );
              })}
            </div>

            <p className="mt-8 text-center text-sm font-medium text-foreground">
              {t("securityByDefault.message")}
            </p>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-3">
            <div>
              <SectionHeader align="left" eyebrow={t("compliance.eyebrow")} title={t("compliance.title")} description={t("compliance.description")} />
              <div className="mt-6 grid gap-2">
                {complianceItems.map((item, index) => {
                  const Icon = complianceIcons[index % complianceIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("compliance.roadmap")}</p>
            </div>

            <div>
              <SectionHeader align="left" eyebrow={t("sovereignty.eyebrow")} title={t("sovereignty.title")} description={t("sovereignty.description")} />
              <div className="mt-6 grid gap-2">
                {sovereigntyItems.map((item, index) => {
                  const Icon = sovereigntyIcons[index % sovereigntyIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t("sovereignty.message")}</p>
            </div>

            <div>
              <SectionHeader align="left" eyebrow={t("openSource.eyebrow")} title={t("openSource.title")} description={t("openSource.description")} />
              <blockquote className="mt-6 border-l-4 border-primary pl-5 text-lg font-medium text-foreground">
                {t("openSource.quote")}
              </blockquote>
              <div className="mt-6 grid gap-2">
                {openSourceItems.map((item, index) => {
                  const Icon = openSourceIcons[index % openSourceIcons.length];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-12 border-t border-border pt-16 lg:grid-cols-2">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("incidentResponse.eyebrow")}
                title={t("incidentResponse.title")}
                description={t("incidentResponse.description")}
              />
              <DiagramPanel label={`${t("incidentResponse.title")} — ${t("incidentResponse.description")}`}>
                {incidentSteps.map((step, index) => (
                  <React.Fragment key={step}>
                    <FlowNode>{step}</FlowNode>
                    {index < incidentSteps.length - 1 && <FlowConnector />}
                  </React.Fragment>
                ))}
              </DiagramPanel>
              <p className="mt-6 text-center text-sm text-muted-foreground">{t("incidentResponse.note")}</p>
            </div>

            <div>
              <SectionHeader
                align="left"
                eyebrow={t("trustCenter.eyebrow")}
                title={t("trustCenter.title")}
                description={t("trustCenter.description")}
              />
              <div className="mt-6 grid gap-2">
                {trustCenterItems.map((item, index) => {
                  const Icon = [FileText, FileText, ShieldCheck, FileText, Users, Mail, HistoryIcon, Activity][index % 8];
                  return (
                    <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-muted p-3">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">{item}</p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">{t("trustCenter.coming")}</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* 10. Développeurs, prix & action */}
      <section className="border-y border-border bg-muted py-16 md:py-24">
        <PageContainer>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionHeader
                align="left"
                eyebrow={t("developers.eyebrow")}
                title={t("developers.title")}
                description={t("developers.description")}
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {developerItems.map((item, index) => {
                  const Icon = developerIcons[index % developerIcons.length];
                  return (
                    <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <p className="text-sm font-semibold text-foreground">{item}</p>
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
                <span className="ml-auto text-slate-400">{t("developers.terminalTitle")}</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {t("developers.terminalExample")}
              </pre>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader
              eyebrow={t("managedSecurity.eyebrow")}
              title={t("managedSecurity.title")}
              description={t("managedSecurity.description")}
            />

            <div className="grid gap-5 md:grid-cols-3">
              {(["self", "managed", "enterprise"] as const).map((key) => {
                const icons = { self: Users, managed: Settings, enterprise: Building2 };
                const Icon = icons[key];
                const features = t.raw(`managedSecurity.${key}.features`) as string[];
                return (
                  <div key={key} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-base font-bold text-foreground">
                      {t(`managedSecurity.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {t(`managedSecurity.${key}.description`)}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-16">
            <SectionHeader
              eyebrow={t("pricing.eyebrow")}
              title={t("pricing.title")}
              description={t("pricing.description")}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground">{t("pricing.included.title")}</h3>
                <ul className="mt-4 space-y-2">
                  {includedItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground">{t("pricing.optional.title")}</h3>
                <ul className="mt-4 space-y-2">
                  {optionalItems.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Button asChild size="lg" className={WHITE_BUTTON_CLASSES}>
                <Link href={localizeHref("/pricing", locale)}>
                  {t("pricing.cta")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 border-t border-border pt-16">
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
                    href={localizeHref(t(`crossSelling.${item.key}.href`), locale)}
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
                <Link href={localizeHref("/contact", locale)}>
                  {t("finalCta.secondary")}
                </Link>
              </Button>
            </div>
            <div className="mt-4">
              <Link
                href="https://docs.zenthcloud.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary-foreground/80 hover:text-white hover:underline"
              >
                {t("finalCta.tertiary")}
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </>
  );
}
