import {
	CalendarDays,
	ChevronRight,
	Clock,
	Globe,
	MoreHorizontal,
	Plus,
	RefreshCw,
	Search,
	Wrench,
} from "lucide-react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { OrganizationProvider } from "@/components/panel/organization-context";
import { PanelShell } from "@/components/panel/panel-shell";
import {
	getOrganizationPageProps,
	type OrganizationPageProps,
} from "@/lib/organization-page";
import { cn } from "@/lib/utils";

/** Domains shown in the workspace shortcut list. */
const DOMAINS = [
	"aethermail.me",
	"giteria.com",
	"guilderia.com",
	"liamvonastoria.eu",
	"notploy.app",
] as const;

/** Last visited destinations, newest first. */
const RECENTS = [
	{ section: "DNS", item: "Paramètres" },
	{ section: "E-mail", item: "Gestion DMARC" },
	{ section: "DNS", item: "Enregistrements" },
	{ section: "Domaines", item: "skygenesisenterprise.com" },
	{ section: "Domaines", item: "Vue d'ensemble" },
] as const;

type Metric = {
	label: string;
	value: string;
	change?: string;
	trend?: "up" | "down";
};

const METRICS: readonly Metric[] = [
	{
		label: "Total des requêtes",
		value: "23,55k",
		change: "3,4 %",
		trend: "down",
	},
	{ label: "Invocations de Worker", value: "0" },
	{ label: "Erreurs Workers", value: "0" },
	{
		label: "Taux de succès du cache",
		value: "5,38 %",
		change: "124,8 %",
		trend: "up",
	},
	{ label: "Temps CPU P90", value: "0 ms" },
	{ label: "Minutes de construction", value: "0" },
];

/** Quiet icon button used by the card headers and the analytics toolbar. */
const ICON_BUTTON_CLASSES =
	"flex size-7 items-center justify-center rounded-md text-muted-foreground";

/**
 * Decorative series behind the analytics sparklines. They only shape the
 * curve: every number the user reads comes from `METRICS`.
 */
const REQUEST_SERIES = [
	8, 14, 9, 22, 12, 58, 10, 16, 9, 13, 11, 24, 8, 12, 10, 48, 9, 14, 11, 9, 10,
] as const;
const CACHE_SERIES = [
	4, 6, 5, 8, 6, 7, 5, 9, 6, 5, 7, 6, 8, 5, 9, 7, 6, 44, 70, 92, 61,
] as const;
const FLAT_SERIES = [
	12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12,
	12, 12,
] as const;

/** Builds the line and its filled area for one series. */
function chartPaths(series: readonly number[]): { line: string; area: string } {
	const width = 420;
	const height = 120;
	const max = Math.max(...series, 1);
	const step = series.length > 1 ? width / (series.length - 1) : width;
	const points = series.map((value, index) => {
		const x = index * step;
		const y = height - (value / max) * height;
		return `${x.toFixed(1)},${y.toFixed(1)}`;
	});
	const line = `M${points.join(" L")}`;
	return { line, area: `${line} L${width},${height} L0,${height} Z` };
}

/**
 * One analytics card: value, variation and sparkline. Cards without a
 * variation have no data and say so, on top of a flat line.
 */
