/**
 * Single source of truth for public destinations, navigation and footer.
 *
 * Rules:
 * - Internal links are paths; external destinations are marked `external`.
 * - No route is listed before it exists.
 * - Console/authentication lives on a separate service, never reimplemented here.
 * - Product navigation is derived from the commercial catalogue and its six
 *   approved families, never from another provider's product names.
 */


export const links = {
	docs: {
		home: 'https://docs.zenthcloud.com',
		api: 'https://docs.zenthcloud.com/api',
		tutorials: 'https://docs.zenthcloud.com/tutorials',
		support: 'https://docs.zenthcloud.com/support',
	},
	status: 'https://status.zenthcloud.com',
	console: 'https://dash.zenthcloud.com',
	blog: 'https://blog.zenthcloud.com',
	github: 'https://github.com/skygenesisenterprise/zenthcloud',
	trust: '/company/trust',
	skyGenesis: 'https://skygenesisenterprise.com/',
	l0ck7: 'https://lk7cloud.com/',
} as const

export type NavLink = {
	href: string
	label: string
	description?: string
	external?: boolean
}

export type NavColumn = {
	title: string
	/** Family or section overview destination, when one exists. */
	href?: string
	links: NavLink[]
}

export type NavGroup = {
	title: string
	href?: string
	columns: NavColumn[]
}

/**
 * One column per approved family. The services listed here are the curated
 * `featured` entries in the catalogue; the complete list lives on the family
 * overview page, not in the menu.
 */
const productColumns: NavColumn[] = [
	{
		title: 'Network & Edge',
		href: '/products/network-edge',
		links: [
			{ href: '/products/domain-services', label: 'DNS', description: 'Authoritative zones and records' },
			{ href: '/products/network-edge', label: 'CDN', description: 'Content distribution and caching' },
			{ href: '/products/network-edge', label: 'Load Balancing', description: 'Traffic distribution across services' },
			{ href: '/products/networking', label: 'IP & Networking', description: 'Private networks and connectivity' },
			{ href: '/products/networking', label: 'VPN & Tunnels', description: 'Site-to-site connectivity' },
			{ href: '/products/network-edge', label: 'Edge Services', description: 'Edge-distributed processing' },
		],
	},
	{
		title: 'Compute & Infrastructure',
		href: '/products/compute-infrastructure',
		links: [
			{ href: '/products/public-cloud/compute', label: 'Cloud Instances', description: 'Configurable virtual machines' },
			{ href: '/products/compute-infrastructure', label: 'VPS', description: 'Fixed-size virtual servers' },
			{ href: '/products/bare-metal', label: 'Bare Metal', description: 'Dedicated physical servers' },
			{ href: '/products/public-cloud/gpu', label: 'GPU Computing', description: 'Accelerated compute for AI' },
			{ href: '/products/private-cloud', label: 'Private Cloud', description: 'Reserved, isolated capacity' },
			{ href: '/products/compute-infrastructure', label: 'Dedicated Infrastructure', description: 'Single-tenant infrastructure' },
		],
	},
	{
		title: 'Storage & Databases',
		href: '/products/storage-databases',
		links: [
			{ href: '/products/public-cloud/object-storage', label: 'Object Storage', description: 'Buckets over an HTTP API' },
			{ href: '/products/public-cloud/block-storage', label: 'Block Storage', description: 'Attachable volumes for instances' },
			{ href: '/products/storage-databases', label: 'File Storage', description: 'Shared filesystems for workloads' },
			{ href: '/products/public-cloud/databases', label: 'Managed Databases', description: 'PostgreSQL, MySQL, MariaDB, Redis' },
			{ href: '/products/public-cloud/backup', label: 'Backup & Recovery', description: 'Scheduled backups and restore' },
			{ href: '/products/public-cloud/backup', label: 'Snapshots', description: 'Point-in-time volume copies' },
		],
	},
	{
		title: 'Developer Platform',
		href: '/products/developer-platform',
		links: [
			{ href: '/products/developer-platform', label: 'Application Platform', description: 'Deploy and operate applications' },
			{ href: '/products/compute-infrastructure', label: 'Containers', description: 'Container execution environments' },
			{ href: '/products/public-cloud/kubernetes', label: 'Kubernetes', description: 'Managed control plane' },
			{ href: '/products/developer-platform', label: 'CI/CD', description: 'Build and release pipelines' },
			{ href: '/products/developer-platform', label: 'Workflows', description: 'Multi-step process automation' },
			{ href: links.docs.api, label: 'Developer API', description: 'Programmatic access to resources', external: true },
		],
	},
	{
		title: 'Security & Identity',
		href: '/products/security-identity',
		links: [
			{ href: '/products/network-edge', label: 'DDoS Protection', description: 'Mitigation for network attacks' },
			{ href: '/products/network-edge', label: 'Web Application Firewall', description: 'HTTP(S) request filtering' },
			{ href: '/products/security-identity', label: 'Zero Trust', description: 'Policy-based access to resources' },
			{ href: '/products/security-identity', label: 'Identity & Access', description: 'Users, roles and permissions' },
			{ href: '/products/network-edge', label: 'SSL / TLS', description: 'Certificate lifecycle management' },
			{ href: '/products/security-identity', label: 'Secrets Management', description: 'Store and distribute credentials' },
		],
	},
	{
		title: 'Cloud Management',
		href: '/products/cloud-management',
		links: [
			{ href: '/products/console', label: 'Cloud Console', description: 'Manage resources and projects', external: true },
			{ href: '/products/cloud-management', label: 'Monitoring', description: 'Resource state and alerts' },
			{ href: '/products/developer-platform', label: 'Observability', description: 'Metrics, logs and traces' },
			{ href: '/products/cloud-management', label: 'Resource Management', description: 'Inventory and lifecycle visibility' },
			{ href: '/products/cloud-management', label: 'Cost Management', description: 'Billing and usage visibility' },
			{ href: '/products/cloud-management', label: 'Automation', description: 'Provisioning and orchestration' },
		],
	},
];

