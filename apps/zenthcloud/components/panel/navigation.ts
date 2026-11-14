import type { LucideIcon } from "lucide-react";
import {
	Activity,
	Bug,
	CircleDollarSign,
	Code2,
	Cpu,
	Database,
	Gauge,
	Globe,
	History,
	House,
	Images,
	Network,
	Radio,
	Settings,
	ShieldAlert,
	ShieldCheck,
	Sparkles,
} from "lucide-react";

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
	icon: LucideIcon;
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
		icon: House,
		implemented: true,
	},
	history: {
		label: "Historique",
		path: "history",
		icon: History,
	},
	domains: {
		label: "Domaines",
		path: "domains",
		icon: Globe,
		requires: "dnsProvider.read",
	},
	observability: {
		label: "Observabilité",
		path: "observability",
		icon: Activity,
		requires: "traffic.read",
		badge: "Nouveau",
	},
	compute: {
		label: "Calcul",
		path: "compute",
		icon: Cpu,
	},
	ai: {
		label: "AI",
		path: "ai",
		icon: Sparkles,
	},
	storage: {
		label: "Stockage et bases de données",
		path: "storage",
		icon: Database,
	},
	media: {
		label: "Images & Stream",
		path: "media",
		icon: Images,
	},
	realtime: {
		label: "Realtime",
		path: "realtime",
		icon: Radio,
	},
	development: {
		label: "Développement et déploiement",
		path: "development",
		icon: Code2,
	},
	applicationSecurity: {
		label: "Sécurité des applications",
		path: "security/applications",
		icon: ShieldCheck,
	},
	zeroTrust: {
		label: "Zero Trust",
		path: "security/zero-trust",
		icon: ShieldAlert,
	},
	networks: {
		label: "Réseaux",
		path: "networks",
		icon: Network,
	},
	threats: {
		label: "Menaces & défense",
		path: "security/threats",
		icon: Bug,
	},
	monetize: {
		label: "Monétiser",
		path: "monetize",
		icon: CircleDollarSign,
		badge: "Nouveau",
	},
	delivery: {
		label: "Livraison et performance",
		path: "delivery",
		icon: Gauge,
	},
	account: {
		label: "Gérer le compte",
		path: "account",
		icon: Settings,
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

export type PanelNavigationItem = {
	id: string;
	label: string;
	/** Absolute, workspace-scoped href. Always built from the URL organization. */
	href: string;
	icon: LucideIcon;
	/** Whether the page behind `href` exists today. */
	implemented: boolean;
	/** Whether the destination will expose a contextual sub-navigation. */
	expandable: boolean;
	/** Optional pill rendered next to the label, e.g. `Nouveau`. */
	badge?: string;
	minLicense?: LicenseTier;
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

/** Whether a rendered entry is the current location. */
export function isNavigationItemActive(
	item: PanelNavigationItem,
	location: { pathname: string },
): boolean {
	const pathname = normalizePath(location.pathname);
	const href = normalizePath(item.href);
	return pathname === href || pathname.startsWith(`${href}/`);
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
	| { kind: "bucket"; id: string };

type ContextualDestination = {
	label: string;
	path: string;
	implemented?: boolean;
};

const CONTEXTUAL_DESTINATIONS: Record<
	ContextualResource["kind"],
	{ label: string; basePath: string; items: readonly ContextualDestination[] }
> = {
	domain: {
		label: "Domaine",
		basePath: "domains",
		items: [
			{ label: "Vue d'ensemble", path: "overview" },
			{ label: "DNS", path: "dns" },
			{ label: "SSL/TLS", path: "ssl" },
			{ label: "Enregistrements", path: "records" },
			{ label: "Analytics", path: "analytics" },
		],
	},
	instance: {
		label: "Instance",
		basePath: "compute",
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
		items: [
			{ label: "Vue d'ensemble", path: "overview" },
			{ label: "Objets", path: "objects" },
			{ label: "Accès", path: "access" },
			{ label: "Lifecycle", path: "lifecycle" },
			{ label: "Monitoring", path: "monitoring" },
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
	const definition = CONTEXTUAL_DESTINATIONS[opts.resource.kind];
	const base = [definition.basePath, opts.resource.id];

	return {
		id: `contextual-${opts.resource.kind}`,
		label: definition.label,
		items: definition.items.map((destination) => ({
			id: `${opts.resource.kind}.${destination.path}`,
			label: destination.label,
			href: organizationPath(
				opts.organizationId,
				[...base, destination.path].join("/"),
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

function buildContextualIcon(path: string): LucideIcon {
	switch (path) {
		case "dns":
		case "records":
			return Globe;
		case "ssl":
			return ShieldCheck;
		case "analytics":
		case "monitoring":
			return Activity;
		case "network":
			return Network;
		case "storage":
			return Database;
		case "activity":
			return History;
		case "objects":
			return Images;
		default:
			return Gauge;
	}
}
