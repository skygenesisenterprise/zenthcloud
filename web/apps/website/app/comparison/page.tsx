import { FinalCta } from "@/components/marketing/FinalCta";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/marketing/PageIntro";
import {
	SectionHeading,
	SplitFeatureList,
} from "@/components/pages/PagePrimitives";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/Reveal";
import { Activity, ArrowRight, ArrowUpRight, GitBranch, Gauge, Users } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "zenthcloud Vs. and PaaS Comparison Pages | zenthcloud",
	description:
		'How does zenthcloud compare to other application deployment, database management, and PaaS solutions? Learn on our "zenthcloud vs." alternative comparison pages.',
};

const competitors = [
	{
		name: "Coolify",
		href: "/zenthcloud-vs-coolify",
		description:
			"See how zenthcloud's polished UI, monitoring, and automation compare to Coolify's indie-dev approach.",
	},
	{
		name: "Portainer",
		href: "/zenthcloud-vs-portainer",
		description:
			"Compare zenthcloud's full deployment platform against Portainer's container management focus.",
	},
	{
		name: "CapRover",
		href: "/zenthcloud-vs-caprover",
		description:
			"Discover why teams choose zenthcloud over CapRover for monitoring, backups, and team collaboration.",
	},
	{
		name: "Dokku",
		href: "/zenthcloud-vs-dokku",
		description:
			"See how zenthcloud's visual dashboard and built-in tooling compare to Dokku's CLI-first workflow.",
	},
	{
		name: "Render",
		href: "/zenthcloud-vs-render",
		description:
			"Compare zenthcloud's self-hosted infrastructure ownership to Render's fully managed, per-service PaaS.",
	},
	{
		name: "Vercel",
		href: "/zenthcloud-vs-vercel",
		description:
			"See how zenthcloud's Docker-native, full-stack deployment compares to Vercel's serverless, frontend-first platform.",
	},
];

const whyzenthcloud = [
	{
		icon: GitBranch,
		title: "Deploy straight from your repo",
		description:
			"zenthcloud is built for actual application deployment, not just container management. You connect your repo, push code, and zenthcloud handles builds, containers, routing, and SSL without the extra scripts or side tools you end up stitching together elsewhere.",
	},
	{
		icon: Activity,
		title: "Monitor and back up by default",
		description:
			"zenthcloud gives you real-time metrics, alerts, and scheduled S3-compatible backups in the same product from day one. That means less setup, fewer moving parts, and a much shorter path from learning that something's wrong to fixing the problem.",
	},
	{
		icon: Users,
		title: "Scale across teams and servers",
		description:
			"zenthcloud fits the way teams actually work once a project stops being a solo side build. With multi-user support, RBAC, project grouping, and multi-server deployments, it gives you room to grow without forcing a platform switch later.",
	},
	{
		icon: Gauge,
		title: "Move faster in a polished UI",
		description:
			"zenthcloud keeps the workflow clean, responsive, and predictable, which has a big impact when you're deploying often. It also combines lightweight resource usage with a more refined interface, so you get less friction in the day-to-day and less overhead on the server side.",
	},
];

export default function ComparisonPage() {
	return (
		<div className="min-h-screen bg-background">
			<PageIntro
				badge="Comparisons"
				badgeDetail="Open source · Self-hosted"
				title="zenthcloud"
				highlight="vs. the alternatives"
				description="Read the comparison pages to see how zenthcloud differs from the tools it is often measured against — on deployment, monitoring, backups, team access and who owns the infrastructure."
				actions={
					<>
						<Button className="w-full rounded-full px-6 sm:w-auto" asChild>
							<Link href="https://app.zenthcloud.com/register" target="_blank">
								Get started
								<ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
							</Link>
						</Button>
						<Button
							variant="outline"
							className="w-full rounded-full px-6 sm:w-auto"
							asChild
						>
							<Link href="/self">
								Explore zenthcloud Self
								<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
							</Link>
						</Button>
					</>
				}
				links={[
					{ href: "/platform", label: "Platform capabilities" },
					{ href: "/pricing", label: "Pricing" },
					{
						href: "https://github.com/skygenesisenterprise/zenthcloud",
						label: "GitHub",
						external: true,
					},
				]}
			/>

			<section aria-labelledby="choose-a-comparison" className="pb-20 sm:pb-28">
				<Container>
					<SectionHeading
						id="choose-a-comparison"
						title="Choose a comparison"
						description="Each page looks at one alternative on the dimensions that actually change the decision: deployment workflow, operations, governance and ownership."
					/>

					<div className="mx-auto mt-12 max-w-5xl border-t border-border/40">
						{competitors.map((competitor, index) => (
							<Reveal key={competitor.name} delay={index * 0.04}>
								<Link
									href={competitor.href}
									className="group grid gap-3 border-b border-border/40 py-7 transition-colors hover:bg-card sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-8 sm:px-4"
								>
									<h3 className="font-display text-2xl tracking-tight text-foreground transition-colors group-hover:text-primary">
										vs. {competitor.name}
									</h3>
									<p className="text-base leading-relaxed text-muted-foreground">
										{competitor.description}
									</p>
									<span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
										<ArrowRight className="h-4 w-4" aria-hidden="true" />
									</span>
								</Link>
							</Reveal>
						))}
					</div>
				</Container>
			</section>

			<SplitFeatureList
				id="why-zenthcloud-best-paas"
				title="Why teams pick zenthcloud"
				description="The advantages that matter once a project has real users, real data and more than one person deploying."
				items={whyzenthcloud}
				aside={
					<Link
						href="/platform"
						className="mt-6 inline-flex items-center gap-1 text-base font-medium text-foreground underline underline-offset-4 hover:text-primary"
					>
						See the full platform
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</Link>
				}
			/>

			<FinalCta />
		</div>
	);
}
