"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Archive,
  Brain,
  Building2,
  ChevronsUpDown,
  Cloud,
  Container,
  Database,
  ExternalLink,
  Globe,
  HardDrive,
  LayoutDashboard,
  Lock,
  Network,
  Phone,
  Plus,
  Server,
  ShieldCheck,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

/* ------------------------------------------------------------------ */
/* Configuration de navigation                                         */
/* ------------------------------------------------------------------ */

interface NavItem {
  title: string;
  href: string;
  badge?: string;
}

interface NavGroup {
  title: string;
  icon: LucideIcon;
  items: NavItem[];
  comingSoon?: boolean;
}

/**
 * Une section d'un menu survol (bulle), label étant l'intitulé facultatif
 * de la section et items les liens associés.
 */
interface ServiceSection {
  label?: string;
  items: NavItem[];
}

/**
 * Données d'un groupe de services affiché" en bulle au survol.
 * headline est un sous-titre facultatif affiché sous le titre du groupe.
 */
interface ServiceMenu {
  title: string;
  icon: LucideIcon;
  rootHref: string;
  headline?: string;
  sections: ServiceSection[];
}

const navHome = {
  title: "Vue d'ensemble",
  href: "/dash",
  icon: LayoutDashboard,
};

const navServiceMenus: ServiceMenu[] = [
  {
    title: "Bare Metal",
    icon: Server,
    rootHref: "/dash/bare-metal",
    sections: [
      {
        label: "Serveurs dédiés et virtuels",
        items: [
          { title: "Serveurs dédiés", href: "/dash/bare-metal/dedicated-cloud" },
          { title: "Serveurs Privés Virtuels", href: "/dash/bare-metal/vps" },
          { title: "Managed Bare Metal", href: "/dash/bare-metal/managedbarmetal" },
          { title: "Licences", href: "/dash/bare-metal/license" },
        ],
      },
      {
        label: "Stockage et sauvegarde",
        items: [
          { title: "NAS-HA", href: "/dash/bare-metal/nasha" },
          { title: "Enterprise File Storage", href: "/dash/bare-metal/netapp" },
          { title: "Cloud Disk Array", href: "/dash/bare-metal/cda" },
          { title: "Backup Agent", href: "/dash/bare-metal/backup-agent", badge: "Nouveau" },
          { title: "Backup Licenses", href: "/dash/bare-metal/backup-licenses", badge: "Nouveau" },
        ],
      },
    ],
  },
  {
    title: "Private Cloud",
    icon: Lock,
    rootHref: "/dash/private-cloud",
    sections: [
      {
        label: "Plateformes",
        items: [
          {
            title: "Managed VMware vSphere",
            href: "/dash/private-cloud/dedicated_cloud",
          },
          {
            title: "Public VCF as-a-Service",
            href: "/dash/private-cloud/public-cvf-aas",
            badge: "Nouveau",
          },
          { title: "Nutanix", href: "/dash/private-cloud/nutanix" },
          { title: "Licences", href: "/dash/private-cloud/license" },
          { title: "SAP Features Hub", href: "/dash/private-cloud/sap-feature-hub" },
        ],
      },
      {
        label: "Stockage et sauvegarde",
        items: [
          { title: "Veeam Enterprise", href: "/dash/private-cloud/veeam-enterprise" },
          { title: "HYCU", href: "/dash/private-cloud/hycu", badge: "Nouveau" },
          { title: "Managed Veeam for VCD", href: "/dash/private-cloud/veeam-vcd", badge: "Nouveau" },
          {
            title: "Backup Licenses",
            href: "/dash/private-cloud/backup-licenses",
            badge: "Nouveau",
          },
        ],
      },
    ],
  },

  {
    title: "Network",
    icon: Network,
    rootHref: "/dash/network",
    sections: [
      {
        label: "Réseau public",
        items: [{ title: "Adresses IP Publiques", href: "/dash/network/public-ip" }],
      },
      {
        label: "Réseau privé",
        items: [
          { title: "Réseau Privé vRack", href: "/dash/network/vrack" },
          { title: "vRack Services", href: "/dash/network/vrack-services" },
          { title: "ZenthCloud Connect", href: "/dash/network/zenthcloud-connect" },
        ],
      },
      {
        label: "Services réseau",
        items: [
          { title: "Load Balancer", href: "/dash/network/load-balancer" },
          { title: "Network Security Dashboard", href: "/dash/network/security-dashboard" },
          { title: "Content Delivery Network", href: "/dash/network/content-delivery-network" },
        ],
      },
    ],
  },
  {
    title: "Public Cloud",
    icon: Cloud,
    rootHref: "/dash/public-cloud",
    sections: [
      {
        label: "Compute",
        items: [
          {
            title: "Compute",
            href: "/dash/public-cloud/compute",
          },
          {
            title: "GPU & IA",
            href: "/dash/public-cloud/gpu-and-ai",
          },
        ],
      },
      {
        label: "Stockage et sauvegarde",
        items: [
          {
            title: "Object Storage",
            href: "/dash/public-cloud/storage",
          },
          {
            title: "Sauvegarde",
            href: "/dash/public-cloud/backup",
          },
        ],
      },
      {
        label: "Conteneurs et données",
        items: [
          {
            title: "Kubernetes",
            href: "/dash/public-cloud/containers",
          },
          {
            title: "Bases de données",
            href: "/dash/public-cloud/databases",
          },
        ],
      },
    ],
  },
  {
    title: "Sunrise",
    icon: WalletCards,
    rootHref: "/dash/sunrise",
    sections: [
      {
        items: [
          {
            title: "Cloud Desktop Infrastructure",
            href: "/dash/sunrise/cloud-desktop-infrastructure",
          },
          {
            title: "Contact Center Solution",
            href: "/dash/sunrise/contact-center-solution",
          },
          {
            title: "Office 365 Revendeurs",
            href: "/dash/sunrise/office-365-partners",
          },
          { title: "SSL Gateway", href: "/dash/sunrise/ssl-gateway" },
        ],
      },
    ],
  },
  {
    title: "IAM & Sécurité",
    icon: ShieldCheck,
    rootHref: "/dash/iam",
    sections: [
      {
        label: "Gestion des identités et des accès",
        items: [
          { title: "Identités", href: "/dash/iam/identities" },
          { title: "Politiques", href: "/dash/iam/policies" },
          { title: "Clés API", href: "/dash/iam/api-keys" },
          { title: "Tag Management", href: "/dash/iam/tags" },
          { title: "Logs du compte", href: "/dash/iam/account-logs" },
        ],
      },
      {
        label: "Sécurité",
        items: [
          { title: "Key Management Service", href: "/dash/iam/kms" },
          { title: "Secret Manager", href: "/dash/iam/secret-manager" },
        ],
      },
      {
        label: "Opérations",
        items: [{ title: "Logs Data Platform", href: "/dash/iam/logs" }],
      },
    ],
  },
  {
    title: "Télécom & VoIP",
    icon: Phone,
    rootHref: "/dash/telecom",
    sections: [
      {
        label: "Accès Internet",
        items: [
          { title: "Offres Internet", href: "/dash/telecom/broadband" },
          { title: "OverTheBox", href: "/dash/telecom/overthebox" },
        ],
      },
      {
        label: "Téléphonie",
        items: [
          { title: "VoIP & Fax", href: "/dash/telecom/voip-fax" },
          { title: "SMS", href: "/dash/telecom/sms" },
          { title: "Fax", href: "/dash/telecom/fax" },
          { title: "Opérations", href: "/dash/telecom/operations" },
        ],
      },
    ],
  },
  {
    title: "Web Cloud",
    icon: Globe,
    rootHref: "/dash/web-cloud",
    sections: [
      {
        label: "Domaines & DNS",
        items: [
          { title: "Opérations en cours", href: "/dash/web-cloud/domains/operations" },
          { title: "Noms de domaine", href: "/dash/web-cloud/domains" },
          { title: "Zones DNS", href: "/dash/web-cloud/domains/dns" },
        ],
      },
      {
        label: "Web",
        items: [
          { title: "Hébergements", href: "/dash/web-cloud/hosting" },
          { title: "Sites internet", href: "/dash/web-cloud/sites" },
          { title: "Web Cloud Databases", href: "/dash/web-cloud/databases" },
          {
            title: "Managed hosting for WordPress",
            href: "/dash/web-cloud/wordpress",
          },
          { title: "Video Center", href: "/dash/web-cloud/video-center" },
        ],
      },
      {
        label: "Emails",
        items: [
          { title: "Zimbra Mail", href: "/dash/web-cloud/emails/zimbra" },
          { title: "Email Pro", href: "/dash/web-cloud/emails/email-pro" },
          { title: "MX Plan", href: "/dash/web-cloud/emails/mx-plan" },
          { title: "Délégations emails", href: "/dash/web-cloud/emails/delegations" },
        ],
      },
      {
        label: "Microsoft",
        items: [
          { title: "Microsoft 365", href: "/dash/web-cloud/microsoft/microsoft-365" },
          { title: "Exchange", href: "/dash/web-cloud/microsoft/exchange" },
        ],
      },
    ],
  },
];

