import { links } from "./site";

/**
 * Editorial content for the non-product routes.
 *
 * Every statement here is structural or verifiable from the repository,
 * public documentation, or an explicit "not yet published" state. No
 * certifications, locations, uptime figures or customer outcomes are claimed.
 */

export type ContentSection = {
	heading: string;
	body: string;
	bullets?: string[];
};

export type DetailPage = {
	path: string;
	eyebrow: string;
	title: string;
	description: string;
	intro: string;
	sections: ContentSection[];
	related?: { label: string; href: string; external?: boolean }[];
};

export type SolutionPage = DetailPage & {
	slug: string;
	outcomes: { title: string; description: string }[];
	productIds: string[];
	fit: string[];
};

export const solutions: SolutionPage[] = [
	{
		slug: "developers",
		path: "/solutions/developers",
		eyebrow: "For developers",
		title: "Infrastructure that stays out of your way",
		description:
			"Compute, storage and networking exposed through an API, with documentation that states what is actually available.",
		intro:
			"ZenthCloud is built for teams that treat infrastructure as code. Resources are created through an API, described in documentation, and priced transparently once published. Nothing here promises a feature that has not been verified and documented.",
		outcomes: [
			{
				title: "Provision from the API",
				description:
					"Instances, volumes, networks and databases are API resources. The public API reference documents the endpoints that exist.",
			},
			{
				title: "State the limits",
				description:
					"Each product page lists its actual constraints — attachment rules, resize behaviour, region scope — instead of leaving them to support tickets.",
			},
			{
				title: "Predictable billing",
				description:
					"Hourly, monthly and usage-based plans are modelled explicitly. Prices stay unpublished until they are approved.",
			},
		],
		productIds: ["compute-instances", "block-storage", "kubernetes", "object-storage"],
		fit: [
			"Teams provisioning environments from CI",
			"Platform engineers who need explicit limits",
			"Projects moving from a single server to several",
		],
		sections: [
			{
				heading: "How to start",
				body: "Start with the documentation for the product you need. If a service is marked coming soon or contact sales, the page explains the current state instead of offering a button that cannot complete.",
			},
			{
				heading: "What we do not automate",
				body: "Application deployment, CI runners and observability are not part of the infrastructure catalogue. Use the tools you already run; ZenthCloud provides the resources underneath.",
			},
		],
		related: [
			{ label: "API reference", href: links.docs.api, external: true },
			{ label: "Documentation", href: links.docs.home, external: true },
		],
	},
	{
		slug: "startups",
		path: "/solutions/startups",
		eyebrow: "For startups",
		title: "Start small, keep the exit ramp",
		description:
			"Begin with a single instance or a managed service, then add capacity without changing providers.",
		intro:
			"Early-stage teams need infrastructure that does not lock them into a platform they will outgrow. The catalogue is organised so a project can begin with one product and add networking, storage and managed services as it grows.",
		outcomes: [
			{
				title: "No minimum estate",
				description:
					"Most services are designed to be ordered individually. You are not required to buy a private estate to run a first workload.",
			},
			{
				title: "Costs you can model",
				description:
					"Billing models are explicit per product, and the pricing pages publish their state rather than inventing figures.",
			},
			{
				title: "Room to grow",
				description:
					"The same networking, storage and Kubernetes primitives apply from a first instance to a multi-region estate.",
			},
		],
		productIds: ["compute-instances", "databases", "object-storage", "web-hosting"],
		fit: [
			"Pre-seed and seed teams without a platform engineer",
			"Products moving from a prototype to production",
			"Teams that want a written upgrade path",
		],
		sections: [
			{
				heading: "Commercial state matters",
				body: "The catalogue distinguishes services that are open, in preparation and delivered through partners. Availability in your region is shown per product. A coming-soon service is not a commitment to a launch date.",
			},
			{
				heading: "Support that matches the stage",
				body: "Documentation and the public status page are the baseline. Scoped support and managed operations are agreed separately; no response time is implied by this page.",
			},
		],
		related: [
			{ label: "Pricing", href: "/pricing" },
			{ label: "Contact sales", href: "/contact-sales" },
		],
	},
	{
		slug: "small-business",
		path: "/solutions/small-business",
		eyebrow: "For small business",
		title: "Websites, mail and infrastructure in one place",
		description:
			"Managed hosting, domains, mailboxes and the cloud resources behind them, with a clear scope for each.",
		intro:
			"Not every organisation wants to administer a server. Web hosting, domain services and email hosting are presented alongside the compute catalogue so a business can choose the level of control it needs — and move up when it does.",
		outcomes: [
			{
				title: "Managed by default",
				description:
					"Hosting plans include routine updates and TLS. The limits of each plan are published with its price.",
			},
			{
				title: "One account, several services",
				description:
					"Domains, mailboxes and hosting are designed to be managed together rather than through separate portals.",
			},
			{
				title: "An upgrade path",
				description:
					"When a managed plan is no longer enough, the same account can move to a compute instance with full control.",
			},
		],
		productIds: ["web-hosting", "domain-services", "email-hosting", "security"],
		fit: [
			"Professional sites and small shops",
			"Organisations without dedicated IT staff",
			"Businesses that need mail on their own domain",
		],
		sections: [
			{
				heading: "What is not included",
				body: "No compliance certification, uptime guarantee or backup retention is implied by a hosting plan. Those terms belong to the signed contract and the plan description.",
			},
			{
				heading: "Getting help",
				body: "Support routes are listed on the support page. Sales questions about a managed plan go through the contact form.",
			},
		],
		related: [
			{ label: "Web Hosting", href: "/products/web-hosting" },
			{ label: "Support", href: "/resources/support" },
		],
	},
	{
		slug: "enterprise",
		path: "/solutions/enterprise",
		eyebrow: "For enterprise",
		title: "Dedicated infrastructure, written responsibilities",
		description:
			"Private estates, bare metal, networking and managed operations with a contractual scope.",
		intro:
			"Enterprise engagements start from a responsibility matrix, not a product page. ZenthCloud provides dedicated and partner infrastructure, private networking and optional managed operations; the contract states what is included, what is excluded and what is guaranteed.",
		outcomes: [
			{
				title: "Isolation where it matters",
				description:
					"Private Cloud and Bare Metal provide single-tenant capacity, with network boundaries defined per organisation.",
			},
			{
				title: "Explicit guarantees",
				description:
					"SLAs, response times and certifications are only stated where a signed agreement or independent audit supports them.",
			},
			{
				title: "A named operating model",
				description:
					"Owned and partner infrastructure is labelled as such, including the provider of record for each region.",
			},
		],
		productIds: ["private-cloud", "bare-metal", "networking", "managed-services", "security"],
		fit: [
			"Organisations with isolation or procurement requirements",
			"Teams migrating an existing virtualisation estate",
			"Companies that need a named infrastructure provider",
		],
		sections: [
			{
				heading: "Procurement",
				body: "Enterprise contracts, data-processing terms and security questionnaires are handled by the sales team. Nothing on this website substitutes for those documents.",
			},
			{
				heading: "Compliance language",
				body: "ZenthCloud does not claim a certification on this website. Where a certification exists, it will be listed with its scope, issuing body and validity period.",
			},
		],
		related: [
			{ label: "Contact sales", href: "/contact-sales" },
			{ label: "Pricing for enterprise", href: "/pricing/enterprise" },
		],
	},
	{
		slug: "hosting-providers",
		path: "/solutions/hosting-providers",
		eyebrow: "For hosting providers",
		title: "Capacity and primitives for your own platform",
		description:
			"Bare metal, private networking and block storage for providers building on top of ZenthCloud.",
		intro:
			"Hosting providers need capacity they can subdivide. The catalogue exposes dedicated hardware, private networks and attachable storage without forcing a particular orchestration layer on top.",
		outcomes: [
			{
				title: "Raw capacity",
				description:
					"Bare metal and Private Cloud provide dedicated resources that can be partitioned for your own customers.",
			},
			{
				title: "Network control",
				description:
					"Private networks and public addressing are managed per project, so tenant separation follows your model.",
			},
			{
				title: "Procurement, not self-service",
				description:
					"Capacity is quoted and contracted. This is not a reseller programme with published margins.",
			},
		],
		productIds: ["bare-metal", "private-cloud", "networking", "block-storage"],
		fit: [
			"Regional hosting providers adding capacity",
			"Managed service providers standardising their stack",
			"Platforms that need dedicated nodes",
		],
		sections: [
			{
				heading: "Commercial model",
				body: "Capacity is agreed per contract, including the provider of record and the facility. There is no public wholesale price list.",
			},
			{
				heading: "Branding",
				body: "ZenthCloud does not offer white-label consoles through this website. Any co-branding arrangement is part of the commercial agreement.",
			},
		],
		related: [
			{ label: "Bare Metal", href: "/products/bare-metal" },
			{ label: "Contact sales", href: "/contact-sales" },
		],
	},
	{
		slug: "ai-research",
		path: "/solutions/ai-research",
		eyebrow: "For AI & research",
		title: "Accelerators, storage and repeatable environments",
		description:
			"GPU instances, high-capacity storage and private networking for training, inference and research clusters.",
		intro:
			"AI workloads stress three parts of an estate at once: accelerators, storage throughput and interconnect. ZenthCloud models GPU instances, block storage for datasets and private networking for multi-node jobs. Hardware models are published only once a supplier has confirmed them.",
		outcomes: [
			{
				title: "Whole-GPU allocation",
				description:
					"GPU instances allocate complete accelerator cards by default rather than time-slicing a shared device.",
			},
			{
				title: "Datasets next to compute",
				description:
					"Block volumes and object storage keep datasets and checkpoints in the same region as the accelerator.",
			},
			{
				title: "Reproducible environments",
				description:
					"Custom images and snapshots let a team rebuild the same environment for a new experiment.",
			},
		],
		productIds: ["gpu-instances", "compute-instances", "block-storage", "object-storage"],
		fit: [
			"Research groups running batch training",
			"Inference services with steady accelerator needs",
			"Teams that need dedicated rather than shared GPUs",
		],
		sections: [
			{
				heading: "Hardware transparency",
				body: "GPU models, memory and interconnect are published per contracted supplier. Until that information is confirmed, the GPU page describes the offer structure without naming hardware.",
			},
			{
				heading: "Data handling",
				body: "Dataset location, retention and deletion follow the contract for the region in which the resource runs. No research data is claimed to stay in a specific jurisdiction unless the contract states it.",
			},
		],
		related: [
			{ label: "GPU Instances", href: "/products/public-cloud/gpu" },
			{ label: "Contact sales", href: "/contact-sales" },
		],
	},
];

