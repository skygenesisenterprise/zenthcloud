import { CatalogueSchema, type Catalogue, type Product } from "./schema";

/**
 * The validated commercial catalogue.
 *
 * Honesty rules enforced here and in `schema.ts`:
 * - No price is published until it has been approved (`status: "draft"`,
 *   `amountMinor: null`).
 * - Regions that have not been contractually verified cannot be marked
 *   commercially available.
 * - Products never reference a specific infrastructure supplier in their
 *   copy; supplier data only lives in availability entries.
 *
 * The dataset is intentionally small and explicit. It is designed to be
 * replaced by a public catalogue API later without changing the page
 * templates: see `queries.ts` for the access layer.
 */

const EU = "eu-core";
const GLOBAL = "global-partner";
const OWN = "zenthcloud";
const PARTNER = "partner-network";

type AvailabilityInput = {
	regionId: string;
	providerId: string;
	deployment: Product["availability"][number]["deployment"];
	commercialStatus: Product["availability"][number]["commercialStatus"];
	operationalStatus: Product["availability"][number]["operationalStatus"];
	note: string;
};

function availabilityFor(
	productId: string,
	entries: AvailabilityInput[],
): Product["availability"] {
	return entries.map((entry) => ({ productId, ...entry }));
}

const euEntry = (
	commercialStatus: AvailabilityInput["commercialStatus"],
	note: string,
	deployment: AvailabilityInput["deployment"] = "shared",
): AvailabilityInput => ({
	regionId: EU,
	providerId: OWN,
	deployment,
	commercialStatus,
	operationalStatus: "unknown",
	note,
});

const partnerEntry = (
	commercialStatus: AvailabilityInput["commercialStatus"],
	note: string,
	deployment: AvailabilityInput["deployment"] = "managed",
): AvailabilityInput => ({
	regionId: GLOBAL,
	providerId: PARTNER,
	deployment,
	commercialStatus,
	operationalStatus: "unknown",
	note,
});

