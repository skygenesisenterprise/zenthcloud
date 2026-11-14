import {
	CaretUpDownIcon,
	CloudIcon,
	InfoIcon,
	PlusIcon,
} from "@phosphor-icons/react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useState } from "react";
import { organizationPath } from "@/components/panel/navigation";
import { OrganizationProvider } from "@/components/panel/organization-context";
import { PanelShell } from "@/components/panel/panel-shell";
import {
	getOrganizationPageProps,
	type OrganizationPageProps,
} from "@/lib/organization-page";

type DomainOverviewPageProps = OrganizationPageProps & {
	domainName: string;
};

/** Time ranges of the traffic controls, matching the reference dashboard. */
const TIME_RANGES = ["24 heures", "7 jours", "30 jours"] as const;

const TIME_LABELS = ["8 PM", "12 AM", "4 AM", "8 AM", "12 PM", "4 PM"] as const;

const RATE_LABELS = ["1", "0,8", "0,6", "0,4", "0,2", "0"] as const;
const PERCENT_LABELS = ["100%", "80%", "60%", "40%", "20%", "0%"] as const;

/**
 * Flat traffic curve over the selected window. The metrics have no data yet,
 * so the line sits on the zero axis instead of inventing a shape.
 */
function TrafficChart({ yLabels }: { yLabels: readonly string[] }) {
	const width = 720;
	const height = 140;
	const baseline = height - 2;

	return (
		<div className="flex min-w-0 flex-1 flex-col">
			<div className="flex min-w-0 items-stretch gap-2">
				<div className="flex flex-col justify-between py-0.5 text-right text-[10px] text-muted-foreground tabular-nums">
					{yLabels.map((label) => (
						<span key={label}>{label}</span>
					))}
				</div>
				<svg
					aria-hidden
					viewBox={`0 0 ${width} ${height}`}
					preserveAspectRatio="none"
					className="h-36 min-w-0 flex-1"
				>
					{yLabels.map((label, index) => {
						const y = (index / (yLabels.length - 1)) * baseline;
						return (
							<line
								key={label}
								x1="0"
								x2={width}
								y1={y}
								y2={y}
								stroke="currentColor"
								strokeWidth="1"
								strokeDasharray="3 4"
								className="text-border"
							/>
						);
					})}
					<line
						x1="0"
						x2={width}
						y1={baseline}
						y2={baseline}
						stroke="currentColor"
						strokeWidth="1.5"
						className="text-blue-500"
					/>
				</svg>
			</div>
			<div className="mt-1 flex justify-between pl-8 text-[10px] text-muted-foreground">
				{TIME_LABELS.map((label, index) => (
					<span key={`${label}-${index}`}>{label}</span>
				))}
			</div>
		</div>
	);
}

function MetricPanel({
	label,
	value,
	yLabels,
}: {
	label: string;
	value: string;
	yLabels: readonly string[];
}) {
	return (
		<article className="rounded-xl border bg-card p-5">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
				<div className="sm:w-44">
					<p className="text-sm text-muted-foreground">{label}</p>
					<p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
				</div>
				<TrafficChart yLabels={yLabels} />
			</div>
		</article>
	);
}