const productsMoreColumn: NavColumn = {
	title: 'More',
	links: [
		{
			href: '/products',
			label: 'Explore all products',
			description: 'The complete catalogue, grouped by family',
		},
		{
			href: '/pricing',
			label: 'View pricing',
			description: 'Billing models and publication state',
		},
		{
			href: '/contact-sales',
			label: 'Contact sales',
			description: 'Scoped capacity and commercial terms',
		},
	],
};

export const mainNav: NavGroup[] = [
	{
		title: 'Products',
		href: '/products',
		columns: [...productColumns, productsMoreColumn],
	},
	{
		title: 'Solutions',
		href: '/solutions',
		columns: [
			{
				title: 'AI and security',
				links: [
					{
						href: '/solutions/ai-research',
						label: 'AI and research',
						description: 'Accelerators, storage and repeatable environments',
					},
					{
						href: '/products/security-identity',
						label: 'Security & Identity',
						description: 'Protect applications, identities and access paths',
					},
					{
						href: '/products/network-edge',
						label: 'Network protection',
						description: 'Web application and DDoS protection in the catalogue',
					},
				],
			},
			{
				title: 'Network and delivery',
				links: [
					{
						href: '/products/network-edge',
						label: 'Network & Edge',
						description: 'DNS, private networking and entry-point services',
					},
					{
						href: '/products/web-hosting',
						label: 'Web hosting',
						description: 'Managed runtime for sites and small applications',
					},
				],
			},
			{
				title: 'Platform and automation',
				links: [
					{
						href: '/products/managed-services',
						label: 'Managed operations',
						description: 'Operations delegated under a written scope',
					},
					{
						href: '/products/public-cloud/kubernetes',
						label: 'Kubernetes',
						description: 'A managed control plane for containers',
					},
				],
			},
		],
	},
	{
		title: 'Developers',
		href: '/developers',
		columns: [
			{
				title: 'Documentation',
				links: [
					{ href: '/developers/getting-started', label: 'Getting Started', description: 'Begin your journey with ZenthCloud' },
					{ href: links.docs.home, label: 'Product Guides', description: 'Comprehensive product documentation', external: true },
					{ href: '/developers/documentation', label: 'Architecture Guides', description: 'Best practices and patterns' },
					{ href: links.docs.tutorials, label: 'Tutorials', description: 'Step-by-step walkthroughs', external: true },
				],
			},
			{
				title: 'Build with ZenthCloud',
				links: [
					{ href: links.docs.api, label: 'API Reference', description: 'Complete API documentation', external: true },
					{ href: '/developers/sdks', label: 'SDKs', description: 'Language-specific libraries' },
					{ href: '/developers/cli', label: 'CLI', description: 'Command-line interface' },
					{ href: '/developers/integrations', label: 'Integrations', description: 'Third-party service integrations' },
					{ href: '/developers/tools', label: 'Infrastructure as Code', description: 'Terraform and automation tools' },
				],
			},
			{
				title: 'Developer Tools',
				links: [
					{ href: links.docs.api, label: 'API Explorer', description: 'Interactive API testing', external: true },
					{ href: links.github, label: 'Code Examples', description: 'Sample code and repositories', external: true },
					{ href: '/developers/tools', label: 'Webhooks', description: 'Event-driven notifications' },
					{ href: links.console, label: 'Developer Console', description: 'Manage your resources', external: true },
					{ href: '/developers/tools', label: 'Local Development', description: 'Development environment setup' },
				],
			},
			{
				title: 'Community',
				links: [
					{ href: links.github, label: 'GitHub', description: 'Source code and contributions', external: true },
					{ href: links.github, label: 'Community Discussions', description: 'Ask questions and share knowledge', external: true },
					{ href: '/company/about', label: 'Open Source', description: 'Our open source initiatives' },
					{ href: '/developers/changelog', label: 'Changelog', description: 'Latest updates and releases' },
					{ href: links.github + '/issues', label: 'Report an Issue', description: 'Submit bugs and feature requests', external: true },
				],
			},
		],
	},
	{
		title: 'Resources',
		href: '/resources',
		columns: [
			{
				title: '',
				links: [
					{
						href: '/resources/blog',
						label: 'Blog',
						description: 'News, product updates, and announcements',
					},
					{
						href: links.github,
						label: 'Community',
						description: 'Connect with other developers and experts',
						external: true,
					},
					{
						href: '/resources',
						label: 'zenthcloud Radar',
						description: 'Internet traffic and security trends',
					},
				],
			},
			{
				title: '',
				links: [
					{
						href: links.docs.home,
						label: 'Developer Docs',
						description: 'Guides, references, and tutorials',
						external: true,
					},
					{
						href: links.docs.api,
						label: 'API Reference',
						description: 'zenthcloud API documentation',
						external: true,
					},
					{
						href: '/resources',
						label: 'Case Studies',
						description: 'Customer success stories and results',
					},
				],
			},
			{
				title: '',
				links: [
					{
						href: links.docs.tutorials,
						label: 'Learning Center',
						description: 'Learn about web technology concepts',
						external: true,
					},
					{
						href: '/infrastructure/architecture',
						label: 'Reference Architectures',
						description: 'Architecture patterns and best practices',
					},
					{
						href: '/company/newsroom',
						label: 'Press',
						description: 'Latest news, media resources, and coverage',
					},
				],
			},
		],
	},
	{
		title: 'Company',
		href: '/company',
		columns: [
			{
				title: 'About ZenthCloud',
				links: [
					{ href: '/company/about', label: 'About Us', description: 'Who we are and what we do' },
					{ href: '/company/mission', label: 'Our Mission', description: 'Our purpose and values' },
					{ href: '/company/about', label: 'Our Vision', description: 'Where we are headed' },
					{ href: '/company/sky-genesis-enterprise', label: 'Sky Genesis Enterprise', description: 'Our parent organization' },
				],
			},
			{
				title: 'Infrastructure',
				links: [
					{ href: '/company/infrastructure', label: 'Infrastructure Overview', description: 'Our hybrid infrastructure model' },
					{ href: '/company/infrastructure/architecture', label: 'Architecture', description: 'Technical building blocks' },
					{ href: '/company/infrastructure/global-network', label: 'Global Network', description: 'Connectivity model' },
					{ href: '/company/infrastructure/regions', label: 'Data Centers & Regions', description: 'Facility locations' },
					{ href: '/company/infrastructure/partners', label: 'Infrastructure Partners', description: 'Our capacity providers' },
				],
			},
			{
				title: 'Trust & Responsibility',
				links: [
					{ href: '/company/trust', label: 'Trust Hub', description: 'Our commitments and principles' },
					{ href: '/company/security', label: 'Security', description: 'Our security practices' },
					{ href: '/company/privacy', label: 'Privacy', description: 'Data protection policies' },
					{ href: '/company/compliance', label: 'Compliance', description: 'Regulatory compliance information' },
					{ href: '/company/about', label: 'Sustainability', description: 'Environmental initiatives' },
				],
			},
			{
				title: 'Work with us',
				links: [
					{ href: '/company/partners', label: 'Partners', description: 'Partner with ZenthCloud' },
					{ href: '/company/careers', label: 'Careers', description: 'Join our team' },
					{ href: '/company/newsroom', label: 'Newsroom', description: 'Latest news and announcements' },
					{ href: '/company/contact', label: 'Contact', description: 'Get in touch' },
				],
			},
		],
	},
	{
		title: 'Pricing',
		href: '/pricing',
		columns: [],
	},
];

