import {
	BroadcastIcon,
	BugIcon,
	ClockCounterClockwiseIcon,
	CodeIcon,
	CpuIcon,
	CurrencyCircleDollarIcon,
	DatabaseIcon,
	GaugeIcon,
	GearIcon,
	GlobeIcon,
	HardDrivesIcon,
	HouseIcon,
	type Icon,
	ImagesIcon,
	NetworkIcon,
	PulseIcon,
	ShieldCheckIcon,
	ShieldWarningIcon,
	SparkleIcon,
} from "@phosphor-icons/react";

/**
 * Navigation model of the ZenthCloud panel.
 *
 * This is the Cloud-style product surface served under `/{organizationId}` —
 * not the infrastructure dashboard under `/dashboard`. The two surfaces share
 * the same navigation *concepts* (destinations, placements, environment and
 * licence gating) but not the same tree, because they expose different
 * products.
 *
 * Responsibilities are split the same way as in the dashboard navigation:
 * - this module owns destinations, sections, permissions and licences;
 * - the shell (`panel-shell.tsx`) only renders the resolved tree;
 * - the server (`lib/organization-page.ts`) remains authoritative for access.
 */

export type NavigationEnvironment = "self" | "cloud";

export type LicenseTier = "free" | "pro" | "enterprise";

const LICENSE_RANK: Record<LicenseTier, number> = {
	free: 0,
	pro: 1,
	enterprise: 2,
};

/** Structural shape of a permission map (`api.user.getPermissions`). */
export type PermissionMap = Record<
	string,
	Record<string, boolean | undefined> | undefined
>;

export type NavigationDestination = {
	label: string;
	/** Path inside the workspace, relative to `/{organizationId}`. */
	path: string;
	icon: Icon;
	/** Extra paths that also select this destination. */
	activePaths?: readonly string[];
	/** Permission required to see the destination, as `resource.action`. */
	requires?: string;
	/**
	 * A destination is only rendered as a link once its page exists. This keeps
	 * the navigation tree complete without pointing at routes that 404.
	 */
	implemented?: boolean;
	/** Optional pill rendered next to the label, e.g. `Nouveau`. */
	badge?: string;
};

/**
 * Every panel destination, declared once. The key is the stable id used by
 * placements and rendered into `PanelNavigationItem.id`.
 */
const NAVIGATION_DESTINATIONS = {
	home: {
		label: "Accueil du compte",
		path: "home",
		icon: HouseIcon,
		implemented: true,
	},
	history: {
		label: "Historique",
		path: "history",
		icon: ClockCounterClockwiseIcon,
	},
	domains: {
		label: "Domaines",
		path: "domains",
		icon: GlobeIcon,
		requires: "dnsProvider.read",
	},
	observability: {
		label: "Observabilité",
		path: "observability",
		icon: PulseIcon,
		requires: "traffic.read",
		badge: "Nouveau",
	},
	// The infrastructure workspace has no page of its own yet: it is the
	// umbrella the operational products will be grouped under, so the entry is
	// declared now and rendered as a disabled row until its route exists.
	infrastructure: {
		label: "Infrastructure",
		path: "infrastructure",
		icon: HardDrivesIcon,
		implemented: false,
	},
	compute: {
		label: "Calcul",
		path: "compute",
		icon: CpuIcon,
	},
	ai: {
		label: "AI",
		path: "ai",
		icon: SparkleIcon,
	},
	storage: {
		label: "Stockage et bases de données",
		path: "storage",
		icon: DatabaseIcon,
	},
	media: {
		label: "Images & Stream",
		path: "media",
		icon: ImagesIcon,
	},
	realtime: {
		label: "Realtime",
		path: "realtime",
		icon: BroadcastIcon,
	},
	development: {
		label: "Développement et déploiement",
		path: "development",
		icon: CodeIcon,
	},
	applicationSecurity: {
		label: "Sécurité des applications",
		path: "security/applications",
		icon: ShieldCheckIcon,
	},
	zeroTrust: {
		label: "Zero Trust",
		path: "security/zero-trust",
		icon: ShieldWarningIcon,
	},
	networks: {
		label: "Réseaux",
		path: "networks",
		icon: NetworkIcon,
	},
	threats: {
		label: "Menaces & défense",
		path: "security/threats",
		icon: BugIcon,
	},
	monetize: {
		label: "Monétiser",
		path: "monetize",
		icon: CurrencyCircleDollarIcon,
		badge: "Nouveau",
	},
	delivery: {
		label: "Livraison et performance",
		path: "delivery",
		icon: GaugeIcon,
	},
	account: {
		label: "Gérer le compte",
		path: "account",
		icon: GearIcon,
	},
} satisfies Record<string, NavigationDestination>;

type NavigationDestinationId = keyof typeof NAVIGATION_DESTINATIONS;

