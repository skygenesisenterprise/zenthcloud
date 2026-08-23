import {
  Cloud,
  HardDrive,
  Network,
  Database,
  Container,
  Cpu,
  ShieldCheck,
  Archive,
  Server,
  Globe,
  Phone,
  Wifi,
  Zap,
  Lock,
  Users,
  Rocket,
  Building2,
  Gamepad2,
  Brain,
  ShoppingCart,
  ServerOff,
  Code2,
  Boxes,
  Settings,
  MapPin,
  Radio,
  Briefcase,
  HeartHandshake,
} from "lucide-react";
import * as React from "react";

export interface NavItem {
  label?: string;
  labelKey?: string;
  href?: string;
  description?: string;
  descriptionKey?: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
  children?: NavItem[];
}

export interface NavGroupFooter {
  title: string;
  href: string;
  description: string;
  titleKey?: string;
  descriptionKey?: string;
}

export interface NavGroup {
  label?: string;
  labelKey?: string;
  href?: string;
  headline?: string;
  headlineKey?: string;
  items: NavItem[];
  footer?: NavGroupFooter;
  footerLinks?: NavItem[];
}

export const publicCloudItems: NavItem[] = [
  { labelKey: "publicCloud.compute.label", href: "/public-cloud/compute", descriptionKey: "publicCloud.compute.description", icon: Cpu },
  { labelKey: "publicCloud.storage.label", href: "/public-cloud/storage", descriptionKey: "publicCloud.storage.description", icon: HardDrive },
  { labelKey: "publicCloud.networking.label", href: "/public-cloud/networking", descriptionKey: "publicCloud.networking.description", icon: Network },
  { labelKey: "publicCloud.databases.label", href: "/public-cloud/databases", descriptionKey: "publicCloud.databases.description", icon: Database },
  { labelKey: "publicCloud.containers.label", href: "/public-cloud/containers", descriptionKey: "publicCloud.containers.description", icon: Container },
  { labelKey: "publicCloud.gpuAi.label", href: "/public-cloud/gpu-and-ai", descriptionKey: "publicCloud.gpuAi.description", icon: Brain },
  { labelKey: "publicCloud.backup.label", href: "/public-cloud/backup", descriptionKey: "publicCloud.backup.description", icon: Archive },
  { labelKey: "publicCloud.security.label", href: "/public-cloud/security", descriptionKey: "publicCloud.security.description", icon: ShieldCheck },
];

export const privateCloudItems: NavItem[] = [
  { labelKey: "privateCloud.dedicatedCloud.label", href: "/private-cloud/dedicated-cloud", descriptionKey: "privateCloud.dedicatedCloud.description", icon: Cloud },
  { labelKey: "privateCloud.virtualization.label", href: "/private-cloud/virtualization", descriptionKey: "privateCloud.virtualization.description", icon: Boxes },
  { labelKey: "privateCloud.privateNetworking.label", href: "/private-cloud/networking", descriptionKey: "privateCloud.privateNetworking.description", icon: Network },
  { labelKey: "privateCloud.storage.label", href: "/private-cloud/storage", descriptionKey: "privateCloud.storage.description", icon: HardDrive },
  { labelKey: "privateCloud.kubernetes.label", href: "/private-cloud/kubernetes", descriptionKey: "privateCloud.kubernetes.description", icon: Container },
  { labelKey: "privateCloud.disasterRecovery.label", href: "/private-cloud/disaster-recovery", descriptionKey: "privateCloud.disasterRecovery.description", icon: ServerOff },
  { labelKey: "privateCloud.securityCompliance.label", href: "/private-cloud/security-compliance", descriptionKey: "privateCloud.securityCompliance.description", icon: Lock },
  { labelKey: "privateCloud.managedInfrastructure.label", href: "/private-cloud/managed-infrastructure", descriptionKey: "privateCloud.managedInfrastructure.description", icon: Settings },
];

