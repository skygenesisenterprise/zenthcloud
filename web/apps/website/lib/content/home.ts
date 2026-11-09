import type { ProductFamily } from "@/lib/domain/schema";
import { links } from "./site";

export type FaqEntry = { question: string; answer: string };

export const homeHero = {
	eyebrow: "Enterprise cloud infrastructure",
	title: "Cloud infrastructure.",
	highlight: "Built to connect.",
	description:
		"Compute, storage, networking, platform and security services on infrastructure operated by ZenthCloud and by named partners. One catalogue, with availability and commercial state published per product and region.",
	primaryCta: { href: "/products", label: "Explore products" },
	secondaryCta: { href: "/pricing", label: "View pricing" },
} as const;

/* -------------------------------------------------------------------------- */
/* 01 — The ecosystem                                                         */
/* -------------------------------------------------------------------------- */

export const familiesSection = {
	eyebrow: "Cloud infrastructure, all in one place",
	title: "Everything your infrastructure needs.",
	description:
		"Build, deploy and operate your digital infrastructure with an integrated ecosystem of cloud, networking, platform and security services. Every family below is part of the published catalogue, and every product listed resolves to a live page.",
} as const;

export const familyNotes: Record<ProductFamily, string> = {
	compute:
		"Virtual machines, accelerated capacity, dedicated hardware and private estates.",
	storage:
		"Object, block and backup storage with explicit lifecycle and retention rules.",
	networking:
		"Private networks, public addressing, load balancing and edge connectivity.",
	platform:
		"Kubernetes, managed databases and operations delegated under contract.",
	web: "Hosting, domains and mailboxes for sites, applications and teams.",
	security:
		"Protection, monitoring and recovery capabilities, each with its scope stated.",
};

/* -------------------------------------------------------------------------- */
/* 02 — Featured products                                                     */
/* -------------------------------------------------------------------------- */

export const featuredSection = {
	eyebrow: "Featured products",
	title: "Power your infrastructure with the right services.",
	description:
		"A selection of the services teams start with. Each entry shows what the product does, how it is delivered and its commercial state — taken from the catalogue, not from a separate marketing page.",
} as const;

export const featuredProductIds = [
	"compute-instances",
	"object-storage",
	"kubernetes",
	"networking",
	"bare-metal",
	"security",
] as const;

/* -------------------------------------------------------------------------- */
/* 03 — Workloads                                                             */
/* -------------------------------------------------------------------------- */

export const workloadsSection = {
	eyebrow: "Infrastructure for every workload",
	title: "Built for the workloads that power your business.",
	description:
		"Different workloads make different demands on compute, data and network. These are the combinations the catalogue is designed for, expressed with the products that actually exist today.",
} as const;

export const workloads: readonly {
	id: string;
	title: string;
	description: string;
	uses: readonly string[];
	productIds: readonly string[];
}[] = [
	{
		id: "web",
		title: "Websites and applications",
		description:
			"Host a site, an API or a full application stack with managed runtimes, virtual machines and databases that stay on a private network.",
		uses: ["Web hosting", "APIs and backends", "Managed databases", "Static assets"],
		productIds: ["web-hosting", "compute-instances", "databases", "object-storage"],
	},
	{
		id: "enterprise",
		title: "Enterprise infrastructure",
		description:
			"Run business applications on reserved capacity, either in a private pool or on dedicated hardware, connected through a segmented network.",
		uses: ["Business applications", "Private environments", "Virtual machines", "Dedicated hardware"],
		productIds: ["private-cloud", "bare-metal", "networking", "managed-services"],
	},
	{
		id: "developer",
		title: "Developer infrastructure",
		description:
			"Give engineering teams a repeatable target for containers, build agents and ephemeral environments without operating the control plane.",
		uses: ["CI/CD runners", "Containers", "Git-based deployment", "Automation"],
		productIds: ["kubernetes", "compute-instances", "block-storage", "backup"],
	},
	{
		id: "data",
		title: "Data and AI workloads",
		description:
			"Attach accelerated compute to durable object and block storage for training, inference and batch processing.",
		uses: ["Datasets and checkpoints", "GPU compute", "Batch processing", "Durable storage"],
		productIds: ["gpu-instances", "object-storage", "block-storage", "databases"],
	},
];

