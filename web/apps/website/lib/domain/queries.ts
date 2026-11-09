import type { Metadata } from "next";
import { catalogue } from "./catalogue";
import type {
	Availability,
	CommercialStatus,
	Product,
	ProductFamily,
	Provider,
	Region,
} from "./schema";

/**
 * Read-only access layer for the catalogue.
 *
 * Pages must import from here rather than reaching into `catalogue` directly,
 * so the data source can move behind a public API without touching templates.
 */

export const SITE_URL = "https://zenthcloud.com";
export const SITE_NAME = "ZenthCloud";

export const FAMILIES: Record<
	ProductFamily,
	{ name: string; description: string; route: string | null }
> = {
	compute: {
		name: "Compute",
		description:
			"Virtual machines, dedicated servers, GPU capacity and private estates.",
		route: "/products/public-cloud/compute",
	},
	storage: {
		name: "Storage",
		description:
			"Object, block and backup storage with explicit lifecycle and retention.",
		route: "/products/public-cloud/object-storage",
	},
	networking: {
		name: "Networking",
		description:
			"Private networks, public addressing, load balancing and connectivity.",
		route: "/products/networking",
	},
	platform: {
		name: "Platform & managed services",
		description:
			"Kubernetes, managed databases and operations delegated under contract.",
		route: "/products/managed-services",
	},
	web: {
		name: "Web & hosting",
		description:
			"Hosting, domains and mailboxes for sites and small applications.",
		route: "/products/web-hosting",
	},
	security: {
		name: "Security & reliability",
		description:
			"Protection, certificates, monitoring and recovery capabilities.",
		route: "/products/security",
	},
};

export const FAMILY_ORDER: ProductFamily[] = [
	"compute",
	"storage",
	"networking",
	"platform",
	"web",
	"security",
];

export const COMMERCIAL_STATUS_META: Record<
	CommercialStatus,
	{ label: string; description: string; tone: "positive" | "neutral" | "info" | "muted" }
> = {
	available: {
		label: "Available",
		description: "Can be ordered and provisioned in this region.",
		tone: "positive",
	},
	coming_soon: {
		label: "Coming soon",
		description: "Designed and announced, not yet open for orders.",
		tone: "neutral",
	},
	contact_sales: {
		label: "Contact sales",
		description: "Offered through a scoped commercial agreement.",
		tone: "info",
	},
	partner_service: {
		label: "Partner service",
		description: "Delivered on external infrastructure integrated into the catalogue.",
		tone: "muted",
	},
};

export function getAllProducts(): readonly Product[] {
	return catalogue.products;
}

export function getProductByRoute(route: string): Product | undefined {
	return catalogue.products.find((product) => product.route === route);
}

export function getProductById(id: string): Product | undefined {
	return catalogue.products.find((product) => product.id === id);
}

export function getProductsByFamily(family: ProductFamily): Product[] {
	return catalogue.products.filter((product) => product.family === family);
}

export function getRelatedProducts(product: Product): Product[] {
	return product.related
		.map((id) => getProductById(id))
		.filter((candidate): candidate is Product => Boolean(candidate));
}

export function getProvider(id: string): Provider | undefined {
	return catalogue.providers.find((provider) => provider.id === id);
}

export function getRegion(id: string): Region | undefined {
	return catalogue.regions.find((region) => region.id === id);
}

export function getProviders(): readonly Provider[] {
	return catalogue.providers;
}

export function getRegions(): readonly Region[] {
	return catalogue.regions;
}

export function getAvailability(product: Product): Availability[] {
	return product.availability;
}

export function getProductsForProvider(providerId: string): Product[] {
	return catalogue.products.filter((product) =>
		product.availability.some((entry) => entry.providerId === providerId),
	);
}

export function getProductsForRegion(regionId: string): Product[] {
	return catalogue.products.filter((product) =>
		product.availability.some((entry) => entry.regionId === regionId),
	);
}

export function getPlansForProduct(productId: string) {
	return catalogue.plans.filter((plan) => plan.productId === productId);
}

export function getPlansForFamily(family: ProductFamily) {
	const ids = new Set(
		catalogue.products
			.filter((product) => product.family === family)
			.map((product) => product.id),
	);
	return catalogue.plans.filter((plan) => ids.has(plan.productId));
}

export function getPlans() {
	return catalogue.plans;
}

/**
 * Aggregated commercial status for a product across regions.
 * Used for cards, where per-region detail does not fit.
 */
export function getAggregateStatus(product: Product): CommercialStatus {
	const statuses = product.availability.map((entry) => entry.commercialStatus);
	if (statuses.includes("available")) return "available";
	if (statuses.includes("partner_service")) return "partner_service";
	if (statuses.includes("contact_sales")) return "contact_sales";
	return "coming_soon";
}

/** Products share the same commercial state in every region only if all match. */
export function getUniformStatus(product: Product): CommercialStatus | null {
	const [first, ...rest] = product.availability;
	if (!first) return null;
	return rest.every((entry) => entry.commercialStatus === first.commercialStatus)
		? first.commercialStatus
		: null;
}

export function pageMetadata({
	title,
	description,
	path,
	noIndex = false,
}: {
	title: string;
	description: string;
	path: string;
	noIndex?: boolean;
}): Metadata {
	const url = `${SITE_URL}${path}`;
	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			title,
			description,
			url,
			siteName: SITE_NAME,
			locale: "en_GB",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: ["/og.png"],
		},
		...(noIndex ? { robots: { index: false, follow: false } } : {}),
	};
}

export function breadcrumbJsonLd(
	items: { name: string; path: string }[],
): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: `${SITE_URL}${item.path}`,
		})),
	};
}