const navGroups: NavGroup[] = [];

interface FooterLink {
  title: string;
  href: string;
  external?: boolean;
}

const footerLinks: FooterLink[] = [
  { title: "Centre d'aide", href: "https://support.zenthcloud.com", external: true },
  { title: "Mes demandes d'assistance", href: "/dash/support/tickets" },
  { title: "Roadmap & Changelog", href: "/changelog" },
  { title: "Marketplace", href: "/dash/marketplace" },
  { title: "État du réseau et incidents", href: "https://status.zenthcloud.com", external: true },
  { title: "Créer un ticket", href: "/dash/support/tickets/new" },
  { title: "Live Chat", href: "/dash/support/live-chat" },
  { title: "Assistant IA", href: "/dash/support/assistant" },
  { title: "Mon bilan carbone", href: "/dash/carbon-footprint" },
];

/* ------------------------------------------------------------------ */
/* Sélecteur d'organisation (workspace)                                */
/* ------------------------------------------------------------------ */

const organisations = [
  { name: "ZenthCloud", role: "Propriétaire" },
  { name: "Équipe Cloud", role: "Administrateur" },
  { name: "Projet Client A", role: "Membre" },
];

function OrganizationSwitcher() {
  const [current, setCurrent] = React.useState(organisations[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{current.name}</span>
                <span className="truncate text-xs text-muted-foreground">{current.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start" side="bottom" sideOffset={4}>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organisations
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {organisations.map((org) => (
                <DropdownMenuItem
                  key={org.name}
                  className="gap-2 p-2"
                  onSelect={() => setCurrent(org)}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Building2 className="size-3.5 shrink-0" />
                  </div>
                  <span className="flex-1 truncate">{org.name}</span>
                  <span className="text-xs text-muted-foreground">{org.role}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-sm border bg-transparent">
                  <Plus className="size-3.5" />
                </div>
                <span className="font-medium text-muted-foreground">
                  Ajouter une organisation
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/* ------------------------------------------------------------------ */
/* Liens du pied de page                                               */
/* ------------------------------------------------------------------ */

function SidebarFooterLink({ link }: { link: FooterLink }) {
  const className =
    "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground";

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        <span>{link.title}</span>
        <ExternalLink className="ml-auto size-3 shrink-0" />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      <span>{link.title}</span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* "Bulle" de groupe de services (Bare Metal Cloud, Private Cloud…)
/* ------------------------------------------------------------------ */

// Délai de grâce avant fermeture, pour que la souris puisse traverser
// l'espace entre le déclencheur et la bulle sans la refermer.
const HOVER_CLOSE_DELAY = 150;
// Largeur estimée de la bulle (en px), utilisée pour la garder à l'écran.
const PANEL_WIDTH = 260;

function ServiceHoverMenu({ menu, pathname }: { menu: ServiceMenu; pathname: string }) {
  const [open, setOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);
  const triggerRef = React.useRef<HTMLLIElement | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calcule la position de la bulle puis l'ouvre. La bulle est en
  // position: fixed pour échapper à l'overflow du sidebar et rester stable.
  const openMenu = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const el = triggerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      let left = rect.right + 8;
      let top = rect.top;
      // Garder la bulle dans la fenêtre.
      if (left + PANEL_WIDTH > window.innerWidth - 8) {
        left = rect.left - PANEL_WIDTH - 8;
      }
      const panelHeight = 380;
      if (top + panelHeight > window.innerHeight - 8) {
        top = Math.max(8, window.innerHeight - panelHeight - 8);
      }
      setPosition({ top, left });
    }
    setOpen(true);
  }, []);

  const scheduleClose = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setPosition(null);
    }, HOVER_CLOSE_DELAY);
  }, []);

  const cancelClose = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Nettoie le timer au démontage.
  React.useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <li
      ref={triggerRef}
      className="group/menu-item relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <SidebarMenuButton
        tooltip={menu.title}
        isActive={pathname.startsWith(menu.rootHref)}
        asChild
      >
        <Link href={menu.rootHref}>
          <menu.icon />
          <span>{menu.title}</span>
        </Link>
      </SidebarMenuButton>

      {open && position && (
        <div
          role="menu"
          style={{ top: position.top, left: position.left }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="bg-popover text-popover-foreground fixed z-50 rounded-md border p-2 shadow-md"
        >
          <div className="px-2 pt-1 pb-2 text-sm font-semibold">{menu.title}</div>
          {menu.headline && (
            <div className="px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
              {menu.headline}
            </div>
          )}
          <div className="my-1 h-px bg-border" />
          {menu.sections.map((section, index) => (
            <React.Fragment key={section.label ?? index}>
              {section.label && (
                <div className="px-2 pt-2 pb-1 text-xs font-medium text-muted-foreground">
                  {section.label}
                </div>
              )}
              <div className="flex flex-col">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        active && "bg-accent text-accent-foreground",
                      )}
                    >
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Dialog "Ajouter un service"                                         */
/* ------------------------------------------------------------------ */

interface CatalogService {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

interface CatalogGroup {
  label: string;
  services: CatalogService[];
}

const allServices: CatalogGroup[] = [
  {
    label: "Bare Metal Cloud",
    services: [
      { label: "Serveurs dédiés", description: "Serveurs physiques dédiés", icon: Server, href: "/order/check-in" },
      { label: "Serveurs Privés Virtuels", description: "VPS élastiques à la demande", icon: HardDrive, href: "/order/check-in" },
      { label: "Managed Bare Metal", description: "VMware managé en haute disponibilité", icon: Container, href: "/order/check-in" },
      { label: "NAS-HA", description: "Stockage réseau haute disponibilité", icon: Archive, href: "/order/check-in" },
    ],
  },
  {
    label: "Cloud computing",
    services: [
      { label: "Compute", description: "Instances cloud à la demande", icon: Cloud, href: "/order/check-in" },
      { label: "Kubernetes", description: "Conteneurs managés", icon: Container, href: "/order/check-in" },
      { label: "Databases", description: "Bases de données managées", icon: Database, href: "/order/check-in" },
      { label: "Object Storage", description: "Stockage d'objets élastique", icon: Archive, href: "/order/check-in" },
      { label: "GPU & IA", description: "Serveurs GPU pour l'IA", icon: Brain, href: "/order/check-in" },
    ],
  },
  {
    label: "Autres services",
    services: [
      { label: "Network", description: "Réseau privé et pare-feu", icon: Network, href: "/order/check-in" },
      { label: "IAM & Sécurité", description: "Identités et accès", icon: ShieldCheck, href: "/order/check-in" },
      { label: "Télécom", description: "Téléphonie et SDA", icon: Phone, href: "/order/check-in" },
      { label: "Web Cloud", description: "Hébergement web et e-mail", icon: Globe, href: "/order/check-in" },
    ],
  },
];

function AddServiceDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <>
      <SidebarMenuItem className="mt-2">
        <SidebarMenuButton
          tooltip="Ajouter un service"
          onClick={() => setOpen(true)}
          className="justify-center bg-sidebar-accent/60 hover:bg-sidebar-accent"
        >
          <Plus />
          <span>Ajouter un service</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Ajouter un service"
        description="Choisissez un service à ajouter à votre hub"
      >
        <CommandInput placeholder="Rechercher un service…" />
        <CommandList>
          <CommandEmpty>Aucun service trouvé.</CommandEmpty>
          {allServices.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.services.map((service) => {
                const Icon = service.icon;
                return (
                  <CommandItem
                    key={service.label}
                    value={service.label}
                    onSelect={() => {
                      setOpen(false);
                      router.push(service.href);
                    }}
                  >
                    <Icon />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{service.label}</span>
                      <span className="text-xs text-muted-foreground">{service.description}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar principale                                                  */
/* ------------------------------------------------------------------ */

export function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hub de services</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip={navHome.title}
                  isActive={pathname === navHome.href}
                  asChild
                >
                  <Link href={navHome.href}>
                    <navHome.icon />
                    <span>{navHome.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {navServiceMenus.map((menu) => (
                <ServiceHoverMenu key={menu.title} menu={menu} pathname={pathname} />
              ))}

              {navGroups.map((group) => (
                <SidebarMenuItem key={group.title}>
                  <SidebarMenuButton
                    tooltip={group.title}
                    disabled
                    className="text-sidebar-foreground/55 opacity-100 hover:bg-transparent hover:text-sidebar-foreground/55"
                  >
                    <group.icon />
                    <span>{group.title}</span>
                    <SidebarMenuBadge className="bg-sidebar-accent/60 text-sidebar-foreground/60">
                      Bientôt
                    </SidebarMenuBadge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <AddServiceDialog />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-1 px-2 py-1 group-data-[collapsible=icon]:hidden">
          {footerLinks.map((link) => (
            <SidebarFooterLink key={link.href} link={link} />
          ))}

          <div className="mt-2 flex items-center gap-2 border-t border-sidebar-border/60 px-1 pt-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Cloud className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">ZenthCloud Manager</p>
              <p className="text-[11px] text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