/* -------------------------------------------------------------------------- */
/* 04 — Connected infrastructure                                              */
/* -------------------------------------------------------------------------- */

export const architectureSection = {
	eyebrow: "Connected cloud and network",
	title: "More than cloud. A connected infrastructure.",
	description:
		"ZenthCloud is not only a place to rent virtual machines. Compute, storage, private networking, DNS and security are modelled together, so a workload can be placed, addressed, protected and observed as one estate.",
	note: "Conceptual view of how catalogue services combine. It is not a network topology, a facility map or a capacity statement; operational status is published per product and region.",
} as const;

export const architectureLayers: readonly {
	label: string;
	note: string;
	services: readonly string[];
}[] = [
	{
		label: "Edge and connectivity",
		note: "Names, addresses and entry points",
		services: ["Domain Services", "Cloud Networking", "Load balancing", "Public IPv4 and IPv6"],
	},
	{
		label: "Workloads",
		note: "Where applications run",
		services: ["Compute Instances", "Managed Kubernetes", "Managed Databases", "GPU Instances"],
	},
	{
		label: "Data",
		note: "Where state is kept",
		services: ["Object Storage", "Block Storage", "Backup & Snapshots"],
	},
	{
		label: "Security and operations",
		note: "How the estate is protected and run",
		services: ["Security & Reliability", "Managed Services", "Private network segmentation"],
	},
];

/* -------------------------------------------------------------------------- */
/* 05 — Deployment models                                                     */
/* -------------------------------------------------------------------------- */

export const deploymentSection = {
	eyebrow: "Deploy your way",
	title: "Your infrastructure. Your deployment model.",
	description:
		"The same catalogue can be delivered on shared capacity, as a reserved pool, on dedicated hardware or combined with infrastructure you already operate. The differences are commercial and operational, and they are stated before a contract.",
} as const;

export const deploymentModels: readonly {
	title: string;
	description: string;
	fit: string;
	commercial: string;
}[] = [
	{
		title: "Public Cloud",
		description:
			"Shared, provider-operated capacity ordered per resource: an instance, a volume, a database or a network.",
		fit: "Web applications, APIs, staging environments and workloads that vary in size.",
		commercial:
			"Catalogue entries open progressively by region. Each product page states its current commercial state.",
	},
	{
		title: "Private Cloud",
		description:
			"A reserved compute and storage pool in an isolated network segment, sized for a single customer.",
		fit: "Business applications, regulated environments and capacity that must be predictable.",
		commercial: "Quoted per configuration through sales; capacity is confirmed before signature.",
	},
	{
		title: "Dedicated infrastructure",
		description:
			"Physical servers allocated to one customer, with reinstallation, remote hands and direct network interconnection.",
		fit: "High-density workloads, custom networking and full control of the hardware layer.",
		commercial: "Quoted per configuration; hardware and delivery dates are confirmed individually.",
	},
	{
		title: "Hybrid Cloud",
		description:
			"ZenthCloud resources combined with partner capacity or with infrastructure you already operate.",
		fit: "Progressive migration, data locality and multi-provider resilience.",
		commercial:
			"Scoped individually. The operating provider is named per product and region, never implied.",
	},
];

/* -------------------------------------------------------------------------- */
/* 06 — Developers and operators                                              */
/* -------------------------------------------------------------------------- */

export const developerSection = {
	eyebrow: "Built for developers and operators",
	title: "Everything you need to automate your infrastructure.",
	description:
		"Resources are API objects with documented fields, and the tooling around them is maintained in the open. The platform provides the primitives; your CI, deployment tooling and observability stay yours.",
} as const;