/**
 * Cloud entitlement matrix: the minimum licence required to render a
 * destination. Only the managed Cloud product is gated; a self-hosted instance
 * is unlicensed and keeps its whole tree.
 *
 * Navigation visibility is presentation only: direct URL access stays protected
 * by membership and permission checks on the server.
 */
export const CLOUD_DESTINATION_MIN_LICENSE = {
	home: "free",
	history: "free",
	domains: "free",
	observability: "free",
	infrastructure: "free",
	compute: "free",
	ai: "free",
	storage: "pro",
	media: "pro",
	realtime: "pro",
	development: "free",
	applicationSecurity: "pro",
	zeroTrust: "enterprise",
	networks: "free",
	threats: "enterprise",
	monetize: "pro",
	delivery: "free",
	account: "free",
} satisfies Record<NavigationDestinationId, LicenseTier>;

/** A destination as placed in a section. Environments default to all. */
export type NavigationPlacement = {
	destination: NavigationDestinationId;
	environments?: readonly NavigationEnvironment[];
	/** Overrides the shared entitlement for this placement. */
	minLicense?: LicenseTier;
};

export type NavigationSectionDefinition = {
	id: string;
	/** Omitted when the entries need no heading, as for the primary group. */
	label?: string;
	items: readonly NavigationPlacement[];
	environments?: readonly NavigationEnvironment[];
};

/**
 * The Cloud-style tree: four sections, in the requested order. Entries are
 * declared even when their page does not exist yet; the renderer decides
 * between a link and a disabled item from `implemented`.
 */
export const NAVIGATION_SECTIONS: readonly NavigationSectionDefinition[] = [
	{
		id: "main",
		items: [
			{ destination: "home" },
			{ destination: "history" },
			{ destination: "domains" },
			{ destination: "observability" },
		],
	},
	{
		id: "build",
		label: "Build",
		items: [
			{ destination: "compute" },
			{ destination: "infrastructure" },
			{ destination: "ai" },
			{ destination: "storage" },
			{ destination: "media" },
			{ destination: "realtime" },
			{ destination: "development" },
		],
	},
	{
		id: "protect",
		label: "Protéger & connecter",
		items: [
			{ destination: "applicationSecurity" },
			{ destination: "zeroTrust" },
			{ destination: "networks" },
			{ destination: "threats" },
			{ destination: "monetize" },
			{ destination: "delivery" },
		],
	},
];

/**
 * Entries pinned to the sidebar footer. They are outside the scrollable tree
 * so the account entry is reachable from every page of the panel.
 */
export const FOOTER_NAVIGATION: readonly NavigationPlacement[] = [
	{ destination: "account" },
];

/**
 * Entries of the "Gérer le compte" sub-menu, in the order the reference panel
 * lists them. Their pages are not written yet, so the shell renders them as
 * disabled rows: the menu shows the real structure without linking to a route
 * that would open blank.
 */
export const ACCOUNT_DESTINATIONS: readonly {
	label: string;
	path: string;
}[] = [
	{ label: "Membres", path: "account/members" },
	{ label: "Facturation", path: "account/billing" },
	{ label: "Jetons d'API du compte", path: "account/api-tokens" },
	{ label: "Clients OAuth", path: "account/oauth-clients" },
	{ label: "Journaux d'audit", path: "account/audit-log" },
	{ label: "Notifications", path: "account/notifications" },
	{ label: "Contenu bloqué", path: "account/blocked-content" },
	{
		label: "Rapports de mauvaise utilisation",
		path: "account/abuse-reports",
	},
	{ label: "Rapport sur l'impact carbone", path: "account/carbon" },
	{ label: "Configurations", path: "account/configurations" },
	{ label: "Étiquettes de ressources", path: "account/tags" },
];

export type PanelNavigationChild = {
	id: string;
	label: string;
	/** Absolute, workspace-scoped href. */
	href: string;
	/** Whether the page behind `href` exists today. */
	implemented: boolean;
};

export type PanelNavigationItem = {
	id: string;
	label: string;
	/** Absolute, workspace-scoped href. Always built from the URL organization. */
	href: string;
	icon: Icon;
	/** Whether the page behind `href` exists today. */
	implemented: boolean;
	/** Whether the destination will expose a contextual sub-navigation. */
	expandable: boolean;
	/** Optional pill rendered next to the label, e.g. `Nouveau`. */
	badge?: string;
	minLicense?: LicenseTier;
	/**
	 * Entries of the destination's own sub-menu. They are rendered in place
	 * when the row is expanded, so a product surface stays reachable even when
	 * its landing page is not written yet.
	 */
	children?: PanelNavigationChild[];
};

export type PanelNavigationSection = {
	id: string;
	label?: string;
	items: PanelNavigationItem[];
};

export type PanelNavigation = {
	organizationId: string;
	sections: PanelNavigationSection[];
	/** Persistent entries rendered in the sidebar footer. */
	footer: PanelNavigationItem[];
};

