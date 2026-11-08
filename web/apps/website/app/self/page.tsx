import { FinalCta } from "@/components/marketing/FinalCta";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/marketing/PageIntro";
import {
	CellGrid,
	PageFaq,
	ProcessRail,
	ProductFrame,
	SplitFeatureList,
} from "@/components/pages/PagePrimitives";
import { Button } from "@/components/ui/button";
import {
	IconArrowBackUp,
	IconCloudComputing,
	IconCpu,
	IconKey,
	IconLock,
	IconRefresh,
	IconServer2,
	IconShieldCheck,
	IconTerminal2,
	IconWorld,
} from "@tabler/icons-react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "guilderia Self — Open-source, self-hosted infrastructure platform",
	description:
		"Run guilderia on infrastructure you control: your own servers, VPS, bare metal or hosting provider. Free, open source (Apache-2.0), with full control over data, updates and network boundaries.",
	alternates: {
		canonical: "https://guilderia.com/self",
	},
};

const infrastructureTargets = [
	{
		icon: IconServer2,
		title: "Your own servers and VPS",
		description:
			"Any Linux machine — from a small VPS to a rack of bare metal — can run guilderia. Docker is the only prerequisite.",
	},
	{
		icon: IconCpu,
		title: "Homelabs",
		description:
			"guilderia runs comfortably on modest hardware, making it a natural fit for homelab and personal infrastructure.",
	},
	{
		icon: IconCloudComputing,
		title: "Any hosting provider",
		description:
			"No preferred cloud: use AWS, Hetzner, OVH, Scaleway or your regional provider. Nothing ties guilderia to one vendor.",
	},
	{
		icon: IconWorld,
		title: "Air-gapped environments",
		description:
			"Deploy inside private networks, regulated environments or systems with no outbound access to a vendor cloud.",
	},
];

const controlPrinciples = [
	{
		icon: IconLock,
		title: "Sovereignty over your data",
		description:
			"Code, databases, logs and secrets never leave your infrastructure. You decide where data lives and who can reach it.",
	},
	{
		icon: IconRefresh,
		title: "You choose when to upgrade",
		description:
			"Updates are applied on your schedule, not on a vendor's release cadence. Pin a version, test it, then roll forward.",
	},
	{
		icon: IconShieldCheck,
		title: "Security under your control",
		description:
			"Firewall rules, SSH access, certificate authorities and backup destinations are all yours to configure and audit.",
	},
	{
		icon: IconArrowBackUp,
		title: "Backups you own",
		description:
			"Database and volume backups go to storage you choose — local disks, S3 buckets or your own backup system.",
	},
	{
		icon: IconKey,
		title: "Open source, no lock-in",
		description:
			"Apache-2.0 licensed. Read the code, fork it, extend it, or migrate your workloads away — the exit door is always open.",
	},
	{
		icon: IconTerminal2,
		title: "Full API and CLI access",
		description:
			"Everything the dashboard does is available through the API, CLI and SDK, so your automation never hits a paywalled endpoint.",
	},
];

const quickStart = [
	{
		title: "Provision a server",
		description:
			"Any Linux VPS or machine you already own. Modest specs are enough.",
		label: "Host",
	},
	{
		title: "Run the installer",
		description:
			"One command sets up Docker and the guilderia stack on the host.",
		label: "One command",
	},
	{
		title: "Open the dashboard",
		description:
			"Create your admin account in the web UI and connect a server.",
		label: "Account",
	},
	{
		title: "Deploy",
		description:
			"Connect a Git repository, add a domain, and ship your first application.",
		label: "Ship",
	},
];

const selfFaqs = [
	{
		question: "What do I need to run guilderia Self?",
		answer:
			"A Linux server with Docker installed. The installer sets up the rest of the stack; afterwards you manage everything from the web interface. A single small VPS is enough to get started.",
	},
	{
		question: "Is guilderia Self really free?",
		answer:
			"Yes. guilderia Self is open source under the Apache-2.0 license: no platform fees, no per-seat charges, no usage-based billing. You pay only for the infrastructure you already run.",
	},
	{
		question: "How are updates delivered?",
		answer:
			"New versions are released on GitHub with release notes. You decide when to upgrade your instance — automatic updates are optional, never imposed.",
	},
	{
		question: "Can I move from Self to Cloud later?",
		answer:
			"Yes. Both editions run the same platform capabilities, so the way you model applications, environments and teams stays the same if you change operating model.",
	},
	{
		question: "What happens if the guilderia project disappears?",
		answer:
			"Your running instance does not depend on any guilderia-hosted service. The source code and your data remain fully under your control, which is the point of self-hosting.",
	},
];

export default function SelfPage() {
	return (
		<div className="min-h-screen bg-background">
			<PageIntro
				badge="guilderia Self"
				badgeDetail="Open source · Apache-2.0"
				badgeHref="https://github.com/skygenesisenterprise/guilderia"
				title="The platform"
				highlight="you run yourself"
				description="guilderia Self is the free, Apache-2.0 licensed edition of guilderia. Install it on infrastructure you control — your servers, your VPS, your hosting provider — and deploy applications and databases without handing ownership of your stack to anyone."
				actions={
					<>
						<Button className="w-full rounded-full px-6 sm:w-auto" asChild>
							<Link
								href="https://docs.guilderia.com/docs/core/installation"
								target="_blank"
							>
								Installation guide
								<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
							</Link>
						</Button>
						<Button
							variant="outline"
							className="w-full rounded-full px-6 sm:w-auto"
							asChild
						>
							<Link
								href="https://github.com/skygenesisenterprise/guilderia"
								target="_blank"
							>
								View on GitHub
								<ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
							</Link>
						</Button>
					</>
				}
				links={[
					{ href: "/cloud", label: "Compare with Cloud" },
					{ href: "/platform", label: "Explore the platform" },
					{ href: "/pricing", label: "Pricing" },
				]}
			/>

			<Container className="pb-20 sm:pb-28">
				<ProductFrame
					src="/dashboard.png"
					alt="guilderia dashboard listing applications and their deployments"
					path="your-server/dashboard"
					caption="The full control plane, running on a machine you own."
				/>
			</Container>

			<CellGrid
				id="runs-on-infrastructure-you-choose"
				title="Runs on infrastructure you choose"
				description="guilderia does not require a specific provider or data center. If it runs Linux and Docker, it can run guilderia."
				items={infrastructureTargets}
				columns={2}
			/>

			<SplitFeatureList
				id="control-and-sovereignty-by-default"
				title="Control and sovereignty by default"
				description="Self-hosting is not only about where binaries run. It is about keeping decisions — data location, upgrade cadence, security boundaries — where they belong: with you."
				items={controlPrinciples}
				aside={
					<Link
						href="https://docs.guilderia.com/docs/core/architecture"
						target="_blank"
						className="mt-6 inline-flex items-center gap-1 text-base font-medium text-foreground underline underline-offset-4 hover:text-primary"
					>
						Read the architecture docs
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</Link>
				}
			/>

			<ProcessRail
				id="from-a-blank-server-to-your-first-deployment"
				title="From a blank server to your first deployment"
				description="guilderia is designed to be operational in minutes, not in a sprint."
				steps={quickStart}
			/>

			<PageFaq
				id="guilderia-self-faqs"
				title="guilderia Self FAQs"
				description="The practical questions that come up before the first install."
				faqs={selfFaqs}
			/>

			<FinalCta />
		</div>
	);
}
