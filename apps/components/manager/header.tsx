"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
/* Terminal ZenthCloud (dialog)
/* ------------------------------------------------------------------ */

interface TermLine {
  id: number;
  type: "command" | "output" | "error";
  text: string;
}

const WELCOME_LINES: TermLine[] = [
  {
    id: 1,
    type: "output",
    text: "zenthcloud CLI v1.0.0 — dialogue avec votre infrastructure ZenthCloud.",
  },
  {
    id: 2,
    type: "output",
    text: "Tapez `help` pour voir les commandes disponibles.",
  },
];

// Résolutions simulées des commandes (démo). Chaque gestionnaire reçoit
// les arguments tapés et renvoie les lignes à afficher.
const COMMANDS: Record<
  string,
  {
    usage: string;
    description: string;
    run: (args: string[]) => string[];
  }
> = {
  help: {
    usage: "help [commande]",
    description: "Affiche l'aide générale ou celle d'une commande.",
    run: (args) => {
      if (args.length === 0) {
        return [
          "Commandes disponibles :",
          "  help        Affiche cette aide",
          "  status      État du compte et des services",
          "  servers     Liste vos serveurs dédiés et VPS",
          "  cloud       Étendue des instances cloud",
          "  storage     Volumes et sauvegardes",
          "  whoami      Informations sur la session",
          "  ping        Teste la connectivité de l'API ZenthCloud",
          "  clear       Efface le terminal",
          "  exit        Ferme le terminal",
        ];
      }
      const key = args[0].toLowerCase();
      const cmd = COMMANDS[key];
      if (cmd) {
        return [`${cmd.usage} — ${cmd.description}`];
      }
      return [`Commande inconnue : ${args[0]}. Tapez \`help\` pour la liste.`];
    },
  },
  status: {
    usage: "status",
    description: "État du compte et des services.",
    run: () => [
      "Compte : actif",
      "Régions : SBG5 (France), DE (Francfort), UK (Londres)",
      "Services actifs : 12",
      "Incidents : aucun",
      "Quota mensuel : 184,60 € / 250 €",
    ],
  },
  servers: {
    usage: "servers",
    description: "Liste vos serveurs dédiés et VPS.",
    run: () => [
      "ID    TYPE        NOM                  RÉGION       ÉTAT",
      "ds-1  Département  api-production-01    SBG5         running",
      "ds-2  Département  worker-eu-west       DE           running",
      "vps-3 VPS         staging-cluster      UK           running",
    ],
  },
  cloud: {
    usage: "cloud",
    description: "Étendue des instances cloud.",
    run: () => [
      "Instance                      vCPU  RAM    DISQUE   ÉTAT",
      "api-production-01             8     16 Go  160 Go   running",
      "worker-eu-west                4     8 Go   320 Go   running",
      "staging-cluster               2     4 Go   80 Go    running",
    ],
  },
  storage: {
    usage: "storage",
    description: "Volumes et sauvegardes attachés.",
    run: () => [
      "Volume                     TYPE        TAILLE   ATTACHÉ À",
      "vol-data-01                NVMe        500 Go   api-production-01",
      "vol-backup-02              NVMe        2 To     worker-eu-west",
    ],
  },
  whoami: {
    usage: "whoami",
    description: "Informations sur la session courante.",
    run: () => ["utilisateur: client@zenthcloud.com", "projet: ZenthCloud-Main", "rôle: Propriétaire"],
  },
  ping: {
    usage: "ping",
    description: "Teste la connectivité de l'API ZenthCloud.",
    run: () => ["PING api.zenthcloud.com...", "64 bytes : temps=12.4 ms", "64 bytes : temps=9.8 ms", "réseau OK — 0% de perte"],
  },
  clear: {
    usage: "clear",
    description: "Efface le terminal.",
    run: () => [],
  },
};

function TerminalDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [lines, setLines] = React.useState<TermLine[]>(WELCOME_LINES);
  const [input, setInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const nextId = React.useRef(WELCOME_LINES.length + 1);

  // Remonte le scroll en bas à chaque nouvelle ligne.
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  // Focus l'input dès que le terminal s'ouvre.
  React.useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  const runCommand = React.useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const [name, ...args] = trimmed.split(/\s+/);
      const key = name.toLowerCase();
      const line: TermLine = { id: nextId.current++, type: "command", text: `$ ${trimmed}` };

      if (!trimmed) {
        setLines((prev) => [...prev, line]);
        return;
      }

      if (key === "exit") {
        setLines((prev) => [...prev, line]);
        onOpenChange(false);
        return;
      }

      const command = COMMANDS[key];
      const outputs =
        command?.run(args) ?? [`Commande introuvable : ${name}. Tapez \`help\` pour l'aide.`];

      setLines((prev) => [
        ...prev,
        line,
        ...outputs.map<TermLine>((text) => ({ id: nextId.current++, type: "output", text })),
      ]);

      if (key === "clear") {
        setLines([]);
      }
    },
    [onOpenChange],
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    runCommand(input);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="border-border/60 h-svh w-full max-w-5xl gap-0 overflow-hidden bg-zinc-950 p-0 text-zinc-100 shadow-2xl sm:max-w-5xl sm:h-auto"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Terminal ZenthCloud</DialogTitle>
          <DialogDescription>Dialoguez avec l'interface en ligne de commande.</DialogDescription>
        </DialogHeader>

        {/* Barre de titre du terminal */}
        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/80 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/90" />
            <span className="size-2.5 rounded-full bg-amber-500/90" />
            <span className="size-2.5 rounded-full bg-emerald-500/90" />
          </span>
          <span className="ml-1 font-mono text-xs text-zinc-400">zenthcloud — zsh</span>
          <span className="ml-auto hidden font-mono text-[11px] text-zinc-500 sm:block">
            client@zenthcloud: ~
          </span>
        </div>

        {/* Zone de sortie */}
        <div ref={scrollRef} className="h-[calc(100vh-9rem)] flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-6 sm:h-[70vh] sm:max-h-[70vh]">
          {lines.map((line) => (
            <p
              key={line.id}
              className={cn(
                "whitespace-pre-wrap wrap-break-words",
                line.type === "command" && "text-emerald-300",
                line.type === "error" && "text-red-400",
                line.type === "output" && "text-zinc-200",
              )}
            >
              {line.text}
            </p>
          ))}
        </div>

        {/* Ligne de saisie */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-900/60 px-4 py-3">
          <span className="font-mono text-sm font-semibold text-emerald-400">
            client@zenthcloud:~${" "}
          </span>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez une commande (help)"
            className="h-auto flex-1 border-0 bg-transparent p-0 font-mono text-sm text-zinc-100 shadow-none placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export function ManagerHeader() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [terminalOpen, setTerminalOpen] = React.useState(false);

  const unreadCount = NOTIFICATIONS.filter((notification) => notification.unread).length;
  const displayName = user?.displayName || user?.name || "";
  const firstName = displayName.split(/\s+/)[0] || "client";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:gap-3 sm:px-6">
      {/* Basculer la sidebar (réduire / agrandir) */}
      <SidebarTrigger className="shrink-0" />

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
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

        {/* Terminal */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTerminalOpen(true)}
          aria-label="Terminal — API et CLI"
          title="Terminal — API et CLI"
        >
          <Terminal className="h-4.5 w-4.5" />
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

      <TerminalDialog open={terminalOpen} onOpenChange={setTerminalOpen} />
    </header>
  );
}