export const serversItems: NavItem[] = [
  { labelKey: "servers.dedicatedServers.label", href: "/dedicated-servers", descriptionKey: "servers.dedicatedServers.description", icon: Server },
  { labelKey: "servers.vps.label", href: "/vps", descriptionKey: "servers.vps.description", icon: Cloud },
  { labelKey: "servers.compute.label", href: "/dedicated-servers/compute", descriptionKey: "servers.compute.description", icon: Cpu },
  { labelKey: "servers.highMemory.label", href: "/dedicated-servers/high-memory", descriptionKey: "servers.highMemory.description", icon: Zap },
  { labelKey: "servers.storage.label", href: "/dedicated-servers/storage", descriptionKey: "servers.storage.description", icon: HardDrive },
  { labelKey: "servers.gpu.label", href: "/dedicated-servers/gpu", descriptionKey: "servers.gpu.description", icon: Brain },
  { labelKey: "servers.networking.label", href: "/dedicated-servers/networking", descriptionKey: "servers.networking.description", icon: Network },
  { labelKey: "servers.ddosProtection.label", href: "/dedicated-servers/ddos-protection", descriptionKey: "servers.ddosProtection.description", icon: ShieldCheck },
];

export const telecomItems: NavItem[] = [
  { labelKey: "telecom.internetAccess.label", href: "/telecom/internet-access", descriptionKey: "telecom.internetAccess.description", icon: Globe },
  { labelKey: "telecom.dedicatedInternet.label", href: "/telecom/dedicated-internet", descriptionKey: "telecom.dedicatedInternet.description", icon: Wifi },
  { labelKey: "telecom.privateNetworking.label", href: "/telecom/private-networking", descriptionKey: "telecom.privateNetworking.description", icon: Network },
  { labelKey: "telecom.cloudConnect.label", href: "/telecom/cloud-connect", descriptionKey: "telecom.cloudConnect.description", icon: Cloud },
  { labelKey: "telecom.ipTransit.label", href: "/telecom/ip-transit", descriptionKey: "telecom.ipTransit.description", icon: Radio },
  { labelKey: "telecom.ddosProtection.label", href: "/telecom/ddos-protection", descriptionKey: "telecom.ddosProtection.description", icon: ShieldCheck },
  { labelKey: "telecom.enterpriseConnectivity.label", href: "/telecom/enterprise-connectivity", descriptionKey: "telecom.enterpriseConnectivity.description", icon: Building2 },
  { labelKey: "telecom.voiceVoip.label", href: "/telecom/voice-voip", descriptionKey: "telecom.voiceVoip.description", icon: Phone },
];

export const solutionsItems: NavItem[] = [
  { labelKey: "solutions.developers.label", href: "/solutions/developers", descriptionKey: "solutions.developers.description", icon: Code2 },
  { labelKey: "solutions.startups.label", href: "/solutions/startups", descriptionKey: "solutions.startups.description", icon: Rocket },
  { labelKey: "solutions.business.label", href: "/solutions/business", descriptionKey: "solutions.business.description", icon: Briefcase },
  { labelKey: "solutions.enterprise.label", href: "/solutions/enterprise", descriptionKey: "solutions.enterprise.description", icon: Building2 },
  { labelKey: "solutions.gaming.label", href: "/solutions/gaming", descriptionKey: "solutions.gaming.description", icon: Gamepad2 },
  { labelKey: "solutions.aiGpu.label", href: "/solutions/ai-gpu", descriptionKey: "solutions.aiGpu.description", icon: Brain },
  { labelKey: "solutions.webEcommerce.label", href: "/solutions/web-ecommerce", descriptionKey: "solutions.webEcommerce.description", icon: ShoppingCart },
  { labelKey: "solutions.backupDisasterRecovery.label", href: "/solutions/backup-disaster-recovery", descriptionKey: "solutions.backupDisasterRecovery.description", icon: Archive },
];