/**
 * Builds an absolute path inside a workspace. Every destination goes through
 * this helper so a page can never link to another organization by accident.
 */
export function organizationPath(organizationId: string, path: string): string {
	const segments = path
		.split("/")
		.filter(Boolean)
		.map((segment) => encodeURIComponent(segment));
	return [`/${encodeURIComponent(organizationId)}`, ...segments].join("/");
}

function readPermission(permissions: unknown, requirement: string): boolean {
	if (!permissions || typeof permissions !== "object") return false;
	const [resource, action] = requirement.split(".");
	if (!resource || !action) return false;
	const actions = (permissions as Record<string, unknown>)[resource];
	if (!actions || typeof actions !== "object") return false;
	return (actions as Record<string, unknown>)[action] === true;
}

function passesLicense(
	minimum: LicenseTier | undefined,
	license: LicenseTier | null,
): boolean {
	if (!minimum) return true;
	// An unresolved licence counts as Free: the navigation is presentation
	// only, and hiding every gated destination would turn a slow entitlement
	// load into an empty menu.
	return LICENSE_RANK[license ?? "free"] >= LICENSE_RANK[minimum];
}

function isInEnvironment(
	environments: readonly NavigationEnvironment[] | undefined,
	environment: NavigationEnvironment,
): boolean {
	return !environments || environments.includes(environment);
}

function resolveDomainChildren(organizationId: string): PanelNavigationChild[] {
	return [
		{
			id: "overview",
			label: "Vue d'ensemble",
			path: "domains/overview",
			implemented: true,
		},
		{
			id: "registrations",
			label: "Enregistrements",
			path: "domains/registrations",
		},
		{ id: "transfers", label: "Transferts", path: "domains/transfers" },
	].map((entry) => ({
		id: `domains.${entry.id}`,
		label: entry.label,
		href: organizationPath(organizationId, entry.path),
		implemented: entry.implemented === true,
	}));
}

function resolvePlacement(
	placement: NavigationPlacement,
	opts: {
		organizationId: string;
		environment: NavigationEnvironment;
		permissions?: unknown;
		license: LicenseTier | null;
	},
): PanelNavigationItem | undefined {
	if (!isInEnvironment(placement.environments, opts.environment)) {
		return undefined;
	}

	const destination: NavigationDestination =
		NAVIGATION_DESTINATIONS[placement.destination];

	if (
		destination.requires &&
		!readPermission(opts.permissions, destination.requires)
	) {
		return undefined;
	}

	const minLicense =
		placement.minLicense ??
		(opts.environment === "cloud"
			? CLOUD_DESTINATION_MIN_LICENSE[placement.destination]
			: undefined);
	if (!passesLicense(minLicense, opts.license)) return undefined;

	return {
		id: placement.destination,
		label: destination.label,
		href: organizationPath(opts.organizationId, destination.path),
		icon: destination.icon,
		implemented: destination.implemented === true,
		// Every destination except the workspace home leads to a deeper level
		// (a list, then a resource) and is rendered with a disclosure chevron.
		expandable: placement.destination !== "home",
		badge: destination.badge,
		minLicense,
		children:
			placement.destination === "domains"
				? resolveDomainChildren(opts.organizationId)
				: undefined,
	};
}

export function createNavigation(opts: {
	organizationId: string;
	environment: NavigationEnvironment;
	permissions?: unknown;
	license?: LicenseTier | null;
}): PanelNavigation {
	const context = {
		organizationId: opts.organizationId,
		environment: opts.environment,
		permissions: opts.permissions,
		license: opts.license ?? null,
	};

	const sections: PanelNavigationSection[] = [];
	for (const section of NAVIGATION_SECTIONS) {
		if (!isInEnvironment(section.environments, opts.environment)) continue;

		const items: PanelNavigationItem[] = [];
		for (const placement of section.items) {
			const item = resolvePlacement(placement, context);
			if (item) items.push(item);
		}

		if (items.length > 0) {
			sections.push({ id: section.id, label: section.label, items });
		}
	}

	const footer = FOOTER_NAVIGATION.map((placement) =>
		resolvePlacement(placement, context),
	).filter((item): item is PanelNavigationItem => item !== undefined);

	return { organizationId: opts.organizationId, sections, footer };
}