export const developerTools: readonly {
	title: string;
	description: string;
	href: string;
	label: string;
	external: boolean;
}[] = [
	{
		title: "Public API",
		description:
			"Resource lifecycle over HTTP, documented endpoint by endpoint, with authentication and error semantics.",
		href: links.docs.api,
		label: "API reference",
		external: true,
	},
	{
		title: "CLI",
		description:
			"A command-line interface published in the open-source repository, with machine-readable output for scripts and agents.",
		href: links.github,
		label: "Repository",
		external: true,
	},
	{
		title: "Terraform provider",
		description:
			"Infrastructure as code through a provider maintained alongside the platform and its API.",
		href: links.github,
		label: "Terraform provider",
		external: true,
	},
	{
		title: "MCP server",
		description:
			"An MCP server that exposes the API to agentic tooling through a compact, searchable tool surface.",
		href: links.github,
		label: "MCP server",
		external: true,
	},
	{
		title: "Git-based workflows",
		description:
			"Deploy from a repository and keep delivery in your pipeline. ZenthCloud does not impose an orchestration layer.",
		href: "/solutions/developers",
		label: "Developer solutions",
		external: false,
	},
	{
		title: "Monitoring and observability",
		description:
			"Resource state, commercial state and operational status are exposed through the API and the console.",
		href: "/resources/support",
		label: "Support routes",
		external: false,
	},
];

/* -------------------------------------------------------------------------- */
/* 07 — Footprint                                                             */
/* -------------------------------------------------------------------------- */

export const footprintSection = {
	eyebrow: "Infrastructure and network footprint",
	title: "Infrastructure designed to connect.",
	description:
		"Regions enter the catalogue with a verification state. A region is listed here because it is modelled, not because a facility has been announced — no city, address or capacity figure is claimed until it is verified.",
} as const;

/* -------------------------------------------------------------------------- */
/* 08 — Security and operations                                               */
/* -------------------------------------------------------------------------- */

export const securitySection = {
	eyebrow: "Security, reliability and operations",
	title: "Security and reliability across every layer.",
	description:
		"Protection is described by the layer it applies to and the scope it covers. Where an engagement, guarantee or certification does not exist, the page says so instead of implying it.",
} as const;

export const securityLayers: readonly { title: string; scope: string }[] = [
	{
		title: "Infrastructure security",
		scope: "Isolation between tenants, image integrity and controlled access to the hypervisor layer.",
	},
	{
		title: "Network security",
		scope: "Private network segmentation, cloud firewall rules and public address management.",
	},
	{
		title: "Application protection",
		scope: "DDoS protection, web application protection and TLS termination as catalogue capabilities.",
	},
	{
		title: "Identity and access",
		scope: "Account-level identity, scoped API tokens and role separation in the console.",
	},
	{
		title: "Backups and recovery",
		scope: "Snapshots, scheduled backup policies and restore to a new resource.",
	},
	{
		title: "Monitoring and incident management",
		scope: "Resource state, incident communication and maintenance windows published per service.",
	},
	{
		title: "Operational transparency",
		scope: "Provider, region and commercial state are visible for every product in the catalogue.",
	},
	{
		title: "Support",
		scope: "Support routes are documented by product; response commitments exist only under contract.",
	},
];

export const securityCommitments = [
	"No SLA is offered on this website; an SLA exists only where a signed contract states one.",
	"No certification is listed without its scope, issuing body and validity period.",
	"No uptime or capacity figure is published without a measurement behind it.",
	"No data-residency guarantee is implied; residency is a contractual term.",
	"No DDoS mitigation capacity is claimed beyond the capability described per product.",
] as const;

/* -------------------------------------------------------------------------- */
/* 09 — Why ZenthCloud                                                        */
/* -------------------------------------------------------------------------- */

export const whySection = {
	eyebrow: "Why ZenthCloud",
	title: "An open approach to cloud infrastructure.",
	description:
		"The difference is not a slogan. It is how the offer is assembled, documented and sold — and how clearly the boundary between ZenthCloud and its partners is drawn.",
} as const;