/** Read-only switch, styled like the reference toggles. */
function Toggle({ checked, label }: { checked: boolean; label: string }) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={label}
			disabled
			title="Bientôt disponible"
			className={`relative inline-flex h-5 w-9 shrink-0 cursor-default items-center rounded-full transition-colors ${
				checked ? "bg-blue-600" : "bg-muted"
			}`}
		>
			<span
				aria-hidden
				className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
					checked ? "translate-x-[18px]" : "translate-x-0.5"
				}`}
			/>
		</button>
	);
}

/** Small diamond node of the "worker network" illustration. */
function WorkerNode({ center = false }: { center?: boolean }) {
	if (center) {
		return (
			<svg aria-hidden viewBox="0 0 56 56" className="size-14 text-orange-500">
				<rect x="12" y="12" width="32" height="32" rx="4" fill="currentColor" />
				<circle
					cx="28"
					cy="28"
					r="11"
					fill="none"
					stroke="#fff"
					strokeWidth="2"
				/>
				<path d="M17 28h22M28 17v22" stroke="#fff" strokeWidth="1.5" />
			</svg>
		);
	}

	return (
		<span className="flex size-9 rotate-45 items-center justify-center rounded-md border bg-background">
			<span className="-rotate-45 text-[10px] text-muted-foreground">◇</span>
		</span>
	);
}

export default function DomainOverviewPage({
	organization,
	user,
	domainName,
}: DomainOverviewPageProps) {
	const [range, setRange] = useState<(typeof TIME_RANGES)[number]>("24 heures");
	const domainHref = organizationPath(organization.id, `domains/${domainName}`);

	return (
		<>
			<Head>
				<title>{`${domainName} | ${organization.name} | ZenthCloud`}</title>
			</Head>
			<OrganizationProvider organization={organization}>
				<PanelShell title={domainName} user={user}>
					<header className="-mx-4 -mt-8 border-b px-4 py-5 sm:-mx-8 sm:px-8">
						<p className="text-xs text-muted-foreground">Vue d’ensemble</p>
						<div className="mt-1 flex flex-wrap items-start justify-between gap-4">
							<div className="min-w-0">
								<div className="flex flex-wrap items-center gap-2">
									<h1 className="text-xl font-semibold tracking-tight">
										{domainName}
									</h1>
									<button
										type="button"
										disabled
										className="cursor-default rounded-md border px-1.5 py-0.5 text-[11px] text-muted-foreground"
									>
										Free
									</button>
									<CaretUpDownIcon
										aria-hidden
										className="size-3.5 text-muted-foreground"
									/>
									<button
										type="button"
										disabled
										title="Bientôt disponible"
										className="ml-1 cursor-default text-xs text-muted-foreground underline underline-offset-2"
									>
										Afficher la documentation
									</button>
								</div>
								<p className="mt-2 text-sm text-muted-foreground">
									Surveillez et configurez la façon dont ZenthCloud traite votre
									trafic Web avec les services du menu.
								</p>
							</div>
							<button
								type="button"
								disabled
								title="Bientôt disponible"
								className="flex h-8 cursor-default items-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium"
							>
								<PlusIcon aria-hidden className="size-3.5" />
								Ajouter un tag
							</button>
						</div>
					</header>

					<div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
						<div className="min-w-0 space-y-4">
							<div className="flex flex-wrap items-center justify-between gap-3">
								<div className="flex items-center gap-1">
									{TIME_RANGES.map((option) => (
										<button
											key={option}
											type="button"
											onClick={() => setRange(option)}
											aria-pressed={range === option}
											className={`h-8 rounded-md px-3 text-xs font-medium transition-colors ${
												range === option
													? "border bg-background shadow-xs"
													: "text-muted-foreground hover:text-foreground"
											}`}
										>
											{option}
										</button>
									))}
								</div>
								<p className="text-[11px] tracking-wide text-muted-foreground uppercase">
									13 novembre — 14 novembre
								</p>
							</div>

							<MetricPanel
								label="Visiteurs uniques"
								value="0"
								yLabels={RATE_LABELS}
							/>
							<MetricPanel
								label="Nombre total de requêtes"
								value="0"
								yLabels={RATE_LABELS}
							/>
							<MetricPanel
								label="Pourcentage mis en cache"
								value="N/A"
								yLabels={PERCENT_LABELS}
							/>
							<MetricPanel
								label="Total des données traitées"
								value="0 B"
								yLabels={RATE_LABELS}
							/>
						</div>

						<aside className="min-w-0 space-y-6 lg:border-l lg:pl-6">
							<section className="space-y-2">
								<h2 className="text-sm font-semibold">DNS</h2>
								<p className="flex items-center gap-1.5 text-sm">
									Configuration DNS : Complète
									<InfoIcon
										aria-hidden
										className="size-3.5 text-muted-foreground"
									/>
								</p>
								<button
									type="button"
									disabled
									title="Bientôt disponible"
									className="cursor-default text-sm text-blue-600 underline underline-offset-2"
								>
									Enregistrements DNS
								</button>
							</section>

							<section className="rounded-xl border bg-card">
								<h2 className="border-b px-4 py-2.5 text-xs text-muted-foreground">
									Gestion de nom de domaine
								</h2>
								<dl className="divide-y text-sm">
									<div className="flex items-center justify-between gap-3 px-4 py-2.5">
										<dt className="text-muted-foreground">Registrar</dt>
										<dd className="text-right text-xs">
											HOSTINGER operations, UAB
										</dd>
									</div>
									<div className="flex items-center justify-between gap-3 px-4 py-2.5">
										<dt className="text-muted-foreground">Transfert</dt>
										<dd className="flex items-center gap-1 text-xs text-muted-foreground">
											<CloudIcon aria-hidden className="size-3.5" />
											Pas prêt
										</dd>
									</div>
								</dl>
							</section>

							<section className="rounded-xl border bg-card p-4">
								<div className="flex items-center justify-center gap-6 rounded-lg border bg-muted/40 py-6">
									<WorkerNode />
									<WorkerNode center />
									<WorkerNode />
								</div>
								<h2 className="mt-4 text-sm font-semibold">
									Aucun Worker connecté
								</h2>
								<p className="mt-1 text-sm text-muted-foreground">
									Créez et déployez une application sur le réseau de ZenthCloud,
									ou connectez un Worker existant à ce domaine.
								</p>
								<button
									type="button"
									disabled
									title="Bientôt disponible"
									className="mt-3 h-8 cursor-default rounded-lg bg-blue-600 px-3 text-xs font-medium text-white"
								>
									Créer un Worker
								</button>
							</section>

							<section className="space-y-2 border-t pt-4">
								<div className="flex items-start justify-between gap-4">
									<h2 className="text-sm font-semibold">
										Gérer l’accès des bots IA
									</h2>
									<Toggle checked label="Synchronisation des préférences Bot" />
								</div>
								<p className="text-sm text-muted-foreground">
									La synchronisation des préférences Bot préfixe votre
									<code className="mx-1 text-xs">robots.txt</code> avec les
									paramètres ZenthCloud configurés.
								</p>
								<button
									type="button"
									disabled
									title="Bientôt disponible"
									className="cursor-default text-sm text-blue-600 underline underline-offset-2"
								>
									En savoir plus
								</button>
							</section>

							<section className="space-y-3 border-t pt-4">
								<h2 className="text-sm font-semibold">Actions rapides</h2>
								<div className="flex items-start justify-between gap-4">
									<div className="min-w-0">
										<p className="text-sm">Precursor</p>
										<p className="text-xs text-muted-foreground">
											Precursor détecte l’automatisation en analysant le
											comportement des visiteurs.
										</p>
									</div>
									<Toggle checked={false} label="Precursor" />
								</div>
							</section>
						</aside>
					</div>

					<p className="mt-8 text-xs text-muted-foreground">
						<NextLink href={domainHref} className="hover:underline">
							Revenir à la vue d’ensemble des domaines
						</NextLink>
					</p>
				</PanelShell>
			</OrganizationProvider>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DomainOverviewPageProps
> = async (context) => {
	const result = await getOrganizationPageProps(context);
	if (!("props" in result)) return result;

	const rawDomain = context.params?.domainName;
	const domainName = Array.isArray(rawDomain) ? rawDomain[0] : rawDomain;
	if (!domainName) return { notFound: true };

	// `props` may be a promise in the Next.js signature; await it so the domain
	// name is merged into the resolved organization payload.
	const props = await result.props;
	return { props: { ...props, domainName } };
};
