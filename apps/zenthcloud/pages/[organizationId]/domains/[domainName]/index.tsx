import {
	CaretUpDownIcon,
	CloudIcon,
	DownloadSimpleIcon,
	InfoIcon,
	PlusIcon,
} from "@phosphor-icons/react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { organizationPath } from "@/components/panel/navigation";
import { OrganizationProvider } from "@/components/panel/organization-context";
import { PanelShell } from "@/components/panel/panel-shell";
import {
	getOrganizationPageProps,
	type OrganizationPageProps,
} from "@/lib/organization-page";
import { api } from "@/utils/api";

type DomainOverviewPageProps = OrganizationPageProps & {
	domainName: string;
};

/** Time ranges of the traffic controls, matching the reference dashboard. */
const TIME_RANGES = ["24 heures", "7 jours", "30 jours"] as const;

const TIME_LABELS = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM"] as const;
const HOURLY_LABELS = Array.from(
	{ length: 24 },
	(_, hour) => `${String(hour).padStart(2, "0")}:00`,
);

const VISITOR_LABELS = ["120", "100", "80", "60", "40", "20", "0"] as const;
const REQUEST_LABELS = ["250", "200", "150", "100", "50", "0"] as const;
const PERCENT_LABELS = ["100%", "80%", "60%", "40%", "20%", "0%"] as const;
const DATA_LABELS = [
	"300 kB",
	"250 kB",
	"200 kB",
	"150 kB",
	"100 kB",
	"50 kB",
	"0 B",
] as const;

// These values and hourly curves mirror the reference snapshot supplied for
// this screen; they are not yet backed by a live analytics query.
const VISITOR_DATA = [
	112, 8, 12, 6, 9, 8, 7, 7, 5, 12, 4, 8, 9, 7, 10, 8, 7, 9, 23, 17, 14, 9, 11,
	14,
];
const REQUEST_DATA = [
	210, 10, 22, 6, 58, 9, 2, 12, 4, 16, 5, 11, 9, 6, 15, 6, 4, 11, 8, 36, 9, 18,
	29, 71,
];
const CACHE_DATA = Array.from({ length: 24 }, () => 0);
const PROCESSED_DATA = [
	100, 50, 70, 10, 250, 40, 15, 30, 0, 60, 15, 20, 12, 25, 10, 20, 10, 80, 45,
	20, 55, 15, 50, 22,
];
const CACHED_DATA = Array.from({ length: 24 }, () => 0);

const CHART_DATA = [
	{ label: "Visiteurs uniques", values: VISITOR_DATA },
	{ label: "Nombre total de requêtes", values: REQUEST_DATA },
	{ label: "Pourcentage mis en cache", values: CACHE_DATA },
	{ label: "Total des données traitées", values: PROCESSED_DATA },
	{ label: "Données mises en cache", values: CACHED_DATA },
] as const;

function downloadChartData(label: string, values: readonly number[]) {
	const csv = [
		["Heure", label].join(";"),
		...values.map((value, index) => [HOURLY_LABELS[index], value].join(";")),
	].join("\r\n");
	const blob = new Blob([`\uFEFF${csv}`], {
		type: "text/csv;charset=utf-8",
	});
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = `${label.toLocaleLowerCase("fr").replaceAll(" ", "-")}.csv`;
	anchor.click();
	window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function TrafficChart({
	yLabels,
	values,
	label,
}: {
	yLabels: readonly string[];
	values: readonly number[];
	label: string;
}) {
	const width = 720;
	const height = 140;
	const baseline = height - 2;
	const maximum = Number.parseFloat(yLabels[0] ?? "0") || 1;
	const points = values
		.map((value, index) => {
			const x = (index / Math.max(values.length - 1, 1)) * width;
			const y = baseline - (value / maximum) * baseline;
			return `${x},${y}`;
		})
		.join(" ");

	return (
		<div className="relative min-w-0 flex-1 pr-8">
			<button
				type="button"
				onClick={() => downloadChartData(label, values)}
				aria-label={`Télécharger les données de ${label}`}
				title="Télécharger les données du graphique"
				className="absolute top-0 right-0 z-10 inline-flex size-7 items-center justify-center rounded-md text-[#71717A] transition-colors hover:bg-[#F3F4F6] hover:text-[#18181B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
			>
				<DownloadSimpleIcon aria-hidden className="size-4" />
			</button>
			<div className="flex min-w-0 flex-col">
				<div className="flex min-w-0 items-stretch gap-2">
					<div className="flex w-10 shrink-0 flex-col justify-between py-0.5 text-right text-[10px] leading-none text-[#71717A] tabular-nums">
						{yLabels.map((label) => (
							<span key={label}>{label}</span>
						))}
					</div>
					<svg
						aria-hidden
						viewBox={`0 0 ${width} ${height}`}
						preserveAspectRatio="none"
						className="h-[88px] min-w-0 flex-1"
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
									strokeDasharray="2 3"
									className="text-[#E5E7EB]"
								/>
							);
						})}
						<polyline
							points={points}
							fill="none"
							stroke="#78AFFF"
							strokeWidth="2"
							strokeLinejoin="round"
							strokeLinecap="round"
						/>
					</svg>
				</div>
				<div className="mt-1 flex justify-between pl-12 text-[10px] leading-none text-[#71717A]">
					{TIME_LABELS.map((label, index) => (
						<span key={`${label}-${index}`}>{label}</span>
					))}
				</div>
			</div>
		</div>
	);
}