function normalizePath(pathname: string): string {
	return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

/**
 * Whether an absolute workspace href is the current location or one of its
 * descendants. Shared by menu entries and their sub-entries, so a product
 * surface stays marked while one of its pages is open.
 */
export function isNavigationHrefActive(
	href: string,
	location: { pathname: string },
): boolean {
	const pathname = normalizePath(location.pathname);
	const target = normalizePath(href);
	return pathname === target || pathname.startsWith(`${target}/`);
}

/** Whether a rendered entry is the current location. */
export function isNavigationItemActive(
	item: PanelNavigationItem,
	location: { pathname: string },
): boolean {
	return isNavigationHrefActive(item.href, location);
}

export function findActiveNavigation(
	navigation: PanelNavigation,
	location: { pathname: string },
):
	| {
			section: PanelNavigationSection;
			item: PanelNavigationItem;
	  }
	| undefined {
	for (const section of navigation.sections) {
		const item = section.items.find((candidate) =>
			isNavigationItemActive(candidate, location),
		);
		if (item) return { section, item };
	}
	return undefined;
}

/* -------------------------------------------------------------------------- */
/* Contextual navigation                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A resource opened inside the workspace. The sidebar keeps its global tree and
 * adds the resource's own destinations below it.
 */
export type ContextualResource =
	| { kind: "domain"; id: string }
	| { kind: "instance"; id: string }
	| { kind: "bucket"; id: string }
	| { kind: "database"; id: string }
	| { kind: "vm"; id: string }
	| { kind: "server"; id: string }
	| { kind: "tunnel"; id: string };

type ContextualDestination = {
	label: string;
	path: string;
	implemented?: boolean;
};

/**
 * Resource workspaces: one entry per resource kind. `basePath` is where the
 * resource lives, `match` is the path prefix used to detect it in a URL, and
 * `items` is the navigation determined by the resource type.
 */
const RESOURCE_WORKSPACES: Record<
	ContextualResource["kind"],
	{
		label: string;
		basePath: string;
		match: readonly string[];
		items: readonly ContextualDestination[];
	}
> = {
	domain: {
		label: "Domaine",
		basePath: "domains",
		match: ["domains"],
		// The domain workspace nav follows the reference dashboard: every product
		// surface of a zone is listed, in the order it appears there. Only the
		// overview page exists today, so the others stay disabled.
		items: [
			{ label: "Vue d'ensemble", path: "", implemented: true },
			{ label: "Historique", path: "history" },
			{ label: "AI Crawl Control", path: "ai-crawl-control" },
			{ label: "Préparation pour agents", path: "agent-readiness" },
			{ label: "Analytics", path: "analytics" },
			{ label: "Observabilité", path: "observability" },
			{ label: "DNS", path: "dns" },
			{ label: "E-mail", path: "email" },
			{ label: "SSL/TLS", path: "ssl" },
			{ label: "Sécurité", path: "security" },
			{ label: "Access", path: "access" },
			{ label: "Speed", path: "speed" },
			{ label: "Caching", path: "caching" },
			{ label: "Routes Workers", path: "workers-routes" },
			{ label: "Règles", path: "rules" },
			{ label: "Pages d'erreur", path: "error-pages" },
			{ label: "Réseau", path: "network" },
			{ label: "Trafic", path: "traffic" },
			{ label: "Web3", path: "web3" },
		],
	},
	instance: {
		label: "Instance",
		basePath: "compute",
		match: ["compute"],
		items: [
			{ label: "Vue d'ensemble", path: "overview" },
			{ label: "Monitoring", path: "monitoring" },
			{ label: "Configuration", path: "configuration" },
			{ label: "Réseau", path: "network" },
			{ label: "Stockage", path: "storage" },
			{ label: "Activité", path: "activity" },
		],
	},
	bucket: {
		label: "Bucket",
		basePath: "storage",
		match: ["r2"],
		items: [
			{ label: "Vue d'ensemble", path: "overview" },
			{ label: "Objets", path: "objects" },
			{ label: "Accès", path: "access" },
			{ label: "Lifecycle", path: "lifecycle" },
			{ label: "Monitoring", path: "monitoring" },
		],
	},
	database: {
		label: "Base de données",
		basePath: "infrastructure/databases",
		match: ["infrastructure", "databases"],
		items: [
			{ label: "Vue d'ensemble", path: "overview" },
			{ label: "Tables", path: "tables" },
			{ label: "Requêtes", path: "queries" },
			{ label: "Sauvegardes", path: "backups" },
			{ label: "Accès", path: "access" },
			{ label: "Monitoring", path: "monitoring" },
		],
	},
	vm: {
		label: "Machine virtuelle",
		basePath: "infrastructure/vm",
		match: ["infrastructure", "vm"],
		items: [
			{ label: "Vue d'ensemble", path: "overview" },
			{ label: "Monitoring", path: "monitoring" },
			{ label: "Configuration", path: "configuration" },
			{ label: "Réseau", path: "network" },
			{ label: "Stockage", path: "storage" },
			{ label: "Activité", path: "activity" },
		],
	},
	server: {
		label: "Serveur physique",
		basePath: "infrastructure/servers",
		match: ["infrastructure", "servers"],
		items: [
			{ label: "Vue d'ensemble", path: "overview" },
			{ label: "Monitoring", path: "monitoring" },
			{ label: "Configuration", path: "configuration" },
			{ label: "Réseau", path: "network" },
			{ label: "Stockage", path: "storage" },
			{ label: "Activité", path: "activity" },
		],
	},
	tunnel: {
		label: "Tunnel",
		basePath: "network/tunnels",
		match: ["network", "tunnels"],
		items: [
			{ label: "Vue d'ensemble", path: "overview" },
			{ label: "Routes", path: "routes" },
			{ label: "Connecteurs", path: "connectors" },
			{ label: "Analytics", path: "analytics" },
		],
	},
};

/**
 * Resolves the contextual section for a resource. It is deliberately additive:
 * the caller renders the global navigation first and this section underneath,
 * so a resource never replaces the workspace tree.
 */
export function resolveContextualNavigation(opts: {
	organizationId: string;
	resource: ContextualResource;
}): PanelNavigationSection {
	const definition = RESOURCE_WORKSPACES[opts.resource.kind];
	const base = [definition.basePath, opts.resource.id];

	return {
		id: `contextual-${opts.resource.kind}`,
		label: definition.label,
		items: definition.items.map((destination) => ({
			id: `${opts.resource.kind}.${destination.path}`,
			label: destination.label,
			href: organizationPath(
				opts.organizationId,
				[...base, destination.path].filter(Boolean).join("/"),
			),
			icon: buildContextualIcon(destination.path),
			implemented: destination.implemented === true,
			// Contextual entries open a leaf page; they have no sub-tree of
			// their own, so they carry no disclosure chevron.
			expandable: false,
			minLicense: undefined,
		})),
	};
}

function buildContextualIcon(path: string): Icon {
	switch (path) {
		case "dns":
		case "records":
			return GlobeIcon;
		case "ssl":
			return ShieldCheckIcon;
		case "analytics":
		case "monitoring":
		case "traffic":
		case "observability":
			return PulseIcon;
		case "network":
			return NetworkIcon;
		case "history":
			return ClockCounterClockwiseIcon;
		case "security":
			return ShieldCheckIcon;
		case "storage":
			return DatabaseIcon;
		case "activity":
			return ClockCounterClockwiseIcon;
		case "objects":
			return ImagesIcon;
		default:
			return GaugeIcon;
	}
}

/* -------------------------------------------------------------------------- */
/* Workspace-based navigation                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A workspace is a navigation context, not a second navigation system: the
 * global tree is always built first and the active workspace contributes
 * additional sections underneath it.
 *
 * - `global`: organization-wide entry point (the tree above);
 * - `infrastructure`: operational umbrella for compute, storage, network and
 *   security products;
 * - `domain`: one product surface (AI, storage, networking, …);
 * - `resource`: a single resource opened inside its parent workspace.
 *
 * The resolver is declarative: URLs are matched against the definitions below,
 * so deep links, browser navigation and future routes work without the shell
 * knowing about any particular product.
 */
export type WorkspaceKind = "global" | "infrastructure" | "domain" | "resource";

export type NavigationWorkspace = {
	kind: WorkspaceKind;
	/** Stable id: `global`, `infrastructure`, `domain:ai`, … */
	id: string;
	label: string;
	/** Root of the workspace, relative to `/{organizationId}`. */
	basePath?: string;
	/** Workspace this one was opened from, for resource contexts. */
	parent?: { id: string; label: string; href: string };
};

export type WorkspaceNavigation = PanelNavigation & {
	workspace: NavigationWorkspace;
	/**
	 * Sections owned by the active workspace. They are additive: the global tree
	 * above stays intact, so moving between workspaces never removes the
	 * organization-wide navigation.
	 */
	contextual: PanelNavigationSection[];
};

const GLOBAL_WORKSPACE: NavigationWorkspace = {
	kind: "global",
	id: "global",
	label: "Espace global",
};

type WorkspaceEntryDefinition = {
	label: string;
	path: string;
	implemented?: boolean;
};

type WorkspaceSectionDefinition = {
	id: string;
	label: string;
	items: readonly WorkspaceEntryDefinition[];
};

type DomainWorkspaceDefinition = {
	/** Short id used in `domain:{id}`. */
	id: string;
	label: string;
	basePath: string;
	sections: readonly WorkspaceSectionDefinition[];
};

function buildWorkspaceSection(
	organizationId: string,
	definition: WorkspaceSectionDefinition,
): PanelNavigationSection {
	return {
		id: definition.id,
		label: definition.label,
		items: definition.items.map((entry) => ({
			id: `${definition.id}.${entry.path}`,
			label: entry.label,
			href: organizationPath(organizationId, entry.path),
			icon: buildContextualIcon(entry.path.split("/").pop() ?? ""),
			implemented: entry.implemented === true,
			expandable: false,
		})),
	};
}

const INFRASTRUCTURE_WORKSPACE: {
	id: string;
	label: string;
	basePath: string;
	sections: readonly WorkspaceSectionDefinition[];
} = {
	id: "infrastructure",
	label: "Infrastructure",
	basePath: "infrastructure",
	sections: [
		{
			id: "infrastructure-overview",
			label: "Vue d'ensemble",
			items: [{ label: "Vue d'ensemble", path: "infrastructure" }],
		},
		{
			id: "infrastructure-compute",
			label: "Calcul",
			items: [
				{ label: "Serveurs physiques", path: "infrastructure/servers" },
				{ label: "Machines virtuelles", path: "infrastructure/vm" },
				{ label: "Instances", path: "infrastructure/instances" },
				{ label: "Conteneurs", path: "workers/containers" },
			],
		},
		{
			id: "infrastructure-storage",
			label: "Stockage et bases de données",
			items: [
				{ label: "Stockage objet", path: "r2" },
				{ label: "Bases de données", path: "infrastructure/databases" },
			],
		},
		{
			id: "infrastructure-network",
			label: "Réseau",
			items: [
				{ label: "Réseaux", path: "network" },
				{ label: "Tunnels", path: "network/tunnels" },
				{ label: "Adresses IP", path: "network/ip-addresses" },
			],
		},
		{
			id: "infrastructure-security",
			label: "Sécurité",
			items: [{ label: "Sécurité de l'infrastructure", path: "security" }],
		},
		{
			id: "infrastructure-operations",
			label: "Opérations",
			items: [
				{ label: "Monitoring", path: "observability" },
				{ label: "Opérations", path: "infrastructure/operations" },
				{ label: "Terminal", path: "infrastructure/terminal" },
			],
		},
	],
};

/** Product surfaces that open a domain workspace of their own. */
/**
 * Standalone pages of the Domains sub-menu. They are reachable from the global
 * navigation only, so they must not be detected as a domain resource.
 */
const DOMAIN_STATIC_PAGES = new Set(["overview", "registrations", "transfers"]);

const DOMAIN_WORKSPACES: readonly DomainWorkspaceDefinition[] = [
	{
		id: "domains",
		label: "Domaines",
		basePath: "domains",
		// The Domains pages live in the global tree, under the "Domaines"
		// sub-menu: the workspace keeps the URL context but repeats none of
		// them in a contextual section.
		sections: [],
	},
	{
		id: "ai",
		label: "AI",
		basePath: "ai",
		sections: [
			{
				id: "domain-ai",
				label: "AI",
				items: [
					{ label: "Agents", path: "ai/agents" },
					{ label: "AI Gateway", path: "ai/ai-gateway" },
					{ label: "Recherche IA", path: "ai/ai-search" },
					{ label: "Serveurs MCP", path: "ai/mcp-servers" },
					{ label: "Modèles", path: "ai/models" },
					{ label: "Vectorize", path: "ai/vectorize" },
					{ label: "Workers AI", path: "ai/workers-ai" },
				],
			},
		],
	},
	{
		id: "storage",
		label: "Stockage et bases de données",
		basePath: "r2",
		sections: [
			{
				id: "domain-storage",
				label: "Stockage et bases de données",
				items: [
					{ label: "Vue d'ensemble", path: "r2/overview" },
					{ label: "R2", path: "r2" },
					{ label: "KV", path: "r2/kv" },
					{ label: "D1", path: "r2/d1" },
					{ label: "Hyperdrive", path: "r2/hyperdrives" },
					{ label: "Artifacts", path: "r2/artifacts" },
					{ label: "K2", path: "r2/k2" },
					{ label: "Catalogue de données", path: "r2/data-catalog" },
					{ label: "Analytics Engine", path: "r2/analytics-engine" },
					{ label: "Secrets Store", path: "r2/secrets-store" },
				],
			},
		],
	},
	{
		id: "media",
		label: "Images & Stream",
		basePath: "media",
		sections: [
			{
				id: "domain-media",
				label: "Images & Stream",
				items: [
					{ label: "Vidéos", path: "media/videos" },
					{ label: "Hébergement", path: "media/hosted" },
					{ label: "Stream", path: "media/stream" },
					{ label: "Transformations", path: "media/transformations" },
					{ label: "Analytics", path: "media/analytics" },
					{ label: "Forfaits", path: "media/plans" },
				],
			},
		],
	},
	{
		id: "realtime",
		label: "Realtime",
		basePath: "realtime",
		sections: [
			{
				id: "domain-realtime",
				label: "Realtime",
				items: [
					{ label: "Kit", path: "realtime/kit" },
					{ label: "SFU", path: "realtime/sfu" },
					{ label: "TURN", path: "realtime/turn" },
					{ label: "MoQ", path: "realtime/moq" },
					{ label: "Analytics", path: "realtime/analytics" },
				],
			},
		],
	},
	{
		id: "development",
		label: "Développement et déploiement",
		basePath: "workers",
		sections: [
			{
				id: "domain-development",
				label: "Développement et déploiement",
				items: [
					{ label: "Vue d'ensemble", path: "workers" },
					{ label: "Durable Objects", path: "workers/durable-objects" },
					{ label: "Containers", path: "workers/containers" },
					{ label: "Queues", path: "workers/queues" },
					{ label: "Workflows", path: "workers/workflows" },
					{ label: "Browser Rendering", path: "workers/browser-run" },
					{ label: "Observabilité", path: "workers/observability" },
					{ label: "Plateformes", path: "workers/platforms" },
					{ label: "VPC", path: "workers/vpc" },
					{ label: "Flagship", path: "workers/flagship" },
					{ label: "Forfaits", path: "workers/plans" },
				],
			},
		],
	},
	{
		id: "applicationSecurity",
		label: "Sécurité des applications",
		basePath: "security",
		sections: [
			{
				id: "domain-application-security",
				label: "Sécurité des applications",
				items: [
					{ label: "Vue d'ensemble", path: "security/overview" },
					{ label: "WAF", path: "security/waf" },
					{ label: "Turnstile", path: "security/turnstile" },
					{ label: "DLS", path: "security/dls" },
					{ label: "Botbase", path: "security/botbase" },
					{ label: "Inventaire", path: "security/inventory" },
				],
			},
		],
	},
	{
		id: "zeroTrust",
		label: "Zero Trust",
		basePath: "one",
		sections: [
			{
				id: "domain-zero-trust",
				label: "Zero Trust",
				items: [
					{ label: "Vue d'ensemble", path: "one/overview" },
					{ label: "Contrôles d'accès", path: "one/access-controls" },
					{ label: "Isolation navigateur", path: "one/browser-isolation" },
					{ label: "DLP", path: "one/dlp" },
					{ label: "Sécurité des e-mails", path: "one/email-security" },
					{ label: "Insights", path: "one/insights" },
					{ label: "Intégrations", path: "one/integrations" },
					{
						label: "Composants réutilisables",
						path: "one/reusable-components",
					},
					{ label: "Contrôles de trafic", path: "one/traffic-controls" },
					{ label: "Ressources d'équipe", path: "one/team-resources" },
					{
						label: "Découvertes Cloud & SaaS",
						path: "one/cloud-saas-findings",
					},
					{
						label: "Sécurité des workloads",
						path: "one/cloud-workload-security",
					},
					{ label: "Paramètres", path: "one/settings" },
				],
			},
		],
	},
	{
		id: "networks",
		label: "Réseaux",
		basePath: "network",
		sections: [
			{
				id: "domain-networks",
				label: "Réseaux",
				items: [
					{ label: "Vue d'ensemble", path: "network/overview" },
					{ label: "Tunnels", path: "network/tunnels" },
					{ label: "Mesh", path: "network/mesh" },
					{ label: "Routes", path: "network/routes-config" },
					{ label: "Insights réseau", path: "network/networking-insights" },
					{
						label: "IP personnalisées",
						path: "network/ip-addresses/custom-ips",
					},
					{ label: "IP proxy", path: "network/ip-addresses/proxy-ips" },
				],
			},
		],
	},
	{
		id: "threats",
		label: "Menaces & défense",
		basePath: "threats-defense",
		sections: [
			{
				id: "domain-threats",
				label: "Menaces & défense",
				items: [
					{ label: "Vue d'ensemble", path: "threats-defense" },
					{ label: "Investiguer", path: "threats-defense/investigate" },
					{
						label: "Renseignement sur les menaces",
						path: "threats-defense/threat-intelligence",
					},
				],
			},
		],
	},
	{
		id: "delivery",
		label: "Livraison et performance",
		basePath: "bulk",
		sections: [
			{
				id: "domain-delivery",
				label: "Livraison et performance",
				items: [
					{ label: "Load Balancing", path: "bulk/load-balancing" },
					{ label: "Redirections", path: "bulk/redirects" },
					{ label: "Gestion des tags", path: "bulk/tag-management" },
				],
			},
		],
	},
	{
		id: "monetize",
		label: "Monétiser",
		basePath: "monetize",
		sections: [
			{
				id: "domain-monetize",
				label: "Monétiser",
				items: [
					{
						label: "Monetization Gateway",
						path: "monetize/monetization-gateway",
					},
				],
			},
		],
	},
	{
		id: "observability",
		label: "Observabilité",
		basePath: "observability",
		sections: [
			{
				id: "domain-observability",
				label: "Observabilité",
				items: [
					{ label: "Vue d'ensemble", path: "observability" },
					{ label: "Logs", path: "observability/logs" },
					{ label: "Traces", path: "observability/traces" },
					{ label: "Analytics", path: "observability/analytics" },
					{ label: "Exports", path: "observability/exporter" },
					{ label: "Notifications", path: "observability/notifications" },
					{ label: "Utilisation", path: "observability/usage" },
				],
			},
		],
	},
];

function decodeSegment(segment: string): string {
	try {
		return decodeURIComponent(segment);
	} catch {
		return segment;
	}
}

/** Segments of `pathname` inside the URL's organization, decoded. */
function workspaceSegments(pathname: string, organizationId: string): string[] {
	const parts = pathname.split("/").filter(Boolean);
	const root = parts[0];
	if (!root || decodeSegment(root) !== organizationId) return [];
	return parts.slice(1).map(decodeSegment);
}

function startsWithSegments(
	segments: readonly string[],
	prefix: readonly string[],
): boolean {
	return prefix.every((segment, index) => segments[index] === segment);
}

/**
 * Resolves the workspace a URL belongs to and the sections it adds.
 *
 * It never mutates the global tree: a domain or resource workspace only
 * enriches the sidebar, so the organization-wide navigation stays reachable
 * from anywhere.
 */
export function resolveWorkspaceNavigation(opts: {
	organizationId: string;
	environment: NavigationEnvironment;
	permissions?: unknown;
	license?: LicenseTier | null;
	pathname: string;
}): WorkspaceNavigation {
	const navigation = createNavigation(opts);
	const segments = workspaceSegments(opts.pathname, opts.organizationId);
	const resourceKinds = Object.keys(
		RESOURCE_WORKSPACES,
	) as ContextualResource["kind"][];

	// Resources are the most specific context: `domains/dom_1/dns` is the DNS
	// of one domain, not the Domains workspace.
	let resource:
		| { kind: ContextualResource["kind"]; id: string; depth: number }
		| undefined;
	for (const kind of resourceKinds) {
		const definition = RESOURCE_WORKSPACES[kind];
		if (segments.length <= definition.match.length) continue;
		if (!startsWithSegments(segments, definition.match)) continue;
		if (resource && resource.depth >= definition.match.length) continue;
		const id = segments[definition.match.length];
		if (!id) continue;
		if (kind === "domain" && DOMAIN_STATIC_PAGES.has(id)) continue;
		resource = { kind, id, depth: definition.match.length };
	}

	if (resource) {
		const definition = RESOURCE_WORKSPACES[resource.kind];
		const section = resolveContextualNavigation({
			organizationId: opts.organizationId,
			resource: { kind: resource.kind, id: resource.id },
		});

		// A resource is opened from its product surface (or from the
		// infrastructure umbrella), which gives the breadcrumb its parent.
		const parentCandidates = [
			...DOMAIN_WORKSPACES.map((workspace) => ({
				id: `domain:${workspace.id}`,
				label: workspace.label,
				basePath: workspace.basePath,
			})),
			{
				id: INFRASTRUCTURE_WORKSPACE.id,
				label: INFRASTRUCTURE_WORKSPACE.label,
				basePath: INFRASTRUCTURE_WORKSPACE.basePath,
			},
		];
		const parent = parentCandidates
			.filter(
				(candidate) =>
					definition.basePath === candidate.basePath ||
					definition.basePath.startsWith(`${candidate.basePath}/`),
			)
			.sort(
				(first, second) => second.basePath.length - first.basePath.length,
			)[0];

		return {
			...navigation,
			workspace: {
				kind: "resource",
				id: `resource:${resource.kind}:${resource.id}`,
				label: section.label ?? definition.label,
				basePath: definition.basePath,
				parent: parent
					? {
							id: parent.id,
							label: parent.label,
							href: organizationPath(opts.organizationId, parent.basePath),
						}
					: undefined,
			},
			contextual: [section],
		};
	}

	if (startsWithSegments(segments, [INFRASTRUCTURE_WORKSPACE.basePath])) {
		return {
			...navigation,
			workspace: {
				kind: "infrastructure",
				id: INFRASTRUCTURE_WORKSPACE.id,
				label: INFRASTRUCTURE_WORKSPACE.label,
				basePath: INFRASTRUCTURE_WORKSPACE.basePath,
			},
			contextual: INFRASTRUCTURE_WORKSPACE.sections.map((section) =>
				buildWorkspaceSection(opts.organizationId, section),
			),
		};
	}

	const domain = [...DOMAIN_WORKSPACES]
		.filter((candidate) =>
			startsWithSegments(segments, candidate.basePath.split("/")),
		)
		.sort((first, second) => second.basePath.length - first.basePath.length)[0];

	if (domain) {
		return {
			...navigation,
			workspace: {
				kind: "domain",
				id: `domain:${domain.id}`,
				label: domain.label,
				basePath: domain.basePath,
			},
			contextual: domain.sections.map((section) =>
				buildWorkspaceSection(opts.organizationId, section),
			),
		};
	}

	return {
		...navigation,
		workspace: GLOBAL_WORKSPACE,
		contextual: [],
	};
}
