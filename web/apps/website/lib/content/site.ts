/**
 * Single source of truth for public destinations, navigation and footer.
 *
 * Rules:
 * - Internal links are paths; external destinations are marked `external`.
 * - No route is listed before it exists.
 * - Console/authentication lives on a separate service, never reimplemented here.
 * - Navigation is built from the commercial catalogue, not from another
 *   provider's product names.
 */

export const links = {
	docs: {
		home: 'https://docs.zenthcloud.com',
		api: 'https://docs.zenthcloud.com/api',
		tutorials: 'https://docs.zenthcloud.com/tutorials',
		support: 'https://docs.zenthcloud.com/support',
	},
	status: 'https://status.zenthcloud.com',
	console: 'https://app.zenthcloud.com',
	blog: 'https://blog.zenthcloud.com',
	github: 'https://github.com/skygenesisenterprise/zenthcloud',
	trust: '/company/about',
} as const

export type NavLink = {
	href: string
	label: string
	description?: string
	external?: boolean
}

export type NavColumn = {
	title: string
	links: NavLink[]
}

export type NavGroup = {
	title: string
	href?: string
	columns: NavColumn[]
	featured?: {
		title: string
		description: string
		href: string
		label: string
	}
}

export const mainNav: NavGroup[] = [
	{
		title: 'Products',
		href: '/products',
		columns: [
			{
				title: 'Compute',
				links: [
					{ href: '/products/public-cloud/compute', label: 'Browser Run', description: 'Automated browsers' },
					{ href: '/products/public-cloud/kubernetes', label: 'Containers', description: 'Any language, anywhere' },
					{ href: '/products/public-cloud/compute', label: 'Durable Objects', description: 'Stateful compute' },
					{ href: '/products/public-cloud/compute', label: 'Sandboxes', description: 'Secure code execution' },
					{ href: '/products/public-cloud/compute', label: 'Workers', description: 'Global serverless functions' },
					{ href: '/products/public-cloud/kubernetes', label: 'Workers for Platforms', description: 'Programmable Platform Solutions' },
					{ href: '/products/managed-services', label: 'Workflows', description: 'Process orchestration' },
				],
			},
			{
				title: 'Storage',
				links: [
					{ href: '/products/public-cloud/object-storage', label: 'Artifacts', description: 'Git-native versioned storage' },
					{ href: '/products/public-cloud/databases', label: 'D1', description: 'Serverless SQL' },
					{ href: '/products/public-cloud/databases', label: 'Basin', description: 'Ingest, catalog & query data' },
					{ href: '/products/public-cloud/databases', label: 'Hyperdrive', description: 'Global databases' },
					{ href: '/products/public-cloud/databases', label: 'K2', description: 'Publish and subscribe to durable, ordered event streams' },
					{ href: '/products/managed-services', label: 'Queues', description: 'Message processing' },
					{ href: '/products/public-cloud/object-storage', label: 'R2', description: 'Egress-free storage' },
					{ href: '/products/public-cloud/object-storage', label: 'KV', description: 'Ultra-fast key-value storage' },
				],
			},
			{
				title: 'AI',
				links: [
					{ href: '/products/public-cloud/gpu', label: 'Agents', description: 'Build stateful AI agents' },
					{ href: '/products/public-cloud/gpu', label: 'AI Gateway', description: 'AI observability' },
					{ href: '/products/public-cloud/gpu', label: 'AI Search', description: 'Instant retrieval' },
					{ href: '/products/public-cloud/databases', label: 'Vectorize', description: 'Vector database' },
					{ href: '/products/public-cloud/gpu', label: 'Workers AI', description: 'Edge AI models' },
				],
			},
			{
				title: 'SASE / Zero Trust',
				links: [
					{ href: '/products/security', label: 'SASE', description: 'Cloudflare SASE platform' },
					{ href: '/products/security', label: 'Access', description: 'Zero trust access to private resources' },
					{ href: '/products/security', label: 'CASB', description: 'SaaS and cloud posture' },
					{ href: '/products/security', label: 'Data Loss Prevention', description: 'Protect sensitive data' },
					{ href: '/products/security', label: 'Gateway', description: 'Web filtering' },
					{ href: '/products/security', label: 'Browser Isolation', description: 'Secure web browsing' },
					{ href: '/products/networking', label: 'WAN', description: 'Cloud-delivered networking' },
					{ href: '/products/email-hosting', label: 'Email Security', description: 'Phishing protection' },
				],
			},
			{
				title: 'Security',
				links: [
					{ href: '/products/security', label: 'DDoS Protection', description: 'Mitigation Solutions' },
					{ href: '/products/security', label: 'Rate Limiting', description: 'Abuse prevention' },
					{ href: '/products/security', label: 'SSL', description: 'Secure Your Site with SSL' },
					{ href: '/products/security', label: 'Turnstile', description: 'A CAPTCHA Replacement Solution' },
					{ href: '/products/security', label: 'WAF', description: 'Web Application Firewall' },
					{ href: '/products/networking', label: 'Magic Transit', description: 'DDoS Protection for Networks' },
					{ href: '/products/security', label: 'Client-Side Security', description: 'Prevent browser supply chain attacks' },
					{ href: '/products/security', label: 'Bot Management', description: 'Block bad bots' },
				],
			},
			{
				title: 'Network & Content Delivery',
				links: [
					{ href: '/products/networking', label: 'CDN', description: 'Faster delivery & caching' },
					{ href: '/products/domain-services', label: 'DNS', description: 'Fast DNS' },
					{ href: '/products/networking', label: 'Load Balancing', description: 'Zero downtime' },
					{ href: '/products/networking', label: 'TURN / SFU', description: 'Real-time infra' },
				],
			},
			{
				title: 'Analytics',
				links: [
					{ href: '/products/managed-services', label: 'Web Performance & Security', description: 'Observability and reporting' },
				],
			},
			{
				title: 'More',
				links: [
					{ href: '/products', label: 'Enterprise', description: 'The complete catalogue' },
					{ href: '/infrastructure/global-network', label: 'Global Network', description: 'The connectivity model' },
					{ href: '/products/domain-services', label: 'Domain Registration', description: 'Registration and authoritative DNS' },
					{ href: '/products/domain-services', label: '1.1.1.1', description: 'Recursive DNS resolver' },
				],
			},
		],
		featured: {
			title: 'The complete catalogue',
			description:
				'Every product states its commercial state and regional availability before you talk to sales.',
			href: '/products',
			label: 'See all products',
		},
	},
	{
		title: 'Solutions',
		href: '/solutions',
		columns: [
			{
				title: 'By team',
				links: [
					{ href: '/solutions/developers', label: 'Developers' },
					{ href: '/solutions/startups', label: 'Startups' },
					{ href: '/solutions/small-business', label: 'Small business' },
					{ href: '/solutions/enterprise', label: 'Enterprise' },
					{ href: '/solutions/hosting-providers', label: 'Hosting providers' },
					{ href: '/solutions/ai-research', label: 'AI & research' },
				],
			},
			{
				title: 'By infrastructure',
				links: [
					{ href: '/infrastructure', label: 'Infrastructure model' },
					{ href: '/infrastructure/architecture', label: 'Architecture' },
					{ href: '/infrastructure/global-network', label: 'Global network' },
					{ href: '/infrastructure/partners', label: 'Infrastructure partners' },
					{ href: '/infrastructure/data-centers', label: 'Facilities' },
					{ href: '/infrastructure/locations', label: 'Locations' },
				],
			},
		],
	},
	{
		title: 'Resources',
		href: '/resources',
		columns: [
			{
				title: 'Technical',
				links: [
					{
						href: links.docs.home,
						label: 'Documentation',
						description: 'Guides and operational limits',
						external: true,
					},
					{
						href: links.docs.api,
						label: 'API reference',
						description: 'Authentication, resources and errors',
						external: true,
					},
					{
						href: links.docs.tutorials,
						label: 'Tutorials',
						description: 'Step-by-step deployment guides',
						external: true,
					},
					{ href: '/resources/blog', label: 'Blog' },
				],
			},
			{
				title: 'Operations',
				links: [
					{ href: '/resources/support', label: 'Support routes' },
					{ href: '/resources/status', label: 'Service status' },
					{ href: '/infrastructure', label: 'Infrastructure' },
					{ href: '/pricing', label: 'Pricing' },
				],
			},
			{
				title: 'Project',
				links: [
					{
						href: links.github,
						label: 'GitHub',
						description: 'Source, issues and releases',
						external: true,
					},
					{
						href: links.console,
						label: 'Console',
						description: 'Sign in to manage resources',
						external: true,
					},
					{
						href: links.status,
						label: 'Service status',
						description: 'Incidents and maintenance',
						external: true,
					},
				],
			},
		],
	},
	{
		title: 'Pricing',
		href: '/pricing',
		columns: [],
	},
]