function MetricPanel({
	label,
	value,
	yLabels,
	values,
}: {
	label: string;
	value: string;
	yLabels: readonly string[];
	values: readonly number[];
}) {
	return (
		<article className="min-h-[132px] rounded-lg border border-[#E5E7EB] bg-white px-4 py-4 sm:px-5">
			<div className="flex min-h-[100px] flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
				<div className="shrink-0 sm:w-[150px]">
					<p className="text-xs leading-4 text-[#71717A]">{label}</p>
					<p className="mt-1 text-base font-semibold leading-5 tabular-nums text-[#18181B]">
						{value}
					</p>
					<p className="sr-only">
						{label}, {value}. Utiliser le bouton de téléchargement des données
						pour accéder aux données du graphique.
					</p>
				</div>
				<TrafficChart yLabels={yLabels} values={values} label={label} />
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
			<svg aria-hidden viewBox="0 0 56 56" className="size-14">
				<rect
					x="7"
					y="7"
					width="42"
					height="42"
					rx="8"
					fill="#FFFFFF"
					stroke="#E5E7EB"
					strokeWidth="1.5"
				/>
				<circle
					cx="28"
					cy="28"
					r="11"
					fill="none"
					stroke="#F97316"
					strokeWidth="2"
				/>
				<path d="M17 28h22M28 17v22" stroke="#F97316" strokeWidth="1.5" />
			</svg>
		);
	}

	return (
		<span className="flex size-9 items-center justify-center rounded-md border border-dashed border-[#D1D5DB] bg-white">
			<span className="text-[10px] text-[#9CA3AF]">◇</span>
		</span>
	);
}

