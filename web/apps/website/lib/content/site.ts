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
	console: 'https://dash.zenthcloud.com',
	blog: 'https://blog.zenthcloud.com',
	github: 'https://github.com/skygenesisenterprise/zenthcloud',
	trust: '/company/about',
	skyGenesis: 'https://skygenesisenterprise.com/',
	l0ck7: 'https://l0ck7.com/',
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
				title: 'AI and security',
				links: [
					{
						href: '/solutions/ai-research',
						label: 'AI',
						description: 'Build intelligent applications with AI at the edge',
					},
					{
						href: '/products/security',
						label: 'AI Security',
						description:
							'Secure and control AI adoption without slowing innovation.',
					},
					{
						href: '/products/security',
						label: 'Security',
						description: 'Protect your applications from threats',
					},
				],
			},
			{
				title: 'Network and delivery',
				links: [
					{
						href: '/products/networking',
						label: 'Network',
						description: 'Global network services for performance and reliability',
					},
					{
						href: '/products/web-hosting',
						label: 'Frontends',
						description: 'Deploy frontend applications globally in seconds',
					},
				],
			},
			{
				title: 'Platform and automation',
				links: [
					{
						href: '/products/managed-services',
						label: 'Workflows',
						description: 'Orchestrate complex multi-step processes',
					},
					{
						href: '/products/public-cloud/kubernetes',
						label: 'Platforms',
						description: "Build platforms on Cloudflare's infrastructure",
					},
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
						label: 'Cloudflare Radar',
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
						description: 'Cloudflare API documentation',
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
		title: 'Getting started',
		links: [
			{ href: '/pricing', label: 'Plans' },
			{ href: '/contact-sales', label: 'Contact sales' },
			{ href: '/company/partners', label: 'Partners' },
			{ href: '/company/partners', label: 'Find a partner' },
			{ href: '/solutions/startups', label: 'Startups' },
			{ href: '/products/security', label: 'Under attack?' },
			{ href: '/products/domain-services', label: 'Domain name search' },
		],
	},
	{
		title: 'Public Interest',
		links: [
			{ href: '/solutions/ai-research', label: 'Project Galileo' },
			{ href: '/solutions/small-business', label: 'Athenian Project' },
			{ href: '/solutions/enterprise', label: 'Cloudflare for Campaigns' },
			{ href: '/solutions/startups', label: 'Project Fairshot' },
			{ href: '/company/about', label: 'Impact' },
		],
	},
	{
		title: 'Resources',
		links: [
			{ href: '/resources/blog', label: 'App Innovation report' },
			{ href: '/resources', label: 'Cloudflare Radar' },
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
			{ href: '/products/security', label: 'SSE and SASE platform' },
			{ href: '/products/public-cloud/gpu', label: 'Cloudflare AI Cloud' },
			{ href: '/products/security', label: 'AI Security' },
			{ href: '/products/web-hosting', label: 'Frontend Development Platform' },
			{ href: '/products/public-cloud/kubernetes', label: 'Multi-Tenant Platform Development' },
			{ href: '/products/security', label: 'Web Security Platform' },
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
			{ href: '/infrastructure/global-network', label: 'Global network' },
		],
	},
	{
		title: 'Compliance',
		links: [
			{ href: '/legal/privacy', label: 'Compliance resources' },
			{ href: '/company/about', label: 'Trust Hub' },
			{ href: '/legal/privacy', label: 'Data Protection' },
			{ href: '/legal/acceptable-use', label: 'Responsible AI' },
			{ href: '/legal/terms', label: 'Transparency report' },
			{ href: '/resources/support', label: 'Report abuse' },
		],
	},
	{
		title: 'Developers',
		links: [
			{ href: links.docs.home, label: 'Documentation', external: true },
			{ href: links.docs.tutorials, label: 'Learning center', external: true },
			{ href: links.github, label: 'Community', external: true },
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