export const utilityNav: NavLink[] = [
	{ href: links.docs.home, label: 'Docs', external: true },
	{ href: links.status, label: 'Status', external: true },
	{ href: '/resources/support', label: 'Support' },
]

export const emergencyCta = {
	label: "Under attack?",
	href: "/products/network-edge",
	external: false,
} as const;

export const cta = {
	primary: { href: '/contact-sales', label: 'Get started' },
	secondary: { href: '/contact-sales', label: 'Contact sales' },
	signIn: { href: links.console, label: 'Dashboard', external: true },
	// The console is a separate identity surface; never implemented here.
	console: { href: links.console, label: 'Go to console', external: true },
} as const

export const footerSections: { title: string; links: NavLink[] }[] = [
	{
		title: 'Getting started',
		links: [
			{ href: '/pricing', label: 'Plans' },
			{ href: '/contact-sales', label: 'Contact sales' },
			{ href: '/company/partners', label: 'Partners' },
			{ href: '/company/partners', label: 'Find a partner' },
			{ href: '/solutions/startups', label: 'Startups' },
			{ href: '/products/security-identity', label: 'Under attack?' },
			{ href: '/products/domain-services', label: 'Domain name search' },
		],
	},
	{
		title: 'Public Interest',
		links: [
			{ href: '/solutions/ai-research', label: 'Project Galileo' },
			{ href: '/solutions/small-business', label: 'Athenian Project' },
			{ href: '/solutions/enterprise', label: 'zenthcloud for Campaigns' },
			{ href: '/solutions/startups', label: 'Project Fairshot' },
			{ href: '/company/about', label: 'Impact' },
		],
	},
	{
		title: 'Resources',
		links: [
			{ href: '/resources/blog', label: 'App Innovation report' },
			{ href: '/resources', label: 'zenthcloud Radar' },
			{ href: '/resources', label: 'Case studies' },
			{ href: links.status, label: 'Status', external: true },
			{ href: '/resources/support', label: 'Support' },
			{ href: '/resources', label: 'Events' },
			{ href: '/resources/blog', label: 'Blog' },
		],
	},
	{
		title: 'Solutions',
		links: [
			{ href: '/products/security-identity', label: 'Security and identity' },
			{ href: '/products/public-cloud/gpu', label: 'GPU and AI infrastructure' },
			{ href: '/products/network-edge', label: 'Web application protection' },
			{ href: '/products/web-hosting', label: 'Managed web hosting' },
			{ href: '/products/public-cloud/kubernetes', label: 'Multi-tenant platform development' },
			{ href: '/products/storage-databases', label: 'Storage and databases' },
		],
	},
	{
		title: 'Company',
		links: [
			{ href: '/company/about', label: 'About' },
			{ href: '/company/careers', label: 'Careers' },
			{ href: '/company/about', label: 'Investors' },
			{ href: '/company/newsroom', label: 'Press' },
			{ href: '/company/newsroom', label: 'Press kit' },
			{ href: '/company/infrastructure', label: 'Infrastructure' },
			{ href: '/company/trust', label: 'Trust & Compliance' },
		],
	},
	{
		title: 'Compliance',
		links: [
			{ href: '/legal/privacy', label: 'Compliance resources' },
			{ href: '/company/trust', label: 'Trust Hub' },
			{ href: '/legal/privacy', label: 'Data Protection' },
			{ href: '/legal/acceptable-use', label: 'Responsible AI' },
			{ href: '/legal/terms', label: 'Transparency report' },
			{ href: '/resources/support', label: 'Report abuse' },
		],
	},
	{
		title: 'Developers',
		links: [
			{ href: '/developers', label: 'Developers Hub' },
			{ href: links.docs.home, label: 'Documentation', external: true },
			{ href: links.github, label: 'Community', external: true },
			{ href: '/developers/changelog', label: 'Changelog' },
		],
	},
];

export const organisation = {
	name: 'ZenthCloud',
	legalName: 'Sky Genesis Enterprise',
	positioning: 'European Integrated Cloud Infrastructure',
	supporting: 'European roots. Global ambitions.',
	description:
		'ZenthCloud is a European integrated cloud infrastructure provider building compute, storage, networking, developer and security services on owned and partner infrastructure.',
} as const