export default function DomainOverviewPage({
	organization,
	user,
	domainName,
}: DomainOverviewPageProps) {
	const [range, setRange] = useState<(typeof TIME_RANGES)[number]>("24 heures");
	const { data: domains } = api.overview.domains.useQuery();
	const domainId =
		domains?.find((domain) => domain.host === domainName)?.domainId ?? "—";
	const documentationUrl = "https://docs.zenthcloud.com/docs/core";

	return (
		<>
			<Head>
				<title>{`${domainName} | ${organization.name} | ZenthCloud`}</title>
			</Head>
			<OrganizationProvider organization={organization}>
				<PanelShell
					title={domainName}
					domainName={domainName}
					fullWidthContent
					user={user}
				>
					<div className="grid min-h-full grid-cols-1 bg-[#FAFAFA] lg:grid-cols-[minmax(0,1fr)_320px]">
						<main className="min-w-0">
							<header className="border-b border-[#E5E7EB] bg-white px-6 py-5 sm:px-10 xl:px-[60px]">
								<p className="text-xs leading-4 text-[#71717A]">
									Vue d’ensemble
								</p>
								<div className="mt-1 flex flex-wrap items-center justify-between gap-4">
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2">
											<h1 className="text-base font-semibold leading-5 text-[#18181B]">
												{domainName}
											</h1>
											<span className="rounded-md border border-[#E5E7EB] px-1.5 py-0.5 text-[11px] leading-4 text-[#52525B]">
												Free
											</span>
											<CaretUpDownIcon
												aria-hidden
												className="size-3.5 text-[#9CA3AF]"
											/>
											<a
												href={documentationUrl}
												target="_blank"
												rel="noreferrer"
												className="ml-1 text-xs text-[#3B82F6] underline underline-offset-2"
											>
												Afficher la documentation
												<span className="sr-only">
													{" "}
													(s’ouvre dans un nouvel onglet)
												</span>
											</a>
										</div>
										<p className="mt-2 max-w-3xl text-xs leading-4 text-[#71717A]">
											Surveillez et configurez la façon dont ZenthCloud traite
											votre trafic Web avec les services du menu.
										</p>
									</div>
									<button
										type="button"
										disabled
										title="Bientôt disponible"
										className="flex h-8 cursor-default items-center gap-1.5 rounded-md border border-[#D1D5DB] bg-white px-3 text-xs font-medium text-[#3F3F46]"
									>
										<PlusIcon aria-hidden className="size-3.5" />
										Ajouter un tag
									</button>
								</div>
							</header>

							<section className="space-y-3 px-6 py-5 sm:px-10 xl:px-[60px]">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<fieldset className="m-0 inline-flex items-center rounded-lg border-0 bg-[#F3F4F6] p-0.5">
										<legend className="sr-only">Période</legend>
										{TIME_RANGES.map((option) => (
											<button
												key={option}
												type="button"
												onClick={() => setRange(option)}
												aria-pressed={range === option}
												className={`h-7 rounded-md px-2.5 text-xs font-medium transition-colors ${
													range === option
														? "border border-[#D1D5DB] bg-white text-[#18181B]"
														: "text-[#52525B] hover:text-[#18181B]"
												}`}
											>
												{option}
											</button>
										))}
									</fieldset>
									<p className="text-[11px] leading-4 text-[#71717A] uppercase">
										13 novembre — 14 novembre
									</p>
								</div>

								<div className="space-y-3">
									<MetricPanel
										label="Visiteurs uniques"
										value="256"
										yLabels={VISITOR_LABELS}
										values={VISITOR_DATA}
									/>
									<MetricPanel
										label="Nombre total de requêtes"
										value="567"
										yLabels={REQUEST_LABELS}
										values={REQUEST_DATA}
									/>
									<MetricPanel
										label="Pourcentage mis en cache"
										value="0%"
										yLabels={PERCENT_LABELS}
										values={CACHE_DATA}
									/>
									<MetricPanel
										label="Total des données traitées"
										value="1 MB"
										yLabels={DATA_LABELS}
										values={PROCESSED_DATA}
									/>
									<MetricPanel
										label="Données mises en cache"
										value="0 B"
										yLabels={DATA_LABELS}
										values={CACHED_DATA}
									/>
								</div>
								<a
									href={organizationPath(organization.id, "domains/overview")}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center py-1 text-xs font-medium text-[#2563EB] hover:underline"
								>
									Afficher d’autres analyses
								</a>
								<section className="rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-5">
									<h2 className="text-sm font-semibold text-[#18181B]">
										Recommandations
									</h2>
									<h3 className="mt-3 text-sm font-medium text-[#3F3F46]">
										Accélérer votre site web ou votre application
									</h3>
									<p className="mt-1 text-xs leading-4 text-[#71717A]">
										Activez les paramètres d’image, de contenu et de protocole
										recommandés.
									</p>
								</section>
							</section>
						</main>

						<aside className="space-y-5 border-t border-[#E5E7EB] bg-white px-6 py-6 sm:px-10 lg:border-l lg:border-t-0 lg:px-6 xl:py-7">
							<section className="space-y-2 border-b border-[#E5E7EB] pb-3">
								<h2 className="text-sm font-semibold leading-5 text-[#18181B]">
									DNS
								</h2>
								<p className="flex items-center gap-1.5 text-xs leading-5 text-[#3F3F46]">
									Configuration DNS : Complète
									<InfoIcon aria-hidden className="size-3.5 text-[#71717A]" />
								</p>
								<a
									href={organizationPath(
										organization.id,
										"domains/registrations",
									)}
									target="_blank"
									rel="noreferrer"
									className="block border-t border-[#E5E7EB] pt-2 text-xs text-[#2563EB] hover:underline"
								>
									Enregistrements DNS
								</a>
							</section>

							<section className="overflow-hidden rounded-lg border border-[#E5E7EB]">
								<h2 className="bg-[#F9FAFB] px-3.5 py-2.5 text-xs font-medium text-[#71717A]">
									Gestion de nom de domaine
								</h2>
								<dl className="divide-y divide-[#E5E7EB] px-3.5 text-xs">
									<div className="flex min-h-9 items-center justify-between gap-3">
										<dt className="text-[#71717A]">Registrar</dt>
										<dd className="text-right text-[#3F3F46]">
											Realtime Register
										</dd>
									</div>
									<div className="flex min-h-9 items-center justify-between gap-3">
										<dt className="text-[#71717A]">Transfert</dt>
										<dd>
											<a
												href={organizationPath(
													organization.id,
													"domains/transfers",
												)}
												target="_blank"
												rel="noreferrer"
												className="inline-flex items-center gap-1 text-[#2563EB] hover:underline"
											>
												<CloudIcon aria-hidden className="size-3.5" />
												Démarrer le transfert
											</a>
										</dd>
									</div>
								</dl>
							</section>

							<section className="rounded-lg border border-[#E5E7EB] p-2">
								<div className="flex h-[136px] items-center justify-center rounded-md border border-[#E5E7EB] bg-[#FAFAFA]">
									<div className="flex items-center gap-0">
										<WorkerNode />
										<span
											aria-hidden
											className="h-px w-5 border-t border-dashed border-[#D1D5DB]"
										/>
										<WorkerNode center />
										<span
											aria-hidden
											className="h-px w-5 border-t border-dashed border-[#D1D5DB]"
										/>
										<WorkerNode />
									</div>
								</div>
								<div className="px-2 pb-2 pt-3">
									<h2 className="text-sm font-semibold leading-5 text-[#18181B]">
										Aucun Worker connecté
									</h2>
									<p className="mt-1 text-xs leading-4 text-[#71717A]">
										Créez et déployez une application sur le réseau global de
										ZenthCloud, ou connectez un Worker existant à ce domaine.
									</p>
									<a
										href={organizationPath(organization.id, "workers")}
										target="_blank"
										rel="noreferrer"
										className="mt-3 inline-flex h-8 items-center rounded-md bg-[#2563EB] px-3 text-xs font-medium text-white hover:bg-[#1D4ED8]"
									>
										Créer un Worker
									</a>
								</div>
							</section>

							<section className="space-y-2 border-t border-[#E5E7EB] pt-4">
								<div className="flex items-start justify-between gap-3">
									<h2 className="text-sm font-semibold leading-5 text-[#18181B]">
										Gérer l’accès des bots IA
									</h2>
									<Toggle
										checked
										label="Activer la synchronisation des préférences Bot"
									/>
								</div>
								<p className="text-xs leading-4 text-[#71717A]">
									La synchronisation des préférences Bot préfixe votre
									<code className="mx-1 text-[11px]">robots.txt</code> avec les
									paramètres ZenthCloud configurés.
								</p>
								<a
									href={documentationUrl}
									target="_blank"
									rel="noreferrer"
									className="text-xs text-[#2563EB] underline underline-offset-2"
								>
									En savoir plus
								</a>
							</section>

							<section className="space-y-3 border-t border-[#E5E7EB] pt-4">
								<h2 className="text-sm font-semibold leading-5 text-[#18181B]">
									Actions rapides
								</h2>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="text-xs font-medium text-[#3F3F46]">
											Precursor
										</p>
										<p className="mt-1 text-xs leading-4 text-[#71717A]">
											Precursor détecte l’automatisation en analysant le
											comportement au fil du temps.
										</p>
										<a
											href={organizationPath(
												organization.id,
												"security/overview",
											)}
											target="_blank"
											rel="noreferrer"
											className="mt-1 inline-block text-xs text-[#2563EB] hover:underline"
										>
											Paramètres de sécurité
										</a>
									</div>
									<Toggle checked={false} label="Precursor" />
								</div>

								<div className="space-y-2 border-t border-[#E5E7EB] pt-3">
									<div className="flex items-center gap-2">
										<p className="text-xs font-medium text-[#3F3F46]">
											Markdown pour les agents
										</p>
										<span className="rounded border border-[#E5E7EB] px-1.5 py-0.5 text-[10px] text-[#71717A]">
											Offre Pro
										</span>
									</div>
									<p className="text-xs leading-4 text-[#71717A]">
										Convertir automatiquement le HTML en Markdown pour les
										requêtes qui utilisent l’en-tête{" "}
										<code className="text-[11px]">Accept: text/markdown</code>.
									</p>
									<a
										href={documentationUrl}
										target="_blank"
										rel="noreferrer"
										className="text-xs text-[#2563EB] hover:underline"
									>
										À propos de Markdown pour les agents
									</a>
									<div>
										<a
											href={organizationPath(
												organization.id,
												"account/billing",
											)}
											target="_blank"
											rel="noreferrer"
											className="text-xs text-[#2563EB] hover:underline"
										>
											Mettre à niveau l’offre
										</a>
									</div>
								</div>

								<div className="space-y-2 border-t border-[#E5E7EB] pt-3">
									<div>
										<p className="text-xs font-medium text-[#3F3F46]">
											Mode Under Attack
										</p>
										<p className="mt-1 text-xs leading-4 text-[#71717A]">
											Afficher aux visiteurs un défi non interactif lorsqu’ils
											visitent votre site.
										</p>
										<a
											href={documentationUrl}
											target="_blank"
											rel="noreferrer"
											className="mt-1 inline-block text-xs text-[#2563EB] hover:underline"
										>
											À propos du mode Under Attack
										</a>
									</div>
									<div className="border-t border-[#E5E7EB] pt-3">
										<p className="text-xs font-medium text-[#3F3F46]">
											Mode Développement
										</p>
										<p className="mt-1 text-xs leading-4 text-[#71717A]">
											Contournez temporairement le cache et observez les
											modifications apportées à votre serveur d’origine en temps
											réel.
										</p>
										<a
											href={documentationUrl}
											target="_blank"
											rel="noreferrer"
											className="mt-1 inline-block text-xs text-[#2563EB] hover:underline"
										>
											À propos du mode Développement
										</a>
									</div>
									<div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[#E5E7EB] pt-3">
										<a
											href={organizationPath(
												organization.id,
												"domains/overview",
											)}
											target="_blank"
											rel="noreferrer"
											className="text-xs text-[#2563EB] hover:underline"
										>
											Exécuter un test de vitesse
										</a>
										<a
											href={organizationPath(
												organization.id,
												"domains/overview",
											)}
											target="_blank"
											rel="noreferrer"
											className="text-xs text-[#2563EB] hover:underline"
										>
											Configurer la mise en cache
										</a>
									</div>
								</div>
							</section>

							<section className="space-y-2 border-t border-[#E5E7EB] pt-4">
								<div className="flex items-center justify-between gap-3">
									<h2 className="text-sm font-semibold leading-5 text-[#18181B]">
										Abonnements actifs
									</h2>
									<a
										href={organizationPath(organization.id, "account/billing")}
										target="_blank"
										rel="noreferrer"
										className="text-xs text-[#2563EB] hover:underline"
									>
										Facturation
									</a>
								</div>
								<div className="flex items-center justify-between gap-3 text-xs">
									<span className="text-[#3F3F46]">Traitement</span>
									<span className="text-[#71717A]">Offre gratuite</span>
								</div>
							</section>

							<section className="space-y-3 border-t border-[#E5E7EB] pt-4">
								<h2 className="text-sm font-semibold leading-5 text-[#18181B]">
									API
								</h2>
								<dl className="space-y-2 text-xs">
									<div>
										<dt className="text-[#71717A]">ID zone</dt>
										<dd className="mt-0.5 break-all font-mono text-[11px] text-[#3F3F46]">
											{domainId}
										</dd>
									</div>
									<div>
										<dt className="text-[#71717A]">ID de compte</dt>
										<dd className="mt-0.5 break-all font-mono text-[11px] text-[#3F3F46]">
											{organization.id}
										</dd>
									</div>
								</dl>
								<div className="flex flex-col items-start gap-1">
									<a
										href={organizationPath(
											organization.id,
											"account/api-tokens",
										)}
										target="_blank"
										rel="noreferrer"
										className="text-xs text-[#2563EB] hover:underline"
									>
										Obtenir votre jeton d’API
									</a>
									<a
										href="https://docs.zenthcloud.com/api"
										target="_blank"
										rel="noreferrer"
										className="text-xs text-[#2563EB] hover:underline"
									>
										Documentation sur l’API
									</a>
								</div>
							</section>

							<section className="space-y-2 border-t border-[#E5E7EB] pt-4">
								<h2 className="text-sm font-semibold leading-5 text-[#18181B]">
									Actions avancées
								</h2>
								<button
									type="button"
									disabled
									title="Bientôt disponible"
									className="block cursor-default text-left text-xs text-[#3F3F46]"
								>
									Mettre en pause ZenthCloud
								</button>
								<button
									type="button"
									disabled
									title="Bientôt disponible"
									className="block cursor-default text-left text-xs text-[#B91C1C]"
								>
									Supprimer de ZenthCloud
								</button>
							</section>
						</aside>
					</div>
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