export const solutionBySlug = new Map(solutions.map((entry) => [entry.slug, entry]));

export const infrastructurePages: DetailPage[] = [
	{
		path: "/infrastructure/global-network",
		eyebrow: "Infrastructure",
		title: "Global network",
		description:
			"How traffic reaches ZenthCloud services, and what is not yet published about the backbone.",
		intro:
			"ZenthCloud combines owned and partner infrastructure. The public network is presented in terms of the services it exposes — public addressing, private networks, load balancing and VPN connectivity — rather than undisclosed capacity figures.",
		sections: [
			{
				heading: "What is published",
				body: "Public IPv4 and IPv6 addressing, private network segmentation, layer 4 and layer 7 load balancing, and site-to-site VPN connectivity are part of the networking catalogue.",
			},
			{
				heading: "What is not published",
				body: "Backbone capacity, peering partners, latency tables and route diversity are not stated on this website. They will be published with their measurement method when available.",
				bullets: [
					"No latency or throughput figures are claimed today.",
					"No peering or transit provider is named without a signed agreement.",
					"Cross-region networking is not presented as available until verified.",
				],
			},
		],
		related: [
			{ label: "Cloud Networking", href: "/products/networking" },
			{ label: "Locations", href: "/infrastructure/locations" },
		],
	},
	{
		path: "/infrastructure/locations",
		eyebrow: "Infrastructure",
		title: "Locations",
		description:
			"Regions are published with their verification state. No facility is listed before it is contractually confirmed.",
		intro:
			"The catalogue currently models a European core region and a partner network. Both carry a pending verification state, which means no address, city or jurisdiction is claimed for them on this website. Product availability is evaluated per region regardless of that state.",
		sections: [
			{
				heading: "European Union — core",
				body: "The intended core region for owned infrastructure. Facility-level details and contractual commitments are being confirmed. No city or data-centre address is published.",
			},
			{
				heading: "Partner network",
				body: "Capacity supplied by external infrastructure partners. The operating provider and country are disclosed before a contract is signed. ZenthCloud does not own or operate these facilities.",
			},
			{
				heading: "How a location becomes verified",
				body: "A region is marked verified when the facility, the operating entity and the applicable data-processing terms are confirmed. Verification is recorded in the catalogue, not in page copy — the locations page renders the state from data.",
			},
		],
		related: [
			{ label: "Data centres", href: "/infrastructure/data-centers" },
			{ label: "Providers & partners", href: "/infrastructure/partners" },
		],
	},
	{
		path: "/infrastructure/data-centers",
		eyebrow: "Infrastructure",
		title: "Data centres",
		description:
			"Owned and partner facilities, with an explicit distinction between the two.",
		intro:
			"ZenthCloud operates a hybrid infrastructure model. Owned facilities are operated directly; partner facilities are supplied by external providers and integrated commercially. The website never presents a partner facility as ZenthCloud-owned.",
		sections: [
			{
				heading: "Owned infrastructure",
				body: "Facilities owned or directly controlled by ZenthCloud. Power, cooling and physical access are managed by ZenthCloud or its contracted operator. Public addresses and certifications are published only after verification.",
			},
			{
				heading: "Partner infrastructure",
				body: "Facilities operated by external providers. The provider of record is disclosed per product and region before purchase. ZenthCloud is the commercial interface, not the facility operator.",
			},
			{
				heading: "Current publication state",
				body: "No individual facility is publicly listed yet. The catalogue records the two provider types without inventing addresses, capacity or redundancy claims. When a facility is verified it will appear here with its operating entity.",
			},
		],
		related: [
			{ label: "Providers & partners", href: "/infrastructure/partners" },
			{ label: "Architecture", href: "/infrastructure/architecture" },
		],
	},
	{
		path: "/infrastructure/partners",
		eyebrow: "Infrastructure",
		title: "Providers & partners",
		description:
			"Who operates the infrastructure behind each product, and how that is disclosed.",
		intro:
			"Every availability entry in the catalogue references a provider. The website resolves that reference at render time, so a product page never hardcodes a supplier and a provider can change without rebuilding the page.",
		sections: [
			{
				heading: "ZenthCloud (owned)",
				body: "Infrastructure operated directly by ZenthCloud and Sky Genesis Enterprise. Products running here are labelled as owned in the availability table.",
			},
			{
				heading: "Partner infrastructure",
				body: "External providers integrated into the catalogue. They are labelled as partners, and the provider of record is named in the contract for the specific product and region.",
			},
			{
				heading: "Changing a provider",
				body: "Because the product model is independent from its supplier, replacing a provider is a data change to availability entries — not a rewrite of product pages.",
			},
		],
		related: [
			{ label: "Become a partner", href: "/company/partners" },
			{ label: "Catalogue", href: "/products" },
		],
	},
	{
		path: "/infrastructure/architecture",
		eyebrow: "Infrastructure",
		title: "Architecture",
		description:
			"The building blocks behind the catalogue: compute, storage, network and the control surface.",
		intro:
			"ZenthCloud exposes infrastructure primitives rather than an opinionated application platform. This page describes how those primitives fit together and where the boundary between ZenthCloud and the customer sits.",
		sections: [
			{
				heading: "Resource model",
				body: "Instances, volumes, networks and managed services are independent resources. A volume outlives an instance; a network can outlive a project's first server. Lifecycle rules are stated per product.",
			},
			{
				heading: "Control surface",
				body: "Resources are managed through the console and the public API. The marketing website consumes only public catalogue data and does not call internal administration APIs.",
			},
			{
				heading: "Failure domains",
				body: "A single instance is not highly available. Replicas, load balancing and multi-node topologies are choices the customer makes; ZenthCloud does not imply automatic redundancy for single resources.",
			},
			{
				heading: "Hybrid by design",
				body: "Owned and partner capacity share the same commercial model but not the same operating entity. The distinction is carried through the data model and displayed wherever availability is shown.",
			},
		],
		related: [
			{ label: "Locations", href: "/infrastructure/locations" },
			{ label: "Managed Kubernetes", href: "/products/public-cloud/kubernetes" },
		],
	},
];