function MetricCard({
	metric,
	series,
	large = false,
	showAxis = false,
}: {
	metric: Metric;
	series: readonly number[];
	large?: boolean;
	showAxis?: boolean;
}) {
	const { line, area } = chartPaths(series);
	const empty = !metric.change;

	return (
		<article className="flex flex-col rounded-xl border bg-card p-5">
			<div className="flex items-start justify-between gap-4">
				<h3 className="text-sm font-medium">{metric.label}</h3>
				<button
					type="button"
					disabled
					aria-label={`Options de ${metric.label}`}
					className={`${ICON_BUTTON_CLASSES} cursor-default`}
				>
					<MoreHorizontal aria-hidden className="size-4" />
				</button>
			</div>
			<div className="mt-2 flex flex-wrap items-baseline gap-2">
				<p className="text-2xl font-semibold tracking-tight">{metric.value}</p>
				{metric.change && (
					<span
						className={cn(
							"text-xs",
							metric.trend === "up" ? "text-emerald-600" : "text-red-600",
						)}
					>
						{metric.trend === "up" ? "↗" : "↘"} {metric.change}
					</span>
				)}
			</div>
			<div className={cn("relative mt-4", large ? "h-40" : "h-24")}>
				<svg
					aria-hidden
					viewBox="0 0 420 120"
					preserveAspectRatio="none"
					className="h-full w-full"
				>
					<path
						d={area}
						className={empty ? "fill-muted-foreground/5" : "fill-blue-500/10"}
					/>
					<path
						d={line}
						fill="none"
						strokeWidth="1.5"
						vectorEffect="non-scaling-stroke"
						className={empty ? "stroke-border" : "stroke-blue-500"}
					/>
				</svg>
				{showAxis && (
					<div
						aria-hidden
						className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-between py-0.5 text-[10px] text-muted-foreground"
					>
						<span>3k</span>
						<span>2k</span>
						<span>1k</span>
						<span>0</span>
					</div>
				)}
				{empty && (
					<span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background px-3 py-1 text-[11px] text-muted-foreground">
						Aucune donnée
					</span>
				)}
			</div>
		</article>
	);
}

