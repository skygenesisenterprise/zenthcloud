"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Cloud,
  CreditCard,
  FileText,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Terminal,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ------------------------------------------------------------------ */
/* Notifications (données de démonstration)                            */
/* ------------------------------------------------------------------ */

interface Notification {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    icon: CreditCard,
    title: "Facture d'août disponible",
    description: "Votre facture n°F-2026-0841 de 24,50 € est disponible au téléchargement.",
    time: "Il y a 3 h",
    unread: true,
  },
  {
    id: "n2",
    icon: ShieldCheck,
    title: "Incident résolu — région SBG5",
    description: "Le service Compute est de nouveau opérationnel depuis 08:42.",
    time: "Il y a 1 j",
    unread: true,
  },
  {
    id: "n3",
    icon: Bell,
    title: "Renouvellement du domaine exemple.fr",
    description: "Votre domaine arrive à expiration dans 12 jours.",
    time: "Il y a 2 j",
  },
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export function ManagerHeader() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const unreadCount = NOTIFICATIONS.filter((notification) => notification.unread).length;
  const displayName = user?.displayName || user?.name || "";
  const firstName = displayName.split(/\s+/)[0] || "client";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:gap-3 sm:px-6">
      {/* Logo ZenthCloud (tout à gauche) */}
      <Link href="/dash" className="mr-auto flex shrink-0 items-center gap-2.5" aria-label="ZenthCloud — Espace client">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Cloud className="h-4.5 w-4.5" />
        </span>
        <span className="hidden text-sm font-bold tracking-tight text-foreground md:block">
          ZenthCloud
        </span>
      </Link>

      {/* Recherche */}
      <div className="relative hidden w-56 sm:block lg:w-72">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          readOnly
          placeholder="Rechercher un service, un domaine…"
          aria-label="Rechercher un service"
          className="h-9 w-full rounded-md border border-input bg-muted/50 pl-8 pr-12 text-sm text-foreground shadow-xs outline-none transition-[box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:bg-background focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        />
        <Kbd className="absolute right-2 top-1/2 -translate-y-1/2">⌘K</Kbd>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {/* Terminal */}
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label="Terminal — API et CLI"
          title="Terminal — API et CLI"
        >
          <a href="https://docs.zenthcloud.com" target="_blank" rel="noreferrer">
            <Terminal className="h-4.5 w-4.5" />
          </a>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <span className="text-xs font-normal text-muted-foreground">
                {unreadCount} non lues
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {NOTIFICATIONS.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 px-3 py-2.5"
                  onSelect={(event) => event.preventDefault()}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                      notification.unread
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <notification.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {notification.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {notification.description}
                    </span>
                    <span className="mt-1 block text-[11px] text-muted-foreground/70">
                      {notification.time}
                    </span>
                  </span>
                  {notification.unread && (
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                      aria-label="Non lue"
                    />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm font-medium text-primary">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Espace compte */}
        {isLoading ? null : isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md p-1 pr-1.5 transition-colors hover:bg-accent sm:pr-2"
                aria-label="Menu du compte"
              >
                <Avatar className="h-7 w-7">
                  {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={displayName} /> : null}
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {getInitials(displayName) || "ZC"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-24 truncate text-sm font-medium text-foreground md:block">
                  {firstName}
                </span>
                <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">{displayName}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dash" className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Vue d&apos;ensemble
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dash/web-cloud/web-domains/domain" className="flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                  Mes services
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dash/iam/identities" className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Paramètres du compte
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 text-destructive focus:text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  void logout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Se connecter</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