export const companyItems: NavItem[] = [
  { labelKey: "company.about.label", href: "/company", descriptionKey: "company.about.description", icon: Users },
  { labelKey: "company.infrastructure.label", href: "/company/infrastructure", descriptionKey: "company.infrastructure.description", icon: Server },
  { labelKey: "company.dataCenters.label", href: "/company/data-centers", descriptionKey: "company.dataCenters.description", icon: MapPin },
  { labelKey: "company.network.label", href: "/company/network", descriptionKey: "company.network.description", icon: Network },
  { labelKey: "company.security.label", href: "/security", descriptionKey: "company.security.description", icon: ShieldCheck },
  { labelKey: "company.reliability.label", href: "/company/reliability", descriptionKey: "company.reliability.description", icon: Zap },
  { labelKey: "company.technology.label", href: "/company/technology", descriptionKey: "company.technology.description", icon: Cpu },
  { labelKey: "company.careers.label", href: "/company/careers", descriptionKey: "company.careers.description", icon: HeartHandshake },
  { labelKey: "company.partners.label", href: "/company/partners", descriptionKey: "company.partners.description", icon: Briefcase },
  { labelKey: "company.contact.label", href: "/contact", descriptionKey: "company.contact.description", icon: Phone },
];

export const mainNav: NavGroup[] = [
  {
    labelKey: "publicCloud.label",
    href: "/public-cloud",
    headlineKey: "publicCloud.headline",
    items: publicCloudItems,
    footerLinks: [
      { labelKey: "publicCloud.footer.pricing", href: "/pricing" },
      { labelKey: "publicCloud.footer.regions", href: "/company/infrastructure" },
      { labelKey: "publicCloud.footer.documentation", href: "https://docs.zenthcloud.com", external: true },
      { labelKey: "publicCloud.footer.roadmap", href: "/changelog" },
    ],
  },
  {
    labelKey: "privateCloud.label",
    href: "/private-cloud",
    headlineKey: "privateCloud.headline",
    items: privateCloudItems,
    footerLinks: [
      { labelKey: "privateCloud.footer.pricing", href: "/pricing" },
      { labelKey: "privateCloud.footer.compliance", href: "/company/infrastructure" },
      { labelKey: "privateCloud.footer.documentation", href: "https://docs.zenthcloud.com", external: true },
      { labelKey: "privateCloud.footer.roadmap", href: "/changelog" },
    ],
  },
  {
    labelKey: "servers.label",
    href: "/dedicated-servers",
    headlineKey: "servers.headline",
    items: serversItems,
    footerLinks: [
      { labelKey: "servers.footer.pricing", href: "/pricing" },
      { labelKey: "servers.footer.licences", href: "/dedicated-servers" },
      { labelKey: "servers.footer.documentation", href: "https://docs.zenthcloud.com", external: true },
      { labelKey: "servers.footer.roadmap", href: "/changelog" },
    ],
  },
  {
    labelKey: "telecom.label",
    href: "/telecom",
    headlineKey: "telecom.headline",
    items: telecomItems,
    footer: {
      title: "Arkana Telecom",
      titleKey: "telecom.footerTitle",
      href: "https://arkana-telecom.com",
      description: "Powered by Arkana Telecom — the connectivity layer of the ZenthCloud ecosystem.",
      descriptionKey: "telecom.footerDescription",
    },
    footerLinks: [
      { labelKey: "telecom.footer.pricing", href: "/pricing" },
      { labelKey: "telecom.footer.guides", href: "https://docs.zenthcloud.com", external: true },
      { labelKey: "telecom.footer.partner", href: "/telecom" },
    ],
  },
  {
    labelKey: "solutions.label",
    href: "/solutions",
    headlineKey: "solutions.headline",
    items: solutionsItems,
    footerLinks: [
      { labelKey: "solutions.footer.all", href: "/solutions" },
      { labelKey: "solutions.footer.startups", href: "/solutions/startups" },
      { labelKey: "solutions.footer.contact", href: "/contact" },
    ],
  },
  { labelKey: "blog", href: "/blog", items: [] },
  {
    labelKey: "company.label",
    href: "/company",
    headlineKey: "company.headline",
    items: companyItems,
    footerLinks: [
      { labelKey: "company.footer.about", href: "/company" },
      { labelKey: "company.footer.infrastructure", href: "/company/infrastructure" },
      { labelKey: "company.footer.contact", href: "/contact" },
    ],
  },
];

export const utilityNav: NavItem[] = [
  { labelKey: "pricing", href: "/pricing" },
  { labelKey: "signIn", href: "https://manager.zenthcloud.com", external: true },
];
