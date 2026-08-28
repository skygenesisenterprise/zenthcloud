"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronDown,
  ChevronsUpDown,
  Cloud,
  Globe,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Network,
  Plus,
  Server,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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

const navHome = {
  title: "Vue d'ensemble",
  href: "/dash",
  icon: LayoutDashboard,
};

const navGroups: NavGroup[] = [
  {
    title: "Public Cloud",
    icon: Cloud,
    items: [
      { title: "Instances", href: "/dash/public-cloud/compute" },
      { title: "Conteneurs", href: "/dash/public-cloud/container" },
      { title: "Bases de données", href: "/dash/public-cloud/databases" },
    ],
  },
  { title: "Private Cloud", icon: Lock, items: [], comingSoon: true },
  { title: "Bare Metal Cloud", icon: Server, items: [], comingSoon: true },
  {
    title: "Web Cloud",
    icon: Globe,
    items: [
      { title: "Hébergements web", href: "/dash/web-cloud/web-hosting/hosting" },
      { title: "Sites web", href: "/dash/web-cloud/web-hosting/website" },
      { title: "Domaines", href: "/dash/web-cloud/web-domains/domain" },
      { title: "Zones DNS", href: "/dash/web-cloud/web-domains/zones" },
      { title: "E-mails Pro", href: "/dash/web-cloud/emails/email_pro" },
      { title: "MX Plan", href: "/dash/web-cloud/emails/mx_plans" },
      { title: "Zimbra", href: "/dash/web-cloud/emails/zimbra_mail" },
      { title: "Opérations en cours", href: "/dash/web-cloud/web-domains/ongoing-operations" },
    ],
  },
  { title: "Network", icon: Network, items: [], comingSoon: true },
  { title: "IAM & Sécurité", icon: ShieldCheck, items: [], comingSoon: true },
  { title: "Licences", icon: KeyRound, items: [], comingSoon: true },
];

function isItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

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
/* Sidebar principale                                                  */
/* ------------------------------------------------------------------ */

export function ManagerSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({});

  // Ouvre automatiquement le groupe correspondant à la route courante.
  React.useEffect(() => {
    const activeGroup = navGroups.find(
      (group) => !group.comingSoon && group.items.some((item) => isItemActive(pathname, item.href))
    );
    if (activeGroup) {
      setOpenGroups((prev) => ({ ...prev, [activeGroup.title]: true }));
    }
  }, [pathname]);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navGroups.map((group) => {
                const isGroupActive = group.items.some((item) => isItemActive(pathname, item.href));
                const isOpen = openGroups[group.title] ?? isGroupActive;

                if (group.comingSoon) {
                  return (
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
                  );
                }

                return (
                  <Collapsible
                    key={group.title}
                    open={isOpen}
                    onOpenChange={(open) =>
                      setOpenGroups((prev) => ({ ...prev, [group.title]: open }))
                    }
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={group.title} isActive={isGroupActive}>
                          <group.icon />
                          <span>{group.title}</span>
                          <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {group.items.map((item) => (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton isActive={pathname === item.href} asChild>
                                <Link href={item.href}>
                                  <span>{item.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                              {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-2 px-2 py-1 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2 rounded-md px-1 py-1">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs text-muted-foreground">Tous les services opérationnels</span>
          </div>
          <SidebarMenuButton size="sm" asChild>
            <Link href="/company/contact" target="_blank" rel="noreferrer">
              <LifeBuoy />
              <span>Support &amp; aide</span>
            </Link>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