export const utilityNav: NavLink[] = [
	{ href: links.docs.home, label: 'Docs', external: true },
	{ href: links.status, label: 'Status', external: true },
	{ href: '/resources/support', label: 'Support' },
]

export const cta = {
	primary: { href: '/contact-sales', label: 'Get started' },
	secondary: { href: '/contact-sales', label: 'Contact sales' },
	signIn: { href: links.console, label: 'Dashboard', external: true },
	// The console is a separate identity surface; never implemented here.
	console: { href: links.console, label: 'Go to console', external: true },
} as const

export const footerSections: { title: string; links: NavLink[] }[] = [
	{
		title: 'Products',
		links: [
			{ href: '/products', label: 'All products' },
			{ href: '/products/public-cloud', label: 'Public Cloud' },
			{ href: '/products/private-cloud', label: 'Private Cloud' },
			{ href: '/products/bare-metal', label: 'Bare Metal' },
			{ href: '/products/public-cloud/kubernetes', label: 'Kubernetes' },
			{ href: '/products/managed-services', label: 'Managed services' },
			{ href: '/products/networking', label: 'Networking' },
			{ href: '/products/security', label: 'Security' },
			{ href: '/products/web-hosting', label: 'Web hosting' },
			{ href: '/products/domain-services', label: 'Domains' },
		],
	},
	{
		title: 'Solutions',
		links: [
			{ href: '/solutions/developers', label: 'Developers' },
			{ href: '/solutions/startups', label: 'Startups' },
			{ href: '/solutions/small-business', label: 'Small business' },
			{ href: '/solutions/enterprise', label: 'Enterprise' },
			{ href: '/solutions/hosting-providers', label: 'Hosting providers' },
			{ href: '/solutions/ai-research', label: 'AI & research' },
		],
	},
	{
		title: 'Developers',
		links: [
			{ href: links.docs.home, label: 'Documentation', external: true },
			{ href: links.docs.api, label: 'API reference', external: true },
			{ href: '/resources/tutorials', label: 'Tutorials' },
			{ href: links.github, label: 'GitHub', external: true },
			{ href: links.console, label: 'Console', external: true },
			{ href: links.status, label: 'Service status', external: true },
		],
	},
	{
		title: 'Resources',
		links: [
			{ href: '/resources', label: 'Resource hub' },
			{ href: '/resources/blog', label: 'Blog' },
			{ href: '/resources/support', label: 'Support' },
			{ href: '/infrastructure', label: 'Infrastructure' },
			{ href: '/infrastructure/locations', label: 'Locations' },
			{ href: '/pricing', label: 'Pricing' },
		],
	},
	{
		title: 'Company',
		links: [
			{ href: '/company/about', label: 'About' },
			{ href: '/company/careers', label: 'Careers' },
			{ href: '/company/partners', label: 'Partners' },
			{ href: '/company/newsroom', label: 'Newsroom' },
			{ href: '/company/contact', label: 'Contact' },
			{ href: '/contact-sales', label: 'Contact sales' },
		],
	},
	{
		title: 'Legal',
		links: [
			{ href: '/legal/terms', label: 'Terms of service' },
			{ href: '/legal/privacy', label: 'Privacy policy' },
			{ href: '/legal/cookies', label: 'Cookie policy' },
			{ href: '/legal/acceptable-use', label: 'Acceptable use' },
		],
	},
]

export const organisation = {
	name: 'ZenthCloud',
	legalName: 'Sky Genesis Enterprise',
	positioning: 'Cloud infrastructure. Without boundaries.',
	supporting: 'European roots. Global ambitions.',
	description:
		'ZenthCloud is a hybrid cloud provider building compute, storage, networking and managed services on owned and partner infrastructure.',
} as const
