"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Check,
  CircleHelp,
  CreditCard,
  ExternalLink,
  Gauge,
  MoreHorizontal,
  Plus,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Données de démonstration                                            */
/* ------------------------------------------------------------------ */

const instances = [
  {
    name: "api-production-01",
    location: "Strasbourg (SBG5)",
    plan: "VPS Comfort",
    cpu: "12%",
    memory: "3,2 / 8 Go",
    disk: "42 / 160 Go",
    color: "bg-primary",
  },
  {
    name: "worker-eu-west",
    location: "Francfort (DE)",
    plan: "VPS Elite",
    cpu: "38%",
    memory: "6,8 / 16 Go",
    disk: "88 / 320 Go",
    color: "bg-accent",
  },
  {
    name: "staging-cluster",
    location: "Londres (UK)",
    plan: "VPS Comfort",
    cpu: "7%",
    memory: "2,1 / 8 Go",
    disk: "31 / 160 Go",
    color: "bg-chart-3",
  },
];

interface Stat {
  label: string;
  value: string;
  meta: string;
  icon: LucideIcon;
}

const stats: Stat[] = [
  { label: "Dépenses mensuelles", value: "184,60 €", meta: "+8,4 % vs le mois dernier", icon: CreditCard },
  { label: "Ressources actives", value: "12", meta: "3 services surveillés", icon: Zap },
  { label: "Trafic réseau", value: "1,84 To", meta: "Toutes régions confondues", icon: BarChart3 },
  { label: "Disponibilité ce mois", value: "99,98 %", meta: "Fiabilité excellente", icon: Gauge },
];

const activityEvents = [
  {
    label: "Redémarrage du serveur api-production-01",
    time: "Il y a 18 minutes",
  },
  {
    label: "Facture #F-2026-0841 payée",
    time: "Hier à 09:42",
  },
  {
    label: "Règle de pare-feu mise à jour",
    time: "16 juin, 14:08",
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function OverviewPage() {
  const [notice, setNotice] = React.useState("");

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  return (
    <main className="mx-auto px-5 py-8 md:px-8 lg:py-10">
      {/* En-tête de la page */}
      <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Votre cloud, en un coup d&apos;œil.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Surveillez votre infrastructure, gérez vos ressources et pilotez vos projets depuis un
            seul endroit.
          </p>
        </div>
        <Link
          href="/order/check-in"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
        >
          <Plus className="size-4" />
          Créer une ressource
        </Link>
      </div>

      {notice && (
        <div
          role="status"
          className="mb-5 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
        >
          <Check className="size-4" />
          {notice}
        </div>
      )}

      {/* Indicateurs clés */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Résumé du compte">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="rounded-lg border border-border bg-card p-5" key={stat.label}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.meta}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        {/* Instances cloud */}
        <section className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="font-semibold">Instances cloud</h3>
              <p className="mt-1 text-xs text-muted-foreground">3 instances actives dans 3 régions</p>
            </div>
            <Link href="/dash/public-cloud/compute" className="text-sm font-medium text-primary hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-border">
            {instances.map((instance) => (
              <div
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                key={instance.name}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 flex size-9 items-center justify-center rounded-md ${instance.color}/15 text-primary`}>
                    <Server className="size-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{instance.name}</p>
                      <span className="size-1.5 rounded-full bg-primary" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {instance.plan} · {instance.location}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-xs sm:min-w-75">
                  <div>
                    <p className="text-muted-foreground">CPU</p>
                    <p className="mt-1 font-medium">{instance.cpu}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mémoire</p>
                    <p className="mt-1 font-medium">{instance.memory}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Disque</p>
                    <p className="mt-1 font-medium">{instance.disk}</p>
                  </div>
                </div>
                <button
                  onClick={() => showNotice(`Ouverture de ${instance.name}…`)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={`Ouvrir ${instance.name}`}
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-5 py-4">
            <a
              href="https://docs.zenthcloud.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Terminal className="size-4" />
              Ouvrir le terminal cloud <ExternalLink className="size-3.5" />
            </a>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {/* Usage du mois */}
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">Usage du mois</p>
                <p className="mt-1 text-xs text-muted-foreground">184,60 € sur 250 € de budget</p>
              </div>
              <button
                className="text-muted-foreground hover:text-foreground"
                aria-label="Aide sur l'usage"
                onClick={() => showNotice("Détails de l'usage disponibles dans la facturation.")}
              >
                <CircleHelp className="size-4" />
              </button>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[74%] rounded-full bg-primary" />
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>74 % utilisé</span>
              <span>Réinitialisation dans 12 jours</span>
            </div>
            <button
              onClick={() => showNotice("Ouverture de la facturation…")}
              className="mt-5 flex w-full items-center justify-between border-t border-border pt-4 text-sm font-medium"
            >
              <span>Voir les détails de facturation</span>
              <ArrowUpRight className="size-4" />
            </button>
          </section>

          {/* Activité récente */}
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Activité récente</p>
                <p className="mt-1 text-xs text-muted-foreground">Derniers événements du workspace</p>
              </div>
              <Activity className="size-4 text-muted-foreground" />
            </div>
            <div className="mt-5 flex flex-col gap-4">
              {activityEvents.map((event, index) => (
                <div className="flex gap-3" key={event.label}>
                  <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="size-3" />
                  </div>
                  <div>
                    <p className="text-sm">{event.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => showNotice("Ouverture du journal d'activité…")}
              className="mt-5 w-full border-t border-border pt-4 text-left text-sm font-medium text-primary hover:underline"
            >
              Voir toute l&apos;activité
            </button>
          </section>
        </div>
      </div>

      {/* Recommandations + Sécurité */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-primary/25 bg-primary/5 p-5 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="font-semibold">Préparez votre prochain déploiement</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Configurez des sauvegardes automatisées et des alertes de santé pour vos serveurs de
                production. Gardez votre équipe concentrée pendant que ZenthCloud surveille
                l&apos;essentiel.
              </p>
              <button
                onClick={() => showNotice("Ouverture des recommandations…")}
                className="mt-4 text-sm font-semibold text-primary hover:underline"
              >
                Voir les recommandations <ArrowUpRight className="ml-1 inline size-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <ShieldCheck className="size-5 text-primary" />
          <p className="mt-4 font-semibold">Centre de sécurité</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Votre espace est protégé par la double authentification et le contrôle d&apos;accès par rôles.
          </p>
          <button
            onClick={() => showNotice("Ouverture des accès et identités…")}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Réviser les accès
          </button>
        </div>
      </section>
    </main>
  );
}
