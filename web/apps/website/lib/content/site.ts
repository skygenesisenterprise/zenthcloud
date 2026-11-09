/**
 * Single source of truth for public destinations, navigation and footer.
 *
 * Rules:
 * - Internal links are paths; external destinations are marked `external`.
 * - No route is listed before it exists.
 * - Console/authentication lives on a separate service, never reimplemented here.
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
					{
						href: '/products/public-cloud/compute',
						label: 'Browser Run',
						description: 'Automated browsers',
					},
					{
						href: '/products/public-cloud/compute',
						label: 'Containers',
						description: 'Any language, anywhere',
					},
					{
						href: '/products/public-cloud/compute',
						label: 'Durable Objects',
						description: 'Stateful compute',
					},
					{
						href: '/products/public-cloud/compute',
						label: 'Sandboxes',
						description: 'Secure code execution',
					},
					{
						href: '/products/public-cloud/compute',
						label: 'Workers',
						description: 'Global serverless functions',
					},
					{
						href: '/products/managed-services',
						label: 'Workers for Platforms',
						description: 'Programmable Platform Solutions',
					},
					{
						href: '/products/managed-services',
						label: 'Workflows',
						description: 'Process orchestration',
					},
				],
			},
			{
				title: 'Storage',
				links: [
					{
						href: '/products/public-cloud/object-storage',
						label: 'Artifacts',
						description: 'Git-native versioned storage',
					},
					{
						href: '/products/public-cloud/databases',
						label: 'D1',
						description: 'Serverless SQL',
					},
					{
						href: '/products/public-cloud/databases',
						label: 'Basin',
						description: 'Ingest, catalog & query data',
					},
					{
						href: '/products/public-cloud/databases',
						label: 'Hyperdrive',
						description: 'Global databases',
					},
					{
						href: '/products/networking',
						label: 'K2',
						description: 'Publish and subscribe to durable, ordered event streams',
					},
					{
						href: '/products/managed-services',
						label: 'Queues',
						description: 'Message processing',
					},
					{
						href: '/products/public-cloud/object-storage',
						label: 'R2',
						description: 'Egress-free storage',
					},
					{
						href: '/products/public-cloud/object-storage',
						label: 'KV',
						description: 'Ultra-fast key-value storage',
					},
				],
			},
			{
				title: 'AI',
				links: [
					{
						href: '/products/public-cloud/gpu',
						label: 'Agents',
						description: 'Build stateful AI agents',
					},
					{
						href: '/products/public-cloud/gpu',
						label: 'AI Gateway',
						description: 'AI observability',
					},
					{
						href: '/products/public-cloud/gpu',
						label: 'AI Search',
						description: 'Instant retrieval',
					},
					{
						href: '/products/public-cloud/gpu',
						label: 'Vectorize',
						description: 'Vector database',
					},
					{
						href: '/products/public-cloud/gpu',
						label: 'Workers AI',
						description: 'Edge AI models',
					},
				],
			},
			{
				title: 'SASE / Zero Trust',
				links: [
					{
						href: '/products/security',
						label: 'SASE',
						description: 'Zenthcloud SASE platform',
					},
					{
						href: '/products/security',
						label: 'Access',
						description: 'Zero trust access to private resources',
					},
					{
						href: '/products/security',
						label: 'CASB',
						description: 'SaaS and cloud posture',
					},
					{
						href: '/products/security',
						label: 'Data Loss Prevention',
						description: 'Protect sensitive data',
					},
					{
						href: '/products/security',
						label: 'Gateway',
						description: 'Web filtering',
					},
					{
						href: '/products/security',
						label: 'Browser Isolation',
						description: 'Secure web browsing',
					},
					{
						href: '/products/networking',
						label: 'WAN',
						description: 'Cloud-delivered networking',
					},
					{
						href: '/products/security',
						label: 'Email Security',
						description: 'Phishing protection',
					},
				],
			},
			{
				title: 'Security',
				links: [
					{
						href: '/products/security',
						label: 'DDoS Protection',
						description: 'Mitigation Solutions',
					},
					{
						href: '/products/security',
						label: 'Rate Limiting',
						description: 'Abuse prevention',
					},
					{
						href: '/products/security',
						label: 'SSL',
						description: 'Secure Your Site with SSL',
					},
					{
						href: '/products/security',
						label: 'Turnstile',
						description: 'A CAPTCHA Replacement Solution',
					},
					{
						href: '/products/security',
						label: 'WAF',
						description: 'Web Application Firewall',
					},
					{
						href: '/products/networking',
						label: 'Magic Transit',
						description: 'DDoS Protection for Networks',
					},
					{
						href: '/products/security',
						label: 'Client-Side Security',
						description: 'Prevent browser supply chain attacks',
					},
					{
						href: '/products/security',
						label: 'Bot Management',
						description: 'Block bad bots',
					},
				],
			},
			{
				title: 'Network & Content Delivery',
				links: [
					{
						href: '/products/networking',
						label: 'CDN',
						description: 'Faster delivery & caching',
					},
					{
						href: '/products/domain-services',
						label: 'DNS',
						description: 'Fast DNS',
					},
					{
						href: '/products/networking',
						label: 'Load Balancing',
						description: 'Zero downtime',
					},
					{
						href: '/products/networking',
						label: 'TURN / SFU',
						description: 'Real-time infra',
					},
					{
						href: '/products/networking',
						label: 'Analytics',
						description: 'Web Performance & Security',
					},
				],
			},
		],
	},
	{
		title: 'Solutions',
		href: '/solutions',
		columns: [
			{
				title: 'AI & network',
				links: [
					{
						href: '/solutions/ai-research',
						label: 'AI',
						description: 'Build intelligent applications with AI at the edge',
					},
					{
						href: '/products/networking',
						label: 'Network',
						description: 'Global network services for performance and reliability',
					},
					{
						href: '/solutions/developers',
						label: 'Workflows',
						description: 'Orchestrate complex multi-step processes',
					},
					{
						href: '/products/security',
						label: 'AI Security',
						description: 'Secure and control AI adoption without slowing innovation.',
					},
				],
			},
			{
				title: 'Platforms & security',
				links: [
					{
						href: '/solutions/hosting-providers',
						label: 'Platforms',
						description: "Build platforms on ZenthCloud's infrastructure",
					},
					{
						href: '/solutions/developers',
						label: 'Frontends',
						description: 'Deploy frontend applications globally in seconds',
					},
					{
						href: '/products/security',
						label: 'Security',
						description: 'Protect your applications from threats',
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
				title: 'Read & build',
				links: [
					{
						href: '/resources/blog',
						label: 'Blog',
						description: 'News, product updates, and announcements',
					},
					{
						href: '/resources/support',
						label: 'Community',
						description: 'Connect with other developers and experts',
					},
					{
						href: 'https://github.com/skygenesisenterprise/zenthcloud',
						label: 'Zenthcloud Radar',
						description: 'Internet traffic and security trends',
						external: true,
					},
					{
						href: '/resources/documentation',
						label: 'Developer Docs',
						description: 'Guides, references, and tutorials',
					},
					{
						href: '/resources/api',
						label: 'API Reference',
						description: 'ZenthCloud API documentation',
					},
					{
						href: '/resources/blog',
						label: 'Case Studies',
						description: 'Customer success stories and results',
					},
				],
			},
			{
				title: 'Explore & connect',
				links: [
					{
						href: '/resources/tutorials',
						label: 'Learning Center',
						description: 'Learn about web technology concepts',
					},
					{
						href: '/resources/documentation',
						label: 'Reference Architectures',
						description: 'Architecture patterns and best practices',
					},
					{
						href: '/company/newsroom',
						label: 'Press',
						description: 'Latest news, media resources, and coverage',
					},
					{
						href: '/company/newsroom',
						label: 'See Upcoming Events',
					},
					{
						href: '/solutions/startups',
						label: 'Startups',
					},
					{
						href: '/company/careers',
						label: 'Careers',
					},
					{
						href: '/company/partners',
						label: 'Partners',
					},
					{
						href: '/resources/status',
						label: 'Status',
					},
					{
						href: '/resources/support',
						label: 'Support',
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
]

export const cta = {
	primary: { href: '/signup', label: 'Request access' },
	secondary: { href: '/contact-sales', label: 'Contact sales' },
	signIn: { href: '/login', label: 'Sign in' },
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
			{ href: '/products/web-hosting', label: 'Web Hosting' },
			{ href: '/products/domain-services', label: 'Domains' },
			{ href: '/products/email-hosting', label: 'Email' },
			{ href: '/products/networking', label: 'Networking' },
			{ href: '/products/security', label: 'Security' },
			{ href: '/products/managed-services', label: 'Managed services' },
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
		title: 'Pricing & infrastructure',
		links: [
			{ href: '/pricing', label: 'Pricing overview' },
			{ href: '/pricing/compute', label: 'Compute pricing' },
			{ href: '/pricing/storage', label: 'Storage pricing' },
			{ href: '/pricing/networking', label: 'Network pricing' },
			{ href: '/pricing/hosting', label: 'Hosting pricing' },
			{ href: '/pricing/enterprise', label: 'Enterprise pricing' },
			{ href: '/infrastructure', label: 'Infrastructure' },
			{ href: '/infrastructure/locations', label: 'Locations' },
			{ href: '/infrastructure/partners', label: 'Providers' },
		],
	},
	{
		title: 'Resources',
		links: [
			{ href: '/resources/documentation', label: 'Documentation' },
			{ href: '/resources/api', label: 'API reference' },
			{ href: '/resources/tutorials', label: 'Tutorials' },
			{ href: '/resources/blog', label: 'Blog' },
			{ href: '/resources/support', label: 'Support' },
			{ href: '/resources/status', label: 'Service status' },
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
