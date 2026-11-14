import {
	CaretUpDownIcon,
	CheckIcon,
	DotsThreeIcon,
	GearSixIcon,
	InfoIcon,
	MagnifyingGlassIcon,
	StarIcon,
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

/**
 * A domain as listed on the overview. Visitor counts and security notices come
 * from the reference dashboard; the series only shapes the decorative
 * sparkline, never the figure the user reads.
 */
type Domain = {
	name: string;
	accent: "blue" | "slate";
	securityNotices: number;
	visitors: string;
	series: readonly number[];
};

const DOMAINS: readonly Domain[] = [
	{
		name: "aethermail.me",
		accent: "slate",
		securityNotices: 4,
		visitors: "219",
		series: [
			6, 14, 9, 20, 10, 17, 8, 12, 9, 16, 11, 21, 12, 15, 10, 18, 9, 13, 11, 14,
		],
	},
	{
		name: "giteria.com",
		accent: "blue",
		securityNotices: 3,
		visitors: "2,13k",
		series: [
			8, 18, 12, 24, 14, 26, 18, 30, 22, 34, 24, 38, 28, 42, 30, 44, 32, 40, 34,
			46,
		],
	},
	{
		name: "guilderia.com",
		accent: "blue",
		securityNotices: 3,
		visitors: "1,52k",
		series: [
			10, 16, 12, 22, 15, 18, 26, 20, 24, 19, 28, 22, 30, 24, 27, 21, 29, 25,
			31, 26,
		],
	},
	{
		name: "liamvonastoria.eu",
		accent: "blue",
		securityNotices: 4,
		visitors: "1,4k",
		series: [
			12, 14, 13, 15, 12, 16, 14, 25, 18, 30, 22, 34, 26, 20, 24, 18, 22, 20,
			26, 24,
		],
	},
	{
		name: "notploy.app",
		accent: "blue",
		securityNotices: 3,
		visitors: "1,68k",
		series: [
			14, 16, 15, 17, 16, 15, 18, 17, 16, 19, 18, 17, 20, 18, 17, 19, 18, 16,
			17, 18,
		],
	},
	{
		name: "notploy.com",
		accent: "blue",
		securityNotices: 5,
		visitors: "23,65k",
		series: [
			10, 22, 14, 30, 18, 26, 34, 24, 40, 30, 36, 28, 44, 34, 30, 38, 32, 40,
			36, 34,
		],
	},
	{
		name: "skygenesisenterprise.com",
		accent: "blue",
		securityNotices: 3,
		visitors: "4,5k",
		series: [
			8, 16, 12, 20, 14, 24, 16, 22, 15, 26, 18, 30, 22, 26, 19, 24, 21, 28, 23,
			25,
		],
	},
	{
		name: "zenthcloud.com",
		accent: "blue",
		securityNotices: 4,
		visitors: "1,85k",
		series: [
			16, 18, 15, 20, 17, 19, 16, 22, 18, 21, 17, 23, 19, 20, 18, 22, 20, 21,
			19, 20,
		],
	},
];

/** Decorative traffic curve of one row, with its filled area. */
function Sparkline({
	id,
	series,
	accent,
}: {
	id: string;
	series: readonly number[];
	accent: Domain["accent"];
}) {
	const width = 150;
	const height = 28;
	const max = Math.max(...series, 1);
	const step = series.length > 1 ? width / (series.length - 1) : width;
	const points = series.map((value, index) => {
		const x = index * step;
		const y = height - (value / max) * height;
		return `${x.toFixed(1)},${y.toFixed(1)}`;
	});
	const line = `M${points.join(" L")}`;

	return (
		<svg
			aria-hidden
			viewBox={`0 0 ${width} ${height}`}
			preserveAspectRatio="none"
			className={`h-7 w-[150px] shrink-0 ${
				accent === "blue" ? "text-blue-500" : "text-slate-400"
			}`}
		>
			<defs>
				<linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
					<stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
				</linearGradient>
			</defs>
			<path
				d={`${line} L${width},${height} L0,${height} Z`}
				fill={`url(#${id})`}
			/>
			<path d={line} fill="none" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
}

/** Shared header cell: label, optional sort glyph and info affordance. */
function ColumnHeader({
	label,
	sortable = false,
	info = false,
	className,
}: {
	label: string;
	sortable?: boolean;
	info?: boolean;
	className?: string;
}) {
	return (
		<th
			scope="col"
			className={`px-4 py-2.5 text-left align-middle text-xs font-normal text-muted-foreground ${className ?? ""}`}
		>
			<span className="inline-flex items-center gap-1">
				{label}
				{sortable && <CaretUpDownIcon aria-hidden className="size-3" />}
				{info && <InfoIcon aria-hidden className="size-3.5" />}
			</span>
		</th>
	);
}

export default function DomainsOverviewPage({
	organization,
	user,
}: OrganizationPageProps) {
	const [query, setQuery] = useState("");
	const needle = query.trim().toLowerCase();
	const domains = needle
		? DOMAINS.filter((domain) => domain.name.toLowerCase().includes(needle))
		: DOMAINS;

	return (
		<>
			<Head>
				<title>{`Domaines | ${organization.name} | ZenthCloud`}</title>
			</Head>
			<OrganizationProvider organization={organization}>
				<PanelShell title="Domaines" user={user}>
					{/* Page header, flush with the width of the panel like the reference
					    dashboard: title and actions above a full-width rule. */}
					<header className="-mx-4 -mt-8 border-b px-4 py-6 sm:-mx-8 sm:px-8">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div className="space-y-1">
								<div className="flex flex-wrap items-center gap-3">
									<h1 className="text-2xl font-semibold tracking-tight">
										Domaines
									</h1>
									<button
										type="button"
										disabled
										title="Bientôt disponible"
										className="cursor-default text-xs text-muted-foreground underline underline-offset-2"
									>
										Afficher la documentation
									</button>
								</div>
								<p className="text-sm text-muted-foreground">
									Accélérez et protégez vos sites et apps
								</p>
							</div>
							<div className="flex flex-wrap items-center gap-2">
								<button
									type="button"
									disabled
									title="Bientôt disponible"
									className="h-9 cursor-default rounded-lg border bg-background px-4 text-sm font-medium"
								>
									Acheter un domaine
								</button>
								<button
									type="button"
									disabled
									title="Bientôt disponible"
									className="h-9 cursor-default rounded-lg border border-transparent bg-blue-600 px-4 text-sm font-medium text-white"
								>
									Ajouter un domaine
								</button>
							</div>
						</div>
					</header>

					<div className="pt-8">
						<div className="flex items-center gap-3">
							<div className="relative min-w-0 flex-1">
								<label htmlFor="domains-search" className="sr-only">
									Rechercher par nom de domaine
								</label>
								<MagnifyingGlassIcon
									aria-hidden
									className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
								/>
								<input
									id="domains-search"
									type="search"
									value={query}
									onChange={(event) => setQuery(event.target.value)}
									placeholder="Recherche par nom de domaine..."
									className="h-10 w-full rounded-lg border bg-background pr-4 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
								/>
							</div>
							<button
								type="button"
								disabled
								aria-label="Filtrer les domaines favoris"
								title="Bientôt disponible"
								className="flex size-9 shrink-0 cursor-default items-center justify-center rounded-lg text-muted-foreground"
							>
								<StarIcon aria-hidden className="size-5" />
							</button>
						</div>

						<div className="mt-4 overflow-x-auto rounded-lg border bg-card">
							<table className="w-full min-w-[900px] border-collapse text-sm">
								<caption className="sr-only">
									Domaines de l’organisation avec leur état, leurs informations
									de sécurité et leur trafic
								</caption>
								<thead>
									<tr className="border-b">
										<ColumnHeader
											label="Domaine"
											sortable
											className="w-[30%]"
										/>
										<ColumnHeader
											label="État"
											sortable
											info
											className="w-[18%]"
										/>
										<ColumnHeader
											label="Informations sur la sécurité"
											info
											className="w-[23%]"
										/>
										<ColumnHeader
											label="Visiteurs uniques"
											info
											className="w-[21%]"
										/>
										<th scope="col" className="w-14 px-3 py-2.5 text-right">
											<GearSixIcon
												aria-hidden
												className="ml-auto size-4 text-muted-foreground"
											/>
										</th>
									</tr>
								</thead>
								<tbody>
									{domains.map((domain) => {
										const gradientId = `sparkline-${domain.name}`;
										return (
											<tr
												key={domain.name}
												className="h-12 border-b last:border-b-0"
											>
												<td className="px-4">
													<NextLink
														href={organizationPath(
															organization.id,
															`domains/${domain.name}`,
														)}
														className="font-medium hover:underline"
													>
														{domain.name}
													</NextLink>
												</td>
												<td className="px-4">
													<span className="flex items-center gap-1.5 text-xs">
														<CheckIcon aria-hidden className="size-4" />
														Actif
													</span>
												</td>
												<td className="px-4">
													<span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
														{domain.securityNotices} aperçus
													</span>
												</td>
												<td className="px-4">
													<span className="flex items-center justify-end gap-3">
														<Sparkline
															id={gradientId}
															series={domain.series}
															accent={domain.accent}
														/>
														<span className="w-16 text-right tabular-nums">
															{domain.visitors}
														</span>
													</span>
												</td>
												<td className="px-4 text-center text-muted-foreground">
													—
												</td>
												<td className="px-3 text-right">
													<button
														type="button"
														disabled
														aria-label={`Options de ${domain.name}`}
														title="Bientôt disponible"
														className="ml-auto flex size-7 cursor-default items-center justify-center rounded-md text-muted-foreground"
													>
														<DotsThreeIcon aria-hidden className="size-4" />
													</button>
												</td>
											</tr>
										);
									})}
									{domains.length === 0 && (
										<tr>
											<td
												colSpan={6}
												className="px-4 py-6 text-center text-xs text-muted-foreground"
											>
												Aucun domaine ne correspond à « {query.trim()} ».
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<p className="mt-2 text-xs text-muted-foreground">
							{domains.length === 0
								? "Affichage de 0 domaine sur 8"
								: `Affichage de 1 à ${domains.length} sur ${DOMAINS.length}`}
						</p>
					</div>
				</PanelShell>
			</OrganizationProvider>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<OrganizationPageProps> =
	getOrganizationPageProps;
