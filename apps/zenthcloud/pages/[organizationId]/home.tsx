import type { GetServerSideProps } from "next";
import Head from "next/head";
import { OrganizationProvider } from "@/components/panel/organization-context";
import { PanelShell } from "@/components/panel/panel-shell";
import { Badge } from "@/components/ui/badge";
import {
	getOrganizationPageProps,
	type OrganizationPageProps,
} from "@/lib/organization-page";

const ROLE_LABELS: Record<string, string> = {
	owner: "propriétaire",
	admin: "administrateur",
	member: "membre",
};

const NEXT_STEPS = [
	{
		title: "Relier votre premier domaine",
		description:
			"Pointez un domaine vers ZenthCloud pour gérer son DNS, ses certificats et son trafic depuis cet espace.",
	},
	{
		title: "Déployer une ressource de calcul",
		description:
			"Instances et services s'exécutent dans cet espace de travail et partagent ses accès.",
	},
	{
		title: "Configurer l'observabilité",
		description:
			"Les métriques et l'historique d'activité restent rattachés à l'organisation affichée ici.",
	},
];

export default function OrganizationHomePage({
	organization,
	user,
}: OrganizationPageProps) {
	const roleLabel = ROLE_LABELS[organization.role] ?? organization.role;

	return (
		<>
			<Head>
				<title>{`${organization.name} | ZenthCloud`}</title>
			</Head>
			<OrganizationProvider organization={organization}>
				<PanelShell title="Accueil">
					<div className="space-y-10">
						<header className="space-y-2">
							<p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Espace de travail
							</p>
							<h1 className="text-2xl font-semibold tracking-tight">
								Bonjour, {organization.name}
							</h1>
							<p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
								Vous êtes connecté en tant que {roleLabel} de cet espace de
								travail. Tout ce que vous déployez ici reste rattaché à cet
								identifiant d&apos;organisation.
							</p>
						</header>

						<section
							aria-labelledby="workspace-details-heading"
							className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
						>
							<h2 id="workspace-details-heading" className="sr-only">
								Informations de l&apos;espace de travail
							</h2>

							<div className="rounded-lg border bg-card p-5">
								<p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
									Organisation
								</p>
								<p className="mt-2 text-sm font-semibold">
									{organization.name}
								</p>
								<p className="mt-1 truncate font-mono text-xs text-muted-foreground">
									{organization.id}
								</p>
							</div>

							<div className="rounded-lg border bg-card p-5">
								<p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
									Votre rôle
								</p>
								<div className="mt-2 flex items-center gap-2">
									<Badge variant="outline" className="capitalize">
										{roleLabel}
									</Badge>
								</div>
								<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
									Les destinations affichées dans la navigation dépendent de vos
									permissions sur cette organisation.
								</p>
							</div>

							<div className="rounded-lg border bg-card p-5">
								<p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
									Compte
								</p>
								<p className="mt-2 truncate text-sm font-medium">
									{user.email}
								</p>
								<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
									La session est rattachée à cet espace de travail dès
									l&apos;ouverture du panel.
								</p>
							</div>
						</section>

						<section aria-labelledby="next-steps-heading" className="space-y-4">
							<div className="flex items-baseline justify-between gap-4">
								<h2
									id="next-steps-heading"
									className="text-lg font-semibold tracking-tight"
								>
									Pour commencer
								</h2>
								<span className="text-xs text-muted-foreground">
									Les pages arrivent progressivement
								</span>
							</div>

							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{NEXT_STEPS.map((step) => (
									<div
										key={step.title}
										className="rounded-lg border bg-card p-5"
									>
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium">{step.title}</p>
											<Badge variant="outline" className="uppercase">
												Bientôt
											</Badge>
										</div>
										<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
											{step.description}
										</p>
									</div>
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