const catalogueData = {
	providers: [
		{
			id: OWN,
			name: "ZenthCloud",
			type: "own" as const,
			website: "https://zenthcloud.com",
			description:
				"Infrastructure operated directly by ZenthCloud and Sky Genesis Enterprise. Capacity, locations and commercial terms are published per product once verified.",
			regions: [EU],
		},
		{
			id: PARTNER,
			name: "European partner infrastructure",
			type: "partner" as const,
			website: null,
			description:
				"External infrastructure suppliers integrated into the ZenthCloud catalogue. ZenthCloud does not own or operate partner data centres; the supplying provider is disclosed per product and region.",
			regions: [GLOBAL],
		},
	],
	regions: [
		{
			id: EU,
			name: "European Union — core",
			country: "Multiple EU member states",
			location: "Europe",
			verification: "pending" as const,
			notes:
				"Facility-level locations and contractual commitments are being confirmed. Nothing on this page should be read as a published data-centre address.",
		},
		{
			id: GLOBAL,
			name: "Partner network",
			country: "Multiple",
			location: "Worldwide",
			verification: "pending" as const,
			notes:
				"Capacity supplied by external infrastructure partners. The operating provider and country are disclosed before any contract is signed.",
		},
	],
	products: [
		{
			id: "compute-instances",
			route: "/products/public-cloud/compute",
			name: "Compute Instances",
			family: "compute" as const,
			tagline: "Scalable virtual machines with predictable resources",
			summary:
				"Virtual machines with dedicated vCPU and memory allocations, attached block storage and private networking.",
			description:
				"Compute Instances are the general-purpose virtual machines of ZenthCloud Public Cloud. Each instance receives a fixed share of vCPU and memory, can attach block volumes, join a private network and be rebuilt from a snapshot. Instances are designed for web services, APIs, build agents, staging environments and background workers.",
			benefits: [
				"Fixed resource allocations instead of shared, throttled CPU",
				"Rebuild or resize without re-installing the operating system",
				"Private networking and floating public IPs across instances",
			],
			features: [
				"Linux distributions and custom images",
				"Snapshots and image-based rebuilds",
				"Vertical scaling with a restart",
				"Cloud-init provisioning",
				"Private network attachment",
				"Hourly and monthly billing models",
			],
			specs: [
				{
					title: "Instance resources",
					rows: [
						{ label: "vCPU", value: "Shared or dedicated, selectable per plan" },
						{ label: "Memory", value: "Allocated in fixed ratios to vCPU" },
						{ label: "Local disk", value: "None — storage is attached separately" },
						{ label: "Network", value: "Public IPv4/IPv6 and private network" },
					],
				},
				{
					title: "Lifecycle",
					rows: [
						{ label: "Provisioning", value: "Image + cloud-init" },
						{ label: "Snapshots", value: "Consistent disk snapshots" },
						{ label: "Resize", value: "Restart required for vCPU/memory changes" },
						{ label: "Deletion", value: "Volumes retained unless explicitly removed" },
					],
				},
			],
			availability: availabilityFor("compute-instances", [
				euEntry("coming_soon", "Commercial opening and capacity per plan not yet published."),
				partnerEntry("partner_service", "Delivered through a partner provider; country disclosed at order."),
			]),
			related: ["block-storage", "networking", "kubernetes"],
			docsPath: "/resources/documentation",
			seo: {
				title: "Compute Instances — ZenthCloud Public Cloud",
				description:
					"General-purpose virtual machines with fixed vCPU and memory, attached block storage, snapshots and private networking.",
			},
		},
		{
			id: "gpu-instances",
			route: "/products/public-cloud/gpu",
			name: "GPU Instances",
			family: "compute" as const,
			tagline: "Accelerated computing for training and inference",
			summary:
				"Virtual machines with passthrough GPUs for model training, inference, rendering and scientific workloads.",
			description:
				"GPU Instances provide dedicated accelerator cards attached to a virtual machine. They are intended for workloads that need predictable access to a GPU rather than a shared scheduling queue. Availability, card models and supported drivers are published only once a supplier has confirmed them, so the current page describes the offer structure without naming hardware that has not been contracted.",
			benefits: [
				"Whole-GPU allocation with no time-slicing by default",
				"Standard images with CUDA-compatible drivers",
				"Attach block storage sized for datasets and checkpoints",
			],
			features: [
				"Passthrough GPU allocation",
				"Custom images and container-based workflows",
				"Private networking for multi-node jobs",
				"Snapshots for environment reproducibility",
			],
			specs: [
				{
					title: "Accelerator",
					rows: [
						{ label: "GPU model", value: "Published per contracted supplier" },
						{ label: "Allocation", value: "One or more whole GPUs per instance" },
						{ label: "Virtualisation", value: "Passthrough" },
					],
				},
				{
					title: "Workload fit",
					rows: [
						{ label: "Training", value: "Single or multi-node with private networking" },
						{ label: "Inference", value: "Long-running services or batch jobs" },
						{ label: "Storage", value: "Block volumes for datasets and checkpoints" },
					],
				},
			],
			availability: availabilityFor("gpu-instances", [
				euEntry("coming_soon", "GPU models and capacity are not yet published.", "dedicated"),
				partnerEntry("partner_service", "Partner-operated accelerators; model and country confirmed at order.", "dedicated"),
			]),
			related: ["compute-instances", "block-storage", "kubernetes"],
			docsPath: "/resources/documentation",
			seo: {
				title: "GPU Instances — ZenthCloud",
				description:
					"Dedicated GPU virtual machines for training, inference and rendering. Hardware and capacity are published only once contracted.",
			},
		},
		{
			id: "bare-metal",
			route: "/products/bare-metal",
			name: "Bare Metal Servers",
			family: "compute" as const,
			tagline: "Dedicated hardware without a hypervisor",
			summary:
				"Single-tenant physical servers for workloads that need full hardware control.",
			description:
				"Bare Metal Servers are dedicated physical machines. There is no hypervisor between the operating system and the hardware, so you control the kernel, the network stack and the firmware update policy. ZenthCloud provides the machine, the network port and remote management; the operating system and everything above it remain yours.",
			benefits: [
				"No noisy neighbours and no hypervisor overhead",
				"Full control of kernel, drivers and networking",
				"Predictable monthly capacity for steady workloads",
			],
			features: [
				"Remote hands and reinstallation",
				"IPv4 and IPv6 addressing",
				"Private network interconnection",
				"Hardware replacement under contract",
			],
			specs: [
				{
					title: "Hardware",
					rows: [
						{ label: "CPU", value: "Single- or dual-socket configurations" },
						{ label: "Memory", value: "Configured per server" },
						{ label: "Storage", value: "NVMe or SSD, RAID options per chassis" },
						{ label: "Network", value: "Redundant uplinks where contracted" },
					],
				},
				{
					title: "Operations",
					rows: [
						{ label: "Access", value: "SSH and out-of-band console" },
						{ label: "Reinstallation", value: "Automated or on request" },
						{ label: "Contract", value: "Monthly commitment, custom terms" },
					],
				},
			],
			availability: availabilityFor("bare-metal", [
				euEntry("contact_sales", "Hardware catalogue and facility are confirmed with sales.", "dedicated"),
				partnerEntry("partner_service", "Partner-operated hardware; the operator is named in the quote.", "dedicated"),
			]),
			related: ["private-cloud", "networking", "backup"],
			docsPath: null,
			seo: {
				title: "Bare Metal Servers — ZenthCloud",
				description:
					"Dedicated single-tenant servers with full hardware control, remote management and optional private networking.",
			},
		},
		{
			id: "private-cloud",
			route: "/products/private-cloud",
			name: "Private Cloud",
			family: "compute" as const,
			tagline: "A dedicated virtualisation estate",
			summary:
				"Reserved compute, storage and networking for organisations that need isolation.",
			description:
				"A Private Cloud reserves a pool of compute and storage for one organisation. It is intended for workloads that cannot share a multi-tenant platform, or that need their own network boundaries and quota model. The estate can be operated by ZenthCloud or handed to your team with ZenthCloud support.",
			benefits: [
				"Reserved capacity rather than shared tenancy",
				"Organisation-specific network and quota boundaries",
				"Migration path from individual instances",
			],
			features: [
				"Reserved compute pool",
				"Dedicated storage pool",
				"Private network segmentation",
				"Optional managed operations",
			],
			specs: [
				{
					title: "Estate",
					rows: [
						{ label: "Compute", value: "Reserved vCPU and memory pool" },
						{ label: "Storage", value: "Dedicated block pool" },
						{ label: "Network", value: "Isolated private network" },
						{ label: "Quotas", value: "Per-project limits" },
					],
				},
				{
					title: "Responsibility",
					rows: [
						{ label: "Platform operations", value: "ZenthCloud or your team" },
						{ label: "Guest systems", value: "Always the customer" },
						{ label: "Contract", value: "Custom, capacity-based" },
					],
				},
			],
			availability: availabilityFor("private-cloud", [
				euEntry("contact_sales", "Capacity and isolation requirements are reviewed with sales.", "dedicated"),
				partnerEntry("partner_service", "Partner capacity; the operator is disclosed in the contract.", "dedicated"),
			]),
			related: ["bare-metal", "networking", "managed-services"],
			docsPath: null,
			seo: {
				title: "Private Cloud — ZenthCloud",
				description:
					"Reserved compute, storage and networking for organisations that need isolation and their own quota model.",
			},
		},
		{
			id: "object-storage",
			route: "/products/public-cloud/object-storage",
			name: "Object Storage",
			family: "storage" as const,
			tagline: "Durable object storage over an HTTP API",
			summary:
				"Bucket-based storage for backups, media and application assets.",
			description:
				"Object Storage stores immutable objects in buckets and exposes them through an HTTP API. S3 compatibility is not advertised until an interoperable endpoint has been verified and published, so this page describes the product model rather than claiming a specific API contract.",
			benefits: [
				"Buckets with per-object metadata and lifecycle rules",
				"Access keys scoped per bucket or project",
				"Separate from block storage, sized for unstructured data",
			],
			features: [
				"Bucket policies and access keys",
				"Lifecycle and retention rules",
				"Server-side encryption",
				"Usage-based billing",
			],
			specs: [
				{
					title: "Storage model",
					rows: [
						{ label: "Unit", value: "Bucket and object" },
						{ label: "API", value: "HTTP API; S3 compatibility is not yet published" },
						{ label: "Metadata", value: "Per-object, user-defined" },
						{ label: "Durability", value: "Publication pending contractual verification" },
					],
				},
				{
					title: "Access",
					rows: [
						{ label: "Authentication", value: "Scoped access keys" },
						{ label: "Encryption", value: "Server-side, at rest" },
						{ label: "Lifecycle", value: "Retention and transition rules" },
					],
				},
			],
			availability: availabilityFor("object-storage", [
				euEntry("coming_soon", "Endpoint and S3 compatibility are not yet published."),
				partnerEntry("partner_service", "Delivered through a partner; API contract is confirmed at order."),
			]),
			related: ["backup", "block-storage", "security"],
			docsPath: "/resources/api",
			seo: {
				title: "Object Storage — ZenthCloud",
				description:
					"Bucket-based object storage for backups, media and application assets, with scoped access keys and lifecycle rules.",
			},
		},
		{
			id: "block-storage",
			route: "/products/public-cloud/block-storage",
			name: "Block Storage",
			family: "storage" as const,
			tagline: "Attachable volumes for instances",
			summary:
				"Network-attached volumes that can be detached, snapshotted and reattached.",
			description:
				"Block Storage provides volumes that behave like local disks but persist independently of an instance. A volume can be detached from one instance and attached to another, and snapshotted before risky operations. Volumes are the right choice for databases, application state and anything that needs a filesystem.",
			benefits: [
				"Independent lifecycle from the compute instance",
				"Snapshots before upgrades or migrations",
				"Move a volume between instances in the same region",
			],
			features: [
				"Attach and detach while stopped",
				"Snapshot and restore",
				"Per-volume encryption",
				"Size in GiB, billed monthly",
			],
			specs: [
				{
					title: "Volume",
					rows: [
						{ label: "Type", value: "Network-attached block device" },
						{ label: "Attachment", value: "One instance at a time" },
						{ label: "Encryption", value: "At rest" },
						{ label: "Snapshots", value: "Per volume" },
					],
				},
				{
					title: "Limits",
					rows: [
						{ label: "Region scope", value: "Attach only within the same region" },
						{ label: "Resize", value: "Grow only; shrinking is not supported" },
					],
				},
			],
			availability: availabilityFor("block-storage", [
				euEntry("coming_soon", "Volume classes and performance tiers are not yet published."),
				partnerEntry("contact_sales", "Partner capacity is quoted per project."),
			]),
			related: ["compute-instances", "backup", "object-storage"],
			docsPath: "/resources/documentation",
			seo: {
				title: "Block Storage — ZenthCloud",
				description:
					"Network-attached volumes with snapshots and encryption, independent from the lifecycle of a compute instance.",
			},
		},
		{
			id: "backup",
			route: "/products/public-cloud/backup",
			name: "Backup & Snapshots",
			family: "storage" as const,
			tagline: "Recoverable copies of volumes and databases",
			summary:
				"Scheduled backups and on-demand snapshots with defined retention.",
			description:
				"Backup & Snapshots covers two related mechanisms: instance and volume snapshots for fast rollback, and scheduled backups with longer retention for recovery. Retention is a contractual setting, not a promise: the page states the mechanism and the configuration surface, and the exact retention offered per plan is published with pricing.",
			benefits: [
				"Separate rollback (snapshots) and recovery (backups) paths",
				"Retention configured per policy",
				"Restore into a new volume or instance",
			],
			features: [
				"On-demand snapshots",
				"Scheduled backup policies",
				"Restore to a new resource",
				"Retention configuration",
			],
			specs: [
				{
					title: "Mechanisms",
					rows: [
						{ label: "Snapshot", value: "Point-in-time copy of a volume" },
						{ label: "Backup", value: "Scheduled copy with retention" },
						{ label: "Restore", value: "New volume or instance" },
					],
				},
				{
					title: "Policy",
					rows: [
						{ label: "Schedule", value: "Configurable per resource" },
						{ label: "Retention", value: "Published per plan" },
						{ label: "Encryption", value: "Inherited from the source volume" },
					],
				},
			],
			availability: availabilityFor("backup", [
				euEntry("coming_soon", "Retention periods and included capacity are not yet published."),
				partnerEntry("partner_service", "Partner-operated backup target; retention confirmed at order."),
			]),
			related: ["block-storage", "object-storage", "security"],
			docsPath: "/resources/documentation",
			seo: {
				title: "Backup & Snapshots — ZenthCloud",
				description:
					"Snapshots for rollback and scheduled backups with configurable retention, restorable into new volumes or instances.",
			},
		},
		{
			id: "networking",
			route: "/products/networking",
			name: "Cloud Networking",
			family: "networking" as const,
			tagline: "Private networks, public IPs and load balancing",
			summary:
				"Network primitives that connect instances, containers and on-premise systems.",
			description:
				"Cloud Networking groups the network services available across the catalogue: private networks, public IP addresses, load balancers and VPN connectivity. Bandwidth allowances and interconnection options are published per product and region once contracted, rather than stated globally.",
			benefits: [
				"Private networks isolated per project",
				"Floating public IPs that move between instances",
				"Load balancing for HTTP and TCP services",
			],
			features: [
				"Private network segmentation",
				"Public IPv4 and IPv6",
				"Layer 4 and layer 7 load balancing",
				"Site-to-site VPN connectivity",
			],
			specs: [
				{
					title: "Network services",
					rows: [
						{ label: "Private network", value: "Per-project isolated subnet" },
						{ label: "Public addressing", value: "IPv4 and IPv6" },
						{ label: "Load balancing", value: "HTTP(S) and TCP" },
						{ label: "Connectivity", value: "Site-to-site VPN" },
					],
				},
				{
					title: "Limits",
					rows: [
						{ label: "Bandwidth", value: "Published per product and region" },
						{ label: "Cross-region", value: "Not presented as available until verified" },
					],
				},
			],
			availability: availabilityFor("networking", [
				euEntry("coming_soon", "Bandwidth allowances and cross-region options are not yet published."),
				partnerEntry("partner_service", "Partner network capacity; routes and bandwidth are quoted."),
			]),
			related: ["compute-instances", "security", "private-cloud"],
			docsPath: "/resources/documentation",
			seo: {
				title: "Cloud Networking — ZenthCloud",
				description:
					"Private networks, public IPv4/IPv6, load balancing and VPN connectivity for cloud and dedicated resources.",
			},
		},
		{
			id: "databases",
			route: "/products/public-cloud/databases",
			name: "Managed Databases",
			family: "platform" as const,
			tagline: "PostgreSQL, MySQL, MariaDB and Redis",
			summary:
				"Provisioned database engines with backups, updates and connection management.",
			description:
				"Managed Databases provisions a database engine, its storage and its backup policy, and keeps the engine patched. It removes day-two work such as version upgrades and backup verification, but it does not make an application highly available by itself: replica topology and failover behaviour are stated per plan, not assumed.",
			benefits: [
				"Provisioning without operating the host",
				"Automated backups with restore",
				"Engine version upgrades handled for you",
			],
			features: [
				"PostgreSQL, MySQL, MariaDB and Redis",
				"Automated backups",
				"Private network-only access",
				"Connection pooling options",
			],
			specs: [
				{
					title: "Engines",
					rows: [
						{ label: "Relational", value: "PostgreSQL, MySQL, MariaDB" },
						{ label: "Key-value", value: "Redis" },
						{ label: "Access", value: "Private network by default" },
					],
				},
				{
					title: "Operations",
					rows: [
						{ label: "Backups", value: "Automated, restore to a new instance" },
						{ label: "Upgrades", value: "Minor versions managed" },
						{ label: "Topology", value: "Stated per plan; no implicit HA" },
					],
				},
			],
			availability: availabilityFor("databases", [
				euEntry("coming_soon", "Engine versions and plan topology are not yet published."),
				partnerEntry("partner_service", "Partner-operated databases; the operator is named in the quote."),
			]),
			related: ["compute-instances", "backup", "kubernetes"],
			docsPath: "/resources/documentation",
			seo: {
				title: "Managed Databases — ZenthCloud",
				description:
					"Provisioned PostgreSQL, MySQL, MariaDB and Redis with automated backups, patching and private network access.",
			},
		},
		{
			id: "kubernetes",
			route: "/products/public-cloud/kubernetes",
			name: "Managed Kubernetes",
			family: "platform" as const,
			tagline: "A managed control plane for containers",
			summary:
				"Kubernetes clusters with a managed control plane and your worker nodes.",
			description:
				"Managed Kubernetes operates the cluster control plane and leaves worker capacity under your control. It suits teams already standardised on Kubernetes that do not want to run etcd or the API server. The page describes the responsibility split; version support, SLA and autoscaling behaviour are published only once verified.",
			benefits: [
				"Managed control plane with upgrades",
				"Worker pools sized independently",
				"Integration with private networking and load balancers",
			],
			features: [
				"Managed API server and etcd",
				"Worker node pools",
				"kubectl and API access",
				"Load balancer integration",
			],
			specs: [
				{
					title: "Cluster",
					rows: [
						{ label: "Control plane", value: "Managed by ZenthCloud" },
						{ label: "Workers", value: "Customer-selected pools" },
						{ label: "Access", value: "kubectl and Kubernetes API" },
					],
				},
				{
					title: "Responsibility",
					rows: [
						{ label: "Control plane upgrades", value: "Managed" },
						{ label: "Workload configuration", value: "Customer" },
						{ label: "SLA", value: "Not published from this page" },
					],
				},
			],
			availability: availabilityFor("kubernetes", [
				euEntry("coming_soon", "Supported versions and SLA are not yet published."),
				partnerEntry("partner_service", "Partner-operated clusters; operator and versions confirmed at order."),
			]),
			related: ["compute-instances", "networking", "managed-services"],
			docsPath: "/resources/documentation",
			seo: {
				title: "Managed Kubernetes — ZenthCloud",
				description:
					"Kubernetes with a managed control plane and customer-controlled worker pools, integrated with private networking.",
			},
		},
		{
			id: "managed-services",
			route: "/products/managed-services",
			name: "Managed Services",
			family: "platform" as const,
			tagline: "Operations delegated under a defined scope",
			summary:
				"Infrastructure operations, patching and monitoring delivered as a service.",
			description:
				"Managed Services transfers a defined set of operational tasks to ZenthCloud: patching, monitoring, backup verification and incident response within an agreed scope. The scope is contractual and written down before the service starts; this page does not claim coverage or response times that are not in a signed agreement.",
			benefits: [
				"Written responsibility matrix before onboarding",
				"Patching and backup verification handled",
				"Escalation path to the infrastructure team",
			],
			features: [
				"Operating system patching",
				"Monitoring and alert triage",
				"Backup verification",
				"Incident escalation",
			],
			specs: [
				{
					title: "Scope",
					rows: [
						{ label: "Included", value: "Defined per contract" },
						{ label: "Excluded", value: "Application code and customer data" },
						{ label: "Reporting", value: "Monthly operations report" },
					],
				},
				{
					title: "Contract",
					rows: [
						{ label: "Response times", value: "Only as agreed in writing" },
						{ label: "Coverage", value: "Business hours by default" },
					],
				},
			],
			availability: availabilityFor("managed-services", [
				euEntry("contact_sales", "Scope and response times are agreed per contract.", "managed"),
				partnerEntry("partner_service", "Partner delivery; the operating provider is disclosed.", "managed"),
			]),
			related: ["private-cloud", "kubernetes", "security"],
			docsPath: null,
			seo: {
				title: "Managed Services — ZenthCloud",
				description:
					"Infrastructure operations with a written responsibility matrix: patching, monitoring, backup verification and escalation.",
			},
		},
		{
			id: "web-hosting",
			route: "/products/web-hosting",
			name: "Web Hosting",
			family: "web" as const,
			tagline: "Managed hosting for sites and applications",
			summary:
				"Managed runtime, TLS and updates for websites and small applications.",
			description:
				"Web Hosting provides a managed runtime for websites and small applications, including TLS certificates and routine updates. It is designed for users who want a working site without administering a server. Resource limits per plan, supported runtimes and migration options are published with pricing.",
			benefits: [
				"No server administration",
				"TLS certificates managed for you",
				"Upgrade path to compute instances",
			],
			features: [
				"Managed runtime",
				"Automatic TLS",
				"Daily backups",
				"Upgrade path to Public Cloud",
			],
			specs: [
				{
					title: "Runtime",
					rows: [
						{ label: "Web server", value: "Managed" },
						{ label: "TLS", value: "Automatically issued and renewed" },
						{ label: "Runtimes", value: "Published per plan" },
					],
				},
				{
					title: "Limits",
					rows: [
						{ label: "Storage", value: "Per plan" },
						{ label: "Traffic", value: "Per plan" },
						{ label: "Backups", value: "Scheduled; retention per plan" },
					],
				},
			],
			availability: availabilityFor("web-hosting", [
				euEntry("coming_soon", "Plan limits and supported runtimes are not yet published."),
				partnerEntry("partner_service", "Partner-operated hosting; provider is named at order."),
			]),
			related: ["domain-services", "email-hosting", "compute-instances"],
			docsPath: "/resources/tutorials",
			seo: {
				title: "Web Hosting — ZenthCloud",
				description:
					"Managed web hosting with automatic TLS, routine updates and a clear upgrade path to cloud compute.",
			},
		},
		{
			id: "domain-services",
			route: "/products/domain-services",
			name: "Domain Services",
			family: "web" as const,
			tagline: "Registration and DNS management",
			summary:
				"Domain registration and authoritative DNS for the services you host.",
			description:
				"Domain Services covers registration and authoritative DNS. Registration is delivered with an accredited registrar partner, and the registrar of record is visible in the contract. DNS zones support common record types and can point at ZenthCloud resources or external targets.",
			benefits: [
				"Registration and DNS in the same account",
				"Registrar of record disclosed in the contract",
				"DNS records for external targets as well",
			],
			features: [
				"Domain registration",
				"Authoritative DNS zones",
				"Common record types",
				"DNS pointing to external services",
			],
			specs: [
				{
					title: "Registration",
					rows: [
						{ label: "Registrar", value: "Accredited partner; named in the contract" },
						{ label: "Extensions", value: "Published per partner" },
						{ label: "Renewal", value: "Manual or automatic" },
					],
				},
				{
					title: "DNS",
					rows: [
						{ label: "Records", value: "A, AAAA, CNAME, MX, TXT, NS, SRV" },
						{ label: "Targets", value: "ZenthCloud or external" },
					],
				},
			],
			availability: availabilityFor("domain-services", [
				partnerEntry("partner_service", "Registration is delivered by an accredited registrar partner.", "managed"),
				{
					regionId: EU,
					providerId: PARTNER,
					deployment: "managed",
					commercialStatus: "partner_service",
					operationalStatus: "unknown",
					note: "Same registrar partner; the legal entity is disclosed before payment.",
				},
			]),
			related: ["web-hosting", "email-hosting", "security"],
			docsPath: "/resources/documentation",
			seo: {
				title: "Domain Services — ZenthCloud",
				description:
					"Domain registration through an accredited partner and authoritative DNS for ZenthCloud or external targets.",
			},
		},
		{
			id: "email-hosting",
			route: "/products/email-hosting",
			name: "Email Hosting",
			family: "web" as const,
			tagline: "Mailboxes on your own domain",
			summary:
				"Mailboxes, aliases and spam filtering for a custom domain.",
			description:
				"Email Hosting provides mailboxes and aliases on a domain you control, with spam filtering and standard SMTP/IMAP access. Deliverability depends on correct SPF, DKIM and DMARC records, which the service helps you publish but cannot guarantee on its own.",
			benefits: [
				"Mailboxes and aliases on your domain",
				"Standard IMAP and SMTP access",
				"Guided SPF, DKIM and DMARC setup",
			],
			features: [
				"Mailboxes and aliases",
				"Spam filtering",
				"IMAP/SMTP",
				"DNS authentication records",
			],
			specs: [
				{
					title: "Mail",
					rows: [
						{ label: "Mailboxes", value: "Per plan" },
						{ label: "Protocols", value: "IMAP, SMTP" },
						{ label: "Filtering", value: "Spam and malware scanning" },
					],
				},
				{
					title: "Domain",
					rows: [
						{ label: "Authentication", value: "SPF, DKIM, DMARC guidance" },
						{ label: "Deliverability", value: "Depends on your DNS and sending reputation" },
					],
				},
			],
			availability: availabilityFor("email-hosting", [
				euEntry("coming_soon", "Mailbox sizes and retention are not yet published."),
				partnerEntry("partner_service", "Partner-operated mail platform; provider named in the contract."),
			]),
			related: ["domain-services", "web-hosting", "security"],
			docsPath: "/resources/tutorials",
			seo: {
				title: "Email Hosting — ZenthCloud",
				description:
					"Mailboxes and aliases on your own domain with spam filtering, IMAP/SMTP access and DNS authentication guidance.",
			},
		},
		{
			id: "security",
			route: "/products/security",
			name: "Security & Reliability",
			family: "security" as const,
			tagline: "Protection, certificates and monitoring",
			summary:
				"DDoS protection, firewall, TLS and monitoring across the platform.",
			description:
				"Security & Reliability groups the protective services available with ZenthCloud infrastructure: DDoS mitigation, a cloud firewall, web application protection, TLS certificates and monitoring. Each service states its own scope. No certification or protection guarantee is claimed here unless it is independently documented.",
			benefits: [
				"Network-level DDoS mitigation",
				"Firewall rules managed per project",
				"TLS certificates and expiry monitoring",
			],
			features: [
				"DDoS protection",
				"Cloud firewall",
				"Web application protection",
				"TLS certificates",
				"Monitoring and alerting",
			],
			specs: [
				{
					title: "Protection",
					rows: [
						{ label: "DDoS", value: "Network-level mitigation" },
						{ label: "Firewall", value: "Per-project rule sets" },
						{ label: "WAF", value: "HTTP(S) filtering" },
					],
				},
				{
					title: "Assurance",
					rows: [
						{ label: "Certifications", value: "None claimed until independently verified" },
						{ label: "SLA", value: "Only where a contract states it" },
						{ label: "Monitoring", value: "Metrics, checks and alert routing" },
					],
				},
			],
			availability: availabilityFor("security", [
				euEntry("coming_soon", "Included protections per product are not yet published."),
				partnerEntry("contact_sales", "Partner-delivered protection is quoted per project."),
			]),
			related: ["networking", "backup", "managed-services"],
			docsPath: "/resources/documentation",
			seo: {
				title: "Security & Reliability — ZenthCloud",
				description:
					"DDoS mitigation, cloud firewall, web application protection, TLS certificates and monitoring for ZenthCloud resources.",
			},
		},
	],
	plans: [
		{
			id: "compute-standard-hourly",
			productId: "compute-instances",
			name: "Standard instance",
			billingModel: "hourly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "hour" as const,
			unitLabel: "per instance",
			conditions: ["Price not published", "Billing stops when the instance is deleted"],
			status: "draft" as const,
		},
		{
			id: "compute-dedicated-monthly",
			productId: "compute-instances",
			name: "Dedicated vCPU instance",
			billingModel: "monthly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "month" as const,
			unitLabel: "per instance",
			conditions: ["Price not published", "Monthly commitment"],
			status: "draft" as const,
		},
		{
			id: "gpu-hourly",
			productId: "gpu-instances",
			name: "GPU instance",
			billingModel: "hourly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "hour" as const,
			unitLabel: "per GPU",
			conditions: ["Price not published", "Hardware model confirmed at order"],
			status: "draft" as const,
		},
		{
			id: "bare-metal-monthly",
			productId: "bare-metal",
			name: "Dedicated server",
			billingModel: "monthly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "month" as const,
			unitLabel: "per server",
			conditions: ["Price not published", "Configuration quoted individually"],
			status: "draft" as const,
		},
		{
			id: "private-cloud-custom",
			productId: "private-cloud",
			name: "Private estate",
			billingModel: "custom" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "custom" as const,
			unitLabel: "per contract",
			conditions: ["Custom pricing", "Capacity-based contract"],
			status: "draft" as const,
		},
		{
			id: "object-storage-usage",
			productId: "object-storage",
			name: "Object storage",
			billingModel: "usage" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "gb_month" as const,
			unitLabel: "per GB-month",
			conditions: ["Price not published", "Requests billed separately once published"],
			status: "draft" as const,
		},
		{
			id: "block-storage-monthly",
			productId: "block-storage",
			name: "Block volume",
			billingModel: "monthly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "gb_month" as const,
			unitLabel: "per GB-month",
			conditions: ["Price not published", "Billed while the volume exists"],
			status: "draft" as const,
		},
		{
			id: "backup-usage",
			productId: "backup",
			name: "Backup storage",
			billingModel: "usage" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "gb_month" as const,
			unitLabel: "per GB-month",
			conditions: ["Price not published", "Retention defined per policy"],
			status: "draft" as const,
		},
		{
			id: "networking-usage",
			productId: "networking",
			name: "Network services",
			billingModel: "usage" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "custom" as const,
			unitLabel: "per resource",
			conditions: ["Price not published", "Public IPs and load balancers billed separately"],
			status: "draft" as const,
		},
		{
			id: "databases-hourly",
			productId: "databases",
			name: "Managed database",
			billingModel: "hourly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "hour" as const,
			unitLabel: "per instance",
			conditions: ["Price not published", "Storage billed separately"],
			status: "draft" as const,
		},
		{
			id: "kubernetes-cluster-monthly",
			productId: "kubernetes",
			name: "Cluster control plane",
			billingModel: "monthly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "month" as const,
			unitLabel: "per cluster",
			conditions: ["Price not published", "Worker nodes billed separately"],
			status: "draft" as const,
		},
		{
			id: "managed-services-custom",
			productId: "managed-services",
			name: "Managed operations",
			billingModel: "custom" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "custom" as const,
			unitLabel: "per contract",
			conditions: ["Custom pricing", "Scope agreed in writing"],
			status: "draft" as const,
		},
		{
			id: "web-hosting-monthly",
			productId: "web-hosting",
			name: "Hosting plan",
			billingModel: "monthly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "month" as const,
			unitLabel: "per site",
			conditions: ["Price not published", "Resource limits per plan"],
			status: "draft" as const,
		},
		{
			id: "domain-services-custom",
			productId: "domain-services",
			name: "Registration and DNS",
			billingModel: "custom" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "custom" as const,
			unitLabel: "per domain",
			conditions: ["Registrar fees apply", "Price depends on the extension"],
			status: "draft" as const,
		},
		{
			id: "email-hosting-monthly",
			productId: "email-hosting",
			name: "Mailbox plan",
			billingModel: "monthly" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "month" as const,
			unitLabel: "per mailbox",
			conditions: ["Price not published", "Mailbox quota per plan"],
			status: "draft" as const,
		},
		{
			id: "security-custom",
			productId: "security",
			name: "Protection bundle",
			billingModel: "custom" as const,
			currency: "EUR" as const,
			amountMinor: null,
			billingInterval: "custom" as const,
			unitLabel: "per contract",
			conditions: ["Scope and price quoted individually"],
			status: "draft" as const,
		},
	],
};

export const catalogue: Catalogue = CatalogueSchema.parse(catalogueData);