export const infrastructureBySlug = new Map(
	infrastructurePages.map((entry) => [entry.path.split("/").pop() ?? "", entry]),
);

export const resourcePages: DetailPage[] = [
	{
		path: "/resources/documentation",
		eyebrow: "Resources",
		title: "Documentation",
		description:
			"Product guides, installation notes and operational limits, maintained outside the marketing site.",
		intro:
			"Documentation is hosted independently so it can be versioned with the platform. This page is the entry point: it links to the sections that exist and states clearly when a guide is not yet published.",
		sections: [
			{
				heading: "Start here",
				body: "The documentation home covers account setup, the resource model and the shared concepts used across products.",
			},
			{
				heading: "Versioning",
				body: "Guides are versioned with the platform. Marketing pages do not duplicate them, so a change in behaviour is documented once.",
			},
		],
		related: [
			{ label: "Open documentation", href: links.docs.home, external: true },
			{ label: "API reference", href: "/resources/api" },
		],
	},
	{
		path: "/resources/api",
		eyebrow: "Resources",
		title: "API reference",
		description:
			"The public HTTP API for provisioning and managing ZenthCloud resources.",
		intro:
			"The API reference documents endpoints, authentication and error semantics. It is generated from the API definition, so it reflects what exists rather than what is planned.",
		sections: [
			{
				heading: "Authentication",
				body: "API access uses scoped credentials issued by the console. The marketing site never handles credentials and does not implement an authentication system of its own.",
			},
			{
				heading: "Stability",
				body: "Endpoints are versioned. Breaking changes are announced in the release notes before they take effect; a preview endpoint is not presented as stable.",
			},
		],
		related: [
			{ label: "Open the API reference", href: links.docs.api, external: true },
			{ label: "Service status", href: "/resources/status" },
		],
	},
	{
		path: "/resources/tutorials",
		eyebrow: "Resources",
		title: "Tutorials",
		description:
			"End-to-end walkthroughs for the tasks the catalogue supports.",
		intro:
			"Tutorials cover complete tasks — provisioning an instance, attaching a volume, connecting a private network — rather than isolated API calls. Each tutorial states its prerequisites and the product state it assumes.",
		sections: [
			{
				heading: "Format",
				body: "Every walkthrough lists the products used, the region assumptions and the cleanup steps. Where a service is not yet generally available, the tutorial says so at the top.",
			},
			{
				heading: "Contributing",
				body: "Corrections are handled through the support channels. There is no public wiki on the marketing site.",
			},
		],
		related: [
			{ label: "Browse tutorials", href: links.docs.tutorials, external: true },
			{ label: "Documentation", href: "/resources/documentation" },
		],
	},
	{
		path: "/resources/blog",
		eyebrow: "Resources",
		title: "Blog",
		description:
			"Engineering notes, product changes and infrastructure updates.",
		intro:
			"The blog is where product changes and engineering decisions are explained in depth. It is published separately from the marketing site so posts keep stable URLs and can be syndicated.",
		sections: [
			{
				heading: "What we publish",
				body: "Release notes, architecture explanations, incident reviews where appropriate, and product availability changes.",
			},
			{
				heading: "What we do not publish",
				body: "Customer case studies, performance benchmarks and comparisons are only published with a documented method and permission.",
			},
		],
		related: [{ label: "Read the blog", href: links.blog, external: true }],
	},
	{
		path: "/resources/support",
		eyebrow: "Resources",
		title: "Support",
		description:
			"How to get help, and what each support route covers.",
		intro:
			"Support starts with documentation and status. Commercial support is scoped by contract; this page explains the routes without implying a response time that has not been agreed.",
		sections: [
			{
				heading: "Self-service first",
				body: "Documentation, the API reference and the status page answer most operational questions and are available without an account.",
			},
			{
				heading: "Account and commercial questions",
				body: "Use the contact form for account, billing and sales questions. Include the product and region so the request can be routed.",
			},
			{
				heading: "Security reports",
				body: "Vulnerability reports are handled through the documented disclosure process. Do not open a public issue for a suspected vulnerability.",
			},
		],
		related: [
			{ label: "Documentation", href: "/resources/documentation" },
			{ label: "Contact", href: "/company/contact" },
			{ label: "Support portal", href: links.docs.support, external: true },
		],
	},
	{
		path: "/resources/status",
		eyebrow: "Resources",
		title: "Service status",
		description:
			"Live operational state of ZenthCloud services, published independently of this website.",
		intro:
			"The status page is the authoritative source for incidents and maintenance. This marketing page does not cache or restate operational state, because a stale status is worse than none.",
		sections: [
			{
				heading: "What the status page covers",
				body: "Incidents, planned maintenance and the current state of each published service. Historical incident reports remain available after resolution.",
			},
			{
				heading: "What it does not cover",
				body: "Individual resources inside your account. Resource-level health is visible in the console.",
			},
		],
		related: [
			{ label: "Open status page", href: links.status, external: true },
			{ label: "Support", href: "/resources/support" },
		],
	},
];