export const whyPoints: readonly { title: string; description: string }[] = [
	{
		title: "Infrastructure flexibility",
		description:
			"Combine capacity operated by ZenthCloud with partner infrastructure or your own estate. Each availability entry names the provider, so a hybrid design is explicit rather than assumed.",
	},
	{
		title: "Open and interoperable",
		description:
			"Documented interfaces, a public API, a Terraform provider and an MCP server. Resources stay addressable, so a workload can move without re-platforming the team.",
	},
	{
		title: "Integrated services",
		description:
			"Compute, storage, networking, platform and security share one catalogue, one availability model and one commercial vocabulary.",
	},
	{
		title: "Operational transparency",
		description:
			"Every product states its commercial state, its operational status and its regional scope. Prices remain unpublished until they are approved, never replaced by a placeholder.",
	},
	{
		title: "European roots. Global ambitions.",
		description:
			"ZenthCloud is built from Europe with an international outlook. That is an ambition, not a claim of worldwide facilities: regions appear here only once they are modelled and verified.",
	},
];

/* -------------------------------------------------------------------------- */
/* 10 — Resources                                                             */
/* -------------------------------------------------------------------------- */

export const resourcesSection = {
	eyebrow: "Resources and ecosystem",
	title: "Documentation, tooling and support.",
	description:
		"Technical material is versioned with the platform and kept separate from marketing content, so what you read matches what the API exposes.",
} as const;

export const resourceLinks: readonly {
	label: string;
	href: string;
	description: string;
	external: boolean;
}[] = [
	{
		label: "Documentation",
		href: links.docs.home,
		description: "Guides, limits and operational notes.",
		external: true,
	},
	{
		label: "API reference",
		href: links.docs.api,
		description: "Endpoints, authentication and errors.",
		external: true,
	},
	{
		label: "Developer resources",
		href: "/solutions/developers",
		description: "Patterns for teams building on the API.",
		external: false,
	},
	{
		label: "CLI and Terraform",
		href: links.github,
		description: "Tooling published in the open-source repository.",
		external: true,
	},
	{
		label: "Service status",
		href: links.status,
		description: "Incidents and maintenance.",
		external: true,
	},
	{
		label: "Support",
		href: "/resources/support",
		description: "Support routes and their scope.",
		external: false,
	},
];

/* -------------------------------------------------------------------------- */
/* 11 — Commercial CTA                                                        */
/* -------------------------------------------------------------------------- */

export const finalCta = {
	eyebrow: "Start here",
	title: "Ready to build on ZenthCloud?",
	description:
		"Explore our infrastructure services, discover available products or talk with our team about your requirements.",
	primary: { href: "/products", label: "Explore products" },
	secondary: { href: "/pricing", label: "View pricing" },
	tertiary: { href: "/contact-sales", label: "Contact sales" },
	note: "Self-service onboarding is not open yet. Product pages state commercial availability per region, and prices are published only once approved.",
} as const;

export const homeFaqs: FaqEntry[] = [
	{
		question: "Can I order every product shown on the website?",
		answer:
			"No. The catalogue is complete by design, but each product carries a commercial state — available, coming soon, contact sales or partner service — and a per-region availability table. A product marked coming soon cannot be ordered and no launch date is implied.",
	},
	{
		question: "Are prices final?",
		answer:
			"No commercial price is published yet. Pricing plans exist in the data model, but every plan is in draft and shows “Price not published”. We do not display placeholder prices that could be mistaken for an offer.",
	},
	{
		question: "Does ZenthCloud own all of its infrastructure?",
		answer:
			"No. ZenthCloud operates a hybrid model: owned infrastructure plus partner infrastructure. Products delivered on partner capacity are labelled “Partner service”, and the operating provider is named in the contract for that product and region.",
	},
	{
		question: "Where are the regions located?",
		answer:
			"The catalogue models a European Union core region and a partner network. Both currently carry a pending verification state, so no city or facility address is claimed on this website. Verified locations will be listed with their operating entity.",
	},
	{
		question: "Is there an SLA or certification?",
		answer:
			"None is claimed on this website. An SLA applies only where a signed contract states one, and a certification is listed only with its scope, issuing body and validity period.",
	},
	{
		question: "How do I get access?",
		answer:
			"Public self-service onboarding is not open yet. Request access or contact sales with the products and region you are targeting. Existing customers sign in through the console.",
	},
];