export default function OrganizationHomePage({
	organization,
	user,
}: OrganizationPageProps) {
	const [query, setQuery] = useState("");
	const needle = query.trim().toLowerCase();

	const domains = needle
		? DOMAINS.filter((domain) => domain.toLowerCase().includes(needle))
		: DOMAINS;
	const recents = needle
		? RECENTS.filter((entry) =>
				`${entry.section} ${entry.item}`.toLowerCase().includes(needle),
			)
		: RECENTS;

	return (
		<>
			<Head>
				<title>{`${organization.name} | ZenthCloud`}</title>
			</Head>
			<OrganizationProvider organization={organization}>
				<PanelShell title="Accueil" user={user}>
					<div className="mx-auto max-w-5xl space-y-10 pb-6">
						<section className="space-y-8 pt-2">
							<h1 className="text-center text-[26px] font-semibold tracking-tight text-foreground sm:text-3xl">
								What are we building today?
							</h1>

							<div className="relative mx-auto max-w-3xl">
								<label htmlFor="workspace-search" className="sr-only">
									Rechercher dans l’espace de travail
								</label>
								<Search
									aria-hidden
									className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
								/>
								<input
									id="workspace-search"
									type="search"
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder="Rechercher"
									className="h-12 w-full rounded-lg border bg-background pr-24 pl-11 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
								/>
								<div className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
									<kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
										Ctrl
									</kbd>
									<kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
										K
									</kbd>
								</div>
							</div>
						</section>

						<div className="grid gap-x-10 gap-y-8 lg:grid-cols-3">
							<section aria-labelledby="domains-heading">
								<div className="flex items-center gap-2 pb-1">
									<Globe aria-hidden className="size-4 text-muted-foreground" />
									<h2 id="domains-heading" className="text-sm font-medium">
										Domaines
									</h2>
									<span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
										8
									</span>
									<ChevronRight
										aria-hidden
										className="size-3.5 text-muted-foreground"
									/>
									<button
										type="button"
										disabled
										aria-label="Options des domaines"
										className={`${ICON_BUTTON_CLASSES} ml-auto cursor-default`}
									>
										<MoreHorizontal aria-hidden className="size-4" />
									</button>
								</div>

								<ul>
									{domains.map((domain) => (
										<li
											key={domain}
											className="flex items-center gap-3 border-b py-3.5 text-sm"
										>
											<Globe
												aria-hidden
												className="size-4 shrink-0 text-muted-foreground"
											/>
											<span className="min-w-0 flex-1 truncate">{domain}</span>
											<ChevronRight
												aria-hidden
												className="size-3.5 shrink-0 text-muted-foreground"
											/>
										</li>
									))}
									{domains.length === 0 && (
										<li className="border-b py-3.5 text-xs text-muted-foreground">
											Aucun domaine ne correspond à « {query.trim()} ».
										</li>
									)}
								</ul>
							</section>

							<section aria-labelledby="workers-heading">
								<div className="flex items-center gap-2 pb-1">
									<h2 id="workers-heading" className="text-sm font-medium">
										Workers
									</h2>
									<ChevronRight
										aria-hidden
										className="size-3.5 text-muted-foreground"
									/>
									<button
										type="button"
										disabled
										aria-label="Options des Workers"
										className={`${ICON_BUTTON_CLASSES} ml-auto cursor-default`}
									>
										<MoreHorizontal aria-hidden className="size-4" />
									</button>
								</div>

								<button
									type="button"
									disabled
									title="Bientôt disponible"
									className="mt-4 flex w-full cursor-default items-center justify-center gap-2 rounded-lg bg-muted py-4 text-sm font-medium text-muted-foreground"
								>
									<Wrench aria-hidden className="size-4" />
									Ship something new
								</button>
							</section>

							<section aria-labelledby="recents-heading">
								<div className="flex items-center gap-2 pb-1">
									<h2 id="recents-heading" className="text-sm font-medium">
										Recents
									</h2>
									<button
										type="button"
										disabled
										aria-label="Options des récents"
										className={`${ICON_BUTTON_CLASSES} ml-auto cursor-default`}
									>
										<MoreHorizontal aria-hidden className="size-4" />
									</button>
								</div>

								<ul>
									{recents.map((entry) => (
										<li
											key={`${entry.section}-${entry.item}`}
											className="flex items-center gap-3 border-b py-3.5 text-sm"
										>
											<Clock
												aria-hidden
												className="size-4 shrink-0 text-muted-foreground"
											/>
											<span className="min-w-0 flex-1 truncate">
												<span className="text-muted-foreground">
													{entry.section}
												</span>{" "}
												/ {entry.item}
											</span>
											<ChevronRight
												aria-hidden
												className="size-3.5 shrink-0 text-muted-foreground"
											/>
										</li>
									))}
									{recents.length === 0 && (
										<li className="border-b py-3.5 text-xs text-muted-foreground">
											Aucun résultat récent pour « {query.trim()} ».
										</li>
									)}
								</ul>
							</section>
						</div>

						<section aria-labelledby="analytics-heading" className="space-y-4">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<h2
									id="analytics-heading"
									className="text-lg font-semibold tracking-tight"
								>
									Analytics
								</h2>
								<div className="flex items-center gap-1">
									<button
										type="button"
										disabled
										className="flex h-8 cursor-default items-center gap-2 rounded-lg border bg-background px-3 text-xs font-medium text-muted-foreground"
									>
										<CalendarDays aria-hidden className="size-4" />
										24 dernières heures
									</button>
									<button
										type="button"
										disabled
										aria-label="Ajouter une métrique"
										className={`${ICON_BUTTON_CLASSES} cursor-default`}
									>
										<Plus aria-hidden className="size-4" />
									</button>
									<button
										type="button"
										disabled
										aria-label="Actualiser les métriques"
										className={`${ICON_BUTTON_CLASSES} cursor-default`}
									>
										<RefreshCw aria-hidden className="size-4" />
									</button>
								</div>
							</div>

							<div className="grid gap-4 lg:grid-cols-2">
								<MetricCard
									metric={METRICS[0]!}
									series={REQUEST_SERIES}
									large
									showAxis
								/>
								<MetricCard metric={METRICS[1]!} series={FLAT_SERIES} large />
							</div>
							<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{METRICS.slice(2).map((metric, index) => (
									<MetricCard
										key={metric.label}
										metric={metric}
										series={index === 1 ? CACHE_SERIES : FLAT_SERIES}
									/>
								))}
							</div>
						</section>
					</div>
				</PanelShell>
			</OrganizationProvider>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<OrganizationPageProps> =
	getOrganizationPageProps;