export const resourceBySlug = new Map(
	resourcePages.map((entry) => [entry.path.split("/").pop() ?? "", entry]),
);

export const companyPages: DetailPage[] = [
	{
		path: "/company/about",
		eyebrow: "Company",
		title: "About ZenthCloud",
		description:
			"A hybrid cloud provider built by Sky Genesis Enterprise, with European roots and global ambitions.",
		intro:
			"ZenthCloud is the cloud infrastructure brand of Sky Genesis Enterprise. The ambition is a unified provider: owned and partner infrastructure behind one catalogue, one commercial model and one operational standard.",
		sections: [
			{
				heading: "What we are building",
				body: "A catalogue that covers compute, storage, networking, platform services, web hosting and security without presenting them as unrelated products. Availability is published per product and region, and partner-operated capacity is labelled as such.",
			},
			{
				heading: "European roots",
				body: "ZenthCloud is developed by Sky Genesis Enterprise, a European organisation. This is a statement about the team and the company, not a claim that every facility or supplier is located in Europe.",
			},
			{
				heading: "What we do not claim",
				body: "This website does not claim certifications, uptime percentages, data residency guarantees or customer outcomes that are not supported by a signed contract or independent audit.",
			},
		],
		related: [
			{ label: "Infrastructure", href: "/infrastructure" },
			{ label: "Contact", href: "/company/contact" },
		],
	},
	{
		path: "/company/careers",
		eyebrow: "Company",
		title: "Careers",
		description:
			"Open roles at ZenthCloud and Sky Genesis Enterprise.",
		intro:
			"We publish a role only when it is open and funded. There is no general application pipeline and no unpaid trial project.",
		sections: [
			{
				heading: "Current openings",
				body: "No public openings are listed at this time. Infrastructure, platform engineering and developer relations roles are announced on the company newsroom and professional networks when they open.",
			},
			{
				heading: "How to apply",
				body: "When a role is listed, the announcement includes the location model, the interview stages and the contact address. Speculative applications are not reviewed.",
			},
		],
		related: [{ label: "Newsroom", href: "/company/newsroom" }],
	},
	{
		path: "/company/partners",
		eyebrow: "Company",
		title: "Partners",
		description:
			"Infrastructure suppliers, registrars and technology partners behind the catalogue.",
		intro:
			"ZenthCloud works with infrastructure suppliers and service partners. The website distinguishes partner-delivered capacity from owned infrastructure and names the provider of record in commercial documents.",
		sections: [
			{
				heading: "Infrastructure partners",
				body: "Capacity can be supplied by external providers and integrated into the ZenthCloud catalogue. Partner facilities are never presented as ZenthCloud-owned.",
			},
			{
				heading: "Service partners",
				body: "Domain registration is delivered through an accredited registrar. The registrar of record is disclosed before payment.",
			},
			{
				heading: "Becoming a partner",
				body: "Partnership enquiries go through the contact form with a short description of the capacity or service offered. There is no published partner programme or revenue-share schedule.",
			},
		],
		related: [
			{ label: "Providers & partners", href: "/infrastructure/partners" },
			{ label: "Contact", href: "/company/contact" },
		],
	},
	{
		path: "/company/contact",
		eyebrow: "Company",
		title: "Contact",
		description:
			"Sales, support, partnership and security contact routes.",
		intro:
			"Choose the route that matches your request so it reaches the right team. Commercial enquiries use the sales form; existing customers use the console for account matters.",
		sections: [
			{
				heading: "Sales and new accounts",
				body: "Use the contact sales form. Include the products, expected capacity and the region you are targeting. A reply does not constitute a commercial offer.",
			},
			{
				heading: "Technical support",
				body: "Start with the documentation and the public status page. Contracted customers should use the support channel named in their agreement.",
			},
			{
				heading: "Security",
				body: "Report suspected vulnerabilities through the documented disclosure process. Never include exploit details in a public channel.",
			},
			{
				heading: "Postal and company details",
				body: "The registered entity is Sky Genesis Enterprise. Legal and postal details are provided with contracts and invoices.",
			},
		],
		related: [
			{ label: "Contact sales", href: "/contact-sales" },
			{ label: "Support", href: "/resources/support" },
		],
	},
	{
		path: "/company/newsroom",
		eyebrow: "Company",
		title: "Newsroom",
		description:
			"Announcements about products, availability and the company.",
		intro:
			"Product and company announcements are published here and in the blog. Availability changes are recorded in the catalogue at the same time as the announcement.",
		sections: [
			{
				heading: "Announcement policy",
				body: "A service is only announced as available when it can be ordered in at least one region. Planned services are announced as coming soon without a guaranteed date.",
			},
			{
				heading: "Press enquiries",
				body: "Press requests go through the contact form with the outlet and deadline. We do not provide quotes on claims that are not documented.",
			},
		],
		related: [
			{ label: "Blog", href: "/resources/blog" },
			{ label: "Contact", href: "/company/contact" },
		],
	},
];

export const companyBySlug = new Map(
	companyPages.map((entry) => [entry.path.split("/").pop() ?? "", entry]),
);
