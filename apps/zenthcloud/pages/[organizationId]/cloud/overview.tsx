import {
	ArrowsClockwiseIcon,
	CpuIcon,
	DatabaseIcon,
	GearIcon,
	NetworkIcon,
	WrenchIcon,
} from "@phosphor-icons/react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { OrganizationProvider } from "@/components/panel/organization-context";
import { PanelShell } from "@/components/panel/panel-shell";
import {
	getOrganizationPageProps,
	type OrganizationPageProps,
} from "@/lib/organization-page";

const CLOUD_DOMAINS = [
	{
		label: "Compute",
		description:
			"Machines virtuelles, conteneurs, clusters et nœuds de virtualisation.",
		icon: CpuIcon,
	},
	{
		label: "Storage",
		description: "Pools, volumes, disques, sauvegardes et instantanés.",
		icon: DatabaseIcon,
	},
	{
		label: "Network & Security",
		description:
			"Interfaces, réseaux virtuels, VLAN, DNS, pare-feux, VPN et répartiteurs.",
		icon: NetworkIcon,
	},
	{
		label: "Availability",
		description:
			"Haute disponibilité, réplication, migration et reprise après sinistre.",
		icon: ArrowsClockwiseIcon,
	},
	{
		label: "Operations",
		description:
			"Tâches, événements, audit, santé, maintenance, mises à jour et notifications.",
		icon: WrenchIcon,
	},
	{
		label: "Administration",
		description:
			"Contrôle d’accès, politiques, certificats, fournisseurs et intégrations.",
		icon: GearIcon,
	},
] as const;

export default function CloudOverviewPage({
	organization,
	user,
}: OrganizationPageProps) {
	return (
		<>
			<Head>
				<title>{`Cloud | ${organization.name} | ZenthCloud`}</title>
			</Head>
			<OrganizationProvider organization={organization}>
				<PanelShell title="Cloud" user={user}>
					<div className="mx-auto max-w-5xl space-y-8 pb-6">
						<header className="space-y-2">
							<h1 className="text-2xl font-semibold tracking-tight">
								Cloud Workspace
							</h1>
							<p className="max-w-2xl text-sm text-muted-foreground">
								Administrez vos infrastructures, serveurs, réseaux et services
								cloud depuis un espace unique.
							</p>
						</header>

						<section
							aria-labelledby="cloud-domains-heading"
							className="space-y-4"
						>
							<h2
								id="cloud-domains-heading"
								className="text-sm font-medium text-foreground"
							>
								Domaines fonctionnels
							</h2>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{CLOUD_DOMAINS.map((domain) => {
									const Icon = domain.icon;
									return (
										<article
											key={domain.label}
											className="rounded-xl border bg-card p-5"
										>
											<div className="flex items-center gap-2">
												<Icon
													aria-hidden
													className="size-4 text-muted-foreground"
												/>
												<h3 className="text-sm font-medium">{domain.label}</h3>
											</div>
											<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
												{domain.description}
											</p>
											<p className="mt-3 text-[11px] text-muted-foreground">
												Bientôt disponible
											</p>
										</article>
									);
								})}
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
